export const getTileById = id => {
    switch(id) {
        case 1: return {
            id: id,
            type: "ground",
            name: "rock",
            status: "inactive",
            blocker: false,
            health: 100,
            damage: 0,
            healthPoints: 100,
        }
        case 2: return {
            id: id,
            type: "ground",
            name: "titanum",
            status: "inactive",
            blocker: false,
            health: 130,
            damage: 0,
            healthPoints: 130,
        }
        case 3: return {
            id: id,
            type: "ground",
            name: "sand",
            status: "inactive",
            blocker: false,
            health: 90,
            damage: 0,
            healthPoints: 90,
        }
        case 4: return {
            id: id,
            type: "ground",
            name: "grass",
            status: "inactive",
            blocker: false,
            health: 100,
            damage: 0,
            healthPoints: 100,
        }
        case 5: return {
            id: id,
            type: "ground",
            name: "platinum",
            status: "inactive",
            blocker: false,
            health: 120,
            damage: 0,
            healthPoints: 120,
        }
        case 6: return {
            id: id,
            type: "ground",
            name: "resin",
            status: "inactive",
            blocker: false,
            health: 80,
            damage: 0,
            healthPoints: 80,
        }
        case 7: return {
            id: id,
            type: "ground",
            name: "ferrum",
            status: "inactive",
            blocker: false,
            health: 110,
            damage: 0,
            healthPoints: 110,
        }
        case 8: return {
            id: id,
            type: "ground",
            name: "uranium",
            status: "inactive",
            blocker: false,
            health: 140,
            damage: 0,
            healthPoints: 140,
        }

        default: return {
            x: 0,
            y: 0,
            data: {
                id: '', 
                type: '', // ground, resourse, object, unit, enemy
                name: '', // to show title
                status: '', // inactive, grow, damage, attack, repair
                blocker: false, // for collisions
                health: 0, // real health points now
                damage: 0,
                healthPoints: 0, // total health points
            }
        }
    }
};