import { types } from './types';

export const taskAccept = payload => ({
    type: types.TASK_ACCEPTED,
    payload: payload,
});
