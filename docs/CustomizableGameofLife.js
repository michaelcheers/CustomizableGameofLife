/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2022
 * @compiler Bridge.NET 17.10.1
 */
Bridge.assembly("CustomizableGameofLife", function ($asm, globals) {
    "use strict";

    Bridge.define("CustomizableGameofLife.AdjacencyType", {
        $kind: "enum",
        statics: {
            fields: {
                Zero: 0,
                One: 1,
                Two: 2
            }
        }
    });

    Bridge.define("CustomizableGameofLife.App", {
        main: function Main () {
            var $t, $t1, $t2;
            var ProcessMouseEvent = null;
            var rulesObjectStr = Bridge.global.localStorage.getItem("rules");
            var r;
            if (((r = Bridge.as(rulesObjectStr, System.String))) != null) {
                try {
                    var rulesObj = JSON.parse(r);
                    if (rulesObjectStr != null) {
                        if (rulesObj.livingRules instanceof Array) {
                            var deserialized = Newtonsoft.Json.JsonConvert.DeserializeObject(JSON.stringify(rulesObj.livingRules), System.Array.type(System.Boolean));
                            System.Array.copy(deserialized, 0, CustomizableGameofLife.App.livingRules, 0, deserialized.length);
                        }
                        if (rulesObj.deadRules instanceof Array) {
                            var deserialized1 = Newtonsoft.Json.JsonConvert.DeserializeObject(JSON.stringify(rulesObj.deadRules), System.Array.type(System.Boolean));
                            System.Array.copy(deserialized1, 0, CustomizableGameofLife.App.deadRules, 0, deserialized1.length);
                        }
                        if (rulesObj.adjacencyRules instanceof Array) {
                            var deserialized2 = Newtonsoft.Json.JsonConvert.DeserializeObject(JSON.stringify(rulesObj.adjacencyRules), System.Array.type(CustomizableGameofLife.AdjacencyType));
                            System.Array.copy(deserialized2, 0, CustomizableGameofLife.App.adjacencyRules, 0, deserialized2.length);
                        }
                    }
                } catch ($e1) {
                    $e1 = System.Exception.create($e1);
                }
            }
            document.body.style["user-select"] = "none";
            document.head.appendChild(($t = document.createElement("link"), $t.rel = "stylesheet", $t.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css", $t));
            document.body.style.margin = "0px";
            document.body.appendChild(CustomizableGameofLife.App.PopupContainer);
            document.body.appendChild(($t = document.createElement("style"), $t.innerHTML = "td, th { border: 1px solid black; padding: 5px } button { margin-right: 5px }", $t));

            CustomizableGameofLife.App.SetupSettingsDiv();

            var presetsList = function (_o1) {
                    _o1.add(new (System.ValueTuple$3(System.String,System.Array.type(System.Boolean),System.Array.type(System.Boolean))).$ctor1("Conway's Game of Life Preset", System.Array.init([false, false, true, true, false, false, false, false, false], System.Boolean), System.Array.init([false, false, false, true, false, false, false, false, false], System.Boolean)));
                    _o1.add(new (System.ValueTuple$3(System.String,System.Array.type(System.Boolean),System.Array.type(System.Boolean))).$ctor1("Immortal Cells Preset", System.Array.init([true, true, true, true, true, true, true, true, true], System.Boolean), System.Array.init([false, false, false, true, false, false, false, false, false], System.Boolean)));
                    _o1.add(new (System.ValueTuple$3(System.String,System.Array.type(System.Boolean),System.Array.type(System.Boolean))).$ctor1("Almost Immortal Cells Preset", System.Array.init([true, true, true, true, true, true, true, true, false], System.Boolean), System.Array.init([false, false, false, true, false, false, false, false, false], System.Boolean)));
                    _o1.add(new (System.ValueTuple$3(System.String,System.Array.type(System.Boolean),System.Array.type(System.Boolean))).$ctor1("Alternate Conway's Game of Life Preset", System.Array.init([false, false, true, false, true, false, false, false, false], System.Boolean), System.Array.init([false, false, false, true, false, true, false, false, false], System.Boolean)));
                    return _o1;
                }(new (System.Collections.Generic.List$1(System.ValueTuple$3(System.String,System.Array.type(System.Boolean),System.Array.type(System.Boolean)))).ctor());

            var presetsDiv = ($t = document.createElement("div"), $t.style.textAlign = "center", $t);
            $t = Bridge.getEnumerator(presetsList);
            try {
                while ($t.moveNext()) {
                    var _d2 = $t.Current.$clone();
                    var name = { };
                    var livingRules = { };
                    var deadRules = { };
                    Bridge.Deconstruct(_d2.$clone(), name, livingRules, deadRules);
                    CustomizableGameofLife.Extensions.Add(HTMLDivElement, presetsDiv, [CustomizableGameofLife.Extensions.Add(HTMLDivElement, document.createElement("div"), [CustomizableGameofLife.Extensions.Add(HTMLAnchorElement, ($t1 = document.createElement("a"), $t1.href = "javascript:void(0)", $t1.style.fontSize = "1rem", $t1.onclick = (function ($me, livingRules, deadRules) {
                        return function (e) {
                            CustomizableGameofLife.App.ApplyPreset(livingRules.v, deadRules.v);
                        };
                    })(this, livingRules, deadRules), $t1), [name.v])])]);
                }
            } finally {
                if (Bridge.is($t, System.IDisposable)) {
                    $t.System$IDisposable$Dispose();
                }
            }
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [CustomizableGameofLife.Extensions.Add(HTMLDetailsElement, ($t1 = document.createElement("details"), $t1.open = true, $t1), [CustomizableGameofLife.Extensions.Add(HTMLElement, document.createElement("summary"), ["Adjacency Rules"]), CustomizableGameofLife.App.adjacencyRulesTableDiv]), CustomizableGameofLife.Extensions.Add(HTMLDetailsElement, ($t1 = document.createElement("details"), $t1.open = true, $t1), [CustomizableGameofLife.Extensions.Add(HTMLElement, document.createElement("summary"), ["Rules"]), CustomizableGameofLife.App.rulesTableDiv])]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [document.createElement("br"), presetsDiv, document.createElement("br")]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t1 = document.createElement("button"), $t1.className = "btn btn-primary", $t1.onclick = function (e) {
                for (var n = 0; n < CustomizableGameofLife.App.currentMaxAdjacentCells; n = (n + 1) | 0) {
                    CustomizableGameofLife.App.adjacencyRules[System.Array.index(n, CustomizableGameofLife.App.adjacencyRules)] = CustomizableGameofLife.Extensions.AdjacencyValue(CustomizableGameofLife.App.adjacencyRulesCells.getItem(n));
                }
                for (var n1 = 0; n1 <= CustomizableGameofLife.App.currentMaxAdjacentCells; n1 = (n1 + 1) | 0) {
                    CustomizableGameofLife.App.livingRules[System.Array.index(n1, CustomizableGameofLife.App.livingRules)] = CustomizableGameofLife.Extensions.BoolValue(CustomizableGameofLife.App.optionCells.getItem(n1).$clone().Item1);
                    CustomizableGameofLife.App.deadRules[System.Array.index(n1, CustomizableGameofLife.App.deadRules)] = CustomizableGameofLife.Extensions.BoolValue(CustomizableGameofLife.App.optionCells.getItem(n1).$clone().Item2);
                }
                Bridge.global.localStorage.setItem("rules", Newtonsoft.Json.JsonConvert.SerializeObject({ livingRules: CustomizableGameofLife.App.livingRules, deadRules: CustomizableGameofLife.App.deadRules, adjacencyRules: CustomizableGameofLife.App.adjacencyRules }));
                CustomizableGameofLife.App.HideModal();
            }, $t1), ["Save Changes"])]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.NotableObjectsPopup, [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t1 = document.createElement("button"), $t1.className = "btn btn-light", $t1.style.cssFloat = "right", $t1.onclick = function (e) {
                CustomizableGameofLife.App.HideModal();
            }, $t1), ["\u274c"])]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.NotableObjectsPopup, [($t1 = document.createElement("div"), $t1.style.clear = "both", $t1)]);
            $t1 = Bridge.getEnumerator(CustomizableGameofLife.NotableObjectsList.NotableObjects);
            try {
                while ($t1.moveNext()) {
                    var _d3 = $t1.Current.$clone();
                    var objectDetails = { };
                    var description = { };
                    var rules = { };
                    Bridge.Deconstruct(_d3.$clone(), objectDetails, description, rules);
                    var objectInfo = ((e, c) => c.appendChild(e))(($t2 = document.createElement("div"), $t2.style.width = "30rem", $t2), ((e, c) => c.appendChild(e))(($t2 = document.createElement("div"), $t2.style.display = "flex", $t2.style.alignItems = "center", $t2.style.flexDirection = "column", $t2), CustomizableGameofLife.App.NotableObjectsPopup));
                    CustomizableGameofLife.Extensions.Add(HTMLDivElement, objectInfo, [CustomizableGameofLife.Extensions.Add(HTMLDivElement, ($t2 = document.createElement("div"), $t2.style.display = "flex", $t2.style.alignItems = "center", $t2.style.flexDirection = "column", $t2), [CustomizableGameofLife.App.DrawShape(objectDetails.v)])]);
                    CustomizableGameofLife.Extensions.Add(HTMLDivElement, objectInfo, [CustomizableGameofLife.Extensions.Add(HTMLDivElement, document.createElement("div"), [description.v])]);
                    CustomizableGameofLife.Extensions.Add(HTMLDivElement, objectInfo, [rules.v]);
                    CustomizableGameofLife.Extensions.Add(HTMLDivElement, objectInfo, [document.createElement("br")]);
                    CustomizableGameofLife.Extensions.Add(HTMLDivElement, objectInfo, [document.createElement("br")]);
                }
            } finally {
                if (Bridge.is($t1, System.IDisposable)) {
                    $t1.System$IDisposable$Dispose();
                }
            }

            var backgroundDiv = ($t2 = document.createElement("div"), $t2.style.position = "relative", $t2.style.minWidth = "0", $t2.style.minHeight = "0", $t2);
            CustomizableGameofLife.App.DOMCanvas.style.overflow = "hidden";
            CustomizableGameofLife.App.DOMCanvas.style.zIndex = "-1";
            CustomizableGameofLife.App.DOMCanvas.style.position = "absolute";
            CustomizableGameofLife.App.DOMCanvas.style.left = "0px";
            CustomizableGameofLife.App.DOMCanvas.style.top = "0px";
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, backgroundDiv, [CustomizableGameofLife.App.DOMCanvas]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, backgroundDiv, [CustomizableGameofLife.App.Hotbar]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, backgroundDiv, [CustomizableGameofLife.App.RightHotbar]);
            document.body.appendChild(backgroundDiv);

            var draggingPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0);
            var originalPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0);
            var changingIntent = false;


            CustomizableGameofLife.App.DOMCanvas.onmousedown = function (e) {
                changingIntent = true;
                var x = { };
                var y = { };
                Bridge.Deconstruct(CustomizableGameofLife.App.MousePos(e).$clone(), x, y);
                draggingPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(((x.v - CustomizableGameofLife.App.offsetPos.Item1) | 0), ((y.v - CustomizableGameofLife.App.offsetPos.Item2) | 0));
                originalPos = CustomizableGameofLife.App.offsetPos.$clone();
            };
            CustomizableGameofLife.App.DOMCanvas.onmouseup = function (e) {
                if (Math.abs(((CustomizableGameofLife.App.offsetPos.Item1 - originalPos.Item1) | 0)) > CustomizableGameofLife.App.xMultiplier || Math.abs(((CustomizableGameofLife.App.offsetPos.Item2 - originalPos.Item2) | 0)) > CustomizableGameofLife.App.yMultiplier) {
                    changingIntent = false;
                }
                draggingPos = CustomizableGameofLife.App.offsetPos.$clone();
                originalPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0);
            };
            CustomizableGameofLife.App.DOMCanvas.onmousemove = function (e) {
                if ((e.buttons & 1) === 0) {
                    return;
                }
                if (draggingPos === new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0)) {
                    draggingPos = CustomizableGameofLife.App.MousePos(e);
                }
                var mousePos = CustomizableGameofLife.App.MousePos(e);
                if (Math.abs(((CustomizableGameofLife.App.offsetPos.Item1 - originalPos.Item1) | 0)) > CustomizableGameofLife.App.xMultiplier || Math.abs(((CustomizableGameofLife.App.offsetPos.Item1 - originalPos.Item1) | 0)) > CustomizableGameofLife.App.yMultiplier) {
                    changingIntent = false;
                }
                CustomizableGameofLife.App.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(((mousePos.Item1 - draggingPos.Item1) | 0), ((mousePos.Item2 - draggingPos.Item2) | 0));
                CustomizableGameofLife.App.Draw();
            };
            ProcessMouseEvent = function (e) {
                var mousePos = CustomizableGameofLife.App.MousePos(e);
                CustomizableGameofLife.App.Grid.HandleClick(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(((mousePos.Item1 - CustomizableGameofLife.App.offsetPos.Item1) | 0), ((mousePos.Item2 - CustomizableGameofLife.App.offsetPos.Item2) | 0)), CustomizableGameofLife.App.SquareTypePlacing);
                CustomizableGameofLife.App.Draw();
            };
            CustomizableGameofLife.App.DOMCanvas.onclick = function (e) {
                if (changingIntent) {
                    ProcessMouseEvent(e);
                    changingIntent = false;
                }
            };

            Bridge.global.setInterval(CustomizableGameofLife.App.NextFrame, 100);

            CustomizableGameofLife.App.Draw();
        },
        statics: {
            fields: {
                DefaultGridType: 0,
                maxAdjacentCells: 0,
                xMultiplier: 0,
                screenWidth: 0,
                screenHeight: 0,
                Hotbar: null,
                SquareTypePlacing: 0,
                CurrentGridType: 0,
                NextGridTypeButton: null,
                NextSquareTypeButton: null,
                RightHotbar: null,
                SettingsPopup: null,
                NotableObjectsPopup: null,
                PopupContainer: null,
                SettingsButton: null,
                PlayButton: null,
                playing: false,
                livingRules: null,
                deadRules: null,
                adjacencyRules: null,
                DOMCanvas: null,
                DOMCanvasContext: null,
                Grid: null,
                offsetPos: null,
                adjacencyRulesCells: null,
                optionCells: null,
                adjacencyRulesTableDiv: null,
                rulesTableDiv: null,
                updating: false,
                LastBottomCanvas: null,
                frameNum: 0
            },
            props: {
                yMultiplier: {
                    get: function () {
                        return CustomizableGameofLife.App.xMultiplier;
                    }
                },
                actualXMultiplier: {
                    get: function () {
                        return Bridge.is(CustomizableGameofLife.App.Grid, CustomizableGameofLife.HexGrid) ? Bridge.Int.mul(CustomizableGameofLife.App.xMultiplier, 2) * CustomizableGameofLife.HexGrid.cos60 : CustomizableGameofLife.App.xMultiplier;
                    }
                },
                actualYMultiplier: {
                    get: function () {
                        return Bridge.is(CustomizableGameofLife.App.Grid, CustomizableGameofLife.HexGrid) ? Bridge.Int.mul(CustomizableGameofLife.App.yMultiplier, 2) * CustomizableGameofLife.HexGrid.sin60 : CustomizableGameofLife.App.yMultiplier;
                    }
                },
                width: {
                    get: function () {
                        return Bridge.Int.clip32(Math.ceil(CustomizableGameofLife.App.screenWidth / CustomizableGameofLife.App.xMultiplier));
                    }
                },
                height: {
                    get: function () {
                        return Bridge.Int.clip32(Math.ceil(CustomizableGameofLife.App.screenHeight / CustomizableGameofLife.App.yMultiplier));
                    }
                },
                currentMaxAdjacentCells: {
                    get: function () {
                        return Bridge.is(CustomizableGameofLife.App.Grid, CustomizableGameofLife.HexGrid) ? 6 : Bridge.is(CustomizableGameofLife.App.Grid, CustomizableGameofLife.SquareGrid) ? 8 : Bridge.is(CustomizableGameofLife.App.Grid, CustomizableGameofLife.TriangleGrid) ? 12 : (function () {
                            throw new System.NotImplementedException.$ctor1(System.String.format("Grid type not found: {0}", [Bridge.getType(CustomizableGameofLife.App.Grid)]));
                        })();
                    }
                }
            },
            ctors: {
                init: function () {
                    var $t, $t1, $t2, $t3, $t4;
                    this.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32))();
                    this.LastBottomCanvas = new (System.ValueTuple$3(System.Int32,CustomizableGameofLife.GridType,HTMLCanvasElement))();
                    this.DefaultGridType = CustomizableGameofLife.GridType.Square;
                    this.maxAdjacentCells = 12;
                    this.xMultiplier = 20;
                    this.screenWidth = window.innerWidth;
                    this.screenHeight = window.innerHeight;
                    this.Hotbar = CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, ($t = document.createElement("div"), $t.style.position = "absolute", $t.style.left = "100px", $t.style.top = System.String.format("{0}px", [Bridge.box(((window.innerHeight - 40) | 0), System.Int32)]), $t), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.Reset(true);
                    }, $t), ["Blank"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.Reset();
                    }, $t), ["Reset"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.GetCoordinates();
                    }, $t), ["Get Coordinates"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.SaveAsStarter();
                    }, $t), ["Save as Starter"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.Zoom(false);
                    }, $t), ["Zoom Out"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.Zoom(true);
                    }, $t), ["Zoom In"])]), [($t = CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t1 = document.createElement("button"), $t1.className = "btn btn-primary", $t1.onclick = function (e) {
                        CustomizableGameofLife.App.NextGridType();
                    }, $t1), [CustomizableGameofLife.Extensions.ToCamelString(CustomizableGameofLife.GridType, CustomizableGameofLife.App.DefaultGridType)]), CustomizableGameofLife.App.NextGridTypeButton = $t, $t)]), [($t1 = CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t2 = document.createElement("button"), $t2.className = "btn btn-primary", $t2.onclick = function (e) {
                        CustomizableGameofLife.App.NextSquareType();
                    }, $t2), ["Wall"]), CustomizableGameofLife.App.NextSquareTypeButton = $t1, $t1)]), [($t2 = CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t3 = document.createElement("button"), $t3.className = "btn btn-primary", $t3.onclick = function (e) {
                        CustomizableGameofLife.App.InvertIsPlaying();
                    }, $t3), ["\u25b6"]), CustomizableGameofLife.App.PlayButton = $t2, $t2)]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t3 = document.createElement("button"), $t3.className = "btn btn-primary", $t3.onclick = function (e) {
                        CustomizableGameofLife.App.ShowModal(CustomizableGameofLife.App.ModalType.Settings);
                    }, $t3), ["\u2699"])]);
                    this.SquareTypePlacing = CustomizableGameofLife.SquareType.Count;
                    this.CurrentGridType = CustomizableGameofLife.App.DefaultGridType;
                    this.RightHotbar = CustomizableGameofLife.Extensions.Add(HTMLDivElement, ($t3 = document.createElement("div"), $t3.style.position = "absolute", $t3.style.right = "100px", $t3.style.top = System.String.format("{0}px", [Bridge.box(((window.innerHeight - 40) | 0), System.Int32)]), $t3), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t3 = document.createElement("button"), $t3.className = "btn btn-info", $t3.onclick = function (e) {
                        CustomizableGameofLife.App.ShowModal(CustomizableGameofLife.App.ModalType.NotableObjects);
                    }, $t3), ["Notable Objects"])]);
                    this.PopupContainer = CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, function (_o1) {
                            _o1.style.position = "fixed";
                            _o1.style.top = "0";
                            _o1.style.left = "0";
                            _o1.style.width = "100%";
                            _o1.style["x-index"] = Bridge.box(999999, System.Int32);
                            _o1.style.height = "100%";
                            _o1.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                            _o1.style.display = "none";
                            return _o1;
                        }(document.createElement("div")), [($t3 = CustomizableGameofLife.App.CreatePopup(), CustomizableGameofLife.App.SettingsPopup = $t3, $t3)]), [($t4 = CustomizableGameofLife.App.CreatePopup(), CustomizableGameofLife.App.NotableObjectsPopup = $t4, $t4)]);
                    this.playing = false;
                    this.livingRules = System.Array.init([false, false, true, true, false, false, false, false, false, false, false, false, false], System.Boolean);
                    this.deadRules = System.Array.init([false, false, false, true, false, false, false, false, false, false, false, false, false], System.Boolean);
                    this.adjacencyRules = System.Array.init([CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One], CustomizableGameofLife.AdjacencyType);
                    this.DOMCanvas = CustomizableGameofLife.App.CreateCanvas();
                    this.DOMCanvasContext = CustomizableGameofLife.App.DOMCanvas.getContext("2d");
                    this.Grid = true ? new CustomizableGameofLife.SquareGrid() : false ? Bridge.cast((new CustomizableGameofLife.TriangleGrid()), CustomizableGameofLife.Grid) : false ? new CustomizableGameofLife.HexGrid() : (function () {
                        throw new System.NotImplementedException.ctor();
                    })();
                    this.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0);
                    this.adjacencyRulesCells = new (System.Collections.Generic.List$1(HTMLSelectElement)).ctor();
                    this.optionCells = new (System.Collections.Generic.List$1(System.ValueTuple$2(HTMLInputElement,HTMLInputElement))).ctor();
                    this.adjacencyRulesTableDiv = document.createElement("div");
                    this.rulesTableDiv = document.createElement("div");
                    this.updating = false;
                    this.LastBottomCanvas = new (System.ValueTuple$3(System.Int32,CustomizableGameofLife.GridType,HTMLCanvasElement)).$ctor1(0, CustomizableGameofLife.GridType.Count, null);
                    this.frameNum = 0;
                }
            },
            methods: {
                Zoom: function (zoomIn) {
                    CustomizableGameofLife.App.xMultiplier = (CustomizableGameofLife.App.xMultiplier + (zoomIn ? 1 : -1)) | 0;
                    if (CustomizableGameofLife.App.xMultiplier <= 1) {
                        CustomizableGameofLife.App.xMultiplier = 2;
                    }
                    CustomizableGameofLife.App.Draw();
                },
                NextSquareType: function () {
                    CustomizableGameofLife.App.SquareTypePlacing = (((CustomizableGameofLife.App.SquareTypePlacing + 1) | 0)) % (4);
                    CustomizableGameofLife.App.NextSquareTypeButton.innerHTML = CustomizableGameofLife.App.SquareTypePlacing === CustomizableGameofLife.SquareType.Count ? "Wall" : CustomizableGameofLife.Extensions.ToCamelString(CustomizableGameofLife.SquareType, CustomizableGameofLife.App.SquareTypePlacing);
                },
                NextGridType: function () {
                    CustomizableGameofLife.App.CurrentGridType = (((CustomizableGameofLife.App.CurrentGridType + 1) | 0)) % CustomizableGameofLife.GridType.Count;
                    CustomizableGameofLife.App.NextGridTypeButton.innerHTML = CustomizableGameofLife.Extensions.ToCamelString(CustomizableGameofLife.GridType, CustomizableGameofLife.App.CurrentGridType);
                    if (CustomizableGameofLife.App.CurrentGridType === CustomizableGameofLife.GridType.Triangle) {
                        CustomizableGameofLife.App.xMultiplier = Bridge.Int.mul(CustomizableGameofLife.App.xMultiplier, 2);
                    } else {
                        if (CustomizableGameofLife.App.CurrentGridType === CustomizableGameofLife.GridType.Square) {
                            CustomizableGameofLife.App.xMultiplier = (Bridge.Int.div(CustomizableGameofLife.App.xMultiplier, 2)) | 0;
                        }
                    }
                    switch (CustomizableGameofLife.App.CurrentGridType) {
                        case CustomizableGameofLife.GridType.Square: 
                            CustomizableGameofLife.App.Grid = new CustomizableGameofLife.SquareGrid();
                            break;
                        case CustomizableGameofLife.GridType.Hex: 
                            CustomizableGameofLife.App.Grid = new CustomizableGameofLife.HexGrid();
                            break;
                        case CustomizableGameofLife.GridType.Triangle: 
                            CustomizableGameofLife.App.Grid = new CustomizableGameofLife.TriangleGrid();
                            break;
                    }
                    CustomizableGameofLife.App.SetupSettingsDiv();
                    CustomizableGameofLife.App.Draw();
                },
                Reset: function (makeBlank) {
                    var $t, $t1;
                    if (makeBlank === void 0) { makeBlank = false; }
                    if (!Bridge.global.confirm("Any unsaved changes will be lost. Continue?")) {
                        return;
                    }
                    CustomizableGameofLife.App.Grid.Clear();
                    var grid;
                    if (!makeBlank && ((grid = Bridge.as(CustomizableGameofLife.App.Grid, CustomizableGameofLife.Grid$1(System.ValueTuple$2(System.Int32,System.Int32))))) != null) {
                        CustomizableGameofLife.App.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0);
                        var starterPositions = Bridge.global.localStorage.getItem("starterPositions");
                        if (starterPositions != null) {
                            var s = Bridge.cast(starterPositions, System.String);
                            if (!System.String.isNullOrEmpty(s)) {
                                var jsonRaw = JSON.parse(s);
                                if (Bridge.referenceEquals(jsonRaw.length, 0) || jsonRaw[0].Item3 == null) {
                                    $t = Bridge.getEnumerator((Newtonsoft.Json.JsonConvert.DeserializeObject(s, System.Array.type(System.ValueTuple$2(System.Int32,System.Int32)))));
                                    try {
                                        while ($t.moveNext()) {
                                            var pos = $t.Current.$clone();
                                            grid.Squares.add(pos.$clone(), CustomizableGameofLife.SquareType.Cell);
                                        }
                                    } finally {
                                        if (Bridge.is($t, System.IDisposable)) {
                                            $t.System$IDisposable$Dispose();
                                        }
                                    }
                                } else {
                                    $t1 = Bridge.getEnumerator((Newtonsoft.Json.JsonConvert.DeserializeObject(s, System.Array.type(System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.SquareType)))));
                                    try {
                                        while ($t1.moveNext()) {
                                            var squareInfo = $t1.Current.$clone();
                                            grid.Squares.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(squareInfo.Item1, squareInfo.Item2), squareInfo.Item3);
                                        }
                                    } finally {
                                        if (Bridge.is($t1, System.IDisposable)) {
                                            $t1.System$IDisposable$Dispose();
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (CustomizableGameofLife.App.playing) {
                        CustomizableGameofLife.App.InvertIsPlaying();
                    }
                    CustomizableGameofLife.App.Draw();
                },
                GetCoordinatesInteral: function () {
                    var $t;
                    var g;
                    if (((g = Bridge.as(CustomizableGameofLife.App.Grid, CustomizableGameofLife.Grid$1(System.ValueTuple$2(System.Int32,System.Int32))))) != null) {
                        var offsetCoords = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(CustomizableGameofLife.App.NegDiv(CustomizableGameofLife.App.offsetPos.Item1, Bridge.Int.clip32(CustomizableGameofLife.App.actualXMultiplier)), CustomizableGameofLife.App.NegDiv(CustomizableGameofLife.App.offsetPos.Item2, Bridge.Int.clip32(CustomizableGameofLife.App.actualYMultiplier)));
                        return ($t = System.Collections.Generic.KeyValuePair$2(System.ValueTuple$2(System.Int32,System.Int32),CustomizableGameofLife.SquareType), System.Linq.Enumerable.from(g.Squares, $t).toList($t)).ConvertAll(System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.SquareType), function (s) {
                            return new (System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.SquareType)).$ctor1(((s.key.Item1 + offsetCoords.Item1) | 0), ((s.key.Item2 + offsetCoords.Item2) | 0), s.value);
                        });
                    } else {
                        return new (System.Collections.Generic.List$1(System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.SquareType))).ctor();
                    }
                },
                GetNormalizedCoordinates: function () {
                    var coords = CustomizableGameofLife.App.GetCoordinatesInteral();
                    if (coords.Count === 0) {
                        return coords;
                    }
                    coords = System.Linq.Enumerable.from(coords, System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.SquareType)).where(function (c) {
                            return c.Item1 >= 0 && c.Item2 >= 0 && c.Item1 < CustomizableGameofLife.App.width && c.Item2 < CustomizableGameofLife.App.height;
                        }).toList(System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.SquareType));
                    var minX = System.Linq.Enumerable.from(coords, System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.SquareType)).min(function (c) {
                            return c.Item1;
                        }), minY = System.Linq.Enumerable.from(coords, System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.SquareType)).min(function (c) {
                            return c.Item2;
                        });
                    coords = System.Linq.Enumerable.from(coords, System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.SquareType)).select(function (c) {
                            return new (System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.SquareType)).$ctor1(((c.Item1 - minX) | 0), ((c.Item2 - minY) | 0), c.Item3);
                        }).toList(System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.SquareType));
                    return coords;
                },
                GetCoordinates: function () {
                    var $t;
                    var codeGenerated = System.String.format("(new HashSet<(int x, int y)>\r\n{{\r\n    {0}\r\n}}, \"Untitled Object\", {1})", Bridge.toArray(System.Linq.Enumerable.from(CustomizableGameofLife.App.GetNormalizedCoordinates(), System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.SquareType)).select(function (t) {
                                    return System.String.format("({0}, {1})", Bridge.box(t.Item1, System.Int32), Bridge.box(t.Item2, System.Int32));
                                })).join(",\n    "), JSON.stringify(System.String.format("{0}{1} / {2}", (System.Linq.Enumerable.from(CustomizableGameofLife.App.adjacencyRules, CustomizableGameofLife.AdjacencyType).all(function (a) {
                                    return a === CustomizableGameofLife.AdjacencyType.One;
                                }) ? "" : ((System.String.concat(Bridge.toArray(System.Linq.Enumerable.from(CustomizableGameofLife.App.adjacencyRules, CustomizableGameofLife.AdjacencyType).select(function (k) {
                                        return k;
                                    })))) || "") + " -> "), System.String.concat(Bridge.toArray(System.Linq.Enumerable.from(CustomizableGameofLife.App.deadRules, System.Boolean).select(function (k) {
                                        return k ? 1 : 0;
                                    }))), System.String.concat(Bridge.toArray(System.Linq.Enumerable.from(CustomizableGameofLife.App.livingRules, System.Boolean).select(function (k) {
                                        return k ? 1 : 0;
                                    }))))));
                    var modal, modalContent = ((e, c) => c.appendChild(e))(($t = document.createElement("div"), $t.className = "modal-content", $t), ((e, c) => c.appendChild(e))(($t = document.createElement("div"), $t.className = "modal-dialog", $t), (modal = ((e, c) => c.appendChild(e))(($t = document.createElement("div"), $t.className = "modal", $t.style.display = "inherit", $t), document.body))));
                    CustomizableGameofLife.Extensions.Add(HTMLDivElement, modalContent, [CustomizableGameofLife.Extensions.Add(HTMLDivElement, ($t = document.createElement("div"), $t.className = "modal-header", $t), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn-close", $t.onclick = function (e) {
                        modal.remove();
                    }, $t), [($t = document.createElement("span"), $t.innerHTML = "&times;", $t)])]), CustomizableGameofLife.Extensions.Add(HTMLPreElement, function (_o1) {
                            _o1.className = "modal-body";
                            _o1.style["user-select"] = "text";
                            return _o1;
                        }(document.createElement("pre")), [codeGenerated])]);
                },
                SaveAsStarter: function () {
                    Bridge.global.localStorage.setItem("starterPositions", Newtonsoft.Json.JsonConvert.SerializeObject(CustomizableGameofLife.App.GetCoordinatesInteral()));
                },
                CreatePopup: function () {
                    var $t;
                    return ($t = document.createElement("div"), $t.style.fontSize = "1.5rem", $t.style.backgroundColor = "white", $t.style.position = "fixed", $t.style.top = "0px", $t.style.left = "25%", $t.style.width = "50%", $t.style.height = "100%", $t.style.display = "none", $t.style.overflow = "scroll", $t);
                },
                InvertIsPlaying: function () {
                    CustomizableGameofLife.App.playing = !CustomizableGameofLife.App.playing;
                    CustomizableGameofLife.App.PlayButton.innerHTML = CustomizableGameofLife.App.playing ? "\u23f8" : "\u25b6";
                },
                CreateCanvas: function () {
                    var $t;
                    return ($t = document.createElement("canvas"), $t.width = CustomizableGameofLife.App.screenWidth, $t.height = CustomizableGameofLife.App.screenHeight, $t);
                },
                CreateTopCanvas: function () {
                    var $t;
                    return ($t = document.createElement("canvas"), $t.width = ((CustomizableGameofLife.App.width + 2) | 0), $t.height = ((CustomizableGameofLife.App.height + 2) | 0), $t);
                },
                hypo: function (x, y) {
                    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                },
                CreateBottomCanvas: function () {
                    var $t;
                    var BottomCanvas = Bridge.is(CustomizableGameofLife.App.Grid, CustomizableGameofLife.HexGrid) ? ($t = document.createElement("canvas"), $t.width = ((CustomizableGameofLife.App.DOMCanvas.width + Bridge.Int.mul(4, CustomizableGameofLife.App.xMultiplier)) | 0), $t.height = ((CustomizableGameofLife.App.DOMCanvas.height + Bridge.Int.mul(4, CustomizableGameofLife.App.yMultiplier)) | 0), $t) : ($t = document.createElement("canvas"), $t.width = ((CustomizableGameofLife.App.screenWidth + Bridge.Int.mul(2, CustomizableGameofLife.App.xMultiplier)) | 0), $t.height = ((CustomizableGameofLife.App.screenHeight + Bridge.Int.mul(2, CustomizableGameofLife.App.yMultiplier)) | 0), $t);
                    var BottomCanvasContext = BottomCanvas.getContext("2d");
                    BottomCanvasContext.strokeStyle = "black";
                    BottomCanvasContext.translate(0.5, 0.5);
                    BottomCanvasContext.lineWidth = 1;
                    var h;
                    if (((h = Bridge.as(CustomizableGameofLife.App.Grid, CustomizableGameofLife.HexGrid))) != null) {
                        BottomCanvasContext.strokeStyle = "black";
                        for (var a = (-Bridge.Int.clip32(CustomizableGameofLife.App.hypo(CustomizableGameofLife.App.width, CustomizableGameofLife.App.height))) | 0; a < Bridge.Int.clip32(CustomizableGameofLife.App.hypo(CustomizableGameofLife.App.width, CustomizableGameofLife.App.height)); a = (a + 1) | 0) {
                            for (var b = (-Bridge.Int.clip32(CustomizableGameofLife.App.hypo(CustomizableGameofLife.App.width, CustomizableGameofLife.App.height))) | 0; b < Bridge.Int.clip32(CustomizableGameofLife.App.hypo(CustomizableGameofLife.App.width, CustomizableGameofLife.App.height)); b = (b + 1) | 0) {
                                var x = { };
                                var y = { };
                                Bridge.Deconstruct(h.GetDrawPosition(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(a, b)).$clone(), x, y);
                                CustomizableGameofLife.App.DrawHexagon(BottomCanvasContext, x.v, y.v, ((Bridge.Int.div(Bridge.Int.mul(CustomizableGameofLife.App.xMultiplier, 2), 3)) | 0), true);
                            }
                        }
                    } else {
                        var t;
                        if (((t = Bridge.as(CustomizableGameofLife.App.Grid, CustomizableGameofLife.TriangleGrid))) != null) {
                            for (var a1 = (-Bridge.Int.clip32(CustomizableGameofLife.App.hypo(CustomizableGameofLife.App.width, CustomizableGameofLife.App.height))) | 0; a1 < Bridge.Int.clip32(CustomizableGameofLife.App.hypo(CustomizableGameofLife.App.width, CustomizableGameofLife.App.height)); a1 = (a1 + 1) | 0) {
                                for (var b1 = (-Bridge.Int.clip32(CustomizableGameofLife.App.hypo(CustomizableGameofLife.App.width, CustomizableGameofLife.App.height))) | 0; b1 < Bridge.Int.clip32(CustomizableGameofLife.App.hypo(CustomizableGameofLife.App.width, CustomizableGameofLife.App.height)); b1 = (b1 + 1) | 0) {
                                    for (var tl = CustomizableGameofLife.TriangleLocation.TopLeft; tl < CustomizableGameofLife.TriangleLocation.Count; tl = (tl + 1) | 0) {
                                        var x1 = { };
                                        var y1 = { };
                                        Bridge.Deconstruct(t.GetDrawPosition(new (System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.TriangleLocation)).$ctor1(a1, b1, tl)).$clone(), x1, y1);
                                        CustomizableGameofLife.App.DrawTriangle(BottomCanvasContext, x1.v, y1.v, ((Bridge.Int.div(Bridge.Int.mul(CustomizableGameofLife.App.xMultiplier, 2), 3)) | 0), tl, true);
                                    }
                                }
                            }
                        } else if (Bridge.is(CustomizableGameofLife.App.Grid, CustomizableGameofLife.SquareGrid)) {
                            for (var x2 = 0; x2 <= (((CustomizableGameofLife.App.width + 2) | 0)); x2 = (x2 + 1) | 0) {
                                BottomCanvasContext.moveTo(Bridge.Int.mul(x2, CustomizableGameofLife.App.xMultiplier), 0);
                                BottomCanvasContext.lineTo(Bridge.Int.mul(x2, CustomizableGameofLife.App.xMultiplier), Bridge.Int.mul((((CustomizableGameofLife.App.height + 3) | 0)), CustomizableGameofLife.App.yMultiplier));
                            }

                            for (var y2 = 0; y2 <= (((CustomizableGameofLife.App.height + 2) | 0)); y2 = (y2 + 1) | 0) {
                                BottomCanvasContext.moveTo(0, Bridge.Int.mul(y2, CustomizableGameofLife.App.yMultiplier));
                                BottomCanvasContext.lineTo(Bridge.Int.mul((((CustomizableGameofLife.App.width + 3) | 0)), CustomizableGameofLife.App.xMultiplier), Bridge.Int.mul(y2, CustomizableGameofLife.App.yMultiplier));
                            }
                        }
                    }
                    for (var n = 0; n < 10; n = (n + 1) | 0) {
                        BottomCanvasContext.stroke();
                    }
                    return BottomCanvas;
                },
                MousePos: function (e) {
                    var rect = CustomizableGameofLife.App.DOMCanvas.getBoundingClientRect();
                    return new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(Bridge.Int.clip32(e.clientX - rect.left), Bridge.Int.clip32(e.clientY - rect.top));
                },
                NegDiv: function (a, b) {
                    var res = (Bridge.Int.div(a, b)) | 0;
                    return (a < 0 && a !== Bridge.Int.mul(b, res)) ? ((res - 1) | 0) : res;
                },
                NegDivDouble: function (a, b) {
                    return a >= 0 ? a / b : (a - b + 1) / b;
                },
                ApplyPreset: function (livingRules, deadRules) {
                    for (var n = 0; n <= 8; n = (n + 1) | 0) {
                        CustomizableGameofLife.Extensions.SetBoolValue(CustomizableGameofLife.App.optionCells.getItem(n).$clone().Item1, livingRules[System.Array.index(n, livingRules)]);
                        CustomizableGameofLife.Extensions.SetBoolValue(CustomizableGameofLife.App.optionCells.getItem(n).$clone().Item2, deadRules[System.Array.index(n, deadRules)]);
                    }
                },
                ShowModal: function (modalType) {
                    var $t;
                    CustomizableGameofLife.App.PopupContainer.style.display = "";
                    var toShow;
                    switch (modalType) {
                        case CustomizableGameofLife.App.ModalType.Settings: 
                            toShow = CustomizableGameofLife.App.SettingsPopup;
                            break;
                        case CustomizableGameofLife.App.ModalType.NotableObjects: 
                            toShow = CustomizableGameofLife.App.NotableObjectsPopup;
                            break;
                        default: 
                            throw new System.ArgumentException.$ctor3(Bridge.toString(modalType), "modalType");
                    }
                    $t = Bridge.getEnumerator(System.Array.init([CustomizableGameofLife.App.SettingsPopup, CustomizableGameofLife.App.NotableObjectsPopup], HTMLDivElement));
                    try {
                        while ($t.moveNext()) {
                            var div = $t.Current;
                            div.style.display = Bridge.referenceEquals(div, toShow) ? "" : "none";
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                },
                HideModal: function () {
                    CustomizableGameofLife.App.PopupContainer.style.display = "none";
                    CustomizableGameofLife.App.SettingsPopup.style.display = "none";
                    CustomizableGameofLife.App.NotableObjectsPopup.style.display = "none";
                },
                DrawShape: function (Squares) {
                    var $t, $t1;
                    var xMultiplier = Bridge.Int.mul(CustomizableGameofLife.App.xMultiplier, 2);
                    var yMultiplier = Bridge.Int.mul(CustomizableGameofLife.App.yMultiplier, 2);

                    var width = (System.Linq.Enumerable.from(Squares, System.ValueTuple$2(System.Int32,System.Int32)).max(function (s) {
                            return s.Item1;
                        }) + 1) | 0;
                    var height = (System.Linq.Enumerable.from(Squares, System.ValueTuple$2(System.Int32,System.Int32)).max(function (s) {
                            return s.Item2;
                        }) + 1) | 0;
                    var innerCanvas = ($t = document.createElement("canvas"), $t.width = width, $t.height = height, $t);
                    var context = innerCanvas.getContext("2d");
                    var imageDataArray = CustomizableGameofLife.App.CreateImageDataArray(width, height);
                    $t = Bridge.getEnumerator(Squares);
                    try {
                        while ($t.moveNext()) {
                            var _d1 = $t.Current.$clone();
                            var x = { };
                            var y = { };
                            Bridge.Deconstruct(_d1.$clone(), x, y);
                            imageDataArray[((Bridge.Int.mul((((x.v + Bridge.Int.mul(y.v, width)) | 0)), 4) + 3) | 0)] = 255;
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                    var imageData = new ImageData(imageDataArray, (width >>> 0), (height >>> 0));
                    context.putImageData(imageData, 0, 0);
                    var outerCanvas = ($t1 = document.createElement("canvas"), $t1.width = Bridge.Int.mul(width, xMultiplier), $t1.height = Bridge.Int.mul(height, yMultiplier), $t1);
                    var outerContext = outerCanvas.getContext("2d");
                    outerContext.imageSmoothingEnabled = false;
                    outerContext.drawImage(innerCanvas, 0, 0, outerCanvas.width, outerCanvas.height);

                    return outerCanvas;
                },
                CreateImageDataArray: function (width, height) {
                    return new Uint8ClampedArray(Bridge.Int.mul(Bridge.Int.mul(width, height), 4));
                },
                CreateCheckbox: function () {
                    var $t;
                    return ($t = document.createElement("input"), $t.type = "checkbox", $t.style.width = "1rem", $t.style.height = "1em", $t);
                },
                Create01Selector: function () {
                    var $t;
                    return CustomizableGameofLife.Extensions.Add(HTMLSelectElement, document.createElement("select"), [CustomizableGameofLife.Extensions.Add(HTMLOptionElement, ($t = document.createElement("option"), $t.value = "false", $t), ["0"]), CustomizableGameofLife.Extensions.Add(HTMLOptionElement, ($t = document.createElement("option"), $t.value = "true", $t), ["1"])]);
                },
                Create012Selector: function () {
                    var $t;
                    return CustomizableGameofLife.Extensions.Add(HTMLSelectElement, document.createElement("select"), [CustomizableGameofLife.Extensions.Add(HTMLOptionElement, ($t = document.createElement("option"), $t.value = "0", $t), ["0"]), CustomizableGameofLife.Extensions.Add(HTMLOptionElement, ($t = document.createElement("option"), $t.value = "1", $t), ["1"]), CustomizableGameofLife.Extensions.Add(HTMLOptionElement, ($t = document.createElement("option"), $t.value = "2", $t), ["2"])]);
                },
                SetupSettingsDiv: function () {
                    var $t;
                    var adjacencyRulesTable = ($t = document.createElement("table"), $t.style.marginLeft = "auto", $t.style.marginRight = "auto", $t);
                    {
                        if (Bridge.is(CustomizableGameofLife.App.Grid, CustomizableGameofLife.TriangleGrid)) {
                            for (var n = 0; n < 12; n = (n + 1) | 0) {
                                var name = n < 6 ? CustomizableGameofLife.Extensions.ToCamelString(CustomizableGameofLife.TriangleLocation, n) : System.String.format("Position {0}", [Bridge.box(n, System.Int32)]);
                                CustomizableGameofLife.App.adjacencyRulesCells.add(CustomizableGameofLife.Extensions.SetAdjacencyValue(((e, c) => c.appendChild(e))(CustomizableGameofLife.App.Create012Selector(), ((e, c) => c.appendChild(e))(document.createElement("td"), ((e, c) => c.appendChild(e))(CustomizableGameofLife.Extensions.Add(HTMLTableRowElement, document.createElement("tr"), [CustomizableGameofLife.Extensions.Add(HTMLTableCellElement, document.createElement("td"), [name])]), adjacencyRulesTable))), CustomizableGameofLife.App.adjacencyRules[System.Array.index(n, CustomizableGameofLife.App.adjacencyRules)]));
                            }
                        } else {
                            var n1 = 0;
                            for (var y = 0; y < 3; y = (y + 1) | 0) {
                                var row = ((e, c) => c.appendChild(e))(document.createElement("tr"), adjacencyRulesTable);
                                for (var x = 0; x < 3; x = (x + 1) | 0) {
                                    if (x === 1 && y === 1) {
                                        row.appendChild(document.createElement("td"));
                                        continue;
                                    }
                                    CustomizableGameofLife.App.adjacencyRulesCells.add(CustomizableGameofLife.Extensions.SetAdjacencyValue(((e, c) => c.appendChild(e))(CustomizableGameofLife.App.Create012Selector(), ((e, c) => c.appendChild(e))(document.createElement("td"), row)), CustomizableGameofLife.App.adjacencyRules[System.Array.index(n1, CustomizableGameofLife.App.adjacencyRules)]));
                                    n1 = (n1 + 1) | 0;
                                }
                            }
                        }
                    }
                    CustomizableGameofLife.Extensions.Clear(CustomizableGameofLife.App.adjacencyRulesTableDiv);
                    CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.adjacencyRulesTableDiv, [adjacencyRulesTable]);

                    var rulesTable = CustomizableGameofLife.Extensions.Add(HTMLTableElement, ($t = document.createElement("table"), $t.style.marginLeft = "auto", $t.style.marginRight = "auto", $t), [CustomizableGameofLife.Extensions.Add(HTMLTableRowElement, document.createElement("tr"), [CustomizableGameofLife.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["#"]), CustomizableGameofLife.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["L"]), CustomizableGameofLife.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["D"])])]);

                    CustomizableGameofLife.Extensions.Clear(CustomizableGameofLife.App.rulesTableDiv);
                    CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.rulesTableDiv, [rulesTable]);

                    CustomizableGameofLife.App.optionCells.clear();

                    for (var n2 = 0; n2 <= CustomizableGameofLife.App.currentMaxAdjacentCells; n2 = (n2 + 1) | 0) {
                        var row1 = ((e, c) => c.appendChild(e))(document.createElement("tr"), rulesTable);
                        CustomizableGameofLife.Extensions.Add(HTMLTableRowElement, row1, [CustomizableGameofLife.Extensions.Add(HTMLTableCellElement, document.createElement("td"), [Bridge.toString(n2)])]);
                        CustomizableGameofLife.App.optionCells.add(new (System.ValueTuple$2(HTMLInputElement,HTMLInputElement)).$ctor1(CustomizableGameofLife.Extensions.SetBoolValue(((e, c) => c.appendChild(e))(CustomizableGameofLife.App.CreateCheckbox(), ((e, c) => c.appendChild(e))(document.createElement("td"), row1)), CustomizableGameofLife.App.livingRules[System.Array.index(n2, CustomizableGameofLife.App.livingRules)]), CustomizableGameofLife.Extensions.SetBoolValue(((e, c) => c.appendChild(e))(CustomizableGameofLife.App.CreateCheckbox(), ((e, c) => c.appendChild(e))(document.createElement("td"), row1)), CustomizableGameofLife.App.deadRules[System.Array.index(n2, CustomizableGameofLife.App.deadRules)])));
                    }
                },
                HasDividers: function (dividers, x, y, L) {
                    var toCheck = new CustomizableGameofLife.DividersInfo();
                    switch (L) {
                        case 0: 
                            x = (x - 1) | 0;
                            y = (y - 1) | 0;
                            toCheck = CustomizableGameofLife.DividersInfo.BottomRight;
                            break;
                        case 1: 
                            y = (y - 1) | 0;
                            toCheck = CustomizableGameofLife.DividersInfo.Bottom;
                            break;
                        case 2: 
                            y = (y - 1) | 0;
                            toCheck = CustomizableGameofLife.DividersInfo.BottomRight;
                            break;
                        case 3: 
                            x = (x - 1) | 0;
                            toCheck = CustomizableGameofLife.DividersInfo.Right;
                            break;
                        case 5: 
                            toCheck = CustomizableGameofLife.DividersInfo.Right;
                            break;
                        case 6: 
                            x = (x - 1) | 0;
                            toCheck = CustomizableGameofLife.DividersInfo.BottomRight;
                            break;
                        case 7: 
                            toCheck = CustomizableGameofLife.DividersInfo.Bottom;
                            break;
                        case 8: 
                            toCheck = CustomizableGameofLife.DividersInfo.BottomRight;
                            break;
                        default: 
                            throw new System.InvalidOperationException.ctor();
                    }
                    var dividersInfo = { v : new CustomizableGameofLife.DividersInfo() };
                    return dividers.tryGetValue(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x, y), dividersInfo) && (dividersInfo.v & toCheck) !== 0;
                },
                GetSquareTypeAlpha: function (squareType) {
                    return ((squareType === CustomizableGameofLife.SquareType.Cell ? 255 : squareType === CustomizableGameofLife.SquareType.Brick ? 170 : squareType === CustomizableGameofLife.SquareType.ImmortalCell ? 85 : (function () {
                        throw new System.Exception("Unknown square type");
                    })()) & 255);
                },
                Draw: function () {
                    var $t, $t1, $t2;
                    var DrawMarker = null;
                    var DrawLine = null;
                    var GetFinalDrawPos = null;
                    var GetDOMDrawPos = null;
                    var GetDrawPos = null;
                    var TopCanvas = CustomizableGameofLife.App.CreateTopCanvas();
                    var BottomCanvas = null;
                    if (CustomizableGameofLife.App.LastBottomCanvas.Item1 === CustomizableGameofLife.App.xMultiplier && CustomizableGameofLife.App.LastBottomCanvas.Item2 === CustomizableGameofLife.App.CurrentGridType) {
                        BottomCanvas = CustomizableGameofLife.App.LastBottomCanvas.Item3;
                    }
                    if (BottomCanvas == null) {
                        BottomCanvas = CustomizableGameofLife.App.CreateBottomCanvas();
                        CustomizableGameofLife.App.LastBottomCanvas = new (System.ValueTuple$3(System.Int32,CustomizableGameofLife.GridType,HTMLCanvasElement)).$ctor1(CustomizableGameofLife.App.xMultiplier, CustomizableGameofLife.App.CurrentGridType, BottomCanvas);
                    }
                    var TopCanvasContext = TopCanvas.getContext("2d");
                    CustomizableGameofLife.App.DOMCanvasContext.clearRect(0, 0, CustomizableGameofLife.App.DOMCanvas.width, CustomizableGameofLife.App.DOMCanvas.height);
                    var offsetX = { };
                    var offsetY = { };
                    Bridge.Deconstruct(CustomizableGameofLife.App.offsetPos.$clone(), offsetX, offsetY);
                    GetDrawPos = function (pos) {
                        var x = { };
                        var y = { };
                        Bridge.Deconstruct(pos.$clone(), x, y);
                        var drawX = (((x.v + (((Bridge.Int.div(offsetX.v, CustomizableGameofLife.App.xMultiplier)) | 0))) | 0) + 1) | 0, drawY = (((y.v + (((Bridge.Int.div(offsetY.v, CustomizableGameofLife.App.yMultiplier)) | 0))) | 0) + 1) | 0;
                        if (drawX < 0 || drawX >= ((CustomizableGameofLife.App.width + 2) | 0) || drawY < 0 || drawY >= ((CustomizableGameofLife.App.height + 2) | 0)) {
                            return null;
                        }
                        return new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(drawX, drawY);
                    };
                    GetDOMDrawPos = function (pos) {
                        var x = { };
                        var y = { };
                        Bridge.Deconstruct(pos.$clone(), x, y);
                        var drawX = (x.v + offsetX.v) | 0, drawY = (y.v + offsetY.v) | 0;
                        if (drawX < 0 || drawX >= CustomizableGameofLife.App.screenWidth || drawY < 0 || drawY >= CustomizableGameofLife.App.screenHeight) {
                            return null;
                        }
                        return new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(drawX, drawY);
                    };
                    var squareGrid;
                    if (((squareGrid = Bridge.as(CustomizableGameofLife.App.Grid, CustomizableGameofLife.SquareGrid))) != null) {
                        var imageDataArray = CustomizableGameofLife.App.CreateImageDataArray(((CustomizableGameofLife.App.width + 2) | 0), ((CustomizableGameofLife.App.height + 2) | 0));
                        $t = Bridge.getEnumerator(squareGrid.Squares);
                        try {
                            while ($t.moveNext()) {
                                var _d4 = $t.Current;
                                var pos = { v : new (System.ValueTuple$2(System.Int32,System.Int32))() };
                                var squareType = { v : new CustomizableGameofLife.SquareType() };
                                _d4.Deconstruct(pos, squareType);
                                var drawPos = System.Nullable.lift1("$clone", GetDrawPos(pos.v.$clone()));
                                if (drawPos == null) {
                                    continue;
                                }
                                var drawX = { };
                                var drawY = { };
                                Bridge.Deconstruct(System.Nullable.getValue(drawPos).$clone(), drawX, drawY);
                                var idx = (drawX.v + Bridge.Int.mul(drawY.v, (((CustomizableGameofLife.App.width + 2) | 0)))) | 0;
                                imageDataArray[((Bridge.Int.mul(idx, 4) + 3) | 0)] = CustomizableGameofLife.App.GetSquareTypeAlpha(squareType.v);
                            }
                        } finally {
                            if (Bridge.is($t, System.IDisposable)) {
                                $t.System$IDisposable$Dispose();
                            }
                        }
                        var imageData = new ImageData(imageDataArray, ((((CustomizableGameofLife.App.width + 2) | 0)) >>> 0), ((((CustomizableGameofLife.App.height + 2) | 0)) >>> 0));
                        TopCanvasContext.putImageData(imageData, 0, 0);
                        CustomizableGameofLife.App.DOMCanvasContext.drawImage(BottomCanvas, (((offsetX.v % CustomizableGameofLife.App.xMultiplier) - CustomizableGameofLife.App.xMultiplier) | 0), (((offsetY.v % CustomizableGameofLife.App.yMultiplier) - CustomizableGameofLife.App.yMultiplier) | 0));
                    } else {
                        var h;
                        if (((h = Bridge.as(CustomizableGameofLife.App.Grid, CustomizableGameofLife.HexGrid))) != null) {
                            CustomizableGameofLife.App.DOMCanvasContext.drawImage(BottomCanvas, (offsetX.v % (CustomizableGameofLife.HexGrid.cos60 * 2 * CustomizableGameofLife.App.xMultiplier)) - CustomizableGameofLife.HexGrid.cos60 * 2 * CustomizableGameofLife.App.xMultiplier, (offsetY.v % (CustomizableGameofLife.HexGrid.sin60 * 2 * CustomizableGameofLife.App.yMultiplier)) - CustomizableGameofLife.HexGrid.sin60 * 2 * CustomizableGameofLife.App.yMultiplier);
                            CustomizableGameofLife.App.Grid.DrawSquares(function (d, squareType1) {
                                var drawPos1 = System.Nullable.lift1("$clone", GetDOMDrawPos(d.$clone()));
                                if (!System.Nullable.hasValue(drawPos1)) {
                                    return;
                                }
                                CustomizableGameofLife.App.DOMCanvasContext.fillStyle = System.String.format("rgba(0, 0, 0, {0})", [Bridge.box(CustomizableGameofLife.App.GetSquareTypeAlpha(squareType1) / 255.0, System.Double, System.Double.format, System.Double.getHashCode)]);
                                CustomizableGameofLife.App.DrawHexagon(CustomizableGameofLife.App.DOMCanvasContext, System.Nullable.getValue(drawPos1).Item1, System.Nullable.getValue(drawPos1).Item2, ((Bridge.Int.div(Bridge.Int.mul(CustomizableGameofLife.App.xMultiplier, 2), 3)) | 0));
                            });
                        } else {
                            var triangleGrid;
                            if (((triangleGrid = Bridge.as(CustomizableGameofLife.App.Grid, CustomizableGameofLife.TriangleGrid))) != null) {
                                CustomizableGameofLife.App.DOMCanvasContext.drawImage(BottomCanvas, (offsetX.v % (CustomizableGameofLife.HexGrid.cos60 * 2 * CustomizableGameofLife.App.xMultiplier)) - CustomizableGameofLife.HexGrid.cos60 * 2 * CustomizableGameofLife.App.xMultiplier, (offsetY.v % (CustomizableGameofLife.HexGrid.sin60 * 2 * CustomizableGameofLife.App.yMultiplier)) - CustomizableGameofLife.HexGrid.sin60 * 2 * CustomizableGameofLife.App.yMultiplier);
                                triangleGrid.DrawSquares$1(function (d, coords, squareType1) {
                                    var drawPos1 = System.Nullable.lift1("$clone", GetDOMDrawPos(d.$clone()));
                                    if (!System.Nullable.hasValue(drawPos1)) {
                                        return;
                                    }
                                    CustomizableGameofLife.App.DOMCanvasContext.fillStyle = System.String.format("rgba(0, 0, 0, {0})", [Bridge.box(CustomizableGameofLife.App.GetSquareTypeAlpha(squareType1) / 255.0, System.Double, System.Double.format, System.Double.getHashCode)]);
                                    CustomizableGameofLife.App.DrawTriangle(CustomizableGameofLife.App.DOMCanvasContext, System.Nullable.getValue(drawPos1).Item1, System.Nullable.getValue(drawPos1).Item2, ((Bridge.Int.div(CustomizableGameofLife.App.xMultiplier, 2)) | 0), coords.Item3);
                                });
                            }
                        }
                    }
                    CustomizableGameofLife.App.DOMCanvasContext.imageSmoothingEnabled = false;
                    CustomizableGameofLife.App.DOMCanvasContext.drawImage(TopCanvas, (((offsetX.v % CustomizableGameofLife.App.xMultiplier) - CustomizableGameofLife.App.xMultiplier) | 0), (((offsetY.v % CustomizableGameofLife.App.yMultiplier) - CustomizableGameofLife.App.yMultiplier) | 0), Bridge.Int.mul((((CustomizableGameofLife.App.width + 2) | 0)), CustomizableGameofLife.App.xMultiplier), Bridge.Int.mul((((CustomizableGameofLife.App.height + 2) | 0)), CustomizableGameofLife.App.yMultiplier));





                    GetFinalDrawPos = function (pos1) {
                        var p = System.Nullable.lift1("$clone", GetDrawPos(pos1.$clone()));
                        if (p == null) {
                            return null;
                        }
                        var drawX1 = { };
                        var drawY1 = { };
                        Bridge.Deconstruct(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(System.Nullable.getValue(p).Item1, System.Nullable.getValue(p).Item2).$clone(), drawX1, drawY1);
                        drawX1.v *= (Bridge.Int.div(Bridge.Int.mul((((CustomizableGameofLife.App.width + 2) | 0)), CustomizableGameofLife.App.xMultiplier), TopCanvas.width)) | 0;
                        drawY1.v *= (Bridge.Int.div(Bridge.Int.mul((((CustomizableGameofLife.App.height + 2) | 0)), CustomizableGameofLife.App.yMultiplier), TopCanvas.height)) | 0;
                        drawX1.v += ((offsetX.v % CustomizableGameofLife.App.xMultiplier) - CustomizableGameofLife.App.xMultiplier) | 0;
                        drawY1.v += ((offsetY.v % CustomizableGameofLife.App.yMultiplier) - CustomizableGameofLife.App.yMultiplier) | 0;
                        return new (System.ValueTuple$2(System.Double,System.Double)).$ctor1(drawX1.v, drawY1.v);
                    };
                    DrawLine = function (start, end) {
                        if (!System.Nullable.hasValue(start) || !System.Nullable.hasValue(end)) {
                            return;
                        }
                        var startPos = System.Nullable.getValue(start).$clone();
                        var endPos = System.Nullable.getValue(end).$clone();
                        CustomizableGameofLife.App.DOMCanvasContext.beginPath();
                        CustomizableGameofLife.App.DOMCanvasContext.moveTo(startPos.Item1, startPos.Item2);
                        CustomizableGameofLife.App.DOMCanvasContext.lineTo(endPos.Item1, endPos.Item2);
                        CustomizableGameofLife.App.DOMCanvasContext.lineWidth = 2;
                        CustomizableGameofLife.App.DOMCanvasContext.strokeStyle = "red";
                        CustomizableGameofLife.App.DOMCanvasContext.stroke();
                    };
                    DrawMarker = function (position) {
                        if (!System.Nullable.hasValue(position)) {
                            return;
                        }
                        var drawX1 = { };
                        var drawY1 = { };
                        Bridge.Deconstruct(System.Nullable.getValue(position).$clone(), drawX1, drawY1);
                        CustomizableGameofLife.App.DOMCanvasContext.beginPath();
                        CustomizableGameofLife.App.DOMCanvasContext.arc(drawX1.v, drawY1.v, ((Bridge.Int.div(CustomizableGameofLife.App.xMultiplier, 8)) | 0), 0, 6.2831853071795862);
                        CustomizableGameofLife.App.DOMCanvasContext.fillStyle = "red";
                        CustomizableGameofLife.App.DOMCanvasContext.fill();
                    };
                    var s;
                    if (((s = Bridge.as(CustomizableGameofLife.App.Grid, CustomizableGameofLife.SquareGrid))) != null) {
                        $t1 = Bridge.getEnumerator(s.Dividers);
                        try {
                            while ($t1.moveNext()) {
                                var _d5 = $t1.Current;
                                var pos1 = { v : new (System.ValueTuple$2(System.Int32,System.Int32))() };
                                var dividers = { v : new CustomizableGameofLife.DividersInfo() };
                                _d5.Deconstruct(pos1, dividers);
                                $t2 = Bridge.getEnumerator(System.Array.init([CustomizableGameofLife.DividersInfo.BottomRight, CustomizableGameofLife.DividersInfo.Right, CustomizableGameofLife.DividersInfo.Bottom], CustomizableGameofLife.DividersInfo));
                                try {
                                    while ($t2.moveNext()) {
                                        var divider = $t2.Current;
                                        if (!System.Enum.hasFlag(dividers.v, Bridge.box(divider, CustomizableGameofLife.DividersInfo, System.Enum.toStringFn(CustomizableGameofLife.DividersInfo)))) {
                                            continue;
                                        }
                                        switch (divider) {
                                            case CustomizableGameofLife.DividersInfo.Right: 
                                                var startPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(((pos1.v.Item1 + 1) | 0), pos1.v.Item2);
                                                var endPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(((pos1.v.Item1 + 1) | 0), ((pos1.v.Item2 + 1) | 0));
                                                DrawLine(System.Nullable.lift1("$clone", GetFinalDrawPos(startPos.$clone())), System.Nullable.lift1("$clone", GetFinalDrawPos(endPos.$clone())));
                                                break;
                                            case CustomizableGameofLife.DividersInfo.Bottom: 
                                                DrawLine(System.Nullable.lift1("$clone", GetFinalDrawPos(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(pos1.v.Item1, ((pos1.v.Item2 + 1) | 0)))), System.Nullable.lift1("$clone", GetFinalDrawPos(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(((pos1.v.Item1 + 1) | 0), ((pos1.v.Item2 + 1) | 0)))));
                                                break;
                                            case CustomizableGameofLife.DividersInfo.BottomRight: 
                                                DrawMarker(System.Nullable.lift1("$clone", GetFinalDrawPos(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(((pos1.v.Item1 + 1) | 0), ((pos1.v.Item2 + 1) | 0)))));
                                                break;
                                            default: 
                                                throw new System.InvalidOperationException.ctor();
                                        }
                                    }
                                } finally {
                                    if (Bridge.is($t2, System.IDisposable)) {
                                        $t2.System$IDisposable$Dispose();
                                    }
                                }
                            }
                        } finally {
                            if (Bridge.is($t1, System.IDisposable)) {
                                $t1.System$IDisposable$Dispose();
                            }
                        }
                    }
                },
                NextFrame: function () {
                    if (!CustomizableGameofLife.App.playing) {
                        return;
                    }

                    var skipFrames = CustomizableGameofLife.App.Grid.SquareCount >= 250;
                    var updatesPerDraw = 1;
                    CustomizableGameofLife.App.frameNum = (CustomizableGameofLife.App.frameNum + 1) | 0;
                    if (skipFrames && (CustomizableGameofLife.App.frameNum % updatesPerDraw) !== 0) {
                        return;
                    }

                    for (var n = 0; n < updatesPerDraw; n = (n + 1) | 0) {
                        CustomizableGameofLife.App.Grid.Update();
                    }
                    CustomizableGameofLife.App.Draw();
                },
                DrawHexagon: function (context, x, y, radius, stroke) {
                    if (stroke === void 0) { stroke = false; }
                    context.beginPath();
                    context.moveTo(((x + radius) | 0), y);
                    for (var n = 1; n <= 6; n = (n + 1) | 0) {
                        var angle = n * Math.PI / 3;
                        context.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
                    }
                    if (stroke) {
                        context.stroke();
                    } else {
                        context.fill();
                    }
                },
                DrawTriangle: function (context, hexX, hexY, hexRadius, loc, stroke) {
                    if (stroke === void 0) { stroke = false; }
                    context.beginPath();
                    context.moveTo(hexX, hexY);
                    var angleInt = 0;
                    switch (loc) {
                        case CustomizableGameofLife.TriangleLocation.TopLeft: 
                            angleInt = 0;
                            break;
                        case CustomizableGameofLife.TriangleLocation.Top: 
                            angleInt = 60;
                            break;
                        case CustomizableGameofLife.TriangleLocation.TopRight: 
                            angleInt = 120;
                            break;
                        case CustomizableGameofLife.TriangleLocation.BottomRight: 
                            angleInt = 180;
                            break;
                        case CustomizableGameofLife.TriangleLocation.Bottom: 
                            angleInt = 240;
                            break;
                        case CustomizableGameofLife.TriangleLocation.BottomLeft: 
                            angleInt = 300;
                            break;
                        default: 
                            throw new System.InvalidOperationException.ctor();
                    }
                    var angle = angleInt * Math.PI / 180;
                    context.lineTo(hexX + hexRadius * Math.cos(angle), hexY + hexRadius * Math.sin(angle));
                    angle += 1.0471975511965976;
                    context.lineTo(hexX + hexRadius * Math.cos(angle), hexY + hexRadius * Math.sin(angle));
                    if (stroke) {
                        context.stroke();
                    } else {
                        context.fill();
                    }
                }
            }
        }
    });

    Bridge.define("CustomizableGameofLife.App.ModalType", {
        $kind: "nested enum",
        statics: {
            fields: {
                Settings: 0,
                NotableObjects: 1
            }
        }
    });

    Bridge.define("CustomizableGameofLife.DividersInfo", {
        $kind: "enum",
        statics: {
            fields: {
                None: 0,
                Right: 1,
                Bottom: 2,
                BottomRight: 4
            }
        },
        $flags: true
    });

    Bridge.define("CustomizableGameofLife.Extensions", {
        statics: {
            methods: {
                Add: function (T, element, nodes) {
                    var $t;
                    if (nodes === void 0) { nodes = []; }
                    $t = Bridge.getEnumerator(nodes);
                    try {
                        while ($t.moveNext()) {
                            var node = $t.Current;
                            if (node == null) {
                                continue;
                            } else {
                                if (Bridge.is(node, System.String)) {
                                    element.appendChild(document.createTextNode(node));
                                } else {
                                    element.appendChild(node);
                                }
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                    return element;
                },
                AddElement: function (T, element, nodes) {
                    if (nodes === void 0) { nodes = []; }
                    return CustomizableGameofLife.Extensions.Add(T, element, nodes);
                },
                AddDiv: function (T, element, nodes) {
                    if (nodes === void 0) { nodes = []; }
                    return CustomizableGameofLife.Extensions.Add(T, element, [CustomizableGameofLife.Extensions.Add(HTMLDivElement, document.createElement("div"), nodes)]);
                },
                AddUl: function (T, element, nodes) {
                    if (nodes === void 0) { nodes = []; }
                    return CustomizableGameofLife.Extensions.Add(T, element, [CustomizableGameofLife.Extensions.Add(HTMLUListElement, document.createElement("ul"), nodes.map(function (n) {
                            return Bridge.is(n, System.Array.type(System.Object)) ? CustomizableGameofLife.Extensions.Add(HTMLLIElement, document.createElement("li"), n) : Bridge.is(n, System.String) ? CustomizableGameofLife.Extensions.Add(HTMLLIElement, document.createElement("li"), [n]) : CustomizableGameofLife.Extensions.Add(HTMLLIElement, document.createElement("li"), [n]);
                        }))]);
                },
                AddCamelSpace: function (str) {
                    return System.Text.RegularExpressions.Regex.replace(System.Text.RegularExpressions.Regex.replace(str, "([^_a-z])([^_a-z][a-z])", "$1 $2"), "([a-z])([^_a-z])", "$1 $2");
                },
                ToCamelString: function (T, e) {
                    return System.String.replaceAll(CustomizableGameofLife.Extensions.AddCamelSpace(System.Enum.toString(Bridge.getType(e, T), e)), String.fromCharCode(95), String.fromCharCode(32));
                },
                AddEnum: function (T, select, defaultValue, defaultValueString) {
                    var $t, $t1;
                    if (defaultValue === void 0) { defaultValue = null; }
                    if (defaultValueString === void 0) { defaultValueString = ""; }
                    if (defaultValue == null) {
                        select.add(CustomizableGameofLife.Extensions.Add(HTMLOptionElement, ($t = document.createElement("option"), $t.value = "", $t.selected = true, $t.disable = true, $t), [defaultValueString]));
                    }
                    $t = Bridge.getEnumerator(System.Enum.getValues(T));
                    try {
                        while ($t.moveNext()) {
                            var value = Bridge.cast($t.Current, T);
                            select.add(CustomizableGameofLife.Extensions.Add(HTMLOptionElement, ($t1 = document.createElement("option"), $t1.value = Bridge.toString(System.Nullable.getValue(Bridge.cast(Bridge.unbox(value, System.Int32), System.Int32))), $t1.selected = Bridge.equals(defaultValue, value), $t1), [CustomizableGameofLife.Extensions.ToCamelString(T, value)]));
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                    return select;
                },
                BoolValue: function (checkBox) {
                    return checkBox.checked;
                },
                BoolValue$1: function (select) {
                    return Bridge.referenceEquals(select.value, "true") ? true : false;
                },
                AdjacencyValue: function (select) {
                    return System.Int32.parse(select.value);
                },
                Value: function (T, select) {
                    return Bridge.referenceEquals(select.value, "") ? null : Bridge.cast(System.Nullable.getValue(Bridge.cast(Bridge.unbox(Bridge.box(System.Int32.parse(select.value), System.Int32), T), T)), T, true);
                },
                SetBoolValue: function (checkBox, value) {
                    checkBox.checked = value;
                    return checkBox;
                },
                SetBoolValue$1: function (select, value) {
                    select.value = System.Boolean.toString(value).toLowerCase();
                    return select;
                },
                SetAdjacencyValue: function (select, value) {
                    select.value = Bridge.toString(value);
                    return select;
                },
                SetValue: function (T, select, value) {
                    select.value = Bridge.toString(System.Nullable.getValue(Bridge.cast(Bridge.unbox(value, System.Int32), System.Int32)));
                    return select;
                },
                ToTimeString: function (time) {
                    return time.toString(System.TimeSpan.gte(time, System.TimeSpan.fromHours(1)) ? "h\\:mm\\:ss" : "m\\:ss");
                },
                Clear: function (element) {
                    element.innerHTML = "";
                },
                JoinBR: function (strings) {
                    var $t;
                    var Inner = null;

                    Inner = function () {
                        return new (Bridge.GeneratorEnumerable$1(System.Object))(Bridge.fn.bind(this, function ()  {
                            var $step = 0,
                                $jumpFromFinally,
                                $returnValue,
                                enumer,
                                $async_e,
                                $async_e1;

                            var $enumerator = new (Bridge.GeneratorEnumerator$1(System.Object))(Bridge.fn.bind(this, function () {
                                try {
                                    for (;;) {
                                        switch ($step) {
                                            case 0: {
                                                enumer = Bridge.getEnumerator(strings, System.String);
                                                    
                                                $step = 1;
                                                continue;
                                            }
                                            case 1: {
                                                if (!enumer.System$Collections$IEnumerator$moveNext()) {
                                                        $step = 2;
                                                        continue;
                                                    } 
                                                    $step = 3;
                                                    continue;
                                            }
                                            case 2: {
                                                return false;
                                            }
                                            case 3: {
                                                $enumerator.current = enumer[Bridge.geti(enumer, "System$Collections$Generic$IEnumerator$1$System$String$Current$1", "System$Collections$Generic$IEnumerator$1$Current$1")];
                                                    $step = 4;
                                                    return true;
                                            }
                                            case 4: {
                                                $step = 5;
                                                continue;
                                            }
                                            case 5: {
                                                if ( enumer.System$Collections$IEnumerator$moveNext() ) {
                                                        $step = 6;
                                                        continue;
                                                    } 
                                                    $step = 9;
                                                    continue;
                                            }
                                            case 6: {
                                                $enumerator.current = document.createElement("br");
                                                    $step = 7;
                                                    return true;
                                            }
                                            case 7: {
                                                $enumerator.current = enumer[Bridge.geti(enumer, "System$Collections$Generic$IEnumerator$1$System$String$Current$1", "System$Collections$Generic$IEnumerator$1$Current$1")];
                                                    $step = 8;
                                                    return true;
                                            }
                                            case 8: {
                                                
                                                    $step = 5;
                                                    continue;
                                            }
                                            case 9: {
                                                $step = 10;
                                                continue;
                                            }
                                            case 10: {
                                                if (Bridge.hasValue(enumer)) enumer.System$IDisposable$Dispose();

                                                    if ($jumpFromFinally > -1) {
                                                        $step = $jumpFromFinally;
                                                        $jumpFromFinally = null;
                                                    } else if ($async_e) {
                                                        throw $async_e;
                                                        return;
                                                    } else if (Bridge.isDefined($returnValue)) {
                                                        $tcs.setResult($returnValue);
                                                        return;
                                                    }
                                                $step = 11;
                                                continue;
                                            }
                                            case 11: {

                                            }
                                            default: {
                                                return false;
                                            }
                                        }
                                    }
                                } catch($async_e1) {
                                    $async_e = System.Exception.create($async_e1);
                                    if ($step >= 1 && $step <= 9){

                                        $step = 10;
                                        $enumerator.moveNext();
                                        return;
                                    }
                                    throw $async_e;
                                }
                            }), function () {
                                if ($step >= 1 && $step <= 9){

                                    $step = 10;
                                    $enumerator.moveNext();
                                    return;
                                }

                            });
                            return $enumerator;
                        }));
                    };
                    return ($t = System.Object, System.Linq.Enumerable.from(Inner(), $t).ToArray($t));
                }
            }
        }
    });

    Bridge.define("CustomizableGameofLife.Grid");

    Bridge.define("CustomizableGameofLife.GridType", {
        $kind: "enum",
        statics: {
            fields: {
                Square: 0,
                Hex: 1,
                Triangle: 2,
                Count: 3
            }
        }
    });

    Bridge.define("CustomizableGameofLife.NotableObjectsList", {
        statics: {
            fields: {
                NotableObjects: null
            },
            ctors: {
                init: function () {
                    this.NotableObjects = function (_o3) {
                            _o3.add(new (System.ValueTuple$3(System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32)),System.String,System.String)).$ctor1(function (_o1) {
                                    _o1.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0));
                                    _o1.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(1, 0));
                                    _o1.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(1, 1));
                                    _o1.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 2));
                                    _o1.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(2, 2));
                                    return _o1;
                                }(new (System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32))).ctor()), "Two Generation Ninety Degree Rotator", "001010--- / 000101---"));
                            _o3.add(new (System.ValueTuple$3(System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32)),System.String,System.String)).$ctor1(function (_o2) {
                                    _o2.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0));
                                    _o2.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(1, 0));
                                    _o2.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(1, 1));
                                    _o2.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 1));
                                    _o2.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 2));
                                    return _o2;
                                }(new (System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32))).ctor()), "One Generation Ninety Degree Rotator", "001010--- / 000101---"));
                            return _o3;
                        }(new (System.Collections.Generic.List$1(System.ValueTuple$3(System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32)),System.String,System.String))).ctor());
                }
            }
        }
    });

    /** @namespace CustomizableGameofLife */

    /**
     * Options:
     - Cell (IsCell: true, IsWall: false)  | Black
     - Wall (IsCell: true, IsWall: true)   | Grey
     - Brick (IsCell: false, IsWall: true) | Grey
     *
     * @static
     * @abstract
     * @public
     * @class CustomizableGameofLife.SquareExtensions
     */
    Bridge.define("CustomizableGameofLife.SquareExtensions", {
        statics: {
            methods: {
                IsAlive: function (squareType) {
                    return squareType !== CustomizableGameofLife.SquareType.Brick;
                },
                IsUndead: function (squareType) {
                    return squareType !== CustomizableGameofLife.SquareType.Cell;
                },
                ContainsAlive: function (T, dic, key) {
                    var squareType = { v : new CustomizableGameofLife.SquareType() };
                    return dic.tryGetValue(key, squareType) && CustomizableGameofLife.SquareExtensions.IsAlive(squareType.v);
                }
            }
        }
    });

    Bridge.define("CustomizableGameofLife.SquareType", {
        $kind: "enum",
        statics: {
            fields: {
                Cell: 0,
                ImmortalCell: 1,
                Brick: 2,
                Count: 3
            }
        }
    });

    Bridge.define("CustomizableGameofLife.TriangleLocation", {
        $kind: "enum",
        statics: {
            fields: {
                TopLeft: 0,
                Top: 1,
                TopRight: 2,
                BottomLeft: 3,
                Bottom: 4,
                BottomRight: 5,
                Count: 6
            }
        }
    });

    Bridge.define("CustomizableGameofLife.Grid$1", function (CoordType) { return {
        inherits: [CustomizableGameofLife.Grid],
        fields: {
            Squares: null,
            Dividers: null
        },
        props: {
            SquareCount: {
                get: function () {
                    return this.Squares.Count;
                }
            }
        },
        ctors: {
            init: function () {
                this.Squares = new (System.Collections.Generic.Dictionary$2(CoordType,CustomizableGameofLife.SquareType)).ctor();
                this.Dividers = new (System.Collections.Generic.Dictionary$2(CoordType,CustomizableGameofLife.DividersInfo)).ctor();
            }
        },
        methods: {
            AssignDividers: function (drawPosition, placeNormally) { },
            Clear: function () {
                this.Squares.clear();
                this.Dividers.clear();
            },
            DrawSquares$1: function (DrawSquare) {
                var $t;
                $t = Bridge.getEnumerator(this.Squares);
                try {
                    while ($t.moveNext()) {
                        var _d1 = $t.Current;
                        var coords = { };
                        var squareType = { v : new CustomizableGameofLife.SquareType() };
                        _d1.Deconstruct(coords, squareType);
                        DrawSquare(this.GetDrawPosition(coords.v), coords.v, squareType.v);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            DrawSquares: function (DrawSquare) {
                this.DrawSquares$1(function (drawPosition, coords, squareType) {
                    DrawSquare(drawPosition.$clone(), squareType);
                });
            },
            Update: function () {
                var $t, $t1, $t2;
                var removing = new (System.Collections.Generic.List$1(CoordType)).ctor();
                var adding = new (System.Collections.Generic.HashSet$1(CoordType)).ctor();
                $t = Bridge.getEnumerator(this.Squares);
                try {
                    while ($t.moveNext()) {
                        var _d2 = $t.Current;
                        var coords = { };
                        var squareType = { v : new CustomizableGameofLife.SquareType() };
                        _d2.Deconstruct(coords, squareType);
                        if (!CustomizableGameofLife.SquareExtensions.IsAlive(squareType.v)) {
                            continue;
                        }
                        var adjacentCells = this.NumberOfAdjacentCells(coords.v, Bridge.fn.bind(this, function (coords_) {
                            if (CustomizableGameofLife.App.deadRules[System.Array.index(this.NumberOfAdjacentCells(coords_), CustomizableGameofLife.App.deadRules)]) {
                                adding.add(coords_);
                            }
                        }));
                        if (adjacentCells > CustomizableGameofLife.App.maxAdjacentCells) {
                            adjacentCells = CustomizableGameofLife.App.maxAdjacentCells;
                        }
                        if (!CustomizableGameofLife.SquareExtensions.IsUndead(squareType.v) && !CustomizableGameofLife.App.livingRules[System.Array.index(adjacentCells, CustomizableGameofLife.App.livingRules)]) {
                            removing.add(coords.v);
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                $t1 = Bridge.getEnumerator(removing);
                try {
                    while ($t1.moveNext()) {
                        var coords1 = $t1.Current;
                        if (!this.Squares.remove(coords1)) {
                            throw new System.Exception("Square tried to be removed but didn't exist");
                        }
                    }
                } finally {
                    if (Bridge.is($t1, System.IDisposable)) {
                        $t1.System$IDisposable$Dispose();
                    }
                }

                $t2 = Bridge.getEnumerator(adding);
                try {
                    while ($t2.moveNext()) {
                        var coords2 = $t2.Current;
                        this.Squares.add(coords2, CustomizableGameofLife.SquareType.Cell);
                    }
                } finally {
                    if (Bridge.is($t2, System.IDisposable)) {
                        $t2.System$IDisposable$Dispose();
                    }
                }
            },
            HandleClick: function (drawPosition, SquareTypePlacing) {
                var clickCoords = this.FromDrawPosition(drawPosition.$clone());
                var placeNormally = { v : true };
                if (SquareTypePlacing === CustomizableGameofLife.SquareType.Count) {
                    this.AssignDividers(drawPosition.$clone(), placeNormally);
                }
                if (placeNormally.v && !this.Squares.remove(clickCoords)) {
                    this.Squares.add(clickCoords, SquareTypePlacing === CustomizableGameofLife.SquareType.Count ? CustomizableGameofLife.SquareType.Cell : SquareTypePlacing);
                }
            }
        }
    }; });

    Bridge.define("CustomizableGameofLife.HexGrid", {
        inherits: [CustomizableGameofLife.Grid$1(System.ValueTuple$2(System.Int32,System.Int32))],
        statics: {
            fields: {
                cos60: 0,
                sin60: 0
            },
            ctors: {
                init: function () {
                    this.cos60 = Math.sin(1.0471975511965976);
                    this.sin60 = Math.cos(1.0471975511965976);
                }
            }
        },
        methods: {
            
            GetDrawPosition: function (coords) {
                var _60l = { };
                var _60r = { };
                Bridge.Deconstruct(coords.$clone(), _60l, _60r);
                return new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(Bridge.Int.clip32(Bridge.Int.mul((((((-_60l.v) | 0) + _60r.v) | 0)), CustomizableGameofLife.App.xMultiplier) * CustomizableGameofLife.HexGrid.cos60), Bridge.Int.clip32(Bridge.Int.mul(((-(((_60l.v + _60r.v) | 0))) | 0), CustomizableGameofLife.App.xMultiplier) * CustomizableGameofLife.HexGrid.sin60));
            },
            FromDrawPosition: function (drawPosition) {
                var x = { };
                var y = { };
                Bridge.Deconstruct(drawPosition.$clone(), x, y);

                /* 
                  x = (-_60l + _60r) * App.xMultiplier * sin60
                  y = -(_60l + _60r) * App.xMultiplier * cos60
                  k = App.xMultiplier
                  a = _60l
                  b = _60r

                  Solve x = (-a + b) * k * sin60;y = -(a+ b) * k * cos60 for (a, b) (https://www.wolframalpha.com/input?i=solve+x+%3D+%28-a+%2B+b%29+*+k+*+sin60%3By+%3D+-%28a%2B+b%29+*+k+*+cos60+for+a+and+b)

                  a = -(sqrt(3) x + 3 y)/(3 k)
                  b = (sqrt(3) x - 3 y)/(3 k)
                */

                return new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(Bridge.Int.clip32(-(Math.sqrt(3) * x.v + Bridge.Int.mul(3, y.v)) / (Bridge.Int.mul(3, CustomizableGameofLife.App.xMultiplier))), Bridge.Int.clip32((Math.sqrt(3) * x.v - Bridge.Int.mul(3, y.v)) / (Bridge.Int.mul(3, CustomizableGameofLife.App.xMultiplier))));
            },
            NumberOfAdjacentCells: function (coords, emptyAdjAction) {
                if (emptyAdjAction === void 0) { emptyAdjAction = null; }
                var _60l = { };
                var _60r = { };
                Bridge.Deconstruct(coords.$clone(), _60l, _60r);
                var adjacentCells = 0;
                for (var L = 0; L <= 5; L = (L + 1) | 0) {
                    var adjacencyRule = CustomizableGameofLife.App.adjacencyRules[System.Array.index(L, CustomizableGameofLife.App.adjacencyRules)];


                    var _60l_ = { }, _60r_ = { };
                    switch (L) {
                        case 0: 
                            _60l_.v = (_60l.v + 1) | 0;
                            _60r_.v = _60r.v;
                            break;
                        case 1: 
                            _60l_.v = (_60l.v + 1) | 0;
                            _60r_.v = (_60r.v + 1) | 0;
                            break;
                        case 2: 
                            _60l_.v = _60l.v;
                            _60r_.v = (_60r.v + 1) | 0;
                            break;
                        case 3: 
                            _60l_.v = (_60l.v - 1) | 0;
                            _60r_.v = _60r.v;
                            break;
                        case 4: 
                            _60l_.v = (_60l.v - 1) | 0;
                            _60r_.v = (_60r.v - 1) | 0;
                            break;
                        case 5: 
                            _60l_.v = _60l.v;
                            _60r_.v = (_60r.v - 1) | 0;
                            break;
                        default: 
                            throw new System.InvalidOperationException.$ctor1(System.String.format("Invalid L: {0}", [Bridge.box(L, System.Int32)]));
                    }
                    var squareInfo = { v : new CustomizableGameofLife.SquareType() };


                    if (this.Squares.tryGetValue(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(_60l_.v, _60r_.v), squareInfo)) {
                        if (CustomizableGameofLife.SquareExtensions.IsAlive(squareInfo.v)) {
                            adjacentCells = (adjacentCells + adjacencyRule) | 0;
                        }
                    } else {
                        !Bridge.staticEquals(emptyAdjAction, null) ? emptyAdjAction(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(_60l_.v, _60r_.v)) : null;
                    }
                }
                return adjacentCells > CustomizableGameofLife.App.maxAdjacentCells ? CustomizableGameofLife.App.maxAdjacentCells : adjacentCells;
            }
        }
    });

    Bridge.define("CustomizableGameofLife.SquareGrid", {
        inherits: [CustomizableGameofLife.Grid$1(System.ValueTuple$2(System.Int32,System.Int32))],
        methods: {
            GetDrawPosition: function (coords) {
                return new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(Bridge.Int.mul(coords.Item1, CustomizableGameofLife.App.xMultiplier), Bridge.Int.mul(coords.Item2, CustomizableGameofLife.App.xMultiplier));
            },
            FromDrawPosition: function (drawPosition) {
                return new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(CustomizableGameofLife.App.NegDiv(drawPosition.Item1, CustomizableGameofLife.App.xMultiplier), CustomizableGameofLife.App.NegDiv(drawPosition.Item2, CustomizableGameofLife.App.xMultiplier));
            },
            AssignDividers: function (drawPosition, placeNormally) {
                var clickX_ = { };
                var clickY_ = { };
                Bridge.Deconstruct(new (System.ValueTuple$2(System.Double,System.Double)).$ctor1(CustomizableGameofLife.App.NegDivDouble(drawPosition.Item1, CustomizableGameofLife.App.xMultiplier), CustomizableGameofLife.App.NegDivDouble(drawPosition.Item2, CustomizableGameofLife.App.yMultiplier)).$clone(), clickX_, clickY_);
                placeNormally.v = false;
                var xDiv = 0, yDiv = 0;
                if (clickX_.v % 1 <= 0.2) {
                    xDiv = -1;
                } else {
                    if (clickX_.v % 1 >= 0.8) {
                        xDiv = 1;
                    }
                }
                if (clickY_.v % 1 <= 0.2) {
                    yDiv = -1;
                } else {
                    if (clickY_.v % 1 >= 0.8) {
                        yDiv = 1;
                    }
                }
                var dividersInfo = CustomizableGameofLife.DividersInfo.None;
                var Assign = Bridge.fn.bind(this, function (divInfo) {
                    var x = (Bridge.Int.clip32(clickX_.v) + xDiv) | 0, y = (Bridge.Int.clip32(clickY_.v) + yDiv) | 0;
                    if (divInfo !== CustomizableGameofLife.DividersInfo.None) {
                        var dividers = { v : new CustomizableGameofLife.DividersInfo() };
                        if (!this.Dividers.tryGetValue(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x, y), dividers)) {
                            dividers.v = CustomizableGameofLife.DividersInfo.None;
                        }
                        this.Dividers.setItem(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x, y), dividers.v ^ divInfo);
                    }
                });
                switch (xDiv) {
                    case -1: 
                        switch (yDiv) {
                            case -1: 
                                Assign(CustomizableGameofLife.DividersInfo.BottomRight);
                                break;
                            case 0: 
                                Assign(CustomizableGameofLife.DividersInfo.Right);
                                break;
                            case 1: 
                                yDiv = 0;
                                Assign(CustomizableGameofLife.DividersInfo.BottomRight);
                                break;
                            default: 
                                throw new System.InvalidOperationException.ctor();
                        }
                        break;
                    case 0: 
                        switch (yDiv) {
                            case -1: 
                                Assign(CustomizableGameofLife.DividersInfo.Bottom);
                                break;
                            case 0: 
                                placeNormally.v = true;
                                break;
                            case 1: 
                                dividersInfo = CustomizableGameofLife.DividersInfo.Bottom;
                                break;
                            default: 
                                throw new System.InvalidOperationException.ctor();
                        }
                        break;
                    case 1: 
                        switch (yDiv) {
                            case -1: 
                                xDiv = 0;
                                Assign(CustomizableGameofLife.DividersInfo.BottomRight);
                                break;
                            case 0: 
                                dividersInfo = CustomizableGameofLife.DividersInfo.Right;
                                break;
                            case 1: 
                                dividersInfo = CustomizableGameofLife.DividersInfo.BottomRight;
                                break;
                            default: 
                                throw new System.InvalidOperationException.ctor();
                        }
                        break;
                    default: 
                        throw new System.InvalidOperationException.ctor();
                }
                if (dividersInfo !== CustomizableGameofLife.DividersInfo.None) {
                    xDiv = 0;
                    yDiv = 0;
                    Assign(dividersInfo);
                }
            },
            NumberOfAdjacentCells: function (coords, emptyAdjAction) {
                if (emptyAdjAction === void 0) { emptyAdjAction = null; }
                var adjacentCells = 0;
                var n = 0;
                for (var L = 0; L <= 8; L = (L + 1) | 0) {
                    if (L === 4) {
                        continue;
                    }
                    var adjacencyRule = CustomizableGameofLife.App.adjacencyRules[System.Array.index(Bridge.identity(n, ((n = (n + 1) | 0))), CustomizableGameofLife.App.adjacencyRules)];

                    var c0_ = { v : (((coords.Item1 - 1) | 0) + (L % 3)) | 0 }, c1_ = { v : (((coords.Item2 - 1) | 0) + ((Bridge.Int.div(L, 3)) | 0)) | 0 };

                    if (CustomizableGameofLife.App.HasDividers(this.Dividers, coords.Item1, coords.Item2, L)) {
                        continue;
                    }
                    var squareInfo = { v : new CustomizableGameofLife.SquareType() };

                    if (this.Squares.tryGetValue(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(c0_.v, c1_.v), squareInfo)) {
                        if (CustomizableGameofLife.SquareExtensions.IsAlive(squareInfo.v)) {
                            adjacentCells = (adjacentCells + adjacencyRule) | 0;
                        }
                    } else {
                        !Bridge.staticEquals(emptyAdjAction, null) ? emptyAdjAction(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(c0_.v, c1_.v)) : null;
                    }
                }
                return adjacentCells > CustomizableGameofLife.App.maxAdjacentCells ? CustomizableGameofLife.App.maxAdjacentCells : adjacentCells;
            }
        }
    });

    Bridge.define("CustomizableGameofLife.TriangleGrid", {
        inherits: [CustomizableGameofLife.Grid$1(System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.TriangleLocation))],
        statics: {
            fields: {
                cos60: 0,
                sin60: 0
            },
            ctors: {
                init: function () {
                    this.cos60 = Math.sin(1.0471975511965976);
                    this.sin60 = Math.cos(1.0471975511965976);
                }
            }
        },
        methods: {
            GetDrawPosition: function (coords) {
                var _60l = { };
                var _60r = { };
                var n = { v : new CustomizableGameofLife.TriangleLocation() };
                Bridge.Deconstruct(coords.$clone(), _60l, _60r, n);
                return new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(Bridge.Int.clip32(Bridge.Int.mul((((((-_60l.v) | 0) + _60r.v) | 0)), CustomizableGameofLife.App.xMultiplier) * CustomizableGameofLife.TriangleGrid.cos60), Bridge.Int.clip32(Bridge.Int.mul(((-(((_60l.v + _60r.v) | 0))) | 0), CustomizableGameofLife.App.xMultiplier) * CustomizableGameofLife.TriangleGrid.sin60));
            },
            FromDrawPosition: function (drawPosition) {
                var NegMod1 = null;
                var x = { };
                var y = { };
                Bridge.Deconstruct(drawPosition.$clone(), x, y);

                /* 
                  x = (-_60l + _60r) * App.xMultiplier * sin60
                  y = -(_60l + _60r) * App.xMultiplier * cos60
                  k = App.xMultiplier
                  a = _60l
                  b = _60r

                  Solve x = (-a + b) * k * sin60;y = -(a+ b) * k * cos60 for (a, b) (https://www.wolframalpha.com/input?i=solve+x+%3D+%28-a+%2B+b%29+*+k+*+sin60%3By+%3D+-%28a%2B+b%29+*+k+*+cos60+for+a+and+b)

                  a = -(3 x + sqrt(3) y)/(3 k)
                  b = (3 x - sqrt(3) y)/(3 k)
                */


                var board_60l = -(Math.sqrt(3) * x.v + Bridge.Int.mul(3, y.v)) / (Bridge.Int.mul(3, CustomizableGameofLife.App.xMultiplier)), board_60r = (Math.sqrt(3) * x.v - Bridge.Int.mul(3, y.v)) / (Bridge.Int.mul(3, CustomizableGameofLife.App.xMultiplier));


                NegMod1 = function (a) {
                    return (a % 1 + 1) % 1;
                };

                var _60lMod1 = NegMod1(board_60l), _60rMod1 = NegMod1(board_60r);

                var n = _60rMod1 <= (0.5) ? _60lMod1 <= (0.33333333333333331) ? CustomizableGameofLife.TriangleLocation.Bottom : _60lMod1 <= (0.66666666666666663) ? CustomizableGameofLife.TriangleLocation.BottomLeft : CustomizableGameofLife.TriangleLocation.TopLeft : _60lMod1 <= (0.33333333333333331) ? CustomizableGameofLife.TriangleLocation.BottomRight : _60lMod1 <= (0.66666666666666663) ? CustomizableGameofLife.TriangleLocation.TopRight : CustomizableGameofLife.TriangleLocation.Top;
                return new (System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.TriangleLocation)).$ctor1(Bridge.Int.clip32(Bridge.Math.round(board_60l, 0, 6)), Bridge.Int.clip32(Bridge.Math.round(board_60r, 0, 6)), n);
            },
            NumberOfAdjacentCells: function (coords, emptyAdjAction) {
                if (emptyAdjAction === void 0) { emptyAdjAction = null; }
                var AddSquare = null;
                var CreatePos = null;
                var GetFinalHexagonLocPos = null;
                var GetHexagonLoc = null;
                var GetHexagonLocPos = null;
                var _60l = { };
                var _60r = { };
                var n = { v : new CustomizableGameofLife.TriangleLocation() };
                Bridge.Deconstruct(coords.$clone(), _60l, _60r, n);
                var adjacentCells = 0;

                for (var loc = 0; loc < CustomizableGameofLife.TriangleLocation.Count; loc = (loc + 1) | 0) {
                    if (loc === n.v) {
                        continue;
                    }
                    var adjacencyRule = CustomizableGameofLife.App.adjacencyRules[System.Array.index(loc, CustomizableGameofLife.App.adjacencyRules)];
                    var squareType = { v : new CustomizableGameofLife.SquareType() };
                    if (this.Squares.tryGetValue(new (System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.TriangleLocation)).$ctor1(_60l.v, _60r.v, loc), squareType)) {
                        if (CustomizableGameofLife.SquareExtensions.IsAlive(squareType.v)) {
                            adjacentCells = (adjacentCells + adjacencyRule) | 0;
                        }
                    } else {
                        !Bridge.staticEquals(emptyAdjAction, null) ? emptyAdjAction(new (System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.TriangleLocation)).$ctor1(_60l.v, _60r.v, loc)) : null;
                    }
                }








                var x_ = n.v === CustomizableGameofLife.TriangleLocation.TopLeft || n.v === CustomizableGameofLife.TriangleLocation.BottomLeft ? -1 : n.v === CustomizableGameofLife.TriangleLocation.TopRight || n.v === CustomizableGameofLife.TriangleLocation.BottomRight ? 1 : 0, y_ = n.v === CustomizableGameofLife.TriangleLocation.TopLeft || n.v === CustomizableGameofLife.TriangleLocation.TopRight || n.v === CustomizableGameofLife.TriangleLocation.Top ? -1 : 1;





                GetHexagonLocPos = function (invertX, invertY) {
                    return new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(invertX === -1 ? 0 : invertX === 1 ? ((-x_) | 0) : x_, invertY ? ((-y_) | 0) : y_);
                };

                GetHexagonLoc = function (x, y) {
                    return y === 0 ? (function () {
                        throw new System.InvalidOperationException.$ctor1("y cannot be 0");
                    })() : x === 0 ? y === -1 ? CustomizableGameofLife.TriangleLocation.Bottom : CustomizableGameofLife.TriangleLocation.Top : x === -1 ? y === -1 ? CustomizableGameofLife.TriangleLocation.TopLeft : CustomizableGameofLife.TriangleLocation.BottomLeft : x === 1 ? y === -1 ? CustomizableGameofLife.TriangleLocation.TopRight : CustomizableGameofLife.TriangleLocation.BottomRight : (function () {
                        throw new System.InvalidOperationException.$ctor1("x must be -1, 0 or 1");
                    })();
                };
                GetFinalHexagonLocPos = function (invertX, invertY) {
                    var x = { };
                    var y = { };
                    Bridge.Deconstruct(GetHexagonLocPos(invertX, invertY).$clone(), x, y);
                    return new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(((_60l.v + x.v) | 0), ((_60r.v + y.v) | 0));
                };
                CreatePos = function (pos, N) {
                    return new (System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.TriangleLocation)).$ctor1(pos.Item1, pos.Item2, N);
                };
                AddSquare = Bridge.fn.bind(this, function (invertX1, invertY1, invertX2, invertY2, x1Override, x2Override) {
                    var _60l_ = { };
                    var _60r_ = { };
                    Bridge.Deconstruct(GetFinalHexagonLocPos(invertX1, invertY1).$clone(), _60l_, _60r_);
                    if (x1Override !== 0) {
                        _60l_.v = x1Override;
                    }
                    var pos2 = GetHexagonLocPos(invertX2, invertY2).$clone();
                    if (x2Override !== 0) {
                        pos2.Item1 = x2Override;
                    }
                    var n_ = GetHexagonLoc(pos2.Item1, pos2.Item2);
                    var coords_ = CreatePos(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(_60l_.v, _60r_.v), n_).$clone();
                    var squareInfo = { v : new CustomizableGameofLife.SquareType() };
                    if (this.Squares.tryGetValue(coords_.$clone(), squareInfo)) {
                        if (CustomizableGameofLife.SquareExtensions.IsAlive(squareInfo.v)) {
                            adjacentCells = (adjacentCells + 1) | 0;
                        }
                    } else {
                        !Bridge.staticEquals(emptyAdjAction, null) ? emptyAdjAction(coords_.$clone()) : null;
                    }
                });

                switch (n.v) {
                    case CustomizableGameofLife.TriangleLocation.TopLeft: 
                    case CustomizableGameofLife.TriangleLocation.TopRight: 
                    case CustomizableGameofLife.TriangleLocation.BottomLeft: 
                    case CustomizableGameofLife.TriangleLocation.BottomRight: 
                        AddSquare(1, true, 0, false, 0, 0);
                        AddSquare(1, false, 0, false, 0, 0);
                        AddSquare(-1, true, 0, false, 0, 0);
                        AddSquare(1, false, 0, true, 0, 0);
                        AddSquare(-1, false, 0, true, 0, 0);
                        AddSquare(0, true, -1, false, 0, 0);
                        AddSquare(-1, true, -1, false, 0, 0);
                        break;
                    case CustomizableGameofLife.TriangleLocation.Top: 
                    case CustomizableGameofLife.TriangleLocation.Bottom: 
                        AddSquare(0, true, 0, false, 1, 0);
                        AddSquare(0, true, 0, false, 0, 0);
                        AddSquare(0, true, 0, false, -1, 0);
                        AddSquare(0, false, 0, false, 1, -1);
                        AddSquare(0, true, 0, false, 1, -1);
                        AddSquare(0, false, 0, false, -1, 1);
                        AddSquare(0, true, 0, false, -1, 1);
                        break;
                    default: 
                        throw new System.InvalidOperationException.$ctor1("n must be 0, 1, 2, 3, 4 or 5");
                }

                return adjacentCells > CustomizableGameofLife.App.maxAdjacentCells ? CustomizableGameofLife.App.maxAdjacentCells : adjacentCells;
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDdXN0b21pemFibGVHYW1lb2ZMaWZlLmpzIiwKICAic291cmNlUm9vdCI6ICIiLAogICJzb3VyY2VzIjogWyJDbGFzczEuY3MiLCJFeHRlbnNpb25zLmNzIiwiTm90YWJsZU9iamVjdHNMaXN0LmNzIiwiU3F1YXJlLmNzIiwiR3JpZC5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQXlqQkFBLHdCQUFpRUE7WUFDckRBLHFCQUF3QkE7WUFDcENBO1lBQXFCQSxJQUFJQSxDQUFDQSxLQUFJQSw4Q0FBNkJBO2dCQUUzQ0E7b0JBRUlBLGVBQW1CQSxXQUFXQTtvQkFDOUJBLElBQUlBLGtCQUFrQkE7d0JBRWxCQSxJQUFJQSxBQUFxQ0E7NEJBRXJDQSxtQkFBc0JBLDhDQUFzQ0EsZUFBZUEsdUJBQXZCQTs0QkFDcERBLGtCQUFXQSxpQkFBY0EsMkNBQWFBOzt3QkFFMUNBLElBQUlBLEFBQXFDQTs0QkFFckNBLG9CQUFzQkEsOENBQXNDQSxlQUFlQSxxQkFBdkJBOzRCQUNwREEsa0JBQVdBLGtCQUFjQSx5Q0FBV0E7O3dCQUV4Q0EsSUFBSUEsQUFBcUNBOzRCQUVyQ0Esb0JBQStCQSw4Q0FBK0NBLGVBQWVBLDBCQUFoQ0E7NEJBQzdEQSxrQkFBV0Esa0JBQWNBLDhDQUFnQkE7Ozs7Ozs7WUFNekRBO1lBQ0FBLDBCQUEwQkE7WUFDMUJBO1lBQ0FBLDBCQUEwQkE7WUFDMUJBLDBCQUEwQkE7O1lBRTFCQTs7WUFFQUEsa0JBQStEQSxBQUFxRkEsVUFBQ0E7b0JBQU9BLFFBQVFBLEtBQUlBLCtJQUEwRUEsa0dBQTBFQTtvQkFBNEVBLFFBQVFBLEtBQUlBLHdJQUFtRUEsMkZBQW1FQTtvQkFBNEVBLFFBQVFBLEtBQUlBLCtJQUEwRUEsNEZBQW9FQTtvQkFBNEVBLFFBQVFBLEtBQUlBLHlKQUFvRkEsa0dBQTBFQTtvQkFBMkVBLE9BQU9BO2tCQUEzK0JBLEtBQUlBOztZQUVqR0EsaUJBQTRCQSwwREFB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T0EsS0FBSUEsdURBQTRCQSxXQUFPQSxXQUFHQSxXQUFPQTs7Z0JBSTVEQSxZQUFZQSxVQUFDQSxLQUFLQTsyQkFBTUEsS0FBSUEsK0ZBQThDQSxXQUFXQSxXQUFXQTs7Z0JBQ2hHQSxZQUFZQSwrQkFBQ0EsVUFBY0EsVUFBZUEsVUFBY0EsVUFBZUEsWUFBZ0JBO29CQUVuRkE7b0JBQ0FBO29CQUNBQSxtQkFBMEJBLHNCQUFzQkEsVUFBVUEsb0JBQWVBLE9BQVdBO29CQUNwRkEsSUFBSUE7d0JBQ0FBLFVBQVFBOztvQkFDWkEsV0FBbUNBLGlCQUFpQkEsVUFBVUE7b0JBQzlEQSxJQUFJQTt3QkFDQUEsYUFBYUE7O29CQUNqQkEsU0FBc0JBLGNBQWNBLFlBQVlBO29CQUNoREEsY0FBY0EsVUFBVUEsS0FBSUEsdURBQTRCQSxTQUFPQSxVQUFRQTtvQkFDdkVBO29CQUNBQSxJQUFJQSx5QkFBb0JBLGtCQUFhQTt3QkFFakNBLElBQUlBOzRCQUNBQTs7O3dCQUdKQSxxQ0FBa0JBLFFBQU9BLEFBQXVDQSxlQUFzQkEsb0JBQVlBOzs7O2dCQUs5RkEsUUFBUUE7b0JBRUpBLEtBQUtBO29CQUNMQSxLQUFLQTtvQkFDTEEsS0FBS0E7b0JBQ0xBLEtBQUtBO3dCQU1EQTt3QkFDQUE7d0JBQ0FBLFVBQVVBO3dCQUNWQTt3QkFDQUEsVUFBVUE7d0JBQ1ZBLG1CQUFtQkE7d0JBQ25CQSxVQUFVQSxVQUFVQTt3QkFDcEJBO29CQUNKQSxLQUFLQTtvQkFDTEEsS0FBS0E7d0JBQ0RBO3dCQUNBQTt3QkFDQUEsNkJBQTZCQTt3QkFDN0JBLGlDQUFpQ0E7d0JBQ2pDQSxnQ0FBZ0NBO3dCQUNoQ0EsOEJBQThCQTt3QkFDOUJBLDZCQUE2QkE7d0JBQzdCQTtvQkFDSkE7d0JBQ0lBLE1BQU1BLElBQUlBOzs7Z0JBR2xCQSxPQUFPQSxnQkFBZ0JBLDhDQUF1QkEsOENBQXVCQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucztcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5EaWFnbm9zdGljcy5Db250cmFjdHM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uUmVmbGVjdGlvbjtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIEFwcFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IHhNdWx0aXBsaWVyID0gMjA7XHJcbnB1YmxpYyBzdGF0aWMgaW50IHlNdWx0aXBsaWVyXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB4TXVsdGlwbGllcjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgZG91YmxlIGFjdHVhbFhNdWx0aXBsaWVyXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBHcmlkIGlzIEhleEdyaWQgPyB4TXVsdGlwbGllciAqIDIgKiBIZXhHcmlkLmNvczYwIDogeE11bHRpcGxpZXI7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIGRvdWJsZSBhY3R1YWxZTXVsdGlwbGllclxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gR3JpZCBpcyBIZXhHcmlkID8geU11bHRpcGxpZXIgKiAyICogSGV4R3JpZC5zaW42MCA6IHlNdWx0aXBsaWVyO1xyXG4gICAgfVxyXG59ICAgICAgICBwdWJsaWMgc3RhdGljIGludCBzY3JlZW5XaWR0aCA9IFdpbmRvdy5Jbm5lcldpZHRoLCBzY3JlZW5IZWlnaHQgPSBXaW5kb3cuSW5uZXJIZWlnaHQ7XHJcbnB1YmxpYyBzdGF0aWMgaW50IHdpZHRoXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiAoaW50KU1hdGguQ2VpbGluZygoZG91YmxlKXNjcmVlbldpZHRoIC8geE11bHRpcGxpZXIpO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBpbnQgaGVpZ2h0XHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiAoaW50KU1hdGguQ2VpbGluZygoZG91YmxlKXNjcmVlbkhlaWdodCAvIHlNdWx0aXBsaWVyKTtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgSG90YmFyID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgIFBvc2l0aW9uID0gUG9zaXRpb24uQWJzb2x1dGUsXHJcbiAgICAgICAgICAgICAgICBMZWZ0ID0gXCIxMDBweFwiLFxyXG4gICAgICAgICAgICAgICAgVG9wID0gc3RyaW5nLkZvcm1hdChcInswfXB4XCIsV2luZG93LklubmVySGVpZ2h0IC0gNDApICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBSZXNldChtYWtlQmxhbms6IHRydWUpXHJcbiAgICAgICAgICAgIH0sXCJCbGFua1wiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBSZXNldCgpXHJcbiAgICAgICAgICAgIH0sXCJSZXNldFwiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBHZXRDb29yZGluYXRlcygpXHJcbiAgICAgICAgICAgIH0sXCJHZXQgQ29vcmRpbmF0ZXNcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIixcclxuICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+IFNhdmVBc1N0YXJ0ZXIoKVxyXG4gICAgICAgICAgICB9LFwiU2F2ZSBhcyBTdGFydGVyXCIpKVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFpvb20oem9vbUluOiBmYWxzZSlcclxuICAgICAgICAgICAgfSxcIlpvb20gT3V0XCIpKVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFpvb20oem9vbUluOiB0cnVlKVxyXG4gICAgICAgICAgICB9LFwiWm9vbSBJblwiKSlcclxuLE5leHRHcmlkVHlwZUJ1dHRvbiA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBOZXh0R3JpZFR5cGUoKVxyXG4gICAgICAgICAgICB9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5Ub0NhbWVsU3RyaW5nPEdyaWRUeXBlPihEZWZhdWx0R3JpZFR5cGUpKSlcclxuLE5leHRTcXVhcmVUeXBlQnV0dG9uID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IE5leHRTcXVhcmVUeXBlKClcclxuICAgICAgICAgICAgfSxcIldhbGxcIikpXHJcbixQbGF5QnV0dG9uID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IEludmVydElzUGxheWluZygpXHJcbiAgICAgICAgICAgIH0sXCLilrZcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gU2hvd01vZGFsKE1vZGFsVHlwZS5TZXR0aW5ncylcclxuICAgICAgICAgICAgfSxcIuKamVwiKSk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU3F1YXJlVHlwZSBTcXVhcmVUeXBlUGxhY2luZyA9IFNxdWFyZVR5cGUuQ291bnQ7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBHcmlkVHlwZSBDdXJyZW50R3JpZFR5cGUgPSBEZWZhdWx0R3JpZFR5cGU7XHJcbiAgICAgICAgcHVibGljIGNvbnN0IEdyaWRUeXBlIERlZmF1bHRHcmlkVHlwZSA9IEdyaWRUeXBlLlNxdWFyZTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxCdXR0b25FbGVtZW50IE5leHRHcmlkVHlwZUJ1dHRvbiwgTmV4dFNxdWFyZVR5cGVCdXR0b247XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBab29tIChib29sIHpvb21JbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHhNdWx0aXBsaWVyICs9IHpvb21JbiA/IDEgOiAtMTtcclxuICAgICAgICAgICAgaWYgKHhNdWx0aXBsaWVyIDw9IDEpXHJcbiAgICAgICAgICAgICAgICB4TXVsdGlwbGllciA9IDI7XHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBOZXh0U3F1YXJlVHlwZSAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU3F1YXJlVHlwZVBsYWNpbmcgPSAoU3F1YXJlVHlwZSkoKChpbnQpU3F1YXJlVHlwZVBsYWNpbmcgKyAxKSAlIChpbnQpKFNxdWFyZVR5cGUuQ291bnQgKyAxKSk7XHJcbiAgICAgICAgICAgIE5leHRTcXVhcmVUeXBlQnV0dG9uLklubmVySFRNTCA9IFNxdWFyZVR5cGVQbGFjaW5nID09IFNxdWFyZVR5cGUuQ291bnQgPyBcIldhbGxcIiA6IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5Ub0NhbWVsU3RyaW5nPFNxdWFyZVR5cGU+KFNxdWFyZVR5cGVQbGFjaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBOZXh0R3JpZFR5cGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ3VycmVudEdyaWRUeXBlID0gKEdyaWRUeXBlKSgoKGludClDdXJyZW50R3JpZFR5cGUgKyAxKSAlIChpbnQpR3JpZFR5cGUuQ291bnQpO1xyXG4gICAgICAgICAgICBOZXh0R3JpZFR5cGVCdXR0b24uSW5uZXJIVE1MID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLlRvQ2FtZWxTdHJpbmc8R3JpZFR5cGU+KEN1cnJlbnRHcmlkVHlwZSk7XHJcbiAgICAgICAgICAgIGlmIChDdXJyZW50R3JpZFR5cGUgPT0gR3JpZFR5cGUuVHJpYW5nbGUpXHJcbiAgICAgICAgICAgICAgICB4TXVsdGlwbGllciAqPSAyO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChDdXJyZW50R3JpZFR5cGUgPT0gR3JpZFR5cGUuU3F1YXJlKVxyXG4gICAgICAgICAgICAgICAgeE11bHRpcGxpZXIgLz0gMjtcclxuICAgICAgICAgICAgc3dpdGNoIChDdXJyZW50R3JpZFR5cGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgR3JpZFR5cGUuU3F1YXJlOlxyXG4gICAgICAgICAgICAgICAgICAgIEdyaWQgPSBuZXcgU3F1YXJlR3JpZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBHcmlkVHlwZS5IZXg6XHJcbiAgICAgICAgICAgICAgICAgICAgR3JpZCA9IG5ldyBIZXhHcmlkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEdyaWRUeXBlLlRyaWFuZ2xlOlxyXG4gICAgICAgICAgICAgICAgICAgIEdyaWQgPSBuZXcgVHJpYW5nbGVHcmlkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgU2V0dXBTZXR0aW5nc0RpdigpO1xyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IFJpZ2h0SG90YmFyID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgIFBvc2l0aW9uID0gUG9zaXRpb24uQWJzb2x1dGUsXHJcbiAgICAgICAgICAgICAgICBSaWdodCA9IFwiMTAwcHhcIixcclxuICAgICAgICAgICAgICAgIFRvcCA9IHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLFdpbmRvdy5Jbm5lckhlaWdodCAtIDQwKSAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLWluZm9cIixcclxuICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+IFNob3dNb2RhbChNb2RhbFR5cGUuTm90YWJsZU9iamVjdHMpXHJcbiAgICAgICAgICAgIH0sXCJOb3RhYmxlIE9iamVjdHNcIikpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgUmVzZXQgKGJvb2wgbWFrZUJsYW5rID0gZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIUdsb2JhbC5Db25maXJtKFwiQW55IHVuc2F2ZWQgY2hhbmdlcyB3aWxsIGJlIGxvc3QuIENvbnRpbnVlP1wiKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBHcmlkLkNsZWFyKCk7XHJcbkdyaWQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PiBncmlkOyAgICAgICAgICAgIGlmICghbWFrZUJsYW5rICYmIChncmlkID0gR3JpZCBhcyBHcmlkPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4pICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG9mZnNldFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Qgc3RhcnRlclBvc2l0aW9ucyA9IEdsb2JhbC5Mb2NhbFN0b3JhZ2UuR2V0SXRlbShcInN0YXJ0ZXJQb3NpdGlvbnNcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRlclBvc2l0aW9ucyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyBzID0gKHN0cmluZylzdGFydGVyUG9zaXRpb25zO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc3RyaW5nLklzTnVsbE9yRW1wdHkocykpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIganNvblJhdyA9IEpTT04uUGFyc2UocykuVG9EeW5hbWljKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqc29uUmF3Lmxlbmd0aCA9PSAwIHx8IGpzb25SYXdbMF0uSXRlbTMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAodmFyIHBvcyBpbiAoSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPltdPihzKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZC5TcXVhcmVzLkFkZChwb3MsIFNxdWFyZVR5cGUuQ2VsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAodmFyIHNxdWFyZUluZm8gaW4gKEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxTcXVhcmVUeXBlID5bXT4ocykpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyaWQuU3F1YXJlcy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihzcXVhcmVJbmZvLkl0ZW0xLCBzcXVhcmVJbmZvLkl0ZW0yKSwgc3F1YXJlSW5mby5JdGVtMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwbGF5aW5nKVxyXG4gICAgICAgICAgICAgICAgSW52ZXJ0SXNQbGF5aW5nKCk7XHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsU3F1YXJlVHlwZSA+PiBHZXRDb29yZGluYXRlc0ludGVyYWwoKVxyXG4gICAgICAgIHtcclxuR3JpZDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+IGc7ICAgICAgICAgICAgaWYgKChnID0gR3JpZCBhcyBHcmlkPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4pICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gb2Zmc2V0Q29vcmRzID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihOZWdEaXYob2Zmc2V0UG9zLkl0ZW0xLCAoaW50KWFjdHVhbFhNdWx0aXBsaWVyKSwgTmVnRGl2KG9mZnNldFBvcy5JdGVtMiwgKGludClhY3R1YWxZTXVsdGlwbGllcikpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuVG9MaXN0PEtleVZhbHVlUGFpcjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixTcXVhcmVUeXBlPj4oZy5TcXVhcmVzKS5Db252ZXJ0QWxsPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4+KChDb252ZXJ0ZXI8S2V5VmFsdWVQYWlyPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+LFNxdWFyZVR5cGU+LFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4+KShzID0+IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgU3F1YXJlVHlwZT4ocy5LZXkuSXRlbTEgKyBvZmZzZXRDb29yZHMuSXRlbTEsIHMuS2V5Lkl0ZW0yICsgb2Zmc2V0Q29vcmRzLkl0ZW0yLCBzLlZhbHVlKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsU3F1YXJlVHlwZSA+PigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxTcXVhcmVUeXBlID4+IEdldE5vcm1hbGl6ZWRDb29yZGluYXRlcygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxTcXVhcmVUeXBlID4+IGNvb3JkcyA9IEdldENvb3JkaW5hdGVzSW50ZXJhbCgpO1xyXG4gICAgICAgICAgICBpZiAoY29vcmRzLkNvdW50ID09IDApXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29vcmRzO1xyXG4gICAgICAgICAgICBjb29yZHMgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLldoZXJlPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4+KGNvb3JkcywoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+LGJvb2w+KShjID0+IGMuSXRlbTE+PSAwICYmIGMuSXRlbTI+PSAwICYmIGMuSXRlbTE8IHdpZHRoICYmIGMuSXRlbTI8IGhlaWdodCkpLlRvTGlzdCgpO1xyXG4gICAgICAgICAgICBpbnQgbWluWCA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuTWluPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4+KGNvb3JkcywoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+LGludD4pKGMgPT4gYy5JdGVtMSkpLCBtaW5ZID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5NaW48U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPj4oY29vcmRzLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4saW50PikoYyA9PiBjLkl0ZW0yKSk7XHJcbiAgICAgICAgICAgIGNvb3JkcyA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4sU3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPj4oY29vcmRzLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4sU3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPj4pKGMgPT4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBTcXVhcmVUeXBlPihjLkl0ZW0xIC0gbWluWCwgYy5JdGVtMiAtIG1pblksIGMuSXRlbTMpKSkuVG9MaXN0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb29yZHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgR2V0Q29vcmRpbmF0ZXMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RyaW5nIGNvZGVHZW5lcmF0ZWQgPSBzdHJpbmcuRm9ybWF0KFwiKG5ldyBIYXNoU2V0PChpbnQgeCwgaW50IHkpPlxcclxcbnt7XFxyXFxuICAgIHswfVxcclxcbn19LCBcXFwiVW50aXRsZWQgT2JqZWN0XFxcIiwgezF9KVwiLHN0cmluZy5Kb2luKFwiLFxcbiAgICBcIiwgU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPixzdHJpbmc+KEdldE5vcm1hbGl6ZWRDb29yZGluYXRlcygpLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4sc3RyaW5nPikodCA9PiBzdHJpbmcuRm9ybWF0KFwiKHswfSwgezF9KVwiLHQuSXRlbTEsdC5JdGVtMikpKSksSlNPTi5TdHJpbmdpZnkoc3RyaW5nLkZvcm1hdChcInswfXsxfSAvIHsyfVwiLChTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkFsbDxBZGphY2VuY3lUeXBlPihhZGphY2VuY3lSdWxlcywoRnVuYzxBZGphY2VuY3lUeXBlLGJvb2w+KShhID0+IGEgPT0gQWRqYWNlbmN5VHlwZS5PbmUpKSA/IFwiXCIgOiAoc3RyaW5nLkNvbmNhdDxpbnQ+KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0PEFkamFjZW5jeVR5cGUsaW50PihhZGphY2VuY3lSdWxlcywoRnVuYzxBZGphY2VuY3lUeXBlLGludD4pKGsgPT4gKGludClrKSkpKSArIFwiIC0+IFwiKSxzdHJpbmcuQ29uY2F0PGludD4oU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8Ym9vbCxpbnQ+KGRlYWRSdWxlcywoRnVuYzxib29sLGludD4pKGsgPT4gayA/IDEgOiAwKSkpLHN0cmluZy5Db25jYXQ8aW50PihTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxib29sLGludD4obGl2aW5nUnVsZXMsKEZ1bmM8Ym9vbCxpbnQ+KShrID0+IGsgPyAxIDogMCkpKSkpKTtcclxuICAgICAgICAgICAgSFRNTERpdkVsZW1lbnQgbW9kYWwsIG1vZGFsQ29udGVudCA9XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgICAgIG5ldyBIVE1MRGl2RWxlbWVudCB7IENsYXNzTmFtZSA9IFwibW9kYWwtY29udGVudFwiIH1cclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50IHsgQ2xhc3NOYW1lID0gXCJtb2RhbC1kaWFsb2dcIiB9XHJcbixtb2RhbCA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50IHsgQ2xhc3NOYW1lID0gXCJtb2RhbFwiLCBTdHlsZSA9IHsgRGlzcGxheSA9IFwiaW5oZXJpdFwiIH0gfVxyXG4sRG9jdW1lbnQuQm9keSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KFxyXG4gICAgICAgICAgICBtb2RhbENvbnRlbnQsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oXHJcbiAgICAgICAgICAgICAgICBuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcIm1vZGFsLWhlYWRlclwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuLWNsb3NlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+IG1vZGFsLlJlbW92ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4sbmV3IEhUTUxTcGFuRWxlbWVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbm5lckhUTUwgPSBcIiZ0aW1lcztcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICApLFxyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxQcmVFbGVtZW50PihcclxuXHJcbiAgICAgICAgICAgICAgICBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgSFRNTFByZUVsZW1lbnQoKSwoX28xKT0+e19vMS5DbGFzc05hbWU9IFwibW9kYWwtYm9keVwiO19vMS5TdHlsZVtcInVzZXItc2VsZWN0XCJdPSBcInRleHRcIjtyZXR1cm4gX28xO30pLGNvZGVHZW5lcmF0ZWQpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgU2F2ZUFzU3RhcnRlciAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgR2xvYmFsLkxvY2FsU3RvcmFnZS5TZXRJdGVtKFxyXG4gICAgICAgICAgICAgICAgXCJzdGFydGVyUG9zaXRpb25zXCIsIEpzb25Db252ZXJ0LlNlcmlhbGl6ZU9iamVjdChHZXRDb29yZGluYXRlc0ludGVyYWwoKSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgU2V0dGluZ3NQb3B1cCwgTm90YWJsZU9iamVjdHNQb3B1cDtcclxucHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBDcmVhdGVQb3B1cCgpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTERpdkVsZW1lbnR7U3R5bGUgPSB7Rm9udFNpemUgPSBcIjEuNXJlbVwiLCBCYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCIsIFBvc2l0aW9uID0gUG9zaXRpb24uRml4ZWQsIFRvcCA9IFwiMHB4XCIsIExlZnQgPSBcIjI1JVwiLCBXaWR0aCA9IFwiNTAlXCIsIEhlaWdodCA9IFwiMTAwJVwiLCBEaXNwbGF5ID0gRGlzcGxheS5Ob25lLCBPdmVyZmxvdyA9IE92ZXJmbG93LlNjcm9sbH19O1xyXG59XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBQb3B1cENvbnRhaW5lciA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBIVE1MRGl2RWxlbWVudCgpLChfbzEpPT57X28xLlN0eWxlLlBvc2l0aW9uPSBQb3NpdGlvbi5GaXhlZDtfbzEuU3R5bGUuVG9wPSBcIjBcIjtfbzEuU3R5bGUuTGVmdD0gXCIwXCI7X28xLlN0eWxlLldpZHRoPSBcIjEwMCVcIjtfbzEuU3R5bGVbXCJ4LWluZGV4XCJdPSA5OTk5OTk7X28xLlN0eWxlLkhlaWdodD0gXCIxMDAlXCI7X28xLlN0eWxlLkJhY2tncm91bmRDb2xvcj0gXCJyZ2JhKDAsIDAsIDAsIDAuNSlcIjtfbzEuU3R5bGUuRGlzcGxheT0gRGlzcGxheS5Ob25lO3JldHVybiBfbzE7fSlcclxuLFNldHRpbmdzUG9wdXAgPSBDcmVhdGVQb3B1cCgpKVxyXG4sTm90YWJsZU9iamVjdHNQb3B1cCA9IENyZWF0ZVBvcHVwKCkpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxCdXR0b25FbGVtZW50IFNldHRpbmdzQnV0dG9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxCdXR0b25FbGVtZW50IFBsYXlCdXR0b247XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBJbnZlcnRJc1BsYXlpbmcgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSAhcGxheWluZztcclxuICAgICAgICAgICAgUGxheUJ1dHRvbi5Jbm5lckhUTUwgPSBwbGF5aW5nID8gXCLij7hcIiA6IFwi4pa2XCI7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIHBsYXlpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sW10gbGl2aW5nUnVsZXMgPSBuZXcgYm9vbFttYXhBZGphY2VudENlbGxzICsgMV0geyBmYWxzZSwgZmFsc2UsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UgfTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2xbXSBkZWFkUnVsZXMgICAgID0gbmV3IGJvb2xbbWF4QWRqYWNlbnRDZWxscyArIDFdIHsgZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSB9O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgQWRqYWNlbmN5VHlwZVtdIGFkamFjZW5jeVJ1bGVzID0gbmV3IEFkamFjZW5jeVR5cGVbbWF4QWRqYWNlbnRDZWxsc10geyBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lIH07XHJcbnB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ3JlYXRlQ2FudmFzKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MQ2FudmFzRWxlbWVudHtXaWR0aCA9IHNjcmVlbldpZHRoLCBIZWlnaHQgPSBzY3JlZW5IZWlnaHR9O1xyXG59cHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBDcmVhdGVUb3BDYW52YXMoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxDYW52YXNFbGVtZW50e1dpZHRoID0gd2lkdGggKyAyLCBIZWlnaHQgPSBoZWlnaHQgKyAyfTtcclxufSAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGUgaHlwbyhkb3VibGUgeCwgZG91YmxlIHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5TcXJ0KE1hdGguUG93KHgsIDIpICsgTWF0aC5Qb3coeSwgMikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IENyZWF0ZUJvdHRvbUNhbnZhcygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBCb3R0b21DYW52YXMgPSBHcmlkIGlzIEhleEdyaWQgP1xyXG4gICAgICAgICAgICAgICAgbmV3IEhUTUxDYW52YXNFbGVtZW50XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgV2lkdGggPSBET01DYW52YXMuV2lkdGggKyA0ICogeE11bHRpcGxpZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgSGVpZ2h0ID0gRE9NQ2FudmFzLkhlaWdodCArIDQgKiB5TXVsdGlwbGllclxyXG4gICAgICAgICAgICAgICAgfSA6XHJcbiAgICAgICAgICAgICAgICBuZXcgSFRNTENhbnZhc0VsZW1lbnRcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBXaWR0aCA9IHNjcmVlbldpZHRoICsgMiAqIHhNdWx0aXBsaWVyLFxyXG4gICAgICAgICAgICAgICAgICAgIEhlaWdodCA9IHNjcmVlbkhlaWdodCArIDIgKiB5TXVsdGlwbGllclxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIEJvdHRvbUNhbnZhc0NvbnRleHQgPSBCb3R0b21DYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuU3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuVHJhbnNsYXRlKDAuNSwgMC41KTtcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5MaW5lV2lkdGggPSAxO1xyXG5IZXhHcmlkIGg7ICAgICAgICAgICAgaWYgKChoID0gR3JpZCBhcyBIZXhHcmlkKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgYSA9IC0oaW50KWh5cG8od2lkdGgsIGhlaWdodCk7IGEgPCAoaW50KWh5cG8od2lkdGgsIGhlaWdodCk7IGErKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCBiID0gLShpbnQpaHlwbyh3aWR0aCwgaGVpZ2h0KTsgYiA8IChpbnQpaHlwbyh3aWR0aCwgaGVpZ2h0KTsgYisrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuaW50IHg7XG5pbnQgeTtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoaC5HZXREcmF3UG9zaXRpb24obmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihhLCBiKSksIG91dCB4LCBvdXQgeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuRHJhd0hleGFnb24oeCwgeSwgeE11bHRpcGxpZXIgKiAyIC8gMywgc3Ryb2tlOiB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICBUcmlhbmdsZUdyaWQgdDtcclxuICAgIGlmICgodCA9IEdyaWQgYXMgVHJpYW5nbGVHcmlkKSAhPSBudWxsKVxyXG4gICAge1xyXG4gICAgICAgIGZvciAoaW50IGEgPSAtKGludCloeXBvKHdpZHRoLCBoZWlnaHQpOyBhIDwgKGludCloeXBvKHdpZHRoLCBoZWlnaHQpOyBhKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGludCBiID0gLShpbnQpaHlwbyh3aWR0aCwgaGVpZ2h0KTsgYiA8IChpbnQpaHlwbyh3aWR0aCwgaGVpZ2h0KTsgYisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKFRyaWFuZ2xlTG9jYXRpb24gdGwgPSBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQ7IHRsIDwgVHJpYW5nbGVMb2NhdGlvbi5Db3VudDsgdGwrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnQgeDtcclxuICAgICAgICAgICAgICAgICAgICBpbnQgeTtcclxuICAgICAgICAgICAgICAgICAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KHQuR2V0RHJhd1Bvc2l0aW9uKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4oYSwgYiwgdGwpKSwgb3V0IHgsIG91dCB5KTtcclxuICAgICAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkRyYXdUcmlhbmdsZSh4LCB5LCB4TXVsdGlwbGllciAqIDIgLyAzLCB0bCwgc3Ryb2tlOiB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIC8vSGV4R3JpZCBncmlkID0gbmV3IEhleEdyaWQoKTtcclxuICAgIC8vZG91YmxlIHhPZmZzZXQgPSB3aWR0aCAvIDIgKiBBcHAueE11bHRpcGxpZXIgKyBvZmZzZXRQb3MueFxyXG4gICAgLy8gICAgICwgeU9mZnNldCA9IGhlaWdodCAqIEFwcC54TXVsdGlwbGllciArIG9mZnNldFBvcy55O1xyXG4gICAgLy9pbnQgbWluV2lkdGggPSAtMiwgbWluSGVpZ2h0ID0gLTI7XHJcbiAgICAvL2ludCBtYXhXaWR0aCA9IChpbnQpTWF0aC5DZWlsaW5nKGh5cG8od2lkdGgsIGhlaWdodCkpLCBtYXhIZWlnaHQgPSAoaW50KU1hdGguQ2VpbGluZyhoeXBvKHdpZHRoLCBoZWlnaHQpKTtcclxuICAgIC8vZm9yIChpbnQgXzMwbCA9IG1pbldpZHRoIC0gMjsgXzMwbCA8PSAobWF4V2lkdGggKyAyKTsgXzMwbCsrKVxyXG4gICAgLy97XHJcbiAgICAvLyAgICB2YXIgcG9zMSA9IGdyaWQuR2V0RHJhd1Bvc2l0aW9uKChfMzBsLCBtaW5IZWlnaHQgLSAzKSk7XHJcbiAgICAvLyAgICB2YXIgcG9zMiA9IGdyaWQuR2V0RHJhd1Bvc2l0aW9uKChfMzBsLCBtYXhIZWlnaHQgKyAzKSk7XHJcbiAgICAvLyAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbyhwb3MxLnggKyB4T2Zmc2V0LCBwb3MxLnkgKyB5T2Zmc2V0KTtcclxuICAgIC8vICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKHBvczIueCArIHhPZmZzZXQsIHBvczIueSArIHlPZmZzZXQpO1xyXG4gICAgLy99XHJcbiAgICAvL2ZvciAoaW50IF8zMHIgPSBtaW5IZWlnaHQgLSAyOyBfMzByIDw9IChtYXhIZWlnaHQgKyAyKTsgXzMwcisrKVxyXG4gICAgLy97XHJcbiAgICAvLyAgICB2YXIgcG9zMSA9IGdyaWQuR2V0RHJhd1Bvc2l0aW9uKChtaW5XaWR0aCAtIDMsIF8zMHIpKTtcclxuICAgIC8vICAgIHZhciBwb3MyID0gZ3JpZC5HZXREcmF3UG9zaXRpb24oKG1heFdpZHRoICsgMywgXzMwcikpO1xyXG4gICAgLy8gICAgQm90dG9tQ2FudmFzQ29udGV4dC5Nb3ZlVG8ocG9zMS54ICsgeE9mZnNldCwgcG9zMS55ICsgeU9mZnNldCk7XHJcbiAgICAvLyAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVUbyhwb3MyLnggKyB4T2Zmc2V0LCBwb3MyLnkgKyB5T2Zmc2V0KTtcclxuICAgIC8vfVxyXG4gICAgLy9mb3IgKGludCB5ID0gbWluSGVpZ2h0IC0gMjsgeSA8PSAobWF4SGVpZ2h0ICsgMik7IHkrKylcclxuICAgIC8ve1xyXG4gICAgLy8gICAgdmFyIHBvczEgPSBncmlkLkdldERyYXdQb3NpdGlvbigoLXdpZHRoIC8geE11bHRpcGxpZXIsIHkpKTtcclxuICAgIC8vICAgIHZhciBwb3MyID0gZ3JpZC5HZXREcmF3UG9zaXRpb24oKHksIC13aWR0aCAvIHhNdWx0aXBsaWVyKSk7XHJcbiAgICAvLyAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbyhwb3MxLnggKyB4T2Zmc2V0LCBwb3MxLnkgKyB5T2Zmc2V0KTtcclxuICAgIC8vICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKHBvczIueCArIHhPZmZzZXQsIHBvczIueSArIHlPZmZzZXQpO1xyXG4gICAgLy99XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChHcmlkIGlzIFNxdWFyZUdyaWQpXHJcbiAgICB7XHJcbiAgICAgICAgZm9yIChpbnQgeCA9IDA7IHggPD0gKHdpZHRoICsgMik7IHgrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTW92ZVRvKHggKiB4TXVsdGlwbGllciwgMCk7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKHggKiB4TXVsdGlwbGllciwgKGhlaWdodCArIDMpICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChpbnQgeSA9IDA7IHkgPD0gKGhlaWdodCArIDIpOyB5KyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbygwLCB5ICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVUbygod2lkdGggKyAzKSAqIHhNdWx0aXBsaWVyLCB5ICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDwgMTA7IG4rKylcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuU3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBCb3R0b21DYW52YXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IERPTUNhbnZhcyA9IENyZWF0ZUNhbnZhcygpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIERPTUNhbnZhc0NvbnRleHQgPSBET01DYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgR3JpZCBHcmlkID0gRGVmYXVsdEdyaWRUeXBlID09IEdyaWRUeXBlLlNxdWFyZSA/IG5ldyBTcXVhcmVHcmlkKCkgOlxyXG4gICAgICAgICAgICBEZWZhdWx0R3JpZFR5cGUgPT0gR3JpZFR5cGUuVHJpYW5nbGUgPyAoR3JpZCkobmV3IFRyaWFuZ2xlR3JpZCgpKSA6XHJcbiAgICAgICAgICAgIERlZmF1bHRHcmlkVHlwZSA9PSBHcmlkVHlwZS5IZXggPyBuZXcgSGV4R3JpZCgpIDpcclxuKChTeXN0ZW0uRnVuYzxIZXhHcmlkPikoKCk9Pnt0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFeGNlcHRpb24oKTt9KSkoKTtcclxuICAgICAgICBcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gb2Zmc2V0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IE1vdXNlUG9zICh0aGlzIE1vdXNlRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciByZWN0ID0gRE9NQ2FudmFzLkdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KShlLkNsaWVudFggLSByZWN0LkxlZnQpLCAoaW50KShlLkNsaWVudFkgLSByZWN0LlRvcCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgTmVnRGl2IChpbnQgYSwgaW50IGIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgcmVzID0gYSAvIGI7XHJcbiAgICAgICAgICAgIHJldHVybiAoYSA8IDAgJiYgYSAhPSBiICogcmVzKSA/IHJlcyAtIDEgOiByZXM7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIGRvdWJsZSBOZWdEaXZEb3VibGUoZG91YmxlIGEsIGRvdWJsZSBiKVxyXG57XHJcbiAgICByZXR1cm4gYSA+PSAwID8gYSAvIGIgOiAoYSAtIGIgKyAxKSAvIGI7XHJcbn1cclxuICAgICAgICBwdWJsaWMgY29uc3QgaW50IG1heEFkamFjZW50Q2VsbHMgPSAxMjtcclxucHVibGljIHN0YXRpYyBpbnQgY3VycmVudE1heEFkamFjZW50Q2VsbHNcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIEdyaWQgaXMgSGV4R3JpZCA/IDYgOiBHcmlkIGlzIFNxdWFyZUdyaWQgPyA4IDogR3JpZCBpcyBUcmlhbmdsZUdyaWQgPyAxMiA6ICgoU3lzdGVtLkZ1bmM8aW50PikoKCkgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEV4Y2VwdGlvbihzdHJpbmcuRm9ybWF0KFwiR3JpZCB0eXBlIG5vdCBmb3VuZDogezB9XCIsR3JpZC5HZXRUeXBlKCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICkpKCk7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBzdGF0aWMgTGlzdDxIVE1MU2VsZWN0RWxlbWVudD4gYWRqYWNlbmN5UnVsZXNDZWxscyA9IG5ldyBMaXN0PEhUTUxTZWxlY3RFbGVtZW50PigpO1xyXG4gICAgICAgIHN0YXRpYyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPEhUTUxJbnB1dEVsZW1lbnQsSFRNTElucHV0RWxlbWVudD4+IG9wdGlvbkNlbGxzID0gbmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SFRNTElucHV0RWxlbWVudCxIVE1MSW5wdXRFbGVtZW50Pj4oKTtcclxuXHJcbiAgICAgICAgc3RhdGljIHZvaWQgQXBwbHlQcmVzZXQoYm9vbFtdIGxpdmluZ1J1bGVzLCBib29sW10gZGVhZFJ1bGVzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPD0gODsgbisrKVxyXG4gICAgICAgICAgICB7XHJcbm9wdGlvbkNlbGxzW25dLkl0ZW0xLlNldEJvb2xWYWx1ZShsaXZpbmdSdWxlc1tuXSk7XHJcbm9wdGlvbkNlbGxzW25dLkl0ZW0yLlNldEJvb2xWYWx1ZShkZWFkUnVsZXNbbl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZW51bSBNb2RhbFR5cGVcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNldHRpbmdzLFxyXG4gICAgICAgICAgICBOb3RhYmxlT2JqZWN0c1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFNob3dNb2RhbCAoTW9kYWxUeXBlIG1vZGFsVHlwZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFBvcHVwQ29udGFpbmVyLlN0eWxlLkRpc3BsYXkgPSBcIlwiO1xyXG4gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCB0b1Nob3c7XHJcbiAgICAgICAgICAgIHN3aXRjaCAobW9kYWxUeXBlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1vZGFsVHlwZS5TZXR0aW5nczpcclxuICAgICAgICAgICAgICAgICAgICB0b1Nob3cgPSBTZXR0aW5nc1BvcHVwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNb2RhbFR5cGUuTm90YWJsZU9iamVjdHM6XHJcbiAgICAgICAgICAgICAgICAgICAgdG9TaG93ID0gTm90YWJsZU9iamVjdHNQb3B1cDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEFyZ3VtZW50RXhjZXB0aW9uKCgoaW50KW1vZGFsVHlwZSkuVG9TdHJpbmcoKSwgXCJtb2RhbFR5cGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yZWFjaCAoSFRNTERpdkVsZW1lbnQgZGl2IGluIG5ld1tdIHsgU2V0dGluZ3NQb3B1cCwgTm90YWJsZU9iamVjdHNQb3B1cCB9KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkaXYuU3R5bGUuRGlzcGxheSA9IGRpdiA9PSB0b1Nob3cgPyBcIlwiIDogXCJub25lXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBIaWRlTW9kYWwgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFBvcHVwQ29udGFpbmVyLlN0eWxlLkRpc3BsYXkgPSBEaXNwbGF5Lk5vbmU7XHJcbiAgICAgICAgICAgIFNldHRpbmdzUG9wdXAuU3R5bGUuRGlzcGxheSA9IERpc3BsYXkuTm9uZTtcclxuICAgICAgICAgICAgTm90YWJsZU9iamVjdHNQb3B1cC5TdHlsZS5EaXNwbGF5ID0gRGlzcGxheS5Ob25lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBEcmF3U2hhcGUgKEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gU3F1YXJlcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCB4TXVsdGlwbGllciA9IEFwcC54TXVsdGlwbGllciAqIDI7XHJcbiAgICAgICAgICAgIGludCB5TXVsdGlwbGllciA9IEFwcC55TXVsdGlwbGllciAqIDI7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXR0aW5nIHdpZHRoIGFuZCBoZWlnaHQgb2Ygc2hhcGVcclxuICAgICAgICAgICAgaW50IHdpZHRoID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5NYXg8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4+KFNxdWFyZXMsKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4saW50PikocyA9PiBzLkl0ZW0xKSkgKyAxO1xyXG4gICAgICAgICAgICBpbnQgaGVpZ2h0ID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5NYXg8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4+KFNxdWFyZXMsKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4saW50PikocyA9PiBzLkl0ZW0yKSkgKyAxO1xyXG4gICAgICAgICAgICAvLyBEcmF3aW5nIG9uIGlubmVyIGNhbnZhc1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBpbm5lckNhbnZhcyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBXaWR0aCA9IHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgSGVpZ2h0ID0gaGVpZ2h0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBjb250ZXh0ID0gaW5uZXJDYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIFVpbnQ4Q2xhbXBlZEFycmF5IGltYWdlRGF0YUFycmF5ID0gQ3JlYXRlSW1hZ2VEYXRhQXJyYXkod2lkdGgsIGhlaWdodCk7XHJcbmZvcmVhY2ggKHZhciBfZDEgaW4gU3F1YXJlcylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2QxLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaW1hZ2VEYXRhQXJyYXlbKHggKyB5ICogd2lkdGgpICogNCArIDNdID0gMjU1O1xyXG59XG4gICAgICAgICAgICBJbWFnZURhdGEgaW1hZ2VEYXRhID0gbmV3IEltYWdlRGF0YShpbWFnZURhdGFBcnJheSwgKHVpbnQpd2lkdGgsICh1aW50KWhlaWdodCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuUHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XHJcbiAgICAgICAgICAgIC8vIFJlc2l6aW5nIHRvIHVwcGVyIGNhbnZhc1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBvdXRlckNhbnZhcyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBXaWR0aCA9IHdpZHRoICogeE11bHRpcGxpZXIsXHJcbiAgICAgICAgICAgICAgICBIZWlnaHQgPSBoZWlnaHQgKiB5TXVsdGlwbGllclxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgb3V0ZXJDb250ZXh0ID0gb3V0ZXJDYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIG91dGVyQ29udGV4dC5JbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgb3V0ZXJDb250ZXh0LkRyYXdJbWFnZShpbm5lckNhbnZhcywgMCwgMCwgb3V0ZXJDYW52YXMuV2lkdGgsIG91dGVyQ2FudmFzLkhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gb3V0ZXJDYW52YXM7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIFVpbnQ4Q2xhbXBlZEFycmF5IENyZWF0ZUltYWdlRGF0YUFycmF5KGludCB3aWR0aCwgaW50IGhlaWdodClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBVaW50OENsYW1wZWRBcnJheSh3aWR0aCAqIGhlaWdodCAqIDQpO1xyXG59cHVibGljIHN0YXRpYyBIVE1MSW5wdXRFbGVtZW50IENyZWF0ZUNoZWNrYm94KClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MSW5wdXRFbGVtZW50e1R5cGUgPSBJbnB1dFR5cGUuQ2hlY2tib3gsIFN0eWxlID0ge1dpZHRoID0gXCIxcmVtXCIsIEhlaWdodCA9IFwiMWVtXCJ9fTtcclxufXB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgQ3JlYXRlMDFTZWxlY3RvcigpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTFNlbGVjdEVsZW1lbnQoKS5BZGQ8SFRNTFNlbGVjdEVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudHtWYWx1ZSA9IFwiZmFsc2VcIn0sXCIwXCIpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcInRydWVcIn0sXCIxXCIpKTtcclxufXB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgQ3JlYXRlMDEyU2VsZWN0b3IoKVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MU2VsZWN0RWxlbWVudD4obmV3IEhUTUxTZWxlY3RFbGVtZW50KCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCIwXCJ9LFwiMFwiKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCIxXCJ9LFwiMVwiKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCIyXCJ9LFwiMlwiKSk7XHJcbn1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IGFkamFjZW5jeVJ1bGVzVGFibGVEaXYgPSBuZXcgSFRNTERpdkVsZW1lbnQoKSwgcnVsZXNUYWJsZURpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCgpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgU2V0dXBTZXR0aW5nc0RpdiAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgSFRNTFRhYmxlRWxlbWVudCBhZGphY2VuY3lSdWxlc1RhYmxlID0gbmV3IEhUTUxUYWJsZUVsZW1lbnQgeyBTdHlsZSA9IHsgTWFyZ2luTGVmdCA9IFwiYXV0b1wiLCBNYXJnaW5SaWdodCA9IFwiYXV0b1wiIH0gfTtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKEdyaWQgaXMgVHJpYW5nbGVHcmlkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDwgMTI7IG4rKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyBuYW1lID0gbiA8IDYgPyBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuVG9DYW1lbFN0cmluZzxUcmlhbmdsZUxvY2F0aW9uPigoKFRyaWFuZ2xlTG9jYXRpb24pbikpIDogc3RyaW5nLkZvcm1hdChcIlBvc2l0aW9uIHswfVwiLG4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlc0NlbGxzLkFkZChDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFNlbGVjdEVsZW1lbnQ+KENyZWF0ZTAxMlNlbGVjdG9yKCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudD4obmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVSb3dFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KG5ldyBIVE1MVGFibGVSb3dFbGVtZW50KCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSxuYW1lKSksYWRqYWNlbmN5UnVsZXNUYWJsZSkpKS5TZXRBZGphY2VuY3lWYWx1ZShhZGphY2VuY3lSdWxlc1tuXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnQgbiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgeSA9IDA7IHkgPCAzOyB5KyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBIVE1MVGFibGVSb3dFbGVtZW50IHJvdyA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVSb3dFbGVtZW50PihuZXcgSFRNTFRhYmxlUm93RWxlbWVudCgpLGFkamFjZW5jeVJ1bGVzVGFibGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGludCB4ID0gMDsgeCA8IDM7IHgrKylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHggPT0gMSAmJiB5ID09IDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LkFwcGVuZENoaWxkKG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlc0NlbGxzLkFkZChDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFNlbGVjdEVsZW1lbnQ+KENyZWF0ZTAxMlNlbGVjdG9yKCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudD4obmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpLHJvdykpLlNldEFkamFjZW5jeVZhbHVlKGFkamFjZW5jeVJ1bGVzW25dKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXNUYWJsZURpdi5DbGVhcigpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBhZGphY2VuY3lSdWxlc1RhYmxlRGl2LGFkamFjZW5jeVJ1bGVzVGFibGUpO1xyXG5cclxuICAgICAgICAgICAgSFRNTFRhYmxlRWxlbWVudCBydWxlc1RhYmxlID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVFbGVtZW50PihcclxubmV3IEhUTUxUYWJsZUVsZW1lbnQgeyBTdHlsZSA9IHsgTWFyZ2luTGVmdCA9IFwiYXV0b1wiLCBNYXJnaW5SaWdodCA9IFwiYXV0b1wiIH0gfSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KFxyXG4gICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZVJvd0VsZW1lbnQoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudCgpLFwiI1wiKSxcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQoKSxcIkxcIiksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50KCksXCJEXCIpXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBydWxlc1RhYmxlRGl2LkNsZWFyKCk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIHJ1bGVzVGFibGVEaXYscnVsZXNUYWJsZSk7XHJcblxyXG4gICAgICAgICAgICBvcHRpb25DZWxscy5DbGVhcigpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPD0gY3VycmVudE1heEFkamFjZW50Q2VsbHM7IG4rKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSFRNTFRhYmxlUm93RWxlbWVudCByb3cgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlUm93RWxlbWVudD4obmV3IEhUTUxUYWJsZVJvd0VsZW1lbnQoKSxydWxlc1RhYmxlKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVSb3dFbGVtZW50PiggICAgICAgICAgICAgICAgcm93LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCksbi5Ub1N0cmluZygpKSk7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25DZWxscy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPEhUTUxJbnB1dEVsZW1lbnQsIEhUTUxJbnB1dEVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MSW5wdXRFbGVtZW50PihDcmVhdGVDaGVja2JveCgpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCksIHJvdykpLlNldEJvb2xWYWx1ZShsaXZpbmdSdWxlc1tuXSksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MSW5wdXRFbGVtZW50PihDcmVhdGVDaGVja2JveCgpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCksIHJvdykpLlNldEJvb2xWYWx1ZShkZWFkUnVsZXNbbl0pKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBNYWluICgpXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uQWN0aW9uPE1vdXNlRXZlbnQ8SFRNTENhbnZhc0VsZW1lbnQ+PiBQcm9jZXNzTW91c2VFdmVudCA9IG51bGw7XG4gICAgICAgICAgICBvYmplY3QgcnVsZXNPYmplY3RTdHIgPSBHbG9iYWwuTG9jYWxTdG9yYWdlLkdldEl0ZW0oXCJydWxlc1wiKTtcclxuc3RyaW5nIHI7ICAgICAgICAgICAgaWYgKChyID0gcnVsZXNPYmplY3RTdHIgYXMgc3RyaW5nKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBkeW5hbWljIHJ1bGVzT2JqID0gSlNPTi5QYXJzZShyKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocnVsZXNPYmplY3RTdHIgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTY3JpcHQuV3JpdGUoXCJ7MH0gaW5zdGFuY2VvZiBBcnJheVwiLCBydWxlc09iai5saXZpbmdSdWxlcykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2xbXSBkZXNlcmlhbGl6ZWQgPSBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxib29sW10+KEpTT04uU3RyaW5naWZ5KHJ1bGVzT2JqLmxpdmluZ1J1bGVzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5Db3B5KGRlc2VyaWFsaXplZCwgbGl2aW5nUnVsZXMsIGRlc2VyaWFsaXplZC5MZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTY3JpcHQuV3JpdGUoXCJ7MH0gaW5zdGFuY2VvZiBBcnJheVwiLCBydWxlc09iai5kZWFkUnVsZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29sW10gZGVzZXJpYWxpemVkID0gSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8Ym9vbFtdPihKU09OLlN0cmluZ2lmeShydWxlc09iai5kZWFkUnVsZXMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LkNvcHkoZGVzZXJpYWxpemVkLCBkZWFkUnVsZXMsIGRlc2VyaWFsaXplZC5MZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTY3JpcHQuV3JpdGUoXCJ7MH0gaW5zdGFuY2VvZiBBcnJheVwiLCBydWxlc09iai5hZGphY2VuY3lSdWxlcykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFkamFjZW5jeVR5cGVbXSBkZXNlcmlhbGl6ZWQgPSBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxBZGphY2VuY3lUeXBlW10+KEpTT04uU3RyaW5naWZ5KHJ1bGVzT2JqLmFkamFjZW5jeVJ1bGVzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5Db3B5KGRlc2VyaWFsaXplZCwgYWRqYWNlbmN5UnVsZXMsIGRlc2VyaWFsaXplZC5MZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggeyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5TdHlsZVtcInVzZXItc2VsZWN0XCJdID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkhlYWQuQXBwZW5kQ2hpbGQobmV3IEhUTUxMaW5rRWxlbWVudCB7IFJlbCA9IFwic3R5bGVzaGVldFwiLCBIcmVmID0gXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2Jvb3RzdHJhcEA1LjIuMC9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzc1wiIH0pO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LlN0eWxlLk1hcmdpbiA9IFwiMHB4XCI7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQoUG9wdXBDb250YWluZXIpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKG5ldyBIVE1MU3R5bGVFbGVtZW50IHsgSW5uZXJIVE1MID0gXCJ0ZCwgdGggeyBib3JkZXI6IDFweCBzb2xpZCBibGFjazsgcGFkZGluZzogNXB4IH0gYnV0dG9uIHsgbWFyZ2luLXJpZ2h0OiA1cHggfVwiIH0pO1xyXG5cclxuICAgICAgICAgICAgU2V0dXBTZXR0aW5nc0RpdigpO1xyXG5cclxuICAgICAgICAgICAgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcgLGJvb2xbXSAsYm9vbFtdID4+IHByZXNldHNMaXN0ID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nICxib29sW10gLGJvb2xbXSA+PigpLChfbzEpPT57X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJDb253YXkncyBHYW1lIG9mIExpZmUgUHJlc2V0XCIsIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO19vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZywgYm9vbFtdLCBib29sW10+KFwiSW1tb3J0YWwgQ2VsbHMgUHJlc2V0XCIsIG5ldyBib29sWzlde3RydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWV9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9KSk7X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJBbG1vc3QgSW1tb3J0YWwgQ2VsbHMgUHJlc2V0XCIsIG5ldyBib29sWzlde3RydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIGZhbHNlfSwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO19vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZywgYm9vbFtdLCBib29sW10+KFwiQWx0ZXJuYXRlIENvbndheSdzIEdhbWUgb2YgTGlmZSBQcmVzZXRcIiwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0pKTtyZXR1cm4gX28xO30pO1xyXG5cclxuICAgICAgICAgICAgSFRNTERpdkVsZW1lbnQgcHJlc2V0c0RpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCB7IFN0eWxlID0geyBUZXh0QWxpZ24gPSBUZXh0QWxpZ24uQ2VudGVyIH0gfTtcclxuZm9yZWFjaCAodmFyIF9kMiBpbiBwcmVzZXRzTGlzdClcclxue1xyXG4gICAgc3RyaW5nIG5hbWU7XHJcbiAgICBib29sW10gbGl2aW5nUnVsZXM7XHJcbiAgICBib29sW10gZGVhZFJ1bGVzO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDIsIG91dCBuYW1lLCBvdXQgbGl2aW5nUnVsZXMsIG91dCBkZWFkUnVsZXMpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgcHJlc2V0c0RpdixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnQoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxBbmNob3JFbGVtZW50PihuZXcgSFRNTEFuY2hvckVsZW1lbnR7SHJlZiA9IFwiamF2YXNjcmlwdDp2b2lkKDApXCIsIFN0eWxlID0ge0ZvbnRTaXplID0gXCIxcmVtXCJ9LCBPbkNsaWNrID0gZSA9PiBBcHBseVByZXNldChsaXZpbmdSdWxlczogbGl2aW5nUnVsZXMsIGRlYWRSdWxlczogZGVhZFJ1bGVzKX0sbmFtZSkpKTtcclxufVxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oXHJcblxyXG4gICAgICAgICAgICBTZXR0aW5nc1BvcHVwLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERldGFpbHNFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MRGV0YWlsc0VsZW1lbnQgeyBPcGVuID0gdHJ1ZX0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MU3VtbWFyeUVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxTdW1tYXJ5RWxlbWVudCgpLFwiQWRqYWNlbmN5IFJ1bGVzXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzVGFibGVEaXZcclxuICAgICAgICAgICAgICAgICksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERldGFpbHNFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MRGV0YWlsc0VsZW1lbnQgeyBPcGVuID0gdHJ1ZSB9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFN1bW1hcnlFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MU3VtbWFyeUVsZW1lbnQoKSxcIlJ1bGVzXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzVGFibGVEaXZcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxuZXcgSFRNTEJSRWxlbWVudCgpLCBwcmVzZXRzRGl2LCBuZXcgSFRNTEJSRWxlbWVudCgpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIixcclxuICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPCBjdXJyZW50TWF4QWRqYWNlbnRDZWxsczsgbisrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXNbbl0gPSBhZGphY2VuY3lSdWxlc0NlbGxzW25dLkFkamFjZW5jeVZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDw9IGN1cnJlbnRNYXhBZGphY2VudENlbGxzOyBuKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXZpbmdSdWxlc1tuXSA9IG9wdGlvbkNlbGxzW25dLkl0ZW0xLkJvb2xWYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWFkUnVsZXNbbl0gPSBvcHRpb25DZWxsc1tuXS5JdGVtMi5Cb29sVmFsdWUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsLkxvY2FsU3RvcmFnZS5TZXRJdGVtKFwicnVsZXNcIiwgSnNvbkNvbnZlcnQuU2VyaWFsaXplT2JqZWN0KG5ld1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGl2aW5nUnVsZXMgPSBsaXZpbmdSdWxlcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVhZFJ1bGVzID0gZGVhZFJ1bGVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlcyA9IGFkamFjZW5jeVJ1bGVzXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIEhpZGVNb2RhbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFwiU2F2ZSBDaGFuZ2VzXCIpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oXHJcbiAgICAgICAgICAgIE5vdGFibGVPYmplY3RzUG9wdXAsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1saWdodFwiLFxyXG4gICAgICAgICAgICAgICAgU3R5bGUgPSB7IENzc0Zsb2F0ID0gRmxvYXQuUmlnaHQgfSxcclxuICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+IEhpZGVNb2RhbCgpXHJcbiAgICAgICAgICAgIH0sXCLinYxcIikpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBOb3RhYmxlT2JqZWN0c1BvcHVwLG5ldyBIVE1MRGl2RWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTdHlsZSA9IHsgQ2xlYXIgPSBDbGVhci5Cb3RoIH1cclxuICAgICAgICAgICAgfSk7XHJcbmZvcmVhY2ggKHZhciBfZDMgaW4gTm90YWJsZU9iamVjdHNMaXN0Lk5vdGFibGVPYmplY3RzKVxyXG57XHJcbiAgICBIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4gb2JqZWN0RGV0YWlscztcclxuICAgIHN0cmluZyBkZXNjcmlwdGlvbjtcclxuICAgIHN0cmluZyBydWxlcztcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2QzLCBvdXQgb2JqZWN0RGV0YWlscywgb3V0IGRlc2NyaXB0aW9uLCBvdXQgcnVsZXMpO1xyXG4gICAgSFRNTERpdkVsZW1lbnQgb2JqZWN0SW5mbyA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50e1N0eWxlID0ge1dpZHRoID0gXCIzMHJlbVwifX0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnR7U3R5bGUgPSB7RGlzcGxheSA9IERpc3BsYXkuRmxleCwgQWxpZ25JdGVtcyA9IEFsaWduSXRlbXMuQ2VudGVyLCBGbGV4RGlyZWN0aW9uID0gRmxleERpcmVjdGlvbi5Db2x1bW59fSxOb3RhYmxlT2JqZWN0c1BvcHVwKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudHtTdHlsZSA9IHtEaXNwbGF5ID0gRGlzcGxheS5GbGV4LCBBbGlnbkl0ZW1zID0gQWxpZ25JdGVtcy5DZW50ZXIsIEZsZXhEaXJlY3Rpb24gPSBGbGV4RGlyZWN0aW9uLkNvbHVtbn19LERyYXdTaGFwZShvYmplY3REZXRhaWxzKSkpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgb2JqZWN0SW5mbyxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnQoKSxkZXNjcmlwdGlvbikpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgb2JqZWN0SW5mbyxydWxlcyk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLG5ldyBIVE1MQlJFbGVtZW50KCkpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgb2JqZWN0SW5mbyxuZXcgSFRNTEJSRWxlbWVudCgpKTtcclxufVxuXHJcbiAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IGJhY2tncm91bmREaXYgPSBuZXcgSFRNTERpdkVsZW1lbnQgeyBTdHlsZSA9IHsgUG9zaXRpb24gPSBQb3NpdGlvbi5SZWxhdGl2ZSwgTWluV2lkdGggPSBcIjBcIiwgTWluSGVpZ2h0ID0gXCIwXCIgfX07XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5PdmVyZmxvdyA9IE92ZXJmbG93LkhpZGRlbjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLlpJbmRleCA9IFwiLTFcIjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLlBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuTGVmdCA9IFwiMHB4XCI7XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5Ub3AgPSBcIjBweFwiO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBiYWNrZ3JvdW5kRGl2LERPTUNhbnZhcyk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIGJhY2tncm91bmREaXYsSG90YmFyKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgYmFja2dyb3VuZERpdixSaWdodEhvdGJhcik7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQoYmFja2dyb3VuZERpdik7XHJcblxyXG4gICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYWdnaW5nUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBvcmlnaW5hbFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgIGJvb2wgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBET01DYW52YXMuT25Nb3VzZURvd24gPSBlID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gdHJ1ZTtcclxuaW50IHg7XG5pbnQgeTtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoZS5Nb3VzZVBvcygpLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmdQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHggLSBvZmZzZXRQb3MuSXRlbTEsIHkgLSBvZmZzZXRQb3MuSXRlbTIpO1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxQb3MgPSBvZmZzZXRQb3M7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5Pbk1vdXNlVXAgPSBlID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTEtIG9yaWdpbmFsUG9zLkl0ZW0xKSA+IHhNdWx0aXBsaWVyIHx8IE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMi0gb3JpZ2luYWxQb3MuSXRlbTIpID4geU11bHRpcGxpZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nUG9zID0gb2Zmc2V0UG9zO1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBET01DYW52YXMuT25Nb3VzZU1vdmUgPSBlID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICgoZS5CdXR0b25zICYgMSkgPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRyYWdnaW5nUG9zID09IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCkpIGRyYWdnaW5nUG9zID0gZS5Nb3VzZVBvcygpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vdXNlUG9zID0gZS5Nb3VzZVBvcygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMS0gb3JpZ2luYWxQb3MuSXRlbTEpID4geE11bHRpcGxpZXIgfHwgTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0xLSBvcmlnaW5hbFBvcy5JdGVtMSkgPiB5TXVsdGlwbGllcilcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pihtb3VzZVBvcy5JdGVtMSAtIGRyYWdnaW5nUG9zLkl0ZW0xLCBtb3VzZVBvcy5JdGVtMiAtIGRyYWdnaW5nUG9zLkl0ZW0yKTtcclxuICAgICAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICAgICAgfTtcclxuUHJvY2Vzc01vdXNlRXZlbnQgPSAoZSkgPT5cclxue1xyXG4gICAgLy9pZiAoKEBldmVudC5CdXR0b25zICYgMSkgPT0gMCkgcmV0dXJuO1xyXG4gICAgdmFyIG1vdXNlUG9zID0gZS5Nb3VzZVBvcygpO1xyXG4gICAgR3JpZC5IYW5kbGVDbGljayhuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KG1vdXNlUG9zLkl0ZW0xIC0gb2Zmc2V0UG9zLkl0ZW0xLCBtb3VzZVBvcy5JdGVtMiAtIG9mZnNldFBvcy5JdGVtMiksIFNxdWFyZVR5cGVQbGFjaW5nKTtcclxuICAgIERyYXcoKTtcclxufVxyXG5cclxuO1xuICAgICAgICAgICAgRE9NQ2FudmFzLk9uQ2xpY2sgPSBlID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGFuZ2luZ0ludGVudClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBQcm9jZXNzTW91c2VFdmVudChlKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgR2xvYmFsLlNldEludGVydmFsKChBY3Rpb24pTmV4dEZyYW1lLCAxMDApO1xyXG5cclxuICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIHVwZGF0aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBIYXNEaXZpZGVycyAodGhpcyBEaWN0aW9uYXJ5PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4sIERpdmlkZXJzSW5mbz4gZGl2aWRlcnMsIGludCB4LCBpbnQgeSwgaW50IEwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBEaXZpZGVyc0luZm8gdG9DaGVjaztcclxuICAgICAgICAgICAgc3dpdGNoIChMKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgeC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHktLTtcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHktLTtcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLkJvdHRvbTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICB5LS07XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b21SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICB4LS07XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLlJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA2OlxyXG4gICAgICAgICAgICAgICAgICAgIHgtLTtcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OlxyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uQm90dG9tO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA4OlxyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuRGl2aWRlcnNJbmZvIGRpdmlkZXJzSW5mbztcbiAgICAgICAgICAgIHJldHVybiBkaXZpZGVycy5UcnlHZXRWYWx1ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHgsIHkpLCBvdXQgZGl2aWRlcnNJbmZvKSAmJiAoZGl2aWRlcnNJbmZvICYgdG9DaGVjaykgIT0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxHcmlkVHlwZSAsSFRNTENhbnZhc0VsZW1lbnQgPiBMYXN0Qm90dG9tQ2FudmFzID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgR3JpZFR5cGUsIEhUTUxDYW52YXNFbGVtZW50PigwLCBHcmlkVHlwZS5Db3VudCwgbnVsbCk7XHJcbnB1YmxpYyBzdGF0aWMgYnl0ZSBHZXRTcXVhcmVUeXBlQWxwaGEoU3F1YXJlVHlwZSBzcXVhcmVUeXBlKVxyXG57XHJcbiAgICByZXR1cm4gKGJ5dGUpKHNxdWFyZVR5cGUgPT0gU3F1YXJlVHlwZS5DZWxsID8gMjU1IDogc3F1YXJlVHlwZSA9PSBTcXVhcmVUeXBlLkJyaWNrID8gMTcwIDogc3F1YXJlVHlwZSA9PSBTcXVhcmVUeXBlLkltbW9ydGFsQ2VsbCA/IDg1IDogKChTeXN0ZW0uRnVuYzxpbnQ+KSgoKSA9PlxyXG4gICAge1xyXG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJVbmtub3duIHNxdWFyZSB0eXBlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgICkpKCkpO1xyXG59XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgRHJhdygpXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGRvdWJsZSwgZG91YmxlPj8gPiBEcmF3TWFya2VyID0gbnVsbDtcblN5c3RlbS5BY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+PyAsIFN5c3RlbS5WYWx1ZVR1cGxlPGRvdWJsZSwgZG91YmxlPj8gPiBEcmF3TGluZSA9IG51bGw7XG5TeXN0ZW0uRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4sIFN5c3RlbS5WYWx1ZVR1cGxlPGRvdWJsZSwgZG91YmxlPj8gPiBHZXRGaW5hbERyYXdQb3MgPSBudWxsO1xuU3lzdGVtLkZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+LCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4/ID4gR2V0RE9NRHJhd1BvcyA9IG51bGw7XG5TeXN0ZW0uRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4sIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj8gPiBHZXREcmF3UG9zID0gbnVsbDtcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IFRvcENhbnZhcyA9IENyZWF0ZVRvcENhbnZhcygpO1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBCb3R0b21DYW52YXMgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoTGFzdEJvdHRvbUNhbnZhcy5JdGVtMT09IHhNdWx0aXBsaWVyICYmIExhc3RCb3R0b21DYW52YXMuSXRlbTI9PSBDdXJyZW50R3JpZFR5cGUpXHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXMgPSBMYXN0Qm90dG9tQ2FudmFzLkl0ZW0zO1xyXG4gICAgICAgICAgICBpZiAoQm90dG9tQ2FudmFzID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhcyA9IENyZWF0ZUJvdHRvbUNhbnZhcygpO1xyXG4gICAgICAgICAgICAgICAgTGFzdEJvdHRvbUNhbnZhcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIEdyaWRUeXBlLCBIVE1MQ2FudmFzRWxlbWVudD4oeE11bHRpcGxpZXIsIEN1cnJlbnRHcmlkVHlwZSwgQm90dG9tQ2FudmFzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgVG9wQ2FudmFzQ29udGV4dCA9IFRvcENhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5DbGVhclJlY3QoMCwgMCwgRE9NQ2FudmFzLldpZHRoLCBET01DYW52YXMuSGVpZ2h0KTtcclxuaW50IG9mZnNldFg7XG5pbnQgb2Zmc2V0WTtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3Qob2Zmc2V0UG9zLCBvdXQgb2Zmc2V0WCwgb3V0IG9mZnNldFkpO1xyXG5HZXREcmF3UG9zID0gKHBvcykgPT5cclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QocG9zLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaW50IGRyYXdYID0geCArIChvZmZzZXRYIC8geE11bHRpcGxpZXIpICsgMSwgZHJhd1kgPSB5ICsgKG9mZnNldFkgLyB5TXVsdGlwbGllcikgKyAxO1xyXG4gICAgaWYgKGRyYXdYIDwgMCB8fCBkcmF3WCA+PSB3aWR0aCArIDIgfHwgZHJhd1kgPCAwIHx8IGRyYXdZID49IGhlaWdodCArIDIpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihkcmF3WCwgZHJhd1kpO1xyXG59XHJcblxyXG47XG5HZXRET01EcmF3UG9zID0gKHBvcykgPT5cclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QocG9zLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaW50IGRyYXdYID0geCArIG9mZnNldFgsIGRyYXdZID0geSArIG9mZnNldFk7XHJcbiAgICBpZiAoZHJhd1ggPCAwIHx8IGRyYXdYID49IHNjcmVlbldpZHRoIHx8IGRyYXdZIDwgMCB8fCBkcmF3WSA+PSBzY3JlZW5IZWlnaHQpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihkcmF3WCwgZHJhd1kpO1xyXG59XHJcblxyXG47XG5TcXVhcmVHcmlkIHNxdWFyZUdyaWQ7ICAgICAgICAgICAgaWYgKChzcXVhcmVHcmlkID0gR3JpZCBhcyBTcXVhcmVHcmlkKSAhPSBudWxsKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0VWludDhDbGFtcGVkQXJyYXkgaW1hZ2VEYXRhQXJyYXkgPSBDcmVhdGVJbWFnZURhdGFBcnJheSh3aWR0aCArIDIsIGhlaWdodCArIDIpO1xyXG5mb3JlYWNoICh2YXIgX2Q0IGluIHNxdWFyZUdyaWQuU3F1YXJlcylcclxue1xyXG4gICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+IHBvcztcclxuICAgIFNxdWFyZVR5cGUgc3F1YXJlVHlwZTtcclxuICAgIF9kNC5EZWNvbnN0cnVjdChvdXQgcG9zLCBvdXQgc3F1YXJlVHlwZSk7XHJcbiAgICB2YXIgZHJhd1BvcyA9IEdldERyYXdQb3MocG9zKTtcclxuICAgIGlmIChkcmF3UG9zID09IG51bGwpXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICBpbnQgZHJhd1g7XHJcbiAgICBpbnQgZHJhd1k7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGRyYXdQb3MuVmFsdWUsIG91dCBkcmF3WCwgb3V0IGRyYXdZKTtcclxuICAgIGludCBpZHggPSBkcmF3WCArIGRyYXdZICogKHdpZHRoICsgMik7XHJcbiAgICBpbWFnZURhdGFBcnJheVtpZHggKiA0ICsgM10gPSBHZXRTcXVhcmVUeXBlQWxwaGEoc3F1YXJlVHlwZSk7XHJcbn1cblx0XHRcdFx0SW1hZ2VEYXRhIGltYWdlRGF0YSA9IG5ldyBJbWFnZURhdGEoaW1hZ2VEYXRhQXJyYXksICh1aW50KSh3aWR0aCArIDIpLCAodWludCkoaGVpZ2h0ICsgMikpO1xyXG5cdFx0XHRcdFRvcENhbnZhc0NvbnRleHQuUHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XHJcbiAgICAgICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdJbWFnZShCb3R0b21DYW52YXMsIChvZmZzZXRYICUgeE11bHRpcGxpZXIpIC0geE11bHRpcGxpZXIsIChvZmZzZXRZICUgeU11bHRpcGxpZXIpIC0geU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICB9XHJcblx0XHRcdGVsc2Uge1xyXG4gICAgSGV4R3JpZCBoO1xyXG4gICAgaWYgKChoID0gR3JpZCBhcyBIZXhHcmlkKSAhPSBudWxsKVxyXG4gICAge1xyXG4gICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0ltYWdlKEJvdHRvbUNhbnZhcywgKG9mZnNldFggJSAoSGV4R3JpZC5jb3M2MCAqIDIgKiB4TXVsdGlwbGllcikpIC0gSGV4R3JpZC5jb3M2MCAqIDIgKiB4TXVsdGlwbGllciwgKG9mZnNldFkgJSAoSGV4R3JpZC5zaW42MCAqIDIgKiB5TXVsdGlwbGllcikpIC0gSGV4R3JpZC5zaW42MCAqIDIgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgR3JpZC5EcmF3U3F1YXJlcygoQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiwgU3F1YXJlVHlwZT4pKChTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4gZCwgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKSA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PyBkcmF3UG9zID0gR2V0RE9NRHJhd1BvcyhkKTtcclxuICAgICAgICAgICAgaWYgKCFkcmF3UG9zLkhhc1ZhbHVlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkZpbGxTdHlsZSA9IHN0cmluZy5Gb3JtYXQoXCJyZ2JhKDAsIDAsIDAsIHswfSlcIiwgR2V0U3F1YXJlVHlwZUFscGhhKHNxdWFyZVR5cGUpIC8gMjU1LjApO1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdIZXhhZ29uKChpbnQpZHJhd1Bvcy5WYWx1ZS5JdGVtMSwgKGludClkcmF3UG9zLlZhbHVlLkl0ZW0yLCB4TXVsdGlwbGllciAqIDIgLyAzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICkpO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAgIFRyaWFuZ2xlR3JpZCB0cmlhbmdsZUdyaWQ7XHJcbiAgICAgICAgaWYgKCh0cmlhbmdsZUdyaWQgPSBHcmlkIGFzIFRyaWFuZ2xlR3JpZCkgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0ltYWdlKEJvdHRvbUNhbnZhcywgKG9mZnNldFggJSAoSGV4R3JpZC5jb3M2MCAqIDIgKiB4TXVsdGlwbGllcikpIC0gSGV4R3JpZC5jb3M2MCAqIDIgKiB4TXVsdGlwbGllciwgKG9mZnNldFkgJSAoSGV4R3JpZC5zaW42MCAqIDIgKiB5TXVsdGlwbGllcikpIC0gSGV4R3JpZC5zaW42MCAqIDIgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgICAgIHRyaWFuZ2xlR3JpZC5EcmF3U3F1YXJlcygoQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiwgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+LCBTcXVhcmVUeXBlPikoKFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiBkLCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4gY29vcmRzLCBTcXVhcmVUeXBlIHNxdWFyZVR5cGUpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj8gZHJhd1BvcyA9IEdldERPTURyYXdQb3MoZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWRyYXdQb3MuSGFzVmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5GaWxsU3R5bGUgPSBzdHJpbmcuRm9ybWF0KFwicmdiYSgwLCAwLCAwLCB7MH0pXCIsIEdldFNxdWFyZVR5cGVBbHBoYShzcXVhcmVUeXBlKSAvIDI1NS4wKTtcclxuICAgICAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd1RyaWFuZ2xlKGRyYXdQb3MuVmFsdWUuSXRlbTEsIGRyYXdQb3MuVmFsdWUuSXRlbTIsIHhNdWx0aXBsaWVyIC8gMiwgY29vcmRzLkl0ZW0zKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59ICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5JbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5EcmF3SW1hZ2UoVG9wQ2FudmFzLCAob2Zmc2V0WCAlIHhNdWx0aXBsaWVyKSAtIHhNdWx0aXBsaWVyLCAob2Zmc2V0WSAlIHlNdWx0aXBsaWVyKSAtIHlNdWx0aXBsaWVyLCAod2lkdGggKyAyKSAqIHhNdWx0aXBsaWVyLCAoaGVpZ2h0ICsgMikgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuR2V0RmluYWxEcmF3UG9zID0gKHBvcykgPT5cclxue1xyXG4gICAgdmFyIHAgPSBHZXREcmF3UG9zKHBvcyk7XHJcbiAgICBpZiAocCA9PSBudWxsKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgZG91YmxlIGRyYXdYO1xyXG4gICAgZG91YmxlIGRyYXdZO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHAuVmFsdWUuSXRlbTEsIHAuVmFsdWUuSXRlbTIpLCBvdXQgZHJhd1gsIG91dCBkcmF3WSk7XHJcbiAgICBkcmF3WCAqPSAod2lkdGggKyAyKSAqIHhNdWx0aXBsaWVyIC8gVG9wQ2FudmFzLldpZHRoO1xyXG4gICAgZHJhd1kgKj0gKGhlaWdodCArIDIpICogeU11bHRpcGxpZXIgLyBUb3BDYW52YXMuSGVpZ2h0O1xyXG4gICAgZHJhd1ggKz0gKG9mZnNldFggJSB4TXVsdGlwbGllcikgLSB4TXVsdGlwbGllcjtcclxuICAgIGRyYXdZICs9IChvZmZzZXRZICUgeU11bHRpcGxpZXIpIC0geU11bHRpcGxpZXI7XHJcbiAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGRvdWJsZSwgZG91YmxlPihkcmF3WCwgZHJhd1kpO1xyXG59XHJcblxyXG47XG5EcmF3TGluZSA9IChzdGFydCwgZW5kKSA9PlxyXG57XHJcbiAgICBpZiAoIXN0YXJ0Lkhhc1ZhbHVlIHx8ICFlbmQuSGFzVmFsdWUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgdmFyIHN0YXJ0UG9zID0gc3RhcnQuVmFsdWU7XHJcbiAgICB2YXIgZW5kUG9zID0gZW5kLlZhbHVlO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5CZWdpblBhdGgoKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuTW92ZVRvKHN0YXJ0UG9zLkl0ZW0xLCBzdGFydFBvcy5JdGVtMik7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkxpbmVUbyhlbmRQb3MuSXRlbTEsIGVuZFBvcy5JdGVtMik7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkxpbmVXaWR0aCA9IDI7XHJcbiAgICBET01DYW52YXNDb250ZXh0LlN0cm9rZVN0eWxlID0gXCJyZWRcIjsgLy8gXCJyZ2IoMTcwLCAxNzAsIDE3MClcIjtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuU3Ryb2tlKCk7XHJcbn1cclxuXHJcbjtcbkRyYXdNYXJrZXIgPSAocG9zaXRpb24pID0+XHJcbntcclxuICAgIGlmICghcG9zaXRpb24uSGFzVmFsdWUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgZG91YmxlIGRyYXdYO1xyXG4gICAgZG91YmxlIGRyYXdZO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChwb3NpdGlvbi5WYWx1ZSwgb3V0IGRyYXdYLCBvdXQgZHJhd1kpO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5CZWdpblBhdGgoKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuQXJjKGRyYXdYLCBkcmF3WSwgeE11bHRpcGxpZXIgLyA4LCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkZpbGxTdHlsZSA9IFwicmVkXCI7IC8vXCJyZ2IoMTcwLCAxNzAsIDE3MClcIjtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuRmlsbCgpO1xyXG59XHJcblxyXG47XG5TcXVhcmVHcmlkIHM7ICAgICAgICAgICAgaWYgKChzID0gR3JpZCBhcyBTcXVhcmVHcmlkKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbmZvcmVhY2ggKHZhciBfZDUgaW4gcy5EaXZpZGVycylcclxue1xyXG4gICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+IHBvcztcclxuICAgIERpdmlkZXJzSW5mbyBkaXZpZGVycztcclxuICAgIF9kNS5EZWNvbnN0cnVjdChvdXQgcG9zLCBvdXQgZGl2aWRlcnMpO1xyXG4gICAgZm9yZWFjaCAodmFyIGRpdmlkZXIgaW4gbmV3W117RGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0LCBEaXZpZGVyc0luZm8uUmlnaHQsIERpdmlkZXJzSW5mby5Cb3R0b219KVxyXG4gICAge1xyXG4gICAgICAgIGlmICghZGl2aWRlcnMuSGFzRmxhZyhkaXZpZGVyKSlcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgc3dpdGNoIChkaXZpZGVyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSBEaXZpZGVyc0luZm8uUmlnaHQ6XHJcbiAgICAgICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+c3RhcnRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKHBvcy5JdGVtMSArIDEpLCAoaW50KXBvcy5JdGVtMik7XHJcbiAgICAgICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+ZW5kUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KShwb3MuSXRlbTEgKyAxKSwgKGludCkocG9zLkl0ZW0yICsgMSkpO1xyXG4gICAgICAgICAgICAgICAgRHJhd0xpbmUoR2V0RmluYWxEcmF3UG9zKHN0YXJ0UG9zKSwgR2V0RmluYWxEcmF3UG9zKGVuZFBvcykpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRGl2aWRlcnNJbmZvLkJvdHRvbTpcclxuICAgICAgICAgICAgICAgIERyYXdMaW5lKEdldEZpbmFsRHJhd1BvcyhuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKHBvcy5JdGVtMSksIChpbnQpKHBvcy5JdGVtMiArIDEpKSksIEdldEZpbmFsRHJhd1BvcyhuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKHBvcy5JdGVtMSArIDEpLCAoaW50KShwb3MuSXRlbTIgKyAxKSkpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIERpdmlkZXJzSW5mby5Cb3R0b21SaWdodDpcclxuICAgICAgICAgICAgICAgIERyYXdNYXJrZXIoR2V0RmluYWxEcmF3UG9zKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCkocG9zLkl0ZW0xICsgMSksIChpbnQpKHBvcy5JdGVtMiArIDEpKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgZnJhbWVOdW0gPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTmV4dEZyYW1lICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIXBsYXlpbmcpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGJvb2wgc2tpcEZyYW1lcyA9IEdyaWQuU3F1YXJlQ291bnQgPj0gMjUwO1xyXG4gICAgICAgICAgICBpbnQgdXBkYXRlc1BlckRyYXcgPSAxOy8vIHNraXBGcmFtZXMgPyAyIDogMTtcclxuICAgICAgICAgICAgZnJhbWVOdW0rKztcclxuICAgICAgICAgICAgaWYgKHNraXBGcmFtZXMgJiYgKGZyYW1lTnVtICUgdXBkYXRlc1BlckRyYXcpICE9IDApIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDwgdXBkYXRlc1BlckRyYXc7IG4rKylcclxuICAgICAgICAgICAgICAgIEdyaWQuVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBEcmF3SGV4YWdvbiAodGhpcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgY29udGV4dCwgaW50IHgsIGludCB5LCBpbnQgcmFkaXVzLCBib29sIHN0cm9rZSA9IGZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29udGV4dC5CZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5Nb3ZlVG8oeCArIHJhZGl1cywgeSk7XHJcbiAgICAgICAgICAgIGZvciAoaW50IG4gPSAxOyBuIDw9IDY7IG4rKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZG91YmxlIGFuZ2xlID0gbiAqIE1hdGguUEkgLyAzO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5MaW5lVG8oeCArIHJhZGl1cyAqIE1hdGguQ29zKGFuZ2xlKSwgeSArIHJhZGl1cyAqIE1hdGguU2luKGFuZ2xlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHN0cm9rZSlcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuU3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuRmlsbCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIERyYXdUcmlhbmdsZSh0aGlzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBjb250ZXh0LCBpbnQgaGV4WCwgaW50IGhleFksIGludCBoZXhSYWRpdXMsIFRyaWFuZ2xlTG9jYXRpb24gbG9jLCBib29sIHN0cm9rZSA9IGZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29udGV4dC5CZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgY29udGV4dC5Nb3ZlVG8oaGV4WCwgaGV4WSk7XHJcbiAgICAgICAgICAgIGludCBhbmdsZUludCA9IDA7XHJcbiAgICAgICAgICAgIHN3aXRjaCAobG9jKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uVG9wTGVmdDpcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZUludCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uVG9wOlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlSW50ID0gNjA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uVG9wUmlnaHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYW5nbGVJbnQgPSAxMjA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tUmlnaHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYW5nbGVJbnQgPSAxODA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tOlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlSW50ID0gMjQwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbUxlZnQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYW5nbGVJbnQgPSAzMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZG91YmxlIGFuZ2xlID0gYW5nbGVJbnQgKiBNYXRoLlBJIC8gMTgwO1xyXG4gICAgICAgICAgICBjb250ZXh0LkxpbmVUbyhoZXhYICsgaGV4UmFkaXVzICogTWF0aC5Db3MoYW5nbGUpLCBoZXhZICsgaGV4UmFkaXVzICogTWF0aC5TaW4oYW5nbGUpKTtcclxuICAgICAgICAgICAgYW5nbGUgKz0gTWF0aC5QSSAvIDM7XHJcbiAgICAgICAgICAgIGNvbnRleHQuTGluZVRvKGhleFggKyBoZXhSYWRpdXMgKiBNYXRoLkNvcyhhbmdsZSksIGhleFkgKyBoZXhSYWRpdXMgKiBNYXRoLlNpbihhbmdsZSkpO1xyXG4gICAgICAgICAgICBpZiAoc3Ryb2tlKVxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5TdHJva2UoKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5GaWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UZXh0LlJlZ3VsYXJFeHByZXNzaW9ucztcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgRXh0ZW5zaW9uc1xyXG4gICAge1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIigoZSwgYykgPT4gYy5hcHBlbmRDaGlsZChlKSkoe2VsZW1lbnR9LCB7Y29udGFpbmluZ0VsZW19KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIEFkZFRvPFQ+KHRoaXMgVCBlbGVtZW50LCBOb2RlIGNvbnRhaW5pbmdFbGVtKSB3aGVyZSBUIDogTm9kZTtcclxuICAgICAgICAvL3B1YmxpYyBzdGF0aWMgVCBBZGRUb0JvZHk8VD4odGhpcyBUIG4pIHdoZXJlIFQgOiBOb2RlID0+IEFwcC5yb290LkFwcGVuZENoaWxkPFQ+KG4pO1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIntub2RlfS5hcHBlbmRDaGlsZCh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgQXBwZW5kQ2hpbGQ8VD4odGhpcyBOb2RlIG5vZGUsIFQgZWxlbWVudCkgd2hlcmUgVCA6IE5vZGU7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc3R5bGUuZGlzcGxheSA9ICdub25lJywgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBIaWRlPFQ+KHRoaXMgVCBlbGVtZW50KSB3aGVyZSBUIDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc3R5bGUuZGlzcGxheSA9ICcnLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIFNob3c8VD4odGhpcyBUIGVsZW1lbnQpIHdoZXJlIFQgOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBbVGVtcGxhdGUoXCIobGkgPT4gKGxpLmFwcGVuZENoaWxkKHtlbGVtZW50fSksIGxpKSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gSFRNTExJRWxlbWVudCBXcmFwTGkodGhpcyBOb2RlIGVsZW1lbnQpO1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihkaXYgPT4gKGRpdi5hcHBlbmRDaGlsZCh7ZWxlbWVudH0pLCBkaXYpKShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gSFRNTERpdkVsZW1lbnQgV3JhcERpdih0aGlzIE5vZGUgZWxlbWVudCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBUIEFkZDxUPih0aGlzIFQgZWxlbWVudCwgcGFyYW1zIFVuaW9uPE5vZGUsIHN0cmluZz5bXSBub2Rlcykgd2hlcmUgVCA6IE5vZGVcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFVuaW9uPE5vZGUsIHN0cmluZz4gbm9kZSBpbiBub2RlcylcclxuICAgICAgICAgICAgICAgIGlmIChub2RlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChub2RlLklzPHN0cmluZz4oKSlcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LkFwcGVuZENoaWxkKG5ldyBUZXh0KG5vZGUuQXM8c3RyaW5nPigpKSk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5BcHBlbmRDaGlsZChub2RlLkFzPE5vZGU+KCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgVCBBZGRFbGVtZW50PFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgc3RyaW5nPltdIG5vZGVzKVxyXG4gICAgd2hlcmUgVCA6IE5vZGVcclxue1xyXG4gICAgcmV0dXJuIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8VD4oZWxlbWVudCxub2Rlcyk7XHJcbn1wdWJsaWMgc3RhdGljIFQgQWRkRGl2PFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgc3RyaW5nPltdIG5vZGVzKVxyXG4gICAgd2hlcmUgVCA6IE5vZGVcclxue1xyXG4gICAgcmV0dXJuIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8VD4oZWxlbWVudCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnQoKSxub2RlcykpO1xyXG59cHVibGljIHN0YXRpYyBUIEFkZFVsPFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgVW5pb248Tm9kZSwgc3RyaW5nPltdLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFVMaXN0RWxlbWVudD4obmV3IEhUTUxVTGlzdEVsZW1lbnQoKSxTeXN0ZW0uQXJyYXlFeHRlbnNpb25zLk1hcDxVbmlvbjxOb2RlLFVuaW9uPE5vZGUsIHN0cmluZz5bXSxzdHJpbmc+LFVuaW9uPE5vZGUsc3RyaW5nPj4obm9kZXMsKEZ1bmM8VW5pb248Tm9kZSxVbmlvbjxOb2RlLCBzdHJpbmc+W10sc3RyaW5nPixVbmlvbjxOb2RlLHN0cmluZz4+KShuID0+IChVbmlvbjxOb2RlLCBzdHJpbmc+KShuLklzPFVuaW9uPE5vZGUsIHN0cmluZz5bXT4oKSA/IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTExJRWxlbWVudD4obmV3IEhUTUxMSUVsZW1lbnQoKSxuLkFzPFVuaW9uPE5vZGUsIHN0cmluZz5bXT4oKSkgOiBuLklzPHN0cmluZz4oKSA/IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTExJRWxlbWVudD4obmV3IEhUTUxMSUVsZW1lbnQoKSxuLkFzPHN0cmluZz4oKSkgOiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxMSUVsZW1lbnQ+KG5ldyBIVE1MTElFbGVtZW50KCksbi5BczxOb2RlPigpKSkpKSkpO1xyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgQWRkQ2FtZWxTcGFjZSh0aGlzIHN0cmluZyBzdHIpXHJcbntcclxuICAgIHJldHVybiBSZWdleC5SZXBsYWNlKFJlZ2V4LlJlcGxhY2Uoc3RyLCBAXCIoW15fYS16XSkoW15fYS16XVthLXpdKVwiLCBcIiQxICQyXCIpLCBAXCIoW2Etel0pKFteX2Etel0pXCIsIFwiJDEgJDJcIik7XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBUb0NhbWVsU3RyaW5nPFQ+KHRoaXMgVCBlKVxyXG4gICAgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxue1xyXG4gICAgcmV0dXJuIGUuVG9TdHJpbmcoKS5BZGRDYW1lbFNwYWNlKCkuUmVwbGFjZSgnXycsICcgJyk7XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgQWRkRW51bTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdCwgVD8gZGVmYXVsdFZhbHVlID0gbnVsbCwgc3RyaW5nIGRlZmF1bHRWYWx1ZVN0cmluZyA9IFwiXCIpIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoZGVmYXVsdFZhbHVlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICBzZWxlY3QuQWRkKEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudCB7IFZhbHVlID0gXCJcIiwgU2VsZWN0ZWQgPSB0cnVlLCBEaXNhYmxlID0gdHJ1ZSB9LGRlZmF1bHRWYWx1ZVN0cmluZykpO1xyXG4gICAgICAgICAgICBmb3JlYWNoIChUIHZhbHVlIGluIFN5c3RlbS5FbnVtLkdldFZhbHVlcyh0eXBlb2YoVCkpKVxyXG4gICAgICAgICAgICAgICAgc2VsZWN0LkFkZChDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnRcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBWYWx1ZSA9ICgoaW50KShvYmplY3QpdmFsdWUpLlRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0ZWQgPSBvYmplY3QuRXF1YWxzKGRlZmF1bHRWYWx1ZSwgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5Ub0NhbWVsU3RyaW5nPFQ+KHZhbHVlKSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBib29sIEJvb2xWYWx1ZSh0aGlzIEhUTUxJbnB1dEVsZW1lbnQgY2hlY2tCb3gpXHJcbntcclxuICAgIHJldHVybiBjaGVja0JveC5DaGVja2VkO1xyXG59cHVibGljIHN0YXRpYyBib29sIEJvb2xWYWx1ZSh0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdClcclxue1xyXG4gICAgcmV0dXJuIHNlbGVjdC5WYWx1ZSA9PSBcInRydWVcIiA/IHRydWUgOiBmYWxzZTtcclxufXB1YmxpYyBzdGF0aWMgQWRqYWNlbmN5VHlwZSBBZGphY2VuY3lWYWx1ZSh0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdClcclxue1xyXG4gICAgcmV0dXJuIChBZGphY2VuY3lUeXBlKWludC5QYXJzZShzZWxlY3QuVmFsdWUpO1xyXG59cHVibGljIHN0YXRpYyBUPyBWYWx1ZTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdClcclxuICAgIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbntcclxuICAgIHJldHVybiBzZWxlY3QuVmFsdWUgPT0gXCJcIiA/IG51bGwgOiAoVD8gKShUKShvYmplY3QpaW50LlBhcnNlKHNlbGVjdC5WYWx1ZSk7XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTElucHV0RWxlbWVudCBTZXRCb29sVmFsdWUodGhpcyBIVE1MSW5wdXRFbGVtZW50IGNoZWNrQm94LCBib29sIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2hlY2tCb3guQ2hlY2tlZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICByZXR1cm4gY2hlY2tCb3g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgU2V0Qm9vbFZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBib29sIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZWN0LlZhbHVlID0gdmFsdWUuVG9TdHJpbmcoKS5Ub0xvd2VyKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgU2V0QWRqYWNlbmN5VmFsdWUodGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QsIEFkamFjZW5jeVR5cGUgdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxlY3QuVmFsdWUgPSAoKGludCl2YWx1ZSkuVG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBTZXRWYWx1ZTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdCwgVCB2YWx1ZSkgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGVjdC5WYWx1ZSA9ICgoaW50KShvYmplY3QpdmFsdWUpLlRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIHN0cmluZyBUb1RpbWVTdHJpbmcodGhpcyBUaW1lU3BhbiB0aW1lKVxyXG57XHJcbiAgICByZXR1cm4gdGltZS5Ub1N0cmluZyh0aW1lID49IFRpbWVTcGFuLkZyb21Ib3VycygxKSA/IEBcImhcXDptbVxcOnNzXCIgOiBAXCJtXFw6c3NcIik7XHJcbn0gICAgICAgIFtUZW1wbGF0ZShcIihlID0+IChlLnNldEN1c3RvbVZhbGlkaXR5KHttZXNzYWdlfSksIGUucmVwb3J0VmFsaWRpdHkoKSwgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBTZXRDdXN0b21WYWxpZGl0eTxUPih0aGlzIFQgZWxlbWVudCwgc3RyaW5nIG1lc3NhZ2UpIHdoZXJlIFQgOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zZXRBdHRyaWJ1dGUoJ2xpc3QnLCB7ZGF0YWxpc3RJRH0pLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MSW5wdXRFbGVtZW50IFNldERhdGFMaXN0KHRoaXMgSFRNTElucHV0RWxlbWVudCBlbGVtZW50LCBzdHJpbmcgZGF0YWxpc3RJRCk7XHJcbnB1YmxpYyBzdGF0aWMgdm9pZCBDbGVhcih0aGlzIEhUTUxFbGVtZW50IGVsZW1lbnQpXHJcbntcclxuICAgIGVsZW1lbnQuSW5uZXJIVE1MID0gXCJcIjtcclxufSAgICAgICAgLy9bVGVtcGxhdGUoXCJ7ZWxlbX0uYXBwZW5kQ2hpbGQoe2FkZGluZ30pXCIpXVxyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBleHRlcm4gVCBBcHBlbmQ8VD4gKHRoaXMgTm9kZSBlbGVtLCBUIGFkZGluZyk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVW5pb248Tm9kZSwgc3RyaW5nPltdIEpvaW5CUih0aGlzIElFbnVtZXJhYmxlPHN0cmluZz4gc3RyaW5ncylcclxuICAgICAgICB7XHJcblN5c3RlbS5GdW5jPElFbnVtZXJhYmxlPFVuaW9uPE5vZGUsIHN0cmluZz4+PiBJbm5lciA9IG51bGw7XG4gICAgICAgICAgICBcclxuSW5uZXIgPSAoKSA9PlxyXG57XHJcbiAgICB1c2luZyAodmFyIGVudW1lciA9IHN0cmluZ3MuR2V0RW51bWVyYXRvcigpKVxyXG4gICAge1xyXG4gICAgICAgIGlmICghZW51bWVyLk1vdmVOZXh0KCkpXHJcbiAgICAgICAgICAgIHlpZWxkIGJyZWFrO1xyXG4gICAgICAgIHlpZWxkIHJldHVybiBlbnVtZXIuQ3VycmVudDtcclxuICAgICAgICB3aGlsZSAoZW51bWVyLk1vdmVOZXh0KCkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gbmV3IEhUTUxCUkVsZW1lbnQoKTtcclxuICAgICAgICAgICAgeWllbGQgcmV0dXJuIGVudW1lci5DdXJyZW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuO1xuICAgICAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuVG9BcnJheTxVbmlvbjxOb2RlLHN0cmluZz4+KElubmVyKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgTm90YWJsZU9iamVjdHNMaXN0XHJcbiAgICB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+ICxzdHJpbmcgLHN0cmluZyA+PiBOb3RhYmxlT2JqZWN0cyA9XHJcbiAgICAgICAgICAgIGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gLHN0cmluZyAsc3RyaW5nID4+KCksKF9vMyk9PntfbzMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4sIHN0cmluZywgc3RyaW5nPihnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+KCksIChfbzEpID0+XHJcbntcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKSk7XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMSwgMCkpO1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDEsIDEpKTtcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAyKSk7XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMiwgMikpO1xyXG4gICAgcmV0dXJuIF9vMTtcclxufVxyXG5cclxuKSwgXCJUd28gR2VuZXJhdGlvbiBOaW5ldHkgRGVncmVlIFJvdGF0b3JcIiwgXCIwMDEwMTAtLS0gLyAwMDAxMDEtLS1cIikpO19vMy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+Piwgc3RyaW5nLCBzdHJpbmc+KGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4oKSwgKF9vMikgPT5cclxue1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApKTtcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigxLCAwKSk7XHJcbiAgICBfbzIuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMSwgMSkpO1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDEpKTtcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAyKSk7XHJcbiAgICByZXR1cm4gX28yO1xyXG59XHJcblxyXG4pLCBcIk9uZSBHZW5lcmF0aW9uIE5pbmV0eSBEZWdyZWUgUm90YXRvclwiLCBcIjAwMTAxMC0tLSAvIDAwMDEwMS0tLVwiKSk7cmV0dXJuIF9vMzt9KTtcclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIC8vLyA8c3VtbWFyeT5cclxuICAgIC8vLyBPcHRpb25zOlxyXG4gICAgLy8vIC0gQ2VsbCAoSXNDZWxsOiB0cnVlLCBJc1dhbGw6IGZhbHNlKSAgfCBCbGFja1xyXG4gICAgLy8vIC0gV2FsbCAoSXNDZWxsOiB0cnVlLCBJc1dhbGw6IHRydWUpICAgfCBHcmV5XHJcbiAgICAvLy8gLSBCcmljayAoSXNDZWxsOiBmYWxzZSwgSXNXYWxsOiB0cnVlKSB8IEdyZXlcclxuICAgIC8vLyA8L3N1bW1hcnk+XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBTcXVhcmVFeHRlbnNpb25zXHJcbiAgICB7XHJcbnB1YmxpYyBzdGF0aWMgYm9vbCBJc0FsaXZlKHRoaXMgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKVxyXG57XHJcbiAgICByZXR1cm4gc3F1YXJlVHlwZSAhPSBTcXVhcmVUeXBlLkJyaWNrO1xyXG59cHVibGljIHN0YXRpYyBib29sIElzVW5kZWFkKHRoaXMgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKVxyXG57XHJcbiAgICByZXR1cm4gc3F1YXJlVHlwZSAhPSBTcXVhcmVUeXBlLkNlbGw7XHJcbn1wdWJsaWMgc3RhdGljIGJvb2wgQ29udGFpbnNBbGl2ZTxUPih0aGlzIERpY3Rpb25hcnk8VCwgU3F1YXJlVHlwZT4gZGljLCBUIGtleSlcclxue1xyXG5TcXVhcmVUeXBlIHNxdWFyZVR5cGU7XG4gICAgcmV0dXJuIGRpYy5UcnlHZXRWYWx1ZShrZXksIG91dCBzcXVhcmVUeXBlKSAmJiBzcXVhcmVUeXBlLklzQWxpdmUoKTtcclxufSAgICB9XHJcblxyXG4gICAgcHVibGljIGVudW0gU3F1YXJlVHlwZVxyXG4gICAge1xyXG4gICAgICAgIENlbGwsICAvLyBCbGFja1xyXG4gICAgICAgIEltbW9ydGFsQ2VsbCwgIC8vIEdyZXlcclxuICAgICAgICBCcmljaywgLy8gR3JleVxyXG4gICAgICAgIENvdW50XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVudW0gR3JpZFR5cGVcclxuICAgIHtcclxuICAgICAgICBTcXVhcmUsXHJcbiAgICAgICAgSGV4LFxyXG4gICAgICAgIFRyaWFuZ2xlLFxyXG4gICAgICAgIENvdW50XHJcbiAgICB9XHJcblxyXG4gICAgW0ZsYWdzXVxyXG4gICAgcHVibGljIGVudW0gRGl2aWRlcnNJbmZvXHJcbiAgICB7XHJcbiAgICAgICAgTm9uZSA9IDAsXHJcbiAgICAgICAgUmlnaHQgPSAxIDw8IDAsXHJcbiAgICAgICAgQm90dG9tID0gMSA8PCAxLFxyXG4gICAgICAgIEJvdHRvbVJpZ2h0ID0gMSA8PCAyXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY2xhc3MgR3JpZFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCB2b2lkIENsZWFyKCk7XHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IHZvaWQgRHJhd1NxdWFyZXMoQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4sIFNxdWFyZVR5cGU+IERyYXdTcXVhcmUpO1xyXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCB2b2lkIEhhbmRsZUNsaWNrKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhd1Bvc2l0aW9uLCBTcXVhcmVUeXBlIFNxdWFyZVR5cGVQbGFjaW5nKTtcclxuICAgICAgICBwdWJsaWMgYWJzdHJhY3Qgdm9pZCBVcGRhdGUoKTtcclxuXHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IGludCBTcXVhcmVDb3VudCB7IGdldDsgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjbGFzcyBHcmlkPENvb3JkVHlwZT4gOiBHcmlkXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgdm9pZCBBc3NpZ25EaXZpZGVycyAoU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBkcmF3UG9zaXRpb24sIHJlZiBib29sIHBsYWNlTm9ybWFsbHkpIHsgfVxyXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IEdldERyYXdQb3NpdGlvbiAoQ29vcmRUeXBlIGNvb3Jkcyk7XHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IENvb3JkVHlwZSBGcm9tRHJhd1Bvc2l0aW9uIChTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYXdQb3NpdGlvbik7XHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IGludCBOdW1iZXJPZkFkamFjZW50Q2VsbHMgKENvb3JkVHlwZSBjb29yZHMsIEFjdGlvbjxDb29yZFR5cGU+IGVtcHR5QWRqQWN0aW9uID0gbnVsbCk7XHJcbiAgICAgICAgcHVibGljIERpY3Rpb25hcnk8Q29vcmRUeXBlLCBTcXVhcmVUeXBlPiBTcXVhcmVzID0gbmV3IERpY3Rpb25hcnk8Q29vcmRUeXBlLCBTcXVhcmVUeXBlPigpO1xyXG4gICAgICAgIHB1YmxpYyBEaWN0aW9uYXJ5PENvb3JkVHlwZSwgRGl2aWRlcnNJbmZvPiBEaXZpZGVycyA9IG5ldyBEaWN0aW9uYXJ5PENvb3JkVHlwZSwgRGl2aWRlcnNJbmZvPigpO1xyXG5wdWJsaWMgb3ZlcnJpZGUgaW50IFNxdWFyZUNvdW50XHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBTcXVhcmVzLkNvdW50O1xyXG4gICAgfVxyXG59XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgQ2xlYXIoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU3F1YXJlcy5DbGVhcigpO1xyXG4gICAgICAgICAgICBEaXZpZGVycy5DbGVhcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRHJhd1NxdWFyZXMgKEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+LCBDb29yZFR5cGUsIFNxdWFyZVR5cGU+IERyYXdTcXVhcmUpXHJcbiAgICAgICAge1xyXG5mb3JlYWNoICh2YXIgX2QxIGluIFNxdWFyZXMpXHJcbntcclxuICAgIENvb3JkVHlwZSBjb29yZHM7XHJcbiAgICBTcXVhcmVUeXBlIHNxdWFyZVR5cGU7XHJcbiAgICBfZDEuRGVjb25zdHJ1Y3Qob3V0IGNvb3Jkcywgb3V0IHNxdWFyZVR5cGUpO1xyXG4gICAgRHJhd1NxdWFyZShHZXREcmF3UG9zaXRpb24oY29vcmRzKSwgY29vcmRzLCBzcXVhcmVUeXBlKTtcclxufVxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIERyYXdTcXVhcmVzIChBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiwgU3F1YXJlVHlwZT4gRHJhd1NxdWFyZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuRHJhd1NxdWFyZXMoKEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixDb29yZFR5cGUsU3F1YXJlVHlwZT4pKChkcmF3UG9zaXRpb24sIGNvb3Jkcywgc3F1YXJlVHlwZSkgPT4gRHJhd1NxdWFyZShkcmF3UG9zaXRpb24sIHNxdWFyZVR5cGUpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGlzdDxDb29yZFR5cGU+IHJlbW92aW5nID0gbmV3IExpc3Q8Q29vcmRUeXBlPigpO1xyXG4gICAgICAgICAgICBIYXNoU2V0PENvb3JkVHlwZT4gYWRkaW5nID0gbmV3IEhhc2hTZXQ8Q29vcmRUeXBlPigpO1xyXG5mb3JlYWNoICh2YXIgX2QyIGluIFNxdWFyZXMpXHJcbntcclxuICAgIENvb3JkVHlwZSBjb29yZHM7XHJcbiAgICBTcXVhcmVUeXBlIHNxdWFyZVR5cGU7XHJcbiAgICBfZDIuRGVjb25zdHJ1Y3Qob3V0IGNvb3Jkcywgb3V0IHNxdWFyZVR5cGUpO1xyXG4gICAgaWYgKCFzcXVhcmVUeXBlLklzQWxpdmUoKSlcclxuICAgICAgICBjb250aW51ZTtcclxuICAgIGludCBhZGphY2VudENlbGxzID0gTnVtYmVyT2ZBZGphY2VudENlbGxzKGNvb3JkcywgKEFjdGlvbjxDb29yZFR5cGU+KShjb29yZHNfID0+XHJcbiAgICB7XHJcbiAgICAgICAgaWYgKEFwcC5kZWFkUnVsZXNbTnVtYmVyT2ZBZGphY2VudENlbGxzKGNvb3Jkc18pXSlcclxuICAgICAgICAgICAgYWRkaW5nLkFkZChjb29yZHNfKTtcclxuICAgIH1cclxuXHJcbikgICAgKTtcclxuICAgIGlmIChhZGphY2VudENlbGxzID4gQXBwLm1heEFkamFjZW50Q2VsbHMpXHJcbiAgICAgICAgYWRqYWNlbnRDZWxscyA9IEFwcC5tYXhBZGphY2VudENlbGxzO1xyXG4gICAgaWYgKCFzcXVhcmVUeXBlLklzVW5kZWFkKCkgJiYgIUFwcC5saXZpbmdSdWxlc1thZGphY2VudENlbGxzXSlcclxuICAgICAgICByZW1vdmluZy5BZGQoY29vcmRzKTtcclxufVxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKENvb3JkVHlwZSBjb29yZHMgaW4gcmVtb3ZpbmcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICghU3F1YXJlcy5SZW1vdmUoY29vcmRzKSkgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlNxdWFyZSB0cmllZCB0byBiZSByZW1vdmVkIGJ1dCBkaWRuJ3QgZXhpc3RcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKENvb3JkVHlwZSBjb29yZHMgaW4gYWRkaW5nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTcXVhcmVzLkFkZChjb29yZHMsIFNxdWFyZVR5cGUuQ2VsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIEhhbmRsZUNsaWNrIChTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYXdQb3NpdGlvbiwgU3F1YXJlVHlwZSBTcXVhcmVUeXBlUGxhY2luZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENvb3JkVHlwZSBjbGlja0Nvb3JkcyA9IEZyb21EcmF3UG9zaXRpb24oZHJhd1Bvc2l0aW9uKTtcclxuICAgICAgICAgICAgYm9vbCBwbGFjZU5vcm1hbGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKFNxdWFyZVR5cGVQbGFjaW5nID09IFNxdWFyZVR5cGUuQ291bnQpXHJcbiAgICAgICAgICAgICAgICBBc3NpZ25EaXZpZGVycyhkcmF3UG9zaXRpb24sIHJlZiBwbGFjZU5vcm1hbGx5KTtcclxuICAgICAgICAgICAgaWYgKHBsYWNlTm9ybWFsbHkgJiYgIVNxdWFyZXMuUmVtb3ZlKGNsaWNrQ29vcmRzKSlcclxuICAgICAgICAgICAgICAgIFNxdWFyZXMuQWRkKGNsaWNrQ29vcmRzLCBTcXVhcmVUeXBlUGxhY2luZyA9PSBTcXVhcmVUeXBlLkNvdW50ID8gU3F1YXJlVHlwZS5DZWxsIDogU3F1YXJlVHlwZVBsYWNpbmcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xhc3MgU3F1YXJlR3JpZCA6IEdyaWQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj5cclxuICAgIHtcclxucHVibGljIG92ZXJyaWRlIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID5HZXREcmF3UG9zaXRpb24oU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPmNvb3Jkcylcclxue1xyXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oY29vcmRzLkl0ZW0xICogQXBwLnhNdWx0aXBsaWVyLCBjb29yZHMuSXRlbTIgKiBBcHAueE11bHRpcGxpZXIpO1xyXG59cHVibGljIG92ZXJyaWRlIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID5Gcm9tRHJhd1Bvc2l0aW9uKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID5kcmF3UG9zaXRpb24pXHJcbntcclxuICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KEFwcC5OZWdEaXYoZHJhd1Bvc2l0aW9uLkl0ZW0xLCBBcHAueE11bHRpcGxpZXIpLCBBcHAuTmVnRGl2KGRyYXdQb3NpdGlvbi5JdGVtMiwgQXBwLnhNdWx0aXBsaWVyKSk7XHJcbn1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBBc3NpZ25EaXZpZGVycyhTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYXdQb3NpdGlvbiwgcmVmIGJvb2wgcGxhY2VOb3JtYWxseSlcclxuICAgICAgICB7XHJcbmRvdWJsZSBjbGlja1hfO1xuZG91YmxlIGNsaWNrWV87XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUsIGRvdWJsZT4oQXBwLk5lZ0RpdkRvdWJsZSgoZG91YmxlKWRyYXdQb3NpdGlvbi5JdGVtMSwgQXBwLnhNdWx0aXBsaWVyKSwgQXBwLk5lZ0RpdkRvdWJsZSgoZG91YmxlKWRyYXdQb3NpdGlvbi5JdGVtMiwgQXBwLnlNdWx0aXBsaWVyKSksIG91dCBjbGlja1hfLCBvdXQgY2xpY2tZXyk7XHJcbiAgICAgICAgICAgIHBsYWNlTm9ybWFsbHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgaW50IHhEaXYgPSAwLCB5RGl2ID0gMDtcclxuICAgICAgICAgICAgaWYgKGNsaWNrWF8gJSAxIDw9IDAuMilcclxuICAgICAgICAgICAgICAgIHhEaXYgPSAtMTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoY2xpY2tYXyAlIDEgPj0gMC44KVxyXG4gICAgICAgICAgICAgICAgeERpdiA9IDE7XHJcbiAgICAgICAgICAgIGlmIChjbGlja1lfICUgMSA8PSAwLjIpXHJcbiAgICAgICAgICAgICAgICB5RGl2ID0gLTE7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNsaWNrWV8gJSAxID49IDAuOClcclxuICAgICAgICAgICAgICAgIHlEaXYgPSAxO1xyXG4gICAgICAgICAgICBEaXZpZGVyc0luZm8gZGl2aWRlcnNJbmZvID0gRGl2aWRlcnNJbmZvLk5vbmU7XHJcbiAgICAgICAgICAgIEFjdGlvbjxEaXZpZGVyc0luZm8+IEFzc2lnbiA9IChEaXZpZGVyc0luZm8gZGl2SW5mbykgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW50IHggPSAoaW50KWNsaWNrWF8gKyB4RGl2LCB5ID0gKGludCljbGlja1lfICsgeURpdjtcclxuICAgICAgICAgICAgICAgIGlmIChkaXZJbmZvICE9IERpdmlkZXJzSW5mby5Ob25lKVxyXG4gICAgICAgICAgICAgICAge1xyXG5EaXZpZGVyc0luZm8gZGl2aWRlcnM7XG4gICAgICAgICAgICAgICAgICAgIGlmICghRGl2aWRlcnMuVHJ5R2V0VmFsdWUobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KXgsIChpbnQpeSksIG91dCBkaXZpZGVycykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlkZXJzID0gRGl2aWRlcnNJbmZvLk5vbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgRGl2aWRlcnNbbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4LCB5KV0gPSBkaXZpZGVycyBeIGRpdkluZm87XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHN3aXRjaCAoeERpdilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAtMTpcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHlEaXYpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXNzaWduKERpdmlkZXJzSW5mby5Cb3R0b21SaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXNzaWduKERpdmlkZXJzSW5mby5SaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeURpdiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBc3NpZ24oRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh5RGl2KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAtMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2lnbihEaXZpZGVyc0luZm8uQm90dG9tKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZU5vcm1hbGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXZpZGVyc0luZm8gPSBEaXZpZGVyc0luZm8uQm90dG9tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHlEaXYpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeERpdiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBc3NpZ24oRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXZpZGVyc0luZm8gPSBEaXZpZGVyc0luZm8uUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGl2aWRlcnNJbmZvID0gRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGl2aWRlcnNJbmZvICE9IERpdmlkZXJzSW5mby5Ob25lKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4RGl2ID0gMDtcclxuICAgICAgICAgICAgICAgIHlEaXYgPSAwO1xyXG4gICAgICAgICAgICAgICAgQXNzaWduKGRpdmlkZXJzSW5mbyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBpbnQgTnVtYmVyT2ZBZGphY2VudENlbGxzKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gY29vcmRzLCBBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gZW1wdHlBZGpBY3Rpb24gPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGFkamFjZW50Q2VsbHMgPSAwO1xyXG4gICAgICAgICAgICBpbnQgbiA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoaW50IEwgPSAwOyBMIDw9IDg7IEwrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKEwgPT0gNClcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciBhZGphY2VuY3lSdWxlID0gQXBwLmFkamFjZW5jeVJ1bGVzW24rK107XHJcblxyXG4gICAgICAgICAgICAgICAgaW50IGMwXyA9IGNvb3Jkcy5JdGVtMS0gMSArIChMICUgMyksXHJcbiAgICAgICAgICAgICAgICAgICAgYzFfID0gY29vcmRzLkl0ZW0yLSAxICsgTCAvIDM7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKERpdmlkZXJzLkhhc0RpdmlkZXJzKGNvb3Jkcy5JdGVtMSwgY29vcmRzLkl0ZW0yLCBMKSlcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuU3F1YXJlVHlwZSBzcXVhcmVJbmZvO1xuXHJcbiAgICAgICAgICAgICAgICBpZiAoU3F1YXJlcy5UcnlHZXRWYWx1ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGMwXywgYzFfKSwgb3V0IHNxdWFyZUluZm8pKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzcXVhcmVJbmZvLklzQWxpdmUoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbnRDZWxscyArPSAoaW50KWFkamFjZW5jeVJ1bGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZW1wdHlBZGpBY3Rpb24hPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PmVtcHR5QWRqQWN0aW9uLkludm9rZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGMwXywgYzFfKSkpOm51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFkamFjZW50Q2VsbHMgPiBBcHAubWF4QWRqYWNlbnRDZWxscyA/IEFwcC5tYXhBZGphY2VudENlbGxzIDogYWRqYWNlbnRDZWxscztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsYXNzIEhleEdyaWQgOiBHcmlkPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWFkb25seSBmbG9hdFxyXG4gICAgICAgICAgICBjb3M2MCA9IChmbG9hdClNYXRoLlNpbihNYXRoLlBJIC8gMyksXHJcbiAgICAgICAgICAgIHNpbjYwID0gKGZsb2F0KU1hdGguQ29zKE1hdGguUEkgLyAzKTtcclxuICAgICAgICBcclxuICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIFxyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiY29vcmRzXCI+NjBsIGlzIHBvc2l0aW9uIGZyb20gKDAsIDApIGdvaW5nIDYwIGRlZ3JlZXMgbGVmdCBvZiB1cC4gNjByIGlzIHBvc2l0aW9uIGZyb20gKDAsIDApIGdvaW5nIDYwIGRlZ3JlZXMgcmlnaHQgb2YgdXAvcGFyYW0+XHJcbiAgICAgICAgLy8vIDxyZXR1cm5zPjwvcmV0dXJucz5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBHZXREcmF3UG9zaXRpb24gKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gY29vcmRzKVxyXG4gICAgICAgIHtcclxuaW50IF82MGw7XG5pbnQgXzYwcjtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoY29vcmRzLCBvdXQgXzYwbCwgb3V0IF82MHIpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KSgoLV82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIGNvczYwKSwgKGludCkoLShfNjBsICsgXzYwcikgKiBBcHAueE11bHRpcGxpZXIgKiBzaW42MCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gRnJvbURyYXdQb3NpdGlvbihTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYXdQb3NpdGlvbilcclxuICAgICAgICB7XHJcbmludCB4O1xuaW50IHk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGRyYXdQb3NpdGlvbiwgb3V0IHgsIG91dCB5KTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHggPSAoLV82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIHNpbjYwXHJcbiAgICAgICAgICAgICAgIHkgPSAtKF82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIGNvczYwXHJcbiAgICAgICAgICAgICAgIGsgPSBBcHAueE11bHRpcGxpZXJcclxuICAgICAgICAgICAgICAgYSA9IF82MGxcclxuICAgICAgICAgICAgICAgYiA9IF82MHJcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIFNvbHZlIHggPSAoLWEgKyBiKSAqIGsgKiBzaW42MDt5ID0gLShhKyBiKSAqIGsgKiBjb3M2MCBmb3IgKGEsIGIpIChodHRwczovL3d3dy53b2xmcmFtYWxwaGEuY29tL2lucHV0P2k9c29sdmUreCslM0QrJTI4LWErJTJCK2IlMjkrKitrKyorc2luNjAlM0J5KyUzRCstJTI4YSUyQitiJTI5KyoraysqK2NvczYwK2ZvcithK2FuZCtiKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgYSA9IC0oc3FydCgzKSB4ICsgMyB5KS8oMyBrKVxyXG4gICAgICAgICAgICAgICBiID0gKHNxcnQoMykgeCAtIDMgeSkvKDMgaylcclxuICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKC0oTWF0aC5TcXJ0KDMpICogeCArIDMgKiB5KSAvICgzICogQXBwLnhNdWx0aXBsaWVyKSksIChpbnQpKChNYXRoLlNxcnQoMykgKiB4IC0gMyAqIHkpIC8gKDMgKiBBcHAueE11bHRpcGxpZXIpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgaW50IE51bWJlck9mQWRqYWNlbnRDZWxscyhTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGNvb3JkcywgQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+IGVtcHR5QWRqQWN0aW9uID0gbnVsbClcclxuICAgICAgICB7XHJcbmludCBfNjBsO1xuaW50IF82MHI7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGNvb3Jkcywgb3V0IF82MGwsIG91dCBfNjByKTtcclxuICAgICAgICAgICAgaW50IGFkamFjZW50Q2VsbHMgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGludCBMID0gMDsgTCA8PSA1OyBMKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBhZGphY2VuY3lSdWxlID0gQXBwLmFkamFjZW5jeVJ1bGVzW0xdO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDYwbCBpcyBwb3NpdGlvbiBmcm9tICgwLCAwKSBnb2luZyA2MCBkZWdyZWVzIGxlZnQgb2YgdXAuIDYwciBpcyBwb3NpdGlvbiBmcm9tICgwLCAwKSBnb2luZyA2MCBkZWdyZWVzIHJpZ2h0IG9mIHVwXHJcbiAgICAgICAgICAgICAgICAvLyBMID0gMCBpcyBsZWZ0LXVwLCBnb2luZyBjbG9ja3dpc2UgdXAgdG8gTD01IGlzIGxlZnRcclxuXHJcbiAgICAgICAgICAgICAgICBpbnQgXzYwbF8sIF82MHJfO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChMKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxlZnQtdXBcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MGxfID0gXzYwbCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MHJfID0gXzYwcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MGxfID0gXzYwbCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MHJfID0gXzYwciArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJpZ2h0LXVwXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjBsXyA9IF82MGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MHJfID0gXzYwciArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJpZ2h0LWRvd25cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MGxfID0gXzYwbCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MHJfID0gXzYwcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZG93blxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwbF8gPSBfNjBsIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbGVmdC1kb3duXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjBsXyA9IF82MGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MHJfID0gXzYwciAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKHN0cmluZy5Gb3JtYXQoXCJJbnZhbGlkIEw6IHswfVwiLEwpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuU3F1YXJlVHlwZSBzcXVhcmVJbmZvO1xuXHJcbiAgICAgICAgICAgICAgICAvL2lmIChEaXZpZGVycy5IYXNEaXZpZGVycyhjb29yZHMuYzAsIGNvb3Jkcy5jMSwgTCkpXHJcbiAgICAgICAgICAgICAgICAvLyAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoU3F1YXJlcy5UcnlHZXRWYWx1ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KF82MGxfLCBfNjByXyksIG91dCBzcXVhcmVJbmZvKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3F1YXJlSW5mby5Jc0FsaXZlKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW50Q2VsbHMgKz0gKGludClhZGphY2VuY3lSdWxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGVtcHR5QWRqQWN0aW9uIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5lbXB0eUFkakFjdGlvbi5JbnZva2UobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihfNjBsXywgXzYwcl8pKSk6bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYWRqYWNlbnRDZWxscyA+IEFwcC5tYXhBZGphY2VudENlbGxzID8gQXBwLm1heEFkamFjZW50Q2VsbHMgOiBhZGphY2VudENlbGxzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xhc3MgVHJpYW5nbGVHcmlkIDogR3JpZDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsVHJpYW5nbGVMb2NhdGlvbiA+PlxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGZsb2F0XHJcbiAgICAgICAgICAgIGNvczYwID0gKGZsb2F0KU1hdGguU2luKE1hdGguUEkgLyAzKSxcclxuICAgICAgICAgICAgc2luNjAgPSAoZmxvYXQpTWF0aC5Db3MoTWF0aC5QSSAvIDMpO1xyXG5cclxuICAgICAgICAvLyBjMCBpcyB4LCBjMSBpcyB5XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gR2V0RHJhd1Bvc2l0aW9uKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxUcmlhbmdsZUxvY2F0aW9uID4gY29vcmRzKVxyXG4gICAgICAgIHtcclxuaW50IF82MGw7XG5pbnQgXzYwcjtcblRyaWFuZ2xlTG9jYXRpb24gbjtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoY29vcmRzLCBvdXQgXzYwbCwgb3V0IF82MHIsIG91dCBuKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCkoKC1fNjBsICsgXzYwcikgKiBBcHAueE11bHRpcGxpZXIgKiBjb3M2MCksIChpbnQpKC0oXzYwbCArIF82MHIpICogQXBwLnhNdWx0aXBsaWVyICogc2luNjApKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsVHJpYW5nbGVMb2NhdGlvbiA+IEZyb21EcmF3UG9zaXRpb24oU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBkcmF3UG9zaXRpb24pXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uRnVuYzxkb3VibGUsIGRvdWJsZT4gTmVnTW9kMSA9IG51bGw7XG5pbnQgeDtcbmludCB5O1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChkcmF3UG9zaXRpb24sIG91dCB4LCBvdXQgeSk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB4ID0gKC1fNjBsICsgXzYwcikgKiBBcHAueE11bHRpcGxpZXIgKiBzaW42MFxyXG4gICAgICAgICAgICAgICB5ID0gLShfNjBsICsgXzYwcikgKiBBcHAueE11bHRpcGxpZXIgKiBjb3M2MFxyXG4gICAgICAgICAgICAgICBrID0gQXBwLnhNdWx0aXBsaWVyXHJcbiAgICAgICAgICAgICAgIGEgPSBfNjBsXHJcbiAgICAgICAgICAgICAgIGIgPSBfNjByXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBTb2x2ZSB4ID0gKC1hICsgYikgKiBrICogc2luNjA7eSA9IC0oYSsgYikgKiBrICogY29zNjAgZm9yIChhLCBiKSAoaHR0cHM6Ly93d3cud29sZnJhbWFscGhhLmNvbS9pbnB1dD9pPXNvbHZlK3grJTNEKyUyOC1hKyUyQitiJTI5KyoraysqK3NpbjYwJTNCeSslM0QrLSUyOGElMkIrYiUyOSsqK2srKitjb3M2MCtmb3IrYSthbmQrYilcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIGEgPSAtKDMgeCArIHNxcnQoMykgeSkvKDMgaylcclxuICAgICAgICAgICAgICAgYiA9ICgzIHggLSBzcXJ0KDMpIHkpLygzIGspXHJcbiAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgVHJpYW5nbGVMb2NhdGlvbiBmcm9tIHBvc2l0aW9uXHJcblxyXG4gICAgICAgICAgICBkb3VibGUgYm9hcmRfNjBsID0gLShNYXRoLlNxcnQoMykgKiB4ICsgMyAqIHkpIC8gKDMgKiBBcHAueE11bHRpcGxpZXIpLFxyXG4gICAgICAgICAgICAgICAgICAgYm9hcmRfNjByID0gIChNYXRoLlNxcnQoMykgKiB4IC0gMyAqIHkpIC8gKDMgKiBBcHAueE11bHRpcGxpZXIpO1xyXG5cclxuICAgICAgICAgICAgXHJcbk5lZ01vZDEgPSAoYSkgPT4gKGEgJSAxICsgMSkgJSAxO1xuXHJcbiAgICAgICAgICAgIGRvdWJsZSBfNjBsTW9kMSA9IE5lZ01vZDEoYm9hcmRfNjBsKSxcclxuICAgICAgICAgICAgICAgICAgIF82MHJNb2QxID0gTmVnTW9kMShib2FyZF82MHIpO1xyXG5cclxuICAgICAgICAgICAgVHJpYW5nbGVMb2NhdGlvbiBuID0gXzYwck1vZDEgPD0gKDEuMCAvIDIpXHJcbiAgICAgICAgICAgICAgICA/IF82MGxNb2QxIDw9ICgxLjAgLyAzKSA/IFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tIDpcclxuICAgICAgICAgICAgICAgICAgICBfNjBsTW9kMSA8PSAoMi4wIC8gMykgPyBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbUxlZnQgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVHJpYW5nbGVMb2NhdGlvbi5Ub3BMZWZ0XHJcbiAgICAgICAgICAgICAgICA6IF82MGxNb2QxIDw9ICgxLjAgLyAzKSA/IFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tUmlnaHQgOlxyXG4gICAgICAgICAgICAgICAgICAgIF82MGxNb2QxIDw9ICgyLjAgLyAzKSA/IFRyaWFuZ2xlTG9jYXRpb24uVG9wUmlnaHQgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVHJpYW5nbGVMb2NhdGlvbi5Ub3A7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+KChpbnQpTWF0aC5Sb3VuZChib2FyZF82MGwpLCAoaW50KU1hdGguUm91bmQoYm9hcmRfNjByKSwgbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgaW50IE51bWJlck9mQWRqYWNlbnRDZWxscyhTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsVHJpYW5nbGVMb2NhdGlvbiA+IGNvb3JkcywgQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxUcmlhbmdsZUxvY2F0aW9uID4+IGVtcHR5QWRqQWN0aW9uID0gbnVsbClcclxuICAgICAgICB7XHJcbl9fX0FkZFNxdWFyZV9EZWxlZ2F0ZV8wIEFkZFNxdWFyZSA9IG51bGw7XG5TeXN0ZW0uRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4sIFRyaWFuZ2xlTG9jYXRpb24sIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBUcmlhbmdsZUxvY2F0aW9uPj4gQ3JlYXRlUG9zID0gbnVsbDtcblN5c3RlbS5GdW5jPGludCwgYm9vbCwgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PiBHZXRGaW5hbEhleGFnb25Mb2NQb3MgPSBudWxsO1xuU3lzdGVtLkZ1bmM8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+IEdldEhleGFnb25Mb2MgPSBudWxsO1xuU3lzdGVtLkZ1bmM8aW50LCBib29sLCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+IEdldEhleGFnb25Mb2NQb3MgPSBudWxsO1xuaW50IF82MGw7XG5pbnQgXzYwcjtcblRyaWFuZ2xlTG9jYXRpb24gbjtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoY29vcmRzLCBvdXQgXzYwbCwgb3V0IF82MHIsIG91dCBuKTtcclxuICAgICAgICAgICAgaW50IGFkamFjZW50Q2VsbHMgPSAwO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yIChUcmlhbmdsZUxvY2F0aW9uIGxvYyA9IDA7IGxvYyA8IFRyaWFuZ2xlTG9jYXRpb24uQ291bnQ7IGxvYysrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAobG9jID09IG4pXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWRqYWNlbmN5UnVsZSA9IEFwcC5hZGphY2VuY3lSdWxlc1soaW50KWxvY107XHJcblNxdWFyZVR5cGUgc3F1YXJlVHlwZTtcbiAgICAgICAgICAgICAgICBpZiAoU3F1YXJlcy5UcnlHZXRWYWx1ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+KF82MGwsIF82MHIsIGxvYyksIG91dCBzcXVhcmVUeXBlKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3F1YXJlVHlwZS5Jc0FsaXZlKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW50Q2VsbHMgKz0gKGludClhZGphY2VuY3lSdWxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGVtcHR5QWRqQWN0aW9uIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5lbXB0eUFkakFjdGlvbi5JbnZva2UobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBUcmlhbmdsZUxvY2F0aW9uPihfNjBsLCBfNjByLCBsb2MpKSk6bnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgdHJpYW5nbGVzIGZyb20gYWRqYWNlbnQgaGV4YWdvbnMgZm9yIGFkamFjZW5jeVxyXG5cclxuICAgICAgICAgICAgLy8gSWYgbGVmdC11cCwgZ2V0IHJpZ2h0LXVwLCByaWdodC1kb3duIGFuZCBkb3duIGZyb20gbGVmdC11cCxcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgZ2V0IHJpZ2h0LXVwIGFuZCB1cCBmcm9tIGxlZnQtZG93bixcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgZ2V0IGxlZnQtZG93biBhbmQgZG93biBmcm9tIHVwXHJcblxyXG4gICAgICAgICAgICAvLyBJZiB1cCwgZ2V0IGxlZnQtZG93biwgZG93biBhbmQgcmlnaHQtZG93biBmcm9tIHVwLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgZ2V0IHJpZ2h0LXVwIGFuZCByaWdodC1kb3duIGZyb20gbGVmdC11cFxyXG4gICAgICAgICAgICAvLyAgICAgICAgZ2V0IGxlZnQtdXAgYW5kIGxlZnQtZG93biBmcm9tIHJpZ2h0LXVwXHJcblxyXG4gICAgICAgICAgICAvLyBJZiByaWdodC11cCwgZ2V0IGxlZnQtdXAsIGxlZnQtZG93biBhbmQgZG93biBmcm9tIHJpZ2h0LXVwLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgZ2V0IGxlZnQtdXAgYW5kIHVwIGZyb20gcmlnaHQtZG93bixcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgIGdldCByaWdodC1kb3duIGFuZCBkb3duIGZyb20gdXBcclxuXHJcbiAgICAgICAgICAgIC8vIElmIGxlZnQtZG93biwgZ2V0IHJpZ2h0LXVwLCByaWdodC1kb3duIGFuZCB1cCBmcm9tIGxlZnQtZG93bixcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICBnZXQgcmlnaHQtZG93biBhbmQgZG93biBmcm9tIGxlZnQtdXAsXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgZ2V0IGxlZnQtdXAgYW5kIHVwIGZyb20gZG93blxyXG5cclxuICAgICAgICAgICAgLy8gSWYgZG93biwgZ2V0IGxlZnQtdXAsIHVwIGFuZCByaWdodC11cCBmcm9tIGRvd24sXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgIGdldCByaWdodC1kb3duIGFuZCByaWdodC11cCBmcm9tIGxlZnQtZG93blxyXG4gICAgICAgICAgICAvLyAgICAgICAgICBnZXQgbGVmdC1kb3duIGFuZCBsZWZ0LXVwIGZyb20gcmlnaHQtZG93blxyXG5cclxuICAgICAgICAgICAgLy8gSWYgcmlnaHQtZG93biwgZ2V0IGxlZnQtdXAsIGxlZnQtZG93biBhbmQgdXAgZnJvbSByaWdodC1kb3duLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBnZXQgbGVmdC1kb3duIGFuZCBkb3duIGZyb20gcmlnaHQtdXAsXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGdldCByaWdodC11cCBhbmQgdXAgZnJvbSBkb3duXHJcblxyXG4gICAgICAgICAgICBpbnQgeF8gPVxyXG4gICAgICAgICAgICAgICAgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQgfHwgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbUxlZnQgPyAtMSA6XHJcbiAgICAgICAgICAgICAgICBuID09IFRyaWFuZ2xlTG9jYXRpb24uVG9wUmlnaHQgfHwgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbVJpZ2h0ID8gMSA6XHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgeV8gPVxyXG4gICAgICAgICAgICAgICAgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQgfHwgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLlRvcFJpZ2h0IHx8IG4gPT0gVHJpYW5nbGVMb2NhdGlvbi5Ub3AgPyAtMSA6IDE7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuR2V0SGV4YWdvbkxvY1BvcyA9IChpbnZlcnRYLCBpbnZlcnRZKSA9PiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGludmVydFggPT0gLTEgPyAwIDogaW52ZXJ0WCA9PSAxID8gLXhfIDogeF8sIGludmVydFkgPyAteV8gOiB5Xyk7XG4gICAgICAgICAgICBcclxuR2V0SGV4YWdvbkxvYyA9ICh4LCB5KSA9PiB5ID09IDAgPyAoKFN5c3RlbS5GdW5jPFRyaWFuZ2xlTG9jYXRpb24+KSgoKSA9PlxyXG57XHJcbiAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbihcInkgY2Fubm90IGJlIDBcIik7XHJcbn1cclxuXHJcbikpKCkgOiB4ID09IDAgPyB5ID09IC0xID8gVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b20gOiBUcmlhbmdsZUxvY2F0aW9uLlRvcCA6IHggPT0gLTEgPyB5ID09IC0xID8gVHJpYW5nbGVMb2NhdGlvbi5Ub3BMZWZ0IDogVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21MZWZ0IDogeCA9PSAxID8geSA9PSAtMSA/IFRyaWFuZ2xlTG9jYXRpb24uVG9wUmlnaHQgOiBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbVJpZ2h0IDogKChTeXN0ZW0uRnVuYzxUcmlhbmdsZUxvY2F0aW9uPikoKCkgPT5cclxue1xyXG4gICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oXCJ4IG11c3QgYmUgLTEsIDAgb3IgMVwiKTtcclxufVxyXG5cclxuKSkoKTtcbkdldEZpbmFsSGV4YWdvbkxvY1BvcyA9IChpbnZlcnRYLCBpbnZlcnRZKSA9PlxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChHZXRIZXhhZ29uTG9jUG9zKGludmVydFgsIGludmVydFkpLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oXzYwbCArIHgsIF82MHIgKyB5KTtcclxufVxyXG5cclxuO1xuQ3JlYXRlUG9zID0gKHBvcywgTikgPT4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBUcmlhbmdsZUxvY2F0aW9uPihwb3MuSXRlbTEsIHBvcy5JdGVtMiwgTik7XG5BZGRTcXVhcmUgPSAoaW50IGludmVydFgxLCBib29sIGludmVydFkxLCBpbnQgaW52ZXJ0WDIsIGJvb2wgaW52ZXJ0WTIsIGludCB4MU92ZXJyaWRlLCBpbnQgeDJPdmVycmlkZSkgPT5cclxue1xyXG4gICAgaW50IF82MGxfO1xyXG4gICAgaW50IF82MHJfO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChHZXRGaW5hbEhleGFnb25Mb2NQb3MoaW52ZXJ0WDEsIGludmVydFkxKSwgb3V0IF82MGxfLCBvdXQgXzYwcl8pO1xyXG4gICAgaWYgKHgxT3ZlcnJpZGUgIT0gMClcclxuICAgICAgICBfNjBsXyA9IHgxT3ZlcnJpZGU7XHJcbiAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4gcG9zMiA9IEdldEhleGFnb25Mb2NQb3MoaW52ZXJ0WDIsIGludmVydFkyKTtcclxuICAgIGlmICh4Mk92ZXJyaWRlICE9IDApXHJcbiAgICAgICAgcG9zMi5JdGVtMSA9IHgyT3ZlcnJpZGU7XHJcbiAgICBUcmlhbmdsZUxvY2F0aW9uIG5fID0gR2V0SGV4YWdvbkxvYyhwb3MyLkl0ZW0xLCBwb3MyLkl0ZW0yKTtcclxuICAgIHZhciBjb29yZHNfID0gQ3JlYXRlUG9zKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oXzYwbF8sIF82MHJfKSwgbl8pO1xyXG4gICAgU3F1YXJlVHlwZSBzcXVhcmVJbmZvO1xyXG4gICAgaWYgKFNxdWFyZXMuVHJ5R2V0VmFsdWUoY29vcmRzXywgb3V0IHNxdWFyZUluZm8pKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChzcXVhcmVJbmZvLklzQWxpdmUoKSlcclxuICAgICAgICAgICAgYWRqYWNlbnRDZWxscyArPSAxO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAgICAgIGVtcHR5QWRqQWN0aW9uICE9IG51bGwgPyBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKSA9PiBlbXB0eUFkakFjdGlvbi5JbnZva2UoY29vcmRzXykpIDogbnVsbDtcclxufVxyXG5cclxuO1xuXHJcbiAgICAgICAgICAgIHN3aXRjaCAobilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQ6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uVG9wUmlnaHQ6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tTGVmdDpcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21SaWdodDpcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpbnZlcnRZIGlzIC0xLCB0aGVuIHRoZSB5IGNvb3JkaW5hdGUgaXMgcmVtb3ZlZC5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpbnZlcnRZIGlzIDAsIHRoZW4gdGhlIHkgY29vcmRpbmF0ZSBpcyBub3QgaW52ZXJ0ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaW52ZXJ0WSBpcyAxLCB0aGVuIHRoZSB5IGNvb3JkaW5hdGUgaXMgaW52ZXJ0ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaW52ZXJ0WCBpcyAwLCB0aGVuIHRoZSB4IGNvb3JkaW5hdGUgaXMgbm90IGludmVydGVkLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGludmVydFggaXMgMSwgdGhlbiB0aGUgeCBjb29yZGluYXRlIGlzIGludmVydGVkLlxyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgxLCB0cnVlLCAwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDEsIGZhbHNlLCAwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKC0xLCB0cnVlLCAwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDEsIGZhbHNlLCAwLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoLTEsIGZhbHNlLCAwLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMCwgdHJ1ZSwgLTEsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoLTEsIHRydWUsIC0xLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uVG9wOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbTpcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMCwgdHJ1ZSwgMCwgZmFsc2UsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCB0cnVlLCAwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDAsIHRydWUsIDAsIGZhbHNlLCAtMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDAsIGZhbHNlLCAwLCBmYWxzZSwgMSwgLTEpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCB0cnVlLCAwLCBmYWxzZSwgMSwgLTEpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCBmYWxzZSwgMCwgZmFsc2UsIC0xLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMCwgdHJ1ZSwgMCwgZmFsc2UsIC0xLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oXCJuIG11c3QgYmUgMCwgMSwgMiwgMywgNCBvciA1XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYWRqYWNlbnRDZWxscyA+IEFwcC5tYXhBZGphY2VudENlbGxzID8gQXBwLm1heEFkamFjZW50Q2VsbHMgOiBhZGphY2VudENlbGxzO1xyXG4gICAgICAgIH1cclxucHJpdmF0ZSBkZWxlZ2F0ZSB2b2lkIF9fX0FkZFNxdWFyZV9EZWxlZ2F0ZV8wKGludCBpbnZlcnRYMSwgYm9vbCBpbnZlcnRZMSwgaW50IGludmVydFgyLCBib29sIGludmVydFkyLCBpbnQgeDFPdmVycmlkZSA9IDAsIGludCB4Mk92ZXJyaWRlID0gMCk7ICAgIH1cclxufVxyXG4iXQp9Cg==
