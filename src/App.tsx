/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Gift, Cake, Star, Music, Camera, MessageCircle, Sparkles, ChevronRight, ChevronLeft, Play, Pause, Flame } from 'lucide-react';
import ReactPlayer from 'react-player';

const Player = ReactPlayer as any;

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
  const [youtubeUrl, setYoutubeUrl] = useState("https://www.youtube.com/watch?v=f-jN3vH26NQ");
  const playerRef = React.useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const lyrics = [
    { time: 0, text: "🎵 To the most special person... 🎵" },
    { time: 4, text: "Happy Birthday to you... ❤️" },
    { time: 8, text: "Happy Birthday to you... 🌹" },
    { time: 12, text: "Happy Birthday my favorite... ✨" },
    { time: 16, text: "Happy Birthday to you! 💖" },
    { time: 20, text: "You make my world brighter... 🌟" },
    { time: 24, text: "Every single day... 🌈" },
    { time: 28, text: "I'm so glad I found you... 🤝" },
    { time: 32, text: "Happy Birthday! 🎂" }
  ];

  const currentLyric = [...lyrics].reverse().find(l => l.time <= currentTime)?.text || lyrics[0].text;

  useEffect(() => {
    setPlayerReady(false);
    setIsPlaying(false);
  }, [youtubeUrl]);

  const memories = [
    {
      title: "Hamara Roz Ka Kalesh",
      description: "Hamari dosti bina kalesh ke adhuri hai! Wo cute si ladaiyan aur phir maan jaana hi toh sabse pyaara hai.",
      icon: <Flame className="w-6 h-6" />,
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: "Waiting to Meet",
      description: "Bhale hi hum kabhi mile nahi, par tumhare saath bitaya har pal mere liye bahut special hai. Us din ka intezaar hai jab hum pehli baar milenge.",
      icon: <Star className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Being My Strength",
      description: "Tum hamesha mere saath khadi rehti ho, chahe kuch bhi ho. Mere liye tumse zyada special koi nahi.",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-red-100 text-red-600"
    }
  ];

  const handleOpenGift = () => {
    setIsOpened(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 10000);
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const nextPage = () => {
    setDirection(1);
    setCurrentPage((prev) => Math.min(prev + 1, 4));
  };
  const prevPage = () => {
    setDirection(-1);
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };
  const lastToggleTime = useRef(0);
  const togglePlay = () => {
    const now = Date.now();
    if (now - lastToggleTime.current < 500) return; // Prevent toggling faster than 500ms
    lastToggleTime.current = now;
    setIsPlaying(!isPlaying);
  };

  const [showFinalSurprise, setShowFinalSurprise] = useState(false);

  const resetApp = () => {
    setDirection(-1);
    setCurrentPage(0);
    setIsOpened(false);
    setIsPlaying(false);
    setShowFinalSurprise(false);
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
  } as any;

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

      {/* Persistent Background Player */}
      <div className="hidden">
        <Player 
          ref={playerRef}
          url={youtubeUrl}
          playing={isPlaying}
          onReady={() => setPlayerReady(true)}
          onEnded={() => setIsPlaying(false)}
          onProgress={(progress: any) => setCurrentTime(progress.playedSeconds)}
          onError={(e: any) => {
            console.warn("Player error (likely interrupted play/pause):", e);
            setIsPlaying(false);
          }}
          width="0px"
          height="0px"
        />
      </div>

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
                To the most special person in my life. Today is all about celebrating YOU and the magic you bring!
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
                      <h3 className="text-2xl md:text-3xl font-bold text-pink-700 mb-4">A Special Connection</h3>
                      <p className="text-slate-700 text-base md:text-lg leading-relaxed italic">
                        "The best thing that ever happened to me was finding you. May your year be as beautiful and amazing as your smile!"
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
              <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 text-slate-900 relative overflow-hidden shadow-2xl mb-12 border border-pink-100">
                <div className="absolute top-0 right-0 w-64 h-64 md:w-80 md:h-80 bg-pink-100/50 blur-[100px] -mr-32 -mt-32" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  {/* Song Cover Page */}
                  <motion.div 
                    variants={itemVariants}
                    className={`relative w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl shrink-0 border-4 border-white ${isPlaying ? 'animate-pulse' : ''}`}
                    style={{ boxShadow: '0 20px 50px rgba(236, 72, 153, 0.3)' }}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80" 
                      alt="Birthday Celebration" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                      <h4 className="text-white font-black text-xl">Birthday Anthem</h4>
                      <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Special Edition</p>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="flex-grow text-center md:text-left">
                    <span className="text-pink-500 font-bold text-xs uppercase tracking-[0.3em] mb-2 block">Now Playing</span>
                    <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">BIRTHDAY VIBES</h3>
                    
                    {/* Lyrics Display */}
                    <div className="bg-slate-50 rounded-2xl p-6 mb-8 min-h-[100px] flex items-center justify-center border border-slate-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-pink-500" />
                      <AnimatePresence mode="wait">
                        <motion.p 
                          key={currentLyric}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-lg md:text-2xl font-bold text-slate-700 italic"
                        >
                          {currentLyric}
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <button 
                        onClick={togglePlay}
                        className="bg-pink-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-600 transition-all flex items-center gap-3 shadow-xl shadow-pink-200 active:scale-95"
                      >
                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                        {isPlaying ? 'Pause' : 'Play Music'}
                      </button>
                      <div className="flex items-center gap-2">
                        <MusicVisualizer isPlaying={isPlaying} />
                      </div>
                    </div>
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
              {!showFinalSurprise ? (
                <motion.div variants={itemVariants} className="flex flex-col items-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-8"
                  >
                    <Gift className="w-24 h-24 text-pink-500" />
                  </motion.div>
                  <h2 className="text-3xl md:text-5xl font-black mb-6">READY FOR THE LAST SURPRISE?</h2>
                  <p className="text-slate-600 mb-10 text-lg">I have one more thing to tell you...</p>
                  <BigButton onClick={() => {
                    setShowFinalSurprise(true);
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 5000);
                  }}>
                    Open Final Surprise 🎁
                  </BigButton>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border-4 border-pink-200 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400" />
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Heart className="w-16 h-16 text-pink-500 fill-current mx-auto mb-6" />
                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-800">YOU ARE MY FAVORITE!</h2>
                    
                    <div className="bg-pink-50 p-6 rounded-2xl mb-8 border border-pink-100">
                      <p className="text-lg md:text-2xl text-pink-700 font-bold italic leading-relaxed">
                        "In a world full of temporary things, you are my favorite constant. Happy Birthday to the one who makes my heart skip a beat!"
                      </p>
                    </div>

                    <p className="text-slate-600 text-base md:text-xl leading-relaxed mb-10">
                      I'm so lucky to have you in my life. Thank you for being my constant support, my laughter partner, and my everything. 
                      I can't wait to make more beautiful memories with you.
                    </p>

                    <div className="flex justify-center gap-4 mb-10">
                      <motion.div whileHover={{ scale: 1.2 }} className="p-3 bg-yellow-100 rounded-full"><Star className="w-6 h-6 text-yellow-500 fill-current" /></motion.div>
                      <motion.div whileHover={{ scale: 1.2 }} className="p-3 bg-blue-100 rounded-full"><Sparkles className="w-6 h-6 text-blue-500" /></motion.div>
                      <motion.div whileHover={{ scale: 1.2 }} className="p-3 bg-pink-100 rounded-full"><Heart className="w-6 h-6 text-pink-500 fill-current" /></motion.div>
                    </div>

                    <BigButton onClick={resetApp} variant="secondary">
                      Start Over <ChevronRight className="w-5 h-5" />
                    </BigButton>
                  </motion.div>
                </motion.div>
              )}
              
              <motion.p variants={itemVariants} className="mt-12 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.4em]">
                Made with love for my favorite person &bull; 2026
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
