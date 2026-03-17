/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Gift, Cake, Star, Music, Camera, MessageCircle, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import ReactPlayer from 'react-player';

// Confetti component for celebration
const Confetti = () => {
  const [pieces, setPieces] = useState<any[]>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      size: Math.random() * 10 + 5,
      color: ['#FF69B4', '#FFD700', '#00CED1', '#FF4500', '#9370DB'][Math.floor(Math.random() * 5)],
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, rotate: 0 }}
          animate={{ 
            y: '110vh', 
            rotate: 360,
            x: `${p.x + (Math.random() * 10 - 5)}vw`
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            delay: p.delay,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
};

const MusicVisualizer = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="flex items-end gap-1 h-6">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-white/60 rounded-full"
          animate={{
            height: isPlaying ? [6, 20, 10, 24, 14, 6] : 6,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const BigButton = ({ onClick, children, variant = 'primary', className = '' }: { onClick: () => void, children: React.ReactNode, variant?: 'primary' | 'secondary', className?: string }) => {
  const baseStyles = "px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto min-w-[160px]";
  const variants = {
    primary: "bg-pink-500 text-white hover:bg-pink-600 shadow-pink-200",
    secondary: "bg-white text-slate-600 border-2 border-slate-100 hover:bg-slate-50 shadow-slate-100"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for forward, -1 for backward
  const [isOpened, setIsOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("https://youtu.be/jYTGnTv-CKg?si=zUcIUYICWHvea3-F");
  const playerRef = React.useRef<any>(null);

  useEffect(() => {
    setPlayerReady(false);
  }, [youtubeUrl]);

  const memories = [
    {
      title: "Late Night Chats",
      description: "Those endless WhatsApp conversations where we talk about everything from our dreams to our daily struggles.",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Reel Sharing Spree",
      description: "Our Instagram DMs are basically a curated collection of the funniest and most relatable reels ever.",
      icon: <Camera className="w-6 h-6" />,
      color: "bg-pink-100 text-pink-600"
    },
    {
      title: "Digital Support",
      description: "Even though we've never met, you're the first person I want to text when something happens. You're always there.",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-red-100 text-red-600"
    }
  ];

  const handleOpenGift = () => {
    setIsOpened(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 10000);
  };

  const nextPage = () => {
    setDirection(1);
    setCurrentPage((prev) => Math.min(prev + 1, 4));
  };
  const prevPage = () => {
    setDirection(-1);
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetApp = () => {
    setDirection(-1);
    setCurrentPage(0);
    setIsOpened(false);
    setIsPlaying(false);
  };

  const pageVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
      scale: 0.95,
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        staggerChildren: 0.1,
      },
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    }),
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF5F5] font-sans text-slate-900 selection:bg-pink-200 overflow-x-hidden flex flex-col">
      {showConfetti && <Confetti />}

      {/* Global Music Toggle */}
      {currentPage > 0 && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={togglePlay}
          className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg border border-pink-100 text-pink-500 hover:bg-pink-50 transition-all"
        >
          {isPlaying ? <Music className="w-6 h-6 animate-pulse" /> : <Music className="w-6 h-6 opacity-50" />}
        </motion.button>
      )}

      <main className="flex-grow flex items-center justify-center p-6 relative">
        <AnimatePresence mode="wait" custom={direction}>
          {currentPage === 0 && (
            <motion.div 
              key="hero"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center z-10 w-full max-w-4xl"
            >
              <motion.div
                variants={itemVariants}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <Cake className="w-16 h-16 md:w-20 md:h-20 text-pink-500" />
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 mb-4 leading-tight">
                HAPPY <span className="text-pink-500">BIRTHDAY</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="text-lg md:text-2xl font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed mb-12">
                To my absolute best friend in the whole world. Today is all about celebrating YOU!
              </motion.p>
              <motion.div variants={itemVariants}>
                <BigButton onClick={nextPage} className="mx-auto">
                  Start the Celebration <ChevronRight className="w-5 h-5" />
                </BigButton>
              </motion.div>
            </motion.div>
          )}

          {currentPage === 1 && (
            <motion.div 
              key="gift"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center w-full max-w-4xl"
            >
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-8 md:mb-12">I have a little something for you...</motion.h2>
              <motion.div variants={itemVariants} className="relative flex justify-center items-center min-h-[300px] mb-12">
                <AnimatePresence mode="wait">
                  {!isOpened ? (
                    <motion.button
                      key="closed"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleOpenGift}
                      className="group relative"
                    >
                      <div className="absolute -inset-4 bg-pink-500/20 rounded-full blur-xl group-hover:bg-pink-500/30 transition-all" />
                      <Gift className="w-24 h-24 md:w-32 md:h-32 text-pink-500 relative z-10" />
                      <p className="mt-4 font-bold text-pink-600 uppercase tracking-widest text-sm">Click to open</p>
                    </motion.button>
                  ) : (
                    <motion.div
                      key="opened"
                      initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border-2 border-pink-100 shadow-2xl max-w-sm mx-auto"
                    >
                      <Sparkles className="w-10 h-10 text-yellow-500 mx-auto mb-4 md:mb-6" />
                      <h3 className="text-2xl md:text-3xl font-bold text-pink-700 mb-4">A Lifetime of Friendship</h3>
                      <p className="text-slate-700 text-base md:text-lg leading-relaxed italic">
                        "The best gift I ever received was your friendship. May your year be as bright, beautiful, and amazing as you are!"
                      </p>
                      <div className="mt-6 md:mt-8 flex justify-center gap-3">
                        {[1, 2, 3].map(i => (
                          <Heart key={i} className="w-5 h-5 md:w-6 md:h-6 text-pink-400 fill-current" />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
                <BigButton onClick={prevPage} variant="secondary">
                  <ChevronLeft className="w-5 h-5" /> Back
                </BigButton>
                <BigButton onClick={nextPage}>
                  Next Surprise <ChevronRight className="w-5 h-5" />
                </BigButton>
              </motion.div>
            </motion.div>
          )}

          {currentPage === 2 && (
            <motion.div 
              key="memories"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-6xl"
            >
              <motion.div variants={itemVariants} className="text-center mb-8 md:mb-12">
                <span className="text-pink-500 font-bold uppercase tracking-widest text-xs md:text-sm">Our Journey</span>
                <h2 className="text-3xl md:text-5xl font-black mt-2">FAVORITE MEMORIES</h2>
              </motion.div>
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-12">
                {memories.map((memory, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 flex flex-col"
                  >
                    <div className={`w-10 h-10 md:w-12 md:h-12 ${memory.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6`}>
                      {memory.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{memory.title}</h3>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                      {memory.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
                <BigButton onClick={prevPage} variant="secondary">
                  <ChevronLeft className="w-5 h-5" /> Back
                </BigButton>
                <BigButton onClick={nextPage}>
                  Keep Going <ChevronRight className="w-5 h-5" />
                </BigButton>
              </motion.div>
            </motion.div>
          )}

          {currentPage === 3 && (
            <motion.div 
              key="playlist"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-4xl"
            >
              <motion.div variants={itemVariants} className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl mb-12">
                <div className="absolute top-0 right-0 w-64 h-64 md:w-80 md:h-80 bg-pink-500/20 blur-[100px] md:blur-[120px] -mr-32 -mt-32 md:-mr-40 md:-mt-40" />
                <div className="absolute bottom-0 left-0 w-64 h-64 md:w-80 md:h-80 bg-blue-500/20 blur-[100px] md:blur-[120px] -ml-32 -mb-32 md:-ml-40 md:-mb-40" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
                  <motion.div 
                    variants={itemVariants}
                    className={`w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center shadow-2xl shrink-0 relative ${isPlaying ? 'animate-spin-slow' : 'rotate-3'}`}
                  >
                    <Music className="w-16 h-16 md:w-24 md:h-24 text-white mb-2" />
                    <div className="absolute bottom-6">
                      <MusicVisualizer isPlaying={isPlaying} />
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <h3 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Birthday Vibes Playlist</h3>
                    <p className="text-base md:text-xl text-slate-400 mb-6 md:mb-8">A collection of songs that remind me of our best moments together.</p>
                    
                    <div className="hidden">
                      <ReactPlayer 
                        ref={playerRef}
                        url={youtubeUrl}
                        playing={isPlaying}
                        onReady={() => setPlayerReady(true)}
                        onEnded={() => setIsPlaying(false)}
                        onError={(e) => {
                          console.warn("Player error (likely interrupted play/pause):", e);
                          setIsPlaying(false);
                        }}
                        width="0"
                        height="0"
                      />
                    </div>

                    <div className="mb-6">
                      <input 
                        type="text" 
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="Paste YouTube link here"
                        className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg w-full text-sm mb-4"
                      />
                    </div>

                    <button 
                      onClick={togglePlay}
                      className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold text-base hover:bg-pink-100 transition-colors flex items-center gap-2 mx-auto md:mx-0 shadow-lg"
                    >
                      {isPlaying ? 'Pause Song' : 'Play Now'}
                    </button>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
                <BigButton onClick={prevPage} variant="secondary">
                  <ChevronLeft className="w-5 h-5" /> Back
                </BigButton>
                <BigButton onClick={nextPage}>
                  One Last Thing <ChevronRight className="w-5 h-5" />
                </BigButton>
              </motion.div>
            </motion.div>
          )}

          {currentPage === 4 && (
            <motion.div 
              key="final"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center max-w-2xl w-full"
            >
              <motion.div
                variants={itemVariants}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="mb-6 md:mb-8"
              >
                <Heart className="w-16 h-16 md:w-24 md:h-24 text-pink-500 fill-current mx-auto" />
              </motion.div>
              <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-black mb-4 md:mb-6 leading-tight">CHEERS TO ANOTHER YEAR!</motion.h2>
              <motion.p variants={itemVariants} className="text-base md:text-xl text-slate-600 leading-relaxed mb-8 md:mb-12">
                I hope this year brings you as much joy as you bring to everyone around you. 
                You deserve the world and more. I'm so proud to call you my best friend.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex justify-center gap-6 md:gap-8 mb-12 md:mb-16">
                <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer"><Heart className="w-6 h-6 md:w-8 md:h-8 text-pink-500 fill-current" /></motion.div>
                <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer"><Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 fill-current" /></motion.div>
                <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer"><Sparkles className="w-6 h-6 md:w-8 md:h-8 text-blue-500" /></motion.div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <BigButton onClick={resetApp} variant="secondary">
                  <ChevronLeft className="w-5 h-5" /> Back to Start
                </BigButton>
              </motion.div>
              
              <motion.p variants={itemVariants} className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.3em] md:tracking-[0.4em]">
                Made with love for my best friend &bull; 2026
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Progress Dots (Simplified for mobile) */}
      <div className="pb-8 flex justify-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${currentPage === i ? 'w-6 md:w-8 bg-pink-500' : 'w-1.5 md:w-2 bg-slate-200'}`}
          />
        ))}
      </div>

      {/* Decorative Background Icons (Hidden on very small screens for clarity) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 hidden sm:block">
        <Star className="absolute top-10 left-10 w-16 h-16 md:w-24 md:h-24" />
        <Heart className="absolute bottom-20 right-20 w-24 h-24 md:w-32 md:h-32" />
        <Cake className="absolute top-1/2 left-1/4 w-16 h-16 md:w-20 md:h-20" />
        <Gift className="absolute top-1/3 right-1/4 w-20 h-20 md:w-28 md:h-28" />
      </div>
    </div>
  );
}
