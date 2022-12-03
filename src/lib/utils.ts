import type { Infringement } from "$lib/reaktor/api";

export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function convertDate(date: string | Date) {
    if(typeof date === "string") {
        return new Date(date);
    }
    return date;
}

export function getDroneColorHue(i: Infringement, numInfringements: number) {
    let gradient = 270 / 100.0;
    let distance_meters = i.distance / 1000.0
    return gradient * distance_meters;
}

const MAX_TIME = 60000 * 10; // 10 minutes
export function getDroneTimeLeft(updated_at: Date, now: Date) {
    let eta = new Date(updated_at.getTime() + MAX_TIME);
    let time_left = eta.getTime() - new Date().getTime();
    return time_left;
}

export function getDroneTimeLeftPercentage(updated_at: Date, now: Date) {
    let time_left = getDroneTimeLeft(updated_at, now);
    return 1.0 - time_left / MAX_TIME;
}