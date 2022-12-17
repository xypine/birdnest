import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import { getDrones, getInfringements } from "$lib/reaktor/api";

export const load: LayoutLoad = async ({ params, fetch }) => {
	let infringements = await getInfringements(fetch);
	let drones = await getDrones(fetch);
	return {
		infringements,
		drones
	};
};
