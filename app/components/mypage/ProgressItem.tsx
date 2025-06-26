import React, { ReactNode } from "react";

interface itemProps {
  title: string;
  sub: string;
  icon: string | ReactNode;
}

export default function ProgressItem({ title, sub, icon }: itemProps) {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">{icon}</div>
      <p className="font-bold text-base">{title}</p>
      {/* <p className="text-zinc-400 text-sm">{sub}</p> */}
    </div>
  );
}
