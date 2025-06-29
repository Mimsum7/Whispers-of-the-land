/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ochre: {
          50: '#FBF8F1',
          100: '#F5EFDF',
          200: '#EBDBC0',
          300: '#E0C49B',
          400: '#D4A574',
          500: '#C8955C',
          600: '#B8834F',
          700: '#9A6C43',
          800: '#7D583A',
          900: '#654831',
        },
        clay: {
          50: '#FDF3F2',
          100: '#FCE4E2',
          200: '#FACECA',
          300: '#F5ACA5',
          400: '#ED7D74',
          500: '#B85450',
          600: '#A84B47',
          700: '#8B3F3C',
          800: '#733434',
          900: '#602D2E',
        },
        forest: {
          50: '#F0F9F4',
          100: '#DCF2E6',
          200: '#BBE5CF',
          300: '#8DD1AE',
          400: '#57B686',
          500: '#349B69',
          600: '#2D5F3F',
          700: '#26663A',
          800: '#215530',
          900: '#1C4629',
        },
        cream: {
          50: '#FEFCF9',
          100: '#F5F1E8',
          200: '#EBE2D0',
          300: '#DFCFB0',
          400: '#D1B88C',
          500: '#C4A572',
          600: '#B8955C',
          700: '#9A7A4A',
          800: '#7D633E',
          900: '#665034',
        }
      },
      fontFamily: {
        'serif': ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      backgroundImage: {
        'african-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4A574' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20zM0 0c11.046 0 20 8.954 20 20s-8.954 20-20 20S-20 28.046-20 20-11.046 0 0 0z'/%3E%3C/g%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
};