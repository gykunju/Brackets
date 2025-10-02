import { IoMdArrowBack } from "react-icons/io";
import { LuBookMinus } from "react-icons/lu";
import { Link } from 'react-router'
import { GrFormNext } from "react-icons/gr";
import { GrAdd } from "react-icons/gr";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from 'react'

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
    ]

    const [addModal, setAddModal ] = useState(false)
    const [title, setTitle] = useState()

    const backPage = () => {
        window.history.back()
    }

    const addBracket = (e) => {
        e.preventDefault()
        let bracket={
            title: title,
            date: new Date(),
            active: true
        }
        brackets.push(bracket)
        console.log(brackets)
        setTitle("")
        setAddModal(false)
    }

  return (
    <div className="geist-font flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-5 max-w-6xl mx-auto w-full">
          <div className="flex justify-center gap-20 items-center relative">
            <h1 className="geist-font wght-700 text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Brackets</h1>
            <button
              onClick={() => backPage()}
              className="absolute left-0 p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 hover:from-indigo-200 hover:to-purple-200 transition-colors"
            >
              <IoMdArrowBack size={24} className="text-indigo-600 dark:text-indigo-400" />
            </button>
            <button
              onClick={() => setAddModal((prev) => !prev)}
              className="absolute right-0 p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-colors shadow-lg"
            >
              <GrAdd size={22} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className={`flex flex-col gap-5 p-5 max-w-6xl mx-auto w-full ${addModal && "blur-xs"}`}>
        {brackets.map((bracket) => (
          <Link
            to={`/brackets/${bracket.title}`}
            className="flex gap-5 items-center p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative hover:scale-[1.02]"
          >
            <div className="p-4 border-2 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-transparent shadow-md">
              <LuBookMinus size={32} className="text-white" />
            </div>
            <div className="w-full flex justify-between items-center">
              <div>
                <h3 className="geist-font wght-800 text-xl mb-1">{bracket.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{bracket.date.toLocaleDateString()}</p>
              </div>
              {bracket.active && (
                <span className="mr-5 px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md">
                  current
                </span>
              )}
            </div>
            <GrFormNext className="absolute right-4 text-indigo-400" size={28} />
          </Link>
        ))}
      </div>

      {addModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-5"
          onClick={() => setAddModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <form className="text-center" onSubmit={(e) => addBracket(e)}>
              <div className="flex relative items-center justify-center mb-6">
                <h1 className="geist-font wght-700 text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Add Bracket</h1>
                <button
                  type="button"
                  onClick={() => setAddModal(false)}
                  className="absolute right-0 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <AiOutlineClose size={24} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <input
                id="title"
                placeholder="Enter bracket title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-2 border-indigo-300 dark:border-indigo-600 rounded-xl p-4 mb-6 text-base geist-font wght-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
              <button
                className="geist-font wght-600 w-full rounded-xl p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all shadow-lg hover:shadow-xl"
                type="submit"
              >
                Add Bracket
              </button>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default Brackets;
