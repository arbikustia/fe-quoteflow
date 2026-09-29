import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./app/auth/login-page";
import Dashboard from "./app/dashboard";
import MasterCategory from "./app/master-category";
import MasterCategoryMobile from "./app/master-category-mobile";
import MasterCategoryMobileCreate from "./app/master-category-mobile-create";
import MasterCategoryMobileDetail from "./app/master-category-mobile-detail";
import MasterItem from "./app/master-item";
import MasterItemMobile from "./app/master-item-mobile";
import MasterItemMobileCreate from "./app/master-item-mobile-create";
import MasterItemMobileDetail from "./app/master-item-mobile-detail";
import MasterMain from "./app/master-main";
import MobileMasterMain from "./app/master-main-mobile";
import MasterUser from "./app/master-user";
import MasterUserMobile from "./app/master-user-mobile";
import MasterUserMobileCreate from "./app/master-user-mobile-create";
import MasterUserMobileDetail from "./app/master-user-mobile-detail";
import OrderMobile from "./app/order-mobile";
import OrderMobileCreate from "./app/order-mobile-create";
import OrderMobileDetail from "./app/order-mobile-detail";
import OrderPage from "./app/quotes";
import Report from "./app/report";
import MobileReportMain from "./app/report-main-mobile";
import MobileReportOrder from "./app/report-order-mobile";
import MobileReportOrderDetail from "./app/report-order-mobile-detail";
import Return from "./app/return";
import ReturnMobile from "./app/return-mobile";
import ReturnMobileDetail from "./app/return-mobile-detail";
import MobileLayout from "./app/shared/MobileLayout";
import OrderPageCreate from "./modules/order-page/form/OrderPageCreate.wrapper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect first time open to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/master-main" element={<MasterMain />} />
        <Route path="/quotes" element={<OrderPage />} />
        <Route path="/quotes/create" element={<OrderPageCreate />} />
        <Route path="/quotes/edit/:id" element={<OrderPageCreate />} />
        <Route path="/master-data/users" element={<MasterUser />} />
        <Route path="/master-data/categories" element={<MasterCategory />} />
        <Route path="/master-data/items" element={<MasterItem />} />
        <Route path="/report" element={<Report />} />
        <Route path="/return" element={<Return />} />
        <Route element={<MobileLayout />}>

          <Route path="/order-mobile" element={<OrderMobile />} />
          <Route path="/return-mobile" element={<ReturnMobile />} />
          <Route path="/master-main-mobile" element={<MobileMasterMain />} />
          <Route path="/master-user-mobile" element={<MasterUserMobile />} />
          <Route path="/master-category-mobile" element={<MasterCategoryMobile />} />
          <Route path="/master-item-mobile" element={<MasterItemMobile />} />
          <Route path="/report-main-mobile" element={<MobileReportMain />} />
          <Route path="/report-order-mobile" element={<MobileReportOrder />} />
        </Route>
        
        {/* Detail and Create routes that DO NOT need the BottomNav */}
        <Route path="/order-mobile/create" element={<OrderMobileCreate />} />
        <Route path="/order-mobile/create/:id" element={<OrderMobileCreate />} />
        <Route path="/order-mobile/detail/:id" element={<OrderMobileDetail />} />
        <Route path="/return-mobile/detail/:id" element={<ReturnMobileDetail />} />
        
        {/* Master User Mobile Detail and Create */}
        <Route path="/master-user-mobile-create" element={<MasterUserMobileCreate />} />
        <Route path="/master-user-mobile-create/:id" element={<MasterUserMobileCreate />} />
        <Route path="/master-user-mobile-detail/:id" element={<MasterUserMobileDetail />} />

        {/* Master Category Mobile Detail and Create */}
        <Route path="/master-category-mobile-create" element={<MasterCategoryMobileCreate />} />
        <Route path="/master-category-mobile-create/:id" element={<MasterCategoryMobileCreate />} />
        <Route path="/master-category-mobile-detail/:id" element={<MasterCategoryMobileDetail />} />

        {/* Master Item Mobile Detail and Create */}
        <Route path="/master-item-mobile-create" element={<MasterItemMobileCreate />} />
        <Route path="/master-item-mobile-create/:id" element={<MasterItemMobileCreate />} />
        <Route path="/master-item-mobile-detail/:id" element={<MasterItemMobileDetail />} />

        {/* Report Mobile Detail */}
        <Route path="/report-order-mobile-detail/:id" element={<MobileReportOrderDetail />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
