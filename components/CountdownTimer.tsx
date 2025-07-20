import React, { useState, useEffect } from 'react';

const COUNTDOWN_SECONDS = 30;

export const CountdownTimer: React.FC = () => {
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

    useEffect(() => {
        if (countdown <= 0) return;

        const intervalId = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [countdown]);

    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const progress = countdown / COUNTDOWN_SECONDS;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div className="relative w-20 h-20 my-4 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 60 60">
                {/* Background circle */}
                <circle
                    cx="30"
                    cy="30"
                    r={radius}
                    fill="none"
                    stroke="#E5E7EB" // zinc-200
                    strokeWidth="4"
                />
                {/* Progress circle */}
                <circle
                    cx="30"
                    cy="30"
                    r={radius}
                    fill="none"
                    stroke="#F97316" // orange-500
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 30 30)"
                    style={{ transition: 'stroke-dashoffset 0.5s linear' }}
                />
            </svg>
            <span className="absolute text-2xl font-semibold text-zinc-800">
                {countdown}
            </span>
        </div>
    );
};
