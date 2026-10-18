import {
  getRoleOptionsError,
  resolveUserDetail,
  resolveUserSubmissionError,
  sendUserMutation,
} from "./MasterUserCreate.helpers";

describe("MasterUserCreate.helpers", () => {
  describe("resolveUserDetail", () => {
    it("should return null when response status is false or missing data", () => {
      expect(resolveUserDetail(undefined)).toBeNull();
      expect(resolveUserDetail({ status: false, messages: null, data: [] })).toBeNull();
      expect(resolveUserDetail({ status: true, messages: null, data: [] })).toBeNull();
    });

    it("should resolve single user when response data is an array", () => {
      const response = {
        status: true,
        messages: null,
        data: [
          {
            id: "user-1",
            username: "john_doe",
            email: "john@example.com",
            password: null,
            role: "Admin",
            status: 1,
            last_created: "2026-01-01",
          },
        ],
      };

      const result = resolveUserDetail(response);

      expect(result).not.toBeNull();
      expect(result?.username).toBe("john_doe");
      expect(result?.status).toBe("active");
    });
  });

  describe("getRoleOptionsError", () => {
    it("should return loading error when request fails", () => {
      expect(getRoleOptionsError(true, undefined)).toBe("Unable to load roles.");
    });

    it("should return failure error when status is false", () => {
      expect(getRoleOptionsError(false, false)).toBe("Role request failed.");
    });

    it("should return null when success", () => {
      expect(getRoleOptionsError(false, true)).toBeNull();
    });
  });

  describe("sendUserMutation", () => {
    const mockCreate = jest.fn();
    const mockUpdate = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should trigger createUser when not edit mode", async () => {
      mockCreate.mockReturnValue({
        unwrap: () => Promise.resolve({ status: true }),
      });

      await sendUserMutation(
        {
          id: undefined,
          isEditMode: false,
          username: "alice",
          email: "alice@test.com",
          password: "secretpassword",
          role: "Editor",
          isActive: true,
        },
        mockCreate,
        mockUpdate,
      );

      expect(mockCreate).toHaveBeenCalledWith({
        username: "alice",
        email: "alice@test.com",
        password: "secretpassword",
        role: ["Editor"],
        status: 1,
      });
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("should trigger updateUser when edit mode with id", async () => {
      mockUpdate.mockReturnValue({
        unwrap: () => Promise.resolve({ status: true }),
      });

      await sendUserMutation(
        {
          id: "u-99",
          isEditMode: true,
          username: "bob",
          email: "bob@test.com",
          password: "",
          role: "Viewer",
          isActive: false,
        },
        mockCreate,
        mockUpdate,
      );

      expect(mockUpdate).toHaveBeenCalledWith({
        id: "u-99",
        username: "bob",
        email: "bob@test.com",
        role: ["Viewer"],
        status: 0,
      });
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe("resolveUserSubmissionError", () => {
    it("should return edit mode error message", () => {
      expect(resolveUserSubmissionError(true)).toBe("Unable to update user. Please try again.");
    });

    it("should return create mode error message", () => {
      expect(resolveUserSubmissionError(false)).toBe("Unable to create user. Please try again.");
    });
  });
});
