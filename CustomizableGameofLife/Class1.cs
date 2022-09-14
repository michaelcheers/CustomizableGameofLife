using Bridge.Html5;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CustomizableGameofLife
{
    public static class App
    {
        public const int xMultiplier = 20, yMultiplier = 20;
        public static int width = Global.Screen.Width / xMultiplier, height = Global.Screen.Height / yMultiplier;

        public static HTMLButtonElement PlayButton = new HTMLButtonElement
        {
            InnerHTML = "▶",
            Style = { Color = "green", Position = Position.Absolute, Left = "100px", Top = $"{height * yMultiplier - 30}px", ["user-select"] = "none" },
            OnClick = e =>
            {
                playing = !playing;
                PlayButton.Style.Color = playing ? "red" : "green";
                PlayButton.InnerHTML = playing ? "⏸" : "▶";
            }
        };
        public static bool playing = false;

        public static HTMLCanvasElement CreateCanvas ()
            => new HTMLCanvasElement { Width = Global.Screen.Width, Height = Global.Screen.Height };
        public static HTMLCanvasElement CreateBottomCanvas()
            => new HTMLCanvasElement { Width = Global.Screen.Width + 2 * xMultiplier, Height = Global.Screen.Width + 2 * yMultiplier };

        public static HTMLCanvasElement DOMCanvas = CreateCanvas(), BottomCanvas = CreateBottomCanvas(), TopCanvas = CreateCanvas();
        public static CanvasRenderingContext2D
            TopCanvasContext = TopCanvas.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D),
            BottomCanvasContext = BottomCanvas.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D),
            DOMCanvasContext = DOMCanvas.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);

        public static HashSet<(int x, int y)> Squares = new HashSet<(int x, int y)>();
        public static (int x, int y) offsetPos = (0, 0);

        public static (int x, int y) MousePos (this MouseEvent e)
        {
            var rect = DOMCanvas.GetBoundingClientRect();
            return ((int)(e.ClientX - rect.Left), (int)(e.ClientY - rect.Top));
        }

        public static void Main ()
        {
            Document.Body.Style.Margin = "0px";

            HTMLDivElement backgroundDiv = new HTMLDivElement { Style = { Position = Position.Relative, MinWidth = "0", MinHeight = "0" }};
            DOMCanvas.Style.Overflow = Overflow.Hidden;
            DOMCanvas.Style.ZIndex = "-1";
            DOMCanvas.Style.Position = "absolute";
            DOMCanvas.Style.Left = "0px";
            DOMCanvas.Style.Top = "0px";
            backgroundDiv.AppendChild(DOMCanvas);
            //backgroundDiv.AppendChild(new HTMLBRElement());
            backgroundDiv.AppendChild(PlayButton);
            Document.Body.AppendChild(backgroundDiv);

            BottomCanvasContext.StrokeStyle = "black";
            BottomCanvasContext.Translate(0.5, 0.5);
            BottomCanvasContext.LineWidth = 1;
            for (int x = 0; x <= (width + 2); x++)
            {
                BottomCanvasContext.MoveTo(x * xMultiplier, 0);
                BottomCanvasContext.LineTo(x * xMultiplier, (height + 3) * yMultiplier);
            }
            for (int y = 0; y <= (height + 2); y++)
            {
                BottomCanvasContext.MoveTo(0, y * yMultiplier);
                BottomCanvasContext.LineTo((width + 3) * xMultiplier, y * yMultiplier);
            }
            for (int n = 0; n < 10; n++)
                BottomCanvasContext.Stroke();

            (int x, int y) draggingPos = (0, 0);
            void ProcessMouseEvent (MouseEvent<HTMLCanvasElement> e)
            {
                //if ((@event.Buttons & 1) == 0) return;
                var mousePos = e.MousePos();
                (int clickX, int clickY) = ((mousePos.x - offsetPos.x) / xMultiplier, (mousePos.y - offsetPos.y) / yMultiplier);
                if (!Squares.Remove((clickX, clickY)))
                    Squares.Add((clickX, clickY));
                Draw();
            }

            DOMCanvas.OnMouseDown = e => {
                (int x, int y) = e.MousePos();
                draggingPos = (x - offsetPos.x, y - offsetPos.y);
            };
            DOMCanvas.OnMouseUp = e => draggingPos = offsetPos;
            DOMCanvas.OnMouseMove = e =>
            {
                if ((e.Buttons & 1) == 0) return;
                if (draggingPos == (0, 0)) draggingPos = e.MousePos();
                var mousePos = e.MousePos();
                offsetPos = (mousePos.x - draggingPos.x, mousePos.y - draggingPos.y);
                Draw();
            };
            DOMCanvas.OnClick = ProcessMouseEvent;

            Global.SetInterval(NextFrame, 100);
        }

        public static bool updating = false;

        public static int NumberOfAdjacentCells (int x, int y)
        {
            int adjacentCells = 0;
            for (int L = 0; L < 9; L++)
            {
                if (L == 4) continue;

                int x_ = x - 1 + (L % 3),
                    y_ = y - 1 + L / 3;

                //if (x_ < 0 || x_ >= width || y_ < 0 || y_ >= height) continue;

                if (Squares.Contains((x_, y_)))
                    adjacentCells++;
            }
            return adjacentCells;
        }

        public static void Update()
        {
            //updating = true;

            HashSet<(int, int)> changing = new HashSet<(int, int)>();

            foreach ((int x, int y) in Squares)
            {
                int adjacentCells = 0;
                for (int L = 0; L < 9; L++)
                {
                    if (L == 4) continue;

                    int x_ = x - 1 + (L % 3),
                        y_ = y - 1 + L / 3;

                    //if (x_ < 0 || x_ >= width || y_ < 0 || y_ >= height) continue;

                    if (Squares.Contains((x_, y_)))
                        adjacentCells++;
                    else if (L != 7 && L != 8)
                    {
                        // Exactly 3 adjacent cells needed.
                        if (NumberOfAdjacentCells(x_, y_) == 3 && !Squares.Contains((x_, y_)))
                            changing.Add((x_, y_));
                    }
                }

                    switch (adjacentCells)
                    {
                        case 0:
                        case 1:
                            changing.Add((x, y));
                            break;
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                            changing.Add((x, y));
                            break;
                    }
            }

            foreach ((int x, int y) in changing)
            {
                if (!Squares.Remove((x, y)))
                    Squares.Add((x, y));
            }
        }

        public static void Draw ()
        {
            DOMCanvasContext.ClearRect(0, 0, DOMCanvas.Width, DOMCanvas.Height);
            TopCanvasContext.ClearRect(0, 0, DOMCanvas.Width, DOMCanvas.Height);
            (int offsetX, int offsetY) = offsetPos;
            foreach ((int x, int y) in Squares)
            {
                TopCanvasContext.FillRect(x * xMultiplier + offsetX, y * yMultiplier + offsetY, xMultiplier, yMultiplier);
            }
            DOMCanvasContext.DrawImage(BottomCanvas, offsetX % xMultiplier - xMultiplier, offsetY % yMultiplier - yMultiplier);
            DOMCanvasContext.DrawImage(TopCanvas, 0, 0);
        }

        public static void NextFrame ()
        {
            if (!playing) return;
            Update();
            Draw();
        }
    }
}
