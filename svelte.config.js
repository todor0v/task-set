import vercel from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
/** @type {import('@sveltejs/kit').Config} */
export default {
    preprocess: preprocess({
        postcss: true,
    }),
    kit: {
        vite: {
            define: {
                'process.env': process.env,
            },
        },
        adapter: vercel()
    },
};
