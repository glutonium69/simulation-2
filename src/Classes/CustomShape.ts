import { Vertex } from "../utils";
import Shape from "./Shape";

export default class CustomShape extends Shape {
    constructor(
        protected ctx: CanvasRenderingContext2D,
        protected position: Vertex,
        public shapeVertecies: Vertex[],
        public fillColor: string
    ) {
        const furthestVertex = shapeVertecies.reduce((prev, current) => {
            return Math.max(prev, Math.sqrt(current.x ** 2 + current.y ** 2));
        }, 0);

        super(ctx, shapeVertecies.length, position, furthestVertex * 2, furthestVertex * 2, fillColor);
        this.setVertecies();
    }

    protected setVertecies() {
        this.vertecies = this.shapeVertecies.map(vertex => {
            const dis = Math.sqrt(vertex.x ** 2 + vertex.y ** 2);
            const angle = Math.atan2(vertex.y, vertex.x);

            return {
                x: this.directionalVec.x + dis * Math.cos(angle + this.rotationalVec.argument - Math.PI / 2),
                y: this.directionalVec.y + dis * Math.sin(angle + this.rotationalVec.argument - Math.PI / 2)
            }
        })
    }
}