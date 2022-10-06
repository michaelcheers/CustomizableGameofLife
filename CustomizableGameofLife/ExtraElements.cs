using Bridge.Html5;
using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CustomizableGameofLife
{
    //
    // Summary:
    //     The HTMLTableHeaderCellElement interface provides special properties and methods
    //     (beyond the regular HTMLTableCellElement and HTMLElement interfaces it also has
    //     available to it by inheritance) for manipulating the layout and presentation
    //     of table header cells in an HTML document.
    [External]
    [Name("HTMLTableCellElement")]
    public sealed class HTMLTableHeaderCellElement : HTMLTableCellElement<HTMLTableHeaderCellElement>
    {
        //
        // Summary:
        //     Is a DOMString containing a name used to refer to this cell in other context.
        //     It reflects the abbr attribute.
        public string Abbr;

        //
        // Summary:
        //     Is a DOMString representing an enumerated value indicating which cells the header
        //     cell applies to. It reflects the scope attribute and has one of the following
        //     values: "row", "col", "colgroup", or "rowgroup". If the attribute is in the auto
        //     state, or if an invalid value is set for the attribute, scope will be returns
        //     the empty string, "".
        public TableHeaderCellScope Scope;

        [Template("document.createElement(\"th\")")]
        public extern HTMLTableHeaderCellElement();
    }

    //
    // Summary:
    //     The HTMLTableDataCellElement interface provides special properties and methods
    //     (beyond the regular HTMLTableCellElement and HTMLElement interfaces it also has
    //     available to it by inheritance) for manipulating the layout and presentation
    //     of table data cells in an HTML document.
    [External]
    [Name("HTMLTableCellElement")]
    public sealed class HTMLTableDataCellElement : HTMLTableCellElement<HTMLTableDataCellElement>
    {
        [Template("document.createElement(\"td\")")]
        public extern HTMLTableDataCellElement();
    }

    [External]
    [Name("HTMLDetailsElement")]
    public sealed class HTMLDetailsElement : HTMLElement
    {
        [Template("document.createElement(\"details\")")]
        public extern HTMLDetailsElement();

        [Name("open")]
        public bool Open;
    }

    [External]
    [Name("HTMLElement")]
    public sealed class HTMLSummaryElement : HTMLElement
    {
        [Template("document.createElement(\"summary\")")]
        public extern HTMLSummaryElement();
    }
}
