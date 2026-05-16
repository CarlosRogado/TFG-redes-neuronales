import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App.tsx'

async function iniciarApp() {
  const tf = await import('@tensorflow/tfjs')

  try {
    await import('@tensorflow/tfjs-backend-webgpu')
    await tf.setBackend('webgpu')
    console.log('🎮 Backend:', tf.getBackend())
  } catch {
    console.warn('WebGPU no disponible, usando WebGL')
    await import('@tensorflow/tfjs-backend-webgl')
    await tf.setBackend('webgl')
    console.log('🎮 Backend:', tf.getBackend())
  }

  ;(window as any).tf = tf

  createRoot(document.getElementById('root')!).render(<App />)
}

iniciarApp()