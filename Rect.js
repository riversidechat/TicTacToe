class Rect
{
    constructor(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    get left() { return this.x; }
    get right() { return this.x + this.w; }
    get top() { return this.y; }
    get bottom() { return this.y + this.h; }
    get centerX() { return this.x + (this.w / 2); }
    get centerY() { return this.y + (this.h / 2); }

    set left(left) { this.x = left; }
    set right(right) { this.x = right - this.w; }
    set top(top) { this.y = top; }
    set bottom(bottom) { this.y = bottom - this.h; }
    set centerX(x) { this.x = x - (this.w / 2); }
    set centerY(y) { this.y = y - (this.h / 2); }

    Scale(x, y)
    {
        this.x -= ((this.w * x) - this.w) / 2;
        this.y -= ((this.h * y) - this.h) / 2;
        this.w *= x;
        this.h *= y;
    }

    Inflate(x, y)
    {
        this.x -= x;
        this.y -= y;
        this.w += x * 2;
        this.h += y * 2;
    }

    Collision(rect)
    {
        if(this.left < rect.right)
        {
            if(this.right > rect.left)
            {
                if(this.top < rect.bottom)
                {
                    if(this.bottom > rect.top)
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    static Scale(rect, x, y)
    {
        rect.x -= ((rect.w * x) - rect.w) / 2;
        rect.y -= ((rect.h * y) - rect.h) / 2;
        rect.w *= x;
        rect.h *= y;
    }

    static Inflate(rect, x, y)
    {
        rect.x -= x;
        rect.y -= y;
        rect.w += x * 2;
        rect.h += y * 2;
    }

    static Collision(rect1, rect2)
    {
        if(rect1.left < rect2.right)
        {
            if(rect1.right > rect2.left)
            {
                if(rect1.top < rect2.bottom)
                {
                    if(rect1.bottom > rect2.top)
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}