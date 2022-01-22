class Game
{
    static #RecallFunction = null;
    static #OldTime = 0;
    static #Ticks = 0;

    static DeltaTime = 0;
    static FPS = 0;

    static Start(func)
    {
        Game.#RecallFunction = func;
        Game.#Ticks = 0;
        window.requestAnimationFrame(func);
    }

    static Update(ts)
    {
        Game.DeltaTime = (ts - Game.#OldTime) / 1000;
        Game.#OldTime = ts;
        Game.FPS = (1 / Game.DeltaTime);
    }

    static Recall()
    {
        Game.#Ticks ++;
        window.requestAnimationFrame(Game.#RecallFunction);
    }
    
    static get Ticks()
    {
        return Game.#Ticks;
    }
}