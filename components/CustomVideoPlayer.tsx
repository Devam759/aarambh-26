'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Hls from 'hls.js';

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  autoPlayOnScroll?: boolean;
}

export default function CustomVideoPlayer({ 
  src, 
  poster, 
  autoPlay = false,
  autoPlayOnScroll = true 
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true); // Default to muted for autoPlay safety
  const [progress, setProgress] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [unmuteText, setUnmuteText] = useState('Click to Unmute');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setUnmuteText(isTouch ? 'Tap to Unmute' : 'Click to Unmute');
    }
  }, []);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isManuallyPausedRef = useRef(false);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Intersection Observer for autoplay/autopause on scroll
  useEffect(() => {
    if (!autoPlayOnScroll || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (!video) return;

          if (entry.isIntersecting) {
            // Play if not manually paused and not already playing
            if (!isManuallyPausedRef.current && !isPlayingRef.current) {
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    setIsPlaying(true);
                  })
                  .catch((error) => {
                    console.warn('Autoplay on scroll failed, attempting muted fallback:', error);
                    video.muted = true;
                    setIsMuted(true);
                    video.play()
                      .then(() => {
                        setIsPlaying(true);
                      })
                      .catch((err2) => {
                        console.error('Muted fallback autoplay failed:', err2);
                      });
                  });
              } else {
                setIsPlaying(true);
              }
            }
          } else {
            // Stop (pause and reset) when leaving viewport
            video.pause();
            try {
              video.currentTime = 0;
            } catch (e) {
              console.warn('Resetting video time failed:', e);
            }
            setIsPlaying(false);
          }
        });
      },
      {
        threshold: 0.25, // Trigger when 25% of the player is visible
      }
    );

    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [autoPlayOnScroll]);


  const handleInteraction = () => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, 2500);
  };

  useEffect(() => {
    if (!isPlaying) {
      setIsControlsVisible(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    } else {
      handleInteraction();
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported() && src.endsWith('.m3u8')) {
      hls = new Hls({
        maxBufferLength: 15,
        maxMaxBufferLength: 30,
      });
      
      hls.loadSource(src);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        setIsLoaded(true);
        if (autoPlay) {
          video.play().catch(() => setIsPlaying(false));
        }
      });
      
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          console.warn('HLS Fatal Error:', data);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              hls?.destroy();
              break;
          }
        }
      });
    } else {
      // Fallback to native video playback (Safari or .webm/.mp4)
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        setIsLoaded(true);
        if (autoPlay) {
          video.play().catch(() => setIsPlaying(false));
        }
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, autoPlay]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        isManuallyPausedRef.current = true;
      } else {
        isManuallyPausedRef.current = false;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.warn('Video playback failed:', error);
              setIsPlaying(false);
            });
        } else {
          setIsPlaying(true);
        }
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      videoRef.current.currentTime = percentage * videoRef.current.duration;
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        if (window.screen.orientation && window.screen.orientation.unlock) {
          window.screen.orientation.unlock();
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard controls (Spacebar: play/pause, Arrow Keys: rewind/forward 5s)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is actively typing in a form or input element
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      const video = videoRef.current;
      if (!video) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          handleInteraction();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 5);
          handleInteraction();
          break;
        case 'ArrowRight':
          e.preventDefault();
          video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
          handleInteraction();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying]);

  const handleFullscreen = async () => {
    try {
      const doc = document as any;
      if (doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement) {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen();
        }
      } else {
        if (containerRef.current) {
          const el = containerRef.current as any;
          const reqFs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
          
          if (reqFs) {
            await reqFs.call(el);
            if (window.screen.orientation && (window.screen.orientation as any).lock) {
              try {
                await (window.screen.orientation as any).lock('landscape');
              } catch (err) {
                console.warn('Orientation lock failed:', err);
              }
            }
          } else if ((videoRef.current as any).webkitEnterFullscreen) {
            // Fallback for older iOS Safari
            (videoRef.current as any).webkitEnterFullscreen();
          }
        }
      }
    } catch (error) {
      console.warn('Fullscreen error:', error);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full group bg-black overflow-hidden ${isPlaying && !isControlsVisible ? 'cursor-none' : 'cursor-pointer'}`}
      onMouseMove={handleInteraction}
      onTouchStart={handleInteraction}
      onMouseLeave={() => setIsControlsVisible(false)}
      onClick={() => {
        handleInteraction();
        if (isPlaying && isMuted) {
          toggleMute();
        } else {
          togglePlay();
        }
      }}
    >
      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={() => setIsLoaded(true)}
        playsInline
        muted={isMuted}
        loop
      />

      {/* Dark Unmute Overlay */}
      <AnimatePresence>
        {isPlaying && isMuted && (
          <motion.div
            key="unmute-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 pointer-events-none"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-white font-display font-black text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2"
            >
              <VolumeX className="w-4.5 h-4.5 animate-pulse text-white" />
              <span>tap/click to unmute</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Custom Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
          isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => {
          handleInteraction();
          e.stopPropagation();
        }}
      >
        {/* Progress Bar */}
        <div 
          className="w-full h-2 bg-white/30 rounded-full mb-4 cursor-pointer overflow-hidden border border-black/20"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-brand-orange transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(255,154,0,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button 
              onClick={togglePlay}
              className="hover:text-brand-orange transition-colors focus:outline-none"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>
            <button 
              onClick={toggleMute}
              className="hover:text-brand-orange transition-colors focus:outline-none"
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>
          
          <button 
            onClick={handleFullscreen}
            className="hover:text-brand-orange transition-colors focus:outline-none"
          >
            <Maximize className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
