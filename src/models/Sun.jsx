/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: 991519166 (https://sketchfab.com/991519166)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/galaxy-dbb2f075329747a09cc8add2ad05acad
Title: Sun
*/
import { useRef, useEffect, useState } from 'react'; // Importing hooks from React
import { useAnimations, useGLTF } from '@react-three/drei'; // Importing specific hooks from Drei, a helper library for react-three-fiber
import { useFrame, useThree } from '@react-three/fiber'; // Importing useFrame from react-three-fiber for animation
import { useDrag } from 'react-use-gesture'; // Importing useDrag from react-use-gesture for drag interactions
import sunScene from '../assets/3d/sun.glb'; // Importing a 3D model of the sun

const Sun = (props) => { // Defining a functional component Sun
  const sunRef = useRef(); // Creating a ref to reference the mesh in the scene
  const { scene, animations } = useGLTF(sunScene); // Loading the GLTF model and extracting the scene and animations
  const { actions } = useAnimations(animations, sunRef); // Setting up animations for the model
  const [velocity, setVelocity] = useState({ x: 0, y: 0, z: 0 }); // State for tracking velocity of the sun
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 }); // State to store the last position (currently unused)
  const [hasBeenDragged, setHasBeenDragged] = useState(false); // State to track if the sun has been dragged
  const { size } = useThree(); // Get the size of the canvas
  const [bounds, setBounds] = useState({ x: 5, y: 5, z: 5 })
  const [stablePosition, setStablePosition] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    actions['Take 001'].play(); // Playing the 'Take 001' animation on mount
  }, []) // Empty dependency array to ensure this effect runs once on mount


  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    let newBounds;
    if (isMobile) {
      newBounds = {
        x: size.width / 50,
        y: size.height / 50,
        z: Math.min(size.width, size.height) / 50
      };
    } else {
      const aspectRatio = size.width / size.height;
      newBounds = {
        x: size.width / 200,
        y: size.height / 200,
        // x: 5 * aspectRatio, // More width, larger x boundary
        // y: 5 / aspectRatio, // More height, larger y boundary
        z: Math.min(size.width, size.height) / 100
      };
    }
    setBounds(newBounds);
  }, [size.width, size.height]);

  
  const bind = useDrag(({ offset: [x, y], lastOffset: [lx, ly], down, event }) => {
    const scaleFactor = 900; // A constant to scale the drag effect
    if (down) {
      // Update position while dragging
      sunRef.current.position.x = stablePosition.x + x / scaleFactor;
      sunRef.current.position.y = stablePosition.y - y / scaleFactor;
      setHasBeenDragged(true);
    } else {
      const newVelocity = {
        x: (x - lx) / scaleFactor,
        y: -(y - ly) / scaleFactor,
        z: 0
      };
      setVelocity(newVelocity);
      setStablePosition({ 
        x: sunRef.current.position.x,
        y: sunRef.current.position.y,
        z: sunRef.current.position.z
      });
      // setHasBeenDragged(false);
    }
    //   // Calculate velocity based on change in position
    //   const newVelocity = {
    //     x: (x - lx) / scaleFactor,
    //     y: -(y - ly) / scaleFactor,
    //     z: 0
    //   };
    //   setVelocity(newVelocity);
    // }
    // // Update last position (unused)
    // setLastPosition({ x, y });
  }, { pointerEvents: true });


  useFrame(({ clock, camera }) => {
    if (!hasBeenDragged) {
      // Define the parameters of the ellipse
      const a = 9; // Semi-major axis for the x-direction
      const b = 0; // Semi-minor axis for the y-direction
      const c = 12; // Semi-axis for the z-direction
      const speed = 0.5; // Speed of movement
      // Calculate the elliptical path
      sunRef.current.position.x = a * Math.cos(speed * clock.elapsedTime);
      sunRef.current.position.y = b * Math.sin(speed * clock.elapsedTime) + 2; // Adjust '+ 3' as needed for vertical offset
      sunRef.current.position.z = c * Math.sin(speed * clock.elapsedTime) - 16;
    }
    // Apply the calculated velocity to the sun's position
    sunRef.current.position.x += velocity.x;
    sunRef.current.position.y += velocity.y;
    sunRef.current.position.z += velocity.z;
    // Apply damping to the velocity to simulate friction
    const dampingFactor = 0.98;
    setVelocity(v => ({
      x: v.x * dampingFactor,
      y: v.y * dampingFactor,
      z: v.z * dampingFactor
    }));
    // Collision detection and bouncing logic
    // let hasBounced = false;
    if (sunRef.current.position.x > bounds.x || sunRef.current.position.x < -bounds.x) {
      setVelocity(v => ({ ...v, x: -v.x }));
      // hasBounced = true;
    }
    if (sunRef.current.position.y > bounds.y || sunRef.current.position.y < -bounds.y) {
      setVelocity(v => ({ ...v, y: -v.y }));
      // hasBounced = true;
    }
    if (sunRef.current.position.z > bounds.z || sunRef.current.position.z < -bounds.z) {
      setVelocity(v => ({ ...v, z: -v.z }));
      // hasBounced = true;
    }

    // Update stable position after bouncing
    // if (hasBounced) {
    //   setStablePosition({
    //     x: sunRef.current.position.x,
    //     y: sunRef.current.position.y,
    //     z: sunRef.current.position.z,
    //   });
    // }
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