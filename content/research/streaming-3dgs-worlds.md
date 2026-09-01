---
title: "Streaming 3DGS Worlds on the Modern Web"
date: "April 14, 2026"
excerpt: "A technical deep dive into Level-of-Detail octrees and radix sorting for real-time 3D Gaussian Splatting in the browser."
img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop"
featured: true
slug: "streaming-3dgs-worlds"
category: "Research"
---

## Introduction
3D Gaussian Splatting (3DGS) has rapidly become the dominant representation for photorealistic radiance fields. However, bringing multi-million splat scenes to browser-based architectural viewers poses significant challenges in memory footprint and bandwidth.

## Spatial Chunking & LOD
To stream massive urban captures efficiently, we partition the global splat dataset into hierarchical bounding octrees. The client dynamically requests splat clusters based on screen-space projected area and camera frustum intersection.

## WebGL 2.0 & WebGPU Considerations
By offloading radix sort directly to compute shaders and binding compact 16-bit half-float buffers, we achieve smooth 60 FPS rendering across standard consumer hardware without requiring native client installations.
