import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    START_TIMER, 
    STOP_TIMER
} from 'redux-timer-middleware';

// Components
import Preloader from './Preloader';
import GameInfoBlock from './GameInfoBlock';

const TimeMachine = () => {

    const dispatch = useDispatch();

    const { 
        isTimeMachineInit, 
        gameHours,
        gameDays,
        gameYears,
    } = useSelector(state => state.time);

    useEffect(() => {
        if (isTimeMachineInit) dispatch({ 
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
    }, [ dispatch, isTimeMachineInit ]);

    return isTimeMachineInit && <GameInfoBlock>
        <div style={{ textAlign: 'center' }}>
            <div>
                <span>Hour: {gameHours % 24}</span>
            </div>
            <div>
                <span>Day: {gameDays % 365}</span> 
            </div>
            <div>
                <span>Year: {gameYears}</span>
            </div>
            <div>
                <Preloader 
                    percent={(gameHours % 24) * 4.16} 
                    class="medium" 
                    strokeWidth={10} 
                    format={null} 
                />
            </div>
        </div>
    </GameInfoBlock>
};

export default TimeMachine;
