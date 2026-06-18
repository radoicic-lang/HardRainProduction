import React from 'react';
import { motion } from 'motion/react';

const clients = [
  "California Bank & Trust",
  "San Diego FC",
  "Spa Ritual Wellness",
  "Biomechanic Fitness",
  "Sycuan Health",
  "Drakes Restaurant",
  "Feeding San Diego",
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
