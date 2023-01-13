import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import { getDrones, getInfringements } from "$lib/api/reaktor";
import { getApiInformation } from "$lib/api/meta";

export const load: LayoutLoad = async ({ params, fetch }) => {
	let infringements = getInfringements(fetch);
	let drones = getDrones(fetch);
	let api_info = getApiInformation(fetch);
	return {
		infringements,
		drones,
		api_info
	};
};
