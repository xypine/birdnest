import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { custom_error_key } from "$lib/utils";

export const load: PageLoad = async ({ params, fetch, parent }) => {
	let data = await parent();
	if (!data.infringements.ok) {
		throw error(500, data.infringements.error);
	}
	let infringements = data.infringements.value;
	let details = infringements.find((i) => i.pilot.pilot_id === params.pilotId);
	if (!details) {
		throw error(404, custom_error_key + "Infringement not found, it might have expired");
	}
	return {
		details
	};
};
