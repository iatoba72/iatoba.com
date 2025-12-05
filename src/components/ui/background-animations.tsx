"use client"

import * as React from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Points, PointMaterial, Line, Float as FloatDrei, Environment, Lightformer } from "@react-three/drei"

import * as THREE from "three"
import { useTheme } from "next-themes"
import { useDeviceTilt } from "@/hooks/useDeviceTilt"

type AnimationType = "classic" | "construct" | "cityflight"

interface BackgroundAnimationsProps {
    type?: AnimationType
}

export function BackgroundAnimations({ type = "classic" }: BackgroundAnimationsProps) {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    // Get device tilt data for mobile interaction
    const { tiltX, tiltY, isMobile } = useDeviceTilt()

    const [eventSource, setEventSource] = React.useState<HTMLElement | null>(null)

    React.useEffect(() => {
        setEventSource(document.body)
    }, [])

    return (
        <div className="absolute inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
            <Canvas camera={{ position: [0, 0, 4] }} eventSource={eventSource as HTMLElement} eventPrefix="client">
                {/* Lighting is essential for solid meshes */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <hemisphereLight intensity={0.5} color="#ffffff" groundColor="#000000" />

                <React.Suspense fallback={null}>
                    {type === "classic" && <ClassicParticles isDark={isDark} tiltX={tiltX} tiltY={tiltY} isMobile={isMobile} />}
                    {type === "construct" && <ConstructScene isDark={isDark} tiltX={tiltX} tiltY={tiltY} isMobile={isMobile} />}
                    {type === "cityflight" && <CityFlightScene isDark={isDark} tiltX={tiltX} tiltY={tiltY} isMobile={isMobile} />}
                </React.Suspense>
            </Canvas>
        </div>
    )
}

function ResetScene() {
    const { camera, scene } = useThree()
    React.useEffect(() => {
        camera.position.set(0, 0, 4)
        camera.rotation.set(0, 0, 0)
        scene.fog = null
        // We don't reset background here as it might be handled by the parent or theme
    }, [camera, scene])
    return null
}

function ClassicParticles({ isDark, tiltX, tiltY, isMobile }: { isDark: boolean, tiltX: number, tiltY: number, isMobile: boolean }) {
    const ref = React.useRef<THREE.Points>(null!)

    // Custom sphere generation to avoid NaN issues from external library
    const [sphere] = React.useState(() => {
        const count = 5000;
        const radius = 7;
        const points = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = Math.cbrt(Math.random()) * radius;
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            points[i * 3] = x;
            points[i * 3 + 1] = y;
            points[i * 3 + 2] = z;
        }
        return points;
    })

    useFrame((state, delta) => {
        if (!ref.current) return
        // Use tilt data if on mobile and tilting, otherwise use mouse pointer
        const effectiveX = (isMobile && tiltX !== 0) ? tiltX : (state.pointer.x || 0)
        const speedMultiplier = 1 + effectiveX * 2
        ref.current.rotation.x -= (delta / 10) * speedMultiplier
        ref.current.rotation.y -= (delta / 15) * speedMultiplier
    })

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <ResetScene />
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={isDark ? "#ffffff" : "#000000"}
                    size={0.016}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    )
}

