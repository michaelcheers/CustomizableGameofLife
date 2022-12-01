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

            for (var n1 = 0; n1 <= CustomizableGameofLife.App.currentMaxAdjacentCells; n1 = (n1 + 1) | 0) {
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
                    this.maxAdjacentCells = 12;
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
                    this.adjacencyRules = System.Array.init([CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One], CustomizableGameofLife.AdjacencyType);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDdXN0b21pemFibGVHYW1lb2ZMaWZlLmpzIiwKICAic291cmNlUm9vdCI6ICIiLAogICJzb3VyY2VzIjogWyJDbGFzczEuY3MiLCJFeHRlbnNpb25zLmNzIiwiTm90YWJsZU9iamVjdHNMaXN0LmNzIiwiU3F1YXJlLmNzIiwiR3JpZC5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQStmQUEsd0JBQWlFQTtZQUNyREEscUJBQXdCQTtZQUNwQ0E7WUFBcUJBLElBQUlBLENBQUNBLEtBQUlBLDhDQUE2QkE7Z0JBRTNDQTtvQkFFSUEsZUFBbUJBLFdBQVdBO29CQUM5QkEsSUFBSUEsa0JBQWtCQTt3QkFFbEJBLElBQUlBLEFBQXFDQTs0QkFDckNBLHlDQUFjQSw4Q0FBc0NBLGVBQWVBLHVCQUF2QkE7O3dCQUNoREEsSUFBSUEsQUFBcUNBOzRCQUNyQ0EsdUNBQVlBLDhDQUFzQ0EsZUFBZUEscUJBQXZCQTs7d0JBQzlDQSxJQUFJQSxBQUFxQ0E7NEJBQ3JDQSw0Q0FBaUJBLDhDQUFxQ0EsZUFBZUEsMEJBQXRCQTs7Ozs7OztZQUsvREE7WUFDQUEsMEJBQTBCQTtZQUMxQkE7WUFDQUEsMEJBQTBCQTtZQUMxQkEsMEJBQTBCQTs7WUFFMUJBLDBCQUF1Q0E7O2dCQUVuQ0E7Z0JBQ0FBLEtBQUtBLFdBQVdBLE9BQU9BO29CQUVuQkEsVUFBMEJBLDZCQUE2REEsOEJBQTBCQTtvQkFDakhBLEtBQUtBLFdBQVdBLE9BQU9BO3dCQUVuQkEsSUFBSUEsV0FBVUE7NEJBRVZBLGdCQUFnQkE7NEJBQ2hCQTs7d0JBRUpBLG1EQUF3QkEsaUZBQTJEQSxnREFBb0JBLDZCQUFrRUEsOEJBQStCQSxPQUF3QkEsNkRBQWVBLEdBQWZBO3dCQUNoT0E7Ozs7O1lBS1pBLGlCQUE4QkEsd0RBQzFDQSwwR0FBK0VBLDJEQUMvREEsK0JBQTBCQSw0REFBc0ZBLHNDQUNoSUEsNERBQXNGQSxzQ0FDdEZBLDREQUFzRkE7O1lB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QUFJQSx5QkFBb0JBLGtCQUFhQTt3QkFFakNBLElBQUlBOzRCQUNBQTs7O3dCQUdKQSxxQ0FBa0JBLFFBQU9BLEFBQXVDQSxlQUFzQkEsb0JBQVlBOzs7O2dCQUs5RkEsUUFBUUE7b0JBRUpBLEtBQUtBO29CQUNMQSxLQUFLQTtvQkFDTEEsS0FBS0E7b0JBQ0xBLEtBQUtBO3dCQU1EQTt3QkFDQUE7d0JBQ0FBLFVBQVVBO3dCQUNWQTt3QkFDQUEsVUFBVUE7d0JBQ1ZBLG1CQUFtQkE7d0JBQ25CQSxVQUFVQSxVQUFVQTt3QkFDcEJBO29CQUNKQSxLQUFLQTtvQkFDTEEsS0FBS0E7d0JBQ0RBO3dCQUNBQTt3QkFDQUEsNkJBQTZCQTt3QkFDN0JBLGlDQUFpQ0E7d0JBQ2pDQSxnQ0FBZ0NBO3dCQUNoQ0EsOEJBQThCQTt3QkFDOUJBLDZCQUE2QkE7d0JBQzdCQTtvQkFDSkE7d0JBQ0lBLE1BQU1BLElBQUlBOzs7Z0JBR2xCQSxPQUFPQSxnQkFBZ0JBLDhDQUF1QkEsOENBQXVCQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucztcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5EaWFnbm9zdGljcy5Db250cmFjdHM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uUmVmbGVjdGlvbjtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIEFwcFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IHhNdWx0aXBsaWVyID0gMjA7XHJcbnB1YmxpYyBzdGF0aWMgaW50IHlNdWx0aXBsaWVyXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB4TXVsdGlwbGllcjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgZG91YmxlIGFjdHVhbFhNdWx0aXBsaWVyXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBHcmlkIGlzIEhleEdyaWQgPyB4TXVsdGlwbGllciAqIDIgKiBIZXhHcmlkLmNvczYwIDogeE11bHRpcGxpZXI7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIGRvdWJsZSBhY3R1YWxZTXVsdGlwbGllclxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gR3JpZCBpcyBIZXhHcmlkID8geU11bHRpcGxpZXIgKiAyICogSGV4R3JpZC5zaW42MCA6IHlNdWx0aXBsaWVyO1xyXG4gICAgfVxyXG59ICAgICAgICBwdWJsaWMgc3RhdGljIGludCBzY3JlZW5XaWR0aCA9IFdpbmRvdy5Jbm5lcldpZHRoLCBzY3JlZW5IZWlnaHQgPSBXaW5kb3cuSW5uZXJIZWlnaHQ7XHJcbnB1YmxpYyBzdGF0aWMgaW50IHdpZHRoXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiAoaW50KU1hdGguQ2VpbGluZygoZG91YmxlKXNjcmVlbldpZHRoIC8geE11bHRpcGxpZXIpO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBpbnQgaGVpZ2h0XHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiAoaW50KU1hdGguQ2VpbGluZygoZG91YmxlKXNjcmVlbkhlaWdodCAvIHlNdWx0aXBsaWVyKTtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgSG90YmFyID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgIFBvc2l0aW9uID0gUG9zaXRpb24uQWJzb2x1dGUsXHJcbiAgICAgICAgICAgICAgICBMZWZ0ID0gXCIxMDBweFwiLFxyXG4gICAgICAgICAgICAgICAgVG9wID0gc3RyaW5nLkZvcm1hdChcInswfXB4XCIsV2luZG93LklubmVySGVpZ2h0IC0gNDApICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBSZXNldChtYWtlQmxhbms6IHRydWUpXHJcbiAgICAgICAgICAgIH0sXCJCbGFua1wiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBSZXNldCgpXHJcbiAgICAgICAgICAgIH0sXCJSZXNldFwiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLFxyXG4gICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT4gU2F2ZUFzU3RhcnRlcigpXHJcbiAgICAgICAgICAgIH0sXCJTYXZlIGFzIFN0YXJ0ZXJcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gWm9vbSh6b29tSW46IGZhbHNlKVxyXG4gICAgICAgICAgICB9LFwiWm9vbSBPdXRcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gWm9vbSh6b29tSW46IHRydWUpXHJcbiAgICAgICAgICAgIH0sXCJab29tIEluXCIpKVxyXG4sTmV4dEdyaWRUeXBlQnV0dG9uID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IE5leHRHcmlkVHlwZSgpXHJcbiAgICAgICAgICAgIH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLlRvQ2FtZWxTdHJpbmc8R3JpZFR5cGU+KEdyaWRUeXBlLlNxdWFyZSkpKVxyXG4sTmV4dFNxdWFyZVR5cGVCdXR0b24gPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gTmV4dFNxdWFyZVR5cGUoKVxyXG4gICAgICAgICAgICB9LFwiV2FsbFwiKSlcclxuLFBsYXlCdXR0b24gPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gSW52ZXJ0SXNQbGF5aW5nKClcclxuICAgICAgICAgICAgfSxcIuKWtlwiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBTaG93TW9kYWwoTW9kYWxUeXBlLlNldHRpbmdzKVxyXG4gICAgICAgICAgICB9LFwi4pqZXCIpKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTcXVhcmVUeXBlIFNxdWFyZVR5cGVQbGFjaW5nID0gU3F1YXJlVHlwZS5Db3VudDtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIEdyaWRUeXBlIEN1cnJlbnRHcmlkVHlwZSA9IEdyaWRUeXBlLlNxdWFyZTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxCdXR0b25FbGVtZW50IE5leHRHcmlkVHlwZUJ1dHRvbiwgTmV4dFNxdWFyZVR5cGVCdXR0b247XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBab29tIChib29sIHpvb21JbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHhNdWx0aXBsaWVyICs9IHpvb21JbiA/IDEgOiAtMTtcclxuICAgICAgICAgICAgaWYgKHhNdWx0aXBsaWVyIDw9IDEpXHJcbiAgICAgICAgICAgICAgICB4TXVsdGlwbGllciA9IDI7XHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBOZXh0U3F1YXJlVHlwZSAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU3F1YXJlVHlwZVBsYWNpbmcgPSAoU3F1YXJlVHlwZSkoKChpbnQpU3F1YXJlVHlwZVBsYWNpbmcgKyAxKSAlIChpbnQpKFNxdWFyZVR5cGUuQ291bnQgKyAxKSk7XHJcbiAgICAgICAgICAgIE5leHRTcXVhcmVUeXBlQnV0dG9uLklubmVySFRNTCA9IFNxdWFyZVR5cGVQbGFjaW5nID09IFNxdWFyZVR5cGUuQ291bnQgPyBcIldhbGxcIiA6IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5Ub0NhbWVsU3RyaW5nPFNxdWFyZVR5cGU+KFNxdWFyZVR5cGVQbGFjaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBOZXh0R3JpZFR5cGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ3VycmVudEdyaWRUeXBlID0gKEdyaWRUeXBlKSgoKGludClDdXJyZW50R3JpZFR5cGUgKyAxKSAlIChpbnQpR3JpZFR5cGUuQ291bnQpO1xyXG4gICAgICAgICAgICBOZXh0R3JpZFR5cGVCdXR0b24uSW5uZXJIVE1MID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLlRvQ2FtZWxTdHJpbmc8R3JpZFR5cGU+KEN1cnJlbnRHcmlkVHlwZSk7XHJcbiAgICAgICAgICAgIGlmIChDdXJyZW50R3JpZFR5cGUgPT0gR3JpZFR5cGUuVHJpYW5nbGUpXHJcbiAgICAgICAgICAgICAgICB4TXVsdGlwbGllciAqPSAyO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChDdXJyZW50R3JpZFR5cGUgPT0gR3JpZFR5cGUuU3F1YXJlKVxyXG4gICAgICAgICAgICAgICAgeE11bHRpcGxpZXIgLz0gMjtcclxuICAgICAgICAgICAgc3dpdGNoIChDdXJyZW50R3JpZFR5cGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgR3JpZFR5cGUuU3F1YXJlOlxyXG4gICAgICAgICAgICAgICAgICAgIEdyaWQgPSBuZXcgU3F1YXJlR3JpZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBHcmlkVHlwZS5IZXg6XHJcbiAgICAgICAgICAgICAgICAgICAgR3JpZCA9IG5ldyBIZXhHcmlkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEdyaWRUeXBlLlRyaWFuZ2xlOlxyXG4gICAgICAgICAgICAgICAgICAgIEdyaWQgPSBuZXcgVHJpYW5nbGVHcmlkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBSaWdodEhvdGJhciA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU3R5bGUgPSB7XHJcbiAgICAgICAgICAgICAgICBQb3NpdGlvbiA9IFBvc2l0aW9uLkFic29sdXRlLFxyXG4gICAgICAgICAgICAgICAgUmlnaHQgPSBcIjEwMHB4XCIsXHJcbiAgICAgICAgICAgICAgICBUb3AgPSBzdHJpbmcuRm9ybWF0KFwiezB9cHhcIixXaW5kb3cuSW5uZXJIZWlnaHQgLSA0MCkgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1pbmZvXCIsXHJcbiAgICAgICAgICAgICAgICBPbkNsaWNrID0gZSA9PiBTaG93TW9kYWwoTW9kYWxUeXBlLk5vdGFibGVPYmplY3RzKVxyXG4gICAgICAgICAgICB9LFwiTm90YWJsZSBPYmplY3RzXCIpKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFJlc2V0IChib29sIG1ha2VCbGFuayA9IGZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCFHbG9iYWwuQ29uZmlybShcIkFueSB1bnNhdmVkIGNoYW5nZXMgd2lsbCBiZSBsb3N0LiBDb250aW51ZT9cIikpIHJldHVybjtcclxuICAgICAgICAgICAgR3JpZC5DbGVhcigpO1xyXG5HcmlkPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4gZ3JpZDsgICAgICAgICAgICBpZiAoIW1ha2VCbGFuayAmJiAoZ3JpZCA9IEdyaWQgYXMgR3JpZDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+KSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0IHN0YXJ0ZXJQb3NpdGlvbnMgPSBHbG9iYWwuTG9jYWxTdG9yYWdlLkdldEl0ZW0oXCJzdGFydGVyUG9zaXRpb25zXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0ZXJQb3NpdGlvbnMgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgcyA9IChzdHJpbmcpc3RhcnRlclBvc2l0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXN0cmluZy5Jc051bGxPckVtcHR5KHMpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGpzb25SYXcgPSBKU09OLlBhcnNlKHMpLlRvRHluYW1pYygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoanNvblJhdy5sZW5ndGggPT0gMCB8fCBqc29uUmF3WzBdLkl0ZW0zID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVhY2ggKHZhciBwb3MgaW4gKEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID5bXT4ocykpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyaWQuU3F1YXJlcy5BZGQocG9zLCBTcXVhcmVUeXBlLkNlbGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVhY2ggKHZhciBzcXVhcmVJbmZvIGluIChKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsU3F1YXJlVHlwZSA+W10+KHMpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmlkLlNxdWFyZXMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oc3F1YXJlSW5mby5JdGVtMSwgc3F1YXJlSW5mby5JdGVtMiksIHNxdWFyZUluZm8uSXRlbTMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGxheWluZylcclxuICAgICAgICAgICAgICAgIEludmVydElzUGxheWluZygpO1xyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFNxdWFyZVR5cGUgPj4gR2V0Q29vcmRpbmF0ZXNJbnRlcmFsKClcclxuICAgICAgICB7XHJcbkdyaWQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PiBnOyAgICAgICAgICAgIGlmICgoZyA9IEdyaWQgYXMgR3JpZDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+KSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IG9mZnNldENvb3JkcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oTmVnRGl2KG9mZnNldFBvcy5JdGVtMSwgKGludClhY3R1YWxYTXVsdGlwbGllciksIE5lZ0RpdihvZmZzZXRQb3MuSXRlbTIsIChpbnQpYWN0dWFsWU11bHRpcGxpZXIpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlRvTGlzdDxLZXlWYWx1ZVBhaXI8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4sU3F1YXJlVHlwZT4+KGcuU3F1YXJlcykuQ29udmVydEFsbDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+PigoQ29udmVydGVyPEtleVZhbHVlUGFpcjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixTcXVhcmVUeXBlPixTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+PikocyA9PiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFNxdWFyZVR5cGU+KHMuS2V5Lkl0ZW0xICsgb2Zmc2V0Q29vcmRzLkl0ZW0xLCBzLktleS5JdGVtMiArIG9mZnNldENvb3Jkcy5JdGVtMiwgcy5WYWx1ZSkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFNxdWFyZVR5cGUgPj4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBMaXN0PChpbnQgeCwgaW50IHksIFNxdWFyZVR5cGUgc3F1YXJlVHlwZSk+IEdldE5vcm1hbGl6ZWRDb29yZGluYXRlcyAoKVxyXG4gICAgICAgIC8ve1xyXG4gICAgICAgIC8vICAgIExpc3Q8KGludCB4LCBpbnQgeSwgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKT4gY29vcmRzID0gR2V0Q29vcmRpbmF0ZXNJbnRlcmFsKCk7XHJcbiAgICAgICAgLy8gICAgY29vcmRzID0gY29vcmRzLldoZXJlKGMgPT4gYy54ID49IDAgJiYgYy55ID49IDAgJiYgYy54IDwgd2lkdGggJiYgYy55IDwgaGVpZ2h0KS5Ub0xpc3QoKTtcclxuICAgICAgICAvLyAgICBpbnQgbWluWCA9IGNvb3Jkcy5NaW4oYyA9PiBjLngpLCBtaW5ZID0gY29vcmRzLk1pbihjID0+IGMueSk7XHJcbiAgICAgICAgLy8gICAgY29vcmRzID0gY29vcmRzLlNlbGVjdChjID0+IChjLnggLSBtaW5YLCBjLnkgLSBtaW5ZLCBjLnNxdWFyZVR5cGUpKS5Ub0xpc3QoKTtcclxuICAgICAgICAvLyAgICByZXR1cm4gY29vcmRzO1xyXG4gICAgICAgIC8vfVxyXG5cclxuICAgICAgICAvLyAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEdldENvb3JkaW5hdGVzICgpXHJcbiAgICAgICAgLy8gICAgICAgIHtcclxuICAgICAgICAvLyAgICAgICAgICAgIHN0cmluZyBjb2RlR2VuZXJhdGVkID0gJEBcIihuZXcgSGFzaFNldDwoaW50IHgsIGludCB5KT5cclxuICAgICAgICAvL3t7XHJcbiAgICAgICAgLy8gICAge3N0cmluZy5Kb2luKFwiLFxcbiAgICBcIiwgR2V0Tm9ybWFsaXplZENvb3JkaW5hdGVzKCkuU2VsZWN0KHQgPT4gJFwiKHt0Lnh9LCB7dC55fSlcIikpfVxyXG4gICAgICAgIC8vfX0sIFwiXCJVbnRpdGxlZCBPYmplY3RcIlwiLCB7SlNPTi5TdHJpbmdpZnkoJFwieyhhZGphY2VuY3lSdWxlcy5BbGwoYSA9PiBhID09IEFkamFjZW5jeVR5cGUuT25lKSA/IFwiXCIgOiAoc3RyaW5nLkNvbmNhdChhZGphY2VuY3lSdWxlcy5TZWxlY3QoayA9PiAoaW50KWspKSkgKyBcIiAtPiBcIil9e3N0cmluZy5Db25jYXQoZGVhZFJ1bGVzLlNlbGVjdChrID0+IGsgPyAxIDogMCkpfSAvIHtzdHJpbmcuQ29uY2F0KGxpdmluZ1J1bGVzLlNlbGVjdChrID0+IGsgPyAxIDogMCkpfVwiKX0pXCI7XHJcbiAgICAgICAgLy8gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCBtb2RhbCwgbW9kYWxDb250ZW50ID0gXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgbmV3IEhUTUxEaXZFbGVtZW50IHsgQ2xhc3NOYW1lID0gXCJtb2RhbC1jb250ZW50XCIgfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAuQWRkVG8obmV3IEhUTUxEaXZFbGVtZW50IHsgQ2xhc3NOYW1lID0gXCJtb2RhbC1kaWFsb2dcIiB9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAuQWRkVG8obW9kYWwgPSBuZXcgSFRNTERpdkVsZW1lbnQgeyBDbGFzc05hbWUgPSBcIm1vZGFsXCIsIFN0eWxlID0geyBEaXNwbGF5ID0gXCJpbmhlcml0XCIgfSB9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgLkFkZFRvKERvY3VtZW50LkJvZHkpXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICBtb2RhbENvbnRlbnQuQWRkKFxyXG5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICBuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwibW9kYWwtaGVhZGVyXCJcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAuQWRkKG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0bi1jbG9zZVwiLFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT4gbW9kYWwuUmVtb3ZlKClcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgLkFkZChuZXcgSFRNTFNwYW5FbGVtZW50XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5uZXJIVE1MID0gXCImdGltZXM7XCJcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICApLFxyXG5cclxuXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgbmV3IEhUTUxQcmVFbGVtZW50XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcIm1vZGFsLWJvZHlcIixcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgU3R5bGUgPVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBbXCJ1c2VyLXNlbGVjdFwiXSA9IFwidGV4dFwiXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICB9LkFkZChjb2RlR2VuZXJhdGVkKVxyXG4gICAgICAgIC8vICAgICAgICAgICAgKTtcclxuICAgICAgICAvLyAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgU2F2ZUFzU3RhcnRlciAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgR2xvYmFsLkxvY2FsU3RvcmFnZS5TZXRJdGVtKFxyXG4gICAgICAgICAgICAgICAgXCJzdGFydGVyUG9zaXRpb25zXCIsIEpzb25Db252ZXJ0LlNlcmlhbGl6ZU9iamVjdChHZXRDb29yZGluYXRlc0ludGVyYWwoKSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgU2V0dGluZ3NQb3B1cCwgTm90YWJsZU9iamVjdHNQb3B1cDtcclxucHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBDcmVhdGVQb3B1cCgpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTERpdkVsZW1lbnR7U3R5bGUgPSB7Rm9udFNpemUgPSBcIjEuNXJlbVwiLCBCYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCIsIFBvc2l0aW9uID0gUG9zaXRpb24uRml4ZWQsIFRvcCA9IFwiMHB4XCIsIExlZnQgPSBcIjI1JVwiLCBXaWR0aCA9IFwiNTAlXCIsIEhlaWdodCA9IFwiMTAwJVwiLCBEaXNwbGF5ID0gRGlzcGxheS5Ob25lfX07XHJcbn1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IFBvcHVwQ29udGFpbmVyID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IEhUTUxEaXZFbGVtZW50KCksKF9vMSk9PntfbzEuU3R5bGUuUG9zaXRpb249IFBvc2l0aW9uLkZpeGVkO19vMS5TdHlsZS5Ub3A9IFwiMFwiO19vMS5TdHlsZS5MZWZ0PSBcIjBcIjtfbzEuU3R5bGUuV2lkdGg9IFwiMTAwJVwiO19vMS5TdHlsZVtcIngtaW5kZXhcIl09IDk5OTk5OTtfbzEuU3R5bGUuSGVpZ2h0PSBcIjEwMCVcIjtfbzEuU3R5bGUuQmFja2dyb3VuZENvbG9yPSBcInJnYmEoMCwgMCwgMCwgMC41KVwiO19vMS5TdHlsZS5EaXNwbGF5PSBEaXNwbGF5Lk5vbmU7cmV0dXJuIF9vMTt9KVxyXG4sU2V0dGluZ3NQb3B1cCA9IENyZWF0ZVBvcHVwKCkpXHJcbixOb3RhYmxlT2JqZWN0c1BvcHVwID0gQ3JlYXRlUG9wdXAoKSk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTEJ1dHRvbkVsZW1lbnQgU2V0dGluZ3NCdXR0b247XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTEJ1dHRvbkVsZW1lbnQgUGxheUJ1dHRvbjtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEludmVydElzUGxheWluZyAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcGxheWluZyA9ICFwbGF5aW5nO1xyXG4gICAgICAgICAgICBQbGF5QnV0dG9uLklubmVySFRNTCA9IHBsYXlpbmcgPyBcIuKPuFwiIDogXCLilrZcIjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgcGxheWluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2xbXSBsaXZpbmdSdWxlcyAgID0gbmV3IGJvb2xbOV0geyBmYWxzZSwgZmFsc2UsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSB9O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbFtdIGRlYWRSdWxlcyAgICAgPSBuZXcgYm9vbFs5XSB7IGZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSB9O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgQWRqYWNlbmN5VHlwZVtdIGFkamFjZW5jeVJ1bGVzID0gbmV3IEFkamFjZW5jeVR5cGVbbWF4QWRqYWNlbnRDZWxsc10geyBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lIH07XHJcbnB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ3JlYXRlQ2FudmFzKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MQ2FudmFzRWxlbWVudHtXaWR0aCA9IHNjcmVlbldpZHRoLCBIZWlnaHQgPSBzY3JlZW5IZWlnaHR9O1xyXG59cHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBDcmVhdGVUb3BDYW52YXMoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxDYW52YXNFbGVtZW50e1dpZHRoID0gd2lkdGggKyAyLCBIZWlnaHQgPSBoZWlnaHQgKyAyfTtcclxufSAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGUgaHlwbyhkb3VibGUgeCwgZG91YmxlIHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5TcXJ0KE1hdGguUG93KHgsIDIpICsgTWF0aC5Qb3coeSwgMikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IENyZWF0ZUJvdHRvbUNhbnZhcygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBCb3R0b21DYW52YXMgPSBHcmlkIGlzIEhleEdyaWQgP1xyXG4gICAgICAgICAgICAgICAgbmV3IEhUTUxDYW52YXNFbGVtZW50XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgV2lkdGggPSBET01DYW52YXMuV2lkdGggKyA0ICogeE11bHRpcGxpZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgSGVpZ2h0ID0gRE9NQ2FudmFzLkhlaWdodCArIDQgKiB5TXVsdGlwbGllclxyXG4gICAgICAgICAgICAgICAgfSA6XHJcbiAgICAgICAgICAgICAgICBuZXcgSFRNTENhbnZhc0VsZW1lbnRcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBXaWR0aCA9IHNjcmVlbldpZHRoICsgMiAqIHhNdWx0aXBsaWVyLFxyXG4gICAgICAgICAgICAgICAgICAgIEhlaWdodCA9IHNjcmVlbkhlaWdodCArIDIgKiB5TXVsdGlwbGllclxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIEJvdHRvbUNhbnZhc0NvbnRleHQgPSBCb3R0b21DYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuU3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuVHJhbnNsYXRlKDAuNSwgMC41KTtcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5MaW5lV2lkdGggPSAxO1xyXG5IZXhHcmlkIGg7ICAgICAgICAgICAgaWYgKChoID0gR3JpZCBhcyBIZXhHcmlkKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgYSA9IC0oaW50KWh5cG8od2lkdGgsIGhlaWdodCk7IGEgPCAoaW50KWh5cG8od2lkdGgsIGhlaWdodCk7IGErKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCBiID0gLShpbnQpaHlwbyh3aWR0aCwgaGVpZ2h0KTsgYiA8IChpbnQpaHlwbyh3aWR0aCwgaGVpZ2h0KTsgYisrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuaW50IHg7XG5pbnQgeTtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoaC5HZXREcmF3UG9zaXRpb24obmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihhLCBiKSksIG91dCB4LCBvdXQgeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuRHJhd0hleGFnb24oeCwgeSwgeE11bHRpcGxpZXIgKiAyIC8gMywgc3Ryb2tlOiB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICBUcmlhbmdsZUdyaWQgdDtcclxuICAgIGlmICgodCA9IEdyaWQgYXMgVHJpYW5nbGVHcmlkKSAhPSBudWxsKVxyXG4gICAge1xyXG4gICAgICAgIGZvciAoaW50IGEgPSAtKGludCloeXBvKHdpZHRoLCBoZWlnaHQpOyBhIDwgKGludCloeXBvKHdpZHRoLCBoZWlnaHQpOyBhKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGludCBiID0gLShpbnQpaHlwbyh3aWR0aCwgaGVpZ2h0KTsgYiA8IChpbnQpaHlwbyh3aWR0aCwgaGVpZ2h0KTsgYisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKFRyaWFuZ2xlTG9jYXRpb24gdGwgPSBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQ7IHRsIDwgVHJpYW5nbGVMb2NhdGlvbi5Db3VudDsgdGwrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnQgeDtcclxuICAgICAgICAgICAgICAgICAgICBpbnQgeTtcclxuICAgICAgICAgICAgICAgICAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KHQuR2V0RHJhd1Bvc2l0aW9uKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4oYSwgYiwgdGwpKSwgb3V0IHgsIG91dCB5KTtcclxuICAgICAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkRyYXdUcmlhbmdsZSh4LCB5LCB4TXVsdGlwbGllciAqIDIgLyAzLCB0bCwgc3Ryb2tlOiB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIC8vSGV4R3JpZCBncmlkID0gbmV3IEhleEdyaWQoKTtcclxuICAgIC8vZG91YmxlIHhPZmZzZXQgPSB3aWR0aCAvIDIgKiBBcHAueE11bHRpcGxpZXIgKyBvZmZzZXRQb3MueFxyXG4gICAgLy8gICAgICwgeU9mZnNldCA9IGhlaWdodCAqIEFwcC54TXVsdGlwbGllciArIG9mZnNldFBvcy55O1xyXG4gICAgLy9pbnQgbWluV2lkdGggPSAtMiwgbWluSGVpZ2h0ID0gLTI7XHJcbiAgICAvL2ludCBtYXhXaWR0aCA9IChpbnQpTWF0aC5DZWlsaW5nKGh5cG8od2lkdGgsIGhlaWdodCkpLCBtYXhIZWlnaHQgPSAoaW50KU1hdGguQ2VpbGluZyhoeXBvKHdpZHRoLCBoZWlnaHQpKTtcclxuICAgIC8vZm9yIChpbnQgXzMwbCA9IG1pbldpZHRoIC0gMjsgXzMwbCA8PSAobWF4V2lkdGggKyAyKTsgXzMwbCsrKVxyXG4gICAgLy97XHJcbiAgICAvLyAgICB2YXIgcG9zMSA9IGdyaWQuR2V0RHJhd1Bvc2l0aW9uKChfMzBsLCBtaW5IZWlnaHQgLSAzKSk7XHJcbiAgICAvLyAgICB2YXIgcG9zMiA9IGdyaWQuR2V0RHJhd1Bvc2l0aW9uKChfMzBsLCBtYXhIZWlnaHQgKyAzKSk7XHJcbiAgICAvLyAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbyhwb3MxLnggKyB4T2Zmc2V0LCBwb3MxLnkgKyB5T2Zmc2V0KTtcclxuICAgIC8vICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKHBvczIueCArIHhPZmZzZXQsIHBvczIueSArIHlPZmZzZXQpO1xyXG4gICAgLy99XHJcbiAgICAvL2ZvciAoaW50IF8zMHIgPSBtaW5IZWlnaHQgLSAyOyBfMzByIDw9IChtYXhIZWlnaHQgKyAyKTsgXzMwcisrKVxyXG4gICAgLy97XHJcbiAgICAvLyAgICB2YXIgcG9zMSA9IGdyaWQuR2V0RHJhd1Bvc2l0aW9uKChtaW5XaWR0aCAtIDMsIF8zMHIpKTtcclxuICAgIC8vICAgIHZhciBwb3MyID0gZ3JpZC5HZXREcmF3UG9zaXRpb24oKG1heFdpZHRoICsgMywgXzMwcikpO1xyXG4gICAgLy8gICAgQm90dG9tQ2FudmFzQ29udGV4dC5Nb3ZlVG8ocG9zMS54ICsgeE9mZnNldCwgcG9zMS55ICsgeU9mZnNldCk7XHJcbiAgICAvLyAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVUbyhwb3MyLnggKyB4T2Zmc2V0LCBwb3MyLnkgKyB5T2Zmc2V0KTtcclxuICAgIC8vfVxyXG4gICAgLy9mb3IgKGludCB5ID0gbWluSGVpZ2h0IC0gMjsgeSA8PSAobWF4SGVpZ2h0ICsgMik7IHkrKylcclxuICAgIC8ve1xyXG4gICAgLy8gICAgdmFyIHBvczEgPSBncmlkLkdldERyYXdQb3NpdGlvbigoLXdpZHRoIC8geE11bHRpcGxpZXIsIHkpKTtcclxuICAgIC8vICAgIHZhciBwb3MyID0gZ3JpZC5HZXREcmF3UG9zaXRpb24oKHksIC13aWR0aCAvIHhNdWx0aXBsaWVyKSk7XHJcbiAgICAvLyAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbyhwb3MxLnggKyB4T2Zmc2V0LCBwb3MxLnkgKyB5T2Zmc2V0KTtcclxuICAgIC8vICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKHBvczIueCArIHhPZmZzZXQsIHBvczIueSArIHlPZmZzZXQpO1xyXG4gICAgLy99XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChHcmlkIGlzIFNxdWFyZUdyaWQpXHJcbiAgICB7XHJcbiAgICAgICAgZm9yIChpbnQgeCA9IDA7IHggPD0gKHdpZHRoICsgMik7IHgrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTW92ZVRvKHggKiB4TXVsdGlwbGllciwgMCk7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKHggKiB4TXVsdGlwbGllciwgKGhlaWdodCArIDMpICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChpbnQgeSA9IDA7IHkgPD0gKGhlaWdodCArIDIpOyB5KyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbygwLCB5ICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVUbygod2lkdGggKyAzKSAqIHhNdWx0aXBsaWVyLCB5ICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDwgMTA7IG4rKylcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuU3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBCb3R0b21DYW52YXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IERPTUNhbnZhcyA9IENyZWF0ZUNhbnZhcygpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIERPTUNhbnZhc0NvbnRleHQgPSBET01DYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgR3JpZCBHcmlkID0gbmV3IFNxdWFyZUdyaWQoKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gb2Zmc2V0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IE1vdXNlUG9zICh0aGlzIE1vdXNlRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciByZWN0ID0gRE9NQ2FudmFzLkdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KShlLkNsaWVudFggLSByZWN0LkxlZnQpLCAoaW50KShlLkNsaWVudFkgLSByZWN0LlRvcCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgTmVnRGl2IChpbnQgYSwgaW50IGIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgcmVzID0gYSAvIGI7XHJcbiAgICAgICAgICAgIHJldHVybiAoYSA8IDAgJiYgYSAhPSBiICogcmVzKSA/IHJlcyAtIDEgOiByZXM7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIGRvdWJsZSBOZWdEaXZEb3VibGUoZG91YmxlIGEsIGRvdWJsZSBiKVxyXG57XHJcbiAgICByZXR1cm4gYSA+PSAwID8gYSAvIGIgOiAoYSAtIGIgKyAxKSAvIGI7XHJcbn1cclxuICAgICAgICBwdWJsaWMgY29uc3QgaW50IG1heEFkamFjZW50Q2VsbHMgPSAxMjtcclxucHVibGljIHN0YXRpYyBpbnQgY3VycmVudE1heEFkamFjZW50Q2VsbHNcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIEdyaWQgaXMgSGV4R3JpZCA/IDYgOiBHcmlkIGlzIFNxdWFyZUdyaWQgPyA4IDogR3JpZCBpcyBUcmlhbmdsZUdyaWQgPyAxMiA6ICgoU3lzdGVtLkZ1bmM8aW50PikoKCkgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEV4Y2VwdGlvbihzdHJpbmcuRm9ybWF0KFwiR3JpZCB0eXBlIG5vdCBmb3VuZDogezB9XCIsR3JpZC5HZXRUeXBlKCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICkpKCk7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBzdGF0aWMgTGlzdDxIVE1MU2VsZWN0RWxlbWVudD4gYWRqYWNlbmN5UnVsZXNDZWxscyA9IG5ldyBMaXN0PEhUTUxTZWxlY3RFbGVtZW50PigpO1xyXG4gICAgICAgIHN0YXRpYyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPEhUTUxJbnB1dEVsZW1lbnQsSFRNTElucHV0RWxlbWVudD4+IG9wdGlvbkNlbGxzID0gbmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SFRNTElucHV0RWxlbWVudCxIVE1MSW5wdXRFbGVtZW50Pj4oKTtcclxuXHJcbiAgICAgICAgc3RhdGljIHZvaWQgQXBwbHlQcmVzZXQoYm9vbFtdIGxpdmluZ1J1bGVzLCBib29sW10gZGVhZFJ1bGVzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPD0gODsgbisrKVxyXG4gICAgICAgICAgICB7XHJcbm9wdGlvbkNlbGxzW25dLkl0ZW0xLlNldEJvb2xWYWx1ZShsaXZpbmdSdWxlc1tuXSk7XHJcbm9wdGlvbkNlbGxzW25dLkl0ZW0yLlNldEJvb2xWYWx1ZShkZWFkUnVsZXNbbl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZW51bSBNb2RhbFR5cGVcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNldHRpbmdzLFxyXG4gICAgICAgICAgICBOb3RhYmxlT2JqZWN0c1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFNob3dNb2RhbCAoTW9kYWxUeXBlIG1vZGFsVHlwZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFBvcHVwQ29udGFpbmVyLlN0eWxlLkRpc3BsYXkgPSBcIlwiO1xyXG4gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCB0b1Nob3c7XHJcbiAgICAgICAgICAgIHN3aXRjaCAobW9kYWxUeXBlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1vZGFsVHlwZS5TZXR0aW5nczpcclxuICAgICAgICAgICAgICAgICAgICB0b1Nob3cgPSBTZXR0aW5nc1BvcHVwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNb2RhbFR5cGUuTm90YWJsZU9iamVjdHM6XHJcbiAgICAgICAgICAgICAgICAgICAgdG9TaG93ID0gTm90YWJsZU9iamVjdHNQb3B1cDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEFyZ3VtZW50RXhjZXB0aW9uKCgoaW50KW1vZGFsVHlwZSkuVG9TdHJpbmcoKSwgXCJtb2RhbFR5cGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yZWFjaCAoSFRNTERpdkVsZW1lbnQgZGl2IGluIG5ld1tdIHsgU2V0dGluZ3NQb3B1cCwgTm90YWJsZU9iamVjdHNQb3B1cCB9KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkaXYuU3R5bGUuRGlzcGxheSA9IGRpdiA9PSB0b1Nob3cgPyBcIlwiIDogXCJub25lXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBIaWRlTW9kYWwgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFBvcHVwQ29udGFpbmVyLlN0eWxlLkRpc3BsYXkgPSBEaXNwbGF5Lk5vbmU7XHJcbiAgICAgICAgICAgIFNldHRpbmdzUG9wdXAuU3R5bGUuRGlzcGxheSA9IERpc3BsYXkuTm9uZTtcclxuICAgICAgICAgICAgTm90YWJsZU9iamVjdHNQb3B1cC5TdHlsZS5EaXNwbGF5ID0gRGlzcGxheS5Ob25lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBEcmF3U2hhcGUgKEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gU3F1YXJlcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCB4TXVsdGlwbGllciA9IEFwcC54TXVsdGlwbGllciAqIDI7XHJcbiAgICAgICAgICAgIGludCB5TXVsdGlwbGllciA9IEFwcC55TXVsdGlwbGllciAqIDI7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXR0aW5nIHdpZHRoIGFuZCBoZWlnaHQgb2Ygc2hhcGVcclxuICAgICAgICAgICAgaW50IHdpZHRoID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5NYXg8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4+KFNxdWFyZXMsKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4saW50PikocyA9PiBzLkl0ZW0xKSkgKyAxO1xyXG4gICAgICAgICAgICBpbnQgaGVpZ2h0ID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5NYXg8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4+KFNxdWFyZXMsKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4saW50PikocyA9PiBzLkl0ZW0yKSkgKyAxO1xyXG4gICAgICAgICAgICAvLyBEcmF3aW5nIG9uIGlubmVyIGNhbnZhc1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBpbm5lckNhbnZhcyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBXaWR0aCA9IHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgSGVpZ2h0ID0gaGVpZ2h0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBjb250ZXh0ID0gaW5uZXJDYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIFVpbnQ4Q2xhbXBlZEFycmF5IGltYWdlRGF0YUFycmF5ID0gQ3JlYXRlSW1hZ2VEYXRhQXJyYXkod2lkdGgsIGhlaWdodCk7XHJcbmZvcmVhY2ggKHZhciBfZDEgaW4gU3F1YXJlcylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2QxLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaW1hZ2VEYXRhQXJyYXlbKHggKyB5ICogd2lkdGgpICogNCArIDNdID0gMjU1O1xyXG59XG4gICAgICAgICAgICBJbWFnZURhdGEgaW1hZ2VEYXRhID0gbmV3IEltYWdlRGF0YShpbWFnZURhdGFBcnJheSwgKHVpbnQpd2lkdGgsICh1aW50KWhlaWdodCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuUHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XHJcbiAgICAgICAgICAgIC8vIFJlc2l6aW5nIHRvIHVwcGVyIGNhbnZhc1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBvdXRlckNhbnZhcyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBXaWR0aCA9IHdpZHRoICogeE11bHRpcGxpZXIsXHJcbiAgICAgICAgICAgICAgICBIZWlnaHQgPSBoZWlnaHQgKiB5TXVsdGlwbGllclxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgb3V0ZXJDb250ZXh0ID0gb3V0ZXJDYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIG91dGVyQ29udGV4dC5JbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgb3V0ZXJDb250ZXh0LkRyYXdJbWFnZShpbm5lckNhbnZhcywgMCwgMCwgb3V0ZXJDYW52YXMuV2lkdGgsIG91dGVyQ2FudmFzLkhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gb3V0ZXJDYW52YXM7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIFVpbnQ4Q2xhbXBlZEFycmF5IENyZWF0ZUltYWdlRGF0YUFycmF5KGludCB3aWR0aCwgaW50IGhlaWdodClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBVaW50OENsYW1wZWRBcnJheSh3aWR0aCAqIGhlaWdodCAqIDQpO1xyXG59cHVibGljIHN0YXRpYyBIVE1MSW5wdXRFbGVtZW50IENyZWF0ZUNoZWNrYm94KClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MSW5wdXRFbGVtZW50e1R5cGUgPSBJbnB1dFR5cGUuQ2hlY2tib3gsIFN0eWxlID0ge1dpZHRoID0gXCIxcmVtXCIsIEhlaWdodCA9IFwiMWVtXCJ9fTtcclxufXB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgQ3JlYXRlMDFTZWxlY3RvcigpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTFNlbGVjdEVsZW1lbnQoKS5BZGQ8SFRNTFNlbGVjdEVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudHtWYWx1ZSA9IFwiZmFsc2VcIn0sXCIwXCIpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcInRydWVcIn0sXCIxXCIpKTtcclxufXB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgQ3JlYXRlMDEyU2VsZWN0b3IoKVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MU2VsZWN0RWxlbWVudD4obmV3IEhUTUxTZWxlY3RFbGVtZW50KCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCIwXCJ9LFwiMFwiKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCIxXCJ9LFwiMVwiKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCIyXCJ9LFwiMlwiKSk7XHJcbn1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbiAoKVxyXG4gICAgICAgIHtcclxuU3lzdGVtLkFjdGlvbjxNb3VzZUV2ZW50PEhUTUxDYW52YXNFbGVtZW50Pj4gUHJvY2Vzc01vdXNlRXZlbnQgPSBudWxsO1xuICAgICAgICAgICAgb2JqZWN0IHJ1bGVzT2JqZWN0U3RyID0gR2xvYmFsLkxvY2FsU3RvcmFnZS5HZXRJdGVtKFwicnVsZXNcIik7XHJcbnN0cmluZyByOyAgICAgICAgICAgIGlmICgociA9IHJ1bGVzT2JqZWN0U3RyIGFzIHN0cmluZykgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pYyBydWxlc09iaiA9IEpTT04uUGFyc2Uocik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bGVzT2JqZWN0U3RyICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoU2NyaXB0LldyaXRlKFwiezB9IGluc3RhbmNlb2YgQXJyYXlcIiwgcnVsZXNPYmoubGl2aW5nUnVsZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGl2aW5nUnVsZXMgPSBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxib29sW10+KEpTT04uU3RyaW5naWZ5KHJ1bGVzT2JqLmxpdmluZ1J1bGVzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTY3JpcHQuV3JpdGUoXCJ7MH0gaW5zdGFuY2VvZiBBcnJheVwiLCBydWxlc09iai5kZWFkUnVsZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVhZFJ1bGVzID0gSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8Ym9vbFtdPihKU09OLlN0cmluZ2lmeShydWxlc09iai5kZWFkUnVsZXMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFNjcmlwdC5Xcml0ZShcInswfSBpbnN0YW5jZW9mIEFycmF5XCIsIHJ1bGVzT2JqLmFkamFjZW5jeVJ1bGVzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzID0gSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8aW50W10+KEpTT04uU3RyaW5naWZ5KHJ1bGVzT2JqLmFkamFjZW5jeVJ1bGVzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggeyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5TdHlsZVtcInVzZXItc2VsZWN0XCJdID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkhlYWQuQXBwZW5kQ2hpbGQobmV3IEhUTUxMaW5rRWxlbWVudCB7IFJlbCA9IFwic3R5bGVzaGVldFwiLCBIcmVmID0gXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2Jvb3RzdHJhcEA1LjIuMC9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzc1wiIH0pO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LlN0eWxlLk1hcmdpbiA9IFwiMHB4XCI7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQoUG9wdXBDb250YWluZXIpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKG5ldyBIVE1MU3R5bGVFbGVtZW50IHsgSW5uZXJIVE1MID0gXCJ0ZCwgdGggeyBib3JkZXI6IDFweCBzb2xpZCBibGFjazsgcGFkZGluZzogNXB4IH0gYnV0dG9uIHsgbWFyZ2luLXJpZ2h0OiA1cHggfVwiIH0pO1xyXG5cclxuICAgICAgICAgICAgSFRNTFRhYmxlRWxlbWVudCBhZGphY2VuY3lSdWxlc1RhYmxlID0gbmV3IEhUTUxUYWJsZUVsZW1lbnQgeyBTdHlsZSA9IHsgTWFyZ2luTGVmdCA9IFwiYXV0b1wiLCBNYXJnaW5SaWdodCA9IFwiYXV0b1wiIH0gfTtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW50IG4gPSAwO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgeSA9IDA7IHkgPCAzOyB5KyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgSFRNTFRhYmxlUm93RWxlbWVudCByb3cgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlUm93RWxlbWVudD4obmV3IEhUTUxUYWJsZVJvd0VsZW1lbnQoKSxhZGphY2VuY3lSdWxlc1RhYmxlKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCB4ID0gMDsgeCA8IDM7IHgrKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4ID09IDEgJiYgeSA9PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3cuQXBwZW5kQ2hpbGQobmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzQ2VsbHMuQWRkKEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MU2VsZWN0RWxlbWVudD4oQ3JlYXRlMDEyU2VsZWN0b3IoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCkscm93KSkuU2V0QWRqYWNlbmN5VmFsdWUoYWRqYWNlbmN5UnVsZXNbbl0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbisrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgSFRNTFRhYmxlRWxlbWVudCBydWxlc1RhYmxlID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVFbGVtZW50PihcclxubmV3IEhUTUxUYWJsZUVsZW1lbnQgeyBTdHlsZSA9IHsgTWFyZ2luTGVmdCA9IFwiYXV0b1wiLCBNYXJnaW5SaWdodCA9IFwiYXV0b1wiIH0gfSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KFxyXG4gICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZVJvd0VsZW1lbnQoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudCgpLFwiI1wiKSxcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQoKSxcIkxcIiksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50KCksXCJEXCIpXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8PSBjdXJyZW50TWF4QWRqYWNlbnRDZWxsczsgbisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIVE1MVGFibGVSb3dFbGVtZW50IHJvdyA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVSb3dFbGVtZW50PihuZXcgSFRNTFRhYmxlUm93RWxlbWVudCgpLHJ1bGVzVGFibGUpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KCAgICAgICAgICAgICAgICByb3csQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSxuLlRvU3RyaW5nKCkpKTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbkNlbGxzLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8SFRNTElucHV0RWxlbWVudCwgSFRNTElucHV0RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxJbnB1dEVsZW1lbnQ+KENyZWF0ZUNoZWNrYm94KCksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSwgcm93KSkuU2V0Qm9vbFZhbHVlKGxpdmluZ1J1bGVzW25dKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxJbnB1dEVsZW1lbnQ+KENyZWF0ZUNoZWNrYm94KCksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSwgcm93KSkuU2V0Qm9vbFZhbHVlKGRlYWRSdWxlc1tuXSkpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcgLGJvb2xbXSAsYm9vbFtdID4+IHByZXNldHNMaXN0ID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nICxib29sW10gLGJvb2xbXSA+PigpLChfbzEpPT57X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJDb253YXkncyBHYW1lIG9mIExpZmUgUHJlc2V0XCIsIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO19vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZywgYm9vbFtdLCBib29sW10+KFwiSW1tb3J0YWwgQ2VsbHMgUHJlc2V0XCIsIG5ldyBib29sWzlde3RydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWV9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9KSk7X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJBbG1vc3QgSW1tb3J0YWwgQ2VsbHMgUHJlc2V0XCIsIG5ldyBib29sWzlde3RydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIGZhbHNlfSwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO19vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZywgYm9vbFtdLCBib29sW10+KFwiQWx0ZXJuYXRlIENvbndheSdzIEdhbWUgb2YgTGlmZSBQcmVzZXRcIiwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0pKTtyZXR1cm4gX28xO30pO1xyXG5cclxuICAgICAgICAgICAgSFRNTERpdkVsZW1lbnQgcHJlc2V0c0RpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCB7IFN0eWxlID0geyBUZXh0QWxpZ24gPSBUZXh0QWxpZ24uQ2VudGVyIH0gfTtcclxuZm9yZWFjaCAodmFyIF9kMiBpbiBwcmVzZXRzTGlzdClcclxue1xyXG4gICAgc3RyaW5nIG5hbWU7XHJcbiAgICBib29sW10gbGl2aW5nUnVsZXM7XHJcbiAgICBib29sW10gZGVhZFJ1bGVzO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDIsIG91dCBuYW1lLCBvdXQgbGl2aW5nUnVsZXMsIG91dCBkZWFkUnVsZXMpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgcHJlc2V0c0RpdixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnQoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxBbmNob3JFbGVtZW50PihuZXcgSFRNTEFuY2hvckVsZW1lbnR7SHJlZiA9IFwiamF2YXNjcmlwdDp2b2lkKDApXCIsIFN0eWxlID0ge0ZvbnRTaXplID0gXCIxcmVtXCJ9LCBPbkNsaWNrID0gZSA9PiBBcHBseVByZXNldChsaXZpbmdSdWxlczogbGl2aW5nUnVsZXMsIGRlYWRSdWxlczogZGVhZFJ1bGVzKX0sbmFtZSkpKTtcclxufVxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oXHJcblxyXG4gICAgICAgICAgICBTZXR0aW5nc1BvcHVwLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERldGFpbHNFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MRGV0YWlsc0VsZW1lbnQgeyBPcGVuID0gdHJ1ZX0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MU3VtbWFyeUVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxTdW1tYXJ5RWxlbWVudCgpLFwiQWRqYWNlbmN5IFJ1bGVzXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzVGFibGVcclxuICAgICAgICAgICAgICAgICksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERldGFpbHNFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MRGV0YWlsc0VsZW1lbnQgeyBPcGVuID0gdHJ1ZSB9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFN1bW1hcnlFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MU3VtbWFyeUVsZW1lbnQoKSxcIlJ1bGVzXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzVGFibGVcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxuZXcgSFRNTEJSRWxlbWVudCgpLCBwcmVzZXRzRGl2LCBuZXcgSFRNTEJSRWxlbWVudCgpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIixcclxuICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPCBtYXhBZGphY2VudENlbGxzOyBuKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlc1tuXSA9IGFkamFjZW5jeVJ1bGVzQ2VsbHNbbl0uQWRqYWNlbmN5VmFsdWUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPD0gbWF4QWRqYWNlbnRDZWxsczsgbisrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGl2aW5nUnVsZXNbbl0gPSBvcHRpb25DZWxsc1tuXS5JdGVtMS5Cb29sVmFsdWUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVhZFJ1bGVzW25dID0gb3B0aW9uQ2VsbHNbbl0uSXRlbTIuQm9vbFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbC5Mb2NhbFN0b3JhZ2UuU2V0SXRlbShcInJ1bGVzXCIsIEpzb25Db252ZXJ0LlNlcmlhbGl6ZU9iamVjdChuZXdcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpdmluZ1J1bGVzID0gbGl2aW5nUnVsZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYWRSdWxlcyA9IGRlYWRSdWxlcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXMgPSBhZGphY2VuY3lSdWxlc1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICBIaWRlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcIlNhdmUgQ2hhbmdlc1wiKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KFxyXG4gICAgICAgICAgICBOb3RhYmxlT2JqZWN0c1BvcHVwLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tbGlnaHRcIixcclxuICAgICAgICAgICAgICAgIFN0eWxlID0geyBDc3NGbG9hdCA9IEZsb2F0LlJpZ2h0IH0sXHJcbiAgICAgICAgICAgICAgICBPbkNsaWNrID0gZSA9PiBIaWRlTW9kYWwoKVxyXG4gICAgICAgICAgICB9LFwi4p2MXCIpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgTm90YWJsZU9iamVjdHNQb3B1cCxuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU3R5bGUgPSB7IENsZWFyID0gQ2xlYXIuQm90aCB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5mb3JlYWNoICh2YXIgX2QzIGluIE5vdGFibGVPYmplY3RzTGlzdC5Ob3RhYmxlT2JqZWN0cylcclxue1xyXG4gICAgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+IG9iamVjdERldGFpbHM7XHJcbiAgICBzdHJpbmcgZGVzY3JpcHRpb247XHJcbiAgICBzdHJpbmcgcnVsZXM7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KF9kMywgb3V0IG9iamVjdERldGFpbHMsIG91dCBkZXNjcmlwdGlvbiwgb3V0IHJ1bGVzKTtcclxuICAgIEhUTUxEaXZFbGVtZW50IG9iamVjdEluZm8gPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudHtTdHlsZSA9IHtXaWR0aCA9IFwiMzByZW1cIn19LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50e1N0eWxlID0ge0Rpc3BsYXkgPSBEaXNwbGF5LkZsZXgsIEFsaWduSXRlbXMgPSBBbGlnbkl0ZW1zLkNlbnRlciwgRmxleERpcmVjdGlvbiA9IEZsZXhEaXJlY3Rpb24uQ29sdW1ufX0sTm90YWJsZU9iamVjdHNQb3B1cCkpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgb2JqZWN0SW5mbyxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnR7U3R5bGUgPSB7RGlzcGxheSA9IERpc3BsYXkuRmxleCwgQWxpZ25JdGVtcyA9IEFsaWduSXRlbXMuQ2VudGVyLCBGbGV4RGlyZWN0aW9uID0gRmxleERpcmVjdGlvbi5Db2x1bW59fSxEcmF3U2hhcGUob2JqZWN0RGV0YWlscykpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50KCksZGVzY3JpcHRpb24pKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8scnVsZXMpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgb2JqZWN0SW5mbyxuZXcgSFRNTEJSRWxlbWVudCgpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sbmV3IEhUTUxCUkVsZW1lbnQoKSk7XHJcbn1cblxyXG4gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCBiYWNrZ3JvdW5kRGl2ID0gbmV3IEhUTUxEaXZFbGVtZW50IHsgU3R5bGUgPSB7IFBvc2l0aW9uID0gUG9zaXRpb24uUmVsYXRpdmUsIE1pbldpZHRoID0gXCIwXCIsIE1pbkhlaWdodCA9IFwiMFwiIH19O1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuT3ZlcmZsb3cgPSBPdmVyZmxvdy5IaWRkZW47XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5aSW5kZXggPSBcIi0xXCI7XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5Qb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLkxlZnQgPSBcIjBweFwiO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuVG9wID0gXCIwcHhcIjtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgYmFja2dyb3VuZERpdixET01DYW52YXMpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBiYWNrZ3JvdW5kRGl2LEhvdGJhcik7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIGJhY2tncm91bmREaXYsUmlnaHRIb3RiYXIpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKGJhY2tncm91bmREaXYpO1xyXG5cclxuICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBkcmFnZ2luZ1BvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gb3JpZ2luYWxQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICBib29sIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgRE9NQ2FudmFzLk9uTW91c2VEb3duID0gZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IHRydWU7XHJcbmludCB4O1xuaW50IHk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGUuTW91c2VQb3MoKSwgb3V0IHgsIG91dCB5KTtcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4IC0gb2Zmc2V0UG9zLkl0ZW0xLCB5IC0gb2Zmc2V0UG9zLkl0ZW0yKTtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsUG9zID0gb2Zmc2V0UG9zO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBET01DYW52YXMuT25Nb3VzZVVwID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0xLSBvcmlnaW5hbFBvcy5JdGVtMSkgPiB4TXVsdGlwbGllciB8fCBNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTItIG9yaWdpbmFsUG9zLkl0ZW0yKSA+IHlNdWx0aXBsaWVyKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZ1BvcyA9IG9mZnNldFBvcztcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLk9uTW91c2VNb3ZlID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGUuQnV0dG9ucyAmIDEpID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGlmIChkcmFnZ2luZ1BvcyA9PSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApKSBkcmFnZ2luZ1BvcyA9IGUuTW91c2VQb3MoKTtcclxuICAgICAgICAgICAgICAgIHZhciBtb3VzZVBvcyA9IGUuTW91c2VQb3MoKTtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTEtIG9yaWdpbmFsUG9zLkl0ZW0xKSA+IHhNdWx0aXBsaWVyIHx8IE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMS0gb3JpZ2luYWxQb3MuSXRlbTEpID4geU11bHRpcGxpZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIG9mZnNldFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4obW91c2VQb3MuSXRlbTEgLSBkcmFnZ2luZ1Bvcy5JdGVtMSwgbW91c2VQb3MuSXRlbTIgLSBkcmFnZ2luZ1Bvcy5JdGVtMik7XHJcbiAgICAgICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgICAgIH07XHJcblByb2Nlc3NNb3VzZUV2ZW50ID0gKGUpID0+XHJcbntcclxuICAgIC8vaWYgKChAZXZlbnQuQnV0dG9ucyAmIDEpID09IDApIHJldHVybjtcclxuICAgIHZhciBtb3VzZVBvcyA9IGUuTW91c2VQb3MoKTtcclxuICAgIEdyaWQuSGFuZGxlQ2xpY2sobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pihtb3VzZVBvcy5JdGVtMSAtIG9mZnNldFBvcy5JdGVtMSwgbW91c2VQb3MuSXRlbTIgLSBvZmZzZXRQb3MuSXRlbTIpLCBTcXVhcmVUeXBlUGxhY2luZyk7XHJcbiAgICBEcmF3KCk7XHJcbn1cclxuXHJcbjtcbiAgICAgICAgICAgIERPTUNhbnZhcy5PbkNsaWNrID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdpbmdJbnRlbnQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUHJvY2Vzc01vdXNlRXZlbnQoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIEdsb2JhbC5TZXRJbnRlcnZhbCgoQWN0aW9uKU5leHRGcmFtZSwgMTAwKTtcclxuXHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCB1cGRhdGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgSGFzRGl2aWRlcnMgKHRoaXMgRGljdGlvbmFyeTxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+LCBEaXZpZGVyc0luZm8+IGRpdmlkZXJzLCBpbnQgeCwgaW50IHksIGludCBMKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgRGl2aWRlcnNJbmZvIHRvQ2hlY2s7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoTClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgIHgtLTtcclxuICAgICAgICAgICAgICAgICAgICB5LS07XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b21SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICB5LS07XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b207XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgeS0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgeC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgICAgICAgICAgICB4LS07XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b21SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNzpcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLkJvdHRvbTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgODpcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbkRpdmlkZXJzSW5mbyBkaXZpZGVyc0luZm87XG4gICAgICAgICAgICByZXR1cm4gZGl2aWRlcnMuVHJ5R2V0VmFsdWUobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4LCB5KSwgb3V0IGRpdmlkZXJzSW5mbykgJiYgKGRpdmlkZXJzSW5mbyAmIHRvQ2hlY2spICE9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsR3JpZFR5cGUgLEhUTUxDYW52YXNFbGVtZW50ID4gTGFzdEJvdHRvbUNhbnZhcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIEdyaWRUeXBlLCBIVE1MQ2FudmFzRWxlbWVudD4oMCwgR3JpZFR5cGUuQ291bnQsIG51bGwpO1xyXG5wdWJsaWMgc3RhdGljIGJ5dGUgR2V0U3F1YXJlVHlwZUFscGhhKFNxdWFyZVR5cGUgc3F1YXJlVHlwZSlcclxue1xyXG4gICAgcmV0dXJuIChieXRlKShzcXVhcmVUeXBlID09IFNxdWFyZVR5cGUuQ2VsbCA/IDI1NSA6IHNxdWFyZVR5cGUgPT0gU3F1YXJlVHlwZS5CcmljayA/IDE3MCA6IHNxdWFyZVR5cGUgPT0gU3F1YXJlVHlwZS5JbW1vcnRhbENlbGwgPyA4NSA6ICgoU3lzdGVtLkZ1bmM8aW50PikoKCkgPT5cclxuICAgIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVW5rbm93biBzcXVhcmUgdHlwZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICApKSgpKTtcclxufVxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIERyYXcoKVxyXG4gICAgICAgIHtcclxuU3lzdGVtLkFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUsIGRvdWJsZT4/ID4gRHJhd01hcmtlciA9IG51bGw7XG5TeXN0ZW0uQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGRvdWJsZSwgZG91YmxlPj8gLCBTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUsIGRvdWJsZT4/ID4gRHJhd0xpbmUgPSBudWxsO1xuU3lzdGVtLkZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+LCBTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUsIGRvdWJsZT4/ID4gR2V0RmluYWxEcmF3UG9zID0gbnVsbDtcblN5c3RlbS5GdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiwgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PyA+IEdldERPTURyYXdQb3MgPSBudWxsO1xuU3lzdGVtLkZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+LCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4/ID4gR2V0RHJhd1BvcyA9IG51bGw7XG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBUb3BDYW52YXMgPSBDcmVhdGVUb3BDYW52YXMoKTtcclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgQm90dG9tQ2FudmFzID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKExhc3RCb3R0b21DYW52YXMuSXRlbTE9PSB4TXVsdGlwbGllciAmJiBMYXN0Qm90dG9tQ2FudmFzLkl0ZW0yPT0gQ3VycmVudEdyaWRUeXBlKVxyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzID0gTGFzdEJvdHRvbUNhbnZhcy5JdGVtMztcclxuICAgICAgICAgICAgaWYgKEJvdHRvbUNhbnZhcyA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXMgPSBDcmVhdGVCb3R0b21DYW52YXMoKTtcclxuICAgICAgICAgICAgICAgIExhc3RCb3R0b21DYW52YXMgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBHcmlkVHlwZSwgSFRNTENhbnZhc0VsZW1lbnQ+KHhNdWx0aXBsaWVyLCBDdXJyZW50R3JpZFR5cGUsIEJvdHRvbUNhbnZhcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIFRvcENhbnZhc0NvbnRleHQgPSBUb3BDYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuQ2xlYXJSZWN0KDAsIDAsIERPTUNhbnZhcy5XaWR0aCwgRE9NQ2FudmFzLkhlaWdodCk7XHJcbmludCBvZmZzZXRYO1xuaW50IG9mZnNldFk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KG9mZnNldFBvcywgb3V0IG9mZnNldFgsIG91dCBvZmZzZXRZKTtcclxuR2V0RHJhd1BvcyA9IChwb3MpID0+XHJcbntcclxuICAgIGludCB4O1xyXG4gICAgaW50IHk7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KHBvcywgb3V0IHgsIG91dCB5KTtcclxuICAgIGludCBkcmF3WCA9IHggKyAob2Zmc2V0WCAvIHhNdWx0aXBsaWVyKSArIDEsIGRyYXdZID0geSArIChvZmZzZXRZIC8geU11bHRpcGxpZXIpICsgMTtcclxuICAgIGlmIChkcmF3WCA8IDAgfHwgZHJhd1ggPj0gd2lkdGggKyAyIHx8IGRyYXdZIDwgMCB8fCBkcmF3WSA+PSBoZWlnaHQgKyAyKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oZHJhd1gsIGRyYXdZKTtcclxufVxyXG5cclxuO1xuR2V0RE9NRHJhd1BvcyA9IChwb3MpID0+XHJcbntcclxuICAgIGludCB4O1xyXG4gICAgaW50IHk7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KHBvcywgb3V0IHgsIG91dCB5KTtcclxuICAgIGludCBkcmF3WCA9IHggKyBvZmZzZXRYLCBkcmF3WSA9IHkgKyBvZmZzZXRZO1xyXG4gICAgaWYgKGRyYXdYIDwgMCB8fCBkcmF3WCA+PSBzY3JlZW5XaWR0aCB8fCBkcmF3WSA8IDAgfHwgZHJhd1kgPj0gc2NyZWVuSGVpZ2h0KVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oZHJhd1gsIGRyYXdZKTtcclxufVxyXG5cclxuO1xuU3F1YXJlR3JpZCBzcXVhcmVHcmlkOyAgICAgICAgICAgIGlmICgoc3F1YXJlR3JpZCA9IEdyaWQgYXMgU3F1YXJlR3JpZCkgIT0gbnVsbClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdFVpbnQ4Q2xhbXBlZEFycmF5IGltYWdlRGF0YUFycmF5ID0gQ3JlYXRlSW1hZ2VEYXRhQXJyYXkod2lkdGggKyAyLCBoZWlnaHQgKyAyKTtcclxuZm9yZWFjaCAodmFyIF9kNCBpbiBzcXVhcmVHcmlkLlNxdWFyZXMpXHJcbntcclxuICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiBwb3M7XHJcbiAgICBTcXVhcmVUeXBlIHNxdWFyZVR5cGU7XHJcbiAgICBfZDQuRGVjb25zdHJ1Y3Qob3V0IHBvcywgb3V0IHNxdWFyZVR5cGUpO1xyXG4gICAgdmFyIGRyYXdQb3MgPSBHZXREcmF3UG9zKHBvcyk7XHJcbiAgICBpZiAoZHJhd1BvcyA9PSBudWxsKVxyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgaW50IGRyYXdYO1xyXG4gICAgaW50IGRyYXdZO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChkcmF3UG9zLlZhbHVlLCBvdXQgZHJhd1gsIG91dCBkcmF3WSk7XHJcbiAgICBpbnQgaWR4ID0gZHJhd1ggKyBkcmF3WSAqICh3aWR0aCArIDIpO1xyXG4gICAgaW1hZ2VEYXRhQXJyYXlbaWR4ICogNCArIDNdID0gR2V0U3F1YXJlVHlwZUFscGhhKHNxdWFyZVR5cGUpO1xyXG59XG5cdFx0XHRcdEltYWdlRGF0YSBpbWFnZURhdGEgPSBuZXcgSW1hZ2VEYXRhKGltYWdlRGF0YUFycmF5LCAodWludCkod2lkdGggKyAyKSwgKHVpbnQpKGhlaWdodCArIDIpKTtcclxuXHRcdFx0XHRUb3BDYW52YXNDb250ZXh0LlB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xyXG4gICAgICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5EcmF3SW1hZ2UoQm90dG9tQ2FudmFzLCAob2Zmc2V0WCAlIHhNdWx0aXBsaWVyKSAtIHhNdWx0aXBsaWVyLCAob2Zmc2V0WSAlIHlNdWx0aXBsaWVyKSAtIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgfVxyXG5cdFx0XHRlbHNlIHtcclxuICAgIEhleEdyaWQgaDtcclxuICAgIGlmICgoaCA9IEdyaWQgYXMgSGV4R3JpZCkgIT0gbnVsbClcclxuICAgIHtcclxuICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdJbWFnZShCb3R0b21DYW52YXMsIChvZmZzZXRYICUgKEhleEdyaWQuY29zNjAgKiAyICogeE11bHRpcGxpZXIpKSAtIEhleEdyaWQuY29zNjAgKiAyICogeE11bHRpcGxpZXIsIChvZmZzZXRZICUgKEhleEdyaWQuc2luNjAgKiAyICogeU11bHRpcGxpZXIpKSAtIEhleEdyaWQuc2luNjAgKiAyICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgIEdyaWQuRHJhd1NxdWFyZXMoKEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4sIFNxdWFyZVR5cGU+KSgoU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+IGQsIFNxdWFyZVR5cGUgc3F1YXJlVHlwZSkgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj8gZHJhd1BvcyA9IEdldERPTURyYXdQb3MoZCk7XHJcbiAgICAgICAgICAgIGlmICghZHJhd1Bvcy5IYXNWYWx1ZSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5GaWxsU3R5bGUgPSBzdHJpbmcuRm9ybWF0KFwicmdiYSgwLCAwLCAwLCB7MH0pXCIsIEdldFNxdWFyZVR5cGVBbHBoYShzcXVhcmVUeXBlKSAvIDI1NS4wKTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5EcmF3SGV4YWdvbigoaW50KWRyYXdQb3MuVmFsdWUuSXRlbTEsIChpbnQpZHJhd1Bvcy5WYWx1ZS5JdGVtMiwgeE11bHRpcGxpZXIgKiAyIC8gMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICApKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgICBUcmlhbmdsZUdyaWQgdHJpYW5nbGVHcmlkO1xyXG4gICAgICAgIGlmICgodHJpYW5nbGVHcmlkID0gR3JpZCBhcyBUcmlhbmdsZUdyaWQpICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdJbWFnZShCb3R0b21DYW52YXMsIChvZmZzZXRYICUgKEhleEdyaWQuY29zNjAgKiAyICogeE11bHRpcGxpZXIpKSAtIEhleEdyaWQuY29zNjAgKiAyICogeE11bHRpcGxpZXIsIChvZmZzZXRZICUgKEhleEdyaWQuc2luNjAgKiAyICogeU11bHRpcGxpZXIpKSAtIEhleEdyaWQuc2luNjAgKiAyICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICB0cmlhbmdsZUdyaWQuRHJhd1NxdWFyZXMoKEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4sIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBUcmlhbmdsZUxvY2F0aW9uPiwgU3F1YXJlVHlwZT4pKChTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4gZCwgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+IGNvb3JkcywgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4/IGRyYXdQb3MgPSBHZXRET01EcmF3UG9zKGQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkcmF3UG9zLkhhc1ZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRmlsbFN0eWxlID0gc3RyaW5nLkZvcm1hdChcInJnYmEoMCwgMCwgMCwgezB9KVwiLCBHZXRTcXVhcmVUeXBlQWxwaGEoc3F1YXJlVHlwZSkgLyAyNTUuMCk7XHJcbiAgICAgICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdUcmlhbmdsZShkcmF3UG9zLlZhbHVlLkl0ZW0xLCBkcmF3UG9zLlZhbHVlLkl0ZW0yLCB4TXVsdGlwbGllciAvIDIsIGNvb3Jkcy5JdGVtMyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0ltYWdlKFRvcENhbnZhcywgKG9mZnNldFggJSB4TXVsdGlwbGllcikgLSB4TXVsdGlwbGllciwgKG9mZnNldFkgJSB5TXVsdGlwbGllcikgLSB5TXVsdGlwbGllciwgKHdpZHRoICsgMikgKiB4TXVsdGlwbGllciwgKGhlaWdodCArIDIpICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbkdldEZpbmFsRHJhd1BvcyA9IChwb3MpID0+XHJcbntcclxuICAgIHZhciBwID0gR2V0RHJhd1Bvcyhwb3MpO1xyXG4gICAgaWYgKHAgPT0gbnVsbClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIGRvdWJsZSBkcmF3WDtcclxuICAgIGRvdWJsZSBkcmF3WTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihwLlZhbHVlLkl0ZW0xLCBwLlZhbHVlLkl0ZW0yKSwgb3V0IGRyYXdYLCBvdXQgZHJhd1kpO1xyXG4gICAgZHJhd1ggKj0gKHdpZHRoICsgMikgKiB4TXVsdGlwbGllciAvIFRvcENhbnZhcy5XaWR0aDtcclxuICAgIGRyYXdZICo9IChoZWlnaHQgKyAyKSAqIHlNdWx0aXBsaWVyIC8gVG9wQ2FudmFzLkhlaWdodDtcclxuICAgIGRyYXdYICs9IChvZmZzZXRYICUgeE11bHRpcGxpZXIpIC0geE11bHRpcGxpZXI7XHJcbiAgICBkcmF3WSArPSAob2Zmc2V0WSAlIHlNdWx0aXBsaWVyKSAtIHlNdWx0aXBsaWVyO1xyXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUsIGRvdWJsZT4oZHJhd1gsIGRyYXdZKTtcclxufVxyXG5cclxuO1xuICAgICAgICAgICAgXHJcbkRyYXdMaW5lID0gKHN0YXJ0LCBlbmQpID0+XHJcbntcclxuICAgIGlmICghc3RhcnQuSGFzVmFsdWUgfHwgIWVuZC5IYXNWYWx1ZSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICB2YXIgc3RhcnRQb3MgPSBzdGFydC5WYWx1ZTtcclxuICAgIHZhciBlbmRQb3MgPSBlbmQuVmFsdWU7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkJlZ2luUGF0aCgpO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5Nb3ZlVG8oc3RhcnRQb3MuSXRlbTEsIHN0YXJ0UG9zLkl0ZW0yKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuTGluZVRvKGVuZFBvcy5JdGVtMSwgZW5kUG9zLkl0ZW0yKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuTGluZVdpZHRoID0gMjtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuU3Ryb2tlU3R5bGUgPSBcInJlZFwiOyAvLyBcInJnYigxNzAsIDE3MCwgMTcwKVwiO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5TdHJva2UoKTtcclxufVxyXG5cclxuO1xuICAgICAgICAgICAgXHJcbkRyYXdNYXJrZXIgPSAocG9zaXRpb24pID0+XHJcbntcclxuICAgIGlmICghcG9zaXRpb24uSGFzVmFsdWUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgZG91YmxlIGRyYXdYO1xyXG4gICAgZG91YmxlIGRyYXdZO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChwb3NpdGlvbi5WYWx1ZSwgb3V0IGRyYXdYLCBvdXQgZHJhd1kpO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5CZWdpblBhdGgoKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuQXJjKGRyYXdYLCBkcmF3WSwgeE11bHRpcGxpZXIgLyA4LCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkZpbGxTdHlsZSA9IFwicmVkXCI7IC8vXCJyZ2IoMTcwLCAxNzAsIDE3MClcIjtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuRmlsbCgpO1xyXG59XHJcblxyXG47XG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9mb3JlYWNoICgoKGludCB4LCBpbnQgeSkgcG9zLCBEaXZpZGVyc0luZm8gZGl2aWRlcnMpIGluIERpdmlkZXJzKVxyXG4gICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgLy8gICAgZm9yZWFjaCAodmFyIGRpdmlkZXIgaW4gbmV3W10geyBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQsIERpdmlkZXJzSW5mby5SaWdodCwgRGl2aWRlcnNJbmZvLkJvdHRvbSB9KVxyXG4gICAgICAgICAgICAvLyAgICB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICBpZiAoIWRpdmlkZXJzLkhhc0ZsYWcoZGl2aWRlcikpXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIC8vICAgICAgICBzd2l0Y2ggKGRpdmlkZXIpXHJcbiAgICAgICAgICAgIC8vICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgY2FzZSBEaXZpZGVyc0luZm8uUmlnaHQ6XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIChpbnQgeCwgaW50IHkpIHN0YXJ0UG9zID0gKChpbnQpKHBvcy54ICsgMSksIChpbnQpcG9zLnkpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAoaW50IHgsIGludCB5KSBlbmRQb3MgPSAoKGludCkocG9zLnggKyAxKSwgKGludCkocG9zLnkgKyAxKSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIERyYXdMaW5lKEdldEZpbmFsRHJhd1BvcyhzdGFydFBvcyksIEdldEZpbmFsRHJhd1BvcyhlbmRQb3MpKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgY2FzZSBEaXZpZGVyc0luZm8uQm90dG9tOlxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBEcmF3TGluZShHZXRGaW5hbERyYXdQb3MoKChpbnQpKHBvcy54KSwgKGludCkocG9zLnkgKyAxKSkpLCBHZXRGaW5hbERyYXdQb3MoKChpbnQpKHBvcy54ICsgMSksIChpbnQpKHBvcy55ICsgMSkpKSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgIGNhc2UgRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0OlxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBEcmF3TWFya2VyKEdldEZpbmFsRHJhd1BvcygoKGludCkocG9zLnggKyAxKSwgKGludCkocG9zLnkgKyAxKSkpKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgLy8gICAgICAgIH1cclxuICAgICAgICAgICAgLy8gICAgfVxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IGZyYW1lTnVtID0gMDtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE5leHRGcmFtZSAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCFwbGF5aW5nKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBib29sIHNraXBGcmFtZXMgPSBHcmlkLlNxdWFyZUNvdW50ID49IDI1MDtcclxuICAgICAgICAgICAgaW50IHVwZGF0ZXNQZXJEcmF3ID0gMTsvLyBza2lwRnJhbWVzID8gMiA6IDE7XHJcbiAgICAgICAgICAgIGZyYW1lTnVtKys7XHJcbiAgICAgICAgICAgIGlmIChza2lwRnJhbWVzICYmIChmcmFtZU51bSAlIHVwZGF0ZXNQZXJEcmF3KSAhPSAwKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8IHVwZGF0ZXNQZXJEcmF3OyBuKyspXHJcbiAgICAgICAgICAgICAgICBHcmlkLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgRHJhd0hleGFnb24gKHRoaXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGNvbnRleHQsIGludCB4LCBpbnQgeSwgaW50IHJhZGl1cywgYm9vbCBzdHJva2UgPSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuQmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuTW92ZVRvKHggKyByYWRpdXMsIHkpO1xyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMTsgbiA8PSA2OyBuKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRvdWJsZSBhbmdsZSA9IG4gKiBNYXRoLlBJIC8gMztcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuTGluZVRvKHggKyByYWRpdXMgKiBNYXRoLkNvcyhhbmdsZSksIHkgKyByYWRpdXMgKiBNYXRoLlNpbihhbmdsZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzdHJva2UpXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LlN0cm9rZSgpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LkZpbGwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBEcmF3VHJpYW5nbGUodGhpcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgY29udGV4dCwgaW50IGhleFgsIGludCBoZXhZLCBpbnQgaGV4UmFkaXVzLCBUcmlhbmdsZUxvY2F0aW9uIGxvYywgYm9vbCBzdHJva2UgPSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuQmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuTW92ZVRvKGhleFgsIGhleFkpO1xyXG4gICAgICAgICAgICBpbnQgYW5nbGVJbnQgPSAwO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGxvYylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYW5nbGVJbnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLlRvcDpcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZUludCA9IDYwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLlRvcFJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlSW50ID0gMTIwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbVJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlSW50ID0gMTgwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbTpcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZUludCA9IDI0MDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21MZWZ0OlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlSW50ID0gMzAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRvdWJsZSBhbmdsZSA9IGFuZ2xlSW50ICogTWF0aC5QSSAvIDE4MDtcclxuICAgICAgICAgICAgY29udGV4dC5MaW5lVG8oaGV4WCArIGhleFJhZGl1cyAqIE1hdGguQ29zKGFuZ2xlKSwgaGV4WSArIGhleFJhZGl1cyAqIE1hdGguU2luKGFuZ2xlKSk7XHJcbiAgICAgICAgICAgIGFuZ2xlICs9IE1hdGguUEkgLyAzO1xyXG4gICAgICAgICAgICBjb250ZXh0LkxpbmVUbyhoZXhYICsgaGV4UmFkaXVzICogTWF0aC5Db3MoYW5nbGUpLCBoZXhZICsgaGV4UmFkaXVzICogTWF0aC5TaW4oYW5nbGUpKTtcclxuICAgICAgICAgICAgaWYgKHN0cm9rZSlcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuU3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuRmlsbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGV4dC5SZWd1bGFyRXhwcmVzc2lvbnM7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIEV4dGVuc2lvbnNcclxuICAgIHtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoKGUsIGMpID0+IGMuYXBwZW5kQ2hpbGQoZSkpKHtlbGVtZW50fSwge2NvbnRhaW5pbmdFbGVtfSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBBZGRUbzxUPih0aGlzIFQgZWxlbWVudCwgTm9kZSBjb250YWluaW5nRWxlbSkgd2hlcmUgVCA6IE5vZGU7XHJcbiAgICAgICAgLy9wdWJsaWMgc3RhdGljIFQgQWRkVG9Cb2R5PFQ+KHRoaXMgVCBuKSB3aGVyZSBUIDogTm9kZSA9PiBBcHAucm9vdC5BcHBlbmRDaGlsZDxUPihuKTtcclxuICAgICAgICBbVGVtcGxhdGUoXCJ7bm9kZX0uYXBwZW5kQ2hpbGQoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIEFwcGVuZENoaWxkPFQ+KHRoaXMgTm9kZSBub2RlLCBUIGVsZW1lbnQpIHdoZXJlIFQgOiBOb2RlO1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihlID0+IChlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZScsIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgSGlkZTxUPih0aGlzIFQgZWxlbWVudCkgd2hlcmUgVCA6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihlID0+IChlLnN0eWxlLmRpc3BsYXkgPSAnJywgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBTaG93PFQ+KHRoaXMgVCBlbGVtZW50KSB3aGVyZSBUIDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGxpID0+IChsaS5hcHBlbmRDaGlsZCh7ZWxlbWVudH0pLCBsaSkpKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIEhUTUxMSUVsZW1lbnQgV3JhcExpKHRoaXMgTm9kZSBlbGVtZW50KTtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZGl2ID0+IChkaXYuYXBwZW5kQ2hpbGQoe2VsZW1lbnR9KSwgZGl2KSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIEhUTUxEaXZFbGVtZW50IFdyYXBEaXYodGhpcyBOb2RlIGVsZW1lbnQpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVCBBZGQ8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gbm9kZXMpIHdoZXJlIFQgOiBOb2RlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChVbmlvbjxOb2RlLCBzdHJpbmc+IG5vZGUgaW4gbm9kZXMpXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZSA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5JczxzdHJpbmc+KCkpXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5BcHBlbmRDaGlsZChuZXcgVGV4dChub2RlLkFzPHN0cmluZz4oKSkpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuQXBwZW5kQ2hpbGQobm9kZS5BczxOb2RlPigpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIFQgQWRkRWxlbWVudDxUPih0aGlzIFQgZWxlbWVudCwgcGFyYW1zIFVuaW9uPE5vZGUsIHN0cmluZz5bXSBub2RlcylcclxuICAgIHdoZXJlIFQgOiBOb2RlXHJcbntcclxuICAgIHJldHVybiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPFQ+KGVsZW1lbnQsbm9kZXMpO1xyXG59cHVibGljIHN0YXRpYyBUIEFkZERpdjxUPih0aGlzIFQgZWxlbWVudCwgcGFyYW1zIFVuaW9uPE5vZGUsIHN0cmluZz5bXSBub2RlcylcclxuICAgIHdoZXJlIFQgOiBOb2RlXHJcbntcclxuICAgIHJldHVybiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPFQ+KGVsZW1lbnQsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50KCksbm9kZXMpKTtcclxufXB1YmxpYyBzdGF0aWMgVCBBZGRVbDxUPih0aGlzIFQgZWxlbWVudCwgcGFyYW1zIFVuaW9uPE5vZGUsIFVuaW9uPE5vZGUsIHN0cmluZz5bXSwgc3RyaW5nPltdIG5vZGVzKVxyXG4gICAgd2hlcmUgVCA6IE5vZGVcclxue1xyXG4gICAgcmV0dXJuIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8VD4oZWxlbWVudCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxVTGlzdEVsZW1lbnQ+KG5ldyBIVE1MVUxpc3RFbGVtZW50KCksU3lzdGVtLkFycmF5RXh0ZW5zaW9ucy5NYXA8VW5pb248Tm9kZSxVbmlvbjxOb2RlLCBzdHJpbmc+W10sc3RyaW5nPixVbmlvbjxOb2RlLHN0cmluZz4+KG5vZGVzLChGdW5jPFVuaW9uPE5vZGUsVW5pb248Tm9kZSwgc3RyaW5nPltdLHN0cmluZz4sVW5pb248Tm9kZSxzdHJpbmc+PikobiA9PiAoVW5pb248Tm9kZSwgc3RyaW5nPikobi5JczxVbmlvbjxOb2RlLCBzdHJpbmc+W10+KCkgPyBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxMSUVsZW1lbnQ+KG5ldyBIVE1MTElFbGVtZW50KCksbi5BczxVbmlvbjxOb2RlLCBzdHJpbmc+W10+KCkpIDogbi5JczxzdHJpbmc+KCkgPyBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxMSUVsZW1lbnQ+KG5ldyBIVE1MTElFbGVtZW50KCksbi5BczxzdHJpbmc+KCkpIDogQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MTElFbGVtZW50PihuZXcgSFRNTExJRWxlbWVudCgpLG4uQXM8Tm9kZT4oKSkpKSkpKTtcclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIEFkZENhbWVsU3BhY2UodGhpcyBzdHJpbmcgc3RyKVxyXG57XHJcbiAgICByZXR1cm4gUmVnZXguUmVwbGFjZShSZWdleC5SZXBsYWNlKHN0ciwgQFwiKFteX2Etel0pKFteX2Etel1bYS16XSlcIiwgXCIkMSAkMlwiKSwgQFwiKFthLXpdKShbXl9hLXpdKVwiLCBcIiQxICQyXCIpO1xyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgVG9DYW1lbFN0cmluZzxUPih0aGlzIFQgZSlcclxuICAgIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbntcclxuICAgIHJldHVybiBlLlRvU3RyaW5nKCkuQWRkQ2FtZWxTcGFjZSgpLlJlcGxhY2UoJ18nLCAnICcpO1xyXG59ICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxTZWxlY3RFbGVtZW50IEFkZEVudW08VD4odGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QsIFQ/IGRlZmF1bHRWYWx1ZSA9IG51bGwsIHN0cmluZyBkZWZhdWx0VmFsdWVTdHJpbmcgPSBcIlwiKSB3aGVyZSBUIDogc3RydWN0LCBTeXN0ZW0uRW51bVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGRlZmF1bHRWYWx1ZSA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgc2VsZWN0LkFkZChDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnQgeyBWYWx1ZSA9IFwiXCIsIFNlbGVjdGVkID0gdHJ1ZSwgRGlzYWJsZSA9IHRydWUgfSxkZWZhdWx0VmFsdWVTdHJpbmcpKTtcclxuICAgICAgICAgICAgZm9yZWFjaCAoVCB2YWx1ZSBpbiBTeXN0ZW0uRW51bS5HZXRWYWx1ZXModHlwZW9mKFQpKSlcclxuICAgICAgICAgICAgICAgIHNlbGVjdC5BZGQoQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVmFsdWUgPSAoKGludCkob2JqZWN0KXZhbHVlKS5Ub1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGVkID0gb2JqZWN0LkVxdWFscyhkZWZhdWx0VmFsdWUsIHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgfSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuVG9DYW1lbFN0cmluZzxUPih2YWx1ZSkpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgYm9vbCBCb29sVmFsdWUodGhpcyBIVE1MSW5wdXRFbGVtZW50IGNoZWNrQm94KVxyXG57XHJcbiAgICByZXR1cm4gY2hlY2tCb3guQ2hlY2tlZDtcclxufXB1YmxpYyBzdGF0aWMgYm9vbCBCb29sVmFsdWUodGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QpXHJcbntcclxuICAgIHJldHVybiBzZWxlY3QuVmFsdWUgPT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2U7XHJcbn1wdWJsaWMgc3RhdGljIEFkamFjZW5jeVR5cGUgQWRqYWNlbmN5VmFsdWUodGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QpXHJcbntcclxuICAgIHJldHVybiAoQWRqYWNlbmN5VHlwZSlpbnQuUGFyc2Uoc2VsZWN0LlZhbHVlKTtcclxufXB1YmxpYyBzdGF0aWMgVD8gVmFsdWU8VD4odGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QpXHJcbiAgICB3aGVyZSBUIDogc3RydWN0LCBTeXN0ZW0uRW51bVxyXG57XHJcbiAgICByZXR1cm4gc2VsZWN0LlZhbHVlID09IFwiXCIgPyBudWxsIDogKFQ/ICkoVCkob2JqZWN0KWludC5QYXJzZShzZWxlY3QuVmFsdWUpO1xyXG59ICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxJbnB1dEVsZW1lbnQgU2V0Qm9vbFZhbHVlKHRoaXMgSFRNTElucHV0RWxlbWVudCBjaGVja0JveCwgYm9vbCB2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNoZWNrQm94LkNoZWNrZWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIGNoZWNrQm94O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxTZWxlY3RFbGVtZW50IFNldEJvb2xWYWx1ZSh0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdCwgYm9vbCB2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGVjdC5WYWx1ZSA9IHZhbHVlLlRvU3RyaW5nKCkuVG9Mb3dlcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxTZWxlY3RFbGVtZW50IFNldEFkamFjZW5jeVZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBBZGphY2VuY3lUeXBlIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZWN0LlZhbHVlID0gKChpbnQpdmFsdWUpLlRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgU2V0VmFsdWU8VD4odGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QsIFQgdmFsdWUpIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxlY3QuVmFsdWUgPSAoKGludCkob2JqZWN0KXZhbHVlKS5Ub1N0cmluZygpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBzdHJpbmcgVG9UaW1lU3RyaW5nKHRoaXMgVGltZVNwYW4gdGltZSlcclxue1xyXG4gICAgcmV0dXJuIHRpbWUuVG9TdHJpbmcodGltZSA+PSBUaW1lU3Bhbi5Gcm9tSG91cnMoMSkgPyBAXCJoXFw6bW1cXDpzc1wiIDogQFwibVxcOnNzXCIpO1xyXG59ICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zZXRDdXN0b21WYWxpZGl0eSh7bWVzc2FnZX0pLCBlLnJlcG9ydFZhbGlkaXR5KCksIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgU2V0Q3VzdG9tVmFsaWRpdHk8VD4odGhpcyBUIGVsZW1lbnQsIHN0cmluZyBtZXNzYWdlKSB3aGVyZSBUIDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc2V0QXR0cmlidXRlKCdsaXN0Jywge2RhdGFsaXN0SUR9KSwgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gSFRNTElucHV0RWxlbWVudCBTZXREYXRhTGlzdCh0aGlzIEhUTUxJbnB1dEVsZW1lbnQgZWxlbWVudCwgc3RyaW5nIGRhdGFsaXN0SUQpO1xyXG4gICAgICAgIC8vW1RlbXBsYXRlKFwie2VsZW19LmFwcGVuZENoaWxkKHthZGRpbmd9KVwiKV1cclxuICAgICAgICAvL3B1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgQXBwZW5kPFQ+ICh0aGlzIE5vZGUgZWxlbSwgVCBhZGRpbmcpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFVuaW9uPE5vZGUsIHN0cmluZz5bXSBKb2luQlIodGhpcyBJRW51bWVyYWJsZTxzdHJpbmc+IHN0cmluZ3MpXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uRnVuYzxJRW51bWVyYWJsZTxVbmlvbjxOb2RlLCBzdHJpbmc+Pj4gSW5uZXIgPSBudWxsO1xuICAgICAgICAgICAgXHJcbklubmVyID0gKCkgPT5cclxue1xyXG4gICAgdXNpbmcgKHZhciBlbnVtZXIgPSBzdHJpbmdzLkdldEVudW1lcmF0b3IoKSlcclxuICAgIHtcclxuICAgICAgICBpZiAoIWVudW1lci5Nb3ZlTmV4dCgpKVxyXG4gICAgICAgICAgICB5aWVsZCBicmVhaztcclxuICAgICAgICB5aWVsZCByZXR1cm4gZW51bWVyLkN1cnJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKGVudW1lci5Nb3ZlTmV4dCgpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgeWllbGQgcmV0dXJuIG5ldyBIVE1MQlJFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiBlbnVtZXIuQ3VycmVudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbjtcbiAgICAgICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlRvQXJyYXk8VW5pb248Tm9kZSxzdHJpbmc+PihJbm5lcigpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIE5vdGFibGVPYmplY3RzTGlzdFxyXG4gICAge1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiAsc3RyaW5nICxzdHJpbmcgPj4gTm90YWJsZU9iamVjdHMgPVxyXG4gICAgICAgICAgICBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+ICxzdHJpbmcgLHN0cmluZyA+PigpLChfbzMpPT57X28zLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8SGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+LCBzdHJpbmcsIHN0cmluZz4oZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PigpLCAoX28xKSA9PlxyXG57XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCkpO1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDEsIDApKTtcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigxLCAxKSk7XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMikpO1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDIsIDIpKTtcclxuICAgIHJldHVybiBfbzE7XHJcbn1cclxuXHJcbiksIFwiVHdvIEdlbmVyYXRpb24gTmluZXR5IERlZ3JlZSBSb3RhdG9yXCIsIFwiMDAxMDEwLS0tIC8gMDAwMTAxLS0tXCIpKTtfbzMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4sIHN0cmluZywgc3RyaW5nPihnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+KCksIChfbzIpID0+XHJcbntcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKSk7XHJcbiAgICBfbzIuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMSwgMCkpO1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDEsIDEpKTtcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAxKSk7XHJcbiAgICBfbzIuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMikpO1xyXG4gICAgcmV0dXJuIF9vMjtcclxufVxyXG5cclxuKSwgXCJPbmUgR2VuZXJhdGlvbiBOaW5ldHkgRGVncmVlIFJvdGF0b3JcIiwgXCIwMDEwMTAtLS0gLyAwMDAxMDEtLS1cIikpO3JldHVybiBfbzM7fSk7XHJcbiAgICB9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAvLy8gT3B0aW9uczpcclxuICAgIC8vLyAtIENlbGwgKElzQ2VsbDogdHJ1ZSwgSXNXYWxsOiBmYWxzZSkgIHwgQmxhY2tcclxuICAgIC8vLyAtIFdhbGwgKElzQ2VsbDogdHJ1ZSwgSXNXYWxsOiB0cnVlKSAgIHwgR3JleVxyXG4gICAgLy8vIC0gQnJpY2sgKElzQ2VsbDogZmFsc2UsIElzV2FsbDogdHJ1ZSkgfCBHcmV5XHJcbiAgICAvLy8gPC9zdW1tYXJ5PlxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgU3F1YXJlRXh0ZW5zaW9uc1xyXG4gICAge1xyXG5wdWJsaWMgc3RhdGljIGJvb2wgSXNBbGl2ZSh0aGlzIFNxdWFyZVR5cGUgc3F1YXJlVHlwZSlcclxue1xyXG4gICAgcmV0dXJuIHNxdWFyZVR5cGUgIT0gU3F1YXJlVHlwZS5CcmljaztcclxufXB1YmxpYyBzdGF0aWMgYm9vbCBJc1VuZGVhZCh0aGlzIFNxdWFyZVR5cGUgc3F1YXJlVHlwZSlcclxue1xyXG4gICAgcmV0dXJuIHNxdWFyZVR5cGUgIT0gU3F1YXJlVHlwZS5DZWxsO1xyXG59cHVibGljIHN0YXRpYyBib29sIENvbnRhaW5zQWxpdmU8VD4odGhpcyBEaWN0aW9uYXJ5PFQsIFNxdWFyZVR5cGU+IGRpYywgVCBrZXkpXHJcbntcclxuU3F1YXJlVHlwZSBzcXVhcmVUeXBlO1xuICAgIHJldHVybiBkaWMuVHJ5R2V0VmFsdWUoa2V5LCBvdXQgc3F1YXJlVHlwZSkgJiYgc3F1YXJlVHlwZS5Jc0FsaXZlKCk7XHJcbn0gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnVtIFNxdWFyZVR5cGVcclxuICAgIHtcclxuICAgICAgICBDZWxsLCAgLy8gQmxhY2tcclxuICAgICAgICBJbW1vcnRhbENlbGwsICAvLyBHcmV5XHJcbiAgICAgICAgQnJpY2ssIC8vIEdyZXlcclxuICAgICAgICBDb3VudFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnVtIEdyaWRUeXBlXHJcbiAgICB7XHJcbiAgICAgICAgU3F1YXJlLFxyXG4gICAgICAgIEhleCxcclxuICAgICAgICBUcmlhbmdsZSxcclxuICAgICAgICBDb3VudFxyXG4gICAgfVxyXG5cclxuICAgIFtGbGFnc11cclxuICAgIHB1YmxpYyBlbnVtIERpdmlkZXJzSW5mb1xyXG4gICAge1xyXG4gICAgICAgIE5vbmUgPSAwLFxyXG4gICAgICAgIFJpZ2h0ID0gMSA8PCAwLFxyXG4gICAgICAgIEJvdHRvbSA9IDEgPDwgMSxcclxuICAgICAgICBCb3R0b21SaWdodCA9IDEgPDwgMlxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNsYXNzIEdyaWRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgYWJzdHJhY3Qgdm9pZCBDbGVhcigpO1xyXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCB2b2lkIERyYXdTcXVhcmVzKEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+LCBTcXVhcmVUeXBlPiBEcmF3U3F1YXJlKTtcclxuICAgICAgICBwdWJsaWMgYWJzdHJhY3Qgdm9pZCBIYW5kbGVDbGljayhTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYXdQb3NpdGlvbiwgU3F1YXJlVHlwZSBTcXVhcmVUeXBlUGxhY2luZyk7XHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IHZvaWQgVXBkYXRlKCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCBpbnQgU3F1YXJlQ291bnQgeyBnZXQ7IH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY2xhc3MgR3JpZDxDb29yZFR5cGU+IDogR3JpZFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyB2aXJ0dWFsIHZvaWQgQXNzaWduRGl2aWRlcnMgKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhd1Bvc2l0aW9uLCByZWYgYm9vbCBwbGFjZU5vcm1hbGx5KSB7IH1cclxuICAgICAgICBwdWJsaWMgYWJzdHJhY3QgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBHZXREcmF3UG9zaXRpb24gKENvb3JkVHlwZSBjb29yZHMpO1xyXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCBDb29yZFR5cGUgRnJvbURyYXdQb3NpdGlvbiAoU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBkcmF3UG9zaXRpb24pO1xyXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCBpbnQgTnVtYmVyT2ZBZGphY2VudENlbGxzIChDb29yZFR5cGUgY29vcmRzLCBBY3Rpb248Q29vcmRUeXBlPiBlbXB0eUFkakFjdGlvbiA9IG51bGwpO1xyXG4gICAgICAgIHB1YmxpYyBEaWN0aW9uYXJ5PENvb3JkVHlwZSwgU3F1YXJlVHlwZT4gU3F1YXJlcyA9IG5ldyBEaWN0aW9uYXJ5PENvb3JkVHlwZSwgU3F1YXJlVHlwZT4oKTtcclxuICAgICAgICBwdWJsaWMgRGljdGlvbmFyeTxDb29yZFR5cGUsIERpdmlkZXJzSW5mbz4gRGl2aWRlcnMgPSBuZXcgRGljdGlvbmFyeTxDb29yZFR5cGUsIERpdmlkZXJzSW5mbz4oKTtcclxucHVibGljIG92ZXJyaWRlIGludCBTcXVhcmVDb3VudFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gU3F1YXJlcy5Db3VudDtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIENsZWFyKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNxdWFyZXMuQ2xlYXIoKTtcclxuICAgICAgICAgICAgRGl2aWRlcnMuQ2xlYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIERyYXdTcXVhcmVzIChBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiwgQ29vcmRUeXBlLCBTcXVhcmVUeXBlPiBEcmF3U3F1YXJlKVxyXG4gICAgICAgIHtcclxuZm9yZWFjaCAodmFyIF9kMSBpbiBTcXVhcmVzKVxyXG57XHJcbiAgICBDb29yZFR5cGUgY29vcmRzO1xyXG4gICAgU3F1YXJlVHlwZSBzcXVhcmVUeXBlO1xyXG4gICAgX2QxLkRlY29uc3RydWN0KG91dCBjb29yZHMsIG91dCBzcXVhcmVUeXBlKTtcclxuICAgIERyYXdTcXVhcmUoR2V0RHJhd1Bvc2l0aW9uKGNvb3JkcyksIGNvb3Jkcywgc3F1YXJlVHlwZSk7XHJcbn1cbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBEcmF3U3F1YXJlcyAoQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4sIFNxdWFyZVR5cGU+IERyYXdTcXVhcmUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLkRyYXdTcXVhcmVzKChBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4sQ29vcmRUeXBlLFNxdWFyZVR5cGU+KSgoZHJhd1Bvc2l0aW9uLCBjb29yZHMsIHNxdWFyZVR5cGUpID0+IERyYXdTcXVhcmUoZHJhd1Bvc2l0aW9uLCBzcXVhcmVUeXBlKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExpc3Q8Q29vcmRUeXBlPiByZW1vdmluZyA9IG5ldyBMaXN0PENvb3JkVHlwZT4oKTtcclxuICAgICAgICAgICAgSGFzaFNldDxDb29yZFR5cGU+IGFkZGluZyA9IG5ldyBIYXNoU2V0PENvb3JkVHlwZT4oKTtcclxuZm9yZWFjaCAodmFyIF9kMiBpbiBTcXVhcmVzKVxyXG57XHJcbiAgICBDb29yZFR5cGUgY29vcmRzO1xyXG4gICAgU3F1YXJlVHlwZSBzcXVhcmVUeXBlO1xyXG4gICAgX2QyLkRlY29uc3RydWN0KG91dCBjb29yZHMsIG91dCBzcXVhcmVUeXBlKTtcclxuICAgIGlmICghc3F1YXJlVHlwZS5Jc0FsaXZlKCkpXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICBpbnQgYWRqYWNlbnRDZWxscyA9IE51bWJlck9mQWRqYWNlbnRDZWxscyhjb29yZHMsIChBY3Rpb248Q29vcmRUeXBlPikoY29vcmRzXyA9PlxyXG4gICAge1xyXG4gICAgICAgIGlmIChBcHAuZGVhZFJ1bGVzW051bWJlck9mQWRqYWNlbnRDZWxscyhjb29yZHNfKV0pXHJcbiAgICAgICAgICAgIGFkZGluZy5BZGQoY29vcmRzXyk7XHJcbiAgICB9XHJcblxyXG4pICAgICk7XHJcbiAgICBpZiAoYWRqYWNlbnRDZWxscyA+IEFwcC5tYXhBZGphY2VudENlbGxzKVxyXG4gICAgICAgIGFkamFjZW50Q2VsbHMgPSBBcHAubWF4QWRqYWNlbnRDZWxscztcclxuICAgIGlmICghc3F1YXJlVHlwZS5Jc1VuZGVhZCgpICYmICFBcHAubGl2aW5nUnVsZXNbYWRqYWNlbnRDZWxsc10pXHJcbiAgICAgICAgcmVtb3ZpbmcuQWRkKGNvb3Jkcyk7XHJcbn1cblxyXG4gICAgICAgICAgICBmb3JlYWNoIChDb29yZFR5cGUgY29vcmRzIGluIHJlbW92aW5nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIVNxdWFyZXMuUmVtb3ZlKGNvb3JkcykpIHRocm93IG5ldyBFeGNlcHRpb24oXCJTcXVhcmUgdHJpZWQgdG8gYmUgcmVtb3ZlZCBidXQgZGlkbid0IGV4aXN0XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3JlYWNoIChDb29yZFR5cGUgY29vcmRzIGluIGFkZGluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU3F1YXJlcy5BZGQoY29vcmRzLCBTcXVhcmVUeXBlLkNlbGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBIYW5kbGVDbGljayAoU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBkcmF3UG9zaXRpb24sIFNxdWFyZVR5cGUgU3F1YXJlVHlwZVBsYWNpbmcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBDb29yZFR5cGUgY2xpY2tDb29yZHMgPSBGcm9tRHJhd1Bvc2l0aW9uKGRyYXdQb3NpdGlvbik7XHJcbiAgICAgICAgICAgIGJvb2wgcGxhY2VOb3JtYWxseSA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmIChTcXVhcmVUeXBlUGxhY2luZyA9PSBTcXVhcmVUeXBlLkNvdW50KVxyXG4gICAgICAgICAgICAgICAgQXNzaWduRGl2aWRlcnMoZHJhd1Bvc2l0aW9uLCByZWYgcGxhY2VOb3JtYWxseSk7XHJcbiAgICAgICAgICAgIGlmIChwbGFjZU5vcm1hbGx5ICYmICFTcXVhcmVzLlJlbW92ZShjbGlja0Nvb3JkcykpXHJcbiAgICAgICAgICAgICAgICBTcXVhcmVzLkFkZChjbGlja0Nvb3JkcywgU3F1YXJlVHlwZVBsYWNpbmcgPT0gU3F1YXJlVHlwZS5Db3VudCA/IFNxdWFyZVR5cGUuQ2VsbCA6IFNxdWFyZVR5cGVQbGFjaW5nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsYXNzIFNxdWFyZUdyaWQgOiBHcmlkPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+XHJcbiAgICB7XHJcbnB1YmxpYyBvdmVycmlkZSBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+R2V0RHJhd1Bvc2l0aW9uKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID5jb29yZHMpXHJcbntcclxuICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGNvb3Jkcy5JdGVtMSAqIEFwcC54TXVsdGlwbGllciwgY29vcmRzLkl0ZW0yICogQXBwLnhNdWx0aXBsaWVyKTtcclxufXB1YmxpYyBvdmVycmlkZSBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+RnJvbURyYXdQb3NpdGlvbihTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+ZHJhd1Bvc2l0aW9uKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihBcHAuTmVnRGl2KGRyYXdQb3NpdGlvbi5JdGVtMSwgQXBwLnhNdWx0aXBsaWVyKSwgQXBwLk5lZ0RpdihkcmF3UG9zaXRpb24uSXRlbTIsIEFwcC54TXVsdGlwbGllcikpO1xyXG59XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgQXNzaWduRGl2aWRlcnMoU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBkcmF3UG9zaXRpb24sIHJlZiBib29sIHBsYWNlTm9ybWFsbHkpXHJcbiAgICAgICAge1xyXG5kb3VibGUgY2xpY2tYXztcbmRvdWJsZSBjbGlja1lfO1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+KEFwcC5OZWdEaXZEb3VibGUoKGRvdWJsZSlkcmF3UG9zaXRpb24uSXRlbTEsIEFwcC54TXVsdGlwbGllciksIEFwcC5OZWdEaXZEb3VibGUoKGRvdWJsZSlkcmF3UG9zaXRpb24uSXRlbTIsIEFwcC55TXVsdGlwbGllcikpLCBvdXQgY2xpY2tYXywgb3V0IGNsaWNrWV8pO1xyXG4gICAgICAgICAgICBwbGFjZU5vcm1hbGx5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGludCB4RGl2ID0gMCwgeURpdiA9IDA7XHJcbiAgICAgICAgICAgIGlmIChjbGlja1hfICUgMSA8PSAwLjIpXHJcbiAgICAgICAgICAgICAgICB4RGl2ID0gLTE7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNsaWNrWF8gJSAxID49IDAuOClcclxuICAgICAgICAgICAgICAgIHhEaXYgPSAxO1xyXG4gICAgICAgICAgICBpZiAoY2xpY2tZXyAlIDEgPD0gMC4yKVxyXG4gICAgICAgICAgICAgICAgeURpdiA9IC0xO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChjbGlja1lfICUgMSA+PSAwLjgpXHJcbiAgICAgICAgICAgICAgICB5RGl2ID0gMTtcclxuICAgICAgICAgICAgRGl2aWRlcnNJbmZvIGRpdmlkZXJzSW5mbyA9IERpdmlkZXJzSW5mby5Ob25lO1xyXG4gICAgICAgICAgICBBY3Rpb248RGl2aWRlcnNJbmZvPiBBc3NpZ24gPSAoRGl2aWRlcnNJbmZvIGRpdkluZm8pID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGludCB4ID0gKGludCljbGlja1hfICsgeERpdiwgeSA9IChpbnQpY2xpY2tZXyArIHlEaXY7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGl2SW5mbyAhPSBEaXZpZGVyc0luZm8uTm9uZSlcclxuICAgICAgICAgICAgICAgIHtcclxuRGl2aWRlcnNJbmZvIGRpdmlkZXJzO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIURpdmlkZXJzLlRyeUdldFZhbHVlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCl4LCAoaW50KXkpLCBvdXQgZGl2aWRlcnMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXZpZGVycyA9IERpdmlkZXJzSW5mby5Ob25lO1xyXG4gICAgICAgICAgICAgICAgICAgIERpdmlkZXJzW25ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSldID0gZGl2aWRlcnMgXiBkaXZJbmZvO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHhEaXYpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh5RGl2KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAtMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2lnbihEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2lnbihEaXZpZGVyc0luZm8uUmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlEaXYgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXNzaWduKERpdmlkZXJzSW5mby5Cb3R0b21SaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoeURpdilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBc3NpZ24oRGl2aWRlcnNJbmZvLkJvdHRvbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VOb3JtYWxseSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGl2aWRlcnNJbmZvID0gRGl2aWRlcnNJbmZvLkJvdHRvbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh5RGl2KVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAtMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhEaXYgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXNzaWduKERpdmlkZXJzSW5mby5Cb3R0b21SaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGl2aWRlcnNJbmZvID0gRGl2aWRlcnNJbmZvLlJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlkZXJzSW5mbyA9IERpdmlkZXJzSW5mby5Cb3R0b21SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGRpdmlkZXJzSW5mbyAhPSBEaXZpZGVyc0luZm8uTm9uZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgeERpdiA9IDA7XHJcbiAgICAgICAgICAgICAgICB5RGl2ID0gMDtcclxuICAgICAgICAgICAgICAgIEFzc2lnbihkaXZpZGVyc0luZm8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgaW50IE51bWJlck9mQWRqYWNlbnRDZWxscyhTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGNvb3JkcywgQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+IGVtcHR5QWRqQWN0aW9uID0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBhZGphY2VudENlbGxzID0gMDtcclxuICAgICAgICAgICAgaW50IG4gPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGludCBMID0gMDsgTCA8PSA4OyBMKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChMID09IDQpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWRqYWNlbmN5UnVsZSA9IEFwcC5hZGphY2VuY3lSdWxlc1tuKytdO1xyXG5cclxuICAgICAgICAgICAgICAgIGludCBjMF8gPSBjb29yZHMuSXRlbTEtIDEgKyAoTCAlIDMpLFxyXG4gICAgICAgICAgICAgICAgICAgIGMxXyA9IGNvb3Jkcy5JdGVtMi0gMSArIEwgLyAzO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChEaXZpZGVycy5IYXNEaXZpZGVycyhjb29yZHMuSXRlbTEsIGNvb3Jkcy5JdGVtMiwgTCkpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcblNxdWFyZVR5cGUgc3F1YXJlSW5mbztcblxyXG4gICAgICAgICAgICAgICAgaWYgKFNxdWFyZXMuVHJ5R2V0VmFsdWUobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihjMF8sIGMxXyksIG91dCBzcXVhcmVJbmZvKSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3F1YXJlSW5mby5Jc0FsaXZlKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW50Q2VsbHMgKz0gKGludClhZGphY2VuY3lSdWxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGVtcHR5QWRqQWN0aW9uIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5lbXB0eUFkakFjdGlvbi5JbnZva2UobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihjMF8sIGMxXykpKTpudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhZGphY2VudENlbGxzID4gQXBwLm1heEFkamFjZW50Q2VsbHMgPyBBcHAubWF4QWRqYWNlbnRDZWxscyA6IGFkamFjZW50Q2VsbHM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBIZXhHcmlkIDogR3JpZDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PlxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgZmxvYXRcclxuICAgICAgICAgICAgY29zNjAgPSAoZmxvYXQpTWF0aC5TaW4oTWF0aC5QSSAvIDMpLFxyXG4gICAgICAgICAgICBzaW42MCA9IChmbG9hdClNYXRoLkNvcyhNYXRoLlBJIC8gMyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgICAgIC8vLyBcclxuICAgICAgICAvLy8gPC9zdW1tYXJ5PlxyXG4gICAgICAgIC8vLyA8cGFyYW0gbmFtZT1cImNvb3Jkc1wiPjYwbCBpcyBwb3NpdGlvbiBmcm9tICgwLCAwKSBnb2luZyA2MCBkZWdyZWVzIGxlZnQgb2YgdXAuIDYwciBpcyBwb3NpdGlvbiBmcm9tICgwLCAwKSBnb2luZyA2MCBkZWdyZWVzIHJpZ2h0IG9mIHVwL3BhcmFtPlxyXG4gICAgICAgIC8vLyA8cmV0dXJucz48L3JldHVybnM+XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gR2V0RHJhd1Bvc2l0aW9uIChTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGNvb3JkcylcclxuICAgICAgICB7XHJcbmludCBfNjBsO1xuaW50IF82MHI7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGNvb3Jkcywgb3V0IF82MGwsIG91dCBfNjByKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCkoKC1fNjBsICsgXzYwcikgKiBBcHAueE11bHRpcGxpZXIgKiBjb3M2MCksIChpbnQpKC0oXzYwbCArIF82MHIpICogQXBwLnhNdWx0aXBsaWVyICogc2luNjApKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IEZyb21EcmF3UG9zaXRpb24oU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBkcmF3UG9zaXRpb24pXHJcbiAgICAgICAge1xyXG5pbnQgeDtcbmludCB5O1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChkcmF3UG9zaXRpb24sIG91dCB4LCBvdXQgeSk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB4ID0gKC1fNjBsICsgXzYwcikgKiBBcHAueE11bHRpcGxpZXIgKiBzaW42MFxyXG4gICAgICAgICAgICAgICB5ID0gLShfNjBsICsgXzYwcikgKiBBcHAueE11bHRpcGxpZXIgKiBjb3M2MFxyXG4gICAgICAgICAgICAgICBrID0gQXBwLnhNdWx0aXBsaWVyXHJcbiAgICAgICAgICAgICAgIGEgPSBfNjBsXHJcbiAgICAgICAgICAgICAgIGIgPSBfNjByXHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBTb2x2ZSB4ID0gKC1hICsgYikgKiBrICogc2luNjA7eSA9IC0oYSsgYikgKiBrICogY29zNjAgZm9yIChhLCBiKSAoaHR0cHM6Ly93d3cud29sZnJhbWFscGhhLmNvbS9pbnB1dD9pPXNvbHZlK3grJTNEKyUyOC1hKyUyQitiJTI5KyoraysqK3NpbjYwJTNCeSslM0QrLSUyOGElMkIrYiUyOSsqK2srKitjb3M2MCtmb3IrYSthbmQrYilcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIGEgPSAtKHNxcnQoMykgeCArIDMgeSkvKDMgaylcclxuICAgICAgICAgICAgICAgYiA9IChzcXJ0KDMpIHggLSAzIHkpLygzIGspXHJcbiAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KSgtKE1hdGguU3FydCgzKSAqIHggKyAzICogeSkgLyAoMyAqIEFwcC54TXVsdGlwbGllcikpLCAoaW50KSgoTWF0aC5TcXJ0KDMpICogeCAtIDMgKiB5KSAvICgzICogQXBwLnhNdWx0aXBsaWVyKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGludCBOdW1iZXJPZkFkamFjZW50Q2VsbHMoU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBjb29yZHMsIEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiBlbXB0eUFkakFjdGlvbiA9IG51bGwpXHJcbiAgICAgICAge1xyXG5pbnQgXzYwbDtcbmludCBfNjByO1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChjb29yZHMsIG91dCBfNjBsLCBvdXQgXzYwcik7XHJcbiAgICAgICAgICAgIGludCBhZGphY2VudENlbGxzID0gMDtcclxuICAgICAgICAgICAgZm9yIChpbnQgTCA9IDA7IEwgPD0gNTsgTCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWRqYWNlbmN5UnVsZSA9IEFwcC5hZGphY2VuY3lSdWxlc1tMXTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyA2MGwgaXMgcG9zaXRpb24gZnJvbSAoMCwgMCkgZ29pbmcgNjAgZGVncmVlcyBsZWZ0IG9mIHVwLiA2MHIgaXMgcG9zaXRpb24gZnJvbSAoMCwgMCkgZ29pbmcgNjAgZGVncmVlcyByaWdodCBvZiB1cFxyXG4gICAgICAgICAgICAgICAgLy8gTCA9IDAgaXMgbGVmdC11cCwgZ29pbmcgY2xvY2t3aXNlIHVwIHRvIEw9NSBpcyBsZWZ0XHJcblxyXG4gICAgICAgICAgICAgICAgaW50IF82MGxfLCBfNjByXztcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoTClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0LXVwXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjBsXyA9IF82MGwgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjByXyA9IF82MHI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjBsXyA9IF82MGwgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjByXyA9IF82MHIgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAvLyByaWdodC11cFxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwbF8gPSBfNjBsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjByXyA9IF82MHIgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAvLyByaWdodC1kb3duXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjBsXyA9IF82MGwgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjByXyA9IF82MHI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGRvd25cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MGxfID0gXzYwbCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MHJfID0gXzYwciAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxlZnQtZG93blxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwbF8gPSBfNjBsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjByXyA9IF82MHIgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbihzdHJpbmcuRm9ybWF0KFwiSW52YWxpZCBMOiB7MH1cIixMKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblNxdWFyZVR5cGUgc3F1YXJlSW5mbztcblxyXG4gICAgICAgICAgICAgICAgLy9pZiAoRGl2aWRlcnMuSGFzRGl2aWRlcnMoY29vcmRzLmMwLCBjb29yZHMuYzEsIEwpKVxyXG4gICAgICAgICAgICAgICAgLy8gICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKFNxdWFyZXMuVHJ5R2V0VmFsdWUobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihfNjBsXywgXzYwcl8pLCBvdXQgc3F1YXJlSW5mbykpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNxdWFyZUluZm8uSXNBbGl2ZSgpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VudENlbGxzICs9IChpbnQpYWRqYWNlbmN5UnVsZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBlbXB0eUFkakFjdGlvbiE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+ZW1wdHlBZGpBY3Rpb24uSW52b2tlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oXzYwbF8sIF82MHJfKSkpOm51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFkamFjZW50Q2VsbHMgPiBBcHAubWF4QWRqYWNlbnRDZWxscyA/IEFwcC5tYXhBZGphY2VudENlbGxzIDogYWRqYWNlbnRDZWxscztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsYXNzIFRyaWFuZ2xlR3JpZCA6IEdyaWQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFRyaWFuZ2xlTG9jYXRpb24gPj5cclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBmbG9hdFxyXG4gICAgICAgICAgICBjb3M2MCA9IChmbG9hdClNYXRoLlNpbihNYXRoLlBJIC8gMyksXHJcbiAgICAgICAgICAgIHNpbjYwID0gKGZsb2F0KU1hdGguQ29zKE1hdGguUEkgLyAzKTtcclxuXHJcbiAgICAgICAgLy8gYzAgaXMgeCwgYzEgaXMgeVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IEdldERyYXdQb3NpdGlvbihTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsVHJpYW5nbGVMb2NhdGlvbiA+IGNvb3JkcylcclxuICAgICAgICB7XHJcbmludCBfNjBsO1xuaW50IF82MHI7XG5UcmlhbmdsZUxvY2F0aW9uIG47XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGNvb3Jkcywgb3V0IF82MGwsIG91dCBfNjByLCBvdXQgbik7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKCgtXzYwbCArIF82MHIpICogQXBwLnhNdWx0aXBsaWVyICogY29zNjApLCAoaW50KSgtKF82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIHNpbjYwKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFRyaWFuZ2xlTG9jYXRpb24gPiBGcm9tRHJhd1Bvc2l0aW9uKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhd1Bvc2l0aW9uKVxyXG4gICAgICAgIHtcclxuU3lzdGVtLkZ1bmM8ZG91YmxlLCBkb3VibGU+IE5lZ01vZDEgPSBudWxsO1xuaW50IHg7XG5pbnQgeTtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoZHJhd1Bvc2l0aW9uLCBvdXQgeCwgb3V0IHkpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogeCA9ICgtXzYwbCArIF82MHIpICogQXBwLnhNdWx0aXBsaWVyICogc2luNjBcclxuICAgICAgICAgICAgICAgeSA9IC0oXzYwbCArIF82MHIpICogQXBwLnhNdWx0aXBsaWVyICogY29zNjBcclxuICAgICAgICAgICAgICAgayA9IEFwcC54TXVsdGlwbGllclxyXG4gICAgICAgICAgICAgICBhID0gXzYwbFxyXG4gICAgICAgICAgICAgICBiID0gXzYwclxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgU29sdmUgeCA9ICgtYSArIGIpICogayAqIHNpbjYwO3kgPSAtKGErIGIpICogayAqIGNvczYwIGZvciAoYSwgYikgKGh0dHBzOi8vd3d3LndvbGZyYW1hbHBoYS5jb20vaW5wdXQ/aT1zb2x2ZSt4KyUzRCslMjgtYSslMkIrYiUyOSsqK2srKitzaW42MCUzQnkrJTNEKy0lMjhhJTJCK2IlMjkrKitrKyorY29zNjArZm9yK2ErYW5kK2IpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBhID0gLSgzIHggKyBzcXJ0KDMpIHkpLygzIGspXHJcbiAgICAgICAgICAgICAgIGIgPSAoMyB4IC0gc3FydCgzKSB5KS8oMyBrKVxyXG4gICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIFRyaWFuZ2xlTG9jYXRpb24gZnJvbSBwb3NpdGlvblxyXG5cclxuICAgICAgICAgICAgZG91YmxlIGJvYXJkXzYwbCA9IC0oTWF0aC5TcXJ0KDMpICogeCArIDMgKiB5KSAvICgzICogQXBwLnhNdWx0aXBsaWVyKSxcclxuICAgICAgICAgICAgICAgICAgIGJvYXJkXzYwciA9ICAoTWF0aC5TcXJ0KDMpICogeCAtIDMgKiB5KSAvICgzICogQXBwLnhNdWx0aXBsaWVyKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG5OZWdNb2QxID0gKGEpID0+IChhICUgMSArIDEpICUgMTtcblxyXG4gICAgICAgICAgICBkb3VibGUgXzYwbE1vZDEgPSBOZWdNb2QxKGJvYXJkXzYwbCksXHJcbiAgICAgICAgICAgICAgICAgICBfNjByTW9kMSA9IE5lZ01vZDEoYm9hcmRfNjByKTtcclxuXHJcbiAgICAgICAgICAgIFRyaWFuZ2xlTG9jYXRpb24gbiA9IF82MHJNb2QxIDw9ICgxLjAgLyAyKVxyXG4gICAgICAgICAgICAgICAgPyBfNjBsTW9kMSA8PSAoMS4wIC8gMykgPyBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbSA6XHJcbiAgICAgICAgICAgICAgICAgICAgXzYwbE1vZDEgPD0gKDIuMCAvIDMpID8gVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21MZWZ0IDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRyaWFuZ2xlTG9jYXRpb24uVG9wTGVmdFxyXG4gICAgICAgICAgICAgICAgOiBfNjBsTW9kMSA8PSAoMS4wIC8gMykgPyBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbVJpZ2h0IDpcclxuICAgICAgICAgICAgICAgICAgICBfNjBsTW9kMSA8PSAoMi4wIC8gMykgPyBUcmlhbmdsZUxvY2F0aW9uLlRvcFJpZ2h0IDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRyaWFuZ2xlTG9jYXRpb24uVG9wOyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBUcmlhbmdsZUxvY2F0aW9uPigoaW50KU1hdGguUm91bmQoYm9hcmRfNjBsKSwgKGludClNYXRoLlJvdW5kKGJvYXJkXzYwciksIG4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGludCBOdW1iZXJPZkFkamFjZW50Q2VsbHMoU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFRyaWFuZ2xlTG9jYXRpb24gPiBjb29yZHMsIEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsVHJpYW5nbGVMb2NhdGlvbiA+PiBlbXB0eUFkakFjdGlvbiA9IG51bGwpXHJcbiAgICAgICAge1xyXG5fX19BZGRTcXVhcmVfRGVsZWdhdGVfMCBBZGRTcXVhcmUgPSBudWxsO1xuU3lzdGVtLkZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+LCBUcmlhbmdsZUxvY2F0aW9uLCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4+IENyZWF0ZVBvcyA9IG51bGw7XG5TeXN0ZW0uRnVuYzxpbnQsIGJvb2wsIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4gR2V0RmluYWxIZXhhZ29uTG9jUG9zID0gbnVsbDtcblN5c3RlbS5GdW5jPGludCwgaW50LCBUcmlhbmdsZUxvY2F0aW9uPiBHZXRIZXhhZ29uTG9jID0gbnVsbDtcblN5c3RlbS5GdW5jPGludCwgYm9vbCwgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PiBHZXRIZXhhZ29uTG9jUG9zID0gbnVsbDtcbmludCBfNjBsO1xuaW50IF82MHI7XG5UcmlhbmdsZUxvY2F0aW9uIG47XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGNvb3Jkcywgb3V0IF82MGwsIG91dCBfNjByLCBvdXQgbik7XHJcbiAgICAgICAgICAgIGludCBhZGphY2VudENlbGxzID0gMDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAoVHJpYW5nbGVMb2NhdGlvbiBsb2MgPSAwOyBsb2MgPCBUcmlhbmdsZUxvY2F0aW9uLkNvdW50OyBsb2MrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvYyA9PSBuKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFkamFjZW5jeVJ1bGUgPSBBcHAuYWRqYWNlbmN5UnVsZXNbKGludClsb2NdO1xyXG4gICAgICAgICAgICAgICAgaWYgKEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuU3F1YXJlRXh0ZW5zaW9ucy5Db250YWluc0FsaXZlPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsVHJpYW5nbGVMb2NhdGlvbj4+KFNxdWFyZXMsbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBUcmlhbmdsZUxvY2F0aW9uPihfNjBsLCBfNjByLCBsb2MpKSlcclxuICAgICAgICAgICAgICAgICAgICBhZGphY2VudENlbGxzICs9IChpbnQpYWRqYWNlbmN5UnVsZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgdHJpYW5nbGVzIGZyb20gYWRqYWNlbnQgaGV4YWdvbnMgZm9yIGFkamFjZW5jeVxyXG5cclxuICAgICAgICAgICAgLy8gSWYgbGVmdC11cCwgZ2V0IHJpZ2h0LXVwLCByaWdodC1kb3duIGFuZCBkb3duIGZyb20gbGVmdC11cCxcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgZ2V0IHJpZ2h0LXVwIGFuZCB1cCBmcm9tIGxlZnQtZG93bixcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgZ2V0IGxlZnQtZG93biBhbmQgZG93biBmcm9tIHVwXHJcblxyXG4gICAgICAgICAgICAvLyBJZiB1cCwgZ2V0IGxlZnQtZG93biwgZG93biBhbmQgcmlnaHQtZG93biBmcm9tIHVwLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgZ2V0IHJpZ2h0LXVwIGFuZCByaWdodC1kb3duIGZyb20gbGVmdC11cFxyXG4gICAgICAgICAgICAvLyAgICAgICAgZ2V0IGxlZnQtdXAgYW5kIGxlZnQtZG93biBmcm9tIHJpZ2h0LXVwXHJcblxyXG4gICAgICAgICAgICAvLyBJZiByaWdodC11cCwgZ2V0IGxlZnQtdXAsIGxlZnQtZG93biBhbmQgZG93biBmcm9tIHJpZ2h0LXVwLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgZ2V0IGxlZnQtdXAgYW5kIHVwIGZyb20gcmlnaHQtZG93bixcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgIGdldCByaWdodC1kb3duIGFuZCBkb3duIGZyb20gdXBcclxuXHJcbiAgICAgICAgICAgIC8vIElmIGxlZnQtZG93biwgZ2V0IHJpZ2h0LXVwLCByaWdodC1kb3duIGFuZCB1cCBmcm9tIGxlZnQtZG93bixcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICBnZXQgcmlnaHQtZG93biBhbmQgZG93biBmcm9tIGxlZnQtdXAsXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgZ2V0IGxlZnQtdXAgYW5kIHVwIGZyb20gZG93blxyXG5cclxuICAgICAgICAgICAgLy8gSWYgZG93biwgZ2V0IGxlZnQtdXAsIHVwIGFuZCByaWdodC11cCBmcm9tIGRvd24sXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgIGdldCByaWdodC1kb3duIGFuZCByaWdodC11cCBmcm9tIGxlZnQtZG93blxyXG4gICAgICAgICAgICAvLyAgICAgICAgICBnZXQgbGVmdC1kb3duIGFuZCBsZWZ0LXVwIGZyb20gcmlnaHQtZG93blxyXG5cclxuICAgICAgICAgICAgLy8gSWYgcmlnaHQtZG93biwgZ2V0IGxlZnQtdXAsIGxlZnQtZG93biBhbmQgdXAgZnJvbSByaWdodC1kb3duLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBnZXQgbGVmdC1kb3duIGFuZCBkb3duIGZyb20gcmlnaHQtdXAsXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGdldCByaWdodC11cCBhbmQgdXAgZnJvbSBkb3duXHJcblxyXG4gICAgICAgICAgICBpbnQgeF8gPVxyXG4gICAgICAgICAgICAgICAgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQgfHwgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbUxlZnQgPyAtMSA6XHJcbiAgICAgICAgICAgICAgICBuID09IFRyaWFuZ2xlTG9jYXRpb24uVG9wUmlnaHQgfHwgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbVJpZ2h0ID8gMSA6XHJcbiAgICAgICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAgICAgeV8gPVxyXG4gICAgICAgICAgICAgICAgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQgfHwgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLlRvcFJpZ2h0IHx8IG4gPT0gVHJpYW5nbGVMb2NhdGlvbi5Ub3AgPyAtMSA6IDE7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuR2V0SGV4YWdvbkxvY1BvcyA9IChpbnZlcnRYLCBpbnZlcnRZKSA9PiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGludmVydFggPT0gLTEgPyAwIDogaW52ZXJ0WCA9PSAxID8gLXhfIDogeF8sIGludmVydFkgPyAteV8gOiB5Xyk7XG4gICAgICAgICAgICBcclxuR2V0SGV4YWdvbkxvYyA9ICh4LCB5KSA9PiB5ID09IDAgPyAoKFN5c3RlbS5GdW5jPFRyaWFuZ2xlTG9jYXRpb24+KSgoKSA9PlxyXG57XHJcbiAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbihcInkgY2Fubm90IGJlIDBcIik7XHJcbn1cclxuXHJcbikpKCkgOiB4ID09IDAgPyB5ID09IC0xID8gVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b20gOiBUcmlhbmdsZUxvY2F0aW9uLlRvcCA6IHggPT0gLTEgPyB5ID09IC0xID8gVHJpYW5nbGVMb2NhdGlvbi5Ub3BMZWZ0IDogVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21MZWZ0IDogeCA9PSAxID8geSA9PSAtMSA/IFRyaWFuZ2xlTG9jYXRpb24uVG9wUmlnaHQgOiBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbVJpZ2h0IDogKChTeXN0ZW0uRnVuYzxUcmlhbmdsZUxvY2F0aW9uPikoKCkgPT5cclxue1xyXG4gICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oXCJ4IG11c3QgYmUgLTEsIDAgb3IgMVwiKTtcclxufVxyXG5cclxuKSkoKTtcbkdldEZpbmFsSGV4YWdvbkxvY1BvcyA9IChpbnZlcnRYLCBpbnZlcnRZKSA9PlxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChHZXRIZXhhZ29uTG9jUG9zKGludmVydFgsIGludmVydFkpLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oXzYwbCArIHgsIF82MHIgKyB5KTtcclxufVxyXG5cclxuO1xuQ3JlYXRlUG9zID0gKHBvcywgTikgPT4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBUcmlhbmdsZUxvY2F0aW9uPihwb3MuSXRlbTEsIHBvcy5JdGVtMiwgTik7XG5BZGRTcXVhcmUgPSAoaW50IGludmVydFgxLCBib29sIGludmVydFkxLCBpbnQgaW52ZXJ0WDIsIGJvb2wgaW52ZXJ0WTIsIGludCB4MU92ZXJyaWRlLCBpbnQgeDJPdmVycmlkZSkgPT5cclxue1xyXG4gICAgaW50IF82MGxfO1xyXG4gICAgaW50IF82MHJfO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChHZXRGaW5hbEhleGFnb25Mb2NQb3MoaW52ZXJ0WDEsIGludmVydFkxKSwgb3V0IF82MGxfLCBvdXQgXzYwcl8pO1xyXG4gICAgaWYgKHgxT3ZlcnJpZGUgIT0gMClcclxuICAgICAgICBfNjBsXyA9IHgxT3ZlcnJpZGU7XHJcbiAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4gcG9zMiA9IEdldEhleGFnb25Mb2NQb3MoaW52ZXJ0WDIsIGludmVydFkyKTtcclxuICAgIGlmICh4Mk92ZXJyaWRlICE9IDApXHJcbiAgICAgICAgcG9zMi5JdGVtMSA9IHgyT3ZlcnJpZGU7XHJcbiAgICBUcmlhbmdsZUxvY2F0aW9uIG5fID0gR2V0SGV4YWdvbkxvYyhwb3MyLkl0ZW0xLCBwb3MyLkl0ZW0yKTtcclxuICAgIHZhciBjb29yZHNfID0gQ3JlYXRlUG9zKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oXzYwbF8sIF82MHJfKSwgbl8pO1xyXG4gICAgU3F1YXJlVHlwZSBzcXVhcmVJbmZvO1xyXG4gICAgaWYgKFNxdWFyZXMuVHJ5R2V0VmFsdWUoY29vcmRzXywgb3V0IHNxdWFyZUluZm8pKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChzcXVhcmVJbmZvLklzQWxpdmUoKSlcclxuICAgICAgICAgICAgYWRqYWNlbnRDZWxscyArPSAxO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAgICAgIGVtcHR5QWRqQWN0aW9uICE9IG51bGwgPyBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKSA9PiBlbXB0eUFkakFjdGlvbi5JbnZva2UoY29vcmRzXykpIDogbnVsbDtcclxufVxyXG5cclxuO1xuXHJcbiAgICAgICAgICAgIHN3aXRjaCAobilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQ6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uVG9wUmlnaHQ6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tTGVmdDpcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21SaWdodDpcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpbnZlcnRZIGlzIC0xLCB0aGVuIHRoZSB5IGNvb3JkaW5hdGUgaXMgcmVtb3ZlZC5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpbnZlcnRZIGlzIDAsIHRoZW4gdGhlIHkgY29vcmRpbmF0ZSBpcyBub3QgaW52ZXJ0ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaW52ZXJ0WSBpcyAxLCB0aGVuIHRoZSB5IGNvb3JkaW5hdGUgaXMgaW52ZXJ0ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaW52ZXJ0WCBpcyAwLCB0aGVuIHRoZSB4IGNvb3JkaW5hdGUgaXMgbm90IGludmVydGVkLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGludmVydFggaXMgMSwgdGhlbiB0aGUgeCBjb29yZGluYXRlIGlzIGludmVydGVkLlxyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgxLCB0cnVlLCAwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDEsIGZhbHNlLCAwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKC0xLCB0cnVlLCAwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDEsIGZhbHNlLCAwLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoLTEsIGZhbHNlLCAwLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMCwgdHJ1ZSwgLTEsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoLTEsIHRydWUsIC0xLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uVG9wOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbTpcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMCwgdHJ1ZSwgMCwgZmFsc2UsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCB0cnVlLCAwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDAsIHRydWUsIDAsIGZhbHNlLCAtMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDAsIGZhbHNlLCAwLCBmYWxzZSwgMSwgLTEpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCB0cnVlLCAwLCBmYWxzZSwgMSwgLTEpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCBmYWxzZSwgMCwgZmFsc2UsIC0xLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMCwgdHJ1ZSwgMCwgZmFsc2UsIC0xLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oXCJuIG11c3QgYmUgMCwgMSwgMiwgMywgNCBvciA1XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYWRqYWNlbnRDZWxscyA+IEFwcC5tYXhBZGphY2VudENlbGxzID8gQXBwLm1heEFkamFjZW50Q2VsbHMgOiBhZGphY2VudENlbGxzO1xyXG4gICAgICAgIH1cclxucHJpdmF0ZSBkZWxlZ2F0ZSB2b2lkIF9fX0FkZFNxdWFyZV9EZWxlZ2F0ZV8wKGludCBpbnZlcnRYMSwgYm9vbCBpbnZlcnRZMSwgaW50IGludmVydFgyLCBib29sIGludmVydFkyLCBpbnQgeDFPdmVycmlkZSA9IDAsIGludCB4Mk92ZXJyaWRlID0gMCk7ICAgIH1cclxufVxyXG4iXQp9Cg==
