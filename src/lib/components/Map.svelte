<script lang="ts">
	import { scale } from "svelte/transition";
	import type { DronesResponse, Infringement } from "$lib/api/reaktor";
	import { getInfringementColorHue, getInfringementTimeLeftPercentage } from "$lib/utils";

	export let infringements: Infringement[];
	export let drones: DronesResponse;
	export let size: string;
	export let enable_animations = false;
	export let update_interval: number;
	let pulse_key = {};

	// Runs every time infringements is updated
	$: if (infringements != null && enable_animations) {
		// Every {} is unique, so this recreates the "scan" div and reruns the scan animation
		pulse_key = {};
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="map"
	style="--map-size:{size};--drone-animation-time:{enable_animations ? update_interval + 50 : 0}ms;"
>
	<div class="ndz" />
	{#key pulse_key}
		{#if enable_animations}
			<div class="scan" />
		{/if}
	{/key}
	<div class="drones-container">
		<div class="drones">
			{#each infringements as i, index (i.drone_serial_number)}
				<!-- Remap coordinates from 0-500_000 to 0-1 -->
				{@const oldmax = 500_000.0}
				{@const x = i.x / oldmax}
				{@const y = i.y / oldmax}
				<a
					href={`/infringer/${i.pilot.pilot_id}`}
					in:scale|local
					out:scale|local
					class="drone tracked infringement"
					style="--x:{x};--y:{y};--c:{getInfringementColorHue(i, infringements.length)};--a:{1.0 -
						getInfringementTimeLeftPercentage(i.updated_at, new Date())};"
				>
					<div />
				</a>
			{/each}

			{#if drones.serials}
				{#each drones.serials as serial, index (serial)}
					<!-- Remap coordinates from 0-500_000 to 0-1 -->
					{@const oldmax = 500_000.0}
					{@const x = drones.x[index] / oldmax}
					{@const y = drones.y[index] / oldmax}
					{#key serial}
						<div
							in:scale|local
							out:scale|local
							class="drone tracked"
							style="--x:{x};--y:{y};--c:{0};--a:{1.0};"
						/>
					{/key}
				{/each}
			{/if}
		</div>
	</div>
	<div class="nest">
		<div class="monadikuikka">>>=</div>
	</div>
	<div class="guide">
		<div style="display: flex;">
			<div style="width: 1em;display:grid;place-items:center;">
				<div class="drone" />
			</div>
			= drone
		</div>
		<div style="display: flex;">
			<div style="width: 1em;display:grid;place-items:center;">
				<div class="drone infringement" style="--c:0;--a:1.0;" />
			</div>
			= closest observed position of an infringing drone
		</div>
		<p>">>=" = monadikuikka in it's natural habitat</p>
	</div>
</div>

<style>
	.map {
		--w: var(--map-size);
		--h: var(--map-size);
		--ctx: calc(var(--w) / 2);
		--cty: calc(var(--h) / 2);
		position: relative;

		border: 2px solid var(--bg-1);

		width: var(--w);
		height: var(--h);
		overflow: hidden;
	}

	.drones-container {
		width: var(--w);
		height: var(--h);
		overflow: hidden;
	}
	.drones {
		transform-origin: center;
		width: 100%;
		height: 100%;
	}
	.drone {
		--drone-size: 4px;
		--drone-size-half: calc(var(--drone-size) / 2);

		transition: var(--drone-animation-time) all linear;
		background-color: var(--fg-0);

		width: var(--drone-size);
		height: var(--drone-size);
		border-radius: 50%;
	}
	.drone.tracked {
		position: absolute;

		top: calc(var(--y) * var(--h) - var(--drone-size-half));
		left: calc(var(--x) * var(--w) - var(--drone-size-half));
	}
	.infringement {
		--drone-size: 8px;
		--drone-size-half: calc(var(--drone-size) / 2);
		background-color: hsl(var(--c), 50%, 50%);
		opacity: max(calc(var(--a) * 10 - 9), 0.5);
	}
	.drone:target {
		border: 0.5px solid var(--fg-0);
		opacity: 1;
	}
	.ndz {
		position: absolute;
		border: 1px solid red;
		opacity: 0.25;

		--ndz-w: calc(var(--w) / 5);
		--ndz-h: calc(var(--h) / 5);

		top: calc(var(--h) / 2 - var(--ndz-h)); /* cty - cty = 0 */
		left: calc(var(--w) / 2 - var(--ndz-w)); /* ctx - ctx = 0 */

		width: calc(var(--ndz-w) * 2);
		height: calc(var(--ndz-h) * 2);
		border-radius: 50%;
	}
	.nest {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		/* Allow user to click drones */
		pointer-events: none;

		display: flex;
		justify-content: center;
		align-items: center;
	}
	.monadikuikka {
		/* This is just a nice extra for those with the font installed, */
		/* shipping the font would be a waste of bandwith */
		font-family: "Fira Code";
	}
	.guide {
		position: absolute;
		bottom: 0.5em;
		left: 0.5em;
	}
	@keyframes pulse {
		0% {
			scale: 0.25;
			opacity: 0;
		}
		33% {
			scale: 1;
			opacity: 0.5;
		}
		100% {
			scale: 1;
			opacity: 0;
		}
	}
	.scan {
		animation: pulse 1.9s forwards;
		position: absolute;
		/* A gradient background looks nice but adds too much visual noise */
		/* Let's use a simple border instead */
		/*background: radial-gradient(circle, transparent 0%, green 100%);*/
		border: 1px solid green;
		opacity: 0.25;

		top: 0; /* cty - cty = 0 */
		left: 0; /* ctx - ctx = 0 */

		width: var(--w);
		height: var(--h);
		border-radius: 50%;
	}
</style>
