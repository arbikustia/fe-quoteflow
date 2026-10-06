import { MobileDashboardComponent } from './MobileDashboard.component';
import test from '../../../libs/unit-test';

const mockStatuses = [
  { 
    title: "Pending Payment", 
    bgColor: "bg-red-500", 
    iconColor: "text-white", 
    icon: null, 
    count: 5 
  }
];

/**
 * Mock Add Order
 * @returns {void} - void
 */
const mockOnAddOrder = (): void => {};

/**
 * Mock Order Report
 * @returns {void} - void
 */
const mockOnOrderReport = (): void => {};

const configs = [
  {
    props: {
      onAddOrder: mockOnAddOrder,
      onOrderReport: mockOnOrderReport,
      statuses: mockStatuses
    },
    desc: 'Should Render MobileDashboardComponent with default props'
  }
];

test.assertSnapshots(MobileDashboardComponent, configs);
