import * as THREE from "three"

// ================================================================================
// Rendered Shadows
// --------------------------------------------------------------------------------
// Enable rendered shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap // THREE.PCFShadowMap (default)

// Shadow map size shoud be carefully considered before increasing as it can result in very large shadow map files
// Try tightening up the shadow's camera first to just directly overseeing the object
// Must be in power of 2, due to mipmapping (scaling down to 1x1)
lightThatCastShadow.shadow.mapSize.height = 512 * 2 // 1024 x 1024
lightThatCastShadow.shadow.mapSize.width = 512 * 2

lightThatCastShadow.shadow.radius = 10 // Shadow radius does not work with THREE.PCFSoftShadowMap

// To not render the shadow camera helper in one line
lightThatCastShadow.visible = false

// DirectionalLight Shadows
// --------------------------------------------------------------------------------
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.castShadow = true

directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.right = 2

directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6

// DirectionalLightCameraHelper is an Orthographic camera
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
)
scene.add(directionalLightCameraHelper)

// SpotLight Shadows
// --------------------------------------------------------------------------------
const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)
spotLight.castShadow = true

spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

// SpotLightCameraHelper is a Perspective camera
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHelper)

// PointLight Shadows
// --------------------------------------------------------------------------------
const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.castShadow = true

pointLight.shadow.mapSize.height = 512 * 2
pointLight.shadow.mapSize.width = 512 * 2

pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

// PointLight shadow's fov should not be changed, as it is setup to capture shadows in every direction of the scene

// PointLightCameraHelper is a collection of many perspective cameras, but it only shows the last one, which points down on the y-axis
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointLightCameraHelper)

// ================================================================================


// ================================================================================
// Baked Shadows
// --------------------------------------------------------------------------------
const textureLoader = new THREE.TextureLoader()

// Static baked shadow, for objects that remain still
const staticBakedShadow = textureLoader.load("/textures/bakedShadow.jpg")
new THREE.MeshBasicMaterial({ map: staticBakedShadow })

// Dynamically animated baked shadow, for objects that move around in the scene.
// This requires the shadow to track the object's position in order to animate itself realistically, such as its opacity and scale
const dynamicBakedShadow = textureLoader.load(
  "/textures/dynamicBakedShadow.jpg"
)
// The object that the dynamic baked shadow will be tracking
const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial()
)
// Baked shadow
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000, // black shadow
    alphaMap: dynamicBakedShadow,
    transparent: true,
  })
)
// On each next frame, the baked shadow follow's the sphere's position, and its opacity is dynamically tracked to the sphere's y position
requestAnimationFrame(() => {
  sphereShadow.position.x = sphere.position.x
  sphereShadow.position.z = sphere.position.z
  sphereShadow.material.opacity = 1 - sphere.position.y + 0.2
})

// ================================================================================
