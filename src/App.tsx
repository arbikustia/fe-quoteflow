import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./app/auth/login-page";
import Home from "./app/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect first time open to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
