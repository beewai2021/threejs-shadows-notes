Last updated: January 22, 2021

# **Three.js Shadows Notes**
- To enable three.js shadows, `renderer.shadowMap.enabled = true` must be set.
- Rendered shadows should be avoided for performance optimization whenever possible. Instead, use baked shadows.
- To create high quality rendered shadows, tighten up the shadow's camera, use `PCFSoftShadowMap` on the renderer's `shadowMap.type`, and/or increase the shadow's `mapSize` (height/width) as a last resort.
- For the best performance and highest quality shadows, combine static baked shadows and dynamically animated baked shadows.

------------

> For each light that casts shadow, during each frame, the light's camera will capture the scene, and calculate the shadow positions by replacing the object's material with `MeshDepthMaterial`, then mapping the capture as a texture into a `shadowMap` image onto the object that receives the shadow. As this calculation happens every frame, it can be very performance costly.

------------


### Lights capable of casting shadows
- `DirectionalLight`
- `SpotLight`
- `PointLight` (most performance heavy, as it renders shadow in every direction)


| Light  | Light Shadow Camera  |
| ------------ | ------------ |
|  DirectionalLight | Orthographic camera  |
|  SpotLight | Perspective Camera  |
|  PointLight | Perspective Camera in every direction, but only shows the last (?) camera which points down on the y-axis  |
