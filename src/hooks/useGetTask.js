import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';

// Selectors
import { isGameInitSelector } from '../selectors/game';
import { unitsSelector } from '../selectors/units';

// Utils
import { getRandomInt } from '../utils';
import uuidv5 from 'uuid/v5';
import _ from 'lodash';

/**
 * @param  id: string
 * @param  status: string // await, progress, paused, done
 * @param  level: number
 * @param  type: string // construct, collect, fight
 * @param  workerId: string
 * @param  priority: number
 * @param  progress: number // from 0 to progressPoints
 * @param  progressPoints: number
 * @param  profession: string
 * @param  professionLevel: string
 * @param  position: object { x: number, y: number }
 * @param  limit: number // limit of current task
 */

export const useGetTask = props => {

    const [ count, setCount ] = useState(0);
    const dispatch = useDispatch();
    const unitList = useSelector(unitsSelector);
    const isGameInit = useSelector(isGameInitSelector);
    const idLength = new Array(16);
    const taskId = uuidv5(`task#${getRandomInt(100, 1001)}`, idLength);
    const task = {
        id: taskId,
        status: "await", // await, progress, paused, done
        level: props && props.level ? props.level : 0,
        type: props && props.type ? props.type : "collect", // construct, collect, fight
        workerId: props && props.workerId ? props.workerId : "",
        priority: props && props.priority ? props.priority : 1,
        progress: 0, // from 0 to progressPoints
        progressPoints: props && props.progressPoints ? props.progressPoints : 8,
        profession: props && props.proffession ? props.proffession : "collector",
        professionLevel: props && props.professionLevel ? props.professionLevel : "trainee",
        position: props && props.position ? props.position : {
            x: getRandomInt(1, 31),
            y: getRandomInt(1, 31)
        },
    };

    // effects
    const getTask = useCallback(() => {
        setCount(count + 1);
        dispatch({ 
            type: 'TASK_ADD', 
            payload: task,
        });
    }, [ setCount, count, dispatch, task ]);

    useEffect(() => {
        if (unitList.length && isGameInit && !_.isEmpty(task) && count < props.limit) getTask()
    }, [ unitList, props.limit, count, isGameInit, task, getTask ])
};

useGetTask.propTypes = {
    id: PropTypes.string,
    status: PropTypes.string,
    level: PropTypes.number,
    type: PropTypes.string,
    workerId: PropTypes.string,
    priority: PropTypes.number,
    progress: PropTypes.number,
    progressPoints: PropTypes.number,
    profession: PropTypes.oneOf(['constructor', 'collector', 'protector', 'numerator']),
    professionLevel: PropTypes.oneOf(['trainee', 'medium', 'prime']),
    position: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    }),
    limit: PropTypes.number
};
