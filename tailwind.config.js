// tailwind.config.js
module.exports = {
   content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         colors: {
            background: "var(--background)",
            foreground: "var(--foreground)",
            border: "var(--border)",
            ring: "var(--ring)",
            // Add more CSS variable bindings as needed...
         },
      },
   },
   plugins: [require("tw-animate-css")],
};
