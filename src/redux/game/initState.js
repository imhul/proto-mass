import { set } from 'lodash';

export const initState = {
    loadingPercent: 0,
    isLoadSavedGame: false, // loaded or synthesized
    isStartInfoModalOpen: false,
    preloaderTitle: '',
    isStartOrLoadModalOpen: true,
    isGameMenuOpen: false,
    isMapLoadingStarted: false,
    isMapLoaded: false,
    isMapVisible: true,
    isGameLoaded: false,
    isGameInit: false,
    isGameStarted: false,
    isGamePaused: false,
    isGameover: false,
    isWin: false,
    settings: {
        volume: 0.5
    },
    startGameForm: set({
        colonyName: ''
    }),
    save: {
        // id: "",
        // gameHours: 0,
        colony: {
            // id: "",
            name: 'Autopia'
            // level: 0,
        }
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
    error: {}
};
