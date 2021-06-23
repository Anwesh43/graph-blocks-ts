const w : number = Math.min(window.innerWidth, window.innerHeight) 
const h : number = Math.min(window.innerWidth, window.innerHeight)
const color : string = "#3F51B5"
const sizeFactor : number = 5.6 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const blocks : number = 30 
class DrawingUtil {

    static drawNode(context : CanvasRenderingContext2D, scale : number, x : number, y : number) {
        const size : number = Math.min(w, h) / blocks 
        context.strokeRect(x, y, size, size)
        context.fillRect(x, y, size, size * scale)
    }

}
