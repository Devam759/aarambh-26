'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

export default function CustomVideoPlayer({ src, poster }: { src: string, poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Auto-hide controls timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && showControls) {
      timer = setTimeout(() => setShowControls(false), 2500);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, showControls, progress]); // Added progress so it stays visible while seeking/playing

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
      setCurrentTime(formatTime(current));
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(formatTime(videoRef.current.duration));
      // Start auto-play logic manually if needed
      if (videoRef.current.autoplay) {
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = (videoRef.current.duration / 100) * seekTo;
      setProgress(seekTo);
    }
  };

  const toggleFullScreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.parentElement?.requestFullscreen();
      }
    }
  };

  return (
    <div 
      className="relative w-full h-full group bg-brand-ink overflow-hidden rounded-xl sm:rounded-2xl"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false);
      }}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover cursor-pointer"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        playsInline
        loop
        muted={isMuted}
      />
      

      {/* Controls Bar */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 sm:pb-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 flex flex-col gap-3 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent clicking controls from pausing video
      >
        {/* Innovative Progress Bar */}
        <div className="relative w-full h-4 sm:h-5 flex items-center group/slider cursor-pointer">
          {/* Background Track (Orange) */}
          <div className="absolute w-full h-2 sm:h-2.5 bg-brand-orange rounded-full overflow-hidden border-2 border-brand-ink shadow-[2px_2px_0px_0px_#030404]">
            {/* Filled Track (Pink) */}
            <div 
              className="absolute top-0 left-0 h-full bg-brand-pink transition-all duration-75 ease-linear border-r-2 border-brand-ink"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Native Range Input for seeking (Invisible but clickable) */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress || 0}
            onChange={handleSeek}
            className="absolute w-full h-full opacity-0 cursor-pointer z-20"
          />
          
          {/* Custom Thumb (Blue Circle) */}
          <div 
            className="absolute h-5 w-5 sm:h-6 sm:w-6 bg-brand-blue border-[3px] border-brand-cloud rounded-full shadow-[3px_3px_0px_0px_#030404] z-10 pointer-events-none transition-all duration-75 ease-linear group-hover/slider:scale-125"
            style={{ left: `calc(${progress}% - 10px)` }}
          />
        </div>

        {/* Buttons and Time */}
        <div className="flex items-center justify-between text-brand-cloud mt-1">
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={togglePlay} 
              className="hover:text-brand-pink hover:scale-110 transition-all focus:outline-none"
            >
              {isPlaying ? <Pause className="w-5 h-5 sm:w-7 sm:h-7 fill-current" /> : <Play className="w-5 h-5 sm:w-7 sm:h-7 fill-current" />}
            </button>
            <button 
              onClick={toggleMute}
              className="hover:text-brand-orange hover:scale-110 transition-all focus:outline-none"
            >
              {isMuted ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
            <div className="font-mono text-xs sm:text-sm font-bold tracking-wider opacity-90 select-none">
              <span className="text-brand-pink">{currentTime}</span> <span className="text-white/50">/</span> <span className="text-brand-orange">{duration}</span>
            </div>
          </div>
          
          <button 
            onClick={toggleFullScreen}
            className="hover:text-brand-blue hover:scale-110 transition-all focus:outline-none"
          >
            <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
