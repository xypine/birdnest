<script lang="ts">
	import { scale } from 'svelte/transition';
	import type { Infringement } from '$lib/reaktor/api';
	import { getDroneColorHue } from '$lib/utils';

	export let drones: Infringement[];
	let pulse_key = {};
	$: if (drones != null) {
		// Runs every time drones is updated
		pulse_key = {}; // Every {} is unique, this resets the "scan" div
	}
</script>

<main>
	<div class="dnz" />
	{#key pulse_key}
		<div class="scan" />
	{/key}
	{#each drones as i, index (i.drone_serial_number)}
		{@const x = i.x / 1000.0}
		{@const y = i.y / 1000.0}
		<div
			in:scale={{ delay: index * 2 }}
			out:scale
			class="drone"
			style="--x:{x}px;--y:{y}px;--c:{getDroneColorHue(i, drones.length)};"
		/>
	{/each}
</main>

<style>
	main {
		--w: 500px;
		--h: 500px;
		--ctx: calc(var(--w) / 2);
		--cty: calc(var(--h) / 2);
		width: var(--w);
		height: var(--h);
		position: relative;
	}
	.drone {
		--drone-size: 12px;
		--drone-size-half: calc(var(--drone-size) / 2);

		transition: 500ms all;
		border-radius: 999px;
		background-color: hsl(var(--c), 50%, 50%);
		width: var(--drone-size);
		height: var(--drone-size);
		position: absolute;

		top: calc(var(--y) - var(--drone-size-half));
		left: calc(var(--x) - var(--drone-size-half));
	}
	.dnz {
		position: absolute;
		background-color: blue;
		opacity: 0.25;

		top: calc(var(--cty) - 100px);
		left: calc(var(--ctx) - 100px);

		width: 200px;
		height: 200px;
		border-radius: 999px;
	}
	@keyframes pulse {
		0% {
			scale: 0;
			opacity: 0;
		}
		25% {
			scale: 1;
			opacity: 1;
		}
		100% {
			scale: 1;
			opacity: 0;
		}
	}
	.scan {
		animation: pulse 2s forwards;
		position: absolute;
		background: radial-gradient(circle, transparent 0%, blue 100%);
		opacity: 0.25;

		top: calc(var(--cty) - 100px);
		left: calc(var(--ctx) - 100px);

		width: 200px;
		height: 200px;
		border-radius: 999px;
	}
</style>
