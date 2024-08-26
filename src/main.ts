import Vector2D from './Classes/Vector2D';

const eventObject = {
	walkSpeed: 2,
	rotationSpeed: 5 * Math.PI / 180,
	keysPressed: {
		w: false,
		s: false,
		a: false,
		d: false,
		arrowUp: false,
		arrowDown: false,
		arrowRight: false,
		arrowLeft: false,
	},
	showLocalAxis: false,
	showWorldAxis: false,
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

const vec1 = new Vector2D(-innerWidth / 4, 100, {
	x: -innerWidth / 4,
	y: 0
});

const vec2 = new Vector2D(innerWidth / 4, 100, {
	x: innerWidth / 4,
	y: 0
});

function animate() {
	ctx!.clearRect(0, 0, canvas.width, canvas.height);

	eventObject.keysPressed.w && vec1.walk(eventObject.walkSpeed);
	eventObject.keysPressed.s && vec1.walk(-eventObject.walkSpeed);
	eventObject.keysPressed.d && vec1.rotate(-eventObject.rotationSpeed);
	eventObject.keysPressed.a && vec1.rotate(eventObject.rotationSpeed);

	eventObject.keysPressed.arrowUp && vec2.walk(eventObject.walkSpeed);
	eventObject.keysPressed.arrowDown && vec2.walk(-eventObject.walkSpeed);
	eventObject.keysPressed.arrowRight && vec2.rotate(-eventObject.rotationSpeed);
	eventObject.keysPressed.arrowLeft && vec2.rotate(eventObject.rotationSpeed);

	eventObject.showWorldAxis && Vector2D.drawAxis(ctx!);

	vec1.draw(ctx!, { localAxis: eventObject.showLocalAxis });
	vec2.draw(ctx!, { localAxis: eventObject.showLocalAxis });
	requestAnimationFrame(animate);
}

animate();

window.addEventListener("keydown", e => {

	switch (e.key) {
		case 'w':
			eventObject.keysPressed.w = true;
			break;

		case 's':
			eventObject.keysPressed.s = true;
			break;
	}

	switch (e.key) {
		case 'd':
			eventObject.keysPressed.d = true;
			break;

		case 'a':
			eventObject.keysPressed.a = true;
			break;
	}

	switch (e.key) {
		case 'ArrowUp':
			eventObject.keysPressed.arrowUp = true;
			break;

		case 'ArrowDown':
			eventObject.keysPressed.arrowDown = true;
			break;
	}

	switch (e.key) {
		case 'ArrowRight':
			eventObject.keysPressed.arrowRight = true;
			break;

		case 'ArrowLeft':
			eventObject.keysPressed.arrowLeft = true;
			break;
	}
})

window.addEventListener("keyup", e => {

	switch (e.key) {
		case 'w':
			eventObject.keysPressed.w = false;
			break;

		case 's':
			eventObject.keysPressed.s = false;
			break;
	}

	switch (e.key) {
		case 'd':
			eventObject.keysPressed.d = false;
			break;

		case 'a':
			eventObject.keysPressed.a = false;
			break;
	}

	
	switch (e.key) {
		case 'ArrowUp':
			eventObject.keysPressed.arrowUp = false;
			break;

		case 'ArrowDown':
			eventObject.keysPressed.arrowDown = false;
			break;
	}

	switch (e.key) {
		case 'ArrowRight':
			eventObject.keysPressed.arrowRight = false;
			break;

		case 'ArrowLeft':
			eventObject.keysPressed.arrowLeft = false;
			break;
	}
})



const rotationInput = document.getElementById("rotation-speed");
const walkingInput = document.getElementById("walking-speed");
const localAxisInput = document.getElementById("show-local-axis");
const worldAxisInput = document.getElementById("show-world-axis");

// localAxisInput!.addEventListener("change", e => {
// 	eventObject.showLocalAxis = e.target!.checked;
// })

// worldAxisInput!.addEventListener("change", e => {
// 	eventObject.showLocalAxis = e.target!.checked;
// })

// rotationInput!.addEventListener("change", e => {
// 	eventObject.rotationSpeed = Number(e.target!.value) * Math.PI / 180;
// })

// walkingInput!.addEventListener("change", e => {
// 	eventObject.walkSpeed = Number(e.target!.value);
// })