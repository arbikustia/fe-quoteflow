import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TableComponent } from "./Table.component";
import type { TableColumn } from "./Table.type";

type TestRow = {
  readonly id: string;
  readonly name: string;
};

const rows: readonly TestRow[] = [
  { id: "row-1", name: "Audio" },
];

const columns: readonly TableColumn<TestRow>[] = [
  {
    key: "name",
    header: "Name",
    mobile: { primary: true },
  },
];

describe("TableComponent Snapshot", () => {
  it("should render responsive table", (): void => {
    const { asFragment } = render(
      <TableComponent
        data={rows}
        columns={columns}
        keyExtractor={(row): string => row.id}
        currentPage={1}
        totalPages={1}
        pageSize={5}
        totalCount={1}
        onPageChange={(): void => {}}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("should render mobile action card and desktop action column", (): void => {
    const actionColumns: readonly TableColumn<TestRow>[] = [
      ...columns,
      {
        key: "actions",
        header: "Action",
        actions: { edit: (): void => {} },
      },
    ];
    const { asFragment } = render(
      <TableComponent
        data={rows}
        columns={actionColumns}
        keyExtractor={(row): string => row.id}
        onRowClick={(): void => {}}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
