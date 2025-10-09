import { IoMdArrowBack } from "react-icons/io";
import { useLocation, useParams } from "react-router";
import { LuNotebookText } from "react-icons/lu";
import { GrFormNext } from "react-icons/gr";
import { GrAdd } from "react-icons/gr";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

function Units() {
  const { units, brackets, supabase } = useUser();
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const backPage = () => {
    window.history.back();
  };

  const location = useLocation();
  const bracketTitle = location.pathname
    .replace("%20", " ")
    .replace("/brackets/", "");

  // Find the current bracket
  const currentBracket = brackets.find((b) => b.title === bracketTitle);

  // Fetch units for the current bracket
  useEffect(() => {
    async function fetchUnits() {
      if (!currentBracket) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("unit")
          .select("*")
          .eq("bracket_id", currentBracket.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setFilteredUnits(data || []);
      } catch (error) {
        console.error("Error fetching units:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUnits();

    // Subscribe to changes in units for this bracket
    const unitsSubscription = supabase
      .channel("units_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "unit",
          filter: `bracket_id=eq.${currentBracket?.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setFilteredUnits((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setFilteredUnits((prev) =>
              prev.filter((unit) => unit.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            setFilteredUnits((prev) =>
              prev.map((unit) =>
                unit.id === payload.new.id ? payload.new : unit
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      if (unitsSubscription) unitsSubscription.unsubscribe();
    };
  }, [currentBracket?.id]);

  // Handle adding a new unit
  const addUnit = async (e) => {
    e.preventDefault();
    if (!currentBracket) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("unit")
        .insert([
          {
            title,
            description,
            bracket_id: currentBracket.id,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setTitle("");
      setDescription("");
      setAddModal(false);
    } catch (error) {
      console.error("Error adding unit:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
            onClick={() => backPage()}
          >
            <IoMdArrowBack size={22} className="text-gray-700" />
          </motion.button>

          <h1 className="geist-font wght-700 text-xl text-gray-900">
            {bracketTitle}
          </h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
            onClick={() => setAddModal(true)}
          >
            <GrAdd size={22} className="text-gray-700" />
          </motion.button>
        </div>
      </motion.div>

      {/* Units Grid */}
      <div
        className={`max-w-4xl mx-auto w-full px-5 py-6 ${
          addModal ? "blur-sm" : ""
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-800" />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredUnits.map((unit, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                key={unit.id}
                className="group cursor-pointer"
              >
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-lime-200 transition-all relative overflow-hidden">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-lime-50 to-stone-100 border border-lime-200">
                    <LuNotebookText size={24} className="text-lime-800" />
                  </div>

                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <div className="flex flex-col gap-0.5">
                      <h3 className="geist-font wght-600 text-base text-gray-900 truncate pr-8">
                        {unit.title}
                      </h3>
                      {unit.description && (
                        <p className="text-sm text-gray-500 geist-font wght-500 truncate pr-8">
                          {unit.description}
                        </p>
                      )}
                    </div>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 group-hover:bg-lime-50 transition-colors">
                        <GrFormNext
                          size={20}
                          className="text-gray-400 group-hover:text-lime-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredUnits.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="p-4 rounded-full bg-stone-100 mb-4">
              <LuNotebookText size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Units Yet
            </h3>
            <p className="text-gray-600 mb-6">
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

      {/* Add Unit Modal */}
      <AnimatePresence>
        {addModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50"
              onClick={() => setAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 bottom-4 top-auto md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-sm z-50"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
                <form className="flex flex-col" onSubmit={addUnit}>
                  <div className="flex items-center justify-between p-4 border-b border-stone-200">
                    <h2 className="geist-font wght-700 text-lg text-gray-900">
                      Add Unit
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setAddModal(false)}
                      className="p-1 rounded-lg hover:bg-stone-100 text-gray-500 transition-colors"
                    >
                      <AiOutlineClose size={20} />
                    </motion.button>
                  </div>

                  <div className="p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="title"
                        className="text-sm text-gray-700 geist-font wght-600"
                      >
                        Unit Title
                      </label>
                      <input
                        id="title"
                        placeholder="Enter unit title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isLoading}
                        className="w-full p-3 rounded-lg border border-stone-200 text-base geist-font wght-500 bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all disabled:bg-stone-50 disabled:text-gray-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="description"
                        className="text-sm text-gray-700 geist-font wght-600"
                      >
                        Description (Optional)
                      </label>
                      <textarea
                        id="description"
                        placeholder="Enter unit description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isLoading}
                        rows={3}
                        className="w-full p-3 rounded-lg border border-stone-200 text-base geist-font wght-500 bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all disabled:bg-stone-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 border-t border-stone-200">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setAddModal(false)}
                      className="flex-1 py-2.5 px-4 rounded-lg border border-stone-200 text-gray-700 hover:bg-stone-50 geist-font wght-600 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: isLoading ? 1 : 1.01 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      type="submit"
                      disabled={isLoading || !title.trim()}
                      className="flex-1 py-2.5 px-4 rounded-lg bg-lime-800 text-white hover:bg-lime-700 disabled:bg-lime-800/70 geist-font wght-600 transition-colors shadow-sm"
                    >
                      {isLoading ? "Creating..." : "Create Unit"}
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
