import { type Camera, Vector2, Vector3 } from "three";

export class OrbitCameraControl {
	public camera: Camera;
	public position: Vector3;
	public renderPosition: Vector3;
	public isDragging: boolean;
	public mouse: Vector2;

	public constructor(camera: Camera) {
		this.camera = camera;
		this.position = new Vector3(10, Math.PI / 4, Math.PI / 3);
		this.renderPosition = this.position.clone();
		this.isDragging = false;
		this.mouse = new Vector2();
	}

	public update(): void {
		this.renderPosition.lerp(this.position, 0.2);
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

	public addListeners(domElement: HTMLElement): void {
		domElement.addEventListener("mousedown", (e) =>
			this._mouseDownEvent(e.clientX, e.clientY)
		);
		window.addEventListener("mouseup", () => this._mouseUpEvent());
		domElement.addEventListener("mousemove", (e) =>
			this._mouseMoveEvent(e.clientX, e.clientY, domElement)
		);
		domElement.addEventListener("wheel", (e) => this._wheelEvent(e.deltaY));
		domElement.addEventListener("contextmenu", (e) => e.preventDefault());
	}

	private _mouseDownEvent(clientX: number, clientY: number): void {
		this.isDragging = true;
		this.mouse.set(clientX, clientY);
	}

	private _mouseUpEvent(): void {
		this.isDragging = false;
	}

	private _mouseMoveEvent(clientX: number, clientY: number, domElement: HTMLElement): void {
		if (!this.isDragging) {
			return;
		}
		const moveSpeed: number = 8;
		const deltaX: number = clientX - this.mouse.x;
		const deltaY: number = clientY - this.mouse.y;
		this.mouse.set(clientX, clientY);
		this.position.y -= (deltaX / domElement.clientWidth) * moveSpeed;
		this.position.z -= (deltaY / domElement.clientHeight) * moveSpeed;
		this.position.z = Math.max(0.01, Math.min(Math.PI - 0.01, this.position.z));
	}

	private _wheelEvent(deltaY: number): void {
		const zoomSpeed: number = 1.1;
		let x = this.position.x * (deltaY > 0 ? zoomSpeed : 1 / zoomSpeed);
		if (x > 50) {
			x = 50;
		} else if (x < 1) {
			x = 1;
		}
		this.position.x = x;
	}
}
