<script lang="ts">
	import type { Infringement } from '$lib/reaktor/api';

	export let drones: Infringement[];
</script>

<main>
	<div class="dnz" />
	{#each drones as i, index}
		{@const pie = (Math.PI * 2.0) / drones.length}
		{@const d = i.distance / 1000.0}
		{@const x = Math.sin(pie * index) * d}
		{@const y = Math.cos(pie * index) * d}
		<div class="drone" style="--x:{x}px;--y:{y}px;" />
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
		background-color: black;
		position: relative;
	}
	.drone {
		transition: 500ms all;
		border-radius: 999px;
		background-color: red;
		width: 12px;
		height: 12px;
		position: absolute;

		top: calc(var(--cty) + var(--y));
		left: calc(var(--ctx) + var(--x));
	}
	.dnz {
		position: absolute;
		background-color: blue;
		opacity: 0.5;

		top: calc(var(--cty) - 50px);
		left: calc(var(--ctx) - 50px);

		width: 100px;
		height: 100px;
		border-radius: 999px;
	}
</style>
