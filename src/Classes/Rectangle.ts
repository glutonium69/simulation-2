import { Vertex } from "../utils";
import Shape from "./Shape";

export default class Rectangle extends Shape {
	constructor(
		protected ctx: CanvasRenderingContext2D,
		protected position: Vertex,
		public width: number,
		public height: number,
		public fillColor: string
	) {
		super(ctx, 4, position, width, height, fillColor);
		this.setVertecies();
	}

	protected setVertecies() {
		const cos = Math.cos(this.directionalVec.argument);
		const sin = Math.sin(this.directionalVec.argument);
		const halfWidth = this.width / 2;
		const halfHeight = this.height / 2;

		this.vertecies[0] = {
			x: this.directionalVec.x + halfHeight * cos - halfWidth * sin,
			y: this.directionalVec.y + halfHeight * sin + halfWidth * cos
		};
		this.vertecies[1] = {
			x: this.directionalVec.x - halfHeight * cos - halfWidth * sin,
			y: this.directionalVec.y - halfHeight * sin + halfWidth * cos
		};
		this.vertecies[2] = {
			x: this.directionalVec.x - halfHeight * cos + halfWidth * sin,
			y: this.directionalVec.y - halfHeight * sin - halfWidth * cos
		};
		this.vertecies[3] = {
			x: this.directionalVec.x + halfHeight * cos + halfWidth * sin,
			y: this.directionalVec.y + halfHeight * sin - halfWidth * cos
		};
	}
}