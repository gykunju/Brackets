import { IoMdArrowBack } from "react-icons/io";
import { LuBookMinus } from "react-icons/lu";
import { Link } from "react-router";
import { GrFormNext } from "react-icons/gr";
import { GrAdd } from "react-icons/gr";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

function Brackets() {
  const brackets = [
    {
      title: "Semester 1",
      date: new Date("2025-09-27"),
      active: true,
    },
    {
      title: "Semester 2",
      date: new Date("2025-09-27"),
      active: true,
    },
    {
      title: "Semester 3",
      date: new Date("2025-09-27"),
      active: false,
    },
    {
      title: "Semester 4",
      date: new Date("2025-09-27"),
      active: false,
    },
  ];

  const [addModal, setAddModal] = useState(false);
  const [title, setTitle] = useState();

  const backPage = () => {
    window.history.back();
  };

  const addBracket = (e) => {
    e.preventDefault();
    let bracket = {
      title: title,
      date: new Date(),
      active: true,
    };
    brackets.push(bracket);
    console.log(brackets);
    setTitle("");
    setAddModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="geist-font flex flex-col min-h-screen bg-gradient-to-b from-white to-stone-50/30"
    >
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
            Brackets
          </h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
            onClick={() => setAddModal((prev) => !prev)}
          >
            <GrAdd size={22} className="text-gray-700" />
          </motion.button>
        </div>
      </motion.div>

      <div className={`flex-1 py-6 px-5 ${addModal ? "blur-sm" : ""}`}>
        <div className="max-w-4xl mx-auto grid gap-4">
          {brackets.map((bracket, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              key={bracket.title}
            >
              <Link
                to={`/brackets/${bracket.title}`}
                className="group flex gap-4 items-center p-5 rounded-xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-lime-200 transition-all relative overflow-hidden"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-lime-50 to-stone-100 border border-lime-200">
                  <LuBookMinus size={24} className="text-lime-800" />
                </div>

                <div className="flex-1 flex justify-between items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="geist-font wght-700 text-lg text-gray-900">
                      {bracket.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {bracket.date.toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {bracket.active && (
                      <span className="px-3 py-1 rounded-full text-sm bg-gradient-to-r from-lime-500 to-lime-600 text-white shadow-sm geist-font wght-600">
                        Current
                      </span>
                    )}
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-50 group-hover:bg-lime-50 transition-colors">
                      <GrFormNext
                        size={20}
                        className="text-gray-400 group-hover:text-lime-700"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

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
                <form className="flex flex-col" onSubmit={(e) => addBracket(e)}>
                  <div className="flex items-center justify-between p-4 border-b border-stone-200">
                    <h2 className="geist-font wght-700 text-lg text-gray-900">
                      Add Bracket
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

                  <div className="p-4">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="title"
                        className="text-sm text-gray-700 geist-font wght-600"
                      >
                        Bracket Title
                      </label>
                      <input
                        id="title"
                        placeholder="Enter bracket title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 rounded-lg border border-stone-200 text-base geist-font wght-500 bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all"
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
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 py-2.5 px-4 rounded-lg bg-lime-800 text-white hover:bg-lime-700 geist-font wght-600 transition-colors shadow-sm"
                    >
                      Create Bracket
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

export default Brackets;
