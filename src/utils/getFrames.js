export const getFrames = (transparent, id) => {
    const frames = [{
        floor: require(`../assets/sprites/isometric_pixel_${(id !== 0) ? id : 1}.png`)
    }];
    return frames;
}
