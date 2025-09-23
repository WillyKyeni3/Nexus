import React from "react";
import NavBar from "./Components/NavBar";
import {useState,useEffect} from 'react'
import { Outlet } from "react-router-dom";


function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}


export default App;