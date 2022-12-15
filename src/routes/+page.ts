import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getInfringements } from '$lib/reaktor/api';

export const load: PageLoad = async ({ params, fetch }) => {
	let data = await getInfringements(fetch);
	return data;
};
