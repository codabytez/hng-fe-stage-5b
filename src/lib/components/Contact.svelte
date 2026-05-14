<script lang="ts">
	import { onMount } from 'svelte';

	let sectionEl: HTMLElement;
	let name = $state('');
	let email = $state('');
	let message = $state('');
	let status: 'idle' | 'sending' | 'success' | 'error' = $state('idle');
	let errors: Record<string, string> = $state({});

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
			{ threshold: 0.1 }
		);
		sectionEl?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	});

	function validate() {
		const errs: Record<string, string> = {};
		if (!name.trim()) errs.name = 'Name is required';
		if (!email.trim()) errs.email = 'Email is required';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email address';
		if (!message.trim()) errs.message = 'Message is required';
		else if (message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
		return errs;
	}

	const FORMSPREE_ID = 'xkoylbnl';

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		errors = validate();
		if (Object.keys(errors).length) return;

		status = 'sending';
		try {
			const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify({ name, email, message })
			});

			if (res.ok) {
				status = 'success';
				name = '';
				email = '';
				message = '';
			} else {
				status = 'error';
			}
		} catch {
			status = 'error';
		}
	}

	const contactInfo = [
		{ label: 'Email', value: 'chidiobinna0001@gmail.com', href: 'mailto:chidiobinna0001@gmail.com', icon: '✉' },
		{ label: 'GitHub', value: 'github.com/codabytez', href: 'https://github.com/codabytez', icon: '⌥' },
		{ label: 'LinkedIn', value: 'linkedin.com/in/codabytez', href: 'https://linkedin.com/in/codabytez', icon: '◈' }
	];
</script>

