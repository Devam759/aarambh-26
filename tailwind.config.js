/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#f5821e',
          pink: '#184176',
          blue: '#215798',
          ink: '#030404',
          cloud: '#F5F1E5',
        },
        primary: {
          DEFAULT: '#184176',
          dark: '#0f2a4e',
        },
        secondary: {
          DEFAULT: '#215798',
          dark: '#153965',
        },
        accent: {
          DEFAULT: '#f5821e',
          dark: '#d06a13',
        },
        dark: {
          DEFAULT: '#030404',
          lighter: '#1a1a1a',
        },
        admin: {
          bg: '#F5F1E5',
          surface: '#ffffff',
          accent: '#f5821e',
          text: '#030404',
          muted: '#64748b',
          border: '#e2e8f0'
        },
        brandColors: {
          orange: '#f5821e',
          pink: '#184176',
          blue: '#215798',
          black: '#030404',
          white: '#F5F1E5',
        }
      },
      fontFamily: {
        bricks: ['"Outfit"', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
        sans: ['"Google Sans"', 'Roboto', 'system-ui', 'sans-serif'],
        adminHeading: ['"DM Serif Display"', 'serif'],
        adminBody: ['"DM Sans"', 'sans-serif'],
        premium: ['"Outfit"', 'system-ui', 'sans-serif'],
        vanilla: ['"Outfit"', 'sans-serif'],
        diary: ['"Outfit"', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #f5821e 0%, #184176 50%, #215798 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, rgba(245,130,30,0.15) 0%, rgba(24,65,118,0.15) 50%, rgba(33,87,152,0.15) 100%)',
        'glass-gradient': 'linear-gradient(to bottom right, rgba(245, 241, 229, 0.08), rgba(245, 241, 229, 0.03))',
      },
      boxShadow: {
        'brand-pink': '0 0 40px rgba(24, 65, 118, 0.25)',
        'brand-orange': '0 0 40px rgba(245, 130, 30, 0.25)',
        'brand-blue': '0 0 40px rgba(33, 87, 152, 0.25)',
      },
    },
  },
  plugins: [],
}
