export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
    "postcss-nested": {},
    ...(process.env.NODE_ENV === "production"
      ? { cssnano: { preset: "default" } }
      : {}),
  },
};