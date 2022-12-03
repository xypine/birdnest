import type { Result } from "$lib/utils";

export type Pilot = {
    pilot_id: string,
    first_name: string,
    last_name: string,
    phone_number: string,
    created_date: Date,
    email: string
}
export type Infringement = {
    drone_serial_number: string,
    distance: number,
    x: number,
    y: number,
    pilot: Pilot,
    updated_at: Date
};
export async function getInfringements(): Promise<Result<Infringement[]>> {
    try {
    let resp = await fetch("https://birdnest-api.eliaseskelinen.fi/");
    if(resp.ok) {
        let json = await resp.json();
        return {
            ok: true,
            value: json.infringements
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