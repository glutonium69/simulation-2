import Vector2D from './Classes/Vector2D';

const canvas = document.querySelector('#cnv') as HTMLCanvasElement;

if (!canvas) {
	throw new Error('Canvas element not found');
}

canvas.width = innerWidth;
canvas.height = innerHeight;

const ctx = canvas.getContext('2d');

if (!ctx) {
	throw new Error('Canvas context not found');
}

const vec = new Vector2D(-100, 100);
// vec.normalise(true);
// vec.scale(20)

function animate() {
	ctx!.clearRect(0, 0, canvas.width, canvas.height);
	Vector2D.drawAxis(ctx!);
	vec.draw(ctx!);
	vec.rotate(2 * Math.PI / -180)

	requestAnimationFrame(animate);
}

animate();
