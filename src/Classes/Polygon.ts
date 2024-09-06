import { Vertex, toRad } from "../utils";
import Vector2D from "./Vector2D";
import World from "./World";

export default class Polygon {
    private _vertecies: Vertex[];
    private _directionalVec: Vector2D;
    private _rotationalVec: Vector2D = new Vector2D(0, 0);
    public data = new Map();

    constructor(
        private ctx: CanvasRenderingContext2D,
        public vertexCount: number,
        private position: Vertex,
        public width: number,
        public fillColor: string
    ) {
        this._vertecies = new Array<Vertex>(vertexCount);
        this._directionalVec = new Vector2D(this.position.x, this.position.y);
        this._setVertecies();
    }

    public setVertexCount(count: number) {
        this.vertexCount = count;
        this._setVertecies();
    }

    public getPosition() {
        return this._directionalVec.getOrigin();
    }

    public getDirection() {
        return this._directionalVec.getArgument();
    }

    public moveTo(x: number, y: number) {
        this._directionalVec.moveTo(x, y);
        this._setVertecies();
    }

    public walk(displacement: number) {
        this._directionalVec.walk(displacement);
        this._setVertecies();
    }

    public draw() {
        this.ctx.beginPath();
        for (let i = 0; i < this._vertecies.length; i++) {
            const { x, y } = World.coordWorldToScreen(this._vertecies[i]);
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

    public lookAt(x: number, y: number) {
        this._directionalVec.lookAt(x, y);
        this._setVertecies();
    }

    public rotate(angle: number) {
        this._directionalVec.rotate(angle);
        this._rotationalVec.rotate(angle);
        this._setVertecies();
    }

    public spin(angularVelocity: number) {
        this._rotationalVec.rotate(angularVelocity);
        this._setVertecies();
    }

    public setRotation(angle: number) {
        this._directionalVec.setRotation(angle);
        this._rotationalVec.setRotation(angle);
        this._setVertecies();
    }

    public isInsideCanvas() {
        const { x, y } = World.coordWorldToScreen(this._getTopLeft());

        return (
            x + this.width > 0 &&
            x < this.ctx.canvas.width &&
            y + this.width > 0 &&
            y < this.ctx.canvas.height
        );
    }

    public isColliding(target: Polygon) {
        if (this._simpleCircleCollisionDetection(target)) {
            return this._SATCollisionDetection(target);
        }
        return false;
    }

    private _simpleCircleCollisionDetection(target: Polygon) {
        const thisPos = this.getPosition();
        const targetPos = target.getPosition();
        return Math.sqrt(
            (thisPos.x - targetPos.x) ** 2 +
            (thisPos.y - targetPos.y) ** 2
        ) < this.width + target.width;
    }

    private _getTopLeft(): Vertex {
        const { x, y } = this.getPosition();
        return {
            x: x - this.width / 2,
            y: y + this.width / 2
        }
    }
    private _SATCollisionDetection(target: Polygon) {
        const allNormals = [...this._getNormals(this._vertecies), ...this._getNormals(target._vertecies)];

        for (let i = 0; i < allNormals.length; i++) {
            const [min1, max1] = this._getMinMax(this._vertecies, allNormals[i]);
            const [min2, max2] = this._getMinMax(target._vertecies, allNormals[i]);

            if (max1 < min2 || max2 < min1) {
                return false;
            }
        }

        return true;
    }

    private _getNormals(vertecies: Vertex[]): Vertex[] {
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

    private _getMinMax(vertecies: Vertex[], axis: Vertex): [number, number] {
        const projectionValues = new Array<number>(vertecies.length);

        for (let i = 0; i < vertecies.length; i++) {
            projectionValues[i] = vertecies[i].x * axis.x + vertecies[i].y * axis.y;
        }

        return [Math.min(...projectionValues), Math.max(...projectionValues)];
    }

    private _setVertecies() {
        const { x, y } = this._directionalVec.getOrigin();
        const argument = this._rotationalVec.getArgument();

        const angleIncrement = 2 * Math.PI / this.vertexCount;
        const halfWidth = this.width / 2;
        this._vertecies = new Array<Vertex>(this.vertexCount);

        for (let i = 0; i < this.vertexCount; i++) {
            const angle = i * angleIncrement + argument;
            this._vertecies[i] = {
                x: x + halfWidth * Math.cos(angle),
                y: y + halfWidth * Math.sin(angle),
            };
        }
    }
}