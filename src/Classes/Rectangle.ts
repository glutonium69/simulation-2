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
	}

	protected setVertecies() {
		const { x, y } = this.directionalVec.getOrigin();
		const angle = this.rotationalVec.getArgument();
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		const halfWidth = this.width / 2;
		const halfHeight = this.height / 2;

		this.vertecies[0] = {
			x: x + halfHeight * cos - halfWidth * sin,
			y: y + halfHeight * sin + halfWidth * cos
		};
		this.vertecies[1] = {
			x: x - halfHeight * cos - halfWidth * sin,
			y: y - halfHeight * sin + halfWidth * cos
		};
		this.vertecies[2] = {
			x: x - halfHeight * cos + halfWidth * sin,
			y: y - halfHeight * sin - halfWidth * cos
		};
		this.vertecies[3] = {
			x: x + halfHeight * cos + halfWidth * sin,
			y: y + halfHeight * sin - halfWidth * cos
		};
	}
}