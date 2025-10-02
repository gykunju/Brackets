import { IoMdArrowBack } from "react-icons/io";
import { FaGoogle } from "react-icons/fa";
import { useNavigate, Link } from 'react-router'

function Signup() {
    const navigate = useNavigate()

  return (
    <div className="pb-25">
      <div className="flex p-5 items-center justify-center 
      ">
        <IoMdArrowBack
          size={28}
          className="absolute left-5"
          onClick={() => navigate("/")}
        />
        <h2 className="geist-font wght-700 text-xl">Signup</h2>
      </div>


    <div className='lg:flex lg:grid-cols-3 '>
      <div className="px-5 flex  items-center mt-15 lg:text-black text-lime-800  lg:mt-0 lg:w-1/3 lg:items-start pt-4 lg:bg-lime-800">
        <h1 className="text-4xl geist-font wght-800 ">[ ]</h1>
        <h1 className="text-4xl geist-font wght-700">Brackets</h1>
      </div>

      {/* form */}
      <div className="mt-3 p-5 flex flex-col gap-4 lg:col-span-1 lg:mt-0 lg:w-2/3">
        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-lg geist-font wght-500 text-stone-800">
              Email
            </label>
            <input
              type="email"
              className="border rounded-lg geist-font text-gray-900 border-gray-400 p-3 text-lg"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-lg geist-font wght-500 text-stone-800">
              Password
            </label>
            <input
              type="email"
              className="border rounded-lg geist-font text-gray-900 border-gray-400 p-3 text-lg "
              placeholder="Enter your password"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-lg geist-font wght-500 text-stone-800">
              Confirm Password
            </label>
            <input
              type="email"
              className="border rounded-lg geist-font text-gray-900 border-gray-400 p-3 text-lg"
              placeholder="Confirm your password"
            />
          </div>
          <button
            type="submit"
            className="mt-2 py-3 rounded-lg bg-lime-800 text-white geist-font wght-500"
          >
            Sign Up
          </button>
        </form>
        <div className="flex flex-col gap-5">
          <Link to="/signin" className="geist-font text-center text-lime-800">
            Already have an account? Sign In
          </Link>
          <div className="flex flex-row  items-center justify-center">
            <hr className="w-2/5 mr-5 border-gray-400" />
            <p>OR</p>
            <hr className="w-2/5 ml-5 border-gray-400" />
          </div>
            <div className="border p-3 rounded-lg flex justify-center gap-2 border-gray-400 items-center ">
                <FaGoogle size={18} className="" />
                <span className="geist-font wght-700 text-gray-700">Continue with Google</span>
            </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Signup;
