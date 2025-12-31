import { AmbientLight, AxesHelper, Color, DirectionalLight, GridHelper, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import OrbitCameraControl from "./OrbitCameraControl";

export const renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.shadowMap.enabled = true;

export const scene: Scene = new Scene();
scene.background = new Color(0x222222);

export const camera: PerspectiveCamera = new PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 2000);

export const orbit: OrbitCameraControl = new OrbitCameraControl(camera, 0.005, 0.0075);
orbit.setupInput(renderer.domElement);

window.addEventListener("resize", function (): void {
	camera.aspect = innerWidth / innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(innerWidth, innerHeight);
}, false);

scene.add(new AmbientLight(0xffffff, 0.6));

const directionalLight: DirectionalLight = new DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

const gridHelper1 = new GridHelper(3, 3, 0x444444, 0x444444);
gridHelper1.position.y -= 0.5;
scene.add(gridHelper1);

const gridHelper2 = new GridHelper(1, 16, 0x444444, 0x444444);
gridHelper2.position.y -= 0.5;
scene.add(gridHelper2);

const axesHelper = new AxesHelper(0.5);
axesHelper.scale.set(1, 0, 1);
axesHelper.position.y = -0.499;
scene.add(axesHelper);

/** Linear transform gizmo
 * scene.add(new ArrowHelper(new Vector3(0, 0, 0), undefined, 0.5, new Color(0x00FF00), 0.075, 0.075));
 * scene.add(new ArrowHelper(new Vector3(1, 0, 0), undefined, 0.5, new Color(0xFF0000), 0.075, 0.075));
 * scene.add(new ArrowHelper(new Vector3(0, 0, 1), undefined, 0.5, new Color(0x0000FF), 0.075, 0.075));
 */
