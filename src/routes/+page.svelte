<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Map from '$lib/components/map.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	function rerunLoadFunction() {
		invalidateAll();
	}

	onMount(() => {
		// Update data every second
		setInterval(rerunLoadFunction, 1000);
	});
</script>

<main>
	{#if data.ok}
		{@const drones = data.value}
		<Map {drones} />
		<h1>List of drones</h1>
		{#each drones as drone}
			<p>{drone.drone_serial_number}</p>
		{/each}
	{:else}
		<h1>Error:</h1>
	{/if}
</main>

<style>
	main {
		min-height: calc(100vh - var(--header-height));

		display: flex;
		justify-content: center;
		align-items: center;

		flex-direction: column;
	}
</style>
