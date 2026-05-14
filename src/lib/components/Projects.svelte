<script lang="ts">
	import { onMount } from 'svelte';
	import { runQuery } from '$lib/convex';

	interface Project {
		_id?: string;
		title: string;
		description: string;
		longDescription?: string;
		// normalised
		tech: string[];
		live?: string;
		github?: string;
		image?: string;
		// raw Convex field names
		tags?: string[];
		link?: string;
		imageUrl?: string;
		order?: number;
	}

	// Fallback seed while Convex loads (or if it fails)
	const SEED: Project[] = [
		{
			title: 'Noramum AI',
			description:
				'NORA is an AI-powered companion built to support mums with quick answers, daily guidance, emotional support, and practical tools for every stage of motherhood.',
			tech: ['Next.js', 'React', 'Tailwind'],
			live: '#',
			github: 'https://github.com/codabytez'
		},
		{
			title: 'Qravit',
			description:
				'Qravit helps businesses create seamless, contactless experiences through powerful QR code technology.',
			tech: ['Next.js', 'React', 'Tailwind'],
			live: '#',
			github: 'https://github.com/codabytez'
		},
		{
			title: 'Decentralized web3',
			description:
				'Decentralized conference is an Africa Web3 conference that happens yearly, connecting builders and innovators across the continent.',
			tech: ['Next.js', 'React'],
			live: '#',
			github: 'https://github.com/codabytez'
		},
		{
			title: 'Audiophile',
			description:
				'A premium e-commerce experience for high-end audio equipment, featuring immersive product pages and a seamless checkout flow.',
			tech: ['React', 'HTML', 'CSS'],
			live: '#',
			github: 'https://github.com/codabytez'
		},
		{
			title: 'Zenguide',
			description:
				'Onboarding without the friction. Zenguide provides interactive, step-by-step onboarding flows that help users get value from products faster.',
			tech: ['Vue', 'Tailwind'],
			live: '#',
			github: 'https://github.com/codabytez'
		},
		{
			title: 'Wokhive',
			description:
				'Empower your freelancing career with Wokhive — a platform connecting skilled freelancers with quality clients across Africa.',
			tech: ['Next.js', 'Tailwind'],
			live: '#',
			github: 'https://github.com/codabytez'
		}
	];

	function normalize(raw: Project): Project {
		return {
			...raw,
			tech: raw.tags ?? raw.tech ?? [],
			live: raw.link ?? raw.live ?? '',
			github: raw.github || '',
			image: raw.image ?? raw.imageUrl ?? ''
		};
	}

	function formatTag(tag: string): string {
		const map: Record<string, string> = {
			nextjs: 'Next.js', tailwind: 'Tailwind', tailwindcss: 'Tailwind',
			react: 'React', typescript: 'TypeScript', framer: 'Framer',
			'framer-motion': 'Framer Motion', 'react-native': 'React Native',
			resend: 'Resend', vue: 'Vue', flutter: 'Flutter', html: 'HTML', css: 'CSS'
		};
		return map[tag.toLowerCase()] ?? tag;
	}

	let projects: Project[] = $state(SEED.map(normalize));
	let loading = $state(true);
	let fetchError = $state(false);
	let activeFilter = $state('All');
	let sectionEl: HTMLElement;

	let allTech = $derived(
		['All', ...Array.from(new Set(projects.flatMap((p) => p.tech.map(formatTag))))]
	);

	let filtered = $derived(
		activeFilter === 'All'
			? projects
			: projects.filter((p) => p.tech.some((t) => formatTag(t) === activeFilter))
	);

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
			{ threshold: 0.1 }
		);
		sectionEl?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

		runQuery<Project[]>('queries:getProjects')
			.then((raw) => {
				if (Array.isArray(raw) && raw.length > 0) projects = raw.map(normalize);
			})
			.catch((e) => {
				console.error('Convex fetch failed:', e);
				fetchError = true;
			})
			.finally(() => {
				loading = false;
			});

		return () => observer.disconnect();
	});
</script>

