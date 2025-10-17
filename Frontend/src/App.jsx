import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<Navigate to="/register" />} /> {/* Redirect root to login */}
        <Route path="/login" element={<Login role="role"/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/*" element={<AdminPage/>}/>
         <Route path="/user/*" element={<UserPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
