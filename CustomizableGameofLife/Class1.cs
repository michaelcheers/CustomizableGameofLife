using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CustomizableGameofLife
{
    public static class App
    {
        public const int xMultiplier = 20, yMultiplier = 20;
        public static int screenWidth = Global.Screen.Width, screenHeight = Global.Screen.Height;
        public static int width = screenWidth / xMultiplier, height = screenHeight / yMultiplier;

        public static HTMLDivElement Hotbar = new HTMLDivElement
        {
            Style = {
                Position = Position.Absolute,
                Left = "100px",
                Top = $"{height * yMultiplier - 30}px"
            }
        }.Add(ResetButton = new HTMLButtonElement
        {
            OnClick = e =>
            {
                Squares.Clear();
                Draw();
            }
        }.Add("Reset"));

        public static HTMLDivElement SettingsPopupContainer = new HTMLDivElement
        {
            Style =
            {
                Position = Position.Fixed,
                Top = "0",
                Left = "0",
                Width = "100%",
                ["x-index"] = 999999,
                Height = "100%",
                BackgroundColor = "rgba(0, 0, 0, 0.5)",
                Display = Display.None
            }
        }
            .Add(SettingsPopup = new HTMLDivElement
            {
                Style =
                {
                    FontSize = "1.5rem",
                    BackgroundColor = "white",
                    Position = Position.Fixed,
                    Top = "0px",
                    Left = "25%",
                    Width = "50%",
                    Height = "100%"
                }
            });

        public static HTMLDivElement SettingsPopup;

        public static HTMLButtonElement SettingsButton = new HTMLButtonElement
        {
            InnerHTML = "⚙",
            OnClick = e =>
            {

            }
        };

        public static HTMLButtonElement PlayButton = new HTMLButtonElement
        {
            InnerHTML = "▶",
            Style = { Color = "green" },
            OnClick = e =>
            {
                playing = !playing;
                PlayButton.Style.Color = playing ? "red" : "green";
                PlayButton.InnerHTML = playing ? "⏸" : "▶";
            }
        };
        public static HTMLButtonElement ResetButton;


        public static bool playing = false;

        public static bool[] livingRules = new bool[9] { false, false, true, true, false, false, false, false, false };
        public static bool[] deadRules   = new bool[9] { false, false, false, true, false, false, false, false, false };

        public static HTMLCanvasElement CreateCanvas ()
            => new HTMLCanvasElement { Width = screenWidth, Height = screenHeight };
        public static HTMLCanvasElement CreateBottomCanvas()
            => new HTMLCanvasElement { Width = screenWidth + 2 * xMultiplier, Height = screenHeight + 2 * yMultiplier };

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

        public static int NegDiv (int a, int b)
        {
            int res = a / b;
            return (a < 0 && a != b * res) ? res - 1 : res;
        }

        public const int maxAdjacentCells = 8;

        static List<(HTMLSelectElement, HTMLSelectElement)> optionCells = new List<(HTMLSelectElement, HTMLSelectElement)>();

        static void ApplyPreset(bool[] livingRules, bool[] deadRules)
        {
            for (int n = 0; n <= 8; n++)
            {
                optionCells[n].Item1.SetBoolValue(livingRules[n]);
                optionCells[n].Item2.SetBoolValue(deadRules[n]);
            }
        }

        public static void Main ()
        {
            object rulesObjectStr = Global.LocalStorage.GetItem("rules");
            if (rulesObjectStr is string r)
            {
                try
                {
                    dynamic rulesObj = JSON.Parse(r);
                    if (rulesObjectStr != null)
                    {
                        if (Script.Write("{0} instanceof Array", rulesObj.livingRules))
                            livingRules = JsonConvert.DeserializeObject<bool[]>(JSON.Stringify(rulesObj.livingRules));
                        if (Script.Write("{0} instanceof Array", rulesObj.deadRules))
                            deadRules = JsonConvert.DeserializeObject<bool[]>(JSON.Stringify(rulesObj.deadRules));
                    }
                }
                catch { }
            }
            Document.Body.Style["user-select"] = "none";
            Document.Head.AppendChild(new HTMLLinkElement { Rel = "stylesheet", Href = "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" });
            Document.Body.Style.Margin = "0px";
            Document.Body.AppendChild(SettingsPopupContainer);
            Document.Body.AppendChild(new HTMLStyleElement { InnerHTML = "td, th { border: 1px solid black; padding: 5px }" });

            HTMLTableElement adjacentCellsTable = new HTMLTableElement { Style = { MarginLeft = "auto", MarginRight = "auto" } }.Add(
                new HTMLTableRowElement().Add(
                    new HTMLTableHeaderCellElement().Add("#"),
                    new HTMLTableHeaderCellElement().Add("L"),
                    new HTMLTableHeaderCellElement().Add("D")
                )
            );

            HTMLSelectElement Create01Selector() => new HTMLSelectElement()
                .Add<HTMLSelectElement>(new HTMLOptionElement { Value = "false" }.Add("0"), new HTMLOptionElement { Value = "true" }.Add("1"));

            for (int n = 0; n <= maxAdjacentCells; n++)
            {
                HTMLTableRowElement row = new HTMLTableRowElement().AddTo(adjacentCellsTable);
                row.Add(new HTMLTableDataCellElement().Add(n.ToString()));
                optionCells.Add((
                    Create01Selector().AddTo(new HTMLTableDataCellElement().AddTo(row)).SetBoolValue(livingRules[n]),
                    Create01Selector().AddTo(new HTMLTableDataCellElement().AddTo(row)).SetBoolValue(deadRules[n])
                ));
            }

            HTMLDivElement presets = new HTMLDivElement { Style = { TextAlign = TextAlign.Center } }
            .Add(
                new HTMLAnchorElement
                {
                    Href = "javascript:void(0)",
                    Style = { FontSize = "1rem" },
                    OnClick = e =>
                    {
                        ApplyPreset(
                        livingRules: new bool[9] { false, false, true, true, false, false, false, false, false },
                        deadRules: new bool[9] { false, false, false, true, false, false, false, false, false }
                    );
                    }
                }
                .Add("Conway's Game of Life Preset")
            );

            SettingsButton.OnClick = e => SettingsPopupContainer.Style.Display = "";

            SettingsPopup.Add(adjacentCellsTable);
            SettingsPopup.Add(new HTMLBRElement(), presets, new HTMLBRElement());
            SettingsPopup.Add(new HTMLButtonElement
            {
                ClassName = "btn btn-primary",
                OnClick = e =>
                {
                    for (int n = 0; n <= maxAdjacentCells; n++)
                    {
                        livingRules[n] = optionCells[n].Item1.BoolValue();
                        deadRules[n] = optionCells[n].Item2.BoolValue();
                    }
                    Global.LocalStorage.SetItem("rules", JsonConvert.SerializeObject(new
                    {
                        livingRules = livingRules,
                        deadRules = deadRules
                    }));
                    SettingsPopupContainer.Style.Display = Display.None;
                }
            }.Add("Save Changes"));


            Hotbar.AppendChild(PlayButton);
            Hotbar.AppendChild(SettingsButton);

            HTMLDivElement backgroundDiv = new HTMLDivElement { Style = { Position = Position.Relative, MinWidth = "0", MinHeight = "0" }};
            DOMCanvas.Style.Overflow = Overflow.Hidden;
            DOMCanvas.Style.ZIndex = "-1";
            DOMCanvas.Style.Position = "absolute";
            DOMCanvas.Style.Left = "0px";
            DOMCanvas.Style.Top = "0px";
            backgroundDiv.AppendChild(DOMCanvas);
            //backgroundDiv.AppendChild(new HTMLBRElement());
            backgroundDiv.AppendChild(Hotbar);
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
            (int x, int y) originalPos = (0, 0);
            bool changingIntent = false;
            void ProcessMouseEvent (MouseEvent<HTMLCanvasElement> e)
            {
                //if ((@event.Buttons & 1) == 0) return;
                var mousePos = e.MousePos();
                (int clickX, int clickY) = (NegDiv(mousePos.x - offsetPos.x, xMultiplier), NegDiv((mousePos.y - offsetPos.y), yMultiplier));
                if (!Squares.Remove((clickX, clickY)))
                    Squares.Add((clickX, clickY));
                Draw();
            }

            DOMCanvas.OnMouseDown = e => {
                changingIntent = true;
                (int x, int y) = e.MousePos();
                draggingPos = (x - offsetPos.x, y - offsetPos.y);
                originalPos = offsetPos;
            };
            DOMCanvas.OnMouseUp = e =>
            {
                if (Math.Abs(offsetPos.x - originalPos.x) > xMultiplier || Math.Abs(offsetPos.y - originalPos.y) > yMultiplier)
                    changingIntent = false;
                draggingPos = offsetPos;
                originalPos = (0, 0);
            };
            DOMCanvas.OnMouseMove = e =>
            {
                if ((e.Buttons & 1) == 0) return;
                if (draggingPos == (0, 0)) draggingPos = e.MousePos();
                var mousePos = e.MousePos();
                if (Math.Abs(offsetPos.x - originalPos.x) > xMultiplier || Math.Abs(offsetPos.x - originalPos.x) > yMultiplier)
                    changingIntent = false;
                offsetPos = (mousePos.x - draggingPos.x, mousePos.y - draggingPos.y);
                Draw();
            };
            DOMCanvas.OnClick = e =>
            {
                if (changingIntent)
                {
                    ProcessMouseEvent(e);
                    changingIntent = false;
                }
            };

            Global.SetInterval(NextFrame, 100);

            Draw();
        }

        public static bool updating = false;

        public static int NumberOfAdjacentCells (int x, int y)
        {
            int adjacentCells = 0;
            for (int L = 0; L <= 8; L++)
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

            List<(int, int)> removing = new List<(int, int)>();
            List<(int, int)> adding = new List<(int, int)>();

            foreach ((int x, int y) in Squares)
            {
                int adjacentCells = 0;
                for (int L = 0; L <= 8; L++)
                {
                    if (L == 4) continue;

                    int x_ = x - 1 + (L % 3),
                        y_ = y - 1 + L / 3;

                    if (Squares.Contains((x_, y_)))
                        adjacentCells++;
                    else
                    {
                        // Create new cells.

                        // Optimization for rule of 3 adjacent cells
                        //if (L != 7 && L != 8)
                        //{
                        //}

                        if (deadRules[NumberOfAdjacentCells(x_, y_)])
                            adding.Add((x_, y_));
                    }
                }

                if (!livingRules[adjacentCells])
                    removing.Add((x, y));
            }
            foreach ((int x, int y) in removing)
            {
                if (!Squares.Remove((x, y))) throw new Exception("Square tried to be removed but didn't exist");
            }

            foreach ((int x, int y) in adding)
            {
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
