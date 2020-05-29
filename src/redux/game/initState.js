export const initState = {
    loadingPercent: 0,
    isLoadSavedGame: false, // loaded or synthesized
    isStartInfoModalOpen: false,
    isStartOrLoadModalOpen: true,
    isGameMenuOpen: false,
    isMapLoaded: false,
    isMapVisible: true,
    isGameLoaded: false,
    isGameInit: false,
    isGameStarted: false,
    isGamePaused: false,
    isGameover: false,
    isWin: false,
    settings: {
        volume: 0.5,
    },
    colonyName: "",
    taskList: [],
    save: {
        // id: "",
        // gameHours: 0,
        // colony: {
        //     id: "",
        //     name: "",
        //     level: 0,
        // },
        // settings: {
        //     volume: 0.5,
        //     zoom: 100,
        //     isFullscreen: false,
        // },
        // objects: [],
        // map: [],
        // units: [],
        // taskList: [],
    },
    error: {},
};