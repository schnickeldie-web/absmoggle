import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        night: "#030508",
        ink: "#081018",
        panel: "rgba(10, 18, 28, 0.72)",
        cyanx: "#00E5FF",
        pinkx: "#FF2BD6",
        mintx: "#30F2A6",
        amberx: "#F6C453",
        dangerx: "#FF4D67"
      },
      boxShadow: {
        neon: "0 0 26px rgba(0, 229, 255, 0.22)",
        pink: "0 0 30px rgba(255, 43, 214, 0.2)"
      },
      backgroundImage: {
        "arena-radial":
          "radial-gradient(circle at 18% 14%, rgba(0,229,255,0.22), transparent 28%), radial-gradient(circle at 86% 20%, rgba(255,43,214,0.2), transparent 30%), linear-gradient(135deg, #030508 0%, #081018 42%, #120812 100%)"
      }
    }
  },
  plugins: []
};

export default config;
