import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTimer } from 'react-timer-hook';
import { 
    START_TIMER, 
    STOP_TIMER
} from 'redux-timer-middleware';

// Components
import Preloader from './Preloader';

const Timer = ({ expiryTimestamp }) => {

    const dispatch = useDispatch();

    // Init
    useEffect(() => {
        dispatch({ type: 'TIME_MACHINE_INIT' })
    }, [dispatch]);
    
    const { 
        isTimeMachineInit, 
        gameMinutes,
        gameHours,
        gameDays,
        gameYears,
    } = useSelector(state => state.time);
    
    const now = new Date();
    now.setSeconds(now.getSeconds() + 24);

    const {
        seconds,
        pause,
        resume,
        restart,
    } = useTimer({
        expiryTimestamp, 
        onExpire: () => onHourExpire()
    });

    const onHourExpire = useCallback(() => {
        restart(now)
    }, [ restart, now ]);

    const gameHoursCount = 24 - seconds;
    const gameDayPercent = gameHoursCount * 4.16;

    return (
        <div style={{ textAlign: 'center' }}>
            <div>
                <span>Day: {gameDays}</span> <span>Hour: {gameHours % 23}</span>
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

    const dispatch = useDispatch();
    const time = new Date();
    time.setSeconds(time.getSeconds() + 24); // 1 minute timer

    useEffect(() => {
        dispatch({ 
            type: START_TIMER,
            payload: {
                actionName: 'SET_HOURS',
                timerName: 'hoursTimer',
                // actionPayload, // action payload that will be dispatched each timer interval
                // timerPeriod, // how many timer ticks should work timer
                // timerInterval = 1000, // timer interval, default - 1s
            }
        });
        return () => {
            dispatch({ 
                type: STOP_TIMER,
                payload: {
                    actionName: 'CLEAR_HOURS_TIMER',
                    timerName: 'hoursTimer',
                }
            });
        }
    }, [dispatch]);

    return (
        <div className="TimeMachine">
            <Timer expiryTimestamp={time} />
        </div>
    )
};

export default TimeMachine;
