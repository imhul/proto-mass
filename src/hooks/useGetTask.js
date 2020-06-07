import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';

// Utils
import { getNewTask } from '../utils';
import _ from 'lodash';

export const useGetTask = props => {

    const { taskList, taskLimit } = useSelector(state => state.task);
    const { unitList } = useSelector(state => state.unit);
    const { isGameInit } = useSelector(state => state.game);
    const dispatch = useDispatch();
    const getTask = useCallback(() => {

        const task = getNewTask(props);
        const copies = taskList.filter(item => item.id === task.id);

        if (!_.isEmpty(task) && copies.length < 1) {
            dispatch({ type: 'TASK_ADD', payload: task });
        }
        
    }, [ dispatch, taskList, props ]);

    useEffect(() => {
        if (unitList.length > 0 && isGameInit && taskLimit > taskList.length) getTask()
    }, [getTask, unitList, isGameInit, taskLimit, taskList.length])
};
