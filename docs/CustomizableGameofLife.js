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
            var Create01Selector = null;
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

            var adjacentCellsTable = CustomizableGameofLife.Extensions.Add(HTMLTableElement, ($t = document.createElement("table"), $t.style.marginLeft = "auto", $t.style.marginRight = "auto", $t), [CustomizableGameofLife.Extensions.Add(HTMLTableRowElement, document.createElement("tr"), [CustomizableGameofLife.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["#"]), CustomizableGameofLife.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["L"]), CustomizableGameofLife.Extensions.Add(HTMLTableCellElement, document.createElement("th"), ["D"])])]);


            Create01Selector = function () {
                var $t1;
                return CustomizableGameofLife.Extensions.Add(HTMLSelectElement, document.createElement("select"), [CustomizableGameofLife.Extensions.Add(HTMLOptionElement, ($t1 = document.createElement("option"), $t1.value = "false", $t1), ["0"]), CustomizableGameofLife.Extensions.Add(HTMLOptionElement, ($t1 = document.createElement("option"), $t1.value = "true", $t1), ["1"])]);
            };

            for (var n = 0; n <= CustomizableGameofLife.App.maxAdjacentCells; n = (n + 1) | 0) {
                var row = ((e, c) => c.appendChild(e))(document.createElement("tr"), adjacentCellsTable);
                CustomizableGameofLife.Extensions.Add(HTMLTableRowElement, row, [CustomizableGameofLife.Extensions.Add(HTMLTableCellElement, document.createElement("td"), [Bridge.toString(n)])]);
                CustomizableGameofLife.App.optionCells.add(new (System.ValueTuple$2(HTMLSelectElement,HTMLSelectElement)).$ctor1(CustomizableGameofLife.Extensions.SetBoolValue(((e, c) => c.appendChild(e))(Create01Selector(), ((e, c) => c.appendChild(e))(document.createElement("td"), row)), CustomizableGameofLife.App.livingRules[System.Array.index(n, CustomizableGameofLife.App.livingRules)]), CustomizableGameofLife.Extensions.SetBoolValue(((e, c) => c.appendChild(e))(Create01Selector(), ((e, c) => c.appendChild(e))(document.createElement("td"), row)), CustomizableGameofLife.App.deadRules[System.Array.index(n, CustomizableGameofLife.App.deadRules)])));
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
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [adjacentCellsTable]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [document.createElement("br"), presetsDiv, document.createElement("br")]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t1 = document.createElement("button"), $t1.className = "btn btn-primary", $t1.onclick = function (e) {
                for (var n1 = 0; n1 <= CustomizableGameofLife.App.maxAdjacentCells; n1 = (n1 + 1) | 0) {
                    CustomizableGameofLife.App.livingRules[System.Array.index(n1, CustomizableGameofLife.App.livingRules)] = CustomizableGameofLife.Extensions.BoolValue(CustomizableGameofLife.App.optionCells.getItem(n1).$clone().Item1);
                    CustomizableGameofLife.App.deadRules[System.Array.index(n1, CustomizableGameofLife.App.deadRules)] = CustomizableGameofLife.Extensions.BoolValue(CustomizableGameofLife.App.optionCells.getItem(n1).$clone().Item2);
                }
                Bridge.global.localStorage.setItem("rules", Newtonsoft.Json.JsonConvert.SerializeObject({ livingRules: CustomizableGameofLife.App.livingRules, deadRules: CustomizableGameofLife.App.deadRules }));
                CustomizableGameofLife.App.HideModal();
            }, $t1), ["Save Changes"])]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.NotableObjectsPopup, [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t1 = document.createElement("button"), $t1.style.cssFloat = "right", $t1), ["\u274c"])]);
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


            CustomizableGameofLife.App.Hotbar.appendChild(CustomizableGameofLife.App.PlayButton);

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
            for (var x = 0; x <= (((CustomizableGameofLife.App.width + 2) | 0)); x = (x + 1) | 0) {
                CustomizableGameofLife.App.BottomCanvasContext.moveTo(Bridge.Int.mul(x, CustomizableGameofLife.App.xMultiplier), 0);
                CustomizableGameofLife.App.BottomCanvasContext.lineTo(Bridge.Int.mul(x, CustomizableGameofLife.App.xMultiplier), Bridge.Int.mul((((CustomizableGameofLife.App.height + 3) | 0)), CustomizableGameofLife.App.yMultiplier));
            }
            for (var y = 0; y <= (((CustomizableGameofLife.App.height + 2) | 0)); y = (y + 1) | 0) {
                CustomizableGameofLife.App.BottomCanvasContext.moveTo(0, Bridge.Int.mul(y, CustomizableGameofLife.App.yMultiplier));
                CustomizableGameofLife.App.BottomCanvasContext.lineTo(Bridge.Int.mul((((CustomizableGameofLife.App.width + 3) | 0)), CustomizableGameofLife.App.xMultiplier), Bridge.Int.mul(y, CustomizableGameofLife.App.yMultiplier));
            }
            for (var n1 = 0; n1 < 10; n1 = (n1 + 1) | 0) {
                CustomizableGameofLife.App.BottomCanvasContext.stroke();
            }

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
                DOMCanvas: null,
                BottomCanvas: null,
                TopCanvas: null,
                TopCanvasContext: null,
                BottomCanvasContext: null,
                DOMCanvasContext: null,
                Squares: null,
                offsetPos: null,
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
                    this.Hotbar = CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, ($t = document.createElement("div"), $t.style.position = "absolute", $t.style.left = "100px", $t.style.top = System.String.format("{0}px", [Bridge.box(((window.innerHeight - 40) | 0), System.Int32)]), $t), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.Reset(true);
                    }, $t), ["Blank"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.Reset();
                    }, $t), ["Reset"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.SaveAsStarter();
                    }, $t), ["Save as Starter"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.ShowModal(CustomizableGameofLife.App.ModalType.Settings);
                    }, $t), ["\u2699"])]);
                    this.RightHotbar = CustomizableGameofLife.Extensions.Add(HTMLDivElement, ($t = document.createElement("div"), $t.style.position = "absolute", $t.style.right = "100px", $t.style.top = System.String.format("{0}px", [Bridge.box(((window.innerHeight - 40) | 0), System.Int32)]), $t), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-info", $t.onclick = function (e) {
                        CustomizableGameofLife.App.ShowModal(CustomizableGameofLife.App.ModalType.NotableObjects);
                    }, $t), ["Notable Objects"])]);
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
                        }(document.createElement("div")), [($t = CustomizableGameofLife.App.CreatePopup(), CustomizableGameofLife.App.SettingsPopup = $t, $t)]), [($t1 = CustomizableGameofLife.App.CreatePopup(), CustomizableGameofLife.App.NotableObjectsPopup = $t1, $t1)]);
                    this.PlayButton = ($t2 = document.createElement("button"), $t2.innerHTML = "\u25b6", $t2.style.color = "green", $t2.className = "btn btn-primary", $t2.onclick = function (e) {
                        CustomizableGameofLife.App.InvertIsPlaying();
                    }, $t2);
                    this.playing = false;
                    this.livingRules = System.Array.init([false, false, true, true, false, false, false, false, false], System.Boolean);
                    this.deadRules = System.Array.init([false, false, false, true, false, false, false, false, false], System.Boolean);
                    this.DOMCanvas = CustomizableGameofLife.App.CreateCanvas();
                    this.BottomCanvas = CustomizableGameofLife.App.CreateBottomCanvas();
                    this.TopCanvas = CustomizableGameofLife.App.CreateTopCanvas();
                    this.TopCanvasContext = CustomizableGameofLife.App.TopCanvas.getContext("2d");
                    this.BottomCanvasContext = CustomizableGameofLife.App.BottomCanvas.getContext("2d");
                    this.DOMCanvasContext = CustomizableGameofLife.App.DOMCanvas.getContext("2d");
                    this.Squares = new (System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32))).ctor();
                    this.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0);
                    this.optionCells = new (System.Collections.Generic.List$1(System.ValueTuple$2(HTMLSelectElement,HTMLSelectElement))).ctor();
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
                SaveAsStarter: function () {
                    var $t;
                    var offsetCoords = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(CustomizableGameofLife.App.NegDiv(CustomizableGameofLife.App.offsetPos.Item1, CustomizableGameofLife.App.xMultiplier), CustomizableGameofLife.App.NegDiv(CustomizableGameofLife.App.offsetPos.Item2, CustomizableGameofLife.App.yMultiplier));
                    Bridge.global.localStorage.setItem("starterPositions", Newtonsoft.Json.JsonConvert.SerializeObject(($t = System.ValueTuple$2(System.Int32,System.Int32), System.Linq.Enumerable.from(CustomizableGameofLife.App.Squares, $t).toList($t)).ConvertAll(System.ValueTuple$2(System.Int32,System.Int32), function (s) {
                        return new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(((s.Item1 + offsetCoords.Item1) | 0), ((s.Item2 + offsetCoords.Item2) | 0));
                    })));
                },
                CreatePopup: function () {
                    var $t;
                    return ($t = document.createElement("div"), $t.style.fontSize = "1.5rem", $t.style.backgroundColor = "white", $t.style.position = "fixed", $t.style.top = "0px", $t.style.left = "25%", $t.style.width = "50%", $t.style.height = "100%", $t.style.display = "none", $t);
                },
                InvertIsPlaying: function () {
                    CustomizableGameofLife.App.playing = !CustomizableGameofLife.App.playing;
                    CustomizableGameofLife.App.PlayButton.style.color = CustomizableGameofLife.App.playing ? "red" : "green";
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
                NumberOfAdjacentCells: function (x, y) {
                    var adjacentCells = 0;
                    for (var L = 0; L <= 8; L = (L + 1) | 0) {
                        if (L === 4) {
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
                            for (var L = 0; L <= 8; L = (L + 1) | 0) {
                                if (L === 4) {
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
                BoolValue: function (select) {
                    return Bridge.referenceEquals(select.value, "true") ? true : false;
                },
                Value: function (T, select) {
                    return Bridge.referenceEquals(select.value, "") ? null : Bridge.cast(System.Nullable.getValue(Bridge.cast(Bridge.unbox(Bridge.box(System.Int32.parse(select.value), System.Int32), T), T)), T, true);
                },
                SetBoolValue: function (select, value) {
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
                    this.NotableObjects = function (_o2) {
                            _o2.add(new (System.ValueTuple$3(System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32)),System.String,System.String)).$ctor1(function (_o1) {
                                    _o1.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0));
                                    _o1.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(1, 0));
                                    _o1.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(1, 1));
                                    _o1.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 2));
                                    _o1.add(new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(2, 2));
                                    return _o1;
                                }(new (System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32))).ctor()), "Two Generation Ninety Degree Rotator", "001010--- / 000101---"));
                            return _o2;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDdXN0b21pemFibGVHYW1lb2ZMaWZlLmpzIiwKICAic291cmNlUm9vdCI6ICIiLAogICJzb3VyY2VzIjogWyJDbGFzczEuY3MiLCJFeHRlbnNpb25zLmNzIiwiTm90YWJsZU9iamVjdHNMaXN0LmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7OztZQTRPQUEsd0JBQWlFQTtZQUNqRUEsdUJBQWtEQTtZQUN0Q0EscUJBQXdCQTtZQUNwQ0E7WUFBcUJBLElBQUlBLENBQUNBLEtBQUlBLDhDQUE2QkE7Z0JBRTNDQTtvQkFFSUEsZUFBbUJBLFdBQVdBO29CQUM5QkEsSUFBSUEsa0JBQWtCQTt3QkFFbEJBLElBQUlBLEFBQXFDQTs0QkFDckNBLHlDQUFjQSw4Q0FBc0NBLGVBQWVBLHVCQUF2QkE7O3dCQUNoREEsSUFBSUEsQUFBcUNBOzRCQUNyQ0EsdUNBQVlBLDhDQUFzQ0EsZUFBZUEscUJBQXZCQTs7Ozs7OztZQUsxREE7WUFDQUEsMEJBQTBCQTtZQUMxQkE7WUFDQUEsMEJBQTBCQTtZQUMxQkEsMEJBQTBCQTs7WUFFMUJBLHlCQUFzQ0Esd0RBQ2xEQSwwR0FBK0VBLDJEQUMvREEsK0JBQTBCQSw0REFBc0ZBLHNDQUNoSUEsNERBQXNGQSxzQ0FDdEZBLDREQUFzRkE7OztZQUt0RkEsbUJBQW1CQTs7dUJBQU1BLDRGQUErQ0EseURBQXlEQSw0RUFBOENBLHlEQUF5REE7OztZQUU1TkEsS0FBS0EsV0FBV0EsS0FBS0EsNkNBQWtCQTtnQkFFbkNBLFVBQTBCQSw2QkFBNkRBLDhCQUEwQkE7Z0JBQ2pJQSwyREFBMkVBLE1BQUlBLDREQUFnRUEsK0JBQStCQTtnQkFDOUpBLDJDQUFnQkEsS0FBSUEsaUVBQXdEQSw0RUFBMkRBLG9CQUFvQkEsNkJBQWtFQSw4QkFBZ0NBLE9BQW1CQSwwREFBWUEsR0FBWkEsMkNBQWlCQSw0RUFBMkRBLG9CQUFvQkEsNkJBQWtFQSw4QkFBZ0NBLE9BQW1CQSx3REFBVUEsR0FBVkE7OztZQUd6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QVVBOzt3Q0FDWEEsUUFBK0JBO29CQUV6RUEsZUFBZUE7b0JBQ2ZBLE9BQU9BOztvQ0FFOEJBLEdBQUdBLFFBQStCQTtvQkFFdkVBLGVBQWVBLGdCQUFDQSxxQ0FBS0EsYUFBUUE7b0JBQzdCQSxPQUFPQTs7d0NBRWVBO29CQUU5QkEsT0FBT0EsY0FBY0EsMEJBQVFBOztrQ0FRa0JBOztvQkFFbkRBLFlBQXNEQTs7b0JBRXREQSxRQUFRQTs7Ozs7Ozs7Ozs7Ozs7Z0RBRUdBLFNBQWFBO29EQUNwQkE7Ozs7O2dEQUNJQSxJQUFJQSxDQUFDQTs7Ozs7Ozs7Z0RBQ0RBOzs7Z0RBQ0pBLHNCQUFhQTs7Ozs7Ozs7O3FEQUNOQTs7Ozs7Ozs7Z0RBRUhBLHNCQUFhQTs7Ozs7Z0RBQ2JBLHNCQUFhQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBTWJBLE9BQU9BLE1BQStCQSwyQ0FBb0JBOzs7Ozs7Ozs7Ozs7OzBDQzNHMURBLEFBQW9IQSxVQUFDQTs0QkFBT0EsUUFBUUEsS0FBSUEsOElBQXdFQSxBQUEwRUEsVUFBQ0E7b0NBRW5TQSxRQUFRQSxLQUFJQTtvQ0FDWkEsUUFBUUEsS0FBSUE7b0NBQ1pBLFFBQVFBLEtBQUlBO29DQUNaQSxRQUFRQSxLQUFJQTtvQ0FDWkEsUUFBUUEsS0FBSUE7b0NBQ1pBLE9BQU9BO2tDQVArT0EsS0FBSUE7NEJBVXpMQSxPQUFPQTswQkFWbENBLEtBQUlBIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkRpYWdub3N0aWNzLkNvbnRyYWN0cztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBBcHBcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgY29uc3QgaW50IHhNdWx0aXBsaWVyID0gMjAsIHlNdWx0aXBsaWVyID0gMjA7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgc2NyZWVuV2lkdGggPSBXaW5kb3cuSW5uZXJXaWR0aCwgc2NyZWVuSGVpZ2h0ID0gV2luZG93LklubmVySGVpZ2h0O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IHdpZHRoID0gc2NyZWVuV2lkdGggLyB4TXVsdGlwbGllciwgaGVpZ2h0ID0gc2NyZWVuSGVpZ2h0IC8geU11bHRpcGxpZXI7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgSG90YmFyID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgIFBvc2l0aW9uID0gUG9zaXRpb24uQWJzb2x1dGUsXHJcbiAgICAgICAgICAgICAgICBMZWZ0ID0gXCIxMDBweFwiLFxyXG4gICAgICAgICAgICAgICAgVG9wID0gc3RyaW5nLkZvcm1hdChcInswfXB4XCIsV2luZG93LklubmVySGVpZ2h0IC0gNDApICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBSZXNldChtYWtlQmxhbms6IHRydWUpXHJcbiAgICAgICAgICAgIH0sXCJCbGFua1wiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBSZXNldCgpXHJcbiAgICAgICAgICAgIH0sXCJSZXNldFwiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBTYXZlQXNTdGFydGVyKClcclxuICAgICAgICAgICAgfSxcIlNhdmUgYXMgU3RhcnRlclwiKSlcclxuLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBTaG93TW9kYWwoTW9kYWxUeXBlLlNldHRpbmdzKVxyXG4gICAgICAgICAgICB9LFwi4pqZXCIpKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBSaWdodEhvdGJhciA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU3R5bGUgPSB7XHJcbiAgICAgICAgICAgICAgICBQb3NpdGlvbiA9IFBvc2l0aW9uLkFic29sdXRlLFxyXG4gICAgICAgICAgICAgICAgUmlnaHQgPSBcIjEwMHB4XCIsXHJcbiAgICAgICAgICAgICAgICBUb3AgPSBzdHJpbmcuRm9ybWF0KFwiezB9cHhcIixXaW5kb3cuSW5uZXJIZWlnaHQgLSA0MCkgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1pbmZvXCIsXHJcbiAgICAgICAgICAgICAgICBPbkNsaWNrID0gZSA9PiBTaG93TW9kYWwoTW9kYWxUeXBlLk5vdGFibGVPYmplY3RzKVxyXG4gICAgICAgICAgICB9LFwiTm90YWJsZSBPYmplY3RzXCIpKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFJlc2V0IChib29sIG1ha2VCbGFuayA9IGZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCFHbG9iYWwuQ29uZmlybShcIkFueSB1bnNhdmVkIGNoYW5nZXMgd2lsbCBiZSBsb3N0LiBDb250aW51ZT9cIikpIHJldHVybjtcclxuICAgICAgICAgICAgU3F1YXJlcy5DbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAoIW1ha2VCbGFuaylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgICAgIG9iamVjdCBzdGFydGVyUG9zaXRpb25zID0gR2xvYmFsLkxvY2FsU3RvcmFnZS5HZXRJdGVtKFwic3RhcnRlclBvc2l0aW9uc1wiKTtcclxuICAgICAgICAgICAgICAgIGlmIChzdGFydGVyUG9zaXRpb25zICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nIHMgPSAoc3RyaW5nKXN0YXJ0ZXJQb3NpdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdHJpbmcuSXNOdWxsT3JFbXB0eShzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAodmFyIHBvcyBpbiAoSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPltdPihzKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTcXVhcmVzLkFkZChwb3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwbGF5aW5nKVxyXG4gICAgICAgICAgICAgICAgSW52ZXJ0SXNQbGF5aW5nKCk7XHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBTYXZlQXNTdGFydGVyICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IG9mZnNldENvb3JkcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oTmVnRGl2KG9mZnNldFBvcy5JdGVtMSwgeE11bHRpcGxpZXIpLCBOZWdEaXYob2Zmc2V0UG9zLkl0ZW0yLCB5TXVsdGlwbGllcikpO1xyXG4gICAgICAgICAgICBHbG9iYWwuTG9jYWxTdG9yYWdlLlNldEl0ZW0oXHJcbiAgICAgICAgICAgICAgICBcInN0YXJ0ZXJQb3NpdGlvbnNcIiwgSnNvbkNvbnZlcnQuU2VyaWFsaXplT2JqZWN0KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuVG9MaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PihTcXVhcmVzKS5Db252ZXJ0QWxsPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PigoQ29udmVydGVyPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+LFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PikocyA9PiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHMuSXRlbTEgKyBvZmZzZXRDb29yZHMuSXRlbTEsIHMuSXRlbTIgKyBvZmZzZXRDb29yZHMuSXRlbTIpKSkpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IFNldHRpbmdzUG9wdXAsIE5vdGFibGVPYmplY3RzUG9wdXA7XHJcbnB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgQ3JlYXRlUG9wdXAoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxEaXZFbGVtZW50e1N0eWxlID0ge0ZvbnRTaXplID0gXCIxLjVyZW1cIiwgQmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiLCBQb3NpdGlvbiA9IFBvc2l0aW9uLkZpeGVkLCBUb3AgPSBcIjBweFwiLCBMZWZ0ID0gXCIyNSVcIiwgV2lkdGggPSBcIjUwJVwiLCBIZWlnaHQgPSBcIjEwMCVcIiwgRGlzcGxheSA9IERpc3BsYXkuTm9uZX19O1xyXG59XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBQb3B1cENvbnRhaW5lciA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBIVE1MRGl2RWxlbWVudCgpLChfbzEpPT57X28xLlN0eWxlLlBvc2l0aW9uPSBQb3NpdGlvbi5GaXhlZDtfbzEuU3R5bGUuVG9wPSBcIjBcIjtfbzEuU3R5bGUuTGVmdD0gXCIwXCI7X28xLlN0eWxlLldpZHRoPSBcIjEwMCVcIjtfbzEuU3R5bGVbXCJ4LWluZGV4XCJdPSA5OTk5OTk7X28xLlN0eWxlLkhlaWdodD0gXCIxMDAlXCI7X28xLlN0eWxlLkJhY2tncm91bmRDb2xvcj0gXCJyZ2JhKDAsIDAsIDAsIDAuNSlcIjtfbzEuU3R5bGUuRGlzcGxheT0gRGlzcGxheS5Ob25lO3JldHVybiBfbzE7fSlcclxuLFNldHRpbmdzUG9wdXAgPSBDcmVhdGVQb3B1cCgpKVxyXG4sTm90YWJsZU9iamVjdHNQb3B1cCA9IENyZWF0ZVBvcHVwKCkpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxCdXR0b25FbGVtZW50IFNldHRpbmdzQnV0dG9uO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxCdXR0b25FbGVtZW50IFBsYXlCdXR0b24gPSBuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIElubmVySFRNTCA9IFwi4pa2XCIsXHJcbiAgICAgICAgICAgIFN0eWxlID0geyBDb2xvciA9IFwiZ3JlZW5cIiB9LFxyXG4gICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLCBPbkNsaWNrID0gZSA9PiBJbnZlcnRJc1BsYXlpbmcoKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBJbnZlcnRJc1BsYXlpbmcgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSAhcGxheWluZztcclxuICAgICAgICAgICAgUGxheUJ1dHRvbi5TdHlsZS5Db2xvciA9IHBsYXlpbmcgPyBcInJlZFwiIDogXCJncmVlblwiO1xyXG4gICAgICAgICAgICBQbGF5QnV0dG9uLklubmVySFRNTCA9IHBsYXlpbmcgPyBcIuKPuFwiIDogXCLilrZcIjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgcGxheWluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2xbXSBsaXZpbmdSdWxlcyA9IG5ldyBib29sWzldIHsgZmFsc2UsIGZhbHNlLCB0cnVlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UgfTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2xbXSBkZWFkUnVsZXMgICA9IG5ldyBib29sWzldIHsgZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlIH07XHJcbnB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ3JlYXRlQ2FudmFzKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MQ2FudmFzRWxlbWVudHtXaWR0aCA9IHNjcmVlbldpZHRoLCBIZWlnaHQgPSBzY3JlZW5IZWlnaHR9O1xyXG59cHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBDcmVhdGVUb3BDYW52YXMoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxDYW52YXNFbGVtZW50e1dpZHRoID0gd2lkdGggKyAyLCBIZWlnaHQgPSBoZWlnaHQgKyAyfTtcclxufXB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ3JlYXRlQm90dG9tQ2FudmFzKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MQ2FudmFzRWxlbWVudHtXaWR0aCA9IHNjcmVlbldpZHRoICsgMiAqIHhNdWx0aXBsaWVyLCBIZWlnaHQgPSBzY3JlZW5IZWlnaHQgKyAyICogeU11bHRpcGxpZXJ9O1xyXG59XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBET01DYW52YXMgPSBDcmVhdGVDYW52YXMoKSwgQm90dG9tQ2FudmFzID0gQ3JlYXRlQm90dG9tQ2FudmFzKCksIFRvcENhbnZhcyA9IENyZWF0ZVRvcENhbnZhcygpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEXHJcbiAgICAgICAgICAgIFRvcENhbnZhc0NvbnRleHQgPSBUb3BDYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCksXHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQgPSBCb3R0b21DYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCksXHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQgPSBET01DYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiBTcXVhcmVzID0gbmV3IEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4oKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gb2Zmc2V0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IE1vdXNlUG9zICh0aGlzIE1vdXNlRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciByZWN0ID0gRE9NQ2FudmFzLkdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KShlLkNsaWVudFggLSByZWN0LkxlZnQpLCAoaW50KShlLkNsaWVudFkgLSByZWN0LlRvcCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgTmVnRGl2IChpbnQgYSwgaW50IGIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgcmVzID0gYSAvIGI7XHJcbiAgICAgICAgICAgIHJldHVybiAoYSA8IDAgJiYgYSAhPSBiICogcmVzKSA/IHJlcyAtIDEgOiByZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgY29uc3QgaW50IG1heEFkamFjZW50Q2VsbHMgPSA4O1xyXG5cclxuICAgICAgICBzdGF0aWMgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIVE1MU2VsZWN0RWxlbWVudCxIVE1MU2VsZWN0RWxlbWVudD4+IG9wdGlvbkNlbGxzID0gbmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SFRNTFNlbGVjdEVsZW1lbnQsSFRNTFNlbGVjdEVsZW1lbnQ+PigpO1xyXG5cclxuICAgICAgICBzdGF0aWMgdm9pZCBBcHBseVByZXNldChib29sW10gbGl2aW5nUnVsZXMsIGJvb2xbXSBkZWFkUnVsZXMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8PSA4OyBuKyspXHJcbiAgICAgICAgICAgIHtcclxub3B0aW9uQ2VsbHNbbl0uSXRlbTEuU2V0Qm9vbFZhbHVlKGxpdmluZ1J1bGVzW25dKTtcclxub3B0aW9uQ2VsbHNbbl0uSXRlbTIuU2V0Qm9vbFZhbHVlKGRlYWRSdWxlc1tuXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBlbnVtIE1vZGFsVHlwZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU2V0dGluZ3MsXHJcbiAgICAgICAgICAgIE5vdGFibGVPYmplY3RzXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgU2hvd01vZGFsIChNb2RhbFR5cGUgbW9kYWxUeXBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUG9wdXBDb250YWluZXIuU3R5bGUuRGlzcGxheSA9IFwiXCI7XHJcbiAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IHRvU2hvdztcclxuICAgICAgICAgICAgc3dpdGNoIChtb2RhbFR5cGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgTW9kYWxUeXBlLlNldHRpbmdzOlxyXG4gICAgICAgICAgICAgICAgICAgIHRvU2hvdyA9IFNldHRpbmdzUG9wdXA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1vZGFsVHlwZS5Ob3RhYmxlT2JqZWN0czpcclxuICAgICAgICAgICAgICAgICAgICB0b1Nob3cgPSBOb3RhYmxlT2JqZWN0c1BvcHVwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXJndW1lbnRFeGNlcHRpb24oKChpbnQpbW9kYWxUeXBlKS5Ub1N0cmluZygpLCBcIm1vZGFsVHlwZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3JlYWNoIChIVE1MRGl2RWxlbWVudCBkaXYgaW4gbmV3W10geyBTZXR0aW5nc1BvcHVwLCBOb3RhYmxlT2JqZWN0c1BvcHVwIH0pXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRpdi5TdHlsZS5EaXNwbGF5ID0gZGl2ID09IHRvU2hvdyA/IFwiXCIgOiBcIm5vbmVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEhpZGVNb2RhbCAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgUG9wdXBDb250YWluZXIuU3R5bGUuRGlzcGxheSA9IERpc3BsYXkuTm9uZTtcclxuICAgICAgICAgICAgU2V0dGluZ3NQb3B1cC5TdHlsZS5EaXNwbGF5ID0gRGlzcGxheS5Ob25lO1xyXG4gICAgICAgICAgICBOb3RhYmxlT2JqZWN0c1BvcHVwLlN0eWxlLkRpc3BsYXkgPSBEaXNwbGF5Lk5vbmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IERyYXdTaGFwZSAoSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiBTcXVhcmVzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc3QgaW50IHhNdWx0aXBsaWVyID0gQXBwLnhNdWx0aXBsaWVyICogMjtcclxuICAgICAgICAgICAgY29uc3QgaW50IHlNdWx0aXBsaWVyID0gQXBwLnlNdWx0aXBsaWVyICogMjtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldHRpbmcgd2lkdGggYW5kIGhlaWdodCBvZiBzaGFwZVxyXG4gICAgICAgICAgICBpbnQgd2lkdGggPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk1heDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oU3F1YXJlcywoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixpbnQ+KShzID0+IHMuSXRlbTEpKSArIDE7XHJcbiAgICAgICAgICAgIGludCBoZWlnaHQgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLk1heDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oU3F1YXJlcywoRnVuYzxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50PixpbnQ+KShzID0+IHMuSXRlbTIpKSArIDE7XHJcbiAgICAgICAgICAgIC8vIERyYXdpbmcgb24gaW5uZXIgY2FudmFzXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGlubmVyQ2FudmFzID0gbmV3IEhUTUxDYW52YXNFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFdpZHRoID0gd2lkdGgsXHJcbiAgICAgICAgICAgICAgICBIZWlnaHQgPSBoZWlnaHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGNvbnRleHQgPSBpbm5lckNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgVWludDhDbGFtcGVkQXJyYXkgaW1hZ2VEYXRhQXJyYXkgPSBDcmVhdGVJbWFnZURhdGFBcnJheSh3aWR0aCwgaGVpZ2h0KTtcclxuZm9yZWFjaCAodmFyIF9kMSBpbiBTcXVhcmVzKVxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDEsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpbWFnZURhdGFBcnJheVsoeCArIHkgKiB3aWR0aCkgKiA0ICsgM10gPSAyNTU7XHJcbn1cbiAgICAgICAgICAgIEltYWdlRGF0YSBpbWFnZURhdGEgPSBuZXcgSW1hZ2VEYXRhKGltYWdlRGF0YUFycmF5LCAodWludCl3aWR0aCwgKHVpbnQpaGVpZ2h0KTtcclxuICAgICAgICAgICAgY29udGV4dC5QdXRJbWFnZURhdGEoaW1hZ2VEYXRhLCAwLCAwKTtcclxuICAgICAgICAgICAgLy8gUmVzaXppbmcgdG8gdXBwZXIgY2FudmFzXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IG91dGVyQ2FudmFzID0gbmV3IEhUTUxDYW52YXNFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFdpZHRoID0gd2lkdGggKiB4TXVsdGlwbGllcixcclxuICAgICAgICAgICAgICAgIEhlaWdodCA9IGhlaWdodCAqIHlNdWx0aXBsaWVyXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBvdXRlckNvbnRleHQgPSBvdXRlckNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICAgICAgb3V0ZXJDb250ZXh0LkltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBvdXRlckNvbnRleHQuRHJhd0ltYWdlKGlubmVyQ2FudmFzLCAwLCAwLCBvdXRlckNhbnZhcy5XaWR0aCwgb3V0ZXJDYW52YXMuSGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBvdXRlckNhbnZhcztcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgVWludDhDbGFtcGVkQXJyYXkgQ3JlYXRlSW1hZ2VEYXRhQXJyYXkoaW50IHdpZHRoLCBpbnQgaGVpZ2h0KVxyXG57XHJcbiAgICByZXR1cm4gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KHdpZHRoICogaGVpZ2h0ICogNCk7XHJcbn1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbiAoKVxyXG4gICAgICAgIHtcclxuU3lzdGVtLkFjdGlvbjxNb3VzZUV2ZW50PEhUTUxDYW52YXNFbGVtZW50Pj4gUHJvY2Vzc01vdXNlRXZlbnQgPSBudWxsO1xuU3lzdGVtLkZ1bmM8SFRNTFNlbGVjdEVsZW1lbnQ+IENyZWF0ZTAxU2VsZWN0b3IgPSBudWxsO1xuICAgICAgICAgICAgb2JqZWN0IHJ1bGVzT2JqZWN0U3RyID0gR2xvYmFsLkxvY2FsU3RvcmFnZS5HZXRJdGVtKFwicnVsZXNcIik7XHJcbnN0cmluZyByOyAgICAgICAgICAgIGlmICgociA9IHJ1bGVzT2JqZWN0U3RyIGFzIHN0cmluZykgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pYyBydWxlc09iaiA9IEpTT04uUGFyc2Uocik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bGVzT2JqZWN0U3RyICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoU2NyaXB0LldyaXRlKFwiezB9IGluc3RhbmNlb2YgQXJyYXlcIiwgcnVsZXNPYmoubGl2aW5nUnVsZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGl2aW5nUnVsZXMgPSBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxib29sW10+KEpTT04uU3RyaW5naWZ5KHJ1bGVzT2JqLmxpdmluZ1J1bGVzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTY3JpcHQuV3JpdGUoXCJ7MH0gaW5zdGFuY2VvZiBBcnJheVwiLCBydWxlc09iai5kZWFkUnVsZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVhZFJ1bGVzID0gSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8Ym9vbFtdPihKU09OLlN0cmluZ2lmeShydWxlc09iai5kZWFkUnVsZXMpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCB7IH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LlN0eWxlW1widXNlci1zZWxlY3RcIl0gPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgRG9jdW1lbnQuSGVhZC5BcHBlbmRDaGlsZChuZXcgSFRNTExpbmtFbGVtZW50IHsgUmVsID0gXCJzdHlsZXNoZWV0XCIsIEhyZWYgPSBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vYm9vdHN0cmFwQDUuMi4wL2Rpc3QvY3NzL2Jvb3RzdHJhcC5taW4uY3NzXCIgfSk7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuU3R5bGUuTWFyZ2luID0gXCIwcHhcIjtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChQb3B1cENvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQobmV3IEhUTUxTdHlsZUVsZW1lbnQgeyBJbm5lckhUTUwgPSBcInRkLCB0aCB7IGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrOyBwYWRkaW5nOiA1cHggfSBidXR0b24geyBtYXJnaW4tcmlnaHQ6IDVweCB9XCIgfSk7XHJcblxyXG4gICAgICAgICAgICBIVE1MVGFibGVFbGVtZW50IGFkamFjZW50Q2VsbHNUYWJsZSA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlRWxlbWVudD4oXHJcbm5ldyBIVE1MVGFibGVFbGVtZW50IHsgU3R5bGUgPSB7IE1hcmdpbkxlZnQgPSBcImF1dG9cIiwgTWFyZ2luUmlnaHQgPSBcImF1dG9cIiB9IH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVSb3dFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVSb3dFbGVtZW50KCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQoKSxcIiNcIiksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50KCksXCJMXCIpLFxyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudCgpLFwiRFwiKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgXHJcbkNyZWF0ZTAxU2VsZWN0b3IgPSAoKSA9PiBuZXcgSFRNTFNlbGVjdEVsZW1lbnQoKS5BZGQ8SFRNTFNlbGVjdEVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudHtWYWx1ZSA9IFwiZmFsc2VcIn0sIFwiMFwiKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCJ0cnVlXCJ9LCBcIjFcIikpO1xuXHJcbiAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDw9IG1heEFkamFjZW50Q2VsbHM7IG4rKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSFRNTFRhYmxlUm93RWxlbWVudCByb3cgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlUm93RWxlbWVudD4obmV3IEhUTUxUYWJsZVJvd0VsZW1lbnQoKSxhZGphY2VudENlbGxzVGFibGUpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KCAgICAgICAgICAgICAgICByb3csQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSxuLlRvU3RyaW5nKCkpKTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbkNlbGxzLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8SFRNTFNlbGVjdEVsZW1lbnQsIEhUTUxTZWxlY3RFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFNlbGVjdEVsZW1lbnQ+KENyZWF0ZTAxU2VsZWN0b3IoKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudD4obmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpLCByb3cpKS5TZXRCb29sVmFsdWUobGl2aW5nUnVsZXNbbl0pLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFNlbGVjdEVsZW1lbnQ+KENyZWF0ZTAxU2VsZWN0b3IoKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudD4obmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpLCByb3cpKS5TZXRCb29sVmFsdWUoZGVhZFJ1bGVzW25dKSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZyAsYm9vbFtdICxib29sW10gPj4gcHJlc2V0c0xpc3QgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcgLGJvb2xbXSAsYm9vbFtdID4+KCksKF9vMSk9PntfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcsIGJvb2xbXSwgYm9vbFtdPihcIkNvbndheSdzIEdhbWUgb2YgTGlmZSBQcmVzZXRcIiwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCB0cnVlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9KSk7X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJJbW1vcnRhbCBDZWxscyBQcmVzZXRcIiwgbmV3IGJvb2xbOV17dHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZX0sIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0pKTtfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcsIGJvb2xbXSwgYm9vbFtdPihcIkFsbW9zdCBJbW1vcnRhbCBDZWxscyBQcmVzZXRcIiwgbmV3IGJvb2xbOV17dHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2V9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9KSk7X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJBbHRlcm5hdGUgQ29ud2F5J3MgR2FtZSBvZiBMaWZlIFByZXNldFwiLCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0sIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO3JldHVybiBfbzE7fSk7XHJcblxyXG4gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCBwcmVzZXRzRGl2ID0gbmV3IEhUTUxEaXZFbGVtZW50IHsgU3R5bGUgPSB7IFRleHRBbGlnbiA9IFRleHRBbGlnbi5DZW50ZXIgfSB9O1xyXG5mb3JlYWNoICh2YXIgX2QyIGluIHByZXNldHNMaXN0KVxyXG57XHJcbiAgICBzdHJpbmcgbmFtZTtcclxuICAgIGJvb2xbXSBsaXZpbmdSdWxlcztcclxuICAgIGJvb2xbXSBkZWFkUnVsZXM7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KF9kMiwgb3V0IG5hbWUsIG91dCBsaXZpbmdSdWxlcywgb3V0IGRlYWRSdWxlcyk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBwcmVzZXRzRGl2LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCgpLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEFuY2hvckVsZW1lbnQ+KG5ldyBIVE1MQW5jaG9yRWxlbWVudHtIcmVmID0gXCJqYXZhc2NyaXB0OnZvaWQoMClcIiwgU3R5bGUgPSB7Rm9udFNpemUgPSBcIjFyZW1cIn0sIE9uQ2xpY2sgPSBlID0+IEFwcGx5UHJlc2V0KGxpdmluZ1J1bGVzOiBsaXZpbmdSdWxlcywgZGVhZFJ1bGVzOiBkZWFkUnVsZXMpfSxuYW1lKSkpO1xyXG59XG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihcclxuICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxhZGphY2VudENlbGxzVGFibGUpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBTZXR0aW5nc1BvcHVwLG5ldyBIVE1MQlJFbGVtZW50KCksIHByZXNldHNEaXYsIG5ldyBIVE1MQlJFbGVtZW50KCkpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBTZXR0aW5nc1BvcHVwLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLFxyXG4gICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT5cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8PSBtYXhBZGphY2VudENlbGxzOyBuKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXZpbmdSdWxlc1tuXSA9IG9wdGlvbkNlbGxzW25dLkl0ZW0xLkJvb2xWYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWFkUnVsZXNbbl0gPSBvcHRpb25DZWxsc1tuXS5JdGVtMi5Cb29sVmFsdWUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsLkxvY2FsU3RvcmFnZS5TZXRJdGVtKFwicnVsZXNcIiwgSnNvbkNvbnZlcnQuU2VyaWFsaXplT2JqZWN0KG5ld1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGl2aW5nUnVsZXMgPSBsaXZpbmdSdWxlcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVhZFJ1bGVzID0gZGVhZFJ1bGVzXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIEhpZGVNb2RhbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFwiU2F2ZSBDaGFuZ2VzXCIpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oXHJcbiAgICAgICAgICAgIE5vdGFibGVPYmplY3RzUG9wdXAsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFN0eWxlID0geyBDc3NGbG9hdCA9IEZsb2F0LlJpZ2h0IH1cclxuICAgICAgICAgICAgfSxcIuKdjFwiKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIE5vdGFibGVPYmplY3RzUG9wdXAsbmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFN0eWxlID0geyBDbGVhciA9IENsZWFyLkJvdGggfVxyXG4gICAgICAgICAgICB9KTtcclxuZm9yZWFjaCAodmFyIF9kMyBpbiBOb3RhYmxlT2JqZWN0c0xpc3QuTm90YWJsZU9iamVjdHMpXHJcbntcclxuICAgIEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PiBvYmplY3REZXRhaWxzO1xyXG4gICAgc3RyaW5nIGRlc2NyaXB0aW9uO1xyXG4gICAgc3RyaW5nIHJ1bGVzO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDMsIG91dCBvYmplY3REZXRhaWxzLCBvdXQgZGVzY3JpcHRpb24sIG91dCBydWxlcyk7XHJcbiAgICBIVE1MRGl2RWxlbWVudCBvYmplY3RJbmZvID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnR7U3R5bGUgPSB7V2lkdGggPSBcIjMwcmVtXCJ9fSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudHtTdHlsZSA9IHtEaXNwbGF5ID0gRGlzcGxheS5GbGV4LCBBbGlnbkl0ZW1zID0gQWxpZ25JdGVtcy5DZW50ZXIsIEZsZXhEaXJlY3Rpb24gPSBGbGV4RGlyZWN0aW9uLkNvbHVtbn19LE5vdGFibGVPYmplY3RzUG9wdXApKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50e1N0eWxlID0ge0Rpc3BsYXkgPSBEaXNwbGF5LkZsZXgsIEFsaWduSXRlbXMgPSBBbGlnbkl0ZW1zLkNlbnRlciwgRmxleERpcmVjdGlvbiA9IEZsZXhEaXJlY3Rpb24uQ29sdW1ufX0sRHJhd1NoYXBlKG9iamVjdERldGFpbHMpKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCgpLGRlc2NyaXB0aW9uKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLHJ1bGVzKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgIG9iamVjdEluZm8sbmV3IEhUTUxCUkVsZW1lbnQoKSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBvYmplY3RJbmZvLG5ldyBIVE1MQlJFbGVtZW50KCkpO1xyXG59XG5cclxuXHJcbiAgICAgICAgICAgIEhvdGJhci5BcHBlbmRDaGlsZChQbGF5QnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IGJhY2tncm91bmREaXYgPSBuZXcgSFRNTERpdkVsZW1lbnQgeyBTdHlsZSA9IHsgUG9zaXRpb24gPSBQb3NpdGlvbi5SZWxhdGl2ZSwgTWluV2lkdGggPSBcIjBcIiwgTWluSGVpZ2h0ID0gXCIwXCIgfX07XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5PdmVyZmxvdyA9IE92ZXJmbG93LkhpZGRlbjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLlpJbmRleCA9IFwiLTFcIjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLlBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuTGVmdCA9IFwiMHB4XCI7XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5Ub3AgPSBcIjBweFwiO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBiYWNrZ3JvdW5kRGl2LERPTUNhbnZhcyk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICAgICAgICAgIGJhY2tncm91bmREaXYsSG90YmFyKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgYmFja2dyb3VuZERpdixSaWdodEhvdGJhcik7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQoYmFja2dyb3VuZERpdik7XHJcblxyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlRyYW5zbGF0ZSgwLjUsIDAuNSk7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVdpZHRoID0gMTtcclxuICAgICAgICAgICAgZm9yIChpbnQgeCA9IDA7IHggPD0gKHdpZHRoICsgMik7IHgrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5Nb3ZlVG8oeCAqIHhNdWx0aXBsaWVyLCAwKTtcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKHggKiB4TXVsdGlwbGllciwgKGhlaWdodCArIDMpICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoaW50IHkgPSAwOyB5IDw9IChoZWlnaHQgKyAyKTsgeSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbygwLCB5ICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5MaW5lVG8oKHdpZHRoICsgMykgKiB4TXVsdGlwbGllciwgeSAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8IDEwOyBuKyspXHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlN0cm9rZSgpO1xyXG5cclxuICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBkcmFnZ2luZ1BvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gb3JpZ2luYWxQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICBib29sIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgRE9NQ2FudmFzLk9uTW91c2VEb3duID0gZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IHRydWU7XHJcbmludCB4O1xuaW50IHk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGUuTW91c2VQb3MoKSwgb3V0IHgsIG91dCB5KTtcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4IC0gb2Zmc2V0UG9zLkl0ZW0xLCB5IC0gb2Zmc2V0UG9zLkl0ZW0yKTtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsUG9zID0gb2Zmc2V0UG9zO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBET01DYW52YXMuT25Nb3VzZVVwID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0xLSBvcmlnaW5hbFBvcy5JdGVtMSkgPiB4TXVsdGlwbGllciB8fCBNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTItIG9yaWdpbmFsUG9zLkl0ZW0yKSA+IHlNdWx0aXBsaWVyKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZ1BvcyA9IG9mZnNldFBvcztcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLk9uTW91c2VNb3ZlID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGUuQnV0dG9ucyAmIDEpID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGlmIChkcmFnZ2luZ1BvcyA9PSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApKSBkcmFnZ2luZ1BvcyA9IGUuTW91c2VQb3MoKTtcclxuICAgICAgICAgICAgICAgIHZhciBtb3VzZVBvcyA9IGUuTW91c2VQb3MoKTtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTEtIG9yaWdpbmFsUG9zLkl0ZW0xKSA+IHhNdWx0aXBsaWVyIHx8IE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMS0gb3JpZ2luYWxQb3MuSXRlbTEpID4geU11bHRpcGxpZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIG9mZnNldFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4obW91c2VQb3MuSXRlbTEgLSBkcmFnZ2luZ1Bvcy5JdGVtMSwgbW91c2VQb3MuSXRlbTIgLSBkcmFnZ2luZ1Bvcy5JdGVtMik7XHJcbiAgICAgICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgICAgIH07XHJcblByb2Nlc3NNb3VzZUV2ZW50ID0gKGUpID0+XHJcbntcclxuICAgIC8vaWYgKChAZXZlbnQuQnV0dG9ucyAmIDEpID09IDApIHJldHVybjtcclxuICAgIHZhciBtb3VzZVBvcyA9IGUuTW91c2VQb3MoKTtcclxuICAgIGludCBjbGlja1g7XHJcbiAgICBpbnQgY2xpY2tZO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KE5lZ0Rpdihtb3VzZVBvcy5JdGVtMSAtIG9mZnNldFBvcy5JdGVtMSwgeE11bHRpcGxpZXIpLCBOZWdEaXYoKG1vdXNlUG9zLkl0ZW0yIC0gb2Zmc2V0UG9zLkl0ZW0yKSwgeU11bHRpcGxpZXIpKSwgb3V0IGNsaWNrWCwgb3V0IGNsaWNrWSk7XHJcbiAgICBpZiAoIVNxdWFyZXMuUmVtb3ZlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oY2xpY2tYLCBjbGlja1kpKSlcclxuICAgICAgICBTcXVhcmVzLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGNsaWNrWCwgY2xpY2tZKSk7XHJcbiAgICBEcmF3KCk7XHJcbn1cclxuXHJcbjtcbiAgICAgICAgICAgIERPTUNhbnZhcy5PbkNsaWNrID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdpbmdJbnRlbnQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUHJvY2Vzc01vdXNlRXZlbnQoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIEdsb2JhbC5TZXRJbnRlcnZhbCgoQWN0aW9uKU5leHRGcmFtZSwgMTAwKTtcclxuXHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCB1cGRhdGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBOdW1iZXJPZkFkamFjZW50Q2VsbHMgKGludCB4LCBpbnQgeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBhZGphY2VudENlbGxzID0gMDtcclxuICAgICAgICAgICAgZm9yIChpbnQgTCA9IDA7IEwgPD0gODsgTCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTCA9PSA0KSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnQgeF8gPSB4IC0gMSArIChMICUgMyksXHJcbiAgICAgICAgICAgICAgICAgICAgeV8gPSB5IC0gMSArIEwgLyAzO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vaWYgKHhfIDwgMCB8fCB4XyA+PSB3aWR0aCB8fCB5XyA8IDAgfHwgeV8gPj0gaGVpZ2h0KSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoU3F1YXJlcy5Db250YWlucyhuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHhfLCB5XykpKVxyXG4gICAgICAgICAgICAgICAgICAgIGFkamFjZW50Q2VsbHMrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYWRqYWNlbnRDZWxscztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy91cGRhdGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PiByZW1vdmluZyA9IG5ldyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PigpO1xyXG4gICAgICAgICAgICBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PiBhZGRpbmcgPSBuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oKTtcclxuZm9yZWFjaCAodmFyIF9kNCBpbiBTcXVhcmVzKVxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDQsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpbnQgYWRqYWNlbnRDZWxscyA9IDA7XHJcbiAgICBmb3IgKGludCBMID0gMDsgTCA8PSA4OyBMKyspXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKEwgPT0gNClcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgaW50IHhfID0geCAtIDEgKyAoTCAlIDMpLCB5XyA9IHkgLSAxICsgTCAvIDM7XHJcbiAgICAgICAgaWYgKFNxdWFyZXMuQ29udGFpbnMobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4XywgeV8pKSlcclxuICAgICAgICAgICAgYWRqYWNlbnRDZWxscysrO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBuZXcgY2VsbHMuXHJcbiAgICAgICAgICAgIC8vIE9wdGltaXphdGlvbiBmb3IgcnVsZSBvZiAzIGFkamFjZW50IGNlbGxzXHJcbiAgICAgICAgICAgIC8vaWYgKEwgIT0gNyAmJiBMICE9IDgpXHJcbiAgICAgICAgICAgIC8ve1xyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgaWYgKGRlYWRSdWxlc1tOdW1iZXJPZkFkamFjZW50Q2VsbHMoeF8sIHlfKV0pXHJcbiAgICAgICAgICAgICAgICBhZGRpbmcuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeF8sIHlfKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghbGl2aW5nUnVsZXNbYWRqYWNlbnRDZWxsc10pXHJcbiAgICAgICAgcmVtb3ZpbmcuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSkpO1xyXG59XG5mb3JlYWNoICh2YXIgX2Q1IGluIHJlbW92aW5nKVxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDUsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpZiAoIVNxdWFyZXMuUmVtb3ZlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSkpKVxyXG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJTcXVhcmUgdHJpZWQgdG8gYmUgcmVtb3ZlZCBidXQgZGlkbid0IGV4aXN0XCIpO1xyXG59XG5mb3JlYWNoICh2YXIgX2Q2IGluIGFkZGluZylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2Q2LCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgU3F1YXJlcy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4LCB5KSk7XHJcbn1cbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgRHJhdyAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5DbGVhclJlY3QoMCwgMCwgRE9NQ2FudmFzLldpZHRoLCBET01DYW52YXMuSGVpZ2h0KTtcclxuICAgICAgICAgICAgVG9wQ2FudmFzQ29udGV4dC5DbGVhclJlY3QoMCwgMCwgRE9NQ2FudmFzLldpZHRoLCBET01DYW52YXMuSGVpZ2h0KTtcclxuaW50IG9mZnNldFg7XG5pbnQgb2Zmc2V0WTtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3Qob2Zmc2V0UG9zLCBvdXQgb2Zmc2V0WCwgb3V0IG9mZnNldFkpO1xyXG4gICAgICAgICAgICBVaW50OENsYW1wZWRBcnJheSBpbWFnZURhdGFBcnJheSA9IENyZWF0ZUltYWdlRGF0YUFycmF5KHdpZHRoICsgMiwgaGVpZ2h0ICsgMik7XHJcbmZvcmVhY2ggKHZhciBfZDcgaW4gU3F1YXJlcylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2Q3LCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaW50IGRyYXdYID0geCArIChvZmZzZXRYIC8geE11bHRpcGxpZXIpICsgMSwgZHJhd1kgPSB5ICsgKG9mZnNldFkgLyB5TXVsdGlwbGllcikgKyAxO1xyXG4gICAgaWYgKGRyYXdYIDwgMCB8fCBkcmF3WCA+PSB3aWR0aCArIDIgfHwgZHJhd1kgPCAwIHx8IGRyYXdZID49IGhlaWdodCArIDIpXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICBpbnQgaWR4ID0gZHJhd1ggKyBkcmF3WSAqICh3aWR0aCArIDIpO1xyXG4gICAgaW1hZ2VEYXRhQXJyYXlbaWR4ICogNCArIDNdID0gMjU1O1xyXG59XG4gICAgICAgICAgICBJbWFnZURhdGEgaW1hZ2VEYXRhID0gbmV3IEltYWdlRGF0YShpbWFnZURhdGFBcnJheSwgKHVpbnQpKHdpZHRoICsgMiksICh1aW50KShoZWlnaHQgKyAyKSk7XHJcbiAgICAgICAgICAgIFRvcENhbnZhc0NvbnRleHQuUHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0ltYWdlKEJvdHRvbUNhbnZhcywgb2Zmc2V0WCAlIHhNdWx0aXBsaWVyIC0geE11bHRpcGxpZXIsIG9mZnNldFkgJSB5TXVsdGlwbGllciAtIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5JbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5EcmF3SW1hZ2UoVG9wQ2FudmFzLCAob2Zmc2V0WCAlIHhNdWx0aXBsaWVyKSAtIHhNdWx0aXBsaWVyLCAob2Zmc2V0WSAlIHlNdWx0aXBsaWVyKSAtIHlNdWx0aXBsaWVyLCAod2lkdGggKyAyKSAqIHhNdWx0aXBsaWVyLCAoaGVpZ2h0ICsgMikgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBmcmFtZU51bSA9IDA7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBOZXh0RnJhbWUgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghcGxheWluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgYm9vbCBza2lwRnJhbWVzID0gU3F1YXJlcy5Db3VudCA+PSAyNTA7XHJcbiAgICAgICAgICAgIGludCB1cGRhdGVzUGVyRHJhdyA9IDE7Ly8gc2tpcEZyYW1lcyA/IDIgOiAxO1xyXG4gICAgICAgICAgICBmcmFtZU51bSsrO1xyXG4gICAgICAgICAgICBpZiAoc2tpcEZyYW1lcyAmJiAoZnJhbWVOdW0gJSB1cGRhdGVzUGVyRHJhdykgIT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPCB1cGRhdGVzUGVyRHJhdzsgbisrKVxyXG4gICAgICAgICAgICAgICAgVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRleHQuUmVndWxhckV4cHJlc3Npb25zO1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBFeHRlbnNpb25zXHJcbiAgICB7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKChlLCBjKSA9PiBjLmFwcGVuZENoaWxkKGUpKSh7ZWxlbWVudH0sIHtjb250YWluaW5nRWxlbX0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgQWRkVG88VD4odGhpcyBUIGVsZW1lbnQsIE5vZGUgY29udGFpbmluZ0VsZW0pIHdoZXJlIFQgOiBOb2RlO1xyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBUIEFkZFRvQm9keTxUPih0aGlzIFQgbikgd2hlcmUgVCA6IE5vZGUgPT4gQXBwLnJvb3QuQXBwZW5kQ2hpbGQ8VD4obik7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwie25vZGV9LmFwcGVuZENoaWxkKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBBcHBlbmRDaGlsZDxUPih0aGlzIE5vZGUgbm9kZSwgVCBlbGVtZW50KSB3aGVyZSBUIDogTm9kZTtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIEhpZGU8VD4odGhpcyBUIGVsZW1lbnQpIHdoZXJlIFQgOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zdHlsZS5kaXNwbGF5ID0gJycsIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgU2hvdzxUPih0aGlzIFQgZWxlbWVudCkgd2hlcmUgVCA6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihsaSA9PiAobGkuYXBwZW5kQ2hpbGQoe2VsZW1lbnR9KSwgbGkpKShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MTElFbGVtZW50IFdyYXBMaSh0aGlzIE5vZGUgZWxlbWVudCk7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGRpdiA9PiAoZGl2LmFwcGVuZENoaWxkKHtlbGVtZW50fSksIGRpdikpKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MRGl2RWxlbWVudCBXcmFwRGl2KHRoaXMgTm9kZSBlbGVtZW50KTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFQgQWRkPFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgc3RyaW5nPltdIG5vZGVzKSB3aGVyZSBUIDogTm9kZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoVW5pb248Tm9kZSwgc3RyaW5nPiBub2RlIGluIG5vZGVzKVxyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUuSXM8c3RyaW5nPigpKVxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuQXBwZW5kQ2hpbGQobmV3IFRleHQobm9kZS5BczxzdHJpbmc+KCkpKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LkFwcGVuZENoaWxkKG5vZGUuQXM8Tm9kZT4oKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBUIEFkZEVsZW1lbnQ8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LG5vZGVzKTtcclxufXB1YmxpYyBzdGF0aWMgVCBBZGREaXY8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCgpLG5vZGVzKSk7XHJcbn1wdWJsaWMgc3RhdGljIFQgQWRkVWw8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBVbmlvbjxOb2RlLCBzdHJpbmc+W10sIHN0cmluZz5bXSBub2RlcylcclxuICAgIHdoZXJlIFQgOiBOb2RlXHJcbntcclxuICAgIHJldHVybiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPFQ+KGVsZW1lbnQsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVUxpc3RFbGVtZW50PihuZXcgSFRNTFVMaXN0RWxlbWVudCgpLFN5c3RlbS5BcnJheUV4dGVuc2lvbnMuTWFwPFVuaW9uPE5vZGUsVW5pb248Tm9kZSwgc3RyaW5nPltdLHN0cmluZz4sVW5pb248Tm9kZSxzdHJpbmc+Pihub2RlcywoRnVuYzxVbmlvbjxOb2RlLFVuaW9uPE5vZGUsIHN0cmluZz5bXSxzdHJpbmc+LFVuaW9uPE5vZGUsc3RyaW5nPj4pKG4gPT4gKFVuaW9uPE5vZGUsIHN0cmluZz4pKG4uSXM8VW5pb248Tm9kZSwgc3RyaW5nPltdPigpID8gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MTElFbGVtZW50PihuZXcgSFRNTExJRWxlbWVudCgpLG4uQXM8VW5pb248Tm9kZSwgc3RyaW5nPltdPigpKSA6IG4uSXM8c3RyaW5nPigpID8gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MTElFbGVtZW50PihuZXcgSFRNTExJRWxlbWVudCgpLG4uQXM8c3RyaW5nPigpKSA6IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTExJRWxlbWVudD4obmV3IEhUTUxMSUVsZW1lbnQoKSxuLkFzPE5vZGU+KCkpKSkpKSk7XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBBZGRDYW1lbFNwYWNlKHRoaXMgc3RyaW5nIHN0cilcclxue1xyXG4gICAgcmV0dXJuIFJlZ2V4LlJlcGxhY2UoUmVnZXguUmVwbGFjZShzdHIsIEBcIihbXl9hLXpdKShbXl9hLXpdW2Etel0pXCIsIFwiJDEgJDJcIiksIEBcIihbYS16XSkoW15fYS16XSlcIiwgXCIkMSAkMlwiKTtcclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIFRvQ2FtZWxTdHJpbmc8VD4odGhpcyBUIGUpXHJcbiAgICB3aGVyZSBUIDogc3RydWN0LCBTeXN0ZW0uRW51bVxyXG57XHJcbiAgICByZXR1cm4gZS5Ub1N0cmluZygpLkFkZENhbWVsU3BhY2UoKS5SZXBsYWNlKCdfJywgJyAnKTtcclxufSAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBBZGRFbnVtPFQ+KHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBUPyBkZWZhdWx0VmFsdWUgPSBudWxsLCBzdHJpbmcgZGVmYXVsdFZhbHVlU3RyaW5nID0gXCJcIikgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChkZWZhdWx0VmFsdWUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHNlbGVjdC5BZGQoQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50IHsgVmFsdWUgPSBcIlwiLCBTZWxlY3RlZCA9IHRydWUsIERpc2FibGUgPSB0cnVlIH0sZGVmYXVsdFZhbHVlU3RyaW5nKSk7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFQgdmFsdWUgaW4gU3lzdGVtLkVudW0uR2V0VmFsdWVzKHR5cGVvZihUKSkpXHJcbiAgICAgICAgICAgICAgICBzZWxlY3QuQWRkKEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFZhbHVlID0gKChpbnQpKG9iamVjdCl2YWx1ZSkuVG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBTZWxlY3RlZCA9IG9iamVjdC5FcXVhbHMoZGVmYXVsdFZhbHVlLCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLlRvQ2FtZWxTdHJpbmc8VD4odmFsdWUpKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIGJvb2wgQm9vbFZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0KVxyXG57XHJcbiAgICByZXR1cm4gc2VsZWN0LlZhbHVlID09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlO1xyXG59cHVibGljIHN0YXRpYyBUPyBWYWx1ZTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdClcclxuICAgIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbntcclxuICAgIHJldHVybiBzZWxlY3QuVmFsdWUgPT0gXCJcIiA/IG51bGwgOiAoVD8gKShUKShvYmplY3QpaW50LlBhcnNlKHNlbGVjdC5WYWx1ZSk7XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgU2V0Qm9vbFZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBib29sIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZWN0LlZhbHVlID0gdmFsdWUuVG9TdHJpbmcoKS5Ub0xvd2VyKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgU2V0VmFsdWU8VD4odGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QsIFQgdmFsdWUpIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxlY3QuVmFsdWUgPSAoKGludCkob2JqZWN0KXZhbHVlKS5Ub1N0cmluZygpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBzdHJpbmcgVG9UaW1lU3RyaW5nKHRoaXMgVGltZVNwYW4gdGltZSlcclxue1xyXG4gICAgcmV0dXJuIHRpbWUuVG9TdHJpbmcodGltZSA+PSBUaW1lU3Bhbi5Gcm9tSG91cnMoMSkgPyBAXCJoXFw6bW1cXDpzc1wiIDogQFwibVxcOnNzXCIpO1xyXG59ICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zZXRDdXN0b21WYWxpZGl0eSh7bWVzc2FnZX0pLCBlLnJlcG9ydFZhbGlkaXR5KCksIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgU2V0Q3VzdG9tVmFsaWRpdHk8VD4odGhpcyBUIGVsZW1lbnQsIHN0cmluZyBtZXNzYWdlKSB3aGVyZSBUIDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc2V0QXR0cmlidXRlKCdsaXN0Jywge2RhdGFsaXN0SUR9KSwgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gSFRNTElucHV0RWxlbWVudCBTZXREYXRhTGlzdCh0aGlzIEhUTUxJbnB1dEVsZW1lbnQgZWxlbWVudCwgc3RyaW5nIGRhdGFsaXN0SUQpO1xyXG4gICAgICAgIC8vW1RlbXBsYXRlKFwie2VsZW19LmFwcGVuZENoaWxkKHthZGRpbmd9KVwiKV1cclxuICAgICAgICAvL3B1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgQXBwZW5kPFQ+ICh0aGlzIE5vZGUgZWxlbSwgVCBhZGRpbmcpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFVuaW9uPE5vZGUsIHN0cmluZz5bXSBKb2luQlIodGhpcyBJRW51bWVyYWJsZTxzdHJpbmc+IHN0cmluZ3MpXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uRnVuYzxJRW51bWVyYWJsZTxVbmlvbjxOb2RlLCBzdHJpbmc+Pj4gSW5uZXIgPSBudWxsO1xuICAgICAgICAgICAgXHJcbklubmVyID0gKCkgPT5cclxue1xyXG4gICAgdXNpbmcgKHZhciBlbnVtZXIgPSBzdHJpbmdzLkdldEVudW1lcmF0b3IoKSlcclxuICAgIHtcclxuICAgICAgICBpZiAoIWVudW1lci5Nb3ZlTmV4dCgpKVxyXG4gICAgICAgICAgICB5aWVsZCBicmVhaztcclxuICAgICAgICB5aWVsZCByZXR1cm4gZW51bWVyLkN1cnJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKGVudW1lci5Nb3ZlTmV4dCgpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgeWllbGQgcmV0dXJuIG5ldyBIVE1MQlJFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiBlbnVtZXIuQ3VycmVudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbjtcbiAgICAgICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlRvQXJyYXk8VW5pb248Tm9kZSxzdHJpbmc+PihJbm5lcigpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIE5vdGFibGVPYmplY3RzTGlzdFxyXG4gICAge1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiAsc3RyaW5nICxzdHJpbmcgPj4gTm90YWJsZU9iamVjdHMgPVxyXG4gICAgICAgICAgICBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+ICxzdHJpbmcgLHN0cmluZyA+PigpLChfbzIpPT57X28yLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8SGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4+LCBzdHJpbmcsIHN0cmluZz4oZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+PigpLCAoX28xKSA9PlxyXG57XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCkpO1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDEsIDApKTtcclxuICAgIF9vMS5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigxLCAxKSk7XHJcbiAgICBfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMikpO1xyXG4gICAgX28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDIsIDIpKTtcclxuICAgIHJldHVybiBfbzE7XHJcbn1cclxuXHJcbiksIFwiVHdvIEdlbmVyYXRpb24gTmluZXR5IERlZ3JlZSBSb3RhdG9yXCIsIFwiMDAxMDEwLS0tIC8gMDAwMTAxLS0tXCIpKTtyZXR1cm4gX28yO30pO1xyXG4gICAgfVxyXG59Il0KfQo=
