export const getFrames = (transparent, id) => {
    const frames = [{
        floor: require(`../assets/sprites/isometric_pixel_${id}.png`),
        leftWall: {
          top: transparent ? require("../assets/sprites/transparent.png") : require(`../assets/sprites/isometric_pixel_${id}.png`),
          bottom: transparent ? require("../assets/sprites/transparent.png") : require(`../assets/sprites/isometric_pixel_${id}.png`),
          middle: transparent ? require("../assets/sprites/transparent.png") : require(`../assets/sprites/isometric_pixel_${id}.png`)
        },
        rightWall: {
          top: transparent ? require("../assets/sprites/transparent.png") : require(`../assets/sprites/isometric_pixel_${id}.png`),
          bottom: transparent ? require("../assets/sprites/transparent.png") : require(`../assets/sprites/isometric_pixel_${id}.png`),
          middle: transparent ? require("../assets/sprites/transparent.png") : require(`../assets/sprites/isometric_pixel_${id}.png`)
        }
    }];
    return frames;
};
