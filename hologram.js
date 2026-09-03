import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const stage = document.getElementById('hologramStage');
const canvas = document.getElementById('hovercraftCanvas');
const loading = document.getElementById('hologramLoading');

if (stage && canvas) {
    try {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x06141d, 0.055);

        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
        camera.position.set(8.2, 5.2, 8.4);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;

        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.055;
        controls.enablePan = false;
        controls.minDistance = 7;
        controls.maxDistance = 17;
        controls.minPolarAngle = Math.PI * 0.2;
        controls.maxPolarAngle = Math.PI * 0.72;
        controls.target.set(0, 0.65, 0);
        controls.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        controls.autoRotateSpeed = 0.65;

        scene.add(new THREE.HemisphereLight(0x7defff, 0x071018, 2.2));
        const keyLight = new THREE.PointLight(0x42e8ff, 24, 18);
        keyLight.position.set(3, 6, 5);
        scene.add(keyLight);
        const rimLight = new THREE.PointLight(0xc260ff, 18, 16);
        rimLight.position.set(-5, 3, -4);
        scene.add(rimLight);

        const solidMaterial = new THREE.MeshStandardMaterial({
            color: 0x0b879b,
            emissive: 0x063d4b,
            emissiveIntensity: 1.35,
            metalness: 0.72,
            roughness: 0.24,
            transparent: true,
            opacity: 0.78,
            side: THREE.DoubleSide
        });
        const darkMaterial = new THREE.MeshStandardMaterial({
            color: 0x071c27,
            emissive: 0x052934,
            emissiveIntensity: 0.9,
            metalness: 0.8,
            roughness: 0.3,
            transparent: true,
            opacity: 0.9
        });
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x68e9ff,
            emissive: 0x125a69,
            emissiveIntensity: 1.15,
            metalness: 0.15,
            roughness: 0.08,
            transmission: 0.25,
            transparent: true,
            opacity: 0.58
        });
        const wireMaterial = new THREE.MeshBasicMaterial({
            color: 0x75f2ff,
            wireframe: true,
            transparent: true,
            opacity: 0.34,
            depthWrite: false
        });
        const accentMaterial = new THREE.MeshStandardMaterial({
            color: 0xd466ff,
            emissive: 0x7e22a7,
            emissiveIntensity: 1.7,
            metalness: 0.5,
            roughness: 0.22
        });

        const hovercraft = new THREE.Group();
        hovercraft.rotation.y = -0.35;
        scene.add(hovercraft);

        const addHologramMesh = (geometry, material, parent = hovercraft) => {
            const mesh = new THREE.Mesh(geometry, material);
            const wire = new THREE.Mesh(geometry, wireMaterial);
            wire.scale.setScalar(1.012);
            mesh.add(wire);
            parent.add(mesh);
            return mesh;
        };

        const createHullGeometry = (length, width, height, noseRadius) => {
            const halfLength = length / 2;
            const halfWidth = width / 2;
            const rearRadius = 0.34;
            const shape = new THREE.Shape();
            shape.moveTo(-halfLength, -halfWidth + rearRadius);
            shape.quadraticCurveTo(-halfLength, -halfWidth, -halfLength + rearRadius, -halfWidth);
            shape.lineTo(halfLength - noseRadius, -halfWidth);
            shape.quadraticCurveTo(halfLength, -halfWidth, halfLength, 0);
            shape.quadraticCurveTo(halfLength, halfWidth, halfLength - noseRadius, halfWidth);
            shape.lineTo(-halfLength + rearRadius, halfWidth);
            shape.quadraticCurveTo(-halfLength, halfWidth, -halfLength, halfWidth - rearRadius);
            shape.closePath();
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: height,
                bevelEnabled: true,
                bevelSegments: 3,
                bevelSize: Math.min(0.1, height * 0.2),
                bevelThickness: Math.min(0.08, height * 0.16)
            });
            geometry.rotateX(Math.PI / 2);
            geometry.center();
            return geometry;
        };

        // Low hull with a distinctly rounded front and a flatter rear edge.
        const skirt = addHologramMesh(createHullGeometry(5.5, 3.55, 0.58, 1.45), darkMaterial);
        skirt.position.y = -0.04;

        const deck = addHologramMesh(createHullGeometry(5.18, 3.23, 0.22, 1.32), solidMaterial);
        deck.position.y = 0.36;

        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x249aae,
            emissive: 0x074854,
            emissiveIntensity: 1.25,
            metalness: 0.58,
            roughness: 0.34,
            transparent: true,
            opacity: 0.84
        });
        const panelMaterial = new THREE.MeshStandardMaterial({
            color: 0x07151e,
            emissive: 0x102b36,
            emissiveIntensity: 0.82,
            metalness: 0.3,
            roughness: 0.5,
            transparent: true,
            opacity: 0.92,
            side: THREE.DoubleSide
        });

        const propellers = [];
        const createBlade = (length, width, material) => {
            const shape = new THREE.Shape();
            shape.moveTo(0.02, -width * 0.28);
            shape.quadraticCurveTo(length * 0.46, -width * 0.62, length, -width * 0.22);
            shape.quadraticCurveTo(length * 1.06, width * 0.12, length * 0.72, width * 0.42);
            shape.quadraticCurveTo(length * 0.25, width * 0.36, 0.02, width * 0.2);
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: 0.07,
                bevelEnabled: true,
                bevelSegments: 2,
                bevelSize: 0.025,
                bevelThickness: 0.02
            });
            geometry.center();
            const blade = new THREE.Mesh(geometry, material);
            blade.position.x = length * 0.48;
            return blade;
        };

        // Lift fan: recessed in the front half of the deck and pointing downward.
        const liftFan = new THREE.Group();
        liftFan.position.set(1.12, 0.53, 0);
        hovercraft.add(liftFan);

        const liftDuct = addHologramMesh(new THREE.TorusGeometry(0.92, 0.13, 14, 52), darkMaterial, liftFan);
        liftDuct.rotation.x = Math.PI / 2;
        const liftOpening = new THREE.Mesh(
            new THREE.CircleGeometry(0.79, 48),
            new THREE.MeshBasicMaterial({ color: 0x03141c, transparent: true, opacity: 0.86, side: THREE.DoubleSide })
        );
        liftOpening.rotation.x = -Math.PI / 2;
        liftOpening.position.y = -0.07;
        liftFan.add(liftOpening);

        const liftPropeller = new THREE.Group();
        liftPropeller.position.y = 0.06;
        liftFan.add(liftPropeller);
        for (let index = 0; index < 3; index += 1) {
            const pivot = new THREE.Group();
            pivot.rotation.y = index * Math.PI * 2 / 3;
            const blade = createBlade(0.72, 0.34, accentMaterial);
            blade.rotation.x = Math.PI / 2;
            pivot.add(blade);
            liftPropeller.add(pivot);
        }
        const liftHub = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.25, 18), accentMaterial);
        liftHub.position.y = 0.08;
        liftFan.add(liftHub);
        propellers.push({ group: liftPropeller, axis: 'y', speed: -5.6 });

        // Slim battery tray laid horizontally across the deck.
        const batteryTray = addHologramMesh(new RoundedBoxGeometry(0.72, 0.2, 1.46, 4, 0.08), panelMaterial);
        batteryTray.position.set(-0.2, 0.57, 0);
        const batteryRim = addHologramMesh(new RoundedBoxGeometry(0.84, 0.07, 1.58, 3, 0.045), frameMaterial);
        batteryRim.position.set(-0.2, 0.48, 0);

        // Foam-style rear frame holding one propulsion fan aimed behind the craft.
        const rearFrame = new THREE.Group();
        rearFrame.position.x = -1.55;
        hovercraft.add(rearFrame);
        const leftPost = addHologramMesh(new RoundedBoxGeometry(0.34, 2.12, 0.38, 3, 0.08), frameMaterial, rearFrame);
        leftPost.position.set(0, 1.46, -1.02);
        const rightPost = addHologramMesh(new RoundedBoxGeometry(0.34, 2.12, 0.38, 3, 0.08), frameMaterial, rearFrame);
        rightPost.position.set(0, 1.46, 1.02);
        const topBeam = addHologramMesh(new RoundedBoxGeometry(0.34, 0.38, 2.42, 3, 0.08), frameMaterial, rearFrame);
        topBeam.position.set(0, 2.42, 0);

        const rearFan = new THREE.Group();
        rearFan.position.set(0.08, 1.5, 0);
        rearFrame.add(rearFan);
        const rearDuct = addHologramMesh(new THREE.TorusGeometry(0.74, 0.1, 14, 52), solidMaterial, rearFan);
        rearDuct.rotation.y = Math.PI / 2;
        const rearHub = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.36, 18), accentMaterial);
        rearHub.rotation.z = Math.PI / 2;
        rearFan.add(rearHub);

        const rearPropeller = new THREE.Group();
        rearFan.add(rearPropeller);
        for (let index = 0; index < 3; index += 1) {
            const pivot = new THREE.Group();
            pivot.rotation.x = index * Math.PI * 2 / 3;
            const blade = createBlade(0.64, 0.31, accentMaterial);
            blade.rotation.y = Math.PI / 2;
            pivot.add(blade);
            rearPropeller.add(pivot);
        }
        propellers.push({ group: rearPropeller, axis: 'x', speed: 6.2 });

        // Rudder canvas projects backwards like a flag behind the propulsion fan.
        const rudderPivot = new THREE.Group();
        rudderPivot.position.set(-1.96, 1.45, 0.46);
        hovercraft.add(rudderPivot);
        const rudderHinge = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.75, 12), accentMaterial);
        rudderPivot.add(rudderHinge);
        const rudder = addHologramMesh(new RoundedBoxGeometry(1.28, 1.7, 0.1, 3, 0.04), panelMaterial, rudderPivot);
        rudder.position.x = -0.64;

        const servo = addHologramMesh(new RoundedBoxGeometry(0.42, 0.3, 0.34, 3, 0.06), darkMaterial);
        servo.position.set(-1.55, 0.62, 1.13);
        const servoArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.07, 0.52), accentMaterial);
        servoArm.position.set(-1.55, 0.79, 0.93);
        hovercraft.add(servoArm);

        const linkageStart = new THREE.Vector3(-1.55, 0.79, 1.17);
        const linkageEnd = new THREE.Vector3(-1.96, 0.92, 0.48);
        const linkageDirection = new THREE.Vector3().subVectors(linkageEnd, linkageStart);
        const linkage = new THREE.Mesh(
            new THREE.CylinderGeometry(0.025, 0.025, linkageDirection.length(), 10),
            accentMaterial
        );
        linkage.position.copy(linkageStart).add(linkageEnd).multiplyScalar(0.5);
        linkage.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), linkageDirection.clone().normalize());
        hovercraft.add(linkage);

        const platformMaterial = new THREE.MeshBasicMaterial({ color: 0x28ddf1, transparent: true, opacity: 0.42 });
        [2.5, 3.15, 3.8].forEach((radius, index) => {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.018, 6, 96), platformMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = -0.76 - index * 0.025;
            scene.add(ring);
        });

        const grid = new THREE.GridHelper(18, 30, 0x24d7e8, 0x104b58);
        grid.position.y = -0.82;
        grid.material.transparent = true;
        grid.material.opacity = 0.22;
        scene.add(grid);

        const particleCount = 170;
        const particlePositions = new Float32Array(particleCount * 3);
        for (let index = 0; index < particleCount; index += 1) {
            const radius = 3.4 + Math.random() * 4.8;
            const angle = Math.random() * Math.PI * 2;
            particlePositions[index * 3] = Math.cos(angle) * radius;
            particlePositions[index * 3 + 1] = -0.6 + Math.random() * 5.8;
            particlePositions[index * 3 + 2] = Math.sin(angle) * radius;
        }
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({
            color: 0x66efff,
            size: 0.035,
            transparent: true,
            opacity: 0.72,
            depthWrite: false
        }));
        scene.add(particles);

        const resize = () => {
            const { width, height } = stage.getBoundingClientRect();
            if (!width || !height) return;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(stage);
        resize();

        let isVisible = true;
        const visibilityObserver = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
        }, { rootMargin: '150px' });
        visibilityObserver.observe(stage);

        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);
            if (!isVisible || document.hidden) return;
            const elapsed = clock.getElapsedTime();
            hovercraft.position.y = Math.sin(elapsed * 1.25) * 0.08;
            hovercraft.rotation.z = Math.sin(elapsed * 0.62) * 0.018;
            propellers.forEach(({ group, axis, speed }) => {
                group.rotation[axis] = elapsed * speed;
            });
            rudderPivot.rotation.y = Math.sin(elapsed * 0.72) * 0.18;
            particles.rotation.y = elapsed * 0.025;
            controls.update();
            renderer.render(scene, camera);
        };

        loading?.classList.add('is-hidden');
        animate();
    } catch (error) {
        console.error('Unable to initialize the hovercraft hologram:', error);
        if (loading) loading.textContent = '3D preview is unavailable on this device.';
    }
}
