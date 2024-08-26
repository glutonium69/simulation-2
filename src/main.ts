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

Vector2D.drawAxis(ctx);
const vec = new Vector2D(100, 100);
vec.draw(ctx, { localAxis: true });

function animate() {
	ctx!.clearRect(0, 0, canvas.width, canvas.height);
	Vector2D.drawAxis(ctx!);
	vec.draw(ctx!, { localAxis: true });

	requestAnimationFrame(animate);
}

animate();

let isCtrlPressed = false;

window.addEventListener("keydown", e => {
	if(e.key === "Control") isCtrlPressed = true;
})

window.addEventListener("keyup", e => {
	if(e.key === "Control") isCtrlPressed = false;
})

canvas.addEventListener("click", e => {
	if(isCtrlPressed) {
		const { x, y } = Vector2D.mapCoord(e.clientX, e.clientY).screenToWorld();
		vec.setOrigin(x, y);
		return;
	}
	const { x, y } = Vector2D.mapCoord(e.clientX, e.clientY).screenToWorld();
	vec.lookAt(x, y);
})