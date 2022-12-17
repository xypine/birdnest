<script>
	import { fly } from "svelte/transition";
	export let refresh = "";
</script>

<main>
	{#key refresh}
		<div in:fly={{ x: -10, duration: 500 }}>
			<slot />
		</div>
	{/key}
</main>

<style>
	main {
		overflow-x: hidden;
	}
</style>
