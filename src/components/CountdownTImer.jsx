import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

    useEffect(() => {
        const intervalId = setInterval(() => {
            const remainingTime = calculateTimeLeft(targetDate);
            if (remainingTime.total <= 0) {
                clearInterval(intervalId);
            }
            setTimeLeft(remainingTime);
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, [targetDate]);

    function calculateTimeLeft(target) {
        const now = new Date();
        const targetTime = new Date(target);
        const difference = targetTime - now;

        return {
            total: difference,
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    return (
        <div>
            {timeLeft.total > 0 ? (
                <h3>
                   Best Before: {timeLeft.hours === 0 ? '' : `${timeLeft.hours}h`} {timeLeft.minutes === 0 ? '' : `${timeLeft.minutes}m`} {timeLeft.seconds}s
                </h3>
            ) : (
                <h3>Quote expired!</h3>
            )}
        </div>
    );
};

export default CountdownTimer;
