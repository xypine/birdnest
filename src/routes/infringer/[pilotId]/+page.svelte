<script lang="ts">
	import { browser } from "$app/environment";
	import { invalidateAll } from "$app/navigation";
	import Map from "$lib/components/map.svelte";
	import { getInfringementTimeLeft } from "$lib/utils";
	import config from "$lib/config";
	import { onDestroy, onMount } from "svelte";
	import type { PageData } from "./$types";
	export let data: PageData;
	$: details = data.details;
	$: distance_meters = details.distance / 1_000;
	$: pilot = details.pilot;
	$: pilot_name = `${pilot.first_name} ${pilot.last_name}`;

	let now = new Date();
	let interval: ReturnType<typeof setInterval>;
	onMount(() => {
		interval = setInterval(async () => {
			now = new Date();
			if (time_left > 4000) {
				await invalidateAll();
			}
		}, 2000);
	});
	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
	$: time_left = getInfringementTimeLeft(details.updated_at, now);
</script>

<svelte:head>
	<title>NDZ Infringer</title>
</svelte:head>

<main>
	<div class="pilot-details">
		<div style="display:flex;justify-content:left;align-items:center;gap:.5em;">
			<img alt={pilot_name} src="https://via.placeholder.com/100.png" />
			<h1>{pilot.first_name}<br />{pilot.last_name}</h1>
		</div>
		<h2>
			Closest distance: {distance_meters < 1
				? `${Math.round(distance_meters * 100)} centimeters`
				: `${Math.round(distance_meters)} meters`}
		</h2>
		<hr />
		<div class="contact">
			<table>
				<tr>
					<th>pilot id</th>
					<td>{pilot.pilot_id}</td>
				</tr>
				<tr>
					<th>email</th>
					<td><a href={`mailto:${pilot.email}`}>{pilot.email}</a></td>
				</tr>
				<tr>
					<th>phone</th>
					<td><a href={`tel:${pilot.phone_number}`}>{pilot.phone_number}</a> </td>
				</tr>
				<tr>
					<th>drone serial</th>
					<td>{details.drone_serial_number} </td>
				</tr>
			</table>
		</div>
		<h3 class="expiration-notification">
			{#if time_left > 0}
				This infringement will expire in {Math.round(time_left / 1000)} seconds
			{:else}
				<span style="color:orange;"
					>This infringement has expired, it won't be available once you leave or reload this page</span
				>
			{/if}
		</h3>
	</div>
	<Map
		infringements={[details]}
		drones={data.drones.value}
		size="min(500px, 100vw)"
		update_interval={2000}
		enable_animations={false}
	/>
</main>

<style>
	main {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		min-height: var(--content-height);
		gap: 1em;
		padding-block: 1em;
	}
	.pilot-details {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}
	.expiration-notification {
		text-align: center;
		width: min(90vw, 40ch);
	}
	img {
		display: block;
		--img-size: 100px;
		width: var(--img-size);
		height: var(--img-size);
		border-radius: 50%;
		background-color: var(--fg-0);
		overflow: hidden;
	}
	hr,
	table {
		width: 100%;
	}
	td,
	th {
		padding: 0.1em 0.5em;
	}
</style>
