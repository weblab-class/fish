"use client";
import DrawingCanvas from "@/components/DrawingCanvas";
import React, { useRef } from "react";

export default function page() {
  return (
    <div className="h-screen w-screen">
      <DrawingCanvas />
    </div>
  );
}
