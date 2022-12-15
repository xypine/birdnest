<script lang="ts">
	import { browser } from "$app/environment";
	import { invalidateAll } from "$app/navigation";
	import Map from "$lib/components/map.svelte";
	import { onDestroy } from "svelte";
	import { slide } from "svelte/transition";
	import type { PageData } from "./$types";
	import { getDroneColorHue, getDroneTimeLeftPercentage } from "$lib/utils";

	export let data: PageData;
	let map_size = "min(600px, 100vw)";
	function rerunLoadFunction() {
		invalidateAll();
	}

	let interval: any;
	let chosen_interval = "2000";
	$: if (browser && chosen_interval != null) {
		if (interval != null) {
			clearInterval(interval);
		}
		if (+chosen_interval !== 0) {
			interval = setInterval(rerunLoadFunction, +chosen_interval);
		}
	}
	onDestroy(() => {
		if (interval != null) {
			clearInterval(interval);
		}
	});
</script>

<main>
	{#if data.infringements.ok}
		{@const drones = data.infringements.value.sort((a, b) => a.distance - b.distance)}

		<div class="data">
			<h2>List of infringing drones</h2>
			<div class="drone label">
				<p>Pilot</p>
				<p>Phone</p>
				<p>Email</p>
				<p style="flex: 0;">Closest Distance</p>
			</div>
			<div class="drone-names">
				{#each drones as drone, index (drone.drone_serial_number)}
					{@const updated_at = drone.updated_at}
					{@const time_left_part = getDroneTimeLeftPercentage(updated_at, new Date())}
					{@const distance_meters = drone.distance / 1000.0}
					{@const color = `--color:hsl(${getDroneColorHue(drone, drones.length)}, 50%, 50%);`}
					<div
						class="drone"
						id={drone.drone_serial_number}
						in:slide={{ delay: index * 2 }}
						out:slide
						style={color}
					>
						<p>{drone.pilot.first_name} {drone.pilot.last_name}</p>
						<p>{drone.pilot.phone_number}</p>
						<p>{drone.pilot.email}</p>
						<p class="distance">{Math.round(distance_meters)}m</p>
					</div>
					<div class="time-bar" style={`${color}--time:${time_left_part};`} />
				{/each}
			</div>
		</div>
		<div class="map-container" style="--mapsize:{map_size};">
			<div class="settings">
				<label for="interval">update every</label>
				<select id="interval" bind:value={chosen_interval}>
					<option value="0">0 seconds (pause)</option>
					<option value="1000">1 seconds</option>
					<option selected value="2000">2 seconds</option>
					<option selected value="5000">5 seconds</option>
					<option value="30000">30 seconds</option>
				</select>
			</div>
			<Map {drones} size={map_size} />
		</div>
	{:else}
		<h1>Error: {JSON.stringify(data.error)}</h1>
	{/if}
</main>

<style>
	main {
		min-height: var(--content-height);

		display: flex;
		flex-wrap: wrap;

		gap: 1em;
	}
	.map-container {
		min-width: var(--mapsize);
		min-height: var(--mapsize);
		background-color: black;
		display: flex;
		flex-direction: column;
	}
	.data {
		flex: 1;
		max-height: var(--content-height);

		display: flex;
		flex-direction: column;
		gap: 1em;
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
	.drone-names {
		max-height: 100%;
		overflow-y: scroll;
	}
	.drone {
		display: flex;
		gap: 1em;
		border-top: 1px solid var(--bg-1);
	}
	.label {
		border-top: none;
	}
	.drone:target,
	.drone:target > .distance {
		background-color: var(--color);
		color: var(--bg-0);
	}
	.drone > * {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
	.distance {
		color: var(--color);
		flex: 0;
	}
	.drone-color-marker {
		flex: inherit;
		width: 10px;
		background-color: var(--color);
	}
	.settings {
		padding: 0.3em 0.5em;
		position: absolute;
		z-index: 1;
	}
</style>
