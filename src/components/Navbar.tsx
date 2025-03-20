import { useState, useEffect } from 'react';

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-7 bg-black/20 backdrop-blur-xl flex items-center justify-between px-4 text-white text-sm z-50">
      <div className="font-semibold">Aviraj Paul</div>
      <div>{formatDate(currentTime)}</div>
    </div>
  );
}