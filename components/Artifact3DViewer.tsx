import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage, Html, useProgress } from '@react-three/drei';

// Loader component to show while the 3D model is loading
const Loader = () => {
  const { progress } = useProgress();
  return <Html center className="text-gold font-display text-xl">{Math.round(progress)}% Loaded</Html>;
}

// Model component that loads and displays the GLB/GLTF file
const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  // We can adjust scale, position, rotation of the scene here
  return <primitive object={scene} />;
};

interface Artifact3DViewerProps {
  modelUrl: string;
}

const Artifact3DViewer: React.FC<Artifact3DViewerProps> = ({ modelUrl }) => {
  return (
    <div className="w-full h-full bg-transparent cursor-grab active:cursor-grabbing">
      <Canvas dpr={[1, 2]} camera={{ fov: 45, position: [0, 0, 5] }}>
        <Suspense fallback={<Loader />}>
          {/* Stage provides a nice default environment, lighting, and ground plane */}
          <Stage environment="city" intensity={0.6} shadows={false}>
              <Model url={modelUrl} />
          </Stage>
        </Suspense>
        {/* OrbitControls allow the user to interact with the model */}
        <OrbitControls autoRotate />
      </Canvas>
    </div>
  );
};

export default Artifact3DViewer;