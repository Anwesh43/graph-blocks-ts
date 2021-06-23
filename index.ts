const w : number = Math.min(window.innerWidth, window.innerHeight) 
const h : number = Math.min(window.innerWidth, window.innerHeight)
const color : string = "#3F51B5"
const sizeFactor : number = 5.6 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const blocks : number = 30 
const scGap : number = 0.02 

class DrawingUtil {

    static getSize() {
        return Math.min(w, h) / blocks   
    }

    static drawNode(context : CanvasRenderingContext2D, scale : number, x : number, y : number) {
        const size : number = DrawingUtil.getSize()
        context.strokeRect(x, y, size, size)
        context.fillRect(x, y, size, size * scale)
    }

}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D 

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor 
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale : number = 0 
    dir : number = 0 
    prevScale : number = 0 

    update(cb : Function) {
        this.scale += scGap * this.dir 
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir 
            this.dir = 0 
            this.prevScale = this.scale 
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale 
            cb()
        }
    }
}

class Animator {

    animated : boolean = false 
    interval : number 

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }
}

class GBNode {

    down : GBNode 
    right : GBNode 
    state : State = new State()

    constructor(private x : number, private y : number) {
        this.addNeighbor()       
    }

    addNeighbor() {
        const size : number = DrawingUtil.getSize()
        if (this.y < h - size) {
            this.down = new GBNode(this.x, this.y + size)
        }
        if (this.x < w - size) {
            this.right = new GBNode(this.x + size, this.y)
        }
    }
    
    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawNode(context, this.state.scale, this.x, this.y)
        if (this.down) {
            this.down.draw(context)
        }
        if (this.right) {
            this.right.draw(context)
        }
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    consumeNeighbors(cb : Function) {
        if (this.right) {
            cb(this.right)
        }
        if (this.down) {
            cb(this.down)
        }
    }
}

class GraphBlock {

    queue : Array<GBNode> = []
    root : GBNode = new GBNode(0, 0)

    constructor() {
        this.queue.push(this.root)
    }
    draw(context : CanvasRenderingContext2D) {
        this.root.draw(context)
    }

    update(cb : Function) {
        const n = this.queue.length 
        let k = 0 
        for (let i = 0; i < n; i++) {
            this.queue[i].update(() => {
                k++
                if (k == n) {
                    cb()
                    this.remove(n)
                }
            })
        }
    }

    remove(n : number) {
        const nodes : Array<GBNode> = this.queue.splice(0, n)
        nodes.forEach((node : GBNode ) => {
            this.queue.push(node)
        })
    } 

    startUpdating(cb : Function) {
        const n : number = this.queue.length 
        for (let i = 0; i < 4; i++) {
            this.queue[i].startUpdating(() => {
                if (i == 0) {
                    cb()
                }
            })
        }
    }

}