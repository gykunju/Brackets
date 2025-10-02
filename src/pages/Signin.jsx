import { Link } from 'react-router'
import { FaGoogle } from "react-icons/fa";

function Signin() {
    return (
      <div className="min-h-screen border flex items-center">
        <div className="w-full flex flex-col p-5 gap-10">
          <div className="flex flex-col items-center w-full ">
            <div className="flex text-3xl geist-font wght-700 text-lime-800">
              <h1>[ ]</h1>
              <h1>Brackets</h1>
            </div>
            <p className="text-xl geist-font text-gray-600">Welcome Back</p>
          </div>

          {/* body */}
          <div className="w-full flex flex-col gap-7">
            {/* form */}
            <form className="flex flex-col gap-6">
              <input
                className="border-2 p-3 w-full rounded-lg border-gray-400 geist-font wght-500"
                placeholder="Email"
                type="email"
              />
              <input
                className="border-2 p-3 w-full rounded-lg border-gray-400 geist-font wght-500"
                placeholder="Password"
                type="password"
              />
              <Link className="text-center text-lime-800">Forgot Password?</Link>
              <button className="geist-font wght-600 text-white p-3 rounded-lg bg-lime-800">
                Login
              </button>
              <Link to='/signup' className="text-center text-lime-800">Don't have an account? Sign Up</Link>
            </form>

            <div>
              <div className="flex items-center justify-center">
                <hr className="lg:w-1/3 w-1/5 mr-5 border-gray-400" />
                <p className='geist-font text-gray-600'>Or Continue with</p>
                <hr className="lg:w-1/3 w-1/5 ml-5 border-gray-400" />
              </div>
            </div>
            <div className="border p-3 rounded-lg flex justify-center gap-2 border-gray-400 items-center ">
                <FaGoogle size={18} className="" />
                <span className="geist-font wght-700 text-gray-700">Continue with Google</span>
            </div>  
          </div>
        </div>
      </div>
    );
}

export default Signin