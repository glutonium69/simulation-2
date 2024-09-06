import Polygon from './Classes/Polygon';

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
	linearVelocity: 5,
	angularVelocity: 0.05,
	health: 100,
	bulletsLeft: 100,
}

const spaceShip = new Polygon(ctx, 3, { x: 0, y: 0 }, 50, "hsl(117, 100%, 65%)");
const bullets = setUpBullets(100);
const rocks = setUpRocks(5);

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (spaceShipProp.health <= 0) return;

	const shipPos = spaceShip.getPosition();
	rocks.forEach((rock) => {
		rock.lookAt(shipPos.x, shipPos.y);
		rock.walk(rock.data.get("walkVelocity"));
		rock.spin(rock.data.get("spinVelocity"));
		rock.draw();
		if (rock.isInsideCanvas()) {
			rock.data.set("shoudlRespawn", true);

			if (rock.isColliding(spaceShip)) {
				respawnRock(rock);
				rock.lookAt(shipPos.x, shipPos.y);
				spaceShipProp.health -= 10;
				spaceShip.fillColor = `hsl(${117 * spaceShipProp.health / 100}, 100%, 65%)`
				if (spaceShipProp.health < 0) spaceShipProp.health = 0;
			}
		}
		if (rock.data.get("shoudlRespawn") === true && !rock.isInsideCanvas()) {
			respawnRock(rock);
			rock.lookAt(shipPos.x, shipPos.y);
		}
	})

	bullets.forEach(bul => {
		if (bul.data.get("isLive") === true) {
			const velocity = 10;  // Bullet velocity
			bul.walk(velocity);
			bul.draw();

			if (!bul.isInsideCanvas()) {
				bul.data.set("isLive", false);  // Deactivate bullet when outside canvas
			} else {
				rocks.forEach(rock => {
					if (bul.isColliding(rock)) {
						bul.data.set("isLive", false);  // Deactivate bullet when outside canvas
						respawnRock(rock);
					}
				})
			}
		}
	});

	bulletsElem.innerHTML = "Bullets: " + spaceShipProp.bulletsLeft;
	health.innerHTML = "Health: " + spaceShipProp.health;

	handleSpaceShipControl();
	spaceShip.draw();
	!spaceShip.isInsideCanvas() && spaceShip.moveTo(0, 0);

	requestAnimationFrame(animate);
}

animate()


window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

function setUpRocks(amount: number) {

	const rocksConfig = {
		vertexCount: {
			min: 4,
			max: 8
		},
		spinVelocity: {
			min: 0.01,
			max: 0.1
		},
		walkVelocity: {
			min: 1,
			max: 3
		},
		width: {
			min: 25,
			max: 40
		}
	}

	const rocks = new Array<Polygon>(amount);

	for (let i = 0; i < rocks.length; i++) {
		const width = rand(rocksConfig.width.min, rocksConfig.width.max);

		rocks[i] = new Polygon(
			ctx,
			rand(rocksConfig.vertexCount.min, rocksConfig.vertexCount.max, true),
			generateRandSpawnPoint(width),
			width,
			"gray"
		)

		rocks[i].data.set("shoudlRespawn", false);
		rocks[i].data.set("spinVelocity", rand(rocksConfig.spinVelocity.min, rocksConfig.spinVelocity.max));
		rocks[i].data.set("walkVelocity", rand(rocksConfig.walkVelocity.min, rocksConfig.walkVelocity.max));
	}

	return rocks;
}

function setUpBullets(amount: number) {
	const bullets = new Array<Polygon>(amount);

	for (let i = 0; i < bullets.length; i++) {
		bullets[i] = new Polygon(ctx, 3, { x: 0, y: 0 }, 10, "yellow");
		bullets[i].data.set("isLive", false);
	}

	return bullets;
}

function respawnRock(rock: Polygon) {
	const respawnPos = generateRandSpawnPoint(rock.width);
	rock.moveTo(respawnPos.x, respawnPos.y);
	rock.data.set("shoudlRespawn", false);
}

let lastShotTime = 0;
const fireCooldown = 200; // in milliseconds

function handleSpaceShipControl() {
	keysPressed.w && spaceShip.walk(spaceShipProp.linearVelocity);
	keysPressed.s && spaceShip.walk(-spaceShipProp.linearVelocity);
	keysPressed.d && spaceShip.rotate(-spaceShipProp.angularVelocity);
	keysPressed.a && spaceShip.rotate(spaceShipProp.angularVelocity);

	// Check if spacebar is pressed and bullets are available
	if (keysPressed.space && spaceShipProp.bulletsLeft > 0) {
		const currentTime = Date.now();
		// Fire bullet every 200ms
		if (currentTime - lastShotTime > fireCooldown) {
			fireBullet();
			lastShotTime = currentTime;
		}
	}
}

function fireBullet() {
	if (spaceShipProp.bulletsLeft === 0) return;

	for (let bul of bullets) {
		if (bul.data.get("isLive") === true) continue

		bul.data.set("isLive", true);
		const shipPos = spaceShip.getPosition();
		const shipDir = spaceShip.getDirection();
		const halfShipWidth = spaceShip.width / 2;

		bul.moveTo(
			shipPos.x + halfShipWidth * Math.cos(shipDir),
			shipPos.y + halfShipWidth * Math.sin(shipDir)
		);

		bul.setRotation(shipDir);
		spaceShipProp.bulletsLeft--;
		break;
	}
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