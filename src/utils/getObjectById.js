import object_1 from '../assets/sprites/object_1.png';
import object_2 from '../assets/sprites/object_2.png';
import object_3 from '../assets/sprites/object_3.png';
import object_4 from '../assets/sprites/object_4.png';

export const getObjectById = id => {
    switch(id) {
        case 1: return {
            id: id,
            name: "oak",
            status: "inactive",
            blocker: false,
            health: 80,
            damage: 0,
            healthPoints: 80,
            src: object_1,
        }
        case 2: return {
            id: id,
            name: "pine",
            status: "inactive",
            blocker: false,
            health: 70,
            damage: 0,
            healthPoints: 70,
            src: object_2,
        }
        case 3: return {
            id: id,
            name: "birch",
            status: "inactive",
            blocker: false,
            health: 60,
            damage: 0,
            healthPoints: 60,
            src: object_3,
        }
        case 4: return {
            id: id,
            name: "linden",
            status: "inactive",
            blocker: false,
            health: 55,
            damage: 0,
            healthPoints: 55,
            src: object_4,
        }
        
        default: return {
            id: '', 
            name: '', // to show title
            status: '', // inactive, grow, damage, attack, repair
            blocker: false, // for collisions
            health: 0, // real health points now
            damage: 0,
            healthPoints: 0, // total health points
            src: '',
        }
    }
};