import { convertDate, getInfringementTimeLeft, type Result } from "$lib/utils";
import { API_ENDPOINT, type OptionalFetchFunction } from ".";

// Backend derived types, visit API_ENDPOINT to see up-to-date openAPI compatible definitions
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

// Converts all assumed string-encoded dates to javascript date objects
// Neccessary, as JSON has no standardized date type
function convertDates(inp: Infringement[]) {
	for (let i of inp) {
		i.updated_at = convertDate(i.updated_at);
		i.pilot.created_date = convertDate(i.pilot.created_date);
	}
}

// To save bandwith, we store the date of the latest received data.
// This allows us to request only data that hasn't changed since.
// Because of this, we have to delete expired infringements manually
let last_updated = new Date(0, 0, 0, 0);
let last_infringements: Infringement[] = [];
export async function getInfringements(
	nfetch: OptionalFetchFunction
): Promise<Result<Infringement[], Error>> {
	// If no custom fetch function was supplied, use the default "fetch"
	let fetch_to_use = nfetch ?? fetch;
	let date_requested = new Date();
	try {
		let resp = await fetch_to_use(
			`${API_ENDPOINT}/infringements?min_updated_at=${last_updated.toISOString()}`
		);
		if (resp.ok) {
			let json = await resp.json();
			let data: Infringement[] = json.infringements;
			convertDates(data);
			// Append new infringements to previously known ones,
			// also remove expired ones
			last_infringements = [
				...last_infringements.filter(
					(drone) =>
						// Check that the infringement hasn't expired
						getInfringementTimeLeft(drone.updated_at, date_requested) > 0 &&
						// Remove old infringements that are also present in the new data
						// to prevent duplicates
						!data.find((new_drone) => drone.drone_serial_number === new_drone.drone_serial_number)
				),
				...data
			];
			last_updated = date_requested;
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
	serials: string[];
};
export async function getDrones(
	nfetch: OptionalFetchFunction
): Promise<Result<DronesResponse, Error>> {
	// If no custom fetch function was supplied, use the default "fetch"
	let fetch_to_use = nfetch ?? fetch;
	try {
		let resp = await fetch_to_use(`${API_ENDPOINT}/drones`);
		if (resp.ok) {
			let json = await resp.json();
			return {
				ok: true,
				value: json
			};
		}
		return {
			// Pass http status as the error
			ok: false,
			error: new Error(`${resp.status}: ${resp.statusText}`)
		};
	} catch (e) {
		// Most likely a network error
		return {
			ok: false,
			error: e as Error
		};
	}
}
