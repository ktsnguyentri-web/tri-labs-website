---
title: "Spark 3DGS — Realtime Gaussian Splatting WebGL"
date: "March 20, 2026"
excerpt: "A lightweight WebGL 2.0 spatial renderer streaming 3D Gaussian Splats directly in the browser at 60 FPS."
img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
featured: true
slug: "spark-3dgs-viewer"
category: "Tool"
---

## Overview
Spark 3DGS is an experimental client-side spatial renderer designed for real-time architectural walkthroughs. By utilizing WebGL 2.0 compute passes and custom radix sort shaders, it streams dense 3D Gaussian Splatting models with sub-millimeter geometric fidelity on mobile and desktop browsers.

## Technical Specifications
- **Progressive LOD Octree**: Spatial chunking to stream multi-gigabyte point clouds under constrained network bandwidth.
- **Custom Tile Sorting**: GPU-accelerated radix sort maintaining steady 60 FPS rendering on modern laptops.
- **Architectural Camera Controls**: First-person walkthrough, orbital BIM section cuts, and orthographic dimension overlays.
