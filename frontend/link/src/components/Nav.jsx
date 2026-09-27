import React from 'react'
import logo from "../assets/logo.png"
import { IoSearchSharp } from "react-icons/io5"
import { AiFillHome } from "react-icons/ai"
import { FaUserFriends, FaBriefcase, FaCommentDots, FaBell } from "react-icons/fa"

function Nav() {
  return (
    <div className='w-full h-[80px] bg-white fixed top-0 left-0 shadow-md flex justify-between items-center px-6 z-50'>
      
      {/* Left Section: Logo & Search Bar */}
      <div className='flex items-center gap-4'>
        <div>
          <img src={logo} alt="Logo" className='w-[50px] h-[50px] object-contain cursor-pointer' />
        </div>
        
        <form className='flex items-center bg-gray-100 rounded-lg px-3 py-2 w-[250px] focus-within:ring-2 focus-within:ring-blue-500'>
          <div className='text-gray-500 mr-2 text-xl'>
            <IoSearchSharp />
          </div>
          <input 
            type="text" 
            placeholder="Search..." 
            className='bg-transparent outline-none text-sm text-gray-700 w-full'
          />
        </form>
      </div>

      {/* Right Section: Navigation Icons/Items */}
      <div className='flex items-center gap-8 text-gray-600 text-sm font-medium'>
        <div className='flex flex-col items-center cursor-pointer hover:text-black transition-colors'>
          <AiFillHome className='text-2xl' />
          <span>Home</span>
        </div>

        <div className='flex flex-col items-center cursor-pointer hover:text-black transition-colors'>
          <FaUserFriends className='text-2xl' />
          <span>My Network</span>
        </div>

        <div className='flex flex-col items-center cursor-pointer hover:text-black transition-colors'>
          <FaBriefcase className='text-2xl' />
          <span>Jobs</span>
        </div>

        <div className='flex flex-col items-center cursor-pointer hover:text-black transition-colors'>
          <FaCommentDots className='text-2xl' />
          <span>Messaging</span>
        </div>

        <div className='flex flex-col items-center cursor-pointer hover:text-black transition-colors'>
          <FaBell className='text-2xl' />
          <span>Notifications</span>
        </div>
      </div>

    </div>
  )
}

export default Nav