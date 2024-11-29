module.exports = {
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
            sans: ['Roboto Serif', 'sans-serif'],
          },
          fontSize: {
            titleXl: ['1.75rem', { lineHeight: '2.25rem' }],     // 36px
            title: ['1.25rem', { lineHeight: '1.75rem' }],     // 24px
            subtitle: ['1rem', { lineHeight: '1.5rem' }],   // 16px
            body: ['0.75rem', { lineHeight: '1.25rem'}],       // 12px
          },
          colors: {
            primary: '#1B98DF',
            secondary: '#0F5379',
            background: '#CACACA',
            gray: '#A5A5A5',
            dark_gray: '#444444',
          },
      },
    },
    plugins: [],
  }