// Utils
import { getRandomInt } from '../utils';
import uuidv5 from 'uuid/v5';

export const getNewTask = props => {
    const idLength = new Array(16);
    const taskId = uuidv5(`task#${getRandomInt(100, 1001)}`, idLength);
    const task = {
        id: taskId,
        status: "await", // await, progress, paused, done
        level: props && props.level ? props.level : 0,
        type: props && props.type ? props.type : "construct", // construct, collect, fight
        workerId: props && props.workerId ? props.workerId : "",
        priority: props && props.priority ? props.priority : 1,
        progress: 0, // from 0 to progressPoints
        progressPoints: props && props.progressPoints ? props.progressPoints : 8,
        profession: props && props.proffession ? props.proffession : "constructor",
        professionLevel: props && props.professionLevel ? props.professionLevel : "trainee",
        positions: props && props.positions ? props.positions : [
            {
                x: getRandomInt(1, 31),
                y: getRandomInt(1, 31)
            },
        ],
    };
    return task;
}
