/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2022
 * @compiler Bridge.NET 17.10.1
 */
Bridge.assembly("CustomizableGameofLife", function ($asm, globals) {
    "use strict";

    Bridge.define("CustomizableGameofLife.App", {
        main: function Main () {
            var $t, $t1;
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
            document.body.appendChild(CustomizableGameofLife.App.SettingsPopupContainer);
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
                    var _d1 = $t.Current.$clone();
                    var name = { };
                    var livingRules = { };
                    var deadRules = { };
                    Bridge.Deconstruct(_d1.$clone(), name, livingRules, deadRules);
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

            CustomizableGameofLife.App.SettingsButton.onclick = function (e) {
                CustomizableGameofLife.App.SettingsPopupContainer.style.display = "";
            };
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [adjacentCellsTable]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [document.createElement("br"), presetsDiv, document.createElement("br")]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t1 = document.createElement("button"), $t1.className = "btn btn-primary", $t1.onclick = function (e) {
                for (var n1 = 0; n1 <= CustomizableGameofLife.App.maxAdjacentCells; n1 = (n1 + 1) | 0) {
                    CustomizableGameofLife.App.livingRules[System.Array.index(n1, CustomizableGameofLife.App.livingRules)] = CustomizableGameofLife.Extensions.BoolValue(CustomizableGameofLife.App.optionCells.getItem(n1).$clone().Item1);
                    CustomizableGameofLife.App.deadRules[System.Array.index(n1, CustomizableGameofLife.App.deadRules)] = CustomizableGameofLife.Extensions.BoolValue(CustomizableGameofLife.App.optionCells.getItem(n1).$clone().Item2);
                }
                Bridge.global.localStorage.setItem("rules", Newtonsoft.Json.JsonConvert.SerializeObject({ livingRules: CustomizableGameofLife.App.livingRules, deadRules: CustomizableGameofLife.App.deadRules }));
                CustomizableGameofLife.App.SettingsPopupContainer.style.display = "none";
            }, $t1), ["Save Changes"])]);


            CustomizableGameofLife.App.Hotbar.appendChild(CustomizableGameofLife.App.PlayButton);
            CustomizableGameofLife.App.Hotbar.appendChild(CustomizableGameofLife.App.SettingsButton);

            var backgroundDiv = ($t1 = document.createElement("div"), $t1.style.position = "relative", $t1.style.minWidth = "0", $t1.style.minHeight = "0", $t1);
            CustomizableGameofLife.App.DOMCanvas.style.overflow = "hidden";
            CustomizableGameofLife.App.DOMCanvas.style.zIndex = "-1";
            CustomizableGameofLife.App.DOMCanvas.style.position = "absolute";
            CustomizableGameofLife.App.DOMCanvas.style.left = "0px";
            CustomizableGameofLife.App.DOMCanvas.style.top = "0px";
            backgroundDiv.appendChild(CustomizableGameofLife.App.DOMCanvas);
            backgroundDiv.appendChild(CustomizableGameofLife.App.Hotbar);
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
                SettingsPopupContainer: null,
                SettingsPopup: null,
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
                    var $t, $t1;
                    this.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32))();
                    this.xMultiplier = 20;
                    this.yMultiplier = 20;
                    this.maxAdjacentCells = 8;
                    this.screenWidth = window.innerWidth;
                    this.screenHeight = window.innerHeight;
                    this.width = (Bridge.Int.div(CustomizableGameofLife.App.screenWidth, CustomizableGameofLife.App.xMultiplier)) | 0;
                    this.height = (Bridge.Int.div(CustomizableGameofLife.App.screenHeight, CustomizableGameofLife.App.yMultiplier)) | 0;
                    this.Hotbar = CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.Extensions.Add(HTMLDivElement, ($t = document.createElement("div"), $t.style.position = "absolute", $t.style.left = "100px", $t.style.top = System.String.format("{0}px", [Bridge.box(((window.innerHeight - 40) | 0), System.Int32)]), $t), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.Reset(true);
                    }, $t), ["Blank"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.Reset();
                    }, $t), ["Reset"])]), [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                        CustomizableGameofLife.App.SaveAsStarter();
                    }, $t), ["Save as Starter"])]);
                    this.SettingsPopupContainer = CustomizableGameofLife.Extensions.Add(HTMLDivElement, function (_o1) {
                            _o1.style.position = "fixed";
                            _o1.style.top = "0";
                            _o1.style.left = "0";
                            _o1.style.width = "100%";
                            _o1.style["x-index"] = Bridge.box(999999, System.Int32);
                            _o1.style.height = "100%";
                            _o1.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                            _o1.style.display = "none";
                            return _o1;
                        }(document.createElement("div")), [($t = ($t1 = document.createElement("div"), $t1.style.fontSize = "1.5rem", $t1.style.backgroundColor = "white", $t1.style.position = "fixed", $t1.style.top = "0px", $t1.style.left = "25%", $t1.style.width = "50%", $t1.style.height = "100%", $t1), CustomizableGameofLife.App.SettingsPopup = $t, $t)]);
                    this.SettingsButton = ($t1 = document.createElement("button"), $t1.innerHTML = "\u2699", $t1.className = "btn btn-primary", $t1.onclick = function (e) {

                    }, $t1);
                    this.PlayButton = ($t1 = document.createElement("button"), $t1.innerHTML = "\u25b6", $t1.style.color = "green", $t1.className = "btn btn-primary", $t1.onclick = function (e) {
                        CustomizableGameofLife.App.InvertIsPlaying();
                    }, $t1);
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
                            var _d2 = $t.Current.$clone();
                            var x = { };
                            var y = { };
                            Bridge.Deconstruct(_d2.$clone(), x, y);
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
                            var _d3 = $t1.Current.$clone();
                            var x1 = { };
                            var y1 = { };
                            Bridge.Deconstruct(_d3.$clone(), x1, y1);
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
                            var _d4 = $t2.Current.$clone();
                            var x2 = { };
                            var y2 = { };
                            Bridge.Deconstruct(_d4.$clone(), x2, y2);
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
                    var l = Bridge.Int.mul((((CustomizableGameofLife.App.width + 2) | 0)), (((CustomizableGameofLife.App.height + 2) | 0)));
                    var imageDataArray = new Uint8ClampedArray(Bridge.Int.mul(l, 4));
                    $t = Bridge.getEnumerator(CustomizableGameofLife.App.Squares);
                    try {
                        while ($t.moveNext()) {
                            var _d5 = $t.Current.$clone();
                            var x = { };
                            var y = { };
                            Bridge.Deconstruct(_d5.$clone(), x, y);
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
                    CustomizableGameofLife.App.TopCanvasContext.imageSmoothingEnabled = false;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDdXN0b21pemFibGVHYW1lb2ZMaWZlLmpzIiwKICAic291cmNlUm9vdCI6ICIiLAogICJzb3VyY2VzIjogWyJDbGFzczEuY3MiLCJFeHRlbnNpb25zLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7OztZQStKQUEsd0JBQWlFQTtZQUNqRUEsdUJBQWtEQTtZQUN0Q0EscUJBQXdCQTtZQUNwQ0E7WUFBcUJBLElBQUlBLENBQUNBLEtBQUlBLDhDQUE2QkE7Z0JBRTNDQTtvQkFFSUEsZUFBbUJBLFdBQVdBO29CQUM5QkEsSUFBSUEsa0JBQWtCQTt3QkFFbEJBLElBQUlBLEFBQXFDQTs0QkFDckNBLHlDQUFjQSw4Q0FBc0NBLGVBQWVBLHVCQUF2QkE7O3dCQUNoREEsSUFBSUEsQUFBcUNBOzRCQUNyQ0EsdUNBQVlBLDhDQUFzQ0EsZUFBZUEscUJBQXZCQTs7Ozs7OztZQUsxREE7WUFDQUEsMEJBQTBCQTtZQUMxQkE7WUFDQUEsMEJBQTBCQTtZQUMxQkEsMEJBQTBCQTs7WUFFMUJBLHlCQUFzQ0Esd0RBQ2xEQSwwR0FBK0VBLDJEQUMvREEsK0JBQTBCQSw0REFBc0ZBLHNDQUNoSUEsNERBQXNGQSxzQ0FDdEZBLDREQUFzRkE7OztZQUt0RkEsbUJBQW1CQTs7dUJBQU1BLDRGQUErQ0EseURBQXlEQSw0RUFBOENBLHlEQUF5REE7OztZQUU1TkEsS0FBS0EsV0FBV0EsS0FBS0EsNkNBQWtCQTtnQkFFbkNBLFVBQTBCQSw2QkFBNkRBLDhCQUEwQkE7Z0JBQ2pJQSwyREFBMkVBLE1BQUlBLDREQUFnRUEsK0JBQStCQTtnQkFDOUpBLDJDQUFnQkEsS0FBSUEsaUVBQXdEQSw0RUFBMkRBLG9CQUFvQkEsNkJBQWtFQSw4QkFBZ0NBLE9BQW1CQSwwREFBWUEsR0FBWkEsMkNBQWlCQSw0RUFBMkRBLG9CQUFvQkEsNkJBQWtFQSw4QkFBZ0NBLE9BQW1CQSx3REFBVUEsR0FBVkE7OztZQUd6ZUEsa0JBQStEQSxBQUFxRkEsVUFBQ0E7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XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnM7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uRGlhZ25vc3RpY3MuQ29udHJhY3RzO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIEFwcFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBjb25zdCBpbnQgeE11bHRpcGxpZXIgPSAyMCwgeU11bHRpcGxpZXIgPSAyMDtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBzY3JlZW5XaWR0aCA9IFdpbmRvdy5Jbm5lcldpZHRoLCBzY3JlZW5IZWlnaHQgPSBXaW5kb3cuSW5uZXJIZWlnaHQ7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgd2lkdGggPSBzY3JlZW5XaWR0aCAvIHhNdWx0aXBsaWVyLCBoZWlnaHQgPSBzY3JlZW5IZWlnaHQgLyB5TXVsdGlwbGllcjtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBIb3RiYXIgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFN0eWxlID0ge1xyXG4gICAgICAgICAgICAgICAgUG9zaXRpb24gPSBQb3NpdGlvbi5BYnNvbHV0ZSxcclxuICAgICAgICAgICAgICAgIExlZnQgPSBcIjEwMHB4XCIsXHJcbiAgICAgICAgICAgICAgICBUb3AgPSBzdHJpbmcuRm9ybWF0KFwiezB9cHhcIixXaW5kb3cuSW5uZXJIZWlnaHQgLSA0MCkgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFJlc2V0KG1ha2VCbGFuazogdHJ1ZSlcclxuICAgICAgICAgICAgfSxcIkJsYW5rXCIpKVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFJlc2V0KClcclxuICAgICAgICAgICAgfSxcIlJlc2V0XCIpKVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IFNhdmVBc1N0YXJ0ZXIoKVxyXG4gICAgICAgICAgICB9LFwiU2F2ZSBhcyBTdGFydGVyXCIpKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIFJlc2V0IChib29sIG1ha2VCbGFuayA9IGZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKCFHbG9iYWwuQ29uZmlybShcIkFueSB1bnNhdmVkIGNoYW5nZXMgd2lsbCBiZSBsb3N0LiBDb250aW51ZT9cIikpIHJldHVybjtcclxuICAgICAgICAgICAgU3F1YXJlcy5DbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAoIW1ha2VCbGFuaylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgICAgIG9iamVjdCBzdGFydGVyUG9zaXRpb25zID0gR2xvYmFsLkxvY2FsU3RvcmFnZS5HZXRJdGVtKFwic3RhcnRlclBvc2l0aW9uc1wiKTtcclxuICAgICAgICAgICAgICAgIGlmIChzdGFydGVyUG9zaXRpb25zICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nIHMgPSAoc3RyaW5nKXN0YXJ0ZXJQb3NpdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdHJpbmcuSXNOdWxsT3JFbXB0eShzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAodmFyIHBvcyBpbiAoSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPltdPihzKSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTcXVhcmVzLkFkZChwb3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwbGF5aW5nKVxyXG4gICAgICAgICAgICAgICAgSW52ZXJ0SXNQbGF5aW5nKCk7XHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBTYXZlQXNTdGFydGVyICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IG9mZnNldENvb3JkcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oTmVnRGl2KG9mZnNldFBvcy5JdGVtMSwgeE11bHRpcGxpZXIpLCBOZWdEaXYob2Zmc2V0UG9zLkl0ZW0yLCB5TXVsdGlwbGllcikpO1xyXG4gICAgICAgICAgICBHbG9iYWwuTG9jYWxTdG9yYWdlLlNldEl0ZW0oXHJcbiAgICAgICAgICAgICAgICBcInN0YXJ0ZXJQb3NpdGlvbnNcIiwgSnNvbkNvbnZlcnQuU2VyaWFsaXplT2JqZWN0KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuVG9MaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PihTcXVhcmVzKS5Db252ZXJ0QWxsPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PigoQ29udmVydGVyPFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+LFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PikocyA9PiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHMuSXRlbTEgKyBvZmZzZXRDb29yZHMuSXRlbTEsIHMuSXRlbTIgKyBvZmZzZXRDb29yZHMuSXRlbTIpKSkpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IFNldHRpbmdzUG9wdXBDb250YWluZXIgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgSFRNTERpdkVsZW1lbnQoKSwoX28xKT0+e19vMS5TdHlsZS5Qb3NpdGlvbj0gUG9zaXRpb24uRml4ZWQ7X28xLlN0eWxlLlRvcD0gXCIwXCI7X28xLlN0eWxlLkxlZnQ9IFwiMFwiO19vMS5TdHlsZS5XaWR0aD0gXCIxMDAlXCI7X28xLlN0eWxlW1wieC1pbmRleFwiXT0gOTk5OTk5O19vMS5TdHlsZS5IZWlnaHQ9IFwiMTAwJVwiO19vMS5TdHlsZS5CYWNrZ3JvdW5kQ29sb3I9IFwicmdiYSgwLCAwLCAwLCAwLjUpXCI7X28xLlN0eWxlLkRpc3BsYXk9IERpc3BsYXkuTm9uZTtyZXR1cm4gX28xO30pXHJcbixTZXR0aW5nc1BvcHVwID0gbmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFN0eWxlID1cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBGb250U2l6ZSA9IFwiMS41cmVtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgQmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFBvc2l0aW9uID0gUG9zaXRpb24uRml4ZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgVG9wID0gXCIwcHhcIixcclxuICAgICAgICAgICAgICAgICAgICBMZWZ0ID0gXCIyNSVcIixcclxuICAgICAgICAgICAgICAgICAgICBXaWR0aCA9IFwiNTAlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgSGVpZ2h0ID0gXCIxMDAlXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgU2V0dGluZ3NQb3B1cDtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQnV0dG9uRWxlbWVudCBTZXR0aW5nc0J1dHRvbiA9IG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgSW5uZXJIVE1MID0gXCLimplcIixcclxuICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIiwgT25DbGljayA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTEJ1dHRvbkVsZW1lbnQgUGxheUJ1dHRvbiA9IG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgSW5uZXJIVE1MID0gXCLilrZcIixcclxuICAgICAgICAgICAgU3R5bGUgPSB7IENvbG9yID0gXCJncmVlblwiIH0sXHJcbiAgICAgICAgICAgIENsYXNzTmFtZSA9IFwiYnRuIGJ0bi1wcmltYXJ5XCIsIE9uQ2xpY2sgPSBlID0+IEludmVydElzUGxheWluZygpXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIEludmVydElzUGxheWluZyAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcGxheWluZyA9ICFwbGF5aW5nO1xyXG4gICAgICAgICAgICBQbGF5QnV0dG9uLlN0eWxlLkNvbG9yID0gcGxheWluZyA/IFwicmVkXCIgOiBcImdyZWVuXCI7XHJcbiAgICAgICAgICAgIFBsYXlCdXR0b24uSW5uZXJIVE1MID0gcGxheWluZyA/IFwi4o+4XCIgOiBcIuKWtlwiO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBwbGF5aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbFtdIGxpdmluZ1J1bGVzID0gbmV3IGJvb2xbOV0geyBmYWxzZSwgZmFsc2UsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSB9O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbFtdIGRlYWRSdWxlcyAgID0gbmV3IGJvb2xbOV0geyBmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UgfTtcclxucHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBDcmVhdGVDYW52YXMoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxDYW52YXNFbGVtZW50e1dpZHRoID0gc2NyZWVuV2lkdGgsIEhlaWdodCA9IHNjcmVlbkhlaWdodH07XHJcbn1wdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IENyZWF0ZVRvcENhbnZhcygpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTENhbnZhc0VsZW1lbnR7V2lkdGggPSB3aWR0aCArIDIsIEhlaWdodCA9IGhlaWdodCArIDJ9O1xyXG59cHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBDcmVhdGVCb3R0b21DYW52YXMoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxDYW52YXNFbGVtZW50e1dpZHRoID0gc2NyZWVuV2lkdGggKyAyICogeE11bHRpcGxpZXIsIEhlaWdodCA9IHNjcmVlbkhlaWdodCArIDIgKiB5TXVsdGlwbGllcn07XHJcbn1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IERPTUNhbnZhcyA9IENyZWF0ZUNhbnZhcygpLCBCb3R0b21DYW52YXMgPSBDcmVhdGVCb3R0b21DYW52YXMoKSwgVG9wQ2FudmFzID0gQ3JlYXRlVG9wQ2FudmFzKCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkRcclxuICAgICAgICAgICAgVG9wQ2FudmFzQ29udGV4dCA9IFRvcENhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSxcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dCA9IEJvdHRvbUNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSxcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dCA9IERPTUNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+IFNxdWFyZXMgPSBuZXcgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PigpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBvZmZzZXRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gTW91c2VQb3MgKHRoaXMgTW91c2VFdmVudCBlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHJlY3QgPSBET01DYW52YXMuR2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KChpbnQpKGUuQ2xpZW50WCAtIHJlY3QuTGVmdCksIChpbnQpKGUuQ2xpZW50WSAtIHJlY3QuVG9wKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBOZWdEaXYgKGludCBhLCBpbnQgYilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCByZXMgPSBhIC8gYjtcclxuICAgICAgICAgICAgcmV0dXJuIChhIDwgMCAmJiBhICE9IGIgKiByZXMpID8gcmVzIC0gMSA6IHJlcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBjb25zdCBpbnQgbWF4QWRqYWNlbnRDZWxscyA9IDg7XHJcblxyXG4gICAgICAgIHN0YXRpYyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPEhUTUxTZWxlY3RFbGVtZW50LEhUTUxTZWxlY3RFbGVtZW50Pj4gb3B0aW9uQ2VsbHMgPSBuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIVE1MU2VsZWN0RWxlbWVudCxIVE1MU2VsZWN0RWxlbWVudD4+KCk7XHJcblxyXG4gICAgICAgIHN0YXRpYyB2b2lkIEFwcGx5UHJlc2V0KGJvb2xbXSBsaXZpbmdSdWxlcywgYm9vbFtdIGRlYWRSdWxlcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDw9IDg7IG4rKylcclxuICAgICAgICAgICAge1xyXG5vcHRpb25DZWxsc1tuXS5JdGVtMS5TZXRCb29sVmFsdWUobGl2aW5nUnVsZXNbbl0pO1xyXG5vcHRpb25DZWxsc1tuXS5JdGVtMi5TZXRCb29sVmFsdWUoZGVhZFJ1bGVzW25dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE1haW4gKClcclxuICAgICAgICB7XHJcblN5c3RlbS5BY3Rpb248TW91c2VFdmVudDxIVE1MQ2FudmFzRWxlbWVudD4+IFByb2Nlc3NNb3VzZUV2ZW50ID0gbnVsbDtcblN5c3RlbS5GdW5jPEhUTUxTZWxlY3RFbGVtZW50PiBDcmVhdGUwMVNlbGVjdG9yID0gbnVsbDtcbiAgICAgICAgICAgIG9iamVjdCBydWxlc09iamVjdFN0ciA9IEdsb2JhbC5Mb2NhbFN0b3JhZ2UuR2V0SXRlbShcInJ1bGVzXCIpO1xyXG5zdHJpbmcgcjsgICAgICAgICAgICBpZiAoKHIgPSBydWxlc09iamVjdFN0ciBhcyBzdHJpbmcpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGR5bmFtaWMgcnVsZXNPYmogPSBKU09OLlBhcnNlKHIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChydWxlc09iamVjdFN0ciAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFNjcmlwdC5Xcml0ZShcInswfSBpbnN0YW5jZW9mIEFycmF5XCIsIHJ1bGVzT2JqLmxpdmluZ1J1bGVzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpdmluZ1J1bGVzID0gSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8Ym9vbFtdPihKU09OLlN0cmluZ2lmeShydWxlc09iai5saXZpbmdSdWxlcykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoU2NyaXB0LldyaXRlKFwiezB9IGluc3RhbmNlb2YgQXJyYXlcIiwgcnVsZXNPYmouZGVhZFJ1bGVzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYWRSdWxlcyA9IEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PGJvb2xbXT4oSlNPTi5TdHJpbmdpZnkocnVsZXNPYmouZGVhZFJ1bGVzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggeyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5TdHlsZVtcInVzZXItc2VsZWN0XCJdID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkhlYWQuQXBwZW5kQ2hpbGQobmV3IEhUTUxMaW5rRWxlbWVudCB7IFJlbCA9IFwic3R5bGVzaGVldFwiLCBIcmVmID0gXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2Jvb3RzdHJhcEA1LjIuMC9kaXN0L2Nzcy9ib290c3RyYXAubWluLmNzc1wiIH0pO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LlN0eWxlLk1hcmdpbiA9IFwiMHB4XCI7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQoU2V0dGluZ3NQb3B1cENvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQobmV3IEhUTUxTdHlsZUVsZW1lbnQgeyBJbm5lckhUTUwgPSBcInRkLCB0aCB7IGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrOyBwYWRkaW5nOiA1cHggfSBidXR0b24geyBtYXJnaW4tcmlnaHQ6IDVweCB9XCIgfSk7XHJcblxyXG4gICAgICAgICAgICBIVE1MVGFibGVFbGVtZW50IGFkamFjZW50Q2VsbHNUYWJsZSA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlRWxlbWVudD4oXHJcbm5ldyBIVE1MVGFibGVFbGVtZW50IHsgU3R5bGUgPSB7IE1hcmdpbkxlZnQgPSBcImF1dG9cIiwgTWFyZ2luUmlnaHQgPSBcImF1dG9cIiB9IH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVSb3dFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVSb3dFbGVtZW50KCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQoKSxcIiNcIiksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50KCksXCJMXCIpLFxyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudCgpLFwiRFwiKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgXHJcbkNyZWF0ZTAxU2VsZWN0b3IgPSAoKSA9PiBuZXcgSFRNTFNlbGVjdEVsZW1lbnQoKS5BZGQ8SFRNTFNlbGVjdEVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudHtWYWx1ZSA9IFwiZmFsc2VcIn0sIFwiMFwiKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCJ0cnVlXCJ9LCBcIjFcIikpO1xuXHJcbiAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDw9IG1heEFkamFjZW50Q2VsbHM7IG4rKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSFRNTFRhYmxlUm93RWxlbWVudCByb3cgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlUm93RWxlbWVudD4obmV3IEhUTUxUYWJsZVJvd0VsZW1lbnQoKSxhZGphY2VudENlbGxzVGFibGUpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KCAgICAgICAgICAgICAgICByb3csQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSxuLlRvU3RyaW5nKCkpKTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbkNlbGxzLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8SFRNTFNlbGVjdEVsZW1lbnQsIEhUTUxTZWxlY3RFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFNlbGVjdEVsZW1lbnQ+KENyZWF0ZTAxU2VsZWN0b3IoKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudD4obmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpLCByb3cpKS5TZXRCb29sVmFsdWUobGl2aW5nUnVsZXNbbl0pLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFNlbGVjdEVsZW1lbnQ+KENyZWF0ZTAxU2VsZWN0b3IoKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudD4obmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpLCByb3cpKS5TZXRCb29sVmFsdWUoZGVhZFJ1bGVzW25dKSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPHN0cmluZyAsYm9vbFtdICxib29sW10gPj4gcHJlc2V0c0xpc3QgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcgLGJvb2xbXSAsYm9vbFtdID4+KCksKF9vMSk9PntfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcsIGJvb2xbXSwgYm9vbFtdPihcIkNvbndheSdzIEdhbWUgb2YgTGlmZSBQcmVzZXRcIiwgbmV3IGJvb2xbOV17ZmFsc2UsIGZhbHNlLCB0cnVlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9KSk7X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJJbW1vcnRhbCBDZWxscyBQcmVzZXRcIiwgbmV3IGJvb2xbOV17dHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZX0sIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0pKTtfbzEuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxzdHJpbmcsIGJvb2xbXSwgYm9vbFtdPihcIkFsbW9zdCBJbW1vcnRhbCBDZWxscyBQcmVzZXRcIiwgbmV3IGJvb2xbOV17dHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2V9LCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2V9KSk7X28xLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8c3RyaW5nLCBib29sW10sIGJvb2xbXT4oXCJBbHRlcm5hdGUgQ29ud2F5J3MgR2FtZSBvZiBMaWZlIFByZXNldFwiLCBuZXcgYm9vbFs5XXtmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZX0sIG5ldyBib29sWzlde2ZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlfSkpO3JldHVybiBfbzE7fSk7XHJcblxyXG4gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCBwcmVzZXRzRGl2ID0gbmV3IEhUTUxEaXZFbGVtZW50IHsgU3R5bGUgPSB7IFRleHRBbGlnbiA9IFRleHRBbGlnbi5DZW50ZXIgfSB9O1xyXG5mb3JlYWNoICh2YXIgX2QxIGluIHByZXNldHNMaXN0KVxyXG57XHJcbiAgICBzdHJpbmcgbmFtZTtcclxuICAgIGJvb2xbXSBsaXZpbmdSdWxlcztcclxuICAgIGJvb2xbXSBkZWFkUnVsZXM7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KF9kMSwgb3V0IG5hbWUsIG91dCBsaXZpbmdSdWxlcywgb3V0IGRlYWRSdWxlcyk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KCAgICBwcmVzZXRzRGl2LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCgpLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEFuY2hvckVsZW1lbnQ+KG5ldyBIVE1MQW5jaG9yRWxlbWVudHtIcmVmID0gXCJqYXZhc2NyaXB0OnZvaWQoMClcIiwgU3R5bGUgPSB7Rm9udFNpemUgPSBcIjFyZW1cIn0sIE9uQ2xpY2sgPSBlID0+IEFwcGx5UHJlc2V0KGxpdmluZ1J1bGVzOiBsaXZpbmdSdWxlcywgZGVhZFJ1bGVzOiBkZWFkUnVsZXMpfSxuYW1lKSkpO1xyXG59XG5cclxuICAgICAgICAgICAgU2V0dGluZ3NCdXR0b24uT25DbGljayA9IGUgPT4gU2V0dGluZ3NQb3B1cENvbnRhaW5lci5TdHlsZS5EaXNwbGF5ID0gXCJcIjtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oXHJcbiAgICAgICAgICAgIFNldHRpbmdzUG9wdXAsYWRqYWNlbnRDZWxsc1RhYmxlKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxuZXcgSFRNTEJSRWxlbWVudCgpLCBwcmVzZXRzRGl2LCBuZXcgSFRNTEJSRWxlbWVudCgpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIixcclxuICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPD0gbWF4QWRqYWNlbnRDZWxsczsgbisrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGl2aW5nUnVsZXNbbl0gPSBvcHRpb25DZWxsc1tuXS5JdGVtMS5Cb29sVmFsdWUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVhZFJ1bGVzW25dID0gb3B0aW9uQ2VsbHNbbl0uSXRlbTIuQm9vbFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbC5Mb2NhbFN0b3JhZ2UuU2V0SXRlbShcInJ1bGVzXCIsIEpzb25Db252ZXJ0LlNlcmlhbGl6ZU9iamVjdChuZXdcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpdmluZ1J1bGVzID0gbGl2aW5nUnVsZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYWRSdWxlcyA9IGRlYWRSdWxlc1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICBTZXR0aW5nc1BvcHVwQ29udGFpbmVyLlN0eWxlLkRpc3BsYXkgPSBEaXNwbGF5Lk5vbmU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXCJTYXZlIENoYW5nZXNcIikpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIEhvdGJhci5BcHBlbmRDaGlsZChQbGF5QnV0dG9uKTtcclxuICAgICAgICAgICAgSG90YmFyLkFwcGVuZENoaWxkKFNldHRpbmdzQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IGJhY2tncm91bmREaXYgPSBuZXcgSFRNTERpdkVsZW1lbnQgeyBTdHlsZSA9IHsgUG9zaXRpb24gPSBQb3NpdGlvbi5SZWxhdGl2ZSwgTWluV2lkdGggPSBcIjBcIiwgTWluSGVpZ2h0ID0gXCIwXCIgfX07XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5PdmVyZmxvdyA9IE92ZXJmbG93LkhpZGRlbjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLlpJbmRleCA9IFwiLTFcIjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLlBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuTGVmdCA9IFwiMHB4XCI7XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5Ub3AgPSBcIjBweFwiO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kRGl2LkFwcGVuZENoaWxkKERPTUNhbnZhcyk7XHJcbiAgICAgICAgICAgIC8vYmFja2dyb3VuZERpdi5BcHBlbmRDaGlsZChuZXcgSFRNTEJSRWxlbWVudCgpKTtcclxuICAgICAgICAgICAgYmFja2dyb3VuZERpdi5BcHBlbmRDaGlsZChIb3RiYXIpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKGJhY2tncm91bmREaXYpO1xyXG5cclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5TdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5UcmFuc2xhdGUoMC41LCAwLjUpO1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVXaWR0aCA9IDE7XHJcbiAgICAgICAgICAgIGZvciAoaW50IHggPSAwOyB4IDw9ICh3aWR0aCArIDIpOyB4KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTW92ZVRvKHggKiB4TXVsdGlwbGllciwgMCk7XHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVUbyh4ICogeE11bHRpcGxpZXIsIChoZWlnaHQgKyAzKSAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGludCB5ID0gMDsgeSA8PSAoaGVpZ2h0ICsgMik7IHkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5Nb3ZlVG8oMCwgeSAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKCh3aWR0aCArIDMpICogeE11bHRpcGxpZXIsIHkgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPCAxMDsgbisrKVxyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5TdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhZ2dpbmdQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IG9yaWdpbmFsUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgYm9vbCBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5Pbk1vdXNlRG93biA9IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSB0cnVlO1xyXG5pbnQgeDtcbmludCB5O1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChlLk1vdXNlUG9zKCksIG91dCB4LCBvdXQgeSk7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZ1BvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCAtIG9mZnNldFBvcy5JdGVtMSwgeSAtIG9mZnNldFBvcy5JdGVtMik7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFBvcyA9IG9mZnNldFBvcztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLk9uTW91c2VVcCA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMS0gb3JpZ2luYWxQb3MuSXRlbTEpID4geE11bHRpcGxpZXIgfHwgTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0yLSBvcmlnaW5hbFBvcy5JdGVtMikgPiB5TXVsdGlwbGllcilcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmdQb3MgPSBvZmZzZXRQb3M7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5Pbk1vdXNlTW92ZSA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKChlLkJ1dHRvbnMgJiAxKSA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBpZiAoZHJhZ2dpbmdQb3MgPT0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKSkgZHJhZ2dpbmdQb3MgPSBlLk1vdXNlUG9zKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbW91c2VQb3MgPSBlLk1vdXNlUG9zKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0xLSBvcmlnaW5hbFBvcy5JdGVtMSkgPiB4TXVsdGlwbGllciB8fCBNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTEtIG9yaWdpbmFsUG9zLkl0ZW0xKSA+IHlNdWx0aXBsaWVyKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KG1vdXNlUG9zLkl0ZW0xIC0gZHJhZ2dpbmdQb3MuSXRlbTEsIG1vdXNlUG9zLkl0ZW0yIC0gZHJhZ2dpbmdQb3MuSXRlbTIpO1xyXG4gICAgICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgICAgICB9O1xyXG5Qcm9jZXNzTW91c2VFdmVudCA9IChlKSA9PlxyXG57XHJcbiAgICAvL2lmICgoQGV2ZW50LkJ1dHRvbnMgJiAxKSA9PSAwKSByZXR1cm47XHJcbiAgICB2YXIgbW91c2VQb3MgPSBlLk1vdXNlUG9zKCk7XHJcbiAgICBpbnQgY2xpY2tYO1xyXG4gICAgaW50IGNsaWNrWTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihOZWdEaXYobW91c2VQb3MuSXRlbTEgLSBvZmZzZXRQb3MuSXRlbTEsIHhNdWx0aXBsaWVyKSwgTmVnRGl2KChtb3VzZVBvcy5JdGVtMiAtIG9mZnNldFBvcy5JdGVtMiksIHlNdWx0aXBsaWVyKSksIG91dCBjbGlja1gsIG91dCBjbGlja1kpO1xyXG4gICAgaWYgKCFTcXVhcmVzLlJlbW92ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGNsaWNrWCwgY2xpY2tZKSkpXHJcbiAgICAgICAgU3F1YXJlcy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihjbGlja1gsIGNsaWNrWSkpO1xyXG4gICAgRHJhdygpO1xyXG59XHJcblxyXG47XG4gICAgICAgICAgICBET01DYW52YXMuT25DbGljayA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoYW5naW5nSW50ZW50KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFByb2Nlc3NNb3VzZUV2ZW50KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBHbG9iYWwuU2V0SW50ZXJ2YWwoKEFjdGlvbilOZXh0RnJhbWUsIDEwMCk7XHJcblxyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgdXBkYXRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgTnVtYmVyT2ZBZGphY2VudENlbGxzIChpbnQgeCwgaW50IHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgYWRqYWNlbnRDZWxscyA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoaW50IEwgPSAwOyBMIDw9IDg7IEwrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKEwgPT0gNCkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaW50IHhfID0geCAtIDEgKyAoTCAlIDMpLFxyXG4gICAgICAgICAgICAgICAgICAgIHlfID0geSAtIDEgKyBMIC8gMztcclxuXHJcbiAgICAgICAgICAgICAgICAvL2lmICh4XyA8IDAgfHwgeF8gPj0gd2lkdGggfHwgeV8gPCAwIHx8IHlfID49IGhlaWdodCkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKFNxdWFyZXMuQ29udGFpbnMobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4XywgeV8pKSlcclxuICAgICAgICAgICAgICAgICAgICBhZGphY2VudENlbGxzKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFkamFjZW50Q2VsbHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vdXBkYXRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4gcmVtb3ZpbmcgPSBuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oKTtcclxuICAgICAgICAgICAgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4gYWRkaW5nID0gbmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4+KCk7XHJcbmZvcmVhY2ggKHZhciBfZDIgaW4gU3F1YXJlcylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2QyLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaW50IGFkamFjZW50Q2VsbHMgPSAwO1xyXG4gICAgZm9yIChpbnQgTCA9IDA7IEwgPD0gODsgTCsrKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChMID09IDQpXHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIGludCB4XyA9IHggLSAxICsgKEwgJSAzKSwgeV8gPSB5IC0gMSArIEwgLyAzO1xyXG4gICAgICAgIGlmIChTcXVhcmVzLkNvbnRhaW5zKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeF8sIHlfKSkpXHJcbiAgICAgICAgICAgIGFkamFjZW50Q2VsbHMrKztcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IGNlbGxzLlxyXG4gICAgICAgICAgICAvLyBPcHRpbWl6YXRpb24gZm9yIHJ1bGUgb2YgMyBhZGphY2VudCBjZWxsc1xyXG4gICAgICAgICAgICAvL2lmIChMICE9IDcgJiYgTCAhPSA4KVxyXG4gICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgIGlmIChkZWFkUnVsZXNbTnVtYmVyT2ZBZGphY2VudENlbGxzKHhfLCB5XyldKVxyXG4gICAgICAgICAgICAgICAgYWRkaW5nLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHhfLCB5XykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWxpdmluZ1J1bGVzW2FkamFjZW50Q2VsbHNdKVxyXG4gICAgICAgIHJlbW92aW5nLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHgsIHkpKTtcclxufVxuZm9yZWFjaCAodmFyIF9kMyBpbiByZW1vdmluZylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2QzLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaWYgKCFTcXVhcmVzLlJlbW92ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHgsIHkpKSlcclxuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiU3F1YXJlIHRyaWVkIHRvIGJlIHJlbW92ZWQgYnV0IGRpZG4ndCBleGlzdFwiKTtcclxufVxuZm9yZWFjaCAodmFyIF9kNCBpbiBhZGRpbmcpXHJcbntcclxuICAgIGludCB4O1xyXG4gICAgaW50IHk7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KF9kNCwgb3V0IHgsIG91dCB5KTtcclxuICAgIFNxdWFyZXMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSkpO1xyXG59XG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIERyYXcgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuQ2xlYXJSZWN0KDAsIDAsIERPTUNhbnZhcy5XaWR0aCwgRE9NQ2FudmFzLkhlaWdodCk7XHJcbiAgICAgICAgICAgIFRvcENhbnZhc0NvbnRleHQuQ2xlYXJSZWN0KDAsIDAsIERPTUNhbnZhcy5XaWR0aCwgRE9NQ2FudmFzLkhlaWdodCk7XHJcbmludCBvZmZzZXRYO1xuaW50IG9mZnNldFk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KG9mZnNldFBvcywgb3V0IG9mZnNldFgsIG91dCBvZmZzZXRZKTtcclxuICAgICAgICAgICAgaW50IGwgPSAod2lkdGggKyAyKSAqIChoZWlnaHQgKyAyKTtcclxuICAgICAgICAgICAgVWludDhDbGFtcGVkQXJyYXkgaW1hZ2VEYXRhQXJyYXkgPSBuZXcgVWludDhDbGFtcGVkQXJyYXkobCAqIDQpO1xyXG5mb3JlYWNoICh2YXIgX2Q1IGluIFNxdWFyZXMpXHJcbntcclxuICAgIGludCB4O1xyXG4gICAgaW50IHk7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KF9kNSwgb3V0IHgsIG91dCB5KTtcclxuICAgIGludCBkcmF3WCA9IHggKyAob2Zmc2V0WCAvIHhNdWx0aXBsaWVyKSArIDEsIGRyYXdZID0geSArIChvZmZzZXRZIC8geU11bHRpcGxpZXIpICsgMTtcclxuICAgIGlmIChkcmF3WCA8IDAgfHwgZHJhd1ggPj0gd2lkdGggKyAyIHx8IGRyYXdZIDwgMCB8fCBkcmF3WSA+PSBoZWlnaHQgKyAyKVxyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgaW50IGlkeCA9IGRyYXdYICsgZHJhd1kgKiAod2lkdGggKyAyKTtcclxuICAgIGltYWdlRGF0YUFycmF5W2lkeCAqIDQgKyAzXSA9IDI1NTtcclxufVxuICAgICAgICAgICAgSW1hZ2VEYXRhIGltYWdlRGF0YSA9IG5ldyBJbWFnZURhdGEoaW1hZ2VEYXRhQXJyYXksICh1aW50KSh3aWR0aCArIDIpLCAodWludCkoaGVpZ2h0ICsgMikpO1xyXG4gICAgICAgICAgICBUb3BDYW52YXNDb250ZXh0LkltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBUb3BDYW52YXNDb250ZXh0LlB1dEltYWdlRGF0YShpbWFnZURhdGEsIDAsIDApO1xyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0LkRyYXdJbWFnZShCb3R0b21DYW52YXMsIG9mZnNldFggJSB4TXVsdGlwbGllciAtIHhNdWx0aXBsaWVyLCBvZmZzZXRZICUgeU11bHRpcGxpZXIgLSB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0ltYWdlKFRvcENhbnZhcywgKG9mZnNldFggJSB4TXVsdGlwbGllcikgLSB4TXVsdGlwbGllciwgKG9mZnNldFkgJSB5TXVsdGlwbGllcikgLSB5TXVsdGlwbGllciwgKHdpZHRoICsgMikgKiB4TXVsdGlwbGllciwgKGhlaWdodCArIDIpICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgZnJhbWVOdW0gPSAwO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTmV4dEZyYW1lICgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoIXBsYXlpbmcpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGJvb2wgc2tpcEZyYW1lcyA9IFNxdWFyZXMuQ291bnQgPj0gMjUwO1xyXG4gICAgICAgICAgICBpbnQgdXBkYXRlc1BlckRyYXcgPSAxOy8vIHNraXBGcmFtZXMgPyAyIDogMTtcclxuICAgICAgICAgICAgZnJhbWVOdW0rKztcclxuICAgICAgICAgICAgaWYgKHNraXBGcmFtZXMgJiYgKGZyYW1lTnVtICUgdXBkYXRlc1BlckRyYXcpICE9IDApIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDwgdXBkYXRlc1BlckRyYXc7IG4rKylcclxuICAgICAgICAgICAgICAgIFVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UZXh0LlJlZ3VsYXJFeHByZXNzaW9ucztcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgRXh0ZW5zaW9uc1xyXG4gICAge1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIigoZSwgYykgPT4gYy5hcHBlbmRDaGlsZChlKSkoe2VsZW1lbnR9LCB7Y29udGFpbmluZ0VsZW19KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIEFkZFRvPFQ+KHRoaXMgVCBlbGVtZW50LCBOb2RlIGNvbnRhaW5pbmdFbGVtKSB3aGVyZSBUIDogTm9kZTtcclxuICAgICAgICAvL3B1YmxpYyBzdGF0aWMgVCBBZGRUb0JvZHk8VD4odGhpcyBUIG4pIHdoZXJlIFQgOiBOb2RlID0+IEFwcC5yb290LkFwcGVuZENoaWxkPFQ+KG4pO1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIntub2RlfS5hcHBlbmRDaGlsZCh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgQXBwZW5kQ2hpbGQ8VD4odGhpcyBOb2RlIG5vZGUsIFQgZWxlbWVudCkgd2hlcmUgVCA6IE5vZGU7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc3R5bGUuZGlzcGxheSA9ICdub25lJywgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBIaWRlPFQ+KHRoaXMgVCBlbGVtZW50KSB3aGVyZSBUIDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc3R5bGUuZGlzcGxheSA9ICcnLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIFNob3c8VD4odGhpcyBUIGVsZW1lbnQpIHdoZXJlIFQgOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBbVGVtcGxhdGUoXCIobGkgPT4gKGxpLmFwcGVuZENoaWxkKHtlbGVtZW50fSksIGxpKSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gSFRNTExJRWxlbWVudCBXcmFwTGkodGhpcyBOb2RlIGVsZW1lbnQpO1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihkaXYgPT4gKGRpdi5hcHBlbmRDaGlsZCh7ZWxlbWVudH0pLCBkaXYpKShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gSFRNTERpdkVsZW1lbnQgV3JhcERpdih0aGlzIE5vZGUgZWxlbWVudCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBUIEFkZDxUPih0aGlzIFQgZWxlbWVudCwgcGFyYW1zIFVuaW9uPE5vZGUsIHN0cmluZz5bXSBub2Rlcykgd2hlcmUgVCA6IE5vZGVcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFVuaW9uPE5vZGUsIHN0cmluZz4gbm9kZSBpbiBub2RlcylcclxuICAgICAgICAgICAgICAgIGlmIChub2RlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChub2RlLklzPHN0cmluZz4oKSlcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LkFwcGVuZENoaWxkKG5ldyBUZXh0KG5vZGUuQXM8c3RyaW5nPigpKSk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5BcHBlbmRDaGlsZChub2RlLkFzPE5vZGU+KCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgVCBBZGRFbGVtZW50PFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgc3RyaW5nPltdIG5vZGVzKVxyXG4gICAgd2hlcmUgVCA6IE5vZGVcclxue1xyXG4gICAgcmV0dXJuIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8VD4oZWxlbWVudCxub2Rlcyk7XHJcbn1wdWJsaWMgc3RhdGljIFQgQWRkRGl2PFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgc3RyaW5nPltdIG5vZGVzKVxyXG4gICAgd2hlcmUgVCA6IE5vZGVcclxue1xyXG4gICAgcmV0dXJuIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8VD4oZWxlbWVudCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihuZXcgSFRNTERpdkVsZW1lbnQoKSxub2RlcykpO1xyXG59cHVibGljIHN0YXRpYyBUIEFkZFVsPFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgVW5pb248Tm9kZSwgc3RyaW5nPltdLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFVMaXN0RWxlbWVudD4obmV3IEhUTUxVTGlzdEVsZW1lbnQoKSxTeXN0ZW0uQXJyYXlFeHRlbnNpb25zLk1hcDxVbmlvbjxOb2RlLFVuaW9uPE5vZGUsIHN0cmluZz5bXSxzdHJpbmc+LFVuaW9uPE5vZGUsc3RyaW5nPj4obm9kZXMsKEZ1bmM8VW5pb248Tm9kZSxVbmlvbjxOb2RlLCBzdHJpbmc+W10sc3RyaW5nPixVbmlvbjxOb2RlLHN0cmluZz4+KShuID0+IChVbmlvbjxOb2RlLCBzdHJpbmc+KShuLklzPFVuaW9uPE5vZGUsIHN0cmluZz5bXT4oKSA/IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTExJRWxlbWVudD4obmV3IEhUTUxMSUVsZW1lbnQoKSxuLkFzPFVuaW9uPE5vZGUsIHN0cmluZz5bXT4oKSkgOiBuLklzPHN0cmluZz4oKSA/IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTExJRWxlbWVudD4obmV3IEhUTUxMSUVsZW1lbnQoKSxuLkFzPHN0cmluZz4oKSkgOiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxMSUVsZW1lbnQ+KG5ldyBIVE1MTElFbGVtZW50KCksbi5BczxOb2RlPigpKSkpKSkpO1xyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgQWRkQ2FtZWxTcGFjZSh0aGlzIHN0cmluZyBzdHIpXHJcbntcclxuICAgIHJldHVybiBSZWdleC5SZXBsYWNlKFJlZ2V4LlJlcGxhY2Uoc3RyLCBAXCIoW15fYS16XSkoW15fYS16XVthLXpdKVwiLCBcIiQxICQyXCIpLCBAXCIoW2Etel0pKFteX2Etel0pXCIsIFwiJDEgJDJcIik7XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBUb0NhbWVsU3RyaW5nPFQ+KHRoaXMgVCBlKVxyXG4gICAgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxue1xyXG4gICAgcmV0dXJuIGUuVG9TdHJpbmcoKS5BZGRDYW1lbFNwYWNlKCkuUmVwbGFjZSgnXycsICcgJyk7XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgQWRkRW51bTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdCwgVD8gZGVmYXVsdFZhbHVlID0gbnVsbCwgc3RyaW5nIGRlZmF1bHRWYWx1ZVN0cmluZyA9IFwiXCIpIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoZGVmYXVsdFZhbHVlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICBzZWxlY3QuQWRkKEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudCB7IFZhbHVlID0gXCJcIiwgU2VsZWN0ZWQgPSB0cnVlLCBEaXNhYmxlID0gdHJ1ZSB9LGRlZmF1bHRWYWx1ZVN0cmluZykpO1xyXG4gICAgICAgICAgICBmb3JlYWNoIChUIHZhbHVlIGluIFN5c3RlbS5FbnVtLkdldFZhbHVlcyh0eXBlb2YoVCkpKVxyXG4gICAgICAgICAgICAgICAgc2VsZWN0LkFkZChDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnRcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBWYWx1ZSA9ICgoaW50KShvYmplY3QpdmFsdWUpLlRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgU2VsZWN0ZWQgPSBvYmplY3QuRXF1YWxzKGRlZmF1bHRWYWx1ZSwgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB9LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5Ub0NhbWVsU3RyaW5nPFQ+KHZhbHVlKSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBib29sIEJvb2xWYWx1ZSh0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdClcclxue1xyXG4gICAgcmV0dXJuIHNlbGVjdC5WYWx1ZSA9PSBcInRydWVcIiA/IHRydWUgOiBmYWxzZTtcclxufXB1YmxpYyBzdGF0aWMgVD8gVmFsdWU8VD4odGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QpXHJcbiAgICB3aGVyZSBUIDogc3RydWN0LCBTeXN0ZW0uRW51bVxyXG57XHJcbiAgICByZXR1cm4gc2VsZWN0LlZhbHVlID09IFwiXCIgPyBudWxsIDogKFQ/ICkoVCkob2JqZWN0KWludC5QYXJzZShzZWxlY3QuVmFsdWUpO1xyXG59ICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxTZWxlY3RFbGVtZW50IFNldEJvb2xWYWx1ZSh0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdCwgYm9vbCB2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGVjdC5WYWx1ZSA9IHZhbHVlLlRvU3RyaW5nKCkuVG9Mb3dlcigpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxTZWxlY3RFbGVtZW50IFNldFZhbHVlPFQ+KHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBUIHZhbHVlKSB3aGVyZSBUIDogc3RydWN0LCBTeXN0ZW0uRW51bVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZWN0LlZhbHVlID0gKChpbnQpKG9iamVjdCl2YWx1ZSkuVG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgc3RyaW5nIFRvVGltZVN0cmluZyh0aGlzIFRpbWVTcGFuIHRpbWUpXHJcbntcclxuICAgIHJldHVybiB0aW1lLlRvU3RyaW5nKHRpbWUgPj0gVGltZVNwYW4uRnJvbUhvdXJzKDEpID8gQFwiaFxcOm1tXFw6c3NcIiA6IEBcIm1cXDpzc1wiKTtcclxufSAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc2V0Q3VzdG9tVmFsaWRpdHkoe21lc3NhZ2V9KSwgZS5yZXBvcnRWYWxpZGl0eSgpLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIFNldEN1c3RvbVZhbGlkaXR5PFQ+KHRoaXMgVCBlbGVtZW50LCBzdHJpbmcgbWVzc2FnZSkgd2hlcmUgVCA6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihlID0+IChlLnNldEF0dHJpYnV0ZSgnbGlzdCcsIHtkYXRhbGlzdElEfSksIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIEhUTUxJbnB1dEVsZW1lbnQgU2V0RGF0YUxpc3QodGhpcyBIVE1MSW5wdXRFbGVtZW50IGVsZW1lbnQsIHN0cmluZyBkYXRhbGlzdElEKTtcclxuICAgICAgICAvL1tUZW1wbGF0ZShcIntlbGVtfS5hcHBlbmRDaGlsZCh7YWRkaW5nfSlcIildXHJcbiAgICAgICAgLy9wdWJsaWMgc3RhdGljIGV4dGVybiBUIEFwcGVuZDxUPiAodGhpcyBOb2RlIGVsZW0sIFQgYWRkaW5nKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gSm9pbkJSKHRoaXMgSUVudW1lcmFibGU8c3RyaW5nPiBzdHJpbmdzKVxyXG4gICAgICAgIHtcclxuU3lzdGVtLkZ1bmM8SUVudW1lcmFibGU8VW5pb248Tm9kZSwgc3RyaW5nPj4+IElubmVyID0gbnVsbDtcbiAgICAgICAgICAgIFxyXG5Jbm5lciA9ICgpID0+XHJcbntcclxuICAgIHVzaW5nICh2YXIgZW51bWVyID0gc3RyaW5ncy5HZXRFbnVtZXJhdG9yKCkpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKCFlbnVtZXIuTW92ZU5leHQoKSlcclxuICAgICAgICAgICAgeWllbGQgYnJlYWs7XHJcbiAgICAgICAgeWllbGQgcmV0dXJuIGVudW1lci5DdXJyZW50O1xyXG4gICAgICAgIHdoaWxlIChlbnVtZXIuTW92ZU5leHQoKSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiBuZXcgSFRNTEJSRWxlbWVudCgpO1xyXG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gZW51bWVyLkN1cnJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG47XG4gICAgICAgICAgICByZXR1cm4gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Ub0FycmF5PFVuaW9uPE5vZGUsc3RyaW5nPj4oSW5uZXIoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdCn0K
