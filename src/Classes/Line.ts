import { Coord } from "../utils";
import World from "./World";

/**
 * Creates an instance of ` Line `.
 *
 * @param x1 - The starting x-coordinate in the world coordinate system.
 * @param y1 - The starting y-coordinate in the world coordinate system.
 * @param x2 - The ending x-coordinate in the world coordinate system.
 * @param y2 - The ending y-coordinate in the world coordinate system.
 */
export default class Line {
	private _head: Coord;
	private _tail: Coord;
    public thickness: number;
    public color: string;

	constructor(
        private ctx: CanvasRenderingContext2D,
		private x1: number,
		private y1: number,
		private x2: number,
		private y2: number,
	) {
		const { x: headScreenX, y: headScreenY } = World.coodWorldToScreen(this.x1, this.y1);
		const { x: originScreenX, y: originScreenY } = World.coodWorldToScreen(this.x2, this.y2);

		// setting up head coord
		this._tail = {
			world: { x: this.x1, y: this.y1 },
			screen: { x: headScreenX, y: headScreenY },
		};

		// setting up origin coord
		this._head = {
			world: { x: this.x2, y: this.y2 },
			screen: { x: originScreenX, y: originScreenY },
		};

        this.thickness = 3;
        this.color = "black";

	}

	/**
	 * Gets the current head position of the line in world coordinates.
	 *
	 * @returns The head position in world coordinates.
	 */
	public getHead() {
		return {
			x: this._head.world.x,
			y: this._head.world.y,
		};
	}

	/**
	 * Sets a new head position for the line and updates the corresponding screen coordinates.
	 *
	 * @param x - The new x-coordinate in world coordinates.
	 * @param y - The new y-coordinate in world coordinates.
	 */
	public setHead(x: number, y: number) {
		const { x: screenX, y: screenY } = World.coodWorldToScreen(x, y);

		this._head.world.x = x;
		this._head.world.y = y;

		this._head.screen.x = screenX;
		this._head.screen.y = screenY;
	}

	/**
	 * Gets the tail position of the line in world coordinates.
	 *
	 * @returns The tail position in world coordinates.
	 */
	public getTail() {
		return {
			x: this._tail.world.x,
			y: this._tail.world.y,
		};
	}

	/**
	 * Sets a new tail position for the line and updates the corresponding screen coordinates.
	 *
	 * @param x - The new x-coordinate in world coordinates.
	 * @param y - The new y-coordinate in world coordinates.
	 */
	public setTail(x: number, y: number) {
		const { x: screenX, y: screenY } = World.coodWorldToScreen(x, y);

		this._tail.world.x = x;
		this._tail.world.y = y;

		this._tail.screen.x = screenX;
		this._tail.screen.y = screenY;
	}

	/**
	 * Calculates the angle of the line relative to the local positive x-axis.
	 *
	 * @returns The argument in radians.
	 */
	public getRotation() {
		return Math.atan2(
			this._head.world.y - this._tail.world.y,
			this._head.world.x - this._tail.world.x
		);
	}

	/**
	 * Calculates the length.
	 *
	 * @returns The length of the line.
	 */
	public getLength() {
		return Math.sqrt(
			(this._tail.world.x - this._head.world.x) ** 2 +
			(this._tail.world.y - this._head.world.y) ** 2
		);
	}

	/**
	 * Changes the direction of the line and points towards a given point
	 * 
	 * @param x - The x coordinate in world coordinate.
	 * @param y - The y coordinate in world coordinate.
	 */
	public lookAt(x: number, y: number) {
		const angle = Math.atan2(
			y - this._tail.world.y,
			x - this._tail.world.x
		);

		this.rotate(angle - this.getRotation());
	}

	/**
	 * Walks across the direction the line is pointing towards.
	 * 
	 * @param displacement - The distance to move across the pointed direction.
	 */
	public walk(displacement: number) {
		const argument = this.getRotation();
		const stepX = displacement * Math.cos(argument);
		const stepY = displacement * Math.sin(argument);
		this.setHead(this._head.world.x + stepX, this._head.world.y + stepY);
		this.setTail(this._tail.world.x + stepX, this._tail.world.y + stepY)
	}

	/**
	 * Moves the whole line to given point while keeping the direction/angle same.
	 * 
	 * @param x - The x coordinate in world coordinate.
	 * @param y - The y coordinate in world coordinate.
	 */
	public moveTo(x: number, y: number) {
		const magnitude = this.getLength();
		const argument = this.getRotation();

		this.setTail(x, y);
		this.setHead(
			x + magnitude * Math.cos(argument),
			y + magnitude * Math.sin(argument),
		)
	}

	/**
	 * Rotates the line by a given angle.
	 *
	 * @param value - The angle to rotate the line by, in radians.
	 */
	public rotate(value: number) {
		const newArgument = this.getRotation() + value;
		const magnitude = this.getLength();
		// magnitude * Math.cos(angle) returns a local coord relative to the origin point
		// since origin is not static we have to covert local coord to world coord
		// we do it by adding the origins world coord to it.
		const newX = this._tail.world.x + magnitude * Math.cos(newArgument);
		const newY = this._tail.world.y + magnitude * Math.sin(newArgument);

		this.setHead(newX, newY);
	}

	/**
	 * Draws the line on canvas.
	 */
	public draw() {
		this.ctx.beginPath();
		this.ctx.moveTo(this._tail.screen.x, this._tail.screen.y);
		this.ctx.lineTo(this._head.screen.x, this._head.screen.y);
		this.ctx.lineWidth = this.thickness;
		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();
	}

	public drawLocalAxis() {
		const xLength = 100;
		const yLength = 100;
		this.ctx.lineWidth = 2;

		this.ctx.beginPath();
		this.ctx.moveTo(this._tail.screen.x - xLength / 2, this._tail.screen.y)
		this.ctx.lineTo(this._tail.screen.x + xLength / 2, this._tail.screen.y)
		this.ctx.strokeStyle = "yellow";
		this.ctx.stroke();

		this.ctx.beginPath();
		this.ctx.moveTo(this._tail.screen.x, this._tail.screen.y - yLength / 2)
		this.ctx.lineTo(this._tail.screen.x, this._tail.screen.y + yLength / 2)
		this.ctx.strokeStyle = "green";
		this.ctx.stroke();
	}
}