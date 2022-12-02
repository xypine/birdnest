import type { Result } from "$lib/utils";
import { parseStringPromise } from "xml2js";


export type Drone = {
    serialNumber: string;
    model: string;
    manufacturer: string;
    mac: string;
    ipv4: string;
    ipv6: string;
    firmware: string;
    positionY: number;
    positionX: number;
    altitude: number;
};
export type DroneResponse = Result<Drone[]>;

function extractDrones(doc: any): Drone[] {
    let drones = doc.report.capture.drone;
    return drones;
}

export async function getDrones(): Promise<DroneResponse> {
    try {
    let resp = await fetch("http://assignments.reaktor.com/birdnest/drones");
    if(resp.ok) {
        let doc = await parseStringPromise(await resp.text(), {
            explicitArray: false
        });
        let drones = extractDrones(doc);
        return {
            ok: true,
            value: drones
        };
    }
    return {
        ok: false,
        error: new Error(resp.statusText)
    }
    }
    catch(e) {
        return {
            ok: false,
            error: e
        }
    }
}