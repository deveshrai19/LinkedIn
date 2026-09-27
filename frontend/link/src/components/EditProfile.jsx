import React, { useContext, useState, useRef } from 'react';
import { RxCross1 } from "react-icons/rx";
import { UserContext } from '../context/userContext';
import { FiPlus, FiCamera } from "react-icons/fi";
import axios from 'axios';

// Default placeholder image fallback
const dp = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function EditProfile({ setEdit }) {
  const { userData, setUserData } = useContext(UserContext);

  let [firstName, setFirstName] = useState(userData?.firstName || "");
  let [lastName, setLastName] = useState(userData?.lastName || "");
  let [userName, setUserName] = useState(userData?.userName || "");
  let [headline, setHeadline] = useState(userData?.headline || "");
  let [location, setLocation] = useState(userData?.location || "");
  let [gender, setGender] = useState(userData?.gender || "");

  // State for Skills
  let [skills, setSkills] = useState(userData?.skills || []);
  let [newSkills, setNewSkills] = useState("");

  // State for Education
  let [education, setEducation] = useState(userData?.education || []);
  let [college, setCollege] = useState("");
  let [degree, setDegree] = useState("");
  let [fieldOfStudy, setFieldOfStudy] = useState("");

  // State for Experience
  let [experience, setExperience] = useState(userData?.experience || []);
  let [title, setTitle] = useState("");
  let [company, setCompany] = useState("");
  let [description, setDescription] = useState("");

  // Image States & Refs
  let [frontendProfileImage, setFrontendProfileImage] = useState(userData?.profileImage || dp);
  let [backendProfileImage, setBackendProfileImage] = useState(null);
  let [frontendCoverImage, setFrontendCoverImage] = useState(userData?.coverImage || dp);
  let [backendCoverImage, setBackendCoverImage] = useState(null);

  const profileImage = useRef(null);
  const coverImage = useRef(null);

  // Handlers for Image Selection
  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => setFrontendProfileImage(reader.result || dp);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendCoverImage(file);
      const reader = new FileReader();
      reader.onload = () => setFrontendCoverImage(reader.result || dp);
      reader.readAsDataURL(file);
    }
  };

  // Handlers for Skills
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkills.trim() !== "") {
      setSkills([...skills, newSkills.trim()]);
      setNewSkills("");
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
  };

  // Handlers for Education
  const handleAddEducation = (e) => {
    e.preventDefault();
    if (college.trim() !== "" || degree.trim() !== "" || fieldOfStudy.trim() !== "") {
      const newEduEntry = {
        college: college.trim(),
        degree: degree.trim(),
        fieldOfStudy: fieldOfStudy.trim()
      };
      setEducation([...education, newEduEntry]);
      setCollege("");
      setDegree("");
      setFieldOfStudy("");
    }
  };

  const handleRemoveEducation = (indexToRemove) => {
    setEducation(education.filter((_, index) => index !== indexToRemove));
  };

  // Handlers for Experience
  const handleAddExperience = (e) => {
    e.preventDefault();
    if (title.trim() !== "" || company.trim() !== "" || description.trim() !== "") {
      const newExpEntry = {
        title: title.trim(),
        company: company.trim(),
        description: description.trim()
      };
      setExperience([...experience, newExpEntry]);
      setTitle("");
      setCompany("");
      setDescription("");
    }
  };

  const handleRemoveExperience = (indexToRemove) => {
    setExperience(experience.filter((_, index) => index !== indexToRemove));
  };

  // Save Profile Handler
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    try {
      let formdata = new FormData();
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("userName", userName);
      formdata.append("headline", headline);
      formdata.append("location", location);
      formdata.append("gender", gender);

      formdata.append("skills", JSON.stringify(skills));
      formdata.append("education", JSON.stringify(education));
      formdata.append("experience", JSON.stringify(experience));

      if (backendProfileImage) {
        formdata.append("profileImage", backendProfileImage);
      }

      if (backendCoverImage) {
        formdata.append("coverImage", backendCoverImage);
      }

      const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

      const response = await axios.put(`${BASE_URL}/api/v1/user/updateProfile`, formdata, {
        withCredentials: true,
      });

      if (response.data?.user && setUserData) {
        setUserData(response.data.user);
      }

      setEdit(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className='w-full h-[100vh] fixed top-0 left-0 z-[100] flex justify-center items-center'>
      {/* Backdrop */}
      <div 
        className='w-full h-full bg-black opacity-[0.5] absolute top-0 left-0' 
        onClick={() => setEdit(false)}
      ></div>

      {/* Hidden File Inputs */}
      <input 
        type="file" 
        accept='image/*' 
        hidden 
        ref={profileImage}
        onChange={handleProfileImage}
      />
      <input 
        type="file" 
        accept='image/*' 
        hidden 
        ref={coverImage}
        onChange={handleCoverImage}
      />

      {/* Modal Container */}
      <div className='w-[90%] max-w-[500px] h-[600px] bg-white relative z-[200] shadow-lg rounded-lg p-[20px] overflow-y-auto'>
        {/* Close Button */}
        <div 
          className='absolute top-[20px] right-[20px] cursor-pointer z-10' 
          onClick={() => setEdit(false)}
        >
          <RxCross1 className='w-[25px] h-[25px] text-gray-800 font-bold' />
        </div>

        {/* Cover Photo Area */}
        <div 
          className='w-full h-[150px] bg-gray-500 rounded-lg mt-[20px] relative overflow-hidden cursor-pointer' 
          onClick={() => coverImage.current.click()}
        >
          <img src={frontendCoverImage || dp} alt="Cover" className='w-full h-full object-cover' />
          <FiCamera className='absolute right-[15px] top-[15px] w-[25px] h-[25px] text-blue-500 cursor-pointer'/>
        </div>

        {/* Profile Picture Area */}
        <div className='relative -mt-[40px] ml-[20px] w-[80px] h-[80px]'>
          <div 
            className='w-[80px] h-[80px] rounded-full overflow-hidden border-2 border-white bg-gray-200 cursor-pointer' 
            onClick={() => profileImage.current.click()}
          >
            <img src={frontendProfileImage || dp} alt="Profile" className='w-full h-full object-cover' />
          </div>
          <div 
            className='w-[22px] h-[22px] bg-[#17c1ff] absolute bottom-[2px] right-[2px] rounded-full flex justify-center items-center cursor-pointer'
            onClick={() => profileImage.current.click()}
          >
            <FiPlus className='text-white text-[14px]' />
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSaveProfile} className='w-full flex flex-col items-center justify-center gap-[15px] mt-[20px]'>
          <input 
            type="text" 
            placeholder='firstName' 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className='w-full h-[45px] outline-none border-gray-400 px-[10px] py-[5px] text-[16px] border-2 rounded-lg'
          />
          <input 
            type="text" 
            placeholder='lastName' 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className='w-full h-[45px] outline-none border-gray-400 px-[10px] py-[5px] text-[16px] border-2 rounded-lg'
          />
          <input 
            type="text" 
            placeholder='userName' 
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className='w-full h-[45px] outline-none border-gray-400 px-[10px] py-[5px] text-[16px] border-2 rounded-lg'
          />
          <input 
            type="text" 
            placeholder='headline' 
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className='w-full h-[45px] outline-none border-gray-400 px-[10px] py-[5px] text-[16px] border-2 rounded-lg'
          />
          <input 
            type="text" 
            placeholder='location' 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className='w-full h-[45px] outline-none border-gray-400 px-[10px] py-[5px] text-[16px] border-2 rounded-lg'
          />
          <input 
            type="text" 
            placeholder='gender (male/female/other)' 
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className='w-full h-[45px] outline-none border-gray-400 px-[10px] py-[5px] text-[16px] border-2 rounded-lg'
          />

          {/* Skills Section */}
          <div className='w-full flex flex-col gap-2'>
            <h1 className='text-lg font-semibold'>Skills</h1>
            <div className='flex flex-wrap gap-2'>
              {skills && skills.map((skill, index) => (
                <div key={index} className='bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center gap-2'>
                  <span>{skill}</span>
                  <RxCross1 
                    className='cursor-pointer text-xs text-red-500' 
                    onClick={() => handleRemoveSkill(index)} 
                  />
                </div>
              ))}
            </div>

            <div className='flex gap-2 mt-2'>
              <input 
                type="text" 
                placeholder='add new skill' 
                value={newSkills} 
                onChange={(e) => setNewSkills(e.target.value)}
                className='flex-1 h-[40px] outline-none border-gray-400 px-[10px] text-[14px] border-2 rounded-lg'
              />
              <button 
                type="button" 
                onClick={handleAddSkill}
                className='px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all'
              >
                Add
              </button>
            </div>
          </div>

          {/* Education Section */}
          <div className='w-full flex flex-col gap-2 mt-2'>
            <h1 className='text-lg font-semibold'>Education</h1>

            <div className='flex flex-col gap-2'>
              {education && education.map((edu, index) => (
                <div key={index} className='bg-gray-100 border border-gray-300 text-gray-800 p-3 rounded-lg flex items-start justify-between'>
                  <div className='flex flex-col text-sm'>
                    <span className='font-semibold text-gray-900'>{edu.college || "College/University"}</span>
                    <span className='text-gray-600'>{edu.degree}{edu.fieldOfStudy ? ` - ${edu.fieldOfStudy}` : ''}</span>
                  </div>
                  <RxCross1 
                    className='cursor-pointer text-xs text-red-500 mt-1' 
                    onClick={() => handleRemoveEducation(index)} 
                  />
                </div>
              ))}
            </div>

            <div className='flex flex-col gap-2 mt-2 border p-3 rounded-lg bg-gray-50'>
              <input 
                type="text" 
                placeholder='College / University' 
                value={college} 
                onChange={(e) => setCollege(e.target.value)}
                className='w-full h-[40px] outline-none border-gray-400 px-[10px] text-[14px] border-2 rounded-lg bg-white'
              />
              <input 
                type="text" 
                placeholder='Degree (e.g. Bachelor of Technology)' 
                value={degree} 
                onChange={(e) => setDegree(e.target.value)}
                className='w-full h-[40px] outline-none border-gray-400 px-[10px] text-[14px] border-2 rounded-lg bg-white'
              />
              <input 
                type="text" 
                placeholder='Field of Study (e.g. Computer Science)' 
                value={fieldOfStudy} 
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className='w-full h-[40px] outline-none border-gray-400 px-[10px] text-[14px] border-2 rounded-lg bg-white'
              />
              <button 
                type="button" 
                onClick={handleAddEducation}
                className='w-full h-[40px] bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-all mt-1'
              >
                Add Education
              </button>
            </div>
          </div>

          {/* Experience Section */}
          <div className='w-full flex flex-col gap-2 mt-2'>
            <h1 className='text-lg font-semibold'>Experience</h1>

            <div className='flex flex-col gap-2'>
              {experience && experience.map((exp, index) => (
                <div key={index} className='bg-gray-100 border border-gray-300 text-gray-800 p-3 rounded-lg flex items-start justify-between'>
                  <div className='flex flex-col text-sm gap-1'>
                    <span className='font-semibold text-gray-900'>{exp.title}</span>
                    <span className='text-gray-600 font-medium'>{exp.company}</span>
                    {exp.description && <p className='text-xs text-gray-500 mt-1'>{exp.description}</p>}
                  </div>
                  <RxCross1 
                    className='cursor-pointer text-xs text-red-500 mt-1' 
                    onClick={() => handleRemoveExperience(index)} 
                  />
                </div>
              ))}
            </div>

            <div className='flex flex-col gap-2 mt-2 border p-3 rounded-lg bg-gray-50'>
              <input 
                type="text" 
                placeholder='Title (e.g. Frontend Developer)' 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className='w-full h-[40px] outline-none border-gray-400 px-[10px] text-[14px] border-2 rounded-lg bg-white'
              />
              <input 
                type="text" 
                placeholder='Company (e.g. Google)' 
                value={company} 
                onChange={(e) => setCompany(e.target.value)}
                className='w-full h-[40px] outline-none border-gray-400 px-[10px] text-[14px] border-2 rounded-lg bg-white'
              />
              <textarea 
                placeholder='Description' 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                className='w-full h-[80px] outline-none border-gray-400 p-[10px] text-[14px] border-2 rounded-lg bg-white resize-none'
              />
              <button 
                type="button" 
                onClick={handleAddExperience}
                className='w-full h-[40px] bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-all mt-1'
              >
                Add Experience
              </button>
            </div>
          </div>

          {/* Save Profile Button */}
          <button 
            type="submit" 
            className='w-full h-[45px] bg-green-600 hover:bg-green-700 text-white font-semibold text-[16px] rounded-lg transition-all mt-4 mb-2 shadow-md'
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;