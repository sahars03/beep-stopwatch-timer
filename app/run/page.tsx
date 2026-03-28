"use client";
import { useTimer } from "../context/TimerProvider";
import { useState, useEffect } from "react";

export default function RunPage() {
    const { config } = useTimer();

    // TODO: make this look better
    if (!config) return <p>No timer set</p>;

    const beepInterval = config.beepTime.hours * 3600 + config.beepTime.minutes * 60 + config.beepTime.seconds;
    const mode = config.mode;

    console.log("interval: ", beepInterval);

    const initialSeconds =
    mode === "Timer" && config.time
        ? config.time.hours * 3600 +
        config.time.minutes * 60 +
        config.time.seconds
        : 0;


    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setNow((prev) => prev + 1);
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, []);

    const [totalSeconds, setTotalSeconds] = useState(initialSeconds);

    // fine
    useEffect(() => {
        const interval = setInterval(() => {
            setTotalSeconds((prev) => {
            if (mode === "Timer") {
                return Math.max(0, prev - 1); // countdown
            } else {
                return prev + 1; // stopwatch
            }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [mode]);


    const [elapsed, setElapsed] = useState(0);

    // 0.05s = 50ms

useEffect(() => {
    let startTime = performance.now();
    let animationFrame: number;

let lastCycle = 0;

const update = (currentTime: number) => {
    const totalElapsed = (currentTime - startTime) / 1000;
    const currentCycle = Math.floor(totalElapsed / beepInterval);

    if (currentCycle > lastCycle) {
        lastCycle = currentCycle;
    }

    const cycleTime = totalElapsed % beepInterval;
    setElapsed(cycleTime);

    animationFrame = requestAnimationFrame(update);
};

    animationFrame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrame);
}, [beepInterval, mode]);
    
    useEffect(() => {
        if (elapsed >= beepInterval) {
            // beep sound
            setElapsed(0);
        }
    }, [elapsed, beepInterval]);

    console.log("elapsed: ", elapsed);
const progress =
  beepInterval > 0 ? (elapsed / beepInterval) * 100 : 0;
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
        </div>
    </div>
    );
}