<section id="projects" bind:this={sectionEl} class="py-24 sm:py-32">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<!-- Header -->
		<div class="reveal mb-4 text-center">
			<div class="mb-3 flex items-center justify-center gap-3">
				<div class="h-px w-12 bg-surface-border"></div>
				<span class="font-mono text-xs uppercase tracking-widest text-slate-500">03.</span>
				<div class="h-px w-12 bg-surface-border"></div>
			</div>
			<h2 class="text-3xl font-bold text-white sm:text-4xl">
				Selected <span class="text-accent">Work</span>
			</h2>
			<p class="mt-3 text-slate-500">A curated selection of projects I'm proud of</p>
		</div>

		<!-- Filter tabs -->
		<div class="reveal delay-100 mb-10 flex flex-wrap items-center justify-center gap-2">
			{#each allTech as cat}
				<button
					onclick={() => (activeFilter = cat)}
					class="rounded-full border px-4 py-1.5 font-mono text-xs transition-all duration-200"
					class:border-accent={activeFilter === cat}
					class:bg-accent={activeFilter === cat}
					class:text-surface={activeFilter === cat}
					class:font-semibold={activeFilter === cat}
					class:border-surface-border={activeFilter !== cat}
					class:text-slate-500={activeFilter !== cat}
					aria-pressed={activeFilter === cat}
				>
					{cat}
				</button>
			{/each}
		</div>

		<!-- Status indicators -->
		{#if loading}
			<p class="mb-4 text-center font-mono text-xs text-slate-600 animate-pulse">fetching projects...</p>
		{:else if fetchError}
			<p class="mb-4 text-center font-mono text-xs text-red-400/70">couldn't reach Convex — showing cached data</p>
		{/if}

		<!-- Project cards -->
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each filtered as project, i (project.title)}
				<article
					class="reveal group flex flex-col overflow-hidden rounded-xl border border-surface-border bg-surface-card transition-all duration-200 hover:border-accent/30 hover:-translate-y-1"
					class:delay-100={i % 3 === 1}
					class:delay-200={i % 3 === 2}
				>
					<!-- Card header: label + icon links -->
					<div class="flex items-center justify-between border-b border-surface-border px-4 py-2.5">
						<span class="font-mono text-xs text-accent">
							Project {i + 1} // <span class="text-accent/60">_{project.title.toLowerCase().replace(/\s+/g, '-')}</span>
						</span>
						<div class="flex items-center gap-2">
							{#if project.github}
								<a
									href={project.github}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="GitHub repository for {project.title}"
									class="text-slate-600 transition-colors hover:text-slate-300"
								>
									<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
									</svg>
								</a>
							{/if}
							{#if project.live}
								<a
									href={project.live}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Live demo for {project.title}"
									class="text-slate-600 transition-colors hover:text-slate-300"
								>
									<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
										<polyline points="15 3 21 3 21 9"/>
										<line x1="10" y1="14" x2="21" y2="3"/>
									</svg>
								</a>
							{/if}
						</div>
					</div>

					<!-- Thumbnail -->
					<div class="relative h-36 overflow-hidden bg-surface-elevated">
						{#if project.image}
							<img
								src={project.image}
								alt="{project.title} screenshot"
								class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
						{:else}
							<div class="absolute inset-0 grid-bg opacity-40"></div>
							<div class="absolute inset-0 flex items-center justify-center">
								<span class="font-mono text-xl font-bold text-surface-border">
									_{project.title.split(' ').map((w) => w[0]).join('')}
								</span>
							</div>
						{/if}
					</div>

					<!-- Content -->
					<div class="flex flex-1 flex-col p-4">
						<p class="mb-4 flex-1 text-sm leading-relaxed text-slate-500">
							{project.description}
						</p>

						<!-- Tech tags -->
						<div class="flex flex-wrap gap-1.5">
							{#each project.tech as t}
								<span class="rounded border border-surface-border px-2 py-0.5 font-mono text-xs text-slate-600">{formatTag(t)}</span>
							{/each}
						</div>
					</div>
				</article>
			{/each}
		</div>

		<!-- View all CTA -->
		<div class="reveal delay-300 mt-12 text-center">
			<a
				href="https://github.com/codabytez"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 font-mono text-sm text-slate-500 underline-offset-4 transition-colors hover:text-accent hover:underline"
			>
				View all projects on GitHub
				<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="m9 18 6-6-6-6"/>
				</svg>
			</a>
		</div>
	</div>
</section>
