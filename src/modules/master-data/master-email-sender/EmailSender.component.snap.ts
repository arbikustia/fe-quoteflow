import * as React from "react";

import test from "@/libs/unit-test";

import { EmailSenderComponent } from "./EmailSender.component";
import type { EmailSender, EmailSenderListState } from "./EmailSender.type";

jest.mock("./EmailSender.hook", () => ({ useEmailSender: jest.fn() }));

jest.mock("@/app/layout", () => ({
  __esModule: true,
  /**
   * Render a plain wrapper around children.
   *
   * @param {React.PropsWithChildren} props - Layout props
   * @returns {React.ReactElement} Wrapper element
   */
  default: (props: React.PropsWithChildren): React.ReactElement =>
    React.createElement("div", {}, props.children),
}));

jest.mock("@/app/shared/PageLayout", () => ({
  /**
   * Render a plain wrapper around page children.
   *
   * @param {React.PropsWithChildren} props - Page layout props
   * @returns {React.ReactElement} Wrapper element
   */
  PageLayout: (props: React.PropsWithChildren): React.ReactElement =>
    React.createElement("section", {}, props.children),
}));

jest.mock("@/components/Pagination", () => ({
  Pagination: jest.fn((): null => null),
}));

jest.mock("@/components/SearchFilter", () => ({
  SearchFilter: jest.fn((): null => null),
}));

jest.mock("@/components/Table", () => ({
  __esModule: true,
  default: jest.fn((): null => null),
}));

const mockSender: EmailSender = {
  id: "sender-1",
  name: "Finance Sender",
  email: "finance@company.com",
  smtp_host: "smtp.gmail.com",
  smtp_port: 587,
  smtp_username: "finance",
  enable_ssl: true,
  is_default: true,
  status: 1,
  created_at: "2024-01-01T08:00:00+07:00",
  updated_at: "2024-01-02T08:00:00+07:00",
};

const baseState: EmailSenderListState = {
  rows: [mockSender],
  loading: false,
  page: 1,
  totalPages: 1,
  totalCount: 1,
  successMessage: null,
  setSearch: jest.fn(),
  setPage: jest.fn(),
  create: jest.fn(),
  edit: jest.fn(),
  back: jest.fn(),
};

/**
 * Stub the list hook with the given state.
 *
 * @param {EmailSenderListState} state - List state to return
 * @returns {void} No return value
 */
const stubState = (state: EmailSenderListState): void => {
  jest.mocked(jest.requireMock("./EmailSender.hook").useEmailSender).mockReturnValue(state);
};

it("should match snapshot with sender rows", () => {
  stubState(baseState);

  test.assertSnapshots(EmailSenderComponent, [{ props: {}, desc: "Should Render EmailSenderComponent with rows" }]);
});

it("should match snapshot with empty rows", () => {
  stubState({ ...baseState, rows: [], totalCount: 0, totalPages: 0 });

  test.assertSnapshots(EmailSenderComponent, [{ props: {}, desc: "Should Render EmailSenderComponent with empty rows" }]);
});

it("should match snapshot while loading", () => {
  stubState({ ...baseState, rows: [], loading: true });

  test.assertSnapshots(EmailSenderComponent, [{ props: {}, desc: "Should Render EmailSenderComponent while loading" }]);
});
