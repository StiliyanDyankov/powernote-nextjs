/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    colors: {
      "primary": "#90caf9",
      "l-secondary": "#003554",
      "l-utility-dark": "#00043A",
      "l-tools-bg": "#E9ECEF",
      "l-divider": "#7D7D7D",
      "l-workscreen-bg": "#F4F4F4",
      "l-workspace-bg": "#FAFAFA",
      "d-100-body-bg": "#1b1e32",
      "d-200-cards": "#292e4c",
      "d-300-chips": "#373d65",
      "d-400-sibebar": "#454c7f",
      "d-500-divider": "#525c98",
      "d-600-lightest": "#7f87b9",
      "d-700-text": "#a6abce",
    },
    extend: {
      fontFamily: {
        quicksand: ["Quicksand", "sans-serif"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
