import React from 'react';
import { motion } from 'motion/react';

const clients = [
  "Sycuan Band of the Kumeyaay Nation",
  "California Bank & Trust",
  "U.S. International Media",
  "The City of Los Angeles",
  "Sycuan Casino Resort",
  "Singing Hills Golf Course",
  "Spa Ritual",
  "Sycuan Health Center",
  "Sycuan Fire Department",
  "Alpha Project",
  "California Nations Indian Gaming Association",
  "San Diego State University",
  "NFL Alumni Association",
  "Wes Chandler",
  "ASX Composites"
];

// Duplicate to create seamless loop
const duplicatedClients = [...clients, ...clients];

export const ClientLogoCarousel = () => {
  return (
    <div className="py-12 bg-white border-y border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-xs font-mono text-zinc-400 mb-8 uppercase tracking-widest">// Trusted Partners</p>
      </div>
      <motion.div 
        className="flex whitespace-nowrap items-center gap-16"
        initial={{ x: "0%" }}
        animate={{ x: "-50%" }}
        transition={{ 
          duration: 40, 
          ease: "linear", 
          repeat: Infinity 
        }}
      >
        {duplicatedClients.map((client, index) => (
          <span key={index} className="text-sm font-bold text-zinc-500 font-display flex-shrink-0">
            {client.toUpperCase()}
          </span>
        ))}
      </motion.div>
    </div>
  );
};
