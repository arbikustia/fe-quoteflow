import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./app/auth/login-page";
import Dashboard from "./app/dashboard";
import MasterCategory from "./app/master-category";
import MasterCustomer from "./app/master-customer";
import MasterItem from "./app/master-item";
import MasterMain from "./app/master-main";
import MasterPaymentMethod from "./app/master-payment-method";
import MasterPaymentType from "./app/master-payment-type";
import MasterPIC from "./app/master-pic";
import MasterProject from "./app/master-project";
import MasterRole from "./app/master-role";
import MasterServiceType from "./app/master-service-type";
import MasterUser from "./app/master-user";
import MasterVoucher from "./app/master-voucher";
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
        <Route path="/master-customer" element={<MasterCustomer />} />
        <Route path="/master-item" element={<MasterItem />} />
        <Route path="/master-user" element={<MasterUser />} />
        <Route path="/master-role" element={<MasterRole />} />
        <Route path="/master-category" element={<MasterCategory />} />
        <Route path="/master-voucher" element={<MasterVoucher />} />
        <Route path="/master-project" element={<MasterProject />} />
        <Route path="/master-service-type" element={<MasterServiceType />} />
        <Route path="/master-payment-method" element={<MasterPaymentMethod />} />
        <Route path="/master-pic" element={<MasterPIC />} />
        <Route path="/master-payment-type" element={<MasterPaymentType />} />
        <Route path="/master-data/categories" element={<Navigate to="/master-category" replace />} />
        <Route path="/master-data/items" element={<Navigate to="/master-item" replace />} />
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
