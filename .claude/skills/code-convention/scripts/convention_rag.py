#!/usr/bin/env python3
"""Retrieval (RAG) over FE_Code_Convention_React.md.

Splits the convention document into heading-scoped chunks (code blocks are
never split), ranks them with BM25, and prints the most relevant chunks with
their section path and source line range so an agent can cite them.

Pure standard library: no install step required.

Usage:
    convention_rag.py query "where do useState and useEffect go" [-k 4] [--json]
    convention_rag.py section 4.2          # print one section in full
    convention_rag.py list                 # list all sections

The document path is resolved in this order:
    1. --doc PATH
    2. $CODE_CONVENTION_DOC
    3. FE_Code_Convention_React.md found by walking up from the current
       directory and from this script's directory
"""

from __future__ import annotations

import argparse
import json
import math
import os
import re
import sys
from collections import Counter
from dataclasses import asdict, dataclass, field
from pathlib import Path

DOC_FILE_NAME = "FE_Code_Convention_React.md"
DOC_ENV_VAR = "CODE_CONVENTION_DOC"

BM25_K1 = 1.5
BM25_B = 0.75
HEADING_WEIGHT = 3  # heading tokens count this many times toward a chunk's score
MAX_CHUNK_LINES = 60  # prose (never code blocks) is split past this size

HEADING_PATTERN = re.compile(r"^(#{1,6})\s+(.*?)\s*$")
FENCE_PATTERN = re.compile(r"^\s*```")
TOKEN_PATTERN = re.compile(r"[a-z0-9_@./-]+")
SECTION_NUMBER_PATTERN = re.compile(r"^(\d+(?:\.\d+)*)\b")

STOPWORDS = frozenset(
    """a an and are as at be by do does for from how i in into is it its of on
    or should so that the this to was what when where which who why will with
    you your can must not no yang dan di ke dari untuk apa bagaimana dimana
    ini itu atau dengan pada harus boleh tidak""".split()
)

# Query expansion: Indonesian terms and common aliases -> vocabulary used in the doc.
QUERY_SYNONYMS = {
    "tipe": ["type", "typing"],
    "typescript": ["type", "typing"],
    "interface": ["type", "typing", "pascalcase"],
    "any": ["forbidden", "typing"],
    "uji": ["test", "testing"],
    "pengujian": ["test", "testing"],
    "tes": ["test", "testing"],
    "testing": ["test", "jest", "unit-test"],
    "snapshot": ["snap", "assertsnapshots"],
    "coverage": ["70", "threshold"],
    "komponen": ["component"],
    "kontainer": ["container"],
    "state": ["usestate", "hook"],
    "usestate": ["hook", "hooks", "state"],
    "useeffect": ["hook", "hooks", "effect"],
    "effect": ["useeffect", "hook"],
    "hooks": ["hook", "usestate", "useeffect"],
    "nama": ["naming", "name"],
    "penamaan": ["naming", "name"],
    "naming": ["camelcase", "prefix"],
    "variabel": ["variable", "naming"],
    "fungsi": ["function"],
    "konstanta": ["constant", "upper_snake_case"],
    "constant": ["upper_snake_case", "config"],
    "boolean": ["is", "has", "can", "should"],
    "array": ["plural"],
    "api": ["rtk", "query", "apiclient", "fetch"],
    "fetch": ["api", "rtk", "query"],
    "axios": ["apiclient", "api"],
    "redux": ["rtk", "container"],
    "fallback": ["default", "upstream", "lodash", "zod"],
    "default": ["fallback"],
    "zod": ["schema", "infer"],
    "skema": ["schema", "zod"],
    "schema": ["zod"],
    "jsdoc": ["@param", "@returns"],
    "komentar": ["jsdoc", "comment"],
    "dokumentasi": ["jsdoc", "docs"],
    "format": ["formatting", "semicolons", "blank"],
    "formatting": ["semicolons", "blank", "braces"],
    "titik": ["semicolons"],
    "semicolon": ["semicolons"],
    "branch": ["git", "naming"],
    "cabang": ["branch", "git"],
    "commit": ["git", "message"],
    "pr": ["pull", "request", "template"],
    "struktur": ["structure", "module"],
    "folder": ["structure", "module"],
    "modul": ["module", "structure"],
    "file": ["structure", "responsibility"],
    "style": ["styling", "css"],
    "css": ["style", "styling"],
    "helper": ["helper.tsx", "render"],
    "util": ["util.ts", "pure"],
    "utils": ["util", "shared"],
    "shared": ["@/libs/utils", "@/hooks", "common.type"],
    "global": ["shared"],
    "wrapper": ["suspense", "composition"],
    "suspense": ["wrapper"],
    "handler": ["handle", "onclick", "event"],
    "event": ["handler", "onclick"],
    "onclick": ["handler", "event"],
    "switch": ["never", "exhaustive"],
    "if": ["guard", "early", "return"],
    "nested": ["guard", "early"],
    "lookup": ["record"],
    "record": ["lookup", "bounded"],
    "private": ["_", "prefix"],
    "underscore": ["_", "private"],
    "eslint": ["enforcement", "lint"],
    "lint": ["eslint"],
    "merge": ["enforcement", "pull"],
}


