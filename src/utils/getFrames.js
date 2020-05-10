export const getFrames = (transparent, id) => {
    const frames = [{
        floor: require(`../assets/sprites/isometric_pixel_${id}.png`)
    }];
    return frames;
};
