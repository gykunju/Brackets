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
    <div className="geist-font flex flex-col min-h-screen gap-5 bg-[#FCFCF8] blur-m">
      <div className="p-5 bg-stone-100 sticky top-0">
        <div className="flex justify-center gap-20 items-center relative">
          <h1 className="geist-font wght-700 text-xl">Brackets</h1>
          <IoMdArrowBack
            size={28}
            className="absolute left-0"
            onClick={() => backPage()}
          />
          <GrAdd
            size={25}
            className="absolute right-0"
            onClick={() => setAddModal((prev) => !prev)}
          />
        </div>
      </div>

      <div className={`flex flex-col gap-5 px-5 ${addModal && "blur-xs"}`}>
        {brackets.map((bracket) => (
          <Link
            to={`/brackets/${bracket.title}`}
            className="flex gap-4 items-center p-4 rounded-md shadow-md bg-stone-100 relative"
          >
            <div className="p-3 border rounded-lg bg-gray-200">
              <LuBookMinus size={28} />
            </div>
            <div className="w-full flex justify-between items-center">
              <div>
                <h3 className="geist-font wght-800 text-xl">{bracket.title}</h3>
                <p>{bracket.date.toLocaleDateString()}</p>
              </div>
              {bracket.active && (
                <span className="mr-5 p-1 px-3 rounded-3xl text-sm bg-amber-500 ">
                  current
                </span>
              )}
            </div>
            <GrFormNext className="absolute right-0 text-gray-500" size={24} />
          </Link>
        ))}
      </div>

      {addModal && (
        <div
    className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50"
    onClick={() => setAddModal(false)} // clicking backdrop closes modal
  >
        <div className="flex flex-row items-center justify-center w-fit self-center place-self-center border-3 text-lime-800 bg-[#FCFCF8] rounded-xl bottom-50 top-10 left-10 right-10 h-45 p-5">
          <form className="text-center p-3" onSubmit={(e) => addBracket(e)}>
            <div className="flex relative items-center justify-center mb-4">
              <h1 className="geist-font wght-700 text-lg">Add Bracket</h1>
              <AiOutlineClose
                size={24}
                className="absolute right-1 border"
                onClick={() => setAddModal(false)}
              />
            </div>
            <input
              id="title"
              placeholder="Add Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-b-2 p-1 px-2 mb-4 text-x geist-font wght-500 focus:outline-none focus:ring-0"
            />
            <button
              className="geist-font wght-600 border w-full rounded-md p-1 hover:bg-lime-800  hover:text-[#FCFCF8]"
              type="submit"
            >
              Add
            </button>
          </form>
        </div>
    </div>
      )}
      
    </div>
  );
}

export default Brackets;
