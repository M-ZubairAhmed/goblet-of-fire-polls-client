module.exports = {
  purge: ['./src/**/*.js'],
  theme: {
    screens: {
      md: '768px',
      xl: '1280px',
    },
    extend: {},
  },
  variants: {},
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
}
