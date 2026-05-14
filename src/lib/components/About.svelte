<script lang="ts">
	import { onMount } from 'svelte';

	let sectionEl: HTMLElement;

	const stats = [
		{ value: '5+', label: 'Years Experience' },
		{ value: '20+', label: 'Projects Shipped' },
		{ value: '5', label: 'Tech Stacks' },
		{ value: '98%', label: 'Commitment' }
	];

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) e.target.classList.add('visible');
				});
			},
			{ threshold: 0.15 }
		);

		sectionEl?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	});
</script>

<section id="about" bind:this={sectionEl} class="py-24 sm:py-32">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
			<!-- Text content -->
			<div>
				<div class="reveal mb-3 flex items-center gap-3">
					<span class="font-mono text-sm text-accent">01.</span>
					<div class="h-px flex-1 bg-surface-border max-w-12"></div>
					<span class="font-mono text-xs uppercase tracking-widest text-slate-500">About Me</span>
				</div>

				<h2 class="reveal delay-100 mb-6 text-3xl font-bold text-white sm:text-4xl">
					Building the web,<br />
					<span class="text-accent">one component</span> at a time
				</h2>

				<div class="reveal delay-200 space-y-4 text-slate-400 leading-relaxed">
					<p>
						I'm a frontend-focused developer with a deep appreciation for the intersection of
						<span class="text-white">design, engineering, and user experience</span>. I gravitate
						toward reactive frameworks — especially
						<span class="text-accent font-medium">Svelte</span> and
						<span class="text-accent font-medium">React</span> — and love the challenge of
						making complex UIs feel effortless.
					</p>
					<p>
						Beyond building UIs, I care deeply about
						<span class="text-white">quality assurance</span> and have built automation frameworks
						with Playwright that help teams ship with confidence. I believe great software is
						not just functional — it's
						<span class="text-white">fast, accessible, and delightful</span>.
					</p>
					<p>
						When I'm not writing code, I'm exploring the frontiers of web animation, contributing
						to open-source, or chasing that perfect Lighthouse score.
					</p>
				</div>

				<!-- Tech highlights -->
				<div class="reveal delay-300 mt-8 flex flex-wrap gap-2">
					{#each ['SvelteKit', 'TypeScript', 'React', 'Node.js', 'Playwright', 'TailwindCSS'] as tech}
						<span class="flex items-center gap-1 rounded-md border border-surface-border bg-surface-card px-3 py-1 font-mono text-xs text-slate-400">
							<span class="text-accent">▸</span>
							{tech}
						</span>
					{/each}
				</div>
			</div>

			<!-- Stats + visual -->
			<div class="reveal delay-200">
				<!-- Profile card -->
				<div class="relative rounded-2xl border border-surface-border bg-surface-card p-8">
					<!-- Glow corner -->
					<div class="absolute top-0 right-0 h-32 w-32 rounded-full bg-accent/5 blur-3xl" aria-hidden="true"></div>

					<!-- Avatar placeholder -->
					<div class="mb-6 flex items-center gap-4">
						<div
							class="relative h-16 w-16 rounded-full border-2 border-accent/30 bg-surface-elevated flex items-center justify-center text-2xl font-bold text-accent"
						>
							L
							<span class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-surface-card bg-accent"></span>
						</div>
						<div>
							<p class="font-semibold text-white">Lisan al Gaib</p>
							<p class="font-mono text-sm text-slate-500">Frontend Engineer</p>
						</div>
					</div>

					<!-- Terminal-style bio -->
					<div class="rounded-lg bg-surface p-4 font-mono text-xs text-slate-400">
						<p><span class="text-accent">$</span> cat about.json</p>
						<div class="mt-2 space-y-1 text-slate-500">
							<p><span class="text-highlight">location</span>: <span class="text-warn">"Nigeria 🇳🇬"</span>,</p>
							<p><span class="text-highlight">focus</span>: <span class="text-warn">"Frontend + QA"</span>,</p>
							<p><span class="text-highlight">open_to_work</span>: <span class="text-accent">true</span>,</p>
							<p><span class="text-highlight">coffee</span>: <span class="text-info">"essential"</span></p>
						</div>
					</div>

					<!-- Stats grid -->
					<div class="mt-6 grid grid-cols-2 gap-4">
						{#each stats as { value, label }}
							<div class="rounded-lg bg-surface p-4 text-center">
								<p class="text-2xl font-bold text-accent">{value}</p>
								<p class="mt-1 text-xs text-slate-500">{label}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
