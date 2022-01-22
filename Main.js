var path_main = CreateElement("div", {id: "Main"}, "body");
var path_canvas = CreateElement("canvas", {id: "RenderContext"}, path_main);
Renderer.Context = path_canvas

Game.Start(Main);

var GameArea = new Rect(Renderer.MaxWidth() / 2 - 400, Renderer.MaxHeight() / 2 - 400, 800, 800);
var numRows = 3;
var numCols = 3;
var selectionX = 0;
var selectionY = 0;
var GameBoard = CreateGameBoard(numRows, numCols);
var currentPlayer = 0;
var pieceSizeScalar = 0.5;
let ai = 'x';
let player = 'o';

var ticks = 0;
function Main(ts)
{
    Game.Update(ts)
    Renderer.Width = Renderer.MaxWidth();
    Renderer.Height = Renderer.MaxHeight();
    Renderer.FillColor = Color.Black;
    Renderer.FillScreen();
    GameArea.x = Renderer.MaxWidth() / 2 - 400;
    GameArea.y = Renderer.MaxHeight() / 2 - 400;

    Renderer.StrokeColor = Color.White;
    Renderer.StrokeWeight = 5;
    Renderer.OutlineRect(GameArea);
    
    for(let i = 0; i < numRows; ++i)
    {
        let y = GameArea.y + (i + 1) * GameArea.h / numRows;
        Renderer.Line(GameArea.left, y, GameArea.right, y);
        for(let j = 0; j < numCols; ++j)
        {
            let x = GameArea.x + (j + 1) * GameArea.w / numCols;
            Renderer.Line(x, GameArea.top, x, GameArea.bottom);

            DrawPiece(GameBoard[i][j], (j * (GameArea.w / numCols)) + GameArea.x + ((GameArea.w / numCols) * pieceSizeScalar / 2), (i * (GameArea.h / numRows)) + GameArea.y + ((GameArea.h / numRows) * pieceSizeScalar / 2), GameArea.w / numCols * pieceSizeScalar, GameArea.h / numRows * pieceSizeScalar);
        }
    }

    let selectionTargetX = Clamp(Snap(Mouse.x - GameArea.x - GameArea.w / numCols / 2, GameArea.w / numCols) + GameArea.x, GameArea.x, GameArea.x + GameArea.w - GameArea.w / numCols);
    let selectionTargetY = Clamp(Snap(Mouse.y - GameArea.y - GameArea.h / numRows / 2, GameArea.h / numRows) + GameArea.y, GameArea.y, GameArea.y + GameArea.h - GameArea.h / numRows);
    selectionX = Lerp(selectionX, selectionTargetX, 0.3);
    selectionY = Lerp(selectionY, selectionTargetY, 0.3);
    
    let col = (Math.round((selectionTargetX - GameArea.x) / (GameArea.w / numCols)));
    let row = (Math.round((selectionTargetY - GameArea.y) / (GameArea.h / numRows)));

    if(GameBoard[row][col] == '')
        Renderer.StrokeColor = Color.Green;
    else
        Renderer.StrokeColor = Color.Red;
    Renderer.OutlineRect(new Rect(selectionX, selectionY, GameArea.w / numCols, GameArea.h / numRows));

    if(currentPlayer)
    {
        if(Mouse.Pressed)
        {
            if(GameBoard[row][col] == '')
            {
                GameBoard[row][col] = player;
                currentPlayer = 0;
            }
        }
    }
    else
    {
        AImove(GameBoard);
    }
    let result = CheckIfWon(GameBoard);
    if(result != 0)
    {
        if(Keyboard.KeyState(Keyboard.Keys.Space).Down)
        {
            GameBoard = CreateGameBoard(numRows, numCols);
            currentPlayer = 0;
        }
    }

    Mouse.Update();
    Game.Recall();
}

let scores = {
    x: 1,
    o: -1,
    tie: 0
};

function AImove(Board) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < numRows; i++)
    {
        for (let j = 0; j < numCols; j++)
        {
            if (Board[i][j] == '')
            {
                Board[i][j] = ai;
                let score = MiniMax(Board, 0, false);
                Board[i][j] = '';
                if (score > bestScore) 
                {
                    bestScore = score;
                    move = { i, j };
                }
            }
        }
    }
    Board[move.i][move.j] = ai;
    currentPlayer = 1;
  }

