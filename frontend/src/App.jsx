import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Send = lazy(() => import("./pages/Send"));

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/send" element={<Send />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
