/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#4CAF50", // Vibrant Forest Green
          "primary-content": "#1B3D1B", // Dark Green for readability
  
          secondary: "#A5D6A7", // Light Green for accents
          "secondary-content": "#1B3D1B", // Dark Green for contrast
  
          accent: "#81C784", // Soft Green Accent
          "accent-content": "#1B3D1B", // Dark Green for clarity
  
          neutral: "#2E7D32", // Medium Dark Green
          "neutral-content": "#FFFFFF", // White for text readability
  
          "base-100": "#F1F8E9", // Very Light Green (almost white)
          "base-200": "#E8F5E9", // Slightly Deeper Light Green
          "base-300": "#C8E6C9", // Soft Green for depth
          "base-content": "#1B3D1B", // Dark Green for text
  
          info: "#4CAF50", // Bright Green Info
          success: "#34EEB6", // Bright success green
          warning: "#FFCF72", // Muted warm yellow for warnings
          error: "#FF8863", // Soft reddish-orange for errors

          "--rounded-btn": "9999rem",
          ".tooltip": { "--tooltip-tail": "6px" },
          ".link": { textUnderlineOffset: "2px" },
          ".link:hover": { opacity: "80%" },
        },
      },
      {
        dark: {
          primary: "#228B22", // Forest Green
          secondary: "#1B5E20", // Darker Forest Green
          accent: "#A5D6A7", // Light Green Accent
          background: "#0E3B0E", // Deep Green for Background
  
          "primary-content": "#E8F5E9", // Soft Green-White for readability
          "secondary-content": "#C8E6C9", // Light Green for contrast
          "accent-content": "#F1F8E9", // Very light green for highlights
          "neutral-content": "#1B3D1B", // Dark forest green for contrast
  
          "base-100": "#0E3B0E", // Deepest Forest Green for backgrounds
          "base-200": "#1B5E20", // Darker Forest Green (lighter than base-100)
          "base-300": "#2E7D32", // Medium Dark Green
          "base-content": "#E8F5E9", // Light green for text
  
          info: "#4CAF50", // Vibrant Green for info highlights
          success: "#34EEB6", // Bright success green
          warning: "#FFCF72", // Muted warm yellow for warnings
          error: "#FF8863", // Soft reddish-orange for errors

          "--rounded-btn": "9999rem",
          ".tooltip": { "--tooltip-tail": "6px", "--tooltip-color": "oklch(var(--p))" },
          ".link": { textUnderlineOffset: "2px" },
          ".link:hover": { opacity: "80%" },
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
      },
    },
  },
};
