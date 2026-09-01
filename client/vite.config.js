import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig(() => {

    return {

        plugins: [
            react(),
        ],

        base:
            process.env.GITHUB_ACTIONS
                ? "/OrdoRpgistas.V2/"
                : "/",

    };

});
