import { Suspense, useEffect, useState} from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload, useGLTF } from '@react-three/drei'
import CanvasLoader from '../Loader'


const Computers = ({ isMobile }) => {
  const computer = useGLTF('./desktop_pc/scene.gltf')
  return (
    <mesh>
      <hemisphereLight intensity={1.5} groundColor='black' />
      <spotLight
        position={[20, 10, -20]}
        angle={0.12}
        penumbra={1}
        intensity={1000}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={15} />
      <primitive 
        object={computer.scene}
        scale={isMobile? 0.6 : 0.75}
        position={isMobile?[0, -3, -1.95]:[0, -3.50, -1.25]}
        rotation={[-0.01, -0.2, -0.1]}
       /> 
    </mesh>
  )
}

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false)

   // State to manage the cursor style
   const [isGrabbing, setIsGrabbing] = useState(false);

   // Event handlers to toggle the cursor state
   const handleMouseDown = () => setIsGrabbing(true);
   const handleMouseUp = () => setIsGrabbing(false);
 
   // Compute the className based on whether the mouse is down or not
   const cursorClassName = isGrabbing ? 'cursor-grabbing' : 'cursor-grab';

  useEffect(() => {

    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia('(max-width: 500px)')

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches)

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) =>{
      setIsMobile(event.matches);
    }

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener('change', handleMediaQueryChange)

     // Remove the listener when the component is unmounted
    return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
  }, [])
  return (
    <Canvas
      frameloop='demand'
      shadows
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{preserveDrawingBuffer: true}}
      className={cursorClassName}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile}/>
      </Suspense>
      <Preload all /> 
    </Canvas>
  )
}

export default ComputersCanvas