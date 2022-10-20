Bridge.assembly("CustomizableGameofLife", function ($asm, globals) {
    "use strict";


    var $m = Bridge.setMetadata,
        $n = ["CustomizableGameofLife","System","System.Collections.Generic"];
    $m("CustomizableGameofLife.AdjacencyType", function () { return {"att":257,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"One","is":true,"t":4,"rt":$n[0].AdjacencyType,"sn":"One","box":function ($v) { return Bridge.box($v, CustomizableGameofLife.AdjacencyType, System.Enum.toStringFn(CustomizableGameofLife.AdjacencyType));}},{"a":2,"n":"Two","is":true,"t":4,"rt":$n[0].AdjacencyType,"sn":"Two","box":function ($v) { return Bridge.box($v, CustomizableGameofLife.AdjacencyType, System.Enum.toStringFn(CustomizableGameofLife.AdjacencyType));}},{"a":2,"n":"Zero","is":true,"t":4,"rt":$n[0].AdjacencyType,"sn":"Zero","box":function ($v) { return Bridge.box($v, CustomizableGameofLife.AdjacencyType, System.Enum.toStringFn(CustomizableGameofLife.AdjacencyType));}}]}; }, $n);
    $m("CustomizableGameofLife.App", function () { return {"nested":[$n[0].App.ModalType],"att":1048961,"a":2,"s":true,"m":[{"a":1,"n":"ApplyPreset","is":true,"t":8,"pi":[{"n":"livingRules","pt":$n[1].Array.type(System.Boolean),"ps":0},{"n":"deadRules","pt":$n[1].Array.type(System.Boolean),"ps":1}],"sn":"ApplyPreset","rt":$n[1].Void,"p":[$n[1].Array.type(System.Boolean),$n[1].Array.type(System.Boolean)]},{"a":2,"n":"Create012Selector","is":true,"t":8,"sn":"Create012Selector","rt":HTMLSelectElement},{"a":2,"n":"Create01Selector","is":true,"t":8,"sn":"Create01Selector","rt":HTMLSelectElement},{"a":2,"n":"CreateBottomCanvas","is":true,"t":8,"sn":"CreateBottomCanvas","rt":HTMLCanvasElement},{"a":2,"n":"CreateCanvas","is":true,"t":8,"sn":"CreateCanvas","rt":HTMLCanvasElement},{"a":2,"n":"CreateCheckbox","is":true,"t":8,"sn":"CreateCheckbox","rt":HTMLInputElement},{"a":2,"n":"CreateImageDataArray","is":true,"t":8,"pi":[{"n":"width","pt":$n[1].Int32,"ps":0},{"n":"height","pt":$n[1].Int32,"ps":1}],"sn":"CreateImageDataArray","rt":Uint8ClampedArray,"p":[$n[1].Int32,$n[1].Int32]},{"a":2,"n":"CreatePopup","is":true,"t":8,"sn":"CreatePopup","rt":HTMLDivElement},{"a":2,"n":"CreateTopCanvas","is":true,"t":8,"sn":"CreateTopCanvas","rt":HTMLCanvasElement},{"a":2,"n":"Draw","is":true,"t":8,"sn":"Draw","rt":$n[1].Void},{"a":2,"n":"DrawShape","is":true,"t":8,"pi":[{"n":"Squares","pt":$n[2].HashSet$1(System.ValueTuple$2(System.Int32,System.Int32)),"ps":0}],"sn":"DrawShape","rt":HTMLCanvasElement,"p":[$n[2].HashSet$1(System.ValueTuple$2(System.Int32,System.Int32))]},{"a":2,"n":"GetCoordinates","is":true,"t":8,"sn":"GetCoordinates","rt":$n[1].Void},{"a":2,"n":"GetCoordinatesInteral","is":true,"t":8,"sn":"GetCoordinatesInteral","rt":$n[2].List$1(System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.SquareType))},{"a":2,"n":"GetNormalizedCoordinates","is":true,"t":8,"sn":"GetNormalizedCoordinates","rt":$n[2].List$1(System.ValueTuple$3(System.Int32,System.Int32,CustomizableGameofLife.SquareType))},{"a":2,"n":"HasDividers","is":true,"t":8,"pi":[{"n":"x","pt":$n[1].Int32,"ps":0},{"n":"y","pt":$n[1].Int32,"ps":1},{"n":"L","pt":$n[1].Int32,"ps":2}],"sn":"HasDividers","rt":$n[1].Boolean,"p":[$n[1].Int32,$n[1].Int32,$n[1].Int32],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"HideModal","is":true,"t":8,"sn":"HideModal","rt":$n[1].Void},{"a":2,"n":"InvertIsPlaying","is":true,"t":8,"sn":"InvertIsPlaying","rt":$n[1].Void},{"a":2,"n":"Main","is":true,"t":8,"sn":"Main","rt":$n[1].Void},{"a":2,"n":"MousePos","is":true,"t":8,"pi":[{"n":"e","pt":MouseEvent,"ps":0}],"sn":"MousePos","rt":$n[1].ValueTuple$2(System.Int32,System.Int32),"p":[MouseEvent]},{"a":2,"n":"NegDiv","is":true,"t":8,"pi":[{"n":"a","pt":$n[1].Int32,"ps":0},{"n":"b","pt":$n[1].Int32,"ps":1}],"sn":"NegDiv","rt":$n[1].Int32,"p":[$n[1].Int32,$n[1].Int32],"box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"NegDivDouble","is":true,"t":8,"pi":[{"n":"a","pt":$n[1].Double,"ps":0},{"n":"b","pt":$n[1].Double,"ps":1}],"sn":"NegDivDouble","rt":$n[1].Double,"p":[$n[1].Double,$n[1].Double],"box":function ($v) { return Bridge.box($v, System.Double, System.Double.format, System.Double.getHashCode);}},{"a":2,"n":"NextFrame","is":true,"t":8,"sn":"NextFrame","rt":$n[1].Void},{"a":2,"n":"NextSquareType","is":true,"t":8,"sn":"NextSquareType","rt":$n[1].Void},{"a":2,"n":"NumberOfAdjacentCells","is":true,"t":8,"pi":[{"n":"x","pt":$n[1].Int32,"ps":0},{"n":"y","pt":$n[1].Int32,"ps":1}],"sn":"NumberOfAdjacentCells","rt":$n[1].Int32,"p":[$n[1].Int32,$n[1].Int32],"box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"Reset","is":true,"t":8,"pi":[{"n":"makeBlank","dv":false,"o":true,"pt":$n[1].Boolean,"ps":0}],"sn":"Reset","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":2,"n":"SaveAsStarter","is":true,"t":8,"sn":"SaveAsStarter","rt":$n[1].Void},{"a":2,"n":"ShowModal","is":true,"t":8,"pi":[{"n":"modalType","pt":$n[0].App.ModalType,"ps":0}],"sn":"ShowModal","rt":$n[1].Void,"p":[$n[0].App.ModalType]},{"a":2,"n":"Update","is":true,"t":8,"sn":"Update","rt":$n[1].Void},{"a":2,"n":"BottomCanvas","is":true,"t":4,"rt":HTMLCanvasElement,"sn":"BottomCanvas"},{"a":2,"n":"BottomCanvasContext","is":true,"t":4,"rt":CanvasRenderingContext2D,"sn":"BottomCanvasContext"},{"a":2,"n":"DOMCanvas","is":true,"t":4,"rt":HTMLCanvasElement,"sn":"DOMCanvas"},{"a":2,"n":"DOMCanvasContext","is":true,"t":4,"rt":CanvasRenderingContext2D,"sn":"DOMCanvasContext"},{"a":2,"n":"Dividers","is":true,"t":4,"rt":$n[2].Dictionary$2(System.ValueTuple$2(System.Int32,System.Int32),CustomizableGameofLife.DividersInfo),"sn":"Dividers"},{"a":2,"n":"Hotbar","is":true,"t":4,"rt":HTMLDivElement,"sn":"Hotbar"},{"a":2,"n":"NextSquareTypeButton","is":true,"t":4,"rt":HTMLButtonElement,"sn":"NextSquareTypeButton"},{"a":2,"n":"NotableObjectsPopup","is":true,"t":4,"rt":HTMLDivElement,"sn":"NotableObjectsPopup"},{"a":2,"n":"PlayButton","is":true,"t":4,"rt":HTMLButtonElement,"sn":"PlayButton"},{"a":2,"n":"PopupContainer","is":true,"t":4,"rt":HTMLDivElement,"sn":"PopupContainer"},{"a":2,"n":"RightHotbar","is":true,"t":4,"rt":HTMLDivElement,"sn":"RightHotbar"},{"a":2,"n":"SettingsButton","is":true,"t":4,"rt":HTMLButtonElement,"sn":"SettingsButton"},{"a":2,"n":"SettingsPopup","is":true,"t":4,"rt":HTMLDivElement,"sn":"SettingsPopup"},{"a":2,"n":"SquareTypePlacing","is":true,"t":4,"rt":$n[0].SquareType,"sn":"SquareTypePlacing","box":function ($v) { return Bridge.box($v, CustomizableGameofLife.SquareType, System.Enum.toStringFn(CustomizableGameofLife.SquareType));}},{"a":2,"n":"Squares","is":true,"t":4,"rt":$n[2].Dictionary$2(System.ValueTuple$2(System.Int32,System.Int32),CustomizableGameofLife.SquareType),"sn":"Squares"},{"a":2,"n":"TopCanvas","is":true,"t":4,"rt":HTMLCanvasElement,"sn":"TopCanvas"},{"a":2,"n":"TopCanvasContext","is":true,"t":4,"rt":CanvasRenderingContext2D,"sn":"TopCanvasContext"},{"a":2,"n":"adjacencyRules","is":true,"t":4,"rt":System.Array.type(CustomizableGameofLife.AdjacencyType),"sn":"adjacencyRules"},{"a":1,"n":"adjacencyRulesCells","is":true,"t":4,"rt":$n[2].List$1(HTMLSelectElement),"sn":"adjacencyRulesCells"},{"a":2,"n":"deadRules","is":true,"t":4,"rt":$n[1].Array.type(System.Boolean),"sn":"deadRules"},{"a":2,"n":"frameNum","is":true,"t":4,"rt":$n[1].Int32,"sn":"frameNum","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"height","is":true,"t":4,"rt":$n[1].Int32,"sn":"height","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"livingRules","is":true,"t":4,"rt":$n[1].Array.type(System.Boolean),"sn":"livingRules"},{"a":2,"n":"maxAdjacentCells","is":true,"t":4,"rt":$n[1].Int32,"sn":"maxAdjacentCells","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"offsetPos","is":true,"t":4,"rt":$n[1].ValueTuple$2(System.Int32,System.Int32),"sn":"offsetPos"},{"a":1,"n":"optionCells","is":true,"t":4,"rt":$n[2].List$1(System.ValueTuple$2(HTMLInputElement,HTMLInputElement)),"sn":"optionCells"},{"a":2,"n":"playing","is":true,"t":4,"rt":$n[1].Boolean,"sn":"playing","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"screenHeight","is":true,"t":4,"rt":$n[1].Int32,"sn":"screenHeight","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"screenWidth","is":true,"t":4,"rt":$n[1].Int32,"sn":"screenWidth","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"updating","is":true,"t":4,"rt":$n[1].Boolean,"sn":"updating","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"width","is":true,"t":4,"rt":$n[1].Int32,"sn":"width","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"xMultiplier","is":true,"t":4,"rt":$n[1].Int32,"sn":"xMultiplier","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"yMultiplier","is":true,"t":4,"rt":$n[1].Int32,"sn":"yMultiplier","box":function ($v) { return Bridge.box($v, System.Int32);}}]}; }, $n);
    $m("CustomizableGameofLife.App.ModalType", function () { return {"td":$n[0].App,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"NotableObjects","is":true,"t":4,"rt":$n[0].App.ModalType,"sn":"NotableObjects","box":function ($v) { return Bridge.box($v, CustomizableGameofLife.App.ModalType, System.Enum.toStringFn(CustomizableGameofLife.App.ModalType));}},{"a":2,"n":"Settings","is":true,"t":4,"rt":$n[0].App.ModalType,"sn":"Settings","box":function ($v) { return Bridge.box($v, CustomizableGameofLife.App.ModalType, System.Enum.toStringFn(CustomizableGameofLife.App.ModalType));}}]}; }, $n);
    $m("CustomizableGameofLife.Extensions", function () { return {"att":1048961,"a":2,"s":true,"m":[{"a":2,"n":"Add","is":true,"t":8,"pi":[{"n":"element","pt":System.Object,"ps":0},{"n":"nodes","ip":true,"pt":System.Array.type(System.Object),"ps":1}],"tpc":1,"tprm":["T"],"sn":"Add","rt":System.Object,"p":[System.Object,System.Array.type(System.Object)]},{"a":2,"n":"AddCamelSpace","is":true,"t":8,"pi":[{"n":"str","pt":$n[1].String,"ps":0}],"sn":"AddCamelSpace","rt":$n[1].String,"p":[$n[1].String]},{"a":2,"n":"AddDiv","is":true,"t":8,"pi":[{"n":"element","pt":System.Object,"ps":0},{"n":"nodes","ip":true,"pt":System.Array.type(System.Object),"ps":1}],"tpc":1,"tprm":["T"],"sn":"AddDiv","rt":System.Object,"p":[System.Object,System.Array.type(System.Object)]},{"a":2,"n":"AddElement","is":true,"t":8,"pi":[{"n":"element","pt":System.Object,"ps":0},{"n":"nodes","ip":true,"pt":System.Array.type(System.Object),"ps":1}],"tpc":1,"tprm":["T"],"sn":"AddElement","rt":System.Object,"p":[System.Object,System.Array.type(System.Object)]},{"a":2,"n":"AddEnum","is":true,"t":8,"pi":[{"n":"select","pt":HTMLSelectElement,"ps":0},{"n":"defaultValue","dv":null,"o":true,"pt":$n[1].Nullable$1(System.Object),"ps":1},{"n":"defaultValueString","dv":"","o":true,"pt":$n[1].String,"ps":2}],"tpc":1,"tprm":["T"],"sn":"AddEnum","rt":HTMLSelectElement,"p":[HTMLSelectElement,$n[1].Nullable$1(System.Object),$n[1].String]},{"a":2,"n":"AddTo","is":true,"t":8,"pi":[{"n":"element","pt":System.Object,"ps":0},{"n":"containingElem","pt":Node,"ps":1}],"tpc":1,"def":function (T, element, containingElem) { return ((e, c) => c.appendChild(e))(element, containingElem); },"rt":System.Object,"p":[System.Object,Node]},{"a":2,"n":"AddUl","is":true,"t":8,"pi":[{"n":"element","pt":System.Object,"ps":0},{"n":"nodes","ip":true,"pt":System.Array.type(System.Object),"ps":1}],"tpc":1,"tprm":["T"],"sn":"AddUl","rt":System.Object,"p":[System.Object,System.Array.type(System.Object)]},{"a":2,"n":"AdjacencyValue","is":true,"t":8,"pi":[{"n":"select","pt":HTMLSelectElement,"ps":0}],"sn":"AdjacencyValue","rt":$n[0].AdjacencyType,"p":[HTMLSelectElement],"box":function ($v) { return Bridge.box($v, CustomizableGameofLife.AdjacencyType, System.Enum.toStringFn(CustomizableGameofLife.AdjacencyType));}},{"a":2,"n":"AppendChild","is":true,"t":8,"pi":[{"n":"node","pt":Node,"ps":0},{"n":"element","pt":System.Object,"ps":1}],"tpc":1,"def":function (T, node, element) { return node.appendChild(element); },"rt":System.Object,"p":[Node,System.Object]},{"a":2,"n":"BoolValue","is":true,"t":8,"pi":[{"n":"checkBox","pt":HTMLInputElement,"ps":0}],"sn":"BoolValue","rt":$n[1].Boolean,"p":[HTMLInputElement],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"BoolValue","is":true,"t":8,"pi":[{"n":"select","pt":HTMLSelectElement,"ps":0}],"sn":"BoolValue$1","rt":$n[1].Boolean,"p":[HTMLSelectElement],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"Hide","is":true,"t":8,"pi":[{"n":"element","pt":System.Object,"ps":0}],"tpc":1,"def":function (T, element) { return (e => (e.style.display = 'none', e))(element); },"rt":System.Object,"p":[System.Object]},{"a":2,"n":"JoinBR","is":true,"t":8,"pi":[{"n":"strings","pt":$n[2].IEnumerable$1(System.String),"ps":0}],"sn":"JoinBR","rt":System.Array.type(System.Object),"p":[$n[2].IEnumerable$1(System.String)]},{"a":2,"n":"SetAdjacencyValue","is":true,"t":8,"pi":[{"n":"select","pt":HTMLSelectElement,"ps":0},{"n":"value","pt":$n[0].AdjacencyType,"ps":1}],"sn":"SetAdjacencyValue","rt":HTMLSelectElement,"p":[HTMLSelectElement,$n[0].AdjacencyType]},{"a":2,"n":"SetBoolValue","is":true,"t":8,"pi":[{"n":"checkBox","pt":HTMLInputElement,"ps":0},{"n":"value","pt":$n[1].Boolean,"ps":1}],"sn":"SetBoolValue","rt":HTMLInputElement,"p":[HTMLInputElement,$n[1].Boolean]},{"a":2,"n":"SetBoolValue","is":true,"t":8,"pi":[{"n":"select","pt":HTMLSelectElement,"ps":0},{"n":"value","pt":$n[1].Boolean,"ps":1}],"sn":"SetBoolValue$1","rt":HTMLSelectElement,"p":[HTMLSelectElement,$n[1].Boolean]},{"a":2,"n":"SetCustomValidity","is":true,"t":8,"pi":[{"n":"element","pt":System.Object,"ps":0},{"n":"message","pt":$n[1].String,"ps":1}],"tpc":1,"def":function (T, element, message) { return (e => (e.setCustomValidity(message), e.reportValidity(), e))(element); },"rt":System.Object,"p":[System.Object,$n[1].String]},{"a":2,"n":"SetDataList","is":true,"t":8,"pi":[{"n":"element","pt":HTMLInputElement,"ps":0},{"n":"datalistID","pt":$n[1].String,"ps":1}],"tpc":0,"def":function (element, datalistID) { return (e => (e.setAttribute('list', datalistID), e))(element); },"rt":HTMLInputElement,"p":[HTMLInputElement,$n[1].String]},{"a":2,"n":"SetValue","is":true,"t":8,"pi":[{"n":"select","pt":HTMLSelectElement,"ps":0},{"n":"value","pt":System.Object,"ps":1}],"tpc":1,"tprm":["T"],"sn":"SetValue","rt":HTMLSelectElement,"p":[HTMLSelectElement,System.Object]},{"a":2,"n":"Show","is":true,"t":8,"pi":[{"n":"element","pt":System.Object,"ps":0}],"tpc":1,"def":function (T, element) { return (e => (e.style.display = '', e))(element); },"rt":System.Object,"p":[System.Object]},{"a":2,"n":"ToCamelString","is":true,"t":8,"pi":[{"n":"e","pt":System.Object,"ps":0}],"tpc":1,"tprm":["T"],"sn":"ToCamelString","rt":$n[1].String,"p":[System.Object]},{"a":2,"n":"ToTimeString","is":true,"t":8,"pi":[{"n":"time","pt":$n[1].TimeSpan,"ps":0}],"sn":"ToTimeString","rt":$n[1].String,"p":[$n[1].TimeSpan]},{"a":2,"n":"Value","is":true,"t":8,"pi":[{"n":"select","pt":HTMLSelectElement,"ps":0}],"tpc":1,"tprm":["T"],"sn":"Value","rt":$n[1].Nullable$1(System.Object),"p":[HTMLSelectElement]},{"a":2,"n":"WrapDiv","is":true,"t":8,"pi":[{"n":"element","pt":Node,"ps":0}],"tpc":0,"def":function (element) { return (div => (div.appendChild(element), div))(document.createElement('div')); },"rt":HTMLDivElement,"p":[Node]},{"a":2,"n":"WrapLi","is":true,"t":8,"pi":[{"n":"element","pt":Node,"ps":0}],"tpc":0,"def":function (element) { return (li => (li.appendChild(element), li))(document.createElement('li')); },"rt":HTMLLIElement,"p":[Node]}]}; }, $n);
    $m("CustomizableGameofLife.NotableObjectsList", function () { return {"att":1048961,"a":2,"s":true,"m":[{"a":2,"n":"NotableObjects","is":true,"t":4,"rt":$n[2].List$1(System.ValueTuple$3(System.Collections.Generic.HashSet$1(System.ValueTuple$2(System.Int32,System.Int32)),System.String,System.String)),"sn":"NotableObjects","ro":true}]}; }, $n);
    $m("CustomizableGameofLife.SquareExtensions", function () { return {"att":1048961,"a":2,"s":true,"m":[{"a":2,"n":"ContainsAlive","is":true,"t":8,"pi":[{"n":"dic","pt":$n[2].Dictionary$2(System.Object,CustomizableGameofLife.SquareType),"ps":0},{"n":"key","pt":System.Object,"ps":1}],"tpc":1,"tprm":["T"],"sn":"ContainsAlive","rt":$n[1].Boolean,"p":[$n[2].Dictionary$2(System.Object,CustomizableGameofLife.SquareType),System.Object],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"IsAlive","is":true,"t":8,"pi":[{"n":"squareType","pt":$n[0].SquareType,"ps":0}],"sn":"IsAlive","rt":$n[1].Boolean,"p":[$n[0].SquareType],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"IsUndead","is":true,"t":8,"pi":[{"n":"squareType","pt":$n[0].SquareType,"ps":0}],"sn":"IsUndead","rt":$n[1].Boolean,"p":[$n[0].SquareType],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}}]}; }, $n);
    $m("CustomizableGameofLife.SquareType", function () { return {"att":257,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Brick","is":true,"t":4,"rt":$n[0].SquareType,"sn":"Brick","box":function ($v) { return Bridge.box($v, CustomizableGameofLife.SquareType, System.Enum.toStringFn(CustomizableGameofLife.SquareType));}},{"a":2,"n":"Cell","is":true,"t":4,"rt":$n[0].SquareType,"sn":"Cell","box":function ($v) { return Bridge.box($v, CustomizableGameofLife.SquareType, System.Enum.toStringFn(CustomizableGameofLife.SquareType));}},{"a":2,"n":"Count","is":true,"t":4,"rt":$n[0].SquareType,"sn":"Count","box":function ($v) { return Bridge.box($v, CustomizableGameofLife.SquareType, System.Enum.toStringFn(CustomizableGameofLife.SquareType));}},{"a":2,"n":"WallBlock","is":true,"t":4,"rt":$n[0].SquareType,"sn":"WallBlock","box":function ($v) { return Bridge.box($v, CustomizableGameofLife.SquareType, System.Enum.toStringFn(CustomizableGameofLife.SquareType));}}]}; }, $n);
    $m("CustomizableGameofLife.DividersInfo", function () { return {"att":257,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Bottom","is":true,"t":4,"rt":$n[0].DividersInfo,"sn":"Bottom","box":function ($v) { return Bridge.box($v, CustomizableGameofLife.DividersInfo, System.Enum.toStringFn(CustomizableGameofLife.DividersInfo));}},{"a":2,"n":"BottomRight","is":true,"t":4,"rt":$n[0].DividersInfo,"sn":"BottomRight","box":function ($v) { return Bridge.box($v, CustomizableGameofLife.DividersInfo, System.Enum.toStringFn(CustomizableGameofLife.DividersInfo));}},{"a":2,"n":"None","is":true,"t":4,"rt":$n[0].DividersInfo,"sn":"None","box":function ($v) { return Bridge.box($v, CustomizableGameofLife.DividersInfo, System.Enum.toStringFn(CustomizableGameofLife.DividersInfo));}},{"a":2,"n":"Right","is":true,"t":4,"rt":$n[0].DividersInfo,"sn":"Right","box":function ($v) { return Bridge.box($v, CustomizableGameofLife.DividersInfo, System.Enum.toStringFn(CustomizableGameofLife.DividersInfo));}}]}; }, $n);
});
