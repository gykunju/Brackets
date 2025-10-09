import { IoMdArrowBack } from "react-icons/io";
import { HiOutlineBell } from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";
import { MdOutlineCameraAlt } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import { useState } from "react";
import { LiaQuestionCircle } from "react-icons/lia";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";

function Profile() {
  const { signOut } = useUser();

  const backPage = () => {
    window.history.back();
  };

  const [mode, setMode] = useState("light");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col pb-25 bg-gradient-to-b from-white to-stone-50/30"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-5 py-4 bg-white/80 backdrop-blur-sm sticky top-0 border-b border-stone-100 z-20"
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => backPage()}
            className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <IoMdArrowBack size={24} className="text-gray-700" />
          </motion.button>
          <h2 className="geist-font wght-700 text-xl text-gray-900">Profile</h2>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </motion.div>

      <div className="p-5 flex flex-col gap-10 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col geist-font items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative group cursor-pointer bg-gradient-to-br from-lime-700 to-lime-900 p-10 rounded-full mb-5 shadow-lg"
          >
            <MdOutlineCameraAlt size={40} className="text-white/90" />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-sm font-medium">
                Change Photo
              </span>
            </motion.div>
          </motion.div>
          <h2 className="geist-font wght-700 text-2xl text-gray-900">
            Alvin Gikunju
          </h2>
          <p className="geist-font wght-500 text-gray-500 mt-1">
            alvingikuju@gmail.com
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="geist-font wght-700 text-lg text-gray-600">
              SETTINGS
            </h2>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl shadow-sm flex flex-col divide-y divide-stone-100">
            <motion.div
              whileHover={{ backgroundColor: "#F5F5F4" }}
              className="flex gap-4 items-center p-4 transition-colors"
            >
              <div className="bg-lime-100 p-3 rounded-lg">
                <HiOutlineBell size={24} className="text-lime-800" />
              </div>
              <div className="flex justify-between w-full items-center">
                <div>
                  <h3 className="geist-font wght-600 text-base text-gray-900">
                    Notifications
                  </h3>
                  <p className="geist-font wght-500 text-sm text-gray-500">
                    Enable or disable notifications
                  </p>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ backgroundColor: "#F5F5F4" }}
              className="flex gap-4 items-center p-4 transition-colors"
            >
              <div className="bg-lime-100 p-3 rounded-lg">
                {mode === "light" ? (
                  <CiLight size={24} className="text-lime-800" />
                ) : (
                  <CiDark size={24} className="text-lime-800" />
                )}
              </div>
              <div className="flex justify-between w-full items-center">
                <div>
                  <h3 className="geist-font wght-600 text-base text-gray-900">
                    App Theme
                  </h3>
                  <p className="geist-font wght-500 text-sm text-gray-500">
                    Choose between light and dark mode
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={() =>
                      setMode(mode === "light" ? "dark" : "light")
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ backgroundColor: "#F5F5F4" }}
              className="flex gap-4 items-center p-4 transition-colors"
            >
              <div className="bg-lime-100 p-3 rounded-lg">
                <GoPerson size={24} className="text-lime-800" />
              </div>
              <div className="flex justify-between w-full items-center">
                <div>
                  <h3 className="geist-font wght-600 text-base text-gray-900">
                    Account
                  </h3>
                  <p className="geist-font wght-500 text-sm text-gray-500">
                    Manage your account details
                  </p>
                </div>
                <motion.button whileHover={{ x: 2 }} className="text-lime-800">
                  <FiArrowRight size={20} />
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ backgroundColor: "#F5F5F4" }}
              className="flex gap-4 items-center p-4 transition-colors"
            >
              <div className="bg-lime-100 p-3 rounded-lg">
                <LiaQuestionCircle size={24} className="text-lime-800" />
              </div>
              <div className="flex justify-between w-full items-center">
                <div>
                  <h3 className="geist-font wght-600 text-base text-gray-900">
                    Help ＆ Support
                  </h3>
                  <p className="geist-font wght-500 text-sm text-gray-500">
                    Get help and support
                  </p>
                </div>
                <motion.button whileHover={{ x: 2 }} className="text-lime-800">
                  <FiArrowRight size={20} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <motion.button
            onClick={() => signOut()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-white hover:bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-4 transition-colors group"
          >
            <div className="bg-red-100 p-3 rounded-lg">
              <MdOutlineLogout size={24} className="text-red-700" />
            </div>
            <p className="text-base geist-font wght-600 text-red-600 group-hover:text-red-700 transition-colors">
              Log Out
            </p>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Profile;