function ConstructScene({ isDark, tiltX, tiltY, isMobile }: { isDark: boolean, tiltX: number, tiltY: number, isMobile: boolean }) {
    const meshRef = React.useRef<THREE.InstancedMesh>(null!)
    const dummy = React.useMemo(() => new THREE.Object3D(), [])

    // Cube Sphere Configuration
    const segments = 14 // 14x14 grid per face
    const count = 6 * segments * segments // 1176 tiles

    // Target Shape: Cube Sphere (Perfect Quad Tiling)
    const [targets] = React.useState(() => {
        const positions: THREE.Vector3[] = []
        const rotations: THREE.Euler[] = []
        const radius = 0.8
        const dummyObj = new THREE.Object3D()

        // Helper to add a tile
        const addTile = (u: number, v: number, faceIdx: number) => {
            // Convert u,v (0..1) to range (-1..1)
            const x = (u * 2) - 1
            const y = (v * 2) - 1

            const pos = new THREE.Vector3()

            // Map based on face
            // 0: +x, 1: -x, 2: +y, 3: -y, 4: +z, 5: -z
            switch (faceIdx) {
                case 0: pos.set(1, y, -x); break
                case 1: pos.set(-1, y, x); break
                case 2: pos.set(x, 1, -y); break
                case 3: pos.set(x, -1, y); break
                case 4: pos.set(x, y, 1); break
                case 5: pos.set(-x, y, -1); break
            }

            // Project to sphere
            pos.normalize().multiplyScalar(radius)
            positions.push(pos)

            // Align rotation to face outwards
            dummyObj.position.copy(pos)
            dummyObj.lookAt(pos.clone().multiplyScalar(2)) // Look outwards from center
            rotations.push(dummyObj.rotation.clone())
        }

        // Generate tiles for all 6 faces
        for (let f = 0; f < 6; f++) {
            for (let i = 0; i < segments; i++) {
                for (let j = 0; j < segments; j++) {
                    // Center of the tile
                    const u = (i + 0.5) / segments
                    const v = (j + 0.5) / segments
                    addTile(u, v, f)
                }
            }
        }
        return { positions, rotations }
    })

    // Random Start Positions (Chaos)
    const [starts] = React.useState(() => {
        const positions: THREE.Vector3[] = []
        const rotations: THREE.Euler[] = []
        for (let i = 0; i < count; i++) {
            positions.push(new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10))
            rotations.push(new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI))
        }
        return { positions, rotations }
    })

    useFrame((state) => {
        if (!meshRef.current) return

        // Use tilt data if on mobile and tilting, otherwise use mouse pointer
        // Control: -1 (Left/Tilt Left) = Chaos, 1 (Right/Tilt Right) = Order
        const effectiveX = (isMobile && tiltX !== 0) ? tiltX : (state.pointer.x || 0)
        // Map effectiveX (-1 to 1) to progress (0 to 1)
        const targetProgress = THREE.MathUtils.clamp((effectiveX + 1) / 2, 0, 1)

        const time = state.clock.getElapsedTime()

        for (let i = 0; i < count; i++) {
            // Per-instance delay for "wave" effect
            const delay = (i / count) * 0.5
            const progress = THREE.MathUtils.clamp(targetProgress * 1.5 - delay, 0, 1)

            // Cubic ease out for "snap" feel
            const ease = 1 - Math.pow(1 - progress, 3)

            // Interpolate position
            const pos = new THREE.Vector3().lerpVectors(starts.positions[i], targets.positions[i], ease)


            // Interpolate rotation
            const rotStart = new THREE.Quaternion().setFromEuler(starts.rotations[i])
            const rotEnd = new THREE.Quaternion().setFromEuler(targets.rotations[i])

            // Slerp rotation
            const rot = new THREE.Quaternion().slerpQuaternions(rotStart, rotEnd, ease)
            dummy.position.copy(pos)
            dummy.rotation.setFromQuaternion(rot)

            // Scale up as they assemble
            // Adjusted for perfect tiling (Cube Sphere)
            // Radius 0.8, 14 segments.
            // Arc length approx (PI * 0.8) / 2 / 14 ~ 0.09
            // But at corners it's smaller.
            // 0.14 seems safe to cover gaps.
            const scale = 0.02 + ease * 0.14
            dummy.scale.set(scale, scale, 0.02) // Flatten the cube into a tile (z scale small)

            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        }
        meshRef.current.instanceMatrix.needsUpdate = true

        // Rotate entire group slowly
        meshRef.current.rotation.y = time * 0.1
    })

    return (
        <group>
            {/* Background Color to ensure "void" reflections are grey, not black */}
            <color attach="background" args={['#1a1a1a']} />

            {/* Synthetic Environment to avoid 429 errors from external HDRIs */}
            <Environment resolution={512}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                    {/* Massive Background Light for base reflection */}
                    <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />

                    {/* Top & Bottom - White Studio Lights */}
                    <Lightformer intensity={5} rotation-x={Math.PI / 2} position={[0, 10, 0]} scale={[10, 10, 1]} />
                    <Lightformer intensity={5} rotation-x={-Math.PI / 2} position={[0, -10, 0]} scale={[10, 10, 1]} />

                    {/* Sides - White Studio Lights */}
                    <Lightformer intensity={5} rotation-y={Math.PI / 2} position={[-10, 0, 0]} scale={[10, 10, 1]} />
                    <Lightformer intensity={5} rotation-y={-Math.PI / 2} position={[10, 0, 0]} scale={[10, 10, 1]} />

                    {/* Diagonals / Rings for complexity - Pure White */}
                    <Lightformer type="ring" intensity={10} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={10} />
                    <Lightformer type="ring" intensity={5} rotation-y={0} position={[0, 0, -5]} scale={10} />

                    {/* Random scattered lights for "sparkle" - Pure White */}
                    <Lightformer intensity={8} rotation-y={Math.PI / 4} position={[5, 5, -5]} scale={[2, 2, 1]} />
                    <Lightformer intensity={8} rotation-y={-Math.PI / 4} position={[-5, 5, -5]} scale={[2, 2, 1]} />
                    <Lightformer intensity={8} rotation-y={Math.PI / 4} position={[5, -5, -5]} scale={[2, 2, 1]} />
                    <Lightformer intensity={8} rotation-y={-Math.PI / 4} position={[-5, -5, -5]} scale={[2, 2, 1]} />
                </group>
            </Environment>

            {/* Direct Light for specular highlights - Pure White, Tripled Sources */}
            <pointLight position={[10, 10, 10]} intensity={3} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={3} color="#ffffff" />
            <pointLight position={[10, -10, 10]} intensity={3} color="#ffffff" />
            <pointLight position={[-10, 10, -10]} intensity={3} color="#ffffff" />

            <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
                <ResetScene />
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color={isDark ? "#333333" : "#aaaaaa"}
                    metalness={0.8}
                    roughness={0.2}
                    flatShading={true}
                />
            </instancedMesh>
        </group>
    )
}

