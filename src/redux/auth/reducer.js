import { types } from './types';
import { initState } from './initState';

export default function authReducer(state = initState, action) {
    switch (action.type) {

        case types.SET_AUTH_LOGIN: {
            return {
                isAuthenticated: true,
                user: {
                    login: action.payload.login,
                    pass: action.payload.pass,
                    remember: action.payload.remember,
                    id: action.payload.id,
                    avatar: action.payload.avatar,
                },
            }
        }

        case types.SET_AVATAR: {
            return {
                user: {
                    avatar: action.payload,
                },
            }
        }

        case types.SET_AUTH_LOGOUT: {
            return {
                isAuthenticated: false,
                user: {},
            }
        }

        default:
            return state
    }
};