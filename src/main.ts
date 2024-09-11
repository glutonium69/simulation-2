import CustomShape from './Classes/CustomShape';
import Polygon from './Classes/Polygon';
import Rectangle from './Classes/Rectangle';
import World from './Classes/World';

const canvas = document.querySelector('#cnv') as HTMLCanvasElement;
const health = document.querySelector(".health") as HTMLDivElement;
const bulletsElem = document.querySelector(".bullets") as HTMLDivElement;

if (!canvas) {
	throw new Error('Canvas element not found');
}

canvas.width = innerWidth;
canvas.height = innerHeight;

const ctx = canvas.getContext('2d')!;

if (!ctx) {
	throw new Error('Canvas context not found');
}

const keysPressed = {
	w: false,
	s: false,
	a: false,
	d: false,
	space: false,
}

const spaceShipProp = {
	linearVelocity: 9,
	angularVelocity: 0.08,
	health: 100,
	bulletsLeft: 50,
	fireCooldown: 200,
}

const spaceShip = new CustomShape(ctx, { x: 0, y: 0 }, [
	{ x: 0, y: 150 },
	{ x: -30, y: 0 },
	{ x: 0, y: -50 },
	{ x: 30, y: 0 },
], "wheat");

const customShape = new CustomShape(ctx, { x: 200, y: 100 }, [
	{ x: 0, y: 120 },
	{ x: -20, y: 100 },
	{ x: -30, y: 0 },
	{ x: 0, y: -50 },
	{ x: 50, y: 0 },
	{ x: 70, y: 150 },
], "gray");

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	handleSpaceShip();
	customShape.draw();
	customShape.spin(0.02);
	spaceShip.fillColor = spaceShip.isColliding(customShape) ? "red" : "wheat";

	requestAnimationFrame(animate);
}

animate()

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

function handleSpaceShip() {
	handleSpaceShipControl();

	spaceShip.draw();
	!spaceShip.isInsideCanvas() && spaceShip.moveTo(0, 0);
}

function handleSpaceShipControl() {
	keysPressed.w && spaceShip.walk(spaceShipProp.linearVelocity);
	keysPressed.s && spaceShip.walk(-spaceShipProp.linearVelocity);
	keysPressed.d && spaceShip.rotate(-spaceShipProp.angularVelocity);
	keysPressed.a && spaceShip.rotate(spaceShipProp.angularVelocity);
}

function handleKeyDown(event: KeyboardEvent) {
	switch (event.key) {
		case 'w':
			keysPressed.w = true;
			break;
		case 's':
			keysPressed.s = true;
			break;
	}

	switch (event.key) {
		case 'a':
			keysPressed.a = true;
			break;
		case 'd':
			keysPressed.d = true;
			break;
	}

	switch (event.key) {
		case ' ':
			keysPressed.space = true;
			break;
	}
}

function handleKeyUp(event: KeyboardEvent) {
	switch (event.key) {
		case 'w':
			keysPressed.w = false;
			break;
		case 's':
			keysPressed.s = false;
			break;
	}

	switch (event.key) {
		case 'a':
			keysPressed.a = false;
			break;
		case 'd':
			keysPressed.d = false;
			break;
	}

	switch (event.key) {
		case ' ':
			keysPressed.space = false;
			break;
	}
}