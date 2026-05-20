import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
};

export default config;
