import { createPaginationHandlers } from "./pagination.helpers";

describe("createPaginationHandlers", () => {
  const createMockParams = (overrides = {}) => {
    const setCurrentPage = jest.fn();
    const setPageSize = jest.fn();
    const setSearchTerm = jest.fn();

    return {
      params: {
        currentPage: 2,
        totalPages: 5,
        hasNext: true,
        hasPrevious: true,
        canPaginate: true,
        setCurrentPage,
        setPageSize,
        setSearchTerm,
        ...overrides,
      },
      setCurrentPage,
      setPageSize,
      setSearchTerm,
    };
  };

  it("should navigate to clamped page on goToPage", () => {
    const { params, setCurrentPage } = createMockParams();
    const handlers = createPaginationHandlers(params);

    handlers.goToPage(3);
    expect(setCurrentPage).toHaveBeenCalledWith(3);

    handlers.goToPage(10);
    expect(setCurrentPage).toHaveBeenCalledWith(5);

    handlers.goToPage(0);
    expect(setCurrentPage).toHaveBeenCalledWith(1);
  });

  it("should advance page on nextPage when allowed", () => {
    const { params, setCurrentPage } = createMockParams();
    const handlers = createPaginationHandlers(params);

    handlers.nextPage();
    expect(setCurrentPage).toHaveBeenCalledWith(3);
  });

  it("should not advance page on nextPage when hasNext is false", () => {
    const { params, setCurrentPage } = createMockParams({ hasNext: false });
    const handlers = createPaginationHandlers(params);

    handlers.nextPage();
    expect(setCurrentPage).not.toHaveBeenCalled();
  });

  it("should decrement page on prevPage when allowed", () => {
    const { params, setCurrentPage } = createMockParams();
    const handlers = createPaginationHandlers(params);

    handlers.prevPage();
    expect(setCurrentPage).toHaveBeenCalledWith(1);
  });

  it("should not decrement page on prevPage when hasPrevious is false", () => {
    const { params, setCurrentPage } = createMockParams({ hasPrevious: false });
    const handlers = createPaginationHandlers(params);

    handlers.prevPage();
    expect(setCurrentPage).not.toHaveBeenCalled();
  });

  it("should change page size and reset current page to 1", () => {
    const { params, setCurrentPage, setPageSize } = createMockParams();
    const handlers = createPaginationHandlers(params);

    handlers.changePageSize(25);
    expect(setPageSize).toHaveBeenCalledWith(25);
    expect(setCurrentPage).toHaveBeenCalledWith(1);
  });

  it("should update search term and reset current page to 1", () => {
    const { params, setCurrentPage, setSearchTerm } = createMockParams();
    const handlers = createPaginationHandlers(params);

    handlers.handleSearchTerm("test query");
    expect(setSearchTerm).toHaveBeenCalledWith("test query");
    expect(setCurrentPage).toHaveBeenCalledWith(1);
  });
});
