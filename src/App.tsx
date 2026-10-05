import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./app/auth/login-page";
import Dashboard from "./app/dashboard";
import MasterCategory from "./app/master-category";
import MasterCategoryCreate from "./app/master-category/create";
import MasterCategoryDetail from "./app/master-category/detail";
import MasterCustomer from "./app/master-customer";
import MasterCustomerCreate from "./app/master-customer/create";
import MasterCustomerDetail from "./app/master-customer/detail";
import MasterItem from "./app/master-item";
import MasterItemCreate from "./app/master-item/create";
import MasterItemDetail from "./app/master-item/detail";
import MasterMain from "./app/master-main";
import MasterPaymentMethod from "./app/master-payment-method";
import MasterPaymentMethodCreate from "./app/master-payment-method/create";
import MasterPaymentMethodDetail from "./app/master-payment-method/detail";
import MasterPaymentType from "./app/master-payment-type";
import MasterPaymentTypeCreate from "./app/master-payment-type/create";
import MasterPaymentTypeDetail from "./app/master-payment-type/detail";
import MasterPIC from "./app/master-pic";
import MasterPICCreate from "./app/master-pic/create";
import MasterPICDetail from "./app/master-pic/detail";
import MasterProject from "./app/master-project";
import MasterProjectCreate from "./app/master-project/create";
import MasterProjectDetail from "./app/master-project/detail";
import MasterRole from "./app/master-role";
import MasterRoleCreate from "./app/master-role/create";
import MasterRoleDetail from "./app/master-role/detail";
import MasterServiceType from "./app/master-service-type";
import MasterServiceTypeCreate from "./app/master-service-type/create";
import MasterServiceTypeDetail from "./app/master-service-type/detail";
import MasterUser from "./app/master-user";
import MasterUserCreate from "./app/master-user/create";
import MasterUserDetail from "./app/master-user/detail";
import MasterVoucher from "./app/master-voucher";
import MasterVoucherCreate from "./app/master-voucher/create";
import MasterVoucherDetail from "./app/master-voucher/detail";
import OrderPage from "./app/order";
import OrderPageCreate from "./app/order/create";
import OrderPageDetail from "./app/order/detail";
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
        <Route path="/master-main" element={<MasterMain />} />
        
        {/* Customer */}
        <Route path="/master-customer" element={<MasterCustomer />} />
        <Route path="/master-customer/create" element={<MasterCustomerCreate />} />
        <Route path="/master-customer/edit/:id" element={<MasterCustomerCreate />} />
        <Route path="/master-customer/detail/:id" element={<MasterCustomerDetail />} />
        
        {/* Item */}
        <Route path="/master-item" element={<MasterItem />} />
        <Route path="/master-item/create" element={<MasterItemCreate />} />
        <Route path="/master-item/edit/:id" element={<MasterItemCreate />} />
        <Route path="/master-item/detail/:id" element={<MasterItemDetail />} />

        {/* Category */}
        <Route path="/master-category" element={<MasterCategory />} />
        <Route path="/master-category/create" element={<MasterCategoryCreate />} />
        <Route path="/master-category/edit/:id" element={<MasterCategoryCreate />} />
        <Route path="/master-category/detail/:id" element={<MasterCategoryDetail />} />

        {/* Role */}
        <Route path="/master-role" element={<MasterRole />} />
        <Route path="/master-role/create" element={<MasterRoleCreate />} />
        <Route path="/master-role/edit/:id" element={<MasterRoleCreate />} />
        <Route path="/master-role/detail/:id" element={<MasterRoleDetail />} />

        {/* Voucher */}
        <Route path="/master-voucher" element={<MasterVoucher />} />
        <Route path="/master-voucher/create" element={<MasterVoucherCreate />} />
        <Route path="/master-voucher/edit/:id" element={<MasterVoucherCreate />} />
        <Route path="/master-voucher/detail/:id" element={<MasterVoucherDetail />} />

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
        <Route path="/master-payment-method/detail/:id" element={<MasterPaymentMethodDetail />} />

        {/* Payment Type */}
        <Route path="/master-payment-type" element={<MasterPaymentType />} />
        <Route path="/master-payment-type/create" element={<MasterPaymentTypeCreate />} />
        <Route path="/master-payment-type/edit/:id" element={<MasterPaymentTypeCreate />} />
        <Route path="/master-payment-type/detail/:id" element={<MasterPaymentTypeDetail />} />

        {/* PIC */}
        <Route path="/master-pic" element={<MasterPIC />} />
        <Route path="/master-pic/create" element={<MasterPICCreate />} />
        <Route path="/master-pic/edit/:id" element={<MasterPICCreate />} />
        <Route path="/master-pic/detail/:id" element={<MasterPICDetail />} />

        {/* User */}
        <Route path="/master-user" element={<MasterUser />} />
        <Route path="/master-user/create" element={<MasterUserCreate />} />
        <Route path="/master-user/edit/:id" element={<MasterUserCreate />} />
        <Route path="/master-user/detail/:id" element={<MasterUserDetail />} />

        {/* Orders & Reports */}
        <Route path="/order" element={<OrderPage />} />
        <Route path="/order/create" element={<OrderPageCreate />} />
        <Route path="/order/edit/:id" element={<OrderPageCreate />} />
        <Route path="/order/detail/:id" element={<OrderPageDetail />} />
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
