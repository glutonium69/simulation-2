import Vector2D from './Classes/Vector2D';

const eventObject = {
	isVecOriginPressed: false,
}

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
const vec = new Vector2D(30, 30);

function animate() {
	ctx!.clearRect(0, 0, canvas.width, canvas.height);
	Vector2D.drawAxis(ctx!);
	// !eventObject.isVecOriginPressed && vec.rotate(1 * Math.PI / 180);
	vec.draw(ctx!, { localAxis: true });

	requestAnimationFrame(animate);
}

animate();

window.addEventListener("keydown", e => {
	const { x, y } = vec.getOrigin();
	let movX = x, movY = y;

	switch (e.key) {
		case 'w':
			movY = y + 1;
			break;

		case 's':
			movY = y - 1;
			break;
	}

	switch (e.key) {
		case 'd':
			movX = x + 1;
			break;

		case 'a':
			movX = x - 1;
			break;
	}

	if("wsda".includes(e.key))
		vec.moveTo(movX, movY);
})

canvas.addEventListener("mousedown", e => {
	if (isVecOriginPressed(e.clientX, e.clientY)) {
		eventObject.isVecOriginPressed = true;
	} else {
		const { x, y } = Vector2D.mapCoord(e.clientX, e.clientY).screenToWorld();
		vec.lookAt(x, y);
	}
})

canvas.addEventListener("mouseup", () => {
	eventObject.isVecOriginPressed = false;
})

canvas.addEventListener("mousemove", e => {
	if (!eventObject.isVecOriginPressed) return;
	moveVec(e.clientX, e.clientY);
})

function moveVec(mouseX: number, mouseY: number) {
	const { x, y } = Vector2D.mapCoord(mouseX, mouseY).screenToWorld();
	vec.moveTo(x, y);
}

function isVecOriginPressed(x: number, y: number) {
	const { x: mouseX, y: mouseY } = Vector2D.mapCoord(x, y).screenToWorld();
	const { x: originX, y: originY } = vec.getOrigin();
	const dis = Math.sqrt(
		(mouseX - originX) ** 2 + (mouseY - originY) ** 2
	);

	return dis < 5; // 5 = origin circle radius. hard coded for now in the vec._draw() method
}