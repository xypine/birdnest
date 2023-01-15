import type { LayoutLoad } from "./$types";
import { getDrones, getInfringements } from "$lib/api/reaktor";
import { getApiInformation } from "$lib/api/meta";

// Runs on the server on the initial page load
// and later on the client when page data is invalidated
export const load: LayoutLoad = async ({ fetch }) => {
	// SvelteKit provides a custom fetch function that is optimized for this use case
	let infringements = getInfringements(fetch);
	let drones = getDrones(fetch);
	let api_info = getApiInformation(fetch);
	return {
		infringements,
		drones,
		api_info
	};
};
