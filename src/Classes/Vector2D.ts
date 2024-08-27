import { Coord } from "../utils";
import World from "./World";

interface Coord {
	world: {
		x: number;
		y: number;
	};
	screen: {
		x: number;
		y: number;
	};
}

/**
 * Creates an instance of a unit `Vector2D`.
 *
 * @param x - The origin-x in the world coordinate system.
 * @param y - The origin-y in the world coordinate system.
 */
export default class Vector2D {
	private _head: Coord;
	private _origin: Coord;
	private _magnitude: number = 1; // unit vector has magnitude of 1.

	constructor(
		private x: number,
		private y: number
	) {
		const { x: headScreenX, y: headScreenY } = World.coodWorldToScreen(0, this._magnitude);

		const { x: originScreenX, y: originScreenY } = World.coodWorldToScreen(this.x, this.y);

		// setting up head coord
		// by default the vector will be looking across the y axis.
		this._head = {
			world: { x: 0, y: this._magnitude },
			screen: { x: headScreenX, y: headScreenY },
		};

		// setting up origin coord
		this._origin = {
			world: { x: this.x, y: this.y },
			screen: { x: originScreenX, y: originScreenY },
		};
	}

	/**
	 * Gets the origin position of the vector in world coordinates.
	 *
	 * @returns The origin position in world coordinates.
	 */
	public getOrigin() {
		return {
			x: this._origin.world.x,
			y: this._origin.world.y,
		};
	}

	/**
	 * Calculates the argument (angle) of the vector relative to the origin.
	 *
	 * @returns The argument in radians.
	 */
	public getArgument() {
		return Math.atan2(
			this._head.world.y - this._origin.world.y,
			this._head.world.x - this._origin.world.x
		);
	}

	/**
	 * Changes the direction of the vector and points towards a given point
	 * 
	 * @param x - The x coordinate in world coordinate.
	 * @param y - The y coordinate in world coordinate.
	 */
	public lookAt(x: number, y: number) {
		const angle = Math.atan2(
			y - this._origin.world.y,
			x - this._origin.world.x
		);

		this.rotate(angle - this.getArgument());
	}

	/**
	 * Walks across the direction the vector is pointing towards.
	 * 
	 * @param displacement - The distance to move across the pointed direction.
	 */
	public walk(displacement: number) {
		const argument = this.getArgument();
		const stepX = displacement * Math.cos(argument);
		const stepY = displacement * Math.sin(argument);
		this._setHead(this._head.world.x + stepX, this._head.world.y + stepY);
		this._setOrigin(this._origin.world.x + stepX, this._origin.world.y + stepY)
	}

	/**
	 * Moves the whole vector to given point while keeping the argument same.
	 * 
	 * @param x - The x coordinate in world coordinate.
	 * @param y - The y coordinate in world coordinate.
	 */
	public moveTo(x: number, y: number) {
		const argument = this.getArgument();

		this._setOrigin(x, y);
		this._setHead(
			x + this._magnitude * Math.cos(argument),
			y + this._magnitude * Math.sin(argument),
		)
	}

	/**
	 y Rotates the vector by a given angle and updates the head position accordingly.
	 *
	 * @param value - The angle to rotate the vector by, in radians.
	 */
	public rotate(value: number) {
		const newArgument = this.getArgument() + value;
		// magnitude * Math.cos(angle) returns a local coord relative to the origin point
		// since origin is not static we have to covert local coord to world coord
		// we do it by adding the origins world coord to it.
		this._setHead(
			this._origin.world.x + this._magnitude * Math.cos(newArgument),
			this._origin.world.y + this._magnitude * Math.sin(newArgument)
		)
	}

	/**
	 * Sets a new head position for the vector and updates the corresponding screen coordinates.
	 *
	 * @private
	 * @param x - The new x-coordinate in world coordinates.
	 * @param y - The new y-coordinate in world coordinates.
	 */
	private _setHead(x: number, y: number) {
		const { x: screenX, y: screenY } = World.coodWorldToScreen(x, y);

		this._head.world.x = x;
		this._head.world.y = y;

		this._head.screen.x = screenX;
		this._head.screen.y = screenY;
	}

	/**
	 * Sets a new origin position for the vector and updates the corresponding screen coordinates.
	 *
	 * @private
	 * @param x - The new x-coordinate in world coordinates.
	 * @param y - The new y-coordinate in world coordinates.
	 */
	private _setOrigin(x: number, y: number) {
		const { x: screenX, y: screenY } = World.coodWorldToScreen(x, y);

		this._origin.world.x = x;
		this._origin.world.y = y;

		this._origin.screen.x = screenX;
		this._origin.screen.y = screenY;
	}
}
