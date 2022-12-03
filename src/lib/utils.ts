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