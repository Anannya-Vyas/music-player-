import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, ListMusic, Mic2, Music } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([80]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const songs = [
    { 
      title: "Lofi Study", 
      artist: "Chill Beats", 
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      color: "bg-primary" 
    },
    { 
      title: "Sunset Vibes", 
      artist: "Ocean Waves", 
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      color: "bg-secondary" 
    },
    { 
      title: "Neon Dreams", 
      artist: "Synth Runner", 
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      color: "bg-accent" 
    },
    { 
      title: "Urban Jungle", 
      artist: "City Lights", 
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      color: "bg-primary" 
    }
  ];
  
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentSongIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    setCurrentTime(0);
    if (!isPlaying) setIsPlaying(true);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setCurrentTime(0);
    if (!isPlaying) setIsPlaying(true);
  };

  const selectSong = (index: number) => {
    setCurrentSongIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
    setShowPlaylist(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-black selection:text-white">
      <audio 
        ref={audioRef}
        src={songs[currentSongIndex].url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextSong}
      />
      
      <div 
        className="w-full max-w-md bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col"
        data-testid="music-player-container"
      >
        {/* Header */}
        <div className="bg-black text-white p-3 flex justify-between items-center border-b-4 border-black shrink-0">
          <div className="font-display text-xl tracking-wider">RETRO.WAV</div>
          <button 
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="flex items-center gap-2 hover:text-primary transition-colors font-bold text-sm"
          >
            <ListMusic className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 relative flex-grow overflow-hidden">
          
          {/* Playlist Overlay */}
          {showPlaylist && (
            <div className="absolute inset-0 z-50 bg-white border-b-4 border-black p-4 overflow-y-auto animate-in slide-in-from-top duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-2xl font-black italic">PLAYLIST</h3>
                <button onClick={() => setShowPlaylist(false)} className="font-bold border-2 border-black px-2 hover:bg-black hover:text-white">X</button>
              </div>
              <div className="space-y-2">
                {songs.map((song, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectSong(idx)}
                    className={`w-full text-left p-3 border-2 border-black flex items-center justify-between transition-all ${currentSongIndex === idx ? 'bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' : 'hover:bg-accent'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Music className="w-4 h-4" />
                      <div>
                        <div className="font-bold leading-none">{song.title}</div>
                        <div className="text-xs opacity-80">{song.artist}</div>
                      </div>
                    </div>
                    {currentSongIndex === idx && isPlaying && <div className="w-2 h-2 bg-white animate-pulse rounded-full" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Album Art Area */}
          <div className="relative aspect-square border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-background group overflow-hidden">
            <div className={`absolute inset-0 ${songs[currentSongIndex].color} opacity-20`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <Mic2 className="w-32 h-32 text-black stroke-[1.5]" />
            </div>
            
            <div className={`absolute bottom-4 right-4 w-16 h-16 bg-black rounded-full flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
              <div className="w-6 h-6 bg-white rounded-full border-4 border-gray-300"></div>
            </div>

            <div className="absolute top-4 left-4 bg-yellow-400 text-black px-2 py-1 font-bold text-xs border-2 border-black -rotate-6">
              LIVE FEED
            </div>
          </div>

          {/* Song Info */}
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-display font-black uppercase tracking-tight truncate">
              {songs[currentSongIndex].title}
            </h2>
            <p className="text-lg font-bold text-muted-foreground uppercase tracking-widest">
              {songs[currentSongIndex].artist}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <Slider 
              value={[currentTime]} 
              max={duration || 100} 
              step={0.1}
              onValueChange={(val) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = val[0];
                  setCurrentTime(val[0]);
                }
              }}
              className="py-2"
            />
          </div>

          {/* Controls */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <button 
              onClick={prevSong}
              className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all flex items-center justify-center"
              aria-label="Previous"
            >
              <SkipBack className="w-6 h-6 fill-black" />
            </button>

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

            <button 
              onClick={nextSong}
              className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all flex items-center justify-center"
              aria-label="Next"
            >
              <SkipForward className="w-6 h-6 fill-black" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-4 bg-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Volume2 className="w-6 h-6 shrink-0" />
            <Slider 
              value={volume} 
              max={100} 
              step={1}
              onValueChange={setVolume}
              className="flex-grow"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
