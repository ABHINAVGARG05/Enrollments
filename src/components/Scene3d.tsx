import React, { lazy, Suspense, memo } from "react";
import { Canvas } from "@react-three/fiber";

const Experience = lazy(() => import("../component3d/Experience"));
const Interface = lazy(() => import("../component3d/Interface"));

const Scene3d: React.FC = memo(() => {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="w-full h-[80%]">
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [1, 0.5, 17.5], fov: 30 }}
            shadows
            dpr={[1, 1.5]}
            performance={{ min: 0.5 }}
            gl={{ antialias: true, powerPreference: "high-performance" }}
          >
            <Experience />
          </Canvas>
        </Suspense>
      </div>
      <div className="w-full h-[20%] flex justify-center">
        <Suspense fallback={null}>
          <Interface />
        </Suspense>
      </div>
    </div>
  );
});

Scene3d.displayName = "Scene3d";

export default Scene3d;