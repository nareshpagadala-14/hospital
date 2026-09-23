"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MedicalCanvas3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for DNA / Helix Structure
    const dnaGroup = new THREE.Group();
    scene.add(dnaGroup);

    // Materials
    const sphereMaterial1 = new THREE.MeshPhongMaterial({
      color: 0x0284c7, // Sapphire blue
      emissive: 0x0369a1,
      emissiveIntensity: 0.4,
      shininess: 90,
    });

    const sphereMaterial2 = new THREE.MeshPhongMaterial({
      color: 0x0d9488, // Teal
      emissive: 0x0f766e,
      emissiveIntensity: 0.4,
      shininess: 90,
    });

    const barMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
    });

    const sphereGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const numRungs = 24;
    const radius = 3.5;
    const heightStep = 0.55;

    for (let i = 0; i < numRungs; i++) {
      const angle = i * 0.4;
      const y = (i - numRungs / 2) * heightStep;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;

      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      // Sphere 1
      const sphere1 = new THREE.Mesh(sphereGeo, sphereMaterial1);
      sphere1.position.set(x1, y, z1);
      dnaGroup.add(sphere1);

      // Sphere 2
      const sphere2 = new THREE.Mesh(sphereGeo, sphereMaterial2);
      sphere2.position.set(x2, y, z2);
      dnaGroup.add(sphere2);

      // Connecting Bar
      const distance = new THREE.Vector3(x1, y, z1).distanceTo(new THREE.Vector3(x2, y, z2));
      const barGeo = new THREE.CylinderGeometry(0.06, 0.06, distance, 8);
      const bar = new THREE.Mesh(barGeo, barMaterial);

      bar.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
      bar.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(x2 - x1, 0, z2 - z1).normalize()
      );
      dnaGroup.add(bar);
    }

    // Glowing Ambient Particles
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 70;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.18,
      transparent: true,
      opacity: 0.6,
    });
    const particleField = new THREE.Points(particlesGeo, particleMaterial);
    scene.add(particleField);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x0ea5e9, 2.5, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x14b8a6, 2, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
      targetRotationY = mouseX * 0.8;
      targetRotationX = mouseY * 0.4;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle continuous rotation
      dnaGroup.rotation.y += 0.008;
      dnaGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.4;

      // Mouse Parallax Lerp
      dnaGroup.rotation.y += (targetRotationY - dnaGroup.rotation.y) * 0.05;
      dnaGroup.rotation.x += (targetRotationX - dnaGroup.rotation.x) * 0.05;

      particleField.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[380px] lg:min-h-[500px] relative pointer-events-auto"
      aria-label="3D Medical Visualization"
    />
  );
}
