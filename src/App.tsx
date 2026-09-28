import { BrowserRouter, Navigate,Route, Routes } from "react-router-dom";

import Login from "./app/auth/login-page";
import Home from "./app/Home";
import MasterCategory from "./app/master-category";
import MasterItem from "./app/master-item";
import MasterUser from "./app/master-user";
import MobileDashboard from "./app/mobile-dashboard";
import OrderMobile from "./app/order-mobile";
import OrderMobileCreate from "./app/order-mobile-create";
import OrderMobileDetail from "./app/order-mobile-detail";
import OrderPage from "./app/quotes";
import Report from "./app/report";
import Return from "./app/return";
import ReturnMobile from "./app/return-mobile";
import ReturnMobileDetail from "./app/return-mobile-detail";
import OrderPageCreate from "./modules/order-page/form/OrderPageCreate.wrapper";
import MobileLayout from "./app/shared/MobileLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect first time open to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quotes" element={<OrderPage />} />
        <Route path="/quotes/create" element={<OrderPageCreate />} />
        <Route path="/quotes/edit/:id" element={<OrderPageCreate />} />
        <Route path="/master-data/users" element={<MasterUser />} />
        <Route path="/master-data/categories" element={<MasterCategory />} />
        <Route path="/master-data/items" element={<MasterItem />} />
        <Route path="/report" element={<Report />} />
        <Route path="/return" element={<Return />} />
        <Route element={<MobileLayout />}>
          <Route path="/home-mobile" element={<MobileDashboard />} />
          <Route path="/order-mobile" element={<OrderMobile />} />
          <Route path="/return-mobile" element={<ReturnMobile />} />
        </Route>
        
        {/* Detail and Create routes that DO NOT need the BottomNav */}
        <Route path="/order-mobile/create" element={<OrderMobileCreate />} />
        <Route path="/order-mobile/create/:id" element={<OrderMobileCreate />} />
        <Route path="/order-mobile/detail/:id" element={<OrderMobileDetail />} />
        <Route path="/return-mobile/detail/:id" element={<ReturnMobileDetail />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