<section id="contact" bind:this={sectionEl} class="py-24 sm:py-32">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<!-- Header -->
		<div class="reveal mb-16 text-center">
			<div class="mb-3 flex items-center justify-center gap-3">
				<div class="h-px w-12 bg-surface-border"></div>
				<span class="font-mono text-xs uppercase tracking-widest text-slate-500">04.</span>
				<div class="h-px w-12 bg-surface-border"></div>
			</div>
			<h2 class="text-3xl font-bold text-white sm:text-4xl">
				Get In <span class="text-accent">Touch</span>
			</h2>
			<p class="mt-3 text-slate-500">
				Have a project in mind? Let's build something great together.
			</p>
		</div>

		<div class="grid gap-12 lg:grid-cols-2 lg:gap-16">
			<!-- Contact info -->
			<div class="reveal">
				<h3 class="mb-6 text-lg font-semibold text-white">Let's talk</h3>
				<p class="mb-8 leading-relaxed text-slate-400">
					I'm currently open to new opportunities — whether it's a full-time role, freelance project,
					or just a technical conversation. Drop me a line and I'll get back to you within 24 hours.
				</p>

				<div class="space-y-4">
					{#each contactInfo as { label, value, href, icon }}
						<a
							{href}
							class="flex items-center gap-4 rounded-xl border border-surface-border bg-surface-card p-4 transition-all duration-200 hover:border-accent/30 hover:text-accent group"
						>
							<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-xl" aria-hidden="true">
								{icon}
							</span>
							<div>
								<p class="text-xs text-slate-600">{label}</p>
								<p class="font-mono text-sm text-slate-300 group-hover:text-accent transition-colors">{value}</p>
							</div>
						</a>
					{/each}
				</div>

				<!-- Availability badge -->
				<div class="mt-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-2 font-mono text-xs text-accent">
					<span class="relative flex h-2 w-2">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60"></span>
						<span class="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
					</span>
					Available for new projects
				</div>
			</div>

			<!-- Contact form -->
			<div class="reveal delay-200">
				{#if status === 'success'}
					<div class="flex h-full flex-col items-center justify-center rounded-2xl border border-accent/20 bg-accent/5 p-10 text-center">
						<div class="mb-4 text-4xl">✓</div>
						<h3 class="mb-2 text-lg font-semibold text-accent">Message Sent!</h3>
						<p class="text-slate-400">Thanks for reaching out. I'll get back to you within 24 hours.</p>
						<button
							onclick={() => (status = 'idle')}
							class="mt-6 font-mono text-sm text-slate-500 hover:text-accent underline-offset-4 hover:underline"
						>
							Send another
						</button>
					</div>
				{:else}
					<form
						onsubmit={handleSubmit}
						novalidate
						class="rounded-2xl border border-surface-border bg-surface-card p-6 sm:p-8"
					>
						<!-- Name -->
						<div class="mb-5">
							<label for="name" class="mb-1.5 block font-mono text-xs text-slate-500">
								Your Name <span class="text-accent">*</span>
							</label>
							<input
								id="name"
								type="text"
								bind:value={name}
								autocomplete="name"
								placeholder="John Doe"
								class="w-full rounded-lg border bg-surface px-4 py-3 font-mono text-sm text-slate-300 outline-none transition-colors placeholder:text-slate-700"
								class:border-red-500={errors.name}
								class:border-surface-border={!errors.name}
								class:focus:border-accent={!errors.name}
								aria-describedby={errors.name ? 'name-error' : undefined}
								aria-invalid={!!errors.name}
							/>
							{#if errors.name}
								<p id="name-error" class="mt-1 font-mono text-xs text-red-400">{errors.name}</p>
							{/if}
						</div>

						<!-- Email -->
						<div class="mb-5">
							<label for="email" class="mb-1.5 block font-mono text-xs text-slate-500">
								Email Address <span class="text-accent">*</span>
							</label>
							<input
								id="email"
								type="email"
								bind:value={email}
								autocomplete="email"
								placeholder="john@example.com"
								class="w-full rounded-lg border bg-surface px-4 py-3 font-mono text-sm text-slate-300 outline-none transition-colors placeholder:text-slate-700"
								class:border-red-500={errors.email}
								class:border-surface-border={!errors.email}
								class:focus:border-accent={!errors.email}
								aria-describedby={errors.email ? 'email-error' : undefined}
								aria-invalid={!!errors.email}
							/>
							{#if errors.email}
								<p id="email-error" class="mt-1 font-mono text-xs text-red-400">{errors.email}</p>
							{/if}
						</div>

						<!-- Message -->
						<div class="mb-6">
							<label for="message" class="mb-1.5 block font-mono text-xs text-slate-500">
								Message <span class="text-accent">*</span>
							</label>
							<textarea
								id="message"
								bind:value={message}
								rows="5"
								placeholder="Tell me about your project..."
								class="w-full resize-none rounded-lg border bg-surface px-4 py-3 font-mono text-sm text-slate-300 outline-none transition-colors placeholder:text-slate-700"
								class:border-red-500={errors.message}
								class:border-surface-border={!errors.message}
								class:focus:border-accent={!errors.message}
								aria-describedby={errors.message ? 'message-error' : undefined}
								aria-invalid={!!errors.message}
							></textarea>
							{#if errors.message}
								<p id="message-error" class="mt-1 font-mono text-xs text-red-400">{errors.message}</p>
							{/if}
						</div>

						<button
							type="submit"
							disabled={status === 'sending'}
							class="w-full rounded-lg bg-accent py-3 font-semibold text-surface transition-all duration-200 hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 disabled:opacity-60 active:scale-98"
						>
							{#if status === 'sending'}
								<span class="font-mono text-sm">Sending...</span>
							{:else}
								Send Message →
							{/if}
						</button>

						{#if status === 'error'}
							<p class="mt-3 text-center font-mono text-xs text-red-400">
								Something went wrong. Try emailing directly:
								<a href="mailto:chidiobinna0001@gmail.com" class="underline hover:text-red-300">chidiobinna0001@gmail.com</a>
							</p>
						{:else}
							<p class="mt-4 text-center font-mono text-xs text-slate-700">
								Or email directly: <a href="mailto:chidiobinna0001@gmail.com" class="text-slate-500 hover:text-accent">chidiobinna0001@gmail.com</a>
							</p>
						{/if}
					</form>
				{/if}
			</div>
		</div>
	</div>
</section>
