export const initState = {
    isAppInit: true,
    isAppLoad: false,
    loadingPercent: 0,
    notify: {
        key: '',
        type: '',
        message: '',
        description: '',
        icon: '', // string
        duration: 6, // null for non-stop
        placement: 'bottomLeft', // topLeft topRight bottomLeft bottomRight
        onClose: null,
    },
    notifyArchive: [],
};