<script lang="ts">
	import Content from "../+page.svelte";
	import type { LayoutData } from "../$types";
	export let data: LayoutData;
</script>

<Content {data} />

<style>
	:global(html) {
		--bg-0: #eee;
		--bg-1: #fff;
		--bg-2: #ebebeb;
		--fg-0: #000;
		--fg-1: #111;
		color-scheme: light;
	}
</style>
