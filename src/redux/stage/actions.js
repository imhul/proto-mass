import { types } from './types';

export const getAcademies = () => ({
    type: types.GET_ACADEMIES,
});
  
export const clearAcademies = () => ({
    type: types.CLEAR_ACADEMIES,
});

export const updateAcademies = (type, id) => ({
    type: types.UPDATE_ACADEMIES,
    payload: { type, id }
});

export const addAcademy = (title, type) => ({
    type: types.ADD_ACADEMY,
    payload: { title, type }
});

export const loading = () => ({
    type: types.LOADING,
});