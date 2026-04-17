/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cafe color palette
        espresso: {
          50: '#f5f3f1',
          100: '#e8e3df',
          200: '#d9cec6',
          300: '#c4b0a3',
          400: '#a8926b',
          500: '#6f4e37', // Deep espresso
          600: '#5c3f2f',
          700: '#4a3229',
          800: '#3d2817',
          900: '#2a1810',
        },
        latte: {
          50: '#fffbf8',
          100: '#fef5f0',
          200: '#fce8df',
          300: '#f9d9cc',
          400: '#f4c4aa',
          500: '#f0ad86', // Warm latte
          600: '#e89970',
          700: '#dd7d55',
          800: '#d16a48',
          900: '#b84a2f',
        },
        cream: {
          50: '#fefdfb',
          100: '#fdf9f2',
          200: '#faf1e3',
          300: '#f6e9d0',
          400: '#f1ddb3',
          500: '#ead4a3', // Soft cream
          600: '#dfc089',
          700: '#d4a865',
          800: '#c68f48',
          900: '#a87033',
        },
        caramel: {
          50: '#fffbf5',
          100: '#fff5e6',
          200: '#fce3c0',
          300: '#f8cfa0',
          400: '#f4b580',
          500: '#e8905a', // Warm caramel
          600: '#dc743a',
          700: '#d65c2a',
          800: '#c04a20',
          900: '#a53820',
        },
        primary: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        }
      },
      backgroundImage: {
        'coffee-gradient': 'linear-gradient(135deg, #2a1810 0%, #4a3229 100%)',
        'latte-gradient': 'linear-gradient(135deg, #fef5f0 0%, #faf1e3 100%)',
        'cafe-gradient': 'linear-gradient(135deg, #2a1810 0%, #6f4e37 50%, #f0ad86 100%)',
      },
    },
  },
  plugins: [],
}
