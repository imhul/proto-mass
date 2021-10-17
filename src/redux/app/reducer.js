import { types } from './types';
import { initState } from './initState';

export default function appReducer(state = initState, action) {
    switch (action.type) {
        case types.APP_INIT:
            return {
                ...state,
                isAppInit: true
            };

        case types.START_LOADING_APP:
            return {
                ...state,
                isAppLoad: true
            };

        case types.LOADING_APP_COMPLETE:
            return {
                ...state,
                isAppLoad: false
            };

        case types.SHOW_MESSAGE:
            return {
                ...state,
                notify: {
                    key: action.payload.key,
                    type: action.payload.type,
                    message: action.payload.message,
                    description: action.payload.description,
                    icon: action.payload.icon ? action.payload.icon : null,
                    duration: action.payload.duration ? action.payload.duration : 6,
                    placement: action.payload.placement ? action.payload.placement : 'bottomLeft',
                    onClose: action.payload.onClose ? action.payload.onClose : null
                }
            };

        case types.ARCHIVE_MESSAGE:
            return {
                ...state,
                notifyArchive: [
                    ...state.notifyArchive,
                    {
                        key: action.payload.key,
                        type: action.payload.type,
                        message: action.payload.message,
                        description: action.payload.description,
                        icon: action.payload.icon ? action.payload.icon : null,
                        duration: action.payload.duration ? action.payload.duration : 6,
                        placement: action.payload.placement
                            ? action.payload.placement
                            : 'bottomLeft',
                        onClose: action.payload.onClose ? action.payload.onClose : null
                    }
                ]
            };

        default:
            return state;
    }
}
