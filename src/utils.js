export function randInt(min, max) {
    return Math.floor(randUniform(min, max));
}

export function randUniform(min, max) {
    return (Math.random() * (max - min)) + min;
}
