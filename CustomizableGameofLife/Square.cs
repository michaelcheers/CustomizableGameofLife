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

    public static class SquareExtensions
    {
        public static bool IsAlive (this SquareType squareType) => squareType != SquareType.Brick;
        public static bool IsUndead (this SquareType squareType) => squareType != SquareType.Cell;
        public static bool ContainsAlive<T> (this Dictionary<T, SquareType> dic, T key)
            => dic.TryGetValue(key, out SquareType squareType) && squareType.IsAlive();
    }

    public enum SquareType
    {
        Cell,  // Black
        ImmortalCell,  // Grey
        Brick, // Grey
        Count
    }

    [Flags]
    public enum DividersInfo
    {
        None = 0,
        Right = 1 << 0,
        Bottom = 1 << 1,
        BottomRight = 1 << 2
    }
}
