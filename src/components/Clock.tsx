import { useState, useEffect } from "preact/hooks";

const CurrentTime = () => {
    const [currentTime, setCurrentTime] = useState('');
    const [currentMinutes, setCurrentMinutes] = useState('');
    const [opacity, setOpacity] = useState(0);
  
    useEffect(() => { // LITERAL HELL
      const updateCurrentTime = () => {
        const now = new Date();
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
        let hours = now.getHours();
        hours = hours % 12 || 12; // 12 hour format
        const minutes = now.getMinutes();
  
        const formattedTime = `${dayOfWeek}, ${hours < 10 ? '0' : ''}${hours}`;
        setCurrentTime(formattedTime);
      };
  
      const updateCurrentMinutes = () => {
        const now = new Date();
        const minutes = now.getMinutes();
        const formattedMinutes = `${minutes < 10 ? '0' : ''}${minutes}`;
        setCurrentMinutes(formattedMinutes);
      };
  
      updateCurrentTime();
      updateCurrentMinutes();

      const timeIntervalId = setInterval(updateCurrentTime, 60000);
      const minutesIntervalId = setInterval(updateCurrentMinutes, 1000);
      return () => {
        clearInterval(timeIntervalId);
        clearInterval(minutesIntervalId);
      };
    }, []);

    useEffect(() => {
    const intervalId = setInterval(() => {
        setOpacity((prevOpacity) => (prevOpacity === 0 ? 1 : 0));
    }, 1000);
        return () => clearInterval(intervalId);
    }, []);
  
    return (
      <div class="flex flex-row">
        <div>{currentTime}</div>
        <div style={{ opacity }}>:</div>
        <div>{currentMinutes} PM</div>
      </div>
    );
  };
  
  export default CurrentTime;