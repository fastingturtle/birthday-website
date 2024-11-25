'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Congratulations() {
  // State to ensure content is rendered only on the client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure the client renders content after hydration
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-300 to-blue-400 text-white">
      {isClient && (
        <>
          {/* Animated Greeting */}
          <motion.h1
            className="text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            🎉 Congratulations! 🎉
          </motion.h1>
          <motion.p
            className="text-xl text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            You’re crowned the best patootie of the month!
          </motion.p>
          {/* Meme Image */}
          <motion.img
            src="/congratulations-meme.jpg"
            alt="Funny congratulatory meme"
            className="rounded-lg shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          />
        </>
      )}
    </main>
  );
}
