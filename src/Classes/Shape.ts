import { Vertex } from "../utils";
import Vector2D from "./Vector2D";
import World from "./World";

export default abstract class Shape {
    public vertecies: Vertex[];
    protected directionalVec: Vector2D;
    protected rotationalVec: Vector2D = new Vector2D(0, 0);
    public data = new Map();

    constructor(
        protected ctx: CanvasRenderingContext2D,
        public vertexCount: number,
        protected position: Vertex,
        public width: number,
        public height: number,
        public fillColor: string
    ) {
        this.vertecies = new Array<Vertex>(vertexCount);
        this.directionalVec = new Vector2D(this.position.x, this.position.y);
    }

    protected abstract setVertecies(): void;

    public getPosition(): Vertex {
        return {
            x: this.directionalVec.x,
            y: this.directionalVec.y
        };
    }

    public getRotation(): number {
        return this.directionalVec.argument;
    }

    public moveTo(x: number, y: number): void {
        this.directionalVec.x = x;
        this.directionalVec.y = y;
        this.setVertecies();
    }

    public walk(displacement: number): void {
        this.directionalVec.walk(displacement);
        this.setVertecies();
    }

    public draw(): void {
        this.ctx.beginPath();
        for (let i = 0; i < this.vertecies.length; i++) {
            const { x, y } = World.coordWorldToScreen(this.vertecies[i]);
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fill();
    }

    public lookAt(x: number, y: number): void {
        this.directionalVec.lookAt(x, y);
        this.setVertecies();
    }

    public rotate(angle: number): void {
        this.directionalVec.argument += angle;
        this.rotationalVec.argument += angle;
        this.setVertecies();
    }

    public spin(angularVelocity: number): void {
        this.rotationalVec.argument += angularVelocity;
        this.setVertecies();
    }

    public setRotation(angle: number): void {
        this.directionalVec.argument = angle;
        this.rotationalVec.argument = angle;
        this.setVertecies();
    }

    public isInsideCanvas(): boolean {
        const { x, y } = World.coordWorldToScreen(this._getTopLeft());

        return (
            x + this.width > 0 &&
            x < this.ctx.canvas.width &&
            y + this.width > 0 &&
            y < this.ctx.canvas.height
        );
    }

    public isColliding(target: Shape): boolean {
        if (this.boundingCircleCollision(target)) {
            return this.separatingAxisTheorem(target);
        }
        return false;
    }

    public boundingCircleCollision(target: Shape): boolean {
        const thisPos = this.getPosition();
        const targetPos = target.getPosition();
        const thisMaxLength = Math.max(this.width, this.height);
        const targetMaxLength = Math.max(target.width, target.height);
        return Math.sqrt(
            (thisPos.x - targetPos.x) ** 2 +
            (thisPos.y - targetPos.y) ** 2
        ) < thisMaxLength / 2 + targetMaxLength / 2;
    }

    public separatingAxisTheorem(target: Shape): boolean {
        const allNormals = [...this._computeNormals(this.vertecies), ...this._computeNormals(target.vertecies)];

        for (let i = 0; i < allNormals.length; i++) {
            const [min1, max1] = this._calculateProjections(this.vertecies, allNormals[i]);
            const [min2, max2] = this._calculateProjections(target.vertecies, allNormals[i]);

            if (max1 < min2 || max2 < min1) {
                return false;
            }
        }

        return true;
    }

    private _computeNormals(vertecies: Vertex[]): Vertex[] {
        const normals = [];
        for (let i = 0; i < vertecies.length; i++) {
            const next = (i + 1) % vertecies.length;
            const edge = {
                x: vertecies[next].x - vertecies[i].x,
                y: vertecies[next].y - vertecies[i].y,
            };
            normals.push({ x: -edge.y, y: edge.x });
        }
        return normals;
    }

    private _calculateProjections(vertecies: Vertex[], axis: Vertex): [number, number] {
        const projectionValues = new Array<number>(vertecies.length);

        for (let i = 0; i < vertecies.length; i++) {
            projectionValues[i] = vertecies[i].x * axis.x + vertecies[i].y * axis.y;
        }

        return [Math.min(...projectionValues), Math.max(...projectionValues)];
    }

    private _getTopLeft(): Vertex {
        const { x, y } = this.getPosition();
        return {
            x: x - this.width / 2,
            y: y + this.width / 2
        }
    }
}
