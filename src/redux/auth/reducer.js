import { types } from './types';
import { initState } from './initState';

export default function authReducer(state = initState, action) {
    switch (action.type) {

        case types.SET_AUTH_LOGIN: {
            return {
                ...state,
                isAuthenticated: true,
                error: {},
                user: action.payload,
            }
        }

        case types.SET_AUTH_ERROR: {
            return {
                ...state,
                isAuthenticated: false,
                error: {
                    title: action.payload.code,
                    desc: action.payload.message,
                },
            }
        }

        case types.SET_AVATAR: {
            return {
                ...state,
                user: {
                    avatar: action.payload,
                },
            }
        }

        case types.SET_AUTH_LOGOUT: {
            return {
                ...state,
                isAuthenticated: false,
                user: {},
            }
        }

        default:
            return state
    }
};