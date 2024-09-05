import { toDeg, toRad } from "../utils";
import Vector2D from "./Vector2D";
import World from "./World";

export default class Rectangle {
	private _directionalVec: Vector2D;

	constructor(
		private _ctx: CanvasRenderingContext2D,
		private _x: number,
		private _y: number,
		public width: number,
		public height: number,
		public color: string
	) {
		this._directionalVec = new Vector2D(this._x, this._y);

	}

	public walk(value: number) {
		this._directionalVec.walk(value);
	}

	public lookAt(x: number, y: number) {
		this._directionalVec.lookAt(x, y);
	}

	public moveTo(x: number, y: number) {
		this._directionalVec.moveTo(x, y);
	}

	public rotate(value: number) {
		this._directionalVec.rotate(value);
	}

	public setRotation(angle: number) {
		this._directionalVec.setRotation(angle);
	}

	public draw() {
		if (toDeg(this._directionalVec.getArgument()) === 90)
			this._drawNormal();
		else
			this._drawRotate();
	}

	public erase() {
		this._ctx.clearRect(this._x, this._y, this.width, this.height);
	}

	public isColliding(element: Rectangle | { x: number, y: number }) {
		if (element instanceof Rectangle) return this._boxCollision(element);
		return this._pointCollision(element.x, element.y);
	}

	private _boxCollision(element: Rectangle) {
		const { x: thisX, y: thisY } = this._getTopLeftPoint();
		const { x: elemX, y: elemY } = element._getTopLeftPoint();

		return (
			thisX + this.width >= elemX &&
			elemX + element.width >= thisX &&
			thisY + this.height >= elemY &&
			elemY + element.height >= thisY
		);
	}

	private _pointCollision(x: number, y: number) {
		const { x: thisX, y: thisY } = this._getTopLeftPoint();

		return (
			x >= thisX &&
			x <= thisX + this.width &&
			y >= thisY &&
			y <= thisY + this.height
		);
	}

	private _drawNormal(rotationEnabled = false) {
		const { x, y } = this._getTopLeftPoint(rotationEnabled);
		this._ctx.beginPath();
		this._ctx.fillStyle = this.color;
		this._ctx.rect(x, y, this.width, this.height);
		this._ctx.fill();
	}

	private _drawRotate() {
		const { x, y } = World.coordWorldToScreen(this._directionalVec.getOrigin());
		this._ctx.save();
		this._ctx.translate(x, y);
		this._ctx.rotate(toRad(90) - this._directionalVec.getArgument());
		this._drawNormal(true);
		this._ctx.translate(0, 0);
		this._ctx.restore();
	}

	private _getTopLeftPoint(rotationEnabled = false) {
		if (!rotationEnabled) {
			const { x, y } = this._directionalVec.getOrigin();
			return World.coordWorldToScreen(x - this.width / 2, y + this.height / 2);
		} else {
			return {
				x: -this.width / 2,
				y: -this.height / 2
			}
		}
	}
}