@dataclass
class Chunk:
    """One retrievable unit of the convention document."""

    chunk_id: int
    section: str
    heading_path: list[str]
    start_line: int
    end_line: int
    text: str
    tokens: list[str] = field(default_factory=list, repr=False)


def tokenize(text: str) -> list[str]:
    """Lowercase, split into word-ish tokens, drop stopwords, add sub-tokens."""
    tokens: list[str] = []
    for raw in TOKEN_PATTERN.findall(text.lower()):
        raw = raw.strip("./-")
        if not raw or raw in STOPWORDS:
            continue
        tokens.append(raw)
        # "ModuleName.hook.ts" -> also "modulename", "hook", "ts"
        parts = [p for p in re.split(r"[./@-]+", raw) if p and p not in STOPWORDS]
        if len(parts) > 1:
            tokens.extend(parts)
    return tokens


def expand_query(tokens: list[str]) -> list[str]:
    """Append synonyms so Indonesian / alias terms still hit English sections."""
    expanded = list(tokens)
    for token in tokens:
        for synonym in QUERY_SYNONYMS.get(token, []):
            expanded.extend(tokenize(synonym))
    return expanded


def resolve_doc_path(cli_path: str | None) -> Path:
    """Find the convention document (see module docstring for the order)."""
    candidates: list[Path] = []
    if cli_path:
        candidates.append(Path(cli_path).expanduser())
    env_path = os.environ.get(DOC_ENV_VAR)
    if env_path:
        candidates.append(Path(env_path).expanduser())
    for start in (Path.cwd(), Path(__file__).resolve().parent):
        for directory in (start, *start.parents):
            candidates.append(directory / DOC_FILE_NAME)

    for candidate in candidates:
        if candidate.is_file():
            return candidate.resolve()

    sys.exit(
        f"error: {DOC_FILE_NAME} not found. Pass --doc PATH or set ${DOC_ENV_VAR}."
    )


def _section_number(heading_path: list[str]) -> str:
    """Return the deepest numbered heading in the path (e.g. '4.2'), or ''."""
    for heading in reversed(heading_path):
        match = SECTION_NUMBER_PATTERN.match(heading)
        if match:
            return match.group(1)
    return ""


def chunk_document(lines: list[str]) -> list[Chunk]:
    """Split markdown into heading-scoped chunks, keeping code fences intact."""
    chunks: list[Chunk] = []
    heading_stack: list[tuple[int, str]] = []
    buffer: list[str] = []
    buffer_start = 1
    in_fence = False

    def flush(end_line: int) -> None:
        nonlocal buffer
        body = "\n".join(buffer).strip()
        if body:
            heading_path = [title for _, title in heading_stack]
            chunks.append(
                Chunk(
                    chunk_id=len(chunks),
                    section=_section_number(heading_path),
                    heading_path=heading_path,
                    start_line=buffer_start,
                    end_line=end_line,
                    text=body,
                )
            )
        buffer = []

    for line_number, line in enumerate(lines, start=1):
        if FENCE_PATTERN.match(line):
            in_fence = not in_fence

        heading = None if in_fence else HEADING_PATTERN.match(line)
        if heading:
            flush(line_number - 1)
            level = len(heading.group(1))
            title = heading.group(2).strip()
            while heading_stack and heading_stack[-1][0] >= level:
                heading_stack.pop()
            heading_stack.append((level, title))
            buffer_start = line_number
            buffer.append(line)
            continue

        # Split long prose at a blank line, never inside a code block.
        if (
            not in_fence
            and not line.strip()
            and len(buffer) >= MAX_CHUNK_LINES
        ):
            flush(line_number - 1)
            buffer_start = line_number + 1
            continue

        if not buffer:
            buffer_start = line_number
        buffer.append(line)

    flush(len(lines))

    for chunk in chunks:
        heading_tokens = tokenize(" ".join(chunk.heading_path)) * HEADING_WEIGHT
        chunk.tokens = heading_tokens + tokenize(chunk.text)
    return chunks


