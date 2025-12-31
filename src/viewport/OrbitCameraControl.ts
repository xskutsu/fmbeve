import { Camera, Vector2 } from "three";

export default class OrbitCameraControl {
	public camera: Camera;
	public radius: number;
	public theta: number;
	public phi: number;
	public isDragging: boolean;
	public mouse: Vector2;
	public moveSpeed: number;
	public zoomSpeed: number;
	public constructor(camera: Camera, moveSpeed: number, zoomSpeed: number) {
		this.camera = camera;
		this.radius = 10;
		this.theta = Math.PI / 4;
		this.phi = Math.PI / 3;
		this.isDragging = false;
		this.mouse = new Vector2;
		this.moveSpeed = moveSpeed;
		this.zoomSpeed = zoomSpeed;
		this.update();
	}

	public update(): void {
		const x: number = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
		const y: number = this.radius * Math.cos(this.phi);
		const z: number = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
		this.camera.position.set(x, y, z);
		this.camera.lookAt(0, 0, 0);
	}

	public setupInput(domElement: HTMLElement): void {
		domElement.addEventListener("mousedown", e => this._mouseDownEvent(e.clientX, e.clientY));
		domElement.addEventListener("mouseup", () => this._mouseUpEvent());
		domElement.addEventListener("mousemove", e => this._mouseMoveEvent(e.clientX, e.clientY));
		domElement.addEventListener("wheel", e => this._wheelEvent(e.deltaY));
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
		this.theta -= deltaX * this.moveSpeed;
		this.phi = Math.max(0.01, Math.min(Math.PI - 0.01, this.phi - deltaY * this.moveSpeed));
		this.update();
	}

	private _wheelEvent(deltaY: number): void {
		this.radius = Math.max(1, Math.min(50, this.radius + deltaY * this.zoomSpeed));
		this.update();
	}
}
