/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        olive:            'var(--color-olive)',
        'olive-light':    'var(--color-olive-light)',
        'olive-muted':    'var(--color-olive-muted)',
        brown:            'var(--color-brown)',
        'brown-light':    'var(--color-brown-light)',
        'brown-dark':     'var(--color-brown-dark)',
        success:          'var(--color-success)',
        warning:          'var(--color-warning)',
        danger:           'var(--color-danger)',
        background:       'var(--color-background)',
        foreground:       'var(--color-foreground)',
        muted:            'var(--color-muted)',
      },
      spacing: {
        header:           'var(--size-header)',
        sidebar:          'var(--size-sidebar)',
        xs:               'var(--gap-xs)',
        sm:               'var(--gap-sm)',
        md:               'var(--gap-md)',
        lg:               'var(--gap-lg)',
      },
      borderRadius: {
        sm:               'var(--radius-sm)',
        md:               'var(--radius-md)',
        lg:               'var(--radius-lg)',
      },
      fontFamily: {
        sans:             'var(--font-sans)',
        mono:             'var(--font-mono)',
      },
      screens: {
        'sm':             'var(--bp-sm)',
        'md':             'var(--bp-md)',
        'lg':             'var(--bp-lg)',
      }
    },
  },
  plugins: [],
}
