import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatedTexture } from '../Map';

const Units = props => {
    
    // Effects
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { isGameInit } = useSelector(state => state.game);

    const {
        taskList, 
        pendingList,  
    } = useSelector(state => state.task);

    const { 
        unitList,
        isUnitStatsShown
    } = useSelector(state => state.unit);

    // TODO: if save.units.map(unit => unit.task ? DO_TASK : GENERATE_TASK)
    // TODO: if save.units { load } else { useGetUnit }
    
    const isUnitProfessionMatchTask = useCallback((unit, task) => {
        const unitProfessionsList = unit.professions;
        const taskProfession = task.profession;
        const whoIsPro = unitProfessionsList.filter(prof => prof.name === taskProfession);
        return whoIsPro.length > 0
    }, []);

    const taskSearch = useCallback(unit => {
        if (unitList.length > 0 && unit.task === null && isGameInit) {
            if (pendingList.length > 0) {
                const currentTask = pendingList.filter(task => 
                    task.workerId === unit.id
                );
                dispatch({ type: 'UNIT_GET_TASK', payload: { 
                    task: currentTask, 
                    userId: unit.id
                }});
                dispatch({ type: 'TASK_CONTINUED', payload: {
                    taskId: currentTask.id,
                    unitId: unit.id
                }});
            } else if (
                pendingList.length === 0 && 
                taskList.length > 0 && 
                !unit.task) 
            {
                const relevantTask = taskList.filter(task => 
                    isUnitProfessionMatchTask(unit, task)
                ); 
                dispatch({ type: 'UNIT_GET_TASK', payload: { 
                    task: relevantTask, 
                    unitId: unit.id
                }});
                dispatch({ type: 'TASK_ACCEPTED', payload: {
                    taskId: relevantTask[0].id,
                    unitId: unit.id
                }});
            }
        }
    }, [ 
        isGameInit, 
        unitList, 
        taskList, 
        pendingList, 
        isUnitProfessionMatchTask, 
        dispatch
    ]);
    
    useEffect(() => {
        unitList.map(unit => unit.status === "search" && taskSearch(unit))
    }, [ taskSearch, unitList ]);

    const OnAnimatedTextureClick = useCallback(event => {
        console.info("OnAnimatedTextureClick event: ", event)
    }, []);

    const unitsRender = unitList.map(unit => (
        <div 
            key={`animated-unit-wrapper-${unit.name}`}
            className="react-isometric-object-wrapper active unit-wrapper"
            style={{
                '--x':unit.position.x, 
                '--y':unit.position.y, 
                '--z':20, 
                '--object-width':props.width, 
                '--object-height':props.height,
                zIndex: unit.position.x + 10
            }}
        >
            {
                isUnitStatsShown && <div className="unit-stats">
                    {JSON.stringify(unit.position)}
                </div>
            }
            <AnimatedTexture
                id={unit.id}
                width={props.width}
                height={props.height}
                onClick={() => OnAnimatedTextureClick()}
                onPointerEnter={() => dispatch({ type: 'UNIT_STATS_TOGGLE' })}
                onPointerLeave={() => dispatch({ type: 'UNIT_STATS_TOGGLE' })}
                delay={200}
                frames={[
                    require("../../../assets/sprites/animations/bot/bot_0_0.2s.png"),
                    require("../../../assets/sprites/animations/bot/bot_1_0.2s.png"),
                    require("../../../assets/sprites/animations/bot/bot_2_0.2s.png"),
                    require("../../../assets/sprites/animations/bot/bot_3_0.2s.png"),
                ]}
            />
        </div>
    ));

    return unitsRender
};

export default Units;
