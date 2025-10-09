import { IoMdArrowBack } from "react-icons/io";
import { HiOutlineBell } from "react-icons/hi2";
import { MdOutlineCameraAlt } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import {useState} from 'react'
import { LiaQuestionCircle } from "react-icons/lia";
import {motion} from 'framer-motion'
import { useUser } from '../context/UserContext'

function Profile() {

  const { signOut } = useUser()

  const backPage = () => {
    window.history.back()
  }

  const [mode, setMode ] = useState("light")

  return (
    <motion.div
    initial={{ y: -100}}
    animate={{ y: 1}}
    exit={{ y: 200}}
    className="flex flex-col pb-25">
      <div className="flex p-5 items-center justify-center">
        <IoMdArrowBack
          size={28}
          className="absolute left-5"
          onClick={() => backPage()}
        />
        <h2 className="geist-font wght-700 text-xl">Profile</h2>
      </div>

      <div className="p-5 flex flex-col gap-10">
        <div className="flex flex-col geist-font items-center">
          <div className="items-center p-10 rounded-full mb-5 bg-lime-800">
            <MdOutlineCameraAlt size={40} className="text-gray-200" />
          </div>
          <h2 className="geist-font wght-700 text-xl">Alvin Gikunju</h2>
          <p className="geist-font wght-500 text-gray-500">
            alvingikuju@gmail.com
          </p>
        </div>

        <div className="lg:px-50">
          <h1 className="geist-font wght-700 text-lg text-gray-600 mb-2">
            SETTINGS
          </h1>
          <div className="bg-stone-100 rounded-lg p-2 px-4  lg:p-5 flex flex-col gap-5">
            <div className="flex gap-5 items-center">
              <div className="bg-lime-100 p-3 rounded-lg">
                <HiOutlineBell size={30} className="text-lime-800" />
              </div>
              <div className="flex justify-between w-full items-center">
                <div>
                  <h2 className="geist-font wght-600 text-xl text-gray-900">
                    Notifications
                  </h2>
                  <p className="geist-font wght-500 text-gray-500">
                    Enable or disable notifications
                  </p>
                </div>
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider round"></span>
                </label>
              </div>
            </div>

            <div className="flex gap-5 items-center">
              <div className="bg-lime-100 p-3 rounded-lg">
                {mode == "light" ? (
                  <CiLight size={30} className="text-lime-800" />
                ) : (
                  <CiDark size={30} className="text-lime-800" />
                )}{" "}
              </div>
              <div className="flex justify-between w-full items-center">
                <div>
                  <h2 className="geist-font wght-600 text-xl text-gray-900">
                    App Theme
                  </h2>
                  <p className="geist-font wght-500 text-gray-500">
                    Choose between light and dark mode
                  </p>
                </div>
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider round"></span>
                </label>
              </div>
            </div>

            <div className="flex gap-5 items-center">
              <div className="bg-lime-100 p-3 rounded-lg">
                <GoPerson size={30} className="text-lime-800" />
              </div>
              <div className="flex justify-between items-center w-full">
                <div>
                  <h2 className="geist-font wght-600 text-xl text-gray-900">
                    Account
                  </h2>
                  <p className="geist-font wght-500 text-gray-500">
                    Manage your account details
                  </p>
                </div>
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider round"></span>
                </label>
              </div>
            </div>

            <div className="flex gap-5 items-center">
              <div className="bg-lime-100 p-3 rounded-lg">
                <LiaQuestionCircle size={30} className="text-lime-800" />
              </div>
              <div className="flex justify-between w-full items-center">
                <div>
                  <h2 className="geist-font wght-600 text-xl text-gray-900">
                    Help ＆ Support
                  </h2>
                  <p className="geist-font wght-500 text-gray-500">
                    Get help and support
                  </p>
                </div>
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:px-50 ">
          <div className="bg-stone-100 p-5 flex items-center gap-5 rounded-lg">
            <button onClick={() => signOut()} className='flex items-center gap-5'>
              <div className=" bg-red-200 p-3 rounded-lg">
                <MdOutlineLogout size={30} className="text-red-800" />
              </div>
              <p className="text-xl geist-font wght-600 text-red-700">Log Out</p>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;
