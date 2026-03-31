"use client";

import { useTimer } from "../context/TimerProvider";
import { useState, useEffect, useRef } from "react";
import { TimerReset, Play, Pause, Square, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RunPage() {
    
    // references for audios
    const beepRef = useRef<HTMLAudioElement | null>(null);
    const ringRef = useRef<HTMLAudioElement | null>(null);

    // navigation
    const router = useRouter();

    // creates audio objects and loads them on mount so that they are ready for the stopwatch/timer
    useEffect(() => {
        beepRef.current = new Audio("/progress-bar-beep.wav");
        ringRef.current = new Audio("/timer-finish.ogg");

        beepRef.current.preload = "auto";
        ringRef.current.preload = "auto";
    }, []);

    // stopwatch/timer settings
    const { config } = useTimer();

    // if nothing has been set, the user is informed
    if (!config) return (
        <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-semibold mt-5 mb-2">Nothing set</h1>
            <button
                onClick={() => router.push("/")}
                className="mt-3 p-3 text-xl text-white bg-[#6959cf] hover:bg-[#7a6adf] rounded shadow">
                Set stopwatch/timer
            </button>
        </div>
    );

    // state for when the stopwatch/timer is running or paused
    const [isPaused, setIsPaused] = useState(false);

    // total seconds in the duration of a beep interval
    const beepInterval = config.beepTime.hours * 3600 + config.beepTime.minutes * 60 + config.beepTime.seconds;
    
    // mode (stopwatch or timer)
    const mode = config.mode;

    // total duration of the timer initially
    const initialSeconds =
        mode === "Timer" && config.time
            ? config.time.hours * 3600 + config.time.minutes * 60 + config.time.seconds
            : 0;

    // store of whether or not a beep has been set
    const beepFree = beepInterval === 0 || beepInterval >= initialSeconds;

    // handler for when the home button is pressed
    const handleHome = () => {
        router.push("/");
    };

    // toggles pause/resume
    const handlePause = () => {
        setIsPaused((prev) => !prev);
    };

    // stops the stopwatch/timer and reset everything
    const handleStop = () => {
        setIsPaused(true);
        setElapsedTotal(0);      
        lastCycleRef.current = 0;
        hasRungRef.current = false;
    };

    // state for the time that has passed
    const [elapsedTotal, setElapsedTotal] = useState(0);

    // current time to display in seconds
    const displayTotalSeconds =
        mode === "Timer"
        ? Math.max(0, Math.ceil(initialSeconds - elapsedTotal))
        : Math.max(0, Math.floor(elapsedTotal));

    // hours, minutes and seconds derived
    const displayHours = Math.floor(displayTotalSeconds / 3600);
    const displayMinutes = Math.floor((displayTotalSeconds % 3600) / 60);
    const displaySeconds = displayTotalSeconds % 60;

    // tracks beep cycle and timer duration to make sure the sound effects play only when necessary
    const lastCycleRef = useRef(0);
    const hasRungRef = useRef(false);

    // main handler of sound effects and time display
    useEffect(() => {
        // loops are stopped when the stopwatch/timer is paused
        if (isPaused) return;

        let startTime = performance.now() - elapsedTotal * 1000;
        let animationFrame: number;

        const update = (currentTime: number) => {
            // real time
            let total = (currentTime - startTime) / 1000;
            setElapsedTotal(total);

            // number of intervals that have passed
            const currentCycle = Math.floor(total / beepInterval);

            // detects timer completion
            if (mode === "Timer" && total >= initialSeconds) {
                total = initialSeconds;
                
                // ring audio is played
                if (!hasRungRef.current) {
                    if (ringRef.current) {
                        ringRef.current.currentTime = 0;
                        ringRef.current.play();
                    }
                
                    hasRungRef.current = true;
                }
                
                // stops loop
                setElapsedTotal(total);
                setIsPaused(true);
                return;
            }

            // detects completion of a beep interval
            if (currentCycle > lastCycleRef.current) {
                if (beepRef.current && !beepFree && !hasRungRef.current) {
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

    // makes sure the timer stops
    useEffect(() => {
        if (mode === "Timer" && elapsedTotal >= initialSeconds) {
            setIsPaused(true);
            setElapsedTotal(initialSeconds);
        }
    }, [elapsedTotal, mode, initialSeconds]);

    // time within the current interval
    const cycleTime = elapsedTotal % beepInterval;
    // progress through beep interval as a percentage
    const progress = beepInterval > 0 ? (cycleTime / beepInterval) * 100 : 0;

    return (
        <div className="w-full mt-4">
        
            {/* Progress bar */}
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-500"
                    style={{ width: `${progress}%` }}
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
                    <button
                        onClick={handlePause}
                        className="p-2 bg-[#5b5] hover:bg-[#7d7] rounded shadow"
                    >
                        {isPaused ? <Play size={22} color="#eee"/> : <Pause size={22} color="#eee"/>}
                    </button>

                    {/* Stop */}
                    <button 
                        onClick={handleStop}
                        className="p-2 bg-[#d55] hover:bg-[#f77] rounded shadow"
                    >
                        {hasRungRef.current ? <TimerReset size={22} color="#eee"/>: <Square size={22} color="#eee"/>}
                    </button>

                    {/* Home */}
                    <button 
                        onClick={handleHome}
                        className="p-2 bg-[#868ad9] hover:bg-[#a8acfb] rounded shadow"
                    >
                        <Home size={22} color="#eee"/>
                    </button>
                </div>
            </div>

        </div>
    );
}