import { useFocusEffect } from 'expo-router';
import { useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as THREE from 'three';

import type { AeroMode } from '../../data/cars/spec';
import type { EraId } from '../../data/eras';
import { COMPARISON_LIVERIES } from '../../data/liveries';
import { buildCar, disposeCar } from './buildCar';
import { Canvas } from './canvas';
import { buildStudioEnvironment, radialTexture } from './studio';

/** The fixed camera angles for comparing cars. Every car is shown from the same one, at the same distance. */
export type CompareAngle = 'front' | 'side' | 'top' | 'rear';

const ANGLES: Record<CompareAngle, { yaw: number; pitch: number }> = {
  front: { yaw: 0.8, pitch: 0.22 }, // front three-quarter
  side: { yaw: Math.PI / 2, pitch: 0.02 },
  top: { yaw: Math.PI / 2, pitch: 1.45 },
  rear: { yaw: Math.PI, pitch: 0.12 },
};

const FIT_WIDTH = 12.8; // distance times the view's width/height ratio needed to fit a car side-on with some margin
const MIN_DISTANCE = 9;
const TARGET = new THREE.Vector3(0, 0.45, 0); // the middle of the wheelbase, the same for every car
const BACKGROUND = '#202226'; // a neutral grey, the same behind every car

function Scene({ era, angle, aero }: { era: EraId; angle: CompareAngle; aero: AeroMode }) {
  const { camera, gl, scene } = useThree();
  const livery = COMPARISON_LIVERIES[era === 'gen2026' ? 'gen2026' : 'gen2022'];
  const car = useMemo(() => buildCar(livery, { aero }), [livery, aero]);
  const shadow = useMemo(() => radialTexture([0, 0, 0], 0.85, 1.4), []);

  useEffect(() => () => disposeCar(car), [car]);
  useEffect(() => () => shadow.dispose(), [shadow]);
  useEffect(() => {
    const environment = buildStudioEnvironment(gl as unknown as THREE.WebGLRenderer);
    scene.environment = environment;
    scene.environmentIntensity = 0.9;
    return () => {
      environment?.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);

  useFrame((state) => {
    const { yaw, pitch } = ANGLES[angle];
    const aspect = state.size.width / Math.max(1, state.size.height);
    const distance = Math.max(MIN_DISTANCE, FIT_WIDTH / Math.max(0.5, aspect));
    const flat = Math.cos(pitch) * distance;
    camera.position.set(TARGET.x + Math.cos(yaw) * flat, TARGET.y + Math.sin(pitch) * distance, TARGET.z + Math.sin(yaw) * flat);
    camera.lookAt(TARGET);
  });

  return (
    <>
      <color attach="background" args={[BACKGROUND]} />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#aab4d0', '#303338', 0.6]} />
      <directionalLight position={[5, 7, 4]} intensity={2.2} />
      <pointLight position={[-4, 1.6, -3]} intensity={30} color="#ffffff" />
      <pointLight position={[3, 0.4, 3.5]} intensity={6} color="#ffffff" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} renderOrder={2}>
        <planeGeometry args={[6.4, 3.2]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
      <primitive object={car} />
    </>
  );
}

/**
 * One car on a plain grey background from a fixed angle, in team-neutral paint. Used twice, with the same angle and
 * settings, to compare two generations at exactly the same scale and under the same light.
 */
export function CompareView({ era, angle, aero = 'corner', height }: { era: EraId; angle: CompareAngle; aero?: AeroMode; height: number }) {
  const [focused, setFocused] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );
  return (
    <View style={[styles.box, { height }]} accessible accessibilityLabel={`${era === 'gen2026' ? '2026' : '2022'} F1 car, ${angle} view`}>
      <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
        <Canvas camera={{ fov: 30, position: [6, 2, 6], near: 0.1, far: 60 }} gl={{ antialias: true }} dpr={[1, 2]} frameloop={focused ? 'always' : 'never'}>
          <Scene era={era} angle={angle} aero={aero} />
        </Canvas>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { width: '100%', overflow: 'hidden', backgroundColor: BACKGROUND },
});

/** For callers that load this module on demand. */
export function renderCompareView(props: { era: EraId; angle: CompareAngle; aero?: AeroMode; height: number }): React.ReactElement {
  return <CompareView {...props} />;
}
