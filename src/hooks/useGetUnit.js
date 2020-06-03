import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';

// Utils
import { getRandomInt } from '../utils';
import uuidv5 from 'uuid/v5';
import _ from 'lodash';

// props:
// @name: string
// @isEnemy: boolean
// @limit: number

export const useGetUnit =  ({ name, isEnemy }) => {

    const dispatch = useDispatch();
    const { unitList, unitsLimit } = useSelector(state => state.unit);
    const { isObjectsCreated } = useSelector(state => state.map);
    const { isLoadSavedGame } = useSelector(state => state.game);
    
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
            status: "search", // walk, work, attak, rest, search, dead
            isEnemy: isEnemy ? isEnemy : false,
            stats: {
                level: getRandomInt(0, 4),
                health: 100,
                damage: 0,
                speed: 1.5,
                healthPoints: 100,
                pointsToNewLevel: 0,
            },
            position: {
                x: 15,
                y: 15,
            },
            task: null,
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
                    name: "constructor", // constructor, collector, protector, numerator
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
        if (!isLoadSavedGame && isObjectsCreated) getUnit();
    }, [getUnit, isLoadSavedGame, isObjectsCreated]);
};
