import { IoMdArrowBack, IoMdClose } from "react-icons/io";
import { useLocation, useNavigate } from "react-router";
import { FiUpload, FiFile, FiImage, FiTrash2 } from "react-icons/fi";
import { GrAdd } from "react-icons/gr";
import { FaFilePowerpoint, FaFileWord } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

function Content() {
  const navigate = useNavigate();
  const location = useLocation();
  const { uploadContent, deleteContent, supabase, isLoading, setIsLoading} = useUser();


  
  // Get unit info from route state
  const { unit, bracket } = location.state || {};

  const [content, setContent] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState(false);

  // Upload content form
  const [contentTitle, setContentTitle] = useState("");
  const [contentDescription, setContentDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const backPage = () => {
    navigate(-1);
  };

  // Fetch content for this unit
  useEffect(() => {
    if (!unit?.id) {
      navigate(-1);
      return;
    }

    fetchContent();
    

    // Subscribe to content changes
    const contentSubscription = supabase
      .channel(`content_changes_${unit.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "content",
          filter: `unit_id=eq.${unit.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setContent((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setContent((prev) =>
              prev.filter((item) => item.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            setContent((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      if (contentSubscription) contentSubscription.unsubscribe();
    };
  }, [unit?.id]);

  const fetchContent = async () => {
    try {
      setIsLoading((prev) => ({...prev, content:true}));
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("unit_id", unit.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, content: false }));
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    console.log("here")
    if (!selectedFile || !unit) return;
    
    try {
      setUploading(true);
      await uploadContent(selectedFile, unit.id, contentTitle, contentDescription);

      // Refresh content
      await fetchContent();

      // Reset form
      setContentTitle("");
      setContentDescription("");
      setSelectedFile(null);
      setUploadModal(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(error.message || "Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle delete content
  const handleDeleteContent = async (contentId, fileUrl) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    try {
      await deleteContent(contentId, fileUrl);
      await fetchContent();
    } catch (error) {
      console.error("Error deleting content:", error);
      alert("Failed to delete content. Please try again.");
    }
  };

  if (!unit) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="geist-font flex flex-col min-h-screen bg-gradient-to-b from-white to-stone-50/30 pb-25"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="p-5 bg-white/80 backdrop-blur-sm sticky top-0 border-b border-stone-100 z-20"
      >
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
            onClick={backPage}
          >
            <IoMdArrowBack size={22} className="text-gray-700" />
          </motion.button>

          <div className="flex flex-col items-center">
            <h1 className="geist-font wght-700 text-xl text-gray-900">
              {unit.title}
            </h1>
            {bracket && (
              <p className="text-sm text-gray-500">{bracket.title}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
            onClick={() => setUploadModal(true)}
          >
            <GrAdd size={22} className="text-gray-700" />
          </motion.button>
        </div>
      </motion.div>

      {/* Content List */}
      <div
        className={`max-w-4xl mx-auto w-full px-5 py-6 ${
          uploadModal ? "blur-sm" : ""
        }`}
      >
        {isLoading.content ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-lime-200 border-t-lime-700" />
            <p className="mt-3 text-sm text-gray-500">Loading content...</p>
          </div>
        ) : content.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="p-4 rounded-full bg-stone-100 mb-4">
              <FiFile size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Content Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by uploading study materials for this unit
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUploadModal(true)}
              className="px-4 py-2 rounded-lg bg-lime-800 text-white hover:bg-lime-700 transition-colors shadow-sm geist-font wght-600"
            >
              Upload Content
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-3">
            {content.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                key={item.id}
                className="group"
              >
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-lime-200 transition-all">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-lime-50 to-stone-100 border border-lime-200">
                    {item.file_type === "pdf" ? (
                      <FiFile size={24} className="text-red-600" />
                    ) : item.file_type === "word" ? (
                      <FaFileWord size={24} className="text-blue-700" />
                    ) : item.file_type === "powerpoint" ? (
                      <FaFilePowerpoint size={24} className="text-orange-600" />
                    ) : (
                      <FiImage size={24} className="text-blue-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="geist-font wght-600 text-base text-gray-900">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 geist-font wght-500 mt-0.5">
                        {item.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {item.file_name} • {(item.file_size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-lime-100 text-gray-600 hover:text-lime-800 transition-colors"
                    >
                      <FiFile size={18} />
                    </a>
                    <button
                      onClick={() =>
                        handleDeleteContent(item.id, item.file_url)
                      }
                      className="p-2 rounded-lg hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Content Modal */}
      <AnimatePresence>
        {uploadModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50"
              onClick={() => !uploading && setUploadModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 bottom-4 top-auto md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
                <form className="flex flex-col" onSubmit={handleFileUpload}>
                  <div className="flex items-center justify-between p-4 border-b border-stone-200">
                    <h2 className="geist-font wght-700 text-lg text-gray-900">
                      Upload Content
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => !uploading && setUploadModal(false)}
                      disabled={uploading}
                      className="p-1 rounded-lg hover:bg-stone-100 text-gray-500 transition-colors disabled:opacity-50"
                    >
                      <IoMdClose size={20} />
                    </motion.button>
                  </div>

                  <div className="p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-700 geist-font wght-600">
                        Content Title
                      </label>
                      <input
                        placeholder="e.g., Lecture Notes Chapter 1"
                        value={contentTitle}
                        onChange={(e) => setContentTitle(e.target.value)}
                        disabled={uploading}
                        required
                        className="w-full p-3 rounded-lg border border-stone-200 text-base geist-font wght-500 bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-700 geist-font wght-600">
                        Description (Optional)
                      </label>
                      <textarea
                        placeholder="Brief description of the content"
                        value={contentDescription}
                        onChange={(e) => setContentDescription(e.target.value)}
                        disabled={uploading}
                        rows={2}
                        className="w-full p-3 rounded-lg border border-stone-200 text-base geist-font wght-500 bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-700 geist-font wght-600">
                        File (PDF, Word, PowerPoint, or Image - max 10MB)
                      </label>
                      <input
                        type="file"
                        accept="application/pdf,image/*,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.ms-powerpoint"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        disabled={uploading}
                        required
                        className="w-full p-3 rounded-lg border border-stone-200 text-base geist-font wght-500 bg-white/50 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-lime-50 file:text-lime-800 hover:file:bg-lime-100"
                      />
                      {selectedFile && (
                        <p className="text-xs text-gray-600 mt-1">
                          Selected: {selectedFile.name} (
                          {(selectedFile.size / 1024).toFixed(1)} KB)
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 border-t border-stone-200">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setUploadModal(false)}
                      disabled={uploading}
                      className="flex-1 py-2.5 px-4 rounded-lg border border-stone-200 text-gray-700 hover:bg-stone-50 geist-font wght-600 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: uploading ? 1 : 1.01 }}
                      whileTap={{ scale: uploading ? 1 : 0.98 }}
                      type="submit"
                      disabled={
                        uploading || !contentTitle.trim() || !selectedFile
                      }
                      className="flex-1 py-2.5 px-4 rounded-lg bg-lime-800 text-white hover:bg-lime-700 disabled:bg-lime-800/70 geist-font wght-600 transition-colors shadow-sm"
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Content;
