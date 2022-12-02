<script lang="ts">
	import '../app.css';
</script>

<svelte:head>
	<title>Birdnest</title>
</svelte:head>

<div class="header">
	<h1>Birdnest</h1>
</div>

<slot />

<style>
	:root {
		--header-height: 50px;
	}
	.header {
		min-height: var(--header-height);
		padding: 0.1em 1em;
		background-color: var(--bg-1);
		color: var(--fg-1);
		border-bottom: 1px solid var(--bg-2);
	}
</style>
