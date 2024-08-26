export default class Rectangle {
	public centerX: number;
	public centerY: number;
	private _rotation: number = 90;

	constructor(
		private _ctx: CanvasRenderingContext2D,
		public x: number,
		public y: number,
		public width: number,
		public height: number,
		public color: string
	) {
		this.centerX = this.x + this.width / 2;
		this.centerY = this.y + this.height / 2;
	}

	public draw() {
		if (!this._rotation) this._drawNormal();
		else this._drawRotate();
	}

	public erase() {
		this._ctx.clearRect(this.x, this.y, this.width, this.height);
	}

	private _drawNormal(x = this.x, y = this.y) {
		this._ctx.beginPath();
		this._ctx.fillStyle = this.color;
		this._ctx.rect(x, y, this.width, this.height);
		this._ctx.fill();
	}

	private _drawRotate() {
		this._ctx.save();
		this._ctx.translate(this.centerX, this.centerY);
		this._ctx.rotate((this._rotation * Math.PI) / 180);
		this._drawNormal(-this.width / 2, -this.height / 2);
		this._ctx.translate(0, 0);
		this._ctx.restore();
	}
}
