import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './phaser/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),

  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      height: {
        '270': '270px',
        '170':'170px',
        '22%':"22%",
        '500': '500px',
        '300': '300px',
        '90%':'90%',
        '75%':'75%',
        '70%':'70%',
        '65%':'65%',
        '45%':"45%",
        '23%':'23%',
        '36%':"36%",
        "34%":"34%",
        "32%":"32%",
        "30%":"30%",
        "19%":"19%",
        '10%':'10%',
        '73%':"73%"
      },
      width: {
        '500': '500px',
        '300': '300px',
        '45%':"45%",
        '90%':'90%',
        '75%':'75%',
        '70%':'70%',
        '22%':'22%',
        '23%':'23%',
        '36%':"36%",
        "34%":"34%",
        "32%":"32%",
        "30%":"30%",
        "19%":"19%",
        '10%':'10%',
        '73%':"73%",
        '76%':"76%",
        '67%':"67%",
        '56%':"56%",
        '48%':"48%"
      },
      spacing:{
        '15%':"15%",
        "30%":"30%",

        "10%":"10%",
        "13%":"13%",
        "40%":"40%",
        "60%":"60%",
        "8%":"8%",
        "12%":"12%",
        "100":"100px",
        "17%":"19%",
        "21%":"21%",
        "22%":"22%",
        "23%":"23%",
        "4%":"4%",
        "20%":"20%",

      },
    },
  }
}


export default config;
