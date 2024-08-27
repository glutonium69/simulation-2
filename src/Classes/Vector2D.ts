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
		const { x: headScreenX, y: headScreenY } = Vector2D.mapCoord(
			0,
			this._magnitude
		).worldToScreen();

		const { x: originScreenX, y: originScreenY } = Vector2D.mapCoord(
			this.x,
			this.y
		).worldToScreen();

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
	 * Normalizes the vector (scales it to unit length).
	 *
	 * @param [self=false] - If true, normalizes the vector in place; otherwise, returns a new normalized vector.
	 * @returns A new normalized vector if `self` is false, otherwise returns nothing.
	 */
	public normalise(self = false): Vector2D | void {
		const normalX = this._head.world.x / this._magnitude;
		const normalY = this._head.world.y / this._magnitude;
		if (self) this._setHead(normalX, normalY);
		else return new Vector2D(normalX, normalY);
	}

	/**
	 * Sets a new head position for the vector and updates the corresponding screen coordinates.
	 *
	 * @private
	 * @param x - The new x-coordinate in world coordinates.
	 * @param y - The new y-coordinate in world coordinates.
	 */
	private _setHead(x: number, y: number) {
		const { x: screenX, y: screenY } = Vector2D.mapCoord(x, y).worldToScreen();

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
		const { x: screenX, y: screenY } = Vector2D.mapCoord(x, y).worldToScreen();

		this._origin.world.x = x;
		this._origin.world.y = y;

		this._origin.screen.x = screenX;
		this._origin.screen.y = screenY;
	}

	/**
	 * Maps coordinates between screen and world coordinate systems.
	 *
	 * @static
	 * @param x - The x-coordinate in the current coordinate system.
	 * @param y - The y-coordinate in the current coordinate system.
	 * @returns
	 * - An object with two methods:
	 *   - `worldToScreen`: Converts world coordinates to screen coordinates.
	 *   - `screenToWorld`: Converts screen coordinates to world coordinates.
	 */
	static mapCoord(x: number, y: number) {
		return {
			worldToScreen: () => {
				return {
					x: innerWidth / 2 + x,
					y: innerHeight / 2 - y,
				};
			},
			screenToWorld: () => {
				return {
					x: x - innerWidth / 2,
					y: innerHeight / 2 - y,
				};
			},
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
	static drawAxis(ctx: CanvasRenderingContext2D, x = true, y = true) {
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
			ctx.lineTo(innerWidth / 2, innerWidth);
			ctx.strokeStyle = 'blue';
			ctx.stroke();
		}
	}
}
