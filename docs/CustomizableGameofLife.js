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
                    this.NotableObjects = function (_o4) {
                            _o4.add(new (System.ValueTuple$3(System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32)),System.String,System.String)).$ctor1(function (_o1) {
                                    _o1.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0));
                                    _o1.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(1, 0));
                                    _o1.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(1, 1));
                                    _o1.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 2));
                                    _o1.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(2, 2));
                                    return _o1;
                                }(new (System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32))).ctor()), "Two Generation Ninety Degree Rotator", "001010--- / 000101---"));
                            _o4.add(new (System.ValueTuple$3(System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32)),System.String,System.String)).$ctor1(function (_o2) {
                                    _o2.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0));
                                    _o2.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(1, 0));
                                    _o2.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(1, 1));
                                    _o2.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 1));
                                    _o2.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 2));
                                    return _o2;
                                }(new (System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32))).ctor()), "One Generation Ninety Degree Rotator", "001010--- / 000101---"));
                            _o4.add(new (System.ValueTuple$3(System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32)),System.String,System.String)).$ctor1(function (_o3) {
                                    _o3.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 1));
                                    _o3.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(1, 0));
                                    _o3.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0));
                                    _o3.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(2, 0));
                                    _o3.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(2, 1));
                                    return _o3;
                                }(new (System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32))).ctor()), "Two Direction Grower", "000100000 / 111111111"));
                            return _o4;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDdXN0b21pemFibGVHYW1lb2ZMaWZlLmpzIiwKICAic291cmNlUm9vdCI6ICIiLAogICJzb3VyY2VzIjogWyJDbGFzczEuY3MiLCJFeHRlbnNpb25zLmNzIiwiTm90YWJsZU9iamVjdHNMaXN0LmNzIiwiU3F1YXJlLmNzIiwiR3JpZC5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQXlqQkFBLHdCQUFpRUE7WUFDckRBLHFCQUF3QkE7WUFDcENBO1lBQXFCQSxJQUFJQSxDQUFDQSxLQUFJQSw4Q0FBNkJBO2dCQUUzQ0E7b0JBRUlBLGVBQW1CQSxXQUFXQTtvQkFDOUJBLElBQUlBLGtCQUFrQkE7d0JBRWxCQSxJQUFJQSxBQUFxQ0E7NEJBRXJDQSxtQkFBc0JBLDhDQUFzQ0EsZUFBZUEsdUJBQXZCQTs0QkFDcERBLGtCQUFXQSxpQkFBY0EsMkNBQWFBOzt3QkFFMUNBLElBQUlBLEFBQXFDQTs0QkFFckNBLG9CQUFzQkEsOENBQXNDQSxlQUFlQSxxQkFBdkJBOzRCQUNwREEsa0JBQVdBLGtCQUFjQSx5Q0FBV0E7O3dCQUV4Q0EsSUFBSUEsQUFBcUNBOzRCQUVyQ0Esb0JBQStCQSw4Q0FBK0NBLGVBQWVBLDBCQUFoQ0E7NEJBQzdEQSxrQkFBV0Esa0JBQWNBLDhDQUFnQkE7Ozs7Ozs7WUFNekRBO1lBQ0FBLDBCQUEwQkE7WUFDMUJBO1lBQ0FBLDBCQUEwQkE7WUFDMUJBLDBCQUEwQkE7O1lBRTFCQTs7WUFFQUEsa0JBQStEQSxBQUFxRkEsVUFBQ0E7b0JBQU9BLFFBQVFBLEtBQUlBLCtJQUEwRUEsa0dBQTBFQTtvQkFBNEVBLFFBQVFBLEtBQUlBLHdJQUFtRUEsMkZBQW1FQTtvQkFBNEVBLFFBQVFBLEtBQUlBLCtJQUEwRUEsNEZBQW9FQTtvQkFBNEVBLFFBQVFBLEtBQUlBLHlKQUFvRkEsa0dBQTBFQTtvQkFBMkVBLE9BQU9BO2tCQUEzK0JBLEtBQUlBOztZQUVqR0EsaUJBQTRCQSwwREFB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QTZCQTt3QkFDN0JBO29CQUNKQTt3QkFDSUEsTUFBTUEsSUFBSUE7OztnQkFHbEJBLE9BQU9BLGdCQUFnQkEsOENBQXVCQSw4Q0FBdUJBIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkRpYWdub3N0aWNzLkNvbnRyYWN0cztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5SZWZsZWN0aW9uO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgQXBwXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgeE11bHRpcGxpZXIgPSAyMDtcclxucHVibGljIHN0YXRpYyBpbnQgeU11bHRpcGxpZXJcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHhNdWx0aXBsaWVyO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBkb3VibGUgYWN0dWFsWE11bHRpcGxpZXJcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIEdyaWQgaXMgSGV4R3JpZCA/IHhNdWx0aXBsaWVyICogMiAqIEhleEdyaWQuY29zNjAgOiB4TXVsdGlwbGllcjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgZG91YmxlIGFjdHVhbFlNdWx0aXBsaWVyXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBHcmlkIGlzIEhleEdyaWQgPyB5TXVsdGlwbGllciAqIDIgKiBIZXhHcmlkLnNpbjYwIDogeU11bHRpcGxpZXI7XHJcbiAgICB9XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IHNjcmVlbldpZHRoID0gV2luZG93LklubmVyV2lkdGgsIHNjcmVlbkhlaWdodCA9IFdpbmRvdy5Jbm5lckhlaWdodDtcclxucHVibGljIHN0YXRpYyBpbnQgd2lkdGhcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIChpbnQpTWF0aC5DZWlsaW5nKChkb3VibGUpc2NyZWVuV2lkdGggLyB4TXVsdGlwbGllcik7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIGludCBoZWlnaHRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIChpbnQpTWF0aC5DZWlsaW5nKChkb3VibGUpc2NyZWVuSGVpZ2h0IC8geU11bHRpcGxpZXIpO1xyXG4gICAgfVxyXG59XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBIb3RiYXIgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFN0eWxlID0ge1xyXG4gICAgICAgICAgICAgICAgUG9zaXRpb24gPSBQb3NpdGlvbi5BYnNvbHV0ZSxcclxuICAgICAgICAgICAgICAgIExlZnQgPSBcIjEwMHB4XCIsXHJcbiAgICAgICAgICAgICAgICBUb3AgPSBzdHJpbmcuRm9ybWF0KFwiezB9cHhcIixXaW5kb3cuSW5uZXJIZWlnaHQgLSA0MCkgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFJlc2V0KG1ha2VCbGFuazogdHJ1ZSlcclxuICAgICAgICAgICAgfSxcIkJsYW5rXCIpKVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFJlc2V0KClcclxuICAgICAgICAgICAgfSxcIlJlc2V0XCIpKVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IEdldENvb3JkaW5hdGVzKClcclxuICAgICAgICAgICAgfSxcIkdldCBDb29yZGluYXRlc1wiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLFxyXG4gICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT4gU2F2ZUFzU3RhcnRlcigpXHJcbiAgICAgICAgICAgIH0sXCJTYXZlIGFzIFN0YXJ0ZXJcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gWm9vbSh6b29tSW46IGZhbHNlKVxyXG4gICAgICAgICAgICB9LFwiWm9vbSBPdXRcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gWm9vbSh6b29tSW46IHRydWUpXHJcbiAgICAgICAgICAgIH0sXCJab29tIEluXCIpKVxyXG4sTmV4dEdyaWRUeXBlQnV0dG9uID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IE5leHRHcmlkVHlwZSgpXHJcbiAgICAgICAgICAgIH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLlRvQ2FtZWxTdHJpbmc8R3JpZFR5cGU+KERlZmF1bHRHcmlkVHlwZSkpKVxyXG4sTmV4dFNxdWFyZVR5cGVCdXR0b24gPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gTmV4dFNxdWFyZVR5cGUoKVxyXG4gICAgICAgICAgICB9LFwiV2FsbFwiKSlcclxuLFBsYXlCdXR0b24gPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gSW52ZXJ0SXNQbGF5aW5nKClcclxuICAgICAgICAgICAgfSxcIuKWtlwiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBTaG93TW9kYWwoTW9kYWxUeXBlLlNldHRpbmdzKVxyXG4gICAgICAgICAgICB9LFwi4pqZXCIpKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTcXVhcmVUeXBlIFNxdWFyZVR5cGVQbGFjaW5nID0gU3F1YXJlVHlwZS5Db3VudDtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIEdyaWRUeXBlIEN1cnJlbnRHcmlkVHlwZSA9IERlZmF1bHRHcmlkVHlwZTtcclxuICAgICAgICBwdWJsaWMgY29uc3QgR3JpZFR5cGUgRGVmYXVsdEdyaWRUeXBlID0gR3JpZFR5cGUuU3F1YXJlO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTEJ1dHRvbkVsZW1lbnQgTmV4dEdyaWRUeXBlQnV0dG9uLCBOZXh0U3F1YXJlVHlwZUJ1dHRvbjtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFpvb20gKGJvb2wgem9vbUluKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgeE11bHRpcGxpZXIgKz0gem9vbUluID8gMSA6IC0xO1xyXG4gICAgICAgICAgICBpZiAoeE11bHRpcGxpZXIgPD0gMSlcclxuICAgICAgICAgICAgICAgIHhNdWx0aXBsaWVyID0gMjtcclxuICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE5leHRTcXVhcmVUeXBlICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTcXVhcmVUeXBlUGxhY2luZyA9IChTcXVhcmVUeXBlKSgoKGludClTcXVhcmVUeXBlUGxhY2luZyArIDEpICUgKGludCkoU3F1YXJlVHlwZS5Db3VudCArIDEpKTtcclxuICAgICAgICAgICAgTmV4dFNxdWFyZVR5cGVCdXR0b24uSW5uZXJIVE1MID0gU3F1YXJlVHlwZVBsYWNpbmcgPT0gU3F1YXJlVHlwZS5Db3VudCA/IFwiV2FsbFwiIDogQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLlRvQ2FtZWxTdHJpbmc8U3F1YXJlVHlwZT4oU3F1YXJlVHlwZVBsYWNpbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE5leHRHcmlkVHlwZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDdXJyZW50R3JpZFR5cGUgPSAoR3JpZFR5cGUpKCgoaW50KUN1cnJlbnRHcmlkVHlwZSArIDEpICUgKGludClHcmlkVHlwZS5Db3VudCk7XHJcbiAgICAgICAgICAgIE5leHRHcmlkVHlwZUJ1dHRvbi5Jbm5lckhUTUwgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuVG9DYW1lbFN0cmluZzxHcmlkVHlwZT4oQ3VycmVudEdyaWRUeXBlKTtcclxuICAgICAgICAgICAgaWYgKEN1cnJlbnRHcmlkVHlwZSA9PSBHcmlkVHlwZS5UcmlhbmdsZSlcclxuICAgICAgICAgICAgICAgIHhNdWx0aXBsaWVyICo9IDI7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKEN1cnJlbnRHcmlkVHlwZSA9PSBHcmlkVHlwZS5TcXVhcmUpXHJcbiAgICAgICAgICAgICAgICB4TXVsdGlwbGllciAvPSAyO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKEN1cnJlbnRHcmlkVHlwZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBHcmlkVHlwZS5TcXVhcmU6XHJcbiAgICAgICAgICAgICAgICAgICAgR3JpZCA9IG5ldyBTcXVhcmVHcmlkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEdyaWRUeXBlLkhleDpcclxuICAgICAgICAgICAgICAgICAgICBHcmlkID0gbmV3IEhleEdyaWQoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgR3JpZFR5cGUuVHJpYW5nbGU6XHJcbiAgICAgICAgICAgICAgICAgICAgR3JpZCA9IG5ldyBUcmlhbmdsZUdyaWQoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBTZXR1cFNldHRpbmdzRGl2KCk7XHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgUmlnaHRIb3RiYXIgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFN0eWxlID0ge1xyXG4gICAgICAgICAgICAgICAgUG9zaXRpb24gPSBQb3NpdGlvbi5BYnNvbHV0ZSxcclxuICAgICAgICAgICAgICAgIFJpZ2h0ID0gXCIxMDBweFwiLFxyXG4gICAgICAgICAgICAgICAgVG9wID0gc3RyaW5nLkZvcm1hdChcInswfXB4XCIsV2luZG93LklubmVySGVpZ2h0IC0gNDApICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4taW5mb1wiLFxyXG4gICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT4gU2hvd01vZGFsKE1vZGFsVHlwZS5Ob3RhYmxlT2JqZWN0cylcclxuICAgICAgICAgICAgfSxcIk5vdGFibGUgT2JqZWN0c1wiKSk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBSZXNldCAoYm9vbCBtYWtlQmxhbmsgPSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghR2xvYmFsLkNvbmZpcm0oXCJBbnkgdW5zYXZlZCBjaGFuZ2VzIHdpbGwgYmUgbG9zdC4gQ29udGludWU/XCIpKSByZXR1cm47XHJcbiAgICAgICAgICAgIEdyaWQuQ2xlYXIoKTtcclxuR3JpZDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+IGdyaWQ7ICAgICAgICAgICAgaWYgKCFtYWtlQmxhbmsgJiYgKGdyaWQgPSBHcmlkIGFzIEdyaWQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PikgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgICAgIG9iamVjdCBzdGFydGVyUG9zaXRpb25zID0gR2xvYmFsLkxvY2FsU3RvcmFnZS5HZXRJdGVtKFwic3RhcnRlclBvc2l0aW9uc1wiKTtcclxuICAgICAgICAgICAgICAgIGlmIChzdGFydGVyUG9zaXRpb25zICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nIHMgPSAoc3RyaW5nKXN0YXJ0ZXJQb3NpdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdHJpbmcuSXNOdWxsT3JFbXB0eShzKSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBqc29uUmF3ID0gSlNPTi5QYXJzZShzKS5Ub0R5bmFtaWMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb25SYXcubGVuZ3RoID09IDAgfHwganNvblJhd1swXS5JdGVtMyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JlYWNoICh2YXIgcG9zIGluIChKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+W10+KHMpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmlkLlNxdWFyZXMuQWRkKHBvcywgU3F1YXJlVHlwZS5DZWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JlYWNoICh2YXIgc3F1YXJlSW5mbyBpbiAoSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFNxdWFyZVR5cGUgPltdPihzKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZC5TcXVhcmVzLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHNxdWFyZUluZm8uSXRlbTEsIHNxdWFyZUluZm8uSXRlbTIpLCBzcXVhcmVJbmZvLkl0ZW0zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBsYXlpbmcpXHJcbiAgICAgICAgICAgICAgICBJbnZlcnRJc1BsYXlpbmcoKTtcclxuICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxTcXVhcmVUeXBlID4+IEdldENvb3JkaW5hdGVzSW50ZXJhbCgpXHJcbiAgICAgICAge1xyXG5HcmlkPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4gZzsgICAgICAgICAgICBpZiAoKGcgPSBHcmlkIGFzIEdyaWQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PikgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBvZmZzZXRDb29yZHMgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KE5lZ0RpdihvZmZzZXRQb3MuSXRlbTEsIChpbnQpYWN0dWFsWE11bHRpcGxpZXIpLCBOZWdEaXYob2Zmc2V0UG9zLkl0ZW0yLCAoaW50KWFjdHVhbFlNdWx0aXBsaWVyKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Ub0xpc3Q8S2V5VmFsdWVQYWlyPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+LFNxdWFyZVR5cGU+PihnLlNxdWFyZXMpLkNvbnZlcnRBbGw8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPj4oKENvbnZlcnRlcjxLZXlWYWx1ZVBhaXI8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4sU3F1YXJlVHlwZT4sU3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPj4pKHMgPT4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBTcXVhcmVUeXBlPihzLktleS5JdGVtMSArIG9mZnNldENvb3Jkcy5JdGVtMSwgcy5LZXkuSXRlbTIgKyBvZmZzZXRDb29yZHMuSXRlbTIsIHMuVmFsdWUpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxTcXVhcmVUeXBlID4+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFNxdWFyZVR5cGUgPj4gR2V0Tm9ybWFsaXplZENvb3JkaW5hdGVzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFNxdWFyZVR5cGUgPj4gY29vcmRzID0gR2V0Q29vcmRpbmF0ZXNJbnRlcmFsKCk7XHJcbiAgICAgICAgICAgIGlmIChjb29yZHMuQ291bnQgPT0gMClcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb29yZHM7XHJcbiAgICAgICAgICAgIGNvb3JkcyA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuV2hlcmU8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPj4oY29vcmRzLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4sYm9vbD4pKGMgPT4gYy5JdGVtMT49IDAgJiYgYy5JdGVtMj49IDAgJiYgYy5JdGVtMTwgd2lkdGggJiYgYy5JdGVtMjwgaGVpZ2h0KSkuVG9MaXN0KCk7XHJcbiAgICAgICAgICAgIGludCBtaW5YID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5NaW48U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPj4oY29vcmRzLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4saW50PikoYyA9PiBjLkl0ZW0xKSksIG1pblkgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk1pbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+Pihjb29yZHMsKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPixpbnQ+KShjID0+IGMuSXRlbTIpKTtcclxuICAgICAgICAgICAgY29vcmRzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPixTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+Pihjb29yZHMsKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPixTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+PikoYyA9PiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFNxdWFyZVR5cGU+KGMuSXRlbTEgLSBtaW5YLCBjLkl0ZW0yIC0gbWluWSwgYy5JdGVtMykpKS5Ub0xpc3QoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvb3JkcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBHZXRDb29yZGluYXRlcygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdHJpbmcgY29kZUdlbmVyYXRlZCA9IHN0cmluZy5Gb3JtYXQoXCIobmV3IEhhc2hTZXQ8KGludCB4LCBpbnQgeSk+XFxyXFxue3tcXHJcXG4gICAgezB9XFxyXFxufX0sIFxcXCJVbnRpdGxlZCBPYmplY3RcXFwiLCB7MX0pXCIsc3RyaW5nLkpvaW4oXCIsXFxuICAgIFwiLCBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+LHN0cmluZz4oR2V0Tm9ybWFsaXplZENvb3JkaW5hdGVzKCksKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPixzdHJpbmc+KSh0ID0+IHN0cmluZy5Gb3JtYXQoXCIoezB9LCB7MX0pXCIsdC5JdGVtMSx0Lkl0ZW0yKSkpKSxKU09OLlN0cmluZ2lmeShzdHJpbmcuRm9ybWF0KFwiezB9ezF9IC8gezJ9XCIsKFN5c3RlbS5MaW5xLkVudW1lcmFibGUuQWxsPEFkamFjZW5jeVR5cGU+KGFkamFjZW5jeVJ1bGVzLChGdW5jPEFkamFjZW5jeVR5cGUsYm9vbD4pKGEgPT4gYSA9PSBBZGphY2VuY3lUeXBlLk9uZSkpID8gXCJcIiA6IChzdHJpbmcuQ29uY2F0PGludD4oU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8QWRqYWNlbmN5VHlwZSxpbnQ+KGFkamFjZW5jeVJ1bGVzLChGdW5jPEFkamFjZW5jeVR5cGUsaW50PikoayA9PiAoaW50KWspKSkpICsgXCIgLT4gXCIpLHN0cmluZy5Db25jYXQ8aW50PihTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxib29sLGludD4oZGVhZFJ1bGVzLChGdW5jPGJvb2wsaW50PikoayA9PiBrID8gMSA6IDApKSksc3RyaW5nLkNvbmNhdDxpbnQ+KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0PGJvb2wsaW50PihsaXZpbmdSdWxlcywoRnVuYzxib29sLGludD4pKGsgPT4gayA/IDEgOiAwKSkpKSkpO1xyXG4gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCBtb2RhbCwgbW9kYWxDb250ZW50ID1cclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICAgICAgbmV3IEhUTUxEaXZFbGVtZW50IHsgQ2xhc3NOYW1lID0gXCJtb2RhbC1jb250ZW50XCIgfVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnQgeyBDbGFzc05hbWUgPSBcIm1vZGFsLWRpYWxvZ1wiIH1cclxuLG1vZGFsID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnQgeyBDbGFzc05hbWUgPSBcIm1vZGFsXCIsIFN0eWxlID0geyBEaXNwbGF5ID0gXCJpbmhlcml0XCIgfSB9XHJcbixEb2N1bWVudC5Cb2R5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oXHJcbiAgICAgICAgICAgIG1vZGFsQ29udGVudCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MRGl2RWxlbWVudFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwibW9kYWwtaGVhZGVyXCJcclxuICAgICAgICAgICAgICAgIH1cclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4tY2xvc2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT4gbW9kYWwuUmVtb3ZlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbixuZXcgSFRNTFNwYW5FbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIElubmVySFRNTCA9IFwiJnRpbWVzO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFByZUVsZW1lbnQ+KFxyXG5cclxuICAgICAgICAgICAgICAgIGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBIVE1MUHJlRWxlbWVudCgpLChfbzEpPT57X28xLkNsYXNzTmFtZT0gXCJtb2RhbC1ib2R5XCI7X28xLlN0eWxlW1widXNlci1zZWxlY3RcIl09IFwidGV4dFwiO3JldHVybiBfbzE7fSksY29kZUdlbmVyYXRlZClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBTYXZlQXNTdGFydGVyICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBHbG9iYWwuTG9jYWxTdG9yYWdlLlNldEl0ZW0oXHJcbiAgICAgICAgICAgICAgICBcInN0YXJ0ZXJQb3NpdGlvbnNcIiwgSnNvbkNvbnZlcnQuU2VyaWFsaXplT2JqZWN0KEdldENvb3JkaW5hdGVzSW50ZXJhbCgpKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBTZXR0aW5nc1BvcHVwLCBOb3RhYmxlT2JqZWN0c1BvcHVwO1xyXG5wdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IENyZWF0ZVBvcHVwKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MRGl2RWxlbWVudHtTdHlsZSA9IHtGb250U2l6ZSA9IFwiMS41cmVtXCIsIEJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIiwgUG9zaXRpb24gPSBQb3NpdGlvbi5GaXhlZCwgVG9wID0gXCIwcHhcIiwgTGVmdCA9IFwiMjUlXCIsIFdpZHRoID0gXCI1MCVcIiwgSGVpZ2h0ID0gXCIxMDAlXCIsIERpc3BsYXkgPSBEaXNwbGF5Lk5vbmUsIE92ZXJmbG93ID0gT3ZlcmZsb3cuU2Nyb2xsfX07XHJcbn1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IFBvcHVwQ29udGFpbmVyID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IEhUTUxEaXZFbGVtZW50KCksKF9vMSk9PntfbzEuU3R5bGUuUG9zaXRpb249IFBvc2l0aW9uLkZpeGVkO19vMS5TdHlsZS5Ub3A9IFwiMFwiO19vMS5TdHlsZS5MZWZ0PSBcIjBcIjtfbzEuU3R5bGUuV2lkdGg9IFwiMTAwJVwiO19vMS5TdHlsZVtcIngtaW5kZXhcIl09IDk5OTk5OTtfbzEuU3R5bGUuSGVpZ2h0PSBcIjEwMCVcIjtfbzEuU3R5bGUuQmFja2dyb3VuZENvbG9yPSBcInJnYmEoMCwgMCwgMCwgMC41KVwiO19vMS5TdHlsZS5EaXNwbGF5PSBEaXNwbGF5Lk5vbmU7cmV0dXJuIF9vMTt9KVxyXG4sU2V0dGluZ3NQb3B1cCA9IENyZWF0ZVBvcHVwKCkpXHJcbixOb3RhYmxlT2JqZWN0c1BvcHVwID0gQ3JlYXRlUG9wdXAoKSk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTEJ1dHRvbkVsZW1lbnQgU2V0dGluZ3NCdXR0b247XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTEJ1dHRvbkVsZW1lbnQgUGxheUJ1dHRvbjtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEludmVydElzUGxheWluZyAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcGxheWluZyA9ICFwbGF5aW5nO1xyXG4gICAgICAgICAgICBQbGF5QnV0dG9uLklubmVySFRNTCA9IHBsYXlpbmcgPyBcIuKPuFwiIDogXCLilrZcIjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgcGxheWluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2xbXSBsaXZpbmdSdWxlcyA9IG5ldyBib29sW21heEFkamFjZW50Q2VsbHMgKyAxXSB7IGZhbHNlLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSB9O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbFtdIGRlYWRSdWxlcyAgICAgPSBuZXcgYm9vbFttYXhBZGphY2VudENlbGxzICsgMV0geyBmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlIH07XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBBZGphY2VuY3lUeXBlW10gYWRqYWNlbmN5UnVsZXMgPSBuZXcgQWRqYWNlbmN5VHlwZVttYXhBZGphY2VudENlbGxzXSB7IEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUgfTtcclxucHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBDcmVhdGVDYW52YXMoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxDYW52YXNFbGVtZW50e1dpZHRoID0gc2NyZWVuV2lkdGgsIEhlaWdodCA9IHNjcmVlbkhlaWdodH07XHJcbn1wdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IENyZWF0ZVRvcENhbnZhcygpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTENhbnZhc0VsZW1lbnR7V2lkdGggPSB3aWR0aCArIDIsIEhlaWdodCA9IGhlaWdodCArIDJ9O1xyXG59ICAgICAgICBwdWJsaWMgc3RhdGljIGRvdWJsZSBoeXBvKGRvdWJsZSB4LCBkb3VibGUgeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLlNxcnQoTWF0aC5Qb3coeCwgMikgKyBNYXRoLlBvdyh5LCAyKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ3JlYXRlQm90dG9tQ2FudmFzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IEJvdHRvbUNhbnZhcyA9IEdyaWQgaXMgSGV4R3JpZCA/XHJcbiAgICAgICAgICAgICAgICBuZXcgSFRNTENhbnZhc0VsZW1lbnRcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBXaWR0aCA9IERPTUNhbnZhcy5XaWR0aCArIDQgKiB4TXVsdGlwbGllcixcclxuICAgICAgICAgICAgICAgICAgICBIZWlnaHQgPSBET01DYW52YXMuSGVpZ2h0ICsgNCAqIHlNdWx0aXBsaWVyXHJcbiAgICAgICAgICAgICAgICB9IDpcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MQ2FudmFzRWxlbWVudFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFdpZHRoID0gc2NyZWVuV2lkdGggKyAyICogeE11bHRpcGxpZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgSGVpZ2h0ID0gc2NyZWVuSGVpZ2h0ICsgMiAqIHlNdWx0aXBsaWVyXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2YXIgQm90dG9tQ2FudmFzQ29udGV4dCA9IEJvdHRvbUNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5TdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5UcmFuc2xhdGUoMC41LCAwLjUpO1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVXaWR0aCA9IDE7XHJcbkhleEdyaWQgaDsgICAgICAgICAgICBpZiAoKGggPSBHcmlkIGFzIEhleEdyaWQpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuU3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGludCBhID0gLShpbnQpaHlwbyh3aWR0aCwgaGVpZ2h0KTsgYSA8IChpbnQpaHlwbyh3aWR0aCwgaGVpZ2h0KTsgYSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IGIgPSAtKGludCloeXBvKHdpZHRoLCBoZWlnaHQpOyBiIDwgKGludCloeXBvKHdpZHRoLCBoZWlnaHQpOyBiKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG5pbnQgeDtcbmludCB5O1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChoLkdldERyYXdQb3NpdGlvbihuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGEsIGIpKSwgb3V0IHgsIG91dCB5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5EcmF3SGV4YWdvbih4LCB5LCB4TXVsdGlwbGllciAqIDIgLyAzLCBzdHJva2U6IHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgIFRyaWFuZ2xlR3JpZCB0O1xyXG4gICAgaWYgKCh0ID0gR3JpZCBhcyBUcmlhbmdsZUdyaWQpICE9IG51bGwpXHJcbiAgICB7XHJcbiAgICAgICAgZm9yIChpbnQgYSA9IC0oaW50KWh5cG8od2lkdGgsIGhlaWdodCk7IGEgPCAoaW50KWh5cG8od2lkdGgsIGhlaWdodCk7IGErKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAoaW50IGIgPSAtKGludCloeXBvKHdpZHRoLCBoZWlnaHQpOyBiIDwgKGludCloeXBvKHdpZHRoLCBoZWlnaHQpOyBiKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvciAoVHJpYW5nbGVMb2NhdGlvbiB0bCA9IFRyaWFuZ2xlTG9jYXRpb24uVG9wTGVmdDsgdGwgPCBUcmlhbmdsZUxvY2F0aW9uLkNvdW50OyB0bCsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGludCB4O1xyXG4gICAgICAgICAgICAgICAgICAgIGludCB5O1xyXG4gICAgICAgICAgICAgICAgICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QodC5HZXREcmF3UG9zaXRpb24obmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBUcmlhbmdsZUxvY2F0aW9uPihhLCBiLCB0bCkpLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuRHJhd1RyaWFuZ2xlKHgsIHksIHhNdWx0aXBsaWVyICogMiAvIDMsIHRsLCBzdHJva2U6IHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgLy9IZXhHcmlkIGdyaWQgPSBuZXcgSGV4R3JpZCgpO1xyXG4gICAgLy9kb3VibGUgeE9mZnNldCA9IHdpZHRoIC8gMiAqIEFwcC54TXVsdGlwbGllciArIG9mZnNldFBvcy54XHJcbiAgICAvLyAgICAgLCB5T2Zmc2V0ID0gaGVpZ2h0ICogQXBwLnhNdWx0aXBsaWVyICsgb2Zmc2V0UG9zLnk7XHJcbiAgICAvL2ludCBtaW5XaWR0aCA9IC0yLCBtaW5IZWlnaHQgPSAtMjtcclxuICAgIC8vaW50IG1heFdpZHRoID0gKGludClNYXRoLkNlaWxpbmcoaHlwbyh3aWR0aCwgaGVpZ2h0KSksIG1heEhlaWdodCA9IChpbnQpTWF0aC5DZWlsaW5nKGh5cG8od2lkdGgsIGhlaWdodCkpO1xyXG4gICAgLy9mb3IgKGludCBfMzBsID0gbWluV2lkdGggLSAyOyBfMzBsIDw9IChtYXhXaWR0aCArIDIpOyBfMzBsKyspXHJcbiAgICAvL3tcclxuICAgIC8vICAgIHZhciBwb3MxID0gZ3JpZC5HZXREcmF3UG9zaXRpb24oKF8zMGwsIG1pbkhlaWdodCAtIDMpKTtcclxuICAgIC8vICAgIHZhciBwb3MyID0gZ3JpZC5HZXREcmF3UG9zaXRpb24oKF8zMGwsIG1heEhlaWdodCArIDMpKTtcclxuICAgIC8vICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTW92ZVRvKHBvczEueCArIHhPZmZzZXQsIHBvczEueSArIHlPZmZzZXQpO1xyXG4gICAgLy8gICAgQm90dG9tQ2FudmFzQ29udGV4dC5MaW5lVG8ocG9zMi54ICsgeE9mZnNldCwgcG9zMi55ICsgeU9mZnNldCk7XHJcbiAgICAvL31cclxuICAgIC8vZm9yIChpbnQgXzMwciA9IG1pbkhlaWdodCAtIDI7IF8zMHIgPD0gKG1heEhlaWdodCArIDIpOyBfMzByKyspXHJcbiAgICAvL3tcclxuICAgIC8vICAgIHZhciBwb3MxID0gZ3JpZC5HZXREcmF3UG9zaXRpb24oKG1pbldpZHRoIC0gMywgXzMwcikpO1xyXG4gICAgLy8gICAgdmFyIHBvczIgPSBncmlkLkdldERyYXdQb3NpdGlvbigobWF4V2lkdGggKyAzLCBfMzByKSk7XHJcbiAgICAvLyAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbyhwb3MxLnggKyB4T2Zmc2V0LCBwb3MxLnkgKyB5T2Zmc2V0KTtcclxuICAgIC8vICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKHBvczIueCArIHhPZmZzZXQsIHBvczIueSArIHlPZmZzZXQpO1xyXG4gICAgLy99XHJcbiAgICAvL2ZvciAoaW50IHkgPSBtaW5IZWlnaHQgLSAyOyB5IDw9IChtYXhIZWlnaHQgKyAyKTsgeSsrKVxyXG4gICAgLy97XHJcbiAgICAvLyAgICB2YXIgcG9zMSA9IGdyaWQuR2V0RHJhd1Bvc2l0aW9uKCgtd2lkdGggLyB4TXVsdGlwbGllciwgeSkpO1xyXG4gICAgLy8gICAgdmFyIHBvczIgPSBncmlkLkdldERyYXdQb3NpdGlvbigoeSwgLXdpZHRoIC8geE11bHRpcGxpZXIpKTtcclxuICAgIC8vICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTW92ZVRvKHBvczEueCArIHhPZmZzZXQsIHBvczEueSArIHlPZmZzZXQpO1xyXG4gICAgLy8gICAgQm90dG9tQ2FudmFzQ29udGV4dC5MaW5lVG8ocG9zMi54ICsgeE9mZnNldCwgcG9zMi55ICsgeU9mZnNldCk7XHJcbiAgICAvL31cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKEdyaWQgaXMgU3F1YXJlR3JpZClcclxuICAgIHtcclxuICAgICAgICBmb3IgKGludCB4ID0gMDsgeCA8PSAod2lkdGggKyAyKTsgeCsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5Nb3ZlVG8oeCAqIHhNdWx0aXBsaWVyLCAwKTtcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5MaW5lVG8oeCAqIHhNdWx0aXBsaWVyLCAoaGVpZ2h0ICsgMykgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGludCB5ID0gMDsgeSA8PSAoaGVpZ2h0ICsgMik7IHkrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTW92ZVRvKDAsIHkgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKCh3aWR0aCArIDMpICogeE11bHRpcGxpZXIsIHkgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59ICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPCAxMDsgbisrKVxyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5TdHJva2UoKTtcclxuICAgICAgICAgICAgcmV0dXJuIEJvdHRvbUNhbnZhcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgRE9NQ2FudmFzID0gQ3JlYXRlQ2FudmFzKCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgRE9NQ2FudmFzQ29udGV4dCA9IERPTUNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBHcmlkIEdyaWQgPSBEZWZhdWx0R3JpZFR5cGUgPT0gR3JpZFR5cGUuU3F1YXJlID8gbmV3IFNxdWFyZUdyaWQoKSA6XHJcbiAgICAgICAgICAgIERlZmF1bHRHcmlkVHlwZSA9PSBHcmlkVHlwZS5UcmlhbmdsZSA/IChHcmlkKShuZXcgVHJpYW5nbGVHcmlkKCkpIDpcclxuICAgICAgICAgICAgRGVmYXVsdEdyaWRUeXBlID09IEdyaWRUeXBlLkhleCA/IG5ldyBIZXhHcmlkKCkgOlxyXG4oKFN5c3RlbS5GdW5jPEhleEdyaWQ+KSgoKT0+e3Rocm93IG5ldyBOb3RJbXBsZW1lbnRlZEV4Y2VwdGlvbigpO30pKSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBvZmZzZXRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gTW91c2VQb3MgKHRoaXMgTW91c2VFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHJlY3QgPSBET01DYW52YXMuR2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKGUuQ2xpZW50WCAtIHJlY3QuTGVmdCksIChpbnQpKGUuQ2xpZW50WSAtIHJlY3QuVG9wKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBOZWdEaXYgKGludCBhLCBpbnQgYilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCByZXMgPSBhIC8gYjtcclxuICAgICAgICAgICAgcmV0dXJuIChhIDwgMCAmJiBhICE9IGIgKiByZXMpID8gcmVzIC0gMSA6IHJlcztcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgZG91YmxlIE5lZ0RpdkRvdWJsZShkb3VibGUgYSwgZG91YmxlIGIpXHJcbntcclxuICAgIHJldHVybiBhID49IDAgPyBhIC8gYiA6IChhIC0gYiArIDEpIC8gYjtcclxufVxyXG4gICAgICAgIHB1YmxpYyBjb25zdCBpbnQgbWF4QWRqYWNlbnRDZWxscyA9IDEyO1xyXG5wdWJsaWMgc3RhdGljIGludCBjdXJyZW50TWF4QWRqYWNlbnRDZWxsc1xyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gR3JpZCBpcyBIZXhHcmlkID8gNiA6IEdyaWQgaXMgU3F1YXJlR3JpZCA/IDggOiBHcmlkIGlzIFRyaWFuZ2xlR3JpZCA/IDEyIDogKChTeXN0ZW0uRnVuYzxpbnQ+KSgoKSA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKHN0cmluZy5Gb3JtYXQoXCJHcmlkIHR5cGUgbm90IGZvdW5kOiB7MH1cIixHcmlkLkdldFR5cGUoKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgKSkoKTtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHN0YXRpYyBMaXN0PEhUTUxTZWxlY3RFbGVtZW50PiBhZGphY2VuY3lSdWxlc0NlbGxzID0gbmV3IExpc3Q8SFRNTFNlbGVjdEVsZW1lbnQ+KCk7XHJcbiAgICAgICAgc3RhdGljIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SFRNTElucHV0RWxlbWVudCxIVE1MSW5wdXRFbGVtZW50Pj4gb3B0aW9uQ2VsbHMgPSBuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIVE1MSW5wdXRFbGVtZW50LEhUTUxJbnB1dEVsZW1lbnQ+PigpO1xyXG5cclxuICAgICAgICBzdGF0aWMgdm9pZCBBcHBseVByZXNldChib29sW10gbGl2aW5nUnVsZXMsIGJvb2xbXSBkZWFkUnVsZXMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8PSA4OyBuKyspXHJcbiAgICAgICAgICAgIHtcclxub3B0aW9uQ2VsbHNbbl0uSXRlbTEuU2V0Qm9vbFZhbHVlKGxpdmluZ1J1bGVzW25dKTtcclxub3B0aW9uQ2VsbHNbbl0uSXRlbTIuU2V0Qm9vbFZhbHVlKGRlYWRSdWxlc1tuXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBlbnVtIE1vZGFsVHlwZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU2V0dGluZ3MsXHJcbiAgICAgICAgICAgIE5vdGFibGVPYmplY3RzXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgU2hvd01vZGFsIChNb2RhbFR5cGUgbW9kYWxUeXBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUG9wdXBDb250YWluZXIuU3R5bGUuRGlzcGxheSA9IFwiXCI7XHJcbiAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IHRvU2hvdztcclxuICAgICAgICAgICAgc3dpdGNoIChtb2RhbFR5cGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgTW9kYWxUeXBlLlNldHRpbmdzOlxyXG4gICAgICAgICAgICAgICAgICAgIHRvU2hvdyA9IFNldHRpbmdzUG9wdXA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1vZGFsVHlwZS5Ob3RhYmxlT2JqZWN0czpcclxuICAgICAgICAgICAgICAgICAgICB0b1Nob3cgPSBOb3RhYmxlT2JqZWN0c1BvcHVwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnRFeGNlcHRpb24oKChpbnQpbW9kYWxUeXBlKS5Ub1N0cmluZygpLCBcIm1vZGFsVHlwZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3JlYWNoIChIVE1MRGl2RWxlbWVudCBkaXYgaW4gbmV3W10geyBTZXR0aW5nc1BvcHVwLCBOb3RhYmxlT2JqZWN0c1BvcHVwIH0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRpdi5TdHlsZS5EaXNwbGF5ID0gZGl2ID09IHRvU2hvdyA/IFwiXCIgOiBcIm5vbmVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEhpZGVNb2RhbCAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUG9wdXBDb250YWluZXIuU3R5bGUuRGlzcGxheSA9IERpc3BsYXkuTm9uZTtcclxuICAgICAgICAgICAgU2V0dGluZ3NQb3B1cC5TdHlsZS5EaXNwbGF5ID0gRGlzcGxheS5Ob25lO1xyXG4gICAgICAgICAgICBOb3RhYmxlT2JqZWN0c1BvcHVwLlN0eWxlLkRpc3BsYXkgPSBEaXNwbGF5Lk5vbmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IERyYXdTaGFwZSAoSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiBTcXVhcmVzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IHhNdWx0aXBsaWVyID0gQXBwLnhNdWx0aXBsaWVyICogMjtcclxuICAgICAgICAgICAgaW50IHlNdWx0aXBsaWVyID0gQXBwLnlNdWx0aXBsaWVyICogMjtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldHRpbmcgd2lkdGggYW5kIGhlaWdodCBvZiBzaGFwZVxyXG4gICAgICAgICAgICBpbnQgd2lkdGggPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk1heDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oU3F1YXJlcywoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixpbnQ+KShzID0+IHMuSXRlbTEpKSArIDE7XHJcbiAgICAgICAgICAgIGludCBoZWlnaHQgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk1heDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oU3F1YXJlcywoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixpbnQ+KShzID0+IHMuSXRlbTIpKSArIDE7XHJcbiAgICAgICAgICAgIC8vIERyYXdpbmcgb24gaW5uZXIgY2FudmFzXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGlubmVyQ2FudmFzID0gbmV3IEhUTUxDYW52YXNFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFdpZHRoID0gd2lkdGgsXHJcbiAgICAgICAgICAgICAgICBIZWlnaHQgPSBoZWlnaHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGNvbnRleHQgPSBpbm5lckNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgVWludDhDbGFtcGVkQXJyYXkgaW1hZ2VEYXRhQXJyYXkgPSBDcmVhdGVJbWFnZURhdGFBcnJheSh3aWR0aCwgaGVpZ2h0KTtcclxuZm9yZWFjaCAodmFyIF9kMSBpbiBTcXVhcmVzKVxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDEsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpbWFnZURhdGFBcnJheVsoeCArIHkgKiB3aWR0aCkgKiA0ICsgM10gPSAyNTU7XHJcbn1cbiAgICAgICAgICAgIEltYWdlRGF0YSBpbWFnZURhdGEgPSBuZXcgSW1hZ2VEYXRhKGltYWdlRGF0YUFycmF5LCAodWludCl3aWR0aCwgKHVpbnQpaGVpZ2h0KTtcclxuICAgICAgICAgICAgY29udGV4dC5QdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcclxuICAgICAgICAgICAgLy8gUmVzaXppbmcgdG8gdXBwZXIgY2FudmFzXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IG91dGVyQ2FudmFzID0gbmV3IEhUTUxDYW52YXNFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFdpZHRoID0gd2lkdGggKiB4TXVsdGlwbGllcixcclxuICAgICAgICAgICAgICAgIEhlaWdodCA9IGhlaWdodCAqIHlNdWx0aXBsaWVyXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBvdXRlckNvbnRleHQgPSBvdXRlckNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgb3V0ZXJDb250ZXh0LkltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBvdXRlckNvbnRleHQuRHJhd0ltYWdlKGlubmVyQ2FudmFzLCAwLCAwLCBvdXRlckNhbnZhcy5XaWR0aCwgb3V0ZXJDYW52YXMuSGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBvdXRlckNhbnZhcztcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgVWludDhDbGFtcGVkQXJyYXkgQ3JlYXRlSW1hZ2VEYXRhQXJyYXkoaW50IHdpZHRoLCBpbnQgaGVpZ2h0KVxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KHdpZHRoICogaGVpZ2h0ICogNCk7XHJcbn1wdWJsaWMgc3RhdGljIEhUTUxJbnB1dEVsZW1lbnQgQ3JlYXRlQ2hlY2tib3goKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxJbnB1dEVsZW1lbnR7VHlwZSA9IElucHV0VHlwZS5DaGVja2JveCwgU3R5bGUgPSB7V2lkdGggPSBcIjFyZW1cIiwgSGVpZ2h0ID0gXCIxZW1cIn19O1xyXG59cHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBDcmVhdGUwMVNlbGVjdG9yKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MU2VsZWN0RWxlbWVudCgpLkFkZDxIVE1MU2VsZWN0RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCJmYWxzZVwifSxcIjBcIiksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudHtWYWx1ZSA9IFwidHJ1ZVwifSxcIjFcIikpO1xyXG59cHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBDcmVhdGUwMTJTZWxlY3RvcigpXHJcbntcclxuICAgIHJldHVybiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxTZWxlY3RFbGVtZW50PihuZXcgSFRNTFNlbGVjdEVsZW1lbnQoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcIjBcIn0sXCIwXCIpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcIjFcIn0sXCIxXCIpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcIjJcIn0sXCIyXCIpKTtcclxufVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgYWRqYWNlbmN5UnVsZXNUYWJsZURpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCgpLCBydWxlc1RhYmxlRGl2ID0gbmV3IEhUTUxEaXZFbGVtZW50KCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBTZXR1cFNldHRpbmdzRGl2ICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBIVE1MVGFibGVFbGVtZW50IGFkamFjZW5jeVJ1bGVzVGFibGUgPSBuZXcgSFRNTFRhYmxlRWxlbWVudCB7IFN0eWxlID0geyBNYXJnaW5MZWZ0ID0gXCJhdXRvXCIsIE1hcmdpblJpZ2h0ID0gXCJhdXRvXCIgfSB9O1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoR3JpZCBpcyBUcmlhbmdsZUdyaWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPCAxMjsgbisrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nIG5hbWUgPSBuIDwgNiA/IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5Ub0NhbWVsU3RyaW5nPFRyaWFuZ2xlTG9jYXRpb24+KCgoVHJpYW5nbGVMb2NhdGlvbiluKSkgOiBzdHJpbmcuRm9ybWF0KFwiUG9zaXRpb24gezB9XCIsbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzQ2VsbHMuQWRkKEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MU2VsZWN0RWxlbWVudD4oQ3JlYXRlMDEyU2VsZWN0b3IoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlUm93RWxlbWVudD4obmV3IEhUTUxUYWJsZVJvd0VsZW1lbnQoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudD4obmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpLG5hbWUpKSxhZGphY2VuY3lSdWxlc1RhYmxlKSkpLlNldEFkamFjZW5jeVZhbHVlKGFkamFjZW5jeVJ1bGVzW25dKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGludCBuID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCB5ID0gMDsgeSA8IDM7IHkrKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEhUTUxUYWJsZVJvd0VsZW1lbnQgcm93ID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KG5ldyBIVE1MVGFibGVSb3dFbGVtZW50KCksYWRqYWNlbmN5UnVsZXNUYWJsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaW50IHggPSAwOyB4IDwgMzsgeCsrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoeCA9PSAxICYmIHkgPT0gMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cuQXBwZW5kQ2hpbGQobmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzQ2VsbHMuQWRkKEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MU2VsZWN0RWxlbWVudD4oQ3JlYXRlMDEyU2VsZWN0b3IoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCkscm93KSkuU2V0QWRqYWNlbmN5VmFsdWUoYWRqYWNlbmN5UnVsZXNbbl0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG4rKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhZGphY2VuY3lSdWxlc1RhYmxlRGl2LkNsZWFyKCk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzVGFibGVEaXYsYWRqYWNlbmN5UnVsZXNUYWJsZSk7XHJcblxyXG4gICAgICAgICAgICBIVE1MVGFibGVFbGVtZW50IHJ1bGVzVGFibGUgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUVsZW1lbnQ+KFxyXG5uZXcgSFRNTFRhYmxlRWxlbWVudCB7IFN0eWxlID0geyBNYXJnaW5MZWZ0ID0gXCJhdXRvXCIsIE1hcmdpblJpZ2h0ID0gXCJhdXRvXCIgfSB9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlUm93RWxlbWVudD4oXHJcbiAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlUm93RWxlbWVudCgpLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50KCksXCIjXCIpLFxyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudCgpLFwiTFwiKSxcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQoKSxcIkRcIilcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIHJ1bGVzVGFibGVEaXYuQ2xlYXIoKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgcnVsZXNUYWJsZURpdixydWxlc1RhYmxlKTtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbkNlbGxzLkNsZWFyKCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8PSBjdXJyZW50TWF4QWRqYWNlbnRDZWxsczsgbisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIVE1MVGFibGVSb3dFbGVtZW50IHJvdyA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVSb3dFbGVtZW50PihuZXcgSFRNTFRhYmxlUm93RWxlbWVudCgpLHJ1bGVzVGFibGUpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KCAgICAgICAgICAgICAgICByb3csQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSxuLlRvU3RyaW5nKCkpKTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbkNlbGxzLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8SFRNTElucHV0RWxlbWVudCwgSFRNTElucHV0RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxJbnB1dEVsZW1lbnQ+KENyZWF0ZUNoZWNrYm94KCksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSwgcm93KSkuU2V0Qm9vbFZhbHVlKGxpdmluZ1J1bGVzW25dKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxJbnB1dEVsZW1lbnQ+KENyZWF0ZUNoZWNrYm94KCksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSwgcm93KSkuU2V0Qm9vbFZhbHVlKGRlYWRSdWxlc1tuXSkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE1haW4gKClcclxuICAgICAgICB7XHJcblN5c3RlbS5BY3Rpb248TW91c2VFdmVudDxIVE1MQ2FudmFzRWxlbWVudD4+IFByb2Nlc3NNb3VzZUV2ZW50ID0gbnVsbDtcbiAgICAgICAgICAgIG9iamVjdCBydWxlc09iamVjdFN0ciA9IEdsb2JhbC5Mb2NhbFN0b3JhZ2UuR2V0SXRlbShcInJ1bGVzXCIpO1xyXG5zdHJpbmcgcjsgICAgICAgICAgICBpZiAoKHIgPSBydWxlc09iamVjdFN0ciBhcyBzdHJpbmcpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGR5bmFtaWMgcnVsZXNPYmogPSBKU09OLlBhcnNlKHIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChydWxlc09iamVjdFN0ciAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFNjcmlwdC5Xcml0ZShcInswfSBpbnN0YW5jZW9mIEFycmF5XCIsIHJ1bGVzT2JqLmxpdmluZ1J1bGVzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9vbFtdIGRlc2VyaWFsaXplZCA9IEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PGJvb2xbXT4oSlNPTi5TdHJpbmdpZnkocnVsZXNPYmoubGl2aW5nUnVsZXMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LkNvcHkoZGVzZXJpYWxpemVkLCBsaXZpbmdSdWxlcywgZGVzZXJpYWxpemVkLkxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFNjcmlwdC5Xcml0ZShcInswfSBpbnN0YW5jZW9mIEFycmF5XCIsIHJ1bGVzT2JqLmRlYWRSdWxlcykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2xbXSBkZXNlcmlhbGl6ZWQgPSBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxib29sW10+KEpTT04uU3RyaW5naWZ5KHJ1bGVzT2JqLmRlYWRSdWxlcykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkuQ29weShkZXNlcmlhbGl6ZWQsIGRlYWRSdWxlcywgZGVzZXJpYWxpemVkLkxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFNjcmlwdC5Xcml0ZShcInswfSBpbnN0YW5jZW9mIEFycmF5XCIsIHJ1bGVzT2JqLmFkamFjZW5jeVJ1bGVzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWRqYWNlbmN5VHlwZVtdIGRlc2VyaWFsaXplZCA9IEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PEFkamFjZW5jeVR5cGVbXT4oSlNPTi5TdHJpbmdpZnkocnVsZXNPYmouYWRqYWNlbmN5UnVsZXMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LkNvcHkoZGVzZXJpYWxpemVkLCBhZGphY2VuY3lSdWxlcywgZGVzZXJpYWxpemVkLkxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCB7IH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LlN0eWxlW1widXNlci1zZWxlY3RcIl0gPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgRG9jdW1lbnQuSGVhZC5BcHBlbmRDaGlsZChuZXcgSFRNTExpbmtFbGVtZW50IHsgUmVsID0gXCJzdHlsZXNoZWV0XCIsIEhyZWYgPSBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vYm9vdHN0cmFwQDUuMi4wL2Rpc3QvY3NzL2Jvb3RzdHJhcC5taW4uY3NzXCIgfSk7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuU3R5bGUuTWFyZ2luID0gXCIwcHhcIjtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChQb3B1cENvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQobmV3IEhUTUxTdHlsZUVsZW1lbnQgeyBJbm5lckhUTUwgPSBcInRkLCB0aCB7IGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrOyBwYWRkaW5nOiA1cHggfSBidXR0b24geyBtYXJnaW4tcmlnaHQ6IDVweCB9XCIgfSk7XHJcblxyXG4gICAgICAgICAgICBTZXR1cFNldHRpbmdzRGl2KCk7XHJcblxyXG4gICAgICAgICAgICBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZyAsYm9vbFtdICxib29sW10gPj4gcHJlc2V0c0xpc3QgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcgLGJvb2xbXSAsYm9vbFtdID4+KCksKF9vMSk9PntfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcsIGJvb2xbXSwgYm9vbFtdPihcIkNvbndheSdzIEdhbWUgb2YgTGlmZSBQcmVzZXRcIiwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCB0cnVlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9KSk7X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJJbW1vcnRhbCBDZWxscyBQcmVzZXRcIiwgbmV3IGJvb2xbOV17dHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZX0sIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0pKTtfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcsIGJvb2xbXSwgYm9vbFtdPihcIkFsbW9zdCBJbW1vcnRhbCBDZWxscyBQcmVzZXRcIiwgbmV3IGJvb2xbOV17dHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2V9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9KSk7X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJBbHRlcm5hdGUgQ29ud2F5J3MgR2FtZSBvZiBMaWZlIFByZXNldFwiLCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0sIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO3JldHVybiBfbzE7fSk7XHJcblxyXG4gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCBwcmVzZXRzRGl2ID0gbmV3IEhUTUxEaXZFbGVtZW50IHsgU3R5bGUgPSB7IFRleHRBbGlnbiA9IFRleHRBbGlnbi5DZW50ZXIgfSB9O1xyXG5mb3JlYWNoICh2YXIgX2QyIGluIHByZXNldHNMaXN0KVxyXG57XHJcbiAgICBzdHJpbmcgbmFtZTtcclxuICAgIGJvb2xbXSBsaXZpbmdSdWxlcztcclxuICAgIGJvb2xbXSBkZWFkUnVsZXM7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KF9kMiwgb3V0IG5hbWUsIG91dCBsaXZpbmdSdWxlcywgb3V0IGRlYWRSdWxlcyk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBwcmVzZXRzRGl2LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCgpLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEFuY2hvckVsZW1lbnQ+KG5ldyBIVE1MQW5jaG9yRWxlbWVudHtIcmVmID0gXCJqYXZhc2NyaXB0OnZvaWQoMClcIiwgU3R5bGUgPSB7Rm9udFNpemUgPSBcIjFyZW1cIn0sIE9uQ2xpY2sgPSBlID0+IEFwcGx5UHJlc2V0KGxpdmluZ1J1bGVzOiBsaXZpbmdSdWxlcywgZGVhZFJ1bGVzOiBkZWFkUnVsZXMpfSxuYW1lKSkpO1xyXG59XG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihcclxuXHJcbiAgICAgICAgICAgIFNldHRpbmdzUG9wdXAsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGV0YWlsc0VsZW1lbnQ+KFxyXG4gICAgICAgICAgICAgICAgbmV3IEhUTUxEZXRhaWxzRWxlbWVudCB7IE9wZW4gPSB0cnVlfSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxTdW1tYXJ5RWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFN1bW1hcnlFbGVtZW50KCksXCJBZGphY2VuY3kgUnVsZXNcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXNUYWJsZURpdlxyXG4gICAgICAgICAgICAgICAgKSxcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGV0YWlsc0VsZW1lbnQ+KFxyXG4gICAgICAgICAgICAgICAgbmV3IEhUTUxEZXRhaWxzRWxlbWVudCB7IE9wZW4gPSB0cnVlIH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MU3VtbWFyeUVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxTdW1tYXJ5RWxlbWVudCgpLFwiUnVsZXNcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgcnVsZXNUYWJsZURpdlxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBTZXR0aW5nc1BvcHVwLG5ldyBIVE1MQlJFbGVtZW50KCksIHByZXNldHNEaXYsIG5ldyBIVE1MQlJFbGVtZW50KCkpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBTZXR0aW5nc1BvcHVwLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLFxyXG4gICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT5cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8IGN1cnJlbnRNYXhBZGphY2VudENlbGxzOyBuKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlc1tuXSA9IGFkamFjZW5jeVJ1bGVzQ2VsbHNbbl0uQWRqYWNlbmN5VmFsdWUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPD0gY3VycmVudE1heEFkamFjZW50Q2VsbHM7IG4rKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpdmluZ1J1bGVzW25dID0gb3B0aW9uQ2VsbHNbbl0uSXRlbTEuQm9vbFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYWRSdWxlc1tuXSA9IG9wdGlvbkNlbGxzW25dLkl0ZW0yLkJvb2xWYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBHbG9iYWwuTG9jYWxTdG9yYWdlLlNldEl0ZW0oXCJydWxlc1wiLCBKc29uQ29udmVydC5TZXJpYWxpemVPYmplY3QobmV3XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXZpbmdSdWxlcyA9IGxpdmluZ1J1bGVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWFkUnVsZXMgPSBkZWFkUnVsZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzID0gYWRqYWNlbmN5UnVsZXNcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgSGlkZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXCJTYXZlIENoYW5nZXNcIikpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihcclxuICAgICAgICAgICAgTm90YWJsZU9iamVjdHNQb3B1cCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLWxpZ2h0XCIsXHJcbiAgICAgICAgICAgICAgICBTdHlsZSA9IHsgQ3NzRmxvYXQgPSBGbG9hdC5SaWdodCB9LFxyXG4gICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT4gSGlkZU1vZGFsKClcclxuICAgICAgICAgICAgfSxcIuKdjFwiKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIE5vdGFibGVPYmplY3RzUG9wdXAsbmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFN0eWxlID0geyBDbGVhciA9IENsZWFyLkJvdGggfVxyXG4gICAgICAgICAgICB9KTtcclxuZm9yZWFjaCAodmFyIF9kMyBpbiBOb3RhYmxlT2JqZWN0c0xpc3QuTm90YWJsZU9iamVjdHMpXHJcbntcclxuICAgIEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PiBvYmplY3REZXRhaWxzO1xyXG4gICAgc3RyaW5nIGRlc2NyaXB0aW9uO1xyXG4gICAgc3RyaW5nIHJ1bGVzO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDMsIG91dCBvYmplY3REZXRhaWxzLCBvdXQgZGVzY3JpcHRpb24sIG91dCBydWxlcyk7XHJcbiAgICBIVE1MRGl2RWxlbWVudCBvYmplY3RJbmZvID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnR7U3R5bGUgPSB7V2lkdGggPSBcIjMwcmVtXCJ9fSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudHtTdHlsZSA9IHtEaXNwbGF5ID0gRGlzcGxheS5GbGV4LCBBbGlnbkl0ZW1zID0gQWxpZ25JdGVtcy5DZW50ZXIsIEZsZXhEaXJlY3Rpb24gPSBGbGV4RGlyZWN0aW9uLkNvbHVtbn19LE5vdGFibGVPYmplY3RzUG9wdXApKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50e1N0eWxlID0ge0Rpc3BsYXkgPSBEaXNwbGF5LkZsZXgsIEFsaWduSXRlbXMgPSBBbGlnbkl0ZW1zLkNlbnRlciwgRmxleERpcmVjdGlvbiA9IEZsZXhEaXJlY3Rpb24uQ29sdW1ufX0sRHJhd1NoYXBlKG9iamVjdERldGFpbHMpKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCgpLGRlc2NyaXB0aW9uKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLHJ1bGVzKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sbmV3IEhUTUxCUkVsZW1lbnQoKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLG5ldyBIVE1MQlJFbGVtZW50KCkpO1xyXG59XG5cclxuICAgICAgICAgICAgSFRNTERpdkVsZW1lbnQgYmFja2dyb3VuZERpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCB7IFN0eWxlID0geyBQb3NpdGlvbiA9IFBvc2l0aW9uLlJlbGF0aXZlLCBNaW5XaWR0aCA9IFwiMFwiLCBNaW5IZWlnaHQgPSBcIjBcIiB9fTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLk92ZXJmbG93ID0gT3ZlcmZsb3cuSGlkZGVuO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuWkluZGV4ID0gXCItMVwiO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuUG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5MZWZ0ID0gXCIwcHhcIjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLlRvcCA9IFwiMHB4XCI7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIGJhY2tncm91bmREaXYsRE9NQ2FudmFzKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgYmFja2dyb3VuZERpdixIb3RiYXIpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBiYWNrZ3JvdW5kRGl2LFJpZ2h0SG90YmFyKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChiYWNrZ3JvdW5kRGl2KTtcclxuXHJcbiAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhZ2dpbmdQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IG9yaWdpbmFsUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgYm9vbCBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5Pbk1vdXNlRG93biA9IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSB0cnVlO1xyXG5pbnQgeDtcbmludCB5O1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChlLk1vdXNlUG9zKCksIG91dCB4LCBvdXQgeSk7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZ1BvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCAtIG9mZnNldFBvcy5JdGVtMSwgeSAtIG9mZnNldFBvcy5JdGVtMik7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFBvcyA9IG9mZnNldFBvcztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLk9uTW91c2VVcCA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMS0gb3JpZ2luYWxQb3MuSXRlbTEpID4geE11bHRpcGxpZXIgfHwgTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0yLSBvcmlnaW5hbFBvcy5JdGVtMikgPiB5TXVsdGlwbGllcilcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmdQb3MgPSBvZmZzZXRQb3M7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5Pbk1vdXNlTW92ZSA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKChlLkJ1dHRvbnMgJiAxKSA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBpZiAoZHJhZ2dpbmdQb3MgPT0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKSkgZHJhZ2dpbmdQb3MgPSBlLk1vdXNlUG9zKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbW91c2VQb3MgPSBlLk1vdXNlUG9zKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0xLSBvcmlnaW5hbFBvcy5JdGVtMSkgPiB4TXVsdGlwbGllciB8fCBNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTEtIG9yaWdpbmFsUG9zLkl0ZW0xKSA+IHlNdWx0aXBsaWVyKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KG1vdXNlUG9zLkl0ZW0xIC0gZHJhZ2dpbmdQb3MuSXRlbTEsIG1vdXNlUG9zLkl0ZW0yIC0gZHJhZ2dpbmdQb3MuSXRlbTIpO1xyXG4gICAgICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgICAgICB9O1xyXG5Qcm9jZXNzTW91c2VFdmVudCA9IChlKSA9PlxyXG57XHJcbiAgICAvL2lmICgoQGV2ZW50LkJ1dHRvbnMgJiAxKSA9PSAwKSByZXR1cm47XHJcbiAgICB2YXIgbW91c2VQb3MgPSBlLk1vdXNlUG9zKCk7XHJcbiAgICBHcmlkLkhhbmRsZUNsaWNrKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4obW91c2VQb3MuSXRlbTEgLSBvZmZzZXRQb3MuSXRlbTEsIG1vdXNlUG9zLkl0ZW0yIC0gb2Zmc2V0UG9zLkl0ZW0yKSwgU3F1YXJlVHlwZVBsYWNpbmcpO1xyXG4gICAgRHJhdygpO1xyXG59XHJcblxyXG47XG4gICAgICAgICAgICBET01DYW52YXMuT25DbGljayA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoYW5naW5nSW50ZW50KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFByb2Nlc3NNb3VzZUV2ZW50KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBHbG9iYWwuU2V0SW50ZXJ2YWwoKEFjdGlvbilOZXh0RnJhbWUsIDEwMCk7XHJcblxyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgdXBkYXRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIEhhc0RpdmlkZXJzICh0aGlzIERpY3Rpb25hcnk8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiwgRGl2aWRlcnNJbmZvPiBkaXZpZGVycywgaW50IHgsIGludCB5LCBpbnQgTClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIERpdmlkZXJzSW5mbyB0b0NoZWNrO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKEwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICB4LS07XHJcbiAgICAgICAgICAgICAgICAgICAgeS0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgeS0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uQm90dG9tO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHktLTtcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgIHgtLTtcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLlJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDY6XHJcbiAgICAgICAgICAgICAgICAgICAgeC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b207XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDg6XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b21SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG5EaXZpZGVyc0luZm8gZGl2aWRlcnNJbmZvO1xuICAgICAgICAgICAgcmV0dXJuIGRpdmlkZXJzLlRyeUdldFZhbHVlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSksIG91dCBkaXZpZGVyc0luZm8pICYmIChkaXZpZGVyc0luZm8gJiB0b0NoZWNrKSAhPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLEdyaWRUeXBlICxIVE1MQ2FudmFzRWxlbWVudCA+IExhc3RCb3R0b21DYW52YXMgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBHcmlkVHlwZSwgSFRNTENhbnZhc0VsZW1lbnQ+KDAsIEdyaWRUeXBlLkNvdW50LCBudWxsKTtcclxucHVibGljIHN0YXRpYyBieXRlIEdldFNxdWFyZVR5cGVBbHBoYShTcXVhcmVUeXBlIHNxdWFyZVR5cGUpXHJcbntcclxuICAgIHJldHVybiAoYnl0ZSkoc3F1YXJlVHlwZSA9PSBTcXVhcmVUeXBlLkNlbGwgPyAyNTUgOiBzcXVhcmVUeXBlID09IFNxdWFyZVR5cGUuQnJpY2sgPyAxNzAgOiBzcXVhcmVUeXBlID09IFNxdWFyZVR5cGUuSW1tb3J0YWxDZWxsID8gODUgOiAoKFN5c3RlbS5GdW5jPGludD4pKCgpID0+XHJcbiAgICB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlVua25vd24gc3F1YXJlIHR5cGVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgKSkoKSk7XHJcbn1cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBEcmF3KClcclxuICAgICAgICB7XHJcblN5c3RlbS5BY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+PyA+IERyYXdNYXJrZXIgPSBudWxsO1xuU3lzdGVtLkFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUsIGRvdWJsZT4/ICwgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+PyA+IERyYXdMaW5lID0gbnVsbDtcblN5c3RlbS5GdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiwgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+PyA+IEdldEZpbmFsRHJhd1BvcyA9IG51bGw7XG5TeXN0ZW0uRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4sIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj8gPiBHZXRET01EcmF3UG9zID0gbnVsbDtcblN5c3RlbS5GdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiwgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PyA+IEdldERyYXdQb3MgPSBudWxsO1xuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgVG9wQ2FudmFzID0gQ3JlYXRlVG9wQ2FudmFzKCk7XHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IEJvdHRvbUNhbnZhcyA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChMYXN0Qm90dG9tQ2FudmFzLkl0ZW0xPT0geE11bHRpcGxpZXIgJiYgTGFzdEJvdHRvbUNhbnZhcy5JdGVtMj09IEN1cnJlbnRHcmlkVHlwZSlcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhcyA9IExhc3RCb3R0b21DYW52YXMuSXRlbTM7XHJcbiAgICAgICAgICAgIGlmIChCb3R0b21DYW52YXMgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzID0gQ3JlYXRlQm90dG9tQ2FudmFzKCk7XHJcbiAgICAgICAgICAgICAgICBMYXN0Qm90dG9tQ2FudmFzID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgR3JpZFR5cGUsIEhUTUxDYW52YXNFbGVtZW50Pih4TXVsdGlwbGllciwgQ3VycmVudEdyaWRUeXBlLCBCb3R0b21DYW52YXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBUb3BDYW52YXNDb250ZXh0ID0gVG9wQ2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkNsZWFyUmVjdCgwLCAwLCBET01DYW52YXMuV2lkdGgsIERPTUNhbnZhcy5IZWlnaHQpO1xyXG5pbnQgb2Zmc2V0WDtcbmludCBvZmZzZXRZO1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChvZmZzZXRQb3MsIG91dCBvZmZzZXRYLCBvdXQgb2Zmc2V0WSk7XHJcbkdldERyYXdQb3MgPSAocG9zKSA9PlxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChwb3MsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpbnQgZHJhd1ggPSB4ICsgKG9mZnNldFggLyB4TXVsdGlwbGllcikgKyAxLCBkcmF3WSA9IHkgKyAob2Zmc2V0WSAvIHlNdWx0aXBsaWVyKSArIDE7XHJcbiAgICBpZiAoZHJhd1ggPCAwIHx8IGRyYXdYID49IHdpZHRoICsgMiB8fCBkcmF3WSA8IDAgfHwgZHJhd1kgPj0gaGVpZ2h0ICsgMilcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGRyYXdYLCBkcmF3WSk7XHJcbn1cclxuXHJcbjtcbkdldERPTURyYXdQb3MgPSAocG9zKSA9PlxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChwb3MsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpbnQgZHJhd1ggPSB4ICsgb2Zmc2V0WCwgZHJhd1kgPSB5ICsgb2Zmc2V0WTtcclxuICAgIGlmIChkcmF3WCA8IDAgfHwgZHJhd1ggPj0gc2NyZWVuV2lkdGggfHwgZHJhd1kgPCAwIHx8IGRyYXdZID49IHNjcmVlbkhlaWdodClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGRyYXdYLCBkcmF3WSk7XHJcbn1cclxuXHJcbjtcblNxdWFyZUdyaWQgc3F1YXJlR3JpZDsgICAgICAgICAgICBpZiAoKHNxdWFyZUdyaWQgPSBHcmlkIGFzIFNxdWFyZUdyaWQpICE9IG51bGwpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRVaW50OENsYW1wZWRBcnJheSBpbWFnZURhdGFBcnJheSA9IENyZWF0ZUltYWdlRGF0YUFycmF5KHdpZHRoICsgMiwgaGVpZ2h0ICsgMik7XHJcbmZvcmVhY2ggKHZhciBfZDQgaW4gc3F1YXJlR3JpZC5TcXVhcmVzKVxyXG57XHJcbiAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4gcG9zO1xyXG4gICAgU3F1YXJlVHlwZSBzcXVhcmVUeXBlO1xyXG4gICAgX2Q0LkRlY29uc3RydWN0KG91dCBwb3MsIG91dCBzcXVhcmVUeXBlKTtcclxuICAgIHZhciBkcmF3UG9zID0gR2V0RHJhd1Bvcyhwb3MpO1xyXG4gICAgaWYgKGRyYXdQb3MgPT0gbnVsbClcclxuICAgICAgICBjb250aW51ZTtcclxuICAgIGludCBkcmF3WDtcclxuICAgIGludCBkcmF3WTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoZHJhd1Bvcy5WYWx1ZSwgb3V0IGRyYXdYLCBvdXQgZHJhd1kpO1xyXG4gICAgaW50IGlkeCA9IGRyYXdYICsgZHJhd1kgKiAod2lkdGggKyAyKTtcclxuICAgIGltYWdlRGF0YUFycmF5W2lkeCAqIDQgKyAzXSA9IEdldFNxdWFyZVR5cGVBbHBoYShzcXVhcmVUeXBlKTtcclxufVxuXHRcdFx0XHRJbWFnZURhdGEgaW1hZ2VEYXRhID0gbmV3IEltYWdlRGF0YShpbWFnZURhdGFBcnJheSwgKHVpbnQpKHdpZHRoICsgMiksICh1aW50KShoZWlnaHQgKyAyKSk7XHJcblx0XHRcdFx0VG9wQ2FudmFzQ29udGV4dC5QdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcclxuICAgICAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0ltYWdlKEJvdHRvbUNhbnZhcywgKG9mZnNldFggJSB4TXVsdGlwbGllcikgLSB4TXVsdGlwbGllciwgKG9mZnNldFkgJSB5TXVsdGlwbGllcikgLSB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgICAgIH1cclxuXHRcdFx0ZWxzZSB7XHJcbiAgICBIZXhHcmlkIGg7XHJcbiAgICBpZiAoKGggPSBHcmlkIGFzIEhleEdyaWQpICE9IG51bGwpXHJcbiAgICB7XHJcbiAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5EcmF3SW1hZ2UoQm90dG9tQ2FudmFzLCAob2Zmc2V0WCAlIChIZXhHcmlkLmNvczYwICogMiAqIHhNdWx0aXBsaWVyKSkgLSBIZXhHcmlkLmNvczYwICogMiAqIHhNdWx0aXBsaWVyLCAob2Zmc2V0WSAlIChIZXhHcmlkLnNpbjYwICogMiAqIHlNdWx0aXBsaWVyKSkgLSBIZXhHcmlkLnNpbjYwICogMiAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICBHcmlkLkRyYXdTcXVhcmVzKChBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+LCBTcXVhcmVUeXBlPikoKFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiBkLCBTcXVhcmVUeXBlIHNxdWFyZVR5cGUpID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4/IGRyYXdQb3MgPSBHZXRET01EcmF3UG9zKGQpO1xyXG4gICAgICAgICAgICBpZiAoIWRyYXdQb3MuSGFzVmFsdWUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRmlsbFN0eWxlID0gc3RyaW5nLkZvcm1hdChcInJnYmEoMCwgMCwgMCwgezB9KVwiLCBHZXRTcXVhcmVUeXBlQWxwaGEoc3F1YXJlVHlwZSkgLyAyNTUuMCk7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0hleGFnb24oKGludClkcmF3UG9zLlZhbHVlLkl0ZW0xLCAoaW50KWRyYXdQb3MuVmFsdWUuSXRlbTIsIHhNdWx0aXBsaWVyICogMiAvIDMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgICAgVHJpYW5nbGVHcmlkIHRyaWFuZ2xlR3JpZDtcclxuICAgICAgICBpZiAoKHRyaWFuZ2xlR3JpZCA9IEdyaWQgYXMgVHJpYW5nbGVHcmlkKSAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5EcmF3SW1hZ2UoQm90dG9tQ2FudmFzLCAob2Zmc2V0WCAlIChIZXhHcmlkLmNvczYwICogMiAqIHhNdWx0aXBsaWVyKSkgLSBIZXhHcmlkLmNvczYwICogMiAqIHhNdWx0aXBsaWVyLCAob2Zmc2V0WSAlIChIZXhHcmlkLnNpbjYwICogMiAqIHlNdWx0aXBsaWVyKSkgLSBIZXhHcmlkLnNpbjYwICogMiAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgdHJpYW5nbGVHcmlkLkRyYXdTcXVhcmVzKChBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+LCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4sIFNxdWFyZVR5cGU+KSgoU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+IGQsIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBUcmlhbmdsZUxvY2F0aW9uPiBjb29yZHMsIFNxdWFyZVR5cGUgc3F1YXJlVHlwZSkgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PyBkcmF3UG9zID0gR2V0RE9NRHJhd1BvcyhkKTtcclxuICAgICAgICAgICAgICAgIGlmICghZHJhd1Bvcy5IYXNWYWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkZpbGxTdHlsZSA9IHN0cmluZy5Gb3JtYXQoXCJyZ2JhKDAsIDAsIDAsIHswfSlcIiwgR2V0U3F1YXJlVHlwZUFscGhhKHNxdWFyZVR5cGUpIC8gMjU1LjApO1xyXG4gICAgICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5EcmF3VHJpYW5nbGUoZHJhd1Bvcy5WYWx1ZS5JdGVtMSwgZHJhd1Bvcy5WYWx1ZS5JdGVtMiwgeE11bHRpcGxpZXIgLyAyLCBjb29yZHMuSXRlbTMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdJbWFnZShUb3BDYW52YXMsIChvZmZzZXRYICUgeE11bHRpcGxpZXIpIC0geE11bHRpcGxpZXIsIChvZmZzZXRZICUgeU11bHRpcGxpZXIpIC0geU11bHRpcGxpZXIsICh3aWR0aCArIDIpICogeE11bHRpcGxpZXIsIChoZWlnaHQgKyAyKSAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG5HZXRGaW5hbERyYXdQb3MgPSAocG9zKSA9PlxyXG57XHJcbiAgICB2YXIgcCA9IEdldERyYXdQb3MocG9zKTtcclxuICAgIGlmIChwID09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBkb3VibGUgZHJhd1g7XHJcbiAgICBkb3VibGUgZHJhd1k7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4ocC5WYWx1ZS5JdGVtMSwgcC5WYWx1ZS5JdGVtMiksIG91dCBkcmF3WCwgb3V0IGRyYXdZKTtcclxuICAgIGRyYXdYICo9ICh3aWR0aCArIDIpICogeE11bHRpcGxpZXIgLyBUb3BDYW52YXMuV2lkdGg7XHJcbiAgICBkcmF3WSAqPSAoaGVpZ2h0ICsgMikgKiB5TXVsdGlwbGllciAvIFRvcENhbnZhcy5IZWlnaHQ7XHJcbiAgICBkcmF3WCArPSAob2Zmc2V0WCAlIHhNdWx0aXBsaWVyKSAtIHhNdWx0aXBsaWVyO1xyXG4gICAgZHJhd1kgKz0gKG9mZnNldFkgJSB5TXVsdGlwbGllcikgLSB5TXVsdGlwbGllcjtcclxuICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+KGRyYXdYLCBkcmF3WSk7XHJcbn1cclxuXHJcbjtcbkRyYXdMaW5lID0gKHN0YXJ0LCBlbmQpID0+XHJcbntcclxuICAgIGlmICghc3RhcnQuSGFzVmFsdWUgfHwgIWVuZC5IYXNWYWx1ZSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICB2YXIgc3RhcnRQb3MgPSBzdGFydC5WYWx1ZTtcclxuICAgIHZhciBlbmRQb3MgPSBlbmQuVmFsdWU7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkJlZ2luUGF0aCgpO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5Nb3ZlVG8oc3RhcnRQb3MuSXRlbTEsIHN0YXJ0UG9zLkl0ZW0yKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuTGluZVRvKGVuZFBvcy5JdGVtMSwgZW5kUG9zLkl0ZW0yKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuTGluZVdpZHRoID0gMjtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuU3Ryb2tlU3R5bGUgPSBcInJlZFwiOyAvLyBcInJnYigxNzAsIDE3MCwgMTcwKVwiO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5TdHJva2UoKTtcclxufVxyXG5cclxuO1xuRHJhd01hcmtlciA9IChwb3NpdGlvbikgPT5cclxue1xyXG4gICAgaWYgKCFwb3NpdGlvbi5IYXNWYWx1ZSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICBkb3VibGUgZHJhd1g7XHJcbiAgICBkb3VibGUgZHJhd1k7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KHBvc2l0aW9uLlZhbHVlLCBvdXQgZHJhd1gsIG91dCBkcmF3WSk7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkJlZ2luUGF0aCgpO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5BcmMoZHJhd1gsIGRyYXdZLCB4TXVsdGlwbGllciAvIDgsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuRmlsbFN0eWxlID0gXCJyZWRcIjsgLy9cInJnYigxNzAsIDE3MCwgMTcwKVwiO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5GaWxsKCk7XHJcbn1cclxuXHJcbjtcblNxdWFyZUdyaWQgczsgICAgICAgICAgICBpZiAoKHMgPSBHcmlkIGFzIFNxdWFyZUdyaWQpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuZm9yZWFjaCAodmFyIF9kNSBpbiBzLkRpdmlkZXJzKVxyXG57XHJcbiAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4gcG9zO1xyXG4gICAgRGl2aWRlcnNJbmZvIGRpdmlkZXJzO1xyXG4gICAgX2Q1LkRlY29uc3RydWN0KG91dCBwb3MsIG91dCBkaXZpZGVycyk7XHJcbiAgICBmb3JlYWNoICh2YXIgZGl2aWRlciBpbiBuZXdbXXtEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQsIERpdmlkZXJzSW5mby5SaWdodCwgRGl2aWRlcnNJbmZvLkJvdHRvbX0pXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKCFkaXZpZGVycy5IYXNGbGFnKGRpdmlkZXIpKVxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICBzd2l0Y2ggKGRpdmlkZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIERpdmlkZXJzSW5mby5SaWdodDpcclxuICAgICAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID5zdGFydFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCkocG9zLkl0ZW0xICsgMSksIChpbnQpcG9zLkl0ZW0yKTtcclxuICAgICAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID5lbmRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKHBvcy5JdGVtMSArIDEpLCAoaW50KShwb3MuSXRlbTIgKyAxKSk7XHJcbiAgICAgICAgICAgICAgICBEcmF3TGluZShHZXRGaW5hbERyYXdQb3Moc3RhcnRQb3MpLCBHZXRGaW5hbERyYXdQb3MoZW5kUG9zKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBEaXZpZGVyc0luZm8uQm90dG9tOlxyXG4gICAgICAgICAgICAgICAgRHJhd0xpbmUoR2V0RmluYWxEcmF3UG9zKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCkocG9zLkl0ZW0xKSwgKGludCkocG9zLkl0ZW0yICsgMSkpKSwgR2V0RmluYWxEcmF3UG9zKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCkocG9zLkl0ZW0xICsgMSksIChpbnQpKHBvcy5JdGVtMiArIDEpKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgRHJhd01hcmtlcihHZXRGaW5hbERyYXdQb3MobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KShwb3MuSXRlbTEgKyAxKSwgKGludCkocG9zLkl0ZW0yICsgMSkpKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBmcmFtZU51bSA9IDA7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBOZXh0RnJhbWUgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghcGxheWluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgYm9vbCBza2lwRnJhbWVzID0gR3JpZC5TcXVhcmVDb3VudCA+PSAyNTA7XHJcbiAgICAgICAgICAgIGludCB1cGRhdGVzUGVyRHJhdyA9IDE7Ly8gc2tpcEZyYW1lcyA/IDIgOiAxO1xyXG4gICAgICAgICAgICBmcmFtZU51bSsrO1xyXG4gICAgICAgICAgICBpZiAoc2tpcEZyYW1lcyAmJiAoZnJhbWVOdW0gJSB1cGRhdGVzUGVyRHJhdykgIT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPCB1cGRhdGVzUGVyRHJhdzsgbisrKVxyXG4gICAgICAgICAgICAgICAgR3JpZC5VcGRhdGUoKTtcclxuICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIERyYXdIZXhhZ29uICh0aGlzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBjb250ZXh0LCBpbnQgeCwgaW50IHksIGludCByYWRpdXMsIGJvb2wgc3Ryb2tlID0gZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb250ZXh0LkJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjb250ZXh0Lk1vdmVUbyh4ICsgcmFkaXVzLCB5KTtcclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDE7IG4gPD0gNjsgbisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkb3VibGUgYW5nbGUgPSBuICogTWF0aC5QSSAvIDM7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LkxpbmVUbyh4ICsgcmFkaXVzICogTWF0aC5Db3MoYW5nbGUpLCB5ICsgcmFkaXVzICogTWF0aC5TaW4oYW5nbGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc3Ryb2tlKVxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5TdHJva2UoKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5GaWxsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgRHJhd1RyaWFuZ2xlKHRoaXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGNvbnRleHQsIGludCBoZXhYLCBpbnQgaGV4WSwgaW50IGhleFJhZGl1cywgVHJpYW5nbGVMb2NhdGlvbiBsb2MsIGJvb2wgc3Ryb2tlID0gZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb250ZXh0LkJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjb250ZXh0Lk1vdmVUbyhoZXhYLCBoZXhZKTtcclxuICAgICAgICAgICAgaW50IGFuZ2xlSW50ID0gMDtcclxuICAgICAgICAgICAgc3dpdGNoIChsb2MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Ub3BMZWZ0OlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlSW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Ub3A6XHJcbiAgICAgICAgICAgICAgICAgICAgYW5nbGVJbnQgPSA2MDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Ub3BSaWdodDpcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZUludCA9IDEyMDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21SaWdodDpcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZUludCA9IDE4MDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b206XHJcbiAgICAgICAgICAgICAgICAgICAgYW5nbGVJbnQgPSAyNDA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tTGVmdDpcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZUludCA9IDMwMDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkb3VibGUgYW5nbGUgPSBhbmdsZUludCAqIE1hdGguUEkgLyAxODA7XHJcbiAgICAgICAgICAgIGNvbnRleHQuTGluZVRvKGhleFggKyBoZXhSYWRpdXMgKiBNYXRoLkNvcyhhbmdsZSksIGhleFkgKyBoZXhSYWRpdXMgKiBNYXRoLlNpbihhbmdsZSkpO1xyXG4gICAgICAgICAgICBhbmdsZSArPSBNYXRoLlBJIC8gMztcclxuICAgICAgICAgICAgY29udGV4dC5MaW5lVG8oaGV4WCArIGhleFJhZGl1cyAqIE1hdGguQ29zKGFuZ2xlKSwgaGV4WSArIGhleFJhZGl1cyAqIE1hdGguU2luKGFuZ2xlKSk7XHJcbiAgICAgICAgICAgIGlmIChzdHJva2UpXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LlN0cm9rZSgpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LkZpbGwoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRleHQuUmVndWxhckV4cHJlc3Npb25zO1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBFeHRlbnNpb25zXHJcbiAgICB7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKChlLCBjKSA9PiBjLmFwcGVuZENoaWxkKGUpKSh7ZWxlbWVudH0sIHtjb250YWluaW5nRWxlbX0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgQWRkVG88VD4odGhpcyBUIGVsZW1lbnQsIE5vZGUgY29udGFpbmluZ0VsZW0pIHdoZXJlIFQgOiBOb2RlO1xyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBUIEFkZFRvQm9keTxUPih0aGlzIFQgbikgd2hlcmUgVCA6IE5vZGUgPT4gQXBwLnJvb3QuQXBwZW5kQ2hpbGQ8VD4obik7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwie25vZGV9LmFwcGVuZENoaWxkKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBBcHBlbmRDaGlsZDxUPih0aGlzIE5vZGUgbm9kZSwgVCBlbGVtZW50KSB3aGVyZSBUIDogTm9kZTtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIEhpZGU8VD4odGhpcyBUIGVsZW1lbnQpIHdoZXJlIFQgOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zdHlsZS5kaXNwbGF5ID0gJycsIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgU2hvdzxUPih0aGlzIFQgZWxlbWVudCkgd2hlcmUgVCA6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihsaSA9PiAobGkuYXBwZW5kQ2hpbGQoe2VsZW1lbnR9KSwgbGkpKShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MTElFbGVtZW50IFdyYXBMaSh0aGlzIE5vZGUgZWxlbWVudCk7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGRpdiA9PiAoZGl2LmFwcGVuZENoaWxkKHtlbGVtZW50fSksIGRpdikpKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MRGl2RWxlbWVudCBXcmFwRGl2KHRoaXMgTm9kZSBlbGVtZW50KTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFQgQWRkPFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgc3RyaW5nPltdIG5vZGVzKSB3aGVyZSBUIDogTm9kZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoVW5pb248Tm9kZSwgc3RyaW5nPiBub2RlIGluIG5vZGVzKVxyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUuSXM8c3RyaW5nPigpKVxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuQXBwZW5kQ2hpbGQobmV3IFRleHQobm9kZS5BczxzdHJpbmc+KCkpKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LkFwcGVuZENoaWxkKG5vZGUuQXM8Tm9kZT4oKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBUIEFkZEVsZW1lbnQ8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LG5vZGVzKTtcclxufXB1YmxpYyBzdGF0aWMgVCBBZGREaXY8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCgpLG5vZGVzKSk7XHJcbn1wdWJsaWMgc3RhdGljIFQgQWRkVWw8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBVbmlvbjxOb2RlLCBzdHJpbmc+W10sIHN0cmluZz5bXSBub2RlcylcclxuICAgIHdoZXJlIFQgOiBOb2RlXHJcbntcclxuICAgIHJldHVybiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPFQ+KGVsZW1lbnQsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVUxpc3RFbGVtZW50PihuZXcgSFRNTFVMaXN0RWxlbWVudCgpLFN5c3RlbS5BcnJheUV4dGVuc2lvbnMuTWFwPFVuaW9uPE5vZGUsVW5pb248Tm9kZSwgc3RyaW5nPltdLHN0cmluZz4sVW5pb248Tm9kZSxzdHJpbmc+Pihub2RlcywoRnVuYzxVbmlvbjxOb2RlLFVuaW9uPE5vZGUsIHN0cmluZz5bXSxzdHJpbmc+LFVuaW9uPE5vZGUsc3RyaW5nPj4pKG4gPT4gKFVuaW9uPE5vZGUsIHN0cmluZz4pKG4uSXM8VW5pb248Tm9kZSwgc3RyaW5nPltdPigpID8gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MTElFbGVtZW50PihuZXcgSFRNTExJRWxlbWVudCgpLG4uQXM8VW5pb248Tm9kZSwgc3RyaW5nPltdPigpKSA6IG4uSXM8c3RyaW5nPigpID8gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MTElFbGVtZW50PihuZXcgSFRNTExJRWxlbWVudCgpLG4uQXM8c3RyaW5nPigpKSA6IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTExJRWxlbWVudD4obmV3IEhUTUxMSUVsZW1lbnQoKSxuLkFzPE5vZGU+KCkpKSkpKSk7XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBBZGRDYW1lbFNwYWNlKHRoaXMgc3RyaW5nIHN0cilcclxue1xyXG4gICAgcmV0dXJuIFJlZ2V4LlJlcGxhY2UoUmVnZXguUmVwbGFjZShzdHIsIEBcIihbXl9hLXpdKShbXl9hLXpdW2Etel0pXCIsIFwiJDEgJDJcIiksIEBcIihbYS16XSkoW15fYS16XSlcIiwgXCIkMSAkMlwiKTtcclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIFRvQ2FtZWxTdHJpbmc8VD4odGhpcyBUIGUpXHJcbiAgICB3aGVyZSBUIDogc3RydWN0LCBTeXN0ZW0uRW51bVxyXG57XHJcbiAgICByZXR1cm4gZS5Ub1N0cmluZygpLkFkZENhbWVsU3BhY2UoKS5SZXBsYWNlKCdfJywgJyAnKTtcclxufSAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBBZGRFbnVtPFQ+KHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBUPyBkZWZhdWx0VmFsdWUgPSBudWxsLCBzdHJpbmcgZGVmYXVsdFZhbHVlU3RyaW5nID0gXCJcIikgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChkZWZhdWx0VmFsdWUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHNlbGVjdC5BZGQoQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50IHsgVmFsdWUgPSBcIlwiLCBTZWxlY3RlZCA9IHRydWUsIERpc2FibGUgPSB0cnVlIH0sZGVmYXVsdFZhbHVlU3RyaW5nKSk7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFQgdmFsdWUgaW4gU3lzdGVtLkVudW0uR2V0VmFsdWVzKHR5cGVvZihUKSkpXHJcbiAgICAgICAgICAgICAgICBzZWxlY3QuQWRkKEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFZhbHVlID0gKChpbnQpKG9iamVjdCl2YWx1ZSkuVG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBTZWxlY3RlZCA9IG9iamVjdC5FcXVhbHMoZGVmYXVsdFZhbHVlLCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLlRvQ2FtZWxTdHJpbmc8VD4odmFsdWUpKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIGJvb2wgQm9vbFZhbHVlKHRoaXMgSFRNTElucHV0RWxlbWVudCBjaGVja0JveClcclxue1xyXG4gICAgcmV0dXJuIGNoZWNrQm94LkNoZWNrZWQ7XHJcbn1wdWJsaWMgc3RhdGljIGJvb2wgQm9vbFZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0KVxyXG57XHJcbiAgICByZXR1cm4gc2VsZWN0LlZhbHVlID09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlO1xyXG59cHVibGljIHN0YXRpYyBBZGphY2VuY3lUeXBlIEFkamFjZW5jeVZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0KVxyXG57XHJcbiAgICByZXR1cm4gKEFkamFjZW5jeVR5cGUpaW50LlBhcnNlKHNlbGVjdC5WYWx1ZSk7XHJcbn1wdWJsaWMgc3RhdGljIFQ/IFZhbHVlPFQ+KHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0KVxyXG4gICAgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxue1xyXG4gICAgcmV0dXJuIHNlbGVjdC5WYWx1ZSA9PSBcIlwiID8gbnVsbCA6IChUPyApKFQpKG9iamVjdClpbnQuUGFyc2Uoc2VsZWN0LlZhbHVlKTtcclxufSAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MSW5wdXRFbGVtZW50IFNldEJvb2xWYWx1ZSh0aGlzIEhUTUxJbnB1dEVsZW1lbnQgY2hlY2tCb3gsIGJvb2wgdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjaGVja0JveC5DaGVja2VkID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGVja0JveDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBTZXRCb29sVmFsdWUodGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QsIGJvb2wgdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxlY3QuVmFsdWUgPSB2YWx1ZS5Ub1N0cmluZygpLlRvTG93ZXIoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBTZXRBZGphY2VuY3lWYWx1ZSh0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdCwgQWRqYWNlbmN5VHlwZSB2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGVjdC5WYWx1ZSA9ICgoaW50KXZhbHVlKS5Ub1N0cmluZygpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxTZWxlY3RFbGVtZW50IFNldFZhbHVlPFQ+KHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBUIHZhbHVlKSB3aGVyZSBUIDogc3RydWN0LCBTeXN0ZW0uRW51bVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZWN0LlZhbHVlID0gKChpbnQpKG9iamVjdCl2YWx1ZSkuVG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgc3RyaW5nIFRvVGltZVN0cmluZyh0aGlzIFRpbWVTcGFuIHRpbWUpXHJcbntcclxuICAgIHJldHVybiB0aW1lLlRvU3RyaW5nKHRpbWUgPj0gVGltZVNwYW4uRnJvbUhvdXJzKDEpID8gQFwiaFxcOm1tXFw6c3NcIiA6IEBcIm1cXDpzc1wiKTtcclxufSAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc2V0Q3VzdG9tVmFsaWRpdHkoe21lc3NhZ2V9KSwgZS5yZXBvcnRWYWxpZGl0eSgpLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIFNldEN1c3RvbVZhbGlkaXR5PFQ+KHRoaXMgVCBlbGVtZW50LCBzdHJpbmcgbWVzc2FnZSkgd2hlcmUgVCA6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihlID0+IChlLnNldEF0dHJpYnV0ZSgnbGlzdCcsIHtkYXRhbGlzdElEfSksIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIEhUTUxJbnB1dEVsZW1lbnQgU2V0RGF0YUxpc3QodGhpcyBIVE1MSW5wdXRFbGVtZW50IGVsZW1lbnQsIHN0cmluZyBkYXRhbGlzdElEKTtcclxucHVibGljIHN0YXRpYyB2b2lkIENsZWFyKHRoaXMgSFRNTEVsZW1lbnQgZWxlbWVudClcclxue1xyXG4gICAgZWxlbWVudC5Jbm5lckhUTUwgPSBcIlwiO1xyXG59ICAgICAgICAvL1tUZW1wbGF0ZShcIntlbGVtfS5hcHBlbmRDaGlsZCh7YWRkaW5nfSlcIildXHJcbiAgICAgICAgLy9wdWJsaWMgc3RhdGljIGV4dGVybiBUIEFwcGVuZDxUPiAodGhpcyBOb2RlIGVsZW0sIFQgYWRkaW5nKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gSm9pbkJSKHRoaXMgSUVudW1lcmFibGU8c3RyaW5nPiBzdHJpbmdzKVxyXG4gICAgICAgIHtcclxuU3lzdGVtLkZ1bmM8SUVudW1lcmFibGU8VW5pb248Tm9kZSwgc3RyaW5nPj4+IElubmVyID0gbnVsbDtcbiAgICAgICAgICAgIFxyXG5Jbm5lciA9ICgpID0+XHJcbntcclxuICAgIHVzaW5nICh2YXIgZW51bWVyID0gc3RyaW5ncy5HZXRFbnVtZXJhdG9yKCkpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKCFlbnVtZXIuTW92ZU5leHQoKSlcclxuICAgICAgICAgICAgeWllbGQgYnJlYWs7XHJcbiAgICAgICAgeWllbGQgcmV0dXJuIGVudW1lci5DdXJyZW50O1xyXG4gICAgICAgIHdoaWxlIChlbnVtZXIuTW92ZU5leHQoKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiBuZXcgSFRNTEJSRWxlbWVudCgpO1xyXG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gZW51bWVyLkN1cnJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG47XG4gICAgICAgICAgICByZXR1cm4gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Ub0FycmF5PFVuaW9uPE5vZGUsc3RyaW5nPj4oSW5uZXIoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBOb3RhYmxlT2JqZWN0c0xpc3RcclxuICAgIHtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWFkb25seSBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gLHN0cmluZyAsc3RyaW5nID4+IE5vdGFibGVPYmplY3RzID1cclxuICAgICAgICAgICAgZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiAsc3RyaW5nICxzdHJpbmcgPj4oKSwoX280KT0+e19vNC5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+Piwgc3RyaW5nLCBzdHJpbmc+KGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4oKSwgKF9vMSkgPT5cclxue1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApKTtcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigxLCAwKSk7XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMSwgMSkpO1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDIpKTtcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigyLCAyKSk7XHJcbiAgICByZXR1cm4gX28xO1xyXG59XHJcblxyXG4pLCBcIlR3byBHZW5lcmF0aW9uIE5pbmV0eSBEZWdyZWUgUm90YXRvclwiLCBcIjAwMTAxMC0tLSAvIDAwMDEwMS0tLVwiKSk7X280LkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8SGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+LCBzdHJpbmcsIHN0cmluZz4oZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PigpLCAoX28yKSA9PlxyXG57XHJcbiAgICBfbzIuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCkpO1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDEsIDApKTtcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigxLCAxKSk7XHJcbiAgICBfbzIuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMSkpO1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDIpKTtcclxuICAgIHJldHVybiBfbzI7XHJcbn1cclxuXHJcbiksIFwiT25lIEdlbmVyYXRpb24gTmluZXR5IERlZ3JlZSBSb3RhdG9yXCIsIFwiMDAxMDEwLS0tIC8gMDAwMTAxLS0tXCIpKTtfbzQuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4sIHN0cmluZywgc3RyaW5nPihnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+KCksIChfbzMpID0+XHJcbntcclxuICAgIF9vMy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAxKSk7XHJcbiAgICBfbzMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMSwgMCkpO1xyXG4gICAgX28zLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApKTtcclxuICAgIF9vMy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigyLCAwKSk7XHJcbiAgICBfbzMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMiwgMSkpO1xyXG4gICAgcmV0dXJuIF9vMztcclxufVxyXG5cclxuKSwgXCJUd28gRGlyZWN0aW9uIEdyb3dlclwiLCBcIjAwMDEwMDAwMCAvIDExMTExMTExMVwiKSk7cmV0dXJuIF9vNDt9KTtcclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIC8vLyA8c3VtbWFyeT5cclxuICAgIC8vLyBPcHRpb25zOlxyXG4gICAgLy8vIC0gQ2VsbCAoSXNDZWxsOiB0cnVlLCBJc1dhbGw6IGZhbHNlKSAgfCBCbGFja1xyXG4gICAgLy8vIC0gV2FsbCAoSXNDZWxsOiB0cnVlLCBJc1dhbGw6IHRydWUpICAgfCBHcmV5XHJcbiAgICAvLy8gLSBCcmljayAoSXNDZWxsOiBmYWxzZSwgSXNXYWxsOiB0cnVlKSB8IEdyZXlcclxuICAgIC8vLyA8L3N1bW1hcnk+XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBTcXVhcmVFeHRlbnNpb25zXHJcbiAgICB7XHJcbnB1YmxpYyBzdGF0aWMgYm9vbCBJc0FsaXZlKHRoaXMgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKVxyXG57XHJcbiAgICByZXR1cm4gc3F1YXJlVHlwZSAhPSBTcXVhcmVUeXBlLkJyaWNrO1xyXG59cHVibGljIHN0YXRpYyBib29sIElzVW5kZWFkKHRoaXMgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKVxyXG57XHJcbiAgICByZXR1cm4gc3F1YXJlVHlwZSAhPSBTcXVhcmVUeXBlLkNlbGw7XHJcbn1wdWJsaWMgc3RhdGljIGJvb2wgQ29udGFpbnNBbGl2ZTxUPih0aGlzIERpY3Rpb25hcnk8VCwgU3F1YXJlVHlwZT4gZGljLCBUIGtleSlcclxue1xyXG5TcXVhcmVUeXBlIHNxdWFyZVR5cGU7XG4gICAgcmV0dXJuIGRpYy5UcnlHZXRWYWx1ZShrZXksIG91dCBzcXVhcmVUeXBlKSAmJiBzcXVhcmVUeXBlLklzQWxpdmUoKTtcclxufSAgICB9XHJcblxyXG4gICAgcHVibGljIGVudW0gU3F1YXJlVHlwZVxyXG4gICAge1xyXG4gICAgICAgIENlbGwsICAvLyBCbGFja1xyXG4gICAgICAgIEltbW9ydGFsQ2VsbCwgIC8vIEdyZXlcclxuICAgICAgICBCcmljaywgLy8gR3JleVxyXG4gICAgICAgIENvdW50XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVudW0gR3JpZFR5cGVcclxuICAgIHtcclxuICAgICAgICBTcXVhcmUsXHJcbiAgICAgICAgSGV4LFxyXG4gICAgICAgIFRyaWFuZ2xlLFxyXG4gICAgICAgIENvdW50XHJcbiAgICB9XHJcblxyXG4gICAgW0ZsYWdzXVxyXG4gICAgcHVibGljIGVudW0gRGl2aWRlcnNJbmZvXHJcbiAgICB7XHJcbiAgICAgICAgTm9uZSA9IDAsXHJcbiAgICAgICAgUmlnaHQgPSAxIDw8IDAsXHJcbiAgICAgICAgQm90dG9tID0gMSA8PCAxLFxyXG4gICAgICAgIEJvdHRvbVJpZ2h0ID0gMSA8PCAyXHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY2xhc3MgR3JpZFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCB2b2lkIENsZWFyKCk7XHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IHZvaWQgRHJhd1NxdWFyZXMoQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4sIFNxdWFyZVR5cGU+IERyYXdTcXVhcmUpO1xyXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCB2b2lkIEhhbmRsZUNsaWNrKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhd1Bvc2l0aW9uLCBTcXVhcmVUeXBlIFNxdWFyZVR5cGVQbGFjaW5nKTtcclxuICAgICAgICBwdWJsaWMgYWJzdHJhY3Qgdm9pZCBVcGRhdGUoKTtcclxuXHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IGludCBTcXVhcmVDb3VudCB7IGdldDsgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjbGFzcyBHcmlkPENvb3JkVHlwZT4gOiBHcmlkXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHZpcnR1YWwgdm9pZCBBc3NpZ25EaXZpZGVycyAoU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBkcmF3UG9zaXRpb24sIHJlZiBib29sIHBsYWNlTm9ybWFsbHkpIHsgfVxyXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IEdldERyYXdQb3NpdGlvbiAoQ29vcmRUeXBlIGNvb3Jkcyk7XHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IENvb3JkVHlwZSBGcm9tRHJhd1Bvc2l0aW9uIChTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYXdQb3NpdGlvbik7XHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IGludCBOdW1iZXJPZkFkamFjZW50Q2VsbHMgKENvb3JkVHlwZSBjb29yZHMsIEFjdGlvbjxDb29yZFR5cGU+IGVtcHR5QWRqQWN0aW9uID0gbnVsbCk7XHJcbiAgICAgICAgcHVibGljIERpY3Rpb25hcnk8Q29vcmRUeXBlLCBTcXVhcmVUeXBlPiBTcXVhcmVzID0gbmV3IERpY3Rpb25hcnk8Q29vcmRUeXBlLCBTcXVhcmVUeXBlPigpO1xyXG4gICAgICAgIHB1YmxpYyBEaWN0aW9uYXJ5PENvb3JkVHlwZSwgRGl2aWRlcnNJbmZvPiBEaXZpZGVycyA9IG5ldyBEaWN0aW9uYXJ5PENvb3JkVHlwZSwgRGl2aWRlcnNJbmZvPigpO1xyXG5wdWJsaWMgb3ZlcnJpZGUgaW50IFNxdWFyZUNvdW50XHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBTcXVhcmVzLkNvdW50O1xyXG4gICAgfVxyXG59XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgQ2xlYXIoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU3F1YXJlcy5DbGVhcigpO1xyXG4gICAgICAgICAgICBEaXZpZGVycy5DbGVhcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRHJhd1NxdWFyZXMgKEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+LCBDb29yZFR5cGUsIFNxdWFyZVR5cGU+IERyYXdTcXVhcmUpXHJcbiAgICAgICAge1xyXG5mb3JlYWNoICh2YXIgX2QxIGluIFNxdWFyZXMpXHJcbntcclxuICAgIENvb3JkVHlwZSBjb29yZHM7XHJcbiAgICBTcXVhcmVUeXBlIHNxdWFyZVR5cGU7XHJcbiAgICBfZDEuRGVjb25zdHJ1Y3Qob3V0IGNvb3Jkcywgb3V0IHNxdWFyZVR5cGUpO1xyXG4gICAgRHJhd1NxdWFyZShHZXREcmF3UG9zaXRpb24oY29vcmRzKSwgY29vcmRzLCBzcXVhcmVUeXBlKTtcclxufVxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIERyYXdTcXVhcmVzIChBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiwgU3F1YXJlVHlwZT4gRHJhd1NxdWFyZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuRHJhd1NxdWFyZXMoKEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixDb29yZFR5cGUsU3F1YXJlVHlwZT4pKChkcmF3UG9zaXRpb24sIGNvb3Jkcywgc3F1YXJlVHlwZSkgPT4gRHJhd1NxdWFyZShkcmF3UG9zaXRpb24sIHNxdWFyZVR5cGUpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGlzdDxDb29yZFR5cGU+IHJlbW92aW5nID0gbmV3IExpc3Q8Q29vcmRUeXBlPigpO1xyXG4gICAgICAgICAgICBIYXNoU2V0PENvb3JkVHlwZT4gYWRkaW5nID0gbmV3IEhhc2hTZXQ8Q29vcmRUeXBlPigpO1xyXG5mb3JlYWNoICh2YXIgX2QyIGluIFNxdWFyZXMpXHJcbntcclxuICAgIENvb3JkVHlwZSBjb29yZHM7XHJcbiAgICBTcXVhcmVUeXBlIHNxdWFyZVR5cGU7XHJcbiAgICBfZDIuRGVjb25zdHJ1Y3Qob3V0IGNvb3Jkcywgb3V0IHNxdWFyZVR5cGUpO1xyXG4gICAgaWYgKCFzcXVhcmVUeXBlLklzQWxpdmUoKSlcclxuICAgICAgICBjb250aW51ZTtcclxuICAgIGludCBhZGphY2VudENlbGxzID0gTnVtYmVyT2ZBZGphY2VudENlbGxzKGNvb3JkcywgKEFjdGlvbjxDb29yZFR5cGU+KShjb29yZHNfID0+XHJcbiAgICB7XHJcbiAgICAgICAgaWYgKEFwcC5kZWFkUnVsZXNbTnVtYmVyT2ZBZGphY2VudENlbGxzKGNvb3Jkc18pXSlcclxuICAgICAgICAgICAgYWRkaW5nLkFkZChjb29yZHNfKTtcclxuICAgIH1cclxuXHJcbikgICAgKTtcclxuICAgIGlmIChhZGphY2VudENlbGxzID4gQXBwLm1heEFkamFjZW50Q2VsbHMpXHJcbiAgICAgICAgYWRqYWNlbnRDZWxscyA9IEFwcC5tYXhBZGphY2VudENlbGxzO1xyXG4gICAgaWYgKCFzcXVhcmVUeXBlLklzVW5kZWFkKCkgJiYgIUFwcC5saXZpbmdSdWxlc1thZGphY2VudENlbGxzXSlcclxuICAgICAgICByZW1vdmluZy5BZGQoY29vcmRzKTtcclxufVxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKENvb3JkVHlwZSBjb29yZHMgaW4gcmVtb3ZpbmcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICghU3F1YXJlcy5SZW1vdmUoY29vcmRzKSkgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlNxdWFyZSB0cmllZCB0byBiZSByZW1vdmVkIGJ1dCBkaWRuJ3QgZXhpc3RcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcmVhY2ggKENvb3JkVHlwZSBjb29yZHMgaW4gYWRkaW5nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTcXVhcmVzLkFkZChjb29yZHMsIFNxdWFyZVR5cGUuQ2VsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIEhhbmRsZUNsaWNrIChTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYXdQb3NpdGlvbiwgU3F1YXJlVHlwZSBTcXVhcmVUeXBlUGxhY2luZylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIENvb3JkVHlwZSBjbGlja0Nvb3JkcyA9IEZyb21EcmF3UG9zaXRpb24oZHJhd1Bvc2l0aW9uKTtcclxuICAgICAgICAgICAgYm9vbCBwbGFjZU5vcm1hbGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKFNxdWFyZVR5cGVQbGFjaW5nID09IFNxdWFyZVR5cGUuQ291bnQpXHJcbiAgICAgICAgICAgICAgICBBc3NpZ25EaXZpZGVycyhkcmF3UG9zaXRpb24sIHJlZiBwbGFjZU5vcm1hbGx5KTtcclxuICAgICAgICAgICAgaWYgKHBsYWNlTm9ybWFsbHkgJiYgIVNxdWFyZXMuUmVtb3ZlKGNsaWNrQ29vcmRzKSlcclxuICAgICAgICAgICAgICAgIFNxdWFyZXMuQWRkKGNsaWNrQ29vcmRzLCBTcXVhcmVUeXBlUGxhY2luZyA9PSBTcXVhcmVUeXBlLkNvdW50ID8gU3F1YXJlVHlwZS5DZWxsIDogU3F1YXJlVHlwZVBsYWNpbmcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xhc3MgU3F1YXJlR3JpZCA6IEdyaWQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj5cclxuICAgIHtcclxucHVibGljIG92ZXJyaWRlIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID5HZXREcmF3UG9zaXRpb24oU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPmNvb3Jkcylcclxue1xyXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oY29vcmRzLkl0ZW0xICogQXBwLnhNdWx0aXBsaWVyLCBjb29yZHMuSXRlbTIgKiBBcHAueE11bHRpcGxpZXIpO1xyXG59cHVibGljIG92ZXJyaWRlIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID5Gcm9tRHJhd1Bvc2l0aW9uKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID5kcmF3UG9zaXRpb24pXHJcbntcclxuICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KEFwcC5OZWdEaXYoZHJhd1Bvc2l0aW9uLkl0ZW0xLCBBcHAueE11bHRpcGxpZXIpLCBBcHAuTmVnRGl2KGRyYXdQb3NpdGlvbi5JdGVtMiwgQXBwLnhNdWx0aXBsaWVyKSk7XHJcbn1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBBc3NpZ25EaXZpZGVycyhTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYXdQb3NpdGlvbiwgcmVmIGJvb2wgcGxhY2VOb3JtYWxseSlcclxuICAgICAgICB7XHJcbmRvdWJsZSBjbGlja1hfO1xuZG91YmxlIGNsaWNrWV87XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUsIGRvdWJsZT4oQXBwLk5lZ0RpdkRvdWJsZSgoZG91YmxlKWRyYXdQb3NpdGlvbi5JdGVtMSwgQXBwLnhNdWx0aXBsaWVyKSwgQXBwLk5lZ0RpdkRvdWJsZSgoZG91YmxlKWRyYXdQb3NpdGlvbi5JdGVtMiwgQXBwLnlNdWx0aXBsaWVyKSksIG91dCBjbGlja1hfLCBvdXQgY2xpY2tZXyk7XHJcbiAgICAgICAgICAgIHBsYWNlTm9ybWFsbHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgaW50IHhEaXYgPSAwLCB5RGl2ID0gMDtcclxuICAgICAgICAgICAgaWYgKGNsaWNrWF8gJSAxIDw9IDAuMilcclxuICAgICAgICAgICAgICAgIHhEaXYgPSAtMTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoY2xpY2tYXyAlIDEgPj0gMC44KVxyXG4gICAgICAgICAgICAgICAgeERpdiA9IDE7XHJcbiAgICAgICAgICAgIGlmIChjbGlja1lfICUgMSA8PSAwLjIpXHJcbiAgICAgICAgICAgICAgICB5RGl2ID0gLTE7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNsaWNrWV8gJSAxID49IDAuOClcclxuICAgICAgICAgICAgICAgIHlEaXYgPSAxO1xyXG4gICAgICAgICAgICBEaXZpZGVyc0luZm8gZGl2aWRlcnNJbmZvID0gRGl2aWRlcnNJbmZvLk5vbmU7XHJcbiAgICAgICAgICAgIEFjdGlvbjxEaXZpZGVyc0luZm8+IEFzc2lnbiA9IChEaXZpZGVyc0luZm8gZGl2SW5mbykgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW50IHggPSAoaW50KWNsaWNrWF8gKyB4RGl2LCB5ID0gKGludCljbGlja1lfICsgeURpdjtcclxuICAgICAgICAgICAgICAgIGlmIChkaXZJbmZvICE9IERpdmlkZXJzSW5mby5Ob25lKVxyXG4gICAgICAgICAgICAgICAge1xyXG5EaXZpZGVyc0luZm8gZGl2aWRlcnM7XG4gICAgICAgICAgICAgICAgICAgIGlmICghRGl2aWRlcnMuVHJ5R2V0VmFsdWUobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KXgsIChpbnQpeSksIG91dCBkaXZpZGVycykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlkZXJzID0gRGl2aWRlcnNJbmZvLk5vbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgRGl2aWRlcnNbbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4LCB5KV0gPSBkaXZpZGVycyBeIGRpdkluZm87XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHN3aXRjaCAoeERpdilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAtMTpcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHlEaXYpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXNzaWduKERpdmlkZXJzSW5mby5Cb3R0b21SaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXNzaWduKERpdmlkZXJzSW5mby5SaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeURpdiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBc3NpZ24oRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh5RGl2KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAtMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2lnbihEaXZpZGVyc0luZm8uQm90dG9tKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZU5vcm1hbGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXZpZGVyc0luZm8gPSBEaXZpZGVyc0luZm8uQm90dG9tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHlEaXYpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeERpdiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBc3NpZ24oRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXZpZGVyc0luZm8gPSBEaXZpZGVyc0luZm8uUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGl2aWRlcnNJbmZvID0gRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGl2aWRlcnNJbmZvICE9IERpdmlkZXJzSW5mby5Ob25lKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB4RGl2ID0gMDtcclxuICAgICAgICAgICAgICAgIHlEaXYgPSAwO1xyXG4gICAgICAgICAgICAgICAgQXNzaWduKGRpdmlkZXJzSW5mbyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBpbnQgTnVtYmVyT2ZBZGphY2VudENlbGxzKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gY29vcmRzLCBBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gZW1wdHlBZGpBY3Rpb24gPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGFkamFjZW50Q2VsbHMgPSAwO1xyXG4gICAgICAgICAgICBpbnQgbiA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoaW50IEwgPSAwOyBMIDw9IDg7IEwrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKEwgPT0gNClcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciBhZGphY2VuY3lSdWxlID0gQXBwLmFkamFjZW5jeVJ1bGVzW24rK107XHJcblxyXG4gICAgICAgICAgICAgICAgaW50IGMwXyA9IGNvb3Jkcy5JdGVtMS0gMSArIChMICUgMyksXHJcbiAgICAgICAgICAgICAgICAgICAgYzFfID0gY29vcmRzLkl0ZW0yLSAxICsgTCAvIDM7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKERpdmlkZXJzLkhhc0RpdmlkZXJzKGNvb3Jkcy5JdGVtMSwgY29vcmRzLkl0ZW0yLCBMKSlcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuU3F1YXJlVHlwZSBzcXVhcmVJbmZvO1xuXHJcbiAgICAgICAgICAgICAgICBpZiAoU3F1YXJlcy5UcnlHZXRWYWx1ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGMwXywgYzFfKSwgb3V0IHNxdWFyZUluZm8pKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzcXVhcmVJbmZvLklzQWxpdmUoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbnRDZWxscyArPSAoaW50KWFkamFjZW5jeVJ1bGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZW1wdHlBZGpBY3Rpb24hPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PmVtcHR5QWRqQWN0aW9uLkludm9rZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGMwXywgYzFfKSkpOm51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFkamFjZW50Q2VsbHMgPiBBcHAubWF4QWRqYWNlbnRDZWxscyA/IEFwcC5tYXhBZGphY2VudENlbGxzIDogYWRqYWNlbnRDZWxscztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsYXNzIEhleEdyaWQgOiBHcmlkPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWFkb25seSBmbG9hdFxyXG4gICAgICAgICAgICBjb3M2MCA9IChmbG9hdClNYXRoLlNpbihNYXRoLlBJIC8gMyksXHJcbiAgICAgICAgICAgIHNpbjYwID0gKGZsb2F0KU1hdGguQ29zKE1hdGguUEkgLyAzKTtcclxuICAgICAgICBcclxuICAgICAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAgICAgLy8vIFxyXG4gICAgICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAgICAgLy8vIDxwYXJhbSBuYW1lPVwiY29vcmRzXCI+NjBsIGlzIHBvc2l0aW9uIGZyb20gKDAsIDApIGdvaW5nIDYwIGRlZ3JlZXMgbGVmdCBvZiB1cC4gNjByIGlzIHBvc2l0aW9uIGZyb20gKDAsIDApIGdvaW5nIDYwIGRlZ3JlZXMgcmlnaHQgb2YgdXAvcGFyYW0+XHJcbiAgICAgICAgLy8vIDxyZXR1cm5zPjwvcmV0dXJucz5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBHZXREcmF3UG9zaXRpb24gKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gY29vcmRzKVxyXG4gICAgICAgIHtcclxuaW50IF82MGw7XG5pbnQgXzYwcjtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoY29vcmRzLCBvdXQgXzYwbCwgb3V0IF82MHIpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KSgoLV82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIGNvczYwKSwgKGludCkoLShfNjBsICsgXzYwcikgKiBBcHAueE11bHRpcGxpZXIgKiBzaW42MCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gRnJvbURyYXdQb3NpdGlvbihTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYXdQb3NpdGlvbilcclxuICAgICAgICB7XHJcbmludCB4O1xuaW50IHk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGRyYXdQb3NpdGlvbiwgb3V0IHgsIG91dCB5KTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHggPSAoLV82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIHNpbjYwXHJcbiAgICAgICAgICAgICAgIHkgPSAtKF82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIGNvczYwXHJcbiAgICAgICAgICAgICAgIGsgPSBBcHAueE11bHRpcGxpZXJcclxuICAgICAgICAgICAgICAgYSA9IF82MGxcclxuICAgICAgICAgICAgICAgYiA9IF82MHJcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIFNvbHZlIHggPSAoLWEgKyBiKSAqIGsgKiBzaW42MDt5ID0gLShhKyBiKSAqIGsgKiBjb3M2MCBmb3IgKGEsIGIpIChodHRwczovL3d3dy53b2xmcmFtYWxwaGEuY29tL2lucHV0P2k9c29sdmUreCslM0QrJTI4LWErJTJCK2IlMjkrKitrKyorc2luNjAlM0J5KyUzRCstJTI4YSUyQitiJTI5KyoraysqK2NvczYwK2ZvcithK2FuZCtiKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgYSA9IC0oc3FydCgzKSB4ICsgMyB5KS8oMyBrKVxyXG4gICAgICAgICAgICAgICBiID0gKHNxcnQoMykgeCAtIDMgeSkvKDMgaylcclxuICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKC0oTWF0aC5TcXJ0KDMpICogeCArIDMgKiB5KSAvICgzICogQXBwLnhNdWx0aXBsaWVyKSksIChpbnQpKChNYXRoLlNxcnQoMykgKiB4IC0gMyAqIHkpIC8gKDMgKiBBcHAueE11bHRpcGxpZXIpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgaW50IE51bWJlck9mQWRqYWNlbnRDZWxscyhTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGNvb3JkcywgQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+IGVtcHR5QWRqQWN0aW9uID0gbnVsbClcclxuICAgICAgICB7XHJcbmludCBfNjBsO1xuaW50IF82MHI7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGNvb3Jkcywgb3V0IF82MGwsIG91dCBfNjByKTtcclxuICAgICAgICAgICAgaW50IGFkamFjZW50Q2VsbHMgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGludCBMID0gMDsgTCA8PSA1OyBMKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBhZGphY2VuY3lSdWxlID0gQXBwLmFkamFjZW5jeVJ1bGVzW0xdO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIDYwbCBpcyBwb3NpdGlvbiBmcm9tICgwLCAwKSBnb2luZyA2MCBkZWdyZWVzIGxlZnQgb2YgdXAuIDYwciBpcyBwb3NpdGlvbiBmcm9tICgwLCAwKSBnb2luZyA2MCBkZWdyZWVzIHJpZ2h0IG9mIHVwXHJcbiAgICAgICAgICAgICAgICAvLyBMID0gMCBpcyBsZWZ0LXVwLCBnb2luZyBjbG9ja3dpc2UgdXAgdG8gTD01IGlzIGxlZnRcclxuXHJcbiAgICAgICAgICAgICAgICBpbnQgXzYwbF8sIF82MHJfO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChMKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxlZnQtdXBcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MGxfID0gXzYwbCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MHJfID0gXzYwcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MGxfID0gXzYwbCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MHJfID0gXzYwciArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJpZ2h0LXVwXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjBsXyA9IF82MGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MHJfID0gXzYwciArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJpZ2h0LWRvd25cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MGxfID0gXzYwbCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MHJfID0gXzYwcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZG93blxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwbF8gPSBfNjBsIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbGVmdC1kb3duXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjBsXyA9IF82MGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MHJfID0gXzYwciAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKHN0cmluZy5Gb3JtYXQoXCJJbnZhbGlkIEw6IHswfVwiLEwpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuU3F1YXJlVHlwZSBzcXVhcmVJbmZvO1xuXHJcbiAgICAgICAgICAgICAgICAvL2lmIChEaXZpZGVycy5IYXNEaXZpZGVycyhjb29yZHMuYzAsIGNvb3Jkcy5jMSwgTCkpXHJcbiAgICAgICAgICAgICAgICAvLyAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoU3F1YXJlcy5UcnlHZXRWYWx1ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KF82MGxfLCBfNjByXyksIG91dCBzcXVhcmVJbmZvKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3F1YXJlSW5mby5Jc0FsaXZlKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW50Q2VsbHMgKz0gKGludClhZGphY2VuY3lSdWxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGVtcHR5QWRqQWN0aW9uIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5lbXB0eUFkakFjdGlvbi5JbnZva2UobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihfNjBsXywgXzYwcl8pKSk6bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYWRqYWNlbnRDZWxscyA+IEFwcC5tYXhBZGphY2VudENlbGxzID8gQXBwLm1heEFkamFjZW50Q2VsbHMgOiBhZGphY2VudENlbGxzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xhc3MgVHJpYW5nbGVHcmlkIDogR3JpZDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsVHJpYW5nbGVMb2NhdGlvbiA+PlxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGZsb2F0XHJcbiAgICAgICAgICAgIGNvczYwID0gKGZsb2F0KU1hdGguU2luKE1hdGguUEkgLyAzKSxcclxuICAgICAgICAgICAgc2luNjAgPSAoZmxvYXQpTWF0aC5Db3MoTWF0aC5QSSAvIDMpO1xyXG5cclxuICAgICAgICAvLyBjMCBpcyB4LCBjMSBpcyB5XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gR2V0RHJhd1Bvc2l0aW9uKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxUcmlhbmdsZUxvY2F0aW9uID4gY29vcmRzKVxyXG4gICAgICAgIHtcclxuaW50IF82MGw7XG5pbnQgXzYwcjtcblRyaWFuZ2xlTG9jYXRpb24gbjtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoY29vcmRzLCBvdXQgXzYwbCwgb3V0IF82MHIsIG91dCBuKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCkoKC1fNjBsICsgXzYwcikgKiBBcHAueE11bHRpcGxpZXIgKiBjb3M2MCksIChpbnQpKC0oXzYwbCArIF82MHIpICogQXBwLnhNdWx0aXBsaWVyICogc2luNjApKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsVHJpYW5nbGVMb2NhdGlvbiA+IEZyb21EcmF3UG9zaXRpb24oU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBkcmF3UG9zaXRpb24pXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uRnVuYzxkb3VibGUsIGRvdWJsZT4gTmVnTW9kMSA9IG51bGw7XG5pbnQgeDtcbmludCB5O1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChkcmF3UG9zaXRpb24sIG91dCB4LCBvdXQgeSk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB4ID0gKC1fNjBsICsgXzYwcikgKiBBcHAueE11bHRpcGxpZXIgKiBzaW42MFxyXG4gICAgICAgICAgICAgICB5ID0gLShfNjBsICsgXzYwcikgKiBBcHAueE11bHRpcGxpZXIgKiBjb3M2MFxyXG4gICAgICAgICAgICAgICBrID0gQXBwLnhNdWx0aXBsaWVyXHJcbiAgICAgICAgICAgICAgIGEgPSBfNjBsXHJcbiAgICAgICAgICAgICAgIGIgPSBfNjByXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBTb2x2ZSB4ID0gKC1hICsgYikgKiBrICogc2luNjA7eSA9IC0oYSsgYikgKiBrICogY29zNjAgZm9yIChhLCBiKSAoaHR0cHM6Ly93d3cud29sZnJhbWFscGhhLmNvbS9pbnB1dD9pPXNvbHZlK3grJTNEKyUyOC1hKyUyQitiJTI5KyoraysqK3NpbjYwJTNCeSslM0QrLSUyOGElMkIrYiUyOSsqK2srKitjb3M2MCtmb3IrYSthbmQrYilcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIGEgPSAtKDMgeCArIHNxcnQoMykgeSkvKDMgaylcclxuICAgICAgICAgICAgICAgYiA9ICgzIHggLSBzcXJ0KDMpIHkpLygzIGspXHJcbiAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgVHJpYW5nbGVMb2NhdGlvbiBmcm9tIHBvc2l0aW9uXHJcblxyXG4gICAgICAgICAgICBkb3VibGUgYm9hcmRfNjBsID0gLShNYXRoLlNxcnQoMykgKiB4ICsgMyAqIHkpIC8gKDMgKiBBcHAueE11bHRpcGxpZXIpLFxyXG4gICAgICAgICAgICAgICAgICAgYm9hcmRfNjByID0gIChNYXRoLlNxcnQoMykgKiB4IC0gMyAqIHkpIC8gKDMgKiBBcHAueE11bHRpcGxpZXIpO1xyXG5cclxuICAgICAgICAgICAgXHJcbk5lZ01vZDEgPSAoYSkgPT4gKGEgJSAxICsgMSkgJSAxO1xuXHJcbiAgICAgICAgICAgIGRvdWJsZSBfNjBsTW9kMSA9IE5lZ01vZDEoYm9hcmRfNjBsKSxcclxuICAgICAgICAgICAgICAgICAgIF82MHJNb2QxID0gTmVnTW9kMShib2FyZF82MHIpO1xyXG5cclxuICAgICAgICAgICAgVHJpYW5nbGVMb2NhdGlvbiBuID0gXzYwck1vZDEgPD0gKDEuMCAvIDIpXHJcbiAgICAgICAgICAgICAgICA/IF82MGxNb2QxIDw9ICgxLjAgLyAzKSA/IFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tIDpcclxuICAgICAgICAgICAgICAgICAgICBfNjBsTW9kMSA8PSAoMi4wIC8gMykgPyBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbUxlZnQgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVHJpYW5nbGVMb2NhdGlvbi5Ub3BMZWZ0XHJcbiAgICAgICAgICAgICAgICA6IF82MGxNb2QxIDw9ICgxLjAgLyAzKSA/IFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tUmlnaHQgOlxyXG4gICAgICAgICAgICAgICAgICAgIF82MGxNb2QxIDw9ICgyLjAgLyAzKSA/IFRyaWFuZ2xlTG9jYXRpb24uVG9wUmlnaHQgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVHJpYW5nbGVMb2NhdGlvbi5Ub3A7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+KChpbnQpTWF0aC5Sb3VuZChib2FyZF82MGwpLCAoaW50KU1hdGguUm91bmQoYm9hcmRfNjByKSwgbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgaW50IE51bWJlck9mQWRqYWNlbnRDZWxscyhTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsVHJpYW5nbGVMb2NhdGlvbiA+IGNvb3JkcywgQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxUcmlhbmdsZUxvY2F0aW9uID4+IGVtcHR5QWRqQWN0aW9uID0gbnVsbClcclxuICAgICAgICB7XHJcbl9fX0FkZFNxdWFyZV9EZWxlZ2F0ZV8wIEFkZFNxdWFyZSA9IG51bGw7XG5TeXN0ZW0uRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4sIFRyaWFuZ2xlTG9jYXRpb24sIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBUcmlhbmdsZUxvY2F0aW9uPj4gQ3JlYXRlUG9zID0gbnVsbDtcblN5c3RlbS5GdW5jPGludCwgYm9vbCwgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PiBHZXRGaW5hbEhleGFnb25Mb2NQb3MgPSBudWxsO1xuU3lzdGVtLkZ1bmM8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+IEdldEhleGFnb25Mb2MgPSBudWxsO1xuU3lzdGVtLkZ1bmM8aW50LCBib29sLCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+IEdldEhleGFnb25Mb2NQb3MgPSBudWxsO1xuaW50IF82MGw7XG5pbnQgXzYwcjtcblRyaWFuZ2xlTG9jYXRpb24gbjtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoY29vcmRzLCBvdXQgXzYwbCwgb3V0IF82MHIsIG91dCBuKTtcclxuICAgICAgICAgICAgaW50IGFkamFjZW50Q2VsbHMgPSAwO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yIChUcmlhbmdsZUxvY2F0aW9uIGxvYyA9IDA7IGxvYyA8IFRyaWFuZ2xlTG9jYXRpb24uQ291bnQ7IGxvYysrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAobG9jID09IG4pXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWRqYWNlbmN5UnVsZSA9IEFwcC5hZGphY2VuY3lSdWxlc1soaW50KWxvY107XHJcblNxdWFyZVR5cGUgc3F1YXJlVHlwZTtcbiAgICAgICAgICAgICAgICBpZiAoU3F1YXJlcy5UcnlHZXRWYWx1ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+KF82MGwsIF82MHIsIGxvYyksIG91dCBzcXVhcmVUeXBlKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3F1YXJlVHlwZS5Jc0FsaXZlKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW50Q2VsbHMgKz0gKGludClhZGphY2VuY3lSdWxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGVtcHR5QWRqQWN0aW9uIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5lbXB0eUFkakFjdGlvbi5JbnZva2UobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBUcmlhbmdsZUxvY2F0aW9uPihfNjBsLCBfNjByLCBsb2MpKSk6bnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgdHJpYW5nbGVzIGZyb20gYWRqYWNlbnQgaGV4YWdvbnMgZm9yIGFkamFjZW5jeVxyXG5cclxuICAgICAgICAgICAgLy8gSWYgbGVmdC11cCwgZ2V0IHJpZ2h0LXVwLCByaWdodC1kb3duIGFuZCBkb3duIGZyb20gbGVmdC11cCxcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgZ2V0IHJpZ2h0LXVwIGFuZCB1cCBmcm9tIGxlZnQtZG93bixcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgZ2V0IGxlZnQtZG93biBhbmQgZG93biBmcm9tIHVwXHJcblxyXG4gICAgICAgICAgICAvLyBJZiB1cCwgZ2V0IGxlZnQtZG93biwgZG93biBhbmQgcmlnaHQtZG93biBmcm9tIHVwLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgZ2V0IHJpZ2h0LXVwIGFuZCByaWdodC1kb3duIGZyb20gbGVmdC11cFxyXG4gICAgICAgICAgICAvLyAgICAgICAgZ2V0IGxlZnQtdXAgYW5kIGxlZnQtZG93biBmcm9tIHJpZ2h0LXVwXHJcblxyXG4gICAgICAgICAgICAvLyBJZiByaWdodC11cCwgZ2V0IGxlZnQtdXAsIGxlZnQtZG93biBhbmQgZG93biBmcm9tIHJpZ2h0LXVwLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgZ2V0IGxlZnQtdXAgYW5kIHVwIGZyb20gcmlnaHQtZG93bixcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgIGdldCByaWdodC1kb3duIGFuZCBkb3duIGZyb20gdXBcclxuXHJcbiAgICAgICAgICAgIC8vIElmIGxlZnQtZG93biwgZ2V0IHJpZ2h0LXVwLCByaWdodC1kb3duIGFuZCB1cCBmcm9tIGxlZnQtZG93bixcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICBnZXQgcmlnaHQtZG93biBhbmQgZG93biBmcm9tIGxlZnQtdXAsXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgZ2V0IGxlZnQtdXAgYW5kIHVwIGZyb20gZG93blxyXG5cclxuICAgICAgICAgICAgLy8gSWYgZG93biwgZ2V0IGxlZnQtdXAsIHVwIGFuZCByaWdodC11cCBmcm9tIGRvd24sXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgIGdldCByaWdodC1kb3duIGFuZCByaWdodC11cCBmcm9tIGxlZnQtZG93blxyXG4gICAgICAgICAgICAvLyAgICAgICAgICBnZXQgbGVmdC1kb3duIGFuZCBsZWZ0LXVwIGZyb20gcmlnaHQtZG93blxyXG5cclxuICAgICAgICAgICAgLy8gSWYgcmlnaHQtZG93biwgZ2V0IGxlZnQtdXAsIGxlZnQtZG93biBhbmQgdXAgZnJvbSByaWdodC1kb3duLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBnZXQgbGVmdC1kb3duIGFuZCBkb3duIGZyb20gcmlnaHQtdXAsXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGdldCByaWdodC11cCBhbmQgdXAgZnJvbSBkb3duXHJcblxyXG4gICAgICAgICAgICBpbnQgeF8gPVxyXG4gICAgICAgICAgICAgICAgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQgfHwgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbUxlZnQgPyAtMSA6XHJcbiAgICAgICAgICAgICAgICBuID09IFRyaWFuZ2xlTG9jYXRpb24uVG9wUmlnaHQgfHwgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbVJpZ2h0ID8gMSA6XHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgeV8gPVxyXG4gICAgICAgICAgICAgICAgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQgfHwgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLlRvcFJpZ2h0IHx8IG4gPT0gVHJpYW5nbGVMb2NhdGlvbi5Ub3AgPyAtMSA6IDE7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuR2V0SGV4YWdvbkxvY1BvcyA9IChpbnZlcnRYLCBpbnZlcnRZKSA9PiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGludmVydFggPT0gLTEgPyAwIDogaW52ZXJ0WCA9PSAxID8gLXhfIDogeF8sIGludmVydFkgPyAteV8gOiB5Xyk7XG4gICAgICAgICAgICBcclxuR2V0SGV4YWdvbkxvYyA9ICh4LCB5KSA9PiB5ID09IDAgPyAoKFN5c3RlbS5GdW5jPFRyaWFuZ2xlTG9jYXRpb24+KSgoKSA9PlxyXG57XHJcbiAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbihcInkgY2Fubm90IGJlIDBcIik7XHJcbn1cclxuXHJcbikpKCkgOiB4ID09IDAgPyB5ID09IC0xID8gVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b20gOiBUcmlhbmdsZUxvY2F0aW9uLlRvcCA6IHggPT0gLTEgPyB5ID09IC0xID8gVHJpYW5nbGVMb2NhdGlvbi5Ub3BMZWZ0IDogVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21MZWZ0IDogeCA9PSAxID8geSA9PSAtMSA/IFRyaWFuZ2xlTG9jYXRpb24uVG9wUmlnaHQgOiBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbVJpZ2h0IDogKChTeXN0ZW0uRnVuYzxUcmlhbmdsZUxvY2F0aW9uPikoKCkgPT5cclxue1xyXG4gICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oXCJ4IG11c3QgYmUgLTEsIDAgb3IgMVwiKTtcclxufVxyXG5cclxuKSkoKTtcbkdldEZpbmFsSGV4YWdvbkxvY1BvcyA9IChpbnZlcnRYLCBpbnZlcnRZKSA9PlxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChHZXRIZXhhZ29uTG9jUG9zKGludmVydFgsIGludmVydFkpLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oXzYwbCArIHgsIF82MHIgKyB5KTtcclxufVxyXG5cclxuO1xuQ3JlYXRlUG9zID0gKHBvcywgTikgPT4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBUcmlhbmdsZUxvY2F0aW9uPihwb3MuSXRlbTEsIHBvcy5JdGVtMiwgTik7XG5BZGRTcXVhcmUgPSAoaW50IGludmVydFgxLCBib29sIGludmVydFkxLCBpbnQgaW52ZXJ0WDIsIGJvb2wgaW52ZXJ0WTIsIGludCB4MU92ZXJyaWRlLCBpbnQgeDJPdmVycmlkZSkgPT5cclxue1xyXG4gICAgaW50IF82MGxfO1xyXG4gICAgaW50IF82MHJfO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChHZXRGaW5hbEhleGFnb25Mb2NQb3MoaW52ZXJ0WDEsIGludmVydFkxKSwgb3V0IF82MGxfLCBvdXQgXzYwcl8pO1xyXG4gICAgaWYgKHgxT3ZlcnJpZGUgIT0gMClcclxuICAgICAgICBfNjBsXyA9IHgxT3ZlcnJpZGU7XHJcbiAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4gcG9zMiA9IEdldEhleGFnb25Mb2NQb3MoaW52ZXJ0WDIsIGludmVydFkyKTtcclxuICAgIGlmICh4Mk92ZXJyaWRlICE9IDApXHJcbiAgICAgICAgcG9zMi5JdGVtMSA9IHgyT3ZlcnJpZGU7XHJcbiAgICBUcmlhbmdsZUxvY2F0aW9uIG5fID0gR2V0SGV4YWdvbkxvYyhwb3MyLkl0ZW0xLCBwb3MyLkl0ZW0yKTtcclxuICAgIHZhciBjb29yZHNfID0gQ3JlYXRlUG9zKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oXzYwbF8sIF82MHJfKSwgbl8pO1xyXG4gICAgU3F1YXJlVHlwZSBzcXVhcmVJbmZvO1xyXG4gICAgaWYgKFNxdWFyZXMuVHJ5R2V0VmFsdWUoY29vcmRzXywgb3V0IHNxdWFyZUluZm8pKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChzcXVhcmVJbmZvLklzQWxpdmUoKSlcclxuICAgICAgICAgICAgYWRqYWNlbnRDZWxscyArPSAxO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAgICAgIGVtcHR5QWRqQWN0aW9uICE9IG51bGwgPyBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKSA9PiBlbXB0eUFkakFjdGlvbi5JbnZva2UoY29vcmRzXykpIDogbnVsbDtcclxufVxyXG5cclxuO1xuXHJcbiAgICAgICAgICAgIHN3aXRjaCAobilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQ6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uVG9wUmlnaHQ6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tTGVmdDpcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21SaWdodDpcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpbnZlcnRZIGlzIC0xLCB0aGVuIHRoZSB5IGNvb3JkaW5hdGUgaXMgcmVtb3ZlZC5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpbnZlcnRZIGlzIDAsIHRoZW4gdGhlIHkgY29vcmRpbmF0ZSBpcyBub3QgaW52ZXJ0ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaW52ZXJ0WSBpcyAxLCB0aGVuIHRoZSB5IGNvb3JkaW5hdGUgaXMgaW52ZXJ0ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaW52ZXJ0WCBpcyAwLCB0aGVuIHRoZSB4IGNvb3JkaW5hdGUgaXMgbm90IGludmVydGVkLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGludmVydFggaXMgMSwgdGhlbiB0aGUgeCBjb29yZGluYXRlIGlzIGludmVydGVkLlxyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgxLCB0cnVlLCAwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDEsIGZhbHNlLCAwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKC0xLCB0cnVlLCAwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDEsIGZhbHNlLCAwLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoLTEsIGZhbHNlLCAwLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMCwgdHJ1ZSwgLTEsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoLTEsIHRydWUsIC0xLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uVG9wOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbTpcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMCwgdHJ1ZSwgMCwgZmFsc2UsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCB0cnVlLCAwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDAsIHRydWUsIDAsIGZhbHNlLCAtMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDAsIGZhbHNlLCAwLCBmYWxzZSwgMSwgLTEpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCB0cnVlLCAwLCBmYWxzZSwgMSwgLTEpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCBmYWxzZSwgMCwgZmFsc2UsIC0xLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMCwgdHJ1ZSwgMCwgZmFsc2UsIC0xLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oXCJuIG11c3QgYmUgMCwgMSwgMiwgMywgNCBvciA1XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYWRqYWNlbnRDZWxscyA+IEFwcC5tYXhBZGphY2VudENlbGxzID8gQXBwLm1heEFkamFjZW50Q2VsbHMgOiBhZGphY2VudENlbGxzO1xyXG4gICAgICAgIH1cclxucHJpdmF0ZSBkZWxlZ2F0ZSB2b2lkIF9fX0FkZFNxdWFyZV9EZWxlZ2F0ZV8wKGludCBpbnZlcnRYMSwgYm9vbCBpbnZlcnRZMSwgaW50IGludmVydFgyLCBib29sIGludmVydFkyLCBpbnQgeDFPdmVycmlkZSA9IDAsIGludCB4Mk92ZXJyaWRlID0gMCk7ICAgIH1cclxufVxyXG4iXQp9Cg==
