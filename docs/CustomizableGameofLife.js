/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2022
 * @compiler Bridge.NET 17.10.1
 */
Bridge.assembly("CustomizableGameofLife", function ($asm, globals) {
    "use strict";

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
                            CustomizableGameofLife.App.adjacencyRules = Newtonsoft.Json.JsonConvert.DeserializeObject(JSON.stringify(rulesObj.adjacencyRules), System.Array.type(System.Boolean));
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
                        CustomizableGameofLife.App.adjacencyRulesCells.add(CustomizableGameofLife.Extensions.SetBoolValue(((e, c) => c.appendChild(e))(CustomizableGameofLife.App.CreateCheckbox(), ((e, c) => c.appendChild(e))(document.createElement("td"), row)), CustomizableGameofLife.App.adjacencyRules[System.Array.index(n, CustomizableGameofLife.App.adjacencyRules)]));
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
                    CustomizableGameofLife.App.adjacencyRules[System.Array.index(n2, CustomizableGameofLife.App.adjacencyRules)] = CustomizableGameofLife.Extensions.BoolValue(CustomizableGameofLife.App.adjacencyRulesCells.getItem(n2));
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
                    CustomizableGameofLife.App.Squares.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(clickX.v, clickY.v));
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
                    var $t, $t1, $t2;
                    this.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32))();
                    this.xMultiplier = 20;
                    this.yMultiplier = 20;
                    this.maxAdjacentCells = 8;
                    this.screenWidth = window.innerWidth;
                    this.screenHeight = window.innerHeight;
                    this.width = (Bridge.Int.div(CustomizableGameofLife.App.screenWidth, CustomizableGameofLife.App.xMultiplier)) | 0;
                    this.height = (Bridge.Int.div(CustomizableGameofLife.App.screenHeight, CustomizableGameofLife.App.yMultiplier)) | 0;
                    this.Hotbar = CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, ($t = document.createElement("div"), $t.style.position = "absolute", $t.style.left = "100px", $t.style.top = System.String.format("{0}px", [Bridge.box(((window.innerHeight - 40) | 0), System.Int32)]), $t), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.Reset(true);
                    }, $t), ["Blank"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.Reset();
                    }, $t), ["Reset"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.GetCoordinates();
                    }, $t), ["Get Coordinates"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.SaveAsStarter();
                    }, $t), ["Save as Starter"])]), [($t = CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t1 = document.createElement("button"), $t1.className = "btn btn-primary", $t1.onclick = function (e) {
                        CustomizableGameofLife.App.InvertIsPlaying();
                    }, $t1), ["\u25b6"]), CustomizableGameofLife.App.PlayButton = $t, $t)]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t1 = document.createElement("button"), $t1.className = "btn btn-primary", $t1.onclick = function (e) {
                        CustomizableGameofLife.App.ShowModal(CustomizableGameofLife.App.ModalType.Settings);
                    }, $t1), ["\u2699"])]);
                    this.RightHotbar = CustomizableGameofLife.Extensions.Add(HTMLDivElement, ($t1 = document.createElement("div"), $t1.style.position = "absolute", $t1.style.right = "100px", $t1.style.top = System.String.format("{0}px", [Bridge.box(((window.innerHeight - 40) | 0), System.Int32)]), $t1), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t1 = document.createElement("button"), $t1.className = "btn btn-info", $t1.onclick = function (e) {
                        CustomizableGameofLife.App.ShowModal(CustomizableGameofLife.App.ModalType.NotableObjects);
                    }, $t1), ["Notable Objects"])]);
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
                        }(document.createElement("div")), [($t1 = CustomizableGameofLife.App.CreatePopup(), CustomizableGameofLife.App.SettingsPopup = $t1, $t1)]), [($t2 = CustomizableGameofLife.App.CreatePopup(), CustomizableGameofLife.App.NotableObjectsPopup = $t2, $t2)]);
                    this.playing = false;
                    this.livingRules = System.Array.init([false, false, true, true, false, false, false, false, false], System.Boolean);
                    this.deadRules = System.Array.init([false, false, false, true, false, false, false, false, false], System.Boolean);
                    this.adjacencyRules = System.Array.init([true, true, true, true, true, true, true, true], System.Boolean);
                    this.DOMCanvas = CustomizableGameofLife.App.CreateCanvas();
                    this.BottomCanvas = CustomizableGameofLife.App.CreateBottomCanvas();
                    this.TopCanvas = CustomizableGameofLife.App.CreateTopCanvas();
                    this.TopCanvasContext = CustomizableGameofLife.App.TopCanvas.getContext("2d");
                    this.BottomCanvasContext = CustomizableGameofLife.App.BottomCanvas.getContext("2d");
                    this.DOMCanvasContext = CustomizableGameofLife.App.DOMCanvas.getContext("2d");
                    this.Squares = new (System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32))).ctor();
                    this.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0);
                    this.adjacencyRulesCells = new (System.Collections.Generic.List$1(HTMLInputElement)).ctor();
                    this.optionCells = new (System.Collections.Generic.List$1(System.ValueTuple$2(HTMLInputElement,HTMLInputElement))).ctor();
                    this.updating = false;
                    this.frameNum = 0;
                }
            },
            methods: {
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
                                        CustomizableGameofLife.App.Squares.add(pos.$clone());
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
                    return ($t = System.ValueTuple$2(System.Int32,System.Int32), System.Linq.Enumerable.from(CustomizableGameofLife.App.Squares, $t).toList($t)).ConvertAll(System.ValueTuple$2(System.Int32,System.Int32), function (s) {
                        return new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(((s.Item1 + offsetCoords.Item1) | 0), ((s.Item2 + offsetCoords.Item2) | 0));
                    });
                },
                GetNormalizedCoordinates: function () {
                    var coords = CustomizableGameofLife.App.GetCoordinatesInteral();
                    coords = System.Linq.Enumerable.from(coords, System.ValueTuple$2(System.Int32,System.Int32)).where(function (c) {
                            return c.Item1 >= 0 && c.Item2 >= 0 && c.Item1 < CustomizableGameofLife.App.width && c.Item2 < CustomizableGameofLife.App.height;
                        }).toList(System.ValueTuple$2(System.Int32,System.Int32));
                    var minX = System.Linq.Enumerable.from(coords, System.ValueTuple$2(System.Int32,System.Int32)).min(function (c) {
                            return c.Item1;
                        }), minY = System.Linq.Enumerable.from(coords, System.ValueTuple$2(System.Int32,System.Int32)).min(function (c) {
                            return c.Item2;
                        });
                    coords = System.Linq.Enumerable.from(coords, System.ValueTuple$2(System.Int32,System.Int32)).select(function (c) {
                            return new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(((c.Item1 - minX) | 0), ((c.Item2 - minY) | 0));
                        }).toList(System.ValueTuple$2(System.Int32,System.Int32));
                    return coords;
                },
                GetCoordinates: function () {
                    var $t;
                    var codeGenerated = System.String.format("(new HashSet<(int x, int y)>\r\n{{\r\n    {0}\r\n}}, \"Untitled Object\", {1})", Bridge.toArray(System.Linq.Enumerable.from(CustomizableGameofLife.App.GetNormalizedCoordinates(), System.ValueTuple$2(System.Int32,System.Int32)).select(function (t) {
                                    return System.String.format("({0}, {1})", Bridge.box(t.Item1, System.Int32), Bridge.box(t.Item2, System.Int32));
                                })).join(",\n    "), JSON.stringify(System.String.format("{0}{1} / {2}", (System.Linq.Enumerable.from(CustomizableGameofLife.App.adjacencyRules, System.Boolean).all(function (a) {
                                    return a;
                                }) ? "" : ((System.String.concat(Bridge.toArray(System.Linq.Enumerable.from(CustomizableGameofLife.App.adjacencyRules, System.Boolean).select(function (k) {
                                        return k ? 1 : 0;
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
                NumberOfAdjacentCells: function (x, y) {
                    var adjacentCells = 0;
                    var n = 0;
                    for (var L = 0; L <= 8; L = (L + 1) | 0) {
                        if (L === 4 || !CustomizableGameofLife.App.adjacencyRules[System.Array.index(Bridge.identity(n, ((n = (n + 1) | 0))), CustomizableGameofLife.App.adjacencyRules)]) {
                            continue;
                        }

                        var x_ = (((x - 1) | 0) + (L % 3)) | 0, y_ = (((y - 1) | 0) + ((Bridge.Int.div(L, 3)) | 0)) | 0;


                        if (CustomizableGameofLife.App.Squares.contains(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x_, y_))) {
                            adjacentCells = (adjacentCells + 1) | 0;
                        }
                    }
                    return adjacentCells;
                },
                Update: function () {
                    var $t, $t1, $t2;

                    var removing = new (System.Collections.Generic.List$1(System.ValueTuple$2(System.Int32,System.Int32))).ctor();
                    var adding = new (System.Collections.Generic.List$1(System.ValueTuple$2(System.Int32,System.Int32))).ctor();
                    $t = Bridge.getEnumerator(CustomizableGameofLife.App.Squares);
                    try {
                        while ($t.moveNext()) {
                            var _d4 = $t.Current.$clone();
                            var x = { };
                            var y = { };
                            Bridge.Deconstruct(_d4.$clone(), x, y);
                            var adjacentCells = 0;
                            var n = 0;
                            for (var L = 0; L <= 8; L = (L + 1) | 0) {
                                if (L === 4 || !CustomizableGameofLife.App.adjacencyRules[System.Array.index(Bridge.identity(n, ((n = (n + 1) | 0))), CustomizableGameofLife.App.adjacencyRules)]) {
                                    continue;
                                }
                                var x_ = (((x.v - 1) | 0) + (L % 3)) | 0, y_ = (((y.v - 1) | 0) + ((Bridge.Int.div(L, 3)) | 0)) | 0;
                                if (CustomizableGameofLife.App.Squares.contains(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x_, y_))) {
                                    adjacentCells = (adjacentCells + 1) | 0;
                                } else {
                                    if (CustomizableGameofLife.App.deadRules[System.Array.index(CustomizableGameofLife.App.NumberOfAdjacentCells(x_, y_), CustomizableGameofLife.App.deadRules)]) {
                                        adding.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x_, y_));
                                    }
                                }
                            }

                            if (!CustomizableGameofLife.App.livingRules[System.Array.index(adjacentCells, CustomizableGameofLife.App.livingRules)]) {
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
                            CustomizableGameofLife.App.Squares.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(x2.v, y2.v));
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
                            var _d7 = $t.Current.$clone();
                            var x = { };
                            var y = { };
                            Bridge.Deconstruct(_d7.$clone(), x, y);
                            var drawX = (((x.v + (((Bridge.Int.div(offsetX.v, CustomizableGameofLife.App.xMultiplier)) | 0))) | 0) + 1) | 0, drawY = (((y.v + (((Bridge.Int.div(offsetY.v, CustomizableGameofLife.App.yMultiplier)) | 0))) | 0) + 1) | 0;
                            if (drawX < 0 || drawX >= ((CustomizableGameofLife.App.width + 2) | 0) || drawY < 0 || drawY >= ((CustomizableGameofLife.App.height + 2) | 0)) {
                                continue;
                            }
                            var idx = (drawX + Bridge.Int.mul(drawY, (((CustomizableGameofLife.App.width + 2) | 0)))) | 0;
                            imageDataArray[((Bridge.Int.mul(idx, 4) + 3) | 0)] = 255;
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
     * @class CustomizableGameofLife.Square
     */
    Bridge.define("CustomizableGameofLife.Square", {
        fields: {
            IsCell: false,
            IsWall: false
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDdXN0b21pemFibGVHYW1lb2ZMaWZlLmpzIiwKICAic291cmNlUm9vdCI6ICIiLAogICJzb3VyY2VzIjogWyJDbGFzczEuY3MiLCJFeHRlbnNpb25zLmNzIiwiTm90YWJsZU9iamVjdHNMaXN0LmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7OztZQXVTQUEsd0JBQWlFQTtZQUNyREEscUJBQXdCQTtZQUNwQ0E7WUFBcUJBLElBQUlBLENBQUNBLEtBQUlBLDhDQUE2QkE7Z0JBRTNDQTtvQkFFSUEsZUFBbUJBLFdBQVdBO29CQUM5QkEsSUFBSUEsa0JBQWtCQTt3QkFFbEJBLElBQUlBLEFBQXFDQTs0QkFDckNBLHlDQUFjQSw4Q0FBc0NBLGVBQWVBLHVCQUF2QkE7O3dCQUNoREEsSUFBSUEsQUFBcUNBOzRCQUNyQ0EsdUNBQVlBLDhDQUFzQ0EsZUFBZUEscUJBQXZCQTs7d0JBQzlDQSxJQUFJQSxBQUFxQ0E7NEJBQ3JDQSw0Q0FBaUJBLDhDQUFzQ0EsZUFBZUEsMEJBQXZCQTs7Ozs7OztZQUsvREE7WUFDQUEsMEJBQTBCQTtZQUMxQkE7WUFDQUEsMEJBQTBCQTtZQUMxQkEsMEJBQTBCQTs7WUFFMUJBLDBCQUF1Q0E7O2dCQUVuQ0E7Z0JBQ0FBLEtBQUtBLFdBQVdBLE9BQU9BO29CQUVuQkEsVUFBMEJBLDZCQUE2REEsOEJBQTBCQTtvQkFDakhBLEtBQUtBLFdBQVdBLE9BQU9BO3dCQUVuQkEsSUFBSUEsV0FBVUE7NEJBRVZBLGdCQUFnQkE7NEJBQ2hCQTs7d0JBRUpBLG1EQUF3QkEsNEVBQTBEQSw2Q0FBaUJBLDZCQUFrRUEsOEJBQStCQSxPQUFtQkEsNkRBQWVBLEdBQWZBO3dCQUN2TkE7Ozs7O1lBS1pBLGlCQUE4QkEsd0RBQzFDQSwwR0FBK0VBLDJEQUMvREEsK0JBQTBCQSw0REFBc0ZBLHNDQUNoSUEsNERBQXNGQSxzQ0FDdEZBLDREQUFzRkE7O1lBSTFFQSxLQUFLQSxZQUFXQSxNQUFLQSw2Q0FBa0JBO2dC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REFDYkEsc0JBQWFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFNYkEsT0FBT0EsTUFBK0JBLDJDQUFvQkE7Ozs7Ozs7Ozs7Ozs7MENDbkgxREEsQUFBb0hBLFVBQUNBOzRCQUFPQSxRQUFRQSxLQUFJQSw4SUFBd0VBLEFBQTBFQSxVQUFDQTtvQ0FFblNBLFFBQVFBLEtBQUlBO29DQUNaQSxRQUFRQSxLQUFJQTtvQ0FDWkEsUUFBUUEsS0FBSUE7b0NBQ1pBLFFBQVFBLEtBQUlBO29DQUNaQSxRQUFRQSxLQUFJQTtvQ0FDWkEsT0FBT0E7a0NBUCtPQSxLQUFJQTs0QkFVekxBLFFBQVFBLEtBQUlBLDhJQUF3RUEsQUFBMEVBLFVBQUNBO29DQUVoT0EsUUFBUUEsS0FBSUE7b0NBQ1pBLFFBQVFBLEtBQUlBO29DQUNaQSxRQUFRQSxLQUFJQTtvQ0FDWkEsUUFBUUEsS0FBSUE7b0NBQ1pBLFFBQVFBLEtBQUlBO29DQUNaQSxPQUFPQTtrQ0FQNEtBLEtBQUlBOzRCQVV0SEEsT0FBT0E7MEJBcEJsQ0EsS0FBSUEiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnM7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uRGlhZ25vc3RpY3MuQ29udHJhY3RzO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlJlZmxlY3Rpb247XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBBcHBcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgY29uc3QgaW50IHhNdWx0aXBsaWVyID0gMjAsIHlNdWx0aXBsaWVyID0gMjA7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgc2NyZWVuV2lkdGggPSBXaW5kb3cuSW5uZXJXaWR0aCwgc2NyZWVuSGVpZ2h0ID0gV2luZG93LklubmVySGVpZ2h0O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IHdpZHRoID0gc2NyZWVuV2lkdGggLyB4TXVsdGlwbGllciwgaGVpZ2h0ID0gc2NyZWVuSGVpZ2h0IC8geU11bHRpcGxpZXI7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgSG90YmFyID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgIFBvc2l0aW9uID0gUG9zaXRpb24uQWJzb2x1dGUsXHJcbiAgICAgICAgICAgICAgICBMZWZ0ID0gXCIxMDBweFwiLFxyXG4gICAgICAgICAgICAgICAgVG9wID0gc3RyaW5nLkZvcm1hdChcInswfXB4XCIsV2luZG93LklubmVySGVpZ2h0IC0gNDApICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBSZXNldChtYWtlQmxhbms6IHRydWUpXHJcbiAgICAgICAgICAgIH0sXCJCbGFua1wiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBSZXNldCgpXHJcbiAgICAgICAgICAgIH0sXCJSZXNldFwiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBHZXRDb29yZGluYXRlcygpXHJcbiAgICAgICAgICAgIH0sXCJHZXQgQ29vcmRpbmF0ZXNcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gU2F2ZUFzU3RhcnRlcigpXHJcbiAgICAgICAgICAgIH0sXCJTYXZlIGFzIFN0YXJ0ZXJcIikpXHJcbixQbGF5QnV0dG9uID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IEludmVydElzUGxheWluZygpXHJcbiAgICAgICAgICAgIH0sXCLilrZcIikpXHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT4gU2hvd01vZGFsKE1vZGFsVHlwZS5TZXR0aW5ncylcclxuICAgICAgICAgICAgfSxcIuKamVwiKSk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgUmlnaHRIb3RiYXIgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFN0eWxlID0ge1xyXG4gICAgICAgICAgICAgICAgUG9zaXRpb24gPSBQb3NpdGlvbi5BYnNvbHV0ZSxcclxuICAgICAgICAgICAgICAgIFJpZ2h0ID0gXCIxMDBweFwiLFxyXG4gICAgICAgICAgICAgICAgVG9wID0gc3RyaW5nLkZvcm1hdChcInswfXB4XCIsV2luZG93LklubmVySGVpZ2h0IC0gNDApICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4taW5mb1wiLFxyXG4gICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT4gU2hvd01vZGFsKE1vZGFsVHlwZS5Ob3RhYmxlT2JqZWN0cylcclxuICAgICAgICAgICAgfSxcIk5vdGFibGUgT2JqZWN0c1wiKSk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBSZXNldCAoYm9vbCBtYWtlQmxhbmsgPSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghR2xvYmFsLkNvbmZpcm0oXCJBbnkgdW5zYXZlZCBjaGFuZ2VzIHdpbGwgYmUgbG9zdC4gQ29udGludWU/XCIpKSByZXR1cm47XHJcbiAgICAgICAgICAgIFNxdWFyZXMuQ2xlYXIoKTtcclxuICAgICAgICAgICAgaWYgKCFtYWtlQmxhbmspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG9mZnNldFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgICAgICBvYmplY3Qgc3RhcnRlclBvc2l0aW9ucyA9IEdsb2JhbC5Mb2NhbFN0b3JhZ2UuR2V0SXRlbShcInN0YXJ0ZXJQb3NpdGlvbnNcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRlclBvc2l0aW9ucyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyBzID0gKHN0cmluZylzdGFydGVyUG9zaXRpb25zO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc3RyaW5nLklzTnVsbE9yRW1wdHkocykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVhY2ggKHZhciBwb3MgaW4gKEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID5bXT4ocykpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU3F1YXJlcy5BZGQocG9zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGxheWluZylcclxuICAgICAgICAgICAgICAgIEludmVydElzUGxheWluZygpO1xyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gR2V0Q29vcmRpbmF0ZXNJbnRlcmFsKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gb2Zmc2V0Q29vcmRzID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihOZWdEaXYob2Zmc2V0UG9zLkl0ZW0xLCB4TXVsdGlwbGllciksIE5lZ0RpdihvZmZzZXRQb3MuSXRlbTIsIHlNdWx0aXBsaWVyKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlRvTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oU3F1YXJlcykuQ29udmVydEFsbDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oKENvbnZlcnRlcjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4pKHMgPT4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihzLkl0ZW0xICsgb2Zmc2V0Q29vcmRzLkl0ZW0xLCBzLkl0ZW0yICsgb2Zmc2V0Q29vcmRzLkl0ZW0yKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+IEdldE5vcm1hbGl6ZWRDb29yZGluYXRlcyAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiBjb29yZHMgPSBHZXRDb29yZGluYXRlc0ludGVyYWwoKTtcclxuICAgICAgICAgICAgY29vcmRzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5XaGVyZTxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oY29vcmRzLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+LGJvb2w+KShjID0+IGMuSXRlbTE+PSAwICYmIGMuSXRlbTI+PSAwICYmIGMuSXRlbTE8IHdpZHRoICYmIGMuSXRlbTI8IGhlaWdodCkpLlRvTGlzdCgpO1xyXG4gICAgICAgICAgICBpbnQgbWluWCA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuTWluPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+Pihjb29yZHMsKEZ1bmM8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4saW50PikoYyA9PiBjLkl0ZW0xKSksIG1pblkgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk1pbjxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oY29vcmRzLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+LGludD4pKGMgPT4gYy5JdGVtMikpO1xyXG4gICAgICAgICAgICBjb29yZHMgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oY29vcmRzLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+LFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PikoYyA9PiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGMuSXRlbTEgLSBtaW5YLCBjLkl0ZW0yIC0gbWluWSkpKS5Ub0xpc3QoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvb3JkcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBHZXRDb29yZGluYXRlcyAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3RyaW5nIGNvZGVHZW5lcmF0ZWQgPSBzdHJpbmcuRm9ybWF0KFwiKG5ldyBIYXNoU2V0PChpbnQgeCwgaW50IHkpPlxcclxcbnt7XFxyXFxuICAgIHswfVxcclxcbn19LCBcXFwiVW50aXRsZWQgT2JqZWN0XFxcIiwgezF9KVwiLHN0cmluZy5Kb2luKFwiLFxcbiAgICBcIiwgU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4sc3RyaW5nPihHZXROb3JtYWxpemVkQ29vcmRpbmF0ZXMoKSwoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixzdHJpbmc+KSh0ID0+IHN0cmluZy5Gb3JtYXQoXCIoezB9LCB7MX0pXCIsdC5JdGVtMSx0Lkl0ZW0yKSkpKSxKU09OLlN0cmluZ2lmeShzdHJpbmcuRm9ybWF0KFwiezB9ezF9IC8gezJ9XCIsKFN5c3RlbS5MaW5xLkVudW1lcmFibGUuQWxsPGJvb2w+KGFkamFjZW5jeVJ1bGVzLChGdW5jPGJvb2wsYm9vbD4pKGEgPT4gYSkpID8gXCJcIiA6IChzdHJpbmcuQ29uY2F0PGludD4oU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8Ym9vbCxpbnQ+KGFkamFjZW5jeVJ1bGVzLChGdW5jPGJvb2wsaW50PikoayA9PiBrID8gMSA6IDApKSkpICsgXCIgLT4gXCIpLHN0cmluZy5Db25jYXQ8aW50PihTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxib29sLGludD4oZGVhZFJ1bGVzLChGdW5jPGJvb2wsaW50PikoayA9PiBrID8gMSA6IDApKSksc3RyaW5nLkNvbmNhdDxpbnQ+KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0PGJvb2wsaW50PihsaXZpbmdSdWxlcywoRnVuYzxib29sLGludD4pKGsgPT4gayA/IDEgOiAwKSkpKSkpO1xyXG4gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCBtb2RhbCwgbW9kYWxDb250ZW50ID0gXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgICAgIG5ldyBIVE1MRGl2RWxlbWVudCB7IENsYXNzTmFtZSA9IFwibW9kYWwtY29udGVudFwiIH1cclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50IHsgQ2xhc3NOYW1lID0gXCJtb2RhbC1kaWFsb2dcIiB9XHJcbixtb2RhbCA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50IHsgQ2xhc3NOYW1lID0gXCJtb2RhbFwiLCBTdHlsZSA9IHsgRGlzcGxheSA9IFwiaW5oZXJpdFwiIH0gfVxyXG4sRG9jdW1lbnQuQm9keSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KFxyXG4gICAgICAgICAgICBtb2RhbENvbnRlbnQsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oXHJcbiAgICAgICAgICAgICAgICBuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcIm1vZGFsLWhlYWRlclwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuLWNsb3NlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+IG1vZGFsLlJlbW92ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4sbmV3IEhUTUxTcGFuRWxlbWVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJbm5lckhUTUwgPSBcIiZ0aW1lcztcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICApLFxyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxQcmVFbGVtZW50PihcclxuXHJcbiAgICAgICAgICAgICAgICBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgSFRNTFByZUVsZW1lbnQoKSwoX28xKT0+e19vMS5DbGFzc05hbWU9IFwibW9kYWwtYm9keVwiO19vMS5TdHlsZVtcInVzZXItc2VsZWN0XCJdPSBcInRleHRcIjtyZXR1cm4gX28xO30pLGNvZGVHZW5lcmF0ZWQpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgU2F2ZUFzU3RhcnRlciAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgR2xvYmFsLkxvY2FsU3RvcmFnZS5TZXRJdGVtKFxyXG4gICAgICAgICAgICAgICAgXCJzdGFydGVyUG9zaXRpb25zXCIsIEpzb25Db252ZXJ0LlNlcmlhbGl6ZU9iamVjdChHZXRDb29yZGluYXRlc0ludGVyYWwoKSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgU2V0dGluZ3NQb3B1cCwgTm90YWJsZU9iamVjdHNQb3B1cDtcclxucHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBDcmVhdGVQb3B1cCgpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTERpdkVsZW1lbnR7U3R5bGUgPSB7Rm9udFNpemUgPSBcIjEuNXJlbVwiLCBCYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCIsIFBvc2l0aW9uID0gUG9zaXRpb24uRml4ZWQsIFRvcCA9IFwiMHB4XCIsIExlZnQgPSBcIjI1JVwiLCBXaWR0aCA9IFwiNTAlXCIsIEhlaWdodCA9IFwiMTAwJVwiLCBEaXNwbGF5ID0gRGlzcGxheS5Ob25lfX07XHJcbn1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IFBvcHVwQ29udGFpbmVyID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IEhUTUxEaXZFbGVtZW50KCksKF9vMSk9PntfbzEuU3R5bGUuUG9zaXRpb249IFBvc2l0aW9uLkZpeGVkO19vMS5TdHlsZS5Ub3A9IFwiMFwiO19vMS5TdHlsZS5MZWZ0PSBcIjBcIjtfbzEuU3R5bGUuV2lkdGg9IFwiMTAwJVwiO19vMS5TdHlsZVtcIngtaW5kZXhcIl09IDk5OTk5OTtfbzEuU3R5bGUuSGVpZ2h0PSBcIjEwMCVcIjtfbzEuU3R5bGUuQmFja2dyb3VuZENvbG9yPSBcInJnYmEoMCwgMCwgMCwgMC41KVwiO19vMS5TdHlsZS5EaXNwbGF5PSBEaXNwbGF5Lk5vbmU7cmV0dXJuIF9vMTt9KVxyXG4sU2V0dGluZ3NQb3B1cCA9IENyZWF0ZVBvcHVwKCkpXHJcbixOb3RhYmxlT2JqZWN0c1BvcHVwID0gQ3JlYXRlUG9wdXAoKSk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTEJ1dHRvbkVsZW1lbnQgU2V0dGluZ3NCdXR0b247XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTEJ1dHRvbkVsZW1lbnQgUGxheUJ1dHRvbjtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEludmVydElzUGxheWluZyAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcGxheWluZyA9ICFwbGF5aW5nO1xyXG4gICAgICAgICAgICBQbGF5QnV0dG9uLklubmVySFRNTCA9IHBsYXlpbmcgPyBcIuKPuFwiIDogXCLilrZcIjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgcGxheWluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2xbXSBsaXZpbmdSdWxlcyAgID0gbmV3IGJvb2xbOV0geyBmYWxzZSwgZmFsc2UsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSB9O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbFtdIGRlYWRSdWxlcyAgICAgPSBuZXcgYm9vbFs5XSB7IGZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSB9O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbFtdIGFkamFjZW5jeVJ1bGVzID0gbmV3IGJvb2xbbWF4QWRqYWNlbnRDZWxsc10geyB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlIH07XHJcbnB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ3JlYXRlQ2FudmFzKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MQ2FudmFzRWxlbWVudHtXaWR0aCA9IHNjcmVlbldpZHRoLCBIZWlnaHQgPSBzY3JlZW5IZWlnaHR9O1xyXG59cHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBDcmVhdGVUb3BDYW52YXMoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxDYW52YXNFbGVtZW50e1dpZHRoID0gd2lkdGggKyAyLCBIZWlnaHQgPSBoZWlnaHQgKyAyfTtcclxufXB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ3JlYXRlQm90dG9tQ2FudmFzKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MQ2FudmFzRWxlbWVudHtXaWR0aCA9IHNjcmVlbldpZHRoICsgMiAqIHhNdWx0aXBsaWVyLCBIZWlnaHQgPSBzY3JlZW5IZWlnaHQgKyAyICogeU11bHRpcGxpZXJ9O1xyXG59XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBET01DYW52YXMgPSBDcmVhdGVDYW52YXMoKSwgQm90dG9tQ2FudmFzID0gQ3JlYXRlQm90dG9tQ2FudmFzKCksIFRvcENhbnZhcyA9IENyZWF0ZVRvcENhbnZhcygpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEXHJcbiAgICAgICAgICAgIFRvcENhbnZhc0NvbnRleHQgPSBUb3BDYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCksXHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQgPSBCb3R0b21DYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCksXHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQgPSBET01DYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiBTcXVhcmVzID0gbmV3IEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4oKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gb2Zmc2V0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IE1vdXNlUG9zICh0aGlzIE1vdXNlRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciByZWN0ID0gRE9NQ2FudmFzLkdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KShlLkNsaWVudFggLSByZWN0LkxlZnQpLCAoaW50KShlLkNsaWVudFkgLSByZWN0LlRvcCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgTmVnRGl2IChpbnQgYSwgaW50IGIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgcmVzID0gYSAvIGI7XHJcbiAgICAgICAgICAgIHJldHVybiAoYSA8IDAgJiYgYSAhPSBiICogcmVzKSA/IHJlcyAtIDEgOiByZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgY29uc3QgaW50IG1heEFkamFjZW50Q2VsbHMgPSA4O1xyXG5cclxuICAgICAgICBzdGF0aWMgTGlzdDxIVE1MSW5wdXRFbGVtZW50PiBhZGphY2VuY3lSdWxlc0NlbGxzID0gbmV3IExpc3Q8SFRNTElucHV0RWxlbWVudD4oKTtcclxuICAgICAgICBzdGF0aWMgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIVE1MSW5wdXRFbGVtZW50LEhUTUxJbnB1dEVsZW1lbnQ+PiBvcHRpb25DZWxscyA9IG5ldyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPEhUTUxJbnB1dEVsZW1lbnQsSFRNTElucHV0RWxlbWVudD4+KCk7XHJcblxyXG4gICAgICAgIHN0YXRpYyB2b2lkIEFwcGx5UHJlc2V0KGJvb2xbXSBsaXZpbmdSdWxlcywgYm9vbFtdIGRlYWRSdWxlcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDw9IDg7IG4rKylcclxuICAgICAgICAgICAge1xyXG5vcHRpb25DZWxsc1tuXS5JdGVtMS5TZXRCb29sVmFsdWUobGl2aW5nUnVsZXNbbl0pO1xyXG5vcHRpb25DZWxsc1tuXS5JdGVtMi5TZXRCb29sVmFsdWUoZGVhZFJ1bGVzW25dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGVudW0gTW9kYWxUeXBlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTZXR0aW5ncyxcclxuICAgICAgICAgICAgTm90YWJsZU9iamVjdHNcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBTaG93TW9kYWwgKE1vZGFsVHlwZSBtb2RhbFR5cGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBQb3B1cENvbnRhaW5lci5TdHlsZS5EaXNwbGF5ID0gXCJcIjtcclxuICAgICAgICAgICAgSFRNTERpdkVsZW1lbnQgdG9TaG93O1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG1vZGFsVHlwZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNb2RhbFR5cGUuU2V0dGluZ3M6XHJcbiAgICAgICAgICAgICAgICAgICAgdG9TaG93ID0gU2V0dGluZ3NQb3B1cDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgTW9kYWxUeXBlLk5vdGFibGVPYmplY3RzOlxyXG4gICAgICAgICAgICAgICAgICAgIHRvU2hvdyA9IE5vdGFibGVPYmplY3RzUG9wdXA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudEV4Y2VwdGlvbigoKGludCltb2RhbFR5cGUpLlRvU3RyaW5nKCksIFwibW9kYWxUeXBlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKEhUTUxEaXZFbGVtZW50IGRpdiBpbiBuZXdbXSB7IFNldHRpbmdzUG9wdXAsIE5vdGFibGVPYmplY3RzUG9wdXAgfSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZGl2LlN0eWxlLkRpc3BsYXkgPSBkaXYgPT0gdG9TaG93ID8gXCJcIiA6IFwibm9uZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgSGlkZU1vZGFsICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBQb3B1cENvbnRhaW5lci5TdHlsZS5EaXNwbGF5ID0gRGlzcGxheS5Ob25lO1xyXG4gICAgICAgICAgICBTZXR0aW5nc1BvcHVwLlN0eWxlLkRpc3BsYXkgPSBEaXNwbGF5Lk5vbmU7XHJcbiAgICAgICAgICAgIE5vdGFibGVPYmplY3RzUG9wdXAuU3R5bGUuRGlzcGxheSA9IERpc3BsYXkuTm9uZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgRHJhd1NoYXBlIChIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+IFNxdWFyZXMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zdCBpbnQgeE11bHRpcGxpZXIgPSBBcHAueE11bHRpcGxpZXIgKiAyO1xyXG4gICAgICAgICAgICBjb25zdCBpbnQgeU11bHRpcGxpZXIgPSBBcHAueU11bHRpcGxpZXIgKiAyO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0dGluZyB3aWR0aCBhbmQgaGVpZ2h0IG9mIHNoYXBlXHJcbiAgICAgICAgICAgIGludCB3aWR0aCA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuTWF4PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PihTcXVhcmVzLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+LGludD4pKHMgPT4gcy5JdGVtMSkpICsgMTtcclxuICAgICAgICAgICAgaW50IGhlaWdodCA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuTWF4PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PihTcXVhcmVzLChGdW5jPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+LGludD4pKHMgPT4gcy5JdGVtMikpICsgMTtcclxuICAgICAgICAgICAgLy8gRHJhd2luZyBvbiBpbm5lciBjYW52YXNcclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgaW5uZXJDYW52YXMgPSBuZXcgSFRNTENhbnZhc0VsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgV2lkdGggPSB3aWR0aCxcclxuICAgICAgICAgICAgICAgIEhlaWdodCA9IGhlaWdodFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgY29udGV4dCA9IGlubmVyQ2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgICAgICBVaW50OENsYW1wZWRBcnJheSBpbWFnZURhdGFBcnJheSA9IENyZWF0ZUltYWdlRGF0YUFycmF5KHdpZHRoLCBoZWlnaHQpO1xyXG5mb3JlYWNoICh2YXIgX2QxIGluIFNxdWFyZXMpXHJcbntcclxuICAgIGludCB4O1xyXG4gICAgaW50IHk7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KF9kMSwgb3V0IHgsIG91dCB5KTtcclxuICAgIGltYWdlRGF0YUFycmF5Wyh4ICsgeSAqIHdpZHRoKSAqIDQgKyAzXSA9IDI1NTtcclxufVxuICAgICAgICAgICAgSW1hZ2VEYXRhIGltYWdlRGF0YSA9IG5ldyBJbWFnZURhdGEoaW1hZ2VEYXRhQXJyYXksICh1aW50KXdpZHRoLCAodWludCloZWlnaHQpO1xyXG4gICAgICAgICAgICBjb250ZXh0LlB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xyXG4gICAgICAgICAgICAvLyBSZXNpemluZyB0byB1cHBlciBjYW52YXNcclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgb3V0ZXJDYW52YXMgPSBuZXcgSFRNTENhbnZhc0VsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgV2lkdGggPSB3aWR0aCAqIHhNdWx0aXBsaWVyLFxyXG4gICAgICAgICAgICAgICAgSGVpZ2h0ID0gaGVpZ2h0ICogeU11bHRpcGxpZXJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIG91dGVyQ29udGV4dCA9IG91dGVyQ2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgICAgICBvdXRlckNvbnRleHQuSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG91dGVyQ29udGV4dC5EcmF3SW1hZ2UoaW5uZXJDYW52YXMsIDAsIDAsIG91dGVyQ2FudmFzLldpZHRoLCBvdXRlckNhbnZhcy5IZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG91dGVyQ2FudmFzO1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBVaW50OENsYW1wZWRBcnJheSBDcmVhdGVJbWFnZURhdGFBcnJheShpbnQgd2lkdGgsIGludCBoZWlnaHQpXHJcbntcclxuICAgIHJldHVybiBuZXcgVWludDhDbGFtcGVkQXJyYXkod2lkdGggKiBoZWlnaHQgKiA0KTtcclxufXB1YmxpYyBzdGF0aWMgSFRNTElucHV0RWxlbWVudCBDcmVhdGVDaGVja2JveCgpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTElucHV0RWxlbWVudHtUeXBlID0gSW5wdXRUeXBlLkNoZWNrYm94LCBTdHlsZSA9IHtXaWR0aCA9IFwiMXJlbVwiLCBIZWlnaHQgPSBcIjFlbVwifX07XHJcbn1wdWJsaWMgc3RhdGljIEhUTUxTZWxlY3RFbGVtZW50IENyZWF0ZTAxU2VsZWN0b3IoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxTZWxlY3RFbGVtZW50KCkuQWRkPEhUTUxTZWxlY3RFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcImZhbHNlXCJ9LFwiMFwiKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCJ0cnVlXCJ9LFwiMVwiKSk7XHJcbn1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbiAoKVxyXG4gICAgICAgIHtcclxuU3lzdGVtLkFjdGlvbjxNb3VzZUV2ZW50PEhUTUxDYW52YXNFbGVtZW50Pj4gUHJvY2Vzc01vdXNlRXZlbnQgPSBudWxsO1xuICAgICAgICAgICAgb2JqZWN0IHJ1bGVzT2JqZWN0U3RyID0gR2xvYmFsLkxvY2FsU3RvcmFnZS5HZXRJdGVtKFwicnVsZXNcIik7XHJcbnN0cmluZyByOyAgICAgICAgICAgIGlmICgociA9IHJ1bGVzT2JqZWN0U3RyIGFzIHN0cmluZykgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pYyBydWxlc09iaiA9IEpTT04uUGFyc2Uocik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bGVzT2JqZWN0U3RyICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoU2NyaXB0LldyaXRlKFwiezB9IGluc3RhbmNlb2YgQXJyYXlcIiwgcnVsZXNPYmoubGl2aW5nUnVsZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGl2aW5nUnVsZXMgPSBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxib29sW10+KEpTT04uU3RyaW5naWZ5KHJ1bGVzT2JqLmxpdmluZ1J1bGVzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTY3JpcHQuV3JpdGUoXCJ7MH0gaW5zdGFuY2VvZiBBcnJheVwiLCBydWxlc09iai5kZWFkUnVsZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVhZFJ1bGVzID0gSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8Ym9vbFtdPihKU09OLlN0cmluZ2lmeShydWxlc09iai5kZWFkUnVsZXMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFNjcmlwdC5Xcml0ZShcInswfSBpbnN0YW5jZW9mIEFycmF5XCIsIHJ1bGVzT2JqLmFkamFjZW5jeVJ1bGVzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzID0gSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8Ym9vbFtdPihKU09OLlN0cmluZ2lmeShydWxlc09iai5hZGphY2VuY3lSdWxlcykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIHsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuU3R5bGVbXCJ1c2VyLXNlbGVjdFwiXSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5IZWFkLkFwcGVuZENoaWxkKG5ldyBIVE1MTGlua0VsZW1lbnQgeyBSZWwgPSBcInN0eWxlc2hlZXRcIiwgSHJlZiA9IFwiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9ib290c3RyYXBANS4yLjAvZGlzdC9jc3MvYm9vdHN0cmFwLm1pbi5jc3NcIiB9KTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5TdHlsZS5NYXJnaW4gPSBcIjBweFwiO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKFBvcHVwQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChuZXcgSFRNTFN0eWxlRWxlbWVudCB7IElubmVySFRNTCA9IFwidGQsIHRoIHsgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7IHBhZGRpbmc6IDVweCB9IGJ1dHRvbiB7IG1hcmdpbi1yaWdodDogNXB4IH1cIiB9KTtcclxuXHJcbiAgICAgICAgICAgIEhUTUxUYWJsZUVsZW1lbnQgYWRqYWNlbmN5UnVsZXNUYWJsZSA9IG5ldyBIVE1MVGFibGVFbGVtZW50IHsgU3R5bGUgPSB7IE1hcmdpbkxlZnQgPSBcImF1dG9cIiwgTWFyZ2luUmlnaHQgPSBcImF1dG9cIiB9IH07XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGludCBuID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAoaW50IHkgPSAwOyB5IDwgMzsgeSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEhUTUxUYWJsZVJvd0VsZW1lbnQgcm93ID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KG5ldyBIVE1MVGFibGVSb3dFbGVtZW50KCksYWRqYWNlbmN5UnVsZXNUYWJsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgeCA9IDA7IHggPCAzOyB4KyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeCA9PSAxICYmIHkgPT0gMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LkFwcGVuZENoaWxkKG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlc0NlbGxzLkFkZChDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTElucHV0RWxlbWVudD4oQ3JlYXRlQ2hlY2tib3goKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCkscm93KSkuU2V0Qm9vbFZhbHVlKGFkamFjZW5jeVJ1bGVzW25dKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG4rKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIEhUTUxUYWJsZUVsZW1lbnQgcnVsZXNUYWJsZSA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlRWxlbWVudD4oXHJcbm5ldyBIVE1MVGFibGVFbGVtZW50IHsgU3R5bGUgPSB7IE1hcmdpbkxlZnQgPSBcImF1dG9cIiwgTWFyZ2luUmlnaHQgPSBcImF1dG9cIiB9IH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVSb3dFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVSb3dFbGVtZW50KCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQoKSxcIiNcIiksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50KCksXCJMXCIpLFxyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudCgpLFwiRFwiKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPD0gbWF4QWRqYWNlbnRDZWxsczsgbisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIVE1MVGFibGVSb3dFbGVtZW50IHJvdyA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVSb3dFbGVtZW50PihuZXcgSFRNTFRhYmxlUm93RWxlbWVudCgpLHJ1bGVzVGFibGUpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KCAgICAgICAgICAgICAgICByb3csQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSxuLlRvU3RyaW5nKCkpKTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbkNlbGxzLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8SFRNTElucHV0RWxlbWVudCwgSFRNTElucHV0RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxJbnB1dEVsZW1lbnQ+KENyZWF0ZUNoZWNrYm94KCksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSwgcm93KSkuU2V0Qm9vbFZhbHVlKGxpdmluZ1J1bGVzW25dKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxJbnB1dEVsZW1lbnQ+KENyZWF0ZUNoZWNrYm94KCksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSwgcm93KSkuU2V0Qm9vbFZhbHVlKGRlYWRSdWxlc1tuXSkpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcgLGJvb2xbXSAsYm9vbFtdID4+IHByZXNldHNMaXN0ID0gZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nICxib29sW10gLGJvb2xbXSA+PigpLChfbzEpPT57X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJDb253YXkncyBHYW1lIG9mIExpZmUgUHJlc2V0XCIsIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO19vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZywgYm9vbFtdLCBib29sW10+KFwiSW1tb3J0YWwgQ2VsbHMgUHJlc2V0XCIsIG5ldyBib29sWzlde3RydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWV9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9KSk7X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJBbG1vc3QgSW1tb3J0YWwgQ2VsbHMgUHJlc2V0XCIsIG5ldyBib29sWzlde3RydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIGZhbHNlfSwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO19vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZywgYm9vbFtdLCBib29sW10+KFwiQWx0ZXJuYXRlIENvbndheSdzIEdhbWUgb2YgTGlmZSBQcmVzZXRcIiwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0pKTtyZXR1cm4gX28xO30pO1xyXG5cclxuICAgICAgICAgICAgSFRNTERpdkVsZW1lbnQgcHJlc2V0c0RpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCB7IFN0eWxlID0geyBUZXh0QWxpZ24gPSBUZXh0QWxpZ24uQ2VudGVyIH0gfTtcclxuZm9yZWFjaCAodmFyIF9kMiBpbiBwcmVzZXRzTGlzdClcclxue1xyXG4gICAgc3RyaW5nIG5hbWU7XHJcbiAgICBib29sW10gbGl2aW5nUnVsZXM7XHJcbiAgICBib29sW10gZGVhZFJ1bGVzO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDIsIG91dCBuYW1lLCBvdXQgbGl2aW5nUnVsZXMsIG91dCBkZWFkUnVsZXMpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgcHJlc2V0c0RpdixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnQoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxBbmNob3JFbGVtZW50PihuZXcgSFRNTEFuY2hvckVsZW1lbnR7SHJlZiA9IFwiamF2YXNjcmlwdDp2b2lkKDApXCIsIFN0eWxlID0ge0ZvbnRTaXplID0gXCIxcmVtXCJ9LCBPbkNsaWNrID0gZSA9PiBBcHBseVByZXNldChsaXZpbmdSdWxlczogbGl2aW5nUnVsZXMsIGRlYWRSdWxlczogZGVhZFJ1bGVzKX0sbmFtZSkpKTtcclxufVxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oXHJcblxyXG4gICAgICAgICAgICBTZXR0aW5nc1BvcHVwLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERldGFpbHNFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MRGV0YWlsc0VsZW1lbnQgeyBPcGVuID0gdHJ1ZX0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MU3VtbWFyeUVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxTdW1tYXJ5RWxlbWVudCgpLFwiQWRqYWNlbmN5IFJ1bGVzXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzVGFibGVcclxuICAgICAgICAgICAgICAgICksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERldGFpbHNFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MRGV0YWlsc0VsZW1lbnQgeyBPcGVuID0gdHJ1ZSB9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFN1bW1hcnlFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MU3VtbWFyeUVsZW1lbnQoKSxcIlJ1bGVzXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzVGFibGVcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxuZXcgSFRNTEJSRWxlbWVudCgpLCBwcmVzZXRzRGl2LCBuZXcgSFRNTEJSRWxlbWVudCgpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIixcclxuICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPCBtYXhBZGphY2VudENlbGxzOyBuKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGphY2VuY3lSdWxlc1tuXSA9IGFkamFjZW5jeVJ1bGVzQ2VsbHNbbl0uQm9vbFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDw9IG1heEFkamFjZW50Q2VsbHM7IG4rKylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpdmluZ1J1bGVzW25dID0gb3B0aW9uQ2VsbHNbbl0uSXRlbTEuQm9vbFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYWRSdWxlc1tuXSA9IG9wdGlvbkNlbGxzW25dLkl0ZW0yLkJvb2xWYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBHbG9iYWwuTG9jYWxTdG9yYWdlLlNldEl0ZW0oXCJydWxlc1wiLCBKc29uQ29udmVydC5TZXJpYWxpemVPYmplY3QobmV3XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXZpbmdSdWxlcyA9IGxpdmluZ1J1bGVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWFkUnVsZXMgPSBkZWFkUnVsZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkamFjZW5jeVJ1bGVzID0gYWRqYWNlbmN5UnVsZXNcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgSGlkZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXCJTYXZlIENoYW5nZXNcIikpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihcclxuICAgICAgICAgICAgTm90YWJsZU9iamVjdHNQb3B1cCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLWxpZ2h0XCIsXHJcbiAgICAgICAgICAgICAgICBTdHlsZSA9IHsgQ3NzRmxvYXQgPSBGbG9hdC5SaWdodCB9LFxyXG4gICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT4gSGlkZU1vZGFsKClcclxuICAgICAgICAgICAgfSxcIuKdjFwiKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIE5vdGFibGVPYmplY3RzUG9wdXAsbmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFN0eWxlID0geyBDbGVhciA9IENsZWFyLkJvdGggfVxyXG4gICAgICAgICAgICB9KTtcclxuZm9yZWFjaCAodmFyIF9kMyBpbiBOb3RhYmxlT2JqZWN0c0xpc3QuTm90YWJsZU9iamVjdHMpXHJcbntcclxuICAgIEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PiBvYmplY3REZXRhaWxzO1xyXG4gICAgc3RyaW5nIGRlc2NyaXB0aW9uO1xyXG4gICAgc3RyaW5nIHJ1bGVzO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDMsIG91dCBvYmplY3REZXRhaWxzLCBvdXQgZGVzY3JpcHRpb24sIG91dCBydWxlcyk7XHJcbiAgICBIVE1MRGl2RWxlbWVudCBvYmplY3RJbmZvID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnR7U3R5bGUgPSB7V2lkdGggPSBcIjMwcmVtXCJ9fSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudHtTdHlsZSA9IHtEaXNwbGF5ID0gRGlzcGxheS5GbGV4LCBBbGlnbkl0ZW1zID0gQWxpZ25JdGVtcy5DZW50ZXIsIEZsZXhEaXJlY3Rpb24gPSBGbGV4RGlyZWN0aW9uLkNvbHVtbn19LE5vdGFibGVPYmplY3RzUG9wdXApKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50e1N0eWxlID0ge0Rpc3BsYXkgPSBEaXNwbGF5LkZsZXgsIEFsaWduSXRlbXMgPSBBbGlnbkl0ZW1zLkNlbnRlciwgRmxleERpcmVjdGlvbiA9IEZsZXhEaXJlY3Rpb24uQ29sdW1ufX0sRHJhd1NoYXBlKG9iamVjdERldGFpbHMpKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCgpLGRlc2NyaXB0aW9uKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLHJ1bGVzKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sbmV3IEhUTUxCUkVsZW1lbnQoKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLG5ldyBIVE1MQlJFbGVtZW50KCkpO1xyXG59XG5cclxuICAgICAgICAgICAgSFRNTERpdkVsZW1lbnQgYmFja2dyb3VuZERpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCB7IFN0eWxlID0geyBQb3NpdGlvbiA9IFBvc2l0aW9uLlJlbGF0aXZlLCBNaW5XaWR0aCA9IFwiMFwiLCBNaW5IZWlnaHQgPSBcIjBcIiB9fTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLk92ZXJmbG93ID0gT3ZlcmZsb3cuSGlkZGVuO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuWkluZGV4ID0gXCItMVwiO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuUG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5MZWZ0ID0gXCIwcHhcIjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLlRvcCA9IFwiMHB4XCI7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIGJhY2tncm91bmREaXYsRE9NQ2FudmFzKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgYmFja2dyb3VuZERpdixIb3RiYXIpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBiYWNrZ3JvdW5kRGl2LFJpZ2h0SG90YmFyKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChiYWNrZ3JvdW5kRGl2KTtcclxuXHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuU3Ryb2tlU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuVHJhbnNsYXRlKDAuNSwgMC41KTtcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5MaW5lV2lkdGggPSAxO1xyXG4gICAgICAgICAgICBmb3IgKGludCB4ID0gMDsgeCA8PSAod2lkdGggKyAyKTsgeCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbyh4ICogeE11bHRpcGxpZXIsIDApO1xyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5MaW5lVG8oeCAqIHhNdWx0aXBsaWVyLCAoaGVpZ2h0ICsgMykgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChpbnQgeSA9IDA7IHkgPD0gKGhlaWdodCArIDIpOyB5KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTW92ZVRvKDAsIHkgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVUbygod2lkdGggKyAzKSAqIHhNdWx0aXBsaWVyLCB5ICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDwgMTA7IG4rKylcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuU3Ryb2tlKCk7XHJcblxyXG4gICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IGRyYWdnaW5nUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBvcmlnaW5hbFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgIGJvb2wgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBET01DYW52YXMuT25Nb3VzZURvd24gPSBlID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gdHJ1ZTtcclxuaW50IHg7XG5pbnQgeTtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoZS5Nb3VzZVBvcygpLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmdQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHggLSBvZmZzZXRQb3MuSXRlbTEsIHkgLSBvZmZzZXRQb3MuSXRlbTIpO1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxQb3MgPSBvZmZzZXRQb3M7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5Pbk1vdXNlVXAgPSBlID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTEtIG9yaWdpbmFsUG9zLkl0ZW0xKSA+IHhNdWx0aXBsaWVyIHx8IE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMi0gb3JpZ2luYWxQb3MuSXRlbTIpID4geU11bHRpcGxpZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nUG9zID0gb2Zmc2V0UG9zO1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBET01DYW52YXMuT25Nb3VzZU1vdmUgPSBlID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICgoZS5CdXR0b25zICYgMSkgPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRyYWdnaW5nUG9zID09IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCkpIGRyYWdnaW5nUG9zID0gZS5Nb3VzZVBvcygpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vdXNlUG9zID0gZS5Nb3VzZVBvcygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMS0gb3JpZ2luYWxQb3MuSXRlbTEpID4geE11bHRpcGxpZXIgfHwgTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0xLSBvcmlnaW5hbFBvcy5JdGVtMSkgPiB5TXVsdGlwbGllcilcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pihtb3VzZVBvcy5JdGVtMSAtIGRyYWdnaW5nUG9zLkl0ZW0xLCBtb3VzZVBvcy5JdGVtMiAtIGRyYWdnaW5nUG9zLkl0ZW0yKTtcclxuICAgICAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICAgICAgfTtcclxuUHJvY2Vzc01vdXNlRXZlbnQgPSAoZSkgPT5cclxue1xyXG4gICAgLy9pZiAoKEBldmVudC5CdXR0b25zICYgMSkgPT0gMCkgcmV0dXJuO1xyXG4gICAgdmFyIG1vdXNlUG9zID0gZS5Nb3VzZVBvcygpO1xyXG4gICAgaW50IGNsaWNrWDtcclxuICAgIGludCBjbGlja1k7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oTmVnRGl2KG1vdXNlUG9zLkl0ZW0xIC0gb2Zmc2V0UG9zLkl0ZW0xLCB4TXVsdGlwbGllciksIE5lZ0RpdigobW91c2VQb3MuSXRlbTIgLSBvZmZzZXRQb3MuSXRlbTIpLCB5TXVsdGlwbGllcikpLCBvdXQgY2xpY2tYLCBvdXQgY2xpY2tZKTtcclxuICAgIGlmICghU3F1YXJlcy5SZW1vdmUobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihjbGlja1gsIGNsaWNrWSkpKVxyXG4gICAgICAgIFNxdWFyZXMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oY2xpY2tYLCBjbGlja1kpKTtcclxuICAgIERyYXcoKTtcclxufVxyXG5cclxuO1xuICAgICAgICAgICAgRE9NQ2FudmFzLk9uQ2xpY2sgPSBlID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGFuZ2luZ0ludGVudClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBQcm9jZXNzTW91c2VFdmVudChlKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgR2xvYmFsLlNldEludGVydmFsKChBY3Rpb24pTmV4dEZyYW1lLCAxMDApO1xyXG5cclxuICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBib29sIHVwZGF0aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IE51bWJlck9mQWRqYWNlbnRDZWxscyAoaW50IHgsIGludCB5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IGFkamFjZW50Q2VsbHMgPSAwO1xyXG4gICAgICAgICAgICBpbnQgbiA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoaW50IEwgPSAwOyBMIDw9IDg7IEwrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKEwgPT0gNCB8fCAhYWRqYWNlbmN5UnVsZXNbbisrXSlcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnQgeF8gPSB4IC0gMSArIChMICUgMyksXHJcbiAgICAgICAgICAgICAgICAgICAgeV8gPSB5IC0gMSArIEwgLyAzO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vaWYgKHhfIDwgMCB8fCB4XyA+PSB3aWR0aCB8fCB5XyA8IDAgfHwgeV8gPj0gaGVpZ2h0KSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoU3F1YXJlcy5Db250YWlucyhuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHhfLCB5XykpKVxyXG4gICAgICAgICAgICAgICAgICAgIGFkamFjZW50Q2VsbHMrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYWRqYWNlbnRDZWxscztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy91cGRhdGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PiByZW1vdmluZyA9IG5ldyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PigpO1xyXG4gICAgICAgICAgICBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PiBhZGRpbmcgPSBuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oKTtcclxuZm9yZWFjaCAodmFyIF9kNCBpbiBTcXVhcmVzKVxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDQsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpbnQgYWRqYWNlbnRDZWxscyA9IDA7XHJcbiAgICBpbnQgbiA9IDA7XHJcbiAgICBmb3IgKGludCBMID0gMDsgTCA8PSA4OyBMKyspXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKEwgPT0gNCB8fCAhYWRqYWNlbmN5UnVsZXNbbisrXSlcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgaW50IHhfID0geCAtIDEgKyAoTCAlIDMpLCB5XyA9IHkgLSAxICsgTCAvIDM7XHJcbiAgICAgICAgaWYgKFNxdWFyZXMuQ29udGFpbnMobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4XywgeV8pKSlcclxuICAgICAgICAgICAgYWRqYWNlbnRDZWxscysrO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBuZXcgY2VsbHMuXHJcbiAgICAgICAgICAgIC8vIE9wdGltaXphdGlvbiBmb3IgcnVsZSBvZiAzIGFkamFjZW50IGNlbGxzXHJcbiAgICAgICAgICAgIC8vaWYgKEwgIT0gNyAmJiBMICE9IDgpXHJcbiAgICAgICAgICAgIC8ve1xyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgaWYgKGRlYWRSdWxlc1tOdW1iZXJPZkFkamFjZW50Q2VsbHMoeF8sIHlfKV0pXHJcbiAgICAgICAgICAgICAgICBhZGRpbmcuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeF8sIHlfKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghbGl2aW5nUnVsZXNbYWRqYWNlbnRDZWxsc10pXHJcbiAgICAgICAgcmVtb3ZpbmcuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSkpO1xyXG59XG5mb3JlYWNoICh2YXIgX2Q1IGluIHJlbW92aW5nKVxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDUsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpZiAoIVNxdWFyZXMuUmVtb3ZlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSkpKVxyXG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJTcXVhcmUgdHJpZWQgdG8gYmUgcmVtb3ZlZCBidXQgZGlkbid0IGV4aXN0XCIpO1xyXG59XG5mb3JlYWNoICh2YXIgX2Q2IGluIGFkZGluZylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2Q2LCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgU3F1YXJlcy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4LCB5KSk7XHJcbn1cbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgRHJhdyAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5DbGVhclJlY3QoMCwgMCwgRE9NQ2FudmFzLldpZHRoLCBET01DYW52YXMuSGVpZ2h0KTtcclxuICAgICAgICAgICAgVG9wQ2FudmFzQ29udGV4dC5DbGVhclJlY3QoMCwgMCwgRE9NQ2FudmFzLldpZHRoLCBET01DYW52YXMuSGVpZ2h0KTtcclxuaW50IG9mZnNldFg7XG5pbnQgb2Zmc2V0WTtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3Qob2Zmc2V0UG9zLCBvdXQgb2Zmc2V0WCwgb3V0IG9mZnNldFkpO1xyXG4gICAgICAgICAgICBVaW50OENsYW1wZWRBcnJheSBpbWFnZURhdGFBcnJheSA9IENyZWF0ZUltYWdlRGF0YUFycmF5KHdpZHRoICsgMiwgaGVpZ2h0ICsgMik7XHJcbmZvcmVhY2ggKHZhciBfZDcgaW4gU3F1YXJlcylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2Q3LCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaW50IGRyYXdYID0geCArIChvZmZzZXRYIC8geE11bHRpcGxpZXIpICsgMSwgZHJhd1kgPSB5ICsgKG9mZnNldFkgLyB5TXVsdGlwbGllcikgKyAxO1xyXG4gICAgaWYgKGRyYXdYIDwgMCB8fCBkcmF3WCA+PSB3aWR0aCArIDIgfHwgZHJhd1kgPCAwIHx8IGRyYXdZID49IGhlaWdodCArIDIpXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICBpbnQgaWR4ID0gZHJhd1ggKyBkcmF3WSAqICh3aWR0aCArIDIpO1xyXG4gICAgaW1hZ2VEYXRhQXJyYXlbaWR4ICogNCArIDNdID0gMjU1O1xyXG59XG4gICAgICAgICAgICBJbWFnZURhdGEgaW1hZ2VEYXRhID0gbmV3IEltYWdlRGF0YShpbWFnZURhdGFBcnJheSwgKHVpbnQpKHdpZHRoICsgMiksICh1aW50KShoZWlnaHQgKyAyKSk7XHJcbiAgICAgICAgICAgIFRvcENhbnZhc0NvbnRleHQuUHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0ltYWdlKEJvdHRvbUNhbnZhcywgb2Zmc2V0WCAlIHhNdWx0aXBsaWVyIC0geE11bHRpcGxpZXIsIG9mZnNldFkgJSB5TXVsdGlwbGllciAtIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5JbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5EcmF3SW1hZ2UoVG9wQ2FudmFzLCAob2Zmc2V0WCAlIHhNdWx0aXBsaWVyKSAtIHhNdWx0aXBsaWVyLCAob2Zmc2V0WSAlIHlNdWx0aXBsaWVyKSAtIHlNdWx0aXBsaWVyLCAod2lkdGggKyAyKSAqIHhNdWx0aXBsaWVyLCAoaGVpZ2h0ICsgMikgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBmcmFtZU51bSA9IDA7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBOZXh0RnJhbWUgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghcGxheWluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgYm9vbCBza2lwRnJhbWVzID0gU3F1YXJlcy5Db3VudCA+PSAyNTA7XHJcbiAgICAgICAgICAgIGludCB1cGRhdGVzUGVyRHJhdyA9IDE7Ly8gc2tpcEZyYW1lcyA/IDIgOiAxO1xyXG4gICAgICAgICAgICBmcmFtZU51bSsrO1xyXG4gICAgICAgICAgICBpZiAoc2tpcEZyYW1lcyAmJiAoZnJhbWVOdW0gJSB1cGRhdGVzUGVyRHJhdykgIT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPCB1cGRhdGVzUGVyRHJhdzsgbisrKVxyXG4gICAgICAgICAgICAgICAgVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRleHQuUmVndWxhckV4cHJlc3Npb25zO1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBFeHRlbnNpb25zXHJcbiAgICB7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKChlLCBjKSA9PiBjLmFwcGVuZENoaWxkKGUpKSh7ZWxlbWVudH0sIHtjb250YWluaW5nRWxlbX0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgQWRkVG88VD4odGhpcyBUIGVsZW1lbnQsIE5vZGUgY29udGFpbmluZ0VsZW0pIHdoZXJlIFQgOiBOb2RlO1xyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBUIEFkZFRvQm9keTxUPih0aGlzIFQgbikgd2hlcmUgVCA6IE5vZGUgPT4gQXBwLnJvb3QuQXBwZW5kQ2hpbGQ8VD4obik7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwie25vZGV9LmFwcGVuZENoaWxkKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBBcHBlbmRDaGlsZDxUPih0aGlzIE5vZGUgbm9kZSwgVCBlbGVtZW50KSB3aGVyZSBUIDogTm9kZTtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIEhpZGU8VD4odGhpcyBUIGVsZW1lbnQpIHdoZXJlIFQgOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zdHlsZS5kaXNwbGF5ID0gJycsIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgU2hvdzxUPih0aGlzIFQgZWxlbWVudCkgd2hlcmUgVCA6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihsaSA9PiAobGkuYXBwZW5kQ2hpbGQoe2VsZW1lbnR9KSwgbGkpKShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MTElFbGVtZW50IFdyYXBMaSh0aGlzIE5vZGUgZWxlbWVudCk7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGRpdiA9PiAoZGl2LmFwcGVuZENoaWxkKHtlbGVtZW50fSksIGRpdikpKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MRGl2RWxlbWVudCBXcmFwRGl2KHRoaXMgTm9kZSBlbGVtZW50KTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFQgQWRkPFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgc3RyaW5nPltdIG5vZGVzKSB3aGVyZSBUIDogTm9kZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoVW5pb248Tm9kZSwgc3RyaW5nPiBub2RlIGluIG5vZGVzKVxyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUuSXM8c3RyaW5nPigpKVxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuQXBwZW5kQ2hpbGQobmV3IFRleHQobm9kZS5BczxzdHJpbmc+KCkpKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LkFwcGVuZENoaWxkKG5vZGUuQXM8Tm9kZT4oKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBUIEFkZEVsZW1lbnQ8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LG5vZGVzKTtcclxufXB1YmxpYyBzdGF0aWMgVCBBZGREaXY8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCgpLG5vZGVzKSk7XHJcbn1wdWJsaWMgc3RhdGljIFQgQWRkVWw8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBVbmlvbjxOb2RlLCBzdHJpbmc+W10sIHN0cmluZz5bXSBub2RlcylcclxuICAgIHdoZXJlIFQgOiBOb2RlXHJcbntcclxuICAgIHJldHVybiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPFQ+KGVsZW1lbnQsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVUxpc3RFbGVtZW50PihuZXcgSFRNTFVMaXN0RWxlbWVudCgpLFN5c3RlbS5BcnJheUV4dGVuc2lvbnMuTWFwPFVuaW9uPE5vZGUsVW5pb248Tm9kZSwgc3RyaW5nPltdLHN0cmluZz4sVW5pb248Tm9kZSxzdHJpbmc+Pihub2RlcywoRnVuYzxVbmlvbjxOb2RlLFVuaW9uPE5vZGUsIHN0cmluZz5bXSxzdHJpbmc+LFVuaW9uPE5vZGUsc3RyaW5nPj4pKG4gPT4gKFVuaW9uPE5vZGUsIHN0cmluZz4pKG4uSXM8VW5pb248Tm9kZSwgc3RyaW5nPltdPigpID8gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MTElFbGVtZW50PihuZXcgSFRNTExJRWxlbWVudCgpLG4uQXM8VW5pb248Tm9kZSwgc3RyaW5nPltdPigpKSA6IG4uSXM8c3RyaW5nPigpID8gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MTElFbGVtZW50PihuZXcgSFRNTExJRWxlbWVudCgpLG4uQXM8c3RyaW5nPigpKSA6IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTExJRWxlbWVudD4obmV3IEhUTUxMSUVsZW1lbnQoKSxuLkFzPE5vZGU+KCkpKSkpKSk7XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBBZGRDYW1lbFNwYWNlKHRoaXMgc3RyaW5nIHN0cilcclxue1xyXG4gICAgcmV0dXJuIFJlZ2V4LlJlcGxhY2UoUmVnZXguUmVwbGFjZShzdHIsIEBcIihbXl9hLXpdKShbXl9hLXpdW2Etel0pXCIsIFwiJDEgJDJcIiksIEBcIihbYS16XSkoW15fYS16XSlcIiwgXCIkMSAkMlwiKTtcclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIFRvQ2FtZWxTdHJpbmc8VD4odGhpcyBUIGUpXHJcbiAgICB3aGVyZSBUIDogc3RydWN0LCBTeXN0ZW0uRW51bVxyXG57XHJcbiAgICByZXR1cm4gZS5Ub1N0cmluZygpLkFkZENhbWVsU3BhY2UoKS5SZXBsYWNlKCdfJywgJyAnKTtcclxufSAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBBZGRFbnVtPFQ+KHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBUPyBkZWZhdWx0VmFsdWUgPSBudWxsLCBzdHJpbmcgZGVmYXVsdFZhbHVlU3RyaW5nID0gXCJcIikgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChkZWZhdWx0VmFsdWUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHNlbGVjdC5BZGQoQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50IHsgVmFsdWUgPSBcIlwiLCBTZWxlY3RlZCA9IHRydWUsIERpc2FibGUgPSB0cnVlIH0sZGVmYXVsdFZhbHVlU3RyaW5nKSk7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFQgdmFsdWUgaW4gU3lzdGVtLkVudW0uR2V0VmFsdWVzKHR5cGVvZihUKSkpXHJcbiAgICAgICAgICAgICAgICBzZWxlY3QuQWRkKEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFZhbHVlID0gKChpbnQpKG9iamVjdCl2YWx1ZSkuVG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBTZWxlY3RlZCA9IG9iamVjdC5FcXVhbHMoZGVmYXVsdFZhbHVlLCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLlRvQ2FtZWxTdHJpbmc8VD4odmFsdWUpKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIGJvb2wgQm9vbFZhbHVlKHRoaXMgSFRNTElucHV0RWxlbWVudCBjaGVja0JveClcclxue1xyXG4gICAgcmV0dXJuIGNoZWNrQm94LkNoZWNrZWQ7XHJcbn1wdWJsaWMgc3RhdGljIGJvb2wgQm9vbFZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0KVxyXG57XHJcbiAgICByZXR1cm4gc2VsZWN0LlZhbHVlID09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlO1xyXG59cHVibGljIHN0YXRpYyBUPyBWYWx1ZTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdClcclxuICAgIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbntcclxuICAgIHJldHVybiBzZWxlY3QuVmFsdWUgPT0gXCJcIiA/IG51bGwgOiAoVD8gKShUKShvYmplY3QpaW50LlBhcnNlKHNlbGVjdC5WYWx1ZSk7XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTElucHV0RWxlbWVudCBTZXRCb29sVmFsdWUodGhpcyBIVE1MSW5wdXRFbGVtZW50IGNoZWNrQm94LCBib29sIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2hlY2tCb3guQ2hlY2tlZCA9IHZhbHVlO1xyXG4gICAgICAgICAgICByZXR1cm4gY2hlY2tCb3g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgU2V0Qm9vbFZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBib29sIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZWN0LlZhbHVlID0gdmFsdWUuVG9TdHJpbmcoKS5Ub0xvd2VyKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgU2V0VmFsdWU8VD4odGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QsIFQgdmFsdWUpIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxlY3QuVmFsdWUgPSAoKGludCkob2JqZWN0KXZhbHVlKS5Ub1N0cmluZygpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBzdHJpbmcgVG9UaW1lU3RyaW5nKHRoaXMgVGltZVNwYW4gdGltZSlcclxue1xyXG4gICAgcmV0dXJuIHRpbWUuVG9TdHJpbmcodGltZSA+PSBUaW1lU3Bhbi5Gcm9tSG91cnMoMSkgPyBAXCJoXFw6bW1cXDpzc1wiIDogQFwibVxcOnNzXCIpO1xyXG59ICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zZXRDdXN0b21WYWxpZGl0eSh7bWVzc2FnZX0pLCBlLnJlcG9ydFZhbGlkaXR5KCksIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgU2V0Q3VzdG9tVmFsaWRpdHk8VD4odGhpcyBUIGVsZW1lbnQsIHN0cmluZyBtZXNzYWdlKSB3aGVyZSBUIDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc2V0QXR0cmlidXRlKCdsaXN0Jywge2RhdGFsaXN0SUR9KSwgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gSFRNTElucHV0RWxlbWVudCBTZXREYXRhTGlzdCh0aGlzIEhUTUxJbnB1dEVsZW1lbnQgZWxlbWVudCwgc3RyaW5nIGRhdGFsaXN0SUQpO1xyXG4gICAgICAgIC8vW1RlbXBsYXRlKFwie2VsZW19LmFwcGVuZENoaWxkKHthZGRpbmd9KVwiKV1cclxuICAgICAgICAvL3B1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgQXBwZW5kPFQ+ICh0aGlzIE5vZGUgZWxlbSwgVCBhZGRpbmcpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFVuaW9uPE5vZGUsIHN0cmluZz5bXSBKb2luQlIodGhpcyBJRW51bWVyYWJsZTxzdHJpbmc+IHN0cmluZ3MpXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uRnVuYzxJRW51bWVyYWJsZTxVbmlvbjxOb2RlLCBzdHJpbmc+Pj4gSW5uZXIgPSBudWxsO1xuICAgICAgICAgICAgXHJcbklubmVyID0gKCkgPT5cclxue1xyXG4gICAgdXNpbmcgKHZhciBlbnVtZXIgPSBzdHJpbmdzLkdldEVudW1lcmF0b3IoKSlcclxuICAgIHtcclxuICAgICAgICBpZiAoIWVudW1lci5Nb3ZlTmV4dCgpKVxyXG4gICAgICAgICAgICB5aWVsZCBicmVhaztcclxuICAgICAgICB5aWVsZCByZXR1cm4gZW51bWVyLkN1cnJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKGVudW1lci5Nb3ZlTmV4dCgpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgeWllbGQgcmV0dXJuIG5ldyBIVE1MQlJFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiBlbnVtZXIuQ3VycmVudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbjtcbiAgICAgICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlRvQXJyYXk8VW5pb248Tm9kZSxzdHJpbmc+PihJbm5lcigpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIE5vdGFibGVPYmplY3RzTGlzdFxyXG4gICAge1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiAsc3RyaW5nICxzdHJpbmcgPj4gTm90YWJsZU9iamVjdHMgPVxyXG4gICAgICAgICAgICBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+ICxzdHJpbmcgLHN0cmluZyA+PigpLChfbzMpPT57X28zLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8SGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+LCBzdHJpbmcsIHN0cmluZz4oZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PigpLCAoX28xKSA9PlxyXG57XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCkpO1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDEsIDApKTtcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigxLCAxKSk7XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMikpO1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDIsIDIpKTtcclxuICAgIHJldHVybiBfbzE7XHJcbn1cclxuXHJcbiksIFwiVHdvIEdlbmVyYXRpb24gTmluZXR5IERlZ3JlZSBSb3RhdG9yXCIsIFwiMDAxMDEwLS0tIC8gMDAwMTAxLS0tXCIpKTtfbzMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pj4sIHN0cmluZywgc3RyaW5nPihnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+KCksIChfbzIpID0+XHJcbntcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKSk7XHJcbiAgICBfbzIuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMSwgMCkpO1xyXG4gICAgX28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDEsIDEpKTtcclxuICAgIF9vMi5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAxKSk7XHJcbiAgICBfbzIuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMikpO1xyXG4gICAgcmV0dXJuIF9vMjtcclxufVxyXG5cclxuKSwgXCJPbmUgR2VuZXJhdGlvbiBOaW5ldHkgRGVncmVlIFJvdGF0b3JcIiwgXCIwMDEwMTAtLS0gLyAwMDAxMDEtLS1cIikpO3JldHVybiBfbzM7fSk7XHJcbiAgICB9XHJcbn0iXQp9Cg==
