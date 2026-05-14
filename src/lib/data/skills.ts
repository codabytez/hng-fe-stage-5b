export interface SkillCategory {
	name: string;
	color: string;
	skills: { name: string; level: number }[];
}

export const skillCategories: SkillCategory[] = [
	{
		name: 'Frontend',
		color: '#00ff88',
		skills: [
			{ name: 'JavaScript / TypeScript', level: 95 },
			{ name: 'React / Next.js', level: 91 },
			{ name: 'Svelte / SvelteKit', level: 89 },
			{ name: 'Vue.js', level: 83 },
			{ name: 'CSS / TailwindCSS', level: 94 },
			{ name: 'HTML5 / Accessibility', level: 92 }
		]
	},
	{
		name: 'Backend',
		color: '#a855f7',
		skills: [
			{ name: 'Node.js', level: 86 },
			{ name: 'Express / Fastify', level: 84 },
			{ name: 'PostgreSQL / Prisma', level: 79 },
			{ name: 'REST / GraphQL APIs', level: 87 }
		]
	},
	{
		name: 'Testing & QA',
		color: '#06b6d4',
		skills: [
			{ name: 'Playwright', level: 90 },
			{ name: 'Vitest / Jest', level: 86 },
			{ name: 'Testing Library', level: 84 },
			{ name: 'Cypress / E2E', level: 78 }
		]
	},
	{
		name: 'Tools & DevOps',
		color: '#f59e0b',
		skills: [
			{ name: 'Git / GitHub', level: 93 },
			{ name: 'Vite / Webpack', level: 87 },
			{ name: 'Docker', level: 76 },
			{ name: 'CI/CD (GitHub Actions)', level: 80 }
		]
	}
];
