import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import dp from "../assets/logo.png";
import { UserContext } from "../context/userContext";
import { FaPencil } from "react-icons/fa6";
import EditProfile from "../components/EditProfile";

function Home() {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const [edit, setEdit] = useState(false);

  return (
    <div className="w-full min-h-[100vh] bg-[#f0efe7] pt-[100px] flex items-start justify-center gap-[20px] px-[20px] flex-col lg:flex-row">
      <Nav />
      {edit && <EditProfile setEdit={setEdit} />}

      {/* Left Sidebar Profile Widget */}
      <div className="w-full lg:w-[25%] bg-white shadow-lg rounded-lg p-[10px] relative flex flex-col items-center text-center">
        {/* Cover Image */}
        <div 
          className="w-full h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center cursor-pointer" 
          onClick={() => setEdit(true)}
        >
          <img
            src={userData?.coverUrl || ""}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Picture */}
        <div 
          className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center relative -mt-[35px] border-2 border-white bg-white shadow-md cursor-pointer"
          onClick={() => setEdit(true)}
        >
          <img
            src={userData?.profileUrl || dp}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>

        {/* User Info */}
        <div className="mt-2 w-full px-2">
          <h2 className="font-semibold text-gray-800 text-lg">
            {userData ? `${userData.firstName} ${userData.lastName}` : "User"}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            @{userData?.userName || "username"}
          </p>

          <hr className="my-3 border-gray-200" />

          {/* Edit Profile Button */}
          <button
            onClick={() => setEdit(true)}
            className="w-full py-2 px-4 bg-[#0a66c2] text-white font-semibold rounded-full hover:bg-[#004182] transition duration-200 shadow-sm flex items-center justify-center gap-2"
          >
            <span>Edit Profile</span>
            <FaPencil />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;