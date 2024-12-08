import { useEffect, useState } from "react";

const getRemainingTime = (targetDate) => {
  const now = new Date();
  const target = new Date(targetDate);
  const difference = target - now;

  if (difference <= 0) {
    return "00 : 00 : 00 : 00"; // Return 0 when the target date is in the past
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  // Format values to always show two digits
  const format = (value) => String(value).padStart(2, "0");

  return `${format(days)} : ${format(hours)} : ${format(minutes)} : ${format(
    seconds
  )}`;
};

const Timer = ({ endDate, className }) => {
  const [timer, setTimer] = useState(() => getRemainingTime(endDate));

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(getRemainingTime(endDate));
    }, 1000);

    return () => clearInterval(countdown);
  }, [endDate]);

  return (
    <>
      <p className={`text-secondary text-lg font-bold ${className}`}>{timer}</p>
    </>
  );
};

export default Timer;
