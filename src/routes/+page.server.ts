import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDrones } from '$lib/reaktor/api';

export const load: PageServerLoad = async ({ params }) => {
  let drones = await getDrones();
  return drones;
}