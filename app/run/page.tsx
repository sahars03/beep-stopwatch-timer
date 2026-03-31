"use client";
import { useTimer } from "../context/TimerProvider";
import { useState, useEffect, useRef } from "react";
import { TimerReset, Play, Pause, Square, Home } from "lucide-react";
import { useRouter } from "next/navigation";


export default function RunPage() {

const beepRef = useRef<HTMLAudioElement | null>(null);
const ringRef = useRef<HTMLAudioElement | null>(null);

useEffect(() => {
    beepRef.current = new Audio("/progress-bar-beep.wav");
    ringRef.current = new Audio("/timer-finish.ogg");

    // preload for no delay
    beepRef.current.preload = "auto";
    ringRef.current.preload = "auto";
}, []);

    const { config } = useTimer();

    const router = useRouter();

    const handleHome = () => {
        router.push("/"); // go to homepage
    };

    const [isPaused, setIsPaused] = useState(false);

    // TODO: make this look better
    if (!config) return <p>No timer set</p>;

    const beepInterval = config.beepTime.hours * 3600 + config.beepTime.minutes * 60 + config.beepTime.seconds;
    const mode = config.mode;

    const isBeep = beepInterval > 0;


    const initialSeconds =
    mode === "Timer" && config.time
        ? config.time.hours * 3600 +
        config.time.minutes * 60 +
        config.time.seconds
        : 0;

        const handlePause = () => {
        //console.log("again, total seconds:", totalSeconds % 60);
        //console.log("again, raw seconds:", rawSeconds);
    setIsPaused((prev) => !prev); // toggle
};

    const handleStop = () => {
        setIsPaused(true); // freeze
    setElapsedTotal(0);       // reset main clock
    //console.log("total seconds:", totalSeconds % 60);
    //console.log("raw seconds:", rawSeconds);
    lastCycleRef.current = 0;
    hasRungRef.current = false;
    };

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setNow((prev) => prev + 1);
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, []);

    const [elapsed, setElapsed] = useState(0);

    // 0.05s = 50ms

const [elapsedTotal, setElapsedTotal] = useState(0);

const displayTotalSeconds =
  mode === "Timer"
    ? Math.max(0, Math.ceil(initialSeconds - elapsedTotal))
    : Math.max(0, Math.floor(elapsedTotal));

const displayHours = Math.floor(displayTotalSeconds / 3600);
const displayMinutes = Math.floor((displayTotalSeconds % 3600) / 60);
const displaySeconds = displayTotalSeconds % 60;

const lastCycleRef = useRef(0);
const hasRungRef = useRef(false);

useEffect(() => {
    if (isPaused) return;

    let startTime = performance.now() - elapsedTotal * 1000;
    let animationFrame: number;

    const update = (currentTime: number) => {
        let total = (currentTime - startTime) / 1000;
        setElapsedTotal(total);

const currentCycle = Math.floor(total / beepInterval);

if (mode === "Timer" && total >= initialSeconds) {
    total = initialSeconds;

    if (!hasRungRef.current) {
        if (ringRef.current) {
            ringRef.current.currentTime = 0;
            ringRef.current.play();
        }
        hasRungRef.current = true;
    }

    setElapsedTotal(total);
    setIsPaused(true);
    return;
}

if (currentCycle > lastCycleRef.current) {
    if (beepRef.current && isBeep && !hasRungRef.current) {
        beepRef.current.currentTime = 0;
        beepRef.current.play();
    }
    lastCycleRef.current = currentCycle;
}

        animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);

    
    return () => cancelAnimationFrame(animationFrame);
}, [isPaused]);
    
    useEffect(() => {
        if (elapsed >= beepInterval) {
            // beep sound
            setElapsed(0);
        }
    }, [elapsed, beepInterval]);

useEffect(() => {
    if (mode === "Timer" && elapsedTotal >= initialSeconds) {
        setIsPaused(true);          // stop everything
        setElapsedTotal(initialSeconds); // clamp exactly to end
    }
}, [elapsedTotal, mode, initialSeconds]);


const cycleTime = elapsedTotal % beepInterval;
const progress = beepInterval > 0 ? (cycleTime / beepInterval) * 100 : 0;

  return (
    <div className="w-full mt-4">
        
        {/* Progress bar */}
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
className="h-full bg-blue-500"                style={{ width: `${progress}%` }}
            />
        </div>

        {/* Other content */}
    <div className="flex flex-col items-center gap-2">

            <h1 className="text-3xl font-semibold mt-5 mb-2">{mode}</h1>

      <div className="flex items-center gap-2">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <p className="w-16 text-center text-5xl rounded-lg py-1">{displayHours}</p>
          <span className="text-m text-gray-500">hours</span>
        </div>

        <span className="text-4xl">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <p className="w-16 text-center text-5xl rounded-lg py-1">{displayMinutes}</p>
          <span className="text-m text-gray-500">minutes</span>
        </div>

        <span className="text-4xl">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <p className="w-16 text-center text-5xl rounded-lg py-1">{displaySeconds}</p>
          <span className="text-m text-gray-500">seconds</span>
        </div>
      </div>

        <div className="flex items-center gap-8 mt-4">
        {/* Pause */}
        <button   onClick={handlePause}
 className="p-2 bg-[#5b5] hover:bg-[#7d7] rounded shadow">
        {isPaused ? <Play size={22} color="#eee" /> : <Pause size={22} color="#eee"  />}
        </button>

        {/* Stop */}
        <button   onClick={handleStop}
 className="p-2 bg-[#d55] hover:bg-[#f77] rounded shadow">
           {hasRungRef.current ? <TimerReset size={22} color="#eee" />: <Square size={22} color="#eee" /> }
        </button>

        {/* Home */}
        <button   onClick={handleHome}
className="p-2 bg-[#868ad9] hover:bg-[#a8acfb] rounded shadow">

            <Home size={22} color="#eee" />
        </button>
        </div>

        </div>
    </div>
    );
}