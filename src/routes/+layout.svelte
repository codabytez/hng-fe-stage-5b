<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import Terminal from '$lib/components/Terminal.svelte';

	let { children } = $props();
</script>

<Nav />
<Terminal />

<main id="main" tabindex="-1">
	{@render children()}
</main>

<footer class="border-t border-surface-border py-8">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
			<p class="font-mono text-xs text-slate-700">
				<span class="text-slate-600">~/</span>lisan — Built with
				<span class="text-accent">SvelteKit</span> ×
				<span class="text-highlight">TailwindCSS</span>
			</p>
			<p class="font-mono text-xs text-slate-700">
				<span class="text-slate-600">$</span> made with ♥ in Nigeria
			</p>
		</div>
	</div>
</footer>
