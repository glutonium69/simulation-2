export default class World {

    /**
	 * Maps coordinates from world to screen coordinate systems.
	 *
	 * @static
	 * @param x - The x-coordinate in the world coordinate system.
	 * @param y - The y-coordinate in the world coordinate system.
	 * @returns
	 * - An object with two properties:
	 *   - `x`: x coordinate in screen space.
	 *   - `y`: y coordinate in world space.
	 */
    static coodWorldToScreen(x: number, y: number) {
        return {
            x: innerWidth / 2 + x,
            y: innerHeight / 2 - y,
        };
    }

    /**
	 * Maps coordinates from screen to world coordinate systems.
	 *
	 * @static
	 * @param x - The x-coordinate in the screen coordinate system.
	 * @param y - The y-coordinate in the screen coordinate system.
	 * @returns
	 * - An object with two properties:
	 *   - `x`: x coordinate in world space.
	 *   - `y`: y coordinate in screen space.
	 */
    static coodScreenToWorld(x: number, y: number) {
        return {
            x: x - innerWidth / 2,
            y: innerHeight / 2 - y,
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
			ctx.lineTo(innerWidth / 2, innerWidth);
			ctx.strokeStyle = 'blue';
			ctx.stroke();
		}
	}
}