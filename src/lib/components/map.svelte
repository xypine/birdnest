<script lang="ts">
	import { scale } from "svelte/transition";
	import type { DronesResponse, Infringement } from "$lib/reaktor/api";
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
<main
	style="--map-size:{size};--drone-animation-time:{enable_animations ? update_interval + 50 : 0}ms;"
	on:click={() => {
		// Reset page target
		window.location.href = window.location.pathname + "#";
		window.history.replaceState(null, "unused", window.location.pathname);
	}}
>
	<div class="dnz" />
	{#key pulse_key && enable_animations}
		<div class="scan" />
	{/key}
	<div class="drones-container">
		<div class="drones">
			{#each infringements as i, index (i.drone_serial_number)}
				<!-- Remap coordinates from 0-500_000 to 0-1 -->
				{@const oldmax = 500_000.0}
				{@const x = i.x / oldmax}
				{@const y = i.y / oldmax}
				<a
					href="#{i.drone_serial_number}"
					in:scale
					out:scale
					class="drone infringement"
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
						<a
							href="#{serial}"
							in:scale|local
							out:scale|local
							class="drone"
							style="--x:{x};--y:{y};--c:{0};--a:{1.0};"
						>
							<div />
						</a>
					{/key}
				{/each}
			{/if}
		</div>
	</div>
	<div class="nest">
		<div class="monadikuikka">>>=</div>
	</div>
	<div class="guide">">>=" = monadikuikka in it's natural habitat</div>
</main>

<style>
	main {
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
	.dnz {
		position: absolute;
		border: 1px solid red;
		opacity: 0.25;

		--dnz-w: calc(var(--w) / 5);
		--dnz-h: calc(var(--h) / 5);

		top: calc(var(--h) / 2 - var(--dnz-h)); /* cty - cty = 0 */
		left: calc(var(--w) / 2 - var(--dnz-w)); /* ctx - ctx = 0 */

		width: calc(var(--dnz-w) * 2);
		height: calc(var(--dnz-h) * 2);
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
		bottom: 0;
		left: 0;
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
		animation: pulse 2s forwards;
		position: absolute;
		background: radial-gradient(circle, transparent 0%, green 100%);
		opacity: 0.25;

		top: 0; /* cty - cty = 0 */
		left: 0; /* ctx - ctx = 0 */

		width: var(--w);
		height: var(--h);
		border-radius: 50%;
	}
</style>
