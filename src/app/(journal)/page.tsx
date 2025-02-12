"use client";

import { useWindowScroll } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

function getDateString(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
}

export default function Page() {
  const [entries, setEntries] = useState<string[]>([getDateString(0)]);
  const [{ y }, scrollTo] = useWindowScroll();

  useEffect(() => {
    const isNearBottom =
      window.innerHeight + (y ?? 0) >=
      document.documentElement.scrollHeight - 100;

    if (isNearBottom) {
      setEntries((current) => {
        const nextDate = getDateString(current.length);
        if (current.includes(nextDate)) return current;
        return [...current, nextDate];
      });
    }
  }, [y]);

  return (
    <div className="flex flex-col divide-y">
      {entries.map((date, index) => (
        <div
          key={date}
          className={`flex flex-col px-4 pb-6 ${
            index === 0 ? "h-[calc(100vh-128px)]" : "min-h-72"
          }`}
        >
          <div className="flex h-16 items-center justify-between">
            <h2 className="text-xl font-semibold">{date}</h2>
          </div>
          <textarea
            className="w-full flex-1 resize-none bg-transparent focus:outline-none"
            placeholder="Start writing..."
          />
        </div>
      ))}

      {y && y > 500 && (
        <button
          onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background"
        >
          ↑
        </button>
      )}
    </div>
  );
}
