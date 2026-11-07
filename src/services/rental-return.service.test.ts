import ENDPOINT from "@/constants/endpoint.constant";

import { rentalReturnService } from "./rental-return.service";

describe("rentalReturnService", () => {
  it("should have getRentalReturnsPaged endpoint configured", () => {
    expect(rentalReturnService.endpoints.getRentalReturnsPaged).toBeDefined();
  });

  it("should configure query parameters for pageNumber, pageSize, and searchTerm", () => {
    const endpoint = rentalReturnService.endpoints.getRentalReturnsPaged;
    const queryResult = endpoint.initiate({ pageNumber: 1, pageSize: 10, searchTerm: "test" });

    expect(ENDPOINT.RENTAL_RETURN.PAGED).toBe("/api/rental-return/paged");
    expect(queryResult).toBeDefined();
  });

  it("should configure getRentalReturnById, createRentalReturn, and updateRentalReturn", () => {
    expect(rentalReturnService.endpoints.getRentalReturnById).toBeDefined();
    expect(rentalReturnService.endpoints.createRentalReturn).toBeDefined();
    expect(rentalReturnService.endpoints.updateRentalReturn).toBeDefined();

    const detailResult = rentalReturnService.endpoints.getRentalReturnById.initiate("ret-1");
    expect(detailResult).toBeDefined();

    const createResult = rentalReturnService.endpoints.createRentalReturn.initiate({
      order_id: "order-1",
      status: 1,
      items: [],
    });
    expect(createResult).toBeDefined();

    const updateResult = rentalReturnService.endpoints.updateRentalReturn.initiate({
      id: "ret-1",
      body: {
        order_id: "order-1",
        status: 1,
        items: [],
      },
    });
    expect(updateResult).toBeDefined();
  });
});
