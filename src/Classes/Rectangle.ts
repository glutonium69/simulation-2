import Vector2D from './Vector2D';

interface Options {
	stroke: {
		width: number;
		color: string;
	};
	speed: number;
}

const initOptions: Options = {
	stroke: {
		width: 0,
		color: 'transparent',
	},
	speed: 0,
};

export default class Rectangle {
	public centerX: number;
	public centerY: number;
	private _direction: Vector2D = new Vector2D(0, 1);
	private _rotation: number = 90;

	constructor(
		private _ctx: CanvasRenderingContext2D,
		public x: number,
		public y: number,
		public w: number,
		public h: number,
		public color: string,
		public options: Options = initOptions
	) {
		this.centerX = this.x + this.w / 2;
		this.centerY = this.y + this.h / 2;
	}

	public draw() {
		if (!this._rotation) this._drawNormal();
		else this._drawRotate();
	}

	public erase() {
		this._ctx.clearRect(
			this.x - this.options.stroke.width,
			this.y - this.options.stroke.width,
			this.w + this.options.stroke.width * 2,
			this.h + this.options.stroke.width * 2
		);
	}

	private _drawNormal(x = this.x, y = this.y) {
		this._ctx.beginPath();
		this._ctx.fillStyle = this.color;
		this._ctx.rect(x, y, this.w, this.h);
		this._ctx.fill();
		this._ctx.strokeStyle = this.options.stroke.color;
		this._ctx.lineWidth = this.options.stroke.width;
		this._ctx.stroke();
	}

	private _drawRotate() {
		this.erase();
		this._ctx.save();
		this._ctx.translate(this.centerX, this.centerY);
		this._ctx.rotate((this._rotation * Math.PI) / 180);
		this._drawNormal(-this.w / 2, -this.h / 2);
		this._ctx.translate(0, 0);
		this._ctx.restore();
	}
}
