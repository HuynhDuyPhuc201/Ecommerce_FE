import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [{ find: '~', replacement: '/src' }],
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "slick-carousel/slick/slick.css";
                                 @import "slick-carousel/slick/slick-theme.css";`,
            },
        },
    },
});
