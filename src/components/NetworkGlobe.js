import React, {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls.js';
import {geoEquirectangular, geoGraticule10, geoPath, geoCentroid, geoArea} from 'd3-geo';
import {feature} from 'topojson-client';
import worldAtlas from 'world-atlas/countries-50m.json';
import styles from './NetworkGlobe.module.css';

const radius = 1.42;
const routePairs = [['HK', 'US'], ['HK', 'JP'], ['US', 'JP'], ['HK', 'SG'], ['US', 'SG'], ['HK', 'DE'], ['US', 'DE'], ['HK', 'CA'], ['US', 'CA'], ['HK', 'UK'], ['US', 'UK'], ['CN', 'HK']];

function toGlobePosition([longitude, latitude], distance = radius) {
  const longitudeRadians = THREE.MathUtils.degToRad(longitude);
  const latitudeRadians = THREE.MathUtils.degToRad(latitude);
  const latitudeScale = Math.cos(latitudeRadians);
  return new THREE.Vector3(
    distance * latitudeScale * Math.cos(longitudeRadians),
    distance * Math.sin(latitudeRadians),
    // SphereGeometry UV: east-positive longitude runs toward negative Z.
    -distance * latitudeScale * Math.sin(longitudeRadians),
  );
}

function createWorldTexture() {
  const width = 4096;
  const height = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.fillStyle = '#c7dadd';
  context.fillRect(0, 0, width, height);

  const projection = geoEquirectangular().scale(width / (2 * Math.PI)).translate([width / 2, height / 2]);
  const path = geoPath(projection, context);
  context.beginPath();
  path(feature(worldAtlas, worldAtlas.objects.countries));
  context.fillStyle = '#83aaa7';
  context.fill();
  context.strokeStyle = '#e6efee';
  context.lineWidth = 1.2;
  context.stroke();

  context.beginPath();
  path(geoGraticule10());
  context.strokeStyle = 'rgba(80, 128, 132, 0.24)';
  context.lineWidth = 1;
  context.stroke();

  // Country names are part of the globe texture: rear-side labels stay occluded.
  const labelBoxes = [];
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '500 21px system-ui, sans-serif';
  context.lineJoin = 'round';
  const countries = feature(worldAtlas, worldAtlas.objects.countries).features
    .sort((a, b) => geoArea(b) - geoArea(a));
  countries.forEach((country) => {
    if (geoArea(country) < 0.0008 || country.properties.name === 'Antarctica') return;
    const center = projection(geoCentroid(country));
    if (!center || !center.every(Number.isFinite)) return;
    const name = country.properties.name;
    const textWidth = context.measureText(name).width;
    const box = {x: center[0] - textWidth / 2 - 5, y: center[1] - 13, w: textWidth + 10, h: 26};
    if (labelBoxes.some((b) => box.x < b.x + b.w && box.x + box.w > b.x && box.y < b.y + b.h && box.y + box.h > b.y)) return;
    labelBoxes.push(box);
    context.strokeStyle = 'rgba(230, 239, 238, 0.92)';
    context.lineWidth = 4;
    context.strokeText(name, center[0], center[1]);
    context.fillStyle = '#285b59';
    context.fillText(name, center[0], center[1]);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createAtmosphereMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {glowColor: {value: new THREE.Color('#74c9c3')}},
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewPosition = -viewPosition.xyz;
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewPosition)), 0.0), 3.2);
        gl_FragColor = vec4(glowColor, rim * 0.16);
      }
    `,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
}

function NetworkGlobe({nodes}) {
  const hostRef = useRef(null);
  const controlsRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);



  useEffect(() => {
    const host = hostRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(0, 0, 5.15);
    const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true, powerPreference: 'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = styles.canvas;
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute('aria-label', 'Illustrated DN42 node locations and routes. This is not live traffic or a status map.');
    host.appendChild(renderer.domElement);

    const controls = new TrackballControls(camera, renderer.domElement);
    controls.noPan = true;
    controls.rotateSpeed = 2.5;
    controls.zoomSpeed = 1.0;
    controls.minDistance = 3.5;
    controls.maxDistance = 9;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0;
    controls.keys = [];
    controlsRef.current = controls;
    const stopAutoRotation = () => { isPlayingRef.current = false; setIsPlaying(false); };
    let dragStart = null;
    const onPointerDown = (event) => { dragStart = {x: event.clientX, y: event.clientY}; };
    const onPointerMove = (event) => {
      if (dragStart && Math.hypot(event.clientX - dragStart.x, event.clientY - dragStart.y) > 3) stopAutoRotation();
    };
    const onPointerUp = () => { dragStart = null; };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    renderer.domElement.tabIndex = 0;
    renderer.domElement.setAttribute('aria-label', 'Interactive DN42 globe. Drag to rotate freely; scroll to zoom. Illustrative routes, not live status.');
    const onKeyDown = (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'Home'].includes(event.key)) return;
      event.preventDefault(); stopAutoRotation();
      if (event.key === 'Home') { controls.reset(); globeGroup.rotation.set(0, 0, 0); }
      else if (['+', '=', '-'].includes(event.key)) camera.position.multiplyScalar(event.key === '-' ? 1.1 : 0.9).clampLength(3.5, 9);
      else {
        const axis = new THREE.Vector3(event.key === 'ArrowUp' || event.key === 'ArrowDown' ? 1 : 0, event.key === 'ArrowLeft' || event.key === 'ArrowRight' ? 1 : 0, 0).applyQuaternion(camera.quaternion);
        camera.position.applyAxisAngle(axis, event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? 0.12 : -0.12);
      }
      controls.update();
    };
    renderer.domElement.addEventListener('keydown', onKeyDown);

    const globeGroup = new THREE.Group();
    globeGroup.rotation.y = 0;
    scene.add(globeGroup);
    const resetView = () => { controls.reset(); globeGroup.rotation.set(0, 0, 0); };
    controlsRef.current = {reset: resetView};

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x628b8a, 0.9);
    scene.add(hemisphereLight);
    const keyLight = new THREE.DirectionalLight(0xfff8eb, 2.4);
    keyLight.position.set(-4, 4, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x8fb6bd, 0.55);
    fillLight.position.set(4, -2, 3);
    scene.add(fillLight);

    const worldTexture = createWorldTexture();
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.025, 64, 48),
      createAtmosphereMaterial(),
    );
    globeGroup.add(atmosphere);
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 80, 64),
      new THREE.MeshPhysicalMaterial({
        map: worldTexture,
        roughness: 0.78,
        metalness: 0.02,
        clearcoat: 0.14,
        clearcoatRoughness: 0.78,
      }),
    );
    globeGroup.add(globe);

    const nodeByCode = Object.fromEntries(nodes.map((node) => [node.code, node]));
    const pulseRings = [];
    nodes.forEach((node) => {
      const normal = toGlobePosition(node.coordinates, 1).normalize();
      const markerPosition = normal.clone().multiplyScalar(radius + 0.035);
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 16, 12),
        new THREE.MeshBasicMaterial({color: '#0f766e'}),
      );
      marker.position.copy(markerPosition);
      globeGroup.add(marker);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.062, 0.004, 6, 28),
        new THREE.MeshBasicMaterial({color: '#159487', transparent: true, opacity: 0.55}),
      );
      ring.position.copy(normal.clone().multiplyScalar(radius + 0.036));
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      globeGroup.add(ring);
      pulseRings.push(ring);
    });

    const routes = routePairs.map(([from, to], index) => {
      const start = toGlobePosition(nodeByCode[from].coordinates, radius + 0.025);
      const end = toGlobePosition(nodeByCode[to].coordinates, radius + 0.025);
      const control = start.clone().add(end).normalize().multiplyScalar(radius + 0.34 + (index % 2) * 0.05);
      const curve = new THREE.QuadraticBezierCurve3(start, control, end);
      const line = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 64, 0.0045, 5, false),
        new THREE.MeshBasicMaterial({color: '#36877f', transparent: true, opacity: 0.42, depthWrite: false}),
      );
      globeGroup.add(line);

      const flow = new THREE.Mesh(
        new THREE.SphereGeometry(0.017, 12, 10),
        new THREE.MeshBasicMaterial({color: '#477f93', transparent: true, opacity: 0.38, depthWrite: false}),
      );
      globeGroup.add(flow);
      return {curve, flow, offset: index / routePairs.length};
    });

    let frameId;
    let elapsed = 0;
    let lastTime = 0;
    let width = 0;
    let height = 0;
    const resize = () => {
      const bounds = host.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      width = bounds.width;
      height = bounds.height;
      camera.aspect = width / height;
      controls.handleResize();
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const renderFrame = (time) => {
      frameId = requestAnimationFrame(renderFrame);
      const delta = Math.min((time - lastTime) / 1000 || 0, 0.05);
      lastTime = time;
      if (isPlayingRef.current) {
        elapsed += delta;
        globeGroup.rotation.y += delta * 0.055;
        pulseRings.forEach((ring, index) => {
          const pulse = 1 + (Math.sin(elapsed * 2.2 + index) + 1) * 0.13;
          ring.scale.setScalar(pulse);
          ring.material.opacity = 0.34 + (1 - pulse / 1.26) * 0.8;
        });
        routes.forEach(({curve, flow, offset}) => {
          flow.position.copy(curve.getPoint((elapsed * 0.045 + offset) % 1));
        });
      }
      controls.update();
      if (width && height) renderer.render(scene, camera);
    };
    frameId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      renderer.domElement.removeEventListener('keydown', onKeyDown);
      controls.dispose();
      controlsRef.current = null;
      scene.traverse((object) => {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
        else object.material?.dispose();
      });
      worldTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [nodes]);

  return <div className={styles.globeModule}>
    <div className={styles.globeToolbar}>
      <span>AS4242423777 <i /> {nodes.length} listed locations</span>
      <div className={styles.actions}><button type="button" onClick={() => { controlsRef.current?.reset(); }} aria-label="Reset globe view">Reset view</button>
      <button type="button" onClick={() => { const next = !isPlayingRef.current; isPlayingRef.current = next; setIsPlaying(next); }} aria-pressed={isPlaying} aria-label={isPlaying ? 'Pause globe animation' : 'Resume globe animation'}>
        {isPlaying ? 'Pause' : 'Resume'}
      </button></div>
    </div>
    <div className={styles.globe} ref={hostRef} />
    <div className={styles.locationList} aria-label="Node codes">
      {nodes.map((node) => <span key={node.code}><b>{node.code}</b></span>)}
    </div>
    <p className={styles.globeNote}>Drag to rotate · Scroll or pinch to zoom · Illustrative routes, not live status</p>
  </div>;
}

export default NetworkGlobe;
