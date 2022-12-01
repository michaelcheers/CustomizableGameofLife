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
        public static int xMultiplier = 20;
        public static int yMultiplier => xMultiplier;
        public static double actualXMultiplier => Grid is HexGrid ? xMultiplier * 2 * HexGrid.cos60 : xMultiplier;
        public static double actualYMultiplier => Grid is HexGrid ? yMultiplier * 2 * HexGrid.sin60 : yMultiplier;
        public static int screenWidth = Window.InnerWidth, screenHeight = Window.InnerHeight;
        public static int width => (int)Math.Ceiling((double)screenWidth / xMultiplier);
        public static int height => (int)Math.Ceiling((double)screenHeight / yMultiplier);

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

            //.Add(new HTMLButtonElement
            //{
            //    ClassName = "btn btn-primary", OnClick = e => GetCoordinates()
            //}.Add("Get Coordinates"))

            .Add(new HTMLButtonElement
            {
                ClassName = "btn btn-primary",
                OnClick = e => SaveAsStarter()
            }.Add("Save as Starter"))

            .Add(new HTMLButtonElement
            {
                ClassName = "btn btn-primary", OnClick = e => Zoom(zoomIn: false)
            }.Add("Zoom Out"))

            .Add(new HTMLButtonElement
            {
                ClassName = "btn btn-primary", OnClick = e => Zoom(zoomIn: true)
            }.Add("Zoom In"))

            .Add(NextGridTypeButton = new HTMLButtonElement
            {
                ClassName = "btn btn-primary", OnClick = e => NextGridType()
            }.Add(GridType.Square.ToCamelString()))

            .Add(NextSquareTypeButton = new HTMLButtonElement
            {
                ClassName = "btn btn-primary", OnClick = e => NextSquareType()
            }.Add("Wall"))

            .Add(PlayButton = new HTMLButtonElement
            {
                ClassName = "btn btn-primary", OnClick = e => InvertIsPlaying()
            }.Add("▶"))
            
            .Add(new HTMLButtonElement
            {
                ClassName = "btn btn-primary", OnClick = e => ShowModal(ModalType.Settings)
            }.Add("⚙"));

        public static SquareType SquareTypePlacing = SquareType.Count;
        public static GridType CurrentGridType = GridType.Square;
        public static HTMLButtonElement NextGridTypeButton, NextSquareTypeButton;

        public static void Zoom (bool zoomIn)
        {
            xMultiplier += zoomIn ? 1 : -1;
            if (xMultiplier <= 1)
                xMultiplier = 2;
            Draw();
        }

        public static void NextSquareType ()
        {
            SquareTypePlacing = (SquareType)(((int)SquareTypePlacing + 1) % (int)(SquareType.Count + 1));
            NextSquareTypeButton.InnerHTML = SquareTypePlacing == SquareType.Count ? "Wall" : SquareTypePlacing.ToCamelString();
        }

        public static void NextGridType()
        {
            CurrentGridType = (GridType)(((int)CurrentGridType + 1) % (int)GridType.Count);
            NextGridTypeButton.InnerHTML = CurrentGridType.ToCamelString();
            if (CurrentGridType == GridType.Triangle)
                xMultiplier *= 2;
            else if (CurrentGridType == GridType.Square)
                xMultiplier /= 2;
            switch (CurrentGridType)
            {
                case GridType.Square:
                    Grid = new SquareGrid();
                    break;
                case GridType.Hex:
                    Grid = new HexGrid();
                    break;
                case GridType.Triangle:
                    Grid = new TriangleGrid();
                    break;
            }
            Draw();
        }

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
            Grid.Clear();
            if (!makeBlank && Grid is Grid<(int x, int y)> grid)
            {
                offsetPos = (0, 0);
                object starterPositions = Global.LocalStorage.GetItem("starterPositions");
                if (starterPositions != null)
                {
                    string s = (string)starterPositions;
                    if (!string.IsNullOrEmpty(s))
                    {
                        var jsonRaw = JSON.Parse(s).ToDynamic();
                        if (jsonRaw.length == 0 || jsonRaw[0].Item3 == null)
                        {
                            foreach (var pos in (JsonConvert.DeserializeObject<(int x, int y)[]>(s)))
                                grid.Squares.Add(pos, SquareType.Cell);
                        }
                        else
                            foreach (var squareInfo in (JsonConvert.DeserializeObject<(int x, int y, SquareType squareType)[]>(s)))
                                grid.Squares.Add((squareInfo.x, squareInfo.y), squareInfo.squareType);
                    }
                }
            }
            if (playing)
                InvertIsPlaying();
            Draw();
        }

        public static List<(int x, int y, SquareType squareType)> GetCoordinatesInteral()
        {
            if (Grid is Grid<(int x, int y)> g)
            {
                (int x, int y) offsetCoords = (NegDiv(offsetPos.x, (int)actualXMultiplier), NegDiv(offsetPos.y, (int)actualYMultiplier));
                return g.Squares.ToList().ConvertAll(s => (x: s.Key.x + offsetCoords.x, y: s.Key.y + offsetCoords.y, squareType: s.Value));
            }
            else
                return new List<(int x, int y, SquareType squareType)>();
        }

        //public static List<(int x, int y, SquareType squareType)> GetNormalizedCoordinates ()
        //{
        //    List<(int x, int y, SquareType squareType)> coords = GetCoordinatesInteral();
        //    coords = coords.Where(c => c.x >= 0 && c.y >= 0 && c.x < width && c.y < height).ToList();
        //    int minX = coords.Min(c => c.x), minY = coords.Min(c => c.y);
        //    coords = coords.Select(c => (c.x - minX, c.y - minY, c.squareType)).ToList();
        //    return coords;
        //}

        //        public static void GetCoordinates ()
        //        {
        //            string codeGenerated = $@"(new HashSet<(int x, int y)>
        //{{
        //    {string.Join(",\n    ", GetNormalizedCoordinates().Select(t => $"({t.x}, {t.y})"))}
        //}}, ""Untitled Object"", {JSON.Stringify($"{(adjacencyRules.All(a => a == AdjacencyType.One) ? "" : (string.Concat(adjacencyRules.Select(k => (int)k))) + " -> ")}{string.Concat(deadRules.Select(k => k ? 1 : 0))} / {string.Concat(livingRules.Select(k => k ? 1 : 0))}")})";
        //            HTMLDivElement modal, modalContent = 
        //                new HTMLDivElement { ClassName = "modal-content" }
        //                    .AddTo(new HTMLDivElement { ClassName = "modal-dialog" }
        //                        .AddTo(modal = new HTMLDivElement { ClassName = "modal", Style = { Display = "inherit" } }
        //                            .AddTo(Document.Body)
        //                        )
        //                    );
        //            modalContent.Add(

        //                new HTMLDivElement
        //                {
        //                    ClassName = "modal-header"
        //                }

        //                    .Add(new HTMLButtonElement
        //                    {
        //                        ClassName = "btn-close",
        //                        OnClick = e => modal.Remove()
        //                    }
        //                        .Add(new HTMLSpanElement
        //                        {
        //                            InnerHTML = "&times;"
        //                        })


        //                ),


        //                new HTMLPreElement
        //                {
        //                    ClassName = "modal-body",
        //                    Style =
        //                    {
        //                        ["user-select"] = "text"
        //                    }
        //                }.Add(codeGenerated)
        //            );
        //        }

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

        public static bool[] livingRules   = new bool[9] { false, false, true, true, false, false, false, false, false };
        public static bool[] deadRules     = new bool[9] { false, false, false, true, false, false, false, false, false };
        public static AdjacencyType[] adjacencyRules = new AdjacencyType[maxAdjacentCells] { AdjacencyType.One, AdjacencyType.One, AdjacencyType.One, AdjacencyType.One, AdjacencyType.One, AdjacencyType.One, AdjacencyType.One, AdjacencyType.One, AdjacencyType.One, AdjacencyType.One, AdjacencyType.One, AdjacencyType.One };

        public static HTMLCanvasElement CreateCanvas ()
            => new HTMLCanvasElement { Width = screenWidth, Height = screenHeight };
        public static HTMLCanvasElement CreateTopCanvas()
            => new HTMLCanvasElement { Width = width + 2, Height = height + 2 };
        public static double hypo(double x, double y)
        {
            return Math.Sqrt(Math.Pow(x, 2) + Math.Pow(y, 2));
        }
        public static HTMLCanvasElement CreateBottomCanvas()
        {
            HTMLCanvasElement BottomCanvas = Grid is HexGrid ?
                new HTMLCanvasElement
                {
                    Width = DOMCanvas.Width + 4 * xMultiplier,
                    Height = DOMCanvas.Height + 4 * yMultiplier
                } :
                new HTMLCanvasElement
                {
                    Width = screenWidth + 2 * xMultiplier,
                    Height = screenHeight + 2 * yMultiplier
                };
            var BottomCanvasContext = BottomCanvas.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);
            BottomCanvasContext.StrokeStyle = "black";
            BottomCanvasContext.Translate(0.5, 0.5);
            BottomCanvasContext.LineWidth = 1;
            if (Grid is HexGrid h)
            {
                BottomCanvasContext.StrokeStyle = "black";
                for (int a = -(int)hypo(width, height); a < (int)hypo(width, height); a++)
                {
                    for (int b = -(int)hypo(width, height); b < (int)hypo(width, height); b++)
                    {
                        (int x, int y) = h.GetDrawPosition((a, b));
                        BottomCanvasContext.DrawHexagon(x, y, xMultiplier * 2 / 3, stroke: true);
                    }
                }
            }
            else if (Grid is TriangleGrid t/* || Grid is HexGrid*/)
            {
                for (int a = -(int)hypo(width, height); a < (int)hypo(width, height); a++)
                {
                    for (int b = -(int)hypo(width, height); b < (int)hypo(width, height); b++)
                    {
                        for (TriangleLocation tl = TriangleLocation.TopLeft; tl < TriangleLocation.Count; tl++)
                        {
                            (int x, int y) = t.GetDrawPosition((a, b, tl));
                            BottomCanvasContext.DrawTriangle(x, y, xMultiplier * 2 / 3, tl, stroke: true);
                        }
                    }
                }
                //HexGrid grid = new HexGrid();
                //double xOffset = width / 2 * App.xMultiplier + offsetPos.x
                //     , yOffset = height * App.xMultiplier + offsetPos.y;

                //int minWidth = -2, minHeight = -2;
                //int maxWidth = (int)Math.Ceiling(hypo(width, height)), maxHeight = (int)Math.Ceiling(hypo(width, height));
                //for (int _30l = minWidth - 2; _30l <= (maxWidth + 2); _30l++)
                //{
                //    var pos1 = grid.GetDrawPosition((_30l, minHeight - 3));
                //    var pos2 = grid.GetDrawPosition((_30l, maxHeight + 3));
                //    BottomCanvasContext.MoveTo(pos1.x + xOffset, pos1.y + yOffset);
                //    BottomCanvasContext.LineTo(pos2.x + xOffset, pos2.y + yOffset);
                //}
                //for (int _30r = minHeight - 2; _30r <= (maxHeight + 2); _30r++)
                //{
                //    var pos1 = grid.GetDrawPosition((minWidth - 3, _30r));
                //    var pos2 = grid.GetDrawPosition((maxWidth + 3, _30r));
                //    BottomCanvasContext.MoveTo(pos1.x + xOffset, pos1.y + yOffset);
                //    BottomCanvasContext.LineTo(pos2.x + xOffset, pos2.y + yOffset);
                //}
                //for (int y = minHeight - 2; y <= (maxHeight + 2); y++)
                //{
                //    var pos1 = grid.GetDrawPosition((-width / xMultiplier, y));
                //    var pos2 = grid.GetDrawPosition((y, -width / xMultiplier));
                //    BottomCanvasContext.MoveTo(pos1.x + xOffset, pos1.y + yOffset);
                //    BottomCanvasContext.LineTo(pos2.x + xOffset, pos2.y + yOffset);
                //}
            }
            else if (Grid is SquareGrid)
            {
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
            }
            for (int n = 0; n < 10; n++)
                BottomCanvasContext.Stroke();
            return BottomCanvas;
        }

        public static HTMLCanvasElement DOMCanvas = CreateCanvas();
        public static CanvasRenderingContext2D DOMCanvasContext = DOMCanvas.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);

        public static Grid Grid = new SquareGrid();
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

        public static double NegDivDouble(double a, double b)
            => a >= 0 ? a / b : (a - b + 1) / b;

        public const int maxAdjacentCells = 12;
        public static int currentMaxAdjacentCells => Grid is HexGrid ? 6 : Grid is SquareGrid ? 8 : Grid is TriangleGrid ? 12 : throw new NotImplementedException($"Grid type not found: {Grid.GetType()}");

        static List<HTMLSelectElement> adjacencyRulesCells = new List<HTMLSelectElement>();
        static List<(HTMLInputElement, HTMLInputElement)> optionCells = new List<(HTMLInputElement, HTMLInputElement)>();

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
            int xMultiplier = App.xMultiplier * 2;
            int yMultiplier = App.yMultiplier * 2;

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

        public static HTMLInputElement CreateCheckbox() => new HTMLInputElement
        {
            Type = InputType.Checkbox,
            Style =
            {
                Width = "1rem",
                Height = "1em"
            }
        };

        public static HTMLSelectElement Create01Selector() => new HTMLSelectElement()
            .Add<HTMLSelectElement>(new HTMLOptionElement { Value = "false" }.Add("0"), new HTMLOptionElement { Value = "true" }.Add("1"));

        public static HTMLSelectElement Create012Selector() => new HTMLSelectElement()
            .Add(
                new HTMLOptionElement { Value = "0" }.Add("0"),
                new HTMLOptionElement { Value = "1" }.Add("1"),
                new HTMLOptionElement { Value = "2" }.Add("2")
            );

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
                        if (Script.Write("{0} instanceof Array", rulesObj.adjacencyRules))
                            adjacencyRules = JsonConvert.DeserializeObject<int[]>(JSON.Stringify(rulesObj.adjacencyRules));
                    }
                }
                catch { }
            }
            Document.Body.Style["user-select"] = "none";
            Document.Head.AppendChild(new HTMLLinkElement { Rel = "stylesheet", Href = "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" });
            Document.Body.Style.Margin = "0px";
            Document.Body.AppendChild(PopupContainer);
            Document.Body.AppendChild(new HTMLStyleElement { InnerHTML = "td, th { border: 1px solid black; padding: 5px } button { margin-right: 5px }" });

            HTMLTableElement adjacencyRulesTable = new HTMLTableElement { Style = { MarginLeft = "auto", MarginRight = "auto" } };
            {
                int n = 0;
                for (int y = 0; y < 3; y++)
                {
                    HTMLTableRowElement row = new HTMLTableRowElement().AddTo(adjacencyRulesTable);
                    for (int x = 0; x < 3; x++)
                    {
                        if (x == 1 && y == 1)
                        {
                            row.AppendChild(new HTMLTableDataCellElement());
                            continue;
                        }
                        adjacencyRulesCells.Add(Create012Selector().AddTo(new HTMLTableDataCellElement().AddTo(row)).SetAdjacencyValue(adjacencyRules[n]));
                        n++;
                    }
                }
            }

            HTMLTableElement rulesTable = new HTMLTableElement { Style = { MarginLeft = "auto", MarginRight = "auto" } }.Add(
                new HTMLTableRowElement().Add(
                    new HTMLTableHeaderCellElement().Add("#"),
                    new HTMLTableHeaderCellElement().Add("L"),
                    new HTMLTableHeaderCellElement().Add("D")
                )
            );

            for (int n = 0; n <= currentMaxAdjacentCells; n++)
            {
                HTMLTableRowElement row = new HTMLTableRowElement().AddTo(rulesTable);
                row.Add(new HTMLTableDataCellElement().Add(n.ToString()));
                optionCells.Add((
                    CreateCheckbox().AddTo(new HTMLTableDataCellElement().AddTo(row)).SetBoolValue(livingRules[n]),
                    CreateCheckbox().AddTo(new HTMLTableDataCellElement().AddTo(row)).SetBoolValue(deadRules[n])
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

            SettingsPopup.Add(
                new HTMLDetailsElement { Open = true}.Add(
                    new HTMLSummaryElement().Add("Adjacency Rules"),
                    adjacencyRulesTable
                ),
                new HTMLDetailsElement { Open = true }.Add(
                    new HTMLSummaryElement().Add("Rules"),
                    rulesTable
                )
            );
            SettingsPopup.Add(new HTMLBRElement(), presetsDiv, new HTMLBRElement());
            SettingsPopup.Add(new HTMLButtonElement
            {
                ClassName = "btn btn-primary",
                OnClick = e =>
                {
                    for (int n = 0; n < maxAdjacentCells; n++)
                    {
                        adjacencyRules[n] = adjacencyRulesCells[n].AdjacencyValue();
                    }
                    for (int n = 0; n <= maxAdjacentCells; n++)
                    {
                        livingRules[n] = optionCells[n].Item1.BoolValue();
                        deadRules[n] = optionCells[n].Item2.BoolValue();
                    }
                    Global.LocalStorage.SetItem("rules", JsonConvert.SerializeObject(new
                    {
                        livingRules = livingRules,
                        deadRules = deadRules,
                        adjacencyRules = adjacencyRules
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

            (int x, int y) draggingPos = (0, 0);
            (int x, int y) originalPos = (0, 0);
            bool changingIntent = false;
            void ProcessMouseEvent (MouseEvent<HTMLCanvasElement> e)
            {
                //if ((@event.Buttons & 1) == 0) return;
                var mousePos = e.MousePos();
                Grid.HandleClick((mousePos.x - offsetPos.x, mousePos.y - offsetPos.y), SquareTypePlacing);
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

        public static bool HasDividers (this Dictionary<(int x, int y), DividersInfo> dividers, int x, int y, int L)
        {
            DividersInfo toCheck;
            switch (L)
            {
                case 0:
                    x--;
                    y--;
                    toCheck = DividersInfo.BottomRight;
                    break;
                case 1:
                    y--;
                    toCheck = DividersInfo.Bottom;
                    break;
                case 2:
                    y--;
                    toCheck = DividersInfo.BottomRight;
                    break;
                case 3:
                    x--;
                    toCheck = DividersInfo.Right;
                    break;
                case 5:
                    toCheck = DividersInfo.Right;
                    break;
                case 6:
                    x--;
                    toCheck = DividersInfo.BottomRight;
                    break;
                case 7:
                    toCheck = DividersInfo.Bottom;
                    break;
                case 8:
                    toCheck = DividersInfo.BottomRight;
                    break;
                default:
                    throw new InvalidOperationException();
            }
            return dividers.TryGetValue((x, y), out DividersInfo dividersInfo) && (dividersInfo & toCheck) != 0;
        }

        public static (int xMultiplier, GridType gridType, HTMLCanvasElement canvas) LastBottomCanvas = (0, GridType.Count, null);

        public static byte GetSquareTypeAlpha (SquareType squareType)
            => (byte)(
                    squareType == SquareType.Cell ? 255 :
                    squareType == SquareType.Brick ? 170 :
                    squareType == SquareType.ImmortalCell ? 85 :
                    throw new Exception("Unknown square type")
                );



        public static void Draw()
        {
            HTMLCanvasElement TopCanvas = CreateTopCanvas();
            HTMLCanvasElement BottomCanvas = null;
            if (LastBottomCanvas.xMultiplier == xMultiplier && LastBottomCanvas.gridType == CurrentGridType)
                BottomCanvas = LastBottomCanvas.canvas;
            if (BottomCanvas == null)
            {
                BottomCanvas = CreateBottomCanvas();
                LastBottomCanvas = (xMultiplier, CurrentGridType, BottomCanvas);
            }
            CanvasRenderingContext2D TopCanvasContext = TopCanvas.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);
            DOMCanvasContext.ClearRect(0, 0, DOMCanvas.Width, DOMCanvas.Height);
            (int offsetX, int offsetY) = offsetPos;
            if (Grid is SquareGrid squareGrid)
			{
				Uint8ClampedArray imageDataArray = CreateImageDataArray(width + 2, height + 2);
				foreach ((var pos, SquareType squareType) in squareGrid.Squares)
				{
					var drawPos = GetDrawPos(pos);
					if (drawPos == null)
						continue;
					(int drawX, int drawY) = drawPos.Value;
					int idx = drawX + drawY * (width + 2);
					imageDataArray[idx * 4 + 3] = GetSquareTypeAlpha(squareType);
				}
				ImageData imageData = new ImageData(imageDataArray, (uint)(width + 2), (uint)(height + 2));
				TopCanvasContext.PutImageData(imageData, 0, 0);
                DOMCanvasContext.DrawImage(BottomCanvas, (offsetX % xMultiplier) - xMultiplier, (offsetY % yMultiplier) - yMultiplier);
            }
			else if (Grid is HexGrid h)
            {
                DOMCanvasContext.DrawImage(BottomCanvas, (offsetX % (HexGrid.cos60 * 2 * xMultiplier)) - HexGrid.cos60 * 2 * xMultiplier, (offsetY % (HexGrid.sin60 * 2 * yMultiplier)) - HexGrid.sin60 * 2 * yMultiplier);
                Grid.DrawSquares(((int x, int y) d, SquareType squareType) =>
                {
                    (int drawX, int drawY)? drawPos = GetDOMDrawPos(d);
                    if (!drawPos.HasValue)
                        return;
                    DOMCanvasContext.FillStyle = $"rgba(0, 0, 0, {GetSquareTypeAlpha(squareType) / 255.0})";
                    DOMCanvasContext.DrawHexagon((int)drawPos.Value.drawX, (int)drawPos.Value.drawY, xMultiplier * 2 / 3);
                });
            }
            else if (Grid is TriangleGrid triangleGrid)
            {
                DOMCanvasContext.DrawImage(BottomCanvas, (offsetX % (HexGrid.cos60 * 2 * xMultiplier)) - HexGrid.cos60 * 2 * xMultiplier, (offsetY % (HexGrid.sin60 * 2 * yMultiplier)) - HexGrid.sin60 * 2 * yMultiplier);
                triangleGrid.DrawSquares(((int x, int y) d, (int c0, int c1, TriangleLocation n) coords, SquareType squareType) =>
                {
                    (int drawX, int drawY)? drawPos = GetDOMDrawPos(d);
                    if (!drawPos.HasValue)
                        return;
                    DOMCanvasContext.FillStyle = $"rgba(0, 0, 0, {GetSquareTypeAlpha(squareType) / 255.0})";
                    DOMCanvasContext.DrawTriangle(drawPos.Value.drawX, drawPos.Value.drawY, xMultiplier / 2, coords.n);
                });
            }
            DOMCanvasContext.ImageSmoothingEnabled = false;
            DOMCanvasContext.DrawImage(TopCanvas, (offsetX % xMultiplier) - xMultiplier, (offsetY % yMultiplier) - yMultiplier, (width + 2) * xMultiplier, (height + 2) * yMultiplier);
            (int drawX, int drawY)? GetDrawPos((int x, int y) pos)
            {
                (int x, int y) = pos;
                int drawX = x + (offsetX / xMultiplier) + 1, drawY = y + (offsetY / yMultiplier) + 1;
                if (drawX < 0 || drawX >= width + 2 || drawY < 0 || drawY >= height + 2) return null;
                return (drawX, drawY);
            }
            (int drawX, int drawY)? GetDOMDrawPos ((int x, int y) pos)
            {
                (int x, int y) = pos;
                int drawX = x + offsetX, drawY = y + offsetY;
                if (drawX < 0 || drawX >= screenWidth || drawY < 0 || drawY >= screenHeight) return null;
                return (drawX, drawY);
            }
            (double drawX, double drawY)? GetFinalDrawPos ((int x, int y) pos)
            {
                var p = GetDrawPos(pos);
                if (p == null)
                    return null;
                (double drawX, double drawY) = (p.Value.drawX, p.Value.drawY);
                drawX *= (width + 2) * xMultiplier / TopCanvas.Width;
                drawY *= (height + 2) * yMultiplier / TopCanvas.Height;
                drawX += (offsetX % xMultiplier) - xMultiplier;
                drawY += (offsetY % yMultiplier) - yMultiplier;
                return (drawX, drawY);
            }
            void DrawLine((double drawX, double drawY)? start, (double drawX, double drawY)? end)
            {
                if (!start.HasValue || !end.HasValue)
                    return;
                var startPos = start.Value;
                var endPos = end.Value;

                DOMCanvasContext.BeginPath();
                DOMCanvasContext.MoveTo(startPos.drawX, startPos.drawY);
                DOMCanvasContext.LineTo(endPos.drawX, endPos.drawY);
                DOMCanvasContext.LineWidth = 2;
                DOMCanvasContext.StrokeStyle = "red";// "rgb(170, 170, 170)";
                DOMCanvasContext.Stroke();
            }
            void DrawMarker((double drawX, double drawY)? position)
            {
                if (!position.HasValue)
                    return;
                (double drawX, double drawY) = position.Value;

                DOMCanvasContext.BeginPath();
                DOMCanvasContext.Arc(drawX, drawY, xMultiplier / 8, 0, 2 * Math.PI);
                DOMCanvasContext.FillStyle = "red"; //"rgb(170, 170, 170)";
                DOMCanvasContext.Fill();
            }
            //foreach (((int x, int y) pos, DividersInfo dividers) in Dividers)
            //{
            //    foreach (var divider in new[] { DividersInfo.BottomRight, DividersInfo.Right, DividersInfo.Bottom })
            //    {
            //        if (!dividers.HasFlag(divider))
            //            continue;
            //        switch (divider)
            //        {
            //            case DividersInfo.Right:
            //                (int x, int y) startPos = ((int)(pos.x + 1), (int)pos.y);
            //                (int x, int y) endPos = ((int)(pos.x + 1), (int)(pos.y + 1));
            //                DrawLine(GetFinalDrawPos(startPos), GetFinalDrawPos(endPos));
            //                break;
            //            case DividersInfo.Bottom:
            //                DrawLine(GetFinalDrawPos(((int)(pos.x), (int)(pos.y + 1))), GetFinalDrawPos(((int)(pos.x + 1), (int)(pos.y + 1))));
            //                break;
            //            case DividersInfo.BottomRight:
            //                DrawMarker(GetFinalDrawPos(((int)(pos.x + 1), (int)(pos.y + 1))));
            //                break;
            //            default:
            //                throw new InvalidOperationException();
            //        }
            //    }
            //}
        }

        public static int frameNum = 0;

        public static void NextFrame ()
        {
            if (!playing) return;

            bool skipFrames = Grid.SquareCount >= 250;
            int updatesPerDraw = 1;// skipFrames ? 2 : 1;
            frameNum++;
            if (skipFrames && (frameNum % updatesPerDraw) != 0) return;

            for (int n = 0; n < updatesPerDraw; n++)
                Grid.Update();
            Draw();
        }

        public static void DrawHexagon (this CanvasRenderingContext2D context, int x, int y, int radius, bool stroke = false)
        {
            context.BeginPath();
            context.MoveTo(x + radius, y);
            for (int n = 1; n <= 6; n++)
            {
                double angle = n * Math.PI / 3;
                context.LineTo(x + radius * Math.Cos(angle), y + radius * Math.Sin(angle));
            }
            if (stroke)
                context.Stroke();
            else
                context.Fill();
        }

        public static void DrawTriangle(this CanvasRenderingContext2D context, int hexX, int hexY, int hexRadius, TriangleLocation loc, bool stroke = false)
        {
            context.BeginPath();
            context.MoveTo(hexX, hexY);
            int angleInt = 0;
            switch (loc)
            {
                case TriangleLocation.TopLeft:
                    angleInt = 0;
                    break;
                case TriangleLocation.Top:
                    angleInt = 60;
                    break;
                case TriangleLocation.TopRight:
                    angleInt = 120;
                    break;
                case TriangleLocation.BottomRight:
                    angleInt = 180;
                    break;
                case TriangleLocation.Bottom:
                    angleInt = 240;
                    break;
                case TriangleLocation.BottomLeft:
                    angleInt = 300;
                    break;
                default:
                    throw new InvalidOperationException();
            }
            double angle = angleInt * Math.PI / 180;
            context.LineTo(hexX + hexRadius * Math.Cos(angle), hexY + hexRadius * Math.Sin(angle));
            angle += Math.PI / 3;
            context.LineTo(hexX + hexRadius * Math.Cos(angle), hexY + hexRadius * Math.Sin(angle));
            if (stroke)
                context.Stroke();
            else
                context.Fill();
        }
    }
}
