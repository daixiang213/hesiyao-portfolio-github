import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  esbuild: false,
  build: {
    minify: false,
  },
};
