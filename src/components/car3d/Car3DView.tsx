import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import * as THREE from 'three';

import { getLivery } from '../../data/liveries';
import type { Livery } from '../../data/liveries';
import type { CarSettings } from '../../models/types';
import { buildCar, disposeCar } from './buildCar';
import { Canvas } from './canvas';
import { glowHexFor, hexToRgb255 } from './glow';
import { buildStudioEnvironment, radialTexture } from './studio';

/** Where the camera is looking: yaw is the angle around the car, pitch is how high above it. Changed by dragging. */
interface Orbit {
  yaw: number;
  pitch: number;
  dragging: boolean;
  lastTouchAt: number;
  lastX: number;
  lastY: number;
}

const DISTANCE = 9.6;
const TARGET = new THREE.Vector3(0.1, 0.5, 0);
const AUTO_SPIN_RADIANS_PER_SECOND = 0.32;
const IDLE_BEFORE_SPIN_MS = 1800;
const MIN_PITCH = 0.04;
const MAX_PITCH = 0.62;

function Scene({ livery, orbit }: { livery: Livery; orbit: React.MutableRefObject<Orbit> }) {
  const { camera, gl, scene } = useThree();
  const car = useMemo(() => buildCar(livery), [livery]);
  // The floor glow and the rim lights take the car's color (the accent color for very dark paint).
  const glowHex = glowHexFor(livery.primary, livery.secondary);
  const glow = useMemo(() => radialTexture(hexToRgb255(glowHex), 0.75, 1.6), [glowHex]);
  const groundTint = useMemo(() => new THREE.Color(glowHex).multiplyScalar(0.3), [glowHex]);
  const shadow = useMemo(() => radialTexture([0, 0, 0], 0.85, 1.4), []);

  useEffect(() => () => disposeCar(car), [car]);
  useEffect(
    () => () => {
      glow.dispose();
      shadow.dispose();
    },
    [glow, shadow],
  );

  // Reflections for the paint. If the device cannot build them, the lights alone still light the car.
  useEffect(() => {
    const environment = buildStudioEnvironment(gl as unknown as THREE.WebGLRenderer);
    scene.environment = environment;
    scene.environmentIntensity = 0.9;
    return () => {
      environment?.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);

  useFrame((_, delta) => {
    const o = orbit.current;
    if (!o.dragging && Date.now() - o.lastTouchAt > IDLE_BEFORE_SPIN_MS) o.yaw += delta * AUTO_SPIN_RADIANS_PER_SECOND;
    const flat = Math.cos(o.pitch) * DISTANCE;
    camera.position.set(TARGET.x + Math.cos(o.yaw) * flat, TARGET.y + Math.sin(o.pitch) * DISTANCE, TARGET.z + Math.sin(o.yaw) * flat);
    camera.lookAt(TARGET);
  });

  return (
    <>
      <color attach="background" args={['#0b0b0e']} />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#aab4d0', groundTint, 0.6]} />
      <directionalLight position={[5, 7, 4]} intensity={2.2} />
      <pointLight position={[-4, 1.6, -3]} intensity={30} color={glowHex} />
      <pointLight position={[3, 0.4, 3.5]} intensity={6} color="#ffe6dc" />
      {/* bounce from the glowing floor, so the underside is not pitch black */}
      <pointLight position={[0, 0.12, 0]} intensity={5} distance={5} color={glowHex} />

      {/* a soft glow in the car's color and a contact shadow on the floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]} renderOrder={1}>
        <planeGeometry args={[11, 11]} />
        <meshBasicMaterial map={glow} transparent depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} renderOrder={2}>
        <planeGeometry args={[5.6, 2.8]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>

      <primitive object={car} />
    </>
  );
}

/**
 * The car in 3D. Drag to spin and tilt it; it turns slowly by itself when left alone.
 * The Canvas is drawn by WebGL in a browser and by expo-gl on a phone (see canvas.ts and canvas.native.ts).
 */
export function Car3DView({ car, height = 340 }: { car: CarSettings; height?: number }) {
  const livery = getLivery(car.liveryId);
  const orbit = useRef<Orbit>({ yaw: 0.75, pitch: 0.2, dragging: false, lastTouchAt: 0, lastX: 0, lastY: 0 });
  // Development only: lets the camera be set from the browser console when reviewing the model from different angles.
  useEffect(() => {
    if (__DEV__ && typeof window !== 'undefined') (window as unknown as { __carOrbit?: Orbit }).__carOrbit = orbit.current;
  }, []);

  const grant = (e: GestureResponderEvent) => {
    const o = orbit.current;
    o.dragging = true;
    o.lastX = e.nativeEvent.pageX;
    o.lastY = e.nativeEvent.pageY;
  };
  const move = (e: GestureResponderEvent) => {
    const o = orbit.current;
    const { pageX, pageY } = e.nativeEvent;
    o.yaw -= (pageX - o.lastX) * 0.012;
    o.pitch = Math.min(MAX_PITCH, Math.max(MIN_PITCH, o.pitch + (pageY - o.lastY) * 0.006));
    o.lastX = pageX;
    o.lastY = pageY;
  };
  const release = () => {
    orbit.current.dragging = false;
    orbit.current.lastTouchAt = Date.now();
  };

  return (
    <View
      style={[styles.box, { height }]}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={grant}
      onResponderMove={move}
      onResponderRelease={release}
      onResponderTerminate={release}
      accessible
      accessibilityLabel={`3D view of the ${livery.name} car. Drag to rotate.`}
    >
      <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
        <Canvas camera={{ fov: 30, position: [6, 2, 6], near: 0.1, far: 60 }} gl={{ antialias: true }} dpr={[1, 2]}>
          <Scene livery={livery} orbit={orbit} />
        </Canvas>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { width: '100%', backgroundColor: '#0b0b0e', overflow: 'hidden' },
});
