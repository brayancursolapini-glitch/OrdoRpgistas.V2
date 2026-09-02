import {
    defineConfig,
} from "vite";

import react from "@vitejs/plugin-react";


export default defineConfig({

    base: "/OrdoRpgistas.V2/",


    plugins: [

        react(),

    ],


    build: {

        outDir: "dist",

        assetsDir: "assets",

        emptyOutDir: true,

    },


    server: {

        host: true,

        port: 5173,

    },

});
