import React, { useRef, useContext,useState,useEffect } from "react";
import Link from "next/link";
import { Canvas, useLoader, useFrame } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

import Loader from "@/pages/Loading";
import { useRouter } from "next/router";
const FurnitureModel = () => {
  
  const ref = useRef();
  const model = useLoader(OBJLoader, "fb.obj");
  const material = useLoader(MTLLoader, "fb.mtl");
  model.material = material;
  

  useFrame(() => {
    ref.current.rotation.y += 0.01;
    
  });

  return (
    <mesh ref={ref}>
      
      <primitive object={model} material={material} />
    </mesh>
  );
};

const ThreeScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5] }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.3} />
      <fog attach="fog" args={["#f0f0f0", 5, 15]} />
      <OrbitControls />
      <FurnitureModel />
    </Canvas>
  );
};

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.events]);

  if(router.isFallback) {
    return <Loader />
  }

  if(isLoading) {
    return <Loader />
  }


  return (
    <div className="pt-16">
      <header className="relative h-96">
        <ThreeScene />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-5xl font-bold mb-8">Welcome to boggy dev</h1>
            <p className="text-2xl mb-12">
              Discover stylish and affordable furniture for your home.
            </p>
            <button
              className="px-10 py-4 bg-yellow-500 text-white font-semibold rounded-full hover:bg-yellow-600"
              onClick={() =>location.href = "/Products"}
            >
              Shop Now
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
