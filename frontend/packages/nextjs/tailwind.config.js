/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", "[data-theme='dark']"], // Ensure compatibility
  daisyui: {
    themes: [
      {
        light: {
          primary: "#4CAF50",
          "primary-content": "#1B3D1B",
          secondary: "#A5D6A7",
          "secondary-content": "#1B3D1B",
          accent: "#81C784",
          "accent-content": "#1B3D1B",
          neutral: "#2E7D32",
          "neutral-content": "#FFFFFF",
          "base-100": "#F1F8E9",
          "base-200": "#E8F5E9",
          "base-300": "#C8E6C9",
          "base-content": "#1B3D1B",
          info: "#4CAF50",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--rounded-btn": "9999rem",
        },
      },
      {
        dark: {
          primary: "#228B22",
          secondary: "#1B5E20",
          accent: "#A5D6A7",
          background: "#0E3B0E",
          "primary-content": "#E8F5E9",
          "secondary-content": "#C8E6C9",
          "accent-content": "#F1F8E9",
          "neutral-content": "#1B3D1B",
          "base-100": "#0E3B0E",
          "base-200": "#1B5E20",
          "base-300": "#2E7D32",
          "base-content": "#E8F5E9",
          info: "#4CAF50",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--rounded-btn": "9999rem",
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: { center: "0 0 12px -2px rgb(0 0 0 / 0.05)" },
      animation: { "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite" },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        special: ["SpecialElite", "sans-serif"],
      },
      colors: {
        agedPaper: '#b1986b',
      },
      backgroundImage: {
        'aged-paper': 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.05))',
      },
    },
  },
  plugins: [
    require("daisyui"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.bg-aged-paper': {
          backgroundColor: '#b1986b',
          backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.05))',
        },
      });
    }),
  ],
};
