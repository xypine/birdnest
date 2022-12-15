import { convertDate, type Result } from '$lib/utils';

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

export async function getInfringements(fetch: any): Promise<Result<Infringement[]>> {
	try {
		let resp = await fetch('https://birdnest-api.eliaseskelinen.fi/');
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
			error: e
		};
	}
}
