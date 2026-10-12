import { fireEvent, render, screen } from "@testing-library/react";

import { TableComponent } from "./Table.component";
import type { TableColumn } from "./Table.type";

type TestRow = {
  readonly id: string;
  readonly name: string;
};

const ROWS: readonly TestRow[] = [
  { id: "row-1", name: "Audio" },
];

const renderName = (row: TestRow): string => row.name;

const COLUMNS: readonly TableColumn<TestRow>[] = [
  {
    key: "name",
    header: "Name",
    render: renderName,
    mobile: { primary: true, render: renderName },
  },
];

describe("TableComponent", () => {
  it("should render desktop table and mobile card from one column config", (): void => {
    render(<TableComponent data={ROWS} columns={COLUMNS} keyExtractor={(row): string => row.id} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByText("Audio")).toHaveLength(2);
  });

  it("should use keyExtractor for desktop row and mobile card", (): void => {
    const { container } = render(
      <TableComponent data={ROWS} columns={COLUMNS} keyExtractor={(row): string => `key-${row.id}`} />
    );

    expect(container.querySelectorAll("tbody tr")).toHaveLength(1);
    expect(container.querySelectorAll('[role="button"]')).toHaveLength(0);
  });

  it("should isolate action click from row click", (): void => {
    const onRowClick = jest.fn();
    const onEdit = jest.fn();
    const columns: readonly TableColumn<TestRow>[] = [
      ...COLUMNS,
      { key: "actions", header: "Action", actions: { edit: onEdit } },
    ];

    render(
      <TableComponent
        data={ROWS}
        columns={columns}
        keyExtractor={(row): string => row.id}
        onRowClick={onRowClick}
      />
    );
    fireEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);

    expect(onEdit).toHaveBeenCalledWith(ROWS[0]);
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it("should handle pagination and page size changes", (): void => {
    const onPageChange = jest.fn();
    const onPageSizeChange = jest.fn();

    render(
      <TableComponent
        data={ROWS}
        columns={COLUMNS}
        keyExtractor={(row): string => row.id}
        currentPage={1}
        totalPages={2}
        pageSize={5}
        totalCount={6}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "10" } });

    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(onPageSizeChange).toHaveBeenCalledWith(10);
  });

  it("should render empty and loading states on desktop", (): void => {
    const { rerender } = render(
      <TableComponent data={[]} columns={COLUMNS} keyExtractor={(row): string => row.id} emptyText="No categories" />
    );

    expect(screen.getAllByText("No categories")).toHaveLength(2);

    rerender(
      <TableComponent data={ROWS} columns={COLUMNS} keyExtractor={(row): string => row.id} isLoading={true} />
    );

    expect(screen.getAllByText("Loading...")).toHaveLength(2);
  });

  it("should render mobile loading state when isLoading is true", (): void => {
    const { container } = render(
      <TableComponent data={[]} columns={COLUMNS} keyExtractor={(row): string => row.id} isLoading={true} />
    );

    // mobile card view shows loading
    expect(container.textContent).toContain("Loading...");
  });

  it("should trigger onRowClick on keyboard Enter key for mobile card", (): void => {
    const onRowClick = jest.fn();
    render(
      <TableComponent
        data={ROWS}
        columns={COLUMNS}
        keyExtractor={(row): string => row.id}
        onRowClick={onRowClick}
      />
    );

    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: "Enter" });

    expect(onRowClick).toHaveBeenCalledWith(ROWS[0]);
  });

  it("should trigger onRowClick on keyboard Space key for mobile card", (): void => {
    const onRowClick = jest.fn();
    render(
      <TableComponent
        data={ROWS}
        columns={COLUMNS}
        keyExtractor={(row): string => row.id}
        onRowClick={onRowClick}
      />
    );

    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: " " });

    expect(onRowClick).toHaveBeenCalledWith(ROWS[0]);
  });

  it("should not trigger onRowClick on other keys for mobile card", (): void => {
    const onRowClick = jest.fn();
    render(
      <TableComponent
        data={ROWS}
        columns={COLUMNS}
        keyExtractor={(row): string => row.id}
        onRowClick={onRowClick}
      />
    );

    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: "Tab" });

    expect(onRowClick).not.toHaveBeenCalled();
  });

  it("should render mobile action buttons when actions provided", (): void => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const columns: readonly TableColumn<TestRow>[] = [
      ...COLUMNS,
      { key: "actions", header: "Action", actions: { edit: onEdit, delete: onDelete } },
    ];

    render(
      <TableComponent
        data={ROWS}
        columns={columns}
        keyExtractor={(row): string => row.id}
        onRowClick={jest.fn()}
      />
    );

    expect(screen.getAllByRole("button", { name: "Edit" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Delete" })).toHaveLength(2);
  });
});
