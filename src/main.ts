import Polygon from './Classes/Polygon';
import Rectangle from './Classes/Rectangle';

const canvas = document.querySelector('#cnv') as HTMLCanvasElement;
const health = document.querySelector(".health") as HTMLDivElement;

const keysPressed = {
	w: false,
	s: false,
	a: false,
	d: false,
	space: false,
}

const rocksProp = {
	vertexCount: {
		min: 4,
		max: 8
	},
	angularVelocity: {
		min: 0.01,
		max: 0.1
	},
	linearVelocity: {
		min: 3,
		max: 10
	},
	width: {
		min: 10,
		max: 30
	}
}
const spaceShipProp = {
	linearVelocity: 5,
	angularVelocity: 0.05,
	health: 100,
}

if (!canvas) {
	throw new Error('Canvas element not found');
}

canvas.width = innerWidth;
canvas.height = innerHeight;

const ctx = canvas.getContext('2d')!;

if (!ctx) {
	throw new Error('Canvas context not found');
}

const spaceShip = new Polygon(ctx, 3, { x: 0, y: 0 }, 50, "wheat");
// spaceShip.data.set("bullets", new Array<Rectangle>(10));

// spaceShip.data.get("bullets").forEach(() => {

// })

const rocks = new Array<Polygon>(5);

for (let i = 0; i < rocks.length; i++) {
	const width = rand(rocksProp.width.min, rocksProp.width.max);
	rocks[i] = new Polygon(
		ctx,
		rand(rocksProp.vertexCount.min, rocksProp.vertexCount.max, true),
		generateRandSpawnPoint(width),
		width,
		"gray"
	)
	rocks[i].data.set("shoudlRespawn", false);
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	handleSpaceShipControl();
	spaceShip.draw();
	!spaceShip.isInsideCanvas() && spaceShip.moveTo(0, 0);
	const shipPos = spaceShip.getPosition();
	rocks.forEach((rock) => {
		rock.lookAt(shipPos.x, shipPos.y);
		rock.walk(2);
		rock.draw();
		rock.spin(0.05);
		if (rock.isInsideCanvas()) {
			rock.data.set("shoudlRespawn", true);

			if (rock.isColliding(spaceShip)) {
				respawnRock(rock);
				rock.lookAt(shipPos.x, shipPos.y);
			}
		}
		if (rock.data.get("shoudlRespawn") === true && !rock.isInsideCanvas()) {
			respawnRock(rock);
			rock.lookAt(shipPos.x, shipPos.y);
		}
	})

	requestAnimationFrame(animate);
}

animate()


window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);


function handleSpaceShipControl() {
	keysPressed.w && spaceShip.walk(spaceShipProp.linearVelocity);
	keysPressed.s && spaceShip.walk(-spaceShipProp.linearVelocity);
	keysPressed.d && spaceShip.rotate(-spaceShipProp.angularVelocity);
	keysPressed.a && spaceShip.rotate(spaceShipProp.angularVelocity);
	if (keysPressed.space) {

	}
}

function handleKeyDown(event: KeyboardEvent) {
	switch (event.key) {
		case 'w':
			keysPressed.w = true;
			break;
		case 's':
			keysPressed.s = true;
	}

	switch (event.key) {
		case 'a':
			keysPressed.a = true;
			break;
		case 'd':
			keysPressed.d = true;
	}

	if (event.key === " ") keysPressed.space = true;
}

function handleKeyUp(event: KeyboardEvent) {
	switch (event.key) {
		case 'w':
			keysPressed.w = false;
			break;
		case 's':
			keysPressed.s = false;
	}

	switch (event.key) {
		case 'a':
			keysPressed.a = false;
			break;
		case 'd':
			keysPressed.d = false;
	}

	if (event.key === " ") keysPressed.space = false
}

function generateRandSpawnPoint(width: number) {
	const side = Math.floor(Math.random() * 4); // Randomly pick one of the 4 sides
	let x = 0, y = 0;
	const halfHeight = innerHeight / 2;
	const halfWidth = innerWidth / 2;

	switch (side) {
		case 0: // Left side (spawns on the left outside the world boundary)
			x = -halfWidth - width - rand(0, 100);
			y = rand(-halfHeight - 100, halfHeight + 100); // Random y position
			break;
		case 1: // Right side (spawns on the right outside the world boundary)
			x = halfWidth + rand(0, 100);
			y = rand(-halfHeight - 100, halfHeight + 100);
			break;
		case 2: // Top side (spawns on the top outside the world boundary)
			x = rand(-halfWidth - 100, halfWidth + 100); // Random x position
			y = -halfHeight - width - rand(0, 100);
			break;
		case 3: // Bottom side (spawns on the bottom outside the world boundary)
			x = rand(-halfWidth - 100, halfWidth + 100);
			y = halfHeight + rand(0, 100);
			break;
	}

	return { x, y };
}

function rand(min: number, max: number, floor = false) {
	const num = Math.random() * (max - min) + min;
	return floor ? Math.floor(num) : num;
}


function respawnRock(rock: Polygon) {
	const respawnPos = generateRandSpawnPoint(rock.width);
	rock.moveTo(respawnPos.x, respawnPos.y);
	rock.data.set("shoudlRespawn", false);
}