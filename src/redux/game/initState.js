export const initState = {
    loadingPercent: 0,
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
    isGameMenuOpen: false,
    colonyName: "",
    taskList: [],
    save: {
        units: [],
        colony: {
            id: "",
            name: "",
            constructions: [],
        },
        world: {
            constructions: [
                {
                    id: "",
                    path: [],
                },
            ],
            enemies: {
                units: [
                    {
                        id: "",
                        stats: {
                            health: 0,
                            damage: 0,
                            healthPoints: 0,
                        },
                        status: "",
                        type: "",
                        position: {
                            x: 0,
                            y: 0,
                        },
                    },
                ],
                constructions: [
                    {
                        id: "",
                        path: [],
                    },
                ],
            },
        },
    },
    time: {
        minutes: 0,
        hours: 0,
        days: 0,
    },
    game: {},
    error: {},
};