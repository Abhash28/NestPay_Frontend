import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./LoginPage/login";
import Signup from "./LoginPage/SignupPage/Signup";
import ForgetPass from "./LoginPage/ForgetPass/ForgetPass";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*login pages */}
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/forgetpass" element={<ForgetPass />}></Route>
        {/*admin Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
