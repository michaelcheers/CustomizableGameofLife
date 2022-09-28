/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2022
 * @compiler Bridge.NET 17.10.1
 */
Bridge.assembly("CustomizableGameofLife", function ($asm, globals) {
    "use strict";

    Bridge.define("CustomizableGameofLife.App", {
        main: function Main () {
            var $t;
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
            document.body.appendChild(($t = document.createElement("style"), $t.innerHTML = "td, th { border: 1px solid black; padding: 5px }", $t));

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

            var presets = CustomizableGameofLife.Extensions.Add(HTMLDivElement, ($t = document.createElement("div"), $t.style.textAlign = "center", $t), [CustomizableGameofLife.Extensions.Add(HTMLAnchorElement, ($t = document.createElement("a"), $t.href = "javascript:void(0)", $t.style.fontSize = "1rem", $t.onclick = function (e) {
                CustomizableGameofLife.App.ApplyPreset(System.Array.init([false, false, true, true, false, false, false, false, false], System.Boolean), System.Array.init([false, false, false, true, false, false, false, false, false], System.Boolean));
            }, $t), ["Conway's Game of Life Preset"])]);

            CustomizableGameofLife.App.SettingsButton.onclick = function (e) {
                CustomizableGameofLife.App.SettingsPopupContainer.style.display = "";
            };
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [adjacentCellsTable]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [document.createElement("br"), presets, document.createElement("br")]);
            CustomizableGameofLife.Extensions.Add(HTMLDivElement, CustomizableGameofLife.App.SettingsPopup, [CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t = document.createElement("button"), $t.className = "btn btn-primary", $t.onclick = function (e) {
                for (var n1 = 0; n1 <= CustomizableGameofLife.App.maxAdjacentCells; n1 = (n1 + 1) | 0) {
                    CustomizableGameofLife.App.livingRules[System.Array.index(n1, CustomizableGameofLife.App.livingRules)] = CustomizableGameofLife.Extensions.BoolValue(CustomizableGameofLife.App.optionCells.getItem(n1).$clone().Item1);
                    CustomizableGameofLife.App.deadRules[System.Array.index(n1, CustomizableGameofLife.App.deadRules)] = CustomizableGameofLife.Extensions.BoolValue(CustomizableGameofLife.App.optionCells.getItem(n1).$clone().Item2);
                }
                Bridge.global.localStorage.setItem("rules", Newtonsoft.Json.JsonConvert.SerializeObject({ livingRules: CustomizableGameofLife.App.livingRules, deadRules: CustomizableGameofLife.App.deadRules }));
                CustomizableGameofLife.App.SettingsPopupContainer.style.display = "none";
            }, $t), ["Save Changes"])]);


            CustomizableGameofLife.App.Hotbar.appendChild(CustomizableGameofLife.App.PlayButton);
            CustomizableGameofLife.App.Hotbar.appendChild(CustomizableGameofLife.App.SettingsButton);

            var backgroundDiv = ($t = document.createElement("div"), $t.style.position = "relative", $t.style.minWidth = "0", $t.style.minHeight = "0", $t);
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
                ResetButton: null,
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
                    this.Hotbar = CustomizableGameofLife.Extensions.Add(HTMLDivElement, ($t = document.createElement("div"), $t.style.position = "absolute", $t.style.left = "100px", $t.style.top = System.String.format("{0}px", [Bridge.box(((window.innerHeight - 30) | 0), System.Int32)]), $t), [($t = CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t1 = document.createElement("button"), $t1.onclick = function (e) {
                        CustomizableGameofLife.App.Squares.clear();
                        if (CustomizableGameofLife.App.playing) {
                            CustomizableGameofLife.App.InvertIsPlaying();
                        }
                        CustomizableGameofLife.App.Draw();
                    }, $t1), ["Reset"]), CustomizableGameofLife.App.ResetButton = $t, $t)]);
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
                        }(document.createElement("div")), [($t1 = ($t2 = document.createElement("div"), $t2.style.fontSize = "1.5rem", $t2.style.backgroundColor = "white", $t2.style.position = "fixed", $t2.style.top = "0px", $t2.style.left = "25%", $t2.style.width = "50%", $t2.style.height = "100%", $t2), CustomizableGameofLife.App.SettingsPopup = $t1, $t1)]);
                    this.SettingsButton = ($t2 = document.createElement("button"), $t2.innerHTML = "\u2699", $t2.onclick = function (e) {

                    }, $t2);
                    this.PlayButton = ($t2 = document.createElement("button"), $t2.innerHTML = "\u25b6", $t2.style.color = "green", $t2.onclick = function (e) {
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
                            var _d1 = $t.Current.$clone();
                            var x = { };
                            var y = { };
                            Bridge.Deconstruct(_d1.$clone(), x, y);
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
                            var _d2 = $t1.Current.$clone();
                            var x1 = { };
                            var y1 = { };
                            Bridge.Deconstruct(_d2.$clone(), x1, y1);
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
                            var _d3 = $t2.Current.$clone();
                            var x2 = { };
                            var y2 = { };
                            Bridge.Deconstruct(_d3.$clone(), x2, y2);
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
                            var _d4 = $t.Current.$clone();
                            var x = { };
                            var y = { };
                            Bridge.Deconstruct(_d4.$clone(), x, y);
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

    Bridge.define("CustomizableGameofLife.Square", {
        fields: {
            IsCell: false,
            IsWall: false
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDdXN0b21pemFibGVHYW1lb2ZMaWZlLmpzIiwKICAic291cmNlUm9vdCI6ICIiLAogICJzb3VyY2VzIjogWyJDbGFzczEuY3MiLCJFeHRlbnNpb25zLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7OztZQWdJQUEsd0JBQWlFQTtZQUNqRUEsdUJBQWtEQTtZQUN0Q0EscUJBQXdCQTtZQUNwQ0E7WUFBcUJBLElBQUlBLENBQUNBLEtBQUlBLDhDQUE2QkE7Z0JBRTNDQTtvQkFFSUEsZUFBbUJBLFdBQVdBO29CQUM5QkEsSUFBSUEsa0JBQWtCQTt3QkFFbEJBLElBQUlBLEFBQXFDQTs0QkFDckNBLHlDQUFjQSw4Q0FBc0NBLGVBQWVBLHVCQUF2QkE7O3dCQUNoREEsSUFBSUEsQUFBcUNBOzRCQUNyQ0EsdUNBQVlBLDhDQUFzQ0EsZUFBZUEscUJBQXZCQTs7Ozs7OztZQUsxREE7WUFDQUEsMEJBQTBCQTtZQUMxQkE7WUFDQUEsMEJBQTBCQTtZQUMxQkEsMEJBQTBCQTs7WUFFMUJBLHlCQUFzQ0Esd0RBQ2xEQSwwR0FBK0VBLDJEQUMvREEsK0JBQTBCQSw0REFBc0ZBLHNDQUNoSUEsNERBQXNGQSxzQ0FDdEZBLDREQUFzRkE7OztZQUt0RkEsbUJBQW1CQTs7dUJBQU1BLDRGQUErQ0EseURBQXlEQSw0RUFBOENBLHlEQUF5REE7OztZQUU1TkEsS0FBS0EsV0FBV0EsS0FBS0EsNkNBQWtCQTtnQkFFbkNBLFVBQTBCQSw2QkFBNkRBLDhCQUEwQkE7Z0JBQ2pJQSwyREFBMkVBLE1BQUlBLDREQUFnRUEsK0JBQStCQTtnQkFDOUpBLDJDQUFnQkEsS0FBSUEsaUVBQXdEQSw0RUFBMkRBLG9CQUFvQkEsNkJBQWtFQSw4QkFBZ0NBLE9BQW1CQSwwREFBWUEsR0FBWkEsMkNBQWlCQSw0RUFBMkRBLG9CQUFvQkEsNkJBQWtFQSw4QkFBZ0NBLE9BQW1CQSx3REFBVUEsR0FBVkE7OztZQUd6ZUEsY0FBeUJBLHNEQUNyQ0EsMERBQTJD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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQU1iQSxPQUFPQSxNQUErQkEsMkNBQW9CQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucztcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5EaWFnbm9zdGljcy5Db250cmFjdHM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBDdXN0b21pemFibGVHYW1lb2ZMaWZlXHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgQXBwXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGNvbnN0IGludCB4TXVsdGlwbGllciA9IDIwLCB5TXVsdGlwbGllciA9IDIwO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IHNjcmVlbldpZHRoID0gV2luZG93LklubmVyV2lkdGgsIHNjcmVlbkhlaWdodCA9IFdpbmRvdy5Jbm5lckhlaWdodDtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCB3aWR0aCA9IHNjcmVlbldpZHRoIC8geE11bHRpcGxpZXIsIGhlaWdodCA9IHNjcmVlbkhlaWdodCAvIHlNdWx0aXBsaWVyO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IEhvdGJhciA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgU3R5bGUgPSB7XHJcbiAgICAgICAgICAgICAgICBQb3NpdGlvbiA9IFBvc2l0aW9uLkFic29sdXRlLFxyXG4gICAgICAgICAgICAgICAgTGVmdCA9IFwiMTAwcHhcIixcclxuICAgICAgICAgICAgICAgIFRvcCA9IHN0cmluZy5Gb3JtYXQoXCJ7MH1weFwiLFdpbmRvdy5Jbm5lckhlaWdodCAtIDMwKSAgICAgICAgICAgIH1cclxuICAgICAgICB9LFJlc2V0QnV0dG9uID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQnV0dG9uRWxlbWVudD4obmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBPbkNsaWNrID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTcXVhcmVzLkNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGxheWluZylcclxuICAgICAgICAgICAgICAgICAgICBJbnZlcnRJc1BsYXlpbmcoKTtcclxuICAgICAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXCJSZXNldFwiKSk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgU2V0dGluZ3NQb3B1cENvbnRhaW5lciA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBIVE1MRGl2RWxlbWVudCgpLChfbzEpPT57X28xLlN0eWxlLlBvc2l0aW9uPSBQb3NpdGlvbi5GaXhlZDtfbzEuU3R5bGUuVG9wPSBcIjBcIjtfbzEuU3R5bGUuTGVmdD0gXCIwXCI7X28xLlN0eWxlLldpZHRoPSBcIjEwMCVcIjtfbzEuU3R5bGVbXCJ4LWluZGV4XCJdPSA5OTk5OTk7X28xLlN0eWxlLkhlaWdodD0gXCIxMDAlXCI7X28xLlN0eWxlLkJhY2tncm91bmRDb2xvcj0gXCJyZ2JhKDAsIDAsIDAsIDAuNSlcIjtfbzEuU3R5bGUuRGlzcGxheT0gRGlzcGxheS5Ob25lO3JldHVybiBfbzE7fSlcclxuLFNldHRpbmdzUG9wdXAgPSBuZXcgSFRNTERpdkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU3R5bGUgPVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEZvbnRTaXplID0gXCIxLjVyZW1cIixcclxuICAgICAgICAgICAgICAgICAgICBCYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgUG9zaXRpb24gPSBQb3NpdGlvbi5GaXhlZCxcclxuICAgICAgICAgICAgICAgICAgICBUb3AgPSBcIjBweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIExlZnQgPSBcIjI1JVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFdpZHRoID0gXCI1MCVcIixcclxuICAgICAgICAgICAgICAgICAgICBIZWlnaHQgPSBcIjEwMCVcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBTZXR0aW5nc1BvcHVwO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxCdXR0b25FbGVtZW50IFNldHRpbmdzQnV0dG9uID0gbmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBJbm5lckhUTUwgPSBcIuKamVwiLFxyXG4gICAgICAgICAgICBPbkNsaWNrID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQnV0dG9uRWxlbWVudCBQbGF5QnV0dG9uID0gbmV3IEhUTUxCdXR0b25FbGVtZW50XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBJbm5lckhUTUwgPSBcIuKWtlwiLFxyXG4gICAgICAgICAgICBTdHlsZSA9IHsgQ29sb3IgPSBcImdyZWVuXCIgfSxcclxuICAgICAgICAgICAgT25DbGljayA9IGUgPT4gSW52ZXJ0SXNQbGF5aW5nKClcclxuICAgICAgICB9O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTEJ1dHRvbkVsZW1lbnQgUmVzZXRCdXR0b247XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBJbnZlcnRJc1BsYXlpbmcgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBsYXlpbmcgPSAhcGxheWluZztcclxuICAgICAgICAgICAgUGxheUJ1dHRvbi5TdHlsZS5Db2xvciA9IHBsYXlpbmcgPyBcInJlZFwiIDogXCJncmVlblwiO1xyXG4gICAgICAgICAgICBQbGF5QnV0dG9uLklubmVySFRNTCA9IHBsYXlpbmcgPyBcIuKPuFwiIDogXCLilrZcIjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgcGxheWluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2xbXSBsaXZpbmdSdWxlcyA9IG5ldyBib29sWzldIHsgZmFsc2UsIGZhbHNlLCB0cnVlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UgfTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2xbXSBkZWFkUnVsZXMgICA9IG5ldyBib29sWzldIHsgZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlIH07XHJcbnB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ3JlYXRlQ2FudmFzKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MQ2FudmFzRWxlbWVudHtXaWR0aCA9IHNjcmVlbldpZHRoLCBIZWlnaHQgPSBzY3JlZW5IZWlnaHR9O1xyXG59cHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBDcmVhdGVUb3BDYW52YXMoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxDYW52YXNFbGVtZW50e1dpZHRoID0gd2lkdGggKyAyLCBIZWlnaHQgPSBoZWlnaHQgKyAyfTtcclxufXB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgQ3JlYXRlQm90dG9tQ2FudmFzKClcclxue1xyXG4gICAgcmV0dXJuIG5ldyBIVE1MQ2FudmFzRWxlbWVudHtXaWR0aCA9IHNjcmVlbldpZHRoICsgMiAqIHhNdWx0aXBsaWVyLCBIZWlnaHQgPSBzY3JlZW5IZWlnaHQgKyAyICogeU11bHRpcGxpZXJ9O1xyXG59XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBET01DYW52YXMgPSBDcmVhdGVDYW52YXMoKSwgQm90dG9tQ2FudmFzID0gQ3JlYXRlQm90dG9tQ2FudmFzKCksIFRvcENhbnZhcyA9IENyZWF0ZVRvcENhbnZhcygpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEXHJcbiAgICAgICAgICAgIFRvcENhbnZhc0NvbnRleHQgPSBUb3BDYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCksXHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQgPSBCb3R0b21DYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCksXHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQgPSBET01DYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSGFzaFNldDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+PiBTcXVhcmVzID0gbmV3IEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4oKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gb2Zmc2V0UG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IE1vdXNlUG9zICh0aGlzIE1vdXNlRXZlbnQgZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciByZWN0ID0gRE9NQ2FudmFzLkdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigoaW50KShlLkNsaWVudFggLSByZWN0LkxlZnQpLCAoaW50KShlLkNsaWVudFkgLSByZWN0LlRvcCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgTmVnRGl2IChpbnQgYSwgaW50IGIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgcmVzID0gYSAvIGI7XHJcbiAgICAgICAgICAgIHJldHVybiAoYSA8IDAgJiYgYSAhPSBiICogcmVzKSA/IHJlcyAtIDEgOiByZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgY29uc3QgaW50IG1heEFkamFjZW50Q2VsbHMgPSA4O1xyXG5cclxuICAgICAgICBzdGF0aWMgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxIVE1MU2VsZWN0RWxlbWVudCxIVE1MU2VsZWN0RWxlbWVudD4+IG9wdGlvbkNlbGxzID0gbmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SFRNTFNlbGVjdEVsZW1lbnQsSFRNTFNlbGVjdEVsZW1lbnQ+PigpO1xyXG5cclxuICAgICAgICBzdGF0aWMgdm9pZCBBcHBseVByZXNldChib29sW10gbGl2aW5nUnVsZXMsIGJvb2xbXSBkZWFkUnVsZXMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8PSA4OyBuKyspXHJcbiAgICAgICAgICAgIHtcclxub3B0aW9uQ2VsbHNbbl0uSXRlbTEuU2V0Qm9vbFZhbHVlKGxpdmluZ1J1bGVzW25dKTtcclxub3B0aW9uQ2VsbHNbbl0uSXRlbTIuU2V0Qm9vbFZhbHVlKGRlYWRSdWxlc1tuXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBNYWluICgpXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uQWN0aW9uPE1vdXNlRXZlbnQ8SFRNTENhbnZhc0VsZW1lbnQ+PiBQcm9jZXNzTW91c2VFdmVudCA9IG51bGw7XG5TeXN0ZW0uRnVuYzxIVE1MU2VsZWN0RWxlbWVudD4gQ3JlYXRlMDFTZWxlY3RvciA9IG51bGw7XG4gICAgICAgICAgICBvYmplY3QgcnVsZXNPYmplY3RTdHIgPSBHbG9iYWwuTG9jYWxTdG9yYWdlLkdldEl0ZW0oXCJydWxlc1wiKTtcclxuc3RyaW5nIHI7ICAgICAgICAgICAgaWYgKChyID0gcnVsZXNPYmplY3RTdHIgYXMgc3RyaW5nKSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBkeW5hbWljIHJ1bGVzT2JqID0gSlNPTi5QYXJzZShyKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocnVsZXNPYmplY3RTdHIgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTY3JpcHQuV3JpdGUoXCJ7MH0gaW5zdGFuY2VvZiBBcnJheVwiLCBydWxlc09iai5saXZpbmdSdWxlcykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXZpbmdSdWxlcyA9IEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PGJvb2xbXT4oSlNPTi5TdHJpbmdpZnkocnVsZXNPYmoubGl2aW5nUnVsZXMpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFNjcmlwdC5Xcml0ZShcInswfSBpbnN0YW5jZW9mIEFycmF5XCIsIHJ1bGVzT2JqLmRlYWRSdWxlcykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWFkUnVsZXMgPSBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxib29sW10+KEpTT04uU3RyaW5naWZ5KHJ1bGVzT2JqLmRlYWRSdWxlcykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIHsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuU3R5bGVbXCJ1c2VyLXNlbGVjdFwiXSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5IZWFkLkFwcGVuZENoaWxkKG5ldyBIVE1MTGlua0VsZW1lbnQgeyBSZWwgPSBcInN0eWxlc2hlZXRcIiwgSHJlZiA9IFwiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9ib290c3RyYXBANS4yLjAvZGlzdC9jc3MvYm9vdHN0cmFwLm1pbi5jc3NcIiB9KTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5TdHlsZS5NYXJnaW4gPSBcIjBweFwiO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKFNldHRpbmdzUG9wdXBDb250YWluZXIpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKG5ldyBIVE1MU3R5bGVFbGVtZW50IHsgSW5uZXJIVE1MID0gXCJ0ZCwgdGggeyBib3JkZXI6IDFweCBzb2xpZCBibGFjazsgcGFkZGluZzogNXB4IH1cIiB9KTtcclxuXHJcbiAgICAgICAgICAgIEhUTUxUYWJsZUVsZW1lbnQgYWRqYWNlbnRDZWxsc1RhYmxlID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVFbGVtZW50PihcclxubmV3IEhUTUxUYWJsZUVsZW1lbnQgeyBTdHlsZSA9IHsgTWFyZ2luTGVmdCA9IFwiYXV0b1wiLCBNYXJnaW5SaWdodCA9IFwiYXV0b1wiIH0gfSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KFxyXG4gICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZVJvd0VsZW1lbnQoKSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudCgpLFwiI1wiKSxcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQoKSxcIkxcIiksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50KCksXCJEXCIpXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBcclxuQ3JlYXRlMDFTZWxlY3RvciA9ICgpID0+IG5ldyBIVE1MU2VsZWN0RWxlbWVudCgpLkFkZDxIVE1MU2VsZWN0RWxlbWVudD4oQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCJmYWxzZVwifSwgXCIwXCIpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnR7VmFsdWUgPSBcInRydWVcIn0sIFwiMVwiKSk7XG5cclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPD0gbWF4QWRqYWNlbnRDZWxsczsgbisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIVE1MVGFibGVSb3dFbGVtZW50IHJvdyA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MVGFibGVSb3dFbGVtZW50PihuZXcgSFRNTFRhYmxlUm93RWxlbWVudCgpLGFkamFjZW50Q2VsbHNUYWJsZSk7XHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlUm93RWxlbWVudD4oICAgICAgICAgICAgICAgIHJvdyxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudD4obmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpLG4uVG9TdHJpbmcoKSkpO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9uQ2VsbHMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxIVE1MU2VsZWN0RWxlbWVudCwgSFRNTFNlbGVjdEVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MU2VsZWN0RWxlbWVudD4oQ3JlYXRlMDFTZWxlY3RvcigpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCksIHJvdykpLlNldEJvb2xWYWx1ZShsaXZpbmdSdWxlc1tuXSksIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGRUbzxIVE1MU2VsZWN0RWxlbWVudD4oQ3JlYXRlMDFTZWxlY3RvcigpLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50PihuZXcgSFRNTFRhYmxlRGF0YUNlbGxFbGVtZW50KCksIHJvdykpLlNldEJvb2xWYWx1ZShkZWFkUnVsZXNbbl0pKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IHByZXNldHMgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihcclxubmV3IEhUTUxEaXZFbGVtZW50IHsgU3R5bGUgPSB7IFRleHRBbGlnbiA9IFRleHRBbGlnbi5DZW50ZXIgfSB9XHJcbixDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxBbmNob3JFbGVtZW50PiggICAgICAgICAgICAgICAgbmV3IEhUTUxBbmNob3JFbGVtZW50XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgSHJlZiA9IFwiamF2YXNjcmlwdDp2b2lkKDApXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgU3R5bGUgPSB7IEZvbnRTaXplID0gXCIxcmVtXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBPbkNsaWNrID0gZSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXBwbHlQcmVzZXQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpdmluZ1J1bGVzOiBuZXcgYm9vbFs5XSB7IGZhbHNlLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYWRSdWxlczogbmV3IGJvb2xbOV0geyBmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4sXCJDb253YXkncyBHYW1lIG9mIExpZmUgUHJlc2V0XCIpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBTZXR0aW5nc0J1dHRvbi5PbkNsaWNrID0gZSA9PiBTZXR0aW5nc1BvcHVwQ29udGFpbmVyLlN0eWxlLkRpc3BsYXkgPSBcIlwiO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PihcclxuICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxhZGphY2VudENlbGxzVGFibGUpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBTZXR0aW5nc1BvcHVwLG5ldyBIVE1MQlJFbGVtZW50KCksIHByZXNldHMsIG5ldyBIVE1MQlJFbGVtZW50KCkpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxEaXZFbGVtZW50PiggICAgICAgICAgICBTZXR0aW5nc1BvcHVwLEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDbGFzc05hbWUgPSBcImJ0biBidG4tcHJpbWFyeVwiLFxyXG4gICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT5cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8PSBtYXhBZGphY2VudENlbGxzOyBuKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXZpbmdSdWxlc1tuXSA9IG9wdGlvbkNlbGxzW25dLkl0ZW0xLkJvb2xWYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWFkUnVsZXNbbl0gPSBvcHRpb25DZWxsc1tuXS5JdGVtMi5Cb29sVmFsdWUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgR2xvYmFsLkxvY2FsU3RvcmFnZS5TZXRJdGVtKFwicnVsZXNcIiwgSnNvbkNvbnZlcnQuU2VyaWFsaXplT2JqZWN0KG5ld1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGl2aW5nUnVsZXMgPSBsaXZpbmdSdWxlcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVhZFJ1bGVzID0gZGVhZFJ1bGVzXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIFNldHRpbmdzUG9wdXBDb250YWluZXIuU3R5bGUuRGlzcGxheSA9IERpc3BsYXkuTm9uZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcIlNhdmUgQ2hhbmdlc1wiKSk7XHJcblxyXG5cclxuICAgICAgICAgICAgSG90YmFyLkFwcGVuZENoaWxkKFBsYXlCdXR0b24pO1xyXG4gICAgICAgICAgICBIb3RiYXIuQXBwZW5kQ2hpbGQoU2V0dGluZ3NCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgSFRNTERpdkVsZW1lbnQgYmFja2dyb3VuZERpdiA9IG5ldyBIVE1MRGl2RWxlbWVudCB7IFN0eWxlID0geyBQb3NpdGlvbiA9IFBvc2l0aW9uLlJlbGF0aXZlLCBNaW5XaWR0aCA9IFwiMFwiLCBNaW5IZWlnaHQgPSBcIjBcIiB9fTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLk92ZXJmbG93ID0gT3ZlcmZsb3cuSGlkZGVuO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuWkluZGV4ID0gXCItMVwiO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuUG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5MZWZ0ID0gXCIwcHhcIjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLlRvcCA9IFwiMHB4XCI7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmREaXYuQXBwZW5kQ2hpbGQoRE9NQ2FudmFzKTtcclxuICAgICAgICAgICAgLy9iYWNrZ3JvdW5kRGl2LkFwcGVuZENoaWxkKG5ldyBIVE1MQlJFbGVtZW50KCkpO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kRGl2LkFwcGVuZENoaWxkKEhvdGJhcik7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQoYmFja2dyb3VuZERpdik7XHJcblxyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlRyYW5zbGF0ZSgwLjUsIDAuNSk7XHJcbiAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVdpZHRoID0gMTtcclxuICAgICAgICAgICAgZm9yIChpbnQgeCA9IDA7IHggPD0gKHdpZHRoICsgMik7IHgrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5Nb3ZlVG8oeCAqIHhNdWx0aXBsaWVyLCAwKTtcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKHggKiB4TXVsdGlwbGllciwgKGhlaWdodCArIDMpICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoaW50IHkgPSAwOyB5IDw9IChoZWlnaHQgKyAyKTsgeSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0Lk1vdmVUbygwLCB5ICogeU11bHRpcGxpZXIpO1xyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5MaW5lVG8oKHdpZHRoICsgMykgKiB4TXVsdGlwbGllciwgeSAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGludCBuID0gMDsgbiA8IDEwOyBuKyspXHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LlN0cm9rZSgpO1xyXG5cclxuICAgICAgICAgICAgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBkcmFnZ2luZ1BvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gb3JpZ2luYWxQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICBib29sIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgRE9NQ2FudmFzLk9uTW91c2VEb3duID0gZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IHRydWU7XHJcbmludCB4O1xuaW50IHk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KGUuTW91c2VQb3MoKSwgb3V0IHgsIG91dCB5KTtcclxuICAgICAgICAgICAgICAgIGRyYWdnaW5nUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4IC0gb2Zmc2V0UG9zLkl0ZW0xLCB5IC0gb2Zmc2V0UG9zLkl0ZW0yKTtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsUG9zID0gb2Zmc2V0UG9zO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBET01DYW52YXMuT25Nb3VzZVVwID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0xLSBvcmlnaW5hbFBvcy5JdGVtMSkgPiB4TXVsdGlwbGllciB8fCBNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTItIG9yaWdpbmFsUG9zLkl0ZW0yKSA+IHlNdWx0aXBsaWVyKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZ1BvcyA9IG9mZnNldFBvcztcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLk9uTW91c2VNb3ZlID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGUuQnV0dG9ucyAmIDEpID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGlmIChkcmFnZ2luZ1BvcyA9PSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApKSBkcmFnZ2luZ1BvcyA9IGUuTW91c2VQb3MoKTtcclxuICAgICAgICAgICAgICAgIHZhciBtb3VzZVBvcyA9IGUuTW91c2VQb3MoKTtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTEtIG9yaWdpbmFsUG9zLkl0ZW0xKSA+IHhNdWx0aXBsaWVyIHx8IE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMS0gb3JpZ2luYWxQb3MuSXRlbTEpID4geU11bHRpcGxpZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIG9mZnNldFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4obW91c2VQb3MuSXRlbTEgLSBkcmFnZ2luZ1Bvcy5JdGVtMSwgbW91c2VQb3MuSXRlbTIgLSBkcmFnZ2luZ1Bvcy5JdGVtMik7XHJcbiAgICAgICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgICAgIH07XHJcblByb2Nlc3NNb3VzZUV2ZW50ID0gKGUpID0+XHJcbntcclxuICAgIC8vaWYgKChAZXZlbnQuQnV0dG9ucyAmIDEpID09IDApIHJldHVybjtcclxuICAgIHZhciBtb3VzZVBvcyA9IGUuTW91c2VQb3MoKTtcclxuICAgIGludCBjbGlja1g7XHJcbiAgICBpbnQgY2xpY2tZO1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KE5lZ0Rpdihtb3VzZVBvcy5JdGVtMSAtIG9mZnNldFBvcy5JdGVtMSwgeE11bHRpcGxpZXIpLCBOZWdEaXYoKG1vdXNlUG9zLkl0ZW0yIC0gb2Zmc2V0UG9zLkl0ZW0yKSwgeU11bHRpcGxpZXIpKSwgb3V0IGNsaWNrWCwgb3V0IGNsaWNrWSk7XHJcbiAgICBpZiAoIVNxdWFyZXMuUmVtb3ZlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oY2xpY2tYLCBjbGlja1kpKSlcclxuICAgICAgICBTcXVhcmVzLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGNsaWNrWCwgY2xpY2tZKSk7XHJcbiAgICBEcmF3KCk7XHJcbn1cclxuXHJcbjtcbiAgICAgICAgICAgIERPTUNhbnZhcy5PbkNsaWNrID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdpbmdJbnRlbnQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgUHJvY2Vzc01vdXNlRXZlbnQoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIEdsb2JhbC5TZXRJbnRlcnZhbCgoQWN0aW9uKU5leHRGcmFtZSwgMTAwKTtcclxuXHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCB1cGRhdGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBOdW1iZXJPZkFkamFjZW50Q2VsbHMgKGludCB4LCBpbnQgeSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGludCBhZGphY2VudENlbGxzID0gMDtcclxuICAgICAgICAgICAgZm9yIChpbnQgTCA9IDA7IEwgPD0gODsgTCsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoTCA9PSA0KSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnQgeF8gPSB4IC0gMSArIChMICUgMyksXHJcbiAgICAgICAgICAgICAgICAgICAgeV8gPSB5IC0gMSArIEwgLyAzO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vaWYgKHhfIDwgMCB8fCB4XyA+PSB3aWR0aCB8fCB5XyA8IDAgfHwgeV8gPj0gaGVpZ2h0KSBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoU3F1YXJlcy5Db250YWlucyhuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHhfLCB5XykpKVxyXG4gICAgICAgICAgICAgICAgICAgIGFkamFjZW50Q2VsbHMrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYWRqYWNlbnRDZWxscztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBVcGRhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy91cGRhdGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PiByZW1vdmluZyA9IG5ldyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PigpO1xyXG4gICAgICAgICAgICBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCxpbnQ+PiBhZGRpbmcgPSBuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oKTtcclxuZm9yZWFjaCAodmFyIF9kMSBpbiBTcXVhcmVzKVxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDEsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpbnQgYWRqYWNlbnRDZWxscyA9IDA7XHJcbiAgICBmb3IgKGludCBMID0gMDsgTCA8PSA4OyBMKyspXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKEwgPT0gNClcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgaW50IHhfID0geCAtIDEgKyAoTCAlIDMpLCB5XyA9IHkgLSAxICsgTCAvIDM7XHJcbiAgICAgICAgaWYgKFNxdWFyZXMuQ29udGFpbnMobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4XywgeV8pKSlcclxuICAgICAgICAgICAgYWRqYWNlbnRDZWxscysrO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBuZXcgY2VsbHMuXHJcbiAgICAgICAgICAgIC8vIE9wdGltaXphdGlvbiBmb3IgcnVsZSBvZiAzIGFkamFjZW50IGNlbGxzXHJcbiAgICAgICAgICAgIC8vaWYgKEwgIT0gNyAmJiBMICE9IDgpXHJcbiAgICAgICAgICAgIC8ve1xyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgaWYgKGRlYWRSdWxlc1tOdW1iZXJPZkFkamFjZW50Q2VsbHMoeF8sIHlfKV0pXHJcbiAgICAgICAgICAgICAgICBhZGRpbmcuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeF8sIHlfKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghbGl2aW5nUnVsZXNbYWRqYWNlbnRDZWxsc10pXHJcbiAgICAgICAgcmVtb3ZpbmcuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSkpO1xyXG59XG5mb3JlYWNoICh2YXIgX2QyIGluIHJlbW92aW5nKVxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDIsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBpZiAoIVNxdWFyZXMuUmVtb3ZlKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSkpKVxyXG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJTcXVhcmUgdHJpZWQgdG8gYmUgcmVtb3ZlZCBidXQgZGlkbid0IGV4aXN0XCIpO1xyXG59XG5mb3JlYWNoICh2YXIgX2QzIGluIGFkZGluZylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2QzLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgU3F1YXJlcy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4LCB5KSk7XHJcbn1cbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgRHJhdyAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5DbGVhclJlY3QoMCwgMCwgRE9NQ2FudmFzLldpZHRoLCBET01DYW52YXMuSGVpZ2h0KTtcclxuICAgICAgICAgICAgVG9wQ2FudmFzQ29udGV4dC5DbGVhclJlY3QoMCwgMCwgRE9NQ2FudmFzLldpZHRoLCBET01DYW52YXMuSGVpZ2h0KTtcclxuaW50IG9mZnNldFg7XG5pbnQgb2Zmc2V0WTtcbkJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3Qob2Zmc2V0UG9zLCBvdXQgb2Zmc2V0WCwgb3V0IG9mZnNldFkpO1xyXG4gICAgICAgICAgICBpbnQgbCA9ICh3aWR0aCArIDIpICogKGhlaWdodCArIDIpO1xyXG4gICAgICAgICAgICBVaW50OENsYW1wZWRBcnJheSBpbWFnZURhdGFBcnJheSA9IG5ldyBVaW50OENsYW1wZWRBcnJheShsICogNCk7XHJcbmZvcmVhY2ggKHZhciBfZDQgaW4gU3F1YXJlcylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2Q0LCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaW50IGRyYXdYID0geCArIChvZmZzZXRYIC8geE11bHRpcGxpZXIpICsgMSwgZHJhd1kgPSB5ICsgKG9mZnNldFkgLyB5TXVsdGlwbGllcikgKyAxO1xyXG4gICAgaWYgKGRyYXdYIDwgMCB8fCBkcmF3WCA+PSB3aWR0aCArIDIgfHwgZHJhd1kgPCAwIHx8IGRyYXdZID49IGhlaWdodCArIDIpXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICBpbnQgaWR4ID0gZHJhd1ggKyBkcmF3WSAqICh3aWR0aCArIDIpO1xyXG4gICAgaW1hZ2VEYXRhQXJyYXlbaWR4ICogNCArIDNdID0gMjU1O1xyXG59XG4gICAgICAgICAgICBJbWFnZURhdGEgaW1hZ2VEYXRhID0gbmV3IEltYWdlRGF0YShpbWFnZURhdGFBcnJheSwgKHVpbnQpKHdpZHRoICsgMiksICh1aW50KShoZWlnaHQgKyAyKSk7XHJcbiAgICAgICAgICAgIFRvcENhbnZhc0NvbnRleHQuSW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIFRvcENhbnZhc0NvbnRleHQuUHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0ltYWdlKEJvdHRvbUNhbnZhcywgb2Zmc2V0WCAlIHhNdWx0aXBsaWVyIC0geE11bHRpcGxpZXIsIG9mZnNldFkgJSB5TXVsdGlwbGllciAtIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5JbWFnZVNtb290aGluZ0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5EcmF3SW1hZ2UoVG9wQ2FudmFzLCAob2Zmc2V0WCAlIHhNdWx0aXBsaWVyKSAtIHhNdWx0aXBsaWVyLCAob2Zmc2V0WSAlIHlNdWx0aXBsaWVyKSAtIHlNdWx0aXBsaWVyLCAod2lkdGggKyAyKSAqIHhNdWx0aXBsaWVyLCAoaGVpZ2h0ICsgMikgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBmcmFtZU51bSA9IDA7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBOZXh0RnJhbWUgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghcGxheWluZykgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgYm9vbCBza2lwRnJhbWVzID0gU3F1YXJlcy5Db3VudCA+PSAyNTA7XHJcbiAgICAgICAgICAgIGludCB1cGRhdGVzUGVyRHJhdyA9IDE7Ly8gc2tpcEZyYW1lcyA/IDIgOiAxO1xyXG4gICAgICAgICAgICBmcmFtZU51bSsrO1xyXG4gICAgICAgICAgICBpZiAoc2tpcEZyYW1lcyAmJiAoZnJhbWVOdW0gJSB1cGRhdGVzUGVyRHJhdykgIT0gMCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPCB1cGRhdGVzUGVyRHJhdzsgbisrKVxyXG4gICAgICAgICAgICAgICAgVXBkYXRlKCk7XHJcbiAgICAgICAgICAgIERyYXcoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBTeXN0ZW0uVGV4dDtcclxudXNpbmcgU3lzdGVtLlRleHQuUmVndWxhckV4cHJlc3Npb25zO1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBFeHRlbnNpb25zXHJcbiAgICB7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKChlLCBjKSA9PiBjLmFwcGVuZENoaWxkKGUpKSh7ZWxlbWVudH0sIHtjb250YWluaW5nRWxlbX0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgQWRkVG88VD4odGhpcyBUIGVsZW1lbnQsIE5vZGUgY29udGFpbmluZ0VsZW0pIHdoZXJlIFQgOiBOb2RlO1xyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBUIEFkZFRvQm9keTxUPih0aGlzIFQgbikgd2hlcmUgVCA6IE5vZGUgPT4gQXBwLnJvb3QuQXBwZW5kQ2hpbGQ8VD4obik7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwie25vZGV9LmFwcGVuZENoaWxkKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBBcHBlbmRDaGlsZDxUPih0aGlzIE5vZGUgbm9kZSwgVCBlbGVtZW50KSB3aGVyZSBUIDogTm9kZTtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIEhpZGU8VD4odGhpcyBUIGVsZW1lbnQpIHdoZXJlIFQgOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zdHlsZS5kaXNwbGF5ID0gJycsIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgU2hvdzxUPih0aGlzIFQgZWxlbWVudCkgd2hlcmUgVCA6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihsaSA9PiAobGkuYXBwZW5kQ2hpbGQoe2VsZW1lbnR9KSwgbGkpKShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpKVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MTElFbGVtZW50IFdyYXBMaSh0aGlzIE5vZGUgZWxlbWVudCk7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGRpdiA9PiAoZGl2LmFwcGVuZENoaWxkKHtlbGVtZW50fSksIGRpdikpKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MRGl2RWxlbWVudCBXcmFwRGl2KHRoaXMgTm9kZSBlbGVtZW50KTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFQgQWRkPFQ+KHRoaXMgVCBlbGVtZW50LCBwYXJhbXMgVW5pb248Tm9kZSwgc3RyaW5nPltdIG5vZGVzKSB3aGVyZSBUIDogTm9kZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yZWFjaCAoVW5pb248Tm9kZSwgc3RyaW5nPiBub2RlIGluIG5vZGVzKVxyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUuSXM8c3RyaW5nPigpKVxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuQXBwZW5kQ2hpbGQobmV3IFRleHQobm9kZS5BczxzdHJpbmc+KCkpKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LkFwcGVuZENoaWxkKG5vZGUuQXM8Tm9kZT4oKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBUIEFkZEVsZW1lbnQ8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LG5vZGVzKTtcclxufXB1YmxpYyBzdGF0aWMgVCBBZGREaXY8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gbm9kZXMpXHJcbiAgICB3aGVyZSBUIDogTm9kZVxyXG57XHJcbiAgICByZXR1cm4gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxUPihlbGVtZW50LEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTERpdkVsZW1lbnQ+KG5ldyBIVE1MRGl2RWxlbWVudCgpLG5vZGVzKSk7XHJcbn1wdWJsaWMgc3RhdGljIFQgQWRkVWw8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBVbmlvbjxOb2RlLCBzdHJpbmc+W10sIHN0cmluZz5bXSBub2RlcylcclxuICAgIHdoZXJlIFQgOiBOb2RlXHJcbntcclxuICAgIHJldHVybiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPFQ+KGVsZW1lbnQsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVUxpc3RFbGVtZW50PihuZXcgSFRNTFVMaXN0RWxlbWVudCgpLFN5c3RlbS5BcnJheUV4dGVuc2lvbnMuTWFwPFVuaW9uPE5vZGUsVW5pb248Tm9kZSwgc3RyaW5nPltdLHN0cmluZz4sVW5pb248Tm9kZSxzdHJpbmc+Pihub2RlcywoRnVuYzxVbmlvbjxOb2RlLFVuaW9uPE5vZGUsIHN0cmluZz5bXSxzdHJpbmc+LFVuaW9uPE5vZGUsc3RyaW5nPj4pKG4gPT4gKFVuaW9uPE5vZGUsIHN0cmluZz4pKG4uSXM8VW5pb248Tm9kZSwgc3RyaW5nPltdPigpID8gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MTElFbGVtZW50PihuZXcgSFRNTExJRWxlbWVudCgpLG4uQXM8VW5pb248Tm9kZSwgc3RyaW5nPltdPigpKSA6IG4uSXM8c3RyaW5nPigpID8gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MTElFbGVtZW50PihuZXcgSFRNTExJRWxlbWVudCgpLG4uQXM8c3RyaW5nPigpKSA6IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTExJRWxlbWVudD4obmV3IEhUTUxMSUVsZW1lbnQoKSxuLkFzPE5vZGU+KCkpKSkpKSk7XHJcbn1wdWJsaWMgc3RhdGljIHN0cmluZyBBZGRDYW1lbFNwYWNlKHRoaXMgc3RyaW5nIHN0cilcclxue1xyXG4gICAgcmV0dXJuIFJlZ2V4LlJlcGxhY2UoUmVnZXguUmVwbGFjZShzdHIsIEBcIihbXl9hLXpdKShbXl9hLXpdW2Etel0pXCIsIFwiJDEgJDJcIiksIEBcIihbYS16XSkoW15fYS16XSlcIiwgXCIkMSAkMlwiKTtcclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIFRvQ2FtZWxTdHJpbmc8VD4odGhpcyBUIGUpXHJcbiAgICB3aGVyZSBUIDogc3RydWN0LCBTeXN0ZW0uRW51bVxyXG57XHJcbiAgICByZXR1cm4gZS5Ub1N0cmluZygpLkFkZENhbWVsU3BhY2UoKS5SZXBsYWNlKCdfJywgJyAnKTtcclxufSAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBBZGRFbnVtPFQ+KHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBUPyBkZWZhdWx0VmFsdWUgPSBudWxsLCBzdHJpbmcgZGVmYXVsdFZhbHVlU3RyaW5nID0gXCJcIikgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChkZWZhdWx0VmFsdWUgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHNlbGVjdC5BZGQoQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50IHsgVmFsdWUgPSBcIlwiLCBTZWxlY3RlZCA9IHRydWUsIERpc2FibGUgPSB0cnVlIH0sZGVmYXVsdFZhbHVlU3RyaW5nKSk7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKFQgdmFsdWUgaW4gU3lzdGVtLkVudW0uR2V0VmFsdWVzKHR5cGVvZihUKSkpXHJcbiAgICAgICAgICAgICAgICBzZWxlY3QuQWRkKEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFZhbHVlID0gKChpbnQpKG9iamVjdCl2YWx1ZSkuVG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBTZWxlY3RlZCA9IG9iamVjdC5FcXVhbHMoZGVmYXVsdFZhbHVlLCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLlRvQ2FtZWxTdHJpbmc8VD4odmFsdWUpKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIGJvb2wgQm9vbFZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0KVxyXG57XHJcbiAgICByZXR1cm4gc2VsZWN0LlZhbHVlID09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlO1xyXG59cHVibGljIHN0YXRpYyBUPyBWYWx1ZTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdClcclxuICAgIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbntcclxuICAgIHJldHVybiBzZWxlY3QuVmFsdWUgPT0gXCJcIiA/IG51bGwgOiAoVD8gKShUKShvYmplY3QpaW50LlBhcnNlKHNlbGVjdC5WYWx1ZSk7XHJcbn0gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgU2V0Qm9vbFZhbHVlKHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0LCBib29sIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2VsZWN0LlZhbHVlID0gdmFsdWUuVG9TdHJpbmcoKS5Ub0xvd2VyKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTFNlbGVjdEVsZW1lbnQgU2V0VmFsdWU8VD4odGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QsIFQgdmFsdWUpIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxlY3QuVmFsdWUgPSAoKGludCkob2JqZWN0KXZhbHVlKS5Ub1N0cmluZygpO1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0O1xyXG4gICAgICAgIH1cclxucHVibGljIHN0YXRpYyBzdHJpbmcgVG9UaW1lU3RyaW5nKHRoaXMgVGltZVNwYW4gdGltZSlcclxue1xyXG4gICAgcmV0dXJuIHRpbWUuVG9TdHJpbmcodGltZSA+PSBUaW1lU3Bhbi5Gcm9tSG91cnMoMSkgPyBAXCJoXFw6bW1cXDpzc1wiIDogQFwibVxcOnNzXCIpO1xyXG59ICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zZXRDdXN0b21WYWxpZGl0eSh7bWVzc2FnZX0pLCBlLnJlcG9ydFZhbGlkaXR5KCksIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgU2V0Q3VzdG9tVmFsaWRpdHk8VD4odGhpcyBUIGVsZW1lbnQsIHN0cmluZyBtZXNzYWdlKSB3aGVyZSBUIDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGUgPT4gKGUuc2V0QXR0cmlidXRlKCdsaXN0Jywge2RhdGFsaXN0SUR9KSwgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gSFRNTElucHV0RWxlbWVudCBTZXREYXRhTGlzdCh0aGlzIEhUTUxJbnB1dEVsZW1lbnQgZWxlbWVudCwgc3RyaW5nIGRhdGFsaXN0SUQpO1xyXG4gICAgICAgIC8vW1RlbXBsYXRlKFwie2VsZW19LmFwcGVuZENoaWxkKHthZGRpbmd9KVwiKV1cclxuICAgICAgICAvL3B1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgQXBwZW5kPFQ+ICh0aGlzIE5vZGUgZWxlbSwgVCBhZGRpbmcpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFVuaW9uPE5vZGUsIHN0cmluZz5bXSBKb2luQlIodGhpcyBJRW51bWVyYWJsZTxzdHJpbmc+IHN0cmluZ3MpXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uRnVuYzxJRW51bWVyYWJsZTxVbmlvbjxOb2RlLCBzdHJpbmc+Pj4gSW5uZXIgPSBudWxsO1xuICAgICAgICAgICAgXHJcbklubmVyID0gKCkgPT5cclxue1xyXG4gICAgdXNpbmcgKHZhciBlbnVtZXIgPSBzdHJpbmdzLkdldEVudW1lcmF0b3IoKSlcclxuICAgIHtcclxuICAgICAgICBpZiAoIWVudW1lci5Nb3ZlTmV4dCgpKVxyXG4gICAgICAgICAgICB5aWVsZCBicmVhaztcclxuICAgICAgICB5aWVsZCByZXR1cm4gZW51bWVyLkN1cnJlbnQ7XHJcbiAgICAgICAgd2hpbGUgKGVudW1lci5Nb3ZlTmV4dCgpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgeWllbGQgcmV0dXJuIG5ldyBIVE1MQlJFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIHlpZWxkIHJldHVybiBlbnVtZXIuQ3VycmVudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbjtcbiAgICAgICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlRvQXJyYXk8VW5pb248Tm9kZSxzdHJpbmc+PihJbm5lcigpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl0KfQo=
