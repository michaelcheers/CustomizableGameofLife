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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDdXN0b21pemFibGVHYW1lb2ZMaWZlLmpzIiwKICAic291cmNlUm9vdCI6ICIiLAogICJzb3VyY2VzIjogWyJDbGFzczEuY3MiLCJFeHRlbnNpb25zLmNzIiwiTm90YWJsZU9iamVjdHNMaXN0LmNzIiwiU3F1YXJlLmNzIiwiR3JpZC5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQWlnQkFBLHdCQUFpRUE7WUFDckRBLHFCQUF3QkE7WUFDcENBO1lBQXFCQSxJQUFJQSxDQUFDQSxLQUFJQSw4Q0FBNkJBO2dCQUUzQ0E7b0JBRUlBLGVBQW1CQSxXQUFXQTtvQkFDOUJBLElBQUlBLGtCQUFrQkE7d0JBRWxCQSxJQUFJQSxBQUFxQ0E7NEJBRXJDQSxtQkFBc0JBLDhDQUFzQ0EsZUFBZUEsdUJBQXZCQTs0QkFDcERBLGtCQUFXQSxpQkFBY0EsMkNBQWFBOzt3QkFFMUNBLElBQUlBLEFBQXFDQTs0QkFFckNBLG9CQUFzQkEsOENBQXNDQSxlQUFlQSxxQkFBdkJBOzRCQUNwREEsa0JBQVdBLGtCQUFjQSx5Q0FBV0E7O3dCQUV4Q0EsSUFBSUEsQUFBcUNBOzRCQUVyQ0Esb0JBQStCQSw4Q0FBK0NBLGVBQWVBLDBCQUFoQ0E7NEJBQzdEQSxrQkFBV0Esa0JBQWNBLDhDQUFnQkE7Ozs7Ozs7WUFNekRBO1lBQ0FBLDBCQUEwQkE7WUFDMUJBO1lBQ0FBLDBCQUEwQkE7WUFDMUJBLDBCQUEwQkE7O1lBRTFCQSwwQkFBdUNBOztnQkFFbkNBLElBQUlBO29CQUVBQSxLQUFLQSxXQUFXQSxRQUFRQTt3QkFFcEJBLFdBQWNBLFFBQVFBLHlGQUFrRUEsQUFBQ0EsQUFBa0JBLEtBQU1BLHNDQUE2QkE7d0JBQzlJQSxtREFBd0JBLGlGQUEyREEsZ0RBQW9CQSw2QkFBa0VBLDhCQUErQkEsNkJBQTZEQSwyREFBMkRBLCtCQUEwQkEsNERBQWdFQSwrQkFBK0JBLFVBQU9BLHdCQUF5Q0EsNkRBQWVBLEdBQWZBOzs7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QkEsOENBQXVCQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucztcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5EaWFnbm9zdGljcy5Db250cmFjdHM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uUmVmbGVjdGlvbjtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIEFwcFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IHhNdWx0aXBsaWVyID0gMjA7XHJcbnB1YmxpYyBzdGF0aWMgaW50IHlNdWx0aXBsaWVyXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB4TXVsdGlwbGllcjtcclxuICAgIH1cclxufXB1YmxpYyBzdGF0aWMgZG91YmxlIGFjdHVhbFhNdWx0aXBsaWVyXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBHcmlkIGlzIEhleEdyaWQgPyB4TXVsdGlwbGllciAqIDIgKiBIZXhHcmlkLmNvczYwIDogeE11bHRpcGxpZXI7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIGRvdWJsZSBhY3R1YWxZTXVsdGlwbGllclxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gR3JpZCBpcyBIZXhHcmlkID8geU11bHRpcGxpZXIgKiAyICogSGV4R3JpZC5zaW42MCA6IHlNdWx0aXBsaWVyO1xyXG4gICAgfVxyXG59ICAgICAgICBwdWJsaWMgc3RhdGljIGludCBzY3JlZW5XaWR0aCA9IFdpbmRvdy5Jbm5lcldpZHRoLCBzY3JlZW5IZWlnaHQgPSBXaW5kb3cuSW5uZXJIZWlnaHQ7XHJcbnB1YmxpYyBzdGF0aWMgaW50IHdpZHRoXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiAoaW50KU1hdGguQ2VpbGluZygoZG91YmxlKXNjcmVlbldpZHRoIC8geE11bHRpcGxpZXIpO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBpbnQgaGVpZ2h0XHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiAoaW50KU1hdGguQ2VpbGluZygoZG91YmxlKXNjcmVlbkhlaWdodCAvIHlNdWx0aXBsaWVyKTtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgSG90YmFyID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgIFBvc2l0aW9uID0gUG9zaXRpb24uQWJzb2x1dGUsXHJcbiAgICAgICAgICAgICAgICBMZWZ0ID0gXCIxMDBweFwiLFxyXG4gICAgICAgICAgICAgICAgVG9wID0gc3RyaW5nLkZvcm1hdChcInswfXB4XCIsV2luZG93LklubmVySGVpZ2h0IC0gNDApICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBSZXNldChtYWtlQmxhbms6IHRydWUpXHJcbiAgICAgICAgICAgIH0sXCJCbGFua1wiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBSZXNldCgpXHJcbiAgICAgICAgICAgIH0sXCJSZXNldFwiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLFxyXG4gICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT4gU2F2ZUFzU3RhcnRlcigpXHJcbiAgICAgICAgICAgIH0sXCJTYXZlIGFzIFN0YXJ0ZXJcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gWm9vbSh6b29tSW46IGZhbHNlKVxyXG4gICAgICAgICAgICB9LFwiWm9vbSBPdXRcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gWm9vbSh6b29tSW46IHRydWUpXHJcbiAgICAgICAgICAgIH0sXCJab29tIEluXCIpKVxyXG4sTmV4dEdyaWRUeXBlQnV0dG9uID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IE5leHRHcmlkVHlwZSgpXHJcbiAgICAgICAgICAgIH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLlRvQ2FtZWxTdHJpbmc8R3JpZFR5cGU+KEdyaWRUeXBlLlRyaWFuZ2xlKSkpXHJcbixOZXh0U3F1YXJlVHlwZUJ1dHRvbiA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBOZXh0U3F1YXJlVHlwZSgpXHJcbiAgICAgICAgICAgIH0sXCJXYWxsXCIpKVxyXG4sUGxheUJ1dHRvbiA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBJbnZlcnRJc1BsYXlpbmcoKVxyXG4gICAgICAgICAgICB9LFwi4pa2XCIpKVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFNob3dNb2RhbChNb2RhbFR5cGUuU2V0dGluZ3MpXHJcbiAgICAgICAgICAgIH0sXCLimplcIikpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFNxdWFyZVR5cGUgU3F1YXJlVHlwZVBsYWNpbmcgPSBTcXVhcmVUeXBlLkNvdW50O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgR3JpZFR5cGUgQ3VycmVudEdyaWRUeXBlID0gR3JpZFR5cGUuVHJpYW5nbGU7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQnV0dG9uRWxlbWVudCBOZXh0R3JpZFR5cGVCdXR0b24sIE5leHRTcXVhcmVUeXBlQnV0dG9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgWm9vbSAoYm9vbCB6b29tSW4pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB4TXVsdGlwbGllciArPSB6b29tSW4gPyAxIDogLTE7XHJcbiAgICAgICAgICAgIGlmICh4TXVsdGlwbGllciA8PSAxKVxyXG4gICAgICAgICAgICAgICAgeE11bHRpcGxpZXIgPSAyO1xyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTmV4dFNxdWFyZVR5cGUgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNxdWFyZVR5cGVQbGFjaW5nID0gKFNxdWFyZVR5cGUpKCgoaW50KVNxdWFyZVR5cGVQbGFjaW5nICsgMSkgJSAoaW50KShTcXVhcmVUeXBlLkNvdW50ICsgMSkpO1xyXG4gICAgICAgICAgICBOZXh0U3F1YXJlVHlwZUJ1dHRvbi5Jbm5lckhUTUwgPSBTcXVhcmVUeXBlUGxhY2luZyA9PSBTcXVhcmVUeXBlLkNvdW50ID8gXCJXYWxsXCIgOiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuVG9DYW1lbFN0cmluZzxTcXVhcmVUeXBlPihTcXVhcmVUeXBlUGxhY2luZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTmV4dEdyaWRUeXBlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEN1cnJlbnRHcmlkVHlwZSA9IChHcmlkVHlwZSkoKChpbnQpQ3VycmVudEdyaWRUeXBlICsgMSkgJSAoaW50KUdyaWRUeXBlLkNvdW50KTtcclxuICAgICAgICAgICAgTmV4dEdyaWRUeXBlQnV0dG9uLklubmVySFRNTCA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5Ub0NhbWVsU3RyaW5nPEdyaWRUeXBlPihDdXJyZW50R3JpZFR5cGUpO1xyXG4gICAgICAgICAgICBpZiAoQ3VycmVudEdyaWRUeXBlID09IEdyaWRUeXBlLlRyaWFuZ2xlKVxyXG4gICAgICAgICAgICAgICAgeE11bHRpcGxpZXIgKj0gMjtcclxuICAgICAgICAgICAgZWxzZSBpZiAoQ3VycmVudEdyaWRUeXBlID09IEdyaWRUeXBlLlNxdWFyZSlcclxuICAgICAgICAgICAgICAgIHhNdWx0aXBsaWVyIC89IDI7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoQ3VycmVudEdyaWRUeXBlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIEdyaWRUeXBlLlNxdWFyZTpcclxuICAgICAgICAgICAgICAgICAgICBHcmlkID0gbmV3IFNxdWFyZUdyaWQoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgR3JpZFR5cGUuSGV4OlxyXG4gICAgICAgICAgICAgICAgICAgIEdyaWQgPSBuZXcgSGV4R3JpZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBHcmlkVHlwZS5UcmlhbmdsZTpcclxuICAgICAgICAgICAgICAgICAgICBHcmlkID0gbmV3IFRyaWFuZ2xlR3JpZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgUmlnaHRIb3RiYXIgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFN0eWxlID0ge1xyXG4gICAgICAgICAgICAgICAgUG9zaXRpb24gPSBQb3NpdGlvbi5BYnNvbHV0ZSxcclxuICAgICAgICAgICAgICAgIFJpZ2h0ID0gXCIxMDBweFwiLFxyXG4gICAgICAgICAgICAgICAgVG9wID0gc3RyaW5nLkZvcm1hdChcInswfXB4XCIsV2luZG93LklubmVySGVpZ2h0IC0gNDApICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4taW5mb1wiLFxyXG4gICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT4gU2hvd01vZGFsKE1vZGFsVHlwZS5Ob3RhYmxlT2JqZWN0cylcclxuICAgICAgICAgICAgfSxcIk5vdGFibGUgT2JqZWN0c1wiKSk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBSZXNldCAoYm9vbCBtYWtlQmxhbmsgPSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghR2xvYmFsLkNvbmZpcm0oXCJBbnkgdW5zYXZlZCBjaGFuZ2VzIHdpbGwgYmUgbG9zdC4gQ29udGludWU/XCIpKSByZXR1cm47XHJcbiAgICAgICAgICAgIEdyaWQuQ2xlYXIoKTtcclxuR3JpZDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+IGdyaWQ7ICAgICAgICAgICAgaWYgKCFtYWtlQmxhbmsgJiYgKGdyaWQgPSBHcmlkIGFzIEdyaWQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PikgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgICAgIG9iamVjdCBzdGFydGVyUG9zaXRpb25zID0gR2xvYmFsLkxvY2FsU3RvcmFnZS5HZXRJdGVtKFwic3RhcnRlclBvc2l0aW9uc1wiKTtcclxuICAgICAgICAgICAgICAgIGlmIChzdGFydGVyUG9zaXRpb25zICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nIHMgPSAoc3RyaW5nKXN0YXJ0ZXJQb3NpdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdHJpbmcuSXNOdWxsT3JFbXB0eShzKSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBqc29uUmF3ID0gSlNPTi5QYXJzZShzKS5Ub0R5bmFtaWMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb25SYXcubGVuZ3RoID09IDAgfHwganNvblJhd1swXS5JdGVtMyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JlYWNoICh2YXIgcG9zIGluIChKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+W10+KHMpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmlkLlNxdWFyZXMuQWRkKHBvcywgU3F1YXJlVHlwZS5DZWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JlYWNoICh2YXIgc3F1YXJlSW5mbyBpbiAoSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFNxdWFyZVR5cGUgPltdPihzKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZC5TcXVhcmVzLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHNxdWFyZUluZm8uSXRlbTEsIHNxdWFyZUluZm8uSXRlbTIpLCBzcXVhcmVJbmZvLkl0ZW0zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBsYXlpbmcpXHJcbiAgICAgICAgICAgICAgICBJbnZlcnRJc1BsYXlpbmcoKTtcclxuICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxTcXVhcmVUeXBlID4+IEdldENvb3JkaW5hdGVzSW50ZXJhbCgpXHJcbiAgICAgICAge1xyXG5HcmlkPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4gZzsgICAgICAgICAgICBpZiAoKGcgPSBHcmlkIGFzIEdyaWQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PikgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBvZmZzZXRDb29yZHMgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KE5lZ0RpdihvZmZzZXRQb3MuSXRlbTEsIChpbnQpYWN0dWFsWE11bHRpcGxpZXIpLCBOZWdEaXYob2Zmc2V0UG9zLkl0ZW0yLCAoaW50KWFjdHVhbFlNdWx0aXBsaWVyKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Ub0xpc3Q8S2V5VmFsdWVQYWlyPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+LFNxdWFyZVR5cGU+PihnLlNxdWFyZXMpLkNvbnZlcnRBbGw8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPj4oKENvbnZlcnRlcjxLZXlWYWx1ZVBhaXI8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4sU3F1YXJlVHlwZT4sU3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPj4pKHMgPT4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBTcXVhcmVUeXBlPihzLktleS5JdGVtMSArIG9mZnNldENvb3Jkcy5JdGVtMSwgcy5LZXkuSXRlbTIgKyBvZmZzZXRDb29yZHMuSXRlbTIsIHMuVmFsdWUpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxTcXVhcmVUeXBlID4+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3B1YmxpYyBzdGF0aWMgTGlzdDwoaW50IHgsIGludCB5LCBTcXVhcmVUeXBlIHNxdWFyZVR5cGUpPiBHZXROb3JtYWxpemVkQ29vcmRpbmF0ZXMgKClcclxuICAgICAgICAvL3tcclxuICAgICAgICAvLyAgICBMaXN0PChpbnQgeCwgaW50IHksIFNxdWFyZVR5cGUgc3F1YXJlVHlwZSk+IGNvb3JkcyA9IEdldENvb3JkaW5hdGVzSW50ZXJhbCgpO1xyXG4gICAgICAgIC8vICAgIGNvb3JkcyA9IGNvb3Jkcy5XaGVyZShjID0+IGMueCA+PSAwICYmIGMueSA+PSAwICYmIGMueCA8IHdpZHRoICYmIGMueSA8IGhlaWdodCkuVG9MaXN0KCk7XHJcbiAgICAgICAgLy8gICAgaW50IG1pblggPSBjb29yZHMuTWluKGMgPT4gYy54KSwgbWluWSA9IGNvb3Jkcy5NaW4oYyA9PiBjLnkpO1xyXG4gICAgICAgIC8vICAgIGNvb3JkcyA9IGNvb3Jkcy5TZWxlY3QoYyA9PiAoYy54IC0gbWluWCwgYy55IC0gbWluWSwgYy5zcXVhcmVUeXBlKSkuVG9MaXN0KCk7XHJcbiAgICAgICAgLy8gICAgcmV0dXJuIGNvb3JkcztcclxuICAgICAgICAvL31cclxuXHJcbiAgICAgICAgLy8gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBHZXRDb29yZGluYXRlcyAoKVxyXG4gICAgICAgIC8vICAgICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICBzdHJpbmcgY29kZUdlbmVyYXRlZCA9ICRAXCIobmV3IEhhc2hTZXQ8KGludCB4LCBpbnQgeSk+XHJcbiAgICAgICAgLy97e1xyXG4gICAgICAgIC8vICAgIHtzdHJpbmcuSm9pbihcIixcXG4gICAgXCIsIEdldE5vcm1hbGl6ZWRDb29yZGluYXRlcygpLlNlbGVjdCh0ID0+ICRcIih7dC54fSwge3QueX0pXCIpKX1cclxuICAgICAgICAvL319LCBcIlwiVW50aXRsZWQgT2JqZWN0XCJcIiwge0pTT04uU3RyaW5naWZ5KCRcInsoYWRqYWNlbmN5UnVsZXMuQWxsKGEgPT4gYSA9PSBBZGphY2VuY3lUeXBlLk9uZSkgPyBcIlwiIDogKHN0cmluZy5Db25jYXQoYWRqYWNlbmN5UnVsZXMuU2VsZWN0KGsgPT4gKGludClrKSkpICsgXCIgLT4gXCIpfXtzdHJpbmcuQ29uY2F0KGRlYWRSdWxlcy5TZWxlY3QoayA9PiBrID8gMSA6IDApKX0gLyB7c3RyaW5nLkNvbmNhdChsaXZpbmdSdWxlcy5TZWxlY3QoayA9PiBrID8gMSA6IDApKX1cIil9KVwiO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgSFRNTERpdkVsZW1lbnQgbW9kYWwsIG1vZGFsQ29udGVudCA9IFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIG5ldyBIVE1MRGl2RWxlbWVudCB7IENsYXNzTmFtZSA9IFwibW9kYWwtY29udGVudFwiIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgLkFkZFRvKG5ldyBIVE1MRGl2RWxlbWVudCB7IENsYXNzTmFtZSA9IFwibW9kYWwtZGlhbG9nXCIgfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgLkFkZFRvKG1vZGFsID0gbmV3IEhUTUxEaXZFbGVtZW50IHsgQ2xhc3NOYW1lID0gXCJtb2RhbFwiLCBTdHlsZSA9IHsgRGlzcGxheSA9IFwiaW5oZXJpdFwiIH0gfVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5BZGRUbyhEb2N1bWVudC5Cb2R5KVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIC8vICAgICAgICAgICAgbW9kYWxDb250ZW50LkFkZChcclxuXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgbmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcIm1vZGFsLWhlYWRlclwiXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgLkFkZChuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4tY2xvc2VcIixcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+IG1vZGFsLlJlbW92ZSgpXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgIC5BZGQobmV3IEhUTUxTcGFuRWxlbWVudFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIElubmVySFRNTCA9IFwiJnRpbWVzO1wiXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgKSxcclxuXHJcblxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIG5ldyBIVE1MUHJlRWxlbWVudFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJtb2RhbC1ib2R5XCIsXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgIFN0eWxlID1cclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgW1widXNlci1zZWxlY3RcIl0gPSBcInRleHRcIlxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgfS5BZGQoY29kZUdlbmVyYXRlZClcclxuICAgICAgICAvLyAgICAgICAgICAgICk7XHJcbiAgICAgICAgLy8gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFNhdmVBc1N0YXJ0ZXIgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEdsb2JhbC5Mb2NhbFN0b3JhZ2UuU2V0SXRlbShcclxuICAgICAgICAgICAgICAgIFwic3RhcnRlclBvc2l0aW9uc1wiLCBKc29uQ29udmVydC5TZXJpYWxpemVPYmplY3QoR2V0Q29vcmRpbmF0ZXNJbnRlcmFsKCkpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IFNldHRpbmdzUG9wdXAsIE5vdGFibGVPYmplY3RzUG9wdXA7XHJcbnB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgQ3JlYXRlUG9wdXAoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxEaXZFbGVtZW50e1N0eWxlID0ge0ZvbnRTaXplID0gXCIxLjVyZW1cIiwgQmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiLCBQb3NpdGlvbiA9IFBvc2l0aW9uLkZpeGVkLCBUb3AgPSBcIjBweFwiLCBMZWZ0ID0gXCIyNSVcIiwgV2lkdGggPSBcIjUwJVwiLCBIZWlnaHQgPSBcIjEwMCVcIiwgRGlzcGxheSA9IERpc3BsYXkuTm9uZSwgT3ZlcmZsb3cgPSBPdmVyZmxvdy5TY3JvbGx9fTtcclxufVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgUG9wdXBDb250YWluZXIgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgSFRNTERpdkVsZW1lbnQoKSwoX28xKT0+e19vMS5TdHlsZS5Qb3NpdGlvbj0gUG9zaXRpb24uRml4ZWQ7X28xLlN0eWxlLlRvcD0gXCIwXCI7X28xLlN0eWxlLkxlZnQ9IFwiMFwiO19vMS5TdHlsZS5XaWR0aD0gXCIxMDAlXCI7X28xLlN0eWxlW1wieC1pbmRleFwiXT0gOTk5OTk5O19vMS5TdHlsZS5IZWlnaHQ9IFwiMTAwJVwiO19vMS5TdHlsZS5CYWNrZ3JvdW5kQ29sb3I9IFwicmdiYSgwLCAwLCAwLCAwLjUpXCI7X28xLlN0eWxlLkRpc3BsYXk9IERpc3BsYXkuTm9uZTtyZXR1cm4gX28xO30pXHJcbixTZXR0aW5nc1BvcHVwID0gQ3JlYXRlUG9wdXAoKSlcclxuLE5vdGFibGVPYmplY3RzUG9wdXAgPSBDcmVhdGVQb3B1cCgpKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQnV0dG9uRWxlbWVudCBTZXR0aW5nc0J1dHRvbjtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQnV0dG9uRWxlbWVudCBQbGF5QnV0dG9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgSW52ZXJ0SXNQbGF5aW5nICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwbGF5aW5nID0gIXBsYXlpbmc7XHJcbiAgICAgICAgICAgIFBsYXlCdXR0b24uSW5uZXJIVE1MID0gcGxheWluZyA/IFwi4o+4XCIgOiBcIuKWtlwiO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBwbGF5aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbFtdIGxpdmluZ1J1bGVzID0gbmV3IGJvb2xbbWF4QWRqYWNlbnRDZWxscyArIDFdIHsgZmFsc2UsIGZhbHNlLCB0cnVlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlIH07XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sW10gZGVhZFJ1bGVzICAgICA9IG5ldyBib29sW21heEFkamFjZW50Q2VsbHMgKyAxXSB7IGZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UgfTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIEFkamFjZW5jeVR5cGVbXSBhZGphY2VuY3lSdWxlcyA9IG5ldyBBZGphY2VuY3lUeXBlW21heEFkamFjZW50Q2VsbHNdIHsgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSB9O1xyXG5wdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IENyZWF0ZUNhbnZhcygpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTENhbnZhc0VsZW1lbnR7V2lkdGggPSBzY3JlZW5XaWR0aCwgSGVpZ2h0ID0gc2NyZWVuSGVpZ2h0fTtcclxufXB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ3JlYXRlVG9wQ2FudmFzKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MQ2FudmFzRWxlbWVudHtXaWR0aCA9IHdpZHRoICsgMiwgSGVpZ2h0ID0gaGVpZ2h0ICsgMn07XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgZG91YmxlIGh5cG8oZG91YmxlIHgsIGRvdWJsZSB5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguU3FydChNYXRoLlBvdyh4LCAyKSArIE1hdGguUG93KHksIDIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBDcmVhdGVCb3R0b21DYW52YXMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgQm90dG9tQ2FudmFzID0gR3JpZCBpcyBIZXhHcmlkID9cclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MQ2FudmFzRWxlbWVudFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFdpZHRoID0gRE9NQ2FudmFzLldpZHRoICsgNCAqIHhNdWx0aXBsaWVyLFxyXG4gICAgICAgICAgICAgICAgICAgIEhlaWdodCA9IERPTUNhbnZhcy5IZWlnaHQgKyA0ICogeU11bHRpcGxpZXJcclxuICAgICAgICAgICAgICAgIH0gOlxyXG4gICAgICAgICAgICAgICAgbmV3IEhUTUxDYW52YXNFbGVtZW50XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgV2lkdGggPSBzY3JlZW5XaWR0aCArIDIgKiB4TXVsdGlwbGllcixcclxuICAgICAgICAgICAgICAgICAgICBIZWlnaHQgPSBzY3JlZW5IZWlnaHQgKyAyICogeU11bHRpcGxpZXJcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZhciBCb3R0b21DYW52YXNDb250ZXh0ID0gQm90dG9tQ2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlRyYW5zbGF0ZSgwLjUsIDAuNSk7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVdpZHRoID0gMTtcclxuSGV4R3JpZCBoOyAgICAgICAgICAgIGlmICgoaCA9IEdyaWQgYXMgSGV4R3JpZCkgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5TdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgICAgIGZvciAoaW50IGEgPSAtKGludCloeXBvKHdpZHRoLCBoZWlnaHQpOyBhIDwgKGludCloeXBvKHdpZHRoLCBoZWlnaHQpOyBhKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgYiA9IC0oaW50KWh5cG8od2lkdGgsIGhlaWdodCk7IGIgPCAoaW50KWh5cG8od2lkdGgsIGhlaWdodCk7IGIrKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbmludCB4O1xuaW50IHk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGguR2V0RHJhd1Bvc2l0aW9uKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oYSwgYikpLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkRyYXdIZXhhZ29uKHgsIHksIHhNdWx0aXBsaWVyICogMiAvIDMsIHN0cm9rZTogdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgVHJpYW5nbGVHcmlkIHQ7XHJcbiAgICBpZiAoKHQgPSBHcmlkIGFzIFRyaWFuZ2xlR3JpZCkgIT0gbnVsbClcclxuICAgIHtcclxuICAgICAgICBmb3IgKGludCBhID0gLShpbnQpaHlwbyh3aWR0aCwgaGVpZ2h0KTsgYSA8IChpbnQpaHlwbyh3aWR0aCwgaGVpZ2h0KTsgYSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yIChpbnQgYiA9IC0oaW50KWh5cG8od2lkdGgsIGhlaWdodCk7IGIgPCAoaW50KWh5cG8od2lkdGgsIGhlaWdodCk7IGIrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yIChUcmlhbmdsZUxvY2F0aW9uIHRsID0gVHJpYW5nbGVMb2NhdGlvbi5Ub3BMZWZ0OyB0bCA8IFRyaWFuZ2xlTG9jYXRpb24uQ291bnQ7IHRsKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW50IHg7XHJcbiAgICAgICAgICAgICAgICAgICAgaW50IHk7XHJcbiAgICAgICAgICAgICAgICAgICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdCh0LkdldERyYXdQb3NpdGlvbihuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+KGEsIGIsIHRsKSksIG91dCB4LCBvdXQgeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5EcmF3VHJpYW5nbGUoeCwgeSwgeE11bHRpcGxpZXIgKiAyIC8gMywgdGwsIHN0cm9rZTogdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAvL0hleEdyaWQgZ3JpZCA9IG5ldyBIZXhHcmlkKCk7XHJcbiAgICAvL2RvdWJsZSB4T2Zmc2V0ID0gd2lkdGggLyAyICogQXBwLnhNdWx0aXBsaWVyICsgb2Zmc2V0UG9zLnhcclxuICAgIC8vICAgICAsIHlPZmZzZXQgPSBoZWlnaHQgKiBBcHAueE11bHRpcGxpZXIgKyBvZmZzZXRQb3MueTtcclxuICAgIC8vaW50IG1pbldpZHRoID0gLTIsIG1pbkhlaWdodCA9IC0yO1xyXG4gICAgLy9pbnQgbWF4V2lkdGggPSAoaW50KU1hdGguQ2VpbGluZyhoeXBvKHdpZHRoLCBoZWlnaHQpKSwgbWF4SGVpZ2h0ID0gKGludClNYXRoLkNlaWxpbmcoaHlwbyh3aWR0aCwgaGVpZ2h0KSk7XHJcbiAgICAvL2ZvciAoaW50IF8zMGwgPSBtaW5XaWR0aCAtIDI7IF8zMGwgPD0gKG1heFdpZHRoICsgMik7IF8zMGwrKylcclxuICAgIC8ve1xyXG4gICAgLy8gICAgdmFyIHBvczEgPSBncmlkLkdldERyYXdQb3NpdGlvbigoXzMwbCwgbWluSGVpZ2h0IC0gMykpO1xyXG4gICAgLy8gICAgdmFyIHBvczIgPSBncmlkLkdldERyYXdQb3NpdGlvbigoXzMwbCwgbWF4SGVpZ2h0ICsgMykpO1xyXG4gICAgLy8gICAgQm90dG9tQ2FudmFzQ29udGV4dC5Nb3ZlVG8ocG9zMS54ICsgeE9mZnNldCwgcG9zMS55ICsgeU9mZnNldCk7XHJcbiAgICAvLyAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVUbyhwb3MyLnggKyB4T2Zmc2V0LCBwb3MyLnkgKyB5T2Zmc2V0KTtcclxuICAgIC8vfVxyXG4gICAgLy9mb3IgKGludCBfMzByID0gbWluSGVpZ2h0IC0gMjsgXzMwciA8PSAobWF4SGVpZ2h0ICsgMik7IF8zMHIrKylcclxuICAgIC8ve1xyXG4gICAgLy8gICAgdmFyIHBvczEgPSBncmlkLkdldERyYXdQb3NpdGlvbigobWluV2lkdGggLSAzLCBfMzByKSk7XHJcbiAgICAvLyAgICB2YXIgcG9zMiA9IGdyaWQuR2V0RHJhd1Bvc2l0aW9uKChtYXhXaWR0aCArIDMsIF8zMHIpKTtcclxuICAgIC8vICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTW92ZVRvKHBvczEueCArIHhPZmZzZXQsIHBvczEueSArIHlPZmZzZXQpO1xyXG4gICAgLy8gICAgQm90dG9tQ2FudmFzQ29udGV4dC5MaW5lVG8ocG9zMi54ICsgeE9mZnNldCwgcG9zMi55ICsgeU9mZnNldCk7XHJcbiAgICAvL31cclxuICAgIC8vZm9yIChpbnQgeSA9IG1pbkhlaWdodCAtIDI7IHkgPD0gKG1heEhlaWdodCArIDIpOyB5KyspXHJcbiAgICAvL3tcclxuICAgIC8vICAgIHZhciBwb3MxID0gZ3JpZC5HZXREcmF3UG9zaXRpb24oKC13aWR0aCAvIHhNdWx0aXBsaWVyLCB5KSk7XHJcbiAgICAvLyAgICB2YXIgcG9zMiA9IGdyaWQuR2V0RHJhd1Bvc2l0aW9uKCh5LCAtd2lkdGggLyB4TXVsdGlwbGllcikpO1xyXG4gICAgLy8gICAgQm90dG9tQ2FudmFzQ29udGV4dC5Nb3ZlVG8ocG9zMS54ICsgeE9mZnNldCwgcG9zMS55ICsgeU9mZnNldCk7XHJcbiAgICAvLyAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVUbyhwb3MyLnggKyB4T2Zmc2V0LCBwb3MyLnkgKyB5T2Zmc2V0KTtcclxuICAgIC8vfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoR3JpZCBpcyBTcXVhcmVHcmlkKVxyXG4gICAge1xyXG4gICAgICAgIGZvciAoaW50IHggPSAwOyB4IDw9ICh3aWR0aCArIDIpOyB4KyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbyh4ICogeE11bHRpcGxpZXIsIDApO1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVUbyh4ICogeE11bHRpcGxpZXIsIChoZWlnaHQgKyAzKSAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoaW50IHkgPSAwOyB5IDw9IChoZWlnaHQgKyAyKTsgeSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5Nb3ZlVG8oMCwgeSAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5MaW5lVG8oKHdpZHRoICsgMykgKiB4TXVsdGlwbGllciwgeSAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8IDEwOyBuKyspXHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlN0cm9rZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gQm90dG9tQ2FudmFzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBET01DYW52YXMgPSBDcmVhdGVDYW52YXMoKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBET01DYW52YXNDb250ZXh0ID0gRE9NQ2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEdyaWQgR3JpZCA9IG5ldyBUcmlhbmdsZUdyaWQoKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gb2Zmc2V0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IE1vdXNlUG9zICh0aGlzIE1vdXNlRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciByZWN0ID0gRE9NQ2FudmFzLkdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KShlLkNsaWVudFggLSByZWN0LkxlZnQpLCAoaW50KShlLkNsaWVudFkgLSByZWN0LlRvcCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgTmVnRGl2IChpbnQgYSwgaW50IGIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgcmVzID0gYSAvIGI7XHJcbiAgICAgICAgICAgIHJldHVybiAoYSA8IDAgJiYgYSAhPSBiICogcmVzKSA/IHJlcyAtIDEgOiByZXM7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIGRvdWJsZSBOZWdEaXZEb3VibGUoZG91YmxlIGEsIGRvdWJsZSBiKVxyXG57XHJcbiAgICByZXR1cm4gYSA+PSAwID8gYSAvIGIgOiAoYSAtIGIgKyAxKSAvIGI7XHJcbn1cclxuICAgICAgICBwdWJsaWMgY29uc3QgaW50IG1heEFkamFjZW50Q2VsbHMgPSAxMjtcclxucHVibGljIHN0YXRpYyBpbnQgY3VycmVudE1heEFkamFjZW50Q2VsbHNcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIEdyaWQgaXMgSGV4R3JpZCA/IDYgOiBHcmlkIGlzIFNxdWFyZUdyaWQgPyA4IDogR3JpZCBpcyBUcmlhbmdsZUdyaWQgPyAxMiA6ICgoU3lzdGVtLkZ1bmM8aW50PikoKCkgPT5cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEV4Y2VwdGlvbihzdHJpbmcuRm9ybWF0KFwiR3JpZCB0eXBlIG5vdCBmb3VuZDogezB9XCIsR3JpZC5HZXRUeXBlKCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICkpKCk7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBzdGF0aWMgTGlzdDxIVE1MU2VsZWN0RWxlbWVudD4gYWRqYWNlbmN5UnVsZXNDZWxscyA9IG5ldyBMaXN0PEhUTUxTZWxlY3RFbGVtZW50PigpO1xyXG4gICAgICAgIHN0YXRpYyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPEhUTUxJbnB1dEVsZW1lbnQsSFRNTElucHV0RWxlbWVudD4+IG9wdGlvbkNlbGxzID0gbmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SFRNTElucHV0RWxlbWVudCxIVE1MSW5wdXRFbGVtZW50Pj4oKTtcclxuXHJcbiAgICAgICAgc3RhdGljIHZvaWQgQXBwbHlQcmVzZXQoYm9vbFtdIGxpdmluZ1J1bGVzLCBib29sW10gZGVhZFJ1bGVzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPD0gODsgbisrKVxyXG4gICAgICAgICAgICB7XHJcbm9wdGlvbkNlbGxzW25dLkl0ZW0xLlNldEJvb2xWYWx1ZShsaXZpbmdSdWxlc1tuXSk7XHJcbm9wdGlvbkNlbGxzW25dLkl0ZW0yLlNldEJvb2xWYWx1ZShkZWFkUnVsZXNbbl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZW51bSBNb2RhbFR5cGVcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNldHRpbmdzLFxyXG4gICAgICAgICAgICBOb3RhYmxlT2JqZWN0c1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFNob3dNb2RhbCAoTW9kYWxUeXBlIG1vZGFsVHlwZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFBvcHVwQ29udGFpbmVyLlN0eWxlLkRpc3BsYXkgPSBcIlwiO1xyXG4gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCB0b1Nob3c7XHJcbiAgICAgICAgICAgIHN3aXRjaCAobW9kYWxUeXBlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1vZGFsVHlwZS5TZXR0aW5nczpcclxuICAgICAgICAgICAgICAgICAgICB0b1Nob3cgPSBTZXR0aW5nc1BvcHVwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNb2RhbFR5cGUuTm90YWJsZU9iamVjdHM6XHJcbiAgICAgICAgICAgICAgICAgICAgdG9TaG93ID0gTm90YWJsZU9iamVjdHNQb3B1cDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEFyZ3VtZW50RXhjZXB0aW9uKCgoaW50KW1vZGFsVHlwZSkuVG9TdHJpbmcoKSwgXCJtb2RhbFR5cGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yZWFjaCAoSFRNTERpdkVsZW1lbnQgZGl2IGluIG5ld1tdIHsgU2V0dGluZ3NQb3B1cCwgTm90YWJsZU9iamVjdHNQb3B1cCB9KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkaXYuU3R5bGUuRGlzcGxheSA9IGRpdiA9PSB0b1Nob3cgPyBcIlwiIDogXCJub25lXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBIaWRlTW9kYWwgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFBvcHVwQ29udGFpbmVyLlN0eWxlLkRpc3BsYXkgPSBEaXNwbGF5Lk5vbmU7XHJcbiAgICAgICAgICAgIFNldHRpbmdzUG9wdXAuU3R5bGUuRGlzcGxheSA9IERpc3BsYXkuTm9uZTtcclxuICAgICAgICAgICAgTm90YWJsZU9iamVjdHNQb3B1cC5TdHlsZS5EaXNwbGF5ID0gRGlzcGxheS5Ob25lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBEcmF3U2hhcGUgKEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gU3F1YXJlcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCB4TXVsdGlwbGllciA9IEFwcC54TXVsdGlwbGllciAqIDI7XHJcbiAgICAgICAgICAgIGludCB5TXVsdGlwbGllciA9IEFwcC55TXVsdGlwbGllciAqIDI7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXR0aW5nIHdpZHRoIGFuZCBoZWlnaHQgb2Ygc2hhcGVcclxuICAgICAgICAgICAgaW50IHdpZHRoID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5NYXg8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4+KFNxdWFyZXMsKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4saW50PikocyA9PiBzLkl0ZW0xKSkgKyAxO1xyXG4gICAgICAgICAgICBpbnQgaGVpZ2h0ID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5NYXg8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4+KFNxdWFyZXMsKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4saW50PikocyA9PiBzLkl0ZW0yKSkgKyAxO1xyXG4gICAgICAgICAgICAvLyBEcmF3aW5nIG9uIGlubmVyIGNhbnZhc1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBpbm5lckNhbnZhcyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBXaWR0aCA9IHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgSGVpZ2h0ID0gaGVpZ2h0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBjb250ZXh0ID0gaW5uZXJDYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIFVpbnQ4Q2xhbXBlZEFycmF5IGltYWdlRGF0YUFycmF5ID0gQ3JlYXRlSW1hZ2VEYXRhQXJyYXkod2lkdGgsIGhlaWdodCk7XHJcbmZvcmVhY2ggKHZhciBfZDEgaW4gU3F1YXJlcylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2QxLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaW1hZ2VEYXRhQXJyYXlbKHggKyB5ICogd2lkdGgpICogNCArIDNdID0gMjU1O1xyXG59XG4gICAgICAgICAgICBJbWFnZURhdGEgaW1hZ2VEYXRhID0gbmV3IEltYWdlRGF0YShpbWFnZURhdGFBcnJheSwgKHVpbnQpd2lkdGgsICh1aW50KWhlaWdodCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuUHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XHJcbiAgICAgICAgICAgIC8vIFJlc2l6aW5nIHRvIHVwcGVyIGNhbnZhc1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBvdXRlckNhbnZhcyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBXaWR0aCA9IHdpZHRoICogeE11bHRpcGxpZXIsXHJcbiAgICAgICAgICAgICAgICBIZWlnaHQgPSBoZWlnaHQgKiB5TXVsdGlwbGllclxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgb3V0ZXJDb250ZXh0ID0gb3V0ZXJDYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIG91dGVyQ29udGV4dC5JbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgb3V0ZXJDb250ZXh0LkRyYXdJbWFnZShpbm5lckNhbnZhcywgMCwgMCwgb3V0ZXJDYW52YXMuV2lkdGgsIG91dGVyQ2FudmFzLkhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gb3V0ZXJDYW52YXM7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIFVpbnQ4Q2xhbXBlZEFycmF5IENyZWF0ZUltYWdlRGF0YUFycmF5KGludCB3aWR0aCwgaW50IGhlaWdodClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBVaW50OENsYW1wZWRBcnJheSh3aWR0aCAqIGhlaWdodCAqIDQpO1xyXG59cHVibGljIHN0YXRpYyBIVE1MSW5wdXRFbGVtZW50IENyZWF0ZUNoZWNrYm94KClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MSW5wdXRFbGVtZW50e1R5cGUgPSBJbnB1dFR5cGUuQ2hlY2tib3gsIFN0eWxlID0ge1dpZHRoID0gXCIxcmVtXCIsIEhlaWdodCA9IFwiMWVtXCJ9fTtcclxufXB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgQ3JlYXRlMDFTZWxlY3RvcigpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTFNlbGVjdEVsZW1lbnQoKS5BZGQ8SFRNTFNlbGVjdEVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudHtWYWx1ZSA9IFwiZmFsc2VcIn0sXCIwXCIpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcInRydWVcIn0sXCIxXCIpKTtcclxufXB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgQ3JlYXRlMDEyU2VsZWN0b3IoKVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MU2VsZWN0RWxlbWVudD4obmV3IEhUTUxTZWxlY3RFbGVtZW50KCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCIwXCJ9LFwiMFwiKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCIxXCJ9LFwiMVwiKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCIyXCJ9LFwiMlwiKSk7XHJcbn1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IGFkamFjZW5jeVJ1bGVzVGFibGVEaXYgPSBuZXcgSFRNTERpdkVsZW1lbnQoKSwgcnVsZXNUYWJsZURpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCgpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbiAoKVxyXG4gICAgICAgIHtcclxuU3lzdGVtLkFjdGlvbjxNb3VzZUV2ZW50PEhUTUxDYW52YXNFbGVtZW50Pj4gUHJvY2Vzc01vdXNlRXZlbnQgPSBudWxsO1xuICAgICAgICAgICAgb2JqZWN0IHJ1bGVzT2JqZWN0U3RyID0gR2xvYmFsLkxvY2FsU3RvcmFnZS5HZXRJdGVtKFwicnVsZXNcIik7XHJcbnN0cmluZyByOyAgICAgICAgICAgIGlmICgociA9IHJ1bGVzT2JqZWN0U3RyIGFzIHN0cmluZykgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pYyBydWxlc09iaiA9IEpTT04uUGFyc2Uocik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bGVzT2JqZWN0U3RyICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoU2NyaXB0LldyaXRlKFwiezB9IGluc3RhbmNlb2YgQXJyYXlcIiwgcnVsZXNPYmoubGl2aW5nUnVsZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29sW10gZGVzZXJpYWxpemVkID0gSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8Ym9vbFtdPihKU09OLlN0cmluZ2lmeShydWxlc09iai5saXZpbmdSdWxlcykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkuQ29weShkZXNlcmlhbGl6ZWQsIGxpdmluZ1J1bGVzLCBkZXNlcmlhbGl6ZWQuTGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoU2NyaXB0LldyaXRlKFwiezB9IGluc3RhbmNlb2YgQXJyYXlcIiwgcnVsZXNPYmouZGVhZFJ1bGVzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9vbFtdIGRlc2VyaWFsaXplZCA9IEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PGJvb2xbXT4oSlNPTi5TdHJpbmdpZnkocnVsZXNPYmouZGVhZFJ1bGVzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5Db3B5KGRlc2VyaWFsaXplZCwgZGVhZFJ1bGVzLCBkZXNlcmlhbGl6ZWQuTGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoU2NyaXB0LldyaXRlKFwiezB9IGluc3RhbmNlb2YgQXJyYXlcIiwgcnVsZXNPYmouYWRqYWNlbmN5UnVsZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBZGphY2VuY3lUeXBlW10gZGVzZXJpYWxpemVkID0gSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8QWRqYWNlbmN5VHlwZVtdPihKU09OLlN0cmluZ2lmeShydWxlc09iai5hZGphY2VuY3lSdWxlcykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkuQ29weShkZXNlcmlhbGl6ZWQsIGFkamFjZW5jeVJ1bGVzLCBkZXNlcmlhbGl6ZWQuTGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIHsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuU3R5bGVbXCJ1c2VyLXNlbGVjdFwiXSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5IZWFkLkFwcGVuZENoaWxkKG5ldyBIVE1MTGlua0VsZW1lbnQgeyBSZWwgPSBcInN0eWxlc2hlZXRcIiwgSHJlZiA9IFwiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9ib290c3RyYXBANS4yLjAvZGlzdC9jc3MvYm9vdHN0cmFwLm1pbi5jc3NcIiB9KTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5TdHlsZS5NYXJnaW4gPSBcIjBweFwiO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKFBvcHVwQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChuZXcgSFRNTFN0eWxlRWxlbWVudCB7IElubmVySFRNTCA9IFwidGQsIHRoIHsgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7IHBhZGRpbmc6IDVweCB9IGJ1dHRvbiB7IG1hcmdpbi1yaWdodDogNXB4IH1cIiB9KTtcclxuXHJcbiAgICAgICAgICAgIEhUTUxUYWJsZUVsZW1lbnQgYWRqYWNlbmN5UnVsZXNUYWJsZSA9IG5ldyBIVE1MVGFibGVFbGVtZW50IHsgU3R5bGUgPSB7IE1hcmdpbkxlZnQgPSBcImF1dG9cIiwgTWFyZ2luUmlnaHQgPSBcImF1dG9cIiB9IH07XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChHcmlkIGlzIFRyaWFuZ2xlR3JpZClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8IDEyOyBuKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgbmFtZSA9IG4gPCA2ID8gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLlRvQ2FtZWxTdHJpbmc8VHJpYW5nbGVMb2NhdGlvbj4oKChUcmlhbmdsZUxvY2F0aW9uKW4pKSA6IHN0cmluZy5Gb3JtYXQoXCJQb3NpdGlvbiB7MH1cIixuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXNDZWxscy5BZGQoQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxTZWxlY3RFbGVtZW50PihDcmVhdGUwMTJTZWxlY3RvcigpLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlUm93RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVSb3dFbGVtZW50PihuZXcgSFRNTFRhYmxlUm93RWxlbWVudCgpLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCksbmFtZSkpLGFkamFjZW5jeVJ1bGVzVGFibGUpKSkuU2V0QWRqYWNlbmN5VmFsdWUoYWRqYWNlbmN5UnVsZXNbbl0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW50IG4gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IHkgPSAwOyB5IDwgMzsgeSsrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgSFRNTFRhYmxlUm93RWxlbWVudCByb3cgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlUm93RWxlbWVudD4obmV3IEhUTUxUYWJsZVJvd0VsZW1lbnQoKSxhZGphY2VuY3lSdWxlc1RhYmxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgeCA9IDA7IHggPCAzOyB4KyspXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4ID09IDEgJiYgeSA9PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5BcHBlbmRDaGlsZChuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXNDZWxscy5BZGQoQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxTZWxlY3RFbGVtZW50PihDcmVhdGUwMTJTZWxlY3RvcigpLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSxyb3cpKS5TZXRBZGphY2VuY3lWYWx1ZShhZGphY2VuY3lSdWxlc1tuXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbisrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzVGFibGVEaXYuQ2xlYXIoKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXNUYWJsZURpdixhZGphY2VuY3lSdWxlc1RhYmxlKTtcclxuXHJcbiAgICAgICAgICAgIEhUTUxUYWJsZUVsZW1lbnQgcnVsZXNUYWJsZSA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlRWxlbWVudD4oXHJcbm5ldyBIVE1MVGFibGVFbGVtZW50IHsgU3R5bGUgPSB7IE1hcmdpbkxlZnQgPSBcImF1dG9cIiwgTWFyZ2luUmlnaHQgPSBcImF1dG9cIiB9IH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVSb3dFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVSb3dFbGVtZW50KCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQoKSxcIiNcIiksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50KCksXCJMXCIpLFxyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudCgpLFwiRFwiKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgcnVsZXNUYWJsZURpdi5DbGVhcigpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBydWxlc1RhYmxlRGl2LHJ1bGVzVGFibGUpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPD0gY3VycmVudE1heEFkamFjZW50Q2VsbHM7IG4rKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSFRNTFRhYmxlUm93RWxlbWVudCByb3cgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlUm93RWxlbWVudD4obmV3IEhUTUxUYWJsZVJvd0VsZW1lbnQoKSxydWxlc1RhYmxlKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVSb3dFbGVtZW50PiggICAgICAgICAgICAgICAgcm93LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCksbi5Ub1N0cmluZygpKSk7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25DZWxscy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPEhUTUxJbnB1dEVsZW1lbnQsIEhUTUxJbnB1dEVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MSW5wdXRFbGVtZW50PihDcmVhdGVDaGVja2JveCgpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCksIHJvdykpLlNldEJvb2xWYWx1ZShsaXZpbmdSdWxlc1tuXSksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MSW5wdXRFbGVtZW50PihDcmVhdGVDaGVja2JveCgpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCksIHJvdykpLlNldEJvb2xWYWx1ZShkZWFkUnVsZXNbbl0pKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nICxib29sW10gLGJvb2xbXSA+PiBwcmVzZXRzTGlzdCA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZyAsYm9vbFtdICxib29sW10gPj4oKSwoX28xKT0+e19vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZywgYm9vbFtdLCBib29sW10+KFwiQ29ud2F5J3MgR2FtZSBvZiBMaWZlIFByZXNldFwiLCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0sIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0pKTtfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcsIGJvb2xbXSwgYm9vbFtdPihcIkltbW9ydGFsIENlbGxzIFByZXNldFwiLCBuZXcgYm9vbFs5XXt0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlfSwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO19vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZywgYm9vbFtdLCBib29sW10+KFwiQWxtb3N0IEltbW9ydGFsIENlbGxzIFByZXNldFwiLCBuZXcgYm9vbFs5XXt0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCBmYWxzZX0sIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0pKTtfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcsIGJvb2xbXSwgYm9vbFtdPihcIkFsdGVybmF0ZSBDb253YXkncyBHYW1lIG9mIExpZmUgUHJlc2V0XCIsIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2V9KSk7cmV0dXJuIF9vMTt9KTtcclxuXHJcbiAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IHByZXNldHNEaXYgPSBuZXcgSFRNTERpdkVsZW1lbnQgeyBTdHlsZSA9IHsgVGV4dEFsaWduID0gVGV4dEFsaWduLkNlbnRlciB9IH07XHJcbmZvcmVhY2ggKHZhciBfZDIgaW4gcHJlc2V0c0xpc3QpXHJcbntcclxuICAgIHN0cmluZyBuYW1lO1xyXG4gICAgYm9vbFtdIGxpdmluZ1J1bGVzO1xyXG4gICAgYm9vbFtdIGRlYWRSdWxlcztcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2QyLCBvdXQgbmFtZSwgb3V0IGxpdmluZ1J1bGVzLCBvdXQgZGVhZFJ1bGVzKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIHByZXNldHNEaXYsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50KCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQW5jaG9yRWxlbWVudD4obmV3IEhUTUxBbmNob3JFbGVtZW50e0hyZWYgPSBcImphdmFzY3JpcHQ6dm9pZCgwKVwiLCBTdHlsZSA9IHtGb250U2l6ZSA9IFwiMXJlbVwifSwgT25DbGljayA9IGUgPT4gQXBwbHlQcmVzZXQobGl2aW5nUnVsZXM6IGxpdmluZ1J1bGVzLCBkZWFkUnVsZXM6IGRlYWRSdWxlcyl9LG5hbWUpKSk7XHJcbn1cbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KFxyXG5cclxuICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEZXRhaWxzRWxlbWVudD4oXHJcbiAgICAgICAgICAgICAgICBuZXcgSFRNTERldGFpbHNFbGVtZW50IHsgT3BlbiA9IHRydWV9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFN1bW1hcnlFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MU3VtbWFyeUVsZW1lbnQoKSxcIkFkamFjZW5jeSBSdWxlc1wiKSxcclxuICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlc1RhYmxlRGl2XHJcbiAgICAgICAgICAgICAgICApLFxyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEZXRhaWxzRWxlbWVudD4oXHJcbiAgICAgICAgICAgICAgICBuZXcgSFRNTERldGFpbHNFbGVtZW50IHsgT3BlbiA9IHRydWUgfSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxTdW1tYXJ5RWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFN1bW1hcnlFbGVtZW50KCksXCJSdWxlc1wiKSxcclxuICAgICAgICAgICAgICAgICAgICBydWxlc1RhYmxlRGl2XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIFNldHRpbmdzUG9wdXAsbmV3IEhUTUxCUkVsZW1lbnQoKSwgcHJlc2V0c0RpdiwgbmV3IEhUTUxCUkVsZW1lbnQoKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIFNldHRpbmdzUG9wdXAsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsXHJcbiAgICAgICAgICAgICAgICBPbkNsaWNrID0gZSA9PlxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDwgbWF4QWRqYWNlbnRDZWxsczsgbisrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXNbbl0gPSBhZGphY2VuY3lSdWxlc0NlbGxzW25dLkFkamFjZW5jeVZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDw9IG1heEFkamFjZW50Q2VsbHM7IG4rKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpdmluZ1J1bGVzW25dID0gb3B0aW9uQ2VsbHNbbl0uSXRlbTEuQm9vbFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYWRSdWxlc1tuXSA9IG9wdGlvbkNlbGxzW25dLkl0ZW0yLkJvb2xWYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBHbG9iYWwuTG9jYWxTdG9yYWdlLlNldEl0ZW0oXCJydWxlc1wiLCBKc29uQ29udmVydC5TZXJpYWxpemVPYmplY3QobmV3XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXZpbmdSdWxlcyA9IGxpdmluZ1J1bGVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWFkUnVsZXMgPSBkZWFkUnVsZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzID0gYWRqYWNlbmN5UnVsZXNcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgSGlkZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXCJTYXZlIENoYW5nZXNcIikpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihcclxuICAgICAgICAgICAgTm90YWJsZU9iamVjdHNQb3B1cCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLWxpZ2h0XCIsXHJcbiAgICAgICAgICAgICAgICBTdHlsZSA9IHsgQ3NzRmxvYXQgPSBGbG9hdC5SaWdodCB9LFxyXG4gICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT4gSGlkZU1vZGFsKClcclxuICAgICAgICAgICAgfSxcIuKdjFwiKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIE5vdGFibGVPYmplY3RzUG9wdXAsbmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFN0eWxlID0geyBDbGVhciA9IENsZWFyLkJvdGggfVxyXG4gICAgICAgICAgICB9KTtcclxuZm9yZWFjaCAodmFyIF9kMyBpbiBOb3RhYmxlT2JqZWN0c0xpc3QuTm90YWJsZU9iamVjdHMpXHJcbntcclxuICAgIEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PiBvYmplY3REZXRhaWxzO1xyXG4gICAgc3RyaW5nIGRlc2NyaXB0aW9uO1xyXG4gICAgc3RyaW5nIHJ1bGVzO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDMsIG91dCBvYmplY3REZXRhaWxzLCBvdXQgZGVzY3JpcHRpb24sIG91dCBydWxlcyk7XHJcbiAgICBIVE1MRGl2RWxlbWVudCBvYmplY3RJbmZvID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnR7U3R5bGUgPSB7V2lkdGggPSBcIjMwcmVtXCJ9fSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudHtTdHlsZSA9IHtEaXNwbGF5ID0gRGlzcGxheS5GbGV4LCBBbGlnbkl0ZW1zID0gQWxpZ25JdGVtcy5DZW50ZXIsIEZsZXhEaXJlY3Rpb24gPSBGbGV4RGlyZWN0aW9uLkNvbHVtbn19LE5vdGFibGVPYmplY3RzUG9wdXApKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50e1N0eWxlID0ge0Rpc3BsYXkgPSBEaXNwbGF5LkZsZXgsIEFsaWduSXRlbXMgPSBBbGlnbkl0ZW1zLkNlbnRlciwgRmxleERpcmVjdGlvbiA9IEZsZXhEaXJlY3Rpb24uQ29sdW1ufX0sRHJhd1NoYXBlKG9iamVjdERldGFpbHMpKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCgpLGRlc2NyaXB0aW9uKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLHJ1bGVzKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sbmV3IEhUTUxCUkVsZW1lbnQoKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLG5ldyBIVE1MQlJFbGVtZW50KCkpO1xyXG59XG5cclxuICAgICAgICAgICAgSFRNTERpdkVsZW1lbnQgYmFja2dyb3VuZERpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCB7IFN0eWxlID0geyBQb3NpdGlvbiA9IFBvc2l0aW9uLlJlbGF0aXZlLCBNaW5XaWR0aCA9IFwiMFwiLCBNaW5IZWlnaHQgPSBcIjBcIiB9fTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLk92ZXJmbG93ID0gT3ZlcmZsb3cuSGlkZGVuO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuWkluZGV4ID0gXCItMVwiO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuUG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5MZWZ0ID0gXCIwcHhcIjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLlRvcCA9IFwiMHB4XCI7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIGJhY2tncm91bmREaXYsRE9NQ2FudmFzKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgYmFja2dyb3VuZERpdixIb3RiYXIpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBiYWNrZ3JvdW5kRGl2LFJpZ2h0SG90YmFyKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChiYWNrZ3JvdW5kRGl2KTtcclxuXHJcbiAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhZ2dpbmdQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IG9yaWdpbmFsUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgYm9vbCBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5Pbk1vdXNlRG93biA9IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSB0cnVlO1xyXG5pbnQgeDtcbmludCB5O1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChlLk1vdXNlUG9zKCksIG91dCB4LCBvdXQgeSk7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZ1BvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCAtIG9mZnNldFBvcy5JdGVtMSwgeSAtIG9mZnNldFBvcy5JdGVtMik7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFBvcyA9IG9mZnNldFBvcztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLk9uTW91c2VVcCA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMS0gb3JpZ2luYWxQb3MuSXRlbTEpID4geE11bHRpcGxpZXIgfHwgTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0yLSBvcmlnaW5hbFBvcy5JdGVtMikgPiB5TXVsdGlwbGllcilcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmdQb3MgPSBvZmZzZXRQb3M7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5Pbk1vdXNlTW92ZSA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKChlLkJ1dHRvbnMgJiAxKSA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBpZiAoZHJhZ2dpbmdQb3MgPT0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKSkgZHJhZ2dpbmdQb3MgPSBlLk1vdXNlUG9zKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbW91c2VQb3MgPSBlLk1vdXNlUG9zKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0xLSBvcmlnaW5hbFBvcy5JdGVtMSkgPiB4TXVsdGlwbGllciB8fCBNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTEtIG9yaWdpbmFsUG9zLkl0ZW0xKSA+IHlNdWx0aXBsaWVyKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KG1vdXNlUG9zLkl0ZW0xIC0gZHJhZ2dpbmdQb3MuSXRlbTEsIG1vdXNlUG9zLkl0ZW0yIC0gZHJhZ2dpbmdQb3MuSXRlbTIpO1xyXG4gICAgICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgICAgICB9O1xyXG5Qcm9jZXNzTW91c2VFdmVudCA9IChlKSA9PlxyXG57XHJcbiAgICAvL2lmICgoQGV2ZW50LkJ1dHRvbnMgJiAxKSA9PSAwKSByZXR1cm47XHJcbiAgICB2YXIgbW91c2VQb3MgPSBlLk1vdXNlUG9zKCk7XHJcbiAgICBHcmlkLkhhbmRsZUNsaWNrKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4obW91c2VQb3MuSXRlbTEgLSBvZmZzZXRQb3MuSXRlbTEsIG1vdXNlUG9zLkl0ZW0yIC0gb2Zmc2V0UG9zLkl0ZW0yKSwgU3F1YXJlVHlwZVBsYWNpbmcpO1xyXG4gICAgRHJhdygpO1xyXG59XHJcblxyXG47XG4gICAgICAgICAgICBET01DYW52YXMuT25DbGljayA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoYW5naW5nSW50ZW50KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFByb2Nlc3NNb3VzZUV2ZW50KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBHbG9iYWwuU2V0SW50ZXJ2YWwoKEFjdGlvbilOZXh0RnJhbWUsIDEwMCk7XHJcblxyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgdXBkYXRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIEhhc0RpdmlkZXJzICh0aGlzIERpY3Rpb25hcnk8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiwgRGl2aWRlcnNJbmZvPiBkaXZpZGVycywgaW50IHgsIGludCB5LCBpbnQgTClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIERpdmlkZXJzSW5mbyB0b0NoZWNrO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKEwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICB4LS07XHJcbiAgICAgICAgICAgICAgICAgICAgeS0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgeS0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uQm90dG9tO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHktLTtcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgIHgtLTtcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLlJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDY6XHJcbiAgICAgICAgICAgICAgICAgICAgeC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b207XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDg6XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b21SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG5EaXZpZGVyc0luZm8gZGl2aWRlcnNJbmZvO1xuICAgICAgICAgICAgcmV0dXJuIGRpdmlkZXJzLlRyeUdldFZhbHVlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSksIG91dCBkaXZpZGVyc0luZm8pICYmIChkaXZpZGVyc0luZm8gJiB0b0NoZWNrKSAhPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLEdyaWRUeXBlICxIVE1MQ2FudmFzRWxlbWVudCA+IExhc3RCb3R0b21DYW52YXMgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBHcmlkVHlwZSwgSFRNTENhbnZhc0VsZW1lbnQ+KDAsIEdyaWRUeXBlLkNvdW50LCBudWxsKTtcclxucHVibGljIHN0YXRpYyBieXRlIEdldFNxdWFyZVR5cGVBbHBoYShTcXVhcmVUeXBlIHNxdWFyZVR5cGUpXHJcbntcclxuICAgIHJldHVybiAoYnl0ZSkoc3F1YXJlVHlwZSA9PSBTcXVhcmVUeXBlLkNlbGwgPyAyNTUgOiBzcXVhcmVUeXBlID09IFNxdWFyZVR5cGUuQnJpY2sgPyAxNzAgOiBzcXVhcmVUeXBlID09IFNxdWFyZVR5cGUuSW1tb3J0YWxDZWxsID8gODUgOiAoKFN5c3RlbS5GdW5jPGludD4pKCgpID0+XHJcbiAgICB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlVua25vd24gc3F1YXJlIHR5cGVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgKSkoKSk7XHJcbn1cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBEcmF3KClcclxuICAgICAgICB7XHJcblN5c3RlbS5BY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+PyA+IERyYXdNYXJrZXIgPSBudWxsO1xuU3lzdGVtLkFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUsIGRvdWJsZT4/ICwgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+PyA+IERyYXdMaW5lID0gbnVsbDtcblN5c3RlbS5GdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiwgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+PyA+IEdldEZpbmFsRHJhd1BvcyA9IG51bGw7XG5TeXN0ZW0uRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4sIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj8gPiBHZXRET01EcmF3UG9zID0gbnVsbDtcblN5c3RlbS5GdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiwgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PyA+IEdldERyYXdQb3MgPSBudWxsO1xuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgVG9wQ2FudmFzID0gQ3JlYXRlVG9wQ2FudmFzKCk7XHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IEJvdHRvbUNhbnZhcyA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChMYXN0Qm90dG9tQ2FudmFzLkl0ZW0xPT0geE11bHRpcGxpZXIgJiYgTGFzdEJvdHRvbUNhbnZhcy5JdGVtMj09IEN1cnJlbnRHcmlkVHlwZSlcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhcyA9IExhc3RCb3R0b21DYW52YXMuSXRlbTM7XHJcbiAgICAgICAgICAgIGlmIChCb3R0b21DYW52YXMgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzID0gQ3JlYXRlQm90dG9tQ2FudmFzKCk7XHJcbiAgICAgICAgICAgICAgICBMYXN0Qm90dG9tQ2FudmFzID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgR3JpZFR5cGUsIEhUTUxDYW52YXNFbGVtZW50Pih4TXVsdGlwbGllciwgQ3VycmVudEdyaWRUeXBlLCBCb3R0b21DYW52YXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBUb3BDYW52YXNDb250ZXh0ID0gVG9wQ2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkNsZWFyUmVjdCgwLCAwLCBET01DYW52YXMuV2lkdGgsIERPTUNhbnZhcy5IZWlnaHQpO1xyXG5pbnQgb2Zmc2V0WDtcbmludCBvZmZzZXRZO1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChvZmZzZXRQb3MsIG91dCBvZmZzZXRYLCBvdXQgb2Zmc2V0WSk7XHJcbkdldERyYXdQb3MgPSAocG9zKSA9PlxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChwb3MsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpbnQgZHJhd1ggPSB4ICsgKG9mZnNldFggLyB4TXVsdGlwbGllcikgKyAxLCBkcmF3WSA9IHkgKyAob2Zmc2V0WSAvIHlNdWx0aXBsaWVyKSArIDE7XHJcbiAgICBpZiAoZHJhd1ggPCAwIHx8IGRyYXdYID49IHdpZHRoICsgMiB8fCBkcmF3WSA8IDAgfHwgZHJhd1kgPj0gaGVpZ2h0ICsgMilcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGRyYXdYLCBkcmF3WSk7XHJcbn1cclxuXHJcbjtcbkdldERPTURyYXdQb3MgPSAocG9zKSA9PlxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChwb3MsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpbnQgZHJhd1ggPSB4ICsgb2Zmc2V0WCwgZHJhd1kgPSB5ICsgb2Zmc2V0WTtcclxuICAgIGlmIChkcmF3WCA8IDAgfHwgZHJhd1ggPj0gc2NyZWVuV2lkdGggfHwgZHJhd1kgPCAwIHx8IGRyYXdZID49IHNjcmVlbkhlaWdodClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGRyYXdYLCBkcmF3WSk7XHJcbn1cclxuXHJcbjtcblNxdWFyZUdyaWQgc3F1YXJlR3JpZDsgICAgICAgICAgICBpZiAoKHNxdWFyZUdyaWQgPSBHcmlkIGFzIFNxdWFyZUdyaWQpICE9IG51bGwpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRVaW50OENsYW1wZWRBcnJheSBpbWFnZURhdGFBcnJheSA9IENyZWF0ZUltYWdlRGF0YUFycmF5KHdpZHRoICsgMiwgaGVpZ2h0ICsgMik7XHJcbmZvcmVhY2ggKHZhciBfZDQgaW4gc3F1YXJlR3JpZC5TcXVhcmVzKVxyXG57XHJcbiAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4gcG9zO1xyXG4gICAgU3F1YXJlVHlwZSBzcXVhcmVUeXBlO1xyXG4gICAgX2Q0LkRlY29uc3RydWN0KG91dCBwb3MsIG91dCBzcXVhcmVUeXBlKTtcclxuICAgIHZhciBkcmF3UG9zID0gR2V0RHJhd1Bvcyhwb3MpO1xyXG4gICAgaWYgKGRyYXdQb3MgPT0gbnVsbClcclxuICAgICAgICBjb250aW51ZTtcclxuICAgIGludCBkcmF3WDtcclxuICAgIGludCBkcmF3WTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoZHJhd1Bvcy5WYWx1ZSwgb3V0IGRyYXdYLCBvdXQgZHJhd1kpO1xyXG4gICAgaW50IGlkeCA9IGRyYXdYICsgZHJhd1kgKiAod2lkdGggKyAyKTtcclxuICAgIGltYWdlRGF0YUFycmF5W2lkeCAqIDQgKyAzXSA9IEdldFNxdWFyZVR5cGVBbHBoYShzcXVhcmVUeXBlKTtcclxufVxuXHRcdFx0XHRJbWFnZURhdGEgaW1hZ2VEYXRhID0gbmV3IEltYWdlRGF0YShpbWFnZURhdGFBcnJheSwgKHVpbnQpKHdpZHRoICsgMiksICh1aW50KShoZWlnaHQgKyAyKSk7XHJcblx0XHRcdFx0VG9wQ2FudmFzQ29udGV4dC5QdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcclxuICAgICAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0ltYWdlKEJvdHRvbUNhbnZhcywgKG9mZnNldFggJSB4TXVsdGlwbGllcikgLSB4TXVsdGlwbGllciwgKG9mZnNldFkgJSB5TXVsdGlwbGllcikgLSB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgICAgIH1cclxuXHRcdFx0ZWxzZSB7XHJcbiAgICBIZXhHcmlkIGg7XHJcbiAgICBpZiAoKGggPSBHcmlkIGFzIEhleEdyaWQpICE9IG51bGwpXHJcbiAgICB7XHJcbiAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5EcmF3SW1hZ2UoQm90dG9tQ2FudmFzLCAob2Zmc2V0WCAlIChIZXhHcmlkLmNvczYwICogMiAqIHhNdWx0aXBsaWVyKSkgLSBIZXhHcmlkLmNvczYwICogMiAqIHhNdWx0aXBsaWVyLCAob2Zmc2V0WSAlIChIZXhHcmlkLnNpbjYwICogMiAqIHlNdWx0aXBsaWVyKSkgLSBIZXhHcmlkLnNpbjYwICogMiAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICBHcmlkLkRyYXdTcXVhcmVzKChBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+LCBTcXVhcmVUeXBlPikoKFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiBkLCBTcXVhcmVUeXBlIHNxdWFyZVR5cGUpID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4/IGRyYXdQb3MgPSBHZXRET01EcmF3UG9zKGQpO1xyXG4gICAgICAgICAgICBpZiAoIWRyYXdQb3MuSGFzVmFsdWUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRmlsbFN0eWxlID0gc3RyaW5nLkZvcm1hdChcInJnYmEoMCwgMCwgMCwgezB9KVwiLCBHZXRTcXVhcmVUeXBlQWxwaGEoc3F1YXJlVHlwZSkgLyAyNTUuMCk7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0hleGFnb24oKGludClkcmF3UG9zLlZhbHVlLkl0ZW0xLCAoaW50KWRyYXdQb3MuVmFsdWUuSXRlbTIsIHhNdWx0aXBsaWVyICogMiAvIDMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICB7XHJcbiAgICAgICAgVHJpYW5nbGVHcmlkIHRyaWFuZ2xlR3JpZDtcclxuICAgICAgICBpZiAoKHRyaWFuZ2xlR3JpZCA9IEdyaWQgYXMgVHJpYW5nbGVHcmlkKSAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5EcmF3SW1hZ2UoQm90dG9tQ2FudmFzLCAob2Zmc2V0WCAlIChIZXhHcmlkLmNvczYwICogMiAqIHhNdWx0aXBsaWVyKSkgLSBIZXhHcmlkLmNvczYwICogMiAqIHhNdWx0aXBsaWVyLCAob2Zmc2V0WSAlIChIZXhHcmlkLnNpbjYwICogMiAqIHlNdWx0aXBsaWVyKSkgLSBIZXhHcmlkLnNpbjYwICogMiAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgdHJpYW5nbGVHcmlkLkRyYXdTcXVhcmVzKChBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+LCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4sIFNxdWFyZVR5cGU+KSgoU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+IGQsIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBUcmlhbmdsZUxvY2F0aW9uPiBjb29yZHMsIFNxdWFyZVR5cGUgc3F1YXJlVHlwZSkgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PyBkcmF3UG9zID0gR2V0RE9NRHJhd1BvcyhkKTtcclxuICAgICAgICAgICAgICAgIGlmICghZHJhd1Bvcy5IYXNWYWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkZpbGxTdHlsZSA9IHN0cmluZy5Gb3JtYXQoXCJyZ2JhKDAsIDAsIDAsIHswfSlcIiwgR2V0U3F1YXJlVHlwZUFscGhhKHNxdWFyZVR5cGUpIC8gMjU1LjApO1xyXG4gICAgICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5EcmF3VHJpYW5nbGUoZHJhd1Bvcy5WYWx1ZS5JdGVtMSwgZHJhd1Bvcy5WYWx1ZS5JdGVtMiwgeE11bHRpcGxpZXIgLyAyLCBjb29yZHMuSXRlbTMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdJbWFnZShUb3BDYW52YXMsIChvZmZzZXRYICUgeE11bHRpcGxpZXIpIC0geE11bHRpcGxpZXIsIChvZmZzZXRZICUgeU11bHRpcGxpZXIpIC0geU11bHRpcGxpZXIsICh3aWR0aCArIDIpICogeE11bHRpcGxpZXIsIChoZWlnaHQgKyAyKSAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG5HZXRGaW5hbERyYXdQb3MgPSAocG9zKSA9PlxyXG57XHJcbiAgICB2YXIgcCA9IEdldERyYXdQb3MocG9zKTtcclxuICAgIGlmIChwID09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBkb3VibGUgZHJhd1g7XHJcbiAgICBkb3VibGUgZHJhd1k7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4ocC5WYWx1ZS5JdGVtMSwgcC5WYWx1ZS5JdGVtMiksIG91dCBkcmF3WCwgb3V0IGRyYXdZKTtcclxuICAgIGRyYXdYICo9ICh3aWR0aCArIDIpICogeE11bHRpcGxpZXIgLyBUb3BDYW52YXMuV2lkdGg7XHJcbiAgICBkcmF3WSAqPSAoaGVpZ2h0ICsgMikgKiB5TXVsdGlwbGllciAvIFRvcENhbnZhcy5IZWlnaHQ7XHJcbiAgICBkcmF3WCArPSAob2Zmc2V0WCAlIHhNdWx0aXBsaWVyKSAtIHhNdWx0aXBsaWVyO1xyXG4gICAgZHJhd1kgKz0gKG9mZnNldFkgJSB5TXVsdGlwbGllcikgLSB5TXVsdGlwbGllcjtcclxuICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+KGRyYXdYLCBkcmF3WSk7XHJcbn1cclxuXHJcbjtcbiAgICAgICAgICAgIFxyXG5EcmF3TGluZSA9IChzdGFydCwgZW5kKSA9PlxyXG57XHJcbiAgICBpZiAoIXN0YXJ0Lkhhc1ZhbHVlIHx8ICFlbmQuSGFzVmFsdWUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgdmFyIHN0YXJ0UG9zID0gc3RhcnQuVmFsdWU7XHJcbiAgICB2YXIgZW5kUG9zID0gZW5kLlZhbHVlO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5CZWdpblBhdGgoKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuTW92ZVRvKHN0YXJ0UG9zLkl0ZW0xLCBzdGFydFBvcy5JdGVtMik7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkxpbmVUbyhlbmRQb3MuSXRlbTEsIGVuZFBvcy5JdGVtMik7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkxpbmVXaWR0aCA9IDI7XHJcbiAgICBET01DYW52YXNDb250ZXh0LlN0cm9rZVN0eWxlID0gXCJyZWRcIjsgLy8gXCJyZ2IoMTcwLCAxNzAsIDE3MClcIjtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuU3Ryb2tlKCk7XHJcbn1cclxuXHJcbjtcbiAgICAgICAgICAgIFxyXG5EcmF3TWFya2VyID0gKHBvc2l0aW9uKSA9PlxyXG57XHJcbiAgICBpZiAoIXBvc2l0aW9uLkhhc1ZhbHVlKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIGRvdWJsZSBkcmF3WDtcclxuICAgIGRvdWJsZSBkcmF3WTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QocG9zaXRpb24uVmFsdWUsIG91dCBkcmF3WCwgb3V0IGRyYXdZKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuQmVnaW5QYXRoKCk7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkFyYyhkcmF3WCwgZHJhd1ksIHhNdWx0aXBsaWVyIC8gOCwgMCwgMiAqIE1hdGguUEkpO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5GaWxsU3R5bGUgPSBcInJlZFwiOyAvL1wicmdiKDE3MCwgMTcwLCAxNzApXCI7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkZpbGwoKTtcclxufVxyXG5cclxuO1xuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vZm9yZWFjaCAoKChpbnQgeCwgaW50IHkpIHBvcywgRGl2aWRlcnNJbmZvIGRpdmlkZXJzKSBpbiBEaXZpZGVycylcclxuICAgICAgICAgICAgLy97XHJcbiAgICAgICAgICAgIC8vICAgIGZvcmVhY2ggKHZhciBkaXZpZGVyIGluIG5ld1tdIHsgRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0LCBEaXZpZGVyc0luZm8uUmlnaHQsIERpdmlkZXJzSW5mby5Cb3R0b20gfSlcclxuICAgICAgICAgICAgLy8gICAge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgaWYgKCFkaXZpZGVycy5IYXNGbGFnKGRpdmlkZXIpKVxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgc3dpdGNoIChkaXZpZGVyKVxyXG4gICAgICAgICAgICAvLyAgICAgICAge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgIGNhc2UgRGl2aWRlcnNJbmZvLlJpZ2h0OlxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAoaW50IHgsIGludCB5KSBzdGFydFBvcyA9ICgoaW50KShwb3MueCArIDEpLCAoaW50KXBvcy55KTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgKGludCB4LCBpbnQgeSkgZW5kUG9zID0gKChpbnQpKHBvcy54ICsgMSksIChpbnQpKHBvcy55ICsgMSkpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBEcmF3TGluZShHZXRGaW5hbERyYXdQb3Moc3RhcnRQb3MpLCBHZXRGaW5hbERyYXdQb3MoZW5kUG9zKSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgIGNhc2UgRGl2aWRlcnNJbmZvLkJvdHRvbTpcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgRHJhd0xpbmUoR2V0RmluYWxEcmF3UG9zKCgoaW50KShwb3MueCksIChpbnQpKHBvcy55ICsgMSkpKSwgR2V0RmluYWxEcmF3UG9zKCgoaW50KShwb3MueCArIDEpLCAoaW50KShwb3MueSArIDEpKSkpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICBjYXNlIERpdmlkZXJzSW5mby5Cb3R0b21SaWdodDpcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgRHJhd01hcmtlcihHZXRGaW5hbERyYXdQb3MoKChpbnQpKHBvcy54ICsgMSksIChpbnQpKHBvcy55ICsgMSkpKSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgIH1cclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBmcmFtZU51bSA9IDA7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBOZXh0RnJhbWUgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghcGxheWluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgYm9vbCBza2lwRnJhbWVzID0gR3JpZC5TcXVhcmVDb3VudCA+PSAyNTA7XHJcbiAgICAgICAgICAgIGludCB1cGRhdGVzUGVyRHJhdyA9IDE7Ly8gc2tpcEZyYW1lcyA/IDIgOiAxO1xyXG4gICAgICAgICAgICBmcmFtZU51bSsrO1xyXG4gICAgICAgICAgICBpZiAoc2tpcEZyYW1lcyAmJiAoZnJhbWVOdW0gJSB1cGRhdGVzUGVyRHJhdykgIT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPCB1cGRhdGVzUGVyRHJhdzsgbisrKVxyXG4gICAgICAgICAgICAgICAgR3JpZC5VcGRhdGUoKTtcclxuICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIERyYXdIZXhhZ29uICh0aGlzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBjb250ZXh0LCBpbnQgeCwgaW50IHksIGludCByYWRpdXMsIGJvb2wgc3Ryb2tlID0gZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb250ZXh0LkJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjb250ZXh0Lk1vdmVUbyh4ICsgcmFkaXVzLCB5KTtcclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDE7IG4gPD0gNjsgbisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkb3VibGUgYW5nbGUgPSBuICogTWF0aC5QSSAvIDM7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LkxpbmVUbyh4ICsgcmFkaXVzICogTWF0aC5Db3MoYW5nbGUpLCB5ICsgcmFkaXVzICogTWF0aC5TaW4oYW5nbGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc3Ryb2tlKVxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5TdHJva2UoKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgY29udGV4dC5GaWxsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgRHJhd1RyaWFuZ2xlKHRoaXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGNvbnRleHQsIGludCBoZXhYLCBpbnQgaGV4WSwgaW50IGhleFJhZGl1cywgVHJpYW5nbGVMb2NhdGlvbiBsb2MsIGJvb2wgc3Ryb2tlID0gZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb250ZXh0LkJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjb250ZXh0Lk1vdmVUbyhoZXhYLCBoZXhZKTtcclxuICAgICAgICAgICAgaW50IGFuZ2xlSW50ID0gMDtcclxuICAgICAgICAgICAgc3dpdGNoIChsb2MpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Ub3BMZWZ0OlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlSW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Ub3A6XHJcbiAgICAgICAgICAgICAgICAgICAgYW5nbGVJbnQgPSA2MDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Ub3BSaWdodDpcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZUludCA9IDEyMDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21SaWdodDpcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZUludCA9IDE4MDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b206XHJcbiAgICAgICAgICAgICAgICAgICAgYW5nbGVJbnQgPSAyNDA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tTGVmdDpcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZUludCA9IDMwMDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkb3VibGUgYW5nbGUgPSBhbmdsZUludCAqIE1hdGguUEkgLyAxODA7XHJcbiAgICAgICAgICAgIGNvbnRleHQuTGluZVRvKGhleFggKyBoZXhSYWRpdXMgKiBNYXRoLkNvcyhhbmdsZSksIGhleFkgKyBoZXhSYWRpdXMgKiBNYXRoLlNpbihhbmdsZSkpO1xyXG4gICAgICAgICAgICBhbmdsZSArPSBNYXRoLlBJIC8gMztcclxuICAgICAgICAgICAgY29udGV4dC5MaW5lVG8oaGV4WCArIGhleFJhZGl1cyAqIE1hdGguQ29zKGFuZ2xlKSwgaGV4WSArIGhleFJhZGl1cyAqIE1hdGguU2luKGFuZ2xlKSk7XHJcbiAgICAgICAgICAgIGlmIChzdHJva2UpXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LlN0cm9rZSgpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LkZpbGwoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRleHQuUmVndWxhckV4cHJlc3Npb25zO1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBFeHRlbnNpb25zXHJcbiAgICB7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKChlLCBjKSA9PiBjLmFwcGVuZENoaWxkKGUpKSh7ZWxlbWVudH0sIHtjb250YWluaW5nRWxlbX0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgQWRkVG88VD4odGhpcyBUIGVsZW1lbnQsIE5vZGUgY29udGFpbmluZ0VsZW0pIHdoZXJlIFQgOiBOb2RlO1xyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBUIEFkZFRvQm9keTxUPih0aGlzIFQgbikgd2hlcmUgVCA6IE5vZGUgPT4gQXBwLnJvb3QuQXBwZW5kQ2hpbGQ8VD4obik7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwie25vZGV9LmFwcGVuZENoaWxkKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBBcHBlbmRDaGlsZDxUPih0aGlzIE5vZGUgbm9kZSwgVCBlbGVtZW50KSB3aGVyZSBUIDogTm9kZTtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIEhpZGU8VD4odGhpcyBUIGVsZW1lbnQpIHdoZXJlIFQgOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zdHlsZS5kaXNwbGF5ID0gJycsIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgU2hvdzxUPih0aGlzIFQgZWxlbWVudCkgd2hlcmUgVCA6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihsaSA9PiAobGkuYXBwZW5kQ2hpbGQoe2VsZW1lbnR9KSwgbGkpKShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MTElFbGVtZW50IFdyYXBMaSh0aGlzIE5vZGUgZWxlbWVudCk7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGRpdiA9PiAoZGl2LmFwcGVuZENoaWxkKHtlbGVtZW50fSksIGRpdikpKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MRGl2RWxlbWVudCBXcmFwRGl2KHRoaXMgTm9kZSBlbGVtZW50KTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFQgQWRkPFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgc3RyaW5nPltdIG5vZGVzKSB3aGVyZSBUIDogTm9kZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoVW5pb248Tm9kZSwgc3RyaW5nPiBub2RlIGluIG5vZGVzKVxyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUuSXM8c3RyaW5nPigpKVxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuQXBwZW5kQ2hpbGQobmV3IFRleHQobm9kZS5BczxzdHJpbmc+KCkpKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LkFwcGVuZENoaWxkKG5vZGUuQXM8Tm9kZT4oKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBUIEFkZEVsZW1lbnQ8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LG5vZGVzKTtcclxufXB1YmxpYyBzdGF0aWMgVCBBZGREaXY8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCgpLG5vZGVzKSk7XHJcbn1wdWJsaWMgc3RhdGljIFQgQWRkVWw8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBVbmlvbjxOb2RlLCBzdHJpbmc+W10sIHN0cmluZz5bXSBub2RlcylcclxuICAgIHdoZXJlIFQgOiBOb2RlXHJcbntcclxuICAgIHJldHVybiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPFQ+KGVsZW1lbnQsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVUxpc3RFbGVtZW50PihuZXcgSFRNTFVMaXN0RWxlbWVudCgpLFN5c3RlbS5BcnJheUV4dGVuc2lvbnMuTWFwPFVuaW9uPE5vZGUsVW5pb248Tm9kZSwgc3RyaW5nPltdLHN0cmluZz4sVW5pb248Tm9kZSxzdHJpbmc+Pihub2RlcywoRnVuYzxVbmlvbjxOb2RlLFVuaW9uPE5vZGUsIHN0cmluZz5bXSxzdHJpbmc+LFVuaW9uPE5vZGUsc3RyaW5nPj4pKG4gPT4gKFVuaW9uPE5vZGUsIHN0cmluZz4pKG4uSXM8VW5pb248Tm9kZSwgc3RyaW5nPltdPigpID8gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MTElFbGVtZW50PihuZXcgSFRNTExJRWxlbWVudCgpLG4uQXM8VW5pb248Tm9kZSwgc3RyaW5nPltdPigpKSA6IG4uSXM8c3RyaW5nPigpID8gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MTElFbGVtZW50PihuZXcgSFRNTExJRWxlbWVudCgpLG4uQXM8c3RyaW5nPigpKSA6IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTExJRWxlbWVudD4obmV3IEhUTUxMSUVsZW1lbnQoKSxuLkFzPE5vZGU+KCkpKSkpKSk7XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBBZGRDYW1lbFNwYWNlKHRoaXMgc3RyaW5nIHN0cilcclxue1xyXG4gICAgcmV0dXJuIFJlZ2V4LlJlcGxhY2UoUmVnZXguUmVwbGFjZShzdHIsIEBcIihbXl9hLXpdKShbXl9hLXpdW2Etel0pXCIsIFwiJDEgJDJcIiksIEBcIihbYS16XSkoW15fYS16XSlcIiwgXCIkMSAkMlwiKTtcclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIFRvQ2FtZWxTdHJpbmc8VD4odGhpcyBUIGUpXHJcbiAgICB3aGVyZSBUIDogc3RydWN0LCBTeXN0ZW0uRW51bVxyXG57XHJcbiAgICByZXR1cm4gZS5Ub1N0cmluZygpLkFkZENhbWVsU3BhY2UoKS5SZXBsYWNlKCdfJywgJyAnKTtcclxufSAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBBZGRFbnVtPFQ+KHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBUPyBkZWZhdWx0VmFsdWUgPSBudWxsLCBzdHJpbmcgZGVmYXVsdFZhbHVlU3RyaW5nID0gXCJcIikgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChkZWZhdWx0VmFsdWUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHNlbGVjdC5BZGQoQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50IHsgVmFsdWUgPSBcIlwiLCBTZWxlY3RlZCA9IHRydWUsIERpc2FibGUgPSB0cnVlIH0sZGVmYXVsdFZhbHVlU3RyaW5nKSk7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFQgdmFsdWUgaW4gU3lzdGVtLkVudW0uR2V0VmFsdWVzKHR5cGVvZihUKSkpXHJcbiAgICAgICAgICAgICAgICBzZWxlY3QuQWRkKEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFZhbHVlID0gKChpbnQpKG9iamVjdCl2YWx1ZSkuVG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBTZWxlY3RlZCA9IG9iamVjdC5FcXVhbHMoZGVmYXVsdFZhbHVlLCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLlRvQ2FtZWxTdHJpbmc8VD4odmFsdWUpKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIGJvb2wgQm9vbFZhbHVlKHRoaXMgSFRNTElucHV0RWxlbWVudCBjaGVja0JveClcclxue1xyXG4gICAgcmV0dXJuIGNoZWNrQm94LkNoZWNrZWQ7XHJcbn1wdWJsaWMgc3RhdGljIGJvb2wgQm9vbFZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0KVxyXG57XHJcbiAgICByZXR1cm4gc2VsZWN0LlZhbHVlID09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlO1xyXG59cHVibGljIHN0YXRpYyBBZGphY2VuY3lUeXBlIEFkamFjZW5jeVZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0KVxyXG57XHJcbiAgICByZXR1cm4gKEFkamFjZW5jeVR5cGUpaW50LlBhcnNlKHNlbGVjdC5WYWx1ZSk7XHJcbn1wdWJsaWMgc3RhdGljIFQ/IFZhbHVlPFQ+KHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0KVxyXG4gICAgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxue1xyXG4gICAgcmV0dXJuIHNlbGVjdC5WYWx1ZSA9PSBcIlwiID8gbnVsbCA6IChUPyApKFQpKG9iamVjdClpbnQuUGFyc2Uoc2VsZWN0LlZhbHVlKTtcclxufSAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MSW5wdXRFbGVtZW50IFNldEJvb2xWYWx1ZSh0aGlzIEhUTUxJbnB1dEVsZW1lbnQgY2hlY2tCb3gsIGJvb2wgdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjaGVja0JveC5DaGVja2VkID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGVja0JveDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBTZXRCb29sVmFsdWUodGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QsIGJvb2wgdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxlY3QuVmFsdWUgPSB2YWx1ZS5Ub1N0cmluZygpLlRvTG93ZXIoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBTZXRBZGphY2VuY3lWYWx1ZSh0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdCwgQWRqYWNlbmN5VHlwZSB2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGVjdC5WYWx1ZSA9ICgoaW50KXZhbHVlKS5Ub1N0cmluZygpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxTZWxlY3RFbGVtZW50IFNldFZhbHVlPFQ+KHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBUIHZhbHVlKSB3aGVyZSBUIDogc3RydWN0LCBTeXN0ZW0uRW51bVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZWN0LlZhbHVlID0gKChpbnQpKG9iamVjdCl2YWx1ZSkuVG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgc3RyaW5nIFRvVGltZVN0cmluZyh0aGlzIFRpbWVTcGFuIHRpbWUpXHJcbntcclxuICAgIHJldHVybiB0aW1lLlRvU3RyaW5nKHRpbWUgPj0gVGltZVNwYW4uRnJvbUhvdXJzKDEpID8gQFwiaFxcOm1tXFw6c3NcIiA6IEBcIm1cXDpzc1wiKTtcclxufSAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc2V0Q3VzdG9tVmFsaWRpdHkoe21lc3NhZ2V9KSwgZS5yZXBvcnRWYWxpZGl0eSgpLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIFNldEN1c3RvbVZhbGlkaXR5PFQ+KHRoaXMgVCBlbGVtZW50LCBzdHJpbmcgbWVzc2FnZSkgd2hlcmUgVCA6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihlID0+IChlLnNldEF0dHJpYnV0ZSgnbGlzdCcsIHtkYXRhbGlzdElEfSksIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIEhUTUxJbnB1dEVsZW1lbnQgU2V0RGF0YUxpc3QodGhpcyBIVE1MSW5wdXRFbGVtZW50IGVsZW1lbnQsIHN0cmluZyBkYXRhbGlzdElEKTtcclxucHVibGljIHN0YXRpYyB2b2lkIENsZWFyKHRoaXMgSFRNTEVsZW1lbnQgZWxlbWVudClcclxue1xyXG4gICAgZWxlbWVudC5Jbm5lckhUTUwgPSBcIlwiO1xyXG59ICAgICAgICAvL1tUZW1wbGF0ZShcIntlbGVtfS5hcHBlbmRDaGlsZCh7YWRkaW5nfSlcIildXHJcbiAgICAgICAgLy9wdWJsaWMgc3RhdGljIGV4dGVybiBUIEFwcGVuZDxUPiAodGhpcyBOb2RlIGVsZW0sIFQgYWRkaW5nKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gSm9pbkJSKHRoaXMgSUVudW1lcmFibGU8c3RyaW5nPiBzdHJpbmdzKVxyXG4gICAgICAgIHtcclxuU3lzdGVtLkZ1bmM8SUVudW1lcmFibGU8VW5pb248Tm9kZSwgc3RyaW5nPj4+IElubmVyID0gbnVsbDtcbiAgICAgICAgICAgIFxyXG5Jbm5lciA9ICgpID0+XHJcbntcclxuICAgIHVzaW5nICh2YXIgZW51bWVyID0gc3RyaW5ncy5HZXRFbnVtZXJhdG9yKCkpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKCFlbnVtZXIuTW92ZU5leHQoKSlcclxuICAgICAgICAgICAgeWllbGQgYnJlYWs7XHJcbiAgICAgICAgeWllbGQgcmV0dXJuIGVudW1lci5DdXJyZW50O1xyXG4gICAgICAgIHdoaWxlIChlbnVtZXIuTW92ZU5leHQoKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiBuZXcgSFRNTEJSRWxlbWVudCgpO1xyXG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gZW51bWVyLkN1cnJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG47XG4gICAgICAgICAgICByZXR1cm4gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Ub0FycmF5PFVuaW9uPE5vZGUsc3RyaW5nPj4oSW5uZXIoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBOb3RhYmxlT2JqZWN0c0xpc3RcclxuICAgIHtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWFkb25seSBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gLHN0cmluZyAsc3RyaW5nID4+IE5vdGFibGVPYmplY3RzID1cclxuICAgICAgICAgICAgZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiAsc3RyaW5nICxzdHJpbmcgPj4oKSwoX28zKT0+e19vMy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+Piwgc3RyaW5nLCBzdHJpbmc+KGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4oKSwgKF9vMSkgPT5cclxue1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApKTtcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigxLCAwKSk7XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMSwgMSkpO1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDIpKTtcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigyLCAyKSk7XHJcbiAgICByZXR1cm4gX28xO1xyXG59XHJcblxyXG4pLCBcIlR3byBHZW5lcmF0aW9uIE5pbmV0eSBEZWdyZWUgUm90YXRvclwiLCBcIjAwMTAxMC0tLSAvIDAwMDEwMS0tLVwiKSk7X28zLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8SGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+LCBzdHJpbmcsIHN0cmluZz4oZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PigpLCAoX28yKSA9PlxyXG57XHJcbiAgICBfbzIuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCkpO1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDEsIDApKTtcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigxLCAxKSk7XHJcbiAgICBfbzIuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMSkpO1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDIpKTtcclxuICAgIHJldHVybiBfbzI7XHJcbn1cclxuXHJcbiksIFwiT25lIEdlbmVyYXRpb24gTmluZXR5IERlZ3JlZSBSb3RhdG9yXCIsIFwiMDAxMDEwLS0tIC8gMDAwMTAxLS0tXCIpKTtyZXR1cm4gX28zO30pO1xyXG4gICAgfVxyXG59IiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgLy8vIE9wdGlvbnM6XHJcbiAgICAvLy8gLSBDZWxsIChJc0NlbGw6IHRydWUsIElzV2FsbDogZmFsc2UpICB8IEJsYWNrXHJcbiAgICAvLy8gLSBXYWxsIChJc0NlbGw6IHRydWUsIElzV2FsbDogdHJ1ZSkgICB8IEdyZXlcclxuICAgIC8vLyAtIEJyaWNrIChJc0NlbGw6IGZhbHNlLCBJc1dhbGw6IHRydWUpIHwgR3JleVxyXG4gICAgLy8vIDwvc3VtbWFyeT5cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIFNxdWFyZUV4dGVuc2lvbnNcclxuICAgIHtcclxucHVibGljIHN0YXRpYyBib29sIElzQWxpdmUodGhpcyBTcXVhcmVUeXBlIHNxdWFyZVR5cGUpXHJcbntcclxuICAgIHJldHVybiBzcXVhcmVUeXBlICE9IFNxdWFyZVR5cGUuQnJpY2s7XHJcbn1wdWJsaWMgc3RhdGljIGJvb2wgSXNVbmRlYWQodGhpcyBTcXVhcmVUeXBlIHNxdWFyZVR5cGUpXHJcbntcclxuICAgIHJldHVybiBzcXVhcmVUeXBlICE9IFNxdWFyZVR5cGUuQ2VsbDtcclxufXB1YmxpYyBzdGF0aWMgYm9vbCBDb250YWluc0FsaXZlPFQ+KHRoaXMgRGljdGlvbmFyeTxULCBTcXVhcmVUeXBlPiBkaWMsIFQga2V5KVxyXG57XHJcblNxdWFyZVR5cGUgc3F1YXJlVHlwZTtcbiAgICByZXR1cm4gZGljLlRyeUdldFZhbHVlKGtleSwgb3V0IHNxdWFyZVR5cGUpICYmIHNxdWFyZVR5cGUuSXNBbGl2ZSgpO1xyXG59ICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW51bSBTcXVhcmVUeXBlXHJcbiAgICB7XHJcbiAgICAgICAgQ2VsbCwgIC8vIEJsYWNrXHJcbiAgICAgICAgSW1tb3J0YWxDZWxsLCAgLy8gR3JleVxyXG4gICAgICAgIEJyaWNrLCAvLyBHcmV5XHJcbiAgICAgICAgQ291bnRcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW51bSBHcmlkVHlwZVxyXG4gICAge1xyXG4gICAgICAgIFNxdWFyZSxcclxuICAgICAgICBIZXgsXHJcbiAgICAgICAgVHJpYW5nbGUsXHJcbiAgICAgICAgQ291bnRcclxuICAgIH1cclxuXHJcbiAgICBbRmxhZ3NdXHJcbiAgICBwdWJsaWMgZW51bSBEaXZpZGVyc0luZm9cclxuICAgIHtcclxuICAgICAgICBOb25lID0gMCxcclxuICAgICAgICBSaWdodCA9IDEgPDwgMCxcclxuICAgICAgICBCb3R0b20gPSAxIDw8IDEsXHJcbiAgICAgICAgQm90dG9tUmlnaHQgPSAxIDw8IDJcclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBjbGFzcyBHcmlkXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IHZvaWQgQ2xlYXIoKTtcclxuICAgICAgICBwdWJsaWMgYWJzdHJhY3Qgdm9pZCBEcmF3U3F1YXJlcyhBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiwgU3F1YXJlVHlwZT4gRHJhd1NxdWFyZSk7XHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IHZvaWQgSGFuZGxlQ2xpY2soU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBkcmF3UG9zaXRpb24sIFNxdWFyZVR5cGUgU3F1YXJlVHlwZVBsYWNpbmcpO1xyXG4gICAgICAgIHB1YmxpYyBhYnN0cmFjdCB2b2lkIFVwZGF0ZSgpO1xyXG5cclxuICAgICAgICBwdWJsaWMgYWJzdHJhY3QgaW50IFNxdWFyZUNvdW50IHsgZ2V0OyB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGNsYXNzIEdyaWQ8Q29vcmRUeXBlPiA6IEdyaWRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgdmlydHVhbCB2b2lkIEFzc2lnbkRpdmlkZXJzIChTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYXdQb3NpdGlvbiwgcmVmIGJvb2wgcGxhY2VOb3JtYWxseSkgeyB9XHJcbiAgICAgICAgcHVibGljIGFic3RyYWN0IFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gR2V0RHJhd1Bvc2l0aW9uIChDb29yZFR5cGUgY29vcmRzKTtcclxuICAgICAgICBwdWJsaWMgYWJzdHJhY3QgQ29vcmRUeXBlIEZyb21EcmF3UG9zaXRpb24gKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhd1Bvc2l0aW9uKTtcclxuICAgICAgICBwdWJsaWMgYWJzdHJhY3QgaW50IE51bWJlck9mQWRqYWNlbnRDZWxscyAoQ29vcmRUeXBlIGNvb3JkcywgQWN0aW9uPENvb3JkVHlwZT4gZW1wdHlBZGpBY3Rpb24gPSBudWxsKTtcclxuICAgICAgICBwdWJsaWMgRGljdGlvbmFyeTxDb29yZFR5cGUsIFNxdWFyZVR5cGU+IFNxdWFyZXMgPSBuZXcgRGljdGlvbmFyeTxDb29yZFR5cGUsIFNxdWFyZVR5cGU+KCk7XHJcbiAgICAgICAgcHVibGljIERpY3Rpb25hcnk8Q29vcmRUeXBlLCBEaXZpZGVyc0luZm8+IERpdmlkZXJzID0gbmV3IERpY3Rpb25hcnk8Q29vcmRUeXBlLCBEaXZpZGVyc0luZm8+KCk7XHJcbnB1YmxpYyBvdmVycmlkZSBpbnQgU3F1YXJlQ291bnRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFNxdWFyZXMuQ291bnQ7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgdm9pZCBDbGVhcigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTcXVhcmVzLkNsZWFyKCk7XHJcbiAgICAgICAgICAgIERpdmlkZXJzLkNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBEcmF3U3F1YXJlcyAoQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4sIENvb3JkVHlwZSwgU3F1YXJlVHlwZT4gRHJhd1NxdWFyZSlcclxuICAgICAgICB7XHJcbmZvcmVhY2ggKHZhciBfZDEgaW4gU3F1YXJlcylcclxue1xyXG4gICAgQ29vcmRUeXBlIGNvb3JkcztcclxuICAgIFNxdWFyZVR5cGUgc3F1YXJlVHlwZTtcclxuICAgIF9kMS5EZWNvbnN0cnVjdChvdXQgY29vcmRzLCBvdXQgc3F1YXJlVHlwZSk7XHJcbiAgICBEcmF3U3F1YXJlKEdldERyYXdQb3NpdGlvbihjb29yZHMpLCBjb29yZHMsIHNxdWFyZVR5cGUpO1xyXG59XG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgRHJhd1NxdWFyZXMgKEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+LCBTcXVhcmVUeXBlPiBEcmF3U3F1YXJlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5EcmF3U3F1YXJlcygoQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+LENvb3JkVHlwZSxTcXVhcmVUeXBlPikoKGRyYXdQb3NpdGlvbiwgY29vcmRzLCBzcXVhcmVUeXBlKSA9PiBEcmF3U3F1YXJlKGRyYXdQb3NpdGlvbiwgc3F1YXJlVHlwZSkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMaXN0PENvb3JkVHlwZT4gcmVtb3ZpbmcgPSBuZXcgTGlzdDxDb29yZFR5cGU+KCk7XHJcbiAgICAgICAgICAgIEhhc2hTZXQ8Q29vcmRUeXBlPiBhZGRpbmcgPSBuZXcgSGFzaFNldDxDb29yZFR5cGU+KCk7XHJcbmZvcmVhY2ggKHZhciBfZDIgaW4gU3F1YXJlcylcclxue1xyXG4gICAgQ29vcmRUeXBlIGNvb3JkcztcclxuICAgIFNxdWFyZVR5cGUgc3F1YXJlVHlwZTtcclxuICAgIF9kMi5EZWNvbnN0cnVjdChvdXQgY29vcmRzLCBvdXQgc3F1YXJlVHlwZSk7XHJcbiAgICBpZiAoIXNxdWFyZVR5cGUuSXNBbGl2ZSgpKVxyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgaW50IGFkamFjZW50Q2VsbHMgPSBOdW1iZXJPZkFkamFjZW50Q2VsbHMoY29vcmRzLCAoQWN0aW9uPENvb3JkVHlwZT4pKGNvb3Jkc18gPT5cclxuICAgIHtcclxuICAgICAgICBpZiAoQXBwLmRlYWRSdWxlc1tOdW1iZXJPZkFkamFjZW50Q2VsbHMoY29vcmRzXyldKVxyXG4gICAgICAgICAgICBhZGRpbmcuQWRkKGNvb3Jkc18pO1xyXG4gICAgfVxyXG5cclxuKSAgICApO1xyXG4gICAgaWYgKGFkamFjZW50Q2VsbHMgPiBBcHAubWF4QWRqYWNlbnRDZWxscylcclxuICAgICAgICBhZGphY2VudENlbGxzID0gQXBwLm1heEFkamFjZW50Q2VsbHM7XHJcbiAgICBpZiAoIXNxdWFyZVR5cGUuSXNVbmRlYWQoKSAmJiAhQXBwLmxpdmluZ1J1bGVzW2FkamFjZW50Q2VsbHNdKVxyXG4gICAgICAgIHJlbW92aW5nLkFkZChjb29yZHMpO1xyXG59XG5cclxuICAgICAgICAgICAgZm9yZWFjaCAoQ29vcmRUeXBlIGNvb3JkcyBpbiByZW1vdmluZylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFTcXVhcmVzLlJlbW92ZShjb29yZHMpKSB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiU3F1YXJlIHRyaWVkIHRvIGJlIHJlbW92ZWQgYnV0IGRpZG4ndCBleGlzdFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yZWFjaCAoQ29vcmRUeXBlIGNvb3JkcyBpbiBhZGRpbmcpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFNxdWFyZXMuQWRkKGNvb3JkcywgU3F1YXJlVHlwZS5DZWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIHZvaWQgSGFuZGxlQ2xpY2sgKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhd1Bvc2l0aW9uLCBTcXVhcmVUeXBlIFNxdWFyZVR5cGVQbGFjaW5nKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQ29vcmRUeXBlIGNsaWNrQ29vcmRzID0gRnJvbURyYXdQb3NpdGlvbihkcmF3UG9zaXRpb24pO1xyXG4gICAgICAgICAgICBib29sIHBsYWNlTm9ybWFsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoU3F1YXJlVHlwZVBsYWNpbmcgPT0gU3F1YXJlVHlwZS5Db3VudClcclxuICAgICAgICAgICAgICAgIEFzc2lnbkRpdmlkZXJzKGRyYXdQb3NpdGlvbiwgcmVmIHBsYWNlTm9ybWFsbHkpO1xyXG4gICAgICAgICAgICBpZiAocGxhY2VOb3JtYWxseSAmJiAhU3F1YXJlcy5SZW1vdmUoY2xpY2tDb29yZHMpKVxyXG4gICAgICAgICAgICAgICAgU3F1YXJlcy5BZGQoY2xpY2tDb29yZHMsIFNxdWFyZVR5cGVQbGFjaW5nID09IFNxdWFyZVR5cGUuQ291bnQgPyBTcXVhcmVUeXBlLkNlbGwgOiBTcXVhcmVUeXBlUGxhY2luZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBTcXVhcmVHcmlkIDogR3JpZDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PlxyXG4gICAge1xyXG5wdWJsaWMgb3ZlcnJpZGUgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPkdldERyYXdQb3NpdGlvbihTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+Y29vcmRzKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pihjb29yZHMuSXRlbTEgKiBBcHAueE11bHRpcGxpZXIsIGNvb3Jkcy5JdGVtMiAqIEFwcC54TXVsdGlwbGllcik7XHJcbn1wdWJsaWMgb3ZlcnJpZGUgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPkZyb21EcmF3UG9zaXRpb24oU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPmRyYXdQb3NpdGlvbilcclxue1xyXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oQXBwLk5lZ0RpdihkcmF3UG9zaXRpb24uSXRlbTEsIEFwcC54TXVsdGlwbGllciksIEFwcC5OZWdEaXYoZHJhd1Bvc2l0aW9uLkl0ZW0yLCBBcHAueE11bHRpcGxpZXIpKTtcclxufVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSB2b2lkIEFzc2lnbkRpdmlkZXJzKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhd1Bvc2l0aW9uLCByZWYgYm9vbCBwbGFjZU5vcm1hbGx5KVxyXG4gICAgICAgIHtcclxuZG91YmxlIGNsaWNrWF87XG5kb3VibGUgY2xpY2tZXztcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGRvdWJsZSwgZG91YmxlPihBcHAuTmVnRGl2RG91YmxlKChkb3VibGUpZHJhd1Bvc2l0aW9uLkl0ZW0xLCBBcHAueE11bHRpcGxpZXIpLCBBcHAuTmVnRGl2RG91YmxlKChkb3VibGUpZHJhd1Bvc2l0aW9uLkl0ZW0yLCBBcHAueU11bHRpcGxpZXIpKSwgb3V0IGNsaWNrWF8sIG91dCBjbGlja1lfKTtcclxuICAgICAgICAgICAgcGxhY2VOb3JtYWxseSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpbnQgeERpdiA9IDAsIHlEaXYgPSAwO1xyXG4gICAgICAgICAgICBpZiAoY2xpY2tYXyAlIDEgPD0gMC4yKVxyXG4gICAgICAgICAgICAgICAgeERpdiA9IC0xO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChjbGlja1hfICUgMSA+PSAwLjgpXHJcbiAgICAgICAgICAgICAgICB4RGl2ID0gMTtcclxuICAgICAgICAgICAgaWYgKGNsaWNrWV8gJSAxIDw9IDAuMilcclxuICAgICAgICAgICAgICAgIHlEaXYgPSAtMTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoY2xpY2tZXyAlIDEgPj0gMC44KVxyXG4gICAgICAgICAgICAgICAgeURpdiA9IDE7XHJcbiAgICAgICAgICAgIERpdmlkZXJzSW5mbyBkaXZpZGVyc0luZm8gPSBEaXZpZGVyc0luZm8uTm9uZTtcclxuICAgICAgICAgICAgQWN0aW9uPERpdmlkZXJzSW5mbz4gQXNzaWduID0gKERpdmlkZXJzSW5mbyBkaXZJbmZvKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbnQgeCA9IChpbnQpY2xpY2tYXyArIHhEaXYsIHkgPSAoaW50KWNsaWNrWV8gKyB5RGl2O1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpdkluZm8gIT0gRGl2aWRlcnNJbmZvLk5vbmUpXHJcbiAgICAgICAgICAgICAgICB7XHJcbkRpdmlkZXJzSW5mbyBkaXZpZGVycztcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFEaXZpZGVycy5UcnlHZXRWYWx1ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpeCwgKGludCl5KSwgb3V0IGRpdmlkZXJzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGl2aWRlcnMgPSBEaXZpZGVyc0luZm8uTm9uZTtcclxuICAgICAgICAgICAgICAgICAgICBEaXZpZGVyc1tuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHgsIHkpXSA9IGRpdmlkZXJzIF4gZGl2SW5mbztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc3dpdGNoICh4RGl2KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoeURpdilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBc3NpZ24oRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBc3NpZ24oRGl2aWRlcnNJbmZvLlJpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5RGl2ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2lnbihEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHlEaXYpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXNzaWduKERpdmlkZXJzSW5mby5Cb3R0b20pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlTm9ybWFsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlkZXJzSW5mbyA9IERpdmlkZXJzSW5mby5Cb3R0b207XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoeURpdilcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4RGl2ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzc2lnbihEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlkZXJzSW5mbyA9IERpdmlkZXJzSW5mby5SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXZpZGVyc0luZm8gPSBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkaXZpZGVyc0luZm8gIT0gRGl2aWRlcnNJbmZvLk5vbmUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHhEaXYgPSAwO1xyXG4gICAgICAgICAgICAgICAgeURpdiA9IDA7XHJcbiAgICAgICAgICAgICAgICBBc3NpZ24oZGl2aWRlcnNJbmZvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIGludCBOdW1iZXJPZkFkamFjZW50Q2VsbHMoU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBjb29yZHMsIEFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiBlbXB0eUFkakFjdGlvbiA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgYWRqYWNlbnRDZWxscyA9IDA7XHJcbiAgICAgICAgICAgIGludCBuID0gMDtcclxuICAgICAgICAgICAgZm9yIChpbnQgTCA9IDA7IEwgPD0gODsgTCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTCA9PSA0KVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFkamFjZW5jeVJ1bGUgPSBBcHAuYWRqYWNlbmN5UnVsZXNbbisrXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnQgYzBfID0gY29vcmRzLkl0ZW0xLSAxICsgKEwgJSAzKSxcclxuICAgICAgICAgICAgICAgICAgICBjMV8gPSBjb29yZHMuSXRlbTItIDEgKyBMIC8gMztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoRGl2aWRlcnMuSGFzRGl2aWRlcnMoY29vcmRzLkl0ZW0xLCBjb29yZHMuSXRlbTIsIEwpKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5TcXVhcmVUeXBlIHNxdWFyZUluZm87XG5cclxuICAgICAgICAgICAgICAgIGlmIChTcXVhcmVzLlRyeUdldFZhbHVlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oYzBfLCBjMV8pLCBvdXQgc3F1YXJlSW5mbykpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNxdWFyZUluZm8uSXNBbGl2ZSgpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VudENlbGxzICs9IChpbnQpYWRqYWNlbmN5UnVsZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBlbXB0eUFkakFjdGlvbiE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+ZW1wdHlBZGpBY3Rpb24uSW52b2tlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oYzBfLCBjMV8pKSk6bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYWRqYWNlbnRDZWxscyA+IEFwcC5tYXhBZGphY2VudENlbGxzID8gQXBwLm1heEFkamFjZW50Q2VsbHMgOiBhZGphY2VudENlbGxzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xhc3MgSGV4R3JpZCA6IEdyaWQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj5cclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IGZsb2F0XHJcbiAgICAgICAgICAgIGNvczYwID0gKGZsb2F0KU1hdGguU2luKE1hdGguUEkgLyAzKSxcclxuICAgICAgICAgICAgc2luNjAgPSAoZmxvYXQpTWF0aC5Db3MoTWF0aC5QSSAvIDMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vLyA8c3VtbWFyeT5cclxuICAgICAgICAvLy8gXHJcbiAgICAgICAgLy8vIDwvc3VtbWFyeT5cclxuICAgICAgICAvLy8gPHBhcmFtIG5hbWU9XCJjb29yZHNcIj42MGwgaXMgcG9zaXRpb24gZnJvbSAoMCwgMCkgZ29pbmcgNjAgZGVncmVlcyBsZWZ0IG9mIHVwLiA2MHIgaXMgcG9zaXRpb24gZnJvbSAoMCwgMCkgZ29pbmcgNjAgZGVncmVlcyByaWdodCBvZiB1cC9wYXJhbT5cclxuICAgICAgICAvLy8gPHJldHVybnM+PC9yZXR1cm5zPlxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IEdldERyYXdQb3NpdGlvbiAoU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBjb29yZHMpXHJcbiAgICAgICAge1xyXG5pbnQgXzYwbDtcbmludCBfNjByO1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChjb29yZHMsIG91dCBfNjBsLCBvdXQgXzYwcik7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKCgtXzYwbCArIF82MHIpICogQXBwLnhNdWx0aXBsaWVyICogY29zNjApLCAoaW50KSgtKF82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIHNpbjYwKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBGcm9tRHJhd1Bvc2l0aW9uKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhd1Bvc2l0aW9uKVxyXG4gICAgICAgIHtcclxuaW50IHg7XG5pbnQgeTtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoZHJhd1Bvc2l0aW9uLCBvdXQgeCwgb3V0IHkpO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogeCA9ICgtXzYwbCArIF82MHIpICogQXBwLnhNdWx0aXBsaWVyICogc2luNjBcclxuICAgICAgICAgICAgICAgeSA9IC0oXzYwbCArIF82MHIpICogQXBwLnhNdWx0aXBsaWVyICogY29zNjBcclxuICAgICAgICAgICAgICAgayA9IEFwcC54TXVsdGlwbGllclxyXG4gICAgICAgICAgICAgICBhID0gXzYwbFxyXG4gICAgICAgICAgICAgICBiID0gXzYwclxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgU29sdmUgeCA9ICgtYSArIGIpICogayAqIHNpbjYwO3kgPSAtKGErIGIpICogayAqIGNvczYwIGZvciAoYSwgYikgKGh0dHBzOi8vd3d3LndvbGZyYW1hbHBoYS5jb20vaW5wdXQ/aT1zb2x2ZSt4KyUzRCslMjgtYSslMkIrYiUyOSsqK2srKitzaW42MCUzQnkrJTNEKy0lMjhhJTJCK2IlMjkrKitrKyorY29zNjArZm9yK2ErYW5kK2IpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICBhID0gLShzcXJ0KDMpIHggKyAzIHkpLygzIGspXHJcbiAgICAgICAgICAgICAgIGIgPSAoc3FydCgzKSB4IC0gMyB5KS8oMyBrKVxyXG4gICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCkoLShNYXRoLlNxcnQoMykgKiB4ICsgMyAqIHkpIC8gKDMgKiBBcHAueE11bHRpcGxpZXIpKSwgKGludCkoKE1hdGguU3FydCgzKSAqIHggLSAzICogeSkgLyAoMyAqIEFwcC54TXVsdGlwbGllcikpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBpbnQgTnVtYmVyT2ZBZGphY2VudENlbGxzKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gY29vcmRzLCBBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gZW1wdHlBZGpBY3Rpb24gPSBudWxsKVxyXG4gICAgICAgIHtcclxuaW50IF82MGw7XG5pbnQgXzYwcjtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoY29vcmRzLCBvdXQgXzYwbCwgb3V0IF82MHIpO1xyXG4gICAgICAgICAgICBpbnQgYWRqYWNlbnRDZWxscyA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoaW50IEwgPSAwOyBMIDw9IDU7IEwrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFkamFjZW5jeVJ1bGUgPSBBcHAuYWRqYWNlbmN5UnVsZXNbTF07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gNjBsIGlzIHBvc2l0aW9uIGZyb20gKDAsIDApIGdvaW5nIDYwIGRlZ3JlZXMgbGVmdCBvZiB1cC4gNjByIGlzIHBvc2l0aW9uIGZyb20gKDAsIDApIGdvaW5nIDYwIGRlZ3JlZXMgcmlnaHQgb2YgdXBcclxuICAgICAgICAgICAgICAgIC8vIEwgPSAwIGlzIGxlZnQtdXAsIGdvaW5nIGNsb2Nrd2lzZSB1cCB0byBMPTUgaXMgbGVmdFxyXG5cclxuICAgICAgICAgICAgICAgIGludCBfNjBsXywgXzYwcl87XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKEwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbGVmdC11cFxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwbF8gPSBfNjBsICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cFxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwbF8gPSBfNjBsICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmlnaHQtdXBcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MGxfID0gXzYwbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmlnaHQtZG93blxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwbF8gPSBfNjBsIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAvLyBkb3duXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjBsXyA9IF82MGwgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfNjByXyA9IF82MHIgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAvLyBsZWZ0LWRvd25cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF82MGxfID0gXzYwbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzYwcl8gPSBfNjByIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oc3RyaW5nLkZvcm1hdChcIkludmFsaWQgTDogezB9XCIsTCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5TcXVhcmVUeXBlIHNxdWFyZUluZm87XG5cclxuICAgICAgICAgICAgICAgIC8vaWYgKERpdmlkZXJzLkhhc0RpdmlkZXJzKGNvb3Jkcy5jMCwgY29vcmRzLmMxLCBMKSlcclxuICAgICAgICAgICAgICAgIC8vICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChTcXVhcmVzLlRyeUdldFZhbHVlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oXzYwbF8sIF82MHJfKSwgb3V0IHNxdWFyZUluZm8pKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzcXVhcmVJbmZvLklzQWxpdmUoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbnRDZWxscyArPSAoaW50KWFkamFjZW5jeVJ1bGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZW1wdHlBZGpBY3Rpb24hPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PmVtcHR5QWRqQWN0aW9uLkludm9rZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KF82MGxfLCBfNjByXykpKTpudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhZGphY2VudENlbGxzID4gQXBwLm1heEFkamFjZW50Q2VsbHMgPyBBcHAubWF4QWRqYWNlbnRDZWxscyA6IGFkamFjZW50Q2VsbHM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBUcmlhbmdsZUdyaWQgOiBHcmlkPFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxUcmlhbmdsZUxvY2F0aW9uID4+XHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgZmxvYXRcclxuICAgICAgICAgICAgY29zNjAgPSAoZmxvYXQpTWF0aC5TaW4oTWF0aC5QSSAvIDMpLFxyXG4gICAgICAgICAgICBzaW42MCA9IChmbG9hdClNYXRoLkNvcyhNYXRoLlBJIC8gMyk7XHJcblxyXG4gICAgICAgIC8vIGMwIGlzIHgsIGMxIGlzIHlcclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGUgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBHZXREcmF3UG9zaXRpb24oU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFRyaWFuZ2xlTG9jYXRpb24gPiBjb29yZHMpXHJcbiAgICAgICAge1xyXG5pbnQgXzYwbDtcbmludCBfNjByO1xuVHJpYW5nbGVMb2NhdGlvbiBuO1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChjb29yZHMsIG91dCBfNjBsLCBvdXQgXzYwciwgb3V0IG4pO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KSgoLV82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIGNvczYwKSwgKGludCkoLShfNjBsICsgXzYwcikgKiBBcHAueE11bHRpcGxpZXIgKiBzaW42MCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxUcmlhbmdsZUxvY2F0aW9uID4gRnJvbURyYXdQb3NpdGlvbihTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYXdQb3NpdGlvbilcclxuICAgICAgICB7XHJcblN5c3RlbS5GdW5jPGRvdWJsZSwgZG91YmxlPiBOZWdNb2QxID0gbnVsbDtcbmludCB4O1xuaW50IHk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGRyYXdQb3NpdGlvbiwgb3V0IHgsIG91dCB5KTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHggPSAoLV82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIHNpbjYwXHJcbiAgICAgICAgICAgICAgIHkgPSAtKF82MGwgKyBfNjByKSAqIEFwcC54TXVsdGlwbGllciAqIGNvczYwXHJcbiAgICAgICAgICAgICAgIGsgPSBBcHAueE11bHRpcGxpZXJcclxuICAgICAgICAgICAgICAgYSA9IF82MGxcclxuICAgICAgICAgICAgICAgYiA9IF82MHJcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgIFNvbHZlIHggPSAoLWEgKyBiKSAqIGsgKiBzaW42MDt5ID0gLShhKyBiKSAqIGsgKiBjb3M2MCBmb3IgKGEsIGIpIChodHRwczovL3d3dy53b2xmcmFtYWxwaGEuY29tL2lucHV0P2k9c29sdmUreCslM0QrJTI4LWErJTJCK2IlMjkrKitrKyorc2luNjAlM0J5KyUzRCstJTI4YSUyQitiJTI5KyoraysqK2NvczYwK2ZvcithK2FuZCtiKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgYSA9IC0oMyB4ICsgc3FydCgzKSB5KS8oMyBrKVxyXG4gICAgICAgICAgICAgICBiID0gKDMgeCAtIHNxcnQoMykgeSkvKDMgaylcclxuICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBUcmlhbmdsZUxvY2F0aW9uIGZyb20gcG9zaXRpb25cclxuXHJcbiAgICAgICAgICAgIGRvdWJsZSBib2FyZF82MGwgPSAtKE1hdGguU3FydCgzKSAqIHggKyAzICogeSkgLyAoMyAqIEFwcC54TXVsdGlwbGllciksXHJcbiAgICAgICAgICAgICAgICAgICBib2FyZF82MHIgPSAgKE1hdGguU3FydCgzKSAqIHggLSAzICogeSkgLyAoMyAqIEFwcC54TXVsdGlwbGllcik7XHJcblxyXG4gICAgICAgICAgICBcclxuTmVnTW9kMSA9IChhKSA9PiAoYSAlIDEgKyAxKSAlIDE7XG5cclxuICAgICAgICAgICAgZG91YmxlIF82MGxNb2QxID0gTmVnTW9kMShib2FyZF82MGwpLFxyXG4gICAgICAgICAgICAgICAgICAgXzYwck1vZDEgPSBOZWdNb2QxKGJvYXJkXzYwcik7XHJcblxyXG4gICAgICAgICAgICBUcmlhbmdsZUxvY2F0aW9uIG4gPSBfNjByTW9kMSA8PSAoMS4wIC8gMilcclxuICAgICAgICAgICAgICAgID8gXzYwbE1vZDEgPD0gKDEuMCAvIDMpID8gVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b20gOlxyXG4gICAgICAgICAgICAgICAgICAgIF82MGxNb2QxIDw9ICgyLjAgLyAzKSA/IFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tTGVmdCA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnRcclxuICAgICAgICAgICAgICAgIDogXzYwbE1vZDEgPD0gKDEuMCAvIDMpID8gVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21SaWdodCA6XHJcbiAgICAgICAgICAgICAgICAgICAgXzYwbE1vZDEgPD0gKDIuMCAvIDMpID8gVHJpYW5nbGVMb2NhdGlvbi5Ub3BSaWdodCA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUcmlhbmdsZUxvY2F0aW9uLlRvcDsgICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4oKGludClNYXRoLlJvdW5kKGJvYXJkXzYwbCksIChpbnQpTWF0aC5Sb3VuZChib2FyZF82MHIpLCBuKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBpbnQgTnVtYmVyT2ZBZGphY2VudENlbGxzKFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxUcmlhbmdsZUxvY2F0aW9uID4gY29vcmRzLCBBY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFRyaWFuZ2xlTG9jYXRpb24gPj4gZW1wdHlBZGpBY3Rpb24gPSBudWxsKVxyXG4gICAgICAgIHtcclxuX19fQWRkU3F1YXJlX0RlbGVnYXRlXzAgQWRkU3F1YXJlID0gbnVsbDtcblN5c3RlbS5GdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiwgVHJpYW5nbGVMb2NhdGlvbiwgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+PiBDcmVhdGVQb3MgPSBudWxsO1xuU3lzdGVtLkZ1bmM8aW50LCBib29sLCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+IEdldEZpbmFsSGV4YWdvbkxvY1BvcyA9IG51bGw7XG5TeXN0ZW0uRnVuYzxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4gR2V0SGV4YWdvbkxvYyA9IG51bGw7XG5TeXN0ZW0uRnVuYzxpbnQsIGJvb2wsIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4gR2V0SGV4YWdvbkxvY1BvcyA9IG51bGw7XG5pbnQgXzYwbDtcbmludCBfNjByO1xuVHJpYW5nbGVMb2NhdGlvbiBuO1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChjb29yZHMsIG91dCBfNjBsLCBvdXQgXzYwciwgb3V0IG4pO1xyXG4gICAgICAgICAgICBpbnQgYWRqYWNlbnRDZWxscyA9IDA7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBmb3IgKFRyaWFuZ2xlTG9jYXRpb24gbG9jID0gMDsgbG9jIDwgVHJpYW5nbGVMb2NhdGlvbi5Db3VudDsgbG9jKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2MgPT0gbilcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciBhZGphY2VuY3lSdWxlID0gQXBwLmFkamFjZW5jeVJ1bGVzWyhpbnQpbG9jXTtcclxuICAgICAgICAgICAgICAgIGlmIChDdXN0b21pemFibGVHYW1lb2ZMaWZlLlNxdWFyZUV4dGVuc2lvbnMuQ29udGFpbnNBbGl2ZTxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFRyaWFuZ2xlTG9jYXRpb24+PihTcXVhcmVzLG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgVHJpYW5nbGVMb2NhdGlvbj4oXzYwbCwgXzYwciwgbG9jKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgYWRqYWNlbnRDZWxscyArPSAoaW50KWFkamFjZW5jeVJ1bGU7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZW1wdHlBZGpBY3Rpb24hPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PmVtcHR5QWRqQWN0aW9uLkludm9rZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+KF82MGwsIF82MHIsIGxvYykpKTpudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayB0cmlhbmdsZXMgZnJvbSBhZGphY2VudCBoZXhhZ29ucyBmb3IgYWRqYWNlbmN5XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBsZWZ0LXVwLCBnZXQgcmlnaHQtdXAsIHJpZ2h0LWRvd24gYW5kIGRvd24gZnJvbSBsZWZ0LXVwLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBnZXQgcmlnaHQtdXAgYW5kIHVwIGZyb20gbGVmdC1kb3duLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBnZXQgbGVmdC1kb3duIGFuZCBkb3duIGZyb20gdXBcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHVwLCBnZXQgbGVmdC1kb3duLCBkb3duIGFuZCByaWdodC1kb3duIGZyb20gdXAsXHJcbiAgICAgICAgICAgIC8vICAgICAgICBnZXQgcmlnaHQtdXAgYW5kIHJpZ2h0LWRvd24gZnJvbSBsZWZ0LXVwXHJcbiAgICAgICAgICAgIC8vICAgICAgICBnZXQgbGVmdC11cCBhbmQgbGVmdC1kb3duIGZyb20gcmlnaHQtdXBcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHJpZ2h0LXVwLCBnZXQgbGVmdC11cCwgbGVmdC1kb3duIGFuZCBkb3duIGZyb20gcmlnaHQtdXAsXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICBnZXQgbGVmdC11cCBhbmQgdXAgZnJvbSByaWdodC1kb3duLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgZ2V0IHJpZ2h0LWRvd24gYW5kIGRvd24gZnJvbSB1cFxyXG5cclxuICAgICAgICAgICAgLy8gSWYgbGVmdC1kb3duLCBnZXQgcmlnaHQtdXAsIHJpZ2h0LWRvd24gYW5kIHVwIGZyb20gbGVmdC1kb3duLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgIGdldCByaWdodC1kb3duIGFuZCBkb3duIGZyb20gbGVmdC11cCxcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICBnZXQgbGVmdC11cCBhbmQgdXAgZnJvbSBkb3duXHJcblxyXG4gICAgICAgICAgICAvLyBJZiBkb3duLCBnZXQgbGVmdC11cCwgdXAgYW5kIHJpZ2h0LXVwIGZyb20gZG93bixcclxuICAgICAgICAgICAgLy8gICAgICAgICAgZ2V0IHJpZ2h0LWRvd24gYW5kIHJpZ2h0LXVwIGZyb20gbGVmdC1kb3duXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgIGdldCBsZWZ0LWRvd24gYW5kIGxlZnQtdXAgZnJvbSByaWdodC1kb3duXHJcblxyXG4gICAgICAgICAgICAvLyBJZiByaWdodC1kb3duLCBnZXQgbGVmdC11cCwgbGVmdC1kb3duIGFuZCB1cCBmcm9tIHJpZ2h0LWRvd24sXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGdldCBsZWZ0LWRvd24gYW5kIGRvd24gZnJvbSByaWdodC11cCxcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgZ2V0IHJpZ2h0LXVwIGFuZCB1cCBmcm9tIGRvd25cclxuXHJcbiAgICAgICAgICAgIGludCB4XyA9XHJcbiAgICAgICAgICAgICAgICBuID09IFRyaWFuZ2xlTG9jYXRpb24uVG9wTGVmdCB8fCBuID09IFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tTGVmdCA/IC0xIDpcclxuICAgICAgICAgICAgICAgIG4gPT0gVHJpYW5nbGVMb2NhdGlvbi5Ub3BSaWdodCB8fCBuID09IFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tUmlnaHQgPyAxIDpcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICB5XyA9XHJcbiAgICAgICAgICAgICAgICBuID09IFRyaWFuZ2xlTG9jYXRpb24uVG9wTGVmdCB8fCBuID09IFRyaWFuZ2xlTG9jYXRpb24uVG9wUmlnaHQgfHwgbiA9PSBUcmlhbmdsZUxvY2F0aW9uLlRvcCA/IC0xIDogMTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG5HZXRIZXhhZ29uTG9jUG9zID0gKGludmVydFgsIGludmVydFkpID0+IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oaW52ZXJ0WCA9PSAtMSA/IDAgOiBpbnZlcnRYID09IDEgPyAteF8gOiB4XywgaW52ZXJ0WSA/IC15XyA6IHlfKTtcbiAgICAgICAgICAgIFxyXG5HZXRIZXhhZ29uTG9jID0gKHgsIHkpID0+IHkgPT0gMCA/ICgoU3lzdGVtLkZ1bmM8VHJpYW5nbGVMb2NhdGlvbj4pKCgpID0+XHJcbntcclxuICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKFwieSBjYW5ub3QgYmUgMFwiKTtcclxufVxyXG5cclxuKSkoKSA6IHggPT0gMCA/IHkgPT0gLTEgPyBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbSA6IFRyaWFuZ2xlTG9jYXRpb24uVG9wIDogeCA9PSAtMSA/IHkgPT0gLTEgPyBUcmlhbmdsZUxvY2F0aW9uLlRvcExlZnQgOiBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbUxlZnQgOiB4ID09IDEgPyB5ID09IC0xID8gVHJpYW5nbGVMb2NhdGlvbi5Ub3BSaWdodCA6IFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tUmlnaHQgOiAoKFN5c3RlbS5GdW5jPFRyaWFuZ2xlTG9jYXRpb24+KSgoKSA9PlxyXG57XHJcbiAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbihcInggbXVzdCBiZSAtMSwgMCBvciAxXCIpO1xyXG59XHJcblxyXG4pKSgpO1xuR2V0RmluYWxIZXhhZ29uTG9jUG9zID0gKGludmVydFgsIGludmVydFkpID0+XHJcbntcclxuICAgIGludCB4O1xyXG4gICAgaW50IHk7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KEdldEhleGFnb25Mb2NQb3MoaW52ZXJ0WCwgaW52ZXJ0WSksIG91dCB4LCBvdXQgeSk7XHJcbiAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihfNjBsICsgeCwgXzYwciArIHkpO1xyXG59XHJcblxyXG47XG5DcmVhdGVQb3MgPSAocG9zLCBOKSA9PiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFRyaWFuZ2xlTG9jYXRpb24+KHBvcy5JdGVtMSwgcG9zLkl0ZW0yLCBOKTtcbkFkZFNxdWFyZSA9IChpbnQgaW52ZXJ0WDEsIGJvb2wgaW52ZXJ0WTEsIGludCBpbnZlcnRYMiwgYm9vbCBpbnZlcnRZMiwgaW50IHgxT3ZlcnJpZGUsIGludCB4Mk92ZXJyaWRlKSA9PlxyXG57XHJcbiAgICBpbnQgXzYwbF87XHJcbiAgICBpbnQgXzYwcl87XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KEdldEZpbmFsSGV4YWdvbkxvY1BvcyhpbnZlcnRYMSwgaW52ZXJ0WTEpLCBvdXQgXzYwbF8sIG91dCBfNjByXyk7XHJcbiAgICBpZiAoeDFPdmVycmlkZSAhPSAwKVxyXG4gICAgICAgIF82MGxfID0geDFPdmVycmlkZTtcclxuICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiBwb3MyID0gR2V0SGV4YWdvbkxvY1BvcyhpbnZlcnRYMiwgaW52ZXJ0WTIpO1xyXG4gICAgaWYgKHgyT3ZlcnJpZGUgIT0gMClcclxuICAgICAgICBwb3MyLkl0ZW0xID0geDJPdmVycmlkZTtcclxuICAgIFRyaWFuZ2xlTG9jYXRpb24gbl8gPSBHZXRIZXhhZ29uTG9jKHBvczIuSXRlbTEsIHBvczIuSXRlbTIpO1xyXG4gICAgdmFyIGNvb3Jkc18gPSBDcmVhdGVQb3MobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihfNjBsXywgXzYwcl8pLCBuXyk7XHJcbiAgICBTcXVhcmVUeXBlIHNxdWFyZUluZm87XHJcbiAgICBpZiAoU3F1YXJlcy5UcnlHZXRWYWx1ZShjb29yZHNfLCBvdXQgc3F1YXJlSW5mbykpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHNxdWFyZUluZm8uSXNBbGl2ZSgpKVxyXG4gICAgICAgICAgICBhZGphY2VudENlbGxzICs9IDE7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICAgICAgZW1wdHlBZGpBY3Rpb24gIT0gbnVsbCA/IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpID0+IGVtcHR5QWRqQWN0aW9uLkludm9rZShjb29yZHNfKSkgOiBudWxsO1xyXG59XHJcblxyXG47XG5cclxuICAgICAgICAgICAgc3dpdGNoIChuKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uVG9wTGVmdDpcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Ub3BSaWdodDpcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Cb3R0b21MZWZ0OlxyXG4gICAgICAgICAgICAgICAgY2FzZSBUcmlhbmdsZUxvY2F0aW9uLkJvdHRvbVJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGludmVydFkgaXMgLTEsIHRoZW4gdGhlIHkgY29vcmRpbmF0ZSBpcyByZW1vdmVkLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGludmVydFkgaXMgMCwgdGhlbiB0aGUgeSBjb29yZGluYXRlIGlzIG5vdCBpbnZlcnRlZC5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpbnZlcnRZIGlzIDEsIHRoZW4gdGhlIHkgY29vcmRpbmF0ZSBpcyBpbnZlcnRlZC5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpbnZlcnRYIGlzIDAsIHRoZW4gdGhlIHggY29vcmRpbmF0ZSBpcyBub3QgaW52ZXJ0ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaW52ZXJ0WCBpcyAxLCB0aGVuIHRoZSB4IGNvb3JkaW5hdGUgaXMgaW52ZXJ0ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDEsIHRydWUsIDAsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMSwgZmFsc2UsIDAsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoLTEsIHRydWUsIDAsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMSwgZmFsc2UsIDAsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgtMSwgZmFsc2UsIDAsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCB0cnVlLCAtMSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgtMSwgdHJ1ZSwgLTEsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgVHJpYW5nbGVMb2NhdGlvbi5Ub3A6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFRyaWFuZ2xlTG9jYXRpb24uQm90dG9tOlxyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCB0cnVlLCAwLCBmYWxzZSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDAsIHRydWUsIDAsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMCwgdHJ1ZSwgMCwgZmFsc2UsIC0xKTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRTcXVhcmUoMCwgZmFsc2UsIDAsIGZhbHNlLCAxLCAtMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDAsIHRydWUsIDAsIGZhbHNlLCAxLCAtMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgQWRkU3F1YXJlKDAsIGZhbHNlLCAwLCBmYWxzZSwgLTEsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZFNxdWFyZSgwLCB0cnVlLCAwLCBmYWxzZSwgLTEsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbihcIm4gbXVzdCBiZSAwLCAxLCAyLCAzLCA0IG9yIDVcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhZGphY2VudENlbGxzID4gQXBwLm1heEFkamFjZW50Q2VsbHMgPyBBcHAubWF4QWRqYWNlbnRDZWxscyA6IGFkamFjZW50Q2VsbHM7XHJcbiAgICAgICAgfVxyXG5wcml2YXRlIGRlbGVnYXRlIHZvaWQgX19fQWRkU3F1YXJlX0RlbGVnYXRlXzAoaW50IGludmVydFgxLCBib29sIGludmVydFkxLCBpbnQgaW52ZXJ0WDIsIGJvb2wgaW52ZXJ0WTIsIGludCB4MU92ZXJyaWRlID0gMCwgaW50IHgyT3ZlcnJpZGUgPSAwKTsgICAgfVxyXG59XHJcbiJdCn0K
