export const MAX_SPAWN_VEL = 3;
export const BORDER_WIND_STRENGTH = .3;
export const BORDER_WIND_MARGIN = 100;
export const SEPARATION_THRESHOLD = 50;
export const SEPARATION_STRENGTH = 10;
export const ALIGNMENT_THRESHOLD = 40;
export const ALIGNMENT_STRENGTH = .3;
export const COHESION_THRESHOLD = 40;
export const COHESION_STRENGTH = .02;
export const SPEED_LIMIT = 4;
export const RECOVERY_TIME = 5000;
export const TRANSMISSION_RATE = dist => Math.random() <= 4 / dist;
// y = 2^dist
// export const TRANSMISSION_RATE = dist => {
    // let chance = 0.5/Math.pow(2, dist);
    // console.log(chance);
    // return Math.random() >= chance;
// };
