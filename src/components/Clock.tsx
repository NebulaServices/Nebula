import { useState, useEffect } from 'preact/hooks';

const Clock = () => {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => { // Hell
        const updateCurrentTime = () => {
        const now = new Date();
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
        let hours = now.getHours();
        hours = hours % 12 || 12;

        const formattedTime = `${dayOfWeek}, ${hours < 10 ? '0' : ''}${hours}`;
        
        setCurrentTime(formattedTime);
        };
        updateCurrentTime();
        const intervalId = setInterval(updateCurrentTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <h1>{currentTime}</h1>
    );
};

export default Clock;