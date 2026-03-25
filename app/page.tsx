"use client";

import { useState } from "react";

type Time = {
  hours: number;
  minutes: number;
  seconds: number;
};

type TimeInputProps = {
  label: string;
  value: Time;
  onChange: (value: Time) => void;
};

function TimeInput({ label, value, onChange }: TimeInputProps) {
  const handleChange = (field: keyof Time) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (!/^\d*$/.test(raw)) return;

    const num = raw === "" ? 0 : Number(raw);

    onChange({
      ...value,
      [field]: num,
    });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p>{label}</p>

      <div className="flex items-center gap-2">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <input
            type="text"
            value={value.hours}
            onChange={handleChange("hours")}
            className="w-16 text-center text-2xl border rounded-lg py-1"
          />
          <span className="text-xs text-gray-500">hrs</span>
        </div>

        <span className="text-2xl font-bold">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <input
            type="text"
            value={value.minutes}
            onChange={handleChange("minutes")}
            className="w-16 text-center text-2xl border rounded-lg py-1"
          />
          <span className="text-xs text-gray-500">min</span>
        </div>

        <span className="text-2xl font-bold">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <input
            type="text"
            value={value.seconds}
            onChange={handleChange("seconds")}
            className="w-16 text-center text-2xl border rounded-lg py-1"
          />
          <span className="text-xs text-gray-500">sec</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("Stopwatch");

  const [beepTime, setBeepTime] = useState<Time>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const [timerTime, setTimerTime] = useState<Time>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-4">
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
              <button className="bg-[#50c878] hover:bg-[#61d989] text-white rounded px-2 py-2 font-bold w-[150px] text-xl">Start</button>
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

              <button className="bg-[#50c878] hover:bg-[#61d989] text-white rounded px-2 py-2 font-bold w-[150px] text-xl">Start</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}