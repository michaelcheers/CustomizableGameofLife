using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CustomizableGameofLife
{
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
