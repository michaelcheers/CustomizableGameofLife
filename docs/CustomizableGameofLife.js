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

            for (var n2 = 0; n2 <= CustomizableGameofLife.App.currentMaxAdjacentCells; n2 = (n2 + 1) | 0) {
                var row1 = ((e, c) => c.appendChild(e))(document.createElement("tr"), rulesTable);
                CustomizableGameofLife.Extensions.Add(HTMLTableRowElement, row1, [CustomizableGameofLife.Extensions.Add(HTMLTableCellElement, document.createElement("td"), [Bridge.toString(n2)])]);
                CustomizableGameofLife.App.optionCells.add(new (System.ValueTuple$2(HTMLInputElement,HTMLInputElement)).$ctor1(CustomizableGameofLife.Extensions.SetBoolValue(((e, c) => c.appendChild(e))(CustomizableGameofLife.App.CreateCheckbox(), ((e, c) => c.appendChild(e))(document.createElement("td"), row1)), CustomizableGameofLife.App.livingRules[System.Array.index(n2, CustomizableGameofLife.App.livingRules)]), CustomizableGameofLife.Extensions.SetBoolValue(((e, c) => c.appendChild(e))(CustomizableGameofLife.App.CreateCheckbox(), ((e, c) => c.appendChild(e))(document.createElement("td"), row1)), CustomizableGameofLife.App.deadRules[System.Array.index(n2, CustomizableGameofLife.App.deadRules)])));
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
                    var name1 = { };
                    var livingRules = { };
                    var deadRules = { };
                    Bridge.Deconstruct(_d2.$clone(), name1, livingRules, deadRules);
                    CustomizableGameofLife.Extensions.Add(HTMLDivElement, presetsDiv, [CustomizableGameofLife.Extensions.Add(HTMLDivElement, document.createElement("div"), [CustomizableGameofLife.Extensions.Add(HTMLAnchorElement, ($t1 = document.createElement("a"), $t1.href = "javascript:void(0)", $t1.style.fontSize = "1rem", $t1.onclick = (function ($me, livingRules, deadRules) {
                        return function (e) {
                            CustomizableGameofLife.App.ApplyPreset(livingRules.v, deadRules.v);
                        };
                    })(this, livingRules, deadRules), $t1), [name1.v])])]);
                }
            } finally {
                if (Bridge.is($t, System.IDisposable)) {
                    $t.System$IDisposable$Dispose();
                }
            }
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [CustomizableGameofLife.Extensions.Add(HTMLDetailsElement, ($t1 = document.createElement("details"), $t1.open = true, $t1), [CustomizableGameofLife.Extensions.Add(HTMLElement, document.createElement("summary"), ["Adjacency Rules"]), CustomizableGameofLife.App.adjacencyRulesTableDiv]), CustomizableGameofLife.Extensions.Add(HTMLDetailsElement, ($t1 = document.createElement("details"), $t1.open = true, $t1), [CustomizableGameofLife.Extensions.Add(HTMLElement, document.createElement("summary"), ["Rules"]), CustomizableGameofLife.App.rulesTableDiv])]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [document.createElement("br"), presetsDiv, document.createElement("br")]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t1 = document.createElement("button"), $t1.className = "btn btn-primary", $t1.onclick = function (e) {
                for (var n3 = 0; n3 < CustomizableGameofLife.App.maxAdjacentCells; n3 = (n3 + 1) | 0) {
                    CustomizableGameofLife.App.adjacencyRules[System.Array.index(n3, CustomizableGameofLife.App.adjacencyRules)] = CustomizableGameofLife.Extensions.AdjacencyValue(CustomizableGameofLife.App.adjacencyRulesCells.getItem(n3));
                }
                for (var n4 = 0; n4 <= CustomizableGameofLife.App.maxAdjacentCells; n4 = (n4 + 1) | 0) {
                    CustomizableGameofLife.App.livingRules[System.Array.index(n4, CustomizableGameofLife.App.livingRules)] = CustomizableGameofLife.Extensions.BoolValue(CustomizableGameofLife.App.optionCells.getItem(n4).$clone().Item1);
                    CustomizableGameofLife.App.deadRules[System.Array.index(n4, CustomizableGameofLife.App.deadRules)] = CustomizableGameofLife.Extensions.BoolValue(CustomizableGameofLife.App.optionCells.getItem(n4).$clone().Item2);
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
                    }, $t1), [CustomizableGameofLife.Extensions.ToCamelString(CustomizableGameofLife.GridType, CustomizableGameofLife.GridType.Triangle)]), CustomizableGameofLife.App.NextGridTypeButton = $t, $t)]), [($t1 = CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t2 = document.createElement("button"), $t2.className = "btn btn-primary", $t2.onclick = function (e) {
                        CustomizableGameofLife.App.NextSquareType();
                    }, $t2), ["Wall"]), CustomizableGameofLife.App.NextSquareTypeButton = $t1, $t1)]), [($t2 = CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t3 = document.createElement("button"), $t3.className = "btn btn-primary", $t3.onclick = function (e) {
                        CustomizableGameofLife.App.InvertIsPlaying();
                    }, $t3), ["\u25b6"]), CustomizableGameofLife.App.PlayButton = $t2, $t2)]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t3 = document.createElement("button"), $t3.className = "btn btn-primary", $t3.onclick = function (e) {
                        CustomizableGameofLife.App.ShowModal(CustomizableGameofLife.App.ModalType.Settings);
                    }, $t3), ["\u2699"])]);
                    this.SquareTypePlacing = CustomizableGameofLife.SquareType.Count;
                    this.CurrentGridType = CustomizableGameofLife.GridType.Triangle;
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
                    this.Grid = new CustomizableGameofLife.TriangleGrid();
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
                        System.Collections.Generic.CollectionExtensions.TryAdd(CoordType, CustomizableGameofLife.SquareType, this.Squares, coords2, CustomizableGameofLife.SquareType.Cell);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDdXN0b21pemFibGVHYW1lb2ZMaWZlLmpzIiwKICAic291cmNlUm9vdCI6ICIiLAogICJzb3VyY2VzIjogWyJDbGFzczEuY3MiLCJFeHRlbnNpb25zLmNzIiwiTm90YWJsZU9iamVjdHNMaXN0LmNzIiwiU3F1YXJlLmNzIiwiR3JpZC5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQWlnQkFBLHdCQUFpRUE7WUFDckRBLHFCQUF3QkE7WUFDcENBO1lBQXFCQSxJQUFJQSxDQUFDQSxLQUFJQSw4Q0FBNkJBO2dCQUUzQ0E7b0JBRUlBLGVBQW1CQSxXQUFXQTtvQkFDOUJBLElBQUlBLGtCQUFrQkE7d0JBRWxCQSxJQUFJQSxBQUFxQ0E7NEJBRXJDQSxtQkFBc0JBLDhDQUFzQ0EsZUFBZUEsdUJBQXZCQTs0QkFDcERBLGtCQUFXQSxpQkFBY0EsMkNBQWFBOzt3QkFFMUNBLElBQUlBLEFBQXFDQTs0QkFFckNBLG9CQUFzQkEsOENBQXNDQSxlQUFlQSxxQkFBdkJBOzRCQUNwREEsa0JBQVdBLGtCQUFjQSx5Q0FBV0E7O3dCQUV4Q0EsSUFBSUEsQUFBcUNBOzRCQUVyQ0Esb0JBQStCQSw4Q0FBK0NBLGVBQWVBLDBCQUFoQ0E7NEJBQzdEQSxrQkFBV0Esa0JBQWNBLDhDQUFnQkE7Ozs7Ozs7WUFNekRBO1lBQ0FBLDBCQUEwQkE7WUFDMUJBO1lBQ0FBLDBCQUEwQkE7WUFDMUJBLDBCQUEwQkE7O1lBRTFCQSwwQkFBdUNBOztnQkFFbkNBLElBQUlBO29CQUVBQSxLQUFLQSxXQUFXQSxRQUFRQTt3QkFFcEJBLFdBQWNBLFFBQVFBLHlGQUFrRUEsQUFBQ0EsQUFBa0JBLEtBQU1BLHNDQUE2QkE7d0JBQzlJQSxtREFBd0JBLGlGQUEyREEsZ0RBQW9CQSw2QkFBa0VBLDhCQUErQkEsNkJBQTZEQSwyREFBMkRBLCtCQUEwQkEsNERBQWdFQSwrQkFBK0JBLFVBQU9BLHdCQUF5Q0EsNkRBQWVBLEdBQWZBOzs7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QkEsOENBQXVCQSw4Q0FBdUJBIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkRpYWdub3N0aWNzLkNvbnRyYWN0cztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5SZWZsZWN0aW9uO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgQXBwXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgeE11bHRpcGxpZXIgPSAyMDtcclxucHVibGljIHN0YXRpYyBpbnQgeU11bHRpcGxpZXJcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHhNdWx0aXBsaWVyO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBkb3VibGUgYWN0dWFsWE11bHRpcGxpZXJcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIEdyaWQgaXMgSGV4R3JpZCA/IHhNdWx0aXBsaWVyICogMiAqIEhleEdyaWQuY29zNjAgOiB4TXVsdGlwbGllcjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgZG91YmxlIGFjdHVhbFlNdWx0aXBsaWVyXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBHcmlkIGlzIEhleEdyaWQgPyB5TXVsdGlwbGllciAqIDIgKiBIZXhHcmlkLnNpbjYwIDogeU11bHRpcGxpZXI7XHJcbiAgICB9XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IHNjcmVlbldpZHRoID0gV2luZG93LklubmVyV2lkdGgsIHNjcmVlbkhlaWdodCA9IFdpbmRvdy5Jbm5lckhlaWdodDtcclxucHVibGljIHN0YXRpYyBpbnQgd2lkdGhcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIChpbnQpTWF0aC5DZWlsaW5nKChkb3VibGUpc2NyZWVuV2lkdGggLyB4TXVsdGlwbGllcik7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIGludCBoZWlnaHRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIChpbnQpTWF0aC5DZWlsaW5nKChkb3VibGUpc2NyZWVuSGVpZ2h0IC8geU11bHRpcGxpZXIpO1xyXG4gICAgfVxyXG59XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBIb3RiYXIgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFN0eWxlID0ge1xyXG4gICAgICAgICAgICAgICAgUG9zaXRpb24gPSBQb3NpdGlvbi5BYnNvbHV0ZSxcclxuICAgICAgICAgICAgICAgIExlZnQgPSBcIjEwMHB4XCIsXHJcbiAgICAgICAgICAgICAgICBUb3AgPSBzdHJpbmcuRm9ybWF0KFwiezB9cHhcIixXaW5kb3cuSW5uZXJIZWlnaHQgLSA0MCkgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFJlc2V0KG1ha2VCbGFuazogdHJ1ZSlcclxuICAgICAgICAgICAgfSxcIkJsYW5rXCIpKVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFJlc2V0KClcclxuICAgICAgICAgICAgfSxcIlJlc2V0XCIpKVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsXHJcbiAgICAgICAgICAgICAgICBPbkNsaWNrID0gZSA9PiBTYXZlQXNTdGFydGVyKClcclxuICAgICAgICAgICAgfSxcIlNhdmUgYXMgU3RhcnRlclwiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBab29tKHpvb21JbjogZmFsc2UpXHJcbiAgICAgICAgICAgIH0sXCJab29tIE91dFwiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBab29tKHpvb21JbjogdHJ1ZSlcclxuICAgICAgICAgICAgfSxcIlpvb20gSW5cIikpXHJcbixOZXh0R3JpZFR5cGVCdXR0b24gPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gTmV4dEdyaWRUeXBlKClcclxuICAgICAgICAgICAgfSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuVG9DYW1lbFN0cmluZzxHcmlkVHlwZT4oR3JpZFR5cGUuVHJpYW5nbGUpKSlcclxuLE5leHRTcXVhcmVUeXBlQnV0dG9uID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IE5leHRTcXVhcmVUeXBlKClcclxuICAgICAgICAgICAgfSxcIldhbGxcIikpXHJcbixQbGF5QnV0dG9uID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IEludmVydElzUGxheWluZygpXHJcbiAgICAgICAgICAgIH0sXCLilrZcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gU2hvd01vZGFsKE1vZGFsVHlwZS5TZXR0aW5ncylcclxuICAgICAgICAgICAgfSxcIuKamVwiKSk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU3F1YXJlVHlwZSBTcXVhcmVUeXBlUGxhY2luZyA9IFNxdWFyZVR5cGUuQ291bnQ7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBHcmlkVHlwZSBDdXJyZW50R3JpZFR5cGUgPSBHcmlkVHlwZS5UcmlhbmdsZTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxCdXR0b25FbGVtZW50IE5leHRHcmlkVHlwZUJ1dHRvbiwgTmV4dFNxdWFyZVR5cGVCdXR0b247XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBab29tIChib29sIHpvb21JbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHhNdWx0aXBsaWVyICs9IHpvb21JbiA/IDEgOiAtMTtcclxuICAgICAgICAgICAgaWYgKHhNdWx0aXBsaWVyIDw9IDEpXHJcbiAgICAgICAgICAgICAgICB4TXVsdGlwbGllciA9IDI7XHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBOZXh0U3F1YXJlVHlwZSAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU3F1YXJlVHlwZVBsYWNpbmcgPSAoU3F1YXJlVHlwZSkoKChpbnQpU3F1YXJlVHlwZVBsYWNpbmcgKyAxKSAlIChpbnQpKFNxdWFyZVR5cGUuQ291bnQgKyAxKSk7XHJcbiAgICAgICAgICAgIE5leHRTcXVhcmVUeXBlQnV0dG9uLklubmVySFRNTCA9IFNxdWFyZVR5cGVQbGFjaW5nID09IFNxdWFyZVR5cGUuQ291bnQgPyBcIldhbGxcIiA6IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5Ub0NhbWVsU3RyaW5nPFNxdWFyZVR5cGU+KFNxdWFyZVR5cGVQbGFjaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBOZXh0R3JpZFR5cGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ3VycmVudEdyaWRUeXBlID0gKEdyaWRUeXBlKSgoKGludClDdXJyZW50R3JpZFR5cGUgKyAxKSAlIChpbnQpR3JpZFR5cGUuQ291bnQpO1xyXG4gICAgICAgICAgICBOZXh0R3JpZFR5cGVCdXR0b24uSW5uZXJIVE1MID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLlRvQ2FtZWxTdHJpbmc8R3JpZFR5cGU+KEN1cnJlbnRHcmlkVHlwZSk7XHJcbiAgICAgICAgICAgIGlmIChDdXJyZW50R3JpZFR5cGUgPT0gR3JpZFR5cGUuVHJpYW5nbGUpXHJcbiAgICAgICAgICAgICAgICB4TXVsdGlwbGllciAqPSAyO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChDdXJyZW50R3JpZFR5cGUgPT0gR3JpZFR5cGUuU3F1YXJlKVxyXG4gICAgICAgICAgICAgICAgeE11bHRpcGxpZXIgLz0gMjtcclxuICAgICAgICAgICAgc3dpdGNoIChDdXJyZW50R3JpZFR5cGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgR3JpZFR5cGUuU3F1YXJlOlxyXG4gICAgICAgICAgICAgICAgICAgIEdyaWQgPSBuZXcgU3F1YXJlR3JpZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBHcmlkVHlwZS5IZXg6XHJcbiAgICAgICAgICAgICAgICAgICAgR3JpZCA9IG5ldyBIZXhHcmlkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEdyaWRUeXBlLlRyaWFuZ2xlOlxyXG4gICAgICAgICAgICAgICAgICAgIEdyaWQgPSBuZXcgVHJpYW5nbGVHcmlkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBSaWdodEhvdGJhciA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU3R5bGUgPSB7XHJcbiAgICAgICAgICAgICAgICBQb3NpdGlvbiA9IFBvc2l0aW9uLkFic29sdXRlLFxyXG4gICAgICAgICAgICAgICAgUmlnaHQgPSBcIjEwMHB4XCIsXHJcbiAgICAgICAgICAgICAgICBUb3AgPSBzdHJpbmcuRm9ybWF0KFwiezB9cHhcIixXaW5kb3cuSW5uZXJIZWlnaHQgLSA0MCkgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1pbmZvXCIsXHJcbiAgICAgICAgICAgICAgICBPbkNsaWNrID0gZSA9PiBTaG93TW9kYWwoTW9kYWxUeXBlLk5vdGFibGVPYmplY3RzKVxyXG4gICAgICAgICAgICB9LFwiTm90YWJsZSBPYmplY3RzXCIpKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFJlc2V0IChib29sIG1ha2VCbGFuayA9IGZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCFHbG9iYWwuQ29uZmlybShcIkFueSB1bnNhdmVkIGNoYW5nZXMgd2lsbCBiZSBsb3N0LiBDb250aW51ZT9cIikpIHJldHVybjtcclxuICAgICAgICAgICAgR3JpZC5DbGVhcigpO1xyXG5HcmlkPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4gZ3JpZDsgICAgICAgICAgICBpZiAoIW1ha2VCbGFuayAmJiAoZ3JpZCA9IEdyaWQgYXMgR3JpZDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+KSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0IHN0YXJ0ZXJQb3NpdGlvbnMgPSBHbG9iYWwuTG9jYWxTdG9yYWdlLkdldEl0ZW0oXCJzdGFydGVyUG9zaXRpb25zXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0ZXJQb3NpdGlvbnMgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgcyA9IChzdHJpbmcpc3RhcnRlclBvc2l0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXN0cmluZy5Jc051bGxPckVtcHR5KHMpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGpzb25SYXcgPSBKU09OLlBhcnNlKHMpLlRvRHluYW1pYygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoanNvblJhdy5sZW5ndGggPT0gMCB8fCBqc29uUmF3WzBdLkl0ZW0zID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVhY2ggKHZhciBwb3MgaW4gKEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID5bXT4ocykpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyaWQuU3F1YXJlcy5BZGQocG9zLCBTcXVhcmVUeXBlLkNlbGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVhY2ggKHZhciBzcXVhcmVJbmZvIGluIChKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsU3F1YXJlVHlwZSA+W10+KHMpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmlkLlNxdWFyZXMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oc3F1YXJlSW5mby5JdGVtMSwgc3F1YXJlSW5mby5JdGVtMiksIHNxdWFyZUluZm8uSXRlbTMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGxheWluZylcclxuICAgICAgICAgICAgICAgIEludmVydElzUGxheWluZygpO1xyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFNxdWFyZVR5cGUgPj4gR2V0Q29vcmRpbmF0ZXNJbnRlcmFsKClcclxuICAgICAgICB7XHJcbkdyaWQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PiBnOyAgICAgICAgICAgIGlmICgoZyA9IEdyaWQgYXMgR3JpZDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+KSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IG9mZnNldENvb3JkcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oTmVnRGl2KG9mZnNldFBvcy5JdGVtMSwgKGludClhY3R1YWxYTXVsdGlwbGllciksIE5lZ0RpdihvZmZzZXRQb3MuSXRlbTIsIChpbnQpYWN0dWFsWU11bHRpcGxpZXIpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlRvTGlzdDxLZXlWYWx1ZVBhaXI8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4sU3F1YXJlVHlwZT4+KGcuU3F1YXJlcykuQ29udmVydEFsbDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+PigoQ29udmVydGVyPEtleVZhbHVlUGFpcjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixTcXVhcmVUeXBlPixTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+PikocyA9PiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFNxdWFyZVR5cGU+KHMuS2V5Lkl0ZW0xICsgb2Zmc2V0Q29vcmRzLkl0ZW0xLCBzLktleS5JdGVtMiArIG9mZnNldENvb3Jkcy5JdGVtMiwgcy5WYWx1ZSkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFNxdWFyZVR5cGUgPj4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBMaXN0PChpbnQgeCwgaW50IHksIFNxdWFyZVR5cGUgc3F1YXJlVHlwZSk+IEdldE5vcm1hbGl6ZWRDb29yZGluYXRlcyAoKVxyXG4gICAgICAgIC8ve1xyXG4gICAgICAgIC8vICAgIExpc3Q8KGludCB4LCBpbnQgeSwgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKT4gY29vcmRzID0gR2V0Q29vcmRpbmF0ZXNJbnRlcmFsKCk7XHJcbiAgICAgICAgLy8gICAgY29vcmRzID0gY29vcmRzLldoZXJlKGMgPT4gYy54ID49IDAgJiYgYy55ID49IDAgJiYgYy54IDwgd2lkdGggJiYgYy55IDwgaGVpZ2h0KS5Ub0xpc3QoKTtcclxuICAgICAgICAvLyAgICBpbnQgbWluWCA9IGNvb3Jkcy5NaW4oYyA9PiBjLngpLCBtaW5ZID0gY29vcmRzLk1pbihjID0+IGMueSk7XHJcbiAgICAgICAgLy8gICAgY29vcmRzID0gY29vcmRzLlNlbGVjdChjID0+IChjLnggLSBtaW5YLCBjLnkgLSBtaW5ZLCBjLnNxdWFyZVR5cGUpKS5Ub0xpc3QoKTtcclxuICAgICAgICAvLyAgICByZXR1cm4gY29vcmRzO1xyXG4gICAgICAgIC8vfVxyXG5cclxuICAgICAgICAvLyAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEdldENvb3JkaW5hdGVzICgpXHJcbiAgICAgICAgLy8gICAgICAgIHtcclxuICAgICAgICAvLyAgICAgICAgICAgIHN0cmluZyBjb2RlR2VuZXJhdGVkID0gJEBcIihuZXcgSGFzaFNldDwoaW50IHgsIGludCB5KT5cclxuICAgICAgICAvL3t7XHJcbiAgICAgICAgLy8gICAge3N0cmluZy5Kb2luKFwiLFxcbiAgICBcIiwgR2V0Tm9ybWFsaXplZENvb3JkaW5hdGVzKCkuU2VsZWN0KHQgPT4gJFwiKHt0Lnh9LCB7dC55fSlcIikpfVxyXG4gICAgICAgIC8vfX0sIFwiXCJVbnRpdGxlZCBPYmplY3RcIlwiLCB7SlNPTi5TdHJpbmdpZnkoJFwieyhhZGphY2VuY3lSdWxlcy5BbGwoYSA9PiBhID09IEFkamFjZW5jeVR5cGUuT25lKSA/IFwiXCIgOiAoc3RyaW5nLkNvbmNhdChhZGphY2VuY3lSdWxlcy5TZWxlY3QoayA9PiAoaW50KWspKSkgKyBcIiAtPiBcIil9e3N0cmluZy5Db25jYXQoZGVhZFJ1bGVzLlNlbGVjdChrID0+IGsgPyAxIDogMCkpfSAvIHtzdHJpbmcuQ29uY2F0KGxpdmluZ1J1bGVzLlNlbGVjdChrID0+IGsgPyAxIDogMCkpfVwiKX0pXCI7XHJcbiAgICAgICAgLy8gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCBtb2RhbCwgbW9kYWxDb250ZW50ID0gXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgbmV3IEhUTUxEaXZFbGVtZW50IHsgQ2xhc3NOYW1lID0gXCJtb2RhbC1jb250ZW50XCIgfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAuQWRkVG8obmV3IEhUTUxEaXZFbGVtZW50IHsgQ2xhc3NOYW1lID0gXCJtb2RhbC1kaWFsb2dcIiB9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAuQWRkVG8obW9kYWwgPSBuZXcgSFRNTERpdkVsZW1lbnQgeyBDbGFzc05hbWUgPSBcIm1vZGFsXCIsIFN0eWxlID0geyBEaXNwbGF5ID0gXCJpbmhlcml0XCIgfSB9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgLkFkZFRvKERvY3VtZW50LkJvZHkpXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICBtb2RhbENvbnRlbnQuQWRkKFxyXG5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICBuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwibW9kYWwtaGVhZGVyXCJcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAuQWRkKG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0bi1jbG9zZVwiLFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT4gbW9kYWwuUmVtb3ZlKClcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgLkFkZChuZXcgSFRNTFNwYW5FbGVtZW50XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5uZXJIVE1MID0gXCImdGltZXM7XCJcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICApLFxyXG5cclxuXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgbmV3IEhUTUxQcmVFbGVtZW50XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcIm1vZGFsLWJvZHlcIixcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgU3R5bGUgPVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICBbXCJ1c2VyLXNlbGVjdFwiXSA9IFwidGV4dFwiXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICB9LkFkZChjb2RlR2VuZXJhdGVkKVxyXG4gICAgICAgIC8vICAgICAgICAgICAgKTtcclxuICAgICAgICAvLyAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgU2F2ZUFzU3RhcnRlciAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgR2xvYmFsLkxvY2FsU3RvcmFnZS5TZXRJdGVtKFxyXG4gICAgICAgICAgICAgICAgXCJzdGFydGVyUG9zaXRpb25zXCIsIEpzb25Db252ZXJ0LlNlcmlhbGl6ZU9iamVjdChHZXRDb29yZGluYXRlc0ludGVyYWwoKSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgU2V0dGluZ3NQb3B1cCwgTm90YWJsZU9iamVjdHNQb3B1cDtcclxucHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBDcmVhdGVQb3B1cCgpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTERpdkVsZW1lbnR7U3R5bGUgPSB7Rm9udFNpemUgPSBcIjEuNXJlbVwiLCBCYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCIsIFBvc2l0aW9uID0gUG9zaXRpb24uRml4ZWQsIFRvcCA9IFwiMHB4XCIsIExlZnQgPSBcIjI1JVwiLCBXaWR0aCA9IFwiNTAlXCIsIEhlaWdodCA9IFwiMTAwJVwiLCBEaXNwbGF5ID0gRGlzcGxheS5Ob25lLCBPdmVyZmxvdyA9IE92ZXJmbG93LlNjcm9sbH19O1xyXG59XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBQb3B1cENvbnRhaW5lciA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBIVE1MRGl2RWxlbWVudCgpLChfbzEpPT57X28xLlN0eWxlLlBvc2l0aW9uPSBQb3NpdGlvbi5GaXhlZDtfbzEuU3R5bGUuVG9wPSBcIjBcIjtfbzEuU3R5bGUuTGVmdD0gXCIwXCI7X28xLlN0eWxlLldpZHRoPSBcIjEwMCVcIjtfbzEuU3R5bGVbXCJ4LWluZGV4XCJdPSA5OTk5OTk7X28xLlN0eWxlLkhlaWdodD0gXCIxMDAlXCI7X28xLlN0eWxlLkJhY2tncm91bmRDb2xvcj0gXCJyZ2JhKDAsIDAsIDAsIDAuNSlcIjtfbzEuU3R5bGUuRGlzcGxheT0gRGlzcGxheS5Ob25lO3JldHVybiBfbzE7fSlcclxuLFNldHRpbmdzUG9wdXAgPSBDcmVhdGVQb3B1cCgpKVxyXG4sTm90YWJsZU9iamVjdHNQb3B1cCA9IENyZWF0ZVBvcHVwKCkpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxCdXR0b25FbGVtZW50IFNldHRpbmdzQnV0dG9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxCdXR0b25FbGVtZW50IFBsYXlCdXR0b247XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBJbnZlcnRJc1BsYXlpbmcgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSAhcGxheWluZztcclxuICAgICAgICAgICAgUGxheUJ1dHRvbi5Jbm5lckhUTUwgPSBwbGF5aW5nID8gXCLij7hcIiA6IFwi4pa2XCI7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIHBsYXlpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sW10gbGl2aW5nUnVsZXMgPSBuZXcgYm9vbFttYXhBZGphY2VudENlbGxzICsgMV0geyBmYWxzZSwgZmFsc2UsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UgfTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2xbXSBkZWFkUnVsZXMgICAgID0gbmV3IGJvb2xbbWF4QWRqYWNlbnRDZWxscyArIDFdIHsgZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSB9O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgQWRqYWNlbmN5VHlwZVtdIGFkamFjZW5jeVJ1bGVzID0gbmV3IEFkamFjZW5jeVR5cGVbbWF4QWRqYWNlbnRDZWxsc10geyBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lIH07XHJcbnB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ3JlYXRlQ2FudmFzKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MQ2FudmFzRWxlbWVudHtXaWR0aCA9IHNjcmVlbldpZHRoLCBIZWlnaHQgPSBzY3JlZW5IZWlnaHR9O1xyXG59cHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBDcmVhdGVUb3BDYW52YXMoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxDYW52YXNFbGVtZW50e1dpZHRoID0gd2lkdGggKyAyLCBIZWlnaHQgPSBoZWlnaHQgKyAyfTtcclxufSAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGUgaHlwbyhkb3VibGUgeCwgZG91YmxlIHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5TcXJ0KE1hdGguUG93KHgsIDIpICsgTWF0aC5Qb3coeSwgMikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IENyZWF0ZUJvdHRvbUNhbnZhcygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBCb3R0b21DYW52YXMgPSBHcmlkIGlzIEhleEdyaWQgP1xyXG4gICAgICAgICAgICAgICAgbmV3IEhUTUxDYW52YXNFbGVtZW50XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgV2lkdGggPSBET01DYW52YXMuV2lkdGggKyA0ICogeE11bHRpcGxpZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgSGVpZ2h0ID0gRE9NQ2FudmFzLkhlaWdodCArIDQgKiB5TXVsdGlwbGllclxyXG4gICAgICAgICAgICAgICAgfSA6XHJcbiAgICAgICAgICAgICAgICBuZXcgSFRNTENhbnZhc0VsZW1lbnRcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBXaWR0aCA9IHNjcmVlbldpZHRoICsgMiAqIHhNdWx0aXBsaWVyLFxyXG4gICAgICAgICAgICAgICAgICAgIEhlaWdodCA9IHNjcmVlbkhlaWdodCArIDIgKiB5TXVsdGlwbGllclxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIEJvdHRvbUNhbnZhc0NvbnRleHQgPSBCb3R0b21DYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuU3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuVHJhbnNsYXRlKDAuNSwgMC41KTtcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5MaW5lV2lkdGggPSAxO1xyXG5IZXhHcmlkIGg7ICAgICAgICAgICAgaWYgKChoID0gR3JpZCBhcyBIZXhHcmlkKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpbnQgYSA9IC0oaW50KWh5cG8od2lkdGgsIGhlaWdodCk7IGEgPCAoaW50KWh5cG8od2lkdGgsIGhlaWdodCk7IGErKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCBiID0gLShpbnQpaHlwbyh3aWR0aCwgaGVpZ2h0KTsgYiA8IChpbnQpaHlwbyh3aWR0aCwgaGVpZ2h0KTsgYisrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuaW50IHg7XG5pbnQgeTtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoaC5HZXREcmF3UG9zaXRpb24obmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihhLCBiKSksIG91dCB4LCBvdXQgeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuRHJhd0hleGFnb24oeCwgeSwgeE11bHRpcGxpZXIgKiAyIC8gMywgc3Ryb2tlOiB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICBUcmlhbmdsZUdyaWQgdDtcclxuICAgIGlmICgodCA9IEdyaWQgYXMgVHJpYW5nbGVHcmlkKSAhPSBudWxsKVxyXG4gICAge1xyXG4gICAgICAgIGZvciAoaW50IGEgPSAtKGludCloeXBvKHdpZHRoLCBoZWlnaHQpOyBhIDwgKGludCloeXBvKHdpZHRoLCBoZWlnaHQpOyBhKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGludCBiID0gLShpbnQpaHlwbyh3aWR0aCwgaGVpZ2h0KTsgYiA8IChpbnQpaHlwbyh3aWR0aCwgaGVpZ2h0KTsgYisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKFRyaWFuZ2xlTG9jYXRpb24gdGwgPSBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQ7IHRsIDwgVHJpYW5nbGVMb2NhdGlvbi5Db3VudDsgdGwrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnQgeDtcclxuICAgICAgICAgICAgICAgICAgICBpbnQgeTtcclxuICAgICAgICAgICAgICAgICAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KHQuR2V0RHJhd1Bvc2l0aW9uKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4oYSwgYiwgdGwpKSwgb3V0IHgsIG91dCB5KTtcclxuICAgICAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkRyYXdUcmlhbmdsZSh4LCB5LCB4TXVsdGlwbGllciAqIDIgLyAzLCB0bCwgc3Ryb2tlOiB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIC8vSGV4R3JpZCBncmlkID0gbmV3IEhleEdyaWQoKTtcclxuICAgIC8vZG91YmxlIHhPZmZzZXQgPSB3aWR0aCAvIDIgKiBBcHAueE11bHRpcGxpZXIgKyBvZmZzZXRQb3MueFxyXG4gICAgLy8gICAgICwgeU9mZnNldCA9IGhlaWdodCAqIEFwcC54TXVsdGlwbGllciArIG9mZnNldFBvcy55O1xyXG4gICAgLy9pbnQgbWluV2lkdGggPSAtMiwgbWluSGVpZ2h0ID0gLTI7XHJcbiAgICAvL2ludCBtYXhXaWR0aCA9IChpbnQpTWF0aC5DZWlsaW5nKGh5cG8od2lkdGgsIGhlaWdodCkpLCBtYXhIZWlnaHQgPSAoaW50KU1hdGguQ2VpbGluZyhoeXBvKHdpZHRoLCBoZWlnaHQpKTtcclxuICAgIC8vZm9yIChpbnQgXzMwbCA9IG1pbldpZHRoIC0gMjsgXzMwbCA8PSAobWF4V2lkdGggKyAyKTsgXzMwbCsrKVxyXG4gICAgLy97XHJcbiAgICAvLyAgICB2YXIgcG9zMSA9IGdyaWQuR2V0RHJhd1Bvc2l0aW9uKChfMzBsLCBtaW5IZWlnaHQgLSAzKSk7XHJcbiAgICAvLyAgICB2YXIgcG9zMiA9IGdyaWQuR2V0RHJhd1Bvc2l0aW9uKChfMzBsLCBtYXhIZWlnaHQgKyAzKSk7XHJcbiAgICAvLyAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbyhwb3MxLnggKyB4T2Zmc2V0LCBwb3MxLnkgKyB5T2Zmc2V0KTtcclxuICAgIC8vICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKHBvczIueCArIHhPZmZzZXQsIHBvczIueSArIHlPZmZzZXQpO1xyXG4gICAgLy99XHJcbiAgICAvL2ZvciAoaW50IF8zMHIgPSBtaW5IZWlnaHQgLSAyOyBfMzByIDw9IChtYXhIZWlnaHQgKyAyKTsgXzMwcisrKVxyXG4gICAgLy97XHJcbiAgICAvLyAgICB2YXIgcG9zMSA9IGdyaWQuR2V0RHJhd1Bvc2l0aW9uKChtaW5XaWR0aCAtIDMsIF8zMHIpKTtcclxuICAgIC8vICAgIHZhciBwb3MyID0gZ3JpZC5HZXREcmF3UG9zaXRpb24oKG1heFdpZHRoICsgMywgXzMwcikpO1xyXG4gICAgLy8gICAgQm90dG9tQ2FudmFzQ29udGV4dC5Nb3ZlVG8ocG9zMS54ICsgeE9mZnNldCwgcG9zMS55ICsgeU9mZnNldCk7XHJcbiAgICAvLyAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVUbyhwb3MyLnggKyB4T2Zmc2V0LCBwb3MyLnkgKyB5T2Zmc2V0KTtcclxuICAgIC8vfVxyXG4gICAgLy9mb3IgKGludCB5ID0gbWluSGVpZ2h0IC0gMjsgeSA8PSAobWF4SGVpZ2h0ICsgMik7IHkrKylcclxuICAgIC8ve1xyXG4gICAgLy8gICAgdmFyIHBvczEgPSBncmlkLkdldERyYXdQb3NpdGlvbigoLXdpZHRoIC8geE11bHRpcGxpZXIsIHkpKTtcclxuICAgIC8vICAgIHZhciBwb3MyID0gZ3JpZC5HZXREcmF3UG9zaXRpb24oKHksIC13aWR0aCAvIHhNdWx0aXBsaWVyKSk7XHJcbiAgICAvLyAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbyhwb3MxLnggKyB4T2Zmc2V0LCBwb3MxLnkgKyB5T2Zmc2V0KTtcclxuICAgIC8vICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKHBvczIueCArIHhPZmZzZXQsIHBvczIueSArIHlPZmZzZXQpO1xyXG4gICAgLy99XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChHcmlkIGlzIFNxdWFyZUdyaWQpXHJcbiAgICB7XHJcbiAgICAgICAgZm9yIChpbnQgeCA9IDA7IHggPD0gKHdpZHRoICsgMik7IHgrKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTW92ZVRvKHggKiB4TXVsdGlwbGllciwgMCk7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKHggKiB4TXVsdGlwbGllciwgKGhlaWdodCArIDMpICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChpbnQgeSA9IDA7IHkgPD0gKGhlaWdodCArIDIpOyB5KyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbygwLCB5ICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVUbygod2lkdGggKyAzKSAqIHhNdWx0aXBsaWVyLCB5ICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDwgMTA7IG4rKylcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuU3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBCb3R0b21DYW52YXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IERPTUNhbnZhcyA9IENyZWF0ZUNhbnZhcygpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIERPTUNhbnZhc0NvbnRleHQgPSBET01DYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgR3JpZCBHcmlkID0gbmV3IFRyaWFuZ2xlR3JpZCgpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBvZmZzZXRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gTW91c2VQb3MgKHRoaXMgTW91c2VFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHJlY3QgPSBET01DYW52YXMuR2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKGUuQ2xpZW50WCAtIHJlY3QuTGVmdCksIChpbnQpKGUuQ2xpZW50WSAtIHJlY3QuVG9wKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBOZWdEaXYgKGludCBhLCBpbnQgYilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCByZXMgPSBhIC8gYjtcclxuICAgICAgICAgICAgcmV0dXJuIChhIDwgMCAmJiBhICE9IGIgKiByZXMpID8gcmVzIC0gMSA6IHJlcztcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgZG91YmxlIE5lZ0RpdkRvdWJsZShkb3VibGUgYSwgZG91YmxlIGIpXHJcbntcclxuICAgIHJldHVybiBhID49IDAgPyBhIC8gYiA6IChhIC0gYiArIDEpIC8gYjtcclxufVxyXG4gICAgICAgIHB1YmxpYyBjb25zdCBpbnQgbWF4QWRqYWNlbnRDZWxscyA9IDEyO1xyXG5wdWJsaWMgc3RhdGljIGludCBjdXJyZW50TWF4QWRqYWNlbnRDZWxsc1xyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gR3JpZCBpcyBIZXhHcmlkID8gNiA6IEdyaWQgaXMgU3F1YXJlR3JpZCA/IDggOiBHcmlkIGlzIFRyaWFuZ2xlR3JpZCA/IDEyIDogKChTeXN0ZW0uRnVuYzxpbnQ+KSgoKSA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKHN0cmluZy5Gb3JtYXQoXCJHcmlkIHR5cGUgbm90IGZvdW5kOiB7MH1cIixHcmlkLkdldFR5cGUoKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgKSkoKTtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHN0YXRpYyBMaXN0PEhUTUxTZWxlY3RFbGVtZW50PiBhZGphY2VuY3lSdWxlc0NlbGxzID0gbmV3IExpc3Q8SFRNTFNlbGVjdEVsZW1lbnQ+KCk7XHJcbiAgICAgICAgc3RhdGljIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SFRNTElucHV0RWxlbWVudCxIVE1MSW5wdXRFbGVtZW50Pj4gb3B0aW9uQ2VsbHMgPSBuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIVE1MSW5wdXRFbGVtZW50LEhUTUxJbnB1dEVsZW1lbnQ+PigpO1xyXG5cclxuICAgICAgICBzdGF0aWMgdm9pZCBBcHBseVByZXNldChib29sW10gbGl2aW5nUnVsZXMsIGJvb2xbXSBkZWFkUnVsZXMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8PSA4OyBuKyspXHJcbiAgICAgICAgICAgIHtcclxub3B0aW9uQ2VsbHNbbl0uSXRlbTEuU2V0Qm9vbFZhbHVlKGxpdmluZ1J1bGVzW25dKTtcclxub3B0aW9uQ2VsbHNbbl0uSXRlbTIuU2V0Qm9vbFZhbHVlKGRlYWRSdWxlc1tuXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBlbnVtIE1vZGFsVHlwZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU2V0dGluZ3MsXHJcbiAgICAgICAgICAgIE5vdGFibGVPYmplY3RzXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgU2hvd01vZGFsIChNb2RhbFR5cGUgbW9kYWxUeXBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUG9wdXBDb250YWluZXIuU3R5bGUuRGlzcGxheSA9IFwiXCI7XHJcbiAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IHRvU2hvdztcclxuICAgICAgICAgICAgc3dpdGNoIChtb2RhbFR5cGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgTW9kYWxUeXBlLlNldHRpbmdzOlxyXG4gICAgICAgICAgICAgICAgICAgIHRvU2hvdyA9IFNldHRpbmdzUG9wdXA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1vZGFsVHlwZS5Ob3RhYmxlT2JqZWN0czpcclxuICAgICAgICAgICAgICAgICAgICB0b1Nob3cgPSBOb3RhYmxlT2JqZWN0c1BvcHVwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnRFeGNlcHRpb24oKChpbnQpbW9kYWxUeXBlKS5Ub1N0cmluZygpLCBcIm1vZGFsVHlwZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3JlYWNoIChIVE1MRGl2RWxlbWVudCBkaXYgaW4gbmV3W10geyBTZXR0aW5nc1BvcHVwLCBOb3RhYmxlT2JqZWN0c1BvcHVwIH0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRpdi5TdHlsZS5EaXNwbGF5ID0gZGl2ID09IHRvU2hvdyA/IFwiXCIgOiBcIm5vbmVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEhpZGVNb2RhbCAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUG9wdXBDb250YWluZXIuU3R5bGUuRGlzcGxheSA9IERpc3BsYXkuTm9uZTtcclxuICAgICAgICAgICAgU2V0dGluZ3NQb3B1cC5TdHlsZS5EaXNwbGF5ID0gRGlzcGxheS5Ob25lO1xyXG4gICAgICAgICAgICBOb3RhYmxlT2JqZWN0c1BvcHVwLlN0eWxlLkRpc3BsYXkgPSBEaXNwbGF5Lk5vbmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IERyYXdTaGFwZSAoSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiBTcXVhcmVzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IHhNdWx0aXBsaWVyID0gQXBwLnhNdWx0aXBsaWVyICogMjtcclxuICAgICAgICAgICAgaW50IHlNdWx0aXBsaWVyID0gQXBwLnlNdWx0aXBsaWVyICogMjtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldHRpbmcgd2lkdGggYW5kIGhlaWdodCBvZiBzaGFwZVxyXG4gICAgICAgICAgICBpbnQgd2lkdGggPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk1heDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oU3F1YXJlcywoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixpbnQ+KShzID0+IHMuSXRlbTEpKSArIDE7XHJcbiAgICAgICAgICAgIGludCBoZWlnaHQgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk1heDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oU3F1YXJlcywoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixpbnQ+KShzID0+IHMuSXRlbTIpKSArIDE7XHJcbiAgICAgICAgICAgIC8vIERyYXdpbmcgb24gaW5uZXIgY2FudmFzXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGlubmVyQ2FudmFzID0gbmV3IEhUTUxDYW52YXNFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFdpZHRoID0gd2lkdGgsXHJcbiAgICAgICAgICAgICAgICBIZWlnaHQgPSBoZWlnaHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGNvbnRleHQgPSBpbm5lckNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgVWludDhDbGFtcGVkQXJyYXkgaW1hZ2VEYXRhQXJyYXkgPSBDcmVhdGVJbWFnZURhdGFBcnJheSh3aWR0aCwgaGVpZ2h0KTtcclxuZm9yZWFjaCAodmFyIF9kMSBpbiBTcXVhcmVzKVxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDEsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpbWFnZURhdGFBcnJheVsoeCArIHkgKiB3aWR0aCkgKiA0ICsgM10gPSAyNTU7XHJcbn1cbiAgICAgICAgICAgIEltYWdlRGF0YSBpbWFnZURhdGEgPSBuZXcgSW1hZ2VEYXRhKGltYWdlRGF0YUFycmF5LCAodWludCl3aWR0aCwgKHVpbnQpaGVpZ2h0KTtcclxuICAgICAgICAgICAgY29udGV4dC5QdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcclxuICAgICAgICAgICAgLy8gUmVzaXppbmcgdG8gdXBwZXIgY2FudmFzXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IG91dGVyQ2FudmFzID0gbmV3IEhUTUxDYW52YXNFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFdpZHRoID0gd2lkdGggKiB4TXVsdGlwbGllcixcclxuICAgICAgICAgICAgICAgIEhlaWdodCA9IGhlaWdodCAqIHlNdWx0aXBsaWVyXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBvdXRlckNvbnRleHQgPSBvdXRlckNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgb3V0ZXJDb250ZXh0LkltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBvdXRlckNvbnRleHQuRHJhd0ltYWdlKGlubmVyQ2FudmFzLCAwLCAwLCBvdXRlckNhbnZhcy5XaWR0aCwgb3V0ZXJDYW52YXMuSGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBvdXRlckNhbnZhcztcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgVWludDhDbGFtcGVkQXJyYXkgQ3JlYXRlSW1hZ2VEYXRhQXJyYXkoaW50IHdpZHRoLCBpbnQgaGVpZ2h0KVxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KHdpZHRoICogaGVpZ2h0ICogNCk7XHJcbn1wdWJsaWMgc3RhdGljIEhUTUxJbnB1dEVsZW1lbnQgQ3JlYXRlQ2hlY2tib3goKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxJbnB1dEVsZW1lbnR7VHlwZSA9IElucHV0VHlwZS5DaGVja2JveCwgU3R5bGUgPSB7V2lkdGggPSBcIjFyZW1cIiwgSGVpZ2h0ID0gXCIxZW1cIn19O1xyXG59cHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBDcmVhdGUwMVNlbGVjdG9yKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MU2VsZWN0RWxlbWVudCgpLkFkZDxIVE1MU2VsZWN0RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCJmYWxzZVwifSxcIjBcIiksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudHtWYWx1ZSA9IFwidHJ1ZVwifSxcIjFcIikpO1xyXG59cHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBDcmVhdGUwMTJTZWxlY3RvcigpXHJcbntcclxuICAgIHJldHVybiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxTZWxlY3RFbGVtZW50PihuZXcgSFRNTFNlbGVjdEVsZW1lbnQoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcIjBcIn0sXCIwXCIpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcIjFcIn0sXCIxXCIpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcIjJcIn0sXCIyXCIpKTtcclxufVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgYWRqYWNlbmN5UnVsZXNUYWJsZURpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCgpLCBydWxlc1RhYmxlRGl2ID0gbmV3IEhUTUxEaXZFbGVtZW50KCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBNYWluICgpXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uQWN0aW9uPE1vdXNlRXZlbnQ8SFRNTENhbnZhc0VsZW1lbnQ+PiBQcm9jZXNzTW91c2VFdmVudCA9IG51bGw7XG4gICAgICAgICAgICBvYmplY3QgcnVsZXNPYmplY3RTdHIgPSBHbG9iYWwuTG9jYWxTdG9yYWdlLkdldEl0ZW0oXCJydWxlc1wiKTtcclxuc3RyaW5nIHI7ICAgICAgICAgICAgaWYgKChyID0gcnVsZXNPYmplY3RTdHIgYXMgc3RyaW5nKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBkeW5hbWljIHJ1bGVzT2JqID0gSlNPTi5QYXJzZShyKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocnVsZXNPYmplY3RTdHIgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTY3JpcHQuV3JpdGUoXCJ7MH0gaW5zdGFuY2VvZiBBcnJheVwiLCBydWxlc09iai5saXZpbmdSdWxlcykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2xbXSBkZXNlcmlhbGl6ZWQgPSBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxib29sW10+KEpTT04uU3RyaW5naWZ5KHJ1bGVzT2JqLmxpdmluZ1J1bGVzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5Db3B5KGRlc2VyaWFsaXplZCwgbGl2aW5nUnVsZXMsIGRlc2VyaWFsaXplZC5MZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTY3JpcHQuV3JpdGUoXCJ7MH0gaW5zdGFuY2VvZiBBcnJheVwiLCBydWxlc09iai5kZWFkUnVsZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29sW10gZGVzZXJpYWxpemVkID0gSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8Ym9vbFtdPihKU09OLlN0cmluZ2lmeShydWxlc09iai5kZWFkUnVsZXMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LkNvcHkoZGVzZXJpYWxpemVkLCBkZWFkUnVsZXMsIGRlc2VyaWFsaXplZC5MZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTY3JpcHQuV3JpdGUoXCJ7MH0gaW5zdGFuY2VvZiBBcnJheVwiLCBydWxlc09iai5hZGphY2VuY3lSdWxlcykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFkamFjZW5jeVR5cGVbXSBkZXNlcmlhbGl6ZWQgPSBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxBZGphY2VuY3lUeXBlW10+KEpTT04uU3RyaW5naWZ5KHJ1bGVzT2JqLmFkamFjZW5jeVJ1bGVzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5Db3B5KGRlc2VyaWFsaXplZCwgYWRqYWNlbmN5UnVsZXMsIGRlc2VyaWFsaXplZC5MZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggeyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5TdHlsZVtcInVzZXItc2VsZWN0XCJdID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkhlYWQuQXBwZW5kQ2hpbGQobmV3IEhUTUxMaW5rRWxlbWVudCB7IFJlbCA9IFwic3R5bGVzaGVldFwiLCBIcmVmID0gXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2Jvb3RzdHJhcEA1LjIuMC9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzc1wiIH0pO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LlN0eWxlLk1hcmdpbiA9IFwiMHB4XCI7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQoUG9wdXBDb250YWluZXIpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKG5ldyBIVE1MU3R5bGVFbGVtZW50IHsgSW5uZXJIVE1MID0gXCJ0ZCwgdGggeyBib3JkZXI6IDFweCBzb2xpZCBibGFjazsgcGFkZGluZzogNXB4IH0gYnV0dG9uIHsgbWFyZ2luLXJpZ2h0OiA1cHggfVwiIH0pO1xyXG5cclxuICAgICAgICAgICAgSFRNTFRhYmxlRWxlbWVudCBhZGphY2VuY3lSdWxlc1RhYmxlID0gbmV3IEhUTUxUYWJsZUVsZW1lbnQgeyBTdHlsZSA9IHsgTWFyZ2luTGVmdCA9IFwiYXV0b1wiLCBNYXJnaW5SaWdodCA9IFwiYXV0b1wiIH0gfTtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKEdyaWQgaXMgVHJpYW5nbGVHcmlkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDwgMTI7IG4rKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyBuYW1lID0gbiA8IDYgPyBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuVG9DYW1lbFN0cmluZzxUcmlhbmdsZUxvY2F0aW9uPigoKFRyaWFuZ2xlTG9jYXRpb24pbikpIDogc3RyaW5nLkZvcm1hdChcIlBvc2l0aW9uIHswfVwiLG4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlc0NlbGxzLkFkZChDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFNlbGVjdEVsZW1lbnQ+KENyZWF0ZTAxMlNlbGVjdG9yKCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudD4obmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVSb3dFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KG5ldyBIVE1MVGFibGVSb3dFbGVtZW50KCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSxuYW1lKSksYWRqYWNlbmN5UnVsZXNUYWJsZSkpKS5TZXRBZGphY2VuY3lWYWx1ZShhZGphY2VuY3lSdWxlc1tuXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnQgbiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgeSA9IDA7IHkgPCAzOyB5KyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBIVE1MVGFibGVSb3dFbGVtZW50IHJvdyA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVSb3dFbGVtZW50PihuZXcgSFRNTFRhYmxlUm93RWxlbWVudCgpLGFkamFjZW5jeVJ1bGVzVGFibGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGludCB4ID0gMDsgeCA8IDM7IHgrKylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHggPT0gMSAmJiB5ID09IDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LkFwcGVuZENoaWxkKG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlc0NlbGxzLkFkZChDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFNlbGVjdEVsZW1lbnQ+KENyZWF0ZTAxMlNlbGVjdG9yKCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudD4obmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpLHJvdykpLlNldEFkamFjZW5jeVZhbHVlKGFkamFjZW5jeVJ1bGVzW25dKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXNUYWJsZURpdi5DbGVhcigpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBhZGphY2VuY3lSdWxlc1RhYmxlRGl2LGFkamFjZW5jeVJ1bGVzVGFibGUpO1xyXG5cclxuICAgICAgICAgICAgSFRNTFRhYmxlRWxlbWVudCBydWxlc1RhYmxlID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVFbGVtZW50PihcclxubmV3IEhUTUxUYWJsZUVsZW1lbnQgeyBTdHlsZSA9IHsgTWFyZ2luTGVmdCA9IFwiYXV0b1wiLCBNYXJnaW5SaWdodCA9IFwiYXV0b1wiIH0gfSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KFxyXG4gICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZVJvd0VsZW1lbnQoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudCgpLFwiI1wiKSxcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQoKSxcIkxcIiksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50KCksXCJEXCIpXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBydWxlc1RhYmxlRGl2LkNsZWFyKCk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIHJ1bGVzVGFibGVEaXYscnVsZXNUYWJsZSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8PSBjdXJyZW50TWF4QWRqYWNlbnRDZWxsczsgbisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIVE1MVGFibGVSb3dFbGVtZW50IHJvdyA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVSb3dFbGVtZW50PihuZXcgSFRNTFRhYmxlUm93RWxlbWVudCgpLHJ1bGVzVGFibGUpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KCAgICAgICAgICAgICAgICByb3csQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSxuLlRvU3RyaW5nKCkpKTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbkNlbGxzLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8SFRNTElucHV0RWxlbWVudCwgSFRNTElucHV0RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxJbnB1dEVsZW1lbnQ+KENyZWF0ZUNoZWNrYm94KCksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSwgcm93KSkuU2V0Qm9vbFZhbHVlKGxpdmluZ1J1bGVzW25dKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxJbnB1dEVsZW1lbnQ+KENyZWF0ZUNoZWNrYm94KCksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSwgcm93KSkuU2V0Qm9vbFZhbHVlKGRlYWRSdWxlc1tuXSkpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcgLGJvb2xbXSAsYm9vbFtdID4+IHByZXNldHNMaXN0ID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nICxib29sW10gLGJvb2xbXSA+PigpLChfbzEpPT57X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJDb253YXkncyBHYW1lIG9mIExpZmUgUHJlc2V0XCIsIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO19vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZywgYm9vbFtdLCBib29sW10+KFwiSW1tb3J0YWwgQ2VsbHMgUHJlc2V0XCIsIG5ldyBib29sWzlde3RydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWV9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9KSk7X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJBbG1vc3QgSW1tb3J0YWwgQ2VsbHMgUHJlc2V0XCIsIG5ldyBib29sWzlde3RydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIGZhbHNlfSwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO19vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZywgYm9vbFtdLCBib29sW10+KFwiQWx0ZXJuYXRlIENvbndheSdzIEdhbWUgb2YgTGlmZSBQcmVzZXRcIiwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0pKTtyZXR1cm4gX28xO30pO1xyXG5cclxuICAgICAgICAgICAgSFRNTERpdkVsZW1lbnQgcHJlc2V0c0RpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCB7IFN0eWxlID0geyBUZXh0QWxpZ24gPSBUZXh0QWxpZ24uQ2VudGVyIH0gfTtcclxuZm9yZWFjaCAodmFyIF9kMiBpbiBwcmVzZXRzTGlzdClcclxue1xyXG4gICAgc3RyaW5nIG5hbWU7XHJcbiAgICBib29sW10gbGl2aW5nUnVsZXM7XHJcbiAgICBib29sW10gZGVhZFJ1bGVzO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDIsIG91dCBuYW1lLCBvdXQgbGl2aW5nUnVsZXMsIG91dCBkZWFkUnVsZXMpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgcHJlc2V0c0RpdixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnQoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxBbmNob3JFbGVtZW50PihuZXcgSFRNTEFuY2hvckVsZW1lbnR7SHJlZiA9IFwiamF2YXNjcmlwdDp2b2lkKDApXCIsIFN0eWxlID0ge0ZvbnRTaXplID0gXCIxcmVtXCJ9LCBPbkNsaWNrID0gZSA9PiBBcHBseVByZXNldChsaXZpbmdSdWxlczogbGl2aW5nUnVsZXMsIGRlYWRSdWxlczogZGVhZFJ1bGVzKX0sbmFtZSkpKTtcclxufVxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oXHJcblxyXG4gICAgICAgICAgICBTZXR0aW5nc1BvcHVwLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERldGFpbHNFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MRGV0YWlsc0VsZW1lbnQgeyBPcGVuID0gdHJ1ZX0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MU3VtbWFyeUVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxTdW1tYXJ5RWxlbWVudCgpLFwiQWRqYWNlbmN5IFJ1bGVzXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzVGFibGVEaXZcclxuICAgICAgICAgICAgICAgICksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERldGFpbHNFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MRGV0YWlsc0VsZW1lbnQgeyBPcGVuID0gdHJ1ZSB9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFN1bW1hcnlFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MU3VtbWFyeUVsZW1lbnQoKSxcIlJ1bGVzXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzVGFibGVEaXZcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxuZXcgSFRNTEJSRWxlbWVudCgpLCBwcmVzZXRzRGl2LCBuZXcgSFRNTEJSRWxlbWVudCgpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIixcclxuICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPCBtYXhBZGphY2VudENlbGxzOyBuKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlc1tuXSA9IGFkamFjZW5jeVJ1bGVzQ2VsbHNbbl0uQWRqYWNlbmN5VmFsdWUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPD0gbWF4QWRqYWNlbnRDZWxsczsgbisrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGl2aW5nUnVsZXNbbl0gPSBvcHRpb25DZWxsc1tuXS5JdGVtMS5Cb29sVmFsdWUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVhZFJ1bGVzW25dID0gb3B0aW9uQ2VsbHNbbl0uSXRlbTIuQm9vbFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbC5Mb2NhbFN0b3JhZ2UuU2V0SXRlbShcInJ1bGVzXCIsIEpzb25Db252ZXJ0LlNlcmlhbGl6ZU9iamVjdChuZXdcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpdmluZ1J1bGVzID0gbGl2aW5nUnVsZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYWRSdWxlcyA9IGRlYWRSdWxlcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXMgPSBhZGphY2VuY3lSdWxlc1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICBIaWRlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcIlNhdmUgQ2hhbmdlc1wiKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KFxyXG4gICAgICAgICAgICBOb3RhYmxlT2JqZWN0c1BvcHVwLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tbGlnaHRcIixcclxuICAgICAgICAgICAgICAgIFN0eWxlID0geyBDc3NGbG9hdCA9IEZsb2F0LlJpZ2h0IH0sXHJcbiAgICAgICAgICAgICAgICBPbkNsaWNrID0gZSA9PiBIaWRlTW9kYWwoKVxyXG4gICAgICAgICAgICB9LFwi4p2MXCIpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgTm90YWJsZU9iamVjdHNQb3B1cCxuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU3R5bGUgPSB7IENsZWFyID0gQ2xlYXIuQm90aCB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5mb3JlYWNoICh2YXIgX2QzIGluIE5vdGFibGVPYmplY3RzTGlzdC5Ob3RhYmxlT2JqZWN0cylcclxue1xyXG4gICAgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+IG9iamVjdERldGFpbHM7XHJcbiAgICBzdHJpbmcgZGVzY3JpcHRpb247XHJcbiAgICBzdHJpbmcgcnVsZXM7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KF9kMywgb3V0IG9iamVjdERldGFpbHMsIG91dCBkZXNjcmlwdGlvbiwgb3V0IHJ1bGVzKTtcclxuICAgIEhUTUxEaXZFbGVtZW50IG9iamVjdEluZm8gPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudHtTdHlsZSA9IHtXaWR0aCA9IFwiMzByZW1cIn19LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50e1N0eWxlID0ge0Rpc3BsYXkgPSBEaXNwbGF5LkZsZXgsIEFsaWduSXRlbXMgPSBBbGlnbkl0ZW1zLkNlbnRlciwgRmxleERpcmVjdGlvbiA9IEZsZXhEaXJlY3Rpb24uQ29sdW1ufX0sTm90YWJsZU9iamVjdHNQb3B1cCkpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgb2JqZWN0SW5mbyxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnR7U3R5bGUgPSB7RGlzcGxheSA9IERpc3BsYXkuRmxleCwgQWxpZ25JdGVtcyA9IEFsaWduSXRlbXMuQ2VudGVyLCBGbGV4RGlyZWN0aW9uID0gRmxleERpcmVjdGlvbi5Db2x1bW59fSxEcmF3U2hhcGUob2JqZWN0RGV0YWlscykpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50KCksZGVzY3JpcHRpb24pKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8scnVsZXMpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgb2JqZWN0SW5mbyxuZXcgSFRNTEJSRWxlbWVudCgpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sbmV3IEhUTUxCUkVsZW1lbnQoKSk7XHJcbn1cblxyXG4gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCBiYWNrZ3JvdW5kRGl2ID0gbmV3IEhUTUxEaXZFbGVtZW50IHsgU3R5bGUgPSB7IFBvc2l0aW9uID0gUG9zaXRpb24uUmVsYXRpdmUsIE1pbldpZHRoID0gXCIwXCIsIE1pbkhlaWdodCA9IFwiMFwiIH19O1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuT3ZlcmZsb3cgPSBPdmVyZmxvdy5IaWRkZW47XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5aSW5kZXggPSBcIi0xXCI7XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5Qb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLkxlZnQgPSBcIjBweFwiO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuVG9wID0gXCIwcHhcIjtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgYmFja2dyb3VuZERpdixET01DYW52YXMpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBiYWNrZ3JvdW5kRGl2LEhvdGJhcik7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIGJhY2tncm91bmREaXYsUmlnaHRIb3RiYXIpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKGJhY2tncm91bmREaXYpO1xyXG5cclxuICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBkcmFnZ2luZ1BvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gb3JpZ2luYWxQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICBib29sIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgRE9NQ2FudmFzLk9uTW91c2VEb3duID0gZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IHRydWU7XHJcbmludCB4O1xuaW50IHk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGUuTW91c2VQb3MoKSwgb3V0IHgsIG91dCB5KTtcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4IC0gb2Zmc2V0UG9zLkl0ZW0xLCB5IC0gb2Zmc2V0UG9zLkl0ZW0yKTtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsUG9zID0gb2Zmc2V0UG9zO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBET01DYW52YXMuT25Nb3VzZVVwID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0xLSBvcmlnaW5hbFBvcy5JdGVtMSkgPiB4TXVsdGlwbGllciB8fCBNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTItIG9yaWdpbmFsUG9zLkl0ZW0yKSA+IHlNdWx0aXBsaWVyKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZ1BvcyA9IG9mZnNldFBvcztcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLk9uTW91c2VNb3ZlID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGUuQnV0dG9ucyAmIDEpID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGlmIChkcmFnZ2luZ1BvcyA9PSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApKSBkcmFnZ2luZ1BvcyA9IGUuTW91c2VQb3MoKTtcclxuICAgICAgICAgICAgICAgIHZhciBtb3VzZVBvcyA9IGUuTW91c2VQb3MoKTtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTEtIG9yaWdpbmFsUG9zLkl0ZW0xKSA+IHhNdWx0aXBsaWVyIHx8IE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMS0gb3JpZ2luYWxQb3MuSXRlbTEpID4geU11bHRpcGxpZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIG9mZnNldFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4obW91c2VQb3MuSXRlbTEgLSBkcmFnZ2luZ1Bvcy5JdGVtMSwgbW91c2VQb3MuSXRlbTIgLSBkcmFnZ2luZ1Bvcy5JdGVtMik7XHJcbiAgICAgICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgICAgIH07XHJcblByb2Nlc3NNb3VzZUV2ZW50ID0gKGUpID0+XHJcbntcclxuICAgIC8vaWYgKChAZXZlbnQuQnV0dG9ucyAmIDEpID09IDApIHJldHVybjtcclxuICAgIHZhciBtb3VzZVBvcyA9IGUuTW91c2VQb3MoKTtcclxuICAgIEdyaWQuSGFuZGxlQ2xpY2sobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pihtb3VzZVBvcy5JdGVtMSAtIG9mZnNldFBvcy5JdGVtMSwgbW91c2VQb3MuSXRlbTIgLSBvZmZzZXRQb3MuSXRlbTIpLCBTcXVhcmVUeXBlUGxhY2luZyk7XHJcbiAgICBEcmF3KCk7XHJcbn1cclxuXHJcbjtcbiAgICAgICAgICAgIERPTUNhbnZhcy5PbkNsaWNrID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdpbmdJbnRlbnQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUHJvY2Vzc01vdXNlRXZlbnQoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIEdsb2JhbC5TZXRJbnRlcnZhbCgoQWN0aW9uKU5leHRGcmFtZSwgMTAwKTtcclxuXHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCB1cGRhdGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgSGFzRGl2aWRlcnMgKHRoaXMgRGljdGlvbmFyeTxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+LCBEaXZpZGVyc0luZm8+IGRpdmlkZXJzLCBpbnQgeCwgaW50IHksIGludCBMKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgRGl2aWRlcnNJbmZvIHRvQ2hlY2s7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoTClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgIHgtLTtcclxuICAgICAgICAgICAgICAgICAgICB5LS07XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b21SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICB5LS07XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b207XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgeS0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgeC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgICAgICAgICAgICB4LS07XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b21SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNzpcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLkJvdHRvbTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgODpcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbkRpdmlkZXJzSW5mbyBkaXZpZGVyc0luZm87XG4gICAgICAgICAgICByZXR1cm4gZGl2aWRlcnMuVHJ5R2V0VmFsdWUobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4LCB5KSwgb3V0IGRpdmlkZXJzSW5mbykgJiYgKGRpdmlkZXJzSW5mbyAmIHRvQ2hlY2spICE9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsR3JpZFR5cGUgLEhUTUxDYW52YXNFbGVtZW50ID4gTGFzdEJvdHRvbUNhbnZhcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIEdyaWRUeXBlLCBIVE1MQ2FudmFzRWxlbWVudD4oMCwgR3JpZFR5cGUuQ291bnQsIG51bGwpO1xyXG5wdWJsaWMgc3RhdGljIGJ5dGUgR2V0U3F1YXJlVHlwZUFscGhhKFNxdWFyZVR5cGUgc3F1YXJlVHlwZSlcclxue1xyXG4gICAgcmV0dXJuIChieXRlKShzcXVhcmVUeXBlID09IFNxdWFyZVR5cGUuQ2VsbCA/IDI1NSA6IHNxdWFyZVR5cGUgPT0gU3F1YXJlVHlwZS5CcmljayA/IDE3MCA6IHNxdWFyZVR5cGUgPT0gU3F1YXJlVHlwZS5JbW1vcnRhbENlbGwgPyA4NSA6ICgoU3lzdGVtLkZ1bmM8aW50PikoKCkgPT5cclxuICAgIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVW5rbm93biBzcXVhcmUgdHlwZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICApKSgpKTtcclxufVxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIERyYXcoKVxyXG4gICAgICAgIHtcclxuU3lzdGVtLkFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUsIGRvdWJsZT4/ID4gRHJhd01hcmtlciA9IG51bGw7XG5TeXN0ZW0uQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGRvdWJsZSwgZG91YmxlPj8gLCBTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUsIGRvdWJsZT4/ID4gRHJhd0xpbmUgPSBudWxsO1xuU3lzdGVtLkZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+LCBTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUsIGRvdWJsZT4/ID4gR2V0RmluYWxEcmF3UG9zID0gbnVsbDtcblN5c3RlbS5GdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiwgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PyA+IEdldERPTURyYXdQb3MgPSBudWxsO1xuU3lzdGVtLkZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+LCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4/ID4gR2V0RHJhd1BvcyA9IG51bGw7XG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBUb3BDYW52YXMgPSBDcmVhdGVUb3BDYW52YXMoKTtcclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgQm90dG9tQ2FudmFzID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKExhc3RCb3R0b21DYW52YXMuSXRlbTE9PSB4TXVsdGlwbGllciAmJiBMYXN0Qm90dG9tQ2FudmFzLkl0ZW0yPT0gQ3VycmVudEdyaWRUeXBlKVxyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzID0gTGFzdEJvdHRvbUNhbnZhcy5JdGVtMztcclxuICAgICAgICAgICAgaWYgKEJvdHRvbUNhbnZhcyA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXMgPSBDcmVhdGVCb3R0b21DYW52YXMoKTtcclxuICAgICAgICAgICAgICAgIExhc3RCb3R0b21DYW52YXMgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBHcmlkVHlwZSwgSFRNTENhbnZhc0VsZW1lbnQ+KHhNdWx0aXBsaWVyLCBDdXJyZW50R3JpZFR5cGUsIEJvdHRvbUNhbnZhcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIFRvcENhbnZhc0NvbnRleHQgPSBUb3BDYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuQ2xlYXJSZWN0KDAsIDAsIERPTUNhbnZhcy5XaWR0aCwgRE9NQ2FudmFzLkhlaWdodCk7XHJcbmludCBvZmZzZXRYO1xuaW50IG9mZnNldFk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KG9mZnNldFBvcywgb3V0IG9mZnNldFgsIG91dCBvZmZzZXRZKTtcclxuR2V0RHJhd1BvcyA9IChwb3MpID0+XHJcbntcclxuICAgIGludCB4O1xyXG4gICAgaW50IHk7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KHBvcywgb3V0IHgsIG91dCB5KTtcclxuICAgIGludCBkcmF3WCA9IHggKyAob2Zmc2V0WCAvIHhNdWx0aXBsaWVyKSArIDEsIGRyYXdZID0geSArIChvZmZzZXRZIC8geU11bHRpcGxpZXIpICsgMTtcclxuICAgIGlmIChkcmF3WCA8IDAgfHwgZHJhd1ggPj0gd2lkdGggKyAyIHx8IGRyYXdZIDwgMCB8fCBkcmF3WSA+PSBoZWlnaHQgKyAyKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oZHJhd1gsIGRyYXdZKTtcclxufVxyXG5cclxuO1xuR2V0RE9NRHJhd1BvcyA9IChwb3MpID0+XHJcbntcclxuICAgIGludCB4O1xyXG4gICAgaW50IHk7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KHBvcywgb3V0IHgsIG91dCB5KTtcclxuICAgIGludCBkcmF3WCA9IHggKyBvZmZzZXRYLCBkcmF3WSA9IHkgKyBvZmZzZXRZO1xyXG4gICAgaWYgKGRyYXdYIDwgMCB8fCBkcmF3WCA+PSBzY3JlZW5XaWR0aCB8fCBkcmF3WSA8IDAgfHwgZHJhd1kgPj0gc2NyZWVuSGVpZ2h0KVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oZHJhd1gsIGRyYXdZKTtcclxufVxyXG5cclxuO1xuU3F1YXJlR3JpZCBzcXVhcmVHcmlkOyAgICAgICAgICAgIGlmICgoc3F1YXJlR3JpZCA9IEdyaWQgYXMgU3F1YXJlR3JpZCkgIT0gbnVsbClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdFVpbnQ4Q2xhbXBlZEFycmF5IGltYWdlRGF0YUFycmF5ID0gQ3JlYXRlSW1hZ2VEYXRhQXJyYXkod2lkdGggKyAyLCBoZWlnaHQgKyAyKTtcclxuZm9yZWFjaCAodmFyIF9kNCBpbiBzcXVhcmVHcmlkLlNxdWFyZXMpXHJcbntcclxuICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiBwb3M7XHJcbiAgICBTcXVhcmVUeXBlIHNxdWFyZVR5cGU7XHJcbiAgICBfZDQuRGVjb25zdHJ1Y3Qob3V0IHBvcywgb3V0IHNxdWFyZVR5cGUpO1xyXG4gICAgdmFyIGRyYXdQb3MgPSBHZXREcmF3UG9zKHBvcyk7XHJcbiAgICBpZiAoZHJhd1BvcyA9PSBudWxsKVxyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgaW50IGRyYXdYO1xyXG4gICAgaW50IGRyYXdZO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChkcmF3UG9zLlZhbHVlLCBvdXQgZHJhd1gsIG91dCBkcmF3WSk7XHJcbiAgICBpbnQgaWR4ID0gZHJhd1ggKyBkcmF3WSAqICh3aWR0aCArIDIpO1xyXG4gICAgaW1hZ2VEYXRhQXJyYXlbaWR4ICogNCArIDNdID0gR2V0U3F1YXJlVHlwZUFscGhhKHNxdWFyZVR5cGUpO1xyXG59XG5cdFx0XHRcdEltYWdlRGF0YSBpbWFnZURhdGEgPSBuZXcgSW1hZ2VEYXRhKGltYWdlRGF0YUFycmF5LCAodWludCkod2lkdGggKyAyKSwgKHVpbnQpKGhlaWdodCArIDIpKTtcclxuXHRcdFx0XHRUb3BDYW52YXNDb250ZXh0LlB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xyXG4gICAgICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5EcmF3SW1hZ2UoQm90dG9tQ2FudmFzLCAob2Zmc2V0WCAlIHhNdWx0aXBsaWVyKSAtIHhNdWx0aXBsaWVyLCAob2Zmc2V0WSAlIHlNdWx0aXBsaWVyKSAtIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgfVxyXG5cdFx0XHRlbHNlIHtcclxuICAgIEhleEdyaWQgaDtcclxuICAgIGlmICgoaCA9IEdyaWQgYXMgSGV4R3JpZCkgIT0gbnVsbClcclxuICAgIHtcclxuICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdJbWFnZShCb3R0b21DYW52YXMsIChvZmZzZXRYICUgKEhleEdyaWQuY29zNjAgKiAyICogeE11bHRpcGxpZXIpKSAtIEhleEdyaWQuY29zNjAgKiAyICogeE11bHRpcGxpZXIsIChvZmZzZXRZICUgKEhleEdyaWQuc2luNjAgKiAyICogeU11bHRpcGxpZXIpKSAtIEhleEdyaWQuc2luNjAgKiAyICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgIEdyaWQuRHJhd1NxdWFyZXMoKEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4sIFNxdWFyZVR5cGU+KSgoU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+IGQsIFNxdWFyZVR5cGUgc3F1YXJlVHlwZSkgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj8gZHJhd1BvcyA9IEdldERPTURyYXdQb3MoZCk7XHJcbiAgICAgICAgICAgIGlmICghZHJhd1Bvcy5IYXNWYWx1ZSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5GaWxsU3R5bGUgPSBzdHJpbmcuRm9ybWF0KFwicmdiYSgwLCAwLCAwLCB7MH0pXCIsIEdldFNxdWFyZVR5cGVBbHBoYShzcXVhcmVUeXBlKSAvIDI1NS4wKTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5EcmF3SGV4YWdvbigoaW50KWRyYXdQb3MuVmFsdWUuSXRlbTEsIChpbnQpZHJhd1Bvcy5WYWx1ZS5JdGVtMiwgeE11bHRpcGxpZXIgKiAyIC8gMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICApKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgICBUcmlhbmdsZUdyaWQgdHJpYW5nbGVHcmlkO1xyXG4gICAgICAgIGlmICgodHJpYW5nbGVHcmlkID0gR3JpZCBhcyBUcmlhbmdsZUdyaWQpICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdJbWFnZShCb3R0b21DYW52YXMsIChvZmZzZXRYICUgKEhleEdyaWQuY29zNjAgKiAyICogeE11bHRpcGxpZXIpKSAtIEhleEdyaWQuY29zNjAgKiAyICogeE11bHRpcGxpZXIsIChvZmZzZXRZICUgKEhleEdyaWQuc2luNjAgKiAyICogeU11bHRpcGxpZXIpKSAtIEhleEdyaWQuc2luNjAgKiAyICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICB0cmlhbmdsZUdyaWQuRHJhd1NxdWFyZXMoKEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4sIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBUcmlhbmdsZUxvY2F0aW9uPiwgU3F1YXJlVHlwZT4pKChTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4gZCwgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+IGNvb3JkcywgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4/IGRyYXdQb3MgPSBHZXRET01EcmF3UG9zKGQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkcmF3UG9zLkhhc1ZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRmlsbFN0eWxlID0gc3RyaW5nLkZvcm1hdChcInJnYmEoMCwgMCwgMCwgezB9KVwiLCBHZXRTcXVhcmVUeXBlQWxwaGEoc3F1YXJlVHlwZSkgLyAyNTUuMCk7XHJcbiAgICAgICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdUcmlhbmdsZShkcmF3UG9zLlZhbHVlLkl0ZW0xLCBkcmF3UG9zLlZhbHVlLkl0ZW0yLCB4TXVsdGlwbGllciAvIDIsIGNvb3Jkcy5JdGVtMyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0ltYWdlKFRvcENhbnZhcywgKG9mZnNldFggJSB4TXVsdGlwbGllcikgLSB4TXVsdGlwbGllciwgKG9mZnNldFkgJSB5TXVsdGlwbGllcikgLSB5TXVsdGlwbGllciwgKHdpZHRoICsgMikgKiB4TXVsdGlwbGllciwgKGhlaWdodCArIDIpICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbkdldEZpbmFsRHJhd1BvcyA9IChwb3MpID0+XHJcbntcclxuICAgIHZhciBwID0gR2V0RHJhd1Bvcyhwb3MpO1xyXG4gICAgaWYgKHAgPT0gbnVsbClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIGRvdWJsZSBkcmF3WDtcclxuICAgIGRvdWJsZSBkcmF3WTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihwLlZhbHVlLkl0ZW0xLCBwLlZhbHVlLkl0ZW0yKSwgb3V0IGRyYXdYLCBvdXQgZHJhd1kpO1xyXG4gICAgZHJhd1ggKj0gKHdpZHRoICsgMikgKiB4TXVsdGlwbGllciAvIFRvcENhbnZhcy5XaWR0aDtcclxuICAgIGRyYXdZICo9IChoZWlnaHQgKyAyKSAqIHlNdWx0aXBsaWVyIC8gVG9wQ2FudmFzLkhlaWdodDtcclxuICAgIGRyYXdYICs9IChvZmZzZXRYICUgeE11bHRpcGxpZXIpIC0geE11bHRpcGxpZXI7XHJcbiAgICBkcmF3WSArPSAob2Zmc2V0WSAlIHlNdWx0aXBsaWVyKSAtIHlNdWx0aXBsaWVyO1xyXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUsIGRvdWJsZT4oZHJhd1gsIGRyYXdZKTtcclxufVxyXG5cclxuO1xuICAgICAgICAgICAgXHJcbkRyYXdMaW5lID0gKHN0YXJ0LCBlbmQpID0+XHJcbntcclxuICAgIGlmICghc3RhcnQuSGFzVmFsdWUgfHwgIWVuZC5IYXNWYWx1ZSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICB2YXIgc3RhcnRQb3MgPSBzdGFydC5WYWx1ZTtcclxuICAgIHZhciBlbmRQb3MgPSBlbmQuVmFsdWU7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkJlZ2luUGF0aCgpO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5Nb3ZlVG8oc3RhcnRQb3MuSXRlbTEsIHN0YXJ0UG9zLkl0ZW0yKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuTGluZVRvKGVuZFBvcy5JdGVtMSwgZW5kUG9zLkl0ZW0yKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuTGluZVdpZHRoID0gMjtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuU3Ryb2tlU3R5bGUgPSBcInJlZFwiOyAvLyBcInJnYigxNzAsIDE3MCwgMTcwKVwiO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5TdHJva2UoKTtcclxufVxyXG5cclxuO1xuICAgICAgICAgICAgXHJcbkRyYXdNYXJrZXIgPSAocG9zaXRpb24pID0+XHJcbntcclxuICAgIGlmICghcG9zaXRpb24uSGFzVmFsdWUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgZG91YmxlIGRyYXdYO1xyXG4gICAgZG91YmxlIGRyYXdZO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChwb3NpdGlvbi5WYWx1ZSwgb3V0IGRyYXdYLCBvdXQgZHJhd1kpO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5CZWdpblBhdGgoKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuQXJjKGRyYXdYLCBkcmF3WSwgeE11bHRpcGxpZXIgLyA4LCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkZpbGxTdHlsZSA9IFwicmVkXCI7IC8vXCJyZ2IoMTcwLCAxNzAsIDE3MClcIjtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuRmlsbCgpO1xyXG59XHJcblxyXG47XG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9mb3JlYWNoICgoKGludCB4LCBpbnQgeSkgcG9zLCBEaXZpZGVyc0luZm8gZGl2aWRlcnMpIGluIERpdmlkZXJzKVxyXG4gICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgLy8gICAgZm9yZWFjaCAodmFyIGRpdmlkZXIgaW4gbmV3W10geyBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQsIERpdmlkZXJzSW5mby5SaWdodCwgRGl2aWRlcnNJbmZvLkJvdHRvbSB9KVxyXG4gICAgICAgICAgICAvLyAgICB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICBpZiAoIWRpdmlkZXJzLkhhc0ZsYWcoZGl2aWRlcikpXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIC8vICAgICAgICBzd2l0Y2ggKGRpdmlkZXIpXHJcbiAgICAgICAgICAgIC8vICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgY2FzZSBEaXZpZGVyc0luZm8uUmlnaHQ6XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIChpbnQgeCwgaW50IHkpIHN0YXJ0UG9zID0gKChpbnQpKHBvcy54ICsgMSksIChpbnQpcG9zLnkpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAoaW50IHgsIGludCB5KSBlbmRQb3MgPSAoKGludCkocG9zLnggKyAxKSwgKGludCkocG9zLnkgKyAxKSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIERyYXdMaW5lKEdldEZpbmFsRHJhd1BvcyhzdGFydFBvcyksIEdldEZpbmFsRHJhd1BvcyhlbmRQb3MpKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgY2FzZSBEaXZpZGVyc0luZm8uQm90dG9tOlxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBEcmF3TGluZShHZXRGaW5hbERyYXdQb3MoKChpbnQpKHBvcy54KSwgKGludCkocG9zLnkgKyAxKSkpLCBHZXRGaW5hbERyYXdQb3MoKChpbnQpKHBvcy54ICsgMSksIChpbnQpKHBvcy55ICsgMSkpKSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgIGNhc2UgRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0OlxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBEcmF3TWFya2VyKEdldEZpbmFsRHJhd1BvcygoKGludCkocG9zLnggKyAxKSwgKGludCkocG9zLnkgKyAxKSkpKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgLy8gICAgICAgIH1cclxuICAgICAgICAgICAgLy8gICAgfVxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IGZyYW1lTnVtID0gMDtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE5leHRGcmFtZSAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCFwbGF5aW5nKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBib29sIHNraXBGcmFtZXMgPSBHcmlkLlNxdWFyZUNvdW50ID49IDI1MDtcclxuICAgICAgICAgICAgaW50IHVwZGF0ZXNQZXJEcmF3ID0gMTsvLyBza2lwRnJhbWVzID8gMiA6IDE7XHJcbiAgICAgICAgICAgIGZyYW1lTnVtKys7XHJcbiAgICAgICAgICAgIGlmIChza2lwRnJhbWVzICYmIChmcmFtZU51bSAlIHVwZGF0ZXNQZXJEcmF3KSAhPSAwKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8IHVwZGF0ZXNQZXJEcmF3OyBuKyspXHJcbiAgICAgICAgICAgICAgICBHcmlkLlVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgRHJhd0hleGFnb24gKHRoaXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGNvbnRleHQsIGludCB4LCBpbnQgeSwgaW50IHJhZGl1cywgYm9vbCBzdHJva2UgPSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuQmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuTW92ZVRvKHggKyByYWRpdXMsIHkpO1xyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMTsgbiA8PSA2OyBuKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRvdWJsZSBhbmdsZSA9IG4gKiBNYXRoLlBJIC8gMztcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuTGluZVRvKHggKyByYWRpdXMgKiBNYXRoLkNvcyhhbmdsZSksIHkgKyByYWRpdXMgKiBNYXRoLlNpbihhbmdsZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzdHJva2UpXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LlN0cm9rZSgpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LkZpbGwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBEcmF3VHJpYW5nbGUodGhpcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgY29udGV4dCwgaW50IGhleFgsIGludCBoZXhZLCBpbnQgaGV4UmFkaXVzLCBUcmlhbmdsZUxvY2F0aW9uIGxvYywgYm9vbCBzdHJva2UgPSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnRleHQuQmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuTW92ZVRvKGhleFgsIGhleFkpO1xyXG4gICAgICAgICAgICBpbnQgYW5nbGVJbnQgPSAwO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGxvYylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYW5nbGVJbnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLlRvcDpcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZUludCA9IDYwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLlRvcFJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlSW50ID0gMTIwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbVJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlSW50ID0gMTgwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbTpcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZUludCA9IDI0MDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21MZWZ0OlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlSW50ID0gMzAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRvdWJsZSBhbmdsZSA9IGFuZ2xlSW50ICogTWF0aC5QSSAvIDE4MDtcclxuICAgICAgICAgICAgY29udGV4dC5MaW5lVG8oaGV4WCArIGhleFJhZGl1cyAqIE1hdGguQ29zKGFuZ2xlKSwgaGV4WSArIGhleFJhZGl1cyAqIE1hdGguU2luKGFuZ2xlKSk7XHJcbiAgICAgICAgICAgIGFuZ2xlICs9IE1hdGguUEkgLyAzO1xyXG4gICAgICAgICAgICBjb250ZXh0LkxpbmVUbyhoZXhYICsgaGV4UmFkaXVzICogTWF0aC5Db3MoYW5nbGUpLCBoZXhZICsgaGV4UmFkaXVzICogTWF0aC5TaW4oYW5nbGUpKTtcclxuICAgICAgICAgICAgaWYgKHN0cm9rZSlcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuU3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuRmlsbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGV4dC5SZWd1bGFyRXhwcmVzc2lvbnM7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIEV4dGVuc2lvbnNcclxuICAgIHtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoKGUsIGMpID0+IGMuYXBwZW5kQ2hpbGQoZSkpKHtlbGVtZW50fSwge2NvbnRhaW5pbmdFbGVtfSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBBZGRUbzxUPih0aGlzIFQgZWxlbWVudCwgTm9kZSBjb250YWluaW5nRWxlbSkgd2hlcmUgVCA6IE5vZGU7XHJcbiAgICAgICAgLy9wdWJsaWMgc3RhdGljIFQgQWRkVG9Cb2R5PFQ+KHRoaXMgVCBuKSB3aGVyZSBUIDogTm9kZSA9PiBBcHAucm9vdC5BcHBlbmRDaGlsZDxUPihuKTtcclxuICAgICAgICBbVGVtcGxhdGUoXCJ7bm9kZX0uYXBwZW5kQ2hpbGQoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIEFwcGVuZENoaWxkPFQ+KHRoaXMgTm9kZSBub2RlLCBUIGVsZW1lbnQpIHdoZXJlIFQgOiBOb2RlO1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihlID0+IChlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZScsIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgSGlkZTxUPih0aGlzIFQgZWxlbWVudCkgd2hlcmUgVCA6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihlID0+IChlLnN0eWxlLmRpc3BsYXkgPSAnJywgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBTaG93PFQ+KHRoaXMgVCBlbGVtZW50KSB3aGVyZSBUIDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGxpID0+IChsaS5hcHBlbmRDaGlsZCh7ZWxlbWVudH0pLCBsaSkpKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIEhUTUxMSUVsZW1lbnQgV3JhcExpKHRoaXMgTm9kZSBlbGVtZW50KTtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZGl2ID0+IChkaXYuYXBwZW5kQ2hpbGQoe2VsZW1lbnR9KSwgZGl2KSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIEhUTUxEaXZFbGVtZW50IFdyYXBEaXYodGhpcyBOb2RlIGVsZW1lbnQpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVCBBZGQ8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gbm9kZXMpIHdoZXJlIFQgOiBOb2RlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChVbmlvbjxOb2RlLCBzdHJpbmc+IG5vZGUgaW4gbm9kZXMpXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZSA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5JczxzdHJpbmc+KCkpXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5BcHBlbmRDaGlsZChuZXcgVGV4dChub2RlLkFzPHN0cmluZz4oKSkpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuQXBwZW5kQ2hpbGQobm9kZS5BczxOb2RlPigpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIFQgQWRkRWxlbWVudDxUPih0aGlzIFQgZWxlbWVudCwgcGFyYW1zIFVuaW9uPE5vZGUsIHN0cmluZz5bXSBub2RlcylcclxuICAgIHdoZXJlIFQgOiBOb2RlXHJcbntcclxuICAgIHJldHVybiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPFQ+KGVsZW1lbnQsbm9kZXMpO1xyXG59cHVibGljIHN0YXRpYyBUIEFkZERpdjxUPih0aGlzIFQgZWxlbWVudCwgcGFyYW1zIFVuaW9uPE5vZGUsIHN0cmluZz5bXSBub2RlcylcclxuICAgIHdoZXJlIFQgOiBOb2RlXHJcbntcclxuICAgIHJldHVybiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPFQ+KGVsZW1lbnQsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50KCksbm9kZXMpKTtcclxufXB1YmxpYyBzdGF0aWMgVCBBZGRVbDxUPih0aGlzIFQgZWxlbWVudCwgcGFyYW1zIFVuaW9uPE5vZGUsIFVuaW9uPE5vZGUsIHN0cmluZz5bXSwgc3RyaW5nPltdIG5vZGVzKVxyXG4gICAgd2hlcmUgVCA6IE5vZGVcclxue1xyXG4gICAgcmV0dXJuIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8VD4oZWxlbWVudCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxVTGlzdEVsZW1lbnQ+KG5ldyBIVE1MVUxpc3RFbGVtZW50KCksU3lzdGVtLkFycmF5RXh0ZW5zaW9ucy5NYXA8VW5pb248Tm9kZSxVbmlvbjxOb2RlLCBzdHJpbmc+W10sc3RyaW5nPixVbmlvbjxOb2RlLHN0cmluZz4+KG5vZGVzLChGdW5jPFVuaW9uPE5vZGUsVW5pb248Tm9kZSwgc3RyaW5nPltdLHN0cmluZz4sVW5pb248Tm9kZSxzdHJpbmc+PikobiA9PiAoVW5pb248Tm9kZSwgc3RyaW5nPikobi5JczxVbmlvbjxOb2RlLCBzdHJpbmc+W10+KCkgPyBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxMSUVsZW1lbnQ+KG5ldyBIVE1MTElFbGVtZW50KCksbi5BczxVbmlvbjxOb2RlLCBzdHJpbmc+W10+KCkpIDogbi5JczxzdHJpbmc+KCkgPyBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxMSUVsZW1lbnQ+KG5ldyBIVE1MTElFbGVtZW50KCksbi5BczxzdHJpbmc+KCkpIDogQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MTElFbGVtZW50PihuZXcgSFRNTExJRWxlbWVudCgpLG4uQXM8Tm9kZT4oKSkpKSkpKTtcclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIEFkZENhbWVsU3BhY2UodGhpcyBzdHJpbmcgc3RyKVxyXG57XHJcbiAgICByZXR1cm4gUmVnZXguUmVwbGFjZShSZWdleC5SZXBsYWNlKHN0ciwgQFwiKFteX2Etel0pKFteX2Etel1bYS16XSlcIiwgXCIkMSAkMlwiKSwgQFwiKFthLXpdKShbXl9hLXpdKVwiLCBcIiQxICQyXCIpO1xyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgVG9DYW1lbFN0cmluZzxUPih0aGlzIFQgZSlcclxuICAgIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbntcclxuICAgIHJldHVybiBlLlRvU3RyaW5nKCkuQWRkQ2FtZWxTcGFjZSgpLlJlcGxhY2UoJ18nLCAnICcpO1xyXG59ICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxTZWxlY3RFbGVtZW50IEFkZEVudW08VD4odGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QsIFQ/IGRlZmF1bHRWYWx1ZSA9IG51bGwsIHN0cmluZyBkZWZhdWx0VmFsdWVTdHJpbmcgPSBcIlwiKSB3aGVyZSBUIDogc3RydWN0LCBTeXN0ZW0uRW51bVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGRlZmF1bHRWYWx1ZSA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgc2VsZWN0LkFkZChDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnQgeyBWYWx1ZSA9IFwiXCIsIFNlbGVjdGVkID0gdHJ1ZSwgRGlzYWJsZSA9IHRydWUgfSxkZWZhdWx0VmFsdWVTdHJpbmcpKTtcclxuICAgICAgICAgICAgZm9yZWFjaCAoVCB2YWx1ZSBpbiBTeXN0ZW0uRW51bS5HZXRWYWx1ZXModHlwZW9mKFQpKSlcclxuICAgICAgICAgICAgICAgIHNlbGVjdC5BZGQoQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVmFsdWUgPSAoKGludCkob2JqZWN0KXZhbHVlKS5Ub1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGVkID0gb2JqZWN0LkVxdWFscyhkZWZhdWx0VmFsdWUsIHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgfSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuVG9DYW1lbFN0cmluZzxUPih2YWx1ZSkpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgYm9vbCBCb29sVmFsdWUodGhpcyBIVE1MSW5wdXRFbGVtZW50IGNoZWNrQm94KVxyXG57XHJcbiAgICByZXR1cm4gY2hlY2tCb3guQ2hlY2tlZDtcclxufXB1YmxpYyBzdGF0aWMgYm9vbCBCb29sVmFsdWUodGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QpXHJcbntcclxuICAgIHJldHVybiBzZWxlY3QuVmFsdWUgPT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2U7XHJcbn1wdWJsaWMgc3RhdGljIEFkamFjZW5jeVR5cGUgQWRqYWNlbmN5VmFsdWUodGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QpXHJcbntcclxuICAgIHJldHVybiAoQWRqYWNlbmN5VHlwZSlpbnQuUGFyc2Uoc2VsZWN0LlZhbHVlKTtcclxufXB1YmxpYyBzdGF0aWMgVD8gVmFsdWU8VD4odGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QpXHJcbiAgICB3aGVyZSBUIDogc3RydWN0LCBTeXN0ZW0uRW51bVxyXG57XHJcbiAgICByZXR1cm4gc2VsZWN0LlZhbHVlID09IFwiXCIgPyBudWxsIDogKFQ/ICkoVCkob2JqZWN0KWludC5QYXJzZShzZWxlY3QuVmFsdWUpO1xyXG59ICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxJbnB1dEVsZW1lbnQgU2V0Qm9vbFZhbHVlKHRoaXMgSFRNTElucHV0RWxlbWVudCBjaGVja0JveCwgYm9vbCB2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNoZWNrQm94LkNoZWNrZWQgPSB2YWx1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIGNoZWNrQm94O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxTZWxlY3RFbGVtZW50IFNldEJvb2xWYWx1ZSh0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdCwgYm9vbCB2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGVjdC5WYWx1ZSA9IHZhbHVlLlRvU3RyaW5nKCkuVG9Mb3dlcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxTZWxlY3RFbGVtZW50IFNldEFkamFjZW5jeVZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBBZGphY2VuY3lUeXBlIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZWN0LlZhbHVlID0gKChpbnQpdmFsdWUpLlRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgU2V0VmFsdWU8VD4odGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QsIFQgdmFsdWUpIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxlY3QuVmFsdWUgPSAoKGludCkob2JqZWN0KXZhbHVlKS5Ub1N0cmluZygpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBzdHJpbmcgVG9UaW1lU3RyaW5nKHRoaXMgVGltZVNwYW4gdGltZSlcclxue1xyXG4gICAgcmV0dXJuIHRpbWUuVG9TdHJpbmcodGltZSA+PSBUaW1lU3Bhbi5Gcm9tSG91cnMoMSkgPyBAXCJoXFw6bW1cXDpzc1wiIDogQFwibVxcOnNzXCIpO1xyXG59ICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zZXRDdXN0b21WYWxpZGl0eSh7bWVzc2FnZX0pLCBlLnJlcG9ydFZhbGlkaXR5KCksIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgU2V0Q3VzdG9tVmFsaWRpdHk8VD4odGhpcyBUIGVsZW1lbnQsIHN0cmluZyBtZXNzYWdlKSB3aGVyZSBUIDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc2V0QXR0cmlidXRlKCdsaXN0Jywge2RhdGFsaXN0SUR9KSwgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gSFRNTElucHV0RWxlbWVudCBTZXREYXRhTGlzdCh0aGlzIEhUTUxJbnB1dEVsZW1lbnQgZWxlbWVudCwgc3RyaW5nIGRhdGFsaXN0SUQpO1xyXG5wdWJsaWMgc3RhdGljIHZvaWQgQ2xlYXIodGhpcyBIVE1MRWxlbWVudCBlbGVtZW50KVxyXG57XHJcbiAgICBlbGVtZW50LklubmVySFRNTCA9IFwiXCI7XHJcbn0gICAgICAgIC8vW1RlbXBsYXRlKFwie2VsZW19LmFwcGVuZENoaWxkKHthZGRpbmd9KVwiKV1cclxuICAgICAgICAvL3B1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgQXBwZW5kPFQ+ICh0aGlzIE5vZGUgZWxlbSwgVCBhZGRpbmcpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFVuaW9uPE5vZGUsIHN0cmluZz5bXSBKb2luQlIodGhpcyBJRW51bWVyYWJsZTxzdHJpbmc+IHN0cmluZ3MpXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uRnVuYzxJRW51bWVyYWJsZTxVbmlvbjxOb2RlLCBzdHJpbmc+Pj4gSW5uZXIgPSBudWxsO1xuICAgICAgICAgICAgXHJcbklubmVyID0gKCkgPT5cclxue1xyXG4gICAgdXNpbmcgKHZhciBlbnVtZXIgPSBzdHJpbmdzLkdldEVudW1lcmF0b3IoKSlcclxuICAgIHtcclxuICAgICAgICBpZiAoIWVudW1lci5Nb3ZlTmV4dCgpKVxyXG4gICAgICAgICAgICB5aWVsZCBicmVhaztcclxuICAgICAgICB5aWVsZCByZXR1cm4gZW51bWVyLkN1cnJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKGVudW1lci5Nb3ZlTmV4dCgpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgeWllbGQgcmV0dXJuIG5ldyBIVE1MQlJFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiBlbnVtZXIuQ3VycmVudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbjtcbiAgICAgICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlRvQXJyYXk8VW5pb248Tm9kZSxzdHJpbmc+PihJbm5lcigpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIE5vdGFibGVPYmplY3RzTGlzdFxyXG4gICAge1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiAsc3RyaW5nICxzdHJpbmcgPj4gTm90YWJsZU9iamVjdHMgPVxyXG4gICAgICAgICAgICBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+ICxzdHJpbmcgLHN0cmluZyA+PigpLChfbzMpPT57X28zLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8SGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+LCBzdHJpbmcsIHN0cmluZz4oZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PigpLCAoX28xKSA9PlxyXG57XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCkpO1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDEsIDApKTtcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigxLCAxKSk7XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMikpO1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDIsIDIpKTtcclxuICAgIHJldHVybiBfbzE7XHJcbn1cclxuXHJcbiksIFwiVHdvIEdlbmVyYXRpb24gTmluZXR5IERlZ3JlZSBSb3RhdG9yXCIsIFwiMDAxMDEwLS0tIC8gMDAwMTAxLS0tXCIpKTtfbzMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4sIHN0cmluZywgc3RyaW5nPihnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+KCksIChfbzIpID0+XHJcbntcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKSk7XHJcbiAgICBfbzIuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMSwgMCkpO1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDEsIDEpKTtcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAxKSk7XHJcbiAgICBfbzIuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMikpO1xyXG4gICAgcmV0dXJuIF9vMjtcclxufVxyXG5cclxuKSwgXCJPbmUgR2VuZXJhdGlvbiBOaW5ldHkgRGVncmVlIFJvdGF0b3JcIiwgXCIwMDEwMTAtLS0gLyAwMDAxMDEtLS1cIikpO3JldHVybiBfbzM7fSk7XHJcbiAgICB9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAvLy8gT3B0aW9uczpcclxuICAgIC8vLyAtIENlbGwgKElzQ2VsbDogdHJ1ZSwgSXNXYWxsOiBmYWxzZSkgIHwgQmxhY2tcclxuICAgIC8vLyAtIFdhbGwgKElzQ2VsbDogdHJ1ZSwgSXNXYWxsOiB0cnVlKSAgIHwgR3JleVxyXG4gICAgLy8vIC0gQnJpY2sgKElzQ2VsbDogZmFsc2UsIElzV2FsbDogdHJ1ZSkgfCBHcmV5XHJcbiAgICAvLy8gPC9zdW1tYXJ5PlxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgU3F1YXJlRXh0ZW5zaW9uc1xyXG4gICAge1xyXG5wdWJsaWMgc3RhdGljIGJvb2wgSXNBbGl2ZSh0aGlzIFNxdWFyZVR5cGUgc3F1YXJlVHlwZSlcclxue1xyXG4gICAgcmV0dXJuIHNxdWFyZVR5cGUgIT0gU3F1YXJlVHlwZS5CcmljaztcclxufXB1YmxpYyBzdGF0aWMgYm9vbCBJc1VuZGVhZCh0aGlzIFNxdWFyZVR5cGUgc3F1YXJlVHlwZSlcclxue1xyXG4gICAgcmV0dXJuIHNxdWFyZVR5cGUgIT0gU3F1YXJlVHlwZS5DZWxsO1xyXG59cHVibGljIHN0YXRpYyBib29sIENvbnRhaW5zQWxpdmU8VD4odGhpcyBEaWN0aW9uYXJ5PFQsIFNxdWFyZVR5cGU+IGRpYywgVCBrZXkpXHJcbntcclxuU3F1YXJlVHlwZSBzcXVhcmVUeXBlO1xuICAgIHJldHVybiBkaWMuVHJ5R2V0VmFsdWUoa2V5LCBvdXQgc3F1YXJlVHlwZSkgJiYgc3F1YXJlVHlwZS5Jc0FsaXZlKCk7XHJcbn0gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnVtIFNxdWFyZVR5cGVcclxuICAgIHtcclxuICAgICAgICBDZWxsLCAgLy8gQmxhY2tcclxuICAgICAgICBJbW1vcnRhbENlbGwsICAvLyBHcmV5XHJcbiAgICAgICAgQnJpY2ssIC8vIEdyZXlcclxuICAgICAgICBDb3VudFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnVtIEdyaWRUeXBlXHJcbiAgICB7XHJcbiAgICAgICAgU3F1YXJlLFxyXG4gICAgICAgIEhleCxcclxuICAgICAgICBUcmlhbmdsZSxcclxuICAgICAgICBDb3VudFxyXG4gICAgfVxyXG5cclxuICAgIFtGbGFnc11cclxuICAgIHB1YmxpYyBlbnVtIERpdmlkZXJzSW5mb1xyXG4gICAge1xyXG4gICAgICAgIE5vbmUgPSAwLFxyXG4gICAgICAgIFJpZ2h0ID0gMSA8PCAwLFxyXG4gICAgICAgIEJvdHRvbSA9IDEgPDwgMSxcclxuICAgICAgICBCb3R0b21SaWdodCA9IDEgPDwgMlxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNsYXNzIEdyaWRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgYWJzdHJhY3Qgdm9pZCBDbGVhcigpO1xyXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCB2b2lkIERyYXdTcXVhcmVzKEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+LCBTcXVhcmVUeXBlPiBEcmF3U3F1YXJlKTtcclxuICAgICAgICBwdWJsaWMgYWJzdHJhY3Qgdm9pZCBIYW5kbGVDbGljayhTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYXdQb3NpdGlvbiwgU3F1YXJlVHlwZSBTcXVhcmVUeXBlUGxhY2luZyk7XHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IHZvaWQgVXBkYXRlKCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCBpbnQgU3F1YXJlQ291bnQgeyBnZXQ7IH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY2xhc3MgR3JpZDxDb29yZFR5cGU+IDogR3JpZFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyB2aXJ0dWFsIHZvaWQgQXNzaWduRGl2aWRlcnMgKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhd1Bvc2l0aW9uLCByZWYgYm9vbCBwbGFjZU5vcm1hbGx5KSB7IH1cclxuICAgICAgICBwdWJsaWMgYWJzdHJhY3QgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBHZXREcmF3UG9zaXRpb24gKENvb3JkVHlwZSBjb29yZHMpO1xyXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCBDb29yZFR5cGUgRnJvbURyYXdQb3NpdGlvbiAoU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBkcmF3UG9zaXRpb24pO1xyXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCBpbnQgTnVtYmVyT2ZBZGphY2VudENlbGxzIChDb29yZFR5cGUgY29vcmRzLCBBY3Rpb248Q29vcmRUeXBlPiBlbXB0eUFkakFjdGlvbiA9IG51bGwpO1xyXG4gICAgICAgIHB1YmxpYyBEaWN0aW9uYXJ5PENvb3JkVHlwZSwgU3F1YXJlVHlwZT4gU3F1YXJlcyA9IG5ldyBEaWN0aW9uYXJ5PENvb3JkVHlwZSwgU3F1YXJlVHlwZT4oKTtcclxuICAgICAgICBwdWJsaWMgRGljdGlvbmFyeTxDb29yZFR5cGUsIERpdmlkZXJzSW5mbz4gRGl2aWRlcnMgPSBuZXcgRGljdGlvbmFyeTxDb29yZFR5cGUsIERpdmlkZXJzSW5mbz4oKTtcclxucHVibGljIG92ZXJyaWRlIGludCBTcXVhcmVDb3VudFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gU3F1YXJlcy5Db3VudDtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIENsZWFyKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNxdWFyZXMuQ2xlYXIoKTtcclxuICAgICAgICAgICAgRGl2aWRlcnMuQ2xlYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIERyYXdTcXVhcmVzIChBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiwgQ29vcmRUeXBlLCBTcXVhcmVUeXBlPiBEcmF3U3F1YXJlKVxyXG4gICAgICAgIHtcclxuZm9yZWFjaCAodmFyIF9kMSBpbiBTcXVhcmVzKVxyXG57XHJcbiAgICBDb29yZFR5cGUgY29vcmRzO1xyXG4gICAgU3F1YXJlVHlwZSBzcXVhcmVUeXBlO1xyXG4gICAgX2QxLkRlY29uc3RydWN0KG91dCBjb29yZHMsIG91dCBzcXVhcmVUeXBlKTtcclxuICAgIERyYXdTcXVhcmUoR2V0RHJhd1Bvc2l0aW9uKGNvb3JkcyksIGNvb3Jkcywgc3F1YXJlVHlwZSk7XHJcbn1cbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBEcmF3U3F1YXJlcyAoQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4sIFNxdWFyZVR5cGU+IERyYXdTcXVhcmUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLkRyYXdTcXVhcmVzKChBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4sQ29vcmRUeXBlLFNxdWFyZVR5cGU+KSgoZHJhd1Bvc2l0aW9uLCBjb29yZHMsIHNxdWFyZVR5cGUpID0+IERyYXdTcXVhcmUoZHJhd1Bvc2l0aW9uLCBzcXVhcmVUeXBlKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExpc3Q8Q29vcmRUeXBlPiByZW1vdmluZyA9IG5ldyBMaXN0PENvb3JkVHlwZT4oKTtcclxuICAgICAgICAgICAgSGFzaFNldDxDb29yZFR5cGU+IGFkZGluZyA9IG5ldyBIYXNoU2V0PENvb3JkVHlwZT4oKTtcclxuZm9yZWFjaCAodmFyIF9kMiBpbiBTcXVhcmVzKVxyXG57XHJcbiAgICBDb29yZFR5cGUgY29vcmRzO1xyXG4gICAgU3F1YXJlVHlwZSBzcXVhcmVUeXBlO1xyXG4gICAgX2QyLkRlY29uc3RydWN0KG91dCBjb29yZHMsIG91dCBzcXVhcmVUeXBlKTtcclxuICAgIGlmICghc3F1YXJlVHlwZS5Jc0FsaXZlKCkpXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICBpbnQgYWRqYWNlbnRDZWxscyA9IE51bWJlck9mQWRqYWNlbnRDZWxscyhjb29yZHMsIChBY3Rpb248Q29vcmRUeXBlPikoY29vcmRzXyA9PlxyXG4gICAge1xyXG4gICAgICAgIGlmIChBcHAuZGVhZFJ1bGVzW051bWJlck9mQWRqYWNlbnRDZWxscyhjb29yZHNfKV0pXHJcbiAgICAgICAgICAgIGFkZGluZy5BZGQoY29vcmRzXyk7XHJcbiAgICB9XHJcblxyXG4pICAgICk7XHJcbiAgICBpZiAoYWRqYWNlbnRDZWxscyA+IEFwcC5tYXhBZGphY2VudENlbGxzKVxyXG4gICAgICAgIGFkamFjZW50Q2VsbHMgPSBBcHAubWF4QWRqYWNlbnRDZWxscztcclxuICAgIGlmICghc3F1YXJlVHlwZS5Jc1VuZGVhZCgpICYmICFBcHAubGl2aW5nUnVsZXNbYWRqYWNlbnRDZWxsc10pXHJcbiAgICAgICAgcmVtb3ZpbmcuQWRkKGNvb3Jkcyk7XHJcbn1cblxyXG4gICAgICAgICAgICBmb3JlYWNoIChDb29yZFR5cGUgY29vcmRzIGluIHJlbW92aW5nKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIVNxdWFyZXMuUmVtb3ZlKGNvb3JkcykpIHRocm93IG5ldyBFeGNlcHRpb24oXCJTcXVhcmUgdHJpZWQgdG8gYmUgcmVtb3ZlZCBidXQgZGlkbid0IGV4aXN0XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3JlYWNoIChDb29yZFR5cGUgY29vcmRzIGluIGFkZGluZylcclxuICAgICAgICAgICAge1xyXG5TeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5Db2xsZWN0aW9uRXh0ZW5zaW9ucy5UcnlBZGQ8Q29vcmRUeXBlLFNxdWFyZVR5cGU+KCAgICAgICAgICAgICAgICBTcXVhcmVzLGNvb3JkcywgU3F1YXJlVHlwZS5DZWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgSGFuZGxlQ2xpY2sgKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhd1Bvc2l0aW9uLCBTcXVhcmVUeXBlIFNxdWFyZVR5cGVQbGFjaW5nKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ29vcmRUeXBlIGNsaWNrQ29vcmRzID0gRnJvbURyYXdQb3NpdGlvbihkcmF3UG9zaXRpb24pO1xyXG4gICAgICAgICAgICBib29sIHBsYWNlTm9ybWFsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoU3F1YXJlVHlwZVBsYWNpbmcgPT0gU3F1YXJlVHlwZS5Db3VudClcclxuICAgICAgICAgICAgICAgIEFzc2lnbkRpdmlkZXJzKGRyYXdQb3NpdGlvbiwgcmVmIHBsYWNlTm9ybWFsbHkpO1xyXG4gICAgICAgICAgICBpZiAocGxhY2VOb3JtYWxseSAmJiAhU3F1YXJlcy5SZW1vdmUoY2xpY2tDb29yZHMpKVxyXG4gICAgICAgICAgICAgICAgU3F1YXJlcy5BZGQoY2xpY2tDb29yZHMsIFNxdWFyZVR5cGVQbGFjaW5nID09IFNxdWFyZVR5cGUuQ291bnQgPyBTcXVhcmVUeXBlLkNlbGwgOiBTcXVhcmVUeXBlUGxhY2luZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBTcXVhcmVHcmlkIDogR3JpZDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PlxyXG4gICAge1xyXG5wdWJsaWMgb3ZlcnJpZGUgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPkdldERyYXdQb3NpdGlvbihTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+Y29vcmRzKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pihjb29yZHMuSXRlbTEgKiBBcHAueE11bHRpcGxpZXIsIGNvb3Jkcy5JdGVtMiAqIEFwcC54TXVsdGlwbGllcik7XHJcbn1wdWJsaWMgb3ZlcnJpZGUgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPkZyb21EcmF3UG9zaXRpb24oU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPmRyYXdQb3NpdGlvbilcclxue1xyXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oQXBwLk5lZ0RpdihkcmF3UG9zaXRpb24uSXRlbTEsIEFwcC54TXVsdGlwbGllciksIEFwcC5OZWdEaXYoZHJhd1Bvc2l0aW9uLkl0ZW0yLCBBcHAueE11bHRpcGxpZXIpKTtcclxufVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIEFzc2lnbkRpdmlkZXJzKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhd1Bvc2l0aW9uLCByZWYgYm9vbCBwbGFjZU5vcm1hbGx5KVxyXG4gICAgICAgIHtcclxuZG91YmxlIGNsaWNrWF87XG5kb3VibGUgY2xpY2tZXztcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGRvdWJsZSwgZG91YmxlPihBcHAuTmVnRGl2RG91YmxlKChkb3VibGUpZHJhd1Bvc2l0aW9uLkl0ZW0xLCBBcHAueE11bHRpcGxpZXIpLCBBcHAuTmVnRGl2RG91YmxlKChkb3VibGUpZHJhd1Bvc2l0aW9uLkl0ZW0yLCBBcHAueU11bHRpcGxpZXIpKSwgb3V0IGNsaWNrWF8sIG91dCBjbGlja1lfKTtcclxuICAgICAgICAgICAgcGxhY2VOb3JtYWxseSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpbnQgeERpdiA9IDAsIHlEaXYgPSAwO1xyXG4gICAgICAgICAgICBpZiAoY2xpY2tYXyAlIDEgPD0gMC4yKVxyXG4gICAgICAgICAgICAgICAgeERpdiA9IC0xO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChjbGlja1hfICUgMSA+PSAwLjgpXHJcbiAgICAgICAgICAgICAgICB4RGl2ID0gMTtcclxuICAgICAgICAgICAgaWYgKGNsaWNrWV8gJSAxIDw9IDAuMilcclxuICAgICAgICAgICAgICAgIHlEaXYgPSAtMTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoY2xpY2tZXyAlIDEgPj0gMC44KVxyXG4gICAgICAgICAgICAgICAgeURpdiA9IDE7XHJcbiAgICAgICAgICAgIERpdmlkZXJzSW5mbyBkaXZpZGVyc0luZm8gPSBEaXZpZGVyc0luZm8uTm9uZTtcclxuICAgICAgICAgICAgQWN0aW9uPERpdmlkZXJzSW5mbz4gQXNzaWduID0gKERpdmlkZXJzSW5mbyBkaXZJbmZvKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbnQgeCA9IChpbnQpY2xpY2tYXyArIHhEaXYsIHkgPSAoaW50KWNsaWNrWV8gKyB5RGl2O1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpdkluZm8gIT0gRGl2aWRlcnNJbmZvLk5vbmUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbkRpdmlkZXJzSW5mbyBkaXZpZGVycztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFEaXZpZGVycy5UcnlHZXRWYWx1ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpeCwgKGludCl5KSwgb3V0IGRpdmlkZXJzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGl2aWRlcnMgPSBEaXZpZGVyc0luZm8uTm9uZTtcclxuICAgICAgICAgICAgICAgICAgICBEaXZpZGVyc1tuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHgsIHkpXSA9IGRpdmlkZXJzIF4gZGl2SW5mbztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc3dpdGNoICh4RGl2KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoeURpdilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBc3NpZ24oRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBc3NpZ24oRGl2aWRlcnNJbmZvLlJpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5RGl2ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2lnbihEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHlEaXYpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXNzaWduKERpdmlkZXJzSW5mby5Cb3R0b20pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlTm9ybWFsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlkZXJzSW5mbyA9IERpdmlkZXJzSW5mby5Cb3R0b207XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoeURpdilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4RGl2ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2lnbihEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlkZXJzSW5mbyA9IERpdmlkZXJzSW5mby5SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXZpZGVyc0luZm8gPSBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkaXZpZGVyc0luZm8gIT0gRGl2aWRlcnNJbmZvLk5vbmUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHhEaXYgPSAwO1xyXG4gICAgICAgICAgICAgICAgeURpdiA9IDA7XHJcbiAgICAgICAgICAgICAgICBBc3NpZ24oZGl2aWRlcnNJbmZvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGludCBOdW1iZXJPZkFkamFjZW50Q2VsbHMoU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBjb29yZHMsIEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiBlbXB0eUFkakFjdGlvbiA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgYWRqYWNlbnRDZWxscyA9IDA7XHJcbiAgICAgICAgICAgIGludCBuID0gMDtcclxuICAgICAgICAgICAgZm9yIChpbnQgTCA9IDA7IEwgPD0gODsgTCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTCA9PSA0KVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFkamFjZW5jeVJ1bGUgPSBBcHAuYWRqYWNlbmN5UnVsZXNbbisrXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnQgYzBfID0gY29vcmRzLkl0ZW0xLSAxICsgKEwgJSAzKSxcclxuICAgICAgICAgICAgICAgICAgICBjMV8gPSBjb29yZHMuSXRlbTItIDEgKyBMIC8gMztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoRGl2aWRlcnMuSGFzRGl2aWRlcnMoY29vcmRzLkl0ZW0xLCBjb29yZHMuSXRlbTIsIEwpKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5TcXVhcmVUeXBlIHNxdWFyZUluZm87XG5cclxuICAgICAgICAgICAgICAgIGlmIChTcXVhcmVzLlRyeUdldFZhbHVlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oYzBfLCBjMV8pLCBvdXQgc3F1YXJlSW5mbykpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNxdWFyZUluZm8uSXNBbGl2ZSgpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VudENlbGxzICs9IChpbnQpYWRqYWNlbmN5UnVsZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBlbXB0eUFkakFjdGlvbiE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+ZW1wdHlBZGpBY3Rpb24uSW52b2tlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oYzBfLCBjMV8pKSk6bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYWRqYWNlbnRDZWxscyA+IEFwcC5tYXhBZGphY2VudENlbGxzID8gQXBwLm1heEFkamFjZW50Q2VsbHMgOiBhZGphY2VudENlbGxzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xhc3MgSGV4R3JpZCA6IEdyaWQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj5cclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IGZsb2F0XHJcbiAgICAgICAgICAgIGNvczYwID0gKGZsb2F0KU1hdGguU2luKE1hdGguUEkgLyAzKSxcclxuICAgICAgICAgICAgc2luNjAgPSAoZmxvYXQpTWF0aC5Db3MoTWF0aC5QSSAvIDMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJjb29yZHNcIj42MGwgaXMgcG9zaXRpb24gZnJvbSAoMCwgMCkgZ29pbmcgNjAgZGVncmVlcyBsZWZ0IG9mIHVwLiA2MHIgaXMgcG9zaXRpb24gZnJvbSAoMCwgMCkgZ29pbmcgNjAgZGVncmVlcyByaWdodCBvZiB1cC9wYXJhbT5cclxuICAgICAgICAvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IEdldERyYXdQb3NpdGlvbiAoU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBjb29yZHMpXHJcbiAgICAgICAge1xyXG5pbnQgXzYwbDtcbmludCBfNjByO1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChjb29yZHMsIG91dCBfNjBsLCBvdXQgXzYwcik7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKCgtXzYwbCArIF82MHIpICogQXBwLnhNdWx0aXBsaWVyICogY29zNjApLCAoaW50KSgtKF82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIHNpbjYwKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBGcm9tRHJhd1Bvc2l0aW9uKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhd1Bvc2l0aW9uKVxyXG4gICAgICAgIHtcclxuaW50IHg7XG5pbnQgeTtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoZHJhd1Bvc2l0aW9uLCBvdXQgeCwgb3V0IHkpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogeCA9ICgtXzYwbCArIF82MHIpICogQXBwLnhNdWx0aXBsaWVyICogc2luNjBcclxuICAgICAgICAgICAgICAgeSA9IC0oXzYwbCArIF82MHIpICogQXBwLnhNdWx0aXBsaWVyICogY29zNjBcclxuICAgICAgICAgICAgICAgayA9IEFwcC54TXVsdGlwbGllclxyXG4gICAgICAgICAgICAgICBhID0gXzYwbFxyXG4gICAgICAgICAgICAgICBiID0gXzYwclxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgU29sdmUgeCA9ICgtYSArIGIpICogayAqIHNpbjYwO3kgPSAtKGErIGIpICogayAqIGNvczYwIGZvciAoYSwgYikgKGh0dHBzOi8vd3d3LndvbGZyYW1hbHBoYS5jb20vaW5wdXQ/aT1zb2x2ZSt4KyUzRCslMjgtYSslMkIrYiUyOSsqK2srKitzaW42MCUzQnkrJTNEKy0lMjhhJTJCK2IlMjkrKitrKyorY29zNjArZm9yK2ErYW5kK2IpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBhID0gLShzcXJ0KDMpIHggKyAzIHkpLygzIGspXHJcbiAgICAgICAgICAgICAgIGIgPSAoc3FydCgzKSB4IC0gMyB5KS8oMyBrKVxyXG4gICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCkoLShNYXRoLlNxcnQoMykgKiB4ICsgMyAqIHkpIC8gKDMgKiBBcHAueE11bHRpcGxpZXIpKSwgKGludCkoKE1hdGguU3FydCgzKSAqIHggLSAzICogeSkgLyAoMyAqIEFwcC54TXVsdGlwbGllcikpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBpbnQgTnVtYmVyT2ZBZGphY2VudENlbGxzKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gY29vcmRzLCBBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gZW1wdHlBZGpBY3Rpb24gPSBudWxsKVxyXG4gICAgICAgIHtcclxuaW50IF82MGw7XG5pbnQgXzYwcjtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoY29vcmRzLCBvdXQgXzYwbCwgb3V0IF82MHIpO1xyXG4gICAgICAgICAgICBpbnQgYWRqYWNlbnRDZWxscyA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoaW50IEwgPSAwOyBMIDw9IDU7IEwrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFkamFjZW5jeVJ1bGUgPSBBcHAuYWRqYWNlbmN5UnVsZXNbTF07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gNjBsIGlzIHBvc2l0aW9uIGZyb20gKDAsIDApIGdvaW5nIDYwIGRlZ3JlZXMgbGVmdCBvZiB1cC4gNjByIGlzIHBvc2l0aW9uIGZyb20gKDAsIDApIGdvaW5nIDYwIGRlZ3JlZXMgcmlnaHQgb2YgdXBcclxuICAgICAgICAgICAgICAgIC8vIEwgPSAwIGlzIGxlZnQtdXAsIGdvaW5nIGNsb2Nrd2lzZSB1cCB0byBMPTUgaXMgbGVmdFxyXG5cclxuICAgICAgICAgICAgICAgIGludCBfNjBsXywgXzYwcl87XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKEwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbGVmdC11cFxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwbF8gPSBfNjBsICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cFxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwbF8gPSBfNjBsICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmlnaHQtdXBcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MGxfID0gXzYwbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmlnaHQtZG93blxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwbF8gPSBfNjBsIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAvLyBkb3duXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjBsXyA9IF82MGwgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjByXyA9IF82MHIgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0LWRvd25cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MGxfID0gXzYwbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oc3RyaW5nLkZvcm1hdChcIkludmFsaWQgTDogezB9XCIsTCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5TcXVhcmVUeXBlIHNxdWFyZUluZm87XG5cclxuICAgICAgICAgICAgICAgIC8vaWYgKERpdmlkZXJzLkhhc0RpdmlkZXJzKGNvb3Jkcy5jMCwgY29vcmRzLmMxLCBMKSlcclxuICAgICAgICAgICAgICAgIC8vICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChTcXVhcmVzLlRyeUdldFZhbHVlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oXzYwbF8sIF82MHJfKSwgb3V0IHNxdWFyZUluZm8pKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzcXVhcmVJbmZvLklzQWxpdmUoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbnRDZWxscyArPSAoaW50KWFkamFjZW5jeVJ1bGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZW1wdHlBZGpBY3Rpb24hPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PmVtcHR5QWRqQWN0aW9uLkludm9rZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KF82MGxfLCBfNjByXykpKTpudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhZGphY2VudENlbGxzID4gQXBwLm1heEFkamFjZW50Q2VsbHMgPyBBcHAubWF4QWRqYWNlbnRDZWxscyA6IGFkamFjZW50Q2VsbHM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBUcmlhbmdsZUdyaWQgOiBHcmlkPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxUcmlhbmdsZUxvY2F0aW9uID4+XHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgZmxvYXRcclxuICAgICAgICAgICAgY29zNjAgPSAoZmxvYXQpTWF0aC5TaW4oTWF0aC5QSSAvIDMpLFxyXG4gICAgICAgICAgICBzaW42MCA9IChmbG9hdClNYXRoLkNvcyhNYXRoLlBJIC8gMyk7XHJcblxyXG4gICAgICAgIC8vIGMwIGlzIHgsIGMxIGlzIHlcclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBHZXREcmF3UG9zaXRpb24oU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFRyaWFuZ2xlTG9jYXRpb24gPiBjb29yZHMpXHJcbiAgICAgICAge1xyXG5pbnQgXzYwbDtcbmludCBfNjByO1xuVHJpYW5nbGVMb2NhdGlvbiBuO1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChjb29yZHMsIG91dCBfNjBsLCBvdXQgXzYwciwgb3V0IG4pO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KSgoLV82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIGNvczYwKSwgKGludCkoLShfNjBsICsgXzYwcikgKiBBcHAueE11bHRpcGxpZXIgKiBzaW42MCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxUcmlhbmdsZUxvY2F0aW9uID4gRnJvbURyYXdQb3NpdGlvbihTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYXdQb3NpdGlvbilcclxuICAgICAgICB7XHJcblN5c3RlbS5GdW5jPGRvdWJsZSwgZG91YmxlPiBOZWdNb2QxID0gbnVsbDtcbmludCB4O1xuaW50IHk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGRyYXdQb3NpdGlvbiwgb3V0IHgsIG91dCB5KTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHggPSAoLV82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIHNpbjYwXHJcbiAgICAgICAgICAgICAgIHkgPSAtKF82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIGNvczYwXHJcbiAgICAgICAgICAgICAgIGsgPSBBcHAueE11bHRpcGxpZXJcclxuICAgICAgICAgICAgICAgYSA9IF82MGxcclxuICAgICAgICAgICAgICAgYiA9IF82MHJcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIFNvbHZlIHggPSAoLWEgKyBiKSAqIGsgKiBzaW42MDt5ID0gLShhKyBiKSAqIGsgKiBjb3M2MCBmb3IgKGEsIGIpIChodHRwczovL3d3dy53b2xmcmFtYWxwaGEuY29tL2lucHV0P2k9c29sdmUreCslM0QrJTI4LWErJTJCK2IlMjkrKitrKyorc2luNjAlM0J5KyUzRCstJTI4YSUyQitiJTI5KyoraysqK2NvczYwK2ZvcithK2FuZCtiKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgYSA9IC0oMyB4ICsgc3FydCgzKSB5KS8oMyBrKVxyXG4gICAgICAgICAgICAgICBiID0gKDMgeCAtIHNxcnQoMykgeSkvKDMgaylcclxuICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBUcmlhbmdsZUxvY2F0aW9uIGZyb20gcG9zaXRpb25cclxuXHJcbiAgICAgICAgICAgIGRvdWJsZSBib2FyZF82MGwgPSAtKE1hdGguU3FydCgzKSAqIHggKyAzICogeSkgLyAoMyAqIEFwcC54TXVsdGlwbGllciksXHJcbiAgICAgICAgICAgICAgICAgICBib2FyZF82MHIgPSAgKE1hdGguU3FydCgzKSAqIHggLSAzICogeSkgLyAoMyAqIEFwcC54TXVsdGlwbGllcik7XHJcblxyXG4gICAgICAgICAgICBcclxuTmVnTW9kMSA9IChhKSA9PiAoYSAlIDEgKyAxKSAlIDE7XG5cclxuICAgICAgICAgICAgZG91YmxlIF82MGxNb2QxID0gTmVnTW9kMShib2FyZF82MGwpLFxyXG4gICAgICAgICAgICAgICAgICAgXzYwck1vZDEgPSBOZWdNb2QxKGJvYXJkXzYwcik7XHJcblxyXG4gICAgICAgICAgICBUcmlhbmdsZUxvY2F0aW9uIG4gPSBfNjByTW9kMSA8PSAoMS4wIC8gMilcclxuICAgICAgICAgICAgICAgID8gXzYwbE1vZDEgPD0gKDEuMCAvIDMpID8gVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b20gOlxyXG4gICAgICAgICAgICAgICAgICAgIF82MGxNb2QxIDw9ICgyLjAgLyAzKSA/IFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tTGVmdCA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnRcclxuICAgICAgICAgICAgICAgIDogXzYwbE1vZDEgPD0gKDEuMCAvIDMpID8gVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21SaWdodCA6XHJcbiAgICAgICAgICAgICAgICAgICAgXzYwbE1vZDEgPD0gKDIuMCAvIDMpID8gVHJpYW5nbGVMb2NhdGlvbi5Ub3BSaWdodCA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUcmlhbmdsZUxvY2F0aW9uLlRvcDsgICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4oKGludClNYXRoLlJvdW5kKGJvYXJkXzYwbCksIChpbnQpTWF0aC5Sb3VuZChib2FyZF82MHIpLCBuKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBpbnQgTnVtYmVyT2ZBZGphY2VudENlbGxzKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxUcmlhbmdsZUxvY2F0aW9uID4gY29vcmRzLCBBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFRyaWFuZ2xlTG9jYXRpb24gPj4gZW1wdHlBZGpBY3Rpb24gPSBudWxsKVxyXG4gICAgICAgIHtcclxuX19fQWRkU3F1YXJlX0RlbGVnYXRlXzAgQWRkU3F1YXJlID0gbnVsbDtcblN5c3RlbS5GdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiwgVHJpYW5nbGVMb2NhdGlvbiwgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+PiBDcmVhdGVQb3MgPSBudWxsO1xuU3lzdGVtLkZ1bmM8aW50LCBib29sLCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+IEdldEZpbmFsSGV4YWdvbkxvY1BvcyA9IG51bGw7XG5TeXN0ZW0uRnVuYzxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4gR2V0SGV4YWdvbkxvYyA9IG51bGw7XG5TeXN0ZW0uRnVuYzxpbnQsIGJvb2wsIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4gR2V0SGV4YWdvbkxvY1BvcyA9IG51bGw7XG5pbnQgXzYwbDtcbmludCBfNjByO1xuVHJpYW5nbGVMb2NhdGlvbiBuO1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChjb29yZHMsIG91dCBfNjBsLCBvdXQgXzYwciwgb3V0IG4pO1xyXG4gICAgICAgICAgICBpbnQgYWRqYWNlbnRDZWxscyA9IDA7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKFRyaWFuZ2xlTG9jYXRpb24gbG9jID0gMDsgbG9jIDwgVHJpYW5nbGVMb2NhdGlvbi5Db3VudDsgbG9jKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2MgPT0gbilcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciBhZGphY2VuY3lSdWxlID0gQXBwLmFkamFjZW5jeVJ1bGVzWyhpbnQpbG9jXTtcclxuICAgICAgICAgICAgICAgIGlmIChDdXN0b21pemFibGVHYW1lb2ZMaWZlLlNxdWFyZUV4dGVuc2lvbnMuQ29udGFpbnNBbGl2ZTxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFRyaWFuZ2xlTG9jYXRpb24+PihTcXVhcmVzLG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4oXzYwbCwgXzYwciwgbG9jKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgYWRqYWNlbnRDZWxscyArPSAoaW50KWFkamFjZW5jeVJ1bGU7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZW1wdHlBZGpBY3Rpb24hPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PmVtcHR5QWRqQWN0aW9uLkludm9rZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+KF82MGwsIF82MHIsIGxvYykpKTpudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayB0cmlhbmdsZXMgZnJvbSBhZGphY2VudCBoZXhhZ29ucyBmb3IgYWRqYWNlbmN5XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBsZWZ0LXVwLCBnZXQgcmlnaHQtdXAsIHJpZ2h0LWRvd24gYW5kIGRvd24gZnJvbSBsZWZ0LXVwLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBnZXQgcmlnaHQtdXAgYW5kIHVwIGZyb20gbGVmdC1kb3duLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBnZXQgbGVmdC1kb3duIGFuZCBkb3duIGZyb20gdXBcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHVwLCBnZXQgbGVmdC1kb3duLCBkb3duIGFuZCByaWdodC1kb3duIGZyb20gdXAsXHJcbiAgICAgICAgICAgIC8vICAgICAgICBnZXQgcmlnaHQtdXAgYW5kIHJpZ2h0LWRvd24gZnJvbSBsZWZ0LXVwXHJcbiAgICAgICAgICAgIC8vICAgICAgICBnZXQgbGVmdC11cCBhbmQgbGVmdC1kb3duIGZyb20gcmlnaHQtdXBcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHJpZ2h0LXVwLCBnZXQgbGVmdC11cCwgbGVmdC1kb3duIGFuZCBkb3duIGZyb20gcmlnaHQtdXAsXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICBnZXQgbGVmdC11cCBhbmQgdXAgZnJvbSByaWdodC1kb3duLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgZ2V0IHJpZ2h0LWRvd24gYW5kIGRvd24gZnJvbSB1cFxyXG5cclxuICAgICAgICAgICAgLy8gSWYgbGVmdC1kb3duLCBnZXQgcmlnaHQtdXAsIHJpZ2h0LWRvd24gYW5kIHVwIGZyb20gbGVmdC1kb3duLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgIGdldCByaWdodC1kb3duIGFuZCBkb3duIGZyb20gbGVmdC11cCxcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICBnZXQgbGVmdC11cCBhbmQgdXAgZnJvbSBkb3duXHJcblxyXG4gICAgICAgICAgICAvLyBJZiBkb3duLCBnZXQgbGVmdC11cCwgdXAgYW5kIHJpZ2h0LXVwIGZyb20gZG93bixcclxuICAgICAgICAgICAgLy8gICAgICAgICAgZ2V0IHJpZ2h0LWRvd24gYW5kIHJpZ2h0LXVwIGZyb20gbGVmdC1kb3duXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgIGdldCBsZWZ0LWRvd24gYW5kIGxlZnQtdXAgZnJvbSByaWdodC1kb3duXHJcblxyXG4gICAgICAgICAgICAvLyBJZiByaWdodC1kb3duLCBnZXQgbGVmdC11cCwgbGVmdC1kb3duIGFuZCB1cCBmcm9tIHJpZ2h0LWRvd24sXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGdldCBsZWZ0LWRvd24gYW5kIGRvd24gZnJvbSByaWdodC11cCxcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgZ2V0IHJpZ2h0LXVwIGFuZCB1cCBmcm9tIGRvd25cclxuXHJcbiAgICAgICAgICAgIGludCB4XyA9XHJcbiAgICAgICAgICAgICAgICBuID09IFRyaWFuZ2xlTG9jYXRpb24uVG9wTGVmdCB8fCBuID09IFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tTGVmdCA/IC0xIDpcclxuICAgICAgICAgICAgICAgIG4gPT0gVHJpYW5nbGVMb2NhdGlvbi5Ub3BSaWdodCB8fCBuID09IFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tUmlnaHQgPyAxIDpcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICB5XyA9XHJcbiAgICAgICAgICAgICAgICBuID09IFRyaWFuZ2xlTG9jYXRpb24uVG9wTGVmdCB8fCBuID09IFRyaWFuZ2xlTG9jYXRpb24uVG9wUmlnaHQgfHwgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLlRvcCA/IC0xIDogMTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG5HZXRIZXhhZ29uTG9jUG9zID0gKGludmVydFgsIGludmVydFkpID0+IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oaW52ZXJ0WCA9PSAtMSA/IDAgOiBpbnZlcnRYID09IDEgPyAteF8gOiB4XywgaW52ZXJ0WSA/IC15XyA6IHlfKTtcbiAgICAgICAgICAgIFxyXG5HZXRIZXhhZ29uTG9jID0gKHgsIHkpID0+IHkgPT0gMCA/ICgoU3lzdGVtLkZ1bmM8VHJpYW5nbGVMb2NhdGlvbj4pKCgpID0+XHJcbntcclxuICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKFwieSBjYW5ub3QgYmUgMFwiKTtcclxufVxyXG5cclxuKSkoKSA6IHggPT0gMCA/IHkgPT0gLTEgPyBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbSA6IFRyaWFuZ2xlTG9jYXRpb24uVG9wIDogeCA9PSAtMSA/IHkgPT0gLTEgPyBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQgOiBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbUxlZnQgOiB4ID09IDEgPyB5ID09IC0xID8gVHJpYW5nbGVMb2NhdGlvbi5Ub3BSaWdodCA6IFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tUmlnaHQgOiAoKFN5c3RlbS5GdW5jPFRyaWFuZ2xlTG9jYXRpb24+KSgoKSA9PlxyXG57XHJcbiAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbihcInggbXVzdCBiZSAtMSwgMCBvciAxXCIpO1xyXG59XHJcblxyXG4pKSgpO1xuR2V0RmluYWxIZXhhZ29uTG9jUG9zID0gKGludmVydFgsIGludmVydFkpID0+XHJcbntcclxuICAgIGludCB4O1xyXG4gICAgaW50IHk7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KEdldEhleGFnb25Mb2NQb3MoaW52ZXJ0WCwgaW52ZXJ0WSksIG91dCB4LCBvdXQgeSk7XHJcbiAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihfNjBsICsgeCwgXzYwciArIHkpO1xyXG59XHJcblxyXG47XG5DcmVhdGVQb3MgPSAocG9zLCBOKSA9PiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+KHBvcy5JdGVtMSwgcG9zLkl0ZW0yLCBOKTtcbkFkZFNxdWFyZSA9IChpbnQgaW52ZXJ0WDEsIGJvb2wgaW52ZXJ0WTEsIGludCBpbnZlcnRYMiwgYm9vbCBpbnZlcnRZMiwgaW50IHgxT3ZlcnJpZGUsIGludCB4Mk92ZXJyaWRlKSA9PlxyXG57XHJcbiAgICBpbnQgXzYwbF87XHJcbiAgICBpbnQgXzYwcl87XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KEdldEZpbmFsSGV4YWdvbkxvY1BvcyhpbnZlcnRYMSwgaW52ZXJ0WTEpLCBvdXQgXzYwbF8sIG91dCBfNjByXyk7XHJcbiAgICBpZiAoeDFPdmVycmlkZSAhPSAwKVxyXG4gICAgICAgIF82MGxfID0geDFPdmVycmlkZTtcclxuICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiBwb3MyID0gR2V0SGV4YWdvbkxvY1BvcyhpbnZlcnRYMiwgaW52ZXJ0WTIpO1xyXG4gICAgaWYgKHgyT3ZlcnJpZGUgIT0gMClcclxuICAgICAgICBwb3MyLkl0ZW0xID0geDJPdmVycmlkZTtcclxuICAgIFRyaWFuZ2xlTG9jYXRpb24gbl8gPSBHZXRIZXhhZ29uTG9jKHBvczIuSXRlbTEsIHBvczIuSXRlbTIpO1xyXG4gICAgdmFyIGNvb3Jkc18gPSBDcmVhdGVQb3MobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihfNjBsXywgXzYwcl8pLCBuXyk7XHJcbiAgICBTcXVhcmVUeXBlIHNxdWFyZUluZm87XHJcbiAgICBpZiAoU3F1YXJlcy5UcnlHZXRWYWx1ZShjb29yZHNfLCBvdXQgc3F1YXJlSW5mbykpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHNxdWFyZUluZm8uSXNBbGl2ZSgpKVxyXG4gICAgICAgICAgICBhZGphY2VudENlbGxzICs9IDE7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICAgICAgZW1wdHlBZGpBY3Rpb24gIT0gbnVsbCA/IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpID0+IGVtcHR5QWRqQWN0aW9uLkludm9rZShjb29yZHNfKSkgOiBudWxsO1xyXG59XHJcblxyXG47XG5cclxuICAgICAgICAgICAgc3dpdGNoIChuKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uVG9wTGVmdDpcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Ub3BSaWdodDpcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21MZWZ0OlxyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbVJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGludmVydFkgaXMgLTEsIHRoZW4gdGhlIHkgY29vcmRpbmF0ZSBpcyByZW1vdmVkLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGludmVydFkgaXMgMCwgdGhlbiB0aGUgeSBjb29yZGluYXRlIGlzIG5vdCBpbnZlcnRlZC5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpbnZlcnRZIGlzIDEsIHRoZW4gdGhlIHkgY29vcmRpbmF0ZSBpcyBpbnZlcnRlZC5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpbnZlcnRYIGlzIDAsIHRoZW4gdGhlIHggY29vcmRpbmF0ZSBpcyBub3QgaW52ZXJ0ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaW52ZXJ0WCBpcyAxLCB0aGVuIHRoZSB4IGNvb3JkaW5hdGUgaXMgaW52ZXJ0ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDEsIHRydWUsIDAsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMSwgZmFsc2UsIDAsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoLTEsIHRydWUsIDAsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMSwgZmFsc2UsIDAsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgtMSwgZmFsc2UsIDAsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCB0cnVlLCAtMSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgtMSwgdHJ1ZSwgLTEsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Ub3A6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tOlxyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCB0cnVlLCAwLCBmYWxzZSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDAsIHRydWUsIDAsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMCwgdHJ1ZSwgMCwgZmFsc2UsIC0xKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMCwgZmFsc2UsIDAsIGZhbHNlLCAxLCAtMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDAsIHRydWUsIDAsIGZhbHNlLCAxLCAtMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDAsIGZhbHNlLCAwLCBmYWxzZSwgLTEsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCB0cnVlLCAwLCBmYWxzZSwgLTEsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbihcIm4gbXVzdCBiZSAwLCAxLCAyLCAzLCA0IG9yIDVcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhZGphY2VudENlbGxzID4gQXBwLm1heEFkamFjZW50Q2VsbHMgPyBBcHAubWF4QWRqYWNlbnRDZWxscyA6IGFkamFjZW50Q2VsbHM7XHJcbiAgICAgICAgfVxyXG5wcml2YXRlIGRlbGVnYXRlIHZvaWQgX19fQWRkU3F1YXJlX0RlbGVnYXRlXzAoaW50IGludmVydFgxLCBib29sIGludmVydFkxLCBpbnQgaW52ZXJ0WDIsIGJvb2wgaW52ZXJ0WTIsIGludCB4MU92ZXJyaWRlID0gMCwgaW50IHgyT3ZlcnJpZGUgPSAwKTsgICAgfVxyXG59XHJcbiJdCn0K
