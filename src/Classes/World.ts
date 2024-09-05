import { Vertex } from "../utils";

export default class World {

	/**
	* Maps coordinates from world to screen coordinate systems.
	*
	* @static
	* @param x - The x-coordinate in the world coordinate system or a Vertex object.
	* @param y - The y-coordinate in the world coordinate system or undefined if x is a Vertex object.
	* @returns
	* - An object with two properties:
	*   - `x`: x coordinate in screen space.
	*   - `y`: y coordinate in world space.
	*/
	static coordWorldToScreen(x: number, y: number): { x: number; y: number };
	static coordWorldToScreen(vertex: Vertex): { x: number; y: number };
	static coordWorldToScreen(xOrVertex: number | Vertex, y?: number) {
		let x: number;
		let yCoord: number;

		if (typeof xOrVertex === 'number') {
			x = xOrVertex;
			yCoord = y!;
		} else {
			x = xOrVertex.x;
			yCoord = xOrVertex.y;
		}

		return {
			x: innerWidth / 2 + x,
			y: innerHeight / 2 - yCoord,
		};
	}

	/**
	* Maps coordinates from screen to world coordinate systems.
	*
	* @static
	* @param x - The x-coordinate in the screen coordinate system or a Vertex object.
	* @param y - The y-coordinate in the screen coordinate system or undefined if x is a Vertex object.
	* @returns
	* - An object with two properties:
	*   - `x`: x coordinate in world space.
	*   - `y`: y coordinate in screen space.
	*/
	static coordScreenToWorld(x: number, y: number): { x: number; y: number };
	static coordScreenToWorld(vertex: Vertex): { x: number; y: number };
	static coordScreenToWorld(xOrVertex: number | Vertex, y?: number) {
		let x: number;
		let yCoord: number;

		if (typeof xOrVertex === 'number') {
			x = xOrVertex;
			yCoord = y!;
		} else {
			x = xOrVertex.x;
			yCoord = xOrVertex.y;
		}

		return {
			x: x - innerWidth / 2,
			y: innerHeight / 2 - yCoord,
		};
	}

	/**
	* Draws the X and Y axes on the canvas.
	*
	* @static
	* @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
	* @param [x=true] - Whether to draw the X-axis.
	* @param [y=true] - Whether to draw the Y-axis.
	*/
	static drawWorldAxis(ctx: CanvasRenderingContext2D, x = true, y = true) {
		ctx.lineWidth = 2;

		if (x) {
			ctx.beginPath();
			ctx.moveTo(0, innerHeight / 2);
			ctx.lineTo(innerWidth, innerHeight / 2);
			ctx.strokeStyle = 'red';
			ctx.stroke();
		}

		if (y) {
			ctx.beginPath();
			ctx.moveTo(innerWidth / 2, 0);
			ctx.lineTo(innerWidth / 2, innerHeight);
			ctx.strokeStyle = 'blue';
			ctx.stroke();
		}
	}
}