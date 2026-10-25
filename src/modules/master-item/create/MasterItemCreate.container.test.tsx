import { render, screen } from "@/libs/unit-test";

import MasterItemCreateContainer from "./MasterItemCreate.container";
import { useMasterItemCreateForm } from "./MasterItemCreate.hook";
import type { MasterItemCreateFormState } from "./MasterItemCreate.type";

jest.mock("./MasterItemCreate.hook", () => ({ useMasterItemCreateForm: jest.fn() }));
jest.mock("@/app/layout", () => ({ __esModule: true, default: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
jest.mock("./MasterItemCreate.component", () => ({ MasterItemCreateForm: (props: MasterItemCreateFormState) => <div data-testid="item-form">{props.name}</div> }));

const formState: MasterItemCreateFormState = {
  name: "Speaker",
  categoryId: "category-1",
  price: "100000",
  stock: "2",
  image: "",
  isImageUploading: false,
  imageUploadError: null,
  duration: "1",
  remark: "",
  isActive: true,
  isEditMode: false,
  isSubmitting: false,
  isCategoryLoading: false,
  categoryError: null,
  errorMessage: null,
  successMessage: null,
  categories: [],
  handleNameChange: jest.fn(),
  handleCategoryChange: jest.fn(),
  handlePriceChange: jest.fn(),
  handleStockChange: jest.fn(),
  handleImageChange: jest.fn(),
  handleDurationChange: jest.fn(),
  handleRemarkChange: jest.fn(),
  handleStatusChange: jest.fn(),
  handleSubmit: jest.fn(),
  goBack: jest.fn(),
};

describe("MasterItemCreateContainer", (): void => {
  it("should pass form hook state to create form", (): void => {
    jest.mocked(useMasterItemCreateForm).mockReturnValue(formState);

    render(<MasterItemCreateContainer />);

    expect(screen.getByTestId("item-form")).toHaveTextContent("Speaker");
  });
});
