"use client";
import { useTimer } from "../context/TimerProvider";
import { useState, useEffect } from "react";
import { Play, Pause, Square, Home } from "lucide-react";
import { useRouter } from "next/navigation";


export default function RunPage() {
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



    const initialSeconds =
    mode === "Timer" && config.time
        ? config.time.hours * 3600 +
        config.time.minutes * 60 +
        config.time.seconds
        : 0;

        const handlePause = () => {
    setIsPaused((prev) => !prev); // toggle
};

    const handleStop = () => {
        setIsPaused(true); // freeze
    setElapsedTotal(0);       // reset main clock
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

const rawSeconds =
    mode === "Timer"
        ? initialSeconds - Math.floor(elapsedTotal)
        : Math.floor(elapsedTotal);

const totalSeconds = Math.max(0, rawSeconds);

useEffect(() => {
    if (isPaused) return;

    let startTime = performance.now() - elapsedTotal * 1000;
    let animationFrame: number;

    const update = (currentTime: number) => {
        const total = (currentTime - startTime) / 1000;
        setElapsedTotal(total);

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

const cycleTime = elapsedTotal % beepInterval;
const progress = beepInterval > 0 ? (cycleTime / beepInterval) * 100 : 0;

// useEffect(() => {
//     if (isPaused || isStopped) return; //  stop updating

//     const interval = setInterval(() => {
//         setTotalSeconds((prev) => {
//             if (mode === "Timer") {
//                 return Math.max(0, prev - 1);
//             } else {
//                 return prev + 1;
//             }
//         });
//     }, 1000);

//     return () => clearInterval(interval);
// }, [mode, isPaused, isStopped]);








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
          <p className="w-16 text-center text-5xl rounded-lg py-1">{Math.floor(totalSeconds / 3600)}</p>
          <span className="text-m text-gray-500">hrs</span>
        </div>

        <span className="text-4xl">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <p className="w-16 text-center text-5xl rounded-lg py-1">{Math.floor((totalSeconds % 3600) / 60)}</p>
          <span className="text-m text-gray-500">min</span>
        </div>

        <span className="text-4xl">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <p className="w-16 text-center text-5xl rounded-lg py-1">{totalSeconds % 60}</p>
          <span className="text-m text-gray-500">sec</span>
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
            <Square size={22} color="#eee" />
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