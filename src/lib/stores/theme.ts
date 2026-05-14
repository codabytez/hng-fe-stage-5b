import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'dark' | 'light';

function createThemeStore() {
	const stored = browser ? (localStorage.getItem('theme') as Theme | null) : null;
	const systemDark = browser ? window.matchMedia('(prefers-color-scheme: dark)').matches : true;
	const initial: Theme = stored ?? (systemDark ? 'dark' : 'light');

	const { subscribe, set, update } = writable<Theme>(initial);

	function applyTheme(t: Theme) {
		if (!browser) return;
		localStorage.setItem('theme', t);
		document.documentElement.classList.toggle('dark', t === 'dark');
		document.documentElement.classList.toggle('light', t === 'light');
	}

	if (browser) applyTheme(initial);

	return {
		subscribe,
		toggle() {
			update((t) => {
				const next: Theme = t === 'dark' ? 'light' : 'dark';
				applyTheme(next);
				return next;
			});
		},
		set(t: Theme) {
			applyTheme(t);
			set(t);
		}
	};
}

export const theme = createThemeStore();
