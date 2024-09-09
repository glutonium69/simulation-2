import { Vertex } from "../utils";
import Shape from "./Shape";

export default class Polygon extends Shape {
    constructor(
        protected ctx: CanvasRenderingContext2D,
        public vertexCount: number,
        protected position: Vertex,
        public width: number,
        public fillColor: string
    ) {
        super(ctx, vertexCount, position, width, width, fillColor); // Call the constructor of Shape
    }

    public setVertexCount(count: number) {
        this.vertexCount = count;
        this.setVertecies();
    }

    protected setVertecies() {
        const { x, y } = this.directionalVec.getOrigin();
        const argument = this.rotationalVec.getArgument();

        const angleIncrement = 2 * Math.PI / this.vertexCount;
        const halfWidth = this.width / 2;
        this.vertecies = new Array<Vertex>(this.vertexCount);

        for (let i = 0; i < this.vertexCount; i++) {
            const angle = i * angleIncrement + argument;
            this.vertecies[i] = {
                x: x + halfWidth * Math.cos(angle),
                y: y + halfWidth * Math.sin(angle),
            };
        }
    }


}