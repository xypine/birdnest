<script lang="ts">
	import "../app.css";
	import PageTransition from "$lib/components/PageTransition.svelte";
	import { page } from "$app/stores";
	import type { LayoutData } from "./$types";
	export let data: LayoutData;
</script>

<div class="header">
	<h1><a href="/">Birdnest</a></h1>
	<a href="/about">about</a>
	<noscript
		><span class="warn">Data won't update automatically with javascript disabled</span></noscript
	>
	<div class="filler" />
	<p>
		<!-- svelte-ignore security-anchor-rel-noreferrer this is my website ;) -->
		made by <a target="_blank" href="https://eliaseskelinen.fi">elias eskelinen</a>
	</p>
</div>

<PageTransition refresh={$page.url.pathname}>
	<slot />
</PageTransition>

<style>
	:root {
		--header-height: 50px;
		--content-height: calc(100vh - var(--header-height));
	}
	.header {
		min-height: var(--header-height);
		padding: 0.1em 1em;
		background-color: var(--bg-1);
		color: var(--fg-1);
		border-bottom: 1px solid var(--bg-2);

		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		gap: 1em;
	}
	.header > h1 > a {
		text-decoration: none;
		color: inherit;
	}
	.header > p,
	.header > a {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1ch;
	}
	.header > a {
		font-size: 1.25em;
	}
	.header > p > a {
		white-space: nowrap;
	}
	.filler {
		flex: 1;
	}
	.warn {
		color: orange;
	}
</style>
