import isometric_pixel_1 from '../assets/sprites/isometric_pixel_1.png';
import isometric_pixel_2 from '../assets/sprites/isometric_pixel_2.png';
import isometric_pixel_3 from '../assets/sprites/isometric_pixel_3.png';
import isometric_pixel_4 from '../assets/sprites/isometric_pixel_4.png';
import isometric_pixel_5 from '../assets/sprites/isometric_pixel_5.png';
import isometric_pixel_6 from '../assets/sprites/isometric_pixel_6.png';
import isometric_pixel_7 from '../assets/sprites/isometric_pixel_7.png';
import isometric_pixel_8 from '../assets/sprites/isometric_pixel_8.png';

export const getTileById = id => {
    switch(id) {
        case 1: return {
            id: id,
            name: "rock",
            status: "inactive",
            blocker: false,
            health: 100,
            damage: 0,
            healthPoints: 100,
            src: isometric_pixel_1,
        }
        case 2: return {
            id: id,
            name: "titanum",
            status: "inactive",
            blocker: false,
            health: 130,
            damage: 0,
            healthPoints: 130,
            src: isometric_pixel_2,
        }
        case 3: return {
            id: id,
            name: "sand",
            status: "inactive",
            blocker: false,
            health: 90,
            damage: 0,
            healthPoints: 90,
            src: isometric_pixel_3,
        }
        case 4: return {
            id: id,
            name: "grass",
            status: "inactive",
            blocker: false,
            health: 100,
            damage: 0,
            healthPoints: 100,
            src: isometric_pixel_4,
        }
        case 5: return {
            id: id,
            name: "platinum",
            status: "inactive",
            blocker: false,
            health: 120,
            damage: 0,
            healthPoints: 120,
            src: isometric_pixel_5,
        }
        case 6: return {
            id: id,
            name: "resin",
            status: "inactive",
            blocker: false,
            health: 80,
            damage: 0,
            healthPoints: 80,
            src: isometric_pixel_6,
        }
        case 7: return {
            id: id,
            name: "ferrum",
            status: "inactive",
            blocker: false,
            health: 110,
            damage: 0,
            healthPoints: 110,
            src: isometric_pixel_7,
        }
        case 8: return {
            id: id,
            name: "uranium",
            status: "inactive",
            blocker: false,
            health: 140,
            damage: 0,
            healthPoints: 140,
            src: isometric_pixel_8,
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