<script>
	import { fly } from "svelte/transition";
	export let refresh = "";
</script>

<div class="transition-wrapper">
	{#key refresh}
		<div in:fly={{ x: -10, duration: 500 }}>
			<slot />
		</div>
	{/key}
</div>

<style>
	.transition-wrapper {
		overflow-x: hidden;
	}
</style>
