/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				surface: {
					DEFAULT: '#08080f',
					card: '#0e0e1a',
					elevated: '#141420',
					border: '#1e1e2e'
				},
				accent: {
					DEFAULT: '#00ff88',
					dim: 'rgba(0,255,136,0.15)',
					glow: 'rgba(0,255,136,0.4)'
				},
				highlight: {
					DEFAULT: '#a855f7',
					dim: 'rgba(168,85,247,0.15)'
				},
				info: '#06b6d4',
				warn: '#f59e0b'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['"JetBrains Mono"', '"Fira Code"', 'Cascadia Code', 'monospace']
			},
			animation: {
				blink: 'blink 1s step-end infinite',
				float: 'float 6s ease-in-out infinite',
				'float-slow': 'float 9s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
				'slide-up': 'slide-up 0.6s ease-out forwards',
				'fade-in': 'fade-in 0.8s ease-out forwards',
				'scan': 'scan 8s linear infinite',
				'spin-slow': 'spin 20s linear infinite'
			},
			keyframes: {
				blink: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-12px)' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 15px rgba(0,255,136,0.25)' },
					'50%': { boxShadow: '0 0 35px rgba(0,255,136,0.55)' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(30px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				scan: {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(100vh)' }
				}
			},
			backgroundImage: {
				'grid-pattern':
					'linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)',
				'radial-glow': 'radial-gradient(ellipse at center, rgba(0,255,136,0.08) 0%, transparent 70%)'
			},
			backgroundSize: {
				'grid-50': '50px 50px'
			}
		}
	},
	plugins: []
};
