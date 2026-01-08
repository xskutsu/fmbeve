import { Color, Group, Scene } from "three";
import type { MolangVariableMap } from "../molang/types";
import { addGroundHelpers } from "../render/groups/addGroundHelpers";
import type { Entity } from "./entity";

export class Editor {
	public scene: Scene;
	public entities: Map<string, Entity>;
	public groundHelperGroup: Group;

	public constructor() {
		this.scene = new Scene();
		this.scene.background = new Color(0x111111);
		this.entities = new Map<string, Entity>();
		this.groundHelperGroup = new Group();
		addGroundHelpers(this.groundHelperGroup);
		this.scene.add(this.groundHelperGroup);
	}

	public addEntity(entity: Entity) {
		this.entities.delete(entity.uuid);
	}

	public deleteEntity(entity: Entity, dispose: boolean = true): void {
		this.entities.delete(entity.uuid);
		if (dispose) {
			entity.dispose();
		}
	}

	public clear(dispose: boolean = true): void {
		for (const entity of this.entities.values()) {
			this.deleteEntity(entity);
			if (dispose) {
				entity.dispose();
			}
		}
	}

	public update(variables: MolangVariableMap | null): void {
		for (const entity of this.entities.values()) {
			entity.update(variables);
		}
	}
}
