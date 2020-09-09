import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';

// Selectors
import { isGameInitSelector, isGameStartedSelector } from '../selectors/game';
import { unitsSelector } from '../selectors/units';
// import { tasksSelector } from '../selectors/task';

// Utils
import { getRandomInt } from '../utils';
import PropTypes from 'prop-types';
import uuidv5 from 'uuid/v5';
import _ from 'lodash';

export const useGetTask = props => {

    const [ count, setCount ] = useState(0);
    const dispatch = useDispatch();
    const unitList = useSelector(unitsSelector);
    // const taskBoard = useSelector(tasksSelector);
    const isGameInit = useSelector(isGameInitSelector);
    const isGameStarted = useSelector(isGameStartedSelector);
    const idLength = new Array(16);
    const taskId = uuidv5(`task#${getRandomInt(100, 1001)}`, idLength);
    const task = {
        id: taskId,
        status: "await",
        level: props && props.level ? props.level : 0,
        type: props && props.type ? props.type : "collect",
        workerId: props && props.workerId ? props.workerId : "",
        priority: props && props.priority ? props.priority : 1,
        profession: props && props.proffession ? props.proffession : "collector",
        professionLevel: props && props.professionLevel ? props.professionLevel : "trainee",
        limit: props && props.limit ? props.limit : 1,
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
        // TODO: const summ = props.limit + taskBoard.length; ???
        if (props && 
            props.limit && 
            unitList.length && 
            isGameInit &&
            !isGameStarted &&
            !_.isEmpty(task) && 
            count < props.limit
        ) getTask()
    }, [ props, isGameStarted, isGameInit, unitList, count, task, getTask ])
};

useGetTask.propTypes = {
    id: PropTypes.string,
    status: PropTypes.string,
    level: PropTypes.number,
    type: PropTypes.oneOf(['construct', 'collect', 'protect', 'numerate']),
    workerId: PropTypes.string,
    priority: PropTypes.number,
    profession: PropTypes.oneOf(['constructor', 'collector', 'protector', 'numerator']),
    professionLevel: PropTypes.oneOf(['trainee', 'medium', 'prime']),
    limit: PropTypes.number, // limit of current task
    position: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    })
};
