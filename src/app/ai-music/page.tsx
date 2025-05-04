"use client"

import { useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import { Vortex } from "@/components/ui/vortex";
import axios from "axios";

const AiMusicPage = () => {

  return (
    <div className="w-full h-screen bg-black text-white">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={220}
        className="flex flex-col items-center justify-center px-4 md:px-20 py-6 w-full h-full"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">AI Music Lab 🎧</h1>
        <h2 className="text-xl md:text-2xl text-gray-300 mb-6 text-center">
          <Typewriter
            words={[
              "Create your own music mashups 🎶",
              "Generate AI-powered tracks 🤖",
              "Remix songs with one click 🔁",
              "Explore your creative soundscape 🎼"
            ]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={1000}
          />
        </h2>
      </Vortex>
    </div>
  );
};

export default AiMusicPage;