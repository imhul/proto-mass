import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useAnimation from '../../hooks/useAnimation';
import Moment from 'react-moment';

// Components
import Preloader from './Preloader';

const TimeMachine = () => {
    const [mins, setMinutes] = useState(0);


    const dispatch = useDispatch();
    const { time: { minutes, hours, days} } = useSelector(state => state.game);

    useAnimation(deltaTime => {
        setMinutes(prevMinutes => prevMinutes + deltaTime * 0.1);
    });

    const roundedMinutes = Math.round(mins);

    useEffect(() => {
        if (roundedMinutes % 60 === 1) {
            dispatch({ type: 'SET_HOURS' })
        }
    }, [dispatch, roundedMinutes]);

    useEffect(() => {
        if (hours % 60 === 1) {
            dispatch({ type: 'SET_DAYS' })
        }
    }, [dispatch, hours]);

    return (
        <div className="TimeMachine">
            <Moment interval={1000}>
                <Preloader 
                    percent={roundedMinutes % 100} 
                    class="mini" 
                    strokeWidth={10} 
                    format={null} />
            </Moment>
            <Preloader 
                percent={hours % 100} 
                class="mini" 
                strokeWidth={10} 
                format=" h" />
            {/* <div className="hours"> 
                {days - 1}
            </div> */}
            { console.info("hours: ", hours) }
        </div>
    )
};

export default TimeMachine;

