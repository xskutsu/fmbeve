import { PerspectiveCamera, type Scene, SRGBColorSpace, WebGLRenderer } from "three";

export class Viewport {
	public container: HTMLElement;
	public renderer: WebGLRenderer;
	public camera: PerspectiveCamera;
	public observer: ResizeObserver;
	public onresize: (() => void) | null;

	public constructor(container: HTMLElement) {
		this.container = container;
		this.renderer = new WebGLRenderer({
			antialias: true
		});
		this.renderer.shadowMap.enabled = true;
		this.renderer.outputColorSpace = SRGBColorSpace;
		this.renderer.domElement.style.width = "100%";
		this.renderer.domElement.style.height = "100%";
		this.renderer.domElement.style.display = "block";
		this.container.appendChild(this.renderer.domElement);
		this.camera = new PerspectiveCamera(60, 1, 0.1, 200);
		this.observer = new ResizeObserver(this._containerResizeEvent.bind(this));
		this.observer.observe(this.container);
		this.onresize = null;
		const rect: DOMRect = this.container.getBoundingClientRect();
		this._updateDimensions(rect.width, rect.height, Math.min(devicePixelRatio, 2));
	}

	public dispose(): void {
		this.renderer.domElement.remove();
		this.renderer.dispose();
		this.observer.disconnect();
		if (this.container.contains(this.renderer.domElement)) {
			this.renderer.domElement.removeChild(this.renderer.domElement);
		}
	}

	public render(scene: Scene): void {
		this.renderer.render(scene, this.camera);
	}

	private _containerResizeEvent(entries: ResizeObserverEntry[]): void {
		const entry: ResizeObserverEntry = entries[0];
		const width: number = entry.contentRect.width;
		const height: number = entry.contentRect.height;
		this._updateDimensions(width, height, Math.min(devicePixelRatio, 2));
	}

	private _updateDimensions(width: number, height: number, dpr: number): void {
		this.renderer.setPixelRatio(dpr);
		this.renderer.setSize(width, height, false);
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		if (this.onresize !== null) {
			this.onresize();
		}
	}
}
