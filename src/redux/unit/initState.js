export const initState = {
    unitsLimit: 1,
    unitList: [],
    current: {
        id: "",
        name: "",
        status: "search", // walk, work, attak, rest, search, dead
        stats: {
            level: 0, // max 20
            health: 0, // h-points
            damage: 0, // h-points
            speed: 900,
            healthPoints: 0, // h-points
            pointsToNextLevel: 0, // max 20
        },
        // isUnitStatsShown: true,
        position: {
            x: 0,
            y: 0,
        },
        task: null,
        skills: [
            {
                id: "",
                name: "",
                status: "",
                progress: "", // x-points
                level: 0, // max 20
                levelName: "trainee", // medium, prime
                pointsToNextLevel: 0, // x-points
                bonus: {
                    id: "",
                    name: "",
                    value: 0,
                },
            },
        ],
        technologies: [
            {
                id: "",
                name: "",
                status: "",
                progress: "", // x-points
                level: 0, // max 20
                levelName: "trainee", // medium, prime
                pointsToNextLevel: 0, // x-points
                bonus: {
                    id: "",
                    name: "",
                    value: 0,
                },
            },
        ],
        professions: [
            {
                id: "",
                name: "constructor", // constructor, collector, protector, numerator
                status: "",
                progress: "", // x-points
                level: 0, // max 20
                levelName: "trainee", // medium, prime
                pointsToNextLevel: 0, // x-points
                bonus: {
                    id: "",
                    name: "",
                    value: 0,
                },
            },
        ],
        // backpack
        itemsStorage: [],
        // wear
        items: [ 
            {
                id: "",
                name: "",
                type: "",
                stats: {},
            },
        ],
    },
    error: {},
};