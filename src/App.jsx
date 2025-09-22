import React from "react";
import NavBar from "./Components/NavBar";
import {useState,useEffect} from 'react'
import { Outlet } from "react-router-dom";


function App() {
 
  return (
    <>
    <div>
     <NavBar/>
     <Outlet/>
     
        </div>
    </>
  )
}


export default App;