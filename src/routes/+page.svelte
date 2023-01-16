<script lang="ts">
	import { browser } from "$app/environment";
	import { invalidateAll } from "$app/navigation";
	import Map from "$lib/components/Map.svelte";
	import { onDestroy } from "svelte";
	import { slide } from "svelte/transition";
	import type { LayoutData } from "./$types";
	import { getInfringementColorHue, getInfringementTimeLeftPercentage } from "$lib/utils";
	import config from "$lib/config";

	export let data: LayoutData;
	let map_size = "min(600px, 100vw)";
	function rerunLoadFunction() {
		invalidateAll();
	}

	let interval: ReturnType<typeof setInterval>;
	// Update data every two seconds after js has loaded
	$: if (browser && $config.interval != null) {
		if (interval != null) {
			clearInterval(interval);
		}
		if ($config.interval !== 0) {
			interval = setInterval(rerunLoadFunction, $config.interval);
		}
	}
	// Stop fetching data after user has left the page
	onDestroy(() => {
		if (interval != null) {
			clearInterval(interval);
		}
	});
</script>

<svelte:head>
	<title>Elias's Birdnest</title>
</svelte:head>

<main>
	{#if data.infringements.ok && data.drones.ok}
		{@const infringements = data.infringements.value.sort((a, b) => a.distance - b.distance)}
		{@const drones = data.drones.value}

		<div class="data">
			<h2 style="text-align:center;">
				{infringements.length} pilots have infringed the ndz in the last 10 minutes
			</h2>
			<h3 style="text-align:center;">click on an infringer to see more details</h3>
			<div class="infringement label">
				<p>Pilot</p>
				<p class="hide-small">Phone</p>
				<p class="hide-small hide-medium">Email</p>
				<p style="flex: 0;">Closest Distance</p>
			</div>
			<!-- This could have also been a table element, but "floating headers" are harder to implement for them -->
			<div class="infringement-details">
				{#each infringements as infringement, index (infringement.drone_serial_number)}
					{@const updated_at = infringement.updated_at}
					{@const time_left_part = getInfringementTimeLeftPercentage(updated_at, new Date())}
					{@const distance_meters = infringement.distance / 1000.0}
					{@const color = `--color:hsl(${getInfringementColorHue(infringement)}, 50%, 50%);`}
					<a
						href={`/infringer/${infringement.pilot.pilot_id}`}
						class="infringement"
						id={infringement.drone_serial_number}
						in:slide|local={{ delay: index * 2 }}
						out:slide|local
						style={color}
					>
						<p>{infringement.pilot.first_name} {infringement.pilot.last_name}</p>
						<p class="hide-small">{infringement.pilot.phone_number}</p>
						<p class="hide-small hide-medium">{infringement.pilot.email}</p>
						<p class="distance">{Math.round(distance_meters)}m</p>
					</a>
					<div class="time-bar" style={`${color}--time:${time_left_part};`} />
				{/each}
			</div>
		</div>
		<div class="map-container" style="--mapsize:{map_size};">
			<div class="settings">
				{#if browser}
					<label for="interval">update every</label>
					<select id="interval" bind:value={$config.interval}>
						<option value={0}>0 seconds (pause)</option>
						<option selected value={2000}>2 seconds</option>
						<option selected value={4000}>4 seconds</option>
						<option value={16000}>16 seconds</option>
					</select>
					<label for="enable_animations">enable animations</label>
					<input type="checkbox" id="enable_animations" bind:checked={$config.enable_animations} />
				{/if}
			</div>
			<Map
				{infringements}
				{drones}
				enable_animations={$config.enable_animations}
				update_interval={$config.interval}
				size={map_size}
			/>
		</div>
	{:else if !data.infringements.ok}
		{#if data.infringements.error}
			<h1 class="error">Error fetching infringements: {data.infringements.error}</h1>
		{/if}
	{:else if !data.drones.ok}
		{#if data.drones.error}
			<h1 class="error">Error fetching drones: {data.drones.error}</h1>
		{/if}
	{/if}
</main>

<style>
	main {
		min-height: var(--content-height);

		display: flex;
		flex-wrap: wrap;

		gap: 1em;
	}
	.error {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.map-container {
		min-width: var(--mapsize);
		min-height: var(--mapsize);
		display: flex;
		flex-direction: column;
	}
	.data {
		flex: 1;
		max-height: var(--content-height);

		display: flex;
		flex-direction: column;
	}
	.time-bar {
		transition: 500ms all;
		height: 2px;
		width: 100%;
		background-color: var(--fg-0);
		opacity: 0.5;
		/* background-color: var(--color); */
		transform: translateX(calc(var(--time) * -100%));
	}
	.infringement-details {
		max-height: 100%;
		overflow-y: scroll;
	}
	.infringement {
		display: flex;
		gap: 1em;
		border-top: 1px solid var(--bg-1);

		text-decoration: none;
		color: inherit;
	}
	.label {
		border-top: none;
	}
	.infringement:target,
	.infringement:target > .distance {
		background-color: var(--color);
		color: var(--bg-0);
	}
	.infringement > * {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
	.distance {
		color: var(--color);
		flex: 0 5ch;
	}
	.settings {
		padding: 0.3em 0.5em;
		position: absolute;
		z-index: 1;
	}

	@media (max-width: 700px) {
		.hide-small {
			display: none;
		}
	}
	@media (max-width: 1400px) {
		.hide-medium {
			display: none;
		}
	}
</style>
