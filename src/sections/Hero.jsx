import { Center, Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Component, Suspense, useEffect, useRef, useState } from "react";

const MODEL_URL = `${import.meta.env.BASE_URL}models/tenhun_falling_spaceman_fanart.glb`;

function SpinningShape() {
  const meshRef = useRef(null);

  useFrame((_, delta) => {
    if (!meshRef.current) {
      return;
    }
    meshRef.current.rotation.x += delta * 0.35;
    meshRef.current.rotation.y += delta * 0.55;
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[0.65, 0.22, 180, 24]} />
      <meshStandardMaterial color="#9f4dff" metalness={0.55} roughness={0.25} />
    </mesh>
  );
}

function AstronautModel() {
  const gltf = useGLTF(MODEL_URL);
  return (
    <Center>
      <primitive object={gltf.scene} scale={1.45} position={[0, -0.9, 0]} />
    </Center>
  );
}

function ModelLoader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="rounded-xl border border-white/15 bg-black/50 px-4 py-2 text-xs font-semibold text-cyan-200 backdrop-blur-sm">
        Loading 3D model... {Math.round(progress)}%
      </div>
    </Html>
  );
}

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center px-6 text-center text-sm text-indigo-100/80">
          3D scene failed to initialize on this browser. Your portfolio content is still available
          while we keep improving compatibility.
        </div>
      );
    }

    return this.props.children;
  }
}

export default function Hero() {
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkModelAvailability() {
      try {
        const response = await fetch(MODEL_URL, { method: "HEAD" });
        const size = Number(response.headers.get("content-length") ?? 0);
        if (isMounted) {
          setModelReady(response.ok && size > 0);
        }
      } catch {
        if (isMounted) {
          setModelReady(false);
        }
      }
    }

    checkModelAvailability();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Interactive 3D hero
        </p>
        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          Step 3 complete: loader and camera framing added.
        </h1>
        <p className="mb-8 max-w-xl text-base leading-relaxed text-indigo-200/75">
          The hero now has a proper loading indicator and improved framing controls for your model.
          If the GLB is still empty, it safely falls back to the animated shape.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#projects"
            className="rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg"
          >
            View Projects
          </a>
          <a
            href="#about"
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
          >
            About me
          </a>
        </div>
      </div>

      <div className="h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-950/80 to-fuchsia-950/40 shadow-2xl shadow-fuchsia-900/20 sm:h-[380px]">
        <SceneErrorBoundary>
          <Canvas camera={{ position: [0, 0.25, 3.2], fov: 42 }}>
            <color attach="background" args={["#0c0a16"]} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[2.4, 1.8, 2]} intensity={1.2} color="#7dd3fc" />
            <pointLight position={[-2, -1, 1]} intensity={20} color="#ec4899" />

            <Float speed={1.05} rotationIntensity={0.15} floatIntensity={0.45}>
              <Suspense fallback={<ModelLoader />}>
                {modelReady ? <AstronautModel /> : <SpinningShape />}
              </Suspense>
            </Float>

            <OrbitControls
              enablePan={false}
              enableZoom={false}
              target={[0, -0.2, 0]}
              minPolarAngle={1.0}
              maxPolarAngle={2.15}
              minAzimuthAngle={-0.65}
              maxAzimuthAngle={0.65}
            />
          </Canvas>
        </SceneErrorBoundary>
      </div>
    </section>
  );
}