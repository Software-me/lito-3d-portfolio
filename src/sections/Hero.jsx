import { Center, Html, useGLTF, useProgress } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Component, Suspense, useEffect, useRef, useState } from "react";

const MODEL_URL = `${import.meta.env.BASE_URL}models/tenhun_falling_spaceman_fanart.glb`;

/** Shift scene so the figure reads on the right; headline stays on the left overlay */
const SCENE_SHIFT_X = 1.05;

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

function FallingAstronaut({ children, orbitRef }) {
  const groupRef = useRef(null);
  const fallDoneRef = useRef(false);
  const fallRestYRef = useRef(0);
  /** One-time fall: high → rest height above bottom crop (higher yEnd = stops sooner on screen) */
  const fallDuration = 5.2;
  const yStart = 3.35;
  const yEnd = 0.42;
  /** Gentle bob after the fall so he hovers in frame instead of feeling glued */
  const floatAmp = 0.11;
  const floatPeriodSec = 5;

  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) {
      return;
    }
    const orb = orbitRef.current;
    const t = clock.elapsedTime;

    if (!fallDoneRef.current) {
      const u = Math.min(1, t / fallDuration);
      const eased = u * u;
      const fallY = yStart + (yEnd - yStart) * eased;
      if (u >= 1) {
        fallDoneRef.current = true;
        fallRestYRef.current = yEnd;
      }
      g.position.y = fallY;
      g.position.x = 0;
      const sway = 1 - u;
      g.rotation.z = Math.sin(t * 2.1) * 0.08 * sway + 0.22;
      g.rotation.y = Math.sin(t * 0.68) * 0.05 * sway + orb.azimuth;
      g.rotation.x = Math.sin(t * 0.92) * 0.05 * sway + 0.48 + orb.polar;
      return;
    }

    const hover =
      floatAmp * Math.sin((2 * Math.PI * t) / floatPeriodSec);
    g.position.y = fallRestYRef.current + hover;
    g.position.x = 0;
    g.rotation.z = 0.22;
    g.rotation.y = orb.azimuth;
    g.rotation.x = 0.48 + orb.polar;
  });

  return <group ref={groupRef}>{children}</group>;
}

function AstronautModel() {
  const gltf = useGLTF(MODEL_URL);
  return (
    <Center>
      <group rotation={[Math.PI, 0, 0]}>
        <group rotation={[0, Math.PI, 0]}>
          <group rotation={[0.12, -0.3, 0.06]}>
            <primitive object={gltf.scene} scale={0.88} position={[0, -0.72, 0]} />
          </group>
        </group>
      </group>
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
        <div className="flex h-full min-h-[240px] items-center justify-center px-6 text-center text-sm text-indigo-100/80">
          3D scene failed to initialize on this browser. Your portfolio content is still available
          while we keep improving compatibility.
        </div>
      );
    }

    return this.props.children;
  }
}

/** Pointer px → radians (orbit / swivel) */
const ORBIT_SENS = 0.0075;
/** Pitch limit so drag doesn’t flip through the poles (adjust for more / less tilt) */
const POLAR_LIMIT = Math.PI / 2 - 0.25;

