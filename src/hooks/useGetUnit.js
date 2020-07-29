import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';

// Selectors
import { isLoadSavedGameSelector, isGameStartedSelector } from '../selectors/game';
import { unitsSelector, unitsLimitSelector } from '../selectors/units';
import { isObjectsCreatedSelector } from '../selectors/map';

// Utils
import { getRandomInt } from '../utils';
import PropTypes from 'prop-types';
import uuidv5 from 'uuid/v5';
import _ from 'lodash';

export const useGetUnit =  ({ name, isEnemy }) => {

    const dispatch = useDispatch();
    const isGameStarted = useSelector(isGameStartedSelector);
    const unitList = useSelector(unitsSelector);
    const unitsLimit = useSelector(unitsLimitSelector);
    const isObjectsCreated = useSelector(isObjectsCreatedSelector);
    const isLoadSavedGame = useSelector(isLoadSavedGameSelector);
    
    const onUnitCreated = useCallback(() => {
        dispatch({ 
            type: 'LOADING_GAME_UPDATE', 
            payload: getRandomInt(51, 81), 
            meta: "units  is created" 
        });
    }, [dispatch]);

    const getUnit = useCallback(() => {

        const idLength = new Array(16);
        const userId = uuidv5(name, idLength);
        const unit = {
            id: userId,
            name: name,
            freeMode: true,
            status: "search", // walk, work, attak, rest, search, dead
            isEnemy: isEnemy ? isEnemy : false,
            stats: {
                level: getRandomInt(0, 4),
                health: 100,
                damage: 0,
                speed: 900,
                healthPoints: 100,
                pointsToNewLevel: 0,
            },
            position: {
                x: 15,
                y: 15,
            },
            path: [
                // {
                    // x: ...,
                    // y: ...
                // },
            ],
            taskList: [],
            skills: [],
            //     {
            //         id: "",
            //         name: "", // TODO: need special randomizer from list!
            //         status: "",
            //         progress: 0, // x-points
            //         level: 0, // max 20
            //         levelName: "trainee", // medium, prime
            //         pointsToNextLevel: 0, // x-points
            //         bonus: {
            //             id: "",
            //             name: "",
            //             value: 0,
            //         },
            //     },
            technologies: [],
            // {
            //     id: "",
            //     name: "", // TODO: need special randomizer from list!
            //     status: "",
            //     progress: "", // x-points
            //     level: 0, // max 20
            //     levelName: "trainee", // medium, prime
            //     pointsToNextLevel: 0, // x-points
            //     bonus: {
            //         id: "",
            //         name: "",
            //         value: 0,
            //     },
            // },
            professions: [
                {
                    id: "",
                    name: "collector", // constructor, collector, protector, numerator
                    status: "",
                    progress: "", // x-points
                    level: 0, // max 20
                    levelName: "trainee", // medium, prime
                    pointsToNextLevel: 0, // x-points
                    bonus: {
                        id: "",
                        name: "",
                        value: 0,
                    },
                },
            ],
            // {
                //     id: profId,
                //     name: "constructor", 
                //     status: "",
                //     progress: "", // x-points
                //     level: 1, // max 20
                //     levelName: "trainee", // medium, prime
                //     pointsToNextLevel: 0, // x-points
                //     bonus: {
                //         id: "",
                //         name: "",
                //         value: 0,
                //     },
                // },

            // unit backpack items
            itemsStorage: [],
            // unit wear
            items: [ 
                // {
                //     id: "",
                //     name: "",
                //     type: "",
                //     stats: {},
                // },
            ],
        }; 

        if (!_.isEmpty(unit) && unitsLimit > unitList.length ) {
            dispatch({ type: 'UNIT_CREATED', payload: unit });
            onUnitCreated();
        }
    }, [ unitList.length, unitsLimit, isEnemy, name, onUnitCreated, dispatch ]);

    useEffect(() => {
        if (!isGameStarted && !unitList.length && !isLoadSavedGame && isObjectsCreated) getUnit();
    }, [ isGameStarted, isLoadSavedGame, isObjectsCreated, unitList.length, getUnit ]);
};

useGetUnit.propTypes = {
    name: PropTypes.string,
    isEnemy: PropTypes.bool
};
