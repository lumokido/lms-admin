import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-7 h-7 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
