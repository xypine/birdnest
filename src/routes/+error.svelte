<script lang="ts">
	import { page } from "$app/stores";
</script>

<main>
	<h1>error {$page.status}</h1>
	{#if $page.status == 404}
		<h2><code>{$page.url.pathname}</code> not found</h2>
		<hr />
		<p>maybe try one of these instead:</p>
		<ul>
			<li><a href={$page.url.origin}>{$page.url.origin}</a></li>
		</ul>
	{:else}
		<h2>{$page.error?.message}</h2>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		text-align: center;
		justify-content: center;
		align-items: center;
		min-height: var(--content-height);

		gap: 0.25em;
	}
	code {
		background-color: var(--bg-1);
		border: 1px solid var(--bg-2);
		padding: 0 0.25em;
		border-radius: 0.5rem;
	}
	hr {
		width: min(500px, 90vw);
		margin-block: 1em;
	}
	h1 {
		font-size: 3em;
	}
</style>
