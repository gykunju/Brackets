import { IoMdArrowBack } from "react-icons/io";
import { FaGoogle } from "react-icons/fa";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { useUser } from '../context/UserContext'
import { useState, useEffect } from 'react'

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  const { signUp, isLoggedIn } = useUser(); 
  console.log(isLoggedIn)

  async function handleSignUp(e) {
    e.preventDefault()

    console.log(fullName.split(" ")[1])

    const formData = {
      email: email.trim(),
      password: password,
      options: {
        data: {
          first_name: fullName.trim().split(" ")[0],
          last_name: fullName.trim().split(" ")[1] ? fullName.trim().split(" ")[1] : ""
          }
      }
    }

    try {
      await signUp(formData)
    } catch (err) {
      throw new Error(err)
    }
  }




  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white "
    >
      <div className="lg:flex lg:min-h-screen">
        <div className="px-4 flex items-center mt-10 lg:text-white text-lime-800 lg:mt-0 lg:w-1/3 lg:items-center lg:justify-center lg:bg-lime-800 lg:py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <h1 className="text-5xl geist-font wght-800">[ ]</h1>
            <h1 className="text-5xl geist-font wght-700">Brackets</h1>
          </motion.div>
        </div>

        {/* form */}
        <div className="mt-3 p-5 lg:p-10 flex flex-col gap-4 lg:mt-0 lg:w-2/3 lg:justify-center lg:max-w-xl lg:mx-auto">

          <div className="flex items-center justify-center relative ">
            <motion.div whileHover={{  }} whileTap={{ scale: 0.95 }} className='flex items-center'>
              <IoMdArrowBack
                size={28}
                className="absolute left-0 text-gray-700 cursor-pointer hover:text-lime-800 transition-colors"
                onClick={() => navigate("/")}
              />
            </motion.div>
            <h2 className="geist-font wght-700 text-xl text-gray-900">
              Sign Up
            </h2>
          </div>

          <motion.form
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSignUp}
          >
            <div className="flex flex-col gap-1">
              <label className="text-base geist-font wght-600 text-gray-700">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="border rounded-lg geist-font text-gray-900 border-gray-300 p-3 text-base bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all"
                placeholder="Enter your email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-base geist-font wght-600 text-gray-700">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                className="border rounded-lg geist-font text-gray-900 border-gray-300 p-3 text-base bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all"
                placeholder="Enter your full name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-base geist-font wght-600 text-gray-700">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="border rounded-lg geist-font text-gray-900 border-gray-300 p-3 text-base bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all"
                placeholder="Create a password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-base geist-font wght-600 text-gray-700">
                Confirm Password
              </label>
              <input
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                type="password"
                className="border rounded-lg geist-font text-gray-900 border-gray-300 p-3 text-base bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all"
                placeholder="Confirm your password"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-2 py-3.5 rounded-lg bg-lime-800 text-white geist-font wght-600 hover:bg-lime-700 transition-colors shadow-sm"
            >
              Create Account
            </motion.button>
          </motion.form>

          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/signin"
              className="geist-font text-center text-lime-800 hover:text-lime-700 transition-colors wght-500"
            >
              Already have an account? Sign In
            </Link>
            <div className="flex items-center justify-center gap-4">
              <hr className="w-full border-gray-200" />
              <span className="text-gray-500 geist-font wght-500 whitespace-nowrap text-sm">
                OR CONTINUE WITH
              </span>
              <hr className="w-full border-gray-200" />
            </div>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="border p-3.5 rounded-lg flex justify-center gap-3 border-gray-300 items-center hover:border-gray-400 transition-colors cursor-pointer bg-white/50"
            >
              <FaGoogle size={20} className="text-gray-700" />
              <span className="geist-font wght-600 text-gray-700">
                Continue with Google
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Signup;
