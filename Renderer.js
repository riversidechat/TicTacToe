class Color
{
    static rLuminosity = 0.299;
    static gLuminosity = 0.587;
    static bLuminosity = 0.114;

    #r
    #g
    #b
    #a

    Grayscale;
    Inverted;

    constructor(r, g, b, a = 255)
    {
        this.#r = r;
        this.#g = g;
        this.#b = b;
        this.#a = a;

        this.Grayscale = false;
        this.Inverted = false;
    }

    set r(r)
    {
        this.#r = r;
    }
    set g(g)
    {
        this.#g = g;
    }
    set b(b)
    {
        this.#b = b;
    }
    set a(a)
    {
        this.#a = a;
    }

    get r()
    {
        return this.GetColorValue(this.#r);
    }
    get g()
    {
        return this.GetColorValue(this.#g);
    }
    get b()
    {
        return this.GetColorValue(this.#b);
    }
    get a()
    {
        return this.#a;
    }

    static get Black()
    {
        return new Color(0, 0, 0, 255);
    }
    static get White()
    {
        return new Color(255, 255, 255, 255);
    }
    static get Red()
    {
        return new Color(255, 0, 0, 255);
    }
    static get Orange()
    {
        return new Color(255, 64, 0, 255);
    }
    static get Yellow()
    {
        return new Color(255, 255, 0, 255);
    }
    static get Green()
    {
        return new Color(0, 255, 0, 255);
    }
    static get Blue()
    {
        return new Color(0, 0, 255, 255);
    }
    static get Purple()
    {
        return new Color(64, 0, 255, 255);
    }
    static get Pink()
    {
        return new Color(255, 0, 255, 255);
    }

    GetColorValue(value)
    {
        if(this.Grayscale)
        {
            return this.GetGrayscale();
        }
        else
        {
            return (this.Inverted) ? 255 - value : value;
        }
    }

    GetGrayscale()
    {
        var grayscale = (this.#r * Color.rLuminosity) + (this.#g * Color.gLuminosity) + (this.#b * Color.bLuminosity);
        return (this.Inverted) ? 255 - grayscale : grayscale;
    }
}

class Renderer
{
    static #canvas;
    static #ctx;
    static #stroke_color = new Color(0, 0, 0, 255);
    static #fill_color = new Color(0, 0, 0, 255);
    static #stroke_weight = 1;
    static #stroke_end = 'round';
    static #stroke_join = 'round';

    static get Context()
    {
        return Renderer.#ctx;
    }
    static set Context(path)
    {
        Renderer.#canvas = document.querySelector(path);
        Renderer.#ctx = Renderer.#canvas.getContext('2d');
    }

    static get Width()
    {
        return Renderer.#canvas.width;
    }
    static set Width(width)
    {
        Renderer.#canvas.width = width;
    }

    static get Height()
    {
        return Renderer.#canvas.height;
    }
    static set Height(height)
    {
        Renderer.#canvas.height = height;
    }

    static get StrokeColor()
    {
        return Renderer.#stroke_color;
    }
    static set StrokeColor(color)
    {
        Renderer.#stroke_color = color;
    }

    static get FillColor()
    {
        return Renderer.#fill_color;
    }
    static set FillColor(color)
    {
        Renderer.#fill_color = color;
    }

    static get StrokeWeight()
    {
        return Renderer.#stroke_weight;
    }
    static set StrokeWeight(weight)
    {
        Renderer.#stroke_weight = weight;
    }

    static get StrokeEnd()
    {
        return Renderer.#stroke_end;
    }
    static set StrokeEnd(type)
    {
        Renderer.#stroke_end = type;
    }

    static get StrokeJoin()
    {
        return Renderer.#stroke_join;
    }
    static set StrokeJoin(type)
    {
        Renderer.#stroke_join = type;
    }

    static #GetFill()
    {
        return `rgba(${Renderer.#fill_color.r}, ${Renderer.#fill_color.g}, ${Renderer.#fill_color.b}, ${(Renderer.#fill_color.a / 255)})`;
    }

    static #GetStroke()
    {
        return `rgba(${Renderer.#stroke_color.r}, ${Renderer.#stroke_color.g}, ${Renderer.#stroke_color.b}, ${(Renderer.#stroke_color.a / 255)})`;
    }

    static FillScreen()
    {
        Renderer.#ctx.fillStyle = Renderer.#GetFill();
        Renderer.#ctx.fillRect(0, 0, Renderer.Width, Renderer.Height);
        
        return this;
    }

    static OutlineRect(rect)
    {
        Renderer.#ctx.strokeStyle = Renderer.#GetStroke();
        Renderer.#ctx.lineWidth = Renderer.#stroke_weight;
        Renderer.#ctx.lineCap = Renderer.#stroke_end;
        Renderer.#ctx.lineJoin = Renderer.#stroke_join;

        Renderer.#ctx.beginPath();

        Renderer.#ctx.moveTo(rect.left, rect.top);
        Renderer.#ctx.lineTo(rect.right, rect.top);
        Renderer.#ctx.lineTo(rect.right, rect.bottom);
        Renderer.#ctx.lineTo(rect.left, rect.bottom);

        Renderer.#ctx.closePath();
        Renderer.#ctx.stroke();

        return this;
    }

    static Line(x0, y0, x1, y1)
    {
        Renderer.#ctx.strokeStyle = Renderer.#GetStroke();
        Renderer.#ctx.lineWidth = Renderer.#stroke_weight;
        Renderer.#ctx.lineCap = Renderer.#stroke_end;
        Renderer.#ctx.lineJoin = Renderer.#stroke_join;

        Renderer.#ctx.beginPath();
        
        Renderer.#ctx.moveTo(x0, y0);
        Renderer.#ctx.lineTo(x1, y1);
        
        Renderer.#ctx.closePath();
        Renderer.#ctx.stroke();
        
        return this;
    }
    
    static Ellipse(x, y, w, h)
    {
        Renderer.#ctx.strokeStyle = Renderer.#GetStroke();
        Renderer.#ctx.lineWidth = Renderer.#stroke_weight;
        
        Renderer.#ctx.beginPath();
        
        Renderer.#ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2, false);

        Renderer.#ctx.closePath();
        Renderer.#ctx.stroke();

        return this;
    }

    static MaxWidth() { return window.innerWidth; }
    static MaxHeight() { return window.innerHeight; }
}