import { GrAdd } from "react-icons/gr";
import { PiExam } from "react-icons/pi";
import { CiCalendar } from "react-icons/ci";
import { CiClock2 } from "react-icons/ci";
import { CiMapPin } from "react-icons/ci";
import { AiOutlineClose } from "react-icons/ai";
import {useState} from 'react'
import {motion} from 'framer-motion'

function Events() {
    const [addModal, setAddModal] = useState(false)
    const [typeFilter, setTypeFilter] = useState('All Events')
    const [dateFilter, setDateFilter] = useState("upcoming")
    const data = [
        {
            id: 0,
            title: 'Systems Programming Exam',
            type: 'Event',
            description: 'Exams on topic 1 and 2',
            date: new Date("2025-9-10"),
            time: '10:00 AM',
            location: 'HRD 102'
        },
        {
            id: 0,
            title: 'Systems Programming Exam',
            type: 'Exam',
            description: 'Exams on topic 1 and 2',
            date: new Date("2025-9-10"),
            time: '10:00 AM',
            location: 'HRD 102'
        },
        {
            id: 0,
            title: 'Systems Programming Exam',
            type: 'Assignment',
            description: 'Exams on topic 1 and 2',
            date: new Date("2025-9-10"),
            time: '10:00 AM',
            location: 'HRD 102'
        },
        {
            id: 0,
            title: 'Systems Programming Exam',
            type: 'Exam',
            description: 'Exams on topic 1 and 2',
            date: new Date("2025-9-10"),
            time: '10:00 AM',
            location: 'HRD 102'
        },
    ]

    let upcoming = 5
    let past = 0
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="geist-font flex flex-col min-h-screen gap-5 bg-[#FCFCF8] blur-m pb-25"
    >
      <div className="px-5 py-4 bg-stone-100 sticky top-0">
        <div className="flex justify-center gap-20 items-center relative">
          <h1 className="geist-font wght-700 text-xl">Events</h1>
          <GrAdd
            size={22}
            className="absolute right-0"
            onClick={() => setAddModal((prev) => !prev)}
          />
        </div>
      </div>

      {/* /* typeFilter */}
      <div className="flex gap-3 px-5 pt-1 overflow-x-auto items-center horizontal-scroll snap-x snap-mandatory">
        <p
          className={`border p-3 rounded-xl whitespace-nowrap geist-font wght-600 ${
            typeFilter == "All Events" ? "bg-lime-800 text-gray-200" : ""
          }`}
          onClick={() => setTypeFilter("All Events")}
        >
          All Events
        </p>
        <p
          className={`border p-3 rounded-xl whitespace-nowrap geist-font wght-600 ${
            typeFilter == "Exam" ? "text-red-200 bg-red-600" : ""
          }`}
          onClick={() => setTypeFilter("Exam")}
        >
          Exams
        </p>
        <p
          className={`border p-3 rounded-xl whitespace-nowrap geist-font wght-600 ${
            typeFilter == "Assignment" ? "text-purple-200 bg-purple-600" : ""
          }`}
          onClick={() => setTypeFilter("Assignment")}
        >
          Assignments
        </p>
        <p
          className={`border p-3 rounded-xl whitespace-nowrap geist-font wght-600 ${
            typeFilter == "Event" ? "text-blue-200 bg-blue-600" : ""
          }`}
          onClick={() => setTypeFilter("Event")}
        >
          Events
        </p>
      </div>

      {/* second filter */}
      <div className="flex gap-3 px-5 ">
        <p
          className={`p-2 px-3 rounded-lg text-lime-700 geist-font wght-600 ${
            dateFilter == "upcoming" ? "bg-lime-200" : ""
          }`}
          onClick={() => setDateFilter("upcoming")}
        >
          Upcoming ({upcoming})
        </p>
        <p
          className={`p-2 px-3 rounded-lg text-lime-700 geist-font wght-600 ${
            dateFilter == "past" ? "bg-lime-200" : ""
          }`}
          onClick={() => setDateFilter("past")}
        >
          Past ({past})
        </p>
      </div>

      {/* events body */}
      <div className="px-5 flex flex-col gap-4 lg:grid lg:grid-cols-2">
        {data.map((event) => (
          <div className="flex-col gap-4 gap p-4 rounded-2xl bg-stone-100">
            <p
              className={`p-1 px-3 rounded-xl w-fit text-xs geist-font wght-500 mb-2 ${
                event.type == "Exam"
                  ? "text-red-200 bg-red-600"
                  : event.type == "Assignment"
                  ? "text-purple-200 bg-purple-600"
                  : "text-blue-200 bg-blue-600"
              } `}
            >
              {event.type}
            </p>

            <div className="flex flex-col">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between ">
                  <h1 className="text-2xl geist-font wght-800">
                    {event.title}
                  </h1>
                  <AiOutlineClose size={22} className="text-red-800" />
                </div>
                <p className="text-lg geist-font wght-500 text-gray-700">
                  {event.description}
                </p>
                <div className="flex gap-3 flex-wrap mt-1">
                  <div className="flex items-center gap-2 text-blue-900 geist-font wght-600 ">
                    <CiCalendar size={22} className="font-extrabold" />
                    <p className="text-xs ">
                      {event.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-purple-900 geist-font wght-600">
                    <CiClock2 size={22} />
                    <p className="text-xs">{event.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CiMapPin size={22} className="" />
                    <p className="text-xs">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default Events;
