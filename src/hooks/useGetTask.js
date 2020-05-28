import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';

// Utils
import { getRandomInt } from '../utils';
import uuidv5 from 'uuid/v5';
// import _ from 'lodash';

export const useGetTask = props => {

    const { taskList } = useSelector(state => state.task);
    const dispatch = useDispatch();
    const getTask = useCallback(() => {

        const idLength = new Array(16);
        const taskId = uuidv5(`task#${getRandomInt(100, 1001)}`, idLength);

        const task = {
            id: taskId,
            status: "await", // await, progress, paused, done
            level: props.level ? props.level : 0,
            type: props.type ? props.type : "construct", // construct, collect, fight
            workerId: props.workerId ? props.workerId : "",
            priority: props.priority ? props.priority : 1,
            progress: 0, // from 0 to progressPoints
            progressPoints: props.progressPoints ? props.progressPoints : 8,
            profession: props.proffession ? props.proffession : "constructor",
            professionLevel: props.professionLevel ? props.professionLevel : "trainee",
            positions: props.positions ? props.positions : [
                {
                    x: getRandomInt(1, 31),
                    y: getRandomInt(1, 31)
                },
            ],
        }; 

        const copies = taskList.filter(item => item.id === task.id);

        if (task && copies.length < 1) {
            dispatch({ type: 'TASK_ADD', payload: task });
        }
        
    }, [ dispatch, taskList, props ]);

    useEffect(() => {
        getTask()
    }, [getTask])
};
