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

export const useGetUnit = ({ name, isEnemy, limit }) => {

    const dispatch = useDispatch();
    const { unitList } = useSelector(state => state.unit);
    const getUnit = useCallback(() => {

        const idLength = new Array(16);
        const unitName = name ? name : uuidv5(`bot#${getRandomInt(100, 1001)}`, idLength);
        const userId = uuidv5(unitName, idLength);

        const unit = {
            id: userId,
            name: unitName,
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

            professions: [],
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
        if (!_.isEmpty(unit) && limit === unitList.length) {
            dispatch({ type: 'UNIT_CREATED', payload: unit });
        }
    }, [ dispatch, isEnemy, name, limit, unitList.length ]);

    useEffect(() => {
        getUnit()
    }, [getUnit]);
};
