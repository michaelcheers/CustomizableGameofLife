using Bridge;
using Bridge.Html5;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace CustomizableGameofLife
{
    public static class App
    {
        public const int xMultiplier = 20, yMultiplier = 20;
        public static int screenWidth = Window.InnerWidth, screenHeight = Window.InnerHeight;
        public static int width = screenWidth / xMultiplier, height = screenHeight / yMultiplier;

        public static HTMLDivElement Hotbar = new HTMLDivElement
        {
            Style = {
                Position = Position.Absolute,
                Left = "100px",
                Top = $"{Window.InnerHeight - 40}px"
            }
        }

            .Add(new HTMLButtonElement
            {
                ClassName = "btn btn-primary", OnClick = e => Reset(makeBlank: true)
            }.Add("Blank"))

            .Add(new HTMLButtonElement
            {
                ClassName = "btn btn-primary", OnClick = e => Reset()
            }.Add("Reset"))

            .Add(new HTMLButtonElement
            {
                ClassName = "btn btn-primary", OnClick = e => GetCoordinates()
            }.Add("Get Coordinates"))
            
            .Add(new HTMLButtonElement
            {
                ClassName = "btn btn-primary", OnClick = e => SaveAsStarter()
            }.Add("Save as Starter"))

            .Add(PlayButton = new HTMLButtonElement
            {
                ClassName = "btn btn-primary", OnClick = e => InvertIsPlaying()
            }.Add("▶"))
            
            .Add(new HTMLButtonElement
            {
                ClassName = "btn btn-primary", OnClick = e => ShowModal(ModalType.Settings)
            }.Add("⚙"));

        public static HTMLDivElement RightHotbar = new HTMLDivElement
        {
            Style = {
                Position = Position.Absolute,
                Right = "100px",
                Top = $"{Window.InnerHeight - 40}px"
            }
        }
            .Add(new HTMLButtonElement
            {
                ClassName = "btn btn-info",
                OnClick = e => ShowModal(ModalType.NotableObjects)
            }.Add("Notable Objects"));

        public static void Reset (bool makeBlank = false)
        {
            if (!Global.Confirm("Any unsaved changes will be lost. Continue?")) return;
            Squares.Clear();
            if (!makeBlank)
            {
                offsetPos = (0, 0);
                object starterPositions = Global.LocalStorage.GetItem("starterPositions");
                if (starterPositions != null)
                {
                    string s = (string)starterPositions;
                    if (!string.IsNullOrEmpty(s))
                        foreach (var pos in (JsonConvert.DeserializeObject<(int x, int y)[]>(s)))
                            Squares.Add(pos);
                }
            }
            if (playing)
                InvertIsPlaying();
            Draw();
        }

        public static List<(int x, int y)> GetCoordinatesInteral()
        {
            (int x, int y) offsetCoords = (NegDiv(offsetPos.x, xMultiplier), NegDiv(offsetPos.y, yMultiplier));
            return Squares.ToList().ConvertAll(s => (x: s.x + offsetCoords.x, y: s.y + offsetCoords.y));
        }

        public static List<(int x, int y)> GetNormalizedCoordinates ()
        {
            List<(int x, int y)> coords = GetCoordinatesInteral();
            coords = coords.Where(c => c.x >= 0 && c.y >= 0 && c.x < width && c.y < height).ToList();
            int minX = coords.Min(c => c.x), minY = coords.Min(c => c.y);
            coords = coords.Select(c => (c.x - minX, c.y - minY)).ToList();
            return coords;
        }

        public static void GetCoordinates ()
        {
            string codeGenerated = $@"(new HashSet<(int x, int y)>
{{
    {string.Join(",\n    ", GetNormalizedCoordinates().Select(t => $"({t.x}, {t.y})"))}
}}, ""Untitled Object"", {JSON.Stringify($"{string.Concat(deadRules.Select(k => k ? 1 : 0))} / {string.Concat(livingRules.Select(k => k ? 1 : 0))}")})";
            HTMLDivElement modal, modalContent = 
                new HTMLDivElement { ClassName = "modal-content" }
                    .AddTo(new HTMLDivElement { ClassName = "modal-dialog" }
                        .AddTo(modal = new HTMLDivElement { ClassName = "modal", Style = { Display = "inherit" } }
                            .AddTo(Document.Body)
                        )
                    );
            modalContent.Add(

                new HTMLDivElement
                {
                    ClassName = "modal-header"
                }

                    .Add(new HTMLButtonElement
                    {
                        ClassName = "btn-close",
                        OnClick = e => modal.Remove()
                    }
                        .Add(new HTMLSpanElement
                        {
                            InnerHTML = "&times;"
                        })


                ),


                new HTMLPreElement
                {
                    ClassName = "modal-body",
                    Style =
                    {
                        ["user-select"] = "text"
                    }
                }.Add(codeGenerated)
            );
        }

        public static void SaveAsStarter ()
        {
            Global.LocalStorage.SetItem(
                "starterPositions", JsonConvert.SerializeObject(GetCoordinatesInteral())
            );
        }

        public static HTMLDivElement SettingsPopup, NotableObjectsPopup;

        public static HTMLDivElement CreatePopup()
            => new HTMLDivElement
            {
                Style =
                {
                    FontSize = "1.5rem",
                    BackgroundColor = "white",
                    Position = Position.Fixed,
                    Top = "0px",
                    Left = "25%",
                    Width = "50%",
                    Height = "100%",
                    Display = Display.None
                }
            };

        public static HTMLDivElement PopupContainer = new HTMLDivElement
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
            .Add(SettingsPopup = CreatePopup())
            .Add(NotableObjectsPopup = CreatePopup());

        public static HTMLButtonElement SettingsButton;

        public static HTMLButtonElement PlayButton;

        public static void InvertIsPlaying ()
        {
            playing = !playing;
            PlayButton.InnerHTML = playing ? "⏸" : "▶";
        }


        public static bool playing = false;

        public static bool[] livingRules = new bool[9] { false, false, true, true, false, false, false, false, false };
        public static bool[] deadRules   = new bool[9] { false, false, false, true, false, false, false, false, false };

        public static HTMLCanvasElement CreateCanvas ()
            => new HTMLCanvasElement { Width = screenWidth, Height = screenHeight };
        public static HTMLCanvasElement CreateTopCanvas()
            => new HTMLCanvasElement { Width = width + 2, Height = height + 2 };
        public static HTMLCanvasElement CreateBottomCanvas()
            => new HTMLCanvasElement { Width = screenWidth + 2 * xMultiplier, Height = screenHeight + 2 * yMultiplier };

        public static HTMLCanvasElement DOMCanvas = CreateCanvas(), BottomCanvas = CreateBottomCanvas(), TopCanvas = CreateTopCanvas();
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

        public enum ModalType
        {
            Settings,
            NotableObjects
        }

        public static void ShowModal (ModalType modalType)
        {
            PopupContainer.Style.Display = "";
            HTMLDivElement toShow;
            switch (modalType)
            {
                case ModalType.Settings:
                    toShow = SettingsPopup;
                    break;
                case ModalType.NotableObjects:
                    toShow = NotableObjectsPopup;
                    break;
                default:
                    throw new ArgumentException(((int)modalType).ToString(), nameof(modalType));
            }
            foreach (HTMLDivElement div in new[] { SettingsPopup, NotableObjectsPopup })
            {
                div.Style.Display = div == toShow ? "" : "none";
            }
        }

        public static void HideModal ()
        {
            PopupContainer.Style.Display = Display.None;
            SettingsPopup.Style.Display = Display.None;
            NotableObjectsPopup.Style.Display = Display.None;
        }

        public static HTMLCanvasElement DrawShape (HashSet<(int x, int y)> Squares)
        {
            const int xMultiplier = App.xMultiplier * 2;
            const int yMultiplier = App.yMultiplier * 2;

            // Getting width and height of shape
            int width = Squares.Max(s => s.x) + 1;
            int height = Squares.Max(s => s.y) + 1;
            // Drawing on inner canvas
            HTMLCanvasElement innerCanvas = new HTMLCanvasElement
            {
                Width = width,
                Height = height
            };
            CanvasRenderingContext2D context = innerCanvas.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);
            Uint8ClampedArray imageDataArray = CreateImageDataArray(width, height);
            foreach ((int x, int y) in Squares)
            {
                imageDataArray[(x + y * width) * 4 + 3] = 255;
            }
            ImageData imageData = new ImageData(imageDataArray, (uint)width, (uint)height);
            context.PutImageData(imageData, 0, 0);
            // Resizing to upper canvas
            HTMLCanvasElement outerCanvas = new HTMLCanvasElement
            {
                Width = width * xMultiplier,
                Height = height * yMultiplier
            };
            CanvasRenderingContext2D outerContext = outerCanvas.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);
            outerContext.ImageSmoothingEnabled = false;
            outerContext.DrawImage(innerCanvas, 0, 0, outerCanvas.Width, outerCanvas.Height);

            return outerCanvas;
        }

        public static Uint8ClampedArray CreateImageDataArray (int width, int height)
            => new Uint8ClampedArray(width * height * 4);

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
            Document.Body.AppendChild(PopupContainer);
            Document.Body.AppendChild(new HTMLStyleElement { InnerHTML = "td, th { border: 1px solid black; padding: 5px } button { margin-right: 5px }" });

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

            List<(string name, bool[] livingRules, bool[] deadRules)> presetsList = new List<(string name, bool[] livingRules, bool[] deadRules)>()
            {
                (
                    "Conway's Game of Life Preset",
                    new bool[9] { false, false, true, true, false, false, false, false, false },
                    new bool[9] { false, false, false, true, false, false, false, false, false }
                ),
                (
                    "Immortal Cells Preset",
                    new bool[9] { true, true, true, true, true, true, true, true, true },
                    new bool[9] { false, false, false, true, false, false, false, false, false }
                ),
                (
                    "Almost Immortal Cells Preset",
                    new bool[9] { true, true, true, true, true, true, true, true, false },
                    new bool[9] { false, false, false, true, false, false, false, false, false }
                ),
                (
                    "Alternate Conway's Game of Life Preset",
                    new bool[9] { false, false, true, false, true, false, false, false, false },
                    new bool[9] { false, false, false, true, false, true, false, false, false }
                ),
            };

            HTMLDivElement presetsDiv = new HTMLDivElement { Style = { TextAlign = TextAlign.Center } };

            foreach ((string name, bool[] livingRules, bool[] deadRules) in presetsList)
            {
                presetsDiv.Add(new HTMLDivElement().Add(
                    new HTMLAnchorElement
                    {
                        Href = "javascript:void(0)",
                        Style = { FontSize = "1rem" },
                        OnClick = e => ApplyPreset(livingRules: livingRules, deadRules: deadRules )
                    }
                    .Add(name)
                ));
            }

            SettingsPopup.Add(adjacentCellsTable);
            SettingsPopup.Add(new HTMLBRElement(), presetsDiv, new HTMLBRElement());
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
                    HideModal();
                }
            }.Add("Save Changes"));

            NotableObjectsPopup.Add(new HTMLButtonElement
            {
                ClassName = "btn btn-light",
                Style = { CssFloat = Float.Right },
                OnClick = e => HideModal()
            }.Add("❌"));
            NotableObjectsPopup.Add(new HTMLDivElement
            {
                Style = { Clear = Clear.Both }
            });
            foreach ((HashSet<(int x, int y)> objectDetails, string description, string rules) in NotableObjectsList.NotableObjects)
            {
                HTMLDivElement objectInfo = new HTMLDivElement
                {
                    Style = { Width = "30rem" }
                }

                    .AddTo(new HTMLDivElement
                    {
                        Style =
                        {
                            Display = Display.Flex,
                            AlignItems = AlignItems.Center,
                            FlexDirection = FlexDirection.Column
                        }
                    }.AddTo(NotableObjectsPopup));
                objectInfo.Add(new HTMLDivElement
                {
                    Style =
                    {
                        Display = Display.Flex,
                        AlignItems = AlignItems.Center,
                        FlexDirection = FlexDirection.Column
                    }
                }.Add(DrawShape(objectDetails)));
                objectInfo.Add(new HTMLDivElement().Add(description));
                objectInfo.Add(rules);
                objectInfo.Add(new HTMLBRElement());
                objectInfo.Add(new HTMLBRElement());
            }

            HTMLDivElement backgroundDiv = new HTMLDivElement { Style = { Position = Position.Relative, MinWidth = "0", MinHeight = "0" }};
            DOMCanvas.Style.Overflow = Overflow.Hidden;
            DOMCanvas.Style.ZIndex = "-1";
            DOMCanvas.Style.Position = "absolute";
            DOMCanvas.Style.Left = "0px";
            DOMCanvas.Style.Top = "0px";
            backgroundDiv.Add(DOMCanvas);
            backgroundDiv.Add(Hotbar);
            backgroundDiv.Add(RightHotbar);
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
            Uint8ClampedArray imageDataArray = CreateImageDataArray(width + 2, height + 2);
            foreach ((int x, int y) in Squares)
            {
                int drawX = x + (offsetX / xMultiplier) + 1, drawY = y + (offsetY / yMultiplier) + 1;
                if (drawX < 0 || drawX >= width + 2 || drawY < 0 || drawY >= height + 2) continue;
                int idx = drawX + drawY * (width + 2);
                imageDataArray[idx * 4 + 3] = 255;
            }
            ImageData imageData = new ImageData(imageDataArray, (uint)(width + 2), (uint)(height + 2));
            TopCanvasContext.PutImageData(imageData, 0, 0);
            DOMCanvasContext.DrawImage(BottomCanvas, offsetX % xMultiplier - xMultiplier, offsetY % yMultiplier - yMultiplier);
            DOMCanvasContext.ImageSmoothingEnabled = false;
            DOMCanvasContext.DrawImage(TopCanvas, (offsetX % xMultiplier) - xMultiplier, (offsetY % yMultiplier) - yMultiplier, (width + 2) * xMultiplier, (height + 2) * yMultiplier);
        }

        public static int frameNum = 0;

        public static void NextFrame ()
        {
            if (!playing) return;

            bool skipFrames = Squares.Count >= 250;
            int updatesPerDraw = 1;// skipFrames ? 2 : 1;
            frameNum++;
            if (skipFrames && (frameNum % updatesPerDraw) != 0) return;

            for (int n = 0; n < updatesPerDraw; n++)
                Update();
            Draw();
        }
    }
}
