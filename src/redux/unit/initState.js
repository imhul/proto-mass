export const initState = {
    unitList: [],
    totalUnits: 0,
    createdUnits: 0,
    current: {
        id: "",
        name: "",
        status: "absent",
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
    },
    error: {},
};