import object_1 from '../assets/sprites/object_1.png';
import object_2 from '../assets/sprites/object_2.png';
import object_3 from '../assets/sprites/object_3.png';
import object_4 from '../assets/sprites/object_4.png';
import object_5 from '../assets/sprites/object_5.png';
import object_6 from '../assets/sprites/object_6.png';
import object_7 from '../assets/sprites/object_7.png';
import object_8 from '../assets/sprites/object_8.png';
import object_9 from '../assets/sprites/object_9.png';
import object_10 from '../assets/sprites/object_10.png';

export const getObjectByType = id => {
    switch(id) {
        case 1: return {
            id: id,
            name: "oak",
            status: "inactive",
            blocker: true,
            health: 80,
            damage: 0,
            healthPoints: 80,
            src: object_1,
            width: 42,
            height: 42,
        }
        case 2: return {
            id: id,
            name: "pine",
            status: "inactive",
            blocker: true,
            health: 70,
            damage: 0,
            healthPoints: 70,
            src: object_2,
            width: 42,
            height: 56,
        }
        case 3: return {
            id: id,
            name: "birch",
            status: "inactive",
            blocker: true,
            health: 60,
            damage: 0,
            healthPoints: 60,
            src: object_3,
            width: 42,
            height: 42,
        }
        case 4: return {
            id: id,
            name: "linden",
            status: "inactive",
            blocker: true,
            health: 55,
            damage: 0,
            healthPoints: 55,
            src: object_4,
            width: 42,
            height: 42,
        }
        case 5: return {
            id: id,
            name: "linden",
            status: "inactive",
            blocker: true,
            health: 55,
            damage: 0,
            healthPoints: 55,
            src: object_5,
            width: 42,
            height: 42,
        }
        case 6: return {
            id: id,
            name: "linden",
            status: "inactive",
            blocker: true,
            health: 55,
            damage: 0,
            healthPoints: 55,
            src: object_6,
            width: 42,
            height: 42,
        }
        case 7: return {
            id: id,
            name: "linden",
            status: "inactive",
            blocker: true,
            health: 55,
            damage: 0,
            healthPoints: 55,
            src: object_7,
            width: 42,
            height: 42,
        }
        case 8: return {
            id: id,
            name: "linden",
            status: "inactive",
            blocker: true,
            health: 55,
            damage: 0,
            healthPoints: 55,
            src: object_8,
            width: 42,
            height: 42,
        }
        case 9: return {
            id: id,
            name: "linden",
            status: "inactive",
            blocker: true,
            health: 55,
            damage: 0,
            healthPoints: 55,
            src: object_9,
            width: 42,
            height: 42,
        }
        case 10: return {
            id: id,
            name: "linden",
            status: "inactive",
            blocker: true,
            health: 55,
            damage: 0,
            healthPoints: 55,
            src: object_10,
            width: 42,
            height: 42,
        }
        
        default: return {
            id: '', 
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