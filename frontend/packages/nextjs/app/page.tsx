"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import NationsTable from "./subgraph/_components/NationsTable";
import { VT323 } from "next/font/google";

const vt323 = VT323({ weight: "400", subsets: ["latin"] });

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  useEffect(() => {
    const audio = new Audio("/homepage_audio.mp4");
    audio.play().catch((error) => console.error("Audio playback failed:", error));
  
    return () => {
      // Stop and reset audio when leaving the page
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Typewriter Effect
  const fullText = "Welcome Commander\nThe fate of your nation is in your hands";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const interval = setInterval(() => {
        setDisplayText(fullText.slice(0, index + 1));
        setIndex(index + 1);
      }, 60); // Adjust speed of typing

      return () => clearInterval(interval);
    }
  }, [index, fullText]);

  return (
    <>
      {/* Centered Background Wrapper with Fixed Size and Aligned to Top */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-[4300px] h-[1500px] bg-black overflow-hidden">
        <div 
          className="relative w-full h-full bg-no-repeat bg-contain bg-top"
          style={{ backgroundImage: "url('/background_expanded.jpg')" }}
        >
          {/* Fixed overlay text box */}
          <div 
            className={`absolute top-[318px] left-1/2 transform -translate-x-1/2 w-[330px] h-[200px] bg-opacity-70 bg-black p-6 rounded-lg flex flex-col justify-center items-center ${vt323.className}`}
          >
            <h1 className="text-center text-green-600 whitespace-pre-line text-2xl">
              {displayText}
            </h1>
          </div>

        <div className="absolute top-[593px] left-1/2 transform -translate-x-1/2 w-full flex justify-center">
          <div className="w-[600px] bg-black bg-opacity-70 p-6 rounded-lg flex flex-col items-center">
            <h1 className="text-center text-white text-xl">Recently Minted Nations</h1>
            <NationsTable />
          </div>
        </div>


        </div>
      </div>
    </>
  );
};

export default Home;
