import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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

        const skirt = addHologramMesh(new THREE.CapsuleGeometry(1.5, 2.65, 8, 20), darkMaterial);
        skirt.rotation.z = Math.PI / 2;
        skirt.scale.set(1, 0.22, 0.84);
        skirt.position.y = 0.05;

        const hull = addHologramMesh(new THREE.CapsuleGeometry(1.28, 2.25, 7, 18), solidMaterial);
        hull.rotation.z = Math.PI / 2;
        hull.scale.set(1, 0.25, 0.78);
        hull.position.y = 0.48;

        const cabin = addHologramMesh(new THREE.SphereGeometry(1, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.58), glassMaterial);
        cabin.scale.set(1.55, 0.78, 0.9);
        cabin.position.set(0.65, 0.68, 0);

        const nose = addHologramMesh(new THREE.ConeGeometry(0.42, 1.2, 4), solidMaterial);
        nose.rotation.z = -Math.PI / 2;
        nose.rotation.x = Math.PI / 4;
        nose.position.set(2.55, 0.5, 0);
        nose.scale.z = 1.7;

        const fanAssembly = new THREE.Group();
        fanAssembly.position.set(-1.65, 1.55, 0);
        hovercraft.add(fanAssembly);

        const fanRing = addHologramMesh(new THREE.TorusGeometry(1.08, 0.12, 12, 48), solidMaterial, fanAssembly);
        fanRing.rotation.y = Math.PI / 2;

        const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.35, 18), accentMaterial);
        fanHub.rotation.z = Math.PI / 2;
        fanAssembly.add(fanHub);

        const propeller = new THREE.Group();
        fanAssembly.add(propeller);
        for (let index = 0; index < 4; index += 1) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.11, 1.45, 0.25), accentMaterial);
            blade.position.y = 0.45;
            blade.rotation.x = index * Math.PI / 2;
            const bladePivot = new THREE.Group();
            bladePivot.rotation.x = index * Math.PI / 2;
            bladePivot.add(blade);
            propeller.add(bladePivot);
        }

        [-0.82, 0.82].forEach((z) => {
            const support = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.3, 8), solidMaterial);
            support.position.set(-1.65, 0.83, z * 0.7);
            support.rotation.z = -0.18;
            hovercraft.add(support);
        });

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
            propeller.rotation.x = elapsed * 4.8;
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