class Bm25Index:
    """Minimal Okapi BM25 ranking over chunks."""

    def __init__(self, chunks: list[Chunk]) -> None:
        self.chunks = chunks
        self.term_counts = [Counter(chunk.tokens) for chunk in chunks]
        self.lengths = [len(chunk.tokens) for chunk in chunks]
        self.average_length = sum(self.lengths) / max(len(chunks), 1)
        document_frequency: Counter[str] = Counter()
        for counts in self.term_counts:
            document_frequency.update(counts.keys())
        total = len(chunks)
        self.idf = {
            term: math.log(1 + (total - freq + 0.5) / (freq + 0.5))
            for term, freq in document_frequency.items()
        }

    def search(self, query: str, top_k: int) -> list[tuple[Chunk, float]]:
        """Return the top_k chunks for the query, highest score first."""
        query_terms = expand_query(tokenize(query))
        if not query_terms:
            return []
        query_weights = Counter(query_terms)
        scored: list[tuple[Chunk, float]] = []
        for chunk, counts, length in zip(self.chunks, self.term_counts, self.lengths):
            score = 0.0
            for term, weight in query_weights.items():
                frequency = counts.get(term)
                if not frequency:
                    continue
                normalizer = BM25_K1 * (1 - BM25_B + BM25_B * length / self.average_length)
                score += (
                    self.idf[term]
                    * weight
                    * frequency
                    * (BM25_K1 + 1)
                    / (frequency + normalizer)
                )
            if score > 0:
                scored.append((chunk, score))
        scored.sort(key=lambda pair: pair[1], reverse=True)
        return scored[:top_k]


def _format_location(doc_path: Path, chunk: Chunk) -> str:
    section = f"Section {chunk.section}" if chunk.section else "Preamble"
    path = " > ".join(chunk.heading_path) or "(document start)"
    return f"{section} | {path} | {doc_path.name}:{chunk.start_line}-{chunk.end_line}"


def command_query(index: Bm25Index, doc_path: Path, args: argparse.Namespace) -> int:
    results = index.search(" ".join(args.text), args.k)
    if args.json:
        payload = [
            {
                **{key: value for key, value in asdict(chunk).items() if key != "tokens"},
                "score": round(score, 4),
                "doc": str(doc_path),
            }
            for chunk, score in results
        ]
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return 0
    if not results:
        print("No matching rules. Try other keywords or `list` to browse sections.")
        return 1
    for rank, (chunk, score) in enumerate(results, start=1):
        print(f"=== [{rank}] score={score:.2f} | {_format_location(doc_path, chunk)}")
        print(chunk.text)
        print()
    return 0


def command_section(chunks: list[Chunk], doc_path: Path, args: argparse.Namespace) -> int:
    wanted = args.number.strip().rstrip(".")
    matched = [
        chunk
        for chunk in chunks
        if chunk.section == wanted or chunk.section.startswith(wanted + ".")
    ]
    if not matched:
        print(f"Section {wanted} not found. Use `list` to see available sections.")
        return 1
    if args.json:
        print(json.dumps(
            [{k: v for k, v in asdict(c).items() if k != "tokens"} for c in matched],
            ensure_ascii=False,
            indent=2,
        ))
        return 0
    print(f"=== Section {wanted} | {doc_path.name}:{matched[0].start_line}-{matched[-1].end_line}")
    print("\n\n".join(chunk.text for chunk in matched))
    return 0


def command_list(lines: list[str], doc_path: Path) -> int:
    in_fence = False
    print(f"Sections in {doc_path}:")
    for line_number, line in enumerate(lines, start=1):
        if FENCE_PATTERN.match(line):
            in_fence = not in_fence
            continue
        heading = None if in_fence else HEADING_PATTERN.match(line)
        if heading and len(heading.group(1)) in (2, 3):
            indent = "  " * (len(heading.group(1)) - 2)
            print(f"{line_number:>5}  {indent}{heading.group(2).strip()}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Retrieve rules from FE_Code_Convention_React.md (BM25 RAG)."
    )
    parser.add_argument("--doc", help=f"path to {DOC_FILE_NAME}")
    sub = parser.add_subparsers(dest="command", required=True)

    query = sub.add_parser("query", help="search rules relevant to a question")
    query.add_argument("text", nargs="+", help="question or keywords")
    query.add_argument("-k", type=int, default=4, help="number of chunks (default 4)")
    query.add_argument("--json", action="store_true", help="JSON output")

    section = sub.add_parser("section", help="print a numbered section, e.g. 4.2")
    section.add_argument("number")
    section.add_argument("--json", action="store_true", help="JSON output")

    sub.add_parser("list", help="list all sections with line numbers")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    doc_path = resolve_doc_path(args.doc)
    lines = doc_path.read_text(encoding="utf-8").splitlines()

    if args.command == "list":
        return command_list(lines, doc_path)

    chunks = chunk_document(lines)
    if args.command == "section":
        return command_section(chunks, doc_path, args)
    return command_query(Bm25Index(chunks), doc_path, args)


if __name__ == "__main__":
    sys.exit(main())
