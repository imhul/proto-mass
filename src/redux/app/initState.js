export const initState = {
    isAppInit: false,
    isAppLoad: false,
    notify: {
        key: '',
        type: '',
        message: '',
        description: '',
        icon: '', // string
        duration: 6, // null for non-stop
        placement: 'bottomLeft', // topLeft topRight bottomLeft bottomRight
        onClose: null
    },
    notifyArchive: []
};
