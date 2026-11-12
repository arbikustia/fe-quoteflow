import { fireEvent, render, screen } from "@/libs/unit-test";

import {
  _createEditClickHandler,
  getPicColumns,
  getPicRowKey,
  renderPicMobileCard,
} from "./MasterPic.helper";
import type { PicData } from "./MasterPic.type";

const PIC: PicData = {
  id: "pic-1",
  name: "Aurora",
 
  status: "inactive",
  createdAt: "04 November 2026 20:57",
};

describe("MasterPic helper", () => {
  it("should call edit without bubbling the click", () => {
    const onEdit = jest.fn();
    const stopPropagation = jest.fn();

    _createEditClickHandler(PIC, onEdit)({ stopPropagation } as never);

    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(PIC);
  });

  it("should build columns with the edit action when allowed", () => {
    const onEdit = jest.fn();
    const columns = getPicColumns(2, 10, true, onEdit);

    expect(columns.map((column) => column.key)).toEqual(["no", "name", "status", "createdAt", "actions"]);

    render(<div>{columns.map((column) => <div key={column.key}>{column.render?.(PIC, 0)}</div>)}</div>);

    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("Aurora")).toBeInTheDocument();
    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    expect(screen.getByText("04 November 2026 20:57")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Edit PIC Aurora" }));
    expect(onEdit).toHaveBeenCalledWith(PIC);
  });

  it("should hide the action column without edit permission", () => {
    expect(getPicColumns(1, 10, false, jest.fn()).map((column) => column.key)).not.toContain("actions");
  });

  it("should use the PIC id as the row key", () => {
    expect(getPicRowKey(PIC)).toBe("pic-1");
  });

  it("should render a mobile card that opens edit when allowed", () => {
    const onEdit = jest.fn();

    render(renderPicMobileCard({ pic: PIC, canEdit: true, onEdit }));
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("04 November 2026 20:57")).toBeInTheDocument();
    expect(onEdit).toHaveBeenCalledWith(PIC);
  });

  it("should disable the mobile card without edit permission", () => {
    render(renderPicMobileCard({ pic: PIC, canEdit: false, onEdit: jest.fn() }));

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
