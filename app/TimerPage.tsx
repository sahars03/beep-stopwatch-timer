// TimerPage.tsx
import { useLocation } from "react-router-dom";

export default function TimerPage() {
  const location = useLocation();
  const { mode, time, beepTime } = location.state;

  return (
    <div>
      <h1>{mode}</h1>
      <p>Timer: {JSON.stringify(time)}</p>
      <p>Beep: {JSON.stringify(beepTime)}</p>
    </div>
  );
}