import Rectangle from './Classes/Rectangle';
import Vector2D from './Classes/Vector2D';
import { toRad } from './utils';

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

const rec = new Rectangle(ctx, 0, 0, 50, 50, "green");

function animate() {
	ctx!.clearRect(0, 0, canvas.width, canvas.height);

	Vector2D.drawAxis(ctx!);

	// rec.walk(1);
	rec.rotate(toRad(1));
	rec.draw();

	requestAnimationFrame(animate);
}

animate();

canvas.addEventListener("mousemove", e => {
	const { x, y } = Vector2D.mapCoord(e.clientX, e.clientY).screenToWorld();
	rec.lookAt(x, y);
})

canvas.addEventListener("click", e => {
	const { x, y } = Vector2D.mapCoord(e.clientX, e.clientY).screenToWorld();
	rec.moveTo(x, y);
	const r = Math.floor(Math.random() * 255);
	const g = Math.floor(Math.random() * 255);
	const b = Math.floor(Math.random() * 255);
	rec.color = `rgb(${r}, ${g}, ${b})`;
})
