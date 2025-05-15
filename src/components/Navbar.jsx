import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <div className="text-2xl font-bold text-blue-600">
        <Link to="/">Arnifi Blogs</Link>
      </div>

      <div className="flex items-center space-x-6">
        {isAuthenticated && (
          <Link to="/my-blogs" className="text-gray-700 hover:text-blue-600">
            My Blogs
          </Link>
        )}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};
