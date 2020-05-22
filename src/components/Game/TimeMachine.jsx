import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTimer } from 'react-timer-hook';

// Components
import Preloader from './Preloader';

const Timer = ({ expiryTimestamp }) => {

    const dispatch = useDispatch();
    const { gameTime } = useSelector(state => state.game);

    // Init
    useEffect(() => {
        dispatch({ type: 'TIME_MACHINE_INIT' })
    }, [dispatch]);
    
    const now = new Date();
    now.setSeconds(now.getSeconds() + 24);

    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({
        expiryTimestamp, onExpire: () => onHourExpire()});

    const onHourExpire = useCallback(() => {
        dispatch({ type: 'SET_HOURS' });
        restart(now);
        console.warn('onExpire called');
        if (gameTime.hours % 24 === 0 && gameTime.hours > 23) {
            dispatch({ type: 'SET_DAYS' });
        }
    }, [ dispatch, restart, gameTime.hours ]);

    const gameHours = 24 - seconds;
    const gameDayPercent = gameHours * 4.16;

    return (
        <div style={{ textAlign: 'center' }}>
            <div>
                <span>Day: {gameTime.days}</span> <span>Hour: {gameHours}</span>
            </div>
            <div>
                <Preloader 
                    percent={gameDayPercent} 
                    class="medium" 
                    strokeWidth={10} 
                    format={null} />
            </div>
            <button onClick={pause}>Pause</button>
            <button onClick={resume}>Resume</button>
        </div>
    )
};

const TimeMachine = () => {

    // const dispatch = useDispatch();
    const time = new Date();
    time.setSeconds(time.getSeconds() + 24); // 1 minute timer

    return (
        <div className="TimeMachine">
            <Timer expiryTimestamp={time} />
        </div>
    )
};

export default TimeMachine;
