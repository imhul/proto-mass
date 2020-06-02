export const initState = {
    objectsLimit: 30,
    objectList: [],
    isObjectsCreation: false,
    isObjectsCreated: false,
    mapAction: {
        x: 0,
        y: 0,
        data: {
            id: '', 
            type: '', // ground, resourse, object, unit, enemy
            name: '', // to show title
            status: '', // inactive, grow, damage, attack, repair
            blocker: false, // for collisions
            health: 0, // real health points now
            damage: 0, // deadless - eternal 0
            healthPoints: 0, // total health points
        },
    },
    zoom: 100,
    error: {},
};