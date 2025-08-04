import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({mode}) => {
  const isElectron = mode === 'electron';
//   console.log(`🔧 Vite configuration for mode: ${mode}`);
//   console.log(`  isElectron: ${isElectron}`);
// console.log(`  isDev: ${process.env.NODE_ENV !== 'production'}`);

  return {
    base: isElectron ? './' : '/',
    plugins: [react(), tailwindcss()],
    build:{
      outDir: isElectron ? 'dist.electron' : 'dist'
    }
  };
});
