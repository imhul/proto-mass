import { matrix } from './mockedMap';

// TODO: ES6 refactor
const lee = (() => {
    let x, y;
    const pathfinder = (matrixReloaded, x1, y1, x2, y2) => {
        // console.info("pathfinder run!");
        const toVisit = [[x1, y1]]; // Initialise at the start square
        while(toVisit.length) { // While there are still squares to visit
            x = toVisit[0][0];
            y = toVisit[0][1];
            for (var i = x-1; i < x+2; i++)  {  // -1, 0, 1
                for (var j = y-1; j < y+2; j++) { // -1, 0, 1
                    if (checkPath(matrix, i,j, x1, y1, 0)) {
                        matrix[i][j] = matrix[x][y] + 1;
                        toVisit.push([i, j]);
                    }
                }
            }
            toVisit.shift();
        }
        const shortestPath = getShortestPath(matrixReloaded, x1, y1, x2, y2);
        return shortestPath;
    };
    const getShortestPath = (matrixReloaded, x1, y1, x2, y2) => {
        var previousValue = matrixReloaded[x2][y2];
        var successfulRoute = [];
        var x = x2;
        var y = y2;
        while ( !(x === x1 && y === y1) ) {
            for (var i = x-1; i < x+2; i++)  {  // -1, 0, 1
                for (var j = y-1; j < y+2; j++) { // -1, 0, 1
                    if (
                        matrixReloaded[i] && (matrixReloaded[i][j] === previousValue -1) && // If array x array defined and the matrixReloaded value is 0
                        !(i === x && j === y) ) {
                        previousValue = matrixReloaded[i][j];
                        successfulRoute.push({x: i, y: j});
                        x = i;
                        y = j;
                    } else if (successfulRoute.length === matrixReloaded[x2][y2] - 1) { // If we got to the end of the route
                        x = x1;
                        y = y1; // Break the while loop
                    }
                }
            }
        }
        successfulRoute.unshift({x: x2, y: y2}); // Add end point
        successfulRoute.push({x: x1, y: y1}); // Add start point
        return successfulRoute.reverse(); // Reverse the array so it's at the start
    };
    const checkPath = (matrixReloaded, i, j, x1, y1, value) => {
        return matrixReloaded[i] && (matrixReloaded[i][j] === value) && // If array x array defined and the matrixReloaded value is 0
        !(i === x && j === y) && // If it's not the center square
        !(i === x1 && j === y1); // If it's not the first square
    };
    return {
        pathfinder : pathfinder,
        getShortestPath : getShortestPath,
        checkPath : checkPath
    };
})();

export const getPath = (startY, startX, finishY, finishX) => {
    const path = lee.pathfinder(matrix, startY, startX, finishY, finishX);
    return path;
}
