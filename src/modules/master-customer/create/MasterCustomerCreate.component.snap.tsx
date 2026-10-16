import test from "@/libs/unit-test";

import { MasterCustomerCreateForm } from "./MasterCustomerCreate.component";
import type { MasterCustomerCreateFormState } from "./MasterCustomerCreate.type";

const props: MasterCustomerCreateFormState = {
  name: "PT Mega Jaya Abadi",
  address: "Jl. Sudirman No. 45, Jakarta Pusat",
  phoneNumber: "081234567890",
  isEditMode: false,
  isLoadingInitialData: false,
  isSubmitting: false,
  errorMessage: null,
  successMessage: null,
  handleNameChange: jest.fn(),
  handlePhoneNumberChange: jest.fn(),
  handleAddressChange: jest.fn(),
  handleSubmit: jest.fn(),
  goBack: jest.fn(),
};

const configs = [
  {
    props,
    desc: "should render customer create form",
  },
  {
    props: { ...props, isSubmitting: true },
    desc: "should render customer create form while submitting",
  },
];

test.assertSnapshots(MasterCustomerCreateForm, configs);
