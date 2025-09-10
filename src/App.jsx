import React from "react";
import { LandingPage } from "./components/LandingPage";

export default function App() {
  const handleNavigate = (page) => {
    console.log(`Navigate to: ${page}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingPage onNavigate={handleNavigate} />
    </div>
  );
}
