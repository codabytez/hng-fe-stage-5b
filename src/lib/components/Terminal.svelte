<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { terminalOpen, closeTerminal } from '$lib/stores/terminal';
	import { theme } from '$lib/stores/theme';
	import { projects } from '$lib/data/projects';

	interface Line {
		type: 'input' | 'output' | 'error' | 'info' | 'success' | 'blank';
		text: string;
	}

	let input = '';
	let history: string[] = [];
	let historyIdx = -1;
	let lines: Line[] = [];
	let inputEl: HTMLInputElement;
	let outputEl: HTMLDivElement;
	let mounted = false;

	const PROMPT = 'lisan@portfolio:~$';

	const WELCOME: Line[] = [
		{ type: 'info', text: '╔══════════════════════════════════════╗' },
		{ type: 'info', text: '║   Lisan al Gaib — Interactive CLI    ║' },
		{ type: 'info', text: '╚══════════════════════════════════════╝' },
		{ type: 'blank', text: '' },
		{ type: 'output', text: 'Welcome! Type `help` to see available commands.' },
		{ type: 'output', text: 'Use ↑ ↓ for command history, Tab for completion.' },
		{ type: 'blank', text: '' }
	];

	const COMMANDS: Record<string, string[]> = {
		help: [], whoami: [], ls: [], about: [], skills: [], projects: [], contact: [],
		clear: [], exit: [], resume: [], social: [],
		'theme': ['dark', 'light'],
		'open': projects.map((p) => p.id),
		'cat': ['about', 'skills', ...projects.map((p) => `projects/${p.id}`)],
		'cd': ['about', 'skills', 'projects', 'contact'],
		'sudo': [], 'git': ['log', 'status'], 'npm': ['run', 'install']
	};

	function scrollToBottom() {
		tick().then(() => {
			if (outputEl) outputEl.scrollTop = outputEl.scrollHeight;
		});
	}

	function addLines(newLines: Line[]) {
		lines = [...lines, ...newLines];
		scrollToBottom();
	}

	function scrollTo(id: string) {
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	}

	function processCommand(raw: string) {
		const trimmed = raw.trim();
		if (!trimmed) return;

		// Echo the input
		addLines([{ type: 'input', text: `${PROMPT} ${trimmed}` }]);

		const [cmd, ...args] = trimmed.split(/\s+/);
		const arg = args.join(' ');

		switch (cmd.toLowerCase()) {
			case 'help':
				addLines([
					{ type: 'success', text: 'Available commands:' },
					{ type: 'blank', text: '' },
					{ type: 'info', text: '  whoami          — About the developer' },
					{ type: 'info', text: '  ls              — List all portfolio sections' },
					{ type: 'info', text: '  cd <section>    — Navigate to a section' },
					{ type: 'info', text: '  cat <file>      — Read about a topic' },
					{ type: 'info', text: '  projects        — List all projects' },
					{ type: 'info', text: '  open <id>       — Open a project' },
					{ type: 'info', text: '  skills          — Display skill summary' },
					{ type: 'info', text: '  contact         — Show contact info' },
					{ type: 'info', text: '  resume          — Download resume' },
					{ type: 'info', text: '  social          — Show social links' },
					{ type: 'info', text: '  theme [dark|light] — Switch theme' },
					{ type: 'info', text: '  clear           — Clear terminal' },
					{ type: 'info', text: '  exit            — Close terminal' },
					{ type: 'blank', text: '' }
				]);
				break;

			case 'whoami':
				addLines([
					{ type: 'blank', text: '' },
					{ type: 'success', text: '  Lisan al Gaib' },
					{ type: 'output', text: '  Frontend Engineer · UI Craftsman · QA Advocate' },
					{ type: 'blank', text: '' },
					{ type: 'output', text: '  Building immersive, performant web experiences' },
					{ type: 'output', text: '  with Svelte, React, TypeScript, and Node.js.' },
					{ type: 'blank', text: '' },
					{ type: 'info', text: '  Location  : Nigeria 🇳🇬' },
					{ type: 'info', text: '  Status    : Open to work ✓' },
					{ type: 'info', text: '  GitHub    : github.com/codabytez' },
					{ type: 'info', text: '  Email     : chidiobinna0001@gmail.com' },
					{ type: 'blank', text: '' }
				]);
				break;

			case 'ls':
				addLines([
					{ type: 'blank', text: '' },
					{ type: 'info', text: '  drwxr-xr-x  about/' },
					{ type: 'info', text: '  drwxr-xr-x  skills/' },
					{ type: 'info', text: '  drwxr-xr-x  projects/' },
					{ type: 'info', text: '  drwxr-xr-x  contact/' },
					{ type: 'blank', text: '' }
				]);
				break;

			case 'cd':
				if (!arg) {
					addLines([{ type: 'error', text: 'Usage: cd <section>' }]);
				} else if (['about', 'skills', 'projects', 'contact'].includes(arg)) {
					addLines([{ type: 'success', text: `→ Navigating to #${arg}...` }]);
					closeTerminal();
					setTimeout(() => scrollTo(arg), 300);
				} else {
					addLines([{ type: 'error', text: `cd: no such section: ${arg}` }]);
				}
				break;

			case 'about':
				addLines([{ type: 'success', text: '→ Scrolling to About section...' }]);
				closeTerminal();
				setTimeout(() => scrollTo('about'), 300);
				break;

			case 'projects':
				addLines([
					{ type: 'blank', text: '' },
					{ type: 'success', text: '  Projects (5 total):' },
					{ type: 'blank', text: '' },
					...projects.map((p) => ({
						type: 'info' as const,
						text: `  [${p.id.padEnd(12)}]  ${p.title.padEnd(14)}  ${p.category}`
					})),
					{ type: 'blank', text: '' },
					{ type: 'output', text: '  Use `open <id>` to view details.' },
					{ type: 'blank', text: '' }
				]);
				break;

			case 'open': {
				const proj = projects.find((p) => p.id === arg);
				if (!proj) {
					addLines([{ type: 'error', text: `open: project not found: '${arg}'` },
						{ type: 'output', text: `Try: ${projects.map((p) => p.id).join(', ')}` }]);
				} else {
					addLines([
						{ type: 'blank', text: '' },
						{ type: 'success', text: `  ▸ ${proj.title}` },
						{ type: 'output', text: `  ${proj.longDescription}` },
						{ type: 'blank', text: '' },
						{ type: 'info', text: `  Category : ${proj.category}` },
						{ type: 'info', text: `  Stack    : ${proj.tech.join(' · ')}` },
						{ type: 'info', text: `  Live     : ${proj.live ?? 'N/A'}` },
						{ type: 'info', text: `  GitHub   : ${proj.github ?? 'N/A'}` },
						{ type: 'blank', text: '' }
					]);
				}
				break;
			}

			case 'cat': {
				if (arg === 'about') {
					addLines([{ type: 'success', text: '→ Scrolling to About...' }]);
					closeTerminal();
					setTimeout(() => scrollTo('about'), 300);
				} else if (arg === 'skills') {
					addLines([{ type: 'success', text: '→ Scrolling to Skills...' }]);
					closeTerminal();
					setTimeout(() => scrollTo('skills'), 300);
				} else {
					const projId = arg.replace('projects/', '');
					const proj = projects.find((p) => p.id === projId);
					if (proj) {
						addLines([
							{ type: 'success', text: `  # ${proj.title}` },
							{ type: 'output', text: `  ${proj.longDescription}` },
							{ type: 'info', text: `  Tech: ${proj.tech.join(', ')}` },
							{ type: 'blank', text: '' }
						]);
					} else {
						addLines([{ type: 'error', text: `cat: ${arg}: No such file` }]);
					}
				}
				break;
			}

			case 'skills':
				addLines([{ type: 'success', text: '→ Scrolling to Skills section...' }]);
				closeTerminal();
				setTimeout(() => scrollTo('skills'), 300);
				break;

			case 'contact':
				addLines([
					{ type: 'blank', text: '' },
					{ type: 'success', text: '  Contact Information:' },
					{ type: 'blank', text: '' },
					{ type: 'info', text: '  Email    : chidiobinna0001@gmail.com' },
					{ type: 'info', text: '  GitHub   : github.com/codabytez' },
					{ type: 'info', text: '  LinkedIn : linkedin.com/in/codabytez' },
					{ type: 'blank', text: '' },
					{ type: 'output', text: '  Or use `cd contact` to open the contact form.' },
					{ type: 'blank', text: '' }
				]);
				break;

			case 'social':
				addLines([
					{ type: 'blank', text: '' },
					{ type: 'info', text: '  GitHub   : github.com/codabytez' },
					{ type: 'info', text: '  LinkedIn : linkedin.com/in/codabytez' },
					{ type: 'info', text: '  Twitter  : @codabytez' },
					{ type: 'info', text: '  Email    : chidiobinna0001@gmail.com' },
					{ type: 'blank', text: '' }
				]);
				break;

			case 'resume':
				addLines([{ type: 'success', text: '→ Opening resume download...' }]);
				window.open('/resume.pdf', '_blank');
				break;

			case 'theme':
				if (arg === 'dark' || arg === 'light') {
					theme.set(arg);
					addLines([{ type: 'success', text: `✓ Theme switched to ${arg}` }]);
				} else {
					addLines([{ type: 'error', text: 'Usage: theme [dark|light]' }]);
				}
				break;

			case 'clear':
				lines = [];
				addLines([...WELCOME]);
				break;

			case 'exit':
				addLines([{ type: 'output', text: 'Closing terminal... goodbye!' }]);
				setTimeout(() => closeTerminal(), 600);
				break;

			// Easter eggs
			case 'sudo':
				addLines([{ type: 'error', text: `lisan is not in the sudoers file. This incident will be reported.` }]);
				break;

			case 'git':
				if (arg === 'log') {
					addLines([
						{ type: 'output', text: 'commit a7f3e2c (HEAD -> main, origin/main)' },
						{ type: 'output', text: 'Author: Lisan al Gaib <chidiobinna0001@gmail.com>' },
						{ type: 'output', text: 'Date:   Wed May 14 21:00:00 2026' },
						{ type: 'blank', text: '' },
						{ type: 'output', text: '    feat: build immersive portfolio with terminal ✨' },
						{ type: 'blank', text: '' },
						{ type: 'output', text: 'commit 3b9d1a8' },
						{ type: 'output', text: '    chore: drink coffee, write code, repeat ☕' },
						{ type: 'blank', text: '' }
					]);
				} else if (arg === 'status') {
					addLines([
						{ type: 'success', text: 'On branch main' },
						{ type: 'success', text: "Your branch is up to date with 'origin/main'." },
						{ type: 'output', text: 'nothing to commit, working tree clean' }
					]);
				} else {
					addLines([{ type: 'error', text: `git: '${arg}' is not a git command` }]);
				}
				break;

			case 'npm':
				if (args[0] === 'install' || args[0] === 'i') {
					const pkg = args[1] ?? 'happiness';
					addLines([
						{ type: 'output', text: `npm warn deprecated ${pkg}@0.0.1: Please upgrade` },
						{ type: 'info', text: `added 847 packages in 3s` },
						{ type: 'success', text: `✓ ${pkg} installed successfully` }
					]);
				} else {
					addLines([{ type: 'error', text: `npm: unknown command '${arg}'` }]);
				}
				break;

			default:
				addLines([
					{ type: 'error', text: `command not found: ${cmd}` },
					{ type: 'output', text: `Type 'help' for available commands.` }
				]);
		}
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			if (input.trim()) history = [input.trim(), ...history.slice(0, 49)];
			processCommand(input);
			input = '';
			historyIdx = -1;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			historyIdx = Math.min(historyIdx + 1, history.length - 1);
			input = history[historyIdx] ?? '';
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			historyIdx = Math.max(historyIdx - 1, -1);
			input = historyIdx === -1 ? '' : history[historyIdx];
		} else if (e.key === 'Tab') {
			e.preventDefault();
			// Simple tab completion
			const partial = input.trim();
			const [partCmd, ...partArgs] = partial.split(/\s+/);
			if (partArgs.length === 0) {
				const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(partCmd));
				if (matches.length === 1) input = matches[0] + ' ';
			} else {
				const completions = COMMANDS[partCmd] ?? [];
				const partArg = partArgs[partArgs.length - 1];
				const matches = completions.filter((c) => c.startsWith(partArg));
				if (matches.length === 1) input = `${partCmd} ${matches[0]}`;
			}
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) closeTerminal();
	}

	function handleKeyUp(e: KeyboardEvent) {
		if (e.key === 'Escape') closeTerminal();
	}

	onMount(() => {
		lines = [...WELCOME];
		mounted = true;
	});

	$: if ($terminalOpen && inputEl) {
		tick().then(() => inputEl?.focus());
	}

	function lineClass(type: Line['type']): string {
		switch (type) {
			case 'input': return 'text-white';
			case 'output': return 'text-slate-400';
			case 'error': return 'text-red-400';
			case 'info': return 'text-cyan-400';
			case 'success': return 'text-accent';
			default: return '';
		}
	}
