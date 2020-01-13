import { types } from './types';

export const unitBorn = () => ({
    type: types.UNIT_CREATED,
    payload: {}
});

export const initPosition = position => {
    return ({
        type: types.UNIT_INIT_POSITION,
        payload: position
    })
};

export const startWalking = position => {
    return ({
        type: types.UNIT_START_WALKING,
        payload: position
    })
};

export const stopWalking = () => {
    return ({
        type: types.UNIT_STOP_WALKING,
    })
};

