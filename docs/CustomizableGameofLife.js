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
                            CustomizableGameofLife.App.livingRules = Newtonsoft.Json.JsonConvert.DeserializeObject(JSON.stringify(rulesObj.livingRules), System.Array.type(System.Boolean));
                        }
                        if (rulesObj.deadRules instanceof Array) {
                            CustomizableGameofLife.App.deadRules = Newtonsoft.Json.JsonConvert.DeserializeObject(JSON.stringify(rulesObj.deadRules), System.Array.type(System.Boolean));
                        }
                        if (rulesObj.adjacencyRules instanceof Array) {
                            CustomizableGameofLife.App.adjacencyRules = Newtonsoft.Json.JsonConvert.DeserializeObject(JSON.stringify(rulesObj.adjacencyRules), System.Array.type(System.Int32));
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

            var adjacencyRulesTable = ($t = document.createElement("table"), $t.style.marginLeft = "auto", $t.style.marginRight = "auto", $t);
            {
                var n = 0;
                for (var y = 0; y < 3; y = (y + 1) | 0) {
                    var row = ((e, c) => c.appendChild(e))(document.createElement("tr"), adjacencyRulesTable);
                    for (var x = 0; x < 3; x = (x + 1) | 0) {
                        if (x === 1 && y === 1) {
                            row.appendChild(document.createElement("td"));
                            continue;
                        }
                        CustomizableGameofLife.App.adjacencyRulesCells.add(CustomizableGameofLife.Extensions.SetAdjacencyValue(((e, c) => c.appendChild(e))(CustomizableGameofLife.App.Create012Selector(), ((e, c) => c.appendChild(e))(document.createElement("td"), row)), CustomizableGameofLife.App.adjacencyRules[System.Array.index(n, CustomizableGameofLife.App.adjacencyRules)]));
                        n = (n + 1) | 0;
                    }
                }
            }

            var rulesTable = CustomizableGameofLife.Extensions.Add(HTMLTableElement, ($t = document.createElement("table"), $t.style.marginLeft = "auto", $t.style.marginRight = "auto", $t), [CustomizableGameofLife.Extensions.Add(HTMLTableRowElement, document.createElement("tr"), [CustomizableGameofLife.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["#"]), CustomizableGameofLife.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["L"]), CustomizableGameofLife.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["D"])])]);

            for (var n1 = 0; n1 <= CustomizableGameofLife.App.maxAdjacentCells; n1 = (n1 + 1) | 0) {
                var row1 = ((e, c) => c.appendChild(e))(document.createElement("tr"), rulesTable);
                CustomizableGameofLife.Extensions.Add(HTMLTableRowElement, row1, [CustomizableGameofLife.Extensions.Add(HTMLTableCellElement, document.createElement("td"), [Bridge.toString(n1)])]);
                CustomizableGameofLife.App.optionCells.add(new (System.ValueTuple$2(HTMLInputElement,HTMLInputElement)).$ctor1(CustomizableGameofLife.Extensions.SetBoolValue(((e, c) => c.appendChild(e))(CustomizableGameofLife.App.CreateCheckbox(), ((e, c) => c.appendChild(e))(document.createElement("td"), row1)), CustomizableGameofLife.App.livingRules[System.Array.index(n1, CustomizableGameofLife.App.livingRules)]), CustomizableGameofLife.Extensions.SetBoolValue(((e, c) => c.appendChild(e))(CustomizableGameofLife.App.CreateCheckbox(), ((e, c) => c.appendChild(e))(document.createElement("td"), row1)), CustomizableGameofLife.App.deadRules[System.Array.index(n1, CustomizableGameofLife.App.deadRules)])));
            }

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
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [CustomizableGameofLife.Extensions.Add(HTMLDetailsElement, ($t1 = document.createElement("details"), $t1.open = true, $t1), [CustomizableGameofLife.Extensions.Add(HTMLElement, document.createElement("summary"), ["Adjacency Rules"]), adjacencyRulesTable]), CustomizableGameofLife.Extensions.Add(HTMLDetailsElement, ($t1 = document.createElement("details"), $t1.open = true, $t1), [CustomizableGameofLife.Extensions.Add(HTMLElement, document.createElement("summary"), ["Rules"]), rulesTable])]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [document.createElement("br"), presetsDiv, document.createElement("br")]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t1 = document.createElement("button"), $t1.className = "btn btn-primary", $t1.onclick = function (e) {
                for (var n2 = 0; n2 < CustomizableGameofLife.App.maxAdjacentCells; n2 = (n2 + 1) | 0) {
                    CustomizableGameofLife.App.adjacencyRules[System.Array.index(n2, CustomizableGameofLife.App.adjacencyRules)] = CustomizableGameofLife.Extensions.AdjacencyValue(CustomizableGameofLife.App.adjacencyRulesCells.getItem(n2));
                }
                for (var n3 = 0; n3 <= CustomizableGameofLife.App.maxAdjacentCells; n3 = (n3 + 1) | 0) {
                    CustomizableGameofLife.App.livingRules[System.Array.index(n3, CustomizableGameofLife.App.livingRules)] = CustomizableGameofLife.Extensions.BoolValue(CustomizableGameofLife.App.optionCells.getItem(n3).$clone().Item1);
                    CustomizableGameofLife.App.deadRules[System.Array.index(n3, CustomizableGameofLife.App.deadRules)] = CustomizableGameofLife.Extensions.BoolValue(CustomizableGameofLife.App.optionCells.getItem(n3).$clone().Item2);
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
                var x1 = { };
                var y1 = { };
                Bridge.Deconstruct(CustomizableGameofLife.App.MousePos(e).$clone(), x1, y1);
                draggingPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(((x1.v - CustomizableGameofLife.App.offsetPos.Item1) | 0), ((y1.v - CustomizableGameofLife.App.offsetPos.Item2) | 0));
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
                }
            },
            ctors: {
                init: function () {
                    var $t, $t1, $t2, $t3, $t4;
                    this.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32))();
                    this.LastBottomCanvas = new (System.ValueTuple$3(System.Int32,CustomizableGameofLife.GridType,HTMLCanvasElement))();
                    this.maxAdjacentCells = 8;
                    this.xMultiplier = 20;
                    this.screenWidth = window.innerWidth;
                    this.screenHeight = window.innerHeight;
                    this.Hotbar = CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, ($t = document.createElement("div"), $t.style.position = "absolute", $t.style.left = "100px", $t.style.top = System.String.format("{0}px", [Bridge.box(((window.innerHeight - 40) | 0), System.Int32)]), $t), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.Reset(true);
                    }, $t), ["Blank"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.Reset();
                    }, $t), ["Reset"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.SaveAsStarter();
                    }, $t), ["Save as Starter"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.Zoom(false);
                    }, $t), ["Zoom Out"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.Zoom(true);
                    }, $t), ["Zoom In"])]), [($t = CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t1 = document.createElement("button"), $t1.className = "btn btn-primary", $t1.onclick = function (e) {
                        CustomizableGameofLife.App.NextGridType();
                    }, $t1), [CustomizableGameofLife.Extensions.ToCamelString(CustomizableGameofLife.GridType, CustomizableGameofLife.GridType.Square)]), CustomizableGameofLife.App.NextGridTypeButton = $t, $t)]), [($t1 = CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t2 = document.createElement("button"), $t2.className = "btn btn-primary", $t2.onclick = function (e) {
                        CustomizableGameofLife.App.NextSquareType();
                    }, $t2), ["Wall"]), CustomizableGameofLife.App.NextSquareTypeButton = $t1, $t1)]), [($t2 = CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t3 = document.createElement("button"), $t3.className = "btn btn-primary", $t3.onclick = function (e) {
                        CustomizableGameofLife.App.InvertIsPlaying();
                    }, $t3), ["\u25b6"]), CustomizableGameofLife.App.PlayButton = $t2, $t2)]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t3 = document.createElement("button"), $t3.className = "btn btn-primary", $t3.onclick = function (e) {
                        CustomizableGameofLife.App.ShowModal(CustomizableGameofLife.App.ModalType.Settings);
                    }, $t3), ["\u2699"])]);
                    this.SquareTypePlacing = CustomizableGameofLife.SquareType.Count;
                    this.CurrentGridType = CustomizableGameofLife.GridType.Square;
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
                    this.livingRules = System.Array.init([false, false, true, true, false, false, false, false, false], System.Boolean);
                    this.deadRules = System.Array.init([false, false, false, true, false, false, false, false, false], System.Boolean);
                    this.adjacencyRules = System.Array.init([CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One], CustomizableGameofLife.AdjacencyType);
                    this.DOMCanvas = CustomizableGameofLife.App.CreateCanvas();
                    this.DOMCanvasContext = CustomizableGameofLife.App.DOMCanvas.getContext("2d");
                    this.Grid = new CustomizableGameofLife.SquareGrid();
                    this.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0);
                    this.adjacencyRulesCells = new (System.Collections.Generic.List$1(HTMLSelectElement)).ctor();
                    this.optionCells = new (System.Collections.Generic.List$1(System.ValueTuple$2(HTMLInputElement,HTMLInputElement))).ctor();
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
                    switch (CustomizableGameofLife.App.CurrentGridType) {
                        case CustomizableGameofLife.GridType.Square: 
                            CustomizableGameofLife.App.Grid = new CustomizableGameofLife.SquareGrid();
                            break;
                        case CustomizableGameofLife.GridType.Hex: 
                            CustomizableGameofLife.App.Grid = new CustomizableGameofLife.HexGrid();
                            break;
                    }
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
                SaveAsStarter: function () {
                    Bridge.global.localStorage.setItem("starterPositions", Newtonsoft.Json.JsonConvert.SerializeObject(CustomizableGameofLife.App.GetCoordinatesInteral()));
                },
                CreatePopup: function () {
                    var $t;
                    return ($t = document.createElement("div"), $t.style.fontSize = "1.5rem", $t.style.backgroundColor = "white", $t.style.position = "fixed", $t.style.top = "0px", $t.style.left = "25%", $t.style.width = "50%", $t.style.height = "100%", $t.style.display = "none", $t);
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
                    } else if (Bridge.is(CustomizableGameofLife.App.Grid, CustomizableGameofLife.TriangleGrid)) {
                        var grid = new CustomizableGameofLife.HexGrid();
                        var xOffset = (Bridge.Int.mul(((Bridge.Int.div(CustomizableGameofLife.App.width, 2)) | 0), CustomizableGameofLife.App.xMultiplier) + CustomizableGameofLife.App.offsetPos.Item1) | 0, yOffset = (Bridge.Int.mul(CustomizableGameofLife.App.height, CustomizableGameofLife.App.xMultiplier) + CustomizableGameofLife.App.offsetPos.Item2) | 0;

                        var minWidth = -2, minHeight = -2;
                        var maxWidth = Bridge.Int.clip32(Math.ceil(CustomizableGameofLife.App.hypo(CustomizableGameofLife.App.width, CustomizableGameofLife.App.height))), maxHeight = Bridge.Int.clip32(Math.ceil(CustomizableGameofLife.App.hypo(CustomizableGameofLife.App.width, CustomizableGameofLife.App.height)));
                        for (var _30l = (minWidth - 2) | 0; _30l <= (((maxWidth + 2) | 0)); _30l = (_30l + 1) | 0) {
                            var pos1 = grid.GetDrawPosition(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(_30l, ((minHeight - 3) | 0)));
                            var pos2 = grid.GetDrawPosition(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(_30l, ((maxHeight + 3) | 0)));
                            BottomCanvasContext.moveTo(pos1.Item1 + xOffset, pos1.Item2 + yOffset);
                            BottomCanvasContext.lineTo(pos2.Item1 + xOffset, pos2.Item2 + yOffset);
                        }
                        for (var _30r = (minHeight - 2) | 0; _30r <= (((maxHeight + 2) | 0)); _30r = (_30r + 1) | 0) {
                            var pos11 = grid.GetDrawPosition(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(((minWidth - 3) | 0), _30r));
                            var pos21 = grid.GetDrawPosition(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(((maxWidth + 3) | 0), _30r));
                            BottomCanvasContext.moveTo(pos11.Item1 + xOffset, pos11.Item2 + yOffset);
                            BottomCanvasContext.lineTo(pos21.Item1 + xOffset, pos21.Item2 + yOffset);
                        }
                        for (var y1 = (minHeight - 2) | 0; y1 <= (((maxHeight + 2) | 0)); y1 = (y1 + 1) | 0) {
                            var pos12 = grid.GetDrawPosition(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(((Bridge.Int.div(((-CustomizableGameofLife.App.width) | 0), CustomizableGameofLife.App.xMultiplier)) | 0), y1));
                            var pos22 = grid.GetDrawPosition(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(y1, ((Bridge.Int.div(((-CustomizableGameofLife.App.width) | 0), CustomizableGameofLife.App.xMultiplier)) | 0)));
                            BottomCanvasContext.moveTo(pos12.Item1 + xOffset, pos12.Item2 + yOffset);
                            BottomCanvasContext.lineTo(pos22.Item1 + xOffset, pos22.Item2 + yOffset);
                        }
                    } else if (Bridge.is(CustomizableGameofLife.App.Grid, CustomizableGameofLife.SquareGrid)) {
                        for (var x1 = 0; x1 <= (((CustomizableGameofLife.App.width + 2) | 0)); x1 = (x1 + 1) | 0) {
                            BottomCanvasContext.moveTo(Bridge.Int.mul(x1, CustomizableGameofLife.App.xMultiplier), 0);
                            BottomCanvasContext.lineTo(Bridge.Int.mul(x1, CustomizableGameofLife.App.xMultiplier), Bridge.Int.mul((((CustomizableGameofLife.App.height + 3) | 0)), CustomizableGameofLife.App.yMultiplier));
                        }
                        for (var y2 = 0; y2 <= (((CustomizableGameofLife.App.height + 2) | 0)); y2 = (y2 + 1) | 0) {
                            BottomCanvasContext.moveTo(0, Bridge.Int.mul(y2, CustomizableGameofLife.App.yMultiplier));
                            BottomCanvasContext.lineTo(Bridge.Int.mul((((CustomizableGameofLife.App.width + 3) | 0)), CustomizableGameofLife.App.xMultiplier), Bridge.Int.mul(y2, CustomizableGameofLife.App.yMultiplier));
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
                    var $t;
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
                                triangleGrid.DrawSquares$1(function (drawPos1, coords, squareType1) {
                                    CustomizableGameofLife.App.DOMCanvasContext.fillStyle = System.String.format("rgba(0, 0, 0, {0})", [Bridge.box(CustomizableGameofLife.App.GetSquareTypeAlpha(squareType1) / 255.0, System.Double, System.Double.format, System.Double.getHashCode)]);
                                    CustomizableGameofLife.App.DrawTriangle(CustomizableGameofLife.App.DOMCanvasContext, drawPos1.Item1, drawPos1.Item2, ((Bridge.Int.div(CustomizableGameofLife.App.xMultiplier, 2)) | 0), coords.Item3);
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
                DrawTriangle: function (context, hexX, hexY, hexRadius, loc) {
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
                    context.fill();
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
                Count: 2
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
                    if (CustomizableGameofLife.SquareExtensions.ContainsAlive(System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.TriangleLocation), this.Squares, new (System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.TriangleLocation)).$ctor1(_60l.v, _60r.v, loc))) {
                        adjacentCells = (adjacentCells + adjacencyRule) | 0;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDdXN0b21pemFibGVHYW1lb2ZMaWZlLmpzIiwKICAic291cmNlUm9vdCI6ICIiLAogICJzb3VyY2VzIjogWyJDbGFzczEuY3MiLCJFeHRlbnNpb25zLmNzIiwiTm90YWJsZU9iamVjdHNMaXN0LmNzIiwiU3F1YXJlLmNzIiwiR3JpZC5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQWdlQUEsd0JBQWlFQTtZQUNyREEscUJBQXdCQTtZQUNwQ0E7WUFBcUJBLElBQUlBLENBQUNBLEtBQUlBLDhDQUE2QkE7Z0JBRTNDQTtvQkFFSUEsZUFBbUJBLFdBQVdBO29CQUM5QkEsSUFBSUEsa0JBQWtCQTt3QkFFbEJBLElBQUlBLEFBQXFDQTs0QkFDckNBLHlDQUFjQSw4Q0FBc0NBLGVBQWVBLHVCQUF2QkE7O3dCQUNoREEsSUFBSUEsQUFBcUNBOzRCQUNyQ0EsdUNBQVlBLDhDQUFzQ0EsZUFBZUEscUJBQXZCQTs7d0JBQzlDQSxJQUFJQSxBQUFxQ0E7NEJBQ3JDQSw0Q0FBaUJBLDhDQUFxQ0EsZUFBZUEsMEJBQXRCQTs7Ozs7OztZQUsvREE7WUFDQUEsMEJBQTBCQTtZQUMxQkE7WUFDQUEsMEJBQTBCQTtZQUMxQkEsMEJBQTBCQTs7WUFFMUJBLDBCQUF1Q0E7O2dCQUVuQ0E7Z0JBQ0FBLEtBQUtBLFdBQVdBLE9BQU9BO29CQUVuQkEsVUFBMEJBLDZCQUE2REEsOEJBQTBCQTtvQkFDakhBLEtBQUtBLFdBQVdBLE9BQU9BO3dCQUVuQkEsSUFBSUEsV0FBVUE7NEJBRVZBLGdCQUFnQkE7NEJBQ2hCQTs7d0JBRUpBLG1EQUF3QkEsaUZBQTJEQSxnREFBb0JBLDZCQUFrRUEsOEJBQStCQSxPQUF3QkEsNkRBQWVBLEdBQWZBO3dCQUNoT0E7Ozs7O1lBS1pBLGlCQUE4QkEsd0RBQzFDQSwwR0FBK0VBLDJEQUMvREEsK0JBQTBCQSw0REFBc0ZBLHNDQUNoSUEsNERBQXNGQSxzQ0FDdEZBLDREQUFzRkE7O1lB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Q3ZFQTtvQkFDQUEsSUFBSUEseUJBQW9CQSxrQkFBYUE7d0JBRWpDQSxJQUFJQTs0QkFDQUE7Ozt3QkFHSkEscUNBQWtCQSxRQUFPQSxBQUF1Q0EsZUFBc0JBLG9CQUFZQTs7OztnQkFLOUZBLFFBQVFBO29CQUVKQSxLQUFLQTtvQkFDTEEsS0FBS0E7b0JBQ0xBLEtBQUtBO29CQUNMQSxLQUFLQTt3QkFNREE7d0JBQ0FBO3dCQUNBQSxVQUFVQTt3QkFDVkE7d0JBQ0FBLFVBQVVBO3dCQUNWQSxtQkFBbUJBO3dCQUNuQkEsVUFBVUEsVUFBVUE7d0JBQ3BCQTtvQkFDSkEsS0FBS0E7b0JBQ0xBLEtBQUtBO3dCQUNEQTt3QkFDQUE7d0JBQ0FBLDZCQUE2QkE7d0JBQzdCQSxpQ0FBaUNBO3dCQUNqQ0EsZ0NBQWdDQTt3QkFDaENBLDhCQUE4QkE7d0JBQzlCQSw2QkFBNkJBO3dCQUM3QkE7b0JBQ0pBO3dCQUNJQSxNQUFNQSxJQUFJQTs7O2dCQUdsQkEsT0FBT0EsZ0JBQWdCQSw4Q0FBdUJBLDhDQUF1QkEiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnM7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uRGlhZ25vc3RpY3MuQ29udHJhY3RzO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlJlZmxlY3Rpb247XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBBcHBcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCB4TXVsdGlwbGllciA9IDIwO1xyXG5wdWJsaWMgc3RhdGljIGludCB5TXVsdGlwbGllclxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4geE11bHRpcGxpZXI7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIGRvdWJsZSBhY3R1YWxYTXVsdGlwbGllclxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gR3JpZCBpcyBIZXhHcmlkID8geE11bHRpcGxpZXIgKiAyICogSGV4R3JpZC5jb3M2MCA6IHhNdWx0aXBsaWVyO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBkb3VibGUgYWN0dWFsWU11bHRpcGxpZXJcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIEdyaWQgaXMgSGV4R3JpZCA/IHlNdWx0aXBsaWVyICogMiAqIEhleEdyaWQuc2luNjAgOiB5TXVsdGlwbGllcjtcclxuICAgIH1cclxufSAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgc2NyZWVuV2lkdGggPSBXaW5kb3cuSW5uZXJXaWR0aCwgc2NyZWVuSGVpZ2h0ID0gV2luZG93LklubmVySGVpZ2h0O1xyXG5wdWJsaWMgc3RhdGljIGludCB3aWR0aFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gKGludClNYXRoLkNlaWxpbmcoKGRvdWJsZSlzY3JlZW5XaWR0aCAvIHhNdWx0aXBsaWVyKTtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgaW50IGhlaWdodFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gKGludClNYXRoLkNlaWxpbmcoKGRvdWJsZSlzY3JlZW5IZWlnaHQgLyB5TXVsdGlwbGllcik7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IEhvdGJhciA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU3R5bGUgPSB7XHJcbiAgICAgICAgICAgICAgICBQb3NpdGlvbiA9IFBvc2l0aW9uLkFic29sdXRlLFxyXG4gICAgICAgICAgICAgICAgTGVmdCA9IFwiMTAwcHhcIixcclxuICAgICAgICAgICAgICAgIFRvcCA9IHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLFdpbmRvdy5Jbm5lckhlaWdodCAtIDQwKSAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gUmVzZXQobWFrZUJsYW5rOiB0cnVlKVxyXG4gICAgICAgICAgICB9LFwiQmxhbmtcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gUmVzZXQoKVxyXG4gICAgICAgICAgICB9LFwiUmVzZXRcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIixcclxuICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+IFNhdmVBc1N0YXJ0ZXIoKVxyXG4gICAgICAgICAgICB9LFwiU2F2ZSBhcyBTdGFydGVyXCIpKVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFpvb20oem9vbUluOiBmYWxzZSlcclxuICAgICAgICAgICAgfSxcIlpvb20gT3V0XCIpKVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFpvb20oem9vbUluOiB0cnVlKVxyXG4gICAgICAgICAgICB9LFwiWm9vbSBJblwiKSlcclxuLE5leHRHcmlkVHlwZUJ1dHRvbiA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBOZXh0R3JpZFR5cGUoKVxyXG4gICAgICAgICAgICB9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5Ub0NhbWVsU3RyaW5nPEdyaWRUeXBlPihHcmlkVHlwZS5TcXVhcmUpKSlcclxuLE5leHRTcXVhcmVUeXBlQnV0dG9uID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IE5leHRTcXVhcmVUeXBlKClcclxuICAgICAgICAgICAgfSxcIldhbGxcIikpXHJcbixQbGF5QnV0dG9uID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IEludmVydElzUGxheWluZygpXHJcbiAgICAgICAgICAgIH0sXCLilrZcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gU2hvd01vZGFsKE1vZGFsVHlwZS5TZXR0aW5ncylcclxuICAgICAgICAgICAgfSxcIuKamVwiKSk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU3F1YXJlVHlwZSBTcXVhcmVUeXBlUGxhY2luZyA9IFNxdWFyZVR5cGUuQ291bnQ7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBHcmlkVHlwZSBDdXJyZW50R3JpZFR5cGUgPSBHcmlkVHlwZS5TcXVhcmU7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQnV0dG9uRWxlbWVudCBOZXh0R3JpZFR5cGVCdXR0b24sIE5leHRTcXVhcmVUeXBlQnV0dG9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgWm9vbSAoYm9vbCB6b29tSW4pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB4TXVsdGlwbGllciArPSB6b29tSW4gPyAxIDogLTE7XHJcbiAgICAgICAgICAgIGlmICh4TXVsdGlwbGllciA8PSAxKVxyXG4gICAgICAgICAgICAgICAgeE11bHRpcGxpZXIgPSAyO1xyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTmV4dFNxdWFyZVR5cGUgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNxdWFyZVR5cGVQbGFjaW5nID0gKFNxdWFyZVR5cGUpKCgoaW50KVNxdWFyZVR5cGVQbGFjaW5nICsgMSkgJSAoaW50KShTcXVhcmVUeXBlLkNvdW50ICsgMSkpO1xyXG4gICAgICAgICAgICBOZXh0U3F1YXJlVHlwZUJ1dHRvbi5Jbm5lckhUTUwgPSBTcXVhcmVUeXBlUGxhY2luZyA9PSBTcXVhcmVUeXBlLkNvdW50ID8gXCJXYWxsXCIgOiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuVG9DYW1lbFN0cmluZzxTcXVhcmVUeXBlPihTcXVhcmVUeXBlUGxhY2luZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTmV4dEdyaWRUeXBlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEN1cnJlbnRHcmlkVHlwZSA9IChHcmlkVHlwZSkoKChpbnQpQ3VycmVudEdyaWRUeXBlICsgMSkgJSAoaW50KUdyaWRUeXBlLkNvdW50KTtcclxuICAgICAgICAgICAgTmV4dEdyaWRUeXBlQnV0dG9uLklubmVySFRNTCA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5Ub0NhbWVsU3RyaW5nPEdyaWRUeXBlPihDdXJyZW50R3JpZFR5cGUpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKEN1cnJlbnRHcmlkVHlwZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBHcmlkVHlwZS5TcXVhcmU6XHJcbiAgICAgICAgICAgICAgICAgICAgR3JpZCA9IG5ldyBTcXVhcmVHcmlkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEdyaWRUeXBlLkhleDpcclxuICAgICAgICAgICAgICAgICAgICBHcmlkID0gbmV3IEhleEdyaWQoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIC8vY2FzZSBHcmlkVHlwZS5UcmlhbmdsZTpcclxuICAgICAgICAgICAgICAgIC8vICAgIEdyaWQgPSBuZXcgVHJpYW5nbGVHcmlkKCk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IFJpZ2h0SG90YmFyID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgIFBvc2l0aW9uID0gUG9zaXRpb24uQWJzb2x1dGUsXHJcbiAgICAgICAgICAgICAgICBSaWdodCA9IFwiMTAwcHhcIixcclxuICAgICAgICAgICAgICAgIFRvcCA9IHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLFdpbmRvdy5Jbm5lckhlaWdodCAtIDQwKSAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLWluZm9cIixcclxuICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+IFNob3dNb2RhbChNb2RhbFR5cGUuTm90YWJsZU9iamVjdHMpXHJcbiAgICAgICAgICAgIH0sXCJOb3RhYmxlIE9iamVjdHNcIikpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgUmVzZXQgKGJvb2wgbWFrZUJsYW5rID0gZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIUdsb2JhbC5Db25maXJtKFwiQW55IHVuc2F2ZWQgY2hhbmdlcyB3aWxsIGJlIGxvc3QuIENvbnRpbnVlP1wiKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBHcmlkLkNsZWFyKCk7XHJcbkdyaWQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PiBncmlkOyAgICAgICAgICAgIGlmICghbWFrZUJsYW5rICYmIChncmlkID0gR3JpZCBhcyBHcmlkPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4pICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG9mZnNldFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Qgc3RhcnRlclBvc2l0aW9ucyA9IEdsb2JhbC5Mb2NhbFN0b3JhZ2UuR2V0SXRlbShcInN0YXJ0ZXJQb3NpdGlvbnNcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRlclBvc2l0aW9ucyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyBzID0gKHN0cmluZylzdGFydGVyUG9zaXRpb25zO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc3RyaW5nLklzTnVsbE9yRW1wdHkocykpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIganNvblJhdyA9IEpTT04uUGFyc2UocykuVG9EeW5hbWljKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqc29uUmF3Lmxlbmd0aCA9PSAwIHx8IGpzb25SYXdbMF0uSXRlbTMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAodmFyIHBvcyBpbiAoSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPltdPihzKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZC5TcXVhcmVzLkFkZChwb3MsIFNxdWFyZVR5cGUuQ2VsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAodmFyIHNxdWFyZUluZm8gaW4gKEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxTcXVhcmVUeXBlID5bXT4ocykpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyaWQuU3F1YXJlcy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihzcXVhcmVJbmZvLkl0ZW0xLCBzcXVhcmVJbmZvLkl0ZW0yKSwgc3F1YXJlSW5mby5JdGVtMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwbGF5aW5nKVxyXG4gICAgICAgICAgICAgICAgSW52ZXJ0SXNQbGF5aW5nKCk7XHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsU3F1YXJlVHlwZSA+PiBHZXRDb29yZGluYXRlc0ludGVyYWwoKVxyXG4gICAgICAgIHtcclxuR3JpZDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+IGc7ICAgICAgICAgICAgaWYgKChnID0gR3JpZCBhcyBHcmlkPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4pICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gb2Zmc2V0Q29vcmRzID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihOZWdEaXYob2Zmc2V0UG9zLkl0ZW0xLCAoaW50KWFjdHVhbFhNdWx0aXBsaWVyKSwgTmVnRGl2KG9mZnNldFBvcy5JdGVtMiwgKGludClhY3R1YWxZTXVsdGlwbGllcikpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuVG9MaXN0PEtleVZhbHVlUGFpcjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixTcXVhcmVUeXBlPj4oZy5TcXVhcmVzKS5Db252ZXJ0QWxsPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4+KChDb252ZXJ0ZXI8S2V5VmFsdWVQYWlyPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+LFNxdWFyZVR5cGU+LFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4+KShzID0+IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgU3F1YXJlVHlwZT4ocy5LZXkuSXRlbTEgKyBvZmZzZXRDb29yZHMuSXRlbTEsIHMuS2V5Lkl0ZW0yICsgb2Zmc2V0Q29vcmRzLkl0ZW0yLCBzLlZhbHVlKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsU3F1YXJlVHlwZSA+PigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9wdWJsaWMgc3RhdGljIExpc3Q8KGludCB4LCBpbnQgeSwgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKT4gR2V0Tm9ybWFsaXplZENvb3JkaW5hdGVzICgpXHJcbiAgICAgICAgLy97XHJcbiAgICAgICAgLy8gICAgTGlzdDwoaW50IHgsIGludCB5LCBTcXVhcmVUeXBlIHNxdWFyZVR5cGUpPiBjb29yZHMgPSBHZXRDb29yZGluYXRlc0ludGVyYWwoKTtcclxuICAgICAgICAvLyAgICBjb29yZHMgPSBjb29yZHMuV2hlcmUoYyA9PiBjLnggPj0gMCAmJiBjLnkgPj0gMCAmJiBjLnggPCB3aWR0aCAmJiBjLnkgPCBoZWlnaHQpLlRvTGlzdCgpO1xyXG4gICAgICAgIC8vICAgIGludCBtaW5YID0gY29vcmRzLk1pbihjID0+IGMueCksIG1pblkgPSBjb29yZHMuTWluKGMgPT4gYy55KTtcclxuICAgICAgICAvLyAgICBjb29yZHMgPSBjb29yZHMuU2VsZWN0KGMgPT4gKGMueCAtIG1pblgsIGMueSAtIG1pblksIGMuc3F1YXJlVHlwZSkpLlRvTGlzdCgpO1xyXG4gICAgICAgIC8vICAgIHJldHVybiBjb29yZHM7XHJcbiAgICAgICAgLy99XHJcblxyXG4gICAgICAgIC8vICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgR2V0Q29vcmRpbmF0ZXMgKClcclxuICAgICAgICAvLyAgICAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgc3RyaW5nIGNvZGVHZW5lcmF0ZWQgPSAkQFwiKG5ldyBIYXNoU2V0PChpbnQgeCwgaW50IHkpPlxyXG4gICAgICAgIC8ve3tcclxuICAgICAgICAvLyAgICB7c3RyaW5nLkpvaW4oXCIsXFxuICAgIFwiLCBHZXROb3JtYWxpemVkQ29vcmRpbmF0ZXMoKS5TZWxlY3QodCA9PiAkXCIoe3QueH0sIHt0Lnl9KVwiKSl9XHJcbiAgICAgICAgLy99fSwgXCJcIlVudGl0bGVkIE9iamVjdFwiXCIsIHtKU09OLlN0cmluZ2lmeSgkXCJ7KGFkamFjZW5jeVJ1bGVzLkFsbChhID0+IGEgPT0gQWRqYWNlbmN5VHlwZS5PbmUpID8gXCJcIiA6IChzdHJpbmcuQ29uY2F0KGFkamFjZW5jeVJ1bGVzLlNlbGVjdChrID0+IChpbnQpaykpKSArIFwiIC0+IFwiKX17c3RyaW5nLkNvbmNhdChkZWFkUnVsZXMuU2VsZWN0KGsgPT4gayA/IDEgOiAwKSl9IC8ge3N0cmluZy5Db25jYXQobGl2aW5nUnVsZXMuU2VsZWN0KGsgPT4gayA/IDEgOiAwKSl9XCIpfSlcIjtcclxuICAgICAgICAvLyAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IG1vZGFsLCBtb2RhbENvbnRlbnQgPSBcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICBuZXcgSFRNTERpdkVsZW1lbnQgeyBDbGFzc05hbWUgPSBcIm1vZGFsLWNvbnRlbnRcIiB9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIC5BZGRUbyhuZXcgSFRNTERpdkVsZW1lbnQgeyBDbGFzc05hbWUgPSBcIm1vZGFsLWRpYWxvZ1wiIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIC5BZGRUbyhtb2RhbCA9IG5ldyBIVE1MRGl2RWxlbWVudCB7IENsYXNzTmFtZSA9IFwibW9kYWxcIiwgU3R5bGUgPSB7IERpc3BsYXkgPSBcImluaGVyaXRcIiB9IH1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAuQWRkVG8oRG9jdW1lbnQuQm9keSlcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAvLyAgICAgICAgICAgIG1vZGFsQ29udGVudC5BZGQoXHJcblxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIG5ldyBIVE1MRGl2RWxlbWVudFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJtb2RhbC1oZWFkZXJcIlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIC5BZGQobmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuLWNsb3NlXCIsXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBPbkNsaWNrID0gZSA9PiBtb2RhbC5SZW1vdmUoKVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAuQWRkKG5ldyBIVE1MU3BhbkVsZW1lbnRcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbm5lckhUTUwgPSBcIiZ0aW1lcztcIlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcblxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICksXHJcblxyXG5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICBuZXcgSFRNTFByZUVsZW1lbnRcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwibW9kYWwtYm9keVwiLFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBTdHlsZSA9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIFtcInVzZXItc2VsZWN0XCJdID0gXCJ0ZXh0XCJcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIH0uQWRkKGNvZGVHZW5lcmF0ZWQpXHJcbiAgICAgICAgLy8gICAgICAgICAgICApO1xyXG4gICAgICAgIC8vICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBTYXZlQXNTdGFydGVyICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBHbG9iYWwuTG9jYWxTdG9yYWdlLlNldEl0ZW0oXHJcbiAgICAgICAgICAgICAgICBcInN0YXJ0ZXJQb3NpdGlvbnNcIiwgSnNvbkNvbnZlcnQuU2VyaWFsaXplT2JqZWN0KEdldENvb3JkaW5hdGVzSW50ZXJhbCgpKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBTZXR0aW5nc1BvcHVwLCBOb3RhYmxlT2JqZWN0c1BvcHVwO1xyXG5wdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IENyZWF0ZVBvcHVwKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MRGl2RWxlbWVudHtTdHlsZSA9IHtGb250U2l6ZSA9IFwiMS41cmVtXCIsIEJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIiwgUG9zaXRpb24gPSBQb3NpdGlvbi5GaXhlZCwgVG9wID0gXCIwcHhcIiwgTGVmdCA9IFwiMjUlXCIsIFdpZHRoID0gXCI1MCVcIiwgSGVpZ2h0ID0gXCIxMDAlXCIsIERpc3BsYXkgPSBEaXNwbGF5Lk5vbmV9fTtcclxufVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgUG9wdXBDb250YWluZXIgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgSFRNTERpdkVsZW1lbnQoKSwoX28xKT0+e19vMS5TdHlsZS5Qb3NpdGlvbj0gUG9zaXRpb24uRml4ZWQ7X28xLlN0eWxlLlRvcD0gXCIwXCI7X28xLlN0eWxlLkxlZnQ9IFwiMFwiO19vMS5TdHlsZS5XaWR0aD0gXCIxMDAlXCI7X28xLlN0eWxlW1wieC1pbmRleFwiXT0gOTk5OTk5O19vMS5TdHlsZS5IZWlnaHQ9IFwiMTAwJVwiO19vMS5TdHlsZS5CYWNrZ3JvdW5kQ29sb3I9IFwicmdiYSgwLCAwLCAwLCAwLjUpXCI7X28xLlN0eWxlLkRpc3BsYXk9IERpc3BsYXkuTm9uZTtyZXR1cm4gX28xO30pXHJcbixTZXR0aW5nc1BvcHVwID0gQ3JlYXRlUG9wdXAoKSlcclxuLE5vdGFibGVPYmplY3RzUG9wdXAgPSBDcmVhdGVQb3B1cCgpKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQnV0dG9uRWxlbWVudCBTZXR0aW5nc0J1dHRvbjtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQnV0dG9uRWxlbWVudCBQbGF5QnV0dG9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgSW52ZXJ0SXNQbGF5aW5nICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwbGF5aW5nID0gIXBsYXlpbmc7XHJcbiAgICAgICAgICAgIFBsYXlCdXR0b24uSW5uZXJIVE1MID0gcGxheWluZyA/IFwi4o+4XCIgOiBcIuKWtlwiO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBwbGF5aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbFtdIGxpdmluZ1J1bGVzICAgPSBuZXcgYm9vbFs5XSB7IGZhbHNlLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlIH07XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sW10gZGVhZFJ1bGVzICAgICA9IG5ldyBib29sWzldIHsgZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlIH07XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBBZGphY2VuY3lUeXBlW10gYWRqYWNlbmN5UnVsZXMgPSBuZXcgQWRqYWNlbmN5VHlwZVttYXhBZGphY2VudENlbGxzXSB7IEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSB9O1xyXG5wdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IENyZWF0ZUNhbnZhcygpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTENhbnZhc0VsZW1lbnR7V2lkdGggPSBzY3JlZW5XaWR0aCwgSGVpZ2h0ID0gc2NyZWVuSGVpZ2h0fTtcclxufXB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ3JlYXRlVG9wQ2FudmFzKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MQ2FudmFzRWxlbWVudHtXaWR0aCA9IHdpZHRoICsgMiwgSGVpZ2h0ID0gaGVpZ2h0ICsgMn07XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgZG91YmxlIGh5cG8oZG91YmxlIHgsIGRvdWJsZSB5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguU3FydChNYXRoLlBvdyh4LCAyKSArIE1hdGguUG93KHksIDIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBDcmVhdGVCb3R0b21DYW52YXMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgQm90dG9tQ2FudmFzID0gR3JpZCBpcyBIZXhHcmlkID9cclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MQ2FudmFzRWxlbWVudFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFdpZHRoID0gRE9NQ2FudmFzLldpZHRoICsgNCAqIHhNdWx0aXBsaWVyLFxyXG4gICAgICAgICAgICAgICAgICAgIEhlaWdodCA9IERPTUNhbnZhcy5IZWlnaHQgKyA0ICogeU11bHRpcGxpZXJcclxuICAgICAgICAgICAgICAgIH0gOlxyXG4gICAgICAgICAgICAgICAgbmV3IEhUTUxDYW52YXNFbGVtZW50XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgV2lkdGggPSBzY3JlZW5XaWR0aCArIDIgKiB4TXVsdGlwbGllcixcclxuICAgICAgICAgICAgICAgICAgICBIZWlnaHQgPSBzY3JlZW5IZWlnaHQgKyAyICogeU11bHRpcGxpZXJcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZhciBCb3R0b21DYW52YXNDb250ZXh0ID0gQm90dG9tQ2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlRyYW5zbGF0ZSgwLjUsIDAuNSk7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVdpZHRoID0gMTtcclxuSGV4R3JpZCBoOyAgICAgICAgICAgIGlmICgoaCA9IEdyaWQgYXMgSGV4R3JpZCkgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5TdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgICAgIGZvciAoaW50IGEgPSAtKGludCloeXBvKHdpZHRoLCBoZWlnaHQpOyBhIDwgKGludCloeXBvKHdpZHRoLCBoZWlnaHQpOyBhKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgYiA9IC0oaW50KWh5cG8od2lkdGgsIGhlaWdodCk7IGIgPCAoaW50KWh5cG8od2lkdGgsIGhlaWdodCk7IGIrKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbmludCB4O1xuaW50IHk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGguR2V0RHJhd1Bvc2l0aW9uKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oYSwgYikpLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkRyYXdIZXhhZ29uKHgsIHksIHhNdWx0aXBsaWVyICogMiAvIDMsIHN0cm9rZTogdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKEdyaWQgaXMgVHJpYW5nbGVHcmlkLyogfHwgR3JpZCBpcyBIZXhHcmlkKi8pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEhleEdyaWQgZ3JpZCA9IG5ldyBIZXhHcmlkKCk7XHJcbiAgICAgICAgICAgICAgICBkb3VibGUgeE9mZnNldCA9IHdpZHRoIC8gMiAqIEFwcC54TXVsdGlwbGllciArIG9mZnNldFBvcy5JdGVtMSAgICAgICAgICAgICAgICAgICAgICwgeU9mZnNldCA9IGhlaWdodCAqIEFwcC54TXVsdGlwbGllciArIG9mZnNldFBvcy5JdGVtMjtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnQgbWluV2lkdGggPSAtMiwgbWluSGVpZ2h0ID0gLTI7XHJcbiAgICAgICAgICAgICAgICBpbnQgbWF4V2lkdGggPSAoaW50KU1hdGguQ2VpbGluZyhoeXBvKHdpZHRoLCBoZWlnaHQpKSwgbWF4SGVpZ2h0ID0gKGludClNYXRoLkNlaWxpbmcoaHlwbyh3aWR0aCwgaGVpZ2h0KSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGludCBfMzBsID0gbWluV2lkdGggLSAyOyBfMzBsIDw9IChtYXhXaWR0aCArIDIpOyBfMzBsKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvczEgPSBncmlkLkdldERyYXdQb3NpdGlvbihuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KF8zMGwsIG1pbkhlaWdodCAtIDMpKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zMiA9IGdyaWQuR2V0RHJhd1Bvc2l0aW9uKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oXzMwbCwgbWF4SGVpZ2h0ICsgMykpO1xyXG4gICAgICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTW92ZVRvKHBvczEuSXRlbTErIHhPZmZzZXQsIHBvczEuSXRlbTIrIHlPZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKHBvczIuSXRlbTErIHhPZmZzZXQsIHBvczIuSXRlbTIrIHlPZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgXzMwciA9IG1pbkhlaWdodCAtIDI7IF8zMHIgPD0gKG1heEhlaWdodCArIDIpOyBfMzByKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvczEgPSBncmlkLkdldERyYXdQb3NpdGlvbihuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KG1pbldpZHRoIC0gMywgXzMwcikpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3MyID0gZ3JpZC5HZXREcmF3UG9zaXRpb24obmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihtYXhXaWR0aCArIDMsIF8zMHIpKTtcclxuICAgICAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbyhwb3MxLkl0ZW0xKyB4T2Zmc2V0LCBwb3MxLkl0ZW0yKyB5T2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVUbyhwb3MyLkl0ZW0xKyB4T2Zmc2V0LCBwb3MyLkl0ZW0yKyB5T2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAoaW50IHkgPSBtaW5IZWlnaHQgLSAyOyB5IDw9IChtYXhIZWlnaHQgKyAyKTsgeSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3MxID0gZ3JpZC5HZXREcmF3UG9zaXRpb24obmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pigtd2lkdGggLyB4TXVsdGlwbGllciwgeSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3MyID0gZ3JpZC5HZXREcmF3UG9zaXRpb24obmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih5LCAtd2lkdGggLyB4TXVsdGlwbGllcikpO1xyXG4gICAgICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTW92ZVRvKHBvczEuSXRlbTErIHhPZmZzZXQsIHBvczEuSXRlbTIrIHlPZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKHBvczIuSXRlbTErIHhPZmZzZXQsIHBvczIuSXRlbTIrIHlPZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKEdyaWQgaXMgU3F1YXJlR3JpZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgeCA9IDA7IHggPD0gKHdpZHRoICsgMik7IHgrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbyh4ICogeE11bHRpcGxpZXIsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKHggKiB4TXVsdGlwbGllciwgKGhlaWdodCArIDMpICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgeSA9IDA7IHkgPD0gKGhlaWdodCArIDIpOyB5KyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5Nb3ZlVG8oMCwgeSAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVUbygod2lkdGggKyAzKSAqIHhNdWx0aXBsaWVyLCB5ICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDwgMTA7IG4rKylcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuU3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBCb3R0b21DYW52YXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IERPTUNhbnZhcyA9IENyZWF0ZUNhbnZhcygpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIERPTUNhbnZhc0NvbnRleHQgPSBET01DYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgR3JpZCBHcmlkID0gbmV3IFNxdWFyZUdyaWQoKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gb2Zmc2V0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IE1vdXNlUG9zICh0aGlzIE1vdXNlRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciByZWN0ID0gRE9NQ2FudmFzLkdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KShlLkNsaWVudFggLSByZWN0LkxlZnQpLCAoaW50KShlLkNsaWVudFkgLSByZWN0LlRvcCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgTmVnRGl2IChpbnQgYSwgaW50IGIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgcmVzID0gYSAvIGI7XHJcbiAgICAgICAgICAgIHJldHVybiAoYSA8IDAgJiYgYSAhPSBiICogcmVzKSA/IHJlcyAtIDEgOiByZXM7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIGRvdWJsZSBOZWdEaXZEb3VibGUoZG91YmxlIGEsIGRvdWJsZSBiKVxyXG57XHJcbiAgICByZXR1cm4gYSA+PSAwID8gYSAvIGIgOiAoYSAtIGIgKyAxKSAvIGI7XHJcbn1cclxuICAgICAgICBwdWJsaWMgY29uc3QgaW50IG1heEFkamFjZW50Q2VsbHMgPSA4O1xyXG5cclxuICAgICAgICBzdGF0aWMgTGlzdDxIVE1MU2VsZWN0RWxlbWVudD4gYWRqYWNlbmN5UnVsZXNDZWxscyA9IG5ldyBMaXN0PEhUTUxTZWxlY3RFbGVtZW50PigpO1xyXG4gICAgICAgIHN0YXRpYyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPEhUTUxJbnB1dEVsZW1lbnQsSFRNTElucHV0RWxlbWVudD4+IG9wdGlvbkNlbGxzID0gbmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SFRNTElucHV0RWxlbWVudCxIVE1MSW5wdXRFbGVtZW50Pj4oKTtcclxuXHJcbiAgICAgICAgc3RhdGljIHZvaWQgQXBwbHlQcmVzZXQoYm9vbFtdIGxpdmluZ1J1bGVzLCBib29sW10gZGVhZFJ1bGVzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPD0gODsgbisrKVxyXG4gICAgICAgICAgICB7XHJcbm9wdGlvbkNlbGxzW25dLkl0ZW0xLlNldEJvb2xWYWx1ZShsaXZpbmdSdWxlc1tuXSk7XHJcbm9wdGlvbkNlbGxzW25dLkl0ZW0yLlNldEJvb2xWYWx1ZShkZWFkUnVsZXNbbl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZW51bSBNb2RhbFR5cGVcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNldHRpbmdzLFxyXG4gICAgICAgICAgICBOb3RhYmxlT2JqZWN0c1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFNob3dNb2RhbCAoTW9kYWxUeXBlIG1vZGFsVHlwZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFBvcHVwQ29udGFpbmVyLlN0eWxlLkRpc3BsYXkgPSBcIlwiO1xyXG4gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCB0b1Nob3c7XHJcbiAgICAgICAgICAgIHN3aXRjaCAobW9kYWxUeXBlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1vZGFsVHlwZS5TZXR0aW5nczpcclxuICAgICAgICAgICAgICAgICAgICB0b1Nob3cgPSBTZXR0aW5nc1BvcHVwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNb2RhbFR5cGUuTm90YWJsZU9iamVjdHM6XHJcbiAgICAgICAgICAgICAgICAgICAgdG9TaG93ID0gTm90YWJsZU9iamVjdHNQb3B1cDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEFyZ3VtZW50RXhjZXB0aW9uKCgoaW50KW1vZGFsVHlwZSkuVG9TdHJpbmcoKSwgXCJtb2RhbFR5cGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yZWFjaCAoSFRNTERpdkVsZW1lbnQgZGl2IGluIG5ld1tdIHsgU2V0dGluZ3NQb3B1cCwgTm90YWJsZU9iamVjdHNQb3B1cCB9KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkaXYuU3R5bGUuRGlzcGxheSA9IGRpdiA9PSB0b1Nob3cgPyBcIlwiIDogXCJub25lXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBIaWRlTW9kYWwgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFBvcHVwQ29udGFpbmVyLlN0eWxlLkRpc3BsYXkgPSBEaXNwbGF5Lk5vbmU7XHJcbiAgICAgICAgICAgIFNldHRpbmdzUG9wdXAuU3R5bGUuRGlzcGxheSA9IERpc3BsYXkuTm9uZTtcclxuICAgICAgICAgICAgTm90YWJsZU9iamVjdHNQb3B1cC5TdHlsZS5EaXNwbGF5ID0gRGlzcGxheS5Ob25lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBEcmF3U2hhcGUgKEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gU3F1YXJlcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCB4TXVsdGlwbGllciA9IEFwcC54TXVsdGlwbGllciAqIDI7XHJcbiAgICAgICAgICAgIGludCB5TXVsdGlwbGllciA9IEFwcC55TXVsdGlwbGllciAqIDI7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXR0aW5nIHdpZHRoIGFuZCBoZWlnaHQgb2Ygc2hhcGVcclxuICAgICAgICAgICAgaW50IHdpZHRoID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5NYXg8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4+KFNxdWFyZXMsKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4saW50PikocyA9PiBzLkl0ZW0xKSkgKyAxO1xyXG4gICAgICAgICAgICBpbnQgaGVpZ2h0ID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5NYXg8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4+KFNxdWFyZXMsKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4saW50PikocyA9PiBzLkl0ZW0yKSkgKyAxO1xyXG4gICAgICAgICAgICAvLyBEcmF3aW5nIG9uIGlubmVyIGNhbnZhc1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBpbm5lckNhbnZhcyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBXaWR0aCA9IHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgSGVpZ2h0ID0gaGVpZ2h0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBjb250ZXh0ID0gaW5uZXJDYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIFVpbnQ4Q2xhbXBlZEFycmF5IGltYWdlRGF0YUFycmF5ID0gQ3JlYXRlSW1hZ2VEYXRhQXJyYXkod2lkdGgsIGhlaWdodCk7XHJcbmZvcmVhY2ggKHZhciBfZDEgaW4gU3F1YXJlcylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2QxLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaW1hZ2VEYXRhQXJyYXlbKHggKyB5ICogd2lkdGgpICogNCArIDNdID0gMjU1O1xyXG59XG4gICAgICAgICAgICBJbWFnZURhdGEgaW1hZ2VEYXRhID0gbmV3IEltYWdlRGF0YShpbWFnZURhdGFBcnJheSwgKHVpbnQpd2lkdGgsICh1aW50KWhlaWdodCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuUHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XHJcbiAgICAgICAgICAgIC8vIFJlc2l6aW5nIHRvIHVwcGVyIGNhbnZhc1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBvdXRlckNhbnZhcyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBXaWR0aCA9IHdpZHRoICogeE11bHRpcGxpZXIsXHJcbiAgICAgICAgICAgICAgICBIZWlnaHQgPSBoZWlnaHQgKiB5TXVsdGlwbGllclxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgb3V0ZXJDb250ZXh0ID0gb3V0ZXJDYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIG91dGVyQ29udGV4dC5JbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgb3V0ZXJDb250ZXh0LkRyYXdJbWFnZShpbm5lckNhbnZhcywgMCwgMCwgb3V0ZXJDYW52YXMuV2lkdGgsIG91dGVyQ2FudmFzLkhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gb3V0ZXJDYW52YXM7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIFVpbnQ4Q2xhbXBlZEFycmF5IENyZWF0ZUltYWdlRGF0YUFycmF5KGludCB3aWR0aCwgaW50IGhlaWdodClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBVaW50OENsYW1wZWRBcnJheSh3aWR0aCAqIGhlaWdodCAqIDQpO1xyXG59cHVibGljIHN0YXRpYyBIVE1MSW5wdXRFbGVtZW50IENyZWF0ZUNoZWNrYm94KClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MSW5wdXRFbGVtZW50e1R5cGUgPSBJbnB1dFR5cGUuQ2hlY2tib3gsIFN0eWxlID0ge1dpZHRoID0gXCIxcmVtXCIsIEhlaWdodCA9IFwiMWVtXCJ9fTtcclxufXB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgQ3JlYXRlMDFTZWxlY3RvcigpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTFNlbGVjdEVsZW1lbnQoKS5BZGQ8SFRNTFNlbGVjdEVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudHtWYWx1ZSA9IFwiZmFsc2VcIn0sXCIwXCIpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcInRydWVcIn0sXCIxXCIpKTtcclxufXB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgQ3JlYXRlMDEyU2VsZWN0b3IoKVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MU2VsZWN0RWxlbWVudD4obmV3IEhUTUxTZWxlY3RFbGVtZW50KCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCIwXCJ9LFwiMFwiKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCIxXCJ9LFwiMVwiKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCIyXCJ9LFwiMlwiKSk7XHJcbn1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbiAoKVxyXG4gICAgICAgIHtcclxuU3lzdGVtLkFjdGlvbjxNb3VzZUV2ZW50PEhUTUxDYW52YXNFbGVtZW50Pj4gUHJvY2Vzc01vdXNlRXZlbnQgPSBudWxsO1xuICAgICAgICAgICAgb2JqZWN0IHJ1bGVzT2JqZWN0U3RyID0gR2xvYmFsLkxvY2FsU3RvcmFnZS5HZXRJdGVtKFwicnVsZXNcIik7XHJcbnN0cmluZyByOyAgICAgICAgICAgIGlmICgociA9IHJ1bGVzT2JqZWN0U3RyIGFzIHN0cmluZykgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pYyBydWxlc09iaiA9IEpTT04uUGFyc2Uocik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bGVzT2JqZWN0U3RyICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoU2NyaXB0LldyaXRlKFwiezB9IGluc3RhbmNlb2YgQXJyYXlcIiwgcnVsZXNPYmoubGl2aW5nUnVsZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGl2aW5nUnVsZXMgPSBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxib29sW10+KEpTT04uU3RyaW5naWZ5KHJ1bGVzT2JqLmxpdmluZ1J1bGVzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTY3JpcHQuV3JpdGUoXCJ7MH0gaW5zdGFuY2VvZiBBcnJheVwiLCBydWxlc09iai5kZWFkUnVsZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVhZFJ1bGVzID0gSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8Ym9vbFtdPihKU09OLlN0cmluZ2lmeShydWxlc09iai5kZWFkUnVsZXMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFNjcmlwdC5Xcml0ZShcInswfSBpbnN0YW5jZW9mIEFycmF5XCIsIHJ1bGVzT2JqLmFkamFjZW5jeVJ1bGVzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzID0gSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8aW50W10+KEpTT04uU3RyaW5naWZ5KHJ1bGVzT2JqLmFkamFjZW5jeVJ1bGVzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggeyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5TdHlsZVtcInVzZXItc2VsZWN0XCJdID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkhlYWQuQXBwZW5kQ2hpbGQobmV3IEhUTUxMaW5rRWxlbWVudCB7IFJlbCA9IFwic3R5bGVzaGVldFwiLCBIcmVmID0gXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2Jvb3RzdHJhcEA1LjIuMC9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzc1wiIH0pO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LlN0eWxlLk1hcmdpbiA9IFwiMHB4XCI7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQoUG9wdXBDb250YWluZXIpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKG5ldyBIVE1MU3R5bGVFbGVtZW50IHsgSW5uZXJIVE1MID0gXCJ0ZCwgdGggeyBib3JkZXI6IDFweCBzb2xpZCBibGFjazsgcGFkZGluZzogNXB4IH0gYnV0dG9uIHsgbWFyZ2luLXJpZ2h0OiA1cHggfVwiIH0pO1xyXG5cclxuICAgICAgICAgICAgSFRNTFRhYmxlRWxlbWVudCBhZGphY2VuY3lSdWxlc1RhYmxlID0gbmV3IEhUTUxUYWJsZUVsZW1lbnQgeyBTdHlsZSA9IHsgTWFyZ2luTGVmdCA9IFwiYXV0b1wiLCBNYXJnaW5SaWdodCA9IFwiYXV0b1wiIH0gfTtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW50IG4gPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgeSA9IDA7IHkgPCAzOyB5KyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgSFRNTFRhYmxlUm93RWxlbWVudCByb3cgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlUm93RWxlbWVudD4obmV3IEhUTUxUYWJsZVJvd0VsZW1lbnQoKSxhZGphY2VuY3lSdWxlc1RhYmxlKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCB4ID0gMDsgeCA8IDM7IHgrKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4ID09IDEgJiYgeSA9PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cuQXBwZW5kQ2hpbGQobmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzQ2VsbHMuQWRkKEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MU2VsZWN0RWxlbWVudD4oQ3JlYXRlMDEyU2VsZWN0b3IoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCkscm93KSkuU2V0QWRqYWNlbmN5VmFsdWUoYWRqYWNlbmN5UnVsZXNbbl0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbisrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgSFRNTFRhYmxlRWxlbWVudCBydWxlc1RhYmxlID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVFbGVtZW50PihcclxubmV3IEhUTUxUYWJsZUVsZW1lbnQgeyBTdHlsZSA9IHsgTWFyZ2luTGVmdCA9IFwiYXV0b1wiLCBNYXJnaW5SaWdodCA9IFwiYXV0b1wiIH0gfSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KFxyXG4gICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZVJvd0VsZW1lbnQoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudCgpLFwiI1wiKSxcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQoKSxcIkxcIiksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50KCksXCJEXCIpXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8PSBtYXhBZGphY2VudENlbGxzOyBuKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEhUTUxUYWJsZVJvd0VsZW1lbnQgcm93ID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KG5ldyBIVE1MVGFibGVSb3dFbGVtZW50KCkscnVsZXNUYWJsZSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlUm93RWxlbWVudD4oICAgICAgICAgICAgICAgIHJvdyxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudD4obmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpLG4uVG9TdHJpbmcoKSkpO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9uQ2VsbHMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxIVE1MSW5wdXRFbGVtZW50LCBIVE1MSW5wdXRFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTElucHV0RWxlbWVudD4oQ3JlYXRlQ2hlY2tib3goKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudD4obmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpLCByb3cpKS5TZXRCb29sVmFsdWUobGl2aW5nUnVsZXNbbl0pLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTElucHV0RWxlbWVudD4oQ3JlYXRlQ2hlY2tib3goKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudD4obmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpLCByb3cpKS5TZXRCb29sVmFsdWUoZGVhZFJ1bGVzW25dKSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZyAsYm9vbFtdICxib29sW10gPj4gcHJlc2V0c0xpc3QgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcgLGJvb2xbXSAsYm9vbFtdID4+KCksKF9vMSk9PntfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcsIGJvb2xbXSwgYm9vbFtdPihcIkNvbndheSdzIEdhbWUgb2YgTGlmZSBQcmVzZXRcIiwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCB0cnVlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9KSk7X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJJbW1vcnRhbCBDZWxscyBQcmVzZXRcIiwgbmV3IGJvb2xbOV17dHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZX0sIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0pKTtfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcsIGJvb2xbXSwgYm9vbFtdPihcIkFsbW9zdCBJbW1vcnRhbCBDZWxscyBQcmVzZXRcIiwgbmV3IGJvb2xbOV17dHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2V9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9KSk7X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJBbHRlcm5hdGUgQ29ud2F5J3MgR2FtZSBvZiBMaWZlIFByZXNldFwiLCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0sIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO3JldHVybiBfbzE7fSk7XHJcblxyXG4gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCBwcmVzZXRzRGl2ID0gbmV3IEhUTUxEaXZFbGVtZW50IHsgU3R5bGUgPSB7IFRleHRBbGlnbiA9IFRleHRBbGlnbi5DZW50ZXIgfSB9O1xyXG5mb3JlYWNoICh2YXIgX2QyIGluIHByZXNldHNMaXN0KVxyXG57XHJcbiAgICBzdHJpbmcgbmFtZTtcclxuICAgIGJvb2xbXSBsaXZpbmdSdWxlcztcclxuICAgIGJvb2xbXSBkZWFkUnVsZXM7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KF9kMiwgb3V0IG5hbWUsIG91dCBsaXZpbmdSdWxlcywgb3V0IGRlYWRSdWxlcyk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBwcmVzZXRzRGl2LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCgpLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEFuY2hvckVsZW1lbnQ+KG5ldyBIVE1MQW5jaG9yRWxlbWVudHtIcmVmID0gXCJqYXZhc2NyaXB0OnZvaWQoMClcIiwgU3R5bGUgPSB7Rm9udFNpemUgPSBcIjFyZW1cIn0sIE9uQ2xpY2sgPSBlID0+IEFwcGx5UHJlc2V0KGxpdmluZ1J1bGVzOiBsaXZpbmdSdWxlcywgZGVhZFJ1bGVzOiBkZWFkUnVsZXMpfSxuYW1lKSkpO1xyXG59XG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihcclxuXHJcbiAgICAgICAgICAgIFNldHRpbmdzUG9wdXAsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGV0YWlsc0VsZW1lbnQ+KFxyXG4gICAgICAgICAgICAgICAgbmV3IEhUTUxEZXRhaWxzRWxlbWVudCB7IE9wZW4gPSB0cnVlfSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxTdW1tYXJ5RWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFN1bW1hcnlFbGVtZW50KCksXCJBZGphY2VuY3kgUnVsZXNcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXNUYWJsZVxyXG4gICAgICAgICAgICAgICAgKSxcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGV0YWlsc0VsZW1lbnQ+KFxyXG4gICAgICAgICAgICAgICAgbmV3IEhUTUxEZXRhaWxzRWxlbWVudCB7IE9wZW4gPSB0cnVlIH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MU3VtbWFyeUVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxTdW1tYXJ5RWxlbWVudCgpLFwiUnVsZXNcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgcnVsZXNUYWJsZVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBTZXR0aW5nc1BvcHVwLG5ldyBIVE1MQlJFbGVtZW50KCksIHByZXNldHNEaXYsIG5ldyBIVE1MQlJFbGVtZW50KCkpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBTZXR0aW5nc1BvcHVwLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLFxyXG4gICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT5cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8IG1heEFkamFjZW50Q2VsbHM7IG4rKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzW25dID0gYWRqYWNlbmN5UnVsZXNDZWxsc1tuXS5BZGphY2VuY3lWYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8PSBtYXhBZGphY2VudENlbGxzOyBuKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXZpbmdSdWxlc1tuXSA9IG9wdGlvbkNlbGxzW25dLkl0ZW0xLkJvb2xWYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWFkUnVsZXNbbl0gPSBvcHRpb25DZWxsc1tuXS5JdGVtMi5Cb29sVmFsdWUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsLkxvY2FsU3RvcmFnZS5TZXRJdGVtKFwicnVsZXNcIiwgSnNvbkNvbnZlcnQuU2VyaWFsaXplT2JqZWN0KG5ld1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGl2aW5nUnVsZXMgPSBsaXZpbmdSdWxlcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVhZFJ1bGVzID0gZGVhZFJ1bGVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlcyA9IGFkamFjZW5jeVJ1bGVzXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIEhpZGVNb2RhbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFwiU2F2ZSBDaGFuZ2VzXCIpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oXHJcbiAgICAgICAgICAgIE5vdGFibGVPYmplY3RzUG9wdXAsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1saWdodFwiLFxyXG4gICAgICAgICAgICAgICAgU3R5bGUgPSB7IENzc0Zsb2F0ID0gRmxvYXQuUmlnaHQgfSxcclxuICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+IEhpZGVNb2RhbCgpXHJcbiAgICAgICAgICAgIH0sXCLinYxcIikpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBOb3RhYmxlT2JqZWN0c1BvcHVwLG5ldyBIVE1MRGl2RWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTdHlsZSA9IHsgQ2xlYXIgPSBDbGVhci5Cb3RoIH1cclxuICAgICAgICAgICAgfSk7XHJcbmZvcmVhY2ggKHZhciBfZDMgaW4gTm90YWJsZU9iamVjdHNMaXN0Lk5vdGFibGVPYmplY3RzKVxyXG57XHJcbiAgICBIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4gb2JqZWN0RGV0YWlscztcclxuICAgIHN0cmluZyBkZXNjcmlwdGlvbjtcclxuICAgIHN0cmluZyBydWxlcztcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2QzLCBvdXQgb2JqZWN0RGV0YWlscywgb3V0IGRlc2NyaXB0aW9uLCBvdXQgcnVsZXMpO1xyXG4gICAgSFRNTERpdkVsZW1lbnQgb2JqZWN0SW5mbyA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50e1N0eWxlID0ge1dpZHRoID0gXCIzMHJlbVwifX0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnR7U3R5bGUgPSB7RGlzcGxheSA9IERpc3BsYXkuRmxleCwgQWxpZ25JdGVtcyA9IEFsaWduSXRlbXMuQ2VudGVyLCBGbGV4RGlyZWN0aW9uID0gRmxleERpcmVjdGlvbi5Db2x1bW59fSxOb3RhYmxlT2JqZWN0c1BvcHVwKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudHtTdHlsZSA9IHtEaXNwbGF5ID0gRGlzcGxheS5GbGV4LCBBbGlnbkl0ZW1zID0gQWxpZ25JdGVtcy5DZW50ZXIsIEZsZXhEaXJlY3Rpb24gPSBGbGV4RGlyZWN0aW9uLkNvbHVtbn19LERyYXdTaGFwZShvYmplY3REZXRhaWxzKSkpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgb2JqZWN0SW5mbyxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnQoKSxkZXNjcmlwdGlvbikpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgb2JqZWN0SW5mbyxydWxlcyk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLG5ldyBIVE1MQlJFbGVtZW50KCkpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgb2JqZWN0SW5mbyxuZXcgSFRNTEJSRWxlbWVudCgpKTtcclxufVxuXHJcbiAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IGJhY2tncm91bmREaXYgPSBuZXcgSFRNTERpdkVsZW1lbnQgeyBTdHlsZSA9IHsgUG9zaXRpb24gPSBQb3NpdGlvbi5SZWxhdGl2ZSwgTWluV2lkdGggPSBcIjBcIiwgTWluSGVpZ2h0ID0gXCIwXCIgfX07XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5PdmVyZmxvdyA9IE92ZXJmbG93LkhpZGRlbjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLlpJbmRleCA9IFwiLTFcIjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLlBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuTGVmdCA9IFwiMHB4XCI7XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5Ub3AgPSBcIjBweFwiO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBiYWNrZ3JvdW5kRGl2LERPTUNhbnZhcyk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIGJhY2tncm91bmREaXYsSG90YmFyKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgYmFja2dyb3VuZERpdixSaWdodEhvdGJhcik7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQoYmFja2dyb3VuZERpdik7XHJcblxyXG4gICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYWdnaW5nUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBvcmlnaW5hbFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgIGJvb2wgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBET01DYW52YXMuT25Nb3VzZURvd24gPSBlID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gdHJ1ZTtcclxuaW50IHg7XG5pbnQgeTtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoZS5Nb3VzZVBvcygpLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmdQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHggLSBvZmZzZXRQb3MuSXRlbTEsIHkgLSBvZmZzZXRQb3MuSXRlbTIpO1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxQb3MgPSBvZmZzZXRQb3M7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5Pbk1vdXNlVXAgPSBlID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTEtIG9yaWdpbmFsUG9zLkl0ZW0xKSA+IHhNdWx0aXBsaWVyIHx8IE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMi0gb3JpZ2luYWxQb3MuSXRlbTIpID4geU11bHRpcGxpZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nUG9zID0gb2Zmc2V0UG9zO1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBET01DYW52YXMuT25Nb3VzZU1vdmUgPSBlID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICgoZS5CdXR0b25zICYgMSkgPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRyYWdnaW5nUG9zID09IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCkpIGRyYWdnaW5nUG9zID0gZS5Nb3VzZVBvcygpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vdXNlUG9zID0gZS5Nb3VzZVBvcygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMS0gb3JpZ2luYWxQb3MuSXRlbTEpID4geE11bHRpcGxpZXIgfHwgTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0xLSBvcmlnaW5hbFBvcy5JdGVtMSkgPiB5TXVsdGlwbGllcilcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pihtb3VzZVBvcy5JdGVtMSAtIGRyYWdnaW5nUG9zLkl0ZW0xLCBtb3VzZVBvcy5JdGVtMiAtIGRyYWdnaW5nUG9zLkl0ZW0yKTtcclxuICAgICAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICAgICAgfTtcclxuUHJvY2Vzc01vdXNlRXZlbnQgPSAoZSkgPT5cclxue1xyXG4gICAgLy9pZiAoKEBldmVudC5CdXR0b25zICYgMSkgPT0gMCkgcmV0dXJuO1xyXG4gICAgdmFyIG1vdXNlUG9zID0gZS5Nb3VzZVBvcygpO1xyXG4gICAgR3JpZC5IYW5kbGVDbGljayhuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KG1vdXNlUG9zLkl0ZW0xIC0gb2Zmc2V0UG9zLkl0ZW0xLCBtb3VzZVBvcy5JdGVtMiAtIG9mZnNldFBvcy5JdGVtMiksIFNxdWFyZVR5cGVQbGFjaW5nKTtcclxuICAgIERyYXcoKTtcclxufVxyXG5cclxuO1xuICAgICAgICAgICAgRE9NQ2FudmFzLk9uQ2xpY2sgPSBlID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGFuZ2luZ0ludGVudClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBQcm9jZXNzTW91c2VFdmVudChlKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgR2xvYmFsLlNldEludGVydmFsKChBY3Rpb24pTmV4dEZyYW1lLCAxMDApO1xyXG5cclxuICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIHVwZGF0aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBIYXNEaXZpZGVycyAodGhpcyBEaWN0aW9uYXJ5PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4sIERpdmlkZXJzSW5mbz4gZGl2aWRlcnMsIGludCB4LCBpbnQgeSwgaW50IEwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBEaXZpZGVyc0luZm8gdG9DaGVjaztcclxuICAgICAgICAgICAgc3dpdGNoIChMKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgeC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHktLTtcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHktLTtcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLkJvdHRvbTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICB5LS07XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b21SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICB4LS07XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLlJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA2OlxyXG4gICAgICAgICAgICAgICAgICAgIHgtLTtcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OlxyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uQm90dG9tO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA4OlxyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuRGl2aWRlcnNJbmZvIGRpdmlkZXJzSW5mbztcbiAgICAgICAgICAgIHJldHVybiBkaXZpZGVycy5UcnlHZXRWYWx1ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHgsIHkpLCBvdXQgZGl2aWRlcnNJbmZvKSAmJiAoZGl2aWRlcnNJbmZvICYgdG9DaGVjaykgIT0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxHcmlkVHlwZSAsSFRNTENhbnZhc0VsZW1lbnQgPiBMYXN0Qm90dG9tQ2FudmFzID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgR3JpZFR5cGUsIEhUTUxDYW52YXNFbGVtZW50PigwLCBHcmlkVHlwZS5Db3VudCwgbnVsbCk7XHJcbnB1YmxpYyBzdGF0aWMgYnl0ZSBHZXRTcXVhcmVUeXBlQWxwaGEoU3F1YXJlVHlwZSBzcXVhcmVUeXBlKVxyXG57XHJcbiAgICByZXR1cm4gKGJ5dGUpKHNxdWFyZVR5cGUgPT0gU3F1YXJlVHlwZS5DZWxsID8gMjU1IDogc3F1YXJlVHlwZSA9PSBTcXVhcmVUeXBlLkJyaWNrID8gMTcwIDogc3F1YXJlVHlwZSA9PSBTcXVhcmVUeXBlLkltbW9ydGFsQ2VsbCA/IDg1IDogKChTeXN0ZW0uRnVuYzxpbnQ+KSgoKSA9PlxyXG4gICAge1xyXG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJVbmtub3duIHNxdWFyZSB0eXBlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgICkpKCkpO1xyXG59XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgRHJhdygpXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGRvdWJsZSwgZG91YmxlPj8gPiBEcmF3TWFya2VyID0gbnVsbDtcblN5c3RlbS5BY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+PyAsIFN5c3RlbS5WYWx1ZVR1cGxlPGRvdWJsZSwgZG91YmxlPj8gPiBEcmF3TGluZSA9IG51bGw7XG5TeXN0ZW0uRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4sIFN5c3RlbS5WYWx1ZVR1cGxlPGRvdWJsZSwgZG91YmxlPj8gPiBHZXRGaW5hbERyYXdQb3MgPSBudWxsO1xuU3lzdGVtLkZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+LCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4/ID4gR2V0RE9NRHJhd1BvcyA9IG51bGw7XG5TeXN0ZW0uRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4sIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj8gPiBHZXREcmF3UG9zID0gbnVsbDtcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IFRvcENhbnZhcyA9IENyZWF0ZVRvcENhbnZhcygpO1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBCb3R0b21DYW52YXMgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoTGFzdEJvdHRvbUNhbnZhcy5JdGVtMT09IHhNdWx0aXBsaWVyICYmIExhc3RCb3R0b21DYW52YXMuSXRlbTI9PSBDdXJyZW50R3JpZFR5cGUpXHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXMgPSBMYXN0Qm90dG9tQ2FudmFzLkl0ZW0zO1xyXG4gICAgICAgICAgICBpZiAoQm90dG9tQ2FudmFzID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhcyA9IENyZWF0ZUJvdHRvbUNhbnZhcygpO1xyXG4gICAgICAgICAgICAgICAgTGFzdEJvdHRvbUNhbnZhcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIEdyaWRUeXBlLCBIVE1MQ2FudmFzRWxlbWVudD4oeE11bHRpcGxpZXIsIEN1cnJlbnRHcmlkVHlwZSwgQm90dG9tQ2FudmFzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgVG9wQ2FudmFzQ29udGV4dCA9IFRvcENhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5DbGVhclJlY3QoMCwgMCwgRE9NQ2FudmFzLldpZHRoLCBET01DYW52YXMuSGVpZ2h0KTtcclxuaW50IG9mZnNldFg7XG5pbnQgb2Zmc2V0WTtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3Qob2Zmc2V0UG9zLCBvdXQgb2Zmc2V0WCwgb3V0IG9mZnNldFkpO1xyXG5HZXREcmF3UG9zID0gKHBvcykgPT5cclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QocG9zLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaW50IGRyYXdYID0geCArIChvZmZzZXRYIC8geE11bHRpcGxpZXIpICsgMSwgZHJhd1kgPSB5ICsgKG9mZnNldFkgLyB5TXVsdGlwbGllcikgKyAxO1xyXG4gICAgaWYgKGRyYXdYIDwgMCB8fCBkcmF3WCA+PSB3aWR0aCArIDIgfHwgZHJhd1kgPCAwIHx8IGRyYXdZID49IGhlaWdodCArIDIpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihkcmF3WCwgZHJhd1kpO1xyXG59XHJcblxyXG47XG5HZXRET01EcmF3UG9zID0gKHBvcykgPT5cclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QocG9zLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaW50IGRyYXdYID0geCArIG9mZnNldFgsIGRyYXdZID0geSArIG9mZnNldFk7XHJcbiAgICBpZiAoZHJhd1ggPCAwIHx8IGRyYXdYID49IHNjcmVlbldpZHRoIHx8IGRyYXdZIDwgMCB8fCBkcmF3WSA+PSBzY3JlZW5IZWlnaHQpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihkcmF3WCwgZHJhd1kpO1xyXG59XHJcblxyXG47XG5TcXVhcmVHcmlkIHNxdWFyZUdyaWQ7ICAgICAgICAgICAgaWYgKChzcXVhcmVHcmlkID0gR3JpZCBhcyBTcXVhcmVHcmlkKSAhPSBudWxsKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0VWludDhDbGFtcGVkQXJyYXkgaW1hZ2VEYXRhQXJyYXkgPSBDcmVhdGVJbWFnZURhdGFBcnJheSh3aWR0aCArIDIsIGhlaWdodCArIDIpO1xyXG5mb3JlYWNoICh2YXIgX2Q0IGluIHNxdWFyZUdyaWQuU3F1YXJlcylcclxue1xyXG4gICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+IHBvcztcclxuICAgIFNxdWFyZVR5cGUgc3F1YXJlVHlwZTtcclxuICAgIF9kNC5EZWNvbnN0cnVjdChvdXQgcG9zLCBvdXQgc3F1YXJlVHlwZSk7XHJcbiAgICB2YXIgZHJhd1BvcyA9IEdldERyYXdQb3MocG9zKTtcclxuICAgIGlmIChkcmF3UG9zID09IG51bGwpXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICBpbnQgZHJhd1g7XHJcbiAgICBpbnQgZHJhd1k7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGRyYXdQb3MuVmFsdWUsIG91dCBkcmF3WCwgb3V0IGRyYXdZKTtcclxuICAgIGludCBpZHggPSBkcmF3WCArIGRyYXdZICogKHdpZHRoICsgMik7XHJcbiAgICBpbWFnZURhdGFBcnJheVtpZHggKiA0ICsgM10gPSBHZXRTcXVhcmVUeXBlQWxwaGEoc3F1YXJlVHlwZSk7XHJcbn1cblx0XHRcdFx0SW1hZ2VEYXRhIGltYWdlRGF0YSA9IG5ldyBJbWFnZURhdGEoaW1hZ2VEYXRhQXJyYXksICh1aW50KSh3aWR0aCArIDIpLCAodWludCkoaGVpZ2h0ICsgMikpO1xyXG5cdFx0XHRcdFRvcENhbnZhc0NvbnRleHQuUHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XHJcbiAgICAgICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdJbWFnZShCb3R0b21DYW52YXMsIChvZmZzZXRYICUgeE11bHRpcGxpZXIpIC0geE11bHRpcGxpZXIsIChvZmZzZXRZICUgeU11bHRpcGxpZXIpIC0geU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICB9XHJcblx0XHRcdGVsc2Uge1xyXG4gICAgSGV4R3JpZCBoO1xyXG4gICAgaWYgKChoID0gR3JpZCBhcyBIZXhHcmlkKSAhPSBudWxsKVxyXG4gICAge1xyXG4gICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0ltYWdlKEJvdHRvbUNhbnZhcywgKG9mZnNldFggJSAoSGV4R3JpZC5jb3M2MCAqIDIgKiB4TXVsdGlwbGllcikpIC0gSGV4R3JpZC5jb3M2MCAqIDIgKiB4TXVsdGlwbGllciwgKG9mZnNldFkgJSAoSGV4R3JpZC5zaW42MCAqIDIgKiB5TXVsdGlwbGllcikpIC0gSGV4R3JpZC5zaW42MCAqIDIgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgR3JpZC5EcmF3U3F1YXJlcygoQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiwgU3F1YXJlVHlwZT4pKChTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4gZCwgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKSA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PyBkcmF3UG9zID0gR2V0RE9NRHJhd1BvcyhkKTtcclxuICAgICAgICAgICAgaWYgKCFkcmF3UG9zLkhhc1ZhbHVlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkZpbGxTdHlsZSA9IHN0cmluZy5Gb3JtYXQoXCJyZ2JhKDAsIDAsIDAsIHswfSlcIiwgR2V0U3F1YXJlVHlwZUFscGhhKHNxdWFyZVR5cGUpIC8gMjU1LjApO1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdIZXhhZ29uKChpbnQpZHJhd1Bvcy5WYWx1ZS5JdGVtMSwgKGludClkcmF3UG9zLlZhbHVlLkl0ZW0yLCB4TXVsdGlwbGllciAqIDIgLyAzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICkpO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAge1xyXG4gICAgICAgIFRyaWFuZ2xlR3JpZCB0cmlhbmdsZUdyaWQ7XHJcbiAgICAgICAgaWYgKCh0cmlhbmdsZUdyaWQgPSBHcmlkIGFzIFRyaWFuZ2xlR3JpZCkgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRyaWFuZ2xlR3JpZC5EcmF3U3F1YXJlcygoQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiwgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+LCBTcXVhcmVUeXBlPikoKFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiBkcmF3UG9zLCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4gY29vcmRzLCBTcXVhcmVUeXBlIHNxdWFyZVR5cGUpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRmlsbFN0eWxlID0gc3RyaW5nLkZvcm1hdChcInJnYmEoMCwgMCwgMCwgezB9KVwiLCBHZXRTcXVhcmVUeXBlQWxwaGEoc3F1YXJlVHlwZSkgLyAyNTUuMCk7XHJcbiAgICAgICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdUcmlhbmdsZShkcmF3UG9zLkl0ZW0xLCBkcmF3UG9zLkl0ZW0yLCB4TXVsdGlwbGllciAvIDIsIGNvb3Jkcy5JdGVtMyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0ltYWdlKFRvcENhbnZhcywgKG9mZnNldFggJSB4TXVsdGlwbGllcikgLSB4TXVsdGlwbGllciwgKG9mZnNldFkgJSB5TXVsdGlwbGllcikgLSB5TXVsdGlwbGllciwgKHdpZHRoICsgMikgKiB4TXVsdGlwbGllciwgKGhlaWdodCArIDIpICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbkdldEZpbmFsRHJhd1BvcyA9IChwb3MpID0+XHJcbntcclxuICAgIHZhciBwID0gR2V0RHJhd1Bvcyhwb3MpO1xyXG4gICAgaWYgKHAgPT0gbnVsbClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIGRvdWJsZSBkcmF3WDtcclxuICAgIGRvdWJsZSBkcmF3WTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihwLlZhbHVlLkl0ZW0xLCBwLlZhbHVlLkl0ZW0yKSwgb3V0IGRyYXdYLCBvdXQgZHJhd1kpO1xyXG4gICAgZHJhd1ggKj0gKHdpZHRoICsgMikgKiB4TXVsdGlwbGllciAvIFRvcENhbnZhcy5XaWR0aDtcclxuICAgIGRyYXdZICo9IChoZWlnaHQgKyAyKSAqIHlNdWx0aXBsaWVyIC8gVG9wQ2FudmFzLkhlaWdodDtcclxuICAgIGRyYXdYICs9IChvZmZzZXRYICUgeE11bHRpcGxpZXIpIC0geE11bHRpcGxpZXI7XHJcbiAgICBkcmF3WSArPSAob2Zmc2V0WSAlIHlNdWx0aXBsaWVyKSAtIHlNdWx0aXBsaWVyO1xyXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUsIGRvdWJsZT4oZHJhd1gsIGRyYXdZKTtcclxufVxyXG5cclxuO1xuICAgICAgICAgICAgXHJcbkRyYXdMaW5lID0gKHN0YXJ0LCBlbmQpID0+XHJcbntcclxuICAgIGlmICghc3RhcnQuSGFzVmFsdWUgfHwgIWVuZC5IYXNWYWx1ZSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICB2YXIgc3RhcnRQb3MgPSBzdGFydC5WYWx1ZTtcclxuICAgIHZhciBlbmRQb3MgPSBlbmQuVmFsdWU7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkJlZ2luUGF0aCgpO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5Nb3ZlVG8oc3RhcnRQb3MuSXRlbTEsIHN0YXJ0UG9zLkl0ZW0yKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuTGluZVRvKGVuZFBvcy5JdGVtMSwgZW5kUG9zLkl0ZW0yKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuTGluZVdpZHRoID0gMjtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuU3Ryb2tlU3R5bGUgPSBcInJlZFwiOyAvLyBcInJnYigxNzAsIDE3MCwgMTcwKVwiO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5TdHJva2UoKTtcclxufVxyXG5cclxuO1xuICAgICAgICAgICAgXHJcbkRyYXdNYXJrZXIgPSAocG9zaXRpb24pID0+XHJcbntcclxuICAgIGlmICghcG9zaXRpb24uSGFzVmFsdWUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgZG91YmxlIGRyYXdYO1xyXG4gICAgZG91YmxlIGRyYXdZO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChwb3NpdGlvbi5WYWx1ZSwgb3V0IGRyYXdYLCBvdXQgZHJhd1kpO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5CZWdpblBhdGgoKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuQXJjKGRyYXdYLCBkcmF3WSwgeE11bHRpcGxpZXIgLyA4LCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkZpbGxTdHlsZSA9IFwicmVkXCI7IC8vXCJyZ2IoMTcwLCAxNzAsIDE3MClcIjtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuRmlsbCgpO1xyXG59XHJcblxyXG47XG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9mb3JlYWNoICgoKGludCB4LCBpbnQgeSkgcG9zLCBEaXZpZGVyc0luZm8gZGl2aWRlcnMpIGluIERpdmlkZXJzKVxyXG4gICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgLy8gICAgZm9yZWFjaCAodmFyIGRpdmlkZXIgaW4gbmV3W10geyBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQsIERpdmlkZXJzSW5mby5SaWdodCwgRGl2aWRlcnNJbmZvLkJvdHRvbSB9KVxyXG4gICAgICAgICAgICAvLyAgICB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICBpZiAoIWRpdmlkZXJzLkhhc0ZsYWcoZGl2aWRlcikpXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIC8vICAgICAgICBzd2l0Y2ggKGRpdmlkZXIpXHJcbiAgICAgICAgICAgIC8vICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgY2FzZSBEaXZpZGVyc0luZm8uUmlnaHQ6XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIChpbnQgeCwgaW50IHkpIHN0YXJ0UG9zID0gKChpbnQpKHBvcy54ICsgMSksIChpbnQpcG9zLnkpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAoaW50IHgsIGludCB5KSBlbmRQb3MgPSAoKGludCkocG9zLnggKyAxKSwgKGludCkocG9zLnkgKyAxKSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIERyYXdMaW5lKEdldEZpbmFsRHJhd1BvcyhzdGFydFBvcyksIEdldEZpbmFsRHJhd1BvcyhlbmRQb3MpKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgY2FzZSBEaXZpZGVyc0luZm8uQm90dG9tOlxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBEcmF3TGluZShHZXRGaW5hbERyYXdQb3MoKChpbnQpKHBvcy54KSwgKGludCkocG9zLnkgKyAxKSkpLCBHZXRGaW5hbERyYXdQb3MoKChpbnQpKHBvcy54ICsgMSksIChpbnQpKHBvcy55ICsgMSkpKSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgIGNhc2UgRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0OlxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBEcmF3TWFya2VyKEdldEZpbmFsRHJhd1BvcygoKGludCkocG9zLnggKyAxKSwgKGludCkocG9zLnkgKyAxKSkpKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgLy8gICAgICAgIH1cclxuICAgICAgICAgICAgLy8gICAgfVxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IGZyYW1lTnVtID0gMDtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE5leHRGcmFtZSAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCFwbGF5aW5nKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBib29sIHNraXBGcmFtZXMgPSBHcmlkLlNxdWFyZUNvdW50ID49IDI1MDtcclxuICAgICAgICAgICAgaW50IHVwZGF0ZXNQZXJEcmF3ID0gMTsvLyBza2lwRnJhbWVzID8gMiA6IDE7XHJcbiAgICAgICAgICAgIGZyYW1lTnVtKys7XHJcbiAgICAgICAgICAgIGlmIChza2lwRnJhbWVzICYmIChmcmFtZU51bSAlIHVwZGF0ZXNQZXJEcmF3KSAhPSAwKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8IHVwZGF0ZXNQZXJEcmF3OyBuKyspXHJcbiAgICAgICAgICAgICAgICBHcmlkLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgRHJhd0hleGFnb24gKHRoaXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGNvbnRleHQsIGludCB4LCBpbnQgeSwgaW50IHJhZGl1cywgYm9vbCBzdHJva2UgPSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuQmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuTW92ZVRvKHggKyByYWRpdXMsIHkpO1xyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMTsgbiA8PSA2OyBuKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRvdWJsZSBhbmdsZSA9IG4gKiBNYXRoLlBJIC8gMztcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuTGluZVRvKHggKyByYWRpdXMgKiBNYXRoLkNvcyhhbmdsZSksIHkgKyByYWRpdXMgKiBNYXRoLlNpbihhbmdsZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzdHJva2UpXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LlN0cm9rZSgpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LkZpbGwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBEcmF3VHJpYW5nbGUodGhpcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgY29udGV4dCwgaW50IGhleFgsIGludCBoZXhZLCBpbnQgaGV4UmFkaXVzLCBUcmlhbmdsZUxvY2F0aW9uIGxvYylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuQmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuTW92ZVRvKGhleFgsIGhleFkpO1xyXG4gICAgICAgICAgICBpbnQgYW5nbGVJbnQgPSAwO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGxvYylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYW5nbGVJbnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLlRvcDpcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZUludCA9IDYwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLlRvcFJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlSW50ID0gMTIwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbVJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlSW50ID0gMTgwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbTpcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZUludCA9IDI0MDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21MZWZ0OlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlSW50ID0gMzAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRvdWJsZSBhbmdsZSA9IGFuZ2xlSW50ICogTWF0aC5QSSAvIDE4MDtcclxuICAgICAgICAgICAgY29udGV4dC5MaW5lVG8oaGV4WCArIGhleFJhZGl1cyAqIE1hdGguQ29zKGFuZ2xlKSwgaGV4WSArIGhleFJhZGl1cyAqIE1hdGguU2luKGFuZ2xlKSk7XHJcbiAgICAgICAgICAgIGFuZ2xlICs9IE1hdGguUEkgLyAzO1xyXG4gICAgICAgICAgICBjb250ZXh0LkxpbmVUbyhoZXhYICsgaGV4UmFkaXVzICogTWF0aC5Db3MoYW5nbGUpLCBoZXhZICsgaGV4UmFkaXVzICogTWF0aC5TaW4oYW5nbGUpKTtcclxuICAgICAgICAgICAgY29udGV4dC5GaWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UZXh0LlJlZ3VsYXJFeHByZXNzaW9ucztcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgRXh0ZW5zaW9uc1xyXG4gICAge1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIigoZSwgYykgPT4gYy5hcHBlbmRDaGlsZChlKSkoe2VsZW1lbnR9LCB7Y29udGFpbmluZ0VsZW19KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIEFkZFRvPFQ+KHRoaXMgVCBlbGVtZW50LCBOb2RlIGNvbnRhaW5pbmdFbGVtKSB3aGVyZSBUIDogTm9kZTtcclxuICAgICAgICAvL3B1YmxpYyBzdGF0aWMgVCBBZGRUb0JvZHk8VD4odGhpcyBUIG4pIHdoZXJlIFQgOiBOb2RlID0+IEFwcC5yb290LkFwcGVuZENoaWxkPFQ+KG4pO1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIntub2RlfS5hcHBlbmRDaGlsZCh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgQXBwZW5kQ2hpbGQ8VD4odGhpcyBOb2RlIG5vZGUsIFQgZWxlbWVudCkgd2hlcmUgVCA6IE5vZGU7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc3R5bGUuZGlzcGxheSA9ICdub25lJywgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBIaWRlPFQ+KHRoaXMgVCBlbGVtZW50KSB3aGVyZSBUIDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc3R5bGUuZGlzcGxheSA9ICcnLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIFNob3c8VD4odGhpcyBUIGVsZW1lbnQpIHdoZXJlIFQgOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBbVGVtcGxhdGUoXCIobGkgPT4gKGxpLmFwcGVuZENoaWxkKHtlbGVtZW50fSksIGxpKSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gSFRNTExJRWxlbWVudCBXcmFwTGkodGhpcyBOb2RlIGVsZW1lbnQpO1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihkaXYgPT4gKGRpdi5hcHBlbmRDaGlsZCh7ZWxlbWVudH0pLCBkaXYpKShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gSFRNTERpdkVsZW1lbnQgV3JhcERpdih0aGlzIE5vZGUgZWxlbWVudCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBUIEFkZDxUPih0aGlzIFQgZWxlbWVudCwgcGFyYW1zIFVuaW9uPE5vZGUsIHN0cmluZz5bXSBub2Rlcykgd2hlcmUgVCA6IE5vZGVcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFVuaW9uPE5vZGUsIHN0cmluZz4gbm9kZSBpbiBub2RlcylcclxuICAgICAgICAgICAgICAgIGlmIChub2RlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChub2RlLklzPHN0cmluZz4oKSlcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LkFwcGVuZENoaWxkKG5ldyBUZXh0KG5vZGUuQXM8c3RyaW5nPigpKSk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5BcHBlbmRDaGlsZChub2RlLkFzPE5vZGU+KCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgVCBBZGRFbGVtZW50PFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgc3RyaW5nPltdIG5vZGVzKVxyXG4gICAgd2hlcmUgVCA6IE5vZGVcclxue1xyXG4gICAgcmV0dXJuIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8VD4oZWxlbWVudCxub2Rlcyk7XHJcbn1wdWJsaWMgc3RhdGljIFQgQWRkRGl2PFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgc3RyaW5nPltdIG5vZGVzKVxyXG4gICAgd2hlcmUgVCA6IE5vZGVcclxue1xyXG4gICAgcmV0dXJuIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8VD4oZWxlbWVudCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnQoKSxub2RlcykpO1xyXG59cHVibGljIHN0YXRpYyBUIEFkZFVsPFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgVW5pb248Tm9kZSwgc3RyaW5nPltdLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFVMaXN0RWxlbWVudD4obmV3IEhUTUxVTGlzdEVsZW1lbnQoKSxTeXN0ZW0uQXJyYXlFeHRlbnNpb25zLk1hcDxVbmlvbjxOb2RlLFVuaW9uPE5vZGUsIHN0cmluZz5bXSxzdHJpbmc+LFVuaW9uPE5vZGUsc3RyaW5nPj4obm9kZXMsKEZ1bmM8VW5pb248Tm9kZSxVbmlvbjxOb2RlLCBzdHJpbmc+W10sc3RyaW5nPixVbmlvbjxOb2RlLHN0cmluZz4+KShuID0+IChVbmlvbjxOb2RlLCBzdHJpbmc+KShuLklzPFVuaW9uPE5vZGUsIHN0cmluZz5bXT4oKSA/IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTExJRWxlbWVudD4obmV3IEhUTUxMSUVsZW1lbnQoKSxuLkFzPFVuaW9uPE5vZGUsIHN0cmluZz5bXT4oKSkgOiBuLklzPHN0cmluZz4oKSA/IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTExJRWxlbWVudD4obmV3IEhUTUxMSUVsZW1lbnQoKSxuLkFzPHN0cmluZz4oKSkgOiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxMSUVsZW1lbnQ+KG5ldyBIVE1MTElFbGVtZW50KCksbi5BczxOb2RlPigpKSkpKSkpO1xyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgQWRkQ2FtZWxTcGFjZSh0aGlzIHN0cmluZyBzdHIpXHJcbntcclxuICAgIHJldHVybiBSZWdleC5SZXBsYWNlKFJlZ2V4LlJlcGxhY2Uoc3RyLCBAXCIoW15fYS16XSkoW15fYS16XVthLXpdKVwiLCBcIiQxICQyXCIpLCBAXCIoW2Etel0pKFteX2Etel0pXCIsIFwiJDEgJDJcIik7XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBUb0NhbWVsU3RyaW5nPFQ+KHRoaXMgVCBlKVxyXG4gICAgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxue1xyXG4gICAgcmV0dXJuIGUuVG9TdHJpbmcoKS5BZGRDYW1lbFNwYWNlKCkuUmVwbGFjZSgnXycsICcgJyk7XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgQWRkRW51bTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdCwgVD8gZGVmYXVsdFZhbHVlID0gbnVsbCwgc3RyaW5nIGRlZmF1bHRWYWx1ZVN0cmluZyA9IFwiXCIpIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoZGVmYXVsdFZhbHVlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICBzZWxlY3QuQWRkKEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudCB7IFZhbHVlID0gXCJcIiwgU2VsZWN0ZWQgPSB0cnVlLCBEaXNhYmxlID0gdHJ1ZSB9LGRlZmF1bHRWYWx1ZVN0cmluZykpO1xyXG4gICAgICAgICAgICBmb3JlYWNoIChUIHZhbHVlIGluIFN5c3RlbS5FbnVtLkdldFZhbHVlcyh0eXBlb2YoVCkpKVxyXG4gICAgICAgICAgICAgICAgc2VsZWN0LkFkZChDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnRcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBWYWx1ZSA9ICgoaW50KShvYmplY3QpdmFsdWUpLlRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0ZWQgPSBvYmplY3QuRXF1YWxzKGRlZmF1bHRWYWx1ZSwgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5Ub0NhbWVsU3RyaW5nPFQ+KHZhbHVlKSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBib29sIEJvb2xWYWx1ZSh0aGlzIEhUTUxJbnB1dEVsZW1lbnQgY2hlY2tCb3gpXHJcbntcclxuICAgIHJldHVybiBjaGVja0JveC5DaGVja2VkO1xyXG59cHVibGljIHN0YXRpYyBib29sIEJvb2xWYWx1ZSh0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdClcclxue1xyXG4gICAgcmV0dXJuIHNlbGVjdC5WYWx1ZSA9PSBcInRydWVcIiA/IHRydWUgOiBmYWxzZTtcclxufXB1YmxpYyBzdGF0aWMgQWRqYWNlbmN5VHlwZSBBZGphY2VuY3lWYWx1ZSh0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdClcclxue1xyXG4gICAgcmV0dXJuIChBZGphY2VuY3lUeXBlKWludC5QYXJzZShzZWxlY3QuVmFsdWUpO1xyXG59cHVibGljIHN0YXRpYyBUPyBWYWx1ZTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdClcclxuICAgIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbntcclxuICAgIHJldHVybiBzZWxlY3QuVmFsdWUgPT0gXCJcIiA/IG51bGwgOiAoVD8gKShUKShvYmplY3QpaW50LlBhcnNlKHNlbGVjdC5WYWx1ZSk7XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTElucHV0RWxlbWVudCBTZXRCb29sVmFsdWUodGhpcyBIVE1MSW5wdXRFbGVtZW50IGNoZWNrQm94LCBib29sIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2hlY2tCb3guQ2hlY2tlZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICByZXR1cm4gY2hlY2tCb3g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgU2V0Qm9vbFZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBib29sIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZWN0LlZhbHVlID0gdmFsdWUuVG9TdHJpbmcoKS5Ub0xvd2VyKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgU2V0QWRqYWNlbmN5VmFsdWUodGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QsIEFkamFjZW5jeVR5cGUgdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxlY3QuVmFsdWUgPSAoKGludCl2YWx1ZSkuVG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBTZXRWYWx1ZTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdCwgVCB2YWx1ZSkgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGVjdC5WYWx1ZSA9ICgoaW50KShvYmplY3QpdmFsdWUpLlRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIHN0cmluZyBUb1RpbWVTdHJpbmcodGhpcyBUaW1lU3BhbiB0aW1lKVxyXG57XHJcbiAgICByZXR1cm4gdGltZS5Ub1N0cmluZyh0aW1lID49IFRpbWVTcGFuLkZyb21Ib3VycygxKSA/IEBcImhcXDptbVxcOnNzXCIgOiBAXCJtXFw6c3NcIik7XHJcbn0gICAgICAgIFtUZW1wbGF0ZShcIihlID0+IChlLnNldEN1c3RvbVZhbGlkaXR5KHttZXNzYWdlfSksIGUucmVwb3J0VmFsaWRpdHkoKSwgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBTZXRDdXN0b21WYWxpZGl0eTxUPih0aGlzIFQgZWxlbWVudCwgc3RyaW5nIG1lc3NhZ2UpIHdoZXJlIFQgOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zZXRBdHRyaWJ1dGUoJ2xpc3QnLCB7ZGF0YWxpc3RJRH0pLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MSW5wdXRFbGVtZW50IFNldERhdGFMaXN0KHRoaXMgSFRNTElucHV0RWxlbWVudCBlbGVtZW50LCBzdHJpbmcgZGF0YWxpc3RJRCk7XHJcbiAgICAgICAgLy9bVGVtcGxhdGUoXCJ7ZWxlbX0uYXBwZW5kQ2hpbGQoe2FkZGluZ30pXCIpXVxyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBleHRlcm4gVCBBcHBlbmQ8VD4gKHRoaXMgTm9kZSBlbGVtLCBUIGFkZGluZyk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVW5pb248Tm9kZSwgc3RyaW5nPltdIEpvaW5CUih0aGlzIElFbnVtZXJhYmxlPHN0cmluZz4gc3RyaW5ncylcclxuICAgICAgICB7XHJcblN5c3RlbS5GdW5jPElFbnVtZXJhYmxlPFVuaW9uPE5vZGUsIHN0cmluZz4+PiBJbm5lciA9IG51bGw7XG4gICAgICAgICAgICBcclxuSW5uZXIgPSAoKSA9PlxyXG57XHJcbiAgICB1c2luZyAodmFyIGVudW1lciA9IHN0cmluZ3MuR2V0RW51bWVyYXRvcigpKVxyXG4gICAge1xyXG4gICAgICAgIGlmICghZW51bWVyLk1vdmVOZXh0KCkpXHJcbiAgICAgICAgICAgIHlpZWxkIGJyZWFrO1xyXG4gICAgICAgIHlpZWxkIHJldHVybiBlbnVtZXIuQ3VycmVudDtcclxuICAgICAgICB3aGlsZSAoZW51bWVyLk1vdmVOZXh0KCkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gbmV3IEhUTUxCUkVsZW1lbnQoKTtcclxuICAgICAgICAgICAgeWllbGQgcmV0dXJuIGVudW1lci5DdXJyZW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuO1xuICAgICAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuVG9BcnJheTxVbmlvbjxOb2RlLHN0cmluZz4+KElubmVyKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgTm90YWJsZU9iamVjdHNMaXN0XHJcbiAgICB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+ICxzdHJpbmcgLHN0cmluZyA+PiBOb3RhYmxlT2JqZWN0cyA9XHJcbiAgICAgICAgICAgIGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gLHN0cmluZyAsc3RyaW5nID4+KCksKF9vMyk9PntfbzMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4sIHN0cmluZywgc3RyaW5nPihnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+KCksIChfbzEpID0+XHJcbntcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKSk7XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMSwgMCkpO1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDEsIDEpKTtcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAyKSk7XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMiwgMikpO1xyXG4gICAgcmV0dXJuIF9vMTtcclxufVxyXG5cclxuKSwgXCJUd28gR2VuZXJhdGlvbiBOaW5ldHkgRGVncmVlIFJvdGF0b3JcIiwgXCIwMDEwMTAtLS0gLyAwMDAxMDEtLS1cIikpO19vMy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+Piwgc3RyaW5nLCBzdHJpbmc+KGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4oKSwgKF9vMikgPT5cclxue1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApKTtcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigxLCAwKSk7XHJcbiAgICBfbzIuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMSwgMSkpO1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDEpKTtcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAyKSk7XHJcbiAgICByZXR1cm4gX28yO1xyXG59XHJcblxyXG4pLCBcIk9uZSBHZW5lcmF0aW9uIE5pbmV0eSBEZWdyZWUgUm90YXRvclwiLCBcIjAwMTAxMC0tLSAvIDAwMDEwMS0tLVwiKSk7cmV0dXJuIF9vMzt9KTtcclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIC8vLyA8c3VtbWFyeT5cclxuICAgIC8vLyBPcHRpb25zOlxyXG4gICAgLy8vIC0gQ2VsbCAoSXNDZWxsOiB0cnVlLCBJc1dhbGw6IGZhbHNlKSAgfCBCbGFja1xyXG4gICAgLy8vIC0gV2FsbCAoSXNDZWxsOiB0cnVlLCBJc1dhbGw6IHRydWUpICAgfCBHcmV5XHJcbiAgICAvLy8gLSBCcmljayAoSXNDZWxsOiBmYWxzZSwgSXNXYWxsOiB0cnVlKSB8IEdyZXlcclxuICAgIC8vLyA8L3N1bW1hcnk+XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBTcXVhcmVFeHRlbnNpb25zXHJcbiAgICB7XHJcbnB1YmxpYyBzdGF0aWMgYm9vbCBJc0FsaXZlKHRoaXMgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKVxyXG57XHJcbiAgICByZXR1cm4gc3F1YXJlVHlwZSAhPSBTcXVhcmVUeXBlLkJyaWNrO1xyXG59cHVibGljIHN0YXRpYyBib29sIElzVW5kZWFkKHRoaXMgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKVxyXG57XHJcbiAgICByZXR1cm4gc3F1YXJlVHlwZSAhPSBTcXVhcmVUeXBlLkNlbGw7XHJcbn1wdWJsaWMgc3RhdGljIGJvb2wgQ29udGFpbnNBbGl2ZTxUPih0aGlzIERpY3Rpb25hcnk8VCwgU3F1YXJlVHlwZT4gZGljLCBUIGtleSlcclxue1xyXG5TcXVhcmVUeXBlIHNxdWFyZVR5cGU7XG4gICAgcmV0dXJuIGRpYy5UcnlHZXRWYWx1ZShrZXksIG91dCBzcXVhcmVUeXBlKSAmJiBzcXVhcmVUeXBlLklzQWxpdmUoKTtcclxufSAgICB9XHJcblxyXG4gICAgcHVibGljIGVudW0gU3F1YXJlVHlwZVxyXG4gICAge1xyXG4gICAgICAgIENlbGwsICAvLyBCbGFja1xyXG4gICAgICAgIEltbW9ydGFsQ2VsbCwgIC8vIEdyZXlcclxuICAgICAgICBCcmljaywgLy8gR3JleVxyXG4gICAgICAgIENvdW50XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVudW0gR3JpZFR5cGVcclxuICAgIHtcclxuICAgICAgICBTcXVhcmUsXHJcbiAgICAgICAgSGV4LFxyXG4gICAgICAgIC8vVHJpYW5nbGUsXHJcbiAgICAgICAgQ291bnRcclxuICAgIH1cclxuXHJcbiAgICBbRmxhZ3NdXHJcbiAgICBwdWJsaWMgZW51bSBEaXZpZGVyc0luZm9cclxuICAgIHtcclxuICAgICAgICBOb25lID0gMCxcclxuICAgICAgICBSaWdodCA9IDEgPDwgMCxcclxuICAgICAgICBCb3R0b20gPSAxIDw8IDEsXHJcbiAgICAgICAgQm90dG9tUmlnaHQgPSAxIDw8IDJcclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjbGFzcyBHcmlkXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IHZvaWQgQ2xlYXIoKTtcclxuICAgICAgICBwdWJsaWMgYWJzdHJhY3Qgdm9pZCBEcmF3U3F1YXJlcyhBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiwgU3F1YXJlVHlwZT4gRHJhd1NxdWFyZSk7XHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IHZvaWQgSGFuZGxlQ2xpY2soU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBkcmF3UG9zaXRpb24sIFNxdWFyZVR5cGUgU3F1YXJlVHlwZVBsYWNpbmcpO1xyXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCB2b2lkIFVwZGF0ZSgpO1xyXG5cclxuICAgICAgICBwdWJsaWMgYWJzdHJhY3QgaW50IFNxdWFyZUNvdW50IHsgZ2V0OyB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGNsYXNzIEdyaWQ8Q29vcmRUeXBlPiA6IEdyaWRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgdmlydHVhbCB2b2lkIEFzc2lnbkRpdmlkZXJzIChTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYXdQb3NpdGlvbiwgcmVmIGJvb2wgcGxhY2VOb3JtYWxseSkgeyB9XHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gR2V0RHJhd1Bvc2l0aW9uIChDb29yZFR5cGUgY29vcmRzKTtcclxuICAgICAgICBwdWJsaWMgYWJzdHJhY3QgQ29vcmRUeXBlIEZyb21EcmF3UG9zaXRpb24gKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhd1Bvc2l0aW9uKTtcclxuICAgICAgICBwdWJsaWMgYWJzdHJhY3QgaW50IE51bWJlck9mQWRqYWNlbnRDZWxscyAoQ29vcmRUeXBlIGNvb3JkcywgQWN0aW9uPENvb3JkVHlwZT4gZW1wdHlBZGpBY3Rpb24gPSBudWxsKTtcclxuICAgICAgICBwdWJsaWMgRGljdGlvbmFyeTxDb29yZFR5cGUsIFNxdWFyZVR5cGU+IFNxdWFyZXMgPSBuZXcgRGljdGlvbmFyeTxDb29yZFR5cGUsIFNxdWFyZVR5cGU+KCk7XHJcbiAgICAgICAgcHVibGljIERpY3Rpb25hcnk8Q29vcmRUeXBlLCBEaXZpZGVyc0luZm8+IERpdmlkZXJzID0gbmV3IERpY3Rpb25hcnk8Q29vcmRUeXBlLCBEaXZpZGVyc0luZm8+KCk7XHJcbnB1YmxpYyBvdmVycmlkZSBpbnQgU3F1YXJlQ291bnRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFNxdWFyZXMuQ291bnQ7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBDbGVhcigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTcXVhcmVzLkNsZWFyKCk7XHJcbiAgICAgICAgICAgIERpdmlkZXJzLkNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBEcmF3U3F1YXJlcyAoQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4sIENvb3JkVHlwZSwgU3F1YXJlVHlwZT4gRHJhd1NxdWFyZSlcclxuICAgICAgICB7XHJcbmZvcmVhY2ggKHZhciBfZDEgaW4gU3F1YXJlcylcclxue1xyXG4gICAgQ29vcmRUeXBlIGNvb3JkcztcclxuICAgIFNxdWFyZVR5cGUgc3F1YXJlVHlwZTtcclxuICAgIF9kMS5EZWNvbnN0cnVjdChvdXQgY29vcmRzLCBvdXQgc3F1YXJlVHlwZSk7XHJcbiAgICBEcmF3U3F1YXJlKEdldERyYXdQb3NpdGlvbihjb29yZHMpLCBjb29yZHMsIHNxdWFyZVR5cGUpO1xyXG59XG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgRHJhd1NxdWFyZXMgKEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+LCBTcXVhcmVUeXBlPiBEcmF3U3F1YXJlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5EcmF3U3F1YXJlcygoQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+LENvb3JkVHlwZSxTcXVhcmVUeXBlPikoKGRyYXdQb3NpdGlvbiwgY29vcmRzLCBzcXVhcmVUeXBlKSA9PiBEcmF3U3F1YXJlKGRyYXdQb3NpdGlvbiwgc3F1YXJlVHlwZSkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMaXN0PENvb3JkVHlwZT4gcmVtb3ZpbmcgPSBuZXcgTGlzdDxDb29yZFR5cGU+KCk7XHJcbiAgICAgICAgICAgIEhhc2hTZXQ8Q29vcmRUeXBlPiBhZGRpbmcgPSBuZXcgSGFzaFNldDxDb29yZFR5cGU+KCk7XHJcbmZvcmVhY2ggKHZhciBfZDIgaW4gU3F1YXJlcylcclxue1xyXG4gICAgQ29vcmRUeXBlIGNvb3JkcztcclxuICAgIFNxdWFyZVR5cGUgc3F1YXJlVHlwZTtcclxuICAgIF9kMi5EZWNvbnN0cnVjdChvdXQgY29vcmRzLCBvdXQgc3F1YXJlVHlwZSk7XHJcbiAgICBpZiAoIXNxdWFyZVR5cGUuSXNBbGl2ZSgpKVxyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgaW50IGFkamFjZW50Q2VsbHMgPSBOdW1iZXJPZkFkamFjZW50Q2VsbHMoY29vcmRzLCAoQWN0aW9uPENvb3JkVHlwZT4pKGNvb3Jkc18gPT5cclxuICAgIHtcclxuICAgICAgICBpZiAoQXBwLmRlYWRSdWxlc1tOdW1iZXJPZkFkamFjZW50Q2VsbHMoY29vcmRzXyldKVxyXG4gICAgICAgICAgICBhZGRpbmcuQWRkKGNvb3Jkc18pO1xyXG4gICAgfVxyXG5cclxuKSAgICApO1xyXG4gICAgaWYgKGFkamFjZW50Q2VsbHMgPiBBcHAubWF4QWRqYWNlbnRDZWxscylcclxuICAgICAgICBhZGphY2VudENlbGxzID0gQXBwLm1heEFkamFjZW50Q2VsbHM7XHJcbiAgICBpZiAoIXNxdWFyZVR5cGUuSXNVbmRlYWQoKSAmJiAhQXBwLmxpdmluZ1J1bGVzW2FkamFjZW50Q2VsbHNdKVxyXG4gICAgICAgIHJlbW92aW5nLkFkZChjb29yZHMpO1xyXG59XG5cclxuICAgICAgICAgICAgZm9yZWFjaCAoQ29vcmRUeXBlIGNvb3JkcyBpbiByZW1vdmluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFTcXVhcmVzLlJlbW92ZShjb29yZHMpKSB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiU3F1YXJlIHRyaWVkIHRvIGJlIHJlbW92ZWQgYnV0IGRpZG4ndCBleGlzdFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yZWFjaCAoQ29vcmRUeXBlIGNvb3JkcyBpbiBhZGRpbmcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFNxdWFyZXMuQWRkKGNvb3JkcywgU3F1YXJlVHlwZS5DZWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgSGFuZGxlQ2xpY2sgKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhd1Bvc2l0aW9uLCBTcXVhcmVUeXBlIFNxdWFyZVR5cGVQbGFjaW5nKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ29vcmRUeXBlIGNsaWNrQ29vcmRzID0gRnJvbURyYXdQb3NpdGlvbihkcmF3UG9zaXRpb24pO1xyXG4gICAgICAgICAgICBib29sIHBsYWNlTm9ybWFsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoU3F1YXJlVHlwZVBsYWNpbmcgPT0gU3F1YXJlVHlwZS5Db3VudClcclxuICAgICAgICAgICAgICAgIEFzc2lnbkRpdmlkZXJzKGRyYXdQb3NpdGlvbiwgcmVmIHBsYWNlTm9ybWFsbHkpO1xyXG4gICAgICAgICAgICBpZiAocGxhY2VOb3JtYWxseSAmJiAhU3F1YXJlcy5SZW1vdmUoY2xpY2tDb29yZHMpKVxyXG4gICAgICAgICAgICAgICAgU3F1YXJlcy5BZGQoY2xpY2tDb29yZHMsIFNxdWFyZVR5cGVQbGFjaW5nID09IFNxdWFyZVR5cGUuQ291bnQgPyBTcXVhcmVUeXBlLkNlbGwgOiBTcXVhcmVUeXBlUGxhY2luZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBTcXVhcmVHcmlkIDogR3JpZDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PlxyXG4gICAge1xyXG5wdWJsaWMgb3ZlcnJpZGUgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPkdldERyYXdQb3NpdGlvbihTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+Y29vcmRzKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pihjb29yZHMuSXRlbTEgKiBBcHAueE11bHRpcGxpZXIsIGNvb3Jkcy5JdGVtMiAqIEFwcC54TXVsdGlwbGllcik7XHJcbn1wdWJsaWMgb3ZlcnJpZGUgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPkZyb21EcmF3UG9zaXRpb24oU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPmRyYXdQb3NpdGlvbilcclxue1xyXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oQXBwLk5lZ0RpdihkcmF3UG9zaXRpb24uSXRlbTEsIEFwcC54TXVsdGlwbGllciksIEFwcC5OZWdEaXYoZHJhd1Bvc2l0aW9uLkl0ZW0yLCBBcHAueE11bHRpcGxpZXIpKTtcclxufVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIEFzc2lnbkRpdmlkZXJzKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhd1Bvc2l0aW9uLCByZWYgYm9vbCBwbGFjZU5vcm1hbGx5KVxyXG4gICAgICAgIHtcclxuZG91YmxlIGNsaWNrWF87XG5kb3VibGUgY2xpY2tZXztcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGRvdWJsZSwgZG91YmxlPihBcHAuTmVnRGl2RG91YmxlKChkb3VibGUpZHJhd1Bvc2l0aW9uLkl0ZW0xLCBBcHAueE11bHRpcGxpZXIpLCBBcHAuTmVnRGl2RG91YmxlKChkb3VibGUpZHJhd1Bvc2l0aW9uLkl0ZW0yLCBBcHAueU11bHRpcGxpZXIpKSwgb3V0IGNsaWNrWF8sIG91dCBjbGlja1lfKTtcclxuICAgICAgICAgICAgcGxhY2VOb3JtYWxseSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpbnQgeERpdiA9IDAsIHlEaXYgPSAwO1xyXG4gICAgICAgICAgICBpZiAoY2xpY2tYXyAlIDEgPD0gMC4yKVxyXG4gICAgICAgICAgICAgICAgeERpdiA9IC0xO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChjbGlja1hfICUgMSA+PSAwLjgpXHJcbiAgICAgICAgICAgICAgICB4RGl2ID0gMTtcclxuICAgICAgICAgICAgaWYgKGNsaWNrWV8gJSAxIDw9IDAuMilcclxuICAgICAgICAgICAgICAgIHlEaXYgPSAtMTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoY2xpY2tZXyAlIDEgPj0gMC44KVxyXG4gICAgICAgICAgICAgICAgeURpdiA9IDE7XHJcbiAgICAgICAgICAgIERpdmlkZXJzSW5mbyBkaXZpZGVyc0luZm8gPSBEaXZpZGVyc0luZm8uTm9uZTtcclxuICAgICAgICAgICAgQWN0aW9uPERpdmlkZXJzSW5mbz4gQXNzaWduID0gKERpdmlkZXJzSW5mbyBkaXZJbmZvKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbnQgeCA9IChpbnQpY2xpY2tYXyArIHhEaXYsIHkgPSAoaW50KWNsaWNrWV8gKyB5RGl2O1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpdkluZm8gIT0gRGl2aWRlcnNJbmZvLk5vbmUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbkRpdmlkZXJzSW5mbyBkaXZpZGVycztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFEaXZpZGVycy5UcnlHZXRWYWx1ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpeCwgKGludCl5KSwgb3V0IGRpdmlkZXJzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGl2aWRlcnMgPSBEaXZpZGVyc0luZm8uTm9uZTtcclxuICAgICAgICAgICAgICAgICAgICBEaXZpZGVyc1tuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHgsIHkpXSA9IGRpdmlkZXJzIF4gZGl2SW5mbztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc3dpdGNoICh4RGl2KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoeURpdilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBc3NpZ24oRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBc3NpZ24oRGl2aWRlcnNJbmZvLlJpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5RGl2ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2lnbihEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHlEaXYpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXNzaWduKERpdmlkZXJzSW5mby5Cb3R0b20pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlTm9ybWFsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlkZXJzSW5mbyA9IERpdmlkZXJzSW5mby5Cb3R0b207XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoeURpdilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4RGl2ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2lnbihEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlkZXJzSW5mbyA9IERpdmlkZXJzSW5mby5SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXZpZGVyc0luZm8gPSBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkaXZpZGVyc0luZm8gIT0gRGl2aWRlcnNJbmZvLk5vbmUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHhEaXYgPSAwO1xyXG4gICAgICAgICAgICAgICAgeURpdiA9IDA7XHJcbiAgICAgICAgICAgICAgICBBc3NpZ24oZGl2aWRlcnNJbmZvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGludCBOdW1iZXJPZkFkamFjZW50Q2VsbHMoU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBjb29yZHMsIEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiBlbXB0eUFkakFjdGlvbiA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgYWRqYWNlbnRDZWxscyA9IDA7XHJcbiAgICAgICAgICAgIGludCBuID0gMDtcclxuICAgICAgICAgICAgZm9yIChpbnQgTCA9IDA7IEwgPD0gODsgTCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTCA9PSA0KVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFkamFjZW5jeVJ1bGUgPSBBcHAuYWRqYWNlbmN5UnVsZXNbbisrXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnQgYzBfID0gY29vcmRzLkl0ZW0xLSAxICsgKEwgJSAzKSxcclxuICAgICAgICAgICAgICAgICAgICBjMV8gPSBjb29yZHMuSXRlbTItIDEgKyBMIC8gMztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoRGl2aWRlcnMuSGFzRGl2aWRlcnMoY29vcmRzLkl0ZW0xLCBjb29yZHMuSXRlbTIsIEwpKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5TcXVhcmVUeXBlIHNxdWFyZUluZm87XG5cclxuICAgICAgICAgICAgICAgIGlmIChTcXVhcmVzLlRyeUdldFZhbHVlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oYzBfLCBjMV8pLCBvdXQgc3F1YXJlSW5mbykpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNxdWFyZUluZm8uSXNBbGl2ZSgpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VudENlbGxzICs9IChpbnQpYWRqYWNlbmN5UnVsZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBlbXB0eUFkakFjdGlvbiE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+ZW1wdHlBZGpBY3Rpb24uSW52b2tlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oYzBfLCBjMV8pKSk6bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYWRqYWNlbnRDZWxscyA+IEFwcC5tYXhBZGphY2VudENlbGxzID8gQXBwLm1heEFkamFjZW50Q2VsbHMgOiBhZGphY2VudENlbGxzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xhc3MgSGV4R3JpZCA6IEdyaWQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj5cclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IGZsb2F0XHJcbiAgICAgICAgICAgIGNvczYwID0gKGZsb2F0KU1hdGguU2luKE1hdGguUEkgLyAzKSxcclxuICAgICAgICAgICAgc2luNjAgPSAoZmxvYXQpTWF0aC5Db3MoTWF0aC5QSSAvIDMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJjb29yZHNcIj42MGwgaXMgcG9zaXRpb24gZnJvbSAoMCwgMCkgZ29pbmcgNjAgZGVncmVlcyBsZWZ0IG9mIHVwLiA2MHIgaXMgcG9zaXRpb24gZnJvbSAoMCwgMCkgZ29pbmcgNjAgZGVncmVlcyByaWdodCBvZiB1cC9wYXJhbT5cclxuICAgICAgICAvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IEdldERyYXdQb3NpdGlvbiAoU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBjb29yZHMpXHJcbiAgICAgICAge1xyXG5pbnQgXzYwbDtcbmludCBfNjByO1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChjb29yZHMsIG91dCBfNjBsLCBvdXQgXzYwcik7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKCgtXzYwbCArIF82MHIpICogQXBwLnhNdWx0aXBsaWVyICogY29zNjApLCAoaW50KSgtKF82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIHNpbjYwKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBGcm9tRHJhd1Bvc2l0aW9uKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhd1Bvc2l0aW9uKVxyXG4gICAgICAgIHtcclxuaW50IHg7XG5pbnQgeTtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoZHJhd1Bvc2l0aW9uLCBvdXQgeCwgb3V0IHkpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogeCA9ICgtXzYwbCArIF82MHIpICogQXBwLnhNdWx0aXBsaWVyICogc2luNjBcclxuICAgICAgICAgICAgICAgeSA9IC0oXzYwbCArIF82MHIpICogQXBwLnhNdWx0aXBsaWVyICogY29zNjBcclxuICAgICAgICAgICAgICAgayA9IEFwcC54TXVsdGlwbGllclxyXG4gICAgICAgICAgICAgICBhID0gXzYwbFxyXG4gICAgICAgICAgICAgICBiID0gXzYwclxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgU29sdmUgeCA9ICgtYSArIGIpICogayAqIHNpbjYwO3kgPSAtKGErIGIpICogayAqIGNvczYwIGZvciAoYSwgYikgKGh0dHBzOi8vd3d3LndvbGZyYW1hbHBoYS5jb20vaW5wdXQ/aT1zb2x2ZSt4KyUzRCslMjgtYSslMkIrYiUyOSsqK2srKitzaW42MCUzQnkrJTNEKy0lMjhhJTJCK2IlMjkrKitrKyorY29zNjArZm9yK2ErYW5kK2IpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBhID0gLShzcXJ0KDMpIHggKyAzIHkpLygzIGspXHJcbiAgICAgICAgICAgICAgIGIgPSAoc3FydCgzKSB4IC0gMyB5KS8oMyBrKVxyXG4gICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCkoLShNYXRoLlNxcnQoMykgKiB4ICsgMyAqIHkpIC8gKDMgKiBBcHAueE11bHRpcGxpZXIpKSwgKGludCkoKE1hdGguU3FydCgzKSAqIHggLSAzICogeSkgLyAoMyAqIEFwcC54TXVsdGlwbGllcikpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBpbnQgTnVtYmVyT2ZBZGphY2VudENlbGxzKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gY29vcmRzLCBBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gZW1wdHlBZGpBY3Rpb24gPSBudWxsKVxyXG4gICAgICAgIHtcclxuaW50IF82MGw7XG5pbnQgXzYwcjtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoY29vcmRzLCBvdXQgXzYwbCwgb3V0IF82MHIpO1xyXG4gICAgICAgICAgICBpbnQgYWRqYWNlbnRDZWxscyA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoaW50IEwgPSAwOyBMIDw9IDU7IEwrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFkamFjZW5jeVJ1bGUgPSBBcHAuYWRqYWNlbmN5UnVsZXNbTF07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gNjBsIGlzIHBvc2l0aW9uIGZyb20gKDAsIDApIGdvaW5nIDYwIGRlZ3JlZXMgbGVmdCBvZiB1cC4gNjByIGlzIHBvc2l0aW9uIGZyb20gKDAsIDApIGdvaW5nIDYwIGRlZ3JlZXMgcmlnaHQgb2YgdXBcclxuICAgICAgICAgICAgICAgIC8vIEwgPSAwIGlzIGxlZnQtdXAsIGdvaW5nIGNsb2Nrd2lzZSB1cCB0byBMPTUgaXMgbGVmdFxyXG5cclxuICAgICAgICAgICAgICAgIGludCBfNjBsXywgXzYwcl87XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKEwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbGVmdC11cFxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwbF8gPSBfNjBsICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cFxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwbF8gPSBfNjBsICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmlnaHQtdXBcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MGxfID0gXzYwbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmlnaHQtZG93blxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwbF8gPSBfNjBsIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAvLyBkb3duXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjBsXyA9IF82MGwgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjByXyA9IF82MHIgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0LWRvd25cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MGxfID0gXzYwbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oc3RyaW5nLkZvcm1hdChcIkludmFsaWQgTDogezB9XCIsTCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5TcXVhcmVUeXBlIHNxdWFyZUluZm87XG5cclxuICAgICAgICAgICAgICAgIC8vaWYgKERpdmlkZXJzLkhhc0RpdmlkZXJzKGNvb3Jkcy5jMCwgY29vcmRzLmMxLCBMKSlcclxuICAgICAgICAgICAgICAgIC8vICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChTcXVhcmVzLlRyeUdldFZhbHVlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oXzYwbF8sIF82MHJfKSwgb3V0IHNxdWFyZUluZm8pKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzcXVhcmVJbmZvLklzQWxpdmUoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbnRDZWxscyArPSAoaW50KWFkamFjZW5jeVJ1bGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZW1wdHlBZGpBY3Rpb24hPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PmVtcHR5QWRqQWN0aW9uLkludm9rZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KF82MGxfLCBfNjByXykpKTpudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhZGphY2VudENlbGxzID4gQXBwLm1heEFkamFjZW50Q2VsbHMgPyBBcHAubWF4QWRqYWNlbnRDZWxscyA6IGFkamFjZW50Q2VsbHM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBUcmlhbmdsZUdyaWQgOiBHcmlkPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxUcmlhbmdsZUxvY2F0aW9uID4+XHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgZmxvYXRcclxuICAgICAgICAgICAgY29zNjAgPSAoZmxvYXQpTWF0aC5TaW4oTWF0aC5QSSAvIDMpLFxyXG4gICAgICAgICAgICBzaW42MCA9IChmbG9hdClNYXRoLkNvcyhNYXRoLlBJIC8gMyk7XHJcblxyXG4gICAgICAgIC8vIGMwIGlzIHgsIGMxIGlzIHlcclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBHZXREcmF3UG9zaXRpb24oU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFRyaWFuZ2xlTG9jYXRpb24gPiBjb29yZHMpXHJcbiAgICAgICAge1xyXG5pbnQgXzYwbDtcbmludCBfNjByO1xuVHJpYW5nbGVMb2NhdGlvbiBuO1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChjb29yZHMsIG91dCBfNjBsLCBvdXQgXzYwciwgb3V0IG4pO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KSgoLV82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIGNvczYwKSwgKGludCkoLShfNjBsICsgXzYwcikgKiBBcHAueE11bHRpcGxpZXIgKiBzaW42MCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxUcmlhbmdsZUxvY2F0aW9uID4gRnJvbURyYXdQb3NpdGlvbihTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYXdQb3NpdGlvbilcclxuICAgICAgICB7XHJcblN5c3RlbS5GdW5jPGRvdWJsZSwgZG91YmxlPiBOZWdNb2QxID0gbnVsbDtcbmludCB4O1xuaW50IHk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGRyYXdQb3NpdGlvbiwgb3V0IHgsIG91dCB5KTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHggPSAoLV82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIHNpbjYwXHJcbiAgICAgICAgICAgICAgIHkgPSAtKF82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIGNvczYwXHJcbiAgICAgICAgICAgICAgIGsgPSBBcHAueE11bHRpcGxpZXJcclxuICAgICAgICAgICAgICAgYSA9IF82MGxcclxuICAgICAgICAgICAgICAgYiA9IF82MHJcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIFNvbHZlIHggPSAoLWEgKyBiKSAqIGsgKiBzaW42MDt5ID0gLShhKyBiKSAqIGsgKiBjb3M2MCBmb3IgKGEsIGIpIChodHRwczovL3d3dy53b2xmcmFtYWxwaGEuY29tL2lucHV0P2k9c29sdmUreCslM0QrJTI4LWErJTJCK2IlMjkrKitrKyorc2luNjAlM0J5KyUzRCstJTI4YSUyQitiJTI5KyoraysqK2NvczYwK2ZvcithK2FuZCtiKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgYSA9IC0oMyB4ICsgc3FydCgzKSB5KS8oMyBrKVxyXG4gICAgICAgICAgICAgICBiID0gKDMgeCAtIHNxcnQoMykgeSkvKDMgaylcclxuICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBUcmlhbmdsZUxvY2F0aW9uIGZyb20gcG9zaXRpb25cclxuXHJcbiAgICAgICAgICAgIGRvdWJsZSBib2FyZF82MGwgPSAtKE1hdGguU3FydCgzKSAqIHggKyAzICogeSkgLyAoMyAqIEFwcC54TXVsdGlwbGllciksXHJcbiAgICAgICAgICAgICAgICAgICBib2FyZF82MHIgPSAgKE1hdGguU3FydCgzKSAqIHggLSAzICogeSkgLyAoMyAqIEFwcC54TXVsdGlwbGllcik7XHJcblxyXG4gICAgICAgICAgICBcclxuTmVnTW9kMSA9IChhKSA9PiAoYSAlIDEgKyAxKSAlIDE7XG5cclxuICAgICAgICAgICAgZG91YmxlIF82MGxNb2QxID0gTmVnTW9kMShib2FyZF82MGwpLFxyXG4gICAgICAgICAgICAgICAgICAgXzYwck1vZDEgPSBOZWdNb2QxKGJvYXJkXzYwcik7XHJcblxyXG4gICAgICAgICAgICBUcmlhbmdsZUxvY2F0aW9uIG4gPSBfNjByTW9kMSA8PSAoMS4wIC8gMilcclxuICAgICAgICAgICAgICAgID8gXzYwbE1vZDEgPD0gKDEuMCAvIDMpID8gVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b20gOlxyXG4gICAgICAgICAgICAgICAgICAgIF82MGxNb2QxIDw9ICgyLjAgLyAzKSA/IFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tTGVmdCA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnRcclxuICAgICAgICAgICAgICAgIDogXzYwbE1vZDEgPD0gKDEuMCAvIDMpID8gVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21SaWdodCA6XHJcbiAgICAgICAgICAgICAgICAgICAgXzYwbE1vZDEgPD0gKDIuMCAvIDMpID8gVHJpYW5nbGVMb2NhdGlvbi5Ub3BSaWdodCA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUcmlhbmdsZUxvY2F0aW9uLlRvcDsgICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4oKGludClNYXRoLlJvdW5kKGJvYXJkXzYwbCksIChpbnQpTWF0aC5Sb3VuZChib2FyZF82MHIpLCBuKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBpbnQgTnVtYmVyT2ZBZGphY2VudENlbGxzKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxUcmlhbmdsZUxvY2F0aW9uID4gY29vcmRzLCBBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFRyaWFuZ2xlTG9jYXRpb24gPj4gZW1wdHlBZGpBY3Rpb24gPSBudWxsKVxyXG4gICAgICAgIHtcclxuX19fQWRkU3F1YXJlX0RlbGVnYXRlXzAgQWRkU3F1YXJlID0gbnVsbDtcblN5c3RlbS5GdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiwgVHJpYW5nbGVMb2NhdGlvbiwgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+PiBDcmVhdGVQb3MgPSBudWxsO1xuU3lzdGVtLkZ1bmM8aW50LCBib29sLCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+IEdldEZpbmFsSGV4YWdvbkxvY1BvcyA9IG51bGw7XG5TeXN0ZW0uRnVuYzxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4gR2V0SGV4YWdvbkxvYyA9IG51bGw7XG5TeXN0ZW0uRnVuYzxpbnQsIGJvb2wsIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4gR2V0SGV4YWdvbkxvY1BvcyA9IG51bGw7XG5pbnQgXzYwbDtcbmludCBfNjByO1xuVHJpYW5nbGVMb2NhdGlvbiBuO1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChjb29yZHMsIG91dCBfNjBsLCBvdXQgXzYwciwgb3V0IG4pO1xyXG4gICAgICAgICAgICBpbnQgYWRqYWNlbnRDZWxscyA9IDA7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKFRyaWFuZ2xlTG9jYXRpb24gbG9jID0gMDsgbG9jIDwgVHJpYW5nbGVMb2NhdGlvbi5Db3VudDsgbG9jKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2MgPT0gbilcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciBhZGphY2VuY3lSdWxlID0gQXBwLmFkamFjZW5jeVJ1bGVzWyhpbnQpbG9jXTtcclxuICAgICAgICAgICAgICAgIGlmIChDdXN0b21pemFibGVHYW1lb2ZMaWZlLlNxdWFyZUV4dGVuc2lvbnMuQ29udGFpbnNBbGl2ZTxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFRyaWFuZ2xlTG9jYXRpb24+PihTcXVhcmVzLG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4oXzYwbCwgXzYwciwgbG9jKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgYWRqYWNlbnRDZWxscyArPSAoaW50KWFkamFjZW5jeVJ1bGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIHRyaWFuZ2xlcyBmcm9tIGFkamFjZW50IGhleGFnb25zIGZvciBhZGphY2VuY3lcclxuXHJcbiAgICAgICAgICAgIC8vIElmIGxlZnQtdXAsIGdldCByaWdodC11cCwgcmlnaHQtZG93biBhbmQgZG93biBmcm9tIGxlZnQtdXAsXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGdldCByaWdodC11cCBhbmQgdXAgZnJvbSBsZWZ0LWRvd24sXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGdldCBsZWZ0LWRvd24gYW5kIGRvd24gZnJvbSB1cFxyXG5cclxuICAgICAgICAgICAgLy8gSWYgdXAsIGdldCBsZWZ0LWRvd24sIGRvd24gYW5kIHJpZ2h0LWRvd24gZnJvbSB1cCxcclxuICAgICAgICAgICAgLy8gICAgICAgIGdldCByaWdodC11cCBhbmQgcmlnaHQtZG93biBmcm9tIGxlZnQtdXBcclxuICAgICAgICAgICAgLy8gICAgICAgIGdldCBsZWZ0LXVwIGFuZCBsZWZ0LWRvd24gZnJvbSByaWdodC11cFxyXG5cclxuICAgICAgICAgICAgLy8gSWYgcmlnaHQtdXAsIGdldCBsZWZ0LXVwLCBsZWZ0LWRvd24gYW5kIGRvd24gZnJvbSByaWdodC11cCxcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgIGdldCBsZWZ0LXVwIGFuZCB1cCBmcm9tIHJpZ2h0LWRvd24sXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICBnZXQgcmlnaHQtZG93biBhbmQgZG93biBmcm9tIHVwXHJcblxyXG4gICAgICAgICAgICAvLyBJZiBsZWZ0LWRvd24sIGdldCByaWdodC11cCwgcmlnaHQtZG93biBhbmQgdXAgZnJvbSBsZWZ0LWRvd24sXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgZ2V0IHJpZ2h0LWRvd24gYW5kIGRvd24gZnJvbSBsZWZ0LXVwLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgIGdldCBsZWZ0LXVwIGFuZCB1cCBmcm9tIGRvd25cclxuXHJcbiAgICAgICAgICAgIC8vIElmIGRvd24sIGdldCBsZWZ0LXVwLCB1cCBhbmQgcmlnaHQtdXAgZnJvbSBkb3duLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICBnZXQgcmlnaHQtZG93biBhbmQgcmlnaHQtdXAgZnJvbSBsZWZ0LWRvd25cclxuICAgICAgICAgICAgLy8gICAgICAgICAgZ2V0IGxlZnQtZG93biBhbmQgbGVmdC11cCBmcm9tIHJpZ2h0LWRvd25cclxuXHJcbiAgICAgICAgICAgIC8vIElmIHJpZ2h0LWRvd24sIGdldCBsZWZ0LXVwLCBsZWZ0LWRvd24gYW5kIHVwIGZyb20gcmlnaHQtZG93bixcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgZ2V0IGxlZnQtZG93biBhbmQgZG93biBmcm9tIHJpZ2h0LXVwLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBnZXQgcmlnaHQtdXAgYW5kIHVwIGZyb20gZG93blxyXG5cclxuICAgICAgICAgICAgaW50IHhfID1cclxuICAgICAgICAgICAgICAgIG4gPT0gVHJpYW5nbGVMb2NhdGlvbi5Ub3BMZWZ0IHx8IG4gPT0gVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21MZWZ0ID8gLTEgOlxyXG4gICAgICAgICAgICAgICAgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLlRvcFJpZ2h0IHx8IG4gPT0gVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21SaWdodCA/IDEgOlxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIHlfID1cclxuICAgICAgICAgICAgICAgIG4gPT0gVHJpYW5nbGVMb2NhdGlvbi5Ub3BMZWZ0IHx8IG4gPT0gVHJpYW5nbGVMb2NhdGlvbi5Ub3BSaWdodCB8fCBuID09IFRyaWFuZ2xlTG9jYXRpb24uVG9wID8gLTEgOiAxO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbkdldEhleGFnb25Mb2NQb3MgPSAoaW52ZXJ0WCwgaW52ZXJ0WSkgPT4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihpbnZlcnRYID09IC0xID8gMCA6IGludmVydFggPT0gMSA/IC14XyA6IHhfLCBpbnZlcnRZID8gLXlfIDogeV8pO1xuICAgICAgICAgICAgXHJcbkdldEhleGFnb25Mb2MgPSAoeCwgeSkgPT4geSA9PSAwID8gKChTeXN0ZW0uRnVuYzxUcmlhbmdsZUxvY2F0aW9uPikoKCkgPT5cclxue1xyXG4gICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oXCJ5IGNhbm5vdCBiZSAwXCIpO1xyXG59XHJcblxyXG4pKSgpIDogeCA9PSAwID8geSA9PSAtMSA/IFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tIDogVHJpYW5nbGVMb2NhdGlvbi5Ub3AgOiB4ID09IC0xID8geSA9PSAtMSA/IFRyaWFuZ2xlTG9jYXRpb24uVG9wTGVmdCA6IFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tTGVmdCA6IHggPT0gMSA/IHkgPT0gLTEgPyBUcmlhbmdsZUxvY2F0aW9uLlRvcFJpZ2h0IDogVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21SaWdodCA6ICgoU3lzdGVtLkZ1bmM8VHJpYW5nbGVMb2NhdGlvbj4pKCgpID0+XHJcbntcclxuICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKFwieCBtdXN0IGJlIC0xLCAwIG9yIDFcIik7XHJcbn1cclxuXHJcbikpKCk7XG5HZXRGaW5hbEhleGFnb25Mb2NQb3MgPSAoaW52ZXJ0WCwgaW52ZXJ0WSkgPT5cclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoR2V0SGV4YWdvbkxvY1BvcyhpbnZlcnRYLCBpbnZlcnRZKSwgb3V0IHgsIG91dCB5KTtcclxuICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KF82MGwgKyB4LCBfNjByICsgeSk7XHJcbn1cclxuXHJcbjtcbkNyZWF0ZVBvcyA9IChwb3MsIE4pID0+IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4ocG9zLkl0ZW0xLCBwb3MuSXRlbTIsIE4pO1xuQWRkU3F1YXJlID0gKGludCBpbnZlcnRYMSwgYm9vbCBpbnZlcnRZMSwgaW50IGludmVydFgyLCBib29sIGludmVydFkyLCBpbnQgeDFPdmVycmlkZSwgaW50IHgyT3ZlcnJpZGUpID0+XHJcbntcclxuICAgIGludCBfNjBsXztcclxuICAgIGludCBfNjByXztcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoR2V0RmluYWxIZXhhZ29uTG9jUG9zKGludmVydFgxLCBpbnZlcnRZMSksIG91dCBfNjBsXywgb3V0IF82MHJfKTtcclxuICAgIGlmICh4MU92ZXJyaWRlICE9IDApXHJcbiAgICAgICAgXzYwbF8gPSB4MU92ZXJyaWRlO1xyXG4gICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+IHBvczIgPSBHZXRIZXhhZ29uTG9jUG9zKGludmVydFgyLCBpbnZlcnRZMik7XHJcbiAgICBpZiAoeDJPdmVycmlkZSAhPSAwKVxyXG4gICAgICAgIHBvczIuSXRlbTEgPSB4Mk92ZXJyaWRlO1xyXG4gICAgVHJpYW5nbGVMb2NhdGlvbiBuXyA9IEdldEhleGFnb25Mb2MocG9zMi5JdGVtMSwgcG9zMi5JdGVtMik7XHJcbiAgICB2YXIgY29vcmRzXyA9IENyZWF0ZVBvcyhuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KF82MGxfLCBfNjByXyksIG5fKTtcclxuICAgIFNxdWFyZVR5cGUgc3F1YXJlSW5mbztcclxuICAgIGlmIChTcXVhcmVzLlRyeUdldFZhbHVlKGNvb3Jkc18sIG91dCBzcXVhcmVJbmZvKSlcclxuICAgIHtcclxuICAgICAgICBpZiAoc3F1YXJlSW5mby5Jc0FsaXZlKCkpXHJcbiAgICAgICAgICAgIGFkamFjZW50Q2VsbHMgKz0gMTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgICAgICBlbXB0eUFkakFjdGlvbiAhPSBudWxsID8gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCkgPT4gZW1wdHlBZGpBY3Rpb24uSW52b2tlKGNvb3Jkc18pKSA6IG51bGw7XHJcbn1cclxuXHJcbjtcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKG4pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Ub3BMZWZ0OlxyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLlRvcFJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbUxlZnQ6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tUmlnaHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaW52ZXJ0WSBpcyAtMSwgdGhlbiB0aGUgeSBjb29yZGluYXRlIGlzIHJlbW92ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaW52ZXJ0WSBpcyAwLCB0aGVuIHRoZSB5IGNvb3JkaW5hdGUgaXMgbm90IGludmVydGVkLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGludmVydFkgaXMgMSwgdGhlbiB0aGUgeSBjb29yZGluYXRlIGlzIGludmVydGVkLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGludmVydFggaXMgMCwgdGhlbiB0aGUgeCBjb29yZGluYXRlIGlzIG5vdCBpbnZlcnRlZC5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpbnZlcnRYIGlzIDEsIHRoZW4gdGhlIHggY29vcmRpbmF0ZSBpcyBpbnZlcnRlZC5cclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMSwgdHJ1ZSwgMCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgxLCBmYWxzZSwgMCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgtMSwgdHJ1ZSwgMCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgxLCBmYWxzZSwgMCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKC0xLCBmYWxzZSwgMCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDAsIHRydWUsIC0xLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKC0xLCB0cnVlLCAtMSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLlRvcDpcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b206XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDAsIHRydWUsIDAsIGZhbHNlLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMCwgdHJ1ZSwgMCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCB0cnVlLCAwLCBmYWxzZSwgLTEpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCBmYWxzZSwgMCwgZmFsc2UsIDEsIC0xKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMCwgdHJ1ZSwgMCwgZmFsc2UsIDEsIC0xKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMCwgZmFsc2UsIDAsIGZhbHNlLCAtMSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDAsIHRydWUsIDAsIGZhbHNlLCAtMSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKFwibiBtdXN0IGJlIDAsIDEsIDIsIDMsIDQgb3IgNVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGFkamFjZW50Q2VsbHMgPiBBcHAubWF4QWRqYWNlbnRDZWxscyA/IEFwcC5tYXhBZGphY2VudENlbGxzIDogYWRqYWNlbnRDZWxscztcclxuICAgICAgICB9XHJcbnByaXZhdGUgZGVsZWdhdGUgdm9pZCBfX19BZGRTcXVhcmVfRGVsZWdhdGVfMChpbnQgaW52ZXJ0WDEsIGJvb2wgaW52ZXJ0WTEsIGludCBpbnZlcnRYMiwgYm9vbCBpbnZlcnRZMiwgaW50IHgxT3ZlcnJpZGUgPSAwLCBpbnQgeDJPdmVycmlkZSA9IDApOyAgICB9XHJcbn1cclxuIl0KfQo=
