import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [filters, setFilters] = useState({ category: "", author: "" });

  const token = localStorage.getItem("token");

  const fetchBlogs = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.author) queryParams.append("author", filters.author);

      const response = await axios.get(
        `${API_URL}/api/v1/blogs?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBlogs(response.data.data);
    } catch (err) {
      setError("Failed to load blogs. Please try again later.");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [filters]);

  const handleSubmit = () => {
    setFilters({ category, author });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Latest Blogs
      </h2>

      {/* Filters */}
      <div className="mb-10 flex flex-col md:flex-row items-center justify-center gap-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Categories</option>
          <option value="Career">Career</option>
          <option value="Travel">Travel</option>
          <option value="Finance">Finance</option>
          <option value="Tech">Tech</option>
        </select>

        <input
          type="text"
          placeholder="Author name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Apply Filters
        </button>
      </div>

      {error && <div className="text-red-500 text-center mb-6">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog, index) => {
          const placeholderImage = `https://picsum.photos/400/300?random=${
            index + 1
          }`;

          return (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >
              <img
                src={placeholderImage}
                alt={blog.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  Category: {blog.category}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Author: {blog.author}
                </p>
                <p className="text-gray-700 text-sm line-clamp-3">
                  {blog.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {blogs.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-10">No blogs available.</p>
      )}
    </div>
  );
};
