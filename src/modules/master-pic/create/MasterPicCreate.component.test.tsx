import test from "../../../libs/unit-test";
import { MasterPicCreateForm } from "./MasterPicCreate.component";
import type { MasterPicCreateState } from "./MasterPicCreate.type";

describe("MasterPicCreateForm Component", () => {
  const baseProps: MasterPicCreateState = {
    name: "John Doe",
    isActive: true,
    isEditMode: false,
    isLoadingInitialData: false,
    isSubmitting: false,
    errorMessage: null,
    errors: {},
    isSubmitted: false,
    handleNameChange: jest.fn(),
    handleStatusChange: jest.fn(),
    handleSubmit: jest.fn(async () => {}),
    goBack: jest.fn(),
  };

  test.assertSnapshots(MasterPicCreateForm, [
    {
      props: baseProps,
      desc: "create mode default",
    },
    {
      props: { ...baseProps, isEditMode: true },
      desc: "edit mode active",
    },
    {
      props: { ...baseProps, isLoadingInitialData: true },
      desc: "loading initial data",
    },
    {
      props: { ...baseProps, errorMessage: "PIC Name is required" },
      desc: "with error message",
    },
    {
      props: { ...baseProps, isSubmitting: true },
      desc: "submitting state",
    },
  ]);
});
