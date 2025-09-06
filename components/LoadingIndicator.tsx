import React, { useState, useEffect } from 'react';

const loadingTexts = [
  "Understanding your request...",
  "Looking up my knowledge...",
  "Crafting the best answer...",
  "Double-checking the details...",
  "Adding some insights...",
  "Making it easy to understand...",
  "Almost there...",
  "Finalizing response...",
];

const LoadingIndicator: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="text-gray-300 transition-all duration-300 ease-in-out">
      {loadingTexts[currentIndex]}
    </div>
  );
};

export default LoadingIndicator;
