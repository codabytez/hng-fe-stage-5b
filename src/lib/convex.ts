const CONVEX_URL = 'https://careful-chinchilla-110.convex.cloud';

export async function runQuery<T = unknown>(
	path: string,
	args: Record<string, unknown> = {}
): Promise<T> {
	const res = await fetch(`${CONVEX_URL}/api/query`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ path, args, format: 'json' })
	});

	if (!res.ok) {
		throw new Error(`Convex query failed: ${res.status} ${res.statusText}`);
	}

	const data = await res.json();

	// Convex HTTP API wraps result in { status, value } or { status, errorMessage }
	if (data.status === 'error') {
		throw new Error(data.errorMessage ?? 'Convex query error');
	}

	return data.value as T;
}
