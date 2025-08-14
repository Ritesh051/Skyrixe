import React, { useEffect, useState } from "react";
import Header from "./Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer/Footer";
import ReactWhatsapp from 'react-whatsapp';

const Root = () => {

  const phoneNumber = "9004898839"; // Replace with your WhatsApp number
  const message = encodeURIComponent("Hello, I have a question about https://skyrixe.com/");

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <>
      <Header/>
      <Outlet />
      <Footer />
      <span className="whatsapp-icon" onClick={handleClick} style={{cursor:"pointer"}}>
      <i class="fa-brands fa-whatsapp"></i>
      </span>
      
      
    </>
  );
};

export default Root;