function MiniMax(board, depth, isMaximizing)
{
    let result = CheckIfWon(board);
    if(result != 0)
    {
        return scores[result]
    }

    if(isMaximizing)
    {
        let bestScore = -Infinity;
        for(let i = 0; i < numRows; i++)
        {
            for(let j = 0; j < numCols; j++)
            {
                if(board[i][j] == '')
                {
                    board[i][j] = ai;
                    let score = MiniMax(board, depth + 1, false);
                    board[i][j] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
        }

        return bestScore;
    }
    else
    {
        let bestScore = Infinity;
        for(let i = 0; i < numRows; i++)
        {
            for(let j = 0; j < numCols; j++)
            {
                if(board[i][j] == '')
                {
                    board[i][j] = player;
                    let score = MiniMax(board, depth + 1, true);
                    board[i][j] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }

        return bestScore;
    }
}

function CreateGameBoard(rows, cols)
{
    let arr = new Array(rows).fill().map(() => Array(cols).fill(''));
    return arr;
}

function Lerp(min, max, t)
{
    return (((min - max) / 2) * Math.cos(t*Math.PI) + ((min + max) / 2));
}

function Snap(val, snap, offset = 0)
{
    return Math.round(val / snap) * snap + offset;
}

function Clamp(val, min, max)
{
    return Math.max(Math.min(val, max), min);
}

function DrawPiece(piece, x, y, w, h)
{
    Renderer.StrokeColor = Color.White
    if(piece == 'x')
    {
        Renderer.Line(x, y, x + w, y + h);
        Renderer.Line(x + w, y, x, y + h);
    }
    else if(piece == 'o')
    {
        Renderer.Ellipse(x, y, w, h);
    }
}

function CheckIfWon(Board)
{
    for(let i = 0; i < numRows; i++)
    {
        let last = Board[i][0];
        for(let j = 1; j < numCols; j++)
        {
            if(Board[i][j] != last)
            {
                last = 0;
                break;
            }
        }
        if(last != 0)
        {
            return last;
            break;
        }
    }

    for(let i = 0; i < numCols; i++)
    {
        let last = Board[0][i];
        for(let j = 1; j < numRows; j++)
        {
            if(Board[j][i] != last)
            {
                last = 0;
                break;
            }
        }
        if(last != 0)
        {
            return last;
            break;
        }
    }

    let last = Board[0][0];
    for(let i = 0; i < numCols; i++)
    {
        if(i < numRows)
        {
            if(Board[i][i] != last)
            {
                last = 0;
                break;
            }
        }
        else
        {
            break;
        }
    }
    if(last != 0)
    {
        return last;
    }

    last = Board[0][numCols - 1];
    for(let i = numCols - 1; i >= 0; i--)
    {
        if(i < numRows)
        {
            if(Board[i][numCols - (i + 1)] != last)
            {
                last = 0;
                break;
            }
        }
        else
        {
            break;
        }
    }
    if(last != 0)
    {
        return last;
    }

    if(numRows != numCols)
    {
        last = Board[numRows - 1][0];
        for(let i = 0; i < numCols; i++)
        {
            if(i < numRows)
            {
                if(Board[numRows - (i + 1)][i] != last)
                {
                    last = 0;
                    break;
                }
            }
            else
            {
                break;
            }
        }
        if(last != 0)
        {
            return last;
        }

        last = Board[numRows - 1][numCols - 1];
        for(let i = numCols - 1; i >= 0; i--)
        {
            if(i < numRows)
            {
                if(Board[numRows - (i + 1)][numCols - (i + 1)] != last)
                {
                    last = 0;
                    break;
                }
            }
            else
            {
                break;
            }
        }
        if(last != 0)
        {
            return last;
        }
    }

    if(!indexOf2d(Board, ''))
        return 'tie';
    
    return 0;
}

function indexOf2d(array2d, itemtofind) {
    return [].concat.apply([], ([].concat.apply([], array2d))).indexOf(itemtofind) !== -1;
}