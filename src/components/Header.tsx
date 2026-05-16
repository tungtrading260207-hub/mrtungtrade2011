
import React, { useState, useEffect } from "react";

export default function Header() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup the interval on component unmount to prevent memory leaks
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `[${day}-${month}-${year} ${hours}:${minutes}:${seconds} UTC+7]`;
  };

  return (
    <header className="bg-card text-card-foreground border-b border-border p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Tìm kiếm mã tài sản..."
          className="px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="text-sm font-mono">{formatTime(currentTime)}</div>
    </header>
  );
}
