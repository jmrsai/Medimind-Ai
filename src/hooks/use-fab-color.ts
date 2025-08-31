import { useState, useEffect } from 'react';

// HSL colors that work well with the existing theme
const colors = [
  'hsl(216, 98%, 63%)', // --primary
  'hsl(180, 82%, 45%)', // A teal color
  'hsl(262, 84%, 60%)', // A purple color
  'hsl(34, 97%, 64%)',  // An orange color
  'hsl(340, 82%, 60%)', // A pink color
];

export function useFabColor() {
  const [color, setColor] = useState(colors[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setColor(prevColor => {
        let newColor;
        do {
          newColor = colors[Math.floor(Math.random() * colors.length)];
        } while (newColor === prevColor);
        return newColor;
      });
    }, 3000); // Change color every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return color;
}
