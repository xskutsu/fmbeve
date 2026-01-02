import { Camera, Vector2, Vector3 } from "three";

export default class OrbitCameraControl {
	public readonly camera: Camera;
	public moveSpeed: number;
	public zoomSpeed: number;
	public readonly domElement: HTMLElement;
	public readonly position: Vector3;
	public readonly renderPosition: Vector3;
	public interpolationSpeed: number;
	public isDragging: boolean;
	public readonly mouse: Vector2;

	public constructor(camera: Camera, moveSpeed: number, zoomSpeed: number, domElement: HTMLElement, startingPosition?: Vector3, interpolationSpeed: number = 0.2) {
		this.camera = camera;
		this.moveSpeed = moveSpeed;
		this.zoomSpeed = zoomSpeed;
		this.domElement = domElement;
		this.position = startingPosition === undefined ? new Vector3(10, Math.PI / 4, Math.PI / 3) : startingPosition.clone();
		this.renderPosition = this.position.clone();
		this.interpolationSpeed = interpolationSpeed;
		this.isDragging = false;
		this.mouse = new Vector2();
		domElement.addEventListener("mousedown", e => this._mouseDownEvent(e.clientX, e.clientY));
		window.addEventListener("mouseup", () => this._mouseUpEvent());
		domElement.addEventListener("mousemove", e => this._mouseMoveEvent(e.clientX, e.clientY));
		domElement.addEventListener("wheel", e => this._wheelEvent(e.deltaY));
		domElement.addEventListener("contextmenu", e => e.preventDefault());
		this.update();
	}

	public update(): void {
		this.renderPosition.lerp(this.position, this.interpolationSpeed);
		this.camera.position.set(
			this.renderPosition.x * Math.sin(this.renderPosition.z) * Math.sin(this.renderPosition.y),
			this.renderPosition.x * Math.cos(this.renderPosition.z),
			this.renderPosition.x * Math.sin(this.renderPosition.z) * Math.cos(this.renderPosition.y)
		);
		this.camera.lookAt(0, 0, 0);
	}

	private _mouseDownEvent(clientX: number, clientY: number): void {
		this.isDragging = true;
		this.mouse.set(clientX, clientY);
	}

	private _mouseUpEvent(): void {
		this.isDragging = false;
	}

	private _mouseMoveEvent(clientX: number, clientY: number): void {
		if (!this.isDragging) {
			return;
		}
		const deltaX: number = clientX - this.mouse.x;
		const deltaY: number = clientY - this.mouse.y;
		this.mouse.set(clientX, clientY);
		this.position.y -= (deltaX / this.domElement.clientWidth) * this.moveSpeed;
		this.position.z -= (deltaY / this.domElement.clientHeight) * this.moveSpeed
		this.position.z = Math.max(0.01, Math.min(Math.PI - 0.01, this.position.z));
	}

	private _wheelEvent(deltaY: number): void {
		const factor = 1.1;
		const direction = Math.sign(deltaY);
		if (direction > 0) {
			this.position.x *= factor;
		} else {
			this.position.x /= factor;
		}
		this.position.x = Math.max(1, Math.min(50, this.position.x));
	}
}
