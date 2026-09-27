import React from "react"; 
import { Routes, Route, Navigate } from "react-router-dom"; 

import Home from "./pages/Home"; 
import Login from "./pages/Login"; 
import Signup from "./pages/Signup"; 

import { UserContext } from "./context/userContext"; 

function App() { 
  const { userData, loading } = React.useContext(UserContext); 

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#f0efe7]">
        <p className="text-gray-600 font-medium text-lg">Loading session...</p>
      </div>
    );
  }

  return ( 
    <Routes> 
      <Route 
        path="/" 
        element={userData ? <Home /> : <Navigate to="/login" replace />} 
      /> 

      <Route 
        path="/login" 
        element={!userData ? <Login /> : <Navigate to="/" replace />} 
      /> 

      <Route 
        path="/signup" 
        element={!userData ? <Signup /> : <Navigate to="/" replace />} 
      /> 
    </Routes> 
  ); 
} 

export default App;