import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './phaser/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [],
  theme: {
    extend: {
      height: {
        '270': '270px',
        '170':'170px',
        '45%':'45%'
      },
      width: {
        '500': '500px',
        '300': '300px',
        '90%':'90%'
      },
    },
  }
}


export default config;
