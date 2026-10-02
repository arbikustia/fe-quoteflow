import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./app/auth/login-page";
import Dashboard from "./app/dashboard";
import MasterCategory from "./app/master-category";
import MasterCategoryCreate from "./app/master-category/create";
import MasterCategoryDetail from "./app/master-category/detail";
import MasterItem from "./app/master-item";
import MasterItemCreate from "./app/master-item/create";
import MasterItemDetail from "./app/master-item/detail";
import MasterMain from "./app/master-main";
import MobileMasterMain from "./app/master-main";
import MasterUser from "./app/master-user";
import MasterUserCreate from "./app/master-user/create";
import MasterUserDetail from "./app/master-user/detail";
import OrderPage from "./app/order";
import OrderPageCreate from "./app/order/create";
import OrderPageDetail from "./app/order/detail";
import Report from "./app/report";
import ReportDetail from "./app/report/detail";
import ReportMain from "./app/report/main";
import Return from "./app/return";
import ReturnPageDetail from "./app/return/detail";
import MobileLayout from "./app/shared/MobileLayout";

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
        <Route path="/order" element={<OrderPage />} />
        <Route path="/order/create" element={<OrderPageCreate />} />
        <Route path="/order/edit/:id" element={<OrderPageCreate />} />
        <Route path="/order/detail/:id" element={<OrderPageDetail />} />
        <Route path="/master-user" element={<MasterUser />} />
        <Route path="/master-user/create" element={<MasterUserCreate />} />
        <Route path="/master-user/edit/:id" element={<MasterUserCreate />} />
        <Route path="/master-user/detail/:id" element={<MasterUserDetail />} />
        <Route path="/master-data/categories" element={<MasterCategory />} />
        <Route path="/master-data/items" element={<MasterItem />} />
        <Route path="/report" element={<Report />} />
        <Route path="/return" element={<Return />} />
        <Route element={<MobileLayout />}>


          <Route path="/master-main" element={<MobileMasterMain />} />

          <Route path="/master-category" element={<MasterCategory />} />
          <Route path="/master-item" element={<MasterItem />} />
          <Route path="/report/main" element={<ReportMain />} />
          <Route path="/report" element={<Report />} />
        </Route>
        
        {/* Detail and Create routes that DO NOT need the BottomNav */}

        <Route path="/return/detail/:id" element={<ReturnPageDetail />} />
        


        {/* Master Category Detail and Create */}
        <Route path="/master-category/create" element={<MasterCategoryCreate />} />
        <Route path="/master-category/create/:id" element={<MasterCategoryCreate />} />
        <Route path="/master-category/detail/:id" element={<MasterCategoryDetail />} />

        {/* Master Item Detail and Create */}
        <Route path="/master-item/create" element={<MasterItemCreate />} />
        <Route path="/master-item/create/:id" element={<MasterItemCreate />} />
        <Route path="/master-item/detail/:id" element={<MasterItemDetail />} />

        {/* Report Detail */}
        <Route path="/report/detail/:id" element={<ReportDetail />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
