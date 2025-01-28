"use client";

import React from "react";
import backgroundImage from "/public/landing_page_2.webp";

const LandingPage = () => {
  return (
    <div
      className="w-screen h-screen bg-cover bg-center text-white flex flex-col justify-center items-center"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      {/* Background Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-3/4 max-w-xl bg-black bg-opacity-70 p-6 rounded-lg">
          <h1 className="text-4xl font-bold mb-4">WELCOME COMMANDER</h1>
          <p className="text-lg mb-6">THE FATE OF YOUR NATION IS IN YOUR HANDS</p>
          <button
            className="px-6 py-3 bg-red-600 hover:bg-red-700 font-semibold rounded-lg text-xl"
            onClick={() => window.location.href = "/"}
          >
            Initiate Protocol
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;