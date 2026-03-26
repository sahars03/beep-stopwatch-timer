"use client";
import { createContext, useContext, useState } from "react";

type Time = {
  hours: number;
  minutes: number;
  seconds: number;
};

type TimerConfig = {
  mode: "timer" | "stopwatch";
  time?: Time;
  beepTime: Time;
};

const TimerContext = createContext<{
  config: TimerConfig | null;
  setConfig: (c: TimerConfig) => void;
}>({
  config: null,
  setConfig: () => {},
});

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<TimerConfig | null>(null);

  return (
    <TimerContext.Provider value={{ config, setConfig }}>
      {children}
    </TimerContext.Provider>
  );
}

export const useTimer = () => useContext(TimerContext);