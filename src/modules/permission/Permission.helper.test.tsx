import { render, screen } from "@/libs/unit-test";

import { createSearchChangeHandler, getPermissionRowKey, renderMenu, renderPage, renderPermissions, renderUrl } from "./Permission.helper";
import type { PermissionRow } from "./Permission.type";

const row: PermissionRow = { id: "r1", menu: "Document", page: "Quotation", url: "/quotation", permission: ["view", "create"] };

describe("Permission helper", () => {
  it("should render the menu, page and url cells", () => {
    render(<>{renderMenu(row)}{renderPage(row)}{renderUrl(row)}</>);

    expect(screen.getByText("Document")).toBeInTheDocument();
    expect(screen.getByText("Quotation")).toBeInTheDocument();
    expect(screen.getByText("/quotation")).toBeInTheDocument();
  });

  it("should render one badge per permission", () => {
    render(renderPermissions(row));

    expect(screen.getByText("view")).toBeInTheDocument();
    expect(screen.getByText("create")).toBeInTheDocument();
  });

  it("should key rows by id", () => {
    expect(getPermissionRowKey(row)).toBe("r1");
  });

  it("should pass the input value to the handler", () => {
    const handler = jest.fn();

    createSearchChangeHandler(handler)({ target: { value: "abc" } } as never);
    expect(handler).toHaveBeenCalledWith("abc");
  });
});