</script>

<svelte:window on:keydown={handleKeyUp} />

{#if $terminalOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-8"
		role="dialog"
		aria-modal="true"
		aria-label="Interactive terminal"
		tabindex="-1"
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Escape' && closeTerminal()}
	>
		<!-- Terminal window -->
		<div
			class="relative flex h-[32rem] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-surface-border shadow-2xl shadow-black/80"
			style="background: #0a0a12"
			role="document"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<!-- Title bar -->
			<div class="flex shrink-0 items-center justify-between border-b border-surface-border bg-surface-card px-4 py-2.5">
				<div class="flex items-center gap-2">
					<!-- Traffic lights -->
					<button
						class="h-3 w-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
						onclick={() => closeTerminal()}
						aria-label="Close terminal"
					></button>
					<span class="h-3 w-3 rounded-full bg-yellow-500 opacity-60"></span>
					<span class="h-3 w-3 rounded-full bg-green-500 opacity-60"></span>
				</div>
				<span class="font-mono text-xs text-slate-600">lisan@portfolio — bash</span>
				<button
					onclick={() => closeTerminal()}
					class="text-slate-600 transition-colors hover:text-slate-400"
					aria-label="Close terminal"
				>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6 6 18M6 6l12 12"/>
					</svg>
				</button>
			</div>

			<!-- Output area -->
			<div
				bind:this={outputEl}
				class="terminal-scroll flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed"
				aria-live="polite"
				aria-label="Terminal output"
			>
				{#each lines as line}
					{#if line.type === 'blank'}
						<div class="h-2"></div>
					{:else}
						<div
							class="whitespace-pre-wrap break-all {lineClass(line.type)}"
						>
							{#if line.type === 'input'}
								<span class="text-accent">{PROMPT} </span><span class="text-white">{line.text.replace(PROMPT + ' ', '')}</span>
							{:else}
								{line.text}
							{/if}
						</div>
					{/if}
				{/each}
			</div>

			<!-- Input row -->
			<div class="shrink-0 flex items-center border-t border-surface-border px-4 py-3">
				<span class="mr-2 shrink-0 font-mono text-sm text-accent" aria-hidden="true">{PROMPT}</span>
				<input
					bind:this={inputEl}
					bind:value={input}
					onkeydown={onKeyDown}
					type="text"
					autocomplete="off"
					autocorrect="off"
					autocapitalize="off"
					spellcheck={false}
					class="flex-1 bg-transparent font-mono text-sm text-white outline-none caret-accent placeholder:text-slate-700"
					placeholder="type a command..."
					aria-label="Terminal input"
				/>
				<span class="ml-1 animate-blink text-accent font-mono text-sm">█</span>
			</div>
		</div>
	</div>
{/if}

<!-- Floating terminal button -->
{#if !$terminalOpen}
	<button
		onclick={() => terminalOpen.set(true)}
		class="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-surface-card text-accent shadow-lg shadow-black/40 transition-all duration-200 hover:border-accent hover:shadow-accent/20 animate-glow-pulse md:bottom-8 md:right-8"
		aria-label="Open interactive terminal"
		title="Open terminal (type 'help' for commands)"
	>
		<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
			<polyline points="4 17 10 11 4 5"/>
			<line x1="12" y1="19" x2="20" y2="19"/>
		</svg>
	</button>
{/if}
