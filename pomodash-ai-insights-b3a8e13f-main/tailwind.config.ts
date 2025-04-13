
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Kiwi theme colors - using the exact colors from the specification
				'green': {
					light: '#4ADE80',
					DEFAULT: '#22c55e',
					dark: '#16a34a',
				},
				'lime': {
					light: '#A3E635',
					DEFAULT: '#84cc16',
					dark: '#65a30d',
				},
				'teal': {
					light: '#2DD4BF',
					DEFAULT: '#14b8a6',
					dark: '#0d9488',
				},
				'purple': {
					light: '#9b87f5',
					DEFAULT: '#7E69AB',
					dark: '#6E59A5',
				},
				'orange': {
					light: '#FEC6A1',
					DEFAULT: '#F97316',
					dark: '#EA580C',
				},
				'app-bg': '#0f172a',  // Deep navy blue as specified
				'card-bg': '#1e293b',  // Slightly lighter navy as specified
				'card-dark': '#151e2d', // Darker shade for contrast
				
				'status-orange': '#FF9F5A',
				'status-green': '#2ECC71',
				'status-blue': '#33C3F0',
				'status-yellow': '#FFCB36',
				'status-red': '#E74C3C',
				
				'flat-blue': '#33C3F0',
				'flat-green': '#2ECC71',
				'flat-orange': '#FF9F5A',
				'flat-yellow': '#FFCB36',
				'flat-red': '#E74C3C',
				'flat-teal': '#14b8a6',
				'flat-cyan': '#1ABC9C',
                
                'kiwi-light': '#10b981', // Vibrant emerald green as specified
                'kiwi-medium': '#059669', // Medium green for buttons
                'kiwi-dark': '#0f172a',   // Dark navy background as specified
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1.25rem',
				'3xl': '1.5rem',
				'4xl': '2rem',
				'full': '9999px',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-subtle': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.8'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				'gradient': {
					'0%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					},
					'100%': {
						backgroundPosition: '0% 50%'
					}
				},
				'blob': {
					'0%, 100%': {
						transform: 'translate(0, 0) scale(1)'
					},
					'25%': {
						transform: 'translate(20px, 15px) scale(1.1)'
					},
					'50%': {
						transform: 'translate(-15px, 10px) scale(0.9)'
					},
					'75%': {
						transform: 'translate(15px, -20px) scale(1.05)'
					}
				},
				'bounce-subtle': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-5px)'
					}
				},
				'scale-pulse': {
					'0%, 100%': {
						transform: 'scale(1)'
					},
					'50%': {
						transform: 'scale(1.05)'
					}
				},
				'rotate-360': {
					'from': {
						transform: 'rotate(0deg)'
					},
					'to': {
						transform: 'rotate(360deg)'
					}
				},
				'bounce': {
					'0%, 100%': {
						transform: 'translateY(0)',
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
					},
					'50%': {
						transform: 'translateY(-25%)',
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
					}
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
				'fade-in': 'fade-in 0.5s ease-out',
				'gradient': 'gradient 15s ease infinite',
				'blob': 'blob 25s cubic-bezier(0.4, 0, 0.2, 1) infinite',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'scale-pulse': 'scale-pulse 3s ease-in-out infinite',
				'rotate-360': 'rotate-360 2s linear infinite',
				'bounce': 'bounce 1s infinite',
				'wiggle': 'wiggle 1s ease-in-out infinite'
			},
			scale: {
				'120': '1.20',
			},
			fontFamily: {
				sans: ['Poppins', 'sans-serif'],
				mono: ['monospace'],
                bubblegum: ['Poppins', 'sans-serif']
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
