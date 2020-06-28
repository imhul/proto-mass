import object_2 from '../assets/sprites/object_2.png';
import object_3 from '../assets/sprites/object_3.png';
import object_4 from '../assets/sprites/object_4.png';
import object_5 from '../assets/sprites/object_5.png';
import object_6 from '../assets/sprites/object_6.png';
import object_7 from '../assets/sprites/object_7.png';
import object_8 from '../assets/sprites/object_8.png';
import object_9 from '../assets/sprites/object_9.png';
import object_10 from '../assets/sprites/object_10.png';
import object_11 from '../assets/sprites/object_11.png';

export const getObjectByType = typeId => {
    switch(typeId) {
        case 1: return {
            typeId: typeId,
            type: "ground",
            name: "ground",
            status: "inactive",
            blocker: false,
            width: 42,
            height: 42,
            stats: {
                health: 80,
                damage: 0,
                healthPoints: 80,
            },
        }
        case 2: return {
            typeId: typeId,
            type: "mineral",
            name: "titanum",
            status: "grow",
            blocker: true,
            src: object_2,
            width: 42,
            height: 42,
            stats: {
                health: 80,
                damage: 0,
                healthPoints: 80,
            },
        }
        case 3: return {
            typeId: typeId,
            type: "mineral",
            name: "sand",
            status: "grow",
            blocker: true,
            src: object_3,
            width: 42,
            height: 42,
            stats: {
                health: 60,
                damage: 0,
                healthPoints: 60,
            },
        }
        case 4: return {
            typeId: typeId,
            type: "ground",
            name: "grass",
            status: "inactive",
            blocker: false,
            src: object_4,
            width: 42,
            height: 42,
            stats: {
                health: 55,
                damage: 0,
                healthPoints: 55,
            },
        }
        case 5: return {
            typeId: typeId,
            type: "mineral",
            name: "platinum",
            status: "grow",
            blocker: true,
            src: object_5,
            width: 42,
            height: 42,
            stats: {
                health: 55,
                damage: 0,
                healthPoints: 55,
            },
        }
        case 6: return {
            typeId: typeId,
            type: "mineral",
            name: "resin",
            status: "grow",
            blocker: true,
            src: object_6,
            width: 42,
            height: 42,
            stats: {
                health: 55,
                damage: 0,
                healthPoints: 55,
            },
        }
        case 7: return {
            typeId: typeId,
            type: "mineral",
            name: "ferrum",
            status: "grow",
            blocker: true,
            src: object_7,
            width: 42,
            height: 42,
            stats: {
                health: 55,
                damage: 0,
                healthPoints: 55,
            },
        }
        case 8: return {
            typeId: typeId,
            type: "mineral",
            name: "uranium",
            status: "grow",
            blocker: true,
            src: object_8,
            width: 42,
            height: 42,
            stats: {
                health: 55,
                damage: 0,
                healthPoints: 55,
            },
        }
        case 9: return {
            typeId: typeId,
            type: "tree",
            name: "gammfitum",
            status: "grow",
            blocker: true,
            src: object_9,
            width: 42,
            height: 42,
            stats: {
                health: 55,
                damage: 0,
                healthPoints: 55,
            },
        }
        case 10: return {
            typeId: typeId,
            type: "tree",
            name: "filonterius",
            status: "grow",
            blocker: true,
            src: object_10,
            width: 42,
            height: 42,
            stats: {
                health: 55,
                damage: 0,
                healthPoints: 55,
            },
        }

        case 11: return {
            typeId: typeId,
            type: "ground",
            name: "rock",
            status: "inactive",
            blocker: true,
            src: object_11,
            width: 42,
            height: 42,
            stats: {
                health: 80,
                damage: 0,
                healthPoints: 80,
            },
        }
        
        default: return {
            typeId: '', 
            name: '', // to show title
            status: '', // inactive, grow, damage, attack, repair
            blocker: true, // for collisions
            health: 0, // real health points now
            damage: 0,
            healthPoints: 0, // total health points
            src: '',
            width: 0,
            height: 0,
        }
    }
};