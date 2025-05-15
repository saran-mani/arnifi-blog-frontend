import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Blogs } from "./pages/Blogs";
import { Auth } from "./pages/Login";
import { Navbar } from "./components/Navbar";
import { MyBlogs } from "./pages/MyBlogs";

const AppLayout = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("token");
  const isLoginPage = location.pathname === "/login";

  // Redirect to login if not authenticated and not on login page
  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/login" />;
  }

  // Redirect authenticated user from root to /blogs
  if (isAuthenticated && location.pathname === "/") {
    return <Navigate to="/blogs" />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Main Content (no sidebar) */}
      <div className="flex-1 overflow-y-auto">
        <Navbar />
        <Routes>
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/my-blogs" element={<MyBlogs />} />
          <Route path="/login" element={<Auth />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;
