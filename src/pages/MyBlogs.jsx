import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [filters, setFilters] = useState({ category: "" });
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // New state for Delete Confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  });

  const token = localStorage.getItem("token");

  const fetchBlogs = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append("category", filters.category);

      const response = await axios.get(
        `${API_URL}/api/v1/blogs/my?${queryParams.toString()}`,
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
    setFilters({ category });
  };

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setIsEditMode(true);
      setFormData(blog);
      setSelectedBlog(blog);
    } else {
      setIsEditMode(false);
      setFormData({ title: "", category: "", content: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ title: "", category: "", content: "" });
    setSelectedBlog(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      if (isEditMode && selectedBlog) {
        await axios.put(`${API_URL}/api/v1/blogs/${selectedBlog._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/api/v1/blogs`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchBlogs();
      handleCloseModal();
    } catch (err) {
      alert("Failed to save blog.");
    }
  };

  // Instead of immediate delete, open the delete confirmation modal
  const confirmDelete = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  // Actual delete call
  const handleDelete = async () => {
    if (!blogToDelete) return;

    try {
      await axios.delete(`${API_URL}/api/v1/blogs/${blogToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDeleteModal(false);
      setBlogToDelete(null);
      fetchBlogs();
    } catch (err) {
      alert("Failed to delete blog.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        My Blogs
      </h2>

      <div className="mb-6 flex justify-center">
        <button
          onClick={() => handleOpenModal()}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Create Blog
        </button>
      </div>

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
          const placeholderImage = `https://picsum.photos/400/300?random=${index + 1}`;

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
                <p className="text-sm text-gray-500 mb-1">Category: {blog.category}</p>
                <p className="text-sm text-gray-500 mb-3">Author: {blog.author}</p>
                <p className="text-gray-700 text-sm line-clamp-3 mb-4">{blog.content}</p>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleOpenModal(blog)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(blog)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {blogs.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-10">No blogs available.</p>
      )}

      {/* Blog Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {isEditMode ? "Edit Blog" : "Create Blog"}
            </h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-2 border rounded"
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-2 border rounded"
            >
              <option value="">Select Category</option>
              <option value="Career">Career</option>
              <option value="Travel">Travel</option>
              <option value="Finance">Finance</option>
              <option value="Tech">Tech</option>
            </select>
            <textarea
              name="content"
              placeholder="Content"
              rows="5"
              value={formData.content}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-2 border rounded"
            ></textarea>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {isEditMode ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">
              Confirm Delete
            </h3>
            <p className="mb-6">Are you sure you want to delete the blog titled <strong>"{blogToDelete?.title}"</strong>?</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
