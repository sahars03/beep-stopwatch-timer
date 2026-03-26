"use client";
import { useTimer } from "../context/TimerProvider";
import { useState, useEffect } from "react";

export default function RunPage() {
  const { config } = useTimer();

  if (!config) return <p>No timer set</p>;

    const beepInterval =
    config.beepTime.hours * 3600 +
    config.beepTime.minutes * 60 +
    config.beepTime.seconds;

    const [elapsed, setElapsed] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setElapsed((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  if (elapsed >= beepInterval) {
    // beep sound
    setElapsed(0);
  }
}, [elapsed, beepInterval]);

const progress = (elapsed / beepInterval) * 100;

  return (
    <div className="w-full mt-4">
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
        className="h-full bg-blue-500 transition-all duration-1000"
        style={{ width: `${progress}%` }}
        />
    </div>
    </div>
  );
}