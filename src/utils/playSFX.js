import UIfx from 'uifx';

export const playSFX = (src, volume) => {
    const audio = new UIfx(src);
    audio.play(volume);
}
