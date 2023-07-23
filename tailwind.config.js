/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    colors: {
      'text': '#030407',
      'background': '#d8e4fd',
      'primary': '#0d285e',
      'secondary': '#dcc6e6',
      'accent': '#7f449c',
      darkMode: {
        'text': '#fafafa',
        'background': '#050505',
        'primary': '#0d285e',
        'secondary': '#1d1023',
        'accent': '#bd94d1',
      }
    }
  },
  plugins: [],
}
