export const initState = {
    loadingPercent: 0,
    isMapLoaded: false,
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
    save: {
        units: [
            {
                id: "",
                name: "",
                status: "",
                stats: {
                    level: 0,
                    skills: [
                        {
                            id: "",
                            name: "",
                            status: "",
                            level: "",
                            pointsToNewLevel: 0,
                            bonus: {},
                        },
                    ],
                    health: 0,
                    damage: 0,
                    speed: 1.5,
                    healthPoints: 0,
                    pointsToNewLevel: 0,
                },
                position: {
                    x: 0,
                    y: 0,
                },
                technologies: [
                    {
                        id: "",
                        status: "",
                        progress: "",
                    },
                ],
                itemsStorage: [],
                items: [
                    {
                        id: "",
                        name: "",
                        type: "",
                        stats: {},
                    },
                ],
            }
        ],
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
    game: {},
    error: {},
};