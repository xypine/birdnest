<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main>
	{#if data.ok}
		{@const drones = data.value}
		<h1>List of drones</h1>
		{#each drones as drone}
			<p>{drone.mac}</p>
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
