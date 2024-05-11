import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap from 'gsap'


function App() {
  const canvasRef = useRef(null)
  useEffect(() => {
    if (canvasRef.current) {
      // Scene and Sphere
      const scene = new THREE.Scene()
      const geometry = new THREE.SphereGeometry(3, 16, 16)
      const material = new THREE.MeshStandardMaterial({ color: '#00ff83' })
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
      //Sizes
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
      }
      //Light
      const light = new THREE.PointLight(0xffffff, 1)
      light.position.set(0, 10, 10)
      light.intensity = 150
      scene.add(light)
      // Camera
      const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)
      camera.position.z = 20
      scene.add(camera)
      
      // Renderer
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current })
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(1)
      renderer.render(scene, camera)

      //Resize
      window.addEventListener('resize', () => {
        //Update Sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
        //Update Camera & Renderer
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
        renderer.setSize(sizes.width, sizes.height)
      })

      //Controls
      const controls = new OrbitControls(camera, canvasRef.current)
      controls.enableDamping = true
      controls.enablePan = false
      controls.enableZoom = false
      controls.autoRotate = true
      controls.autoRotateSpeed = 10

      //Loop to constantly update
      const loop = () => {
        controls.update()
        renderer.render(scene, camera)
        window.requestAnimationFrame(loop)
      }
      loop()

      //Timeline
      const tl = gsap.timeline({defaults: {duration: 1}})
      tl.fromTo(mesh.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1})
      tl.fromTo("nav", {y:"-100%"}, {y: "0%"})
      tl.fromTo(".spin", {opacity: 0}, {opacity: 1})

      //Color Animation
      let mouseDown = false
      let rgb = []
      window.addEventListener('mousedown', () => {
        mouseDown = true
      })
      window.addEventListener('mouseup', () => {
        mouseDown = false
      })
      window.addEventListener('mousemove', (e) => {
        if (mouseDown) {
          rgb = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255),
            200
          ]
          //Animation
          let newColor = new THREE.Color(`rgb(${rgb.join(',')})`)
          gsap.to(mesh.material.color, {r: newColor.r, g:newColor.g, b:newColor.b})
        }
      })

      return () => {
        // Clean up Three.js components
        renderer.dispose();
        controls.dispose();
      }
    }
  }, [canvasRef])
  return (
    <div>
      <canvas ref={canvasRef} className='absolute top-0 left-0 z-0'></canvas>
      <nav className='text-white p-4 z-10 relative flex justify-center'>
        <h1 className='text-xl'>ball...</h1>
      </nav>
      <div className='z-10 absolute left-1/2 top-3/4 -translate-x-1/2 -translate-y-3/4 spin'>
        <h1 className='text-white text-3xl font-bold'>Spinning ball...</h1>
      </div>
    </div>
  )
}
export default App;
