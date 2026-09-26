import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./app/auth/login-page";
import Home from "./app/Home";
import MasterUser from "./app/master-user";
import MasterCategory from "./app/master-category";
import MasterItem from "./app/master-item";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect first time open to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/master-data/users" element={<MasterUser />} />
        <Route path="/master-data/categories" element={<MasterCategory />} />
        <Route path="/master-data/items" element={<MasterItem />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
