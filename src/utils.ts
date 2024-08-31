export function toDeg(angle: number) { return angle * 180 / Math.PI }
export function toRad(angle: number) { return angle * Math.PI / 180 }

export interface Coord {
	world: Vertex;
	screen: Vertex;
}

export interface Vertex {
	x: number,
	y: number
}