import { type Camera, Vector2, Vector3 } from "three";

export class OrbitCameraControl {
	public camera: Camera;
	public domElement: HTMLElement;
	public position: Vector3;
	public renderPosition: Vector3;
	public isDragging: boolean;
	public mouse: Vector2;
	private _lastUpdateTime: number;

	public constructor(camera: Camera, domElement: HTMLElement) {
		this.camera = camera;
		this.domElement = domElement;
		this.position = new Vector3(10, Math.PI / 4, Math.PI / 3);
		this.renderPosition = this.position.clone();
		this.isDragging = false;
		this.mouse = new Vector2();
		this._lastUpdateTime = performance.now();
		domElement.addEventListener("mousedown", this._mouseDownEvent.bind(this));
		window.addEventListener("mouseup", this._mouseUpEvent.bind(this));
		domElement.addEventListener("mousemove", this._mouseMoveEvent.bind(this));
		domElement.addEventListener("wheel", this._wheelEvent.bind(this));
		domElement.addEventListener("contextmenu", this._contextMenuEvent.bind(this));
	}

	public update(): void {
		const currentTime: number = performance.now();
		const deltaTIme: number = (currentTime - this._lastUpdateTime) / 1000;
		this._lastUpdateTime = currentTime;
		const interpolationSpeed: number = 16;
		const t: number = 1 - Math.exp(-interpolationSpeed * deltaTIme);
		this.renderPosition.lerp(this.position, t);
		this.camera.position.set(
			this.renderPosition.x *
				Math.sin(this.renderPosition.z) *
				Math.sin(this.renderPosition.y),
			this.renderPosition.x * Math.cos(this.renderPosition.z),
			this.renderPosition.x *
				Math.sin(this.renderPosition.z) *
				Math.cos(this.renderPosition.y)
		);
		this.camera.lookAt(0, 0, 0);
	}

	private _contextMenuEvent(event: PointerEvent): void {
		event.preventDefault();
	}

	private _mouseDownEvent(event: MouseEvent): void {
		this.isDragging = true;
		this.mouse.set(event.clientX, event.clientY);
	}

	private _mouseUpEvent(): void {
		this.isDragging = false;
	}

	private _mouseMoveEvent(event: MouseEvent): void {
		if (!this.isDragging) {
			return;
		}
		const moveSpeed: number = 8;
		const deltaX: number = event.clientX - this.mouse.x;
		const deltaY: number = event.clientY - this.mouse.y;
		this.mouse.set(event.clientX, event.clientY);
		this.position.y -= (deltaX / this.domElement.clientWidth) * moveSpeed;
		this.position.z -= (deltaY / this.domElement.clientHeight) * moveSpeed;
		this.position.z = Math.max(0.01, Math.min(Math.PI - 0.01, this.position.z));
	}

	private _wheelEvent(event: WheelEvent): void {
		const zoomSpeed: number = 1.1;
		let x = this.position.x * (event.deltaY > 0 ? zoomSpeed : 1 / zoomSpeed);
		if (x > 50) {
			x = 50;
		} else if (x < 1) {
			x = 1;
		}
		this.position.x = x;
	}
}
