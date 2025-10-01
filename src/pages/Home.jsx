import { FiSettings } from "react-icons/fi";
import { MdOutlineAssignmentLate } from "react-icons/md";
import { PiExam } from "react-icons/pi";


function Home() {
  const current_courses = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJvb2t8ZW58MHx8MHx8fDA%3D",
      title: "Calculus II",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3N8ZW58MHx8MHx8fDA%3D",
      title: "World History",
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D",
      title: "Bio-Engineering",
    },
    {
      id: 4,
      img: "https://images.unsplash.com/photo-1705721357357-ab87523248f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvb2tzfGVufDB8fDB8fHww",
      title: "Systems Programming",
    },
  ];

  const upcoming_events = [
    {
        event: 'systems programming ',
        type: 'exam',
        date: new Date("2025-09-27")
    },
    {
        event: 'Programming ',
        type: 'assignment',
        date: new Date("2025-09-25")
    },
    {
        event: 'Cat 1',
        type: 'exam',
        date: new Date("2025-09-24")
    },
    {
        event: 'Cat 1',
        type: 'exam',
        date: new Date("2025-09-25")
    },
  ]

  return (
    <div className="min-h-screen p-5 geist-font flex flex-col gap-10">
      {/* Header */}
      <div className="flex justify-center gap-20 items-center relative">
        <h1 className="geist-font wght-700 text-xl">Home</h1>
        <FiSettings size={25} className="absolute right-1" />
      </div>

      {/* Current Courses */}
      <div className="flex flex-col">
        <h1 className="text-2xl geist-font wght-600">Current Courses</h1>

        {/* Horizontal scroll row: snap + fixed-width cards */}
        <div className="mt-1">
          <div className="flex gap-6 overflow-x-auto py-2 horizontal-scroll snap-x snap-mandatory">
            {current_courses.map((course) => (
              <div
                key={course.id}
                className="course-card snap-center w-64 flex-shrink-0 bg-white/5 dark:bg-transparent rounded-lg shadow-sm overflow-hidden flex flex-col items-center text-center p-3"
                tabIndex={0}
                aria-label={course.title}
              >
                <div className="w-full h-40 overflow-hidden rounded-md">
                  <img
                    src={course.img}
                    alt={`${course.title} cover`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-3 text-sm font-medium">{course.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}

      <div>
        <h1 className="geist-font wght-600 text-2xl">Upcoming Events</h1>
        <div className="flex flex-col gap-5 mt-4">
          {upcoming_events.map((event) => (
            <div className="flex items-center gap-4" key={event.id}>
              <div className="p-3 rounded-lg bg-lime-100">
                {event.type == "assignment" ? (
                  <MdOutlineAssignmentLate size={26} />
                ) : (
                  <PiExam size={26} />
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="geist-font wght-600 text-lg">
                  {event.event}
                </h3>
                <p className="text-lime-800">
                  {event.date.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
