export interface Project {
	id: string;
	title: string;
	description: string;
	longDescription: string;
	tech: string[];
	category: 'SaaS' | 'Library' | 'Developer Tool' | 'QA / Testing' | 'Portfolio';
	live?: string;
	github?: string;
	featured: boolean;
	color: string;
}

export const projects: Project[] = [
	{
		id: 'chronoflow',
		title: 'ChronoFlow',
		description:
			'A time-tracking SaaS with real-time analytics, team management, and Stripe billing.',
		longDescription:
			'ChronoFlow is a full-featured time tracking application built for remote teams. It features real-time WebSocket updates, advanced analytics with Chart.js, role-based access control, and Stripe subscription management. Built with Next.js App Router and Prisma ORM.',
		tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe', 'TailwindCSS', 'WebSockets'],
		category: 'SaaS',
		live: '#',
		github: '#',
		featured: true,
		color: '#00ff88'
	},
	{
		id: 'nexui',
		title: 'NexUI',
		description:
			'A headless, accessible Vue.js component library with full TypeScript support and 50+ components.',
		longDescription:
			'NexUI is a fully typed, headless component library built with Vue 3 Composition API. It provides 50+ accessible, composable components with WAI-ARIA compliance, can be styled with any CSS framework, and ships as a tree-shakeable ESM package.',
		tech: ['Vue.js', 'TypeScript', 'Vitest', 'Storybook', 'Rollup', 'Vite'],
		category: 'Library',
		live: '#',
		github: '#',
		featured: true,
		color: '#a855f7'
	},
	{
		id: 'synthapi',
		title: 'SynthAPI',
		description:
			'A CLI that scaffolds production-ready Node.js REST APIs with auth, validation, and Docker in seconds.',
		longDescription:
			'SynthAPI is a powerful CLI scaffolding tool that generates a complete Node.js API project with JWT authentication, Zod input validation, Prisma database migrations, OpenAPI documentation, and Docker configuration — in under 30 seconds.',
		tech: ['Node.js', 'TypeScript', 'Express', 'Prisma', 'Docker', 'Zod', 'OpenAPI'],
		category: 'Developer Tool',
		live: '#',
		github: '#',
		featured: true,
		color: '#06b6d4'
	},
	{
		id: 'qraft',
		title: 'Qraft',
		description:
			'A QA automation framework that generates Playwright E2E tests from natural language specs.',
		longDescription:
			'Qraft bridges the gap between non-technical stakeholders and QA automation. It parses Gherkin-style BDD specifications and generates comprehensive Playwright E2E test suites, complete with fixtures, page objects, and CI/CD integration.',
		tech: ['TypeScript', 'Playwright', 'Node.js', 'Gherkin / BDD', 'GitHub Actions'],
		category: 'QA / Testing',
		live: '#',
		github: '#',
		featured: false,
		color: '#f59e0b'
	},
	{
		id: 'portfolio',
		title: 'This Portfolio',
		description:
			'An immersive developer portfolio with an interactive terminal, GSAP animations, and full dark/light theming.',
		longDescription:
			'Built with SvelteKit, TailwindCSS, and GSAP. Features an interactive terminal for navigation with command history and tab completion, scroll-triggered section reveals, custom cursor, and system-aware theming.',
		tech: ['SvelteKit', 'TypeScript', 'TailwindCSS', 'GSAP'],
		category: 'Portfolio',
		live: '#',
		github: '#',
		featured: false,
		color: '#e879f9'
	}
];

export const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))] as const;
