import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { getDrones, getInfringements } from "$lib/reaktor/api";

export const load: PageLoad = async ({ params, fetch }) => {
	let infringements = await getInfringements(fetch);
	let drones = await getDrones(fetch);
	return {
		infringements,
		drones
	};
};
