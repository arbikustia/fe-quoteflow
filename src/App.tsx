import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ActivityLogPage from "./app/activity-log";
import Login from "./app/auth/login-page";
import CalendarPage from "./app/calendar";
import Dashboard from "./app/dashboard";
import DocumentMain from "./app/document/DocumentMain";
import InvoicePage from "./app/document/invoice";
import InvoiceDetailPage from "./app/document/invoice/detail";
import InvoiceStatusPage from "./app/document/invoice/status";
import PaymentPage from "./app/document/payment";
import PaymentCreatePage from "./app/document/payment/create";
import PaymentDetailPage from "./app/document/payment/detail";
import PaymentStatusPage from "./app/document/payment/status";
import QuotationPage from "./app/document/quotation";
import QuotationDetailPage from "./app/document/quotation/detail";
import QuotationStatusPage from "./app/document/quotation/status";
import ItemChecklistPage from "./app/item-checklist";
import ItemChecklistCreatePage from "./app/item-checklist/create";
import ItemChecklistDetailPage from "./app/item-checklist/detail";
import ItemReturnPage from "./app/item-return";
import ItemReturnCreatePage from "./app/item-return/create";
import MailPage from "./app/mail";
import MailCreatePage from "./app/mail/create";
import MasterCategory from "./app/master-category";
import MasterCategoryCreate from "./app/master-category/create";
import MasterCustomer from "./app/master-customer";
import MasterCustomerCreate from "./app/master-customer/create";
import MasterEmailSender from "./app/master-email-sender";
import MasterEmailSenderCreate from "./app/master-email-sender/create";
import MasterItem from "./app/master-item";
import MasterItemCreate from "./app/master-item/create";
import MasterMain from "./app/master-main";
import MasterOrderType from "./app/master-order-type";
import MasterOrderTypeCreate from "./app/master-order-type/create";
import MasterPaymentMethod from "./app/master-payment-method";
import MasterPaymentMethodCreate from "./app/master-payment-method/create";
import MasterPaymentType from "./app/master-payment-type";
import MasterPaymentTypeCreate from "./app/master-payment-type/create";
import MasterPIC from "./app/master-pic";
import MasterPICCreate from "./app/master-pic/create";
import MasterProject from "./app/master-project";
import MasterProjectCreate from "./app/master-project/create";
import MasterRole from "./app/master-role";
import MasterRoleCreate from "./app/master-role/create";
import MasterServiceType from "./app/master-service-type";
import MasterServiceTypeCreate from "./app/master-service-type/create";
import MasterServiceTypeDetail from "./app/master-service-type/detail";
import MasterUser from "./app/master-user";
import MasterUserCreate from "./app/master-user/create";
import MasterVoucher from "./app/master-voucher";
import MasterVoucherCreate from "./app/master-voucher/create";
import NotePage from "./app/note";
import NoteCreatePage from "./app/note/create";
import OrderPage from "./app/order";
import OrderPageCreate from "./app/order/create";
import OrderPageDetail from "./app/order/detail";
import PermissionPage from "./app/permission";
import PermissionAssignPage from "./app/permission/assign";
import Preview from "./app/preview";
import ProfilePage from "./app/profile";
import Report from "./app/report";
import ReportDetail from "./app/report/detail";
import ReportMain from "./app/report/main";

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/activity-log" element={<ActivityLogPage />} />
        <Route path="/item-checklist" element={<ItemChecklistPage />} />
        <Route path="/item-checklist/create" element={<ItemChecklistCreatePage />} />
        <Route path="/item-checklist/create/:id" element={<ItemChecklistCreatePage />} />
        <Route path="/item-checklist/:id" element={<ItemChecklistDetailPage />} />
        <Route path="/item-return" element={<ItemReturnPage />} />
        <Route path="/item-return/create" element={<ItemReturnCreatePage />} />
        <Route path="/item-return/create/:id" element={<ItemReturnCreatePage />} />
        <Route path="/note" element={<NotePage />} />
        <Route path="/note/create" element={<NoteCreatePage />} />
        <Route path="/note/edit/:id" element={<NoteCreatePage />} />
        <Route path="/mail" element={<MailPage />} />
        <Route path="/mail/create" element={<MailCreatePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/master-main" element={<MasterMain />} />
        
        {/* Customer */}
        <Route path="/master-customer" element={<MasterCustomer />} />
        <Route path="/master-customer/create" element={<MasterCustomerCreate />} />
        <Route path="/master-customer/edit/:id" element={<MasterCustomerCreate />} />
        <Route path="/master-email-sender" element={<MasterEmailSender />} />
        <Route path="/master-email-sender/create" element={<MasterEmailSenderCreate />} />
        <Route path="/master-email-sender/edit/:id" element={<MasterEmailSenderCreate />} />
        
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

        {/* Service Type */}
        <Route path="/master-service-type" element={<MasterServiceType />} />
        <Route path="/master-service-type/create" element={<MasterServiceTypeCreate />} />
        <Route path="/master-service-type/edit/:id" element={<MasterServiceTypeCreate />} />
        <Route path="/master-service-type/detail/:id" element={<MasterServiceTypeDetail />} />

        {/* Order Type */}
        <Route path="/master-order-type" element={<MasterOrderType />} />
        <Route path="/master-order-type/create" element={<MasterOrderTypeCreate />} />
        <Route path="/master-order-type/edit/:id" element={<MasterOrderTypeCreate />} />

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
        <Route path="/permission" element={<PermissionPage />} />
        <Route path="/permission/assign/:username" element={<PermissionAssignPage />} />

        {/* Documents */}
        <Route path="/document" element={<DocumentMain />} />
        <Route path="/document/quotation" element={<QuotationPage />} />
        <Route path="/document/quotation/:id" element={<QuotationDetailPage />} />
        <Route path="/document/quotation/:id/status" element={<QuotationStatusPage />} />
        <Route path="/document/invoice" element={<InvoicePage />} />
        <Route path="/document/invoice/:id" element={<InvoiceDetailPage />} />
        <Route path="/document/invoice/:id/status" element={<InvoiceStatusPage />} />
        <Route path="/document/payment" element={<PaymentPage />} />
        <Route path="/document/payment/create" element={<PaymentCreatePage />} />
        <Route path="/document/payment/:id" element={<PaymentDetailPage />} />
        <Route path="/document/payment/:id/edit" element={<PaymentCreatePage />} />
        <Route path="/document/payment/:id/status" element={<PaymentStatusPage />} />

        {/* Orders & Reports */}
        <Route path="/order" element={<OrderPage />} />
        <Route path="/order/create" element={<OrderPageCreate />} />
        <Route path="/order/create/:id" element={<OrderPageCreate />} />
        <Route path="/order/edit/:id" element={<OrderPageCreate />} />
        <Route path="/order/detail/:id" element={<OrderPageDetail />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/report/main" element={<ReportMain />} />
        <Route path="/report" element={<Report />} />
        <Route path="/report/detail/:id" element={<ReportDetail />} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
