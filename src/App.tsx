import { BrowserRouter, Navigate,Route, Routes } from "react-router-dom";

import Login from "./app/auth/login-page";
import Home from "./app/Home";
import MasterCategory from "./app/master-category";
import MasterItem from "./app/master-item";
import MasterUser from "./app/master-user";
import OrderPage from "./app/quotes";
import Report from "./app/report";
import Return from "./app/return";
import OrderPageCreate from "./modules/order-page/form/OrderPageCreate.wrapper";

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

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
