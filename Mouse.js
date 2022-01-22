class Mouse
{
    constructor() {}
    static x = 0;
    static y = 0;
    static down = false;
    static pressed = false;
    static released = false;

    static Move(e)
    {
        Mouse.x = e.x;
        Mouse.y = e.y;
    }
    static Event(e)
    {
        var state = (e.type == "mousedown");
        Mouse.Down = state;
        Mouse.Pressed = state;
        Mouse.Released = !state;
    }
    static Update()
    {
        Mouse.Pressed = false;
        Mouse.Released = false;
    }
}

document.addEventListener("mousemove", Mouse.Move);
document.addEventListener("mousedown", Mouse.Event);
document.addEventListener("mouseup", Mouse.Event);