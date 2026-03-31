"use client";

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

export default function TimeInput({ label, value, onChange }: TimeInputProps) {

    // updates time inputs
    const handleChange = (field: keyof Time) => (e: React.ChangeEvent<HTMLInputElement>) => {
        // input
        const raw = e.target.value;

        // validate input (so that only an integer is entered)
        if (!/^\d*$/.test(raw)) return;

        // convert input to a number
        const num = raw === "" ? 0 : Number(raw);

        // update the relevant field with the new input
        onChange({...value, [field]: num});
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
                  <span className="text-xs text-gray-500">hours</span>
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
                  <span className="text-xs text-gray-500">minutes</span>
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
                  <span className="text-xs text-gray-500">seconds</span>
              </div>
          </div>
    </div>
  );
}