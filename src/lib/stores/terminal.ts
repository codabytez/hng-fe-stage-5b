import { writable } from 'svelte/store';

export const terminalOpen = writable(false);

export function openTerminal() {
	terminalOpen.set(true);
}

export function closeTerminal() {
	terminalOpen.set(false);
}

export function toggleTerminal() {
	terminalOpen.update((v) => !v);
}
