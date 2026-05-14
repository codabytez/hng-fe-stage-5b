<script lang="ts">
	import { onMount } from 'svelte';
	import { openTerminal } from '$lib/stores/terminal';
	import ThemeToggle from './ThemeToggle.svelte';

	let scrolled = false;
	let mobileOpen = false;
	let activeSection = '';

	const links = [
		{ href: '#about', label: 'About' },
		{ href: '#skills', label: 'Skills' },
		{ href: '#projects', label: 'Projects' },
		{ href: '#contact', label: 'Contact' }
	];

	onMount(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 60;

			const sections = ['about', 'skills', 'projects', 'contact'];
			let current = '';
			for (const id of sections) {
				const el = document.getElementById(id);
				if (el && window.scrollY >= el.offsetTop - 120) current = id;
			}
			activeSection = current;
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function navClick(href: string) {
		mobileOpen = false;
		const id = href.replace('#', '');
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<!-- Skip link for accessibility -->
<a
	href="#main"
	class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-surface focus:font-semibold"
>
	Skip to main content
</a>

<nav
	class="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
	class:bg-surface={scrolled}
	class:border-b={scrolled}
	class:border-surface-border={scrolled}
	class:shadow-lg={scrolled}
	aria-label="Main navigation"
>
	<div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
		<!-- Logo -->
		<a
			href="#hero"
			onclick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
			class="font-mono text-sm font-semibold text-accent hover:text-glow transition-all duration-200"
			aria-label="Go to top"
		>
			<span class="text-slate-500">~/</span>lisan
		</a>

		<!-- Desktop links -->
		<div class="hidden items-center gap-1 md:flex">
			{#each links as { href, label }}
				<a
					{href}
					onclick={(e) => { e.preventDefault(); navClick(href); }}
					class="relative rounded-md px-3 py-1.5 font-mono text-sm text-slate-400 transition-all duration-200 hover:text-accent"
					class:text-accent={activeSection === href.replace('#', '')}
				>
					{label}
					{#if activeSection === href.replace('#', '')}
						<span class="absolute bottom-0 left-1/2 h-px w-4 -translate-x-1/2 bg-accent"></span>
					{/if}
				</a>
			{/each}
		</div>

		<!-- Right side controls -->
		<div class="flex items-center gap-2">
			<button
				onclick={() => openTerminal()}
				class="hidden items-center gap-2 rounded-lg border border-surface-border bg-surface-card px-3 py-1.5 font-mono text-xs text-slate-400 transition-all duration-200 hover:border-accent/40 hover:text-accent md:flex"
				aria-label="Open terminal"
			>
				<span class="text-accent">$</span>
				<span>terminal</span>
			</button>

			<ThemeToggle />

			<!-- Mobile hamburger -->
			<button
				class="flex h-8 w-8 flex-col items-center justify-center gap-1 md:hidden"
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={mobileOpen}
			>
				<span
					class="block h-px w-5 bg-slate-400 transition-all duration-200"
					class:rotate-45={mobileOpen}
					class:translate-y-1={mobileOpen}
				></span>
				<span
					class="block h-px w-5 bg-slate-400 transition-all duration-200"
					class:opacity-0={mobileOpen}
				></span>
				<span
					class="block h-px w-5 bg-slate-400 transition-all duration-200"
					class:-rotate-45={mobileOpen}
					class:-translate-y-2={mobileOpen}
				></span>
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileOpen}
		<div
			class="border-t border-surface-border bg-surface px-4 py-3 md:hidden"
			role="menu"
		>
			{#each links as { href, label }}
				<a
					{href}
					onclick={(e) => { e.preventDefault(); navClick(href); }}
					class="block rounded-md px-3 py-2.5 font-mono text-sm text-slate-400 transition-colors hover:text-accent"
					role="menuitem"
				>
					<span class="text-accent mr-2">›</span>{label}
				</a>
			{/each}
			<button
				onclick={() => { mobileOpen = false; openTerminal(); }}
				class="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2.5 font-mono text-sm text-slate-400 transition-colors hover:text-accent"
				role="menuitem"
			>
				<span class="text-accent">$</span> Open Terminal
			</button>
		</div>
	{/if}
</nav>
