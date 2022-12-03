<script lang="ts">
	import { scale } from 'svelte/transition';
	import type { Infringement } from '$lib/reaktor/api';
	import { getDroneColorHue, getDroneTimeLeftPercentage } from '$lib/utils';

	export let drones: Infringement[];
	export let size: number;
	let pulse_key = {};
	$: if (drones != null) {
		// Runs every time drones is updated
		pulse_key = {}; // Every {} is unique, this resets the "scan" div
	}
</script>

<main style="--map-size:{size}px;">
	<div class="dnz" />
	{#key pulse_key}
		<div class="scan" />
	{/key}
	<div class="drones-container">
		<div class="drones">
			{#each drones.sort((a, b) => b.distance - a.distance) as i, index (i.drone_serial_number)}
				<!-- Remap coordinates from 0-500_000 to 0-1 -->
				{@const oldmax = 500_000.0}
				{@const x = i.x / oldmax}
				{@const y = i.y / oldmax}
				<a
					href="#{i.drone_serial_number}"
					in:scale={{ delay: index * 2 }}
					out:scale
					class="drone"
					style="--x:{x};--y:{y};--c:{getDroneColorHue(i, drones.length)};--a:{1.0 -
						getDroneTimeLeftPercentage(i.updated_at, new Date())};"
				>
					<div />
				</a>
			{/each}
		</div>
	</div>
</main>

<style>
	main {
		--w: var(--map-size);
		--h: var(--map-size);
		--ctx: calc(var(--w) / 2);
		--cty: calc(var(--h) / 2);
		width: 0;
		height: 0;
		overflow: visible;
		position: relative;
	}

	.drones-container {
		width: var(--w);
		height: var(--h);
		overflow: hidden;
	}
	.drones {
		transform-origin: center;
		scale: 2.5;
		width: 100%;
		height: 100%;
	}
	.drone {
		--drone-size: 6px;
		--drone-size-half: calc(var(--drone-size) / 2);

		transition: 500ms all;
		border-radius: 999px;
		background-color: hsl(var(--c), 50%, 50%);

		width: var(--drone-size);
		height: var(--drone-size);

		position: absolute;

		top: calc(var(--y) * var(--h) - var(--drone-size-half));
		left: calc(var(--x) * var(--w) - var(--drone-size-half));
		opacity: max(calc(var(--a) * 10 - 9), 0.5);
	}
	.drone:target {
		border: 0.5px solid var(--fg-0);
		opacity: 1;
	}
	.dnz {
		position: absolute;
		background-color: blue;
		opacity: 0.25;

		top: 0; /* cty - cty = 0 */
		left: 0; /* ctx - ctx = 0 */

		width: var(--w);
		height: var(--h);
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
		background: radial-gradient(circle, transparent 0%, green 100%);
		opacity: 0.25;

		top: 0; /* cty - cty = 0 */
		left: 0; /* ctx - ctx = 0 */

		width: var(--w);
		height: var(--h);
		border-radius: 999px;
	}
</style>
