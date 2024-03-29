import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Selectors
import { isLoadSavedGameSelector, isGameStartedSelector } from '../selectors/game';
import { unitsSelector, unitsLimitSelector } from '../selectors/units';
import { isObjectsCreatedSelector } from '../selectors/map';

// Utils
import { getRandomInt } from '../utils';
import PropTypes from 'prop-types';
import { v5 as uuidv5 } from 'uuid';
import _ from 'lodash';

export const useGetUnit = ({ name, isEnemy }) => {
    const dispatch = useDispatch();
    const isGameStarted = useSelector(isGameStartedSelector);
    const unitList = useSelector(unitsSelector);
    const unitsLimit = useSelector(unitsLimitSelector);
    const isObjectsCreated = useSelector(isObjectsCreatedSelector);
    const isLoadSavedGame = useSelector(isLoadSavedGameSelector);

    const onUnitCreated = useCallback(() => {
        !isGameStarted &&
            dispatch({
                type: 'LOADING_GAME_UPDATE',
                payload: getRandomInt(51, 81),
                meta: 'units is created'
            });
    }, [isGameStarted, dispatch]);

    const getUnit = useCallback(() => {
        const idLength = new Array(16);
        const unitId = uuidv5(name, idLength);
        const unit = {
            id: unitId,
            name: name,
            freeMode: true,
            status: 'search', // walk, work, attak, rest, search, dead
            isEnemy: isEnemy ? isEnemy : false,
            isSelected: false,
            stats: {
                level: 0,
                health: 100,
                damage: 0,
                attak: 10,
                speed: 0.366,
                healthPoints: 100,
                pointsToNewLevel: 1000
            },
            position: {
                x: 15,
                y: 15
            },
            path: [
                // {
                // x: ...,
                // y: ...
                // },
            ],
            currentTask: null,
            taskList: [],
            skills: [],
            //     {
            //         id: "",
            //         name: "", // TODO: need special randomizer from list!
            //         status: "",
            //         progress: 0, // x-points
            //         level: 0, // max 20
            //         levelName: "trainee", // 0-5 trainee, 6-10 medium, 11-15 master, 16-20 prime
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
            //     levelName: "trainee", // 0-5 trainee, 6-10 medium, 11-15 master, 16-20 prime
            //     pointsToNextLevel: 0, // x-points
            //     bonus: {
            //         id: "",
            //         name: "",
            //         value: 0,
            //     },
            // },
            professions: [
                {
                    id: 'prof_1',
                    name: 'collector', // constructor, collector, protector, numerator
                    status: 'await', // await, update
                    progress: 0, // x-points
                    level: 0, // max lvl 20
                    levelName: 'trainee', // 0-5 trainee, 6-10 medium, 11-15 master, 16-20 prime
                    pointsToNextLevel: 0, // x-points
                    bonus: {
                        id: '',
                        name: '',
                        value: 0
                    }
                }
            ],
            // {
            //     id: profId,
            //     name: "constructor",
            //     status: "",
            //     progress: "", // x-points
            //     level: 1, // max lvl 20
            //     levelName: "trainee", // 0-5 trainee, 6-10 medium, 11-15 master, 16-20 prime
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
            ]
        };

        if (!_.isEmpty(unit) && unitsLimit > unitList.length) {
            dispatch({ type: 'UNIT_CREATED', payload: unit });
            onUnitCreated();
        }
    }, [unitList.length, unitsLimit, isEnemy, name, onUnitCreated, dispatch]);

    useEffect(() => {
        if (!isGameStarted && !unitList.length && !isLoadSavedGame && isObjectsCreated) getUnit();
    }, [isGameStarted, isLoadSavedGame, isObjectsCreated, unitList.length, getUnit]);
};

useGetUnit.propTypes = {
    name: PropTypes.string,
    isEnemy: PropTypes.bool
};
