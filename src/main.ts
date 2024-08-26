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

function animate() {
	ctx!.clearRect(0, 0, canvas.width, canvas.height);

	Vector2D.drawAxis(ctx!);

	requestAnimationFrame(animate);
}

animate();