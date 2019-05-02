export class Player {
    shape: createjs.Shape;
    animationFinished: boolean;
    lastPositionX: number;
    lastPositionY: number;
    w: number;
    h: number;
    createjs: any;
    stage: any;
    constructor(w, h, createjs, stage) {
        this.shape = new createjs.Shape();
        this.animationFinished = true;
        this.w = w;
        this.h = h;
        this.createjs = createjs;
        this.stage = stage;
    }

    public setPosition(x, y) {
        this.shape.x = x;
        this.shape.y = y;
    }

    public getPosition(x, y, direction, step) {
        if (direction == 1) {
            return { x: x, y: y + step };
        }
        else if (direction == 2) {
            return { x: x + step, y: y };
        }
        else if (direction == 3) {
            return { x: x, y: y - step };
        }
        else {
            return { x: x - step, y: y };
        }
    }

    public getRandomInt() {
        let min = 1;
        let max = 5;
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public move() {
        if (this.animationFinished == true) {
            var position = this.getPosition(this.shape.x, this.shape.y, this.getRandomInt(), this.getRandomInt()*15);
           
            if (position.x >= 0 && position.x <= this.w && position.y >= 0 && position.y <= this.h) {

                this.animationFinished = false;
                this.lastPositionX = position.x;
                this.lastPositionY = position.y;
                this.createjs.Tween.get(this.shape, { loop: false })
                    .to({ x: position.x, y: position.y }, this.getRandomInt()*300);
			}
			else {
				var position = this.getPosition(this.shape.x, this.shape.y, this.getRandomInt(), this.getRandomInt()*15);
			}
        }
        this.animationFinished = this.animationFinish();
    }

    public animationFinish() {
        if (this.shape.x == this.lastPositionX && this.shape.y == this.lastPositionY) {
            return true;
        }
        else return false;
    }

    public addToCanvas(color:string) {
        this.shape.graphics.beginFill(color).drawCircle(0, 0, 20);
        this.stage.addChild(this.shape);
        this.stage.update();
    }
}