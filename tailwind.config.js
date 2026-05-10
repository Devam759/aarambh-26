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
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
        secondary: {
          DEFAULT: '#10b981',
          dark: '#059669',
        },
        dark: {
          DEFAULT: '#0f172a',
          lighter: '#1e293b',
        },
        admin: {
          bg: '#f8fafc',
          surface: '#ffffff',
          accent: '#f59e0b',
          text: '#0f172a',
          muted: '#64748b',
          border: '#e2e8f0'
        }
      },
      fontFamily: {
        adminHeading: ['"DM Serif Display"', 'serif'],
        adminBody: ['"DM Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
    },
  },
  plugins: [],
}
