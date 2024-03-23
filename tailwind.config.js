/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'arcade': ['arcade', 'sans-serif'],
      },
      colors: {
        red: {
          main: '#FF0000',
          background: '#7D0202',
        },
        orange: {
          main: '#CC8207',
          background: '#B86900',
        },
        blue: {
          main: '#001D85',
          background: '#031159',
        },
        purple: {
          main: '#1E0C3B',
          background: '#2A1D51',
        },
        gray: {
          main: '#262528',
        },
        yellow: {
          main: '#FFE713',
        },
      },
    },
  },
  plugins: [],
}