export default function Hero({ base, navItems }) {
  const [modelReady, setModelReady] = useState(false);
  const orbitRef = useRef({ azimuth: 0, polar: 0 });
  const draggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  const onOrbitPointerDown = (e) => {
    draggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onOrbitPointerMove = (e) => {
    if (!draggingRef.current) {
      return;
    }
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    const orb = orbitRef.current;
    /* Horizontal → spin around (yaw), full rotations allowed */
    orb.azimuth -= dx * ORBIT_SENS;
    /* Vertical → tilt (pitch), clamped */
    orb.polar -= dy * ORBIT_SENS;
    orb.polar = Math.max(-POLAR_LIMIT, Math.min(POLAR_LIMIT, orb.polar));
  };

  const onOrbitPointerUp = (e) => {
    draggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* released */
    }
  };

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

  const heroBackdrop = {
    backgroundImage: `linear-gradient(rgba(8, 4, 18, 0.28), rgba(6, 3, 14, 0.42)), url("${base}backgrounds/projects-bg.png")`,
    backgroundSize: "cover",
    /* Anchor to bottom so more ridgeline / mountain shows under the astronaut (cover crops less from below) */
    backgroundPosition: "center bottom",
    backgroundRepeat: "no-repeat",
  };

  return (
    <section
      className="relative isolate w-full overflow-hidden"
      style={heroBackdrop}
      aria-label="Introduction"
    >
      {/* Hit area: drag to orbit / swivel the figure (below nav) */}
      <div
        className="absolute inset-x-0 bottom-0 top-20 z-[5] cursor-grab touch-none active:cursor-grabbing sm:top-24 min-h-[min(88svh,920px)]"
        style={{ touchAction: "none" }}
        onPointerDown={onOrbitPointerDown}
        onPointerMove={onOrbitPointerMove}
        onPointerUp={onOrbitPointerUp}
        onPointerCancel={onOrbitPointerUp}
        role="region"
        aria-label="Drag to rotate and view the astronaut from different angles"
      />

      {/* Full-frame canvas: WebGL clears alpha → page background (planet) shows through everywhere */}
      <div className="pointer-events-none absolute inset-0 z-0 min-h-[min(88svh,920px)]">
        <div className="absolute inset-0">
          <SceneErrorBoundary>
            <Canvas
              className="h-full w-full !bg-transparent"
              camera={{ position: [SCENE_SHIFT_X, 0.12, 3.85], fov: 42 }}
              gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
              onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
              }}
            >
              <ambientLight intensity={0.72} />
              <directionalLight position={[2.2, 2.1, 2.4]} intensity={1.12} color="#8ae8ff" />
              <pointLight position={[-1.8, -0.8, 1.2]} intensity={16} color="#f472b6" />

              <group position={[SCENE_SHIFT_X, 0.05, 0]}>
                <Suspense fallback={<ModelLoader />}>
                  {modelReady ? (
                    <FallingAstronaut orbitRef={orbitRef}>
                      <AstronautModel />
                    </FallingAstronaut>
                  ) : (
                    <FloatPlaceholder />
                  )}
                </Suspense>
              </group>
            </Canvas>
          </SceneErrorBoundary>
        </div>
      </div>

      {/* Left vignette for legibility — does not create a second “panel”; fades into planet */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] min-h-[min(88svh,920px)] bg-gradient-to-r from-[#030412]/92 via-[#030412]/45 to-transparent sm:via-[#030412]/35"
        aria-hidden
      />

      {/* Nav + copy; pointer-events-none so orbit gestures reach the layer below except on links */}
      <div className="pointer-events-none relative z-10 flex min-h-[min(88svh,920px)] flex-col px-5 pb-14 pt-6 sm:px-8 sm:pb-16 sm:pt-8 lg:px-12">
        <nav className="pointer-events-auto relative z-20 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-white/15 pb-5">
          <a
            href={`${base}index.html`}
            className="text-lg font-bold tracking-tight text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.55)]"
          >
            Lito
          </a>
          <ul className="flex flex-wrap items-center gap-6 sm:gap-8 text-sm font-semibold text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]">
            {navItems.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="transition hover:text-aqua">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pointer-events-none grid flex-1 grid-cols-1 items-center gap-10 pt-10 lg:grid-cols-2 lg:gap-8 lg:pt-6">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-medium tracking-wide text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.55)] sm:text-base">
              Hi I&apos;m Lito
            </p>
            <p className="mb-2 text-lg font-medium leading-snug text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.5)] sm:text-xl">
              A Developer Dedicated to Crafting
            </p>
            <h1 className="text-balance font-bold tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)]">
              <span className="hero-secure-swivel block text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
                <span className="hero-secure-gradient">Secure</span>
              </span>
              <span
                className="mt-2 block text-3xl font-semibold text-white/35 sm:text-4xl lg:text-5xl"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}
              >
                Web Solutions
              </span>
            </h1>
          </div>
          {/* Right column: empty; astronaut renders in canvas behind */}
          <div className="hidden min-h-[200px] lg:block" aria-hidden />
        </div>
      </div>
    </section>
  );
}

function FloatPlaceholder() {
  const groupRef = useRef(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }
    groupRef.current.rotation.y = clock.elapsedTime * 0.4;
  });
  return (
    <group ref={groupRef}>
      <SpinningShape />
    </group>
  );
}
