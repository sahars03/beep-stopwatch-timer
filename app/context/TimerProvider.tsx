"use client";
import { createContext, useContext, useState } from "react";

type Time = {
    hours: number;
    minutes: number;
    seconds: number;
};

type TimerConfig = {
    mode: "Timer" | "Stopwatch";
    time?: Time;
    beepTime: Time;
};

// context holding current stopwatch/timer settings and a function for updating them
const TimerContext = createContext<{
    config: TimerConfig | null;
    setConfig: (c: TimerConfig) => void;
}>({
    config: null,
    setConfig: () => {},
});

export function TimerProvider({children}: {children: React.ReactNode}) {
    // stores stopwatch/timer configurations
    const [config, setConfig] = useState<TimerConfig | null>(null);

    // wrap all components around provider
    return (
        <TimerContext.Provider value={{config, setConfig}}>
            {children}
        </TimerContext.Provider>
    );
}

export const useTimer = () => useContext(TimerContext);