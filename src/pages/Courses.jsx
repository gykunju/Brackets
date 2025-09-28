import { IoMdArrowBack } from "react-icons/io";
import { useLocation } from 'react-router'
import { LuNotebookText } from "react-icons/lu";
import { GrFormNext } from "react-icons/gr";
import { GrAdd } from "react-icons/gr";


function Courses() {
  const backPage = () => {
    window.history.back();
  };

  const courses = [
    {
      title: "Systems Programming",
      items: 10,
    },
    {
      title: "Data Analysis",
      items: 5,
    },
    {
      title: "Statistics",
      items: 5,
    },
    {
      title: "Calculus 2",
      items: 8,
    },
    {
      title: "Mathematics for Science",
      items: 4,
    },
    {
      title: "Data Analysis",
      items: 5,
    },
    {
      title: "Statistics",
      items: 5,
    },
    {
      title: "Calculus 2",
      items: 8,
    },
    {
      title: "Mathematics for Science",
      items: 4,
    },
    {
      title: "Data Analysis",
      items: 5,
    },
    {
      title: "Statistics",
      items: 5,
    },
    {
      title: "Calculus 2",
      items: 8,
    },
    {
      title: "Mathematics for Science",
      items: 4,
    },

  ];

  const location = useLocation()
  const bracket = location.pathname.replace("%20", " ").replace("/brackets/", "")

  return (
    <div className="geist-font flex flex-col min-h-screen gap-5 bg-[#FCFCF8]">
      <div className="p-5 bg-stone-100">
        <div className="flex justify-center gap-20 items-center relative">
          <h1 className="geist-font wght-700 text-xl">{bracket}</h1>
          <IoMdArrowBack
            size={28}
            className="absolute left-0"
            onClick={() => backPage()}
          />
        </div>
      </div>

      <div className="flex flex-col p-5 gap-5 rounded-lg">
        {courses.map((course) => (
          <div className="flex items-center gap-5 relative">
            <div className="p-3 rounded-lg bg-stone-800">
              <LuNotebookText size={28} className="text-white" />
            </div>
            <div className="">
              <h3 className="geist-font wght-600 text-lg">{course.title}</h3>
              <p className="text-lime-800">{course.items} items</p>
            </div>
            <GrFormNext className="absolute right-0 text-gray-500" size={24} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
