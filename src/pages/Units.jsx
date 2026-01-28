import { IoMdArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router";
import { LuNotebookText, LuPencil, LuTrash2 } from "react-icons/lu";
import { GrFormNext, GrAdd } from "react-icons/gr";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

function Units() {
  const navigate = useNavigate();
  const { brackets, units, isLoading, setIsLoading, createUnit, updateUnit, deleteUnit, supabase } =
    useUser();
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [title, setTitle] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [error, setError] = useState(null);

  const backPage = () => {
    window.history.back();
  };

  const location = useLocation();
  const bracketTitle = decodeURIComponent(
    location.pathname.replace("/brackets/", "")
  );

  // Find the current bracket
  const currentBracket = brackets.find((b) => b.title === bracketTitle);

  // Filter units for the current bracket
  const filteredUnits = units.filter(
    (unit) => unit.bracket_id === currentBracket?.id
  );


  // Handle adding a new unit
  const addUnit = async (e) => {
    e.preventDefault();
    if (!currentBracket) return;

    try {
      await createUnit({
        title,
        bracket_id: currentBracket.id,
      });
      setTitle("");
      setAddModal(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle editing a unit
  const handleEditUnit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !selectedUnit) return;

    try {
      await updateUnit(selectedUnit.id, {
        title: editTitle.trim(),
      });
      setEditModal(false);
      setSelectedUnit(null);
      setEditTitle("");
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle deleting a unit
  const handleDeleteUnit = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this unit? All content inside will be lost.")) {
      try {
        await deleteUnit(id);
      } catch (error) {
        setError("Failed to delete unit");
      }
    }
  };

  const openEditModal = (unit, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedUnit(unit);
    setEditTitle(unit.title);
    setEditModal(true);
  };

  // Navigate to content page for a unit
  const openUnitContent = (unit) => {
    navigate(`/brackets/${bracketTitle}/${unit.title}`, {
      state: { unit, bracket: currentBracket },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="geist-font flex flex-col min-h-screen bg-gradient-to-b from-white to-stone-50/30 dark:from-stone-900 dark:to-stone-950 pb-25 transition-colors duration-300"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="p-5 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm sticky top-0 border-b border-stone-100 dark:border-stone-800 z-20 transition-colors duration-300"
      >
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            onClick={() => backPage()}
          >
            <IoMdArrowBack size={22} className="text-gray-700 dark:text-gray-200" />
          </motion.button>

          <h1 className="geist-font wght-700 text-xl text-gray-900 dark:text-white">
            {bracketTitle}
          </h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            onClick={() => setAddModal(true)}
          >
            <GrAdd size={22} className="text-gray-700 dark:text-gray-200" />
          </motion.button>
        </div>
      </motion.div>

      {/* Units Grid */}
      <div
        className={`max-w-4xl mx-auto w-full px-5 py-6 ${
          addModal || editModal ? "blur-sm" : ""
        }`}
      >
        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="p-4 rounded-full bg-red-100 mb-4">
              <LuNotebookText size={32} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Units
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">{error}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-lime-800 text-white hover:bg-lime-700 transition-colors shadow-sm geist-font wght-600"
            >
              Refresh Page
            </motion.button>
          </motion.div>
        ) : isLoading.units ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-800 mb-4" />
            <p className="text-gray-600 text-sm">Loading units...</p>
          </div>
        ) : (
          <div>
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredUnits.map((unit, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                key={unit.id}
                className="group cursor-pointer"
                onClick={() => openUnitContent(unit)}
              >
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md hover:border-lime-200 dark:hover:border-lime-700 transition-all relative overflow-hidden h-full">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-lime-50 to-stone-100 dark:from-lime-900/20 dark:to-stone-900 border border-lime-200 dark:border-lime-900/30">
                    <LuNotebookText size={24} className="text-lime-800 dark:text-lime-400" />
                  </div>

                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <h3 className="geist-font wght-600 text-base text-gray-900 dark:text-white truncate pr-4">
                        {unit.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => openEditModal(unit, e)}
                          className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                          title="Edit Unit"
                        >
                          <LuPencil size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleDeleteUnit(unit.id, e)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Unit"
                        >
                          <LuTrash2 size={18} />
                        </motion.button>
                      </div>

                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 dark:bg-stone-800 group-hover:bg-lime-50 dark:group-hover:bg-lime-900/30 transition-colors">
                        <GrFormNext
                          size={20}
                          className="text-gray-400 dark:text-gray-500 group-hover:text-lime-700 dark:group-hover:text-lime-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          </div>
        )}

        {!isLoading.units && filteredUnits.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="p-4 rounded-full bg-stone-100 dark:bg-stone-800 mb-4">
              <LuNotebookText size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Units Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by adding your first unit to {bracketTitle}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAddModal(true)}
              className="px-4 py-2 rounded-lg bg-lime-800 text-white hover:bg-lime-700 transition-colors shadow-sm geist-font wght-600"
            >
              Add Unit
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Unit Modal */}
      <AnimatePresence>
        {(addModal || editModal) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50"
              onClick={() => {
                setAddModal(false);
                setEditModal(false);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 bottom-4 top-auto md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-sm z-50"
            >
              <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-800 overflow-hidden">
                <form className="flex flex-col" onSubmit={addModal ? addUnit : handleEditUnit}>
                  <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
                    <h2 className="geist-font wght-700 text-lg text-gray-900 dark:text-white">
                      {addModal ? "Add Unit" : "Edit Unit"}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setAddModal(false);
                        setEditModal(false);
                      }}
                      className="p-1 rounded-lg hover:bg-stone-100 text-gray-500 transition-colors"
                    >
                      <AiOutlineClose size={20} />
                    </motion.button>
                  </div>

                  <div className="p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="title"
                        className="text-sm text-gray-700 dark:text-gray-300 geist-font wght-600"
                      >
                        Unit Title
                      </label>
                      <input
                        id="title"
                        placeholder="e.g., Chapter 1: Introduction"
                        value={addModal ? title : editTitle}
                        onChange={(e) => addModal ? setTitle(e.target.value) : setEditTitle(e.target.value)}
                        required
                        className="w-full p-3 rounded-lg border border-stone-200 dark:border-stone-700 text-base geist-font wght-500 bg-white/50 dark:bg-stone-800 dark:text-white focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all disabled:bg-stone-50 disabled:text-gray-500 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 border-t border-stone-200 dark:border-stone-800">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setAddModal(false);
                        setEditModal(false);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-lg border border-stone-200 dark:border-stone-700 text-gray-700 dark:text-gray-300 hover:bg-stone-50 dark:hover:bg-stone-800 geist-font wght-600 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: isLoading.units ? 1 : 1.01 }}
                      whileTap={{ scale: isLoading.units ? 1 : 0.98 }}
                      type="submit"
                      disabled={isLoading.units || (addModal ? !title.trim() : !editTitle.trim())}
                      className="flex-1 py-2.5 px-4 rounded-lg bg-lime-800 dark:bg-lime-700 text-white hover:bg-lime-700 dark:hover:bg-lime-600 disabled:bg-lime-800/70 geist-font wght-600 transition-colors shadow-sm"
                    >
                      {isLoading.units ? "Saving..." : (addModal ? "Create Unit" : "Save Changes")}
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

export default Units;
