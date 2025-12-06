"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export function AnomalousMatterHero({
  title = "Energy dances along unseen frontiers.",
  subtitle = "LAUNCH SEQUENCE · ANOMALY 1.2",
  description = "This hero blends a generative 3D wireframe form with a cinematic dark layout – ideal for a striking resume or portfolio intro.",
}: HeroProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 600;

    // Scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    mount.appendChild(renderer.domElement);

    // Geometry – high-detail sphere / blob
    const geometry = new THREE.IcosahedronGeometry(1.6, 90);

    // Simple custom "noise-ish" displacement in the vertex shader
    const uniforms = {
      u_time: { value: 0 },
    };

    const vertexShader = `
      uniform float u_time;
      varying vec3 vNormal;

      // simple layered trig noise
      float n3(vec3 p) {
        return sin(p.x) * cos(p.y) * sin(p.z);
      }

      void main() {
        vNormal = normal;

        float t = u_time * 0.6;

        vec3 p = position;
        float d1 = n3(p * 3.5 + t);
        float d2 = n3(p * 6.0 - t * 1.3);
        float d3 = n3(p * 9.0 + t * 0.7);

        float displacement = (d1 * 0.6 + d2 * 0.3 + d3 * 0.1) * 0.45;

        vec3 displaced = position + normal * displacement;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec3 vNormal;

      void main() {
        // subtle directional lighting
        vec3 n = normalize(vNormal);
        float rim = pow(1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 2.5);
        float diff = max(dot(n, normalize(vec3(0.5, 0.8, 1.0))), 0.0);

        float intensity = diff * 0.55 + rim * 1.4;

        vec3 col = vec3(intensity);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      wireframe: true,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0.6, 0.0, 0); // push slightly to the right
    scene.add(mesh);

    // Animation loop
    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      uniforms.u_time.value = elapsed;

      mesh.rotation.y += 0.0025;
      mesh.rotation.x += 0.0012;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || width;
      const h = mount.clientHeight || height;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* BACKGROUND VIGNETTE + GLOW */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,255,255,0.08),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0)_0,_rgba(0,0,0,0)_55%,_rgba(0,0,0,0.94)_100%)]" />

      {/* 3D CANVAS MOUNT */}
      <div
        ref={mountRef}
        className="pointer-events-none absolute inset-0 mx-auto h-full w-full max-w-5xl"
      />

      {/* TEXT CONTENT */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6 text-center md:items-start md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">
            {subtitle}
          </p>

          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>

          <p className="mt-5 max-w-xl text-sm text-zinc-300 md:text-base">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
