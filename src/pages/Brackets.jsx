import { IoMdArrowBack } from "react-icons/io";
import { LuBookMinus, LuTrash2, LuPencil } from "react-icons/lu";
import { FiShare2, FiCopy } from "react-icons/fi";
import { useNavigate, Link } from "react-router";
import { GrFormNext, GrAdd } from "react-icons/gr";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { toast } from "react-hot-toast";

function Brackets() {
  const navigate = useNavigate();
  const { brackets, setBrackets, createBracket, updateBracket, deleteBracket } = useUser();

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [selectedBracket, setSelectedBracket] = useState(null);
  const [title, setTitle] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const backPage = () => {
    navigate(-1);
  };

  const addBracket = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsLoading(true);

      await createBracket({
        title: title.trim(),
        current: brackets.length === 0,
      });

      setTitle("");
      setAddModal(false);
      toast.success("Bracket created successfully!");
    } catch (error) {
      toast.error(`Error creating bracket: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBracket = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !selectedBracket) return;

    try {
      setIsLoading(true);
      await updateBracket(selectedBracket.id, {
        title: editTitle.trim(),
        current: isCurrent
      });
      setEditModal(false);
      setSelectedBracket(null);
      toast.success("Bracket updated successfully!");
    } catch (error) {
      toast.error("Failed to update bracket");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBracket = async (id, e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this bracket? All units and content inside will be lost.")) {
      try {
        await deleteBracket(id);
        toast.success("Bracket deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete bracket");
      }
    }
  };

  const openEditModal = (bracket, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedBracket(bracket);
    setEditTitle(bracket.title);
    setIsCurrent(bracket.current);
    setEditModal(true);
  };

  const openShareModal = (bracket, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedBracket(bracket);
    setShareModal(true);
  };

  const handleTogglePublic = async () => {
    if (!selectedBracket) return;
    try {
      setIsLoading(true);
      const updated = await updateBracket(selectedBracket.id, {
        is_public: !selectedBracket.is_public
      });
      setSelectedBracket(updated);
      toast.success(updated.is_public ? "Bracket is now public!" : "Bracket is now private.");
    } catch (error) {
      toast.error("Failed to update sharing settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyShareLink = () => {
    if (!selectedBracket?.share_token) return;
    const link = `${window.location.origin}/share/${selectedBracket.share_token}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="geist-font flex flex-col min-h-screen bg-white dark:bg-stone-950"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="p-5 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm sticky top-0 border-b border-stone-100 dark:border-stone-800 z-20"
      >
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            onClick={() => backPage()}
          >
            <IoMdArrowBack size={22} className="text-stone-700 dark:text-gray-300" />
          </motion.button>

          <h1 className="geist-font wght-700 text-xl text-stone-900 dark:text-white">
            Brackets
          </h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            onClick={() => setAddModal((prev) => !prev)}
          >
            <GrAdd size={22} className="text-stone-700 dark:text-gray-300" />
          </motion.button>
        </div>
      </motion.div>

      <div className={`flex-1 py-6 px-5 ${addModal || editModal ? "blur-sm" : ""}`}>
        <div className="max-w-4xl mx-auto grid gap-4">
          {brackets.map((bracket) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.02 + bracket.id * 0.1 }}
              key={bracket.id}
            >
              <Link
                to={`/brackets/${bracket.title}`}
                className="group flex gap-4 items-center p-5 rounded-xl bg-white dark:bg-stone-900 border border-lime-100 dark:border-stone-800 shadow-sm hover:shadow-md hover:border-lime-500 dark:hover:border-lime-700 transition-all relative overflow-hidden"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-lime-50 to-stone-100 dark:from-lime-900/20 dark:to-stone-900 border border-lime-200 dark:border-lime-900/30 group-hover:bg-lime-50 dark:group-hover:bg-lime-900/30 group-hover:border-lime-500 dark:group-hover:border-lime-600 transition-colors">
                  <LuBookMinus size={24} className="text-lime-800 dark:text-lime-400 group-hover:text-lime-800 dark:group-hover:text-lime-400" />
                </div>

                <div className="flex-1 flex justify-between items-center gap-4 min-w-0">
                  <div className="flex flex-col gap-1 min-w-0 items-start">
                    <h3 className="geist-font wght-600 text-lg text-stone-900 dark:text-white group-hover:text-lime-900 dark:group-hover:text-lime-200 transition-colors truncate">
                      {bracket.title}
                    </h3>
                     {bracket.current && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-lime-100 text-lime-800 font-medium">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => openShareModal(bracket, e)}
                        className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Share Bracket"
                      >
                        <FiShare2 size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => openEditModal(bracket, e)}
                        className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Edit Bracket"
                      >
                        <LuPencil size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleDeleteBracket(bracket.id, e)}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Bracket"
                      >
                        <LuTrash2 size={18} />
                      </motion.button>
                    </div>

                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 dark:bg-stone-800 group-hover:bg-lime-50 dark:group-hover:bg-lime-900/30 transition-colors ml-2">
                      <GrFormNext
                        size={20}
                        className="text-stone-400 dark:text-stone-500 group-hover:text-lime-700 dark:group-hover:text-lime-400"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          {brackets.length === 0 && (
            <div className="text-center py-20 text-stone-500 dark:text-stone-400">
              <p>No brackets found. Create one to get started.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {(addModal || editModal || shareModal) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-[60]"
              onClick={() => {
                setAddModal(false);
                setEditModal(false);
                setShareModal(false);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-full md:max-w-sm z-[60]"
            >
              <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
                {shareModal ? (
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
                      <h2 className="geist-font wght-600 text-lg text-stone-900 dark:text-white flex items-center gap-2">
                        <FiShare2 /> Share Bracket
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShareModal(false)}
                        className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 transition-colors"
                      >
                        <AiOutlineClose size={20} />
                      </motion.button>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-stone-900 dark:text-white">Public Link</p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">Anyone with the link can view and clone.</p>
                        </div>
                        <button
                          onClick={handleTogglePublic}
                          disabled={isLoading}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${selectedBracket?.is_public ? 'bg-lime-600' : 'bg-stone-200 dark:bg-stone-700'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${selectedBracket?.is_public ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      
                      {selectedBracket?.is_public && (
                        <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center justify-between gap-2">
                          <span className="text-sm text-stone-600 dark:text-stone-300 truncate flex-1 font-mono">
                            {window.location.origin}/share/{selectedBracket.share_token}
                          </span>
                          <button
                            onClick={copyShareLink}
                            className="p-2 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 bg-white dark:bg-stone-900 rounded-md border border-stone-200 dark:border-stone-700 shadow-sm"
                          >
                            <FiCopy size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                <form className="flex flex-col" onSubmit={addModal ? addBracket : handleEditBracket}>
                  <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
                    <h2 className="geist-font wght-600 text-lg text-stone-900 dark:text-white">
                      {addModal ? "Add Bracket" : "Edit Bracket"}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setAddModal(false);
                        setEditModal(false);
                      }}
                      className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 transition-colors"
                    >
                      <AiOutlineClose size={20} />
                    </motion.button>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="title"
                        className="text-sm font-medium text-stone-700 dark:text-stone-300"
                      >
                        Bracket Title
                      </label>
                      <input
                        id="title"
                        placeholder="e.g. Fall Semester 2025"
                        value={addModal ? title : editTitle}
                        onChange={(e) => addModal ? setTitle(e.target.value) : setEditTitle(e.target.value)}
                        disabled={isLoading}
                        className="w-full p-3 rounded-lg border border-stone-200 dark:border-stone-700 text-base text-stone-900 dark:text-white bg-white dark:bg-stone-800 focus:border-lime-500 focus:ring-4 focus:ring-lime-500/10 transition-all outline-none disabled:bg-stone-50 disabled:text-stone-400 dark:disabled:bg-stone-800/50 placeholder:text-stone-400"
                        autoFocus
                      />
                    </div>

                    {editModal && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-100 cursor-pointer" onClick={() => setIsCurrent(!isCurrent)}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isCurrent ? 'bg-lime-600 border-lime-600' : 'bg-white border-stone-300'}`}>
                          {isCurrent && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5 bg-white rounded-sm" />}
                        </div>
                        <label className="text-sm font-medium text-stone-700 cursor-pointer pointer-events-none">
                          Set as Current Bracket
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 p-4 border-t border-stone-100 bg-stone-50/30">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setAddModal(false);
                        setEditModal(false);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 font-medium transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: isLoading ? 1 : 1.01 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-2.5 px-4 rounded-lg bg-stone-900 text-white hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
                    >
                      {isLoading ? "Saving..." : (addModal ? "Create Bracket" : "Save Changes")}
                    </motion.button>
                  </div>
                </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Brackets;
