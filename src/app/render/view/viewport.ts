import { PerspectiveCamera, type Scene, SRGBColorSpace, WebGLRenderer } from "three";

export class Viewport {
	public renderer: WebGLRenderer;
	public camera: PerspectiveCamera;
	public observer: ResizeObserver;

	public constructor(width: number, height: number, dpr: number) {
		this.renderer = new WebGLRenderer({
			antialias: true
		});
		this.renderer.shadowMap.enabled = true;
		this.renderer.outputColorSpace = SRGBColorSpace;
		this.camera = new PerspectiveCamera(60, 1, 0.1, 100);
		this.resizeEvent(width, height, dpr);
		this.observer = new ResizeObserver((entries: ResizeObserverEntry[]): void => {
			const entry: ResizeObserverEntry = entries[0];
			const width: number = entry.contentRect.width;
			const height: number = entry.contentRect.height;
			if (width === 0 || height === 0) {
				return;
			}
			this.resizeEvent(width, height, Math.min(window.devicePixelRatio, 2));
		});
		this.observer.observe(this.renderer.domElement);
	}

	public resizeEvent(width: number, height: number, dpr: number): void {
		this.renderer.setPixelRatio(dpr);
		this.renderer.setSize(width, height);
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
	}

	public dispose(): void {
		this.renderer.domElement.remove();
		this.renderer.dispose();
	}

	public render(scene: Scene): void {
		this.renderer.render(scene, this.camera);
	}
}
