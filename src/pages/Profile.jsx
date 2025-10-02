import { IoMdArrowBack } from "react-icons/io";
import { HiOutlineBell } from "react-icons/hi2";

function Profile() {
  return (
    <div className='flex flex-col items-center'>
      <div
        className="flex p-5 items-center justify-center"
      >
        <IoMdArrowBack
          size={28}
          className="absolute left-5"
          onClick={() => navigate("/")}
        />
        <h2 className="geist-font wght-700 text-xl">Profile</h2>
      </div>

      <div className='p-5 border flex flex-col gap-10'>
        <div className='border flex flex-col geist-font items-center'>
            <h2 className='geist-font wght-700 text-xl'>Alvin Gikunju</h2>
            <p className='geist-font wght-500 text-gray-500'>alvingikuju@gmail.com</p>
        </div>

        <div className='border p-2'>
            <div className='flex gap-5 items-center justify-between'>
                <div className='bg-lime-100 p-3 rounded-lg'>
                    <HiOutlineBell size={30} className='text-lime-800'/>
                </div>
                <div>
                    <h2 className='geist-font wght-600 text-xl text-gray-900'>Notifications</h2>
                    <p className='geist-font wght-500 text-gray-500'>Enable or disable notifications</p>
                </div>
                <label class="switch">
                    <input type="checkbox"/>
                    <span class="slider round"></span>
                </label>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
