import { types } from './types';

export const authLogin = (login, pass, remember, id, avatar) => ({
    type: types.SET_AUTH_LOGIN,
    payload: { login, pass, remember, id, avatar }
});

export const setAvatar = (avatar) => ({
    type: types.SET_AVATAR,
    payload: avatar,
});

export const authLogout = () => ({
    type: types.SET_AUTH_LOGOUT,
});