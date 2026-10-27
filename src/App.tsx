import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ActivityLogPage from "./app/activity-log";
import Login from "./app/auth/login-page";
import Dashboard from "./app/dashboard";
import DocumentMain from "./app/document/DocumentMain";
import InvoicePage from "./app/document/invoice";
import InvoiceDetailPage from "./app/document/invoice/detail";
import InvoiceStatusPage from "./app/document/invoice/status";
import ItemChecklistPage from "./app/document/item-checklist";
import PaymentPage from "./app/document/payment";
import PaymentCreatePage from "./app/document/payment/create";
import PaymentStatusPage from "./app/document/payment/status";
import QuotationPage from "./app/document/quotation";
import QuotationDetailPage from "./app/document/quotation/detail";
import QuotationStatusPage from "./app/document/quotation/status";
import MasterCategory from "./app/master-category";
import MasterCategoryCreate from "./app/master-category/create";
import MasterCustomer from "./app/master-customer";
import MasterCustomerCreate from "./app/master-customer/create";
import MasterItem from "./app/master-item";
import MasterItemCreate from "./app/master-item/create";
import MasterMain from "./app/master-main";
import MasterPaymentMethod from "./app/master-payment-method";
import MasterPaymentMethodCreate from "./app/master-payment-method/create";
import MasterPaymentType from "./app/master-payment-type";
import MasterPaymentTypeCreate from "./app/master-payment-type/create";
import MasterPIC from "./app/master-pic";
import MasterPICCreate from "./app/master-pic/create";
import MasterProject from "./app/master-project";
import MasterProjectCreate from "./app/master-project/create";
import MasterProjectDetail from "./app/master-project/detail";
import MasterRole from "./app/master-role";
import MasterRoleCreate from "./app/master-role/create";
import MasterServiceType from "./app/master-service-type";
import MasterServiceTypeCreate from "./app/master-service-type/create";
import MasterServiceTypeDetail from "./app/master-service-type/detail";
import MasterUser from "./app/master-user";
import MasterUserCreate from "./app/master-user/create";
import MasterVoucher from "./app/master-voucher";
import MasterVoucherCreate from "./app/master-voucher/create";
import OrderPage from "./app/order";
import OrderPageCreate from "./app/order/create";
import OrderPageDetail from "./app/order/detail";
import Preview from "./app/preview";
import Report from "./app/report";
import ReportDetail from "./app/report/detail";
import ReportMain from "./app/report/main";
import Return from "./app/return";
import ReturnPageDetail from "./app/return/detail";

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/activity-log" element={<ActivityLogPage />} />
        <Route path="/master-main" element={<MasterMain />} />
        
        {/* Customer */}
        <Route path="/master-customer" element={<MasterCustomer />} />
        <Route path="/master-customer/create" element={<MasterCustomerCreate />} />
        <Route path="/master-customer/edit/:id" element={<MasterCustomerCreate />} />
        
        {/* Item */}
        <Route path="/master-item" element={<MasterItem />} />
        <Route path="/master-item/create" element={<MasterItemCreate />} />
        <Route path="/master-item/edit/:id" element={<MasterItemCreate />} />

        {/* Category */}
        <Route path="/master-category" element={<MasterCategory />} />
        <Route path="/master-category/create" element={<MasterCategoryCreate />} />
        <Route path="/master-category/edit/:id" element={<MasterCategoryCreate />} />

        {/* Role */}
        <Route path="/master-role" element={<MasterRole />} />
        <Route path="/master-role/create" element={<MasterRoleCreate />} />
        <Route path="/master-role/edit/:id" element={<MasterRoleCreate />} />

        {/* Voucher */}
        <Route path="/master-voucher" element={<MasterVoucher />} />
        <Route path="/master-voucher/create" element={<MasterVoucherCreate />} />
        <Route path="/master-voucher/edit/:id" element={<MasterVoucherCreate />} />

        {/* Project */}
        <Route path="/master-project" element={<MasterProject />} />
        <Route path="/master-project/create" element={<MasterProjectCreate />} />
        <Route path="/master-project/edit/:id" element={<MasterProjectCreate />} />
        <Route path="/master-project/detail/:id" element={<MasterProjectDetail />} />

        {/* Service Type */}
        <Route path="/master-service-type" element={<MasterServiceType />} />
        <Route path="/master-service-type/create" element={<MasterServiceTypeCreate />} />
        <Route path="/master-service-type/edit/:id" element={<MasterServiceTypeCreate />} />
        <Route path="/master-service-type/detail/:id" element={<MasterServiceTypeDetail />} />

        {/* Payment Method */}
        <Route path="/master-payment-method" element={<MasterPaymentMethod />} />
        <Route path="/master-payment-method/create" element={<MasterPaymentMethodCreate />} />
        <Route path="/master-payment-method/edit/:id" element={<MasterPaymentMethodCreate />} />

        {/* Payment Type */}
        <Route path="/master-payment-type" element={<MasterPaymentType />} />
        <Route path="/master-payment-type/create" element={<MasterPaymentTypeCreate />} />
        <Route path="/master-payment-type/edit/:id" element={<MasterPaymentTypeCreate />} />

        {/* PIC */}
        <Route path="/master-pic" element={<MasterPIC />} />
        <Route path="/master-pic/create" element={<MasterPICCreate />} />
        <Route path="/master-pic/edit/:id" element={<MasterPICCreate />} />

        {/* User */}
        <Route path="/master-user" element={<MasterUser />} />
        <Route path="/master-user/create" element={<MasterUserCreate />} />
        <Route path="/master-user/edit/:id" element={<MasterUserCreate />} />

        {/* Documents */}
        <Route path="/document" element={<DocumentMain />} />
        <Route path="/document/quotation" element={<QuotationPage />} />
        <Route path="/document/quotation/:id" element={<QuotationDetailPage />} />
        <Route path="/document/quotation/:id/status" element={<QuotationStatusPage />} />
        <Route path="/document/invoice" element={<InvoicePage />} />
        <Route path="/document/invoice/:id" element={<InvoiceDetailPage />} />
        <Route path="/document/invoice/:id/status" element={<InvoiceStatusPage />} />
        <Route path="/document/item-checklist" element={<ItemChecklistPage />} />
        <Route path="/document/payment" element={<PaymentPage />} />
        <Route path="/document/payment/create" element={<PaymentCreatePage />} />
        <Route path="/document/payment/:id/edit" element={<PaymentCreatePage />} />
        <Route path="/document/payment/:id/status" element={<PaymentStatusPage />} />

        {/* Orders & Reports */}
        <Route path="/order" element={<OrderPage />} />
        <Route path="/order/create" element={<OrderPageCreate />} />
        <Route path="/order/edit/:id" element={<OrderPageCreate />} />
        <Route path="/order/detail/:id" element={<OrderPageDetail />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/report/main" element={<ReportMain />} />
        <Route path="/report" element={<Report />} />
        <Route path="/report/detail/:id" element={<ReportDetail />} />
        <Route path="/return" element={<Return />} />
        <Route path="/return/detail/:id" element={<ReturnPageDetail />} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
