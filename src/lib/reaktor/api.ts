import { convertDate, getDroneTimeLeft, type Result } from "$lib/utils";

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

let last_updated = new Date(0, 0, 0, 0);
let last_infringements: Infringement[] = [];
export async function getInfringements(nfetch: any | null): Promise<Result<Infringement[], Error>> {
	let fetch_to_use = nfetch ?? fetch;
	let date_requested = new Date();
	try {
		let resp = await fetch_to_use(
			`https://birdnest-api.eliaseskelinen.fi/infringements?min_updated_at=${last_updated.getTime()}`
		);
		if (resp.ok) {
			let json = await resp.json();
			let data: Infringement[] = json.infringements;
			convertDates(data);
			last_updated = date_requested;
			last_infringements = [
				...last_infringements.filter(
					(drone) =>
						// Check that the infringement hasn't expired
						getDroneTimeLeft(drone.updated_at, date_requested) > 0 &&
						// Remove old infringements that are also present in the new data
						// to prevent duplicates
						!data.find((new_drone) => drone.drone_serial_number === new_drone.drone_serial_number)
				),
				...data
			];
			return {
				ok: true,
				value: last_infringements
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
	serials: number[];
};
export async function getDrones(nfetch: any | null): Promise<Result<DronesResponse, Error>> {
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
