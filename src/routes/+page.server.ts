import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getInfringements } from '$lib/reaktor/api';

export const load: PageServerLoad = async ({ params }) => {
  let data = await getInfringements();
  return data;
}