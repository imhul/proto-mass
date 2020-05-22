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
    now.setSeconds(now.getSeconds() + 6);

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
        if (gameTime.hours % 60 === 1 && gameTime.hours > 59) {
            dispatch({ type: 'SET_DAYS' });
        }
    }, [ dispatch, restart, now, gameTime.hours ]);

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '30px' }}>
                <span>{days}</span>:
                <span>{hours}</span>:
                <span>{minutes}</span>:
                <span>{seconds}</span>
            </div>
            <p>{isRunning ? 'Running' : 'Not running'}</p>
            <button onClick={start}>Start</button>
            <button onClick={pause}>Pause</button>
            <button onClick={resume}>Resume</button>
            <button onClick={() => restart(now)}>Restart</button>
        </div>
    );
}

const TimeMachine = () => {

    // const dispatch = useDispatch();
    const time = new Date();
    time.setSeconds(time.getSeconds() + 6); // 1 minute timer

    return (
        <div className="TimeMachine">
            <Timer expiryTimestamp={time} />
        </div>
    );
}

//         <Preloader 
//             percent={roundedMinutes % 100} 
//             class="mini" 
//             strokeWidth={10} 
//             format={null} />

//         <Preloader 
//             percent={hours % 100} 
//             class="mini" 
//             strokeWidth={10} 
//             format=" h" />


export default TimeMachine;
