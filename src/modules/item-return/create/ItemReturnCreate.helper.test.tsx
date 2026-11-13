import { mockSelectedFormProps } from "@/fixture/item-return-create";
import { fireEvent, render, screen } from "@/libs/unit-test";

import {
  createCaptureChangeHandler,
  createNotesChangeHandler,
  createPhotoRemoveHandler,
  createRowClickHandler,
  createSaveClickHandler,
  createTextChangeHandler,
  getCaptureLabel,
  getColumns,
  renderActions,
  renderCapture,
  renderMobileItem,
  renderRemarkCell,
  renderViewPhotoButton,
} from "./ItemReturnCreate.helper";

const row = mockSelectedFormProps.orderItems[0];

describe("ItemReturnCreate helper", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should pick the capture label", () => {
    expect(getCaptureLabel(false, true)).toBe("Uploading…");
    expect(getCaptureLabel(true, false)).toBe("Add more photos");
    expect(getCaptureLabel(false, false)).toBe("Add photos");
  });

  it("should forward captured files and reset the input", () => {
    const onCapture = jest.fn();
    const file = new File(["x"], "x.jpg", { type: "image/jpeg" });
    const target = { files: [file], value: "x" };

    createCaptureChangeHandler("r1", onCapture)({ target } as never);
    expect(onCapture).toHaveBeenCalledWith("r1", [file]);
    expect(target.value).toBe("");
    createCaptureChangeHandler("r1", onCapture)({ target: { files: null, value: "" } } as never);
    expect(onCapture).toHaveBeenCalledTimes(1);
  });

  it("should bind row ids to handlers", () => {
    const rowHandler = jest.fn();
    const removeHandler = jest.fn();
    const notesHandler = jest.fn();
    const textHandler = jest.fn();
    const save = jest.fn().mockResolvedValue(undefined);

    createRowClickHandler(rowHandler, "r1")();
    createPhotoRemoveHandler(removeHandler, "r1", 2)();
    createNotesChangeHandler(notesHandler, "r1")({ target: { value: "n" } } as never);
    createTextChangeHandler(textHandler)({ target: { value: "t" } } as never);
    createSaveClickHandler(save)();
    expect(rowHandler).toHaveBeenCalledWith("r1");
    expect(removeHandler).toHaveBeenCalledWith("r1", 2);
    expect(notesHandler).toHaveBeenCalledWith("r1", "n");
    expect(textHandler).toHaveBeenCalledWith("t");
    expect(save).toHaveBeenCalled();
  });

  it("should render nothing when the row has no photos", () => {
    expect(renderViewPhotoButton(row, mockSelectedFormProps)).toBeNull();
  });

  it("should render saved and staged photos with open and remove actions", () => {
    const props = { ...mockSelectedFormProps, stagedPhotoUrls: new Map([[row.id, ["blob:staged"]]]) };

    render(<>{renderViewPhotoButton({ ...row, fileUrls: ["saved.jpg"] }, props)}</>);
    fireEvent.click(screen.getByRole("button", { name: "View photo 2" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove photo 2" }));
    expect(props.openPhoto).toHaveBeenCalledWith(row.id);
    expect(props.onRemovePhoto).toHaveBeenCalledWith(row.id, 1);
  });

  it("should render the capture cell and send captured files", () => {
    const file = new File(["x"], "x.jpg", { type: "image/jpeg" });

    render(renderCapture(row, mockSelectedFormProps));
    fireEvent.change(screen.getByLabelText(`Add photos for ${row.itemName}`), { target: { files: [file] } });
    expect(mockSelectedFormProps.onCaptureItem).toHaveBeenCalledWith(row.id, [file]);
  });

  it("should render a mobile card with an editable remark", () => {
    render(renderMobileItem(row, mockSelectedFormProps));
    fireEvent.change(screen.getByLabelText("Remark"), { target: { value: "ok" } });
    expect(screen.getByText(row.itemName)).toBeInTheDocument();
    expect(mockSelectedFormProps.onItemNotesChange).toHaveBeenCalledWith(row.id, "ok");
  });

  it("should render the remark cell", () => {
    render(renderRemarkCell(row, mockSelectedFormProps));
    fireEvent.change(screen.getByLabelText(`Remark for ${row.itemName}`), { target: { value: "fine" } });
    expect(mockSelectedFormProps.onItemNotesChange).toHaveBeenCalledWith(row.id, "fine");
  });

  it("should build five columns whose renderers return cell content", () => {
    const columns = getColumns(mockSelectedFormProps);

    expect(columns.map((column) => column.key)).toEqual(["itemName", "category", "qty", "photo", "notes"]);
    columns.forEach((column) => {
      const { unmount } = render(<div>{column.render?.(row, 0)}</div>);

      unmount();
    });
  });

  it("should render action buttons for save and update", () => {
    const { unmount } = render(renderActions(mockSelectedFormProps));

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Return" }));
    expect(mockSelectedFormProps.goBack).toHaveBeenCalled();
    expect(mockSelectedFormProps.handleSave).toHaveBeenCalled();
    unmount();
    render(renderActions({ ...mockSelectedFormProps, isEditMode: true, isSubmitting: true }));
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  });
});
