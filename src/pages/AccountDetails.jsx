import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoMdArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";

function AccountDetails() {
  const { profile, updateProfile } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateProfile({
        full_name: formData.full_name,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-5 py-4 bg-white dark:bg-stone-900 sticky top-0 border-b border-stone-200 dark:border-stone-800 z-20 flex items-center justify-between transition-colors duration-300"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <IoMdArrowBack size={24} className="text-gray-700 dark:text-gray-200" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Account Details</h1>
        <div className="w-10" />
      </motion.div>

      <div className="flex-1 p-5 max-w-2xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full p-3 bg-gray-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed transition-colors"
            />
            <p className="text-xs text-gray-500 dark:text-gray-500">Email address cannot be changed</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600 transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-lg border border-green-200 dark:border-green-800">
              Profile updated successfully!
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`mt-4 w-full bg-lime-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-lime-700/20 flex items-center justify-center gap-2 transition-all ${
              loading ? "opacity-70 cursor-wait" : "hover:bg-lime-800"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FiSave size={20} />
                Save Changes
              </>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}

export default AccountDetails;
