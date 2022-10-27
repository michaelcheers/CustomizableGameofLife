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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDdXN0b21pemFibGVHYW1lb2ZMaWZlLmpzIiwKICAic291cmNlUm9vdCI6ICIiLAogICJzb3VyY2VzIjogWyJDbGFzczEuY3MiLCJFeHRlbnNpb25zLmNzIiwiTm90YWJsZU9iamVjdHNMaXN0LmNzIiwiU3F1YXJlLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBbVhBQSx3QkFBaUVBO1lBQ3JEQSxxQkFBd0JBO1lBQ3BDQTtZQUFxQkEsSUFBSUEsQ0FBQ0EsS0FBSUEsOENBQTZCQTtnQkFFM0NBO29CQUVJQSxlQUFtQkEsV0FBV0E7b0JBQzlCQSxJQUFJQSxrQkFBa0JBO3dCQUVsQkEsSUFBSUEsQUFBcUNBOzRCQUNyQ0EseUNBQWNBLDhDQUFzQ0EsZUFBZUEsdUJBQXZCQTs7d0JBQ2hEQSxJQUFJQSxBQUFxQ0E7NEJBQ3JDQSx1Q0FBWUEsOENBQXNDQSxlQUFlQSxxQkFBdkJBOzt3QkFDOUNBLElBQUlBLEFBQXFDQTs0QkFDckNBLDRDQUFpQkEsOENBQXFDQSxlQUFlQSwwQkFBdEJBOzs7Ozs7O1lBSy9EQTtZQUNBQSwwQkFBMEJBO1lBQzFCQTtZQUNBQSwwQkFBMEJBO1lBQzFCQSwwQkFBMEJBOztZQUUxQkEsMEJBQXVDQTs7Z0JBRW5DQTtnQkFDQUEsS0FBS0EsV0FBV0EsT0FBT0E7b0JBRW5CQSxVQUEwQkEsNkJBQTZEQSw4QkFBMEJBO29CQUNqSEEsS0FBS0EsV0FBV0EsT0FBT0E7d0JBRW5CQSxJQUFJQSxXQUFVQTs0QkFFVkEsZ0JBQWdCQTs0QkFDaEJBOzt3QkFFSkEsbURBQXdCQSxpRkFBMkRBLGdEQUFvQkEsNkJBQWtFQSw4QkFBK0JBLE9BQXdCQSw2REFBZUEsR0FBZkE7d0JBQ2hPQTs7Ozs7WUFLWkEsaUJBQThCQSx3REFDMUNBLDBHQUErRUEsMkRBQy9EQSwrQkFBMEJBLDREQUFzRkEsc0NBQ2hJQSw0REFBc0ZBLHNDQUN0RkEsNERBQXNGQTs7WUFJMUVBLEtBQUtB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Ozs7Ozs7Ozs7OzswQ0MzSDFEQSxBQUFvSEEsVUFBQ0E7NEJBQU9BLFFBQVFBLEtBQUlBLDhJQUF3RUEsQUFBMEVBLFVBQUNBO29DQUVuU0EsUUFBUUEsS0FBSUE7b0NBQ1pBLFFBQVFBLEtBQUlBO29DQUNaQSxRQUFRQSxLQUFJQTtvQ0FDWkEsUUFBUUEsS0FBSUE7b0NBQ1pBLFFBQVFBLEtBQUlBO29DQUNaQSxPQUFPQTtrQ0FQK09BLEtBQUlBOzRCQVV6TEEsUUFBUUEsS0FBSUEsOElBQXdFQSxBQUEwRUEsVUFBQ0E7b0NBRWhPQSxRQUFRQSxLQUFJQTtvQ0FDWkEsUUFBUUEsS0FBSUE7b0NBQ1pBLFFBQVFBLEtBQUlBO29DQUNaQSxRQUFRQSxLQUFJQTtvQ0FDWkEsUUFBUUEsS0FBSUE7b0NBQ1pBLE9BQU9BO2tDQVA0S0EsS0FBSUE7NEJBVXRIQSxPQUFPQTswQkFwQmxDQSxLQUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzttQ0NTbkJBO29CQUV2QkEsT0FBT0EsZUFBY0E7O29DQUNJQTtvQkFFekJBLE9BQU9BLGVBQWNBOzt5Q0FDU0EsR0FBR0EsS0FBb0NBO29CQUV6RUE7b0JBQ0lBLE9BQU9BLGdCQUFnQkEsS0FBU0EsZUFBZUEiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnM7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uRGlhZ25vc3RpY3MuQ29udHJhY3RzO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlJlZmxlY3Rpb247XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBBcHBcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCB4TXVsdGlwbGllciA9IDIwO1xyXG5wdWJsaWMgc3RhdGljIGludCB5TXVsdGlwbGllclxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4geE11bHRpcGxpZXI7XHJcbiAgICB9XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IHNjcmVlbldpZHRoID0gV2luZG93LklubmVyV2lkdGgsIHNjcmVlbkhlaWdodCA9IFdpbmRvdy5Jbm5lckhlaWdodDtcclxucHVibGljIHN0YXRpYyBpbnQgd2lkdGhcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIChpbnQpTWF0aC5DZWlsaW5nKChkb3VibGUpc2NyZWVuV2lkdGggLyB4TXVsdGlwbGllcik7XHJcbiAgICB9XHJcbn1wdWJsaWMgc3RhdGljIGludCBoZWlnaHRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIChpbnQpTWF0aC5DZWlsaW5nKChkb3VibGUpc2NyZWVuSGVpZ2h0IC8geU11bHRpcGxpZXIpO1xyXG4gICAgfVxyXG59XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBIb3RiYXIgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFN0eWxlID0ge1xyXG4gICAgICAgICAgICAgICAgUG9zaXRpb24gPSBQb3NpdGlvbi5BYnNvbHV0ZSxcclxuICAgICAgICAgICAgICAgIExlZnQgPSBcIjEwMHB4XCIsXHJcbiAgICAgICAgICAgICAgICBUb3AgPSBzdHJpbmcuRm9ybWF0KFwiezB9cHhcIixXaW5kb3cuSW5uZXJIZWlnaHQgLSA0MCkgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFJlc2V0KG1ha2VCbGFuazogdHJ1ZSlcclxuICAgICAgICAgICAgfSxcIkJsYW5rXCIpKVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFJlc2V0KClcclxuICAgICAgICAgICAgfSxcIlJlc2V0XCIpKVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IEdldENvb3JkaW5hdGVzKClcclxuICAgICAgICAgICAgfSxcIkdldCBDb29yZGluYXRlc1wiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBTYXZlQXNTdGFydGVyKClcclxuICAgICAgICAgICAgfSxcIlNhdmUgYXMgU3RhcnRlclwiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBab29tKHpvb21JbjogZmFsc2UpXHJcbiAgICAgICAgICAgIH0sXCJab29tIE91dFwiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBab29tKHpvb21JbjogdHJ1ZSlcclxuICAgICAgICAgICAgfSxcIlpvb20gSW5cIikpXHJcbixOZXh0U3F1YXJlVHlwZUJ1dHRvbiA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBOZXh0U3F1YXJlVHlwZSgpXHJcbiAgICAgICAgICAgIH0sXCJXYWxsXCIpKVxyXG4sUGxheUJ1dHRvbiA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBJbnZlcnRJc1BsYXlpbmcoKVxyXG4gICAgICAgICAgICB9LFwi4pa2XCIpKVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFNob3dNb2RhbChNb2RhbFR5cGUuU2V0dGluZ3MpXHJcbiAgICAgICAgICAgIH0sXCLimplcIikpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFNxdWFyZVR5cGUgU3F1YXJlVHlwZVBsYWNpbmcgPSBTcXVhcmVUeXBlLkNvdW50O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTEJ1dHRvbkVsZW1lbnQgTmV4dFNxdWFyZVR5cGVCdXR0b247XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBab29tIChib29sIHpvb21JbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHhNdWx0aXBsaWVyICs9IHpvb21JbiA/IDEgOiAtMTtcclxuICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE5leHRTcXVhcmVUeXBlICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTcXVhcmVUeXBlUGxhY2luZyA9IChTcXVhcmVUeXBlKSgoKGludClTcXVhcmVUeXBlUGxhY2luZyArIDEpICUgKGludCkoU3F1YXJlVHlwZS5Db3VudCArIDEpKTtcclxuICAgICAgICAgICAgTmV4dFNxdWFyZVR5cGVCdXR0b24uSW5uZXJIVE1MID0gU3F1YXJlVHlwZVBsYWNpbmcgPT0gU3F1YXJlVHlwZS5Db3VudCA/IFwiV2FsbFwiIDogQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLlRvQ2FtZWxTdHJpbmc8U3F1YXJlVHlwZT4oU3F1YXJlVHlwZVBsYWNpbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBSaWdodEhvdGJhciA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU3R5bGUgPSB7XHJcbiAgICAgICAgICAgICAgICBQb3NpdGlvbiA9IFBvc2l0aW9uLkFic29sdXRlLFxyXG4gICAgICAgICAgICAgICAgUmlnaHQgPSBcIjEwMHB4XCIsXHJcbiAgICAgICAgICAgICAgICBUb3AgPSBzdHJpbmcuRm9ybWF0KFwiezB9cHhcIixXaW5kb3cuSW5uZXJIZWlnaHQgLSA0MCkgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1pbmZvXCIsXHJcbiAgICAgICAgICAgICAgICBPbkNsaWNrID0gZSA9PiBTaG93TW9kYWwoTW9kYWxUeXBlLk5vdGFibGVPYmplY3RzKVxyXG4gICAgICAgICAgICB9LFwiTm90YWJsZSBPYmplY3RzXCIpKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFJlc2V0IChib29sIG1ha2VCbGFuayA9IGZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCFHbG9iYWwuQ29uZmlybShcIkFueSB1bnNhdmVkIGNoYW5nZXMgd2lsbCBiZSBsb3N0LiBDb250aW51ZT9cIikpIHJldHVybjtcclxuICAgICAgICAgICAgU3F1YXJlcy5DbGVhcigpO1xyXG4gICAgICAgICAgICBEaXZpZGVycy5DbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAoIW1ha2VCbGFuaylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgICAgIG9iamVjdCBzdGFydGVyUG9zaXRpb25zID0gR2xvYmFsLkxvY2FsU3RvcmFnZS5HZXRJdGVtKFwic3RhcnRlclBvc2l0aW9uc1wiKTtcclxuICAgICAgICAgICAgICAgIGlmIChzdGFydGVyUG9zaXRpb25zICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nIHMgPSAoc3RyaW5nKXN0YXJ0ZXJQb3NpdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdHJpbmcuSXNOdWxsT3JFbXB0eShzKSlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBqc29uUmF3ID0gSlNPTi5QYXJzZShzKS5Ub0R5bmFtaWMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb25SYXcubGVuZ3RoID09IDAgfHwganNvblJhd1swXS5JdGVtMyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JlYWNoICh2YXIgcG9zIGluIChKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+W10+KHMpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTcXVhcmVzLkFkZChwb3MsIFNxdWFyZVR5cGUuQ2VsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAodmFyIHNxdWFyZUluZm8gaW4gKEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxTcXVhcmVUeXBlID5bXT4ocykpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNxdWFyZXMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oc3F1YXJlSW5mby5JdGVtMSwgc3F1YXJlSW5mby5JdGVtMiksIHNxdWFyZUluZm8uSXRlbTMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGxheWluZylcclxuICAgICAgICAgICAgICAgIEludmVydElzUGxheWluZygpO1xyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFNxdWFyZVR5cGUgPj4gR2V0Q29vcmRpbmF0ZXNJbnRlcmFsKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gb2Zmc2V0Q29vcmRzID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihOZWdEaXYob2Zmc2V0UG9zLkl0ZW0xLCB4TXVsdGlwbGllciksIE5lZ0RpdihvZmZzZXRQb3MuSXRlbTIsIHlNdWx0aXBsaWVyKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlRvTGlzdDxLZXlWYWx1ZVBhaXI8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4sU3F1YXJlVHlwZT4+KFNxdWFyZXMpLkNvbnZlcnRBbGw8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPj4oKENvbnZlcnRlcjxLZXlWYWx1ZVBhaXI8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4sU3F1YXJlVHlwZT4sU3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPj4pKHMgPT4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBTcXVhcmVUeXBlPihzLktleS5JdGVtMSArIG9mZnNldENvb3Jkcy5JdGVtMSwgcy5LZXkuSXRlbTIgKyBvZmZzZXRDb29yZHMuSXRlbTIsIHMuVmFsdWUpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFNxdWFyZVR5cGUgPj4gR2V0Tm9ybWFsaXplZENvb3JkaW5hdGVzICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ICxTcXVhcmVUeXBlID4+IGNvb3JkcyA9IEdldENvb3JkaW5hdGVzSW50ZXJhbCgpO1xyXG4gICAgICAgICAgICBjb29yZHMgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLldoZXJlPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4+KGNvb3JkcywoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+LGJvb2w+KShjID0+IGMuSXRlbTE+PSAwICYmIGMuSXRlbTI+PSAwICYmIGMuSXRlbTE8IHdpZHRoICYmIGMuSXRlbTI8IGhlaWdodCkpLlRvTGlzdCgpO1xyXG4gICAgICAgICAgICBpbnQgbWluWCA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuTWluPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4+KGNvb3JkcywoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+LGludD4pKGMgPT4gYy5JdGVtMSkpLCBtaW5ZID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5NaW48U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPj4oY29vcmRzLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4saW50PikoYyA9PiBjLkl0ZW0yKSk7XHJcbiAgICAgICAgICAgIGNvb3JkcyA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4sU3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPj4oY29vcmRzLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4sU3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPj4pKGMgPT4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50LCBTcXVhcmVUeXBlPihjLkl0ZW0xIC0gbWluWCwgYy5JdGVtMiAtIG1pblksIGMuSXRlbTMpKSkuVG9MaXN0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb29yZHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgR2V0Q29vcmRpbmF0ZXMgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHN0cmluZyBjb2RlR2VuZXJhdGVkID0gc3RyaW5nLkZvcm1hdChcIihuZXcgSGFzaFNldDwoaW50IHgsIGludCB5KT5cXHJcXG57e1xcclxcbiAgICB7MH1cXHJcXG59fSwgXFxcIlVudGl0bGVkIE9iamVjdFxcXCIsIHsxfSlcIixzdHJpbmcuSm9pbihcIixcXG4gICAgXCIsIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4sc3RyaW5nPihHZXROb3JtYWxpemVkQ29vcmRpbmF0ZXMoKSwoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+LHN0cmluZz4pKHQgPT4gc3RyaW5nLkZvcm1hdChcIih7MH0sIHsxfSlcIix0Lkl0ZW0xLHQuSXRlbTIpKSkpLEpTT04uU3RyaW5naWZ5KHN0cmluZy5Gb3JtYXQoXCJ7MH17MX0gLyB7Mn1cIiwoU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5BbGw8QWRqYWNlbmN5VHlwZT4oYWRqYWNlbmN5UnVsZXMsKEZ1bmM8QWRqYWNlbmN5VHlwZSxib29sPikoYSA9PiBhID09IEFkamFjZW5jeVR5cGUuT25lKSkgPyBcIlwiIDogKHN0cmluZy5Db25jYXQ8aW50PihTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxBZGphY2VuY3lUeXBlLGludD4oYWRqYWNlbmN5UnVsZXMsKEZ1bmM8QWRqYWNlbmN5VHlwZSxpbnQ+KShrID0+IChpbnQpaykpKSkgKyBcIiAtPiBcIiksc3RyaW5nLkNvbmNhdDxpbnQ+KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0PGJvb2wsaW50PihkZWFkUnVsZXMsKEZ1bmM8Ym9vbCxpbnQ+KShrID0+IGsgPyAxIDogMCkpKSxzdHJpbmcuQ29uY2F0PGludD4oU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8Ym9vbCxpbnQ+KGxpdmluZ1J1bGVzLChGdW5jPGJvb2wsaW50PikoayA9PiBrID8gMSA6IDApKSkpKSk7XHJcbiAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IG1vZGFsLCBtb2RhbENvbnRlbnQgPSBcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICAgICAgbmV3IEhUTUxEaXZFbGVtZW50IHsgQ2xhc3NOYW1lID0gXCJtb2RhbC1jb250ZW50XCIgfVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnQgeyBDbGFzc05hbWUgPSBcIm1vZGFsLWRpYWxvZ1wiIH1cclxuLG1vZGFsID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnQgeyBDbGFzc05hbWUgPSBcIm1vZGFsXCIsIFN0eWxlID0geyBEaXNwbGF5ID0gXCJpbmhlcml0XCIgfSB9XHJcbixEb2N1bWVudC5Cb2R5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oXHJcbiAgICAgICAgICAgIG1vZGFsQ29udGVudCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MRGl2RWxlbWVudFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwibW9kYWwtaGVhZGVyXCJcclxuICAgICAgICAgICAgICAgIH1cclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4tY2xvc2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT4gbW9kYWwuUmVtb3ZlKClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbixuZXcgSFRNTFNwYW5FbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIElubmVySFRNTCA9IFwiJnRpbWVzO1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFByZUVsZW1lbnQ+KFxyXG5cclxuICAgICAgICAgICAgICAgIGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBIVE1MUHJlRWxlbWVudCgpLChfbzEpPT57X28xLkNsYXNzTmFtZT0gXCJtb2RhbC1ib2R5XCI7X28xLlN0eWxlW1widXNlci1zZWxlY3RcIl09IFwidGV4dFwiO3JldHVybiBfbzE7fSksY29kZUdlbmVyYXRlZClcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBTYXZlQXNTdGFydGVyICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBHbG9iYWwuTG9jYWxTdG9yYWdlLlNldEl0ZW0oXHJcbiAgICAgICAgICAgICAgICBcInN0YXJ0ZXJQb3NpdGlvbnNcIiwgSnNvbkNvbnZlcnQuU2VyaWFsaXplT2JqZWN0KEdldENvb3JkaW5hdGVzSW50ZXJhbCgpKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBTZXR0aW5nc1BvcHVwLCBOb3RhYmxlT2JqZWN0c1BvcHVwO1xyXG5wdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IENyZWF0ZVBvcHVwKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MRGl2RWxlbWVudHtTdHlsZSA9IHtGb250U2l6ZSA9IFwiMS41cmVtXCIsIEJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIiwgUG9zaXRpb24gPSBQb3NpdGlvbi5GaXhlZCwgVG9wID0gXCIwcHhcIiwgTGVmdCA9IFwiMjUlXCIsIFdpZHRoID0gXCI1MCVcIiwgSGVpZ2h0ID0gXCIxMDAlXCIsIERpc3BsYXkgPSBEaXNwbGF5Lk5vbmV9fTtcclxufVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgUG9wdXBDb250YWluZXIgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgSFRNTERpdkVsZW1lbnQoKSwoX28xKT0+e19vMS5TdHlsZS5Qb3NpdGlvbj0gUG9zaXRpb24uRml4ZWQ7X28xLlN0eWxlLlRvcD0gXCIwXCI7X28xLlN0eWxlLkxlZnQ9IFwiMFwiO19vMS5TdHlsZS5XaWR0aD0gXCIxMDAlXCI7X28xLlN0eWxlW1wieC1pbmRleFwiXT0gOTk5OTk5O19vMS5TdHlsZS5IZWlnaHQ9IFwiMTAwJVwiO19vMS5TdHlsZS5CYWNrZ3JvdW5kQ29sb3I9IFwicmdiYSgwLCAwLCAwLCAwLjUpXCI7X28xLlN0eWxlLkRpc3BsYXk9IERpc3BsYXkuTm9uZTtyZXR1cm4gX28xO30pXHJcbixTZXR0aW5nc1BvcHVwID0gQ3JlYXRlUG9wdXAoKSlcclxuLE5vdGFibGVPYmplY3RzUG9wdXAgPSBDcmVhdGVQb3B1cCgpKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQnV0dG9uRWxlbWVudCBTZXR0aW5nc0J1dHRvbjtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQnV0dG9uRWxlbWVudCBQbGF5QnV0dG9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgSW52ZXJ0SXNQbGF5aW5nICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwbGF5aW5nID0gIXBsYXlpbmc7XHJcbiAgICAgICAgICAgIFBsYXlCdXR0b24uSW5uZXJIVE1MID0gcGxheWluZyA/IFwi4o+4XCIgOiBcIuKWtlwiO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBwbGF5aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbFtdIGxpdmluZ1J1bGVzICAgPSBuZXcgYm9vbFs5XSB7IGZhbHNlLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlIH07XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sW10gZGVhZFJ1bGVzICAgICA9IG5ldyBib29sWzldIHsgZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlIH07XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBBZGphY2VuY3lUeXBlW10gYWRqYWNlbmN5UnVsZXMgPSBuZXcgQWRqYWNlbmN5VHlwZVttYXhBZGphY2VudENlbGxzXSB7IEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSB9O1xyXG5wdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IENyZWF0ZUNhbnZhcygpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTENhbnZhc0VsZW1lbnR7V2lkdGggPSBzY3JlZW5XaWR0aCwgSGVpZ2h0ID0gc2NyZWVuSGVpZ2h0fTtcclxufXB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ3JlYXRlVG9wQ2FudmFzKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MQ2FudmFzRWxlbWVudHtXaWR0aCA9IHdpZHRoICsgMiwgSGVpZ2h0ID0gaGVpZ2h0ICsgMn07XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ3JlYXRlQm90dG9tQ2FudmFzKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IEJvdHRvbUNhbnZhcyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudCB7IFdpZHRoID0gc2NyZWVuV2lkdGggKyAyICogeE11bHRpcGxpZXIsIEhlaWdodCA9IHNjcmVlbkhlaWdodCArIDIgKiB5TXVsdGlwbGllciB9O1xyXG4gICAgICAgICAgICB2YXIgQm90dG9tQ2FudmFzQ29udGV4dCA9IEJvdHRvbUNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5TdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5UcmFuc2xhdGUoMC41LCAwLjUpO1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVXaWR0aCA9IDE7XHJcbiAgICAgICAgICAgIGZvciAoaW50IHggPSAwOyB4IDw9ICh3aWR0aCArIDIpOyB4KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTW92ZVRvKHggKiB4TXVsdGlwbGllciwgMCk7XHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVUbyh4ICogeE11bHRpcGxpZXIsIChoZWlnaHQgKyAzKSAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGludCB5ID0gMDsgeSA8PSAoaGVpZ2h0ICsgMik7IHkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5Nb3ZlVG8oMCwgeSAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKCh3aWR0aCArIDMpICogeE11bHRpcGxpZXIsIHkgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPCAxMDsgbisrKVxyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5TdHJva2UoKTtcclxuICAgICAgICAgICAgcmV0dXJuIEJvdHRvbUNhbnZhcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgRE9NQ2FudmFzID0gQ3JlYXRlQ2FudmFzKCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgRE9NQ2FudmFzQ29udGV4dCA9IERPTUNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBEaWN0aW9uYXJ5PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4sIFNxdWFyZVR5cGU+IFNxdWFyZXMgPSBuZXcgRGljdGlvbmFyeTxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+LCBTcXVhcmVUeXBlPigpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgRGljdGlvbmFyeTxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+LCBEaXZpZGVyc0luZm8+IERpdmlkZXJzID0gbmV3IERpY3Rpb25hcnk8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiwgRGl2aWRlcnNJbmZvPigpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBvZmZzZXRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gTW91c2VQb3MgKHRoaXMgTW91c2VFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHJlY3QgPSBET01DYW52YXMuR2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKGUuQ2xpZW50WCAtIHJlY3QuTGVmdCksIChpbnQpKGUuQ2xpZW50WSAtIHJlY3QuVG9wKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBOZWdEaXYgKGludCBhLCBpbnQgYilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCByZXMgPSBhIC8gYjtcclxuICAgICAgICAgICAgcmV0dXJuIChhIDwgMCAmJiBhICE9IGIgKiByZXMpID8gcmVzIC0gMSA6IHJlcztcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgZG91YmxlIE5lZ0RpdkRvdWJsZShkb3VibGUgYSwgZG91YmxlIGIpXHJcbntcclxuICAgIHJldHVybiBhID49IDAgPyBhIC8gYiA6IChhIC0gYiArIDEpIC8gYjtcclxufVxyXG4gICAgICAgIHB1YmxpYyBjb25zdCBpbnQgbWF4QWRqYWNlbnRDZWxscyA9IDg7XHJcblxyXG4gICAgICAgIHN0YXRpYyBMaXN0PEhUTUxTZWxlY3RFbGVtZW50PiBhZGphY2VuY3lSdWxlc0NlbGxzID0gbmV3IExpc3Q8SFRNTFNlbGVjdEVsZW1lbnQ+KCk7XHJcbiAgICAgICAgc3RhdGljIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SFRNTElucHV0RWxlbWVudCxIVE1MSW5wdXRFbGVtZW50Pj4gb3B0aW9uQ2VsbHMgPSBuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIVE1MSW5wdXRFbGVtZW50LEhUTUxJbnB1dEVsZW1lbnQ+PigpO1xyXG5cclxuICAgICAgICBzdGF0aWMgdm9pZCBBcHBseVByZXNldChib29sW10gbGl2aW5nUnVsZXMsIGJvb2xbXSBkZWFkUnVsZXMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8PSA4OyBuKyspXHJcbiAgICAgICAgICAgIHtcclxub3B0aW9uQ2VsbHNbbl0uSXRlbTEuU2V0Qm9vbFZhbHVlKGxpdmluZ1J1bGVzW25dKTtcclxub3B0aW9uQ2VsbHNbbl0uSXRlbTIuU2V0Qm9vbFZhbHVlKGRlYWRSdWxlc1tuXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBlbnVtIE1vZGFsVHlwZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU2V0dGluZ3MsXHJcbiAgICAgICAgICAgIE5vdGFibGVPYmplY3RzXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgU2hvd01vZGFsIChNb2RhbFR5cGUgbW9kYWxUeXBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUG9wdXBDb250YWluZXIuU3R5bGUuRGlzcGxheSA9IFwiXCI7XHJcbiAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IHRvU2hvdztcclxuICAgICAgICAgICAgc3dpdGNoIChtb2RhbFR5cGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgTW9kYWxUeXBlLlNldHRpbmdzOlxyXG4gICAgICAgICAgICAgICAgICAgIHRvU2hvdyA9IFNldHRpbmdzUG9wdXA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1vZGFsVHlwZS5Ob3RhYmxlT2JqZWN0czpcclxuICAgICAgICAgICAgICAgICAgICB0b1Nob3cgPSBOb3RhYmxlT2JqZWN0c1BvcHVwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnRFeGNlcHRpb24oKChpbnQpbW9kYWxUeXBlKS5Ub1N0cmluZygpLCBcIm1vZGFsVHlwZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3JlYWNoIChIVE1MRGl2RWxlbWVudCBkaXYgaW4gbmV3W10geyBTZXR0aW5nc1BvcHVwLCBOb3RhYmxlT2JqZWN0c1BvcHVwIH0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRpdi5TdHlsZS5EaXNwbGF5ID0gZGl2ID09IHRvU2hvdyA/IFwiXCIgOiBcIm5vbmVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEhpZGVNb2RhbCAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUG9wdXBDb250YWluZXIuU3R5bGUuRGlzcGxheSA9IERpc3BsYXkuTm9uZTtcclxuICAgICAgICAgICAgU2V0dGluZ3NQb3B1cC5TdHlsZS5EaXNwbGF5ID0gRGlzcGxheS5Ob25lO1xyXG4gICAgICAgICAgICBOb3RhYmxlT2JqZWN0c1BvcHVwLlN0eWxlLkRpc3BsYXkgPSBEaXNwbGF5Lk5vbmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IERyYXdTaGFwZSAoSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiBTcXVhcmVzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IHhNdWx0aXBsaWVyID0gQXBwLnhNdWx0aXBsaWVyICogMjtcclxuICAgICAgICAgICAgaW50IHlNdWx0aXBsaWVyID0gQXBwLnlNdWx0aXBsaWVyICogMjtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldHRpbmcgd2lkdGggYW5kIGhlaWdodCBvZiBzaGFwZVxyXG4gICAgICAgICAgICBpbnQgd2lkdGggPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk1heDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oU3F1YXJlcywoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixpbnQ+KShzID0+IHMuSXRlbTEpKSArIDE7XHJcbiAgICAgICAgICAgIGludCBoZWlnaHQgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk1heDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oU3F1YXJlcywoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixpbnQ+KShzID0+IHMuSXRlbTIpKSArIDE7XHJcbiAgICAgICAgICAgIC8vIERyYXdpbmcgb24gaW5uZXIgY2FudmFzXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGlubmVyQ2FudmFzID0gbmV3IEhUTUxDYW52YXNFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFdpZHRoID0gd2lkdGgsXHJcbiAgICAgICAgICAgICAgICBIZWlnaHQgPSBoZWlnaHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGNvbnRleHQgPSBpbm5lckNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgVWludDhDbGFtcGVkQXJyYXkgaW1hZ2VEYXRhQXJyYXkgPSBDcmVhdGVJbWFnZURhdGFBcnJheSh3aWR0aCwgaGVpZ2h0KTtcclxuZm9yZWFjaCAodmFyIF9kMSBpbiBTcXVhcmVzKVxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDEsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpbWFnZURhdGFBcnJheVsoeCArIHkgKiB3aWR0aCkgKiA0ICsgM10gPSAyNTU7XHJcbn1cbiAgICAgICAgICAgIEltYWdlRGF0YSBpbWFnZURhdGEgPSBuZXcgSW1hZ2VEYXRhKGltYWdlRGF0YUFycmF5LCAodWludCl3aWR0aCwgKHVpbnQpaGVpZ2h0KTtcclxuICAgICAgICAgICAgY29udGV4dC5QdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcclxuICAgICAgICAgICAgLy8gUmVzaXppbmcgdG8gdXBwZXIgY2FudmFzXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IG91dGVyQ2FudmFzID0gbmV3IEhUTUxDYW52YXNFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFdpZHRoID0gd2lkdGggKiB4TXVsdGlwbGllcixcclxuICAgICAgICAgICAgICAgIEhlaWdodCA9IGhlaWdodCAqIHlNdWx0aXBsaWVyXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBvdXRlckNvbnRleHQgPSBvdXRlckNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgb3V0ZXJDb250ZXh0LkltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBvdXRlckNvbnRleHQuRHJhd0ltYWdlKGlubmVyQ2FudmFzLCAwLCAwLCBvdXRlckNhbnZhcy5XaWR0aCwgb3V0ZXJDYW52YXMuSGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBvdXRlckNhbnZhcztcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgVWludDhDbGFtcGVkQXJyYXkgQ3JlYXRlSW1hZ2VEYXRhQXJyYXkoaW50IHdpZHRoLCBpbnQgaGVpZ2h0KVxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KHdpZHRoICogaGVpZ2h0ICogNCk7XHJcbn1wdWJsaWMgc3RhdGljIEhUTUxJbnB1dEVsZW1lbnQgQ3JlYXRlQ2hlY2tib3goKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxJbnB1dEVsZW1lbnR7VHlwZSA9IElucHV0VHlwZS5DaGVja2JveCwgU3R5bGUgPSB7V2lkdGggPSBcIjFyZW1cIiwgSGVpZ2h0ID0gXCIxZW1cIn19O1xyXG59cHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBDcmVhdGUwMVNlbGVjdG9yKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MU2VsZWN0RWxlbWVudCgpLkFkZDxIVE1MU2VsZWN0RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCJmYWxzZVwifSxcIjBcIiksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudHtWYWx1ZSA9IFwidHJ1ZVwifSxcIjFcIikpO1xyXG59cHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBDcmVhdGUwMTJTZWxlY3RvcigpXHJcbntcclxuICAgIHJldHVybiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxTZWxlY3RFbGVtZW50PihuZXcgSFRNTFNlbGVjdEVsZW1lbnQoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcIjBcIn0sXCIwXCIpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcIjFcIn0sXCIxXCIpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcIjJcIn0sXCIyXCIpKTtcclxufVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBNYWluICgpXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uQWN0aW9uPE1vdXNlRXZlbnQ8SFRNTENhbnZhc0VsZW1lbnQ+PiBQcm9jZXNzTW91c2VFdmVudCA9IG51bGw7XG4gICAgICAgICAgICBvYmplY3QgcnVsZXNPYmplY3RTdHIgPSBHbG9iYWwuTG9jYWxTdG9yYWdlLkdldEl0ZW0oXCJydWxlc1wiKTtcclxuc3RyaW5nIHI7ICAgICAgICAgICAgaWYgKChyID0gcnVsZXNPYmplY3RTdHIgYXMgc3RyaW5nKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBkeW5hbWljIHJ1bGVzT2JqID0gSlNPTi5QYXJzZShyKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocnVsZXNPYmplY3RTdHIgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTY3JpcHQuV3JpdGUoXCJ7MH0gaW5zdGFuY2VvZiBBcnJheVwiLCBydWxlc09iai5saXZpbmdSdWxlcykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXZpbmdSdWxlcyA9IEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PGJvb2xbXT4oSlNPTi5TdHJpbmdpZnkocnVsZXNPYmoubGl2aW5nUnVsZXMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFNjcmlwdC5Xcml0ZShcInswfSBpbnN0YW5jZW9mIEFycmF5XCIsIHJ1bGVzT2JqLmRlYWRSdWxlcykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWFkUnVsZXMgPSBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxib29sW10+KEpTT04uU3RyaW5naWZ5KHJ1bGVzT2JqLmRlYWRSdWxlcykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoU2NyaXB0LldyaXRlKFwiezB9IGluc3RhbmNlb2YgQXJyYXlcIiwgcnVsZXNPYmouYWRqYWNlbmN5UnVsZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXMgPSBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxpbnRbXT4oSlNPTi5TdHJpbmdpZnkocnVsZXNPYmouYWRqYWNlbmN5UnVsZXMpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCB7IH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LlN0eWxlW1widXNlci1zZWxlY3RcIl0gPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgRG9jdW1lbnQuSGVhZC5BcHBlbmRDaGlsZChuZXcgSFRNTExpbmtFbGVtZW50IHsgUmVsID0gXCJzdHlsZXNoZWV0XCIsIEhyZWYgPSBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vYm9vdHN0cmFwQDUuMi4wL2Rpc3QvY3NzL2Jvb3RzdHJhcC5taW4uY3NzXCIgfSk7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuU3R5bGUuTWFyZ2luID0gXCIwcHhcIjtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChQb3B1cENvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQobmV3IEhUTUxTdHlsZUVsZW1lbnQgeyBJbm5lckhUTUwgPSBcInRkLCB0aCB7IGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrOyBwYWRkaW5nOiA1cHggfSBidXR0b24geyBtYXJnaW4tcmlnaHQ6IDVweCB9XCIgfSk7XHJcblxyXG4gICAgICAgICAgICBIVE1MVGFibGVFbGVtZW50IGFkamFjZW5jeVJ1bGVzVGFibGUgPSBuZXcgSFRNTFRhYmxlRWxlbWVudCB7IFN0eWxlID0geyBNYXJnaW5MZWZ0ID0gXCJhdXRvXCIsIE1hcmdpblJpZ2h0ID0gXCJhdXRvXCIgfSB9O1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbnQgbiA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGludCB5ID0gMDsgeSA8IDM7IHkrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBIVE1MVGFibGVSb3dFbGVtZW50IHJvdyA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVSb3dFbGVtZW50PihuZXcgSFRNTFRhYmxlUm93RWxlbWVudCgpLGFkamFjZW5jeVJ1bGVzVGFibGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IHggPSAwOyB4IDwgMzsgeCsrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHggPT0gMSAmJiB5ID09IDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5BcHBlbmRDaGlsZChuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXNDZWxscy5BZGQoQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxTZWxlY3RFbGVtZW50PihDcmVhdGUwMTJTZWxlY3RvcigpLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSxyb3cpKS5TZXRBZGphY2VuY3lWYWx1ZShhZGphY2VuY3lSdWxlc1tuXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBIVE1MVGFibGVFbGVtZW50IHJ1bGVzVGFibGUgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUVsZW1lbnQ+KFxyXG5uZXcgSFRNTFRhYmxlRWxlbWVudCB7IFN0eWxlID0geyBNYXJnaW5MZWZ0ID0gXCJhdXRvXCIsIE1hcmdpblJpZ2h0ID0gXCJhdXRvXCIgfSB9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlUm93RWxlbWVudD4oXHJcbiAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlUm93RWxlbWVudCgpLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50KCksXCIjXCIpLFxyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudCgpLFwiTFwiKSxcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQoKSxcIkRcIilcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDw9IG1heEFkamFjZW50Q2VsbHM7IG4rKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSFRNTFRhYmxlUm93RWxlbWVudCByb3cgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlUm93RWxlbWVudD4obmV3IEhUTUxUYWJsZVJvd0VsZW1lbnQoKSxydWxlc1RhYmxlKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVSb3dFbGVtZW50PiggICAgICAgICAgICAgICAgcm93LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCksbi5Ub1N0cmluZygpKSk7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25DZWxscy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPEhUTUxJbnB1dEVsZW1lbnQsIEhUTUxJbnB1dEVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MSW5wdXRFbGVtZW50PihDcmVhdGVDaGVja2JveCgpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCksIHJvdykpLlNldEJvb2xWYWx1ZShsaXZpbmdSdWxlc1tuXSksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MSW5wdXRFbGVtZW50PihDcmVhdGVDaGVja2JveCgpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCksIHJvdykpLlNldEJvb2xWYWx1ZShkZWFkUnVsZXNbbl0pKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nICxib29sW10gLGJvb2xbXSA+PiBwcmVzZXRzTGlzdCA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZyAsYm9vbFtdICxib29sW10gPj4oKSwoX28xKT0+e19vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZywgYm9vbFtdLCBib29sW10+KFwiQ29ud2F5J3MgR2FtZSBvZiBMaWZlIFByZXNldFwiLCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0sIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0pKTtfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcsIGJvb2xbXSwgYm9vbFtdPihcIkltbW9ydGFsIENlbGxzIFByZXNldFwiLCBuZXcgYm9vbFs5XXt0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlfSwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO19vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZywgYm9vbFtdLCBib29sW10+KFwiQWxtb3N0IEltbW9ydGFsIENlbGxzIFByZXNldFwiLCBuZXcgYm9vbFs5XXt0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCBmYWxzZX0sIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0pKTtfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcsIGJvb2xbXSwgYm9vbFtdPihcIkFsdGVybmF0ZSBDb253YXkncyBHYW1lIG9mIExpZmUgUHJlc2V0XCIsIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2V9KSk7cmV0dXJuIF9vMTt9KTtcclxuXHJcbiAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IHByZXNldHNEaXYgPSBuZXcgSFRNTERpdkVsZW1lbnQgeyBTdHlsZSA9IHsgVGV4dEFsaWduID0gVGV4dEFsaWduLkNlbnRlciB9IH07XHJcbmZvcmVhY2ggKHZhciBfZDIgaW4gcHJlc2V0c0xpc3QpXHJcbntcclxuICAgIHN0cmluZyBuYW1lO1xyXG4gICAgYm9vbFtdIGxpdmluZ1J1bGVzO1xyXG4gICAgYm9vbFtdIGRlYWRSdWxlcztcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2QyLCBvdXQgbmFtZSwgb3V0IGxpdmluZ1J1bGVzLCBvdXQgZGVhZFJ1bGVzKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIHByZXNldHNEaXYsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50KCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQW5jaG9yRWxlbWVudD4obmV3IEhUTUxBbmNob3JFbGVtZW50e0hyZWYgPSBcImphdmFzY3JpcHQ6dm9pZCgwKVwiLCBTdHlsZSA9IHtGb250U2l6ZSA9IFwiMXJlbVwifSwgT25DbGljayA9IGUgPT4gQXBwbHlQcmVzZXQobGl2aW5nUnVsZXM6IGxpdmluZ1J1bGVzLCBkZWFkUnVsZXM6IGRlYWRSdWxlcyl9LG5hbWUpKSk7XHJcbn1cbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KFxyXG5cclxuICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEZXRhaWxzRWxlbWVudD4oXHJcbiAgICAgICAgICAgICAgICBuZXcgSFRNTERldGFpbHNFbGVtZW50IHsgT3BlbiA9IHRydWV9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFN1bW1hcnlFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MU3VtbWFyeUVsZW1lbnQoKSxcIkFkamFjZW5jeSBSdWxlc1wiKSxcclxuICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlc1RhYmxlXHJcbiAgICAgICAgICAgICAgICApLFxyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEZXRhaWxzRWxlbWVudD4oXHJcbiAgICAgICAgICAgICAgICBuZXcgSFRNTERldGFpbHNFbGVtZW50IHsgT3BlbiA9IHRydWUgfSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxTdW1tYXJ5RWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFN1bW1hcnlFbGVtZW50KCksXCJSdWxlc1wiKSxcclxuICAgICAgICAgICAgICAgICAgICBydWxlc1RhYmxlXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIFNldHRpbmdzUG9wdXAsbmV3IEhUTUxCUkVsZW1lbnQoKSwgcHJlc2V0c0RpdiwgbmV3IEhUTUxCUkVsZW1lbnQoKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIFNldHRpbmdzUG9wdXAsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsXHJcbiAgICAgICAgICAgICAgICBPbkNsaWNrID0gZSA9PlxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDwgbWF4QWRqYWNlbnRDZWxsczsgbisrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXNbbl0gPSBhZGphY2VuY3lSdWxlc0NlbGxzW25dLkFkamFjZW5jeVZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDw9IG1heEFkamFjZW50Q2VsbHM7IG4rKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpdmluZ1J1bGVzW25dID0gb3B0aW9uQ2VsbHNbbl0uSXRlbTEuQm9vbFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYWRSdWxlc1tuXSA9IG9wdGlvbkNlbGxzW25dLkl0ZW0yLkJvb2xWYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBHbG9iYWwuTG9jYWxTdG9yYWdlLlNldEl0ZW0oXCJydWxlc1wiLCBKc29uQ29udmVydC5TZXJpYWxpemVPYmplY3QobmV3XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXZpbmdSdWxlcyA9IGxpdmluZ1J1bGVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWFkUnVsZXMgPSBkZWFkUnVsZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzID0gYWRqYWNlbmN5UnVsZXNcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgSGlkZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXCJTYXZlIENoYW5nZXNcIikpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihcclxuICAgICAgICAgICAgTm90YWJsZU9iamVjdHNQb3B1cCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLWxpZ2h0XCIsXHJcbiAgICAgICAgICAgICAgICBTdHlsZSA9IHsgQ3NzRmxvYXQgPSBGbG9hdC5SaWdodCB9LFxyXG4gICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT4gSGlkZU1vZGFsKClcclxuICAgICAgICAgICAgfSxcIuKdjFwiKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIE5vdGFibGVPYmplY3RzUG9wdXAsbmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFN0eWxlID0geyBDbGVhciA9IENsZWFyLkJvdGggfVxyXG4gICAgICAgICAgICB9KTtcclxuZm9yZWFjaCAodmFyIF9kMyBpbiBOb3RhYmxlT2JqZWN0c0xpc3QuTm90YWJsZU9iamVjdHMpXHJcbntcclxuICAgIEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PiBvYmplY3REZXRhaWxzO1xyXG4gICAgc3RyaW5nIGRlc2NyaXB0aW9uO1xyXG4gICAgc3RyaW5nIHJ1bGVzO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDMsIG91dCBvYmplY3REZXRhaWxzLCBvdXQgZGVzY3JpcHRpb24sIG91dCBydWxlcyk7XHJcbiAgICBIVE1MRGl2RWxlbWVudCBvYmplY3RJbmZvID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnR7U3R5bGUgPSB7V2lkdGggPSBcIjMwcmVtXCJ9fSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudHtTdHlsZSA9IHtEaXNwbGF5ID0gRGlzcGxheS5GbGV4LCBBbGlnbkl0ZW1zID0gQWxpZ25JdGVtcy5DZW50ZXIsIEZsZXhEaXJlY3Rpb24gPSBGbGV4RGlyZWN0aW9uLkNvbHVtbn19LE5vdGFibGVPYmplY3RzUG9wdXApKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50e1N0eWxlID0ge0Rpc3BsYXkgPSBEaXNwbGF5LkZsZXgsIEFsaWduSXRlbXMgPSBBbGlnbkl0ZW1zLkNlbnRlciwgRmxleERpcmVjdGlvbiA9IEZsZXhEaXJlY3Rpb24uQ29sdW1ufX0sRHJhd1NoYXBlKG9iamVjdERldGFpbHMpKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCgpLGRlc2NyaXB0aW9uKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLHJ1bGVzKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sbmV3IEhUTUxCUkVsZW1lbnQoKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLG5ldyBIVE1MQlJFbGVtZW50KCkpO1xyXG59XG5cclxuICAgICAgICAgICAgSFRNTERpdkVsZW1lbnQgYmFja2dyb3VuZERpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCB7IFN0eWxlID0geyBQb3NpdGlvbiA9IFBvc2l0aW9uLlJlbGF0aXZlLCBNaW5XaWR0aCA9IFwiMFwiLCBNaW5IZWlnaHQgPSBcIjBcIiB9fTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLk92ZXJmbG93ID0gT3ZlcmZsb3cuSGlkZGVuO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuWkluZGV4ID0gXCItMVwiO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuUG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5MZWZ0ID0gXCIwcHhcIjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLlRvcCA9IFwiMHB4XCI7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIGJhY2tncm91bmREaXYsRE9NQ2FudmFzKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgYmFja2dyb3VuZERpdixIb3RiYXIpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBiYWNrZ3JvdW5kRGl2LFJpZ2h0SG90YmFyKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChiYWNrZ3JvdW5kRGl2KTtcclxuXHJcbiAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhZ2dpbmdQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IG9yaWdpbmFsUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgYm9vbCBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5Pbk1vdXNlRG93biA9IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSB0cnVlO1xyXG5pbnQgeDtcbmludCB5O1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChlLk1vdXNlUG9zKCksIG91dCB4LCBvdXQgeSk7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZ1BvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCAtIG9mZnNldFBvcy5JdGVtMSwgeSAtIG9mZnNldFBvcy5JdGVtMik7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFBvcyA9IG9mZnNldFBvcztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLk9uTW91c2VVcCA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMS0gb3JpZ2luYWxQb3MuSXRlbTEpID4geE11bHRpcGxpZXIgfHwgTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0yLSBvcmlnaW5hbFBvcy5JdGVtMikgPiB5TXVsdGlwbGllcilcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmdQb3MgPSBvZmZzZXRQb3M7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5Pbk1vdXNlTW92ZSA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKChlLkJ1dHRvbnMgJiAxKSA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBpZiAoZHJhZ2dpbmdQb3MgPT0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKSkgZHJhZ2dpbmdQb3MgPSBlLk1vdXNlUG9zKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbW91c2VQb3MgPSBlLk1vdXNlUG9zKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0xLSBvcmlnaW5hbFBvcy5JdGVtMSkgPiB4TXVsdGlwbGllciB8fCBNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTEtIG9yaWdpbmFsUG9zLkl0ZW0xKSA+IHlNdWx0aXBsaWVyKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KG1vdXNlUG9zLkl0ZW0xIC0gZHJhZ2dpbmdQb3MuSXRlbTEsIG1vdXNlUG9zLkl0ZW0yIC0gZHJhZ2dpbmdQb3MuSXRlbTIpO1xyXG4gICAgICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgICAgICB9O1xyXG5Qcm9jZXNzTW91c2VFdmVudCA9IChlKSA9PlxyXG57XHJcbiAgICAvL2lmICgoQGV2ZW50LkJ1dHRvbnMgJiAxKSA9PSAwKSByZXR1cm47XHJcbiAgICB2YXIgbW91c2VQb3MgPSBlLk1vdXNlUG9zKCk7XHJcbiAgICBkb3VibGUgY2xpY2tYXztcclxuICAgIGRvdWJsZSBjbGlja1lfO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+KE5lZ0RpdkRvdWJsZSgoZG91YmxlKW1vdXNlUG9zLkl0ZW0xIC0gb2Zmc2V0UG9zLkl0ZW0xLCB4TXVsdGlwbGllciksIE5lZ0RpdkRvdWJsZSgoZG91YmxlKW1vdXNlUG9zLkl0ZW0yIC0gb2Zmc2V0UG9zLkl0ZW0yLCB5TXVsdGlwbGllcikpLCBvdXQgY2xpY2tYXywgb3V0IGNsaWNrWV8pO1xyXG4gICAgYm9vbCBwbGFjZU5vcm1hbGx5ID0gdHJ1ZTtcclxuICAgIGlmIChTcXVhcmVUeXBlUGxhY2luZyA9PSBTcXVhcmVUeXBlLkNvdW50KVxyXG4gICAge1xyXG4gICAgICAgIC8vIFBsYWNlIGRpdmlkZXJzXHJcbiAgICAgICAgcGxhY2VOb3JtYWxseSA9IGZhbHNlO1xyXG4gICAgICAgIGludCB4RGl2ID0gMCwgeURpdiA9IDA7XHJcbiAgICAgICAgaWYgKChjbGlja1hfKSAlIDEgPD0gMC4yKVxyXG4gICAgICAgICAgICB4RGl2ID0gLTE7XHJcbiAgICAgICAgZWxzZSBpZiAoKGNsaWNrWF8pICUgMSA+PSAwLjgpXHJcbiAgICAgICAgICAgIHhEaXYgPSAxO1xyXG4gICAgICAgIGlmICgoY2xpY2tZXykgJSAxIDw9IDAuMilcclxuICAgICAgICAgICAgeURpdiA9IC0xO1xyXG4gICAgICAgIGVsc2UgaWYgKChjbGlja1lfKSAlIDEgPj0gMC44KVxyXG4gICAgICAgICAgICB5RGl2ID0gMTtcclxuICAgICAgICBEaXZpZGVyc0luZm8gZGl2aWRlcnNJbmZvID0gRGl2aWRlcnNJbmZvLk5vbmU7XHJcbiAgICAgICAgQWN0aW9uPERpdmlkZXJzSW5mbz4gQXNzaWduID0gKERpdmlkZXJzSW5mbyBkaXZJbmZvKSA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IHggPSAoaW50KWNsaWNrWF8gKyB4RGl2LCB5ID0gKGludCljbGlja1lfICsgeURpdjtcclxuICAgICAgICAgICAgaWYgKGRpdkluZm8gIT0gRGl2aWRlcnNJbmZvLk5vbmUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIERpdmlkZXJzSW5mbyBkaXZpZGVycztcclxuICAgICAgICAgICAgICAgIGlmICghRGl2aWRlcnMuVHJ5R2V0VmFsdWUobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KXgsIChpbnQpeSksIG91dCBkaXZpZGVycykpXHJcbiAgICAgICAgICAgICAgICAgICAgZGl2aWRlcnMgPSBEaXZpZGVyc0luZm8uTm9uZTtcclxuICAgICAgICAgICAgICAgIERpdmlkZXJzW25ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSldID0gZGl2aWRlcnMgXiBkaXZJbmZvO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICA7XHJcbiAgICAgICAgc3dpdGNoICh4RGl2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2FzZSAtMTpcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoeURpdilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBc3NpZ24oRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBc3NpZ24oRGl2aWRlcnNJbmZvLlJpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5RGl2ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXNzaWduKERpdmlkZXJzSW5mby5Cb3R0b21SaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoeURpdilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBc3NpZ24oRGl2aWRlcnNJbmZvLkJvdHRvbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VOb3JtYWxseSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGl2aWRlcnNJbmZvID0gRGl2aWRlcnNJbmZvLkJvdHRvbTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh5RGl2KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhEaXYgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBc3NpZ24oRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXZpZGVyc0luZm8gPSBEaXZpZGVyc0luZm8uUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGl2aWRlcnNJbmZvID0gRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE9wZXJhdGlvbkV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkaXZpZGVyc0luZm8gIT0gRGl2aWRlcnNJbmZvLk5vbmUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB4RGl2ID0gMDtcclxuICAgICAgICAgICAgeURpdiA9IDA7XHJcbiAgICAgICAgICAgIEFzc2lnbihkaXZpZGVyc0luZm8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAocGxhY2VOb3JtYWxseSlcclxuICAgIHtcclxuICAgICAgICBpbnQgY2xpY2tYO1xyXG4gICAgICAgIGludCBjbGlja1k7XHJcbiAgICAgICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpY2xpY2tYXywgKGludCljbGlja1lfKSwgb3V0IGNsaWNrWCwgb3V0IGNsaWNrWSk7XHJcbiAgICAgICAgaWYgKCFTcXVhcmVzLlJlbW92ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGNsaWNrWCwgY2xpY2tZKSkpXHJcbiAgICAgICAgICAgIFNxdWFyZXMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oY2xpY2tYLCBjbGlja1kpLCBTcXVhcmVUeXBlUGxhY2luZyA9PSBTcXVhcmVUeXBlLkNvdW50ID8gU3F1YXJlVHlwZS5DZWxsIDogU3F1YXJlVHlwZVBsYWNpbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIERyYXcoKTtcclxufVxyXG5cclxuO1xuICAgICAgICAgICAgRE9NQ2FudmFzLk9uQ2xpY2sgPSBlID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGFuZ2luZ0ludGVudClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBQcm9jZXNzTW91c2VFdmVudChlKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgR2xvYmFsLlNldEludGVydmFsKChBY3Rpb24pTmV4dEZyYW1lLCAxMDApO1xyXG5cclxuICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIHVwZGF0aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IE51bWJlck9mQWRqYWNlbnRDZWxscyAoaW50IHgsIGludCB5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGFkamFjZW50Q2VsbHMgPSAwO1xyXG4gICAgICAgICAgICBpbnQgbiA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoaW50IEwgPSAwOyBMIDw9IDg7IEwrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKEwgPT0gNClcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciBhZGphY2VuY3lSdWxlID0gYWRqYWNlbmN5UnVsZXNbbisrXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnQgeF8gPSB4IC0gMSArIChMICUgMyksXHJcbiAgICAgICAgICAgICAgICAgICAgeV8gPSB5IC0gMSArIEwgLyAzO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChIYXNEaXZpZGVycyh4LCB5LCBMKSlcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5TcXVhcmVFeHRlbnNpb25zLkNvbnRhaW5zQWxpdmU8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4+KFNxdWFyZXMsbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4XywgeV8pKSlcclxuICAgICAgICAgICAgICAgICAgICBhZGphY2VudENlbGxzICs9IChpbnQpYWRqYWNlbmN5UnVsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYWRqYWNlbnRDZWxscyA+IG1heEFkamFjZW50Q2VsbHMgPyBtYXhBZGphY2VudENlbGxzIDogYWRqYWNlbnRDZWxscztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBIYXNEaXZpZGVycyAoaW50IHgsIGludCB5LCBpbnQgTClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIERpdmlkZXJzSW5mbyB0b0NoZWNrO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKEwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICB4LS07XHJcbiAgICAgICAgICAgICAgICAgICAgeS0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgeS0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uQm90dG9tO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHktLTtcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgIHgtLTtcclxuICAgICAgICAgICAgICAgICAgICB0b0NoZWNrID0gRGl2aWRlcnNJbmZvLlJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDY6XHJcbiAgICAgICAgICAgICAgICAgICAgeC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvQ2hlY2sgPSBEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b207XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDg6XHJcbiAgICAgICAgICAgICAgICAgICAgdG9DaGVjayA9IERpdmlkZXJzSW5mby5Cb3R0b21SaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRPcGVyYXRpb25FeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG5EaXZpZGVyc0luZm8gZGl2aWRlcnNJbmZvO1xuICAgICAgICAgICAgcmV0dXJuIERpdmlkZXJzLlRyeUdldFZhbHVlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSksIG91dCBkaXZpZGVyc0luZm8pICYmIChkaXZpZGVyc0luZm8gJiB0b0NoZWNrKSAhPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFVwZGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL3VwZGF0aW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4+IHJlbW92aW5nID0gbmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4+KCk7XHJcbiAgICAgICAgICAgIEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4+IGFkZGluZyA9IG5ldyBIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PigpO1xyXG5mb3JlYWNoICh2YXIgX2Q0IGluIFNxdWFyZXMpXHJcbntcclxuICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PiBwb3M7XHJcbiAgICBTcXVhcmVUeXBlIHNxdWFyZVR5cGU7XHJcbiAgICBfZDQuRGVjb25zdHJ1Y3Qob3V0IHBvcywgb3V0IHNxdWFyZVR5cGUpO1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QocG9zLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaWYgKCFzcXVhcmVUeXBlLklzQWxpdmUoKSlcclxuICAgICAgICBjb250aW51ZTtcclxuICAgIGludCBhZGphY2VudENlbGxzID0gMDtcclxuICAgIGludCBuID0gMDtcclxuICAgIGZvciAoaW50IEwgPSAwOyBMIDw9IDg7IEwrKylcclxuICAgIHtcclxuICAgICAgICBpZiAoTCA9PSA0KVxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB2YXIgYWRqYWNlbmN5UnVsZSA9IGFkamFjZW5jeVJ1bGVzW24rK107XHJcbiAgICAgICAgaW50IHhfID0geCAtIDEgKyAoTCAlIDMpLCB5XyA9IHkgLSAxICsgTCAvIDM7XHJcbiAgICAgICAgaWYgKEhhc0RpdmlkZXJzKHgsIHksIEwpKVxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICBTcXVhcmVUeXBlIHNxdWFyZUluZm87XHJcbiAgICAgICAgaWYgKFNxdWFyZXMuVHJ5R2V0VmFsdWUobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4XywgeV8pLCBvdXQgc3F1YXJlSW5mbykpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoc3F1YXJlSW5mby5Jc0FsaXZlKCkpXHJcbiAgICAgICAgICAgICAgICBhZGphY2VudENlbGxzICs9IChpbnQpYWRqYWNlbmN5UnVsZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIG5ldyBjZWxscy5cclxuICAgICAgICAgICAgLy8gT3B0aW1pemF0aW9uIGZvciBydWxlIG9mIDMgYWRqYWNlbnQgY2VsbHNcclxuICAgICAgICAgICAgLy9pZiAoTCAhPSA3ICYmIEwgIT0gOClcclxuICAgICAgICAgICAgLy97XHJcbiAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICBpZiAoZGVhZFJ1bGVzW051bWJlck9mQWRqYWNlbnRDZWxscyh4XywgeV8pXSlcclxuICAgICAgICAgICAgICAgIGFkZGluZy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4XywgeV8pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFkamFjZW50Q2VsbHMgPiBtYXhBZGphY2VudENlbGxzKVxyXG4gICAgICAgIGFkamFjZW50Q2VsbHMgPSBtYXhBZGphY2VudENlbGxzO1xyXG4gICAgaWYgKCFzcXVhcmVUeXBlLklzVW5kZWFkKCkgJiYgIWxpdmluZ1J1bGVzW2FkamFjZW50Q2VsbHNdKVxyXG4gICAgICAgIHJlbW92aW5nLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHgsIHkpKTtcclxufVxuZm9yZWFjaCAodmFyIF9kNSBpbiByZW1vdmluZylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2Q1LCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaWYgKCFTcXVhcmVzLlJlbW92ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHgsIHkpKSlcclxuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiU3F1YXJlIHRyaWVkIHRvIGJlIHJlbW92ZWQgYnV0IGRpZG4ndCBleGlzdFwiKTtcclxufVxuZm9yZWFjaCAodmFyIF9kNiBpbiBhZGRpbmcpXHJcbntcclxuICAgIGludCB4O1xyXG4gICAgaW50IHk7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KF9kNiwgb3V0IHgsIG91dCB5KTtcclxuICAgIFNxdWFyZXMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSksIFNxdWFyZVR5cGUuQ2VsbCk7XHJcbn1cbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsSFRNTENhbnZhc0VsZW1lbnQgPiBMYXN0Qm90dG9tQ2FudmFzID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgSFRNTENhbnZhc0VsZW1lbnQ+KDAsIG51bGwpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgRHJhdygpXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uQWN0aW9uPFN5c3RlbS5WYWx1ZVR1cGxlPGRvdWJsZSwgZG91YmxlPj8gPiBEcmF3TWFya2VyID0gbnVsbDtcblN5c3RlbS5BY3Rpb248U3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+PyAsIFN5c3RlbS5WYWx1ZVR1cGxlPGRvdWJsZSwgZG91YmxlPj8gPiBEcmF3TGluZSA9IG51bGw7XG5TeXN0ZW0uRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4sIFN5c3RlbS5WYWx1ZVR1cGxlPGRvdWJsZSwgZG91YmxlPj8gPiBHZXRGaW5hbERyYXdQb3MgPSBudWxsO1xuU3lzdGVtLkZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+LCBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4/ID4gR2V0RHJhd1BvcyA9IG51bGw7XG4gICAgICAgICAgICBIVE1MQ2FudmFzRWxlbWVudCBUb3BDYW52YXMgPSBDcmVhdGVUb3BDYW52YXMoKTtcclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgQm90dG9tQ2FudmFzID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKExhc3RCb3R0b21DYW52YXMuSXRlbTE9PSB4TXVsdGlwbGllcilcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhcyA9IExhc3RCb3R0b21DYW52YXMuSXRlbTI7XHJcbiAgICAgICAgICAgIGlmIChCb3R0b21DYW52YXMgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzID0gQ3JlYXRlQm90dG9tQ2FudmFzKCk7XHJcbiAgICAgICAgICAgICAgICBMYXN0Qm90dG9tQ2FudmFzID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgSFRNTENhbnZhc0VsZW1lbnQ+KHhNdWx0aXBsaWVyLCBCb3R0b21DYW52YXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBUb3BDYW52YXNDb250ZXh0ID0gVG9wQ2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkNsZWFyUmVjdCgwLCAwLCBET01DYW52YXMuV2lkdGgsIERPTUNhbnZhcy5IZWlnaHQpO1xyXG5pbnQgb2Zmc2V0WDtcbmludCBvZmZzZXRZO1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChvZmZzZXRQb3MsIG91dCBvZmZzZXRYLCBvdXQgb2Zmc2V0WSk7XHJcbiAgICAgICAgICAgIFVpbnQ4Q2xhbXBlZEFycmF5IGltYWdlRGF0YUFycmF5ID0gQ3JlYXRlSW1hZ2VEYXRhQXJyYXkod2lkdGggKyAyLCBoZWlnaHQgKyAyKTtcclxuICAgICAgICAgICAgXHJcbkdldERyYXdQb3MgPSAocG9zKSA9PlxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChwb3MsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpbnQgZHJhd1ggPSB4ICsgKG9mZnNldFggLyB4TXVsdGlwbGllcikgKyAxLCBkcmF3WSA9IHkgKyAob2Zmc2V0WSAvIHlNdWx0aXBsaWVyKSArIDE7XHJcbiAgICBpZiAoZHJhd1ggPCAwIHx8IGRyYXdYID49IHdpZHRoICsgMiB8fCBkcmF3WSA8IDAgfHwgZHJhd1kgPj0gaGVpZ2h0ICsgMilcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGRyYXdYLCBkcmF3WSk7XHJcbn1cclxuXHJcbjtcbmZvcmVhY2ggKHZhciBfZDcgaW4gU3F1YXJlcylcclxue1xyXG4gICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+IHBvcztcclxuICAgIFNxdWFyZVR5cGUgc3F1YXJlVHlwZTtcclxuICAgIF9kNy5EZWNvbnN0cnVjdChvdXQgcG9zLCBvdXQgc3F1YXJlVHlwZSk7XHJcbiAgICB2YXIgZHJhd1BvcyA9IEdldERyYXdQb3MocG9zKTtcclxuICAgIGlmIChkcmF3UG9zID09IG51bGwpXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICBpbnQgZHJhd1g7XHJcbiAgICBpbnQgZHJhd1k7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGRyYXdQb3MuVmFsdWUsIG91dCBkcmF3WCwgb3V0IGRyYXdZKTtcclxuICAgIGludCBpZHggPSBkcmF3WCArIGRyYXdZICogKHdpZHRoICsgMik7XHJcbiAgICBpbWFnZURhdGFBcnJheVtpZHggKiA0ICsgM10gPSAoYnl0ZSkoc3F1YXJlVHlwZSA9PSBTcXVhcmVUeXBlLkNlbGwgPyAyNTUgOiBzcXVhcmVUeXBlID09IFNxdWFyZVR5cGUuQnJpY2sgPyAxNzAgOiBzcXVhcmVUeXBlID09IFNxdWFyZVR5cGUuSW1tb3J0YWxDZWxsID8gODUgOiAoKFN5c3RlbS5GdW5jPGludD4pKCgpID0+XHJcbiAgICB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlVua25vd24gc3F1YXJlIHR5cGVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgKSkoKSk7XHJcbn1cbiAgICAgICAgICAgIEltYWdlRGF0YSBpbWFnZURhdGEgPSBuZXcgSW1hZ2VEYXRhKGltYWdlRGF0YUFycmF5LCAodWludCkod2lkdGggKyAyKSwgKHVpbnQpKGhlaWdodCArIDIpKTtcclxuICAgICAgICAgICAgVG9wQ2FudmFzQ29udGV4dC5QdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5EcmF3SW1hZ2UoQm90dG9tQ2FudmFzLCBvZmZzZXRYICUgeE11bHRpcGxpZXIgLSB4TXVsdGlwbGllciwgb2Zmc2V0WSAlIHlNdWx0aXBsaWVyIC0geU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdJbWFnZShUb3BDYW52YXMsIChvZmZzZXRYICUgeE11bHRpcGxpZXIpIC0geE11bHRpcGxpZXIsIChvZmZzZXRZICUgeU11bHRpcGxpZXIpIC0geU11bHRpcGxpZXIsICh3aWR0aCArIDIpICogeE11bHRpcGxpZXIsIChoZWlnaHQgKyAyKSAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuR2V0RmluYWxEcmF3UG9zID0gKHBvcykgPT5cclxue1xyXG4gICAgdmFyIHAgPSBHZXREcmF3UG9zKHBvcyk7XHJcbiAgICBpZiAocCA9PSBudWxsKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgZG91YmxlIGRyYXdYO1xyXG4gICAgZG91YmxlIGRyYXdZO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHAuVmFsdWUuSXRlbTEsIHAuVmFsdWUuSXRlbTIpLCBvdXQgZHJhd1gsIG91dCBkcmF3WSk7XHJcbiAgICBkcmF3WCAqPSAod2lkdGggKyAyKSAqIHhNdWx0aXBsaWVyIC8gVG9wQ2FudmFzLldpZHRoO1xyXG4gICAgZHJhd1kgKj0gKGhlaWdodCArIDIpICogeU11bHRpcGxpZXIgLyBUb3BDYW52YXMuSGVpZ2h0O1xyXG4gICAgZHJhd1ggKz0gKG9mZnNldFggJSB4TXVsdGlwbGllcikgLSB4TXVsdGlwbGllcjtcclxuICAgIGRyYXdZICs9IChvZmZzZXRZICUgeU11bHRpcGxpZXIpIC0geU11bHRpcGxpZXI7XHJcbiAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGRvdWJsZSwgZG91YmxlPihkcmF3WCwgZHJhd1kpO1xyXG59XHJcblxyXG47XG5EcmF3TGluZSA9IChzdGFydCwgZW5kKSA9PlxyXG57XHJcbiAgICBpZiAoIXN0YXJ0Lkhhc1ZhbHVlIHx8ICFlbmQuSGFzVmFsdWUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgdmFyIHN0YXJ0UG9zID0gc3RhcnQuVmFsdWU7XHJcbiAgICB2YXIgZW5kUG9zID0gZW5kLlZhbHVlO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5CZWdpblBhdGgoKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuTW92ZVRvKHN0YXJ0UG9zLkl0ZW0xLCBzdGFydFBvcy5JdGVtMik7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkxpbmVUbyhlbmRQb3MuSXRlbTEsIGVuZFBvcy5JdGVtMik7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkxpbmVXaWR0aCA9IDI7XHJcbiAgICBET01DYW52YXNDb250ZXh0LlN0cm9rZVN0eWxlID0gXCJyZWRcIjsgLy8gXCJyZ2IoMTcwLCAxNzAsIDE3MClcIjtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuU3Ryb2tlKCk7XHJcbn1cclxuXHJcbjtcbkRyYXdNYXJrZXIgPSAocG9zaXRpb24pID0+XHJcbntcclxuICAgIGlmICghcG9zaXRpb24uSGFzVmFsdWUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgZG91YmxlIGRyYXdYO1xyXG4gICAgZG91YmxlIGRyYXdZO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChwb3NpdGlvbi5WYWx1ZSwgb3V0IGRyYXdYLCBvdXQgZHJhd1kpO1xyXG4gICAgRE9NQ2FudmFzQ29udGV4dC5CZWdpblBhdGgoKTtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuQXJjKGRyYXdYLCBkcmF3WSwgeE11bHRpcGxpZXIgLyA4LCAwLCAyICogTWF0aC5QSSk7XHJcbiAgICBET01DYW52YXNDb250ZXh0LkZpbGxTdHlsZSA9IFwicmVkXCI7IC8vXCJyZ2IoMTcwLCAxNzAsIDE3MClcIjtcclxuICAgIERPTUNhbnZhc0NvbnRleHQuRmlsbCgpO1xyXG59XHJcblxyXG47XG5mb3JlYWNoICh2YXIgX2Q4IGluIERpdmlkZXJzKVxyXG57XHJcbiAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4gcG9zO1xyXG4gICAgRGl2aWRlcnNJbmZvIGRpdmlkZXJzO1xyXG4gICAgX2Q4LkRlY29uc3RydWN0KG91dCBwb3MsIG91dCBkaXZpZGVycyk7XHJcbiAgICBmb3JlYWNoICh2YXIgZGl2aWRlciBpbiBuZXdbXXtEaXZpZGVyc0luZm8uQm90dG9tUmlnaHQsIERpdmlkZXJzSW5mby5SaWdodCwgRGl2aWRlcnNJbmZvLkJvdHRvbX0pXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKCFkaXZpZGVycy5IYXNGbGFnKGRpdmlkZXIpKVxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICBzd2l0Y2ggKGRpdmlkZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjYXNlIERpdmlkZXJzSW5mby5SaWdodDpcclxuICAgICAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID5zdGFydFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCkocG9zLkl0ZW0xICsgMSksIChpbnQpcG9zLkl0ZW0yKTtcclxuICAgICAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID5lbmRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKHBvcy5JdGVtMSArIDEpLCAoaW50KShwb3MuSXRlbTIgKyAxKSk7XHJcbiAgICAgICAgICAgICAgICBEcmF3TGluZShHZXRGaW5hbERyYXdQb3Moc3RhcnRQb3MpLCBHZXRGaW5hbERyYXdQb3MoZW5kUG9zKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBEaXZpZGVyc0luZm8uQm90dG9tOlxyXG4gICAgICAgICAgICAgICAgRHJhd0xpbmUoR2V0RmluYWxEcmF3UG9zKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCkocG9zLkl0ZW0xKSwgKGludCkocG9zLkl0ZW0yICsgMSkpKSwgR2V0RmluYWxEcmF3UG9zKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCkocG9zLkl0ZW0xICsgMSksIChpbnQpKHBvcy5JdGVtMiArIDEpKSkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRGl2aWRlcnNJbmZvLkJvdHRvbVJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgRHJhd01hcmtlcihHZXRGaW5hbERyYXdQb3MobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KShwb3MuSXRlbTEgKyAxKSwgKGludCkocG9zLkl0ZW0yICsgMSkpKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkT3BlcmF0aW9uRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgZnJhbWVOdW0gPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTmV4dEZyYW1lICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIXBsYXlpbmcpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGJvb2wgc2tpcEZyYW1lcyA9IFNxdWFyZXMuQ291bnQgPj0gMjUwO1xyXG4gICAgICAgICAgICBpbnQgdXBkYXRlc1BlckRyYXcgPSAxOy8vIHNraXBGcmFtZXMgPyAyIDogMTtcclxuICAgICAgICAgICAgZnJhbWVOdW0rKztcclxuICAgICAgICAgICAgaWYgKHNraXBGcmFtZXMgJiYgKGZyYW1lTnVtICUgdXBkYXRlc1BlckRyYXcpICE9IDApIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDwgdXBkYXRlc1BlckRyYXc7IG4rKylcclxuICAgICAgICAgICAgICAgIFVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UZXh0LlJlZ3VsYXJFeHByZXNzaW9ucztcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgRXh0ZW5zaW9uc1xyXG4gICAge1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIigoZSwgYykgPT4gYy5hcHBlbmRDaGlsZChlKSkoe2VsZW1lbnR9LCB7Y29udGFpbmluZ0VsZW19KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIEFkZFRvPFQ+KHRoaXMgVCBlbGVtZW50LCBOb2RlIGNvbnRhaW5pbmdFbGVtKSB3aGVyZSBUIDogTm9kZTtcclxuICAgICAgICAvL3B1YmxpYyBzdGF0aWMgVCBBZGRUb0JvZHk8VD4odGhpcyBUIG4pIHdoZXJlIFQgOiBOb2RlID0+IEFwcC5yb290LkFwcGVuZENoaWxkPFQ+KG4pO1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIntub2RlfS5hcHBlbmRDaGlsZCh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgQXBwZW5kQ2hpbGQ8VD4odGhpcyBOb2RlIG5vZGUsIFQgZWxlbWVudCkgd2hlcmUgVCA6IE5vZGU7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc3R5bGUuZGlzcGxheSA9ICdub25lJywgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBIaWRlPFQ+KHRoaXMgVCBlbGVtZW50KSB3aGVyZSBUIDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc3R5bGUuZGlzcGxheSA9ICcnLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIFNob3c8VD4odGhpcyBUIGVsZW1lbnQpIHdoZXJlIFQgOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBbVGVtcGxhdGUoXCIobGkgPT4gKGxpLmFwcGVuZENoaWxkKHtlbGVtZW50fSksIGxpKSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gSFRNTExJRWxlbWVudCBXcmFwTGkodGhpcyBOb2RlIGVsZW1lbnQpO1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihkaXYgPT4gKGRpdi5hcHBlbmRDaGlsZCh7ZWxlbWVudH0pLCBkaXYpKShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gSFRNTERpdkVsZW1lbnQgV3JhcERpdih0aGlzIE5vZGUgZWxlbWVudCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBUIEFkZDxUPih0aGlzIFQgZWxlbWVudCwgcGFyYW1zIFVuaW9uPE5vZGUsIHN0cmluZz5bXSBub2Rlcykgd2hlcmUgVCA6IE5vZGVcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFVuaW9uPE5vZGUsIHN0cmluZz4gbm9kZSBpbiBub2RlcylcclxuICAgICAgICAgICAgICAgIGlmIChub2RlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChub2RlLklzPHN0cmluZz4oKSlcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LkFwcGVuZENoaWxkKG5ldyBUZXh0KG5vZGUuQXM8c3RyaW5nPigpKSk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5BcHBlbmRDaGlsZChub2RlLkFzPE5vZGU+KCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgVCBBZGRFbGVtZW50PFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgc3RyaW5nPltdIG5vZGVzKVxyXG4gICAgd2hlcmUgVCA6IE5vZGVcclxue1xyXG4gICAgcmV0dXJuIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8VD4oZWxlbWVudCxub2Rlcyk7XHJcbn1wdWJsaWMgc3RhdGljIFQgQWRkRGl2PFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgc3RyaW5nPltdIG5vZGVzKVxyXG4gICAgd2hlcmUgVCA6IE5vZGVcclxue1xyXG4gICAgcmV0dXJuIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8VD4oZWxlbWVudCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnQoKSxub2RlcykpO1xyXG59cHVibGljIHN0YXRpYyBUIEFkZFVsPFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgVW5pb248Tm9kZSwgc3RyaW5nPltdLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFVMaXN0RWxlbWVudD4obmV3IEhUTUxVTGlzdEVsZW1lbnQoKSxTeXN0ZW0uQXJyYXlFeHRlbnNpb25zLk1hcDxVbmlvbjxOb2RlLFVuaW9uPE5vZGUsIHN0cmluZz5bXSxzdHJpbmc+LFVuaW9uPE5vZGUsc3RyaW5nPj4obm9kZXMsKEZ1bmM8VW5pb248Tm9kZSxVbmlvbjxOb2RlLCBzdHJpbmc+W10sc3RyaW5nPixVbmlvbjxOb2RlLHN0cmluZz4+KShuID0+IChVbmlvbjxOb2RlLCBzdHJpbmc+KShuLklzPFVuaW9uPE5vZGUsIHN0cmluZz5bXT4oKSA/IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTExJRWxlbWVudD4obmV3IEhUTUxMSUVsZW1lbnQoKSxuLkFzPFVuaW9uPE5vZGUsIHN0cmluZz5bXT4oKSkgOiBuLklzPHN0cmluZz4oKSA/IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTExJRWxlbWVudD4obmV3IEhUTUxMSUVsZW1lbnQoKSxuLkFzPHN0cmluZz4oKSkgOiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxMSUVsZW1lbnQ+KG5ldyBIVE1MTElFbGVtZW50KCksbi5BczxOb2RlPigpKSkpKSkpO1xyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgQWRkQ2FtZWxTcGFjZSh0aGlzIHN0cmluZyBzdHIpXHJcbntcclxuICAgIHJldHVybiBSZWdleC5SZXBsYWNlKFJlZ2V4LlJlcGxhY2Uoc3RyLCBAXCIoW15fYS16XSkoW15fYS16XVthLXpdKVwiLCBcIiQxICQyXCIpLCBAXCIoW2Etel0pKFteX2Etel0pXCIsIFwiJDEgJDJcIik7XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBUb0NhbWVsU3RyaW5nPFQ+KHRoaXMgVCBlKVxyXG4gICAgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxue1xyXG4gICAgcmV0dXJuIGUuVG9TdHJpbmcoKS5BZGRDYW1lbFNwYWNlKCkuUmVwbGFjZSgnXycsICcgJyk7XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgQWRkRW51bTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdCwgVD8gZGVmYXVsdFZhbHVlID0gbnVsbCwgc3RyaW5nIGRlZmF1bHRWYWx1ZVN0cmluZyA9IFwiXCIpIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoZGVmYXVsdFZhbHVlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICBzZWxlY3QuQWRkKEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudCB7IFZhbHVlID0gXCJcIiwgU2VsZWN0ZWQgPSB0cnVlLCBEaXNhYmxlID0gdHJ1ZSB9LGRlZmF1bHRWYWx1ZVN0cmluZykpO1xyXG4gICAgICAgICAgICBmb3JlYWNoIChUIHZhbHVlIGluIFN5c3RlbS5FbnVtLkdldFZhbHVlcyh0eXBlb2YoVCkpKVxyXG4gICAgICAgICAgICAgICAgc2VsZWN0LkFkZChDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnRcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBWYWx1ZSA9ICgoaW50KShvYmplY3QpdmFsdWUpLlRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0ZWQgPSBvYmplY3QuRXF1YWxzKGRlZmF1bHRWYWx1ZSwgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5Ub0NhbWVsU3RyaW5nPFQ+KHZhbHVlKSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBib29sIEJvb2xWYWx1ZSh0aGlzIEhUTUxJbnB1dEVsZW1lbnQgY2hlY2tCb3gpXHJcbntcclxuICAgIHJldHVybiBjaGVja0JveC5DaGVja2VkO1xyXG59cHVibGljIHN0YXRpYyBib29sIEJvb2xWYWx1ZSh0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdClcclxue1xyXG4gICAgcmV0dXJuIHNlbGVjdC5WYWx1ZSA9PSBcInRydWVcIiA/IHRydWUgOiBmYWxzZTtcclxufXB1YmxpYyBzdGF0aWMgQWRqYWNlbmN5VHlwZSBBZGphY2VuY3lWYWx1ZSh0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdClcclxue1xyXG4gICAgcmV0dXJuIChBZGphY2VuY3lUeXBlKWludC5QYXJzZShzZWxlY3QuVmFsdWUpO1xyXG59cHVibGljIHN0YXRpYyBUPyBWYWx1ZTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdClcclxuICAgIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbntcclxuICAgIHJldHVybiBzZWxlY3QuVmFsdWUgPT0gXCJcIiA/IG51bGwgOiAoVD8gKShUKShvYmplY3QpaW50LlBhcnNlKHNlbGVjdC5WYWx1ZSk7XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTElucHV0RWxlbWVudCBTZXRCb29sVmFsdWUodGhpcyBIVE1MSW5wdXRFbGVtZW50IGNoZWNrQm94LCBib29sIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2hlY2tCb3guQ2hlY2tlZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICByZXR1cm4gY2hlY2tCb3g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgU2V0Qm9vbFZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBib29sIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZWN0LlZhbHVlID0gdmFsdWUuVG9TdHJpbmcoKS5Ub0xvd2VyKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgU2V0QWRqYWNlbmN5VmFsdWUodGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QsIEFkamFjZW5jeVR5cGUgdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxlY3QuVmFsdWUgPSAoKGludCl2YWx1ZSkuVG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBTZXRWYWx1ZTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdCwgVCB2YWx1ZSkgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGVjdC5WYWx1ZSA9ICgoaW50KShvYmplY3QpdmFsdWUpLlRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIHN0cmluZyBUb1RpbWVTdHJpbmcodGhpcyBUaW1lU3BhbiB0aW1lKVxyXG57XHJcbiAgICByZXR1cm4gdGltZS5Ub1N0cmluZyh0aW1lID49IFRpbWVTcGFuLkZyb21Ib3VycygxKSA/IEBcImhcXDptbVxcOnNzXCIgOiBAXCJtXFw6c3NcIik7XHJcbn0gICAgICAgIFtUZW1wbGF0ZShcIihlID0+IChlLnNldEN1c3RvbVZhbGlkaXR5KHttZXNzYWdlfSksIGUucmVwb3J0VmFsaWRpdHkoKSwgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBTZXRDdXN0b21WYWxpZGl0eTxUPih0aGlzIFQgZWxlbWVudCwgc3RyaW5nIG1lc3NhZ2UpIHdoZXJlIFQgOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zZXRBdHRyaWJ1dGUoJ2xpc3QnLCB7ZGF0YWxpc3RJRH0pLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MSW5wdXRFbGVtZW50IFNldERhdGFMaXN0KHRoaXMgSFRNTElucHV0RWxlbWVudCBlbGVtZW50LCBzdHJpbmcgZGF0YWxpc3RJRCk7XHJcbiAgICAgICAgLy9bVGVtcGxhdGUoXCJ7ZWxlbX0uYXBwZW5kQ2hpbGQoe2FkZGluZ30pXCIpXVxyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBleHRlcm4gVCBBcHBlbmQ8VD4gKHRoaXMgTm9kZSBlbGVtLCBUIGFkZGluZyk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVW5pb248Tm9kZSwgc3RyaW5nPltdIEpvaW5CUih0aGlzIElFbnVtZXJhYmxlPHN0cmluZz4gc3RyaW5ncylcclxuICAgICAgICB7XHJcblN5c3RlbS5GdW5jPElFbnVtZXJhYmxlPFVuaW9uPE5vZGUsIHN0cmluZz4+PiBJbm5lciA9IG51bGw7XG4gICAgICAgICAgICBcclxuSW5uZXIgPSAoKSA9PlxyXG57XHJcbiAgICB1c2luZyAodmFyIGVudW1lciA9IHN0cmluZ3MuR2V0RW51bWVyYXRvcigpKVxyXG4gICAge1xyXG4gICAgICAgIGlmICghZW51bWVyLk1vdmVOZXh0KCkpXHJcbiAgICAgICAgICAgIHlpZWxkIGJyZWFrO1xyXG4gICAgICAgIHlpZWxkIHJldHVybiBlbnVtZXIuQ3VycmVudDtcclxuICAgICAgICB3aGlsZSAoZW51bWVyLk1vdmVOZXh0KCkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gbmV3IEhUTUxCUkVsZW1lbnQoKTtcclxuICAgICAgICAgICAgeWllbGQgcmV0dXJuIGVudW1lci5DdXJyZW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuO1xuICAgICAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuVG9BcnJheTxVbmlvbjxOb2RlLHN0cmluZz4+KElubmVyKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgTm90YWJsZU9iamVjdHNMaXN0XHJcbiAgICB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+ICxzdHJpbmcgLHN0cmluZyA+PiBOb3RhYmxlT2JqZWN0cyA9XHJcbiAgICAgICAgICAgIGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gLHN0cmluZyAsc3RyaW5nID4+KCksKF9vMyk9PntfbzMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4sIHN0cmluZywgc3RyaW5nPihnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+KCksIChfbzEpID0+XHJcbntcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKSk7XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMSwgMCkpO1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDEsIDEpKTtcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAyKSk7XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMiwgMikpO1xyXG4gICAgcmV0dXJuIF9vMTtcclxufVxyXG5cclxuKSwgXCJUd28gR2VuZXJhdGlvbiBOaW5ldHkgRGVncmVlIFJvdGF0b3JcIiwgXCIwMDEwMTAtLS0gLyAwMDAxMDEtLS1cIikpO19vMy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+Piwgc3RyaW5nLCBzdHJpbmc+KGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4oKSwgKF9vMikgPT5cclxue1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApKTtcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigxLCAwKSk7XHJcbiAgICBfbzIuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMSwgMSkpO1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDEpKTtcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAyKSk7XHJcbiAgICByZXR1cm4gX28yO1xyXG59XHJcblxyXG4pLCBcIk9uZSBHZW5lcmF0aW9uIE5pbmV0eSBEZWdyZWUgUm90YXRvclwiLCBcIjAwMTAxMC0tLSAvIDAwMDEwMS0tLVwiKSk7cmV0dXJuIF9vMzt9KTtcclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIC8vLyA8c3VtbWFyeT5cclxuICAgIC8vLyBPcHRpb25zOlxyXG4gICAgLy8vIC0gQ2VsbCAoSXNDZWxsOiB0cnVlLCBJc1dhbGw6IGZhbHNlKSAgfCBCbGFja1xyXG4gICAgLy8vIC0gV2FsbCAoSXNDZWxsOiB0cnVlLCBJc1dhbGw6IHRydWUpICAgfCBHcmV5XHJcbiAgICAvLy8gLSBCcmljayAoSXNDZWxsOiBmYWxzZSwgSXNXYWxsOiB0cnVlKSB8IEdyZXlcclxuICAgIC8vLyA8L3N1bW1hcnk+XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBTcXVhcmVFeHRlbnNpb25zXHJcbiAgICB7XHJcbnB1YmxpYyBzdGF0aWMgYm9vbCBJc0FsaXZlKHRoaXMgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKVxyXG57XHJcbiAgICByZXR1cm4gc3F1YXJlVHlwZSAhPSBTcXVhcmVUeXBlLkJyaWNrO1xyXG59cHVibGljIHN0YXRpYyBib29sIElzVW5kZWFkKHRoaXMgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKVxyXG57XHJcbiAgICByZXR1cm4gc3F1YXJlVHlwZSAhPSBTcXVhcmVUeXBlLkNlbGw7XHJcbn1wdWJsaWMgc3RhdGljIGJvb2wgQ29udGFpbnNBbGl2ZTxUPih0aGlzIERpY3Rpb25hcnk8VCwgU3F1YXJlVHlwZT4gZGljLCBUIGtleSlcclxue1xyXG5TcXVhcmVUeXBlIHNxdWFyZVR5cGU7XG4gICAgcmV0dXJuIGRpYy5UcnlHZXRWYWx1ZShrZXksIG91dCBzcXVhcmVUeXBlKSAmJiBzcXVhcmVUeXBlLklzQWxpdmUoKTtcclxufSAgICB9XHJcblxyXG4gICAgcHVibGljIGVudW0gU3F1YXJlVHlwZVxyXG4gICAge1xyXG4gICAgICAgIENlbGwsICAvLyBCbGFja1xyXG4gICAgICAgIEltbW9ydGFsQ2VsbCwgIC8vIEdyZXlcclxuICAgICAgICBCcmljaywgLy8gR3JleVxyXG4gICAgICAgIENvdW50XHJcbiAgICB9XHJcblxyXG4gICAgW0ZsYWdzXVxyXG4gICAgcHVibGljIGVudW0gRGl2aWRlcnNJbmZvXHJcbiAgICB7XHJcbiAgICAgICAgTm9uZSA9IDAsXHJcbiAgICAgICAgUmlnaHQgPSAxIDw8IDAsXHJcbiAgICAgICAgQm90dG9tID0gMSA8PCAxLFxyXG4gICAgICAgIEJvdHRvbVJpZ2h0ID0gMSA8PCAyXHJcbiAgICB9XHJcbn1cclxuIl0KfQo=
