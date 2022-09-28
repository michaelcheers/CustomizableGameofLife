using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CustomizableGameofLife
{
    /// <summary>
    /// Options:
    /// - Cell (IsCell: true, IsWall: false)  | Black
    /// - Wall (IsCell: true, IsWall: true)   | Grey
    /// - Brick (IsCell: false, IsWall: true) | Grey
    /// </summary>

    internal class Square
    {
        // Brick is full cell. Wall does not count a cell.
        public bool IsCell;
        public bool IsWall;

        //public int MinAge;
        //public int MaxAge;
        //public int MaxAloneTime;
    }
}
