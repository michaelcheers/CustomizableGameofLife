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
                var clickX_ = { };
                var clickY_ = { };
                Bridge.Deconstruct(new (System.ValueTuple$2(System.Double,System.Double)).$ctor1(CustomizableGameofLife.App.NegDivDouble(mousePos.Item1 - CustomizableGameofLife.App.offsetPos.Item1, CustomizableGameofLife.App.xMultiplier), CustomizableGameofLife.App.NegDivDouble(mousePos.Item2 - CustomizableGameofLife.App.offsetPos.Item2, CustomizableGameofLife.App.yMultiplier)).$clone(), clickX_, clickY_);
                var placeNormally = true;
                if (CustomizableGameofLife.App.SquareTypePlacing === CustomizableGameofLife.SquareType.Count) {
                    placeNormally = false;
                    var xDiv = 0, yDiv = 0;
                    if ((clickX_.v) % 1 <= 0.2) {
                        xDiv = -1;
                    } else {
                        if ((clickX_.v) % 1 >= 0.8) {
                            xDiv = 1;
                        }
                    }
                    if ((clickY_.v) % 1 <= 0.2) {
                        yDiv = -1;
                    } else {
                        if ((clickY_.v) % 1 >= 0.8) {
                            yDiv = 1;
                        }
                    }
                    var dividersInfo = CustomizableGameofLife.DividersInfo.None;
                    var Assign = function (divInfo) {
                        var x1 = (Bridge.Int.clip32(clickX_.v) + xDiv) | 0, y1 = (Bridge.Int.clip32(clickY_.v) + yDiv) | 0;
                        if (divInfo !== CustomizableGameofLife.DividersInfo.None) {
                            var dividers = { v : new CustomizableGameofLife.DividersInfo() };
                            if (!CustomizableGameofLife.App.Dividers.tryGetValue(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x1, y1), dividers)) {
                                dividers.v = CustomizableGameofLife.DividersInfo.None;
                            }
                            CustomizableGameofLife.App.Dividers.setItem(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x1, y1), dividers.v ^ divInfo);
                        }
                    };
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
                                    placeNormally = true;
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
                }

                if (placeNormally) {
                    var clickX = { };
                    var clickY = { };
                    Bridge.Deconstruct(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(Bridge.Int.clip32(clickX_.v), Bridge.Int.clip32(clickY_.v)).$clone(), clickX, clickY);
                    if (!CustomizableGameofLife.App.Squares.remove(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(clickX.v, clickY.v))) {
                        CustomizableGameofLife.App.Squares.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(clickX.v, clickY.v), CustomizableGameofLife.App.SquareTypePlacing === CustomizableGameofLife.SquareType.Count ? CustomizableGameofLife.SquareType.Cell : CustomizableGameofLife.App.SquareTypePlacing);
                    }
                }

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
                Squares: null,
                Dividers: null,
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
                    var $t, $t1, $t2, $t3;
                    this.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32))();
                    this.LastBottomCanvas = new (System.ValueTuple$2(System.Int32,HTMLCanvasElement))();
                    this.maxAdjacentCells = 8;
                    this.xMultiplier = 20;
                    this.screenWidth = window.innerWidth;
                    this.screenHeight = window.innerHeight;
                    this.Hotbar = CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, ($t = document.createElement("div"), $t.style.position = "absolute", $t.style.left = "100px", $t.style.top = System.String.format("{0}px", [Bridge.box(((window.innerHeight - 40) | 0), System.Int32)]), $t), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
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
                        CustomizableGameofLife.App.NextSquareType();
                    }, $t1), ["Wall"]), CustomizableGameofLife.App.NextSquareTypeButton = $t, $t)]), [($t1 = CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t2 = document.createElement("button"), $t2.className = "btn btn-primary", $t2.onclick = function (e) {
                        CustomizableGameofLife.App.InvertIsPlaying();
                    }, $t2), ["\u25b6"]), CustomizableGameofLife.App.PlayButton = $t1, $t1)]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t2 = document.createElement("button"), $t2.className = "btn btn-primary", $t2.onclick = function (e) {
                        CustomizableGameofLife.App.ShowModal(CustomizableGameofLife.App.ModalType.Settings);
                    }, $t2), ["\u2699"])]);
                    this.SquareTypePlacing = CustomizableGameofLife.SquareType.Count;
                    this.RightHotbar = CustomizableGameofLife.Extensions.Add(HTMLDivElement, ($t2 = document.createElement("div"), $t2.style.position = "absolute", $t2.style.right = "100px", $t2.style.top = System.String.format("{0}px", [Bridge.box(((window.innerHeight - 40) | 0), System.Int32)]), $t2), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t2 = document.createElement("button"), $t2.className = "btn btn-info", $t2.onclick = function (e) {
                        CustomizableGameofLife.App.ShowModal(CustomizableGameofLife.App.ModalType.NotableObjects);
                    }, $t2), ["Notable Objects"])]);
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
                        }(document.createElement("div")), [($t2 = CustomizableGameofLife.App.CreatePopup(), CustomizableGameofLife.App.SettingsPopup = $t2, $t2)]), [($t3 = CustomizableGameofLife.App.CreatePopup(), CustomizableGameofLife.App.NotableObjectsPopup = $t3, $t3)]);
                    this.playing = false;
                    this.livingRules = System.Array.init([false, false, true, true, false, false, false, false, false], System.Boolean);
                    this.deadRules = System.Array.init([false, false, false, true, false, false, false, false, false], System.Boolean);
                    this.adjacencyRules = System.Array.init([CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One, CustomizableGameofLife.AdjacencyType.One], CustomizableGameofLife.AdjacencyType);
                    this.DOMCanvas = CustomizableGameofLife.App.CreateCanvas();
                    this.DOMCanvasContext = CustomizableGameofLife.App.DOMCanvas.getContext("2d");
                    this.Squares = new (System.Collections.Generic.Dictionary$2(System.ValueTuple$2(System.Int32,System.Int32),CustomizableGameofLife.SquareType)).ctor();
                    this.Dividers = new (System.Collections.Generic.Dictionary$2(System.ValueTuple$2(System.Int32,System.Int32),CustomizableGameofLife.DividersInfo)).ctor();
                    this.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0);
                    this.adjacencyRulesCells = new (System.Collections.Generic.List$1(HTMLSelectElement)).ctor();
                    this.optionCells = new (System.Collections.Generic.List$1(System.ValueTuple$2(HTMLInputElement,HTMLInputElement))).ctor();
                    this.updating = false;
                    this.LastBottomCanvas = new (System.ValueTuple$2(System.Int32,HTMLCanvasElement)).$ctor1(0, null);
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
                Reset: function (makeBlank) {
                    var $t, $t1;
                    if (makeBlank === void 0) { makeBlank = false; }
                    if (!Bridge.global.confirm("Any unsaved changes will be lost. Continue?")) {
                        return;
                    }
                    CustomizableGameofLife.App.Squares.clear();
                    CustomizableGameofLife.App.Dividers.clear();
                    if (!makeBlank) {
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
                                            CustomizableGameofLife.App.Squares.add(pos.$clone(), CustomizableGameofLife.SquareType.Cell);
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
                                            CustomizableGameofLife.App.Squares.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(squareInfo.Item1, squareInfo.Item2), squareInfo.Item3);
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
                    var offsetCoords = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(CustomizableGameofLife.App.NegDiv(CustomizableGameofLife.App.offsetPos.Item1, CustomizableGameofLife.App.xMultiplier), CustomizableGameofLife.App.NegDiv(CustomizableGameofLife.App.offsetPos.Item2, CustomizableGameofLife.App.yMultiplier));
                    return ($t = System.Collections.Generic.KeyValuePair$2(System.ValueTuple$2(System.Int32,System.Int32),CustomizableGameofLife.SquareType), System.Linq.Enumerable.from(CustomizableGameofLife.App.Squares, $t).toList($t)).ConvertAll(System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.SquareType), function (s) {
                        return new (System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.SquareType)).$ctor1(((s.key.Item1 + offsetCoords.Item1) | 0), ((s.key.Item2 + offsetCoords.Item2) | 0), s.value);
                    });
                },
                GetNormalizedCoordinates: function () {
                    var coords = CustomizableGameofLife.App.GetCoordinatesInteral();
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
                CreateBottomCanvas: function () {
                    var $t;
                    var BottomCanvas = ($t = document.createElement("canvas"), $t.width = ((CustomizableGameofLife.App.screenWidth + Bridge.Int.mul(2, CustomizableGameofLife.App.xMultiplier)) | 0), $t.height = ((CustomizableGameofLife.App.screenHeight + Bridge.Int.mul(2, CustomizableGameofLife.App.yMultiplier)) | 0), $t);
                    var BottomCanvasContext = BottomCanvas.getContext("2d");
                    BottomCanvasContext.strokeStyle = "black";
                    BottomCanvasContext.translate(0.5, 0.5);
                    BottomCanvasContext.lineWidth = 1;
                    for (var x = 0; x <= (((CustomizableGameofLife.App.width + 2) | 0)); x = (x + 1) | 0) {
                        BottomCanvasContext.moveTo(Bridge.Int.mul(x, CustomizableGameofLife.App.xMultiplier), 0);
                        BottomCanvasContext.lineTo(Bridge.Int.mul(x, CustomizableGameofLife.App.xMultiplier), Bridge.Int.mul((((CustomizableGameofLife.App.height + 3) | 0)), CustomizableGameofLife.App.yMultiplier));
                    }
                    for (var y = 0; y <= (((CustomizableGameofLife.App.height + 2) | 0)); y = (y + 1) | 0) {
                        BottomCanvasContext.moveTo(0, Bridge.Int.mul(y, CustomizableGameofLife.App.yMultiplier));
                        BottomCanvasContext.lineTo(Bridge.Int.mul((((CustomizableGameofLife.App.width + 3) | 0)), CustomizableGameofLife.App.xMultiplier), Bridge.Int.mul(y, CustomizableGameofLife.App.yMultiplier));
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
                NumberOfAdjacentCells: function (x, y) {
                    var adjacentCells = 0;
                    var n = 0;
                    for (var L = 0; L <= 8; L = (L + 1) | 0) {
                        if (L === 4) {
                            continue;
                        }
                        var adjacencyRule = CustomizableGameofLife.App.adjacencyRules[System.Array.index(Bridge.identity(n, ((n = (n + 1) | 0))), CustomizableGameofLife.App.adjacencyRules)];

                        var x_ = (((x - 1) | 0) + (L % 3)) | 0, y_ = (((y - 1) | 0) + ((Bridge.Int.div(L, 3)) | 0)) | 0;

                        if (CustomizableGameofLife.App.HasDividers(x, y, L)) {
                            continue;
                        }

                        if (CustomizableGameofLife.SquareExtensions.ContainsAlive(System.ValueTuple$2(System.Int32,System.Int32), CustomizableGameofLife.App.Squares, new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x_, y_))) {
                            adjacentCells = (adjacentCells + adjacencyRule) | 0;
                        }
                    }
                    return adjacentCells > CustomizableGameofLife.App.maxAdjacentCells ? CustomizableGameofLife.App.maxAdjacentCells : adjacentCells;
                },
                HasDividers: function (x, y, L) {
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
                    return CustomizableGameofLife.App.Dividers.tryGetValue(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x, y), dividersInfo) && (dividersInfo.v & toCheck) !== 0;
                },
                Update: function () {
                    var $t, $t1, $t2;

                    var removing = new (System.Collections.Generic.List$1(System.ValueTuple$2(System.Int32,System.Int32))).ctor();
                    var adding = new (System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32))).ctor();
                    $t = Bridge.getEnumerator(CustomizableGameofLife.App.Squares);
                    try {
                        while ($t.moveNext()) {
                            var _d4 = $t.Current;
                            var pos = { v : new (System.ValueTuple$2(System.Int32,System.Int32))() };
                            var squareType = { v : new CustomizableGameofLife.SquareType() };
                            _d4.Deconstruct(pos, squareType);
                            var x = { };
                            var y = { };
                            Bridge.Deconstruct(pos.v.$clone(), x, y);
                            if (!CustomizableGameofLife.SquareExtensions.IsAlive(squareType.v)) {
                                continue;
                            }
                            var adjacentCells = 0;
                            var n = 0;
                            for (var L = 0; L <= 8; L = (L + 1) | 0) {
                                if (L === 4) {
                                    continue;
                                }
                                var adjacencyRule = CustomizableGameofLife.App.adjacencyRules[System.Array.index(Bridge.identity(n, ((n = (n + 1) | 0))), CustomizableGameofLife.App.adjacencyRules)];
                                var x_ = (((x.v - 1) | 0) + (L % 3)) | 0, y_ = (((y.v - 1) | 0) + ((Bridge.Int.div(L, 3)) | 0)) | 0;
                                if (CustomizableGameofLife.App.HasDividers(x.v, y.v, L)) {
                                    continue;
                                }
                                var squareInfo = { v : new CustomizableGameofLife.SquareType() };
                                if (CustomizableGameofLife.App.Squares.tryGetValue(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x_, y_), squareInfo)) {
                                    if (CustomizableGameofLife.SquareExtensions.IsAlive(squareInfo.v)) {
                                        adjacentCells = (adjacentCells + adjacencyRule) | 0;
                                    }
                                } else {
                                    if (CustomizableGameofLife.App.deadRules[System.Array.index(CustomizableGameofLife.App.NumberOfAdjacentCells(x_, y_), CustomizableGameofLife.App.deadRules)]) {
                                        adding.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x_, y_));
                                    }
                                }
                            }

                            if (adjacentCells > CustomizableGameofLife.App.maxAdjacentCells) {
                                adjacentCells = CustomizableGameofLife.App.maxAdjacentCells;
                            }
                            if (!CustomizableGameofLife.SquareExtensions.IsUndead(squareType.v) && !CustomizableGameofLife.App.livingRules[System.Array.index(adjacentCells, CustomizableGameofLife.App.livingRules)]) {
                                removing.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x.v, y.v));
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
                            var _d5 = $t1.Current.$clone();
                            var x1 = { };
                            var y1 = { };
                            Bridge.Deconstruct(_d5.$clone(), x1, y1);
                            if (!CustomizableGameofLife.App.Squares.remove(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x1.v, y1.v))) {
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
                            var _d6 = $t2.Current.$clone();
                            var x2 = { };
                            var y2 = { };
                            Bridge.Deconstruct(_d6.$clone(), x2, y2);
                            CustomizableGameofLife.App.Squares.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x2.v, y2.v), CustomizableGameofLife.SquareType.Cell);
                        }
                    } finally {
                        if (Bridge.is($t2, System.IDisposable)) {
                            $t2.System$IDisposable$Dispose();
                        }
                    }
                },
                Draw: function () {
                    var $t, $t1, $t2;
                    var DrawMarker = null;
                    var DrawLine = null;
                    var GetFinalDrawPos = null;
                    var GetDrawPos = null;
                    var TopCanvas = CustomizableGameofLife.App.CreateTopCanvas();
                    var BottomCanvas = null;
                    if (CustomizableGameofLife.App.LastBottomCanvas.Item1 === CustomizableGameofLife.App.xMultiplier) {
                        BottomCanvas = CustomizableGameofLife.App.LastBottomCanvas.Item2;
                    }
                    if (BottomCanvas == null) {
                        BottomCanvas = CustomizableGameofLife.App.CreateBottomCanvas();
                        CustomizableGameofLife.App.LastBottomCanvas = new (System.ValueTuple$2(System.Int32,HTMLCanvasElement)).$ctor1(CustomizableGameofLife.App.xMultiplier, BottomCanvas);
                    }
                    var TopCanvasContext = TopCanvas.getContext("2d");
                    CustomizableGameofLife.App.DOMCanvasContext.clearRect(0, 0, CustomizableGameofLife.App.DOMCanvas.width, CustomizableGameofLife.App.DOMCanvas.height);
                    var offsetX = { };
                    var offsetY = { };
                    Bridge.Deconstruct(CustomizableGameofLife.App.offsetPos.$clone(), offsetX, offsetY);
                    var imageDataArray = CustomizableGameofLife.App.CreateImageDataArray(((CustomizableGameofLife.App.width + 2) | 0), ((CustomizableGameofLife.App.height + 2) | 0));

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
                    $t = Bridge.getEnumerator(CustomizableGameofLife.App.Squares);
                    try {
                        while ($t.moveNext()) {
                            var _d7 = $t.Current;
                            var pos = { v : new (System.ValueTuple$2(System.Int32,System.Int32))() };
                            var squareType = { v : new CustomizableGameofLife.SquareType() };
                            _d7.Deconstruct(pos, squareType);
                            var drawPos = System.Nullable.lift1("$clone", GetDrawPos(pos.v.$clone()));
                            if (drawPos == null) {
                                continue;
                            }
                            var drawX = { };
                            var drawY = { };
                            Bridge.Deconstruct(System.Nullable.getValue(drawPos).$clone(), drawX, drawY);
                            var idx = (drawX.v + Bridge.Int.mul(drawY.v, (((CustomizableGameofLife.App.width + 2) | 0)))) | 0;
                            imageDataArray[((Bridge.Int.mul(idx, 4) + 3) | 0)] = (squareType.v === CustomizableGameofLife.SquareType.Cell ? 255 : squareType.v === CustomizableGameofLife.SquareType.Brick ? 170 : squareType.v === CustomizableGameofLife.SquareType.ImmortalCell ? 85 : (function () {
                                throw new System.Exception("Unknown square type");
                            })()) & 255;
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                    var imageData = new ImageData(imageDataArray, ((((CustomizableGameofLife.App.width + 2) | 0)) >>> 0), ((((CustomizableGameofLife.App.height + 2) | 0)) >>> 0));
                    TopCanvasContext.putImageData(imageData, 0, 0);
                    CustomizableGameofLife.App.DOMCanvasContext.drawImage(BottomCanvas, ((offsetX.v % CustomizableGameofLife.App.xMultiplier - CustomizableGameofLife.App.xMultiplier) | 0), ((offsetY.v % CustomizableGameofLife.App.yMultiplier - CustomizableGameofLife.App.yMultiplier) | 0));
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
                    $t1 = Bridge.getEnumerator(CustomizableGameofLife.App.Dividers);
                    try {
                        while ($t1.moveNext()) {
                            var _d8 = $t1.Current;
                            var pos1 = { v : new (System.ValueTuple$2(System.Int32,System.Int32))() };
                            var dividers = { v : new CustomizableGameofLife.DividersInfo() };
                            _d8.Deconstruct(pos1, dividers);
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
                },
                NextFrame: function () {
                    if (!CustomizableGameofLife.App.playing) {
                        return;
                    }

                    var skipFrames = CustomizableGameofLife.App.Squares.Count >= 250;
                    var updatesPerDraw = 1;
                    CustomizableGameofLife.App.frameNum = (CustomizableGameofLife.App.frameNum + 1) | 0;
                    if (skipFrames && (CustomizableGameofLife.App.frameNum % updatesPerDraw) !== 0) {
                        return;
                    }

                    for (var n = 0; n < updatesPerDraw; n = (n + 1) | 0) {
                        CustomizableGameofLife.App.Update();
                    }
                    CustomizableGameofLife.App.Draw();
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
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDdXN0b21pemFibGVHYW1lb2ZMaWZlLmpzIiwKICAic291cmNlUm9vdCI6ICIiLAogICJzb3VyY2VzIjogWyJDbGFzczEuY3MiLCJFeHRlbnNpb25zLmNzIiwiTm90YWJsZU9iamVjdHNMaXN0LmNzIiwiU3F1YXJlLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBcVhBQSx3QkFBaUVBO1lBQ3JEQSxxQkFBd0JBO1lBQ3BDQTtZQUFxQkEsSUFBSUEsQ0FBQ0EsS0FBSUEsOENBQTZCQTtnQkFFM0NBO29CQUVJQSxlQUFtQkEsV0FBV0E7b0JBQzlCQSxJQUFJQSxrQkFBa0JBO3dCQUVsQkEsSUFBSUEsQUFBcUNBOzRCQUNyQ0EseUNBQWNBLDhDQUFzQ0EsZUFBZUEsdUJBQXZCQTs7d0JBQ2hEQSxJQUFJQSxBQUFxQ0E7NEJBQ3JDQSx1Q0FBWUEsOENBQXNDQSxlQUFlQSxxQkFBdkJBOzt3QkFDOUNBLElBQUlBLEFBQXFDQTs0QkFDckNBLDRDQUFpQkEsOENBQXFDQSxlQUFlQSwwQkFBdEJBOzs7Ozs7O1lBSy9EQTtZQUNBQSwwQkFBMEJBO1lBQzFCQTtZQUNBQSwwQkFBMEJBO1lBQzFCQSwwQkFBMEJBOztZQUUxQkEsMEJBQXVDQTs7Z0JBRW5DQTtnQkFDQUEsS0FBS0EsV0FBV0EsT0FBT0E7b0JBRW5CQSxVQUEwQkEsNkJBQTZEQSw4QkFBMEJBO29CQUNqSEEsS0FBS0EsV0FBV0EsT0FBT0E7d0JBRW5CQSxJQUFJQSxXQUFVQTs0QkFFVkEsZ0JBQWdCQTs0QkFDaEJBOzt3QkFFSkEsbURBQXdCQSxpRkFBMkRBLGdEQUFvQkEsNkJBQWtFQSw4QkFBK0JBLE9BQXdCQSw2REFBZUEsR0FBZkE7d0JBQ2hPQTs7Ozs7WUFLWkEsaUJBQThCQSx3REFDMUNBLDBHQUErRUEsMkRBQy9EQSwrQkFBMEJBLDREQUFzRkEsc0NBQ2hJQSw0REFBc0ZBLHNDQUN0RkEsNERBQXNGQTs7WUFJMUVBLEtBQUtB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T0FBT0EsTUFBK0JBLDJDQUFvQkE7Ozs7Ozs7Ozs7Ozs7MENDM0gxREEsQUFBb0hBLFVBQUNBOzRCQUFPQSxRQUFRQSxLQUFJQSw4SUFBd0VBLEFBQTBFQSxVQUFDQTtvQ0FFblNBLFFBQVFBLEtBQUlBO29DQUNaQSxRQUFRQSxLQUFJQTtvQ0FDWkEsUUFBUUEsS0FBSUE7b0NBQ1pBLFFBQVFBLEtBQUlBO29DQUNaQSxRQUFRQSxLQUFJQTtvQ0FDWkEsT0FBT0E7a0NBUCtPQSxLQUFJQTs0QkFVekxBLFFBQVFBLEtBQUlBLDhJQUF3RUEsQUFBMEVBLFVBQUNBO29DQUVoT0EsUUFBUUEsS0FBSUE7b0NBQ1pBLFFBQVFBLEtBQUlBO29DQUNaQSxRQUFRQSxLQUFJQTtvQ0FDWkEsUUFBUUEsS0FBSUE7b0NBQ1pBLFFBQVFBLEtBQUlBO29DQUNaQSxPQUFPQTtrQ0FQNEtBLEtBQUlBOzRCQVV0SEEsT0FBT0E7MEJBcEJsQ0EsS0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7bUNDU25CQTtvQkFFdkJBLE9BQU9BLGVBQWNBOztvQ0FDSUE7b0JBRXpCQSxPQUFPQSxlQUFjQTs7eUNBQ1NBLEdBQUdBLEtBQW9DQTtvQkFFekVBO29CQUNJQSxPQUFPQSxnQkFBZ0JBLEtBQVNBLGVBQWVBIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkRpYWdub3N0aWNzLkNvbnRyYWN0cztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5SZWZsZWN0aW9uO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgQXBwXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgeE11bHRpcGxpZXIgPSAyMDtcclxucHVibGljIHN0YXRpYyBpbnQgeU11bHRpcGxpZXJcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHhNdWx0aXBsaWVyO1xyXG4gICAgfVxyXG59ICAgICAgICBwdWJsaWMgc3RhdGljIGludCBzY3JlZW5XaWR0aCA9IFdpbmRvdy5Jbm5lcldpZHRoLCBzY3JlZW5IZWlnaHQgPSBXaW5kb3cuSW5uZXJIZWlnaHQ7XHJcbnB1YmxpYyBzdGF0aWMgaW50IHdpZHRoXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiAoaW50KU1hdGguQ2VpbGluZygoZG91YmxlKXNjcmVlbldpZHRoIC8geE11bHRpcGxpZXIpO1xyXG4gICAgfVxyXG59cHVibGljIHN0YXRpYyBpbnQgaGVpZ2h0XHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiAoaW50KU1hdGguQ2VpbGluZygoZG91YmxlKXNjcmVlbkhlaWdodCAvIHlNdWx0aXBsaWVyKTtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgSG90YmFyID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgIFBvc2l0aW9uID0gUG9zaXRpb24uQWJzb2x1dGUsXHJcbiAgICAgICAgICAgICAgICBMZWZ0ID0gXCIxMDBweFwiLFxyXG4gICAgICAgICAgICAgICAgVG9wID0gc3RyaW5nLkZvcm1hdChcInswfXB4XCIsV2luZG93LklubmVySGVpZ2h0IC0gNDApICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBSZXNldChtYWtlQmxhbms6IHRydWUpXHJcbiAgICAgICAgICAgIH0sXCJCbGFua1wiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBSZXNldCgpXHJcbiAgICAgICAgICAgIH0sXCJSZXNldFwiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBHZXRDb29yZGluYXRlcygpXHJcbiAgICAgICAgICAgIH0sXCJHZXQgQ29vcmRpbmF0ZXNcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gU2F2ZUFzU3RhcnRlcigpXHJcbiAgICAgICAgICAgIH0sXCJTYXZlIGFzIFN0YXJ0ZXJcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gWm9vbSh6b29tSW46IGZhbHNlKVxyXG4gICAgICAgICAgICB9LFwiWm9vbSBPdXRcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gWm9vbSh6b29tSW46IHRydWUpXHJcbiAgICAgICAgICAgIH0sXCJab29tIEluXCIpKVxyXG4sTmV4dFNxdWFyZVR5cGVCdXR0b24gPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gTmV4dFNxdWFyZVR5cGUoKVxyXG4gICAgICAgICAgICB9LFwiV2FsbFwiKSlcclxuLFBsYXlCdXR0b24gPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gSW52ZXJ0SXNQbGF5aW5nKClcclxuICAgICAgICAgICAgfSxcIuKWtlwiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBTaG93TW9kYWwoTW9kYWxUeXBlLlNldHRpbmdzKVxyXG4gICAgICAgICAgICB9LFwi4pqZXCIpKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTcXVhcmVUeXBlIFNxdWFyZVR5cGVQbGFjaW5nID0gU3F1YXJlVHlwZS5Db3VudDtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxCdXR0b25FbGVtZW50IE5leHRTcXVhcmVUeXBlQnV0dG9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgWm9vbSAoYm9vbCB6b29tSW4pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB4TXVsdGlwbGllciArPSB6b29tSW4gPyAxIDogLTE7XHJcbiAgICAgICAgICAgIGlmICh4TXVsdGlwbGllciA8PSAxKVxyXG4gICAgICAgICAgICAgICAgeE11bHRpcGxpZXIgPSAyO1xyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTmV4dFNxdWFyZVR5cGUgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNxdWFyZVR5cGVQbGFjaW5nID0gKFNxdWFyZVR5cGUpKCgoaW50KVNxdWFyZVR5cGVQbGFjaW5nICsgMSkgJSAoaW50KShTcXVhcmVUeXBlLkNvdW50ICsgMSkpO1xyXG4gICAgICAgICAgICBOZXh0U3F1YXJlVHlwZUJ1dHRvbi5Jbm5lckhUTUwgPSBTcXVhcmVUeXBlUGxhY2luZyA9PSBTcXVhcmVUeXBlLkNvdW50ID8gXCJXYWxsXCIgOiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuVG9DYW1lbFN0cmluZzxTcXVhcmVUeXBlPihTcXVhcmVUeXBlUGxhY2luZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IFJpZ2h0SG90YmFyID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgIFBvc2l0aW9uID0gUG9zaXRpb24uQWJzb2x1dGUsXHJcbiAgICAgICAgICAgICAgICBSaWdodCA9IFwiMTAwcHhcIixcclxuICAgICAgICAgICAgICAgIFRvcCA9IHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLFdpbmRvdy5Jbm5lckhlaWdodCAtIDQwKSAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLWluZm9cIixcclxuICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+IFNob3dNb2RhbChNb2RhbFR5cGUuTm90YWJsZU9iamVjdHMpXHJcbiAgICAgICAgICAgIH0sXCJOb3RhYmxlIE9iamVjdHNcIikpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgUmVzZXQgKGJvb2wgbWFrZUJsYW5rID0gZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIUdsb2JhbC5Db25maXJtKFwiQW55IHVuc2F2ZWQgY2hhbmdlcyB3aWxsIGJlIGxvc3QuIENvbnRpbnVlP1wiKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBTcXVhcmVzLkNsZWFyKCk7XHJcbiAgICAgICAgICAgIERpdmlkZXJzLkNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmICghbWFrZUJsYW5rKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0IHN0YXJ0ZXJQb3NpdGlvbnMgPSBHbG9iYWwuTG9jYWxTdG9yYWdlLkdldEl0ZW0oXCJzdGFydGVyUG9zaXRpb25zXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0ZXJQb3NpdGlvbnMgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgcyA9IChzdHJpbmcpc3RhcnRlclBvc2l0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXN0cmluZy5Jc051bGxPckVtcHR5KHMpKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGpzb25SYXcgPSBKU09OLlBhcnNlKHMpLlRvRHluYW1pYygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoanNvblJhdy5sZW5ndGggPT0gMCB8fCBqc29uUmF3WzBdLkl0ZW0zID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVhY2ggKHZhciBwb3MgaW4gKEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID5bXT4ocykpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNxdWFyZXMuQWRkKHBvcywgU3F1YXJlVHlwZS5DZWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JlYWNoICh2YXIgc3F1YXJlSW5mbyBpbiAoSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFNxdWFyZVR5cGUgPltdPihzKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3F1YXJlcy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihzcXVhcmVJbmZvLkl0ZW0xLCBzcXVhcmVJbmZvLkl0ZW0yKSwgc3F1YXJlSW5mby5JdGVtMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwbGF5aW5nKVxyXG4gICAgICAgICAgICAgICAgSW52ZXJ0SXNQbGF5aW5nKCk7XHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsU3F1YXJlVHlwZSA+PiBHZXRDb29yZGluYXRlc0ludGVyYWwoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBvZmZzZXRDb29yZHMgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KE5lZ0RpdihvZmZzZXRQb3MuSXRlbTEsIHhNdWx0aXBsaWVyKSwgTmVnRGl2KG9mZnNldFBvcy5JdGVtMiwgeU11bHRpcGxpZXIpKTtcclxuICAgICAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuVG9MaXN0PEtleVZhbHVlUGFpcjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixTcXVhcmVUeXBlPj4oU3F1YXJlcykuQ29udmVydEFsbDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+PigoQ29udmVydGVyPEtleVZhbHVlUGFpcjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixTcXVhcmVUeXBlPixTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+PikocyA9PiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFNxdWFyZVR5cGU+KHMuS2V5Lkl0ZW0xICsgb2Zmc2V0Q29vcmRzLkl0ZW0xLCBzLktleS5JdGVtMiArIG9mZnNldENvb3Jkcy5JdGVtMiwgcy5WYWx1ZSkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsU3F1YXJlVHlwZSA+PiBHZXROb3JtYWxpemVkQ29vcmRpbmF0ZXMgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFNxdWFyZVR5cGUgPj4gY29vcmRzID0gR2V0Q29vcmRpbmF0ZXNJbnRlcmFsKCk7XHJcbiAgICAgICAgICAgIGNvb3JkcyA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuV2hlcmU8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPj4oY29vcmRzLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4sYm9vbD4pKGMgPT4gYy5JdGVtMT49IDAgJiYgYy5JdGVtMj49IDAgJiYgYy5JdGVtMTwgd2lkdGggJiYgYy5JdGVtMjwgaGVpZ2h0KSkuVG9MaXN0KCk7XHJcbiAgICAgICAgICAgIGludCBtaW5YID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5NaW48U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPj4oY29vcmRzLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4saW50PikoYyA9PiBjLkl0ZW0xKSksIG1pblkgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk1pbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+Pihjb29yZHMsKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPixpbnQ+KShjID0+IGMuSXRlbTIpKTtcclxuICAgICAgICAgICAgY29vcmRzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPixTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+Pihjb29yZHMsKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPixTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+PikoYyA9PiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFNxdWFyZVR5cGU+KGMuSXRlbTEgLSBtaW5YLCBjLkl0ZW0yIC0gbWluWSwgYy5JdGVtMykpKS5Ub0xpc3QoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvb3JkcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBHZXRDb29yZGluYXRlcyAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RyaW5nIGNvZGVHZW5lcmF0ZWQgPSBzdHJpbmcuRm9ybWF0KFwiKG5ldyBIYXNoU2V0PChpbnQgeCwgaW50IHkpPlxcclxcbnt7XFxyXFxuICAgIHswfVxcclxcbn19LCBcXFwiVW50aXRsZWQgT2JqZWN0XFxcIiwgezF9KVwiLHN0cmluZy5Kb2luKFwiLFxcbiAgICBcIiwgU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPixzdHJpbmc+KEdldE5vcm1hbGl6ZWRDb29yZGluYXRlcygpLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4sc3RyaW5nPikodCA9PiBzdHJpbmcuRm9ybWF0KFwiKHswfSwgezF9KVwiLHQuSXRlbTEsdC5JdGVtMikpKSksSlNPTi5TdHJpbmdpZnkoc3RyaW5nLkZvcm1hdChcInswfXsxfSAvIHsyfVwiLChTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkFsbDxBZGphY2VuY3lUeXBlPihhZGphY2VuY3lSdWxlcywoRnVuYzxBZGphY2VuY3lUeXBlLGJvb2w+KShhID0+IGEgPT0gQWRqYWNlbmN5VHlwZS5PbmUpKSA/IFwiXCIgOiAoc3RyaW5nLkNvbmNhdDxpbnQ+KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0PEFkamFjZW5jeVR5cGUsaW50PihhZGphY2VuY3lSdWxlcywoRnVuYzxBZGphY2VuY3lUeXBlLGludD4pKGsgPT4gKGludClrKSkpKSArIFwiIC0+IFwiKSxzdHJpbmcuQ29uY2F0PGludD4oU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8Ym9vbCxpbnQ+KGRlYWRSdWxlcywoRnVuYzxib29sLGludD4pKGsgPT4gayA/IDEgOiAwKSkpLHN0cmluZy5Db25jYXQ8aW50PihTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxib29sLGludD4obGl2aW5nUnVsZXMsKEZ1bmM8Ym9vbCxpbnQ+KShrID0+IGsgPyAxIDogMCkpKSkpKTtcclxuICAgICAgICAgICAgSFRNTERpdkVsZW1lbnQgbW9kYWwsIG1vZGFsQ29udGVudCA9IFxyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgICAgICBuZXcgSFRNTERpdkVsZW1lbnQgeyBDbGFzc05hbWUgPSBcIm1vZGFsLWNvbnRlbnRcIiB9XHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCB7IENsYXNzTmFtZSA9IFwibW9kYWwtZGlhbG9nXCIgfVxyXG4sbW9kYWwgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCB7IENsYXNzTmFtZSA9IFwibW9kYWxcIiwgU3R5bGUgPSB7IERpc3BsYXkgPSBcImluaGVyaXRcIiB9IH1cclxuLERvY3VtZW50LkJvZHkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihcclxuICAgICAgICAgICAgbW9kYWxDb250ZW50LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KFxyXG4gICAgICAgICAgICAgICAgbmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJtb2RhbC1oZWFkZXJcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0bi1jbG9zZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBPbkNsaWNrID0gZSA9PiBtb2RhbC5SZW1vdmUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuLG5ldyBIVE1MU3BhbkVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSW5uZXJIVE1MID0gXCImdGltZXM7XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgKSxcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MUHJlRWxlbWVudD4oXHJcblxyXG4gICAgICAgICAgICAgICAgZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IEhUTUxQcmVFbGVtZW50KCksKF9vMSk9PntfbzEuQ2xhc3NOYW1lPSBcIm1vZGFsLWJvZHlcIjtfbzEuU3R5bGVbXCJ1c2VyLXNlbGVjdFwiXT0gXCJ0ZXh0XCI7cmV0dXJuIF9vMTt9KSxjb2RlR2VuZXJhdGVkKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFNhdmVBc1N0YXJ0ZXIgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEdsb2JhbC5Mb2NhbFN0b3JhZ2UuU2V0SXRlbShcclxuICAgICAgICAgICAgICAgIFwic3RhcnRlclBvc2l0aW9uc1wiLCBKc29uQ29udmVydC5TZXJpYWxpemVPYmplY3QoR2V0Q29vcmRpbmF0ZXNJbnRlcmFsKCkpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IFNldHRpbmdzUG9wdXAsIE5vdGFibGVPYmplY3RzUG9wdXA7XHJcbnB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgQ3JlYXRlUG9wdXAoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxEaXZFbGVtZW50e1N0eWxlID0ge0ZvbnRTaXplID0gXCIxLjVyZW1cIiwgQmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiLCBQb3NpdGlvbiA9IFBvc2l0aW9uLkZpeGVkLCBUb3AgPSBcIjBweFwiLCBMZWZ0ID0gXCIyNSVcIiwgV2lkdGggPSBcIjUwJVwiLCBIZWlnaHQgPSBcIjEwMCVcIiwgRGlzcGxheSA9IERpc3BsYXkuTm9uZX19O1xyXG59XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBQb3B1cENvbnRhaW5lciA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBIVE1MRGl2RWxlbWVudCgpLChfbzEpPT57X28xLlN0eWxlLlBvc2l0aW9uPSBQb3NpdGlvbi5GaXhlZDtfbzEuU3R5bGUuVG9wPSBcIjBcIjtfbzEuU3R5bGUuTGVmdD0gXCIwXCI7X28xLlN0eWxlLldpZHRoPSBcIjEwMCVcIjtfbzEuU3R5bGVbXCJ4LWluZGV4XCJdPSA5OTk5OTk7X28xLlN0eWxlLkhlaWdodD0gXCIxMDAlXCI7X28xLlN0eWxlLkJhY2tncm91bmRDb2xvcj0gXCJyZ2JhKDAsIDAsIDAsIDAuNSlcIjtfbzEuU3R5bGUuRGlzcGxheT0gRGlzcGxheS5Ob25lO3JldHVybiBfbzE7fSlcclxuLFNldHRpbmdzUG9wdXAgPSBDcmVhdGVQb3B1cCgpKVxyXG4sTm90YWJsZU9iamVjdHNQb3B1cCA9IENyZWF0ZVBvcHVwKCkpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxCdXR0b25FbGVtZW50IFNldHRpbmdzQnV0dG9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxCdXR0b25FbGVtZW50IFBsYXlCdXR0b247XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBJbnZlcnRJc1BsYXlpbmcgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSAhcGxheWluZztcclxuICAgICAgICAgICAgUGxheUJ1dHRvbi5Jbm5lckhUTUwgPSBwbGF5aW5nID8gXCLij7hcIiA6IFwi4pa2XCI7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIHBsYXlpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sW10gbGl2aW5nUnVsZXMgICA9IG5ldyBib29sWzldIHsgZmFsc2UsIGZhbHNlLCB0cnVlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UgfTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2xbXSBkZWFkUnVsZXMgICAgID0gbmV3IGJvb2xbOV0geyBmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UgfTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIEFkamFjZW5jeVR5cGVbXSBhZGphY2VuY3lSdWxlcyA9IG5ldyBBZGphY2VuY3lUeXBlW21heEFkamFjZW50Q2VsbHNdIHsgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lIH07XHJcbnB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ3JlYXRlQ2FudmFzKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MQ2FudmFzRWxlbWVudHtXaWR0aCA9IHNjcmVlbldpZHRoLCBIZWlnaHQgPSBzY3JlZW5IZWlnaHR9O1xyXG59cHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBDcmVhdGVUb3BDYW52YXMoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxDYW52YXNFbGVtZW50e1dpZHRoID0gd2lkdGggKyAyLCBIZWlnaHQgPSBoZWlnaHQgKyAyfTtcclxufSAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBDcmVhdGVCb3R0b21DYW52YXMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgQm90dG9tQ2FudmFzID0gbmV3IEhUTUxDYW52YXNFbGVtZW50IHsgV2lkdGggPSBzY3JlZW5XaWR0aCArIDIgKiB4TXVsdGlwbGllciwgSGVpZ2h0ID0gc2NyZWVuSGVpZ2h0ICsgMiAqIHlNdWx0aXBsaWVyIH07XHJcbiAgICAgICAgICAgIHZhciBCb3R0b21DYW52YXNDb250ZXh0ID0gQm90dG9tQ2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlRyYW5zbGF0ZSgwLjUsIDAuNSk7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVdpZHRoID0gMTtcclxuICAgICAgICAgICAgZm9yIChpbnQgeCA9IDA7IHggPD0gKHdpZHRoICsgMik7IHgrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5Nb3ZlVG8oeCAqIHhNdWx0aXBsaWVyLCAwKTtcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKHggKiB4TXVsdGlwbGllciwgKGhlaWdodCArIDMpICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoaW50IHkgPSAwOyB5IDw9IChoZWlnaHQgKyAyKTsgeSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbygwLCB5ICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5MaW5lVG8oKHdpZHRoICsgMykgKiB4TXVsdGlwbGllciwgeSAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8IDEwOyBuKyspXHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlN0cm9rZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gQm90dG9tQ2FudmFzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBET01DYW52YXMgPSBDcmVhdGVDYW52YXMoKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBET01DYW52YXNDb250ZXh0ID0gRE9NQ2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIERpY3Rpb25hcnk8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiwgU3F1YXJlVHlwZT4gU3F1YXJlcyA9IG5ldyBEaWN0aW9uYXJ5PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4sIFNxdWFyZVR5cGU+KCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBEaWN0aW9uYXJ5PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4sIERpdmlkZXJzSW5mbz4gRGl2aWRlcnMgPSBuZXcgRGljdGlvbmFyeTxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+LCBEaXZpZGVyc0luZm8+KCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IG9mZnNldFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBNb3VzZVBvcyAodGhpcyBNb3VzZUV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgcmVjdCA9IERPTUNhbnZhcy5HZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCkoZS5DbGllbnRYIC0gcmVjdC5MZWZ0KSwgKGludCkoZS5DbGllbnRZIC0gcmVjdC5Ub3ApKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IE5lZ0RpdiAoaW50IGEsIGludCBiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IHJlcyA9IGEgLyBiO1xyXG4gICAgICAgICAgICByZXR1cm4gKGEgPCAwICYmIGEgIT0gYiAqIHJlcykgPyByZXMgLSAxIDogcmVzO1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBkb3VibGUgTmVnRGl2RG91YmxlKGRvdWJsZSBhLCBkb3VibGUgYilcclxue1xyXG4gICAgcmV0dXJuIGEgPj0gMCA/IGEgLyBiIDogKGEgLSBiICsgMSkgLyBiO1xyXG59XHJcbiAgICAgICAgcHVibGljIGNvbnN0IGludCBtYXhBZGphY2VudENlbGxzID0gODtcclxuXHJcbiAgICAgICAgc3RhdGljIExpc3Q8SFRNTFNlbGVjdEVsZW1lbnQ+IGFkamFjZW5jeVJ1bGVzQ2VsbHMgPSBuZXcgTGlzdDxIVE1MU2VsZWN0RWxlbWVudD4oKTtcclxuICAgICAgICBzdGF0aWMgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIVE1MSW5wdXRFbGVtZW50LEhUTUxJbnB1dEVsZW1lbnQ+PiBvcHRpb25DZWxscyA9IG5ldyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPEhUTUxJbnB1dEVsZW1lbnQsSFRNTElucHV0RWxlbWVudD4+KCk7XHJcblxyXG4gICAgICAgIHN0YXRpYyB2b2lkIEFwcGx5UHJlc2V0KGJvb2xbXSBsaXZpbmdSdWxlcywgYm9vbFtdIGRlYWRSdWxlcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDw9IDg7IG4rKylcclxuICAgICAgICAgICAge1xyXG5vcHRpb25DZWxsc1tuXS5JdGVtMS5TZXRCb29sVmFsdWUobGl2aW5nUnVsZXNbbl0pO1xyXG5vcHRpb25DZWxsc1tuXS5JdGVtMi5TZXRCb29sVmFsdWUoZGVhZFJ1bGVzW25dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGVudW0gTW9kYWxUeXBlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTZXR0aW5ncyxcclxuICAgICAgICAgICAgTm90YWJsZU9iamVjdHNcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBTaG93TW9kYWwgKE1vZGFsVHlwZSBtb2RhbFR5cGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBQb3B1cENvbnRhaW5lci5TdHlsZS5EaXNwbGF5ID0gXCJcIjtcclxuICAgICAgICAgICAgSFRNTERpdkVsZW1lbnQgdG9TaG93O1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG1vZGFsVHlwZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNb2RhbFR5cGUuU2V0dGluZ3M6XHJcbiAgICAgICAgICAgICAgICAgICAgdG9TaG93ID0gU2V0dGluZ3NQb3B1cDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgTW9kYWxUeXBlLk5vdGFibGVPYmplY3RzOlxyXG4gICAgICAgICAgICAgICAgICAgIHRvU2hvdyA9IE5vdGFibGVPYmplY3RzUG9wdXA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudEV4Y2VwdGlvbigoKGludCltb2RhbFR5cGUpLlRvU3RyaW5nKCksIFwibW9kYWxUeXBlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEhUTUxEaXZFbGVtZW50IGRpdiBpbiBuZXdbXSB7IFNldHRpbmdzUG9wdXAsIE5vdGFibGVPYmplY3RzUG9wdXAgfSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZGl2LlN0eWxlLkRpc3BsYXkgPSBkaXYgPT0gdG9TaG93ID8gXCJcIiA6IFwibm9uZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgSGlkZU1vZGFsICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBQb3B1cENvbnRhaW5lci5TdHlsZS5EaXNwbGF5ID0gRGlzcGxheS5Ob25lO1xyXG4gICAgICAgICAgICBTZXR0aW5nc1BvcHVwLlN0eWxlLkRpc3BsYXkgPSBEaXNwbGF5Lk5vbmU7XHJcbiAgICAgICAgICAgIE5vdGFibGVPYmplY3RzUG9wdXAuU3R5bGUuRGlzcGxheSA9IERpc3BsYXkuTm9uZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgRHJhd1NoYXBlIChIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+IFNxdWFyZXMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgeE11bHRpcGxpZXIgPSBBcHAueE11bHRpcGxpZXIgKiAyO1xyXG4gICAgICAgICAgICBpbnQgeU11bHRpcGxpZXIgPSBBcHAueU11bHRpcGxpZXIgKiAyO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0dGluZyB3aWR0aCBhbmQgaGVpZ2h0IG9mIHNoYXBlXHJcbiAgICAgICAgICAgIGludCB3aWR0aCA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuTWF4PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PihTcXVhcmVzLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+LGludD4pKHMgPT4gcy5JdGVtMSkpICsgMTtcclxuICAgICAgICAgICAgaW50IGhlaWdodCA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuTWF4PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PihTcXVhcmVzLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+LGludD4pKHMgPT4gcy5JdGVtMikpICsgMTtcclxuICAgICAgICAgICAgLy8gRHJhd2luZyBvbiBpbm5lciBjYW52YXNcclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgaW5uZXJDYW52YXMgPSBuZXcgSFRNTENhbnZhc0VsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgV2lkdGggPSB3aWR0aCxcclxuICAgICAgICAgICAgICAgIEhlaWdodCA9IGhlaWdodFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgY29udGV4dCA9IGlubmVyQ2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgICAgICBVaW50OENsYW1wZWRBcnJheSBpbWFnZURhdGFBcnJheSA9IENyZWF0ZUltYWdlRGF0YUFycmF5KHdpZHRoLCBoZWlnaHQpO1xyXG5mb3JlYWNoICh2YXIgX2QxIGluIFNxdWFyZXMpXHJcbntcclxuICAgIGludCB4O1xyXG4gICAgaW50IHk7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KF9kMSwgb3V0IHgsIG91dCB5KTtcclxuICAgIGltYWdlRGF0YUFycmF5Wyh4ICsgeSAqIHdpZHRoKSAqIDQgKyAzXSA9IDI1NTtcclxufVxuICAgICAgICAgICAgSW1hZ2VEYXRhIGltYWdlRGF0YSA9IG5ldyBJbWFnZURhdGEoaW1hZ2VEYXRhQXJyYXksICh1aW50KXdpZHRoLCAodWludCloZWlnaHQpO1xyXG4gICAgICAgICAgICBjb250ZXh0LlB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xyXG4gICAgICAgICAgICAvLyBSZXNpemluZyB0byB1cHBlciBjYW52YXNcclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgb3V0ZXJDYW52YXMgPSBuZXcgSFRNTENhbnZhc0VsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgV2lkdGggPSB3aWR0aCAqIHhNdWx0aXBsaWVyLFxyXG4gICAgICAgICAgICAgICAgSGVpZ2h0ID0gaGVpZ2h0ICogeU11bHRpcGxpZXJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIG91dGVyQ29udGV4dCA9IG91dGVyQ2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgICAgICBvdXRlckNvbnRleHQuSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG91dGVyQ29udGV4dC5EcmF3SW1hZ2UoaW5uZXJDYW52YXMsIDAsIDAsIG91dGVyQ2FudmFzLldpZHRoLCBvdXRlckNhbnZhcy5IZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG91dGVyQ2FudmFzO1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBVaW50OENsYW1wZWRBcnJheSBDcmVhdGVJbWFnZURhdGFBcnJheShpbnQgd2lkdGgsIGludCBoZWlnaHQpXHJcbntcclxuICAgIHJldHVybiBuZXcgVWludDhDbGFtcGVkQXJyYXkod2lkdGggKiBoZWlnaHQgKiA0KTtcclxufXB1YmxpYyBzdGF0aWMgSFRNTElucHV0RWxlbWVudCBDcmVhdGVDaGVja2JveCgpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTElucHV0RWxlbWVudHtUeXBlID0gSW5wdXRUeXBlLkNoZWNrYm94LCBTdHlsZSA9IHtXaWR0aCA9IFwiMXJlbVwiLCBIZWlnaHQgPSBcIjFlbVwifX07XHJcbn1wdWJsaWMgc3RhdGljIEhUTUxTZWxlY3RFbGVtZW50IENyZWF0ZTAxU2VsZWN0b3IoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxTZWxlY3RFbGVtZW50KCkuQWRkPEhUTUxTZWxlY3RFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcImZhbHNlXCJ9LFwiMFwiKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCJ0cnVlXCJ9LFwiMVwiKSk7XHJcbn1wdWJsaWMgc3RhdGljIEhUTUxTZWxlY3RFbGVtZW50IENyZWF0ZTAxMlNlbGVjdG9yKClcclxue1xyXG4gICAgcmV0dXJuIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFNlbGVjdEVsZW1lbnQ+KG5ldyBIVE1MU2VsZWN0RWxlbWVudCgpLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudHtWYWx1ZSA9IFwiMFwifSxcIjBcIiksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudHtWYWx1ZSA9IFwiMVwifSxcIjFcIiksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudHtWYWx1ZSA9IFwiMlwifSxcIjJcIikpO1xyXG59XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE1haW4gKClcclxuICAgICAgICB7XHJcblN5c3RlbS5BY3Rpb248TW91c2VFdmVudDxIVE1MQ2FudmFzRWxlbWVudD4+IFByb2Nlc3NNb3VzZUV2ZW50ID0gbnVsbDtcbiAgICAgICAgICAgIG9iamVjdCBydWxlc09iamVjdFN0ciA9IEdsb2JhbC5Mb2NhbFN0b3JhZ2UuR2V0SXRlbShcInJ1bGVzXCIpO1xyXG5zdHJpbmcgcjsgICAgICAgICAgICBpZiAoKHIgPSBydWxlc09iamVjdFN0ciBhcyBzdHJpbmcpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGR5bmFtaWMgcnVsZXNPYmogPSBKU09OLlBhcnNlKHIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChydWxlc09iamVjdFN0ciAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFNjcmlwdC5Xcml0ZShcInswfSBpbnN0YW5jZW9mIEFycmF5XCIsIHJ1bGVzT2JqLmxpdmluZ1J1bGVzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpdmluZ1J1bGVzID0gSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8Ym9vbFtdPihKU09OLlN0cmluZ2lmeShydWxlc09iai5saXZpbmdSdWxlcykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoU2NyaXB0LldyaXRlKFwiezB9IGluc3RhbmNlb2YgQXJyYXlcIiwgcnVsZXNPYmouZGVhZFJ1bGVzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYWRSdWxlcyA9IEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PGJvb2xbXT4oSlNPTi5TdHJpbmdpZnkocnVsZXNPYmouZGVhZFJ1bGVzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTY3JpcHQuV3JpdGUoXCJ7MH0gaW5zdGFuY2VvZiBBcnJheVwiLCBydWxlc09iai5hZGphY2VuY3lSdWxlcykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlcyA9IEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PGludFtdPihKU09OLlN0cmluZ2lmeShydWxlc09iai5hZGphY2VuY3lSdWxlcykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIHsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuU3R5bGVbXCJ1c2VyLXNlbGVjdFwiXSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5IZWFkLkFwcGVuZENoaWxkKG5ldyBIVE1MTGlua0VsZW1lbnQgeyBSZWwgPSBcInN0eWxlc2hlZXRcIiwgSHJlZiA9IFwiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9ib290c3RyYXBANS4yLjAvZGlzdC9jc3MvYm9vdHN0cmFwLm1pbi5jc3NcIiB9KTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5TdHlsZS5NYXJnaW4gPSBcIjBweFwiO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKFBvcHVwQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChuZXcgSFRNTFN0eWxlRWxlbWVudCB7IElubmVySFRNTCA9IFwidGQsIHRoIHsgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7IHBhZGRpbmc6IDVweCB9IGJ1dHRvbiB7IG1hcmdpbi1yaWdodDogNXB4IH1cIiB9KTtcclxuXHJcbiAgICAgICAgICAgIEhUTUxUYWJsZUVsZW1lbnQgYWRqYWNlbmN5UnVsZXNUYWJsZSA9IG5ldyBIVE1MVGFibGVFbGVtZW50IHsgU3R5bGUgPSB7IE1hcmdpbkxlZnQgPSBcImF1dG9cIiwgTWFyZ2luUmlnaHQgPSBcImF1dG9cIiB9IH07XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGludCBuID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAoaW50IHkgPSAwOyB5IDwgMzsgeSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEhUTUxUYWJsZVJvd0VsZW1lbnQgcm93ID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KG5ldyBIVE1MVGFibGVSb3dFbGVtZW50KCksYWRqYWNlbmN5UnVsZXNUYWJsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgeCA9IDA7IHggPCAzOyB4KyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeCA9PSAxICYmIHkgPT0gMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LkFwcGVuZENoaWxkKG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlc0NlbGxzLkFkZChDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFNlbGVjdEVsZW1lbnQ+KENyZWF0ZTAxMlNlbGVjdG9yKCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudD4obmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpLHJvdykpLlNldEFkamFjZW5jeVZhbHVlKGFkamFjZW5jeVJ1bGVzW25dKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG4rKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIEhUTUxUYWJsZUVsZW1lbnQgcnVsZXNUYWJsZSA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlRWxlbWVudD4oXHJcbm5ldyBIVE1MVGFibGVFbGVtZW50IHsgU3R5bGUgPSB7IE1hcmdpbkxlZnQgPSBcImF1dG9cIiwgTWFyZ2luUmlnaHQgPSBcImF1dG9cIiB9IH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVSb3dFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVSb3dFbGVtZW50KCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQoKSxcIiNcIiksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50KCksXCJMXCIpLFxyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudCgpLFwiRFwiKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPD0gbWF4QWRqYWNlbnRDZWxsczsgbisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIVE1MVGFibGVSb3dFbGVtZW50IHJvdyA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVSb3dFbGVtZW50PihuZXcgSFRNTFRhYmxlUm93RWxlbWVudCgpLHJ1bGVzVGFibGUpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KCAgICAgICAgICAgICAgICByb3csQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSxuLlRvU3RyaW5nKCkpKTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbkNlbGxzLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8SFRNTElucHV0RWxlbWVudCwgSFRNTElucHV0RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxJbnB1dEVsZW1lbnQ+KENyZWF0ZUNoZWNrYm94KCksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSwgcm93KSkuU2V0Qm9vbFZhbHVlKGxpdmluZ1J1bGVzW25dKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxJbnB1dEVsZW1lbnQ+KENyZWF0ZUNoZWNrYm94KCksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSwgcm93KSkuU2V0Qm9vbFZhbHVlKGRlYWRSdWxlc1tuXSkpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcgLGJvb2xbXSAsYm9vbFtdID4+IHByZXNldHNMaXN0ID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nICxib29sW10gLGJvb2xbXSA+PigpLChfbzEpPT57X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJDb253YXkncyBHYW1lIG9mIExpZmUgUHJlc2V0XCIsIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO19vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZywgYm9vbFtdLCBib29sW10+KFwiSW1tb3J0YWwgQ2VsbHMgUHJlc2V0XCIsIG5ldyBib29sWzlde3RydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWV9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9KSk7X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJBbG1vc3QgSW1tb3J0YWwgQ2VsbHMgUHJlc2V0XCIsIG5ldyBib29sWzlde3RydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIGZhbHNlfSwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO19vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZywgYm9vbFtdLCBib29sW10+KFwiQWx0ZXJuYXRlIENvbndheSdzIEdhbWUgb2YgTGlmZSBQcmVzZXRcIiwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0pKTtyZXR1cm4gX28xO30pO1xyXG5cclxuICAgICAgICAgICAgSFRNTERpdkVsZW1lbnQgcHJlc2V0c0RpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCB7IFN0eWxlID0geyBUZXh0QWxpZ24gPSBUZXh0QWxpZ24uQ2VudGVyIH0gfTtcclxuZm9yZWFjaCAodmFyIF9kMiBpbiBwcmVzZXRzTGlzdClcclxue1xyXG4gICAgc3RyaW5nIG5hbWU7XHJcbiAgICBib29sW10gbGl2aW5nUnVsZXM7XHJcbiAgICBib29sW10gZGVhZFJ1bGVzO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDIsIG91dCBuYW1lLCBvdXQgbGl2aW5nUnVsZXMsIG91dCBkZWFkUnVsZXMpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgcHJlc2V0c0RpdixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnQoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxBbmNob3JFbGVtZW50PihuZXcgSFRNTEFuY2hvckVsZW1lbnR7SHJlZiA9IFwiamF2YXNjcmlwdDp2b2lkKDApXCIsIFN0eWxlID0ge0ZvbnRTaXplID0gXCIxcmVtXCJ9LCBPbkNsaWNrID0gZSA9PiBBcHBseVByZXNldChsaXZpbmdSdWxlczogbGl2aW5nUnVsZXMsIGRlYWRSdWxlczogZGVhZFJ1bGVzKX0sbmFtZSkpKTtcclxufVxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oXHJcblxyXG4gICAgICAgICAgICBTZXR0aW5nc1BvcHVwLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERldGFpbHNFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MRGV0YWlsc0VsZW1lbnQgeyBPcGVuID0gdHJ1ZX0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MU3VtbWFyeUVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxTdW1tYXJ5RWxlbWVudCgpLFwiQWRqYWNlbmN5IFJ1bGVzXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzVGFibGVcclxuICAgICAgICAgICAgICAgICksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERldGFpbHNFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MRGV0YWlsc0VsZW1lbnQgeyBPcGVuID0gdHJ1ZSB9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFN1bW1hcnlFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MU3VtbWFyeUVsZW1lbnQoKSxcIlJ1bGVzXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzVGFibGVcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxuZXcgSFRNTEJSRWxlbWVudCgpLCBwcmVzZXRzRGl2LCBuZXcgSFRNTEJSRWxlbWVudCgpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIixcclxuICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPCBtYXhBZGphY2VudENlbGxzOyBuKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlc1tuXSA9IGFkamFjZW5jeVJ1bGVzQ2VsbHNbbl0uQWRqYWNlbmN5VmFsdWUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPD0gbWF4QWRqYWNlbnRDZWxsczsgbisrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGl2aW5nUnVsZXNbbl0gPSBvcHRpb25DZWxsc1tuXS5JdGVtMS5Cb29sVmFsdWUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVhZFJ1bGVzW25dID0gb3B0aW9uQ2VsbHNbbl0uSXRlbTIuQm9vbFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbC5Mb2NhbFN0b3JhZ2UuU2V0SXRlbShcInJ1bGVzXCIsIEpzb25Db252ZXJ0LlNlcmlhbGl6ZU9iamVjdChuZXdcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpdmluZ1J1bGVzID0gbGl2aW5nUnVsZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYWRSdWxlcyA9IGRlYWRSdWxlcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXMgPSBhZGphY2VuY3lSdWxlc1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICBIaWRlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcIlNhdmUgQ2hhbmdlc1wiKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KFxyXG4gICAgICAgICAgICBOb3RhYmxlT2JqZWN0c1BvcHVwLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tbGlnaHRcIixcclxuICAgICAgICAgICAgICAgIFN0eWxlID0geyBDc3NGbG9hdCA9IEZsb2F0LlJpZ2h0IH0sXHJcbiAgICAgICAgICAgICAgICBPbkNsaWNrID0gZSA9PiBIaWRlTW9kYWwoKVxyXG4gICAgICAgICAgICB9LFwi4p2MXCIpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgTm90YWJsZU9iamVjdHNQb3B1cCxuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU3R5bGUgPSB7IENsZWFyID0gQ2xlYXIuQm90aCB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5mb3JlYWNoICh2YXIgX2QzIGluIE5vdGFibGVPYmplY3RzTGlzdC5Ob3RhYmxlT2JqZWN0cylcclxue1xyXG4gICAgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+IG9iamVjdERldGFpbHM7XHJcbiAgICBzdHJpbmcgZGVzY3JpcHRpb247XHJcbiAgICBzdHJpbmcgcnVsZXM7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KF9kMywgb3V0IG9iamVjdERldGFpbHMsIG91dCBkZXNjcmlwdGlvbiwgb3V0IHJ1bGVzKTtcclxuICAgIEhUTUxEaXZFbGVtZW50IG9iamVjdEluZm8gPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudHtTdHlsZSA9IHtXaWR0aCA9IFwiMzByZW1cIn19LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50e1N0eWxlID0ge0Rpc3BsYXkgPSBEaXNwbGF5LkZsZXgsIEFsaWduSXRlbXMgPSBBbGlnbkl0ZW1zLkNlbnRlciwgRmxleERpcmVjdGlvbiA9IEZsZXhEaXJlY3Rpb24uQ29sdW1ufX0sTm90YWJsZU9iamVjdHNQb3B1cCkpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgb2JqZWN0SW5mbyxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnR7U3R5bGUgPSB7RGlzcGxheSA9IERpc3BsYXkuRmxleCwgQWxpZ25JdGVtcyA9IEFsaWduSXRlbXMuQ2VudGVyLCBGbGV4RGlyZWN0aW9uID0gRmxleERpcmVjdGlvbi5Db2x1bW59fSxEcmF3U2hhcGUob2JqZWN0RGV0YWlscykpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50KCksZGVzY3JpcHRpb24pKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8scnVsZXMpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgb2JqZWN0SW5mbyxuZXcgSFRNTEJSRWxlbWVudCgpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sbmV3IEhUTUxCUkVsZW1lbnQoKSk7XHJcbn1cblxyXG4gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCBiYWNrZ3JvdW5kRGl2ID0gbmV3IEhUTUxEaXZFbGVtZW50IHsgU3R5bGUgPSB7IFBvc2l0aW9uID0gUG9zaXRpb24uUmVsYXRpdmUsIE1pbldpZHRoID0gXCIwXCIsIE1pbkhlaWdodCA9IFwiMFwiIH19O1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuT3ZlcmZsb3cgPSBPdmVyZmxvdy5IaWRkZW47XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5aSW5kZXggPSBcIi0xXCI7XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5Qb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLkxlZnQgPSBcIjBweFwiO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuVG9wID0gXCIwcHhcIjtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgYmFja2dyb3VuZERpdixET01DYW52YXMpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBiYWNrZ3JvdW5kRGl2LEhvdGJhcik7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIGJhY2tncm91bmREaXYsUmlnaHRIb3RiYXIpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKGJhY2tncm91bmREaXYpO1xyXG5cclxuICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBkcmFnZ2luZ1BvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gb3JpZ2luYWxQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICBib29sIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgRE9NQ2FudmFzLk9uTW91c2VEb3duID0gZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IHRydWU7XHJcbmludCB4O1xuaW50IHk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGUuTW91c2VQb3MoKSwgb3V0IHgsIG91dCB5KTtcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4IC0gb2Zmc2V0UG9zLkl0ZW0xLCB5IC0gb2Zmc2V0UG9zLkl0ZW0yKTtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsUG9zID0gb2Zmc2V0UG9zO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBET01DYW52YXMuT25Nb3VzZVVwID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0xLSBvcmlnaW5hbFBvcy5JdGVtMSkgPiB4TXVsdGlwbGllciB8fCBNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTItIG9yaWdpbmFsUG9zLkl0ZW0yKSA+IHlNdWx0aXBsaWVyKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZ1BvcyA9IG9mZnNldFBvcztcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLk9uTW91c2VNb3ZlID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGUuQnV0dG9ucyAmIDEpID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGlmIChkcmFnZ2luZ1BvcyA9PSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApKSBkcmFnZ2luZ1BvcyA9IGUuTW91c2VQb3MoKTtcclxuICAgICAgICAgICAgICAgIHZhciBtb3VzZVBvcyA9IGUuTW91c2VQb3MoKTtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTEtIG9yaWdpbmFsUG9zLkl0ZW0xKSA+IHhNdWx0aXBsaWVyIHx8IE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMS0gb3JpZ2luYWxQb3MuSXRlbTEpID4geU11bHRpcGxpZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIG9mZnNldFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4obW91c2VQb3MuSXRlbTEgLSBkcmFnZ2luZ1Bvcy5JdGVtMSwgbW91c2VQb3MuSXRlbTIgLSBkcmFnZ2luZ1Bvcy5JdGVtMik7XHJcbiAgICAgICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgICAgIH07XHJcblByb2Nlc3NNb3VzZUV2ZW50ID0gKGUpID0+XHJcbntcclxuICAgIC8vaWYgKChAZXZlbnQuQnV0dG9ucyAmIDEpID09IDApIHJldHVybjtcclxuICAgIHZhciBtb3VzZVBvcyA9IGUuTW91c2VQb3MoKTtcclxuICAgIGRvdWJsZSBjbGlja1hfO1xyXG4gICAgZG91YmxlIGNsaWNrWV87XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUsIGRvdWJsZT4oTmVnRGl2RG91YmxlKChkb3VibGUpbW91c2VQb3MuSXRlbTEgLSBvZmZzZXRQb3MuSXRlbTEsIHhNdWx0aXBsaWVyKSwgTmVnRGl2RG91YmxlKChkb3VibGUpbW91c2VQb3MuSXRlbTIgLSBvZmZzZXRQb3MuSXRlbTIsIHlNdWx0aXBsaWVyKSksIG91dCBjbGlja1hfLCBvdXQgY2xpY2tZXyk7XHJcbiAgICBib29sIHBsYWNlTm9ybWFsbHkgPSB0cnVlO1xyXG4gICAgaWYgKFNxdWFyZVR5cGVQbGFjaW5nID09IFNxdWFyZVR5cGUuQ291bnQpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gUGxhY2UgZGl2aWRlcnNcclxuICAgICAgICBwbGFjZU5vcm1hbGx5ID0gZmFsc2U7XHJcbiAgICAgICAgaW50IHhEaXYgPSAwLCB5RGl2ID0gMDtcclxuICAgICAgICBpZiAoKGNsaWNrWF8pICUgMSA8PSAwLjIpXHJcbiAgICAgICAgICAgIHhEaXYgPSAtMTtcclxuICAgICAgICBlbHNlIGlmICgoY2xpY2tYXykgJSAxID49IDAuOClcclxuICAgICAgICAgICAgeERpdiA9IDE7XHJcbiAgICAgICAgaWYgKChjbGlja1lfKSAlIDEgPD0gMC4yKVxyXG4gICAgICAgICAgICB5RGl2ID0gLTE7XHJcbiAgICAgICAgZWxzZSBpZiAoKGNsaWNrWV8pICUgMSA+PSAwLjgpXHJcbiAgICAgICAgICAgIHlEaXYgPSAxO1xyXG4gICAgICAgIERpdmlkZXJzSW5mbyBkaXZpZGVyc0luZm8gPSBEaXZpZGVyc0luZm8uTm9uZTtcclxuICAgICAgICBBY3Rpb248RGl2aWRlcnNJbmZvPiBBc3NpZ24gPSAoRGl2aWRlcnNJbmZvIGRpdkluZm8pID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgeCA9IChpbnQpY2xpY2tYXyArIHhEaXYsIHkgPSAoaW50KWNsaWNrWV8gKyB5RGl2O1xyXG4gICAgICAgICAgICBpZiAoZGl2SW5mbyAhPSBEaXZpZGVyc0luZm8uTm9uZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgRGl2aWRlcnNJbmZvIGRpdmlkZXJzO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFEaXZpZGVycy5UcnlHZXRWYWx1ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpeCwgKGludCl5KSwgb3V0IGRpdmlkZXJzKSlcclxuICAgICAgICAgICAgICAgICAgICBkaXZpZGVycyA9IERpdmlkZXJzSW5mby5Ob25lO1xyXG4gICAgICAgICAgICAgICAgRGl2aWRlcnNbbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4LCB5KV0gPSBkaXZpZGVycyBeIGRpdkluZm87XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIDtcclxuICAgICAgICBzd2l0Y2ggKHhEaXYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh5RGl2KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFzc2lnbihEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFzc2lnbihEaXZpZGVyc0luZm8uUmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHlEaXYgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBc3NpZ24oRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh5RGl2KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFzc2lnbihEaXZpZGVyc0luZm8uQm90dG9tKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZU5vcm1hbGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXZpZGVyc0luZm8gPSBEaXZpZGVyc0luZm8uQm90dG9tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHlEaXYpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAtMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgeERpdiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFzc2lnbihEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdmlkZXJzSW5mbyA9IERpdmlkZXJzSW5mby5SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXZpZGVyc0luZm8gPSBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRpdmlkZXJzSW5mbyAhPSBEaXZpZGVyc0luZm8uTm9uZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHhEaXYgPSAwO1xyXG4gICAgICAgICAgICB5RGl2ID0gMDtcclxuICAgICAgICAgICAgQXNzaWduKGRpdmlkZXJzSW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChwbGFjZU5vcm1hbGx5KVxyXG4gICAge1xyXG4gICAgICAgIGludCBjbGlja1g7XHJcbiAgICAgICAgaW50IGNsaWNrWTtcclxuICAgICAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCljbGlja1hfLCAoaW50KWNsaWNrWV8pLCBvdXQgY2xpY2tYLCBvdXQgY2xpY2tZKTtcclxuICAgICAgICBpZiAoIVNxdWFyZXMuUmVtb3ZlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oY2xpY2tYLCBjbGlja1kpKSlcclxuICAgICAgICAgICAgU3F1YXJlcy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihjbGlja1gsIGNsaWNrWSksIFNxdWFyZVR5cGVQbGFjaW5nID09IFNxdWFyZVR5cGUuQ291bnQgPyBTcXVhcmVUeXBlLkNlbGwgOiBTcXVhcmVUeXBlUGxhY2luZyk7XHJcbiAgICB9XHJcblxyXG4gICAgRHJhdygpO1xyXG59XHJcblxyXG47XG4gICAgICAgICAgICBET01DYW52YXMuT25DbGljayA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoYW5naW5nSW50ZW50KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFByb2Nlc3NNb3VzZUV2ZW50KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBHbG9iYWwuU2V0SW50ZXJ2YWwoKEFjdGlvbilOZXh0RnJhbWUsIDEwMCk7XHJcblxyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgdXBkYXRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgTnVtYmVyT2ZBZGphY2VudENlbGxzIChpbnQgeCwgaW50IHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgYWRqYWNlbnRDZWxscyA9IDA7XHJcbiAgICAgICAgICAgIGludCBuID0gMDtcclxuICAgICAgICAgICAgZm9yIChpbnQgTCA9IDA7IEwgPD0gODsgTCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTCA9PSA0KVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFkamFjZW5jeVJ1bGUgPSBhZGphY2VuY3lSdWxlc1tuKytdO1xyXG5cclxuICAgICAgICAgICAgICAgIGludCB4XyA9IHggLSAxICsgKEwgJSAzKSxcclxuICAgICAgICAgICAgICAgICAgICB5XyA9IHkgLSAxICsgTCAvIDM7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKEhhc0RpdmlkZXJzKHgsIHksIEwpKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChDdXN0b21pemFibGVHYW1lb2ZMaWZlLlNxdWFyZUV4dGVuc2lvbnMuQ29udGFpbnNBbGl2ZTxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oU3F1YXJlcyxuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHhfLCB5XykpKVxyXG4gICAgICAgICAgICAgICAgICAgIGFkamFjZW50Q2VsbHMgKz0gKGludClhZGphY2VuY3lSdWxlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhZGphY2VudENlbGxzID4gbWF4QWRqYWNlbnRDZWxscyA/IG1heEFkamFjZW50Q2VsbHMgOiBhZGphY2VudENlbGxzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIEhhc0RpdmlkZXJzIChpbnQgeCwgaW50IHksIGludCBMKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgRGl2aWRlcnNJbmZvIHRvQ2hlY2s7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoTClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgIHgtLTtcclxuICAgICAgICAgICAgICAgICAgICB5LS07XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b21SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICB5LS07XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b207XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgeS0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgeC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgICAgICAgICAgICB4LS07XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b21SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNzpcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLkJvdHRvbTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgODpcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbkRpdmlkZXJzSW5mbyBkaXZpZGVyc0luZm87XG4gICAgICAgICAgICByZXR1cm4gRGl2aWRlcnMuVHJ5R2V0VmFsdWUobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4LCB5KSwgb3V0IGRpdmlkZXJzSW5mbykgJiYgKGRpdmlkZXJzSW5mbyAmIHRvQ2hlY2spICE9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vdXBkYXRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4gcmVtb3ZpbmcgPSBuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oKTtcclxuICAgICAgICAgICAgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4gYWRkaW5nID0gbmV3IEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4+KCk7XHJcbmZvcmVhY2ggKHZhciBfZDQgaW4gU3F1YXJlcylcclxue1xyXG4gICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+IHBvcztcclxuICAgIFNxdWFyZVR5cGUgc3F1YXJlVHlwZTtcclxuICAgIF9kNC5EZWNvbnN0cnVjdChvdXQgcG9zLCBvdXQgc3F1YXJlVHlwZSk7XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChwb3MsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpZiAoIXNxdWFyZVR5cGUuSXNBbGl2ZSgpKVxyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgaW50IGFkamFjZW50Q2VsbHMgPSAwO1xyXG4gICAgaW50IG4gPSAwO1xyXG4gICAgZm9yIChpbnQgTCA9IDA7IEwgPD0gODsgTCsrKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChMID09IDQpXHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIHZhciBhZGphY2VuY3lSdWxlID0gYWRqYWNlbmN5UnVsZXNbbisrXTtcclxuICAgICAgICBpbnQgeF8gPSB4IC0gMSArIChMICUgMyksIHlfID0geSAtIDEgKyBMIC8gMztcclxuICAgICAgICBpZiAoSGFzRGl2aWRlcnMoeCwgeSwgTCkpXHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIFNxdWFyZVR5cGUgc3F1YXJlSW5mbztcclxuICAgICAgICBpZiAoU3F1YXJlcy5UcnlHZXRWYWx1ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHhfLCB5XyksIG91dCBzcXVhcmVJbmZvKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChzcXVhcmVJbmZvLklzQWxpdmUoKSlcclxuICAgICAgICAgICAgICAgIGFkamFjZW50Q2VsbHMgKz0gKGludClhZGphY2VuY3lSdWxlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IGNlbGxzLlxyXG4gICAgICAgICAgICAvLyBPcHRpbWl6YXRpb24gZm9yIHJ1bGUgb2YgMyBhZGphY2VudCBjZWxsc1xyXG4gICAgICAgICAgICAvL2lmIChMICE9IDcgJiYgTCAhPSA4KVxyXG4gICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgIGlmIChkZWFkUnVsZXNbTnVtYmVyT2ZBZGphY2VudENlbGxzKHhfLCB5XyldKVxyXG4gICAgICAgICAgICAgICAgYWRkaW5nLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHhfLCB5XykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoYWRqYWNlbnRDZWxscyA+IG1heEFkamFjZW50Q2VsbHMpXHJcbiAgICAgICAgYWRqYWNlbnRDZWxscyA9IG1heEFkamFjZW50Q2VsbHM7XHJcbiAgICBpZiAoIXNxdWFyZVR5cGUuSXNVbmRlYWQoKSAmJiAhbGl2aW5nUnVsZXNbYWRqYWNlbnRDZWxsc10pXHJcbiAgICAgICAgcmVtb3ZpbmcuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSkpO1xyXG59XG5mb3JlYWNoICh2YXIgX2Q1IGluIHJlbW92aW5nKVxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDUsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpZiAoIVNxdWFyZXMuUmVtb3ZlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSkpKVxyXG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJTcXVhcmUgdHJpZWQgdG8gYmUgcmVtb3ZlZCBidXQgZGlkbid0IGV4aXN0XCIpO1xyXG59XG5mb3JlYWNoICh2YXIgX2Q2IGluIGFkZGluZylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2Q2LCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgU3F1YXJlcy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4LCB5KSwgU3F1YXJlVHlwZS5DZWxsKTtcclxufVxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxIVE1MQ2FudmFzRWxlbWVudCA+IExhc3RCb3R0b21DYW52YXMgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBIVE1MQ2FudmFzRWxlbWVudD4oMCwgbnVsbCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBEcmF3KClcclxuICAgICAgICB7XHJcblN5c3RlbS5BY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+PyA+IERyYXdNYXJrZXIgPSBudWxsO1xuU3lzdGVtLkFjdGlvbjxTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUsIGRvdWJsZT4/ICwgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+PyA+IERyYXdMaW5lID0gbnVsbDtcblN5c3RlbS5GdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiwgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+PyA+IEdldEZpbmFsRHJhd1BvcyA9IG51bGw7XG5TeXN0ZW0uRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4sIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj8gPiBHZXREcmF3UG9zID0gbnVsbDtcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IFRvcENhbnZhcyA9IENyZWF0ZVRvcENhbnZhcygpO1xyXG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBCb3R0b21DYW52YXMgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoTGFzdEJvdHRvbUNhbnZhcy5JdGVtMT09IHhNdWx0aXBsaWVyKVxyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzID0gTGFzdEJvdHRvbUNhbnZhcy5JdGVtMjtcclxuICAgICAgICAgICAgaWYgKEJvdHRvbUNhbnZhcyA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXMgPSBDcmVhdGVCb3R0b21DYW52YXMoKTtcclxuICAgICAgICAgICAgICAgIExhc3RCb3R0b21DYW52YXMgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBIVE1MQ2FudmFzRWxlbWVudD4oeE11bHRpcGxpZXIsIEJvdHRvbUNhbnZhcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIFRvcENhbnZhc0NvbnRleHQgPSBUb3BDYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuQ2xlYXJSZWN0KDAsIDAsIERPTUNhbnZhcy5XaWR0aCwgRE9NQ2FudmFzLkhlaWdodCk7XHJcbmludCBvZmZzZXRYO1xuaW50IG9mZnNldFk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KG9mZnNldFBvcywgb3V0IG9mZnNldFgsIG91dCBvZmZzZXRZKTtcclxuICAgICAgICAgICAgVWludDhDbGFtcGVkQXJyYXkgaW1hZ2VEYXRhQXJyYXkgPSBDcmVhdGVJbWFnZURhdGFBcnJheSh3aWR0aCArIDIsIGhlaWdodCArIDIpO1xyXG4gICAgICAgICAgICBcclxuR2V0RHJhd1BvcyA9IChwb3MpID0+XHJcbntcclxuICAgIGludCB4O1xyXG4gICAgaW50IHk7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KHBvcywgb3V0IHgsIG91dCB5KTtcclxuICAgIGludCBkcmF3WCA9IHggKyAob2Zmc2V0WCAvIHhNdWx0aXBsaWVyKSArIDEsIGRyYXdZID0geSArIChvZmZzZXRZIC8geU11bHRpcGxpZXIpICsgMTtcclxuICAgIGlmIChkcmF3WCA8IDAgfHwgZHJhd1ggPj0gd2lkdGggKyAyIHx8IGRyYXdZIDwgMCB8fCBkcmF3WSA+PSBoZWlnaHQgKyAyKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oZHJhd1gsIGRyYXdZKTtcclxufVxyXG5cclxuO1xuZm9yZWFjaCAodmFyIF9kNyBpbiBTcXVhcmVzKVxyXG57XHJcbiAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4gcG9zO1xyXG4gICAgU3F1YXJlVHlwZSBzcXVhcmVUeXBlO1xyXG4gICAgX2Q3LkRlY29uc3RydWN0KG91dCBwb3MsIG91dCBzcXVhcmVUeXBlKTtcclxuICAgIHZhciBkcmF3UG9zID0gR2V0RHJhd1Bvcyhwb3MpO1xyXG4gICAgaWYgKGRyYXdQb3MgPT0gbnVsbClcclxuICAgICAgICBjb250aW51ZTtcclxuICAgIGludCBkcmF3WDtcclxuICAgIGludCBkcmF3WTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoZHJhd1Bvcy5WYWx1ZSwgb3V0IGRyYXdYLCBvdXQgZHJhd1kpO1xyXG4gICAgaW50IGlkeCA9IGRyYXdYICsgZHJhd1kgKiAod2lkdGggKyAyKTtcclxuICAgIGltYWdlRGF0YUFycmF5W2lkeCAqIDQgKyAzXSA9IChieXRlKShzcXVhcmVUeXBlID09IFNxdWFyZVR5cGUuQ2VsbCA/IDI1NSA6IHNxdWFyZVR5cGUgPT0gU3F1YXJlVHlwZS5CcmljayA/IDE3MCA6IHNxdWFyZVR5cGUgPT0gU3F1YXJlVHlwZS5JbW1vcnRhbENlbGwgPyA4NSA6ICgoU3lzdGVtLkZ1bmM8aW50PikoKCkgPT5cclxuICAgIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVW5rbm93biBzcXVhcmUgdHlwZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICApKSgpKTtcclxufVxuICAgICAgICAgICAgSW1hZ2VEYXRhIGltYWdlRGF0YSA9IG5ldyBJbWFnZURhdGEoaW1hZ2VEYXRhQXJyYXksICh1aW50KSh3aWR0aCArIDIpLCAodWludCkoaGVpZ2h0ICsgMikpO1xyXG4gICAgICAgICAgICBUb3BDYW52YXNDb250ZXh0LlB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdJbWFnZShCb3R0b21DYW52YXMsIG9mZnNldFggJSB4TXVsdGlwbGllciAtIHhNdWx0aXBsaWVyLCBvZmZzZXRZICUgeU11bHRpcGxpZXIgLSB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0ltYWdlKFRvcENhbnZhcywgKG9mZnNldFggJSB4TXVsdGlwbGllcikgLSB4TXVsdGlwbGllciwgKG9mZnNldFkgJSB5TXVsdGlwbGllcikgLSB5TXVsdGlwbGllciwgKHdpZHRoICsgMikgKiB4TXVsdGlwbGllciwgKGhlaWdodCArIDIpICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG5HZXRGaW5hbERyYXdQb3MgPSAocG9zKSA9PlxyXG57XHJcbiAgICB2YXIgcCA9IEdldERyYXdQb3MocG9zKTtcclxuICAgIGlmIChwID09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICBkb3VibGUgZHJhd1g7XHJcbiAgICBkb3VibGUgZHJhd1k7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4ocC5WYWx1ZS5JdGVtMSwgcC5WYWx1ZS5JdGVtMiksIG91dCBkcmF3WCwgb3V0IGRyYXdZKTtcclxuICAgIGRyYXdYICo9ICh3aWR0aCArIDIpICogeE11bHRpcGxpZXIgLyBUb3BDYW52YXMuV2lkdGg7XHJcbiAgICBkcmF3WSAqPSAoaGVpZ2h0ICsgMikgKiB5TXVsdGlwbGllciAvIFRvcENhbnZhcy5IZWlnaHQ7XHJcbiAgICBkcmF3WCArPSAob2Zmc2V0WCAlIHhNdWx0aXBsaWVyKSAtIHhNdWx0aXBsaWVyO1xyXG4gICAgZHJhd1kgKz0gKG9mZnNldFkgJSB5TXVsdGlwbGllcikgLSB5TXVsdGlwbGllcjtcclxuICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+KGRyYXdYLCBkcmF3WSk7XHJcbn1cclxuXHJcbjtcbkRyYXdMaW5lID0gKHN0YXJ0LCBlbmQpID0+XHJcbntcclxuICAgIGlmICghc3RhcnQuSGFzVmFsdWUgfHwgIWVuZC5IYXNWYWx1ZSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICB2YXIgc3RhcnRQb3MgPSBzdGFydC5WYWx1ZTtcclxuICAgIHZhciBlbmRQb3MgPSBlbmQuVmFsdWU7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkJlZ2luUGF0aCgpO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5Nb3ZlVG8oc3RhcnRQb3MuSXRlbTEsIHN0YXJ0UG9zLkl0ZW0yKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuTGluZVRvKGVuZFBvcy5JdGVtMSwgZW5kUG9zLkl0ZW0yKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuTGluZVdpZHRoID0gMjtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuU3Ryb2tlU3R5bGUgPSBcInJlZFwiOyAvLyBcInJnYigxNzAsIDE3MCwgMTcwKVwiO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5TdHJva2UoKTtcclxufVxyXG5cclxuO1xuRHJhd01hcmtlciA9IChwb3NpdGlvbikgPT5cclxue1xyXG4gICAgaWYgKCFwb3NpdGlvbi5IYXNWYWx1ZSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICBkb3VibGUgZHJhd1g7XHJcbiAgICBkb3VibGUgZHJhd1k7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KHBvc2l0aW9uLlZhbHVlLCBvdXQgZHJhd1gsIG91dCBkcmF3WSk7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkJlZ2luUGF0aCgpO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5BcmMoZHJhd1gsIGRyYXdZLCB4TXVsdGlwbGllciAvIDgsIDAsIDIgKiBNYXRoLlBJKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuRmlsbFN0eWxlID0gXCJyZWRcIjsgLy9cInJnYigxNzAsIDE3MCwgMTcwKVwiO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5GaWxsKCk7XHJcbn1cclxuXHJcbjtcbmZvcmVhY2ggKHZhciBfZDggaW4gRGl2aWRlcnMpXHJcbntcclxuICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiBwb3M7XHJcbiAgICBEaXZpZGVyc0luZm8gZGl2aWRlcnM7XHJcbiAgICBfZDguRGVjb25zdHJ1Y3Qob3V0IHBvcywgb3V0IGRpdmlkZXJzKTtcclxuICAgIGZvcmVhY2ggKHZhciBkaXZpZGVyIGluIG5ld1tde0RpdmlkZXJzSW5mby5Cb3R0b21SaWdodCwgRGl2aWRlcnNJbmZvLlJpZ2h0LCBEaXZpZGVyc0luZm8uQm90dG9tfSlcclxuICAgIHtcclxuICAgICAgICBpZiAoIWRpdmlkZXJzLkhhc0ZsYWcoZGl2aWRlcikpXHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIHN3aXRjaCAoZGl2aWRlcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhc2UgRGl2aWRlcnNJbmZvLlJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPnN0YXJ0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KShwb3MuSXRlbTEgKyAxKSwgKGludClwb3MuSXRlbTIpO1xyXG4gICAgICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPmVuZFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCkocG9zLkl0ZW0xICsgMSksIChpbnQpKHBvcy5JdGVtMiArIDEpKTtcclxuICAgICAgICAgICAgICAgIERyYXdMaW5lKEdldEZpbmFsRHJhd1BvcyhzdGFydFBvcyksIEdldEZpbmFsRHJhd1BvcyhlbmRQb3MpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIERpdmlkZXJzSW5mby5Cb3R0b206XHJcbiAgICAgICAgICAgICAgICBEcmF3TGluZShHZXRGaW5hbERyYXdQb3MobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KShwb3MuSXRlbTEpLCAoaW50KShwb3MuSXRlbTIgKyAxKSkpLCBHZXRGaW5hbERyYXdQb3MobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KShwb3MuSXRlbTEgKyAxKSwgKGludCkocG9zLkl0ZW0yICsgMSkpKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQ6XHJcbiAgICAgICAgICAgICAgICBEcmF3TWFya2VyKEdldEZpbmFsRHJhd1BvcyhuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKHBvcy5JdGVtMSArIDEpLCAoaW50KShwb3MuSXRlbTIgKyAxKSkpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBmcmFtZU51bSA9IDA7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBOZXh0RnJhbWUgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghcGxheWluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgYm9vbCBza2lwRnJhbWVzID0gU3F1YXJlcy5Db3VudCA+PSAyNTA7XHJcbiAgICAgICAgICAgIGludCB1cGRhdGVzUGVyRHJhdyA9IDE7Ly8gc2tpcEZyYW1lcyA/IDIgOiAxO1xyXG4gICAgICAgICAgICBmcmFtZU51bSsrO1xyXG4gICAgICAgICAgICBpZiAoc2tpcEZyYW1lcyAmJiAoZnJhbWVOdW0gJSB1cGRhdGVzUGVyRHJhdykgIT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPCB1cGRhdGVzUGVyRHJhdzsgbisrKVxyXG4gICAgICAgICAgICAgICAgVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRleHQuUmVndWxhckV4cHJlc3Npb25zO1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBFeHRlbnNpb25zXHJcbiAgICB7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKChlLCBjKSA9PiBjLmFwcGVuZENoaWxkKGUpKSh7ZWxlbWVudH0sIHtjb250YWluaW5nRWxlbX0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgQWRkVG88VD4odGhpcyBUIGVsZW1lbnQsIE5vZGUgY29udGFpbmluZ0VsZW0pIHdoZXJlIFQgOiBOb2RlO1xyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBUIEFkZFRvQm9keTxUPih0aGlzIFQgbikgd2hlcmUgVCA6IE5vZGUgPT4gQXBwLnJvb3QuQXBwZW5kQ2hpbGQ8VD4obik7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwie25vZGV9LmFwcGVuZENoaWxkKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBBcHBlbmRDaGlsZDxUPih0aGlzIE5vZGUgbm9kZSwgVCBlbGVtZW50KSB3aGVyZSBUIDogTm9kZTtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIEhpZGU8VD4odGhpcyBUIGVsZW1lbnQpIHdoZXJlIFQgOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zdHlsZS5kaXNwbGF5ID0gJycsIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgU2hvdzxUPih0aGlzIFQgZWxlbWVudCkgd2hlcmUgVCA6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihsaSA9PiAobGkuYXBwZW5kQ2hpbGQoe2VsZW1lbnR9KSwgbGkpKShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MTElFbGVtZW50IFdyYXBMaSh0aGlzIE5vZGUgZWxlbWVudCk7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGRpdiA9PiAoZGl2LmFwcGVuZENoaWxkKHtlbGVtZW50fSksIGRpdikpKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MRGl2RWxlbWVudCBXcmFwRGl2KHRoaXMgTm9kZSBlbGVtZW50KTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFQgQWRkPFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgc3RyaW5nPltdIG5vZGVzKSB3aGVyZSBUIDogTm9kZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoVW5pb248Tm9kZSwgc3RyaW5nPiBub2RlIGluIG5vZGVzKVxyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUuSXM8c3RyaW5nPigpKVxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuQXBwZW5kQ2hpbGQobmV3IFRleHQobm9kZS5BczxzdHJpbmc+KCkpKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LkFwcGVuZENoaWxkKG5vZGUuQXM8Tm9kZT4oKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBUIEFkZEVsZW1lbnQ8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LG5vZGVzKTtcclxufXB1YmxpYyBzdGF0aWMgVCBBZGREaXY8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCgpLG5vZGVzKSk7XHJcbn1wdWJsaWMgc3RhdGljIFQgQWRkVWw8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBVbmlvbjxOb2RlLCBzdHJpbmc+W10sIHN0cmluZz5bXSBub2RlcylcclxuICAgIHdoZXJlIFQgOiBOb2RlXHJcbntcclxuICAgIHJldHVybiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPFQ+KGVsZW1lbnQsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVUxpc3RFbGVtZW50PihuZXcgSFRNTFVMaXN0RWxlbWVudCgpLFN5c3RlbS5BcnJheUV4dGVuc2lvbnMuTWFwPFVuaW9uPE5vZGUsVW5pb248Tm9kZSwgc3RyaW5nPltdLHN0cmluZz4sVW5pb248Tm9kZSxzdHJpbmc+Pihub2RlcywoRnVuYzxVbmlvbjxOb2RlLFVuaW9uPE5vZGUsIHN0cmluZz5bXSxzdHJpbmc+LFVuaW9uPE5vZGUsc3RyaW5nPj4pKG4gPT4gKFVuaW9uPE5vZGUsIHN0cmluZz4pKG4uSXM8VW5pb248Tm9kZSwgc3RyaW5nPltdPigpID8gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MTElFbGVtZW50PihuZXcgSFRNTExJRWxlbWVudCgpLG4uQXM8VW5pb248Tm9kZSwgc3RyaW5nPltdPigpKSA6IG4uSXM8c3RyaW5nPigpID8gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MTElFbGVtZW50PihuZXcgSFRNTExJRWxlbWVudCgpLG4uQXM8c3RyaW5nPigpKSA6IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTExJRWxlbWVudD4obmV3IEhUTUxMSUVsZW1lbnQoKSxuLkFzPE5vZGU+KCkpKSkpKSk7XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBBZGRDYW1lbFNwYWNlKHRoaXMgc3RyaW5nIHN0cilcclxue1xyXG4gICAgcmV0dXJuIFJlZ2V4LlJlcGxhY2UoUmVnZXguUmVwbGFjZShzdHIsIEBcIihbXl9hLXpdKShbXl9hLXpdW2Etel0pXCIsIFwiJDEgJDJcIiksIEBcIihbYS16XSkoW15fYS16XSlcIiwgXCIkMSAkMlwiKTtcclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIFRvQ2FtZWxTdHJpbmc8VD4odGhpcyBUIGUpXHJcbiAgICB3aGVyZSBUIDogc3RydWN0LCBTeXN0ZW0uRW51bVxyXG57XHJcbiAgICByZXR1cm4gZS5Ub1N0cmluZygpLkFkZENhbWVsU3BhY2UoKS5SZXBsYWNlKCdfJywgJyAnKTtcclxufSAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBBZGRFbnVtPFQ+KHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBUPyBkZWZhdWx0VmFsdWUgPSBudWxsLCBzdHJpbmcgZGVmYXVsdFZhbHVlU3RyaW5nID0gXCJcIikgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChkZWZhdWx0VmFsdWUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHNlbGVjdC5BZGQoQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50IHsgVmFsdWUgPSBcIlwiLCBTZWxlY3RlZCA9IHRydWUsIERpc2FibGUgPSB0cnVlIH0sZGVmYXVsdFZhbHVlU3RyaW5nKSk7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFQgdmFsdWUgaW4gU3lzdGVtLkVudW0uR2V0VmFsdWVzKHR5cGVvZihUKSkpXHJcbiAgICAgICAgICAgICAgICBzZWxlY3QuQWRkKEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFZhbHVlID0gKChpbnQpKG9iamVjdCl2YWx1ZSkuVG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBTZWxlY3RlZCA9IG9iamVjdC5FcXVhbHMoZGVmYXVsdFZhbHVlLCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLlRvQ2FtZWxTdHJpbmc8VD4odmFsdWUpKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIGJvb2wgQm9vbFZhbHVlKHRoaXMgSFRNTElucHV0RWxlbWVudCBjaGVja0JveClcclxue1xyXG4gICAgcmV0dXJuIGNoZWNrQm94LkNoZWNrZWQ7XHJcbn1wdWJsaWMgc3RhdGljIGJvb2wgQm9vbFZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0KVxyXG57XHJcbiAgICByZXR1cm4gc2VsZWN0LlZhbHVlID09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlO1xyXG59cHVibGljIHN0YXRpYyBBZGphY2VuY3lUeXBlIEFkamFjZW5jeVZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0KVxyXG57XHJcbiAgICByZXR1cm4gKEFkamFjZW5jeVR5cGUpaW50LlBhcnNlKHNlbGVjdC5WYWx1ZSk7XHJcbn1wdWJsaWMgc3RhdGljIFQ/IFZhbHVlPFQ+KHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0KVxyXG4gICAgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxue1xyXG4gICAgcmV0dXJuIHNlbGVjdC5WYWx1ZSA9PSBcIlwiID8gbnVsbCA6IChUPyApKFQpKG9iamVjdClpbnQuUGFyc2Uoc2VsZWN0LlZhbHVlKTtcclxufSAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MSW5wdXRFbGVtZW50IFNldEJvb2xWYWx1ZSh0aGlzIEhUTUxJbnB1dEVsZW1lbnQgY2hlY2tCb3gsIGJvb2wgdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjaGVja0JveC5DaGVja2VkID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHJldHVybiBjaGVja0JveDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBTZXRCb29sVmFsdWUodGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QsIGJvb2wgdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxlY3QuVmFsdWUgPSB2YWx1ZS5Ub1N0cmluZygpLlRvTG93ZXIoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBTZXRBZGphY2VuY3lWYWx1ZSh0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdCwgQWRqYWNlbmN5VHlwZSB2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGVjdC5WYWx1ZSA9ICgoaW50KXZhbHVlKS5Ub1N0cmluZygpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxTZWxlY3RFbGVtZW50IFNldFZhbHVlPFQ+KHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBUIHZhbHVlKSB3aGVyZSBUIDogc3RydWN0LCBTeXN0ZW0uRW51bVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZWN0LlZhbHVlID0gKChpbnQpKG9iamVjdCl2YWx1ZSkuVG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgc3RyaW5nIFRvVGltZVN0cmluZyh0aGlzIFRpbWVTcGFuIHRpbWUpXHJcbntcclxuICAgIHJldHVybiB0aW1lLlRvU3RyaW5nKHRpbWUgPj0gVGltZVNwYW4uRnJvbUhvdXJzKDEpID8gQFwiaFxcOm1tXFw6c3NcIiA6IEBcIm1cXDpzc1wiKTtcclxufSAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc2V0Q3VzdG9tVmFsaWRpdHkoe21lc3NhZ2V9KSwgZS5yZXBvcnRWYWxpZGl0eSgpLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIFNldEN1c3RvbVZhbGlkaXR5PFQ+KHRoaXMgVCBlbGVtZW50LCBzdHJpbmcgbWVzc2FnZSkgd2hlcmUgVCA6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihlID0+IChlLnNldEF0dHJpYnV0ZSgnbGlzdCcsIHtkYXRhbGlzdElEfSksIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIEhUTUxJbnB1dEVsZW1lbnQgU2V0RGF0YUxpc3QodGhpcyBIVE1MSW5wdXRFbGVtZW50IGVsZW1lbnQsIHN0cmluZyBkYXRhbGlzdElEKTtcclxuICAgICAgICAvL1tUZW1wbGF0ZShcIntlbGVtfS5hcHBlbmRDaGlsZCh7YWRkaW5nfSlcIildXHJcbiAgICAgICAgLy9wdWJsaWMgc3RhdGljIGV4dGVybiBUIEFwcGVuZDxUPiAodGhpcyBOb2RlIGVsZW0sIFQgYWRkaW5nKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gSm9pbkJSKHRoaXMgSUVudW1lcmFibGU8c3RyaW5nPiBzdHJpbmdzKVxyXG4gICAgICAgIHtcclxuU3lzdGVtLkZ1bmM8SUVudW1lcmFibGU8VW5pb248Tm9kZSwgc3RyaW5nPj4+IElubmVyID0gbnVsbDtcbiAgICAgICAgICAgIFxyXG5Jbm5lciA9ICgpID0+XHJcbntcclxuICAgIHVzaW5nICh2YXIgZW51bWVyID0gc3RyaW5ncy5HZXRFbnVtZXJhdG9yKCkpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKCFlbnVtZXIuTW92ZU5leHQoKSlcclxuICAgICAgICAgICAgeWllbGQgYnJlYWs7XHJcbiAgICAgICAgeWllbGQgcmV0dXJuIGVudW1lci5DdXJyZW50O1xyXG4gICAgICAgIHdoaWxlIChlbnVtZXIuTW92ZU5leHQoKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiBuZXcgSFRNTEJSRWxlbWVudCgpO1xyXG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gZW51bWVyLkN1cnJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG47XG4gICAgICAgICAgICByZXR1cm4gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Ub0FycmF5PFVuaW9uPE5vZGUsc3RyaW5nPj4oSW5uZXIoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBOb3RhYmxlT2JqZWN0c0xpc3RcclxuICAgIHtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWFkb25seSBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gLHN0cmluZyAsc3RyaW5nID4+IE5vdGFibGVPYmplY3RzID1cclxuICAgICAgICAgICAgZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiAsc3RyaW5nICxzdHJpbmcgPj4oKSwoX28zKT0+e19vMy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+Piwgc3RyaW5nLCBzdHJpbmc+KGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4oKSwgKF9vMSkgPT5cclxue1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApKTtcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigxLCAwKSk7XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMSwgMSkpO1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDIpKTtcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigyLCAyKSk7XHJcbiAgICByZXR1cm4gX28xO1xyXG59XHJcblxyXG4pLCBcIlR3byBHZW5lcmF0aW9uIE5pbmV0eSBEZWdyZWUgUm90YXRvclwiLCBcIjAwMTAxMC0tLSAvIDAwMDEwMS0tLVwiKSk7X28zLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8SGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+LCBzdHJpbmcsIHN0cmluZz4oZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PigpLCAoX28yKSA9PlxyXG57XHJcbiAgICBfbzIuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCkpO1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDEsIDApKTtcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigxLCAxKSk7XHJcbiAgICBfbzIuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMSkpO1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDIpKTtcclxuICAgIHJldHVybiBfbzI7XHJcbn1cclxuXHJcbiksIFwiT25lIEdlbmVyYXRpb24gTmluZXR5IERlZ3JlZSBSb3RhdG9yXCIsIFwiMDAxMDEwLS0tIC8gMDAwMTAxLS0tXCIpKTtyZXR1cm4gX28zO30pO1xyXG4gICAgfVxyXG59IiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgLy8vIDxzdW1tYXJ5PlxyXG4gICAgLy8vIE9wdGlvbnM6XHJcbiAgICAvLy8gLSBDZWxsIChJc0NlbGw6IHRydWUsIElzV2FsbDogZmFsc2UpICB8IEJsYWNrXHJcbiAgICAvLy8gLSBXYWxsIChJc0NlbGw6IHRydWUsIElzV2FsbDogdHJ1ZSkgICB8IEdyZXlcclxuICAgIC8vLyAtIEJyaWNrIChJc0NlbGw6IGZhbHNlLCBJc1dhbGw6IHRydWUpIHwgR3JleVxyXG4gICAgLy8vIDwvc3VtbWFyeT5cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIFNxdWFyZUV4dGVuc2lvbnNcclxuICAgIHtcclxucHVibGljIHN0YXRpYyBib29sIElzQWxpdmUodGhpcyBTcXVhcmVUeXBlIHNxdWFyZVR5cGUpXHJcbntcclxuICAgIHJldHVybiBzcXVhcmVUeXBlICE9IFNxdWFyZVR5cGUuQnJpY2s7XHJcbn1wdWJsaWMgc3RhdGljIGJvb2wgSXNVbmRlYWQodGhpcyBTcXVhcmVUeXBlIHNxdWFyZVR5cGUpXHJcbntcclxuICAgIHJldHVybiBzcXVhcmVUeXBlICE9IFNxdWFyZVR5cGUuQ2VsbDtcclxufXB1YmxpYyBzdGF0aWMgYm9vbCBDb250YWluc0FsaXZlPFQ+KHRoaXMgRGljdGlvbmFyeTxULCBTcXVhcmVUeXBlPiBkaWMsIFQga2V5KVxyXG57XHJcblNxdWFyZVR5cGUgc3F1YXJlVHlwZTtcbiAgICByZXR1cm4gZGljLlRyeUdldFZhbHVlKGtleSwgb3V0IHNxdWFyZVR5cGUpICYmIHNxdWFyZVR5cGUuSXNBbGl2ZSgpO1xyXG59ICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW51bSBTcXVhcmVUeXBlXHJcbiAgICB7XHJcbiAgICAgICAgQ2VsbCwgIC8vIEJsYWNrXHJcbiAgICAgICAgSW1tb3J0YWxDZWxsLCAgLy8gR3JleVxyXG4gICAgICAgIEJyaWNrLCAvLyBHcmV5XHJcbiAgICAgICAgQ291bnRcclxuICAgIH1cclxuXHJcbiAgICBbRmxhZ3NdXHJcbiAgICBwdWJsaWMgZW51bSBEaXZpZGVyc0luZm9cclxuICAgIHtcclxuICAgICAgICBOb25lID0gMCxcclxuICAgICAgICBSaWdodCA9IDEgPDwgMCxcclxuICAgICAgICBCb3R0b20gPSAxIDw8IDEsXHJcbiAgICAgICAgQm90dG9tUmlnaHQgPSAxIDw8IDJcclxuICAgIH1cclxufVxyXG4iXQp9Cg==
