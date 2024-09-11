/**
* Creates an instance of a unit `Vector2D`.
*
* @param x - The origin-x in the world coordinate system.
* @param y - The origin-y in the world coordinate system.
*/
export default class Vector2D {
	public argument: number = Math.PI / 2;

	constructor(
		public x: number,
		public y: number
	) { }

	/**
	* Walks across the direction the vector is pointing towards.
	* 
	* @param displacement - The distance to move across the pointed direction.
	*/
	public walk(displacement: number): void {
		this.x += displacement * Math.cos(this.argument);
		this.y += displacement * Math.sin(this.argument);
	}

	/**
	* Changes the direction of the vector and points towards a given point
	* 
	* @param x - The x coordinate in world coordinate.
	* @param y - The y coordinate in world coordinate.
	*/
	public lookAt(x: number, y: number): void {
		const angle = Math.atan2(
			y - y,
			x - x
		);

		this.argument += angle;
	}
}