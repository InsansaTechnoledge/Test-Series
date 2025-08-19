import { useEffect, useState } from "react";

export default function AudioLevelBar() {
  const [level, setLevel] = useState(0);
  const [barColor, setBarColor] = useState("bg-green-500");

  useEffect(() => {
    if (window?.electronAPI?.onAudioLevelEvent) {
      const unsubscribe = window.electronAPI.onAudioLevelEvent((event, data) => {
        const numericLevel = parseFloat(data);
        setLevel(numericLevel); // ✅ update React state
      });

      // cleanup (if your preload supports removing listeners)
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, []);

     const clamped = Math.min(Math.max(level, 0.001), 1.0);


  useEffect(() => {
 if (clamped > 0.08) setBarColor("bg-red-500"); // warning
  else if (clamped > 0.05) setBarColor("bg-yellow-500"); // caution
else setBarColor("bg-green-500"); // normal
     
  }, [clamped]);
    
  let percentage = 0;
  if (clamped <= 0.05) {

    percentage = ((clamped - 0.001) / (0.05 - 0.001)) * 75;
  } else {
  
    percentage = 75 + ((clamped - 0.05) / (1.0 - 0.05)) * 25;
  }

 
   

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="mb-2 flex justify-between text-sm text-gray-600">
        <span>Audio Level</span>
        <span>{level.toFixed(3)}</span>
      </div>

      <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full transition-all duration-200 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs mt-1 text-gray-500">
        <span>0.000</span>
        <span>2.000</span>
      </div>
    </div>
  );
}
