"use client";

import { useState } from "react";
import TimeInput from "./TimeInput";
import { useRouter } from "next/navigation";
import { useTimer } from "./context/TimerProvider";

type Time = {
  hours: number;
  minutes: number;
  seconds: number;
};

export default function Home() {

    // navigation
    const router = useRouter();

    // stopwatch/timer context
    const { setConfig } = useTimer();
    
    // current tab  
    const [activeTab, setActiveTab] = useState("Stopwatch");

    // stores beep interval duration
    const [beepTime, setBeepTime] = useState<Time>({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    
    // stores timer duration
    const [timerTime, setTimerTime] = useState<Time>({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    return (
        <div>
            {/* Tabs */}
            <div className="flex border-b">
                <button
                    onClick={() => setActiveTab("Stopwatch")}
                    className={`flex-1 py-2 text-sm font-medium transition ${
                        activeTab === "Stopwatch"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Stopwatch
                </button>
            
                <button
                    onClick={() => setActiveTab("Timer")}
                    className={`flex-1 py-2 text-sm font-medium transition ${
                        activeTab === "Timer"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Timer
                </button>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {activeTab === "Stopwatch" && (
                    <div className="p-6 gap-3 rounded-xl flex flex-col items-center justify-center text-center min-h-[150px]">
                        <h1 className="text-3xl font-semibold mb-2">Stopwatch</h1>
                        <TimeInput
                            label="Beep frequency"
                            value={beepTime}
                            onChange={setBeepTime}
                        />
                        <button
                            onClick={() => {
                                setConfig({
                                    mode: "Stopwatch",
                                    beepTime,
                                });
                                router.push("/run");
                            }}
                            className="mt-3 p-3 text-xl text-white bg-[#6959cf] hover:bg-[#7a6adf] rounded shadow"
                        >
                            Start
                        </button>
                    </div>
                )}

                {activeTab === "Timer" && (
                    <div className="p-6 gap-3 rounded-xl flex flex-col items-center justify-center text-center min-h-[150px]">
                        <h1 className="text-3xl font-semibold mb-2">Timer</h1>

                        <TimeInput
                            label="Duration"
                            value={timerTime}
                            onChange={setTimerTime}
                        />

                        <TimeInput
                            label="Beep frequency"
                            value={beepTime}
                            onChange={setBeepTime}
                        />
                        
                        <button
                            onClick={() => {
                                setConfig({
                                    mode: "Timer",
                                    time: timerTime,
                                    beepTime,
                                });
                                router.push("/run");
                            }}
                            className="mt-3 p-3 text-xl text-white bg-[#6959cf] hover:bg-[#7a6adf] rounded shadow"
                        >
                            Start
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}