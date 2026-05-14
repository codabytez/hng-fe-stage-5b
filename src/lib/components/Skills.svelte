<script lang="ts">
	import { onMount } from 'svelte';
	import { skillCategories } from '$lib/data/skills';

	let sectionEl: HTMLElement;
	let animated = false;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						e.target.classList.add('visible');
						if (!animated) animated = true;
					}
				});
			},
			{ threshold: 0.1 }
		);
		sectionEl?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

		// Trigger bar animation on section visibility
		const sectionObs = new IntersectionObserver(
			([entry]) => { if (entry.isIntersecting) animated = true; },
			{ threshold: 0.2 }
		);
		if (sectionEl) sectionObs.observe(sectionEl);

		return () => { observer.disconnect(); sectionObs.disconnect(); };
	});
</script>

<section id="skills" bind:this={sectionEl} class="py-24 sm:py-32">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<!-- Header -->
		<div class="reveal mb-16 text-center">
			<div class="mb-3 flex items-center justify-center gap-3">
				<div class="h-px w-12 bg-surface-border"></div>
				<span class="font-mono text-xs uppercase tracking-widest text-slate-500">02.</span>
				<div class="h-px w-12 bg-surface-border"></div>
			</div>
			<h2 class="text-3xl font-bold text-white sm:text-4xl">
				Technical <span class="text-accent">Arsenal</span>
			</h2>
			<p class="mt-3 text-slate-500">Tools I reach for when building production software</p>
		</div>

		<!-- Skills grid -->
		<div class="grid gap-8 sm:grid-cols-2">
			{#each skillCategories as category, ci}
				<div
					class="reveal rounded-2xl border border-surface-border bg-surface-card p-6 transition-all duration-300 hover:border-opacity-60"
					class:delay-100={ci === 1}
					class:delay-200={ci === 2}
					class:delay-300={ci === 3}
					style="--cat-color: {category.color}"
				>
					<!-- Category header -->
					<div class="mb-5 flex items-center gap-2">
						<span
							class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
							style="background: {category.color}18; color: {category.color}"
							aria-hidden="true"
						>
							{#if category.name === 'Frontend'}
								<!-- Monitor / layout icon -->
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<rect x="2" y="3" width="20" height="14" rx="2"/>
									<path d="M8 21h8M12 17v4"/>
									<path d="M7 8l3 3-3 3"/>
									<line x1="13" y1="11" x2="17" y2="11"/>
								</svg>
							{:else if category.name === 'Backend'}
								<!-- Server icon -->
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<rect x="2" y="2" width="20" height="8" rx="2"/>
									<rect x="2" y="14" width="20" height="8" rx="2"/>
									<circle cx="6" cy="6" r="1" fill="currentColor" stroke="none"/>
									<circle cx="6" cy="18" r="1" fill="currentColor" stroke="none"/>
									<line x1="10" y1="6" x2="18" y2="6"/>
									<line x1="10" y1="18" x2="18" y2="18"/>
								</svg>
							{:else if category.name === 'Testing & QA'}
								<!-- Shield / check icon -->
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
									<polyline points="9 12 11 14 15 10"/>
								</svg>
							{:else}
								<!-- Wrench / settings icon -->
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
								</svg>
							{/if}
						</span>
						<h3 class="font-semibold text-white">{category.name}</h3>
						<div class="ml-auto h-px w-8 rounded" style="background: {category.color}; opacity: 0.4"></div>
					</div>

					<!-- Skill bars -->
					<div class="space-y-4">
						{#each category.skills as skill}
							<div>
								<div class="mb-1.5 flex items-center justify-between">
									<span class="font-mono text-sm text-slate-400">{skill.name}</span>
									<span class="font-mono text-xs" style="color: {category.color}">{skill.level}%</span>
								</div>
								<div class="h-1.5 w-full overflow-hidden rounded-full bg-surface">
									<div
										class="h-full rounded-full transition-all duration-1000 ease-out"
										style="
											width: {animated ? skill.level : 0}%;
											background: linear-gradient(90deg, {category.color}99, {category.color});
											box-shadow: 0 0 8px {category.color}44;
											transition-delay: {ci * 100 + 200}ms;
										"
										role="progressbar"
										aria-valuenow={skill.level}
										aria-valuemin={0}
										aria-valuemax={100}
										aria-label="{skill.name}: {skill.level}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<!-- Tools grid -->
		<div class="reveal delay-400 mt-12">
			<p class="mb-4 text-center font-mono text-xs uppercase tracking-widest text-slate-600">
				Also working with
			</p>
			<div class="flex flex-wrap items-center justify-center gap-3">
				{#each ['Figma', 'Storybook', 'Zustand', 'Pinia', 'Prisma', 'tRPC', 'Zod', 'Redis', 'Vercel', 'Netlify', 'Linux', 'VS Code'] as tool}
					<span class="rounded-full border border-surface-border px-3 py-1 font-mono text-xs text-slate-500 transition-all duration-200 hover:border-accent/30 hover:text-slate-400">
						{tool}
					</span>
				{/each}
			</div>
		</div>
	</div>
</section>
