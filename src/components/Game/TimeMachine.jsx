import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTimer } from 'react-timer-hook';

// Components
import Preloader from './Preloader';

function MyTimer({ expiryTimestamp }) {
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
    } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });
  
  
    return (
      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: '30px'}}>
          <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
        </div>
        <p>{isRunning ? 'Running' : 'Not running'}</p>
        <button onClick={start}>Start</button>
        <button onClick={pause}>Pause</button>
        <button onClick={resume}>Resume</button>
        <button onClick={() => {
          // Restarts to 5 minutes timer
          const time = new Date();
          time.setSeconds(time.getSeconds() + 300);
          restart(time)
        }}>Restart</button>
      </div>
    );
  }

const TimeMachine = () => {

    const dispatch = useDispatch();
    // const { time: { minutes, hours, days} } = useSelector(state => state.game);

    // useEffect(() => {
    //     if (roundedMinutes % 60 === 1) {
    //         dispatch({ type: 'SET_HOURS' })
    //     }
    // }, [dispatch, roundedMinutes]);

    // useEffect(() => {
    //     if (hours % 60 === 1) {
    //         dispatch({ type: 'SET_DAYS' })
    //     }
    // }, [dispatch, hours]);

    const time = new Date();
    time.setSeconds(time.getSeconds() + 600); // 10 minutes timer
    return (
        <div className="TimeMachine">
            <MyTimer expiryTimestamp={time} />
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
