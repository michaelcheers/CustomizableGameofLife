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

            CustomizableGameofLife.App.BottomCanvasContext.strokeStyle = "black";
            CustomizableGameofLife.App.BottomCanvasContext.translate(0.5, 0.5);
            CustomizableGameofLife.App.BottomCanvasContext.lineWidth = 1;
            for (var x1 = 0; x1 <= (((CustomizableGameofLife.App.width + 2) | 0)); x1 = (x1 + 1) | 0) {
                CustomizableGameofLife.App.BottomCanvasContext.moveTo(Bridge.Int.mul(x1, CustomizableGameofLife.App.xMultiplier), 0);
                CustomizableGameofLife.App.BottomCanvasContext.lineTo(Bridge.Int.mul(x1, CustomizableGameofLife.App.xMultiplier), Bridge.Int.mul((((CustomizableGameofLife.App.height + 3) | 0)), CustomizableGameofLife.App.yMultiplier));
            }
            for (var y1 = 0; y1 <= (((CustomizableGameofLife.App.height + 2) | 0)); y1 = (y1 + 1) | 0) {
                CustomizableGameofLife.App.BottomCanvasContext.moveTo(0, Bridge.Int.mul(y1, CustomizableGameofLife.App.yMultiplier));
                CustomizableGameofLife.App.BottomCanvasContext.lineTo(Bridge.Int.mul((((CustomizableGameofLife.App.width + 3) | 0)), CustomizableGameofLife.App.xMultiplier), Bridge.Int.mul(y1, CustomizableGameofLife.App.yMultiplier));
            }
            for (var n2 = 0; n2 < 10; n2 = (n2 + 1) | 0) {
                CustomizableGameofLife.App.BottomCanvasContext.stroke();
            }

            var draggingPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0);
            var originalPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0);
            var changingIntent = false;


            CustomizableGameofLife.App.DOMCanvas.onmousedown = function (e) {
                changingIntent = true;
                var x2 = { };
                var y2 = { };
                Bridge.Deconstruct(CustomizableGameofLife.App.MousePos(e).$clone(), x2, y2);
                draggingPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(((x2.v - CustomizableGameofLife.App.offsetPos.Item1) | 0), ((y2.v - CustomizableGameofLife.App.offsetPos.Item2) | 0));
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
                var clickX = { };
                var clickY = { };
                Bridge.Deconstruct(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(CustomizableGameofLife.App.NegDiv(((mousePos.Item1 - CustomizableGameofLife.App.offsetPos.Item1) | 0), CustomizableGameofLife.App.xMultiplier), CustomizableGameofLife.App.NegDiv((((mousePos.Item2 - CustomizableGameofLife.App.offsetPos.Item2) | 0)), CustomizableGameofLife.App.yMultiplier)).$clone(), clickX, clickY);
                if (!CustomizableGameofLife.App.Squares.remove(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(clickX.v, clickY.v))) {
                    CustomizableGameofLife.App.Squares.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(clickX.v, clickY.v), CustomizableGameofLife.App.SquareTypePlacing);
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
                xMultiplier: 0,
                yMultiplier: 0,
                maxAdjacentCells: 0,
                screenWidth: 0,
                screenHeight: 0,
                width: 0,
                height: 0,
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
                BottomCanvas: null,
                TopCanvas: null,
                TopCanvasContext: null,
                BottomCanvasContext: null,
                DOMCanvasContext: null,
                Squares: null,
                offsetPos: null,
                adjacencyRulesCells: null,
                optionCells: null,
                updating: false,
                frameNum: 0
            },
            ctors: {
                init: function () {
                    var $t, $t1, $t2, $t3;
                    this.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32))();
                    this.xMultiplier = 20;
                    this.yMultiplier = 20;
                    this.maxAdjacentCells = 8;
                    this.screenWidth = window.innerWidth;
                    this.screenHeight = window.innerHeight;
                    this.width = (Bridge.Int.div(CustomizableGameofLife.App.screenWidth, CustomizableGameofLife.App.xMultiplier)) | 0;
                    this.height = (Bridge.Int.div(CustomizableGameofLife.App.screenHeight, CustomizableGameofLife.App.yMultiplier)) | 0;
                    this.Hotbar = CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, ($t = document.createElement("div"), $t.style.position = "absolute", $t.style.left = "100px", $t.style.top = System.String.format("{0}px", [Bridge.box(((window.innerHeight - 40) | 0), System.Int32)]), $t), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.Reset(true);
                    }, $t), ["Blank"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.Reset();
                    }, $t), ["Reset"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.GetCoordinates();
                    }, $t), ["Get Coordinates"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.SaveAsStarter();
                    }, $t), ["Save as Starter"])]), [($t = CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t1 = document.createElement("button"), $t1.className = "btn btn-primary", $t1.onclick = function (e) {
                        CustomizableGameofLife.App.NextSquareType();
                    }, $t1), ["Cell"]), CustomizableGameofLife.App.NextSquareTypeButton = $t, $t)]), [($t1 = CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t2 = document.createElement("button"), $t2.className = "btn btn-primary", $t2.onclick = function (e) {
                        CustomizableGameofLife.App.InvertIsPlaying();
                    }, $t2), ["\u25b6"]), CustomizableGameofLife.App.PlayButton = $t1, $t1)]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t2 = document.createElement("button"), $t2.className = "btn btn-primary", $t2.onclick = function (e) {
                        CustomizableGameofLife.App.ShowModal(CustomizableGameofLife.App.ModalType.Settings);
                    }, $t2), ["\u2699"])]);
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
                    this.BottomCanvas = CustomizableGameofLife.App.CreateBottomCanvas();
                    this.TopCanvas = CustomizableGameofLife.App.CreateTopCanvas();
                    this.TopCanvasContext = CustomizableGameofLife.App.TopCanvas.getContext("2d");
                    this.BottomCanvasContext = CustomizableGameofLife.App.BottomCanvas.getContext("2d");
                    this.DOMCanvasContext = CustomizableGameofLife.App.DOMCanvas.getContext("2d");
                    this.Squares = new (System.Collections.Generic.Dictionary$2(System.ValueTuple$2(System.Int32,System.Int32),CustomizableGameofLife.SquareType)).ctor();
                    this.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0);
                    this.adjacencyRulesCells = new (System.Collections.Generic.List$1(HTMLSelectElement)).ctor();
                    this.optionCells = new (System.Collections.Generic.List$1(System.ValueTuple$2(HTMLInputElement,HTMLInputElement))).ctor();
                    this.updating = false;
                    this.frameNum = 0;
                }
            },
            methods: {
                NextSquareType: function () {
                    CustomizableGameofLife.App.SquareTypePlacing = (((CustomizableGameofLife.App.SquareTypePlacing + 1) | 0)) % CustomizableGameofLife.SquareType.Count;
                    CustomizableGameofLife.App.NextSquareTypeButton.innerHTML = CustomizableGameofLife.Extensions.ToCamelString(CustomizableGameofLife.SquareType, CustomizableGameofLife.App.SquareTypePlacing);
                },
                Reset: function (makeBlank) {
                    var $t;
                    if (makeBlank === void 0) { makeBlank = false; }
                    if (!Bridge.global.confirm("Any unsaved changes will be lost. Continue?")) {
                        return;
                    }
                    CustomizableGameofLife.App.Squares.clear();
                    if (!makeBlank) {
                        CustomizableGameofLife.App.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0);
                        var starterPositions = Bridge.global.localStorage.getItem("starterPositions");
                        if (starterPositions != null) {
                            var s = Bridge.cast(starterPositions, System.String);
                            if (!System.String.isNullOrEmpty(s)) {
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
                    return ($t = document.createElement("canvas"), $t.width = ((CustomizableGameofLife.App.screenWidth + 40) | 0), $t.height = ((CustomizableGameofLife.App.screenHeight + 40) | 0), $t);
                },
                MousePos: function (e) {
                    var rect = CustomizableGameofLife.App.DOMCanvas.getBoundingClientRect();
                    return new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(Bridge.Int.clip32(e.clientX - rect.left), Bridge.Int.clip32(e.clientY - rect.top));
                },
                NegDiv: function (a, b) {
                    var res = (Bridge.Int.div(a, b)) | 0;
                    return (a < 0 && a !== Bridge.Int.mul(b, res)) ? ((res - 1) | 0) : res;
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
                    var xMultiplier = 40;
                    var yMultiplier = 40;

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

                        if (CustomizableGameofLife.SquareExtensions.ContainsAlive(System.ValueTuple$2(System.Int32,System.Int32), CustomizableGameofLife.App.Squares, new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x_, y_))) {
                            adjacentCells = (adjacentCells + adjacencyRule) | 0;
                        }
                    }
                    return adjacentCells > CustomizableGameofLife.App.maxAdjacentCells ? CustomizableGameofLife.App.maxAdjacentCells : adjacentCells;
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
                    var $t;
                    CustomizableGameofLife.App.DOMCanvasContext.clearRect(0, 0, CustomizableGameofLife.App.DOMCanvas.width, CustomizableGameofLife.App.DOMCanvas.height);
                    CustomizableGameofLife.App.TopCanvasContext.clearRect(0, 0, CustomizableGameofLife.App.DOMCanvas.width, CustomizableGameofLife.App.DOMCanvas.height);
                    var offsetX = { };
                    var offsetY = { };
                    Bridge.Deconstruct(CustomizableGameofLife.App.offsetPos.$clone(), offsetX, offsetY);
                    var imageDataArray = CustomizableGameofLife.App.CreateImageDataArray(((CustomizableGameofLife.App.width + 2) | 0), ((CustomizableGameofLife.App.height + 2) | 0));
                    $t = Bridge.getEnumerator(CustomizableGameofLife.App.Squares);
                    try {
                        while ($t.moveNext()) {
                            var _d7 = $t.Current;
                            var pos = { v : new (System.ValueTuple$2(System.Int32,System.Int32))() };
                            var squareType = { v : new CustomizableGameofLife.SquareType() };
                            _d7.Deconstruct(pos, squareType);
                            var x = { };
                            var y = { };
                            Bridge.Deconstruct(pos.v.$clone(), x, y);
                            var drawX = (((x.v + (((Bridge.Int.div(offsetX.v, CustomizableGameofLife.App.xMultiplier)) | 0))) | 0) + 1) | 0, drawY = (((y.v + (((Bridge.Int.div(offsetY.v, CustomizableGameofLife.App.yMultiplier)) | 0))) | 0) + 1) | 0;
                            if (drawX < 0 || drawX >= ((CustomizableGameofLife.App.width + 2) | 0) || drawY < 0 || drawY >= ((CustomizableGameofLife.App.height + 2) | 0)) {
                                continue;
                            }
                            var idx = (drawX + Bridge.Int.mul(drawY, (((CustomizableGameofLife.App.width + 2) | 0)))) | 0;
                            imageDataArray[((Bridge.Int.mul(idx, 4) + 3) | 0)] = CustomizableGameofLife.SquareExtensions.IsUndead(squareType.v) ? 127 : 255;
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                    var imageData = new ImageData(imageDataArray, ((((CustomizableGameofLife.App.width + 2) | 0)) >>> 0), ((((CustomizableGameofLife.App.height + 2) | 0)) >>> 0));
                    CustomizableGameofLife.App.TopCanvasContext.putImageData(imageData, 0, 0);
                    CustomizableGameofLife.App.DOMCanvasContext.drawImage(CustomizableGameofLife.App.BottomCanvas, ((offsetX.v % CustomizableGameofLife.App.xMultiplier - CustomizableGameofLife.App.xMultiplier) | 0), ((offsetY.v % CustomizableGameofLife.App.yMultiplier - CustomizableGameofLife.App.yMultiplier) | 0));
                    CustomizableGameofLife.App.DOMCanvasContext.imageSmoothingEnabled = false;
                    CustomizableGameofLife.App.DOMCanvasContext.drawImage(CustomizableGameofLife.App.TopCanvas, (((offsetX.v % CustomizableGameofLife.App.xMultiplier) - CustomizableGameofLife.App.xMultiplier) | 0), (((offsetY.v % CustomizableGameofLife.App.yMultiplier) - CustomizableGameofLife.App.yMultiplier) | 0), Bridge.Int.mul((((CustomizableGameofLife.App.width + 2) | 0)), CustomizableGameofLife.App.xMultiplier), Bridge.Int.mul((((CustomizableGameofLife.App.height + 2) | 0)), CustomizableGameofLife.App.yMultiplier));
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
                Wall: 1,
                Brick: 2,
                Count: 3
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDdXN0b21pemFibGVHYW1lb2ZMaWZlLmpzIiwKICAic291cmNlUm9vdCI6ICIiLAogICJzb3VyY2VzIjogWyJDbGFzczEuY3MiLCJFeHRlbnNpb25zLmNzIiwiTm90YWJsZU9iamVjdHNMaXN0LmNzIiwiU3F1YXJlLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBdVRBQSx3QkFBaUVBO1lBQ3JEQSxxQkFBd0JBO1lBQ3BDQTtZQUFxQkEsSUFBSUEsQ0FBQ0EsS0FBSUEsOENBQTZCQTtnQkFFM0NBO29CQUVJQSxlQUFtQkEsV0FBV0E7b0JBQzlCQSxJQUFJQSxrQkFBa0JBO3dCQUVsQkEsSUFBSUEsQUFBcUNBOzRCQUNyQ0EseUNBQWNBLDhDQUFzQ0EsZUFBZUEsdUJBQXZCQTs7d0JBQ2hEQSxJQUFJQSxBQUFxQ0E7NEJBQ3JDQSx1Q0FBWUEsOENBQXNDQSxlQUFlQSxxQkFBdkJBOzt3QkFDOUNBLElBQUlBLEFBQXFDQTs0QkFDckNBLDRDQUFpQkEsOENBQXFDQSxlQUFlQSwwQkFBdEJBOzs7Ozs7O1lBSy9EQTtZQUNBQSwwQkFBMEJBO1lBQzFCQTtZQUNBQSwwQkFBMEJBO1lBQzFCQSwwQkFBMEJBOztZQUUxQkEsMEJBQXVDQTs7Z0JBRW5DQTtnQkFDQUEsS0FBS0EsV0FBV0EsT0FBT0E7b0JBRW5CQSxVQUEwQkEsNkJBQTZEQSw4QkFBMEJBO29CQUNqSEEsS0FBS0EsV0FBV0EsT0FBT0E7d0JBRW5CQSxJQUFJQSxXQUFVQTs0QkFFVkEsZ0JBQWdCQTs0QkFDaEJBOzt3QkFFSkEsbURBQXdCQSxpRkFBMkRBLGdEQUFvQkEsNkJBQWtFQSw4QkFBK0JBLE9BQXdCQSw2REFBZUEsR0FBZkE7d0JBQ2hPQTs7Ozs7WUFLWkEsaUJBQThCQSx3REFDMUNBLDBHQUErRUEsMkRBQy9EQSwrQkFBMEJBLDREQUFzRkEsc0NBQ2hJQSw0REFBc0ZBLHNDQUN0RkEsNERBQXNGQTs7WUFJMUVBLEtBQUtB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QUFJQTtvQ0FDWkEsUUFBUUEsS0FBSUE7b0NBQ1pBLFFBQVFBLEtBQUlBO29DQUNaQSxRQUFRQSxLQUFJQTtvQ0FDWkEsUUFBUUEsS0FBSUE7b0NBQ1pBLE9BQU9BO2tDQVArT0EsS0FBSUE7NEJBVXpMQSxRQUFRQSxLQUFJQSw4SUFBd0VBLEFBQTBFQSxVQUFDQTtvQ0FFaE9BLFFBQVFBLEtBQUlBO29DQUNaQSxRQUFRQSxLQUFJQTtvQ0FDWkEsUUFBUUEsS0FBSUE7b0NBQ1pBLFFBQVFBLEtBQUlBO29DQUNaQSxRQUFRQSxLQUFJQTtvQ0FDWkEsT0FBT0E7a0NBUDRLQSxLQUFJQTs0QkFVdEhBLE9BQU9BOzBCQXBCbENBLEtBQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O21DQ1NuQkE7b0JBRXZCQSxPQUFPQSxlQUFjQTs7b0NBQ0lBO29CQUV6QkEsT0FBT0EsZUFBY0E7O3lDQUNTQSxHQUFHQSxLQUFvQ0E7b0JBRXpFQTtvQkFDSUEsT0FBT0EsZ0JBQWdCQSxLQUFTQSxlQUFlQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucztcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5EaWFnbm9zdGljcy5Db250cmFjdHM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uUmVmbGVjdGlvbjtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIEFwcFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBjb25zdCBpbnQgeE11bHRpcGxpZXIgPSAyMCwgeU11bHRpcGxpZXIgPSAyMDtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBzY3JlZW5XaWR0aCA9IFdpbmRvdy5Jbm5lcldpZHRoLCBzY3JlZW5IZWlnaHQgPSBXaW5kb3cuSW5uZXJIZWlnaHQ7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgd2lkdGggPSBzY3JlZW5XaWR0aCAvIHhNdWx0aXBsaWVyLCBoZWlnaHQgPSBzY3JlZW5IZWlnaHQgLyB5TXVsdGlwbGllcjtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBIb3RiYXIgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFN0eWxlID0ge1xyXG4gICAgICAgICAgICAgICAgUG9zaXRpb24gPSBQb3NpdGlvbi5BYnNvbHV0ZSxcclxuICAgICAgICAgICAgICAgIExlZnQgPSBcIjEwMHB4XCIsXHJcbiAgICAgICAgICAgICAgICBUb3AgPSBzdHJpbmcuRm9ybWF0KFwiezB9cHhcIixXaW5kb3cuSW5uZXJIZWlnaHQgLSA0MCkgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFJlc2V0KG1ha2VCbGFuazogdHJ1ZSlcclxuICAgICAgICAgICAgfSxcIkJsYW5rXCIpKVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFJlc2V0KClcclxuICAgICAgICAgICAgfSxcIlJlc2V0XCIpKVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IEdldENvb3JkaW5hdGVzKClcclxuICAgICAgICAgICAgfSxcIkdldCBDb29yZGluYXRlc1wiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBTYXZlQXNTdGFydGVyKClcclxuICAgICAgICAgICAgfSxcIlNhdmUgYXMgU3RhcnRlclwiKSlcclxuLE5leHRTcXVhcmVUeXBlQnV0dG9uID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IE5leHRTcXVhcmVUeXBlKClcclxuICAgICAgICAgICAgfSxcIkNlbGxcIikpXHJcbixQbGF5QnV0dG9uID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IEludmVydElzUGxheWluZygpXHJcbiAgICAgICAgICAgIH0sXCLilrZcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gU2hvd01vZGFsKE1vZGFsVHlwZS5TZXR0aW5ncylcclxuICAgICAgICAgICAgfSxcIuKamVwiKSk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU3F1YXJlVHlwZSBTcXVhcmVUeXBlUGxhY2luZztcclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxCdXR0b25FbGVtZW50IE5leHRTcXVhcmVUeXBlQnV0dG9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTmV4dFNxdWFyZVR5cGUgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNxdWFyZVR5cGVQbGFjaW5nID0gKFNxdWFyZVR5cGUpKCgoaW50KVNxdWFyZVR5cGVQbGFjaW5nICsgMSkgJSAoaW50KVNxdWFyZVR5cGUuQ291bnQpO1xyXG4gICAgICAgICAgICBOZXh0U3F1YXJlVHlwZUJ1dHRvbi5Jbm5lckhUTUwgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuVG9DYW1lbFN0cmluZzxTcXVhcmVUeXBlPihTcXVhcmVUeXBlUGxhY2luZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IFJpZ2h0SG90YmFyID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgIFBvc2l0aW9uID0gUG9zaXRpb24uQWJzb2x1dGUsXHJcbiAgICAgICAgICAgICAgICBSaWdodCA9IFwiMTAwcHhcIixcclxuICAgICAgICAgICAgICAgIFRvcCA9IHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLFdpbmRvdy5Jbm5lckhlaWdodCAtIDQwKSAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLWluZm9cIixcclxuICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+IFNob3dNb2RhbChNb2RhbFR5cGUuTm90YWJsZU9iamVjdHMpXHJcbiAgICAgICAgICAgIH0sXCJOb3RhYmxlIE9iamVjdHNcIikpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgUmVzZXQgKGJvb2wgbWFrZUJsYW5rID0gZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIUdsb2JhbC5Db25maXJtKFwiQW55IHVuc2F2ZWQgY2hhbmdlcyB3aWxsIGJlIGxvc3QuIENvbnRpbnVlP1wiKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBTcXVhcmVzLkNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmICghbWFrZUJsYW5rKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0IHN0YXJ0ZXJQb3NpdGlvbnMgPSBHbG9iYWwuTG9jYWxTdG9yYWdlLkdldEl0ZW0oXCJzdGFydGVyUG9zaXRpb25zXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0ZXJQb3NpdGlvbnMgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgcyA9IChzdHJpbmcpc3RhcnRlclBvc2l0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXN0cmluZy5Jc051bGxPckVtcHR5KHMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JlYWNoICh2YXIgcG9zIGluIChKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+W10+KHMpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNxdWFyZXMuQWRkKHBvcywgU3F1YXJlVHlwZS5DZWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGxheWluZylcclxuICAgICAgICAgICAgICAgIEludmVydElzUGxheWluZygpO1xyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgLFNxdWFyZVR5cGU+PiBHZXRDb29yZGluYXRlc0ludGVyYWwoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBvZmZzZXRDb29yZHMgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KE5lZ0RpdihvZmZzZXRQb3MuSXRlbTEsIHhNdWx0aXBsaWVyKSwgTmVnRGl2KG9mZnNldFBvcy5JdGVtMiwgeU11bHRpcGxpZXIpKTtcclxuICAgICAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuVG9MaXN0PEtleVZhbHVlUGFpcjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixTcXVhcmVUeXBlPj4oU3F1YXJlcykuQ29udmVydEFsbDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+PigoQ29udmVydGVyPEtleVZhbHVlUGFpcjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixTcXVhcmVUeXBlPixTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+PikocyA9PiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQsIFNxdWFyZVR5cGU+KHMuS2V5Lkl0ZW0xICsgb2Zmc2V0Q29vcmRzLkl0ZW0xLCBzLktleS5JdGVtMiArIG9mZnNldENvb3Jkcy5JdGVtMiwgcy5WYWx1ZSkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsU3F1YXJlVHlwZT4+IEdldE5vcm1hbGl6ZWRDb29yZGluYXRlcyAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCAsU3F1YXJlVHlwZSA+PiBjb29yZHMgPSBHZXRDb29yZGluYXRlc0ludGVyYWwoKTtcclxuICAgICAgICAgICAgY29vcmRzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5XaGVyZTxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+Pihjb29yZHMsKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPixib29sPikoYyA9PiBjLkl0ZW0xPj0gMCAmJiBjLkl0ZW0yPj0gMCAmJiBjLkl0ZW0xPCB3aWR0aCAmJiBjLkl0ZW0yPCBoZWlnaHQpKS5Ub0xpc3QoKTtcclxuICAgICAgICAgICAgaW50IG1pblggPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk1pbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+Pihjb29yZHMsKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPixpbnQ+KShjID0+IGMuSXRlbTEpKSwgbWluWSA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuTWluPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4+KGNvb3JkcywoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+LGludD4pKGMgPT4gYy5JdGVtMikpO1xyXG4gICAgICAgICAgICBjb29yZHMgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+LFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4+KGNvb3JkcywoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+LFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQsU3F1YXJlVHlwZT4+KShjID0+IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludCwgU3F1YXJlVHlwZT4oYy5JdGVtMSAtIG1pblgsIGMuSXRlbTIgLSBtaW5ZLCBjLkl0ZW0zKSkpLlRvTGlzdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29vcmRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEdldENvb3JkaW5hdGVzICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzdHJpbmcgY29kZUdlbmVyYXRlZCA9IHN0cmluZy5Gb3JtYXQoXCIobmV3IEhhc2hTZXQ8KGludCB4LCBpbnQgeSk+XFxyXFxue3tcXHJcXG4gICAgezB9XFxyXFxufX0sIFxcXCJVbnRpdGxlZCBPYmplY3RcXFwiLCB7MX0pXCIsc3RyaW5nLkpvaW4oXCIsXFxuICAgIFwiLCBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50LFNxdWFyZVR5cGU+LHN0cmluZz4oR2V0Tm9ybWFsaXplZENvb3JkaW5hdGVzKCksKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludCxTcXVhcmVUeXBlPixzdHJpbmc+KSh0ID0+IHN0cmluZy5Gb3JtYXQoXCIoezB9LCB7MX0pXCIsdC5JdGVtMSx0Lkl0ZW0yKSkpKSxKU09OLlN0cmluZ2lmeShzdHJpbmcuRm9ybWF0KFwiezB9ezF9IC8gezJ9XCIsKFN5c3RlbS5MaW5xLkVudW1lcmFibGUuQWxsPEFkamFjZW5jeVR5cGU+KGFkamFjZW5jeVJ1bGVzLChGdW5jPEFkamFjZW5jeVR5cGUsYm9vbD4pKGEgPT4gYSA9PSBBZGphY2VuY3lUeXBlLk9uZSkpID8gXCJcIiA6IChzdHJpbmcuQ29uY2F0PGludD4oU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8QWRqYWNlbmN5VHlwZSxpbnQ+KGFkamFjZW5jeVJ1bGVzLChGdW5jPEFkamFjZW5jeVR5cGUsaW50PikoayA9PiAoaW50KWspKSkpICsgXCIgLT4gXCIpLHN0cmluZy5Db25jYXQ8aW50PihTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxib29sLGludD4oZGVhZFJ1bGVzLChGdW5jPGJvb2wsaW50PikoayA9PiBrID8gMSA6IDApKSksc3RyaW5nLkNvbmNhdDxpbnQ+KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0PGJvb2wsaW50PihsaXZpbmdSdWxlcywoRnVuYzxib29sLGludD4pKGsgPT4gayA/IDEgOiAwKSkpKSkpO1xyXG4gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCBtb2RhbCwgbW9kYWxDb250ZW50ID0gXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgICAgIG5ldyBIVE1MRGl2RWxlbWVudCB7IENsYXNzTmFtZSA9IFwibW9kYWwtY29udGVudFwiIH1cclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50IHsgQ2xhc3NOYW1lID0gXCJtb2RhbC1kaWFsb2dcIiB9XHJcbixtb2RhbCA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50IHsgQ2xhc3NOYW1lID0gXCJtb2RhbFwiLCBTdHlsZSA9IHsgRGlzcGxheSA9IFwiaW5oZXJpdFwiIH0gfVxyXG4sRG9jdW1lbnQuQm9keSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KFxyXG4gICAgICAgICAgICBtb2RhbENvbnRlbnQsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oXHJcbiAgICAgICAgICAgICAgICBuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcIm1vZGFsLWhlYWRlclwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuLWNsb3NlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+IG1vZGFsLlJlbW92ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4sbmV3IEhUTUxTcGFuRWxlbWVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbm5lckhUTUwgPSBcIiZ0aW1lcztcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICApLFxyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxQcmVFbGVtZW50PihcclxuXHJcbiAgICAgICAgICAgICAgICBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgSFRNTFByZUVsZW1lbnQoKSwoX28xKT0+e19vMS5DbGFzc05hbWU9IFwibW9kYWwtYm9keVwiO19vMS5TdHlsZVtcInVzZXItc2VsZWN0XCJdPSBcInRleHRcIjtyZXR1cm4gX28xO30pLGNvZGVHZW5lcmF0ZWQpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgU2F2ZUFzU3RhcnRlciAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgR2xvYmFsLkxvY2FsU3RvcmFnZS5TZXRJdGVtKFxyXG4gICAgICAgICAgICAgICAgXCJzdGFydGVyUG9zaXRpb25zXCIsIEpzb25Db252ZXJ0LlNlcmlhbGl6ZU9iamVjdChHZXRDb29yZGluYXRlc0ludGVyYWwoKSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgU2V0dGluZ3NQb3B1cCwgTm90YWJsZU9iamVjdHNQb3B1cDtcclxucHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBDcmVhdGVQb3B1cCgpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTERpdkVsZW1lbnR7U3R5bGUgPSB7Rm9udFNpemUgPSBcIjEuNXJlbVwiLCBCYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCIsIFBvc2l0aW9uID0gUG9zaXRpb24uRml4ZWQsIFRvcCA9IFwiMHB4XCIsIExlZnQgPSBcIjI1JVwiLCBXaWR0aCA9IFwiNTAlXCIsIEhlaWdodCA9IFwiMTAwJVwiLCBEaXNwbGF5ID0gRGlzcGxheS5Ob25lfX07XHJcbn1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IFBvcHVwQ29udGFpbmVyID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IEhUTUxEaXZFbGVtZW50KCksKF9vMSk9PntfbzEuU3R5bGUuUG9zaXRpb249IFBvc2l0aW9uLkZpeGVkO19vMS5TdHlsZS5Ub3A9IFwiMFwiO19vMS5TdHlsZS5MZWZ0PSBcIjBcIjtfbzEuU3R5bGUuV2lkdGg9IFwiMTAwJVwiO19vMS5TdHlsZVtcIngtaW5kZXhcIl09IDk5OTk5OTtfbzEuU3R5bGUuSGVpZ2h0PSBcIjEwMCVcIjtfbzEuU3R5bGUuQmFja2dyb3VuZENvbG9yPSBcInJnYmEoMCwgMCwgMCwgMC41KVwiO19vMS5TdHlsZS5EaXNwbGF5PSBEaXNwbGF5Lk5vbmU7cmV0dXJuIF9vMTt9KVxyXG4sU2V0dGluZ3NQb3B1cCA9IENyZWF0ZVBvcHVwKCkpXHJcbixOb3RhYmxlT2JqZWN0c1BvcHVwID0gQ3JlYXRlUG9wdXAoKSk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTEJ1dHRvbkVsZW1lbnQgU2V0dGluZ3NCdXR0b247XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTEJ1dHRvbkVsZW1lbnQgUGxheUJ1dHRvbjtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEludmVydElzUGxheWluZyAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcGxheWluZyA9ICFwbGF5aW5nO1xyXG4gICAgICAgICAgICBQbGF5QnV0dG9uLklubmVySFRNTCA9IHBsYXlpbmcgPyBcIuKPuFwiIDogXCLilrZcIjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgcGxheWluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2xbXSBsaXZpbmdSdWxlcyAgID0gbmV3IGJvb2xbOV0geyBmYWxzZSwgZmFsc2UsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSB9O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbFtdIGRlYWRSdWxlcyAgICAgPSBuZXcgYm9vbFs5XSB7IGZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSB9O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgQWRqYWNlbmN5VHlwZVtdIGFkamFjZW5jeVJ1bGVzID0gbmV3IEFkamFjZW5jeVR5cGVbbWF4QWRqYWNlbnRDZWxsc10geyBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUsIEFkamFjZW5jeVR5cGUuT25lLCBBZGphY2VuY3lUeXBlLk9uZSwgQWRqYWNlbmN5VHlwZS5PbmUgfTtcclxucHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBDcmVhdGVDYW52YXMoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxDYW52YXNFbGVtZW50e1dpZHRoID0gc2NyZWVuV2lkdGgsIEhlaWdodCA9IHNjcmVlbkhlaWdodH07XHJcbn1wdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IENyZWF0ZVRvcENhbnZhcygpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTENhbnZhc0VsZW1lbnR7V2lkdGggPSB3aWR0aCArIDIsIEhlaWdodCA9IGhlaWdodCArIDJ9O1xyXG59cHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBDcmVhdGVCb3R0b21DYW52YXMoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxDYW52YXNFbGVtZW50e1dpZHRoID0gc2NyZWVuV2lkdGggKyAyICogeE11bHRpcGxpZXIsIEhlaWdodCA9IHNjcmVlbkhlaWdodCArIDIgKiB5TXVsdGlwbGllcn07XHJcbn1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IERPTUNhbnZhcyA9IENyZWF0ZUNhbnZhcygpLCBCb3R0b21DYW52YXMgPSBDcmVhdGVCb3R0b21DYW52YXMoKSwgVG9wQ2FudmFzID0gQ3JlYXRlVG9wQ2FudmFzKCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkRcclxuICAgICAgICAgICAgVG9wQ2FudmFzQ29udGV4dCA9IFRvcENhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSxcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dCA9IEJvdHRvbUNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSxcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dCA9IERPTUNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBEaWN0aW9uYXJ5PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4sIFNxdWFyZVR5cGU+IFNxdWFyZXMgPSBuZXcgRGljdGlvbmFyeTxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+LCBTcXVhcmVUeXBlPigpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBvZmZzZXRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gTW91c2VQb3MgKHRoaXMgTW91c2VFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHJlY3QgPSBET01DYW52YXMuR2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKGUuQ2xpZW50WCAtIHJlY3QuTGVmdCksIChpbnQpKGUuQ2xpZW50WSAtIHJlY3QuVG9wKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBOZWdEaXYgKGludCBhLCBpbnQgYilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCByZXMgPSBhIC8gYjtcclxuICAgICAgICAgICAgcmV0dXJuIChhIDwgMCAmJiBhICE9IGIgKiByZXMpID8gcmVzIC0gMSA6IHJlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBjb25zdCBpbnQgbWF4QWRqYWNlbnRDZWxscyA9IDg7XHJcblxyXG4gICAgICAgIHN0YXRpYyBMaXN0PEhUTUxTZWxlY3RFbGVtZW50PiBhZGphY2VuY3lSdWxlc0NlbGxzID0gbmV3IExpc3Q8SFRNTFNlbGVjdEVsZW1lbnQ+KCk7XHJcbiAgICAgICAgc3RhdGljIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SFRNTElucHV0RWxlbWVudCxIVE1MSW5wdXRFbGVtZW50Pj4gb3B0aW9uQ2VsbHMgPSBuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIVE1MSW5wdXRFbGVtZW50LEhUTUxJbnB1dEVsZW1lbnQ+PigpO1xyXG5cclxuICAgICAgICBzdGF0aWMgdm9pZCBBcHBseVByZXNldChib29sW10gbGl2aW5nUnVsZXMsIGJvb2xbXSBkZWFkUnVsZXMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8PSA4OyBuKyspXHJcbiAgICAgICAgICAgIHtcclxub3B0aW9uQ2VsbHNbbl0uSXRlbTEuU2V0Qm9vbFZhbHVlKGxpdmluZ1J1bGVzW25dKTtcclxub3B0aW9uQ2VsbHNbbl0uSXRlbTIuU2V0Qm9vbFZhbHVlKGRlYWRSdWxlc1tuXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBlbnVtIE1vZGFsVHlwZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU2V0dGluZ3MsXHJcbiAgICAgICAgICAgIE5vdGFibGVPYmplY3RzXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgU2hvd01vZGFsIChNb2RhbFR5cGUgbW9kYWxUeXBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUG9wdXBDb250YWluZXIuU3R5bGUuRGlzcGxheSA9IFwiXCI7XHJcbiAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IHRvU2hvdztcclxuICAgICAgICAgICAgc3dpdGNoIChtb2RhbFR5cGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgTW9kYWxUeXBlLlNldHRpbmdzOlxyXG4gICAgICAgICAgICAgICAgICAgIHRvU2hvdyA9IFNldHRpbmdzUG9wdXA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1vZGFsVHlwZS5Ob3RhYmxlT2JqZWN0czpcclxuICAgICAgICAgICAgICAgICAgICB0b1Nob3cgPSBOb3RhYmxlT2JqZWN0c1BvcHVwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnRFeGNlcHRpb24oKChpbnQpbW9kYWxUeXBlKS5Ub1N0cmluZygpLCBcIm1vZGFsVHlwZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3JlYWNoIChIVE1MRGl2RWxlbWVudCBkaXYgaW4gbmV3W10geyBTZXR0aW5nc1BvcHVwLCBOb3RhYmxlT2JqZWN0c1BvcHVwIH0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRpdi5TdHlsZS5EaXNwbGF5ID0gZGl2ID09IHRvU2hvdyA/IFwiXCIgOiBcIm5vbmVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEhpZGVNb2RhbCAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUG9wdXBDb250YWluZXIuU3R5bGUuRGlzcGxheSA9IERpc3BsYXkuTm9uZTtcclxuICAgICAgICAgICAgU2V0dGluZ3NQb3B1cC5TdHlsZS5EaXNwbGF5ID0gRGlzcGxheS5Ob25lO1xyXG4gICAgICAgICAgICBOb3RhYmxlT2JqZWN0c1BvcHVwLlN0eWxlLkRpc3BsYXkgPSBEaXNwbGF5Lk5vbmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IERyYXdTaGFwZSAoSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiBTcXVhcmVzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgaW50IHhNdWx0aXBsaWVyID0gQXBwLnhNdWx0aXBsaWVyICogMjtcclxuICAgICAgICAgICAgY29uc3QgaW50IHlNdWx0aXBsaWVyID0gQXBwLnlNdWx0aXBsaWVyICogMjtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldHRpbmcgd2lkdGggYW5kIGhlaWdodCBvZiBzaGFwZVxyXG4gICAgICAgICAgICBpbnQgd2lkdGggPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk1heDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oU3F1YXJlcywoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixpbnQ+KShzID0+IHMuSXRlbTEpKSArIDE7XHJcbiAgICAgICAgICAgIGludCBoZWlnaHQgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk1heDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oU3F1YXJlcywoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixpbnQ+KShzID0+IHMuSXRlbTIpKSArIDE7XHJcbiAgICAgICAgICAgIC8vIERyYXdpbmcgb24gaW5uZXIgY2FudmFzXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGlubmVyQ2FudmFzID0gbmV3IEhUTUxDYW52YXNFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFdpZHRoID0gd2lkdGgsXHJcbiAgICAgICAgICAgICAgICBIZWlnaHQgPSBoZWlnaHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGNvbnRleHQgPSBpbm5lckNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgVWludDhDbGFtcGVkQXJyYXkgaW1hZ2VEYXRhQXJyYXkgPSBDcmVhdGVJbWFnZURhdGFBcnJheSh3aWR0aCwgaGVpZ2h0KTtcclxuZm9yZWFjaCAodmFyIF9kMSBpbiBTcXVhcmVzKVxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDEsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpbWFnZURhdGFBcnJheVsoeCArIHkgKiB3aWR0aCkgKiA0ICsgM10gPSAyNTU7XHJcbn1cbiAgICAgICAgICAgIEltYWdlRGF0YSBpbWFnZURhdGEgPSBuZXcgSW1hZ2VEYXRhKGltYWdlRGF0YUFycmF5LCAodWludCl3aWR0aCwgKHVpbnQpaGVpZ2h0KTtcclxuICAgICAgICAgICAgY29udGV4dC5QdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcclxuICAgICAgICAgICAgLy8gUmVzaXppbmcgdG8gdXBwZXIgY2FudmFzXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IG91dGVyQ2FudmFzID0gbmV3IEhUTUxDYW52YXNFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFdpZHRoID0gd2lkdGggKiB4TXVsdGlwbGllcixcclxuICAgICAgICAgICAgICAgIEhlaWdodCA9IGhlaWdodCAqIHlNdWx0aXBsaWVyXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBvdXRlckNvbnRleHQgPSBvdXRlckNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgb3V0ZXJDb250ZXh0LkltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBvdXRlckNvbnRleHQuRHJhd0ltYWdlKGlubmVyQ2FudmFzLCAwLCAwLCBvdXRlckNhbnZhcy5XaWR0aCwgb3V0ZXJDYW52YXMuSGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBvdXRlckNhbnZhcztcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgVWludDhDbGFtcGVkQXJyYXkgQ3JlYXRlSW1hZ2VEYXRhQXJyYXkoaW50IHdpZHRoLCBpbnQgaGVpZ2h0KVxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KHdpZHRoICogaGVpZ2h0ICogNCk7XHJcbn1wdWJsaWMgc3RhdGljIEhUTUxJbnB1dEVsZW1lbnQgQ3JlYXRlQ2hlY2tib3goKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxJbnB1dEVsZW1lbnR7VHlwZSA9IElucHV0VHlwZS5DaGVja2JveCwgU3R5bGUgPSB7V2lkdGggPSBcIjFyZW1cIiwgSGVpZ2h0ID0gXCIxZW1cIn19O1xyXG59cHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBDcmVhdGUwMVNlbGVjdG9yKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MU2VsZWN0RWxlbWVudCgpLkFkZDxIVE1MU2VsZWN0RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCJmYWxzZVwifSxcIjBcIiksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudHtWYWx1ZSA9IFwidHJ1ZVwifSxcIjFcIikpO1xyXG59cHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBDcmVhdGUwMTJTZWxlY3RvcigpXHJcbntcclxuICAgIHJldHVybiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxTZWxlY3RFbGVtZW50PihuZXcgSFRNTFNlbGVjdEVsZW1lbnQoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcIjBcIn0sXCIwXCIpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcIjFcIn0sXCIxXCIpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcIjJcIn0sXCIyXCIpKTtcclxufVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBNYWluICgpXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uQWN0aW9uPE1vdXNlRXZlbnQ8SFRNTENhbnZhc0VsZW1lbnQ+PiBQcm9jZXNzTW91c2VFdmVudCA9IG51bGw7XG4gICAgICAgICAgICBvYmplY3QgcnVsZXNPYmplY3RTdHIgPSBHbG9iYWwuTG9jYWxTdG9yYWdlLkdldEl0ZW0oXCJydWxlc1wiKTtcclxuc3RyaW5nIHI7ICAgICAgICAgICAgaWYgKChyID0gcnVsZXNPYmplY3RTdHIgYXMgc3RyaW5nKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBkeW5hbWljIHJ1bGVzT2JqID0gSlNPTi5QYXJzZShyKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocnVsZXNPYmplY3RTdHIgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTY3JpcHQuV3JpdGUoXCJ7MH0gaW5zdGFuY2VvZiBBcnJheVwiLCBydWxlc09iai5saXZpbmdSdWxlcykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXZpbmdSdWxlcyA9IEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PGJvb2xbXT4oSlNPTi5TdHJpbmdpZnkocnVsZXNPYmoubGl2aW5nUnVsZXMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFNjcmlwdC5Xcml0ZShcInswfSBpbnN0YW5jZW9mIEFycmF5XCIsIHJ1bGVzT2JqLmRlYWRSdWxlcykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWFkUnVsZXMgPSBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxib29sW10+KEpTT04uU3RyaW5naWZ5KHJ1bGVzT2JqLmRlYWRSdWxlcykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoU2NyaXB0LldyaXRlKFwiezB9IGluc3RhbmNlb2YgQXJyYXlcIiwgcnVsZXNPYmouYWRqYWNlbmN5UnVsZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXMgPSBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxpbnRbXT4oSlNPTi5TdHJpbmdpZnkocnVsZXNPYmouYWRqYWNlbmN5UnVsZXMpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCB7IH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LlN0eWxlW1widXNlci1zZWxlY3RcIl0gPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgRG9jdW1lbnQuSGVhZC5BcHBlbmRDaGlsZChuZXcgSFRNTExpbmtFbGVtZW50IHsgUmVsID0gXCJzdHlsZXNoZWV0XCIsIEhyZWYgPSBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vYm9vdHN0cmFwQDUuMi4wL2Rpc3QvY3NzL2Jvb3RzdHJhcC5taW4uY3NzXCIgfSk7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuU3R5bGUuTWFyZ2luID0gXCIwcHhcIjtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChQb3B1cENvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQobmV3IEhUTUxTdHlsZUVsZW1lbnQgeyBJbm5lckhUTUwgPSBcInRkLCB0aCB7IGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrOyBwYWRkaW5nOiA1cHggfSBidXR0b24geyBtYXJnaW4tcmlnaHQ6IDVweCB9XCIgfSk7XHJcblxyXG4gICAgICAgICAgICBIVE1MVGFibGVFbGVtZW50IGFkamFjZW5jeVJ1bGVzVGFibGUgPSBuZXcgSFRNTFRhYmxlRWxlbWVudCB7IFN0eWxlID0geyBNYXJnaW5MZWZ0ID0gXCJhdXRvXCIsIE1hcmdpblJpZ2h0ID0gXCJhdXRvXCIgfSB9O1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbnQgbiA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGludCB5ID0gMDsgeSA8IDM7IHkrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBIVE1MVGFibGVSb3dFbGVtZW50IHJvdyA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVSb3dFbGVtZW50PihuZXcgSFRNTFRhYmxlUm93RWxlbWVudCgpLGFkamFjZW5jeVJ1bGVzVGFibGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IHggPSAwOyB4IDwgMzsgeCsrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHggPT0gMSAmJiB5ID09IDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5BcHBlbmRDaGlsZChuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXNDZWxscy5BZGQoQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxTZWxlY3RFbGVtZW50PihDcmVhdGUwMTJTZWxlY3RvcigpLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSxyb3cpKS5TZXRBZGphY2VuY3lWYWx1ZShhZGphY2VuY3lSdWxlc1tuXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBIVE1MVGFibGVFbGVtZW50IHJ1bGVzVGFibGUgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUVsZW1lbnQ+KFxyXG5uZXcgSFRNTFRhYmxlRWxlbWVudCB7IFN0eWxlID0geyBNYXJnaW5MZWZ0ID0gXCJhdXRvXCIsIE1hcmdpblJpZ2h0ID0gXCJhdXRvXCIgfSB9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlUm93RWxlbWVudD4oXHJcbiAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlUm93RWxlbWVudCgpLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50KCksXCIjXCIpLFxyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudCgpLFwiTFwiKSxcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQoKSxcIkRcIilcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDw9IG1heEFkamFjZW50Q2VsbHM7IG4rKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSFRNTFRhYmxlUm93RWxlbWVudCByb3cgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlUm93RWxlbWVudD4obmV3IEhUTUxUYWJsZVJvd0VsZW1lbnQoKSxydWxlc1RhYmxlKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVSb3dFbGVtZW50PiggICAgICAgICAgICAgICAgcm93LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCksbi5Ub1N0cmluZygpKSk7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25DZWxscy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPEhUTUxJbnB1dEVsZW1lbnQsIEhUTUxJbnB1dEVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MSW5wdXRFbGVtZW50PihDcmVhdGVDaGVja2JveCgpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCksIHJvdykpLlNldEJvb2xWYWx1ZShsaXZpbmdSdWxlc1tuXSksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MSW5wdXRFbGVtZW50PihDcmVhdGVDaGVja2JveCgpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCksIHJvdykpLlNldEJvb2xWYWx1ZShkZWFkUnVsZXNbbl0pKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nICxib29sW10gLGJvb2xbXSA+PiBwcmVzZXRzTGlzdCA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZyAsYm9vbFtdICxib29sW10gPj4oKSwoX28xKT0+e19vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZywgYm9vbFtdLCBib29sW10+KFwiQ29ud2F5J3MgR2FtZSBvZiBMaWZlIFByZXNldFwiLCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0sIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0pKTtfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcsIGJvb2xbXSwgYm9vbFtdPihcIkltbW9ydGFsIENlbGxzIFByZXNldFwiLCBuZXcgYm9vbFs5XXt0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlfSwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO19vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZywgYm9vbFtdLCBib29sW10+KFwiQWxtb3N0IEltbW9ydGFsIENlbGxzIFByZXNldFwiLCBuZXcgYm9vbFs5XXt0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCBmYWxzZX0sIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0pKTtfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcsIGJvb2xbXSwgYm9vbFtdPihcIkFsdGVybmF0ZSBDb253YXkncyBHYW1lIG9mIExpZmUgUHJlc2V0XCIsIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2V9KSk7cmV0dXJuIF9vMTt9KTtcclxuXHJcbiAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IHByZXNldHNEaXYgPSBuZXcgSFRNTERpdkVsZW1lbnQgeyBTdHlsZSA9IHsgVGV4dEFsaWduID0gVGV4dEFsaWduLkNlbnRlciB9IH07XHJcbmZvcmVhY2ggKHZhciBfZDIgaW4gcHJlc2V0c0xpc3QpXHJcbntcclxuICAgIHN0cmluZyBuYW1lO1xyXG4gICAgYm9vbFtdIGxpdmluZ1J1bGVzO1xyXG4gICAgYm9vbFtdIGRlYWRSdWxlcztcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2QyLCBvdXQgbmFtZSwgb3V0IGxpdmluZ1J1bGVzLCBvdXQgZGVhZFJ1bGVzKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIHByZXNldHNEaXYsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50KCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQW5jaG9yRWxlbWVudD4obmV3IEhUTUxBbmNob3JFbGVtZW50e0hyZWYgPSBcImphdmFzY3JpcHQ6dm9pZCgwKVwiLCBTdHlsZSA9IHtGb250U2l6ZSA9IFwiMXJlbVwifSwgT25DbGljayA9IGUgPT4gQXBwbHlQcmVzZXQobGl2aW5nUnVsZXM6IGxpdmluZ1J1bGVzLCBkZWFkUnVsZXM6IGRlYWRSdWxlcyl9LG5hbWUpKSk7XHJcbn1cbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KFxyXG5cclxuICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEZXRhaWxzRWxlbWVudD4oXHJcbiAgICAgICAgICAgICAgICBuZXcgSFRNTERldGFpbHNFbGVtZW50IHsgT3BlbiA9IHRydWV9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFN1bW1hcnlFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MU3VtbWFyeUVsZW1lbnQoKSxcIkFkamFjZW5jeSBSdWxlc1wiKSxcclxuICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlc1RhYmxlXHJcbiAgICAgICAgICAgICAgICApLFxyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEZXRhaWxzRWxlbWVudD4oXHJcbiAgICAgICAgICAgICAgICBuZXcgSFRNTERldGFpbHNFbGVtZW50IHsgT3BlbiA9IHRydWUgfSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxTdW1tYXJ5RWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFN1bW1hcnlFbGVtZW50KCksXCJSdWxlc1wiKSxcclxuICAgICAgICAgICAgICAgICAgICBydWxlc1RhYmxlXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIFNldHRpbmdzUG9wdXAsbmV3IEhUTUxCUkVsZW1lbnQoKSwgcHJlc2V0c0RpdiwgbmV3IEhUTUxCUkVsZW1lbnQoKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIFNldHRpbmdzUG9wdXAsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsXHJcbiAgICAgICAgICAgICAgICBPbkNsaWNrID0gZSA9PlxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDwgbWF4QWRqYWNlbnRDZWxsczsgbisrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRqYWNlbmN5UnVsZXNbbl0gPSBhZGphY2VuY3lSdWxlc0NlbGxzW25dLkFkamFjZW5jeVZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDw9IG1heEFkamFjZW50Q2VsbHM7IG4rKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpdmluZ1J1bGVzW25dID0gb3B0aW9uQ2VsbHNbbl0uSXRlbTEuQm9vbFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYWRSdWxlc1tuXSA9IG9wdGlvbkNlbGxzW25dLkl0ZW0yLkJvb2xWYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBHbG9iYWwuTG9jYWxTdG9yYWdlLlNldEl0ZW0oXCJydWxlc1wiLCBKc29uQ29udmVydC5TZXJpYWxpemVPYmplY3QobmV3XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXZpbmdSdWxlcyA9IGxpdmluZ1J1bGVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWFkUnVsZXMgPSBkZWFkUnVsZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzID0gYWRqYWNlbmN5UnVsZXNcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgSGlkZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXCJTYXZlIENoYW5nZXNcIikpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihcclxuICAgICAgICAgICAgTm90YWJsZU9iamVjdHNQb3B1cCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLWxpZ2h0XCIsXHJcbiAgICAgICAgICAgICAgICBTdHlsZSA9IHsgQ3NzRmxvYXQgPSBGbG9hdC5SaWdodCB9LFxyXG4gICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT4gSGlkZU1vZGFsKClcclxuICAgICAgICAgICAgfSxcIuKdjFwiKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIE5vdGFibGVPYmplY3RzUG9wdXAsbmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFN0eWxlID0geyBDbGVhciA9IENsZWFyLkJvdGggfVxyXG4gICAgICAgICAgICB9KTtcclxuZm9yZWFjaCAodmFyIF9kMyBpbiBOb3RhYmxlT2JqZWN0c0xpc3QuTm90YWJsZU9iamVjdHMpXHJcbntcclxuICAgIEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PiBvYmplY3REZXRhaWxzO1xyXG4gICAgc3RyaW5nIGRlc2NyaXB0aW9uO1xyXG4gICAgc3RyaW5nIHJ1bGVzO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDMsIG91dCBvYmplY3REZXRhaWxzLCBvdXQgZGVzY3JpcHRpb24sIG91dCBydWxlcyk7XHJcbiAgICBIVE1MRGl2RWxlbWVudCBvYmplY3RJbmZvID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnR7U3R5bGUgPSB7V2lkdGggPSBcIjMwcmVtXCJ9fSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudHtTdHlsZSA9IHtEaXNwbGF5ID0gRGlzcGxheS5GbGV4LCBBbGlnbkl0ZW1zID0gQWxpZ25JdGVtcy5DZW50ZXIsIEZsZXhEaXJlY3Rpb24gPSBGbGV4RGlyZWN0aW9uLkNvbHVtbn19LE5vdGFibGVPYmplY3RzUG9wdXApKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50e1N0eWxlID0ge0Rpc3BsYXkgPSBEaXNwbGF5LkZsZXgsIEFsaWduSXRlbXMgPSBBbGlnbkl0ZW1zLkNlbnRlciwgRmxleERpcmVjdGlvbiA9IEZsZXhEaXJlY3Rpb24uQ29sdW1ufX0sRHJhd1NoYXBlKG9iamVjdERldGFpbHMpKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCgpLGRlc2NyaXB0aW9uKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLHJ1bGVzKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sbmV3IEhUTUxCUkVsZW1lbnQoKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLG5ldyBIVE1MQlJFbGVtZW50KCkpO1xyXG59XG5cclxuICAgICAgICAgICAgSFRNTERpdkVsZW1lbnQgYmFja2dyb3VuZERpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCB7IFN0eWxlID0geyBQb3NpdGlvbiA9IFBvc2l0aW9uLlJlbGF0aXZlLCBNaW5XaWR0aCA9IFwiMFwiLCBNaW5IZWlnaHQgPSBcIjBcIiB9fTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLk92ZXJmbG93ID0gT3ZlcmZsb3cuSGlkZGVuO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuWkluZGV4ID0gXCItMVwiO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuUG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5MZWZ0ID0gXCIwcHhcIjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLlRvcCA9IFwiMHB4XCI7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIGJhY2tncm91bmREaXYsRE9NQ2FudmFzKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgYmFja2dyb3VuZERpdixIb3RiYXIpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBiYWNrZ3JvdW5kRGl2LFJpZ2h0SG90YmFyKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChiYWNrZ3JvdW5kRGl2KTtcclxuXHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuU3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuVHJhbnNsYXRlKDAuNSwgMC41KTtcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5MaW5lV2lkdGggPSAxO1xyXG4gICAgICAgICAgICBmb3IgKGludCB4ID0gMDsgeCA8PSAod2lkdGggKyAyKTsgeCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbyh4ICogeE11bHRpcGxpZXIsIDApO1xyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5MaW5lVG8oeCAqIHhNdWx0aXBsaWVyLCAoaGVpZ2h0ICsgMykgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChpbnQgeSA9IDA7IHkgPD0gKGhlaWdodCArIDIpOyB5KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTW92ZVRvKDAsIHkgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVUbygod2lkdGggKyAzKSAqIHhNdWx0aXBsaWVyLCB5ICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDwgMTA7IG4rKylcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuU3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYWdnaW5nUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBvcmlnaW5hbFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgIGJvb2wgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBET01DYW52YXMuT25Nb3VzZURvd24gPSBlID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gdHJ1ZTtcclxuaW50IHg7XG5pbnQgeTtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoZS5Nb3VzZVBvcygpLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmdQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHggLSBvZmZzZXRQb3MuSXRlbTEsIHkgLSBvZmZzZXRQb3MuSXRlbTIpO1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxQb3MgPSBvZmZzZXRQb3M7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5Pbk1vdXNlVXAgPSBlID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTEtIG9yaWdpbmFsUG9zLkl0ZW0xKSA+IHhNdWx0aXBsaWVyIHx8IE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMi0gb3JpZ2luYWxQb3MuSXRlbTIpID4geU11bHRpcGxpZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nUG9zID0gb2Zmc2V0UG9zO1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBET01DYW52YXMuT25Nb3VzZU1vdmUgPSBlID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICgoZS5CdXR0b25zICYgMSkgPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRyYWdnaW5nUG9zID09IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCkpIGRyYWdnaW5nUG9zID0gZS5Nb3VzZVBvcygpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vdXNlUG9zID0gZS5Nb3VzZVBvcygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMS0gb3JpZ2luYWxQb3MuSXRlbTEpID4geE11bHRpcGxpZXIgfHwgTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0xLSBvcmlnaW5hbFBvcy5JdGVtMSkgPiB5TXVsdGlwbGllcilcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pihtb3VzZVBvcy5JdGVtMSAtIGRyYWdnaW5nUG9zLkl0ZW0xLCBtb3VzZVBvcy5JdGVtMiAtIGRyYWdnaW5nUG9zLkl0ZW0yKTtcclxuICAgICAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICAgICAgfTtcclxuUHJvY2Vzc01vdXNlRXZlbnQgPSAoZSkgPT5cclxue1xyXG4gICAgLy9pZiAoKEBldmVudC5CdXR0b25zICYgMSkgPT0gMCkgcmV0dXJuO1xyXG4gICAgdmFyIG1vdXNlUG9zID0gZS5Nb3VzZVBvcygpO1xyXG4gICAgaW50IGNsaWNrWDtcclxuICAgIGludCBjbGlja1k7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oTmVnRGl2KG1vdXNlUG9zLkl0ZW0xIC0gb2Zmc2V0UG9zLkl0ZW0xLCB4TXVsdGlwbGllciksIE5lZ0RpdigobW91c2VQb3MuSXRlbTIgLSBvZmZzZXRQb3MuSXRlbTIpLCB5TXVsdGlwbGllcikpLCBvdXQgY2xpY2tYLCBvdXQgY2xpY2tZKTtcclxuICAgIGlmICghU3F1YXJlcy5SZW1vdmUobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihjbGlja1gsIGNsaWNrWSkpKVxyXG4gICAgICAgIFNxdWFyZXMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oY2xpY2tYLCBjbGlja1kpLCBTcXVhcmVUeXBlUGxhY2luZyk7XHJcbiAgICBEcmF3KCk7XHJcbn1cclxuXHJcbjtcbiAgICAgICAgICAgIERPTUNhbnZhcy5PbkNsaWNrID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdpbmdJbnRlbnQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUHJvY2Vzc01vdXNlRXZlbnQoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIEdsb2JhbC5TZXRJbnRlcnZhbCgoQWN0aW9uKU5leHRGcmFtZSwgMTAwKTtcclxuXHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCB1cGRhdGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBOdW1iZXJPZkFkamFjZW50Q2VsbHMgKGludCB4LCBpbnQgeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBhZGphY2VudENlbGxzID0gMDtcclxuICAgICAgICAgICAgaW50IG4gPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGludCBMID0gMDsgTCA8PSA4OyBMKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChMID09IDQpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWRqYWNlbmN5UnVsZSA9IGFkamFjZW5jeVJ1bGVzW24rK107XHJcblxyXG4gICAgICAgICAgICAgICAgaW50IHhfID0geCAtIDEgKyAoTCAlIDMpLFxyXG4gICAgICAgICAgICAgICAgICAgIHlfID0geSAtIDEgKyBMIC8gMztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5TcXVhcmVFeHRlbnNpb25zLkNvbnRhaW5zQWxpdmU8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4+KFNxdWFyZXMsbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4XywgeV8pKSlcclxuICAgICAgICAgICAgICAgICAgICBhZGphY2VudENlbGxzICs9IChpbnQpYWRqYWNlbmN5UnVsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYWRqYWNlbnRDZWxscyA+IG1heEFkamFjZW50Q2VsbHMgPyBtYXhBZGphY2VudENlbGxzIDogYWRqYWNlbnRDZWxscztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy91cGRhdGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PiByZW1vdmluZyA9IG5ldyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PigpO1xyXG4gICAgICAgICAgICBIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PiBhZGRpbmcgPSBuZXcgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oKTtcclxuZm9yZWFjaCAodmFyIF9kNCBpbiBTcXVhcmVzKVxyXG57XHJcbiAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4gcG9zO1xyXG4gICAgU3F1YXJlVHlwZSBzcXVhcmVUeXBlO1xyXG4gICAgX2Q0LkRlY29uc3RydWN0KG91dCBwb3MsIG91dCBzcXVhcmVUeXBlKTtcclxuICAgIGludCB4O1xyXG4gICAgaW50IHk7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KHBvcywgb3V0IHgsIG91dCB5KTtcclxuICAgIGlmICghc3F1YXJlVHlwZS5Jc0FsaXZlKCkpXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICBpbnQgYWRqYWNlbnRDZWxscyA9IDA7XHJcbiAgICBpbnQgbiA9IDA7XHJcbiAgICBmb3IgKGludCBMID0gMDsgTCA8PSA4OyBMKyspXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKEwgPT0gNClcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgdmFyIGFkamFjZW5jeVJ1bGUgPSBhZGphY2VuY3lSdWxlc1tuKytdO1xyXG4gICAgICAgIGludCB4XyA9IHggLSAxICsgKEwgJSAzKSwgeV8gPSB5IC0gMSArIEwgLyAzO1xyXG4gICAgICAgIFNxdWFyZVR5cGUgc3F1YXJlSW5mbztcclxuICAgICAgICBpZiAoU3F1YXJlcy5UcnlHZXRWYWx1ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHhfLCB5XyksIG91dCBzcXVhcmVJbmZvKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChzcXVhcmVJbmZvLklzQWxpdmUoKSlcclxuICAgICAgICAgICAgICAgIGFkamFjZW50Q2VsbHMgKz0gKGludClhZGphY2VuY3lSdWxlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IGNlbGxzLlxyXG4gICAgICAgICAgICAvLyBPcHRpbWl6YXRpb24gZm9yIHJ1bGUgb2YgMyBhZGphY2VudCBjZWxsc1xyXG4gICAgICAgICAgICAvL2lmIChMICE9IDcgJiYgTCAhPSA4KVxyXG4gICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgIGlmIChkZWFkUnVsZXNbTnVtYmVyT2ZBZGphY2VudENlbGxzKHhfLCB5XyldKVxyXG4gICAgICAgICAgICAgICAgYWRkaW5nLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHhfLCB5XykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoYWRqYWNlbnRDZWxscyA+IG1heEFkamFjZW50Q2VsbHMpXHJcbiAgICAgICAgYWRqYWNlbnRDZWxscyA9IG1heEFkamFjZW50Q2VsbHM7XHJcbiAgICBpZiAoIXNxdWFyZVR5cGUuSXNVbmRlYWQoKSAmJiAhbGl2aW5nUnVsZXNbYWRqYWNlbnRDZWxsc10pXHJcbiAgICAgICAgcmVtb3ZpbmcuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSkpO1xyXG59XG5mb3JlYWNoICh2YXIgX2Q1IGluIHJlbW92aW5nKVxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDUsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpZiAoIVNxdWFyZXMuUmVtb3ZlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSkpKVxyXG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJTcXVhcmUgdHJpZWQgdG8gYmUgcmVtb3ZlZCBidXQgZGlkbid0IGV4aXN0XCIpO1xyXG59XG5mb3JlYWNoICh2YXIgX2Q2IGluIGFkZGluZylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2Q2LCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgU3F1YXJlcy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4LCB5KSwgU3F1YXJlVHlwZS5DZWxsKTtcclxufVxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBEcmF3ICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkNsZWFyUmVjdCgwLCAwLCBET01DYW52YXMuV2lkdGgsIERPTUNhbnZhcy5IZWlnaHQpO1xyXG4gICAgICAgICAgICBUb3BDYW52YXNDb250ZXh0LkNsZWFyUmVjdCgwLCAwLCBET01DYW52YXMuV2lkdGgsIERPTUNhbnZhcy5IZWlnaHQpO1xyXG5pbnQgb2Zmc2V0WDtcbmludCBvZmZzZXRZO1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChvZmZzZXRQb3MsIG91dCBvZmZzZXRYLCBvdXQgb2Zmc2V0WSk7XHJcbiAgICAgICAgICAgIFVpbnQ4Q2xhbXBlZEFycmF5IGltYWdlRGF0YUFycmF5ID0gQ3JlYXRlSW1hZ2VEYXRhQXJyYXkod2lkdGggKyAyLCBoZWlnaHQgKyAyKTtcclxuZm9yZWFjaCAodmFyIF9kNyBpbiBTcXVhcmVzKVxyXG57XHJcbiAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4gcG9zO1xyXG4gICAgU3F1YXJlVHlwZSBzcXVhcmVUeXBlO1xyXG4gICAgX2Q3LkRlY29uc3RydWN0KG91dCBwb3MsIG91dCBzcXVhcmVUeXBlKTtcclxuICAgIGludCB4O1xyXG4gICAgaW50IHk7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KHBvcywgb3V0IHgsIG91dCB5KTtcclxuICAgIGludCBkcmF3WCA9IHggKyAob2Zmc2V0WCAvIHhNdWx0aXBsaWVyKSArIDEsIGRyYXdZID0geSArIChvZmZzZXRZIC8geU11bHRpcGxpZXIpICsgMTtcclxuICAgIGlmIChkcmF3WCA8IDAgfHwgZHJhd1ggPj0gd2lkdGggKyAyIHx8IGRyYXdZIDwgMCB8fCBkcmF3WSA+PSBoZWlnaHQgKyAyKVxyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgaW50IGlkeCA9IGRyYXdYICsgZHJhd1kgKiAod2lkdGggKyAyKTtcclxuICAgIGltYWdlRGF0YUFycmF5W2lkeCAqIDQgKyAzXSA9IHNxdWFyZVR5cGUuSXNVbmRlYWQoKSA/IChieXRlKTEyNyA6IChieXRlKTI1NTtcclxufVxuICAgICAgICAgICAgSW1hZ2VEYXRhIGltYWdlRGF0YSA9IG5ldyBJbWFnZURhdGEoaW1hZ2VEYXRhQXJyYXksICh1aW50KSh3aWR0aCArIDIpLCAodWludCkoaGVpZ2h0ICsgMikpO1xyXG4gICAgICAgICAgICBUb3BDYW52YXNDb250ZXh0LlB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdJbWFnZShCb3R0b21DYW52YXMsIG9mZnNldFggJSB4TXVsdGlwbGllciAtIHhNdWx0aXBsaWVyLCBvZmZzZXRZICUgeU11bHRpcGxpZXIgLSB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0ltYWdlKFRvcENhbnZhcywgKG9mZnNldFggJSB4TXVsdGlwbGllcikgLSB4TXVsdGlwbGllciwgKG9mZnNldFkgJSB5TXVsdGlwbGllcikgLSB5TXVsdGlwbGllciwgKHdpZHRoICsgMikgKiB4TXVsdGlwbGllciwgKGhlaWdodCArIDIpICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgZnJhbWVOdW0gPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTmV4dEZyYW1lICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIXBsYXlpbmcpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGJvb2wgc2tpcEZyYW1lcyA9IFNxdWFyZXMuQ291bnQgPj0gMjUwO1xyXG4gICAgICAgICAgICBpbnQgdXBkYXRlc1BlckRyYXcgPSAxOy8vIHNraXBGcmFtZXMgPyAyIDogMTtcclxuICAgICAgICAgICAgZnJhbWVOdW0rKztcclxuICAgICAgICAgICAgaWYgKHNraXBGcmFtZXMgJiYgKGZyYW1lTnVtICUgdXBkYXRlc1BlckRyYXcpICE9IDApIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDwgdXBkYXRlc1BlckRyYXc7IG4rKylcclxuICAgICAgICAgICAgICAgIFVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UZXh0LlJlZ3VsYXJFeHByZXNzaW9ucztcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgRXh0ZW5zaW9uc1xyXG4gICAge1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIigoZSwgYykgPT4gYy5hcHBlbmRDaGlsZChlKSkoe2VsZW1lbnR9LCB7Y29udGFpbmluZ0VsZW19KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIEFkZFRvPFQ+KHRoaXMgVCBlbGVtZW50LCBOb2RlIGNvbnRhaW5pbmdFbGVtKSB3aGVyZSBUIDogTm9kZTtcclxuICAgICAgICAvL3B1YmxpYyBzdGF0aWMgVCBBZGRUb0JvZHk8VD4odGhpcyBUIG4pIHdoZXJlIFQgOiBOb2RlID0+IEFwcC5yb290LkFwcGVuZENoaWxkPFQ+KG4pO1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIntub2RlfS5hcHBlbmRDaGlsZCh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgQXBwZW5kQ2hpbGQ8VD4odGhpcyBOb2RlIG5vZGUsIFQgZWxlbWVudCkgd2hlcmUgVCA6IE5vZGU7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc3R5bGUuZGlzcGxheSA9ICdub25lJywgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBIaWRlPFQ+KHRoaXMgVCBlbGVtZW50KSB3aGVyZSBUIDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc3R5bGUuZGlzcGxheSA9ICcnLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIFNob3c8VD4odGhpcyBUIGVsZW1lbnQpIHdoZXJlIFQgOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBbVGVtcGxhdGUoXCIobGkgPT4gKGxpLmFwcGVuZENoaWxkKHtlbGVtZW50fSksIGxpKSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gSFRNTExJRWxlbWVudCBXcmFwTGkodGhpcyBOb2RlIGVsZW1lbnQpO1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihkaXYgPT4gKGRpdi5hcHBlbmRDaGlsZCh7ZWxlbWVudH0pLCBkaXYpKShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gSFRNTERpdkVsZW1lbnQgV3JhcERpdih0aGlzIE5vZGUgZWxlbWVudCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBUIEFkZDxUPih0aGlzIFQgZWxlbWVudCwgcGFyYW1zIFVuaW9uPE5vZGUsIHN0cmluZz5bXSBub2Rlcykgd2hlcmUgVCA6IE5vZGVcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFVuaW9uPE5vZGUsIHN0cmluZz4gbm9kZSBpbiBub2RlcylcclxuICAgICAgICAgICAgICAgIGlmIChub2RlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChub2RlLklzPHN0cmluZz4oKSlcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LkFwcGVuZENoaWxkKG5ldyBUZXh0KG5vZGUuQXM8c3RyaW5nPigpKSk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5BcHBlbmRDaGlsZChub2RlLkFzPE5vZGU+KCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgVCBBZGRFbGVtZW50PFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgc3RyaW5nPltdIG5vZGVzKVxyXG4gICAgd2hlcmUgVCA6IE5vZGVcclxue1xyXG4gICAgcmV0dXJuIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8VD4oZWxlbWVudCxub2Rlcyk7XHJcbn1wdWJsaWMgc3RhdGljIFQgQWRkRGl2PFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgc3RyaW5nPltdIG5vZGVzKVxyXG4gICAgd2hlcmUgVCA6IE5vZGVcclxue1xyXG4gICAgcmV0dXJuIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8VD4oZWxlbWVudCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnQoKSxub2RlcykpO1xyXG59cHVibGljIHN0YXRpYyBUIEFkZFVsPFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgVW5pb248Tm9kZSwgc3RyaW5nPltdLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFVMaXN0RWxlbWVudD4obmV3IEhUTUxVTGlzdEVsZW1lbnQoKSxTeXN0ZW0uQXJyYXlFeHRlbnNpb25zLk1hcDxVbmlvbjxOb2RlLFVuaW9uPE5vZGUsIHN0cmluZz5bXSxzdHJpbmc+LFVuaW9uPE5vZGUsc3RyaW5nPj4obm9kZXMsKEZ1bmM8VW5pb248Tm9kZSxVbmlvbjxOb2RlLCBzdHJpbmc+W10sc3RyaW5nPixVbmlvbjxOb2RlLHN0cmluZz4+KShuID0+IChVbmlvbjxOb2RlLCBzdHJpbmc+KShuLklzPFVuaW9uPE5vZGUsIHN0cmluZz5bXT4oKSA/IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTExJRWxlbWVudD4obmV3IEhUTUxMSUVsZW1lbnQoKSxuLkFzPFVuaW9uPE5vZGUsIHN0cmluZz5bXT4oKSkgOiBuLklzPHN0cmluZz4oKSA/IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTExJRWxlbWVudD4obmV3IEhUTUxMSUVsZW1lbnQoKSxuLkFzPHN0cmluZz4oKSkgOiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxMSUVsZW1lbnQ+KG5ldyBIVE1MTElFbGVtZW50KCksbi5BczxOb2RlPigpKSkpKSkpO1xyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgQWRkQ2FtZWxTcGFjZSh0aGlzIHN0cmluZyBzdHIpXHJcbntcclxuICAgIHJldHVybiBSZWdleC5SZXBsYWNlKFJlZ2V4LlJlcGxhY2Uoc3RyLCBAXCIoW15fYS16XSkoW15fYS16XVthLXpdKVwiLCBcIiQxICQyXCIpLCBAXCIoW2Etel0pKFteX2Etel0pXCIsIFwiJDEgJDJcIik7XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBUb0NhbWVsU3RyaW5nPFQ+KHRoaXMgVCBlKVxyXG4gICAgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxue1xyXG4gICAgcmV0dXJuIGUuVG9TdHJpbmcoKS5BZGRDYW1lbFNwYWNlKCkuUmVwbGFjZSgnXycsICcgJyk7XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgQWRkRW51bTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdCwgVD8gZGVmYXVsdFZhbHVlID0gbnVsbCwgc3RyaW5nIGRlZmF1bHRWYWx1ZVN0cmluZyA9IFwiXCIpIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoZGVmYXVsdFZhbHVlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICBzZWxlY3QuQWRkKEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudCB7IFZhbHVlID0gXCJcIiwgU2VsZWN0ZWQgPSB0cnVlLCBEaXNhYmxlID0gdHJ1ZSB9LGRlZmF1bHRWYWx1ZVN0cmluZykpO1xyXG4gICAgICAgICAgICBmb3JlYWNoIChUIHZhbHVlIGluIFN5c3RlbS5FbnVtLkdldFZhbHVlcyh0eXBlb2YoVCkpKVxyXG4gICAgICAgICAgICAgICAgc2VsZWN0LkFkZChDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnRcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBWYWx1ZSA9ICgoaW50KShvYmplY3QpdmFsdWUpLlRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0ZWQgPSBvYmplY3QuRXF1YWxzKGRlZmF1bHRWYWx1ZSwgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5Ub0NhbWVsU3RyaW5nPFQ+KHZhbHVlKSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBib29sIEJvb2xWYWx1ZSh0aGlzIEhUTUxJbnB1dEVsZW1lbnQgY2hlY2tCb3gpXHJcbntcclxuICAgIHJldHVybiBjaGVja0JveC5DaGVja2VkO1xyXG59cHVibGljIHN0YXRpYyBib29sIEJvb2xWYWx1ZSh0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdClcclxue1xyXG4gICAgcmV0dXJuIHNlbGVjdC5WYWx1ZSA9PSBcInRydWVcIiA/IHRydWUgOiBmYWxzZTtcclxufXB1YmxpYyBzdGF0aWMgQWRqYWNlbmN5VHlwZSBBZGphY2VuY3lWYWx1ZSh0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdClcclxue1xyXG4gICAgcmV0dXJuIChBZGphY2VuY3lUeXBlKWludC5QYXJzZShzZWxlY3QuVmFsdWUpO1xyXG59cHVibGljIHN0YXRpYyBUPyBWYWx1ZTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdClcclxuICAgIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbntcclxuICAgIHJldHVybiBzZWxlY3QuVmFsdWUgPT0gXCJcIiA/IG51bGwgOiAoVD8gKShUKShvYmplY3QpaW50LlBhcnNlKHNlbGVjdC5WYWx1ZSk7XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTElucHV0RWxlbWVudCBTZXRCb29sVmFsdWUodGhpcyBIVE1MSW5wdXRFbGVtZW50IGNoZWNrQm94LCBib29sIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2hlY2tCb3guQ2hlY2tlZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICByZXR1cm4gY2hlY2tCb3g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgU2V0Qm9vbFZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBib29sIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZWN0LlZhbHVlID0gdmFsdWUuVG9TdHJpbmcoKS5Ub0xvd2VyKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgU2V0QWRqYWNlbmN5VmFsdWUodGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QsIEFkamFjZW5jeVR5cGUgdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxlY3QuVmFsdWUgPSAoKGludCl2YWx1ZSkuVG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBTZXRWYWx1ZTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdCwgVCB2YWx1ZSkgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGVjdC5WYWx1ZSA9ICgoaW50KShvYmplY3QpdmFsdWUpLlRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIHN0cmluZyBUb1RpbWVTdHJpbmcodGhpcyBUaW1lU3BhbiB0aW1lKVxyXG57XHJcbiAgICByZXR1cm4gdGltZS5Ub1N0cmluZyh0aW1lID49IFRpbWVTcGFuLkZyb21Ib3VycygxKSA/IEBcImhcXDptbVxcOnNzXCIgOiBAXCJtXFw6c3NcIik7XHJcbn0gICAgICAgIFtUZW1wbGF0ZShcIihlID0+IChlLnNldEN1c3RvbVZhbGlkaXR5KHttZXNzYWdlfSksIGUucmVwb3J0VmFsaWRpdHkoKSwgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBTZXRDdXN0b21WYWxpZGl0eTxUPih0aGlzIFQgZWxlbWVudCwgc3RyaW5nIG1lc3NhZ2UpIHdoZXJlIFQgOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zZXRBdHRyaWJ1dGUoJ2xpc3QnLCB7ZGF0YWxpc3RJRH0pLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MSW5wdXRFbGVtZW50IFNldERhdGFMaXN0KHRoaXMgSFRNTElucHV0RWxlbWVudCBlbGVtZW50LCBzdHJpbmcgZGF0YWxpc3RJRCk7XHJcbiAgICAgICAgLy9bVGVtcGxhdGUoXCJ7ZWxlbX0uYXBwZW5kQ2hpbGQoe2FkZGluZ30pXCIpXVxyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBleHRlcm4gVCBBcHBlbmQ8VD4gKHRoaXMgTm9kZSBlbGVtLCBUIGFkZGluZyk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVW5pb248Tm9kZSwgc3RyaW5nPltdIEpvaW5CUih0aGlzIElFbnVtZXJhYmxlPHN0cmluZz4gc3RyaW5ncylcclxuICAgICAgICB7XHJcblN5c3RlbS5GdW5jPElFbnVtZXJhYmxlPFVuaW9uPE5vZGUsIHN0cmluZz4+PiBJbm5lciA9IG51bGw7XG4gICAgICAgICAgICBcclxuSW5uZXIgPSAoKSA9PlxyXG57XHJcbiAgICB1c2luZyAodmFyIGVudW1lciA9IHN0cmluZ3MuR2V0RW51bWVyYXRvcigpKVxyXG4gICAge1xyXG4gICAgICAgIGlmICghZW51bWVyLk1vdmVOZXh0KCkpXHJcbiAgICAgICAgICAgIHlpZWxkIGJyZWFrO1xyXG4gICAgICAgIHlpZWxkIHJldHVybiBlbnVtZXIuQ3VycmVudDtcclxuICAgICAgICB3aGlsZSAoZW51bWVyLk1vdmVOZXh0KCkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gbmV3IEhUTUxCUkVsZW1lbnQoKTtcclxuICAgICAgICAgICAgeWllbGQgcmV0dXJuIGVudW1lci5DdXJyZW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuO1xuICAgICAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuVG9BcnJheTxVbmlvbjxOb2RlLHN0cmluZz4+KElubmVyKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgTm90YWJsZU9iamVjdHNMaXN0XHJcbiAgICB7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+ICxzdHJpbmcgLHN0cmluZyA+PiBOb3RhYmxlT2JqZWN0cyA9XHJcbiAgICAgICAgICAgIGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gLHN0cmluZyAsc3RyaW5nID4+KCksKF9vMyk9PntfbzMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4sIHN0cmluZywgc3RyaW5nPihnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+KCksIChfbzEpID0+XHJcbntcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKSk7XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMSwgMCkpO1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDEsIDEpKTtcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAyKSk7XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMiwgMikpO1xyXG4gICAgcmV0dXJuIF9vMTtcclxufVxyXG5cclxuKSwgXCJUd28gR2VuZXJhdGlvbiBOaW5ldHkgRGVncmVlIFJvdGF0b3JcIiwgXCIwMDEwMTAtLS0gLyAwMDAxMDEtLS1cIikpO19vMy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+Piwgc3RyaW5nLCBzdHJpbmc+KGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4oKSwgKF9vMikgPT5cclxue1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApKTtcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigxLCAwKSk7XHJcbiAgICBfbzIuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMSwgMSkpO1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDEpKTtcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAyKSk7XHJcbiAgICByZXR1cm4gX28yO1xyXG59XHJcblxyXG4pLCBcIk9uZSBHZW5lcmF0aW9uIE5pbmV0eSBEZWdyZWUgUm90YXRvclwiLCBcIjAwMTAxMC0tLSAvIDAwMDEwMS0tLVwiKSk7cmV0dXJuIF9vMzt9KTtcclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIC8vLyA8c3VtbWFyeT5cclxuICAgIC8vLyBPcHRpb25zOlxyXG4gICAgLy8vIC0gQ2VsbCAoSXNDZWxsOiB0cnVlLCBJc1dhbGw6IGZhbHNlKSAgfCBCbGFja1xyXG4gICAgLy8vIC0gV2FsbCAoSXNDZWxsOiB0cnVlLCBJc1dhbGw6IHRydWUpICAgfCBHcmV5XHJcbiAgICAvLy8gLSBCcmljayAoSXNDZWxsOiBmYWxzZSwgSXNXYWxsOiB0cnVlKSB8IEdyZXlcclxuICAgIC8vLyA8L3N1bW1hcnk+XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBTcXVhcmVFeHRlbnNpb25zXHJcbiAgICB7XHJcbnB1YmxpYyBzdGF0aWMgYm9vbCBJc0FsaXZlKHRoaXMgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKVxyXG57XHJcbiAgICByZXR1cm4gc3F1YXJlVHlwZSAhPSBTcXVhcmVUeXBlLkJyaWNrO1xyXG59cHVibGljIHN0YXRpYyBib29sIElzVW5kZWFkKHRoaXMgU3F1YXJlVHlwZSBzcXVhcmVUeXBlKVxyXG57XHJcbiAgICByZXR1cm4gc3F1YXJlVHlwZSAhPSBTcXVhcmVUeXBlLkNlbGw7XHJcbn1wdWJsaWMgc3RhdGljIGJvb2wgQ29udGFpbnNBbGl2ZTxUPih0aGlzIERpY3Rpb25hcnk8VCwgU3F1YXJlVHlwZT4gZGljLCBUIGtleSlcclxue1xyXG5TcXVhcmVUeXBlIHNxdWFyZVR5cGU7XG4gICAgcmV0dXJuIGRpYy5UcnlHZXRWYWx1ZShrZXksIG91dCBzcXVhcmVUeXBlKSAmJiBzcXVhcmVUeXBlLklzQWxpdmUoKTtcclxufSAgICB9XHJcblxyXG4gICAgcHVibGljIGVudW0gU3F1YXJlVHlwZVxyXG4gICAge1xyXG4gICAgICAgIENlbGwsICAvLyBCbGFja1xyXG4gICAgICAgIFdhbGwsICAvLyBHcmV5XHJcbiAgICAgICAgQnJpY2ssIC8vIEdyZXlcclxuICAgICAgICBDb3VudFxyXG4gICAgfVxyXG59XHJcbiJdCn0K
