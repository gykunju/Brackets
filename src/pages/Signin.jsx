import { Link } from "react-router";
import { FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useUser } from '../context/UserContext'
import { useState, useEffect } from 'react'

function Signin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState([])

  const { 
    signIn
  } = useUser()

  async function handleSignIn(e) {
    e.preventDefault()

    const formData = {
      email: email.trim(),
      password: password
    }

    try {
      await signIn(formData)
    } catch (err) {
      throw new Error(err)
    }

  }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white flex items-center justify-center"
    >
      <div className="w-full max-w-md flex flex-col p-6 sm:p-8 gap-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center w-full gap-3"
        >
          <div className="flex items-center gap-2">
            <h1 className="text-5xl geist-font wght-800 text-lime-800">[ ]</h1>
            <h1 className="text-5xl geist-font wght-700 text-lime-800">
              Brackets
            </h1>
          </div>
          <p className="text-xl geist-font wght-500 text-gray-600">
            Welcome Back
          </p>
        </motion.div>

        {/* body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full flex flex-col gap-7"
        >
          {/* form */}
          <motion.form
            onSubmit={handleSignIn}
            className="flex flex-col gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-lg geist-font text-gray-900 border-gray-300 p-3.5 text-base bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all outline-none"
                placeholder="Enter your email"
                type="email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded-lg geist-font text-gray-900 border-gray-300 p-3.5 text-base bg-white/50 focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-all outline-none"
                placeholder="Enter your password"
                type="password"
              />
            </div>
            <Link className="text-center text-lime-800 hover:text-lime-700 transition-colors wght-500 -mt-2">
              Forgot Password?
            </Link>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="geist-font wght-600 text-white p-3.5 rounded-lg bg-lime-800 hover:bg-lime-700 transition-colors shadow-sm"
            >
              Sign In
            </motion.button>
            <Link
              to="/signup"
              className="text-center text-lime-800 hover:text-lime-700 transition-colors wght-500"
            >
              Don't have an account? Sign Up
            </Link>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-center gap-4">
              <hr className="w-full border-gray-200" />
              <span className="text-gray-500 geist-font wght-500 whitespace-nowrap text-sm">
                OR CONTINUE WITH
              </span>
              <hr className="w-full border-gray-200" />
            </div>
          </motion.div>

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
    </motion.div>
  );
}

export default Signin;
