<script lang="ts">
	import type { LayoutData } from "../$types";
	export let data: LayoutData;
</script>

<main>
	<div>
		<h1>Elias's Birdnest</h1>
		<p>Backend version {data.api_info.version}</p>
		<p>Application theme is adjusted automatically according to your system preferences.</p>
	</div>
	<div>
		<h2>Source code:</h2>
		<div class="buttons">
			<a target="_blank" rel="noreferrer" href="https://github.com/xypine/birdnest/">Frontend</a>
			<a target="_blank" rel="noreferrer" href="https://github.com/xypine/birdnest-api/">Backend</a>
		</div>
		<p>
			These repositories have been public since 23.1.2023
		</p>
	</div>
</main>

<style>
	* {
		text-align: center;
	}
	p {
		max-width: 40ch;
	}
	main {
		min-height: var(--content-height);
		display: flex;
		flex-direction: column;

		justify-content: center;
		align-items: center;
		gap: 1em;
	}
	.buttons {
		padding: 0.25em;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.5em;
	}
	.buttons a {
		background-color: var(--fg-0);
		color: var(--bg-0);
		text-decoration: none;
		padding: 0.5em 1em;
		border-radius: 0.25rem;
		transition: background-color 200ms;
	}
	.buttons a:hover {
		background-color: var(--fg-1);
	}
</style>