function CityFlightScene({ isDark, tiltX, tiltY, isMobile }: { isDark: boolean, tiltX: number, tiltY: number, isMobile: boolean }) {
    const spheresRef = React.useRef<THREE.InstancedMesh>(null!)
    const sticksRef = React.useRef<THREE.InstancedMesh>(null!)
    const groupRef = React.useRef<THREE.Group>(null!)
    const gridRef = React.useRef<THREE.GridHelper>(null!)

    // Configuration
    const buildingCount = 120 // Doubled density
    const rowSpacing = 100 // Increased spacing for further generation
    const corridorWidth = 50 // Wider corridor

    // State for camera movement
    const speed = 80 // Doubled speed
    const lateralSpeed = 60
    const cameraZ = React.useRef(0)
    const cameraX = React.useRef(0)

    // Generate City Layout
    const cityData = React.useRef<{
        buildings: {
            x: number,
            z: number,
            width: number,
            depth: number,
            height: number,
            color: THREE.Color,
            nodes: THREE.Vector3[]
        }[],
        sphereInstances: { buildingIndex: number, localPos: THREE.Vector3 }[],
        stickInstances: { buildingIndex: number, start: THREE.Vector3, end: THREE.Vector3 }[]
    } | null>(null)

    // Initialize Data
    React.useMemo(() => {
        const buildings = []
        const sphereInstances: { buildingIndex: number, localPos: THREE.Vector3 }[] = []
        const stickInstances: { buildingIndex: number, start: THREE.Vector3, end: THREE.Vector3 }[] = []

        for (let i = 0; i < buildingCount; i++) {
            // Initial Generation: Spread evenly over 2000 units
            const z = -Math.random() * 2000

            // Corridor Logic
            const side = Math.random() > 0.5 ? 1 : -1
            const offset = corridorWidth + Math.random() * 300 // Wider spread
            const x = side * offset

            const height = 100 + Math.random() * 300 // Taller buildings
            const isMega = Math.random() > 0.95
            const finalHeight = isMega ? 500 + Math.random() * 500 : height
            const width = 20 + Math.random() * 15
            const depth = 20 + Math.random() * 15

            const building = {
                x,
                z,
                width,
                depth,
                height: finalHeight,
                color: new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.5),
                nodes: [] as THREE.Vector3[]
            }

            // Generate Nodes & Floors
            const halfW = width / 2
            const halfD = depth / 2
            const floorHeight = 15 + Math.random() * 10
            const floors = Math.floor(finalHeight / floorHeight)

            for (let f = 0; f <= floors; f++) {
                const y = f * floorHeight
                if (y > finalHeight) break

                const floorNodes = [
                    new THREE.Vector3(-halfW, y, -halfD),
                    new THREE.Vector3(halfW, y, -halfD),
                    new THREE.Vector3(halfW, y, halfD),
                    new THREE.Vector3(-halfW, y, halfD)
                ]

                const baseIdx = building.nodes.length
                floorNodes.forEach(n => {
                    building.nodes.push(n)
                    sphereInstances.push({ buildingIndex: i, localPos: n })
                })

                stickInstances.push({ buildingIndex: i, start: floorNodes[0], end: floorNodes[1] })
                stickInstances.push({ buildingIndex: i, start: floorNodes[1], end: floorNodes[2] })
                stickInstances.push({ buildingIndex: i, start: floorNodes[2], end: floorNodes[3] })
                stickInstances.push({ buildingIndex: i, start: floorNodes[3], end: floorNodes[0] })

                if (f > 0) {
                    const prevBaseIdx = baseIdx - 4
                    stickInstances.push({ buildingIndex: i, start: building.nodes[prevBaseIdx], end: building.nodes[baseIdx] })
                    stickInstances.push({ buildingIndex: i, start: building.nodes[prevBaseIdx + 1], end: building.nodes[baseIdx + 1] })
                    stickInstances.push({ buildingIndex: i, start: building.nodes[prevBaseIdx + 2], end: building.nodes[baseIdx + 2] })
                    stickInstances.push({ buildingIndex: i, start: building.nodes[prevBaseIdx + 3], end: building.nodes[baseIdx + 3] })
                }
            }

            buildings.push(building)
        }

        cityData.current = { buildings, sphereInstances, stickInstances }
    }, [])

    useFrame((state, delta) => {
        if (!spheresRef.current || !sticksRef.current || !cityData.current) return

        cameraZ.current -= speed * delta
        state.camera.position.z = cameraZ.current
        state.camera.position.y = 40 // Higher camera

        // Use tilt data if on mobile and tilting, otherwise use mouse pointer
        const inputX = (isMobile && tiltX !== 0) ? tiltX : state.pointer.x
        cameraX.current += inputX * lateralSpeed * delta

        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, cameraX.current, 0.1)
        state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, -inputX * 0.25, 0.1)

        // Update Grid Position to simulate infinite ground
        if (gridRef.current) {
            // Move grid with camera but snap to grid size to look infinite
            const gridSize = 40 // Matches gridHelper divisions/size ratio (10000/250 = 40)
            gridRef.current.position.z = cameraZ.current - (cameraZ.current % gridSize)
            // gridRef.current.position.x = cameraX.current - (cameraX.current % gridSize) // Disabled lateral movement
        }

        const dummy = new THREE.Object3D()
        const p1 = new THREE.Vector3()
        const p2 = new THREE.Vector3()
        const up = new THREE.Vector3(0, 1, 0)

        // Recycling
        cityData.current.buildings.forEach((building) => {
            const isBehind = building.z > cameraZ.current + 10
            const isOutOfView = Math.abs(building.x - cameraX.current) > 400

            if (isBehind || isOutOfView) {
                // Recycle: Place further ahead to maintain consistent density
                building.z = cameraZ.current - 1000 - Math.random() * 1000

                const side = Math.random() > 0.5 ? 1 : -1
                const offset = corridorWidth + Math.random() * 300
                building.x = cameraX.current + side * offset
            }
        })

        // Update Spheres
        cityData.current.sphereInstances.forEach((instance, idx) => {
            const building = cityData.current!.buildings[instance.buildingIndex]

            dummy.position.set(
                building.x + instance.localPos.x,
                instance.localPos.y,
                building.z + instance.localPos.z
            )
            dummy.scale.setScalar(1)
            dummy.rotation.set(0, 0, 0)
            dummy.updateMatrix()
            spheresRef.current.setMatrixAt(idx, dummy.matrix)
        })

        // Update Sticks
        cityData.current.stickInstances.forEach((instance, idx) => {
            const building = cityData.current!.buildings[instance.buildingIndex]

            p1.set(
                building.x + instance.start.x,
                instance.start.y,
                building.z + instance.start.z
            )
            p2.set(
                building.x + instance.end.x,
                instance.end.y,
                building.z + instance.end.z
            )

            dummy.position.copy(p1).add(p2).multiplyScalar(0.5)

            const dir = new THREE.Vector3().subVectors(p2, p1).normalize()
            dummy.quaternion.setFromUnitVectors(up, dir)

            const len = p1.distanceTo(p2)
            dummy.scale.set(1, len, 1)

            dummy.updateMatrix()
            sticksRef.current.setMatrixAt(idx, dummy.matrix)
        })

        spheresRef.current.instanceMatrix.needsUpdate = true
        sticksRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <group ref={groupRef}>
            <fogExp2 attach="fog" args={['#050510', 0.002]} />
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 20, 0]} intensity={1} distance={50} color="#00ffff" />

            {/* Infinite Ground Grid */}
            <gridHelper
                ref={gridRef}
                args={[10000, 250, isDark ? 0x555555 : 0x555555, isDark ? 0x222222 : 0x888888]}
                position={[0, -1, 0]}
            />

            <instancedMesh ref={spheresRef} args={[undefined, undefined, cityData.current?.sphereInstances.length || 0]} frustumCulled={false}>
                <sphereGeometry args={[0.4, 8, 8]} />
                <meshBasicMaterial color="#00ffff" />
            </instancedMesh>

            <instancedMesh ref={sticksRef} args={[undefined, undefined, cityData.current?.stickInstances.length || 0]} frustumCulled={false}>
                <cylinderGeometry args={[0.3, 0.3, 1, 6]} />
                <meshBasicMaterial color="#ff00ff" transparent opacity={0.6} />
            </instancedMesh>
        </group>
    )
}
