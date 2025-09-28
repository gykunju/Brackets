import { IoMdArrowBack } from "react-icons/io";
import { LuBookMinus } from "react-icons/lu";
import { Link } from 'react-router'
import { GrFormNext } from "react-icons/gr";
import { GrAdd } from "react-icons/gr";


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

    const backPage = () => {
        window.history.back()
    }

  return (
    <div className="geist-font flex flex-col min-h-screen gap-5 bg-[#FCFCF8]">
      <div className="p-5 bg-stone-100">
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
            onClick={() => backPage()}
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 px-5">
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
    </div>
  );
}

export default Brackets;
