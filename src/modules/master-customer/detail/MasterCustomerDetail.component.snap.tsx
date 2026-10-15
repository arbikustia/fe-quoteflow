import test from "@/libs/unit-test";

import { MOCK_CUSTOMERS } from "@/fixture/master-customer";

import { MasterCustomerDetailComponent } from "./MasterCustomerDetail.component";
import type { MasterCustomerDetailState } from "./MasterCustomerDetail.type";

/**
 * Create default props for detail snapshot testing.
 * @returns {MasterCustomerDetailState} Mock detail state props
 */
const createProps = (): MasterCustomerDetailState => ({
  customer: MOCK_CUSTOMERS[0],
  isMoreOpen: false,
  isDeleteModalOpen: false,
  goBack: jest.fn(),
  toggleMore: jest.fn(),
  closeMore: jest.fn(),
  openDeleteModal: jest.fn(),
  closeDeleteModal: jest.fn(),
  goEdit: jest.fn(),
  handleDelete: jest.fn(),
});

const configs = [
  {
    props: createProps(),
    desc: "should render customer detail",
  },
  {
    props: { ...createProps(), isMoreOpen: true },
    desc: "should render customer detail actions",
  },
  {
    props: { ...createProps(), isDeleteModalOpen: true },
    desc: "should render delete confirmation",
  },
];

test.assertSnapshots(MasterCustomerDetailComponent, configs);
