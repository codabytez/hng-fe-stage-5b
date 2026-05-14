<script lang="ts">
	import { onMount } from 'svelte';
	import { openTerminal } from '$lib/stores/terminal';

	const roles = [
		'Frontend Engineer',
		'Svelte Developer',
		'UI Craftsman',
		'Full-Stack Builder',
		'QA Automation Advocate'
	];

	let roleText = '';
	let roleIndex = 0;
	let charIndex = 0;
	let deleting = false;
	let mounted = false;

	const TYPING_SPEED = 80;
	const DELETE_SPEED = 45;
	const PAUSE_MS = 2000;

	function typeRole() {
		const current = roles[roleIndex];
		if (!deleting && charIndex <= current.length) {
			roleText = current.slice(0, charIndex++);
			setTimeout(typeRole, TYPING_SPEED);
		} else if (!deleting && charIndex > current.length) {
			setTimeout(() => { deleting = true; typeRole(); }, PAUSE_MS);
		} else if (deleting && charIndex >= 0) {
			roleText = current.slice(0, charIndex--);
			setTimeout(typeRole, DELETE_SPEED);
		} else {
			deleting = false;
			roleIndex = (roleIndex + 1) % roles.length;
			charIndex = 0;
			setTimeout(typeRole, 300);
		}
	}

	// Particle system
	interface Particle {
		x: number; y: number; vx: number; vy: number;
		size: number; alpha: number; color: string;
	}

	let canvas: HTMLCanvasElement;
	let animFrameId: number;

	function initParticles() {
		const ctx = canvas.getContext('2d')!;
		const particles: Particle[] = [];
		const colors = ['#00ff88', '#a855f7', '#06b6d4'];

		function resize() {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
		}

		function spawn(): Particle {
			return {
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				vx: (Math.random() - 0.5) * 0.35,
				vy: (Math.random() - 0.5) * 0.35,
				size: Math.random() * 1.5 + 0.5,
				alpha: Math.random() * 0.5 + 0.1,
				color: colors[Math.floor(Math.random() * colors.length)]
			};
		}

		resize();
		window.addEventListener('resize', resize);
		for (let i = 0; i < 80; i++) particles.push(spawn());

		function draw() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
				if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = p.color;
				ctx.globalAlpha = p.alpha;
				ctx.fill();
				ctx.globalAlpha = 1;
			}

			// Connect nearby particles
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < 100) {
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.strokeStyle = '#00ff88';
						ctx.globalAlpha = (1 - dist / 100) * 0.06;
						ctx.lineWidth = 0.5;
						ctx.stroke();
						ctx.globalAlpha = 1;
					}
				}
			}

			animFrameId = requestAnimationFrame(draw);
		}
		draw();

		return () => {
			cancelAnimationFrame(animFrameId);
			window.removeEventListener('resize', resize);
		};
	}

	onMount(() => {
		mounted = true;
		setTimeout(typeRole, 600);
		const cleanup = initParticles();
		return cleanup;
	});

	const socials = [
		{ label: 'GitHub', href: 'https://github.com/codabytez', icon: 'github' },
		{ label: 'LinkedIn', href: 'https://linkedin.com/in/codabytez', icon: 'linkedin' },
		{ label: 'Twitter/X', href: 'https://twitter.com/codabytez', icon: 'twitter' },
		{ label: 'Email', href: 'mailto:chidiobinna0001@gmail.com', icon: 'email' }
	];
</script>

<section
	id="hero"
	class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
>
	<!-- Particle canvas background -->
	<canvas
		bind:this={canvas}
		class="absolute inset-0 h-full w-full"
		aria-hidden="true"
	></canvas>

	<!-- Grid overlay -->
	<div
		class="absolute inset-0 grid-bg opacity-60"
		style="background-size: 50px 50px;"
		aria-hidden="true"
	></div>

	<!-- Radial glow -->
	<div
		class="absolute inset-0"
		style="background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,255,136,0.05) 0%, transparent 70%)"
		aria-hidden="true"
	></div>

	<!-- Content -->
	<div class="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
		<!-- Status badge -->
		<div
			class="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 font-mono text-xs text-accent"
			class:opacity-0={!mounted}
			style="transition: opacity 0.6s ease 0.2s"
			class:opacity-100={mounted}
		>
			<span class="relative flex h-2 w-2">
				<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
				<span class="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
			</span>
			Available for opportunities
		</div>

		<!-- Name -->
		<h1
			class="glitch mb-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
			data-text="Lisan al Gaib"
			style="opacity: 0; animation: fade-in 0.8s ease 0.3s forwards"
		>
			Lisan al <span class="text-glow text-accent">Gaib</span>
		</h1>

		<!-- Typing role -->
		<p
			class="mb-6 font-mono text-xl text-slate-400 sm:text-2xl"
			aria-live="polite"
			style="opacity: 0; animation: slide-up 0.7s ease 0.5s forwards"
		>
			<span class="text-accent">›</span>
			<span>{roleText}</span>
			<span class="animate-blink text-accent">|</span>
		</p>

		<!-- Bio -->
		<p
			class="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
			style="opacity: 0; animation: slide-up 0.7s ease 0.7s forwards"
		>
			Building <span class="text-white font-medium">immersive</span>,
			<span class="text-white font-medium">performant</span> web experiences with a passion for
			animation, accessibility, and clean architecture. Currently obsessing over
			<span class="text-accent font-medium">SvelteKit</span> and end-to-end quality.
		</p>

		<!-- CTAs -->
		<div
			class="mb-12 flex flex-wrap items-center justify-center gap-3"
			style="opacity: 0; animation: slide-up 0.7s ease 0.9s forwards"
		>
			<a
				href="#projects"
				onclick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
				class="rounded-lg bg-accent px-6 py-2.5 font-semibold text-surface transition-all duration-200 hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 active:scale-95"
			>
				View My Work
			</a>

			<button
				onclick={() => openTerminal()}
				class="group flex items-center gap-2 rounded-lg border border-surface-border bg-surface-card px-6 py-2.5 font-mono text-sm text-slate-300 transition-all duration-200 hover:border-accent/40 hover:text-accent"
				aria-label="Open interactive terminal"
			>
				<span class="text-accent group-hover:animate-pulse">$</span>
				open terminal
			</button>

			<a
				href="/resume.pdf"
				download
				class="rounded-lg border border-surface-border px-6 py-2.5 text-sm text-slate-400 transition-all duration-200 hover:border-highlight/40 hover:text-highlight"
			>
				Download CV ↓
			</a>
		</div>

		<!-- Social links -->
		<div
			class="flex items-center justify-center gap-4"
			style="opacity: 0; animation: fade-in 0.8s ease 1.1s forwards"
		>
			{#each socials as { label, href, icon }}
				<a
					{href}
					aria-label={label}
					target={href.startsWith('http') ? '_blank' : undefined}
					rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
					class="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-slate-500 transition-all duration-200 hover:border-accent/40 hover:text-accent"
				>
					{#if icon === 'github'}
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
						</svg>
					{:else if icon === 'linkedin'}
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
							<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
						</svg>
					{:else if icon === 'twitter'}
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
							<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
						</svg>
					{:else}
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
							<polyline points="22,6 12,13 2,6"/>
						</svg>
					{/if}
				</a>
			{/each}
		</div>
	</div>

	<!-- Scroll indicator -->
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
		<div class="flex flex-col items-center gap-1">
			<span class="font-mono text-xs text-slate-600">scroll</span>
			<svg class="h-4 w-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M12 5v14M5 12l7 7 7-7"/>
			</svg>
		</div>
	</div>
</section>
