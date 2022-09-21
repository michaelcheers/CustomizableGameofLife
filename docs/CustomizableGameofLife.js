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
                updating: false
            },
            ctors: {
                init: function () {
                    var $t, $t1, $t2;
                    this.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32))();
                    this.xMultiplier = 20;
                    this.yMultiplier = 20;
                    this.maxAdjacentCells = 8;
                    this.screenWidth = Bridge.global.screen.width;
                    this.screenHeight = Bridge.global.screen.height;
                    this.width = (Bridge.Int.div(CustomizableGameofLife.App.screenWidth, CustomizableGameofLife.App.xMultiplier)) | 0;
                    this.height = (Bridge.Int.div(CustomizableGameofLife.App.screenHeight, CustomizableGameofLife.App.yMultiplier)) | 0;
                    this.Hotbar = CustomizableGameofLife.Extensions.Add(HTMLDivElement, ($t = document.createElement("div"), $t.style.position = "absolute", $t.style.left = "100px", $t.style.top = System.String.format("{0}px", [Bridge.box(((Bridge.Int.mul(CustomizableGameofLife.App.height, CustomizableGameofLife.App.yMultiplier) - 30) | 0), System.Int32)]), $t), [($t = CustomizableGameofLife.Extensions.Add(HTMLButtonElement, ($t1 = document.createElement("button"), $t1.onclick = function (e) {
                        CustomizableGameofLife.App.Squares.clear();
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
                        CustomizableGameofLife.App.playing = !CustomizableGameofLife.App.playing;
                        CustomizableGameofLife.App.PlayButton.style.color = CustomizableGameofLife.App.playing ? "red" : "green";
                        CustomizableGameofLife.App.PlayButton.innerHTML = CustomizableGameofLife.App.playing ? "\u23f8" : "\u25b6";
                    }, $t2);
                    this.playing = false;
                    this.livingRules = System.Array.init([false, false, true, true, false, false, false, false, false], System.Boolean);
                    this.deadRules = System.Array.init([false, false, false, true, false, false, false, false, false], System.Boolean);
                    this.DOMCanvas = CustomizableGameofLife.App.CreateCanvas();
                    this.BottomCanvas = CustomizableGameofLife.App.CreateBottomCanvas();
                    this.TopCanvas = CustomizableGameofLife.App.CreateCanvas();
                    this.TopCanvasContext = CustomizableGameofLife.App.TopCanvas.getContext("2d");
                    this.BottomCanvasContext = CustomizableGameofLife.App.BottomCanvas.getContext("2d");
                    this.DOMCanvasContext = CustomizableGameofLife.App.DOMCanvas.getContext("2d");
                    this.Squares = new (System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32))).ctor();
                    this.offsetPos = new (System.ValueTuple$2(System.Int32,System.Int32)).$ctor1(0, 0);
                    this.optionCells = new (System.Collections.Generic.List$1(System.ValueTuple$2(HTMLSelectElement,HTMLSelectElement))).ctor();
                    this.updating = false;
                }
            },
            methods: {
                CreateCanvas: function () {
                    var $t;
                    return ($t = document.createElement("canvas"), $t.width = CustomizableGameofLife.App.screenWidth, $t.height = CustomizableGameofLife.App.screenHeight, $t);
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
                    $t = Bridge.getEnumerator(CustomizableGameofLife.App.Squares);
                    try {
                        while ($t.moveNext()) {
                            var _d4 = $t.Current.$clone();
                            var x = { };
                            var y = { };
                            Bridge.Deconstruct(_d4.$clone(), x, y);
                            CustomizableGameofLife.App.TopCanvasContext.fillRect(((Bridge.Int.mul(x.v, CustomizableGameofLife.App.xMultiplier) + offsetX.v) | 0), ((Bridge.Int.mul(y.v, CustomizableGameofLife.App.yMultiplier) + offsetY.v) | 0), CustomizableGameofLife.App.xMultiplier, CustomizableGameofLife.App.yMultiplier);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                    CustomizableGameofLife.App.DOMCanvasContext.drawImage(CustomizableGameofLife.App.BottomCanvas, ((offsetX.v % CustomizableGameofLife.App.xMultiplier - CustomizableGameofLife.App.xMultiplier) | 0), ((offsetY.v % CustomizableGameofLife.App.yMultiplier - CustomizableGameofLife.App.yMultiplier) | 0));
                    CustomizableGameofLife.App.DOMCanvasContext.drawImage(CustomizableGameofLife.App.TopCanvas, 0, 0);
                },
                NextFrame: function () {
                    if (!CustomizableGameofLife.App.playing) {
                        return;
                    }
                    CustomizableGameofLife.App.Update();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDdXN0b21pemFibGVHYW1lb2ZMaWZlLmpzIiwKICAic291cmNlUm9vdCI6ICIiLAogICJzb3VyY2VzIjogWyJDbGFzczEuY3MiLCJFeHRlbnNpb25zLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7OztZQXlIQUEsd0JBQWlFQTtZQUNqRUEsdUJBQWtEQTtZQUN0Q0EscUJBQXdCQTtZQUNwQ0E7WUFBcUJBLElBQUlBLENBQUNBLEtBQUlBLDhDQUE2QkE7Z0JBRTNDQTtvQkFFSUEsZUFBbUJBLFdBQVdBO29CQUM5QkEsSUFBSUEsa0JBQWtCQTt3QkFFbEJBLElBQUlBLEFBQXFDQTs0QkFDckNBLHlDQUFjQSw4Q0FBc0NBLGVBQWVBLHVCQUF2QkE7O3dCQUNoREEsSUFBSUEsQUFBcUNBOzRCQUNyQ0EsdUNBQVlBLDhDQUFzQ0EsZUFBZUEscUJBQXZCQTs7Ozs7OztZQUsxREE7WUFDQUEsMEJBQTBCQTtZQUMxQkE7WUFDQUEsMEJBQTBCQTtZQUMxQkEsMEJBQTBCQTs7WUFFMUJBLHlCQUFzQ0Esd0RBQ2xEQSwwR0FBK0VBLDJEQUMvREEsK0JBQTBCQSw0REFBc0ZBLHNDQUNoSUEsNERBQXNGQSxzQ0FDdEZBLDREQUFzRkE7OztZQUt0RkEsbUJBQW1CQTs7dUJBQU1BLDRGQUErQ0EseURBQXlEQSw0RUFBOENBLHlEQUF5REE7OztZQUU1TkEsS0FBS0EsV0FBV0EsS0FBS0EsNkNBQWtCQTtnQkFFbkNBLFVBQTBCQSw2QkFBNkRBLDhCQUEwQkE7Z0JBQ2pJQSwyREFBMkVBLE1BQUlBLDREQUFnRUEsK0JBQStCQTtnQkFDOUpBLDJDQUFnQkEsS0FBSUEsaUVBQXdEQSw0RUFBMkRBLG9CQUFvQkEsNkJBQWtFQSw4QkFBZ0NBLE9BQW1CQSwwREFBWUEsR0FBWkEsMkNBQWlCQSw0RUFBMkRBLG9CQUFvQkEsNkJBQWtFQSw4QkFBZ0NBLE9BQW1CQSx3REFBVUEsR0FBVkE7OztZQUd6ZUEsY0FBeUJBLHNEQUNyQ0EsMERBQTJD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LE9BQU9BLFlBQUtBLHFDQUFHQSxhQUFRQSw4QkFBVUE7O3dDQUNYQSxRQUErQkE7b0JBRXpFQSxlQUFlQTtvQkFDZkEsT0FBT0E7O29DQUU4QkEsR0FBR0EsUUFBK0JBO29CQUV2RUEsZUFBZUEsZ0JBQUNBLHFDQUFLQSxhQUFRQTtvQkFDN0JBLE9BQU9BOzt3Q0FFZUE7b0JBRTlCQSxPQUFPQSxjQUFjQSwwQkFBUUE7O2tDQVFrQkE7O29CQUVuREEsWUFBc0RBOztvQkFFdERBLFFBQVFBOzs7Ozs7Ozs7Ozs7OztnREFFR0EsU0FBYUE7b0RBQ3BCQTs7Ozs7Z0RBQ0lBLElBQUlBLENBQUNBOzs7Ozs7OztnREFDREE7OztnREFDSkEsc0JBQWFBOzs7Ozs7Ozs7cURBQ05BOzs7Ozs7OztnREFFSEEsc0JBQWFBOzs7OztnREFDYkEsc0JBQWFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFNYkEsT0FBT0EsTUFBK0JBLDJDQUFvQkEiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnM7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG51c2luZyBTeXN0ZW0uRGlhZ25vc3RpY3MuQ29udHJhY3RzO1xyXG51c2luZyBTeXN0ZW0uTGlucTtcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIEFwcFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBjb25zdCBpbnQgeE11bHRpcGxpZXIgPSAyMCwgeU11bHRpcGxpZXIgPSAyMDtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludCBzY3JlZW5XaWR0aCA9IEdsb2JhbC5TY3JlZW4uV2lkdGgsIHNjcmVlbkhlaWdodCA9IEdsb2JhbC5TY3JlZW4uSGVpZ2h0O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IHdpZHRoID0gc2NyZWVuV2lkdGggLyB4TXVsdGlwbGllciwgaGVpZ2h0ID0gc2NyZWVuSGVpZ2h0IC8geU11bHRpcGxpZXI7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTERpdkVsZW1lbnQgSG90YmFyID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgIFBvc2l0aW9uID0gUG9zaXRpb24uQWJzb2x1dGUsXHJcbiAgICAgICAgICAgICAgICBMZWZ0ID0gXCIxMDBweFwiLFxyXG4gICAgICAgICAgICAgICAgVG9wID0gc3RyaW5nLkZvcm1hdChcInswfXB4XCIsaGVpZ2h0ICogeU11bHRpcGxpZXIgLSAzMCkgICAgICAgICAgICB9XHJcbiAgICAgICAgfSxSZXNldEJ1dHRvbiA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTEJ1dHRvbkVsZW1lbnQ+KG5ldyBIVE1MQnV0dG9uRWxlbWVudFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgT25DbGljayA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU3F1YXJlcy5DbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcIlJlc2V0XCIpKTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MRGl2RWxlbWVudCBTZXR0aW5nc1BvcHVwQ29udGFpbmVyID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkNhbGxGb3IobmV3IEhUTUxEaXZFbGVtZW50KCksKF9vMSk9PntfbzEuU3R5bGUuUG9zaXRpb249IFBvc2l0aW9uLkZpeGVkO19vMS5TdHlsZS5Ub3A9IFwiMFwiO19vMS5TdHlsZS5MZWZ0PSBcIjBcIjtfbzEuU3R5bGUuV2lkdGg9IFwiMTAwJVwiO19vMS5TdHlsZVtcIngtaW5kZXhcIl09IDk5OTk5OTtfbzEuU3R5bGUuSGVpZ2h0PSBcIjEwMCVcIjtfbzEuU3R5bGUuQmFja2dyb3VuZENvbG9yPSBcInJnYmEoMCwgMCwgMCwgMC41KVwiO19vMS5TdHlsZS5EaXNwbGF5PSBEaXNwbGF5Lk5vbmU7cmV0dXJuIF9vMTt9KVxyXG4sU2V0dGluZ3NQb3B1cCA9IG5ldyBIVE1MRGl2RWxlbWVudFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTdHlsZSA9XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgRm9udFNpemUgPSBcIjEuNXJlbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIEJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIixcclxuICAgICAgICAgICAgICAgICAgICBQb3NpdGlvbiA9IFBvc2l0aW9uLkZpeGVkLFxyXG4gICAgICAgICAgICAgICAgICAgIFRvcCA9IFwiMHB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgTGVmdCA9IFwiMjUlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgV2lkdGggPSBcIjUwJVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIEhlaWdodCA9IFwiMTAwJVwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxEaXZFbGVtZW50IFNldHRpbmdzUG9wdXA7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTEJ1dHRvbkVsZW1lbnQgU2V0dGluZ3NCdXR0b24gPSBuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIElubmVySFRNTCA9IFwi4pqZXCIsXHJcbiAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+XHJcbiAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxCdXR0b25FbGVtZW50IFBsYXlCdXR0b24gPSBuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIElubmVySFRNTCA9IFwi4pa2XCIsXHJcbiAgICAgICAgICAgIFN0eWxlID0geyBDb2xvciA9IFwiZ3JlZW5cIiB9LFxyXG4gICAgICAgICAgICBPbkNsaWNrID0gZSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBwbGF5aW5nID0gIXBsYXlpbmc7XHJcbiAgICAgICAgICAgICAgICBQbGF5QnV0dG9uLlN0eWxlLkNvbG9yID0gcGxheWluZyA/IFwicmVkXCIgOiBcImdyZWVuXCI7XHJcbiAgICAgICAgICAgICAgICBQbGF5QnV0dG9uLklubmVySFRNTCA9IHBsYXlpbmcgPyBcIuKPuFwiIDogXCLilrZcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MQnV0dG9uRWxlbWVudCBSZXNldEJ1dHRvbjtcclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbCBwbGF5aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbFtdIGxpdmluZ1J1bGVzID0gbmV3IGJvb2xbOV0geyBmYWxzZSwgZmFsc2UsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSB9O1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYm9vbFtdIGRlYWRSdWxlcyAgID0gbmV3IGJvb2xbOV0geyBmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UgfTtcclxucHVibGljIHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBDcmVhdGVDYW52YXMoKVxyXG57XHJcbiAgICByZXR1cm4gbmV3IEhUTUxDYW52YXNFbGVtZW50e1dpZHRoID0gc2NyZWVuV2lkdGgsIEhlaWdodCA9IHNjcmVlbkhlaWdodH07XHJcbn1wdWJsaWMgc3RhdGljIEhUTUxDYW52YXNFbGVtZW50IENyZWF0ZUJvdHRvbUNhbnZhcygpXHJcbntcclxuICAgIHJldHVybiBuZXcgSFRNTENhbnZhc0VsZW1lbnR7V2lkdGggPSBzY3JlZW5XaWR0aCArIDIgKiB4TXVsdGlwbGllciwgSGVpZ2h0ID0gc2NyZWVuSGVpZ2h0ICsgMiAqIHlNdWx0aXBsaWVyfTtcclxufVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgRE9NQ2FudmFzID0gQ3JlYXRlQ2FudmFzKCksIEJvdHRvbUNhbnZhcyA9IENyZWF0ZUJvdHRvbUNhbnZhcygpLCBUb3BDYW52YXMgPSBDcmVhdGVDYW52YXMoKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRFxyXG4gICAgICAgICAgICBUb3BDYW52YXNDb250ZXh0ID0gVG9wQ2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpLFxyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0ID0gQm90dG9tQ2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpLFxyXG4gICAgICAgICAgICBET01DYW52YXNDb250ZXh0ID0gRE9NQ2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIEhhc2hTZXQ8U3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPj4gU3F1YXJlcyA9IG5ldyBIYXNoU2V0PFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4+KCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IG9mZnNldFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU3lzdGVtLlZhbHVlVHVwbGU8aW50ICxpbnQgPiBNb3VzZVBvcyAodGhpcyBNb3VzZUV2ZW50IGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgcmVjdCA9IERPTUNhbnZhcy5HZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oKGludCkoZS5DbGllbnRYIC0gcmVjdC5MZWZ0KSwgKGludCkoZS5DbGllbnRZIC0gcmVjdC5Ub3ApKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW50IE5lZ0RpdiAoaW50IGEsIGludCBiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IHJlcyA9IGEgLyBiO1xyXG4gICAgICAgICAgICByZXR1cm4gKGEgPCAwICYmIGEgIT0gYiAqIHJlcykgPyByZXMgLSAxIDogcmVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGNvbnN0IGludCBtYXhBZGphY2VudENlbGxzID0gODtcclxuXHJcbiAgICAgICAgc3RhdGljIExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8SFRNTFNlbGVjdEVsZW1lbnQsSFRNTFNlbGVjdEVsZW1lbnQ+PiBvcHRpb25DZWxscyA9IG5ldyBMaXN0PFN5c3RlbS5WYWx1ZVR1cGxlPEhUTUxTZWxlY3RFbGVtZW50LEhUTUxTZWxlY3RFbGVtZW50Pj4oKTtcclxuXHJcbiAgICAgICAgc3RhdGljIHZvaWQgQXBwbHlQcmVzZXQoYm9vbFtdIGxpdmluZ1J1bGVzLCBib29sW10gZGVhZFJ1bGVzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPD0gODsgbisrKVxyXG4gICAgICAgICAgICB7XHJcbm9wdGlvbkNlbGxzW25dLkl0ZW0xLlNldEJvb2xWYWx1ZShsaXZpbmdSdWxlc1tuXSk7XHJcbm9wdGlvbkNlbGxzW25dLkl0ZW0yLlNldEJvb2xWYWx1ZShkZWFkUnVsZXNbbl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbiAoKVxyXG4gICAgICAgIHtcclxuU3lzdGVtLkFjdGlvbjxNb3VzZUV2ZW50PEhUTUxDYW52YXNFbGVtZW50Pj4gUHJvY2Vzc01vdXNlRXZlbnQgPSBudWxsO1xuU3lzdGVtLkZ1bmM8SFRNTFNlbGVjdEVsZW1lbnQ+IENyZWF0ZTAxU2VsZWN0b3IgPSBudWxsO1xuICAgICAgICAgICAgb2JqZWN0IHJ1bGVzT2JqZWN0U3RyID0gR2xvYmFsLkxvY2FsU3RvcmFnZS5HZXRJdGVtKFwicnVsZXNcIik7XHJcbnN0cmluZyByOyAgICAgICAgICAgIGlmICgociA9IHJ1bGVzT2JqZWN0U3RyIGFzIHN0cmluZykgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHluYW1pYyBydWxlc09iaiA9IEpTT04uUGFyc2Uocik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bGVzT2JqZWN0U3RyICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoU2NyaXB0LldyaXRlKFwiezB9IGluc3RhbmNlb2YgQXJyYXlcIiwgcnVsZXNPYmoubGl2aW5nUnVsZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGl2aW5nUnVsZXMgPSBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxib29sW10+KEpTT04uU3RyaW5naWZ5KHJ1bGVzT2JqLmxpdmluZ1J1bGVzKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTY3JpcHQuV3JpdGUoXCJ7MH0gaW5zdGFuY2VvZiBBcnJheVwiLCBydWxlc09iai5kZWFkUnVsZXMpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVhZFJ1bGVzID0gSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8Ym9vbFtdPihKU09OLlN0cmluZ2lmeShydWxlc09iai5kZWFkUnVsZXMpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCB7IH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LlN0eWxlW1widXNlci1zZWxlY3RcIl0gPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgRG9jdW1lbnQuSGVhZC5BcHBlbmRDaGlsZChuZXcgSFRNTExpbmtFbGVtZW50IHsgUmVsID0gXCJzdHlsZXNoZWV0XCIsIEhyZWYgPSBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vYm9vdHN0cmFwQDUuMi4wL2Rpc3QvY3NzL2Jvb3RzdHJhcC5taW4uY3NzXCIgfSk7XHJcbiAgICAgICAgICAgIERvY3VtZW50LkJvZHkuU3R5bGUuTWFyZ2luID0gXCIwcHhcIjtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChTZXR0aW5nc1BvcHVwQ29udGFpbmVyKTtcclxuICAgICAgICAgICAgRG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChuZXcgSFRNTFN0eWxlRWxlbWVudCB7IElubmVySFRNTCA9IFwidGQsIHRoIHsgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7IHBhZGRpbmc6IDVweCB9XCIgfSk7XHJcblxyXG4gICAgICAgICAgICBIVE1MVGFibGVFbGVtZW50IGFkamFjZW50Q2VsbHNUYWJsZSA9IEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlRWxlbWVudD4oXHJcbm5ldyBIVE1MVGFibGVFbGVtZW50IHsgU3R5bGUgPSB7IE1hcmdpbkxlZnQgPSBcImF1dG9cIiwgTWFyZ2luUmlnaHQgPSBcImF1dG9cIiB9IH0sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVSb3dFbGVtZW50PihcclxuICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVSb3dFbGVtZW50KCksQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudD4oICAgICAgICAgICAgICAgICAgICBuZXcgSFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQoKSxcIiNcIiksXHJcbkN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTFRhYmxlSGVhZGVyQ2VsbEVsZW1lbnQ+KCAgICAgICAgICAgICAgICAgICAgbmV3IEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50KCksXCJMXCIpLFxyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZUhlYWRlckNlbGxFbGVtZW50PiggICAgICAgICAgICAgICAgICAgIG5ldyBIVE1MVGFibGVIZWFkZXJDZWxsRWxlbWVudCgpLFwiRFwiKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgXHJcbkNyZWF0ZTAxU2VsZWN0b3IgPSAoKSA9PiBuZXcgSFRNTFNlbGVjdEVsZW1lbnQoKS5BZGQ8SFRNTFNlbGVjdEVsZW1lbnQ+KEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8SFRNTE9wdGlvbkVsZW1lbnQ+KG5ldyBIVE1MT3B0aW9uRWxlbWVudHtWYWx1ZSA9IFwiZmFsc2VcIn0sIFwiMFwiKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50e1ZhbHVlID0gXCJ0cnVlXCJ9LCBcIjFcIikpO1xuXHJcbiAgICAgICAgICAgIGZvciAoaW50IG4gPSAwOyBuIDw9IG1heEFkamFjZW50Q2VsbHM7IG4rKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSFRNTFRhYmxlUm93RWxlbWVudCByb3cgPSBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFRhYmxlUm93RWxlbWVudD4obmV3IEhUTUxUYWJsZVJvd0VsZW1lbnQoKSxhZGphY2VudENlbGxzVGFibGUpO1xyXG5DdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxUYWJsZVJvd0VsZW1lbnQ+KCAgICAgICAgICAgICAgICByb3csQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQ+KG5ldyBIVE1MVGFibGVEYXRhQ2VsbEVsZW1lbnQoKSxuLlRvU3RyaW5nKCkpKTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbkNlbGxzLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8SFRNTFNlbGVjdEVsZW1lbnQsIEhUTUxTZWxlY3RFbGVtZW50PihDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFNlbGVjdEVsZW1lbnQ+KENyZWF0ZTAxU2VsZWN0b3IoKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudD4obmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpLCByb3cpKS5TZXRCb29sVmFsdWUobGl2aW5nUnVsZXNbbl0pLCBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkVG88SFRNTFNlbGVjdEVsZW1lbnQ+KENyZWF0ZTAxU2VsZWN0b3IoKSwgQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZFRvPEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudD4obmV3IEhUTUxUYWJsZURhdGFDZWxsRWxlbWVudCgpLCByb3cpKS5TZXRCb29sVmFsdWUoZGVhZFJ1bGVzW25dKSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBIVE1MRGl2RWxlbWVudCBwcmVzZXRzID0gQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oXHJcbm5ldyBIVE1MRGl2RWxlbWVudCB7IFN0eWxlID0geyBUZXh0QWxpZ24gPSBUZXh0QWxpZ24uQ2VudGVyIH0gfVxyXG4sQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MQW5jaG9yRWxlbWVudD4oICAgICAgICAgICAgICAgIG5ldyBIVE1MQW5jaG9yRWxlbWVudFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIEhyZWYgPSBcImphdmFzY3JpcHQ6dm9pZCgwKVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFN0eWxlID0geyBGb250U2l6ZSA9IFwiMXJlbVwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgT25DbGljayA9IGUgPT5cclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFwcGx5UHJlc2V0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXZpbmdSdWxlczogbmV3IGJvb2xbOV0geyBmYWxzZSwgZmFsc2UsIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWFkUnVsZXM6IG5ldyBib29sWzldIHsgZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuLFwiQ29ud2F5J3MgR2FtZSBvZiBMaWZlIFByZXNldFwiKVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgU2V0dGluZ3NCdXR0b24uT25DbGljayA9IGUgPT4gU2V0dGluZ3NQb3B1cENvbnRhaW5lci5TdHlsZS5EaXNwbGF5ID0gXCJcIjtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oXHJcbiAgICAgICAgICAgIFNldHRpbmdzUG9wdXAsYWRqYWNlbnRDZWxsc1RhYmxlKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxuZXcgSFRNTEJSRWxlbWVudCgpLCBwcmVzZXRzLCBuZXcgSFRNTEJSRWxlbWVudCgpKTtcclxuQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4oICAgICAgICAgICAgU2V0dGluZ3NQb3B1cCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxCdXR0b25FbGVtZW50PihuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3NOYW1lID0gXCJidG4gYnRuLXByaW1hcnlcIixcclxuICAgICAgICAgICAgICAgIE9uQ2xpY2sgPSBlID0+XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPD0gbWF4QWRqYWNlbnRDZWxsczsgbisrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGl2aW5nUnVsZXNbbl0gPSBvcHRpb25DZWxsc1tuXS5JdGVtMS5Cb29sVmFsdWUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVhZFJ1bGVzW25dID0gb3B0aW9uQ2VsbHNbbl0uSXRlbTIuQm9vbFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIEdsb2JhbC5Mb2NhbFN0b3JhZ2UuU2V0SXRlbShcInJ1bGVzXCIsIEpzb25Db252ZXJ0LlNlcmlhbGl6ZU9iamVjdChuZXdcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpdmluZ1J1bGVzID0gbGl2aW5nUnVsZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYWRSdWxlcyA9IGRlYWRSdWxlc1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICBTZXR0aW5nc1BvcHVwQ29udGFpbmVyLlN0eWxlLkRpc3BsYXkgPSBEaXNwbGF5Lk5vbmU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXCJTYXZlIENoYW5nZXNcIikpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIEhvdGJhci5BcHBlbmRDaGlsZChQbGF5QnV0dG9uKTtcclxuICAgICAgICAgICAgSG90YmFyLkFwcGVuZENoaWxkKFNldHRpbmdzQnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIEhUTUxEaXZFbGVtZW50IGJhY2tncm91bmREaXYgPSBuZXcgSFRNTERpdkVsZW1lbnQgeyBTdHlsZSA9IHsgUG9zaXRpb24gPSBQb3NpdGlvbi5SZWxhdGl2ZSwgTWluV2lkdGggPSBcIjBcIiwgTWluSGVpZ2h0ID0gXCIwXCIgfX07XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5PdmVyZmxvdyA9IE92ZXJmbG93LkhpZGRlbjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLlpJbmRleCA9IFwiLTFcIjtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLlN0eWxlLlBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgICAgICBET01DYW52YXMuU3R5bGUuTGVmdCA9IFwiMHB4XCI7XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5TdHlsZS5Ub3AgPSBcIjBweFwiO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kRGl2LkFwcGVuZENoaWxkKERPTUNhbnZhcyk7XHJcbiAgICAgICAgICAgIC8vYmFja2dyb3VuZERpdi5BcHBlbmRDaGlsZChuZXcgSFRNTEJSRWxlbWVudCgpKTtcclxuICAgICAgICAgICAgYmFja2dyb3VuZERpdi5BcHBlbmRDaGlsZChIb3RiYXIpO1xyXG4gICAgICAgICAgICBEb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKGJhY2tncm91bmREaXYpO1xyXG5cclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5TdHJva2VTdHlsZSA9IFwiYmxhY2tcIjtcclxuICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5UcmFuc2xhdGUoMC41LCAwLjUpO1xyXG4gICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVXaWR0aCA9IDE7XHJcbiAgICAgICAgICAgIGZvciAoaW50IHggPSAwOyB4IDw9ICh3aWR0aCArIDIpOyB4KyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTW92ZVRvKHggKiB4TXVsdGlwbGllciwgMCk7XHJcbiAgICAgICAgICAgICAgICBCb3R0b21DYW52YXNDb250ZXh0LkxpbmVUbyh4ICogeE11bHRpcGxpZXIsIChoZWlnaHQgKyAzKSAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGludCB5ID0gMDsgeSA8PSAoaGVpZ2h0ICsgMik7IHkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5Nb3ZlVG8oMCwgeSAqIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgICAgIEJvdHRvbUNhbnZhc0NvbnRleHQuTGluZVRvKCh3aWR0aCArIDMpICogeE11bHRpcGxpZXIsIHkgKiB5TXVsdGlwbGllcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChpbnQgbiA9IDA7IG4gPCAxMDsgbisrKVxyXG4gICAgICAgICAgICAgICAgQm90dG9tQ2FudmFzQ29udGV4dC5TdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAgIFN5c3RlbS5WYWx1ZVR1cGxlPGludCAsaW50ID4gZHJhZ2dpbmdQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KDAsIDApO1xyXG4gICAgICAgICAgICBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQgLGludCA+IG9yaWdpbmFsUG9zID0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKTtcclxuICAgICAgICAgICAgYm9vbCBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5Pbk1vdXNlRG93biA9IGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hhbmdpbmdJbnRlbnQgPSB0cnVlO1xyXG5pbnQgeDtcbmludCB5O1xuQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChlLk1vdXNlUG9zKCksIG91dCB4LCBvdXQgeSk7XHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZ1BvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCAtIG9mZnNldFBvcy5JdGVtMSwgeSAtIG9mZnNldFBvcy5JdGVtMik7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFBvcyA9IG9mZnNldFBvcztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzLk9uTW91c2VVcCA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguQWJzKG9mZnNldFBvcy5JdGVtMS0gb3JpZ2luYWxQb3MuSXRlbTEpID4geE11bHRpcGxpZXIgfHwgTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0yLSBvcmlnaW5hbFBvcy5JdGVtMikgPiB5TXVsdGlwbGllcilcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2luZ0ludGVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmdQb3MgPSBvZmZzZXRQb3M7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFBvcyA9IG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oMCwgMCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIERPTUNhbnZhcy5Pbk1vdXNlTW92ZSA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKChlLkJ1dHRvbnMgJiAxKSA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBpZiAoZHJhZ2dpbmdQb3MgPT0gbmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PigwLCAwKSkgZHJhZ2dpbmdQb3MgPSBlLk1vdXNlUG9zKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbW91c2VQb3MgPSBlLk1vdXNlUG9zKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5BYnMob2Zmc2V0UG9zLkl0ZW0xLSBvcmlnaW5hbFBvcy5JdGVtMSkgPiB4TXVsdGlwbGllciB8fCBNYXRoLkFicyhvZmZzZXRQb3MuSXRlbTEtIG9yaWdpbmFsUG9zLkl0ZW0xKSA+IHlNdWx0aXBsaWVyKVxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXRQb3MgPSBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KG1vdXNlUG9zLkl0ZW0xIC0gZHJhZ2dpbmdQb3MuSXRlbTEsIG1vdXNlUG9zLkl0ZW0yIC0gZHJhZ2dpbmdQb3MuSXRlbTIpO1xyXG4gICAgICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgICAgICB9O1xyXG5Qcm9jZXNzTW91c2VFdmVudCA9IChlKSA9PlxyXG57XHJcbiAgICAvL2lmICgoQGV2ZW50LkJ1dHRvbnMgJiAxKSA9PSAwKSByZXR1cm47XHJcbiAgICB2YXIgbW91c2VQb3MgPSBlLk1vdXNlUG9zKCk7XHJcbiAgICBpbnQgY2xpY2tYO1xyXG4gICAgaW50IGNsaWNrWTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihOZWdEaXYobW91c2VQb3MuSXRlbTEgLSBvZmZzZXRQb3MuSXRlbTEsIHhNdWx0aXBsaWVyKSwgTmVnRGl2KChtb3VzZVBvcy5JdGVtMiAtIG9mZnNldFBvcy5JdGVtMiksIHlNdWx0aXBsaWVyKSksIG91dCBjbGlja1gsIG91dCBjbGlja1kpO1xyXG4gICAgaWYgKCFTcXVhcmVzLlJlbW92ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KGNsaWNrWCwgY2xpY2tZKSkpXHJcbiAgICAgICAgU3F1YXJlcy5BZGQobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50PihjbGlja1gsIGNsaWNrWSkpO1xyXG4gICAgRHJhdygpO1xyXG59XHJcblxyXG47XG4gICAgICAgICAgICBET01DYW52YXMuT25DbGljayA9IGUgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoYW5naW5nSW50ZW50KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFByb2Nlc3NNb3VzZUV2ZW50KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5naW5nSW50ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBHbG9iYWwuU2V0SW50ZXJ2YWwoKEFjdGlvbilOZXh0RnJhbWUsIDEwMCk7XHJcblxyXG4gICAgICAgICAgICBEcmF3KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJvb2wgdXBkYXRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnQgTnVtYmVyT2ZBZGphY2VudENlbGxzIChpbnQgeCwgaW50IHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgYWRqYWNlbnRDZWxscyA9IDA7XHJcbiAgICAgICAgICAgIGZvciAoaW50IEwgPSAwOyBMIDw9IDg7IEwrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKEwgPT0gNCkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaW50IHhfID0geCAtIDEgKyAoTCAlIDMpLFxyXG4gICAgICAgICAgICAgICAgICAgIHlfID0geSAtIDEgKyBMIC8gMztcclxuXHJcbiAgICAgICAgICAgICAgICAvL2lmICh4XyA8IDAgfHwgeF8gPj0gd2lkdGggfHwgeV8gPCAwIHx8IHlfID49IGhlaWdodCkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKFNxdWFyZXMuQ29udGFpbnMobmV3IFN5c3RlbS5WYWx1ZVR1cGxlPGludCwgaW50Pih4XywgeV8pKSlcclxuICAgICAgICAgICAgICAgICAgICBhZGphY2VudENlbGxzKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFkamFjZW50Q2VsbHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgVXBkYXRlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vdXBkYXRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4gcmVtb3ZpbmcgPSBuZXcgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4oKTtcclxuICAgICAgICAgICAgTGlzdDxTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsaW50Pj4gYWRkaW5nID0gbmV3IExpc3Q8U3lzdGVtLlZhbHVlVHVwbGU8aW50LGludD4+KCk7XHJcbmZvcmVhY2ggKHZhciBfZDEgaW4gU3F1YXJlcylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2QxLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaW50IGFkamFjZW50Q2VsbHMgPSAwO1xyXG4gICAgZm9yIChpbnQgTCA9IDA7IEwgPD0gODsgTCsrKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChMID09IDQpXHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIGludCB4XyA9IHggLSAxICsgKEwgJSAzKSwgeV8gPSB5IC0gMSArIEwgLyAzO1xyXG4gICAgICAgIGlmIChTcXVhcmVzLkNvbnRhaW5zKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeF8sIHlfKSkpXHJcbiAgICAgICAgICAgIGFkamFjZW50Q2VsbHMrKztcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IGNlbGxzLlxyXG4gICAgICAgICAgICAvLyBPcHRpbWl6YXRpb24gZm9yIHJ1bGUgb2YgMyBhZGphY2VudCBjZWxsc1xyXG4gICAgICAgICAgICAvL2lmIChMICE9IDcgJiYgTCAhPSA4KVxyXG4gICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgIGlmIChkZWFkUnVsZXNbTnVtYmVyT2ZBZGphY2VudENlbGxzKHhfLCB5XyldKVxyXG4gICAgICAgICAgICAgICAgYWRkaW5nLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHhfLCB5XykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWxpdmluZ1J1bGVzW2FkamFjZW50Q2VsbHNdKVxyXG4gICAgICAgIHJlbW92aW5nLkFkZChuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHgsIHkpKTtcclxufVxuZm9yZWFjaCAodmFyIF9kMiBpbiByZW1vdmluZylcclxue1xyXG4gICAgaW50IHg7XHJcbiAgICBpbnQgeTtcclxuICAgIEJyaWRnZS5TY3JpcHQuRGVjb25zdHJ1Y3QoX2QyLCBvdXQgeCwgb3V0IHkpO1xyXG4gICAgaWYgKCFTcXVhcmVzLlJlbW92ZShuZXcgU3lzdGVtLlZhbHVlVHVwbGU8aW50LCBpbnQ+KHgsIHkpKSlcclxuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiU3F1YXJlIHRyaWVkIHRvIGJlIHJlbW92ZWQgYnV0IGRpZG4ndCBleGlzdFwiKTtcclxufVxuZm9yZWFjaCAodmFyIF9kMyBpbiBhZGRpbmcpXHJcbntcclxuICAgIGludCB4O1xyXG4gICAgaW50IHk7XHJcbiAgICBCcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KF9kMywgb3V0IHgsIG91dCB5KTtcclxuICAgIFNxdWFyZXMuQWRkKG5ldyBTeXN0ZW0uVmFsdWVUdXBsZTxpbnQsIGludD4oeCwgeSkpO1xyXG59XG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIERyYXcgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuQ2xlYXJSZWN0KDAsIDAsIERPTUNhbnZhcy5XaWR0aCwgRE9NQ2FudmFzLkhlaWdodCk7XHJcbiAgICAgICAgICAgIFRvcENhbnZhc0NvbnRleHQuQ2xlYXJSZWN0KDAsIDAsIERPTUNhbnZhcy5XaWR0aCwgRE9NQ2FudmFzLkhlaWdodCk7XHJcbmludCBvZmZzZXRYO1xuaW50IG9mZnNldFk7XG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KG9mZnNldFBvcywgb3V0IG9mZnNldFgsIG91dCBvZmZzZXRZKTtcclxuZm9yZWFjaCAodmFyIF9kNCBpbiBTcXVhcmVzKVxyXG57XHJcbiAgICBpbnQgeDtcclxuICAgIGludCB5O1xyXG4gICAgQnJpZGdlLlNjcmlwdC5EZWNvbnN0cnVjdChfZDQsIG91dCB4LCBvdXQgeSk7XHJcbiAgICBUb3BDYW52YXNDb250ZXh0LkZpbGxSZWN0KHggKiB4TXVsdGlwbGllciArIG9mZnNldFgsIHkgKiB5TXVsdGlwbGllciArIG9mZnNldFksIHhNdWx0aXBsaWVyLCB5TXVsdGlwbGllcik7XHJcbn1cbiAgICAgICAgICAgIERPTUNhbnZhc0NvbnRleHQuRHJhd0ltYWdlKEJvdHRvbUNhbnZhcywgb2Zmc2V0WCAlIHhNdWx0aXBsaWVyIC0geE11bHRpcGxpZXIsIG9mZnNldFkgJSB5TXVsdGlwbGllciAtIHlNdWx0aXBsaWVyKTtcclxuICAgICAgICAgICAgRE9NQ2FudmFzQ29udGV4dC5EcmF3SW1hZ2UoVG9wQ2FudmFzLCAwLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBOZXh0RnJhbWUgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICghcGxheWluZykgcmV0dXJuO1xyXG4gICAgICAgICAgICBVcGRhdGUoKTtcclxuICAgICAgICAgICAgRHJhdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIFN5c3RlbS5UZXh0O1xyXG51c2luZyBTeXN0ZW0uVGV4dC5SZWd1bGFyRXhwcmVzc2lvbnM7XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgQ3VzdG9taXphYmxlR2FtZW9mTGlmZVxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIEV4dGVuc2lvbnNcclxuICAgIHtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoKGUsIGMpID0+IGMuYXBwZW5kQ2hpbGQoZSkpKHtlbGVtZW50fSwge2NvbnRhaW5pbmdFbGVtfSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBBZGRUbzxUPih0aGlzIFQgZWxlbWVudCwgTm9kZSBjb250YWluaW5nRWxlbSkgd2hlcmUgVCA6IE5vZGU7XHJcbiAgICAgICAgLy9wdWJsaWMgc3RhdGljIFQgQWRkVG9Cb2R5PFQ+KHRoaXMgVCBuKSB3aGVyZSBUIDogTm9kZSA9PiBBcHAucm9vdC5BcHBlbmRDaGlsZDxUPihuKTtcclxuICAgICAgICBbVGVtcGxhdGUoXCJ7bm9kZX0uYXBwZW5kQ2hpbGQoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBUIEFwcGVuZENoaWxkPFQ+KHRoaXMgTm9kZSBub2RlLCBUIGVsZW1lbnQpIHdoZXJlIFQgOiBOb2RlO1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihlID0+IChlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZScsIGUpKSh7ZWxlbWVudH0pXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIFQgSGlkZTxUPih0aGlzIFQgZWxlbWVudCkgd2hlcmUgVCA6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIFtUZW1wbGF0ZShcIihlID0+IChlLnN0eWxlLmRpc3BsYXkgPSAnJywgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBTaG93PFQ+KHRoaXMgVCBlbGVtZW50KSB3aGVyZSBUIDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgW1RlbXBsYXRlKFwiKGxpID0+IChsaS5hcHBlbmRDaGlsZCh7ZWxlbWVudH0pLCBsaSkpKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJykpXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIEhUTUxMSUVsZW1lbnQgV3JhcExpKHRoaXMgTm9kZSBlbGVtZW50KTtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZGl2ID0+IChkaXYuYXBwZW5kQ2hpbGQoe2VsZW1lbnR9KSwgZGl2KSkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpXCIpXVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZXJuIEhUTUxEaXZFbGVtZW50IFdyYXBEaXYodGhpcyBOb2RlIGVsZW1lbnQpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVCBBZGQ8VD4odGhpcyBUIGVsZW1lbnQsIHBhcmFtcyBVbmlvbjxOb2RlLCBzdHJpbmc+W10gbm9kZXMpIHdoZXJlIFQgOiBOb2RlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3JlYWNoIChVbmlvbjxOb2RlLCBzdHJpbmc+IG5vZGUgaW4gbm9kZXMpXHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZSA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5JczxzdHJpbmc+KCkpXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5BcHBlbmRDaGlsZChuZXcgVGV4dChub2RlLkFzPHN0cmluZz4oKSkpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuQXBwZW5kQ2hpbGQobm9kZS5BczxOb2RlPigpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIFQgQWRkRWxlbWVudDxUPih0aGlzIFQgZWxlbWVudCwgcGFyYW1zIFVuaW9uPE5vZGUsIHN0cmluZz5bXSBub2RlcylcclxuICAgIHdoZXJlIFQgOiBOb2RlXHJcbntcclxuICAgIHJldHVybiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPFQ+KGVsZW1lbnQsbm9kZXMpO1xyXG59cHVibGljIHN0YXRpYyBUIEFkZERpdjxUPih0aGlzIFQgZWxlbWVudCwgcGFyYW1zIFVuaW9uPE5vZGUsIHN0cmluZz5bXSBub2RlcylcclxuICAgIHdoZXJlIFQgOiBOb2RlXHJcbntcclxuICAgIHJldHVybiBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPFQ+KGVsZW1lbnQsQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MRGl2RWxlbWVudD4obmV3IEhUTUxEaXZFbGVtZW50KCksbm9kZXMpKTtcclxufXB1YmxpYyBzdGF0aWMgVCBBZGRVbDxUPih0aGlzIFQgZWxlbWVudCwgcGFyYW1zIFVuaW9uPE5vZGUsIFVuaW9uPE5vZGUsIHN0cmluZz5bXSwgc3RyaW5nPltdIG5vZGVzKVxyXG4gICAgd2hlcmUgVCA6IE5vZGVcclxue1xyXG4gICAgcmV0dXJuIEN1c3RvbWl6YWJsZUdhbWVvZkxpZmUuRXh0ZW5zaW9ucy5BZGQ8VD4oZWxlbWVudCxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxVTGlzdEVsZW1lbnQ+KG5ldyBIVE1MVUxpc3RFbGVtZW50KCksU3lzdGVtLkFycmF5RXh0ZW5zaW9ucy5NYXA8VW5pb248Tm9kZSxVbmlvbjxOb2RlLCBzdHJpbmc+W10sc3RyaW5nPixVbmlvbjxOb2RlLHN0cmluZz4+KG5vZGVzLChGdW5jPFVuaW9uPE5vZGUsVW5pb248Tm9kZSwgc3RyaW5nPltdLHN0cmluZz4sVW5pb248Tm9kZSxzdHJpbmc+PikobiA9PiAoVW5pb248Tm9kZSwgc3RyaW5nPikobi5JczxVbmlvbjxOb2RlLCBzdHJpbmc+W10+KCkgPyBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxMSUVsZW1lbnQ+KG5ldyBIVE1MTElFbGVtZW50KCksbi5BczxVbmlvbjxOb2RlLCBzdHJpbmc+W10+KCkpIDogbi5JczxzdHJpbmc+KCkgPyBDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxMSUVsZW1lbnQ+KG5ldyBIVE1MTElFbGVtZW50KCksbi5BczxzdHJpbmc+KCkpIDogQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MTElFbGVtZW50PihuZXcgSFRNTExJRWxlbWVudCgpLG4uQXM8Tm9kZT4oKSkpKSkpKTtcclxufXB1YmxpYyBzdGF0aWMgc3RyaW5nIEFkZENhbWVsU3BhY2UodGhpcyBzdHJpbmcgc3RyKVxyXG57XHJcbiAgICByZXR1cm4gUmVnZXguUmVwbGFjZShSZWdleC5SZXBsYWNlKHN0ciwgQFwiKFteX2Etel0pKFteX2Etel1bYS16XSlcIiwgXCIkMSAkMlwiKSwgQFwiKFthLXpdKShbXl9hLXpdKVwiLCBcIiQxICQyXCIpO1xyXG59cHVibGljIHN0YXRpYyBzdHJpbmcgVG9DYW1lbFN0cmluZzxUPih0aGlzIFQgZSlcclxuICAgIHdoZXJlIFQgOiBzdHJ1Y3QsIFN5c3RlbS5FbnVtXHJcbntcclxuICAgIHJldHVybiBlLlRvU3RyaW5nKCkuQWRkQ2FtZWxTcGFjZSgpLlJlcGxhY2UoJ18nLCAnICcpO1xyXG59ICAgICAgICBwdWJsaWMgc3RhdGljIEhUTUxTZWxlY3RFbGVtZW50IEFkZEVudW08VD4odGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QsIFQ/IGRlZmF1bHRWYWx1ZSA9IG51bGwsIHN0cmluZyBkZWZhdWx0VmFsdWVTdHJpbmcgPSBcIlwiKSB3aGVyZSBUIDogc3RydWN0LCBTeXN0ZW0uRW51bVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGRlZmF1bHRWYWx1ZSA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgc2VsZWN0LkFkZChDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuQWRkPEhUTUxPcHRpb25FbGVtZW50PihuZXcgSFRNTE9wdGlvbkVsZW1lbnQgeyBWYWx1ZSA9IFwiXCIsIFNlbGVjdGVkID0gdHJ1ZSwgRGlzYWJsZSA9IHRydWUgfSxkZWZhdWx0VmFsdWVTdHJpbmcpKTtcclxuICAgICAgICAgICAgZm9yZWFjaCAoVCB2YWx1ZSBpbiBTeXN0ZW0uRW51bS5HZXRWYWx1ZXModHlwZW9mKFQpKSlcclxuICAgICAgICAgICAgICAgIHNlbGVjdC5BZGQoQ3VzdG9taXphYmxlR2FtZW9mTGlmZS5FeHRlbnNpb25zLkFkZDxIVE1MT3B0aW9uRWxlbWVudD4obmV3IEhUTUxPcHRpb25FbGVtZW50XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgVmFsdWUgPSAoKGludCkob2JqZWN0KXZhbHVlKS5Ub1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIFNlbGVjdGVkID0gb2JqZWN0LkVxdWFscyhkZWZhdWx0VmFsdWUsIHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgfSxDdXN0b21pemFibGVHYW1lb2ZMaWZlLkV4dGVuc2lvbnMuVG9DYW1lbFN0cmluZzxUPih2YWx1ZSkpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgICAgICB9XHJcbnB1YmxpYyBzdGF0aWMgYm9vbCBCb29sVmFsdWUodGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QpXHJcbntcclxuICAgIHJldHVybiBzZWxlY3QuVmFsdWUgPT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2U7XHJcbn1wdWJsaWMgc3RhdGljIFQ/IFZhbHVlPFQ+KHRoaXMgSFRNTFNlbGVjdEVsZW1lbnQgc2VsZWN0KVxyXG4gICAgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxue1xyXG4gICAgcmV0dXJuIHNlbGVjdC5WYWx1ZSA9PSBcIlwiID8gbnVsbCA6IChUPyApKFQpKG9iamVjdClpbnQuUGFyc2Uoc2VsZWN0LlZhbHVlKTtcclxufSAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBTZXRCb29sVmFsdWUodGhpcyBIVE1MU2VsZWN0RWxlbWVudCBzZWxlY3QsIGJvb2wgdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWxlY3QuVmFsdWUgPSB2YWx1ZS5Ub1N0cmluZygpLlRvTG93ZXIoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBIVE1MU2VsZWN0RWxlbWVudCBTZXRWYWx1ZTxUPih0aGlzIEhUTUxTZWxlY3RFbGVtZW50IHNlbGVjdCwgVCB2YWx1ZSkgd2hlcmUgVCA6IHN0cnVjdCwgU3lzdGVtLkVudW1cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNlbGVjdC5WYWx1ZSA9ICgoaW50KShvYmplY3QpdmFsdWUpLlRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Q7XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgc3RhdGljIHN0cmluZyBUb1RpbWVTdHJpbmcodGhpcyBUaW1lU3BhbiB0aW1lKVxyXG57XHJcbiAgICByZXR1cm4gdGltZS5Ub1N0cmluZyh0aW1lID49IFRpbWVTcGFuLkZyb21Ib3VycygxKSA/IEBcImhcXDptbVxcOnNzXCIgOiBAXCJtXFw6c3NcIik7XHJcbn0gICAgICAgIFtUZW1wbGF0ZShcIihlID0+IChlLnNldEN1c3RvbVZhbGlkaXR5KHttZXNzYWdlfSksIGUucmVwb3J0VmFsaWRpdHkoKSwgZSkpKHtlbGVtZW50fSlcIildXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlcm4gVCBTZXRDdXN0b21WYWxpZGl0eTxUPih0aGlzIFQgZWxlbWVudCwgc3RyaW5nIG1lc3NhZ2UpIHdoZXJlIFQgOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBbVGVtcGxhdGUoXCIoZSA9PiAoZS5zZXRBdHRyaWJ1dGUoJ2xpc3QnLCB7ZGF0YWxpc3RJRH0pLCBlKSkoe2VsZW1lbnR9KVwiKV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVybiBIVE1MSW5wdXRFbGVtZW50IFNldERhdGFMaXN0KHRoaXMgSFRNTElucHV0RWxlbWVudCBlbGVtZW50LCBzdHJpbmcgZGF0YWxpc3RJRCk7XHJcbiAgICAgICAgLy9bVGVtcGxhdGUoXCJ7ZWxlbX0uYXBwZW5kQ2hpbGQoe2FkZGluZ30pXCIpXVxyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBleHRlcm4gVCBBcHBlbmQ8VD4gKHRoaXMgTm9kZSBlbGVtLCBUIGFkZGluZyk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVW5pb248Tm9kZSwgc3RyaW5nPltdIEpvaW5CUih0aGlzIElFbnVtZXJhYmxlPHN0cmluZz4gc3RyaW5ncylcclxuICAgICAgICB7XHJcblN5c3RlbS5GdW5jPElFbnVtZXJhYmxlPFVuaW9uPE5vZGUsIHN0cmluZz4+PiBJbm5lciA9IG51bGw7XG4gICAgICAgICAgICBcclxuSW5uZXIgPSAoKSA9PlxyXG57XHJcbiAgICB1c2luZyAodmFyIGVudW1lciA9IHN0cmluZ3MuR2V0RW51bWVyYXRvcigpKVxyXG4gICAge1xyXG4gICAgICAgIGlmICghZW51bWVyLk1vdmVOZXh0KCkpXHJcbiAgICAgICAgICAgIHlpZWxkIGJyZWFrO1xyXG4gICAgICAgIHlpZWxkIHJldHVybiBlbnVtZXIuQ3VycmVudDtcclxuICAgICAgICB3aGlsZSAoZW51bWVyLk1vdmVOZXh0KCkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB5aWVsZCByZXR1cm4gbmV3IEhUTUxCUkVsZW1lbnQoKTtcclxuICAgICAgICAgICAgeWllbGQgcmV0dXJuIGVudW1lci5DdXJyZW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuO1xuICAgICAgICAgICAgcmV0dXJuIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuVG9BcnJheTxVbmlvbjxOb2RlLHN0cmluZz4+KElubmVyKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXQp9Cg==
