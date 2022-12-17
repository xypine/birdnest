<script lang="ts">
	import Content from "../+page.svelte";
	import type { PageData } from "./$types";
	export let data: PageData;
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
