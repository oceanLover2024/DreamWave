"use client";
import { usePhotographer } from "@/context/PhotographerContext";
export const Footer = () => {
  const { photographerName } = usePhotographer();
  return (
    <div>
      <footer
        style={{
          textAlign: "center",
          fontSize: "12px",
          padding: "10px",
          opacity: 1,
          backgroundColor: "white",
          height: "17px",
        }}
      >
        COPYRIGHT © 2025 Dream Wave 📷 Photo by {photographerName}
      </footer>
    </div>
  );
};
