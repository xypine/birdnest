import { convertDate, type Result } from "$lib/utils";

export type Pilot = {
	pilot_id: string;
	first_name: string;
	last_name: string;
	phone_number: string;
	created_date: Date;
	email: string;
};
export type Infringement = {
	drone_serial_number: string;
	distance: number;
	x: number;
	y: number;
	pilot: Pilot;
	updated_at: Date;
};

function convertDates(inp: Infringement[]) {
	for (let i of inp) {
		i.updated_at = convertDate(i.updated_at);
		i.pilot.created_date = convertDate(i.pilot.created_date);
	}
}

export async function getInfringements(nfetch: any | null): Promise<Result<Infringement[]>> {
	let fetch_to_use = nfetch ?? fetch;
	try {
		let resp = await fetch_to_use("https://birdnest-api.eliaseskelinen.fi/infringements");
		if (resp.ok) {
			let json = await resp.json();
			let data = json.infringements;
			convertDates(data);
			return {
				ok: true,
				value: data
			};
		}
		return {
			ok: false,
			error: new Error(resp.statusText)
		};
	} catch (e) {
		return {
			ok: false,
			error: e as Error
		};
	}
}

export type DronesResponse = {
	x: number[];
	y: number[];
	serial: number[];
};
export async function getDrones(nfetch: any | null): Promise<Result<DronesResponse>> {
	let fetch_to_use = nfetch ?? fetch;
	try {
		let resp = await fetch_to_use("https://birdnest-api.eliaseskelinen.fi/drones");
		if (resp.ok) {
			let json = await resp.json();
			return {
				ok: true,
				value: json
			};
		}
		return {
			ok: false,
			error: new Error(resp.statusText)
		};
	} catch (e) {
		return {
			ok: false,
			error: e as Error
		};
	}
}
