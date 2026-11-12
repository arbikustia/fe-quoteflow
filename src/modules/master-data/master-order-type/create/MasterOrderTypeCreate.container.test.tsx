import { MemoryRouter, Route, Routes } from "react-router-dom";

import { MOCK_API_ORDER_TYPES } from "@/fixture/master-order-type";
import { fireEvent, render, screen, waitFor } from "@/libs/unit-test";
import { useCreateOrderTypeMutation, useGetOrderTypeByIdQuery, useUpdateOrderTypeMutation } from "@/services/master-order-type.service";

import MasterOrderTypeCreateContainer from "./MasterOrderTypeCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-order-type.service", () => ({
  useGetOrderTypeByIdQuery: jest.fn(),
  useCreateOrderTypeMutation: jest.fn(),
  useUpdateOrderTypeMutation: jest.fn(),
}));

const updateOrderType = jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

/**
 * Render the container on the given route.
 * @param {string} path - Initial route
 * @returns {void}
 */
const renderAt = (path: string): void => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/master-order-type" element={<p>Order type list</p>} />
        <Route path="/master-order-type/create" element={<MasterOrderTypeCreateContainer />} />
        <Route path="/master-order-type/edit/:id" element={<MasterOrderTypeCreateContainer />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("MasterOrderTypeCreateContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useGetOrderTypeByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as never);
    jest.mocked(useCreateOrderTypeMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateOrderTypeMutation).mockReturnValue([updateOrderType, { isLoading: false }] as never);
  });

  it("should render an empty create form and skip the detail query", () => {
    renderAt("/master-order-type/create");

    expect(useGetOrderTypeByIdQuery).toHaveBeenCalledWith("", { skip: true });
    expect(screen.getByRole("button", { name: "Create Order Type" })).toBeInTheDocument();
  });

  it("should load the order type by id and submit the update", async () => {
    jest.mocked(useGetOrderTypeByIdQuery).mockReturnValue({
      data: { status: true, messages: [], data: MOCK_API_ORDER_TYPES[0] },
      isLoading: false,
      isError: false,
    } as never);

    renderAt("/master-order-type/edit/order-type-1");

    await waitFor(() => expect(screen.getByDisplayValue("Delivery")).toBeInTheDocument());
    fireEvent.submit(screen.getByRole("button", { name: "Update Order Type" }));

    await waitFor(() => expect(screen.getByText("Order type list")).toBeInTheDocument());
    expect(useGetOrderTypeByIdQuery).toHaveBeenCalledWith("order-type-1", { skip: false });
    expect(updateOrderType).toHaveBeenCalledWith({ id: "order-type-1", name: "Delivery", is_handover: true, status: 1 });
  });

  it("should show the load error when the order type cannot be fetched", () => {
    jest.mocked(useGetOrderTypeByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: true } as never);

    renderAt("/master-order-type/edit/order-type-1");

    expect(screen.getByText("Unable to load order type data. Please try again.")).toBeInTheDocument();
  });
});
