/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic Colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-subtle": "var(--surface-subtle)",
        
        border: "var(--border)",
        "border-subtle": "var(--border-subtle)",

        // Interactive
        "primary-bg": "var(--primary-bg)",
        "primary-text": "var(--primary-text)",
        "primary-hover": "var(--primary-hover)",

        "secondary-bg": "var(--secondary-bg)",
        "secondary-text": "var(--secondary-text)",
        "secondary-hover": "var(--secondary-hover)",

        "accent-bg": "var(--accent-bg)",
        "accent-text": "var(--accent-text)",

        // Status
        success: "var(--success)",
        error: "var(--error)",

        // Brand Palette Raw Access (if needed)
        brand: {
          primary: {
            900: "var(--brand-primary-900)",
            800: "var(--brand-primary-800)",
            700: "var(--brand-primary-700)",
            600: "var(--brand-primary-600)",
            500: "var(--brand-primary-500)",
            400: "var(--brand-primary-400)",
            300: "var(--brand-primary-300)",
            200: "var(--brand-primary-200)",
            100: "var(--brand-primary-100)",
            50: "var(--brand-primary-50)",
          },
          secondary: {
            900: "var(--brand-secondary-900)",
            800: "var(--brand-secondary-800)",
            700: "var(--brand-secondary-700)",
            600: "var(--brand-secondary-600)",
            500: "var(--brand-secondary-500)",
            400: "var(--brand-secondary-400)",
            100: "var(--brand-secondary-100)",
          },
          accent: {
            600: "var(--brand-accent-600)",
            500: "var(--brand-accent-500)",
            400: "var(--brand-accent-400)",
            300: "var(--brand-accent-300)",
            100: "var(--brand-accent-100)",
          },
          neutral: {
            900: "var(--brand-neutral-900)",
            800: "var(--brand-neutral-800)",
            100: "var(--brand-neutral-100)",
            white: "var(--brand-white)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        heading: ["var(--font-heading)"],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'blob': 'blob 10s infinite',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
    },
  },
  plugins: [],
};
