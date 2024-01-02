/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: 991519166 (https://sketchfab.com/991519166)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/galaxy-dbb2f075329747a09cc8add2ad05acad
Title: Sun
*/
import { useRef, useEffect, useState } from 'react'; // Importing React hooks for state and reference management
import { useAnimations, useGLTF } from '@react-three/drei'; // Importing hooks from Drei for animations and loading GLTF models
import { useFrame, useThree } from '@react-three/fiber'; // Importing hooks from react-three-fiber for rendering and using Three.js context
import { useDrag } from 'react-use-gesture'; // Importing a hook for handling drag gestures
import sunScene from '../assets/3d/sun.glb'; // Importing a GLTF model of the sun from assets

// Sun component definition
const Sun = ({ setCurrentStage, setSunDragging, sunDragging, ...props }) => {
  const sunRef = useRef(); // Creating a ref to refer to the 3D object in the scene
  const { scene, animations } = useGLTF(sunScene); // Loading the sun scene and its animations using useGLTF hook
  const { actions } = useAnimations(animations, sunRef); // Setting up animations for the sun model
  const [velocity, setVelocity] = useState({ x: 0, y: 0 }); // State to track the velocity of the sun
  const [hasBeenDragged, setHasBeenDragged] = useState(false); // State to track if the sun has been dragged
  const { size } = useThree(); // Getting the size of the canvas from react-three-fiber's context
  const [bounds, setBounds] = useState({ x: 5, y: 5, z: 5 }) // State to store bounds for sun's movement
  const [stablePosition, setStablePosition] = useState({ x: 0, y: -5, z: 0 }); // State to store the sun's stable position
  const isMobile = window.innerWidth < 768; // Check if the screen is a mobile device
  

  useEffect(() => {
    actions['Take 001'].play(); // Playing the first animation on load
  }, [])
  

  // Update bounds based on screen size
  useEffect(() => {
    let newBounds; // Variable to hold the new bounds
    // Calculate bounds based on device type
    if (isMobile) {
      newBounds = {
        x: size.width / 150,
        y: size.height / 150,
      };
    } else {
      newBounds = {
        x: size.width / 150,
        y: size.height / 150,
      };
    }
    setBounds(newBounds); // Update the bounds state
  }, [size]);


  const bind = useDrag(({ xy: [x, y], down, movement: [mx, my], event }) => {
    const isTouch = event.touches && event.touches.length > 0;
    const scaleFactor = isTouch ? 400 : 800; // A constant to scale the drag effect
    const xPosition = (x - size.width / 2) / 60;
    const yPosition = (size.height / 2 - y) / 60;
    
  
    if (down) {
      // Update position while dragging
      sunRef.current.position.x = xPosition;
      sunRef.current.position.y = yPosition;
      setCurrentStage(null);

      if (!sunDragging) {
        setSunDragging(true);
      }
      if (!hasBeenDragged) {
        // Set the stable position to the sun's current position when drag starts
        setStablePosition({
          x: sunRef.current.position.x,
          y: sunRef.current.position.y,
          z: sunRef.current.position.z
        });
        setHasBeenDragged(true);
      }
    } else {
      // Update velocity when drag ends
      setVelocity({
        x: mx / scaleFactor,
        y: -my / scaleFactor,
      });
      setSunDragging(false);
    }
  }, { pointerEvents: true });
  

  // Animation frame update
  useFrame(({ clock }) => {
    // Check if the sun has not been dragged
    if (!hasBeenDragged) {
      // Define the parameters of the elliptical path
      const a = 11; // Semi-major axis for the x-direction
      const b = 0; // Semi-minor axis for the y-direction
      const c = 13; // Semi-axis for the z-direction
      const speed = 0.5; // Speed of movement
      // Calculate the elliptical path
      sunRef.current.position.x = a * Math.cos(speed * clock.elapsedTime);
      sunRef.current.position.y = b * Math.sin(speed * clock.elapsedTime) - 2; // Add vertical offset
      sunRef.current.position.z = c * Math.sin(speed * clock.elapsedTime) - 16;
    } else if (sunRef.current.position.z < -10 && isMobile) {
      sunRef.current.position.z = -4;
    } else if (sunRef.current.position.z < -10 && !isMobile) {
      sunRef.current.position.z = -6;
    }
    // Apply the calculated velocity to the sun's position
    sunRef.current.position.x += velocity.x;
    sunRef.current.position.y += velocity.y;
    // Apply damping to the velocity to simulate friction
    const dampingFactor = 0.98;
    setVelocity(v => ({
      x: v.x * dampingFactor,
      y: v.y * dampingFactor
    }));

    // Bounds checking and correction
    if (hasBeenDragged) {
      if (sunRef.current.position.x > bounds.x) {
        sunRef.current.position.x = bounds.x;
        setVelocity(v => ({ ...v, x: -Math.abs(v.x) }));
      } else if (sunRef.current.position.x < -bounds.x) {
        sunRef.current.position.x = -bounds.x;
        setVelocity(v => ({ ...v, x: Math.abs(v.x) }));
      }
  
      if (sunRef.current.position.y > bounds.y) {
        sunRef.current.position.y = bounds.y;
        setVelocity(v => ({ ...v, y: -Math.abs(v.y) }));
      } else if (sunRef.current.position.y < -bounds.y) {
        sunRef.current.position.y = -bounds.y;
        setVelocity(v => ({ ...v, y: Math.abs(v.y) }));
      }
    }
  });


  return (
    <mesh
      position={[2, -1.4, 0]}
      scale={[0.09, 0.09, 0.09]}
      ref={sunRef}
      {...bind()}
    >
      <primitive object={scene} />
    </mesh>
  );
}

export default Sun;