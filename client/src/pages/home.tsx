import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, ListMusic, Mic2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes mock duration
  const [volume, setVolume] = useState([80]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mock songs data
  const songs = [
    { title: "HTML Rhythms", artist: "The Div Tags", color: "bg-primary" },
    { title: "CSS Cascades", artist: "Style Sheets", color: "bg-secondary" },
    { title: "JavaScript Jams", artist: "Script Kitties", color: "bg-accent" },
  ];
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, we'd call audioRef.current.play() or pause()
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev < duration ? prev + 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    setCurrentTime(0);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setCurrentTime(0);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-black selection:text-white">
      
      {/* Main Container - The "Device" */}
      <div 
        className="w-full max-w-md bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
        data-testid="music-player-container"
      >
        {/* Decorative Header */}
        <div className="bg-black text-white p-3 flex justify-between items-center border-b-4 border-black">
          <div className="font-display text-xl tracking-wider">RETRO.WAV</div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Album Art Area */}
          <div className="relative aspect-square border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-background group overflow-hidden">
            {/* Abstract Art using CSS Shapes */}
            <div className={`absolute inset-0 ${songs[currentSongIndex].color} opacity-20`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <Mic2 className="w-32 h-32 text-black stroke-[1.5]" />
            </div>
            
            {/* Spinning Record Effect */}
            <div className={`absolute bottom-4 right-4 w-16 h-16 bg-black rounded-full flex items-center justify-center animate-spin-slow ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
              <div className="w-6 h-6 bg-white rounded-full border-4 border-gray-300"></div>
            </div>

            {/* "Sticker" */}
            <div className="absolute top-4 left-4 bg-yellow-400 text-black px-2 py-1 font-bold text-xs border-2 border-black -rotate-6">
              HI-FI STEREO
            </div>
          </div>

          {/* Song Info */}
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-display font-black uppercase tracking-tight truncate border-b-4 border-transparent hover:border-primary inline-block transition-colors cursor-default">
              {songs[currentSongIndex].title}
            </h2>
            <p className="text-lg font-bold text-muted-foreground uppercase tracking-widest">
              {songs[currentSongIndex].artist}
            </p>
          </div>

          {/* Progress Bar - Custom HTML Range styled */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <Slider 
              value={[currentTime]} 
              max={duration} 
              step={1}
              onValueChange={(val) => setCurrentTime(val[0])}
              className="py-2"
            />
          </div>

          {/* Controls */}
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Previous */}
            <button 
              onClick={prevSong}
              className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all flex items-center justify-center group"
              aria-label="Previous Song"
            >
              <SkipBack className="w-6 h-6 fill-black" />
            </button>

            {/* Play/Pause - Big Button */}
            <button 
              onClick={togglePlay}
              className="bg-primary border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[6px] active:translate-x-[6px] transition-all flex items-center justify-center transform hover:-rotate-1"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-white text-white" />
              ) : (
                <Play className="w-8 h-8 fill-white text-white ml-1" />
              )}
            </button>

            {/* Next */}
            <button 
              onClick={nextSong}
              className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all flex items-center justify-center"
              aria-label="Next Song"
            >
              <SkipForward className="w-6 h-6 fill-black" />
            </button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-between pt-4 border-t-4 border-black border-dashed">
            <button className="p-2 hover:bg-gray-100 rounded-none border-2 border-transparent hover:border-black transition-all">
              <Heart className="w-6 h-6 hover:fill-red-500 hover:text-red-500 transition-colors" />
            </button>
            
            <div className="flex items-center gap-2 bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Volume2 className="w-4 h-4" />
              <div className="w-16 h-2 bg-gray-200 border border-black relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-black" 
                  style={{ width: `${volume[0]}%` }}
                ></div>
              </div>
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-none border-2 border-transparent hover:border-black transition-all">
              <ListMusic className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
      
      {/* Educational overlay or label could go here */}
      <div className="fixed bottom-4 right-4 bg-white border-2 border-black p-2 font-mono text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3 hidden md:block">
        &lt;div class="music-player"&gt;
      </div>
    </div>
  );
}
