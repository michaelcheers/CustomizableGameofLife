using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CustomizableGameofLife
{
    public abstract class Grid
    {
        public abstract void Clear();
        public abstract void DrawSquares(Action<(int x, int y), SquareType> DrawSquare);
        public abstract void HandleClick((int x, int y) drawPosition, SquareType SquareTypePlacing);
        public abstract void Update();

        public abstract int SquareCount { get; }
    }

    public abstract class Grid<CoordType> : Grid
    {
        public virtual void AssignDividers ((int x, int y) drawPosition, ref bool placeNormally) { }
        public abstract (int x, int y) GetDrawPosition (CoordType coords);
        public abstract CoordType FromDrawPosition ((int x, int y) drawPosition);
        public abstract int NumberOfAdjacentCells (CoordType coords, Action<CoordType> emptyAdjAction = null);
        public Dictionary<CoordType, SquareType> Squares = new Dictionary<CoordType, SquareType>();
        public Dictionary<CoordType, DividersInfo> Dividers = new Dictionary<CoordType, DividersInfo>();

        public override int SquareCount => Squares.Count;

        public override void Clear()
        {
            Squares.Clear();
            Dividers.Clear();
        }

        public void DrawSquares (Action<(int x, int y), CoordType, SquareType> DrawSquare)
        {
            foreach ((CoordType coords, SquareType squareType) in Squares)
            {
                DrawSquare(GetDrawPosition(coords), coords, squareType);
            }
        }

        public override void DrawSquares (Action<(int x, int y), SquareType> DrawSquare)
        {
            this.DrawSquares((drawPosition, coords, squareType) => DrawSquare(drawPosition, squareType));
        }

        public override void Update()
        {
            List<CoordType> removing = new List<CoordType>();
            HashSet<CoordType> adding = new HashSet<CoordType>();

            foreach ((var coords, SquareType squareType) in Squares)
            {
                if (!squareType.IsAlive())
                    continue;
                int adjacentCells = NumberOfAdjacentCells(coords, coords_ =>
                {
                    if (App.deadRules[NumberOfAdjacentCells(coords_)])
                        adding.Add(coords_);
                });
                if (adjacentCells > App.maxAdjacentCells)
                    adjacentCells = App.maxAdjacentCells;

                if (!squareType.IsUndead() && !App.livingRules[adjacentCells])
                    removing.Add(coords);
            }

            foreach (CoordType coords in removing)
            {
                if (!Squares.Remove(coords)) throw new Exception("Square tried to be removed but didn't exist");
            }

            foreach (CoordType coords in adding)
            {
                Squares.Add(coords, SquareType.Cell);
            }
        }

        public override void HandleClick ((int x, int y) drawPosition, SquareType SquareTypePlacing)
        {
            CoordType clickCoords = FromDrawPosition(drawPosition);
            bool placeNormally = true;
            if (SquareTypePlacing == SquareType.Count)
                AssignDividers(drawPosition, ref placeNormally);
            if (placeNormally && !Squares.Remove(clickCoords))
                Squares.Add(clickCoords, SquareTypePlacing == SquareType.Count ? SquareType.Cell : SquareTypePlacing);
        }
    }

    public class SquareGrid : Grid<(int c0, int c1)>
    {
        public override (int x, int y) GetDrawPosition((int c0, int c1) coords) =>
            (coords.c0 * App.xMultiplier, coords.c1 * App.xMultiplier);

        public override (int c0, int c1) FromDrawPosition((int x, int y) drawPosition) =>
            (App.NegDiv(drawPosition.x/* - offsetPos.x*/, App.xMultiplier),
             App.NegDiv(drawPosition.y/* - offsetPos.y*/, App.xMultiplier));

        public override void AssignDividers((int x, int y) drawPosition, ref bool placeNormally)
        {
            (double clickX_, double clickY_) = (App.NegDivDouble((double)drawPosition.x, App.xMultiplier), App.NegDivDouble((double)drawPosition.y, App.yMultiplier));
            placeNormally = false;
            int xDiv = 0, yDiv = 0;
            if (clickX_ % 1 <= 0.2)
                xDiv = -1;
            else if (clickX_ % 1 >= 0.8)
                xDiv = 1;
            if (clickY_ % 1 <= 0.2)
                yDiv = -1;
            else if (clickY_ % 1 >= 0.8)
                yDiv = 1;
            DividersInfo dividersInfo = DividersInfo.None;
            Action<DividersInfo> Assign = (DividersInfo divInfo) =>
            {
                int x = (int)clickX_ + xDiv, y = (int)clickY_ + yDiv;
                if (divInfo != DividersInfo.None)
                {
                    if (!Dividers.TryGetValue(((int)x, (int)y), out DividersInfo dividers))
                        dividers = DividersInfo.None;
                    Dividers[(x, y)] = dividers ^ divInfo;
                }
            };
            switch (xDiv)
            {
                case -1:
                    switch (yDiv)
                    {
                        case -1:
                            Assign(DividersInfo.BottomRight);
                            break;
                        case 0:
                            Assign(DividersInfo.Right);
                            break;
                        case 1:
                            yDiv = 0;
                            Assign(DividersInfo.BottomRight);
                            break;
                        default:
                            throw new InvalidOperationException();
                    }
                    break;
                case 0:
                    switch (yDiv)
                    {
                        case -1:
                            Assign(DividersInfo.Bottom);
                            break;
                        case 0:
                            placeNormally = true;
                            break;
                        case 1:
                            dividersInfo = DividersInfo.Bottom;
                            break;
                        default:
                            throw new InvalidOperationException();
                    }
                    break;
                case 1:
                    switch (yDiv)
                    {
                        case -1:
                            xDiv = 0;
                            Assign(DividersInfo.BottomRight);
                            break;
                        case 0:
                            dividersInfo = DividersInfo.Right;
                            break;
                        case 1:
                            dividersInfo = DividersInfo.BottomRight;
                            break;
                        default:
                            throw new InvalidOperationException();
                    }
                    break;
                default:
                    throw new InvalidOperationException();
            }
            if (dividersInfo != DividersInfo.None)
            {
                xDiv = 0;
                yDiv = 0;
                Assign(dividersInfo);
            }
        }

        public override int NumberOfAdjacentCells((int c0, int c1) coords, Action<(int c0, int c1)> emptyAdjAction = null)
        {
            int adjacentCells = 0;
            int n = 0;
            for (int L = 0; L <= 8; L++)
            {
                if (L == 4)
                    continue;
                var adjacencyRule = App.adjacencyRules[n++];

                int c0_ = coords.c0 - 1 + (L % 3),
                    c1_ = coords.c1 - 1 + L / 3;

                if (Dividers.HasDividers(coords.c0, coords.c1, L))
                    continue;

                if (Squares.TryGetValue((c0_, c1_), out SquareType squareInfo))
                {
                    if (squareInfo.IsAlive())
                        adjacentCells += (int)adjacencyRule;
                }
                else
                    emptyAdjAction?.Invoke((c0_, c1_));
            }
            return adjacentCells > App.maxAdjacentCells ? App.maxAdjacentCells : adjacentCells;
        }
    }

    public class HexGrid : Grid<(int c0, int c1)>
    {
        public static readonly float
            cos60 = (float)Math.Sin(Math.PI / 3),
            sin60 = (float)Math.Cos(Math.PI / 3);
        
        /// <summary>
        /// 
        /// </summary>
        /// <param name="coords">60l is position from (0, 0) going 60 degrees left of up. 60r is position from (0, 0) going 60 degrees right of up/param>
        /// <returns></returns>
        public override (int x, int y) GetDrawPosition ((int c0, int c1) coords)
        {
            (int _60l, int _60r) = coords;
            return ((int)((-_60l + _60r) * App.xMultiplier * cos60), (int)(-(_60l + _60r) * App.xMultiplier * sin60));
        }

        public override (int c0, int c1) FromDrawPosition((int x, int y) drawPosition)
        {
            // GetDrawPosition but in reverse

            (int x, int y) = drawPosition;

            /*
             * x = (-_60l + _60r) * App.xMultiplier * sin60
               y = -(_60l + _60r) * App.xMultiplier * cos60
               k = App.xMultiplier
               a = _60l
               b = _60r
               
               Solve x = (-a + b) * k * sin60;y = -(a+ b) * k * cos60 for (a, b) (https://www.wolframalpha.com/input?i=solve+x+%3D+%28-a+%2B+b%29+*+k+*+sin60%3By+%3D+-%28a%2B+b%29+*+k+*+cos60+for+a+and+b)
            
               a = -(sqrt(3) x + 3 y)/(3 k)
               b = (sqrt(3) x - 3 y)/(3 k)
            */

            return ((int)(-(Math.Sqrt(3) * x + 3 * y) / (3 * App.xMultiplier)), (int)((Math.Sqrt(3) * x - 3 * y) / (3 * App.xMultiplier)));
        }

        public override int NumberOfAdjacentCells((int c0, int c1) coords, Action<(int c0, int c1)> emptyAdjAction = null)
        {
            (int _60l, int _60r) = coords;
            int adjacentCells = 0;
            for (int L = 0; L <= 5; L++)
            {
                var adjacencyRule = App.adjacencyRules[L];

                // 60l is position from (0, 0) going 60 degrees left of up. 60r is position from (0, 0) going 60 degrees right of up
                // L = 0 is left-up, going clockwise up to L=5 is left

                int _60l_, _60r_;
                switch (L)
                {
                    // left-up
                    case 0:
                        _60l_ = _60l + 1;
                        _60r_ = _60r;
                        break;
                    // up
                    case 1:
                        _60l_ = _60l + 1;
                        _60r_ = _60r + 1;
                        break;
                    // right-up
                    case 2:
                        _60l_ = _60l;
                        _60r_ = _60r + 1;
                        break;
                    // right-down
                    case 3:
                        _60l_ = _60l - 1;
                        _60r_ = _60r;
                        break;
                    // down
                    case 4:
                        _60l_ = _60l - 1;
                        _60r_ = _60r - 1;
                        break;
                    // left-down
                    case 5:
                        _60l_ = _60l;
                        _60r_ = _60r - 1;
                        break;
                    default:
                        throw new InvalidOperationException($"Invalid L: {L}");
                }

                //if (Dividers.HasDividers(coords.c0, coords.c1, L))
                //    continue;

                if (Squares.TryGetValue((_60l_, _60r_), out SquareType squareInfo))
                {
                    if (squareInfo.IsAlive())
                        adjacentCells += (int)adjacencyRule;
                }
                else
                    emptyAdjAction?.Invoke((_60l_, _60r_));
            }
            return adjacentCells > App.maxAdjacentCells ? App.maxAdjacentCells : adjacentCells;
        }
    }

    public class TriangleGrid : Grid<(int c0, int c1, TriangleLocation n)>
    {
        private static readonly float
            cos60 = (float)Math.Sin(Math.PI / 3),
            sin60 = (float)Math.Cos(Math.PI / 3);

        // c0 is x, c1 is y
        public override (int x, int y) GetDrawPosition((int c0, int c1, TriangleLocation n) coords)
        {
            (int _60l, int _60r, TriangleLocation n) = coords;
            return ((int)((-_60l + _60r) * App.xMultiplier * cos60), (int)(-(_60l + _60r) * App.xMultiplier * sin60));
        }

        public override (int c0, int c1, TriangleLocation n) FromDrawPosition((int x, int y) drawPosition)
        {
            // GetDrawPosition but in reverse

            (int x, int y) = drawPosition;

            /*
             * x = (-_60l + _60r) * App.xMultiplier * sin60
               y = -(_60l + _60r) * App.xMultiplier * cos60
               k = App.xMultiplier
               a = _60l
               b = _60r
               
               Solve x = (-a + b) * k * sin60;y = -(a+ b) * k * cos60 for (a, b) (https://www.wolframalpha.com/input?i=solve+x+%3D+%28-a+%2B+b%29+*+k+*+sin60%3By+%3D+-%28a%2B+b%29+*+k+*+cos60+for+a+and+b)
            
               a = -(3 x + sqrt(3) y)/(3 k)
               b = (3 x - sqrt(3) y)/(3 k)
            */

            // Calculate TriangleLocation from position

            double board_60l = -(Math.Sqrt(3) * x + 3 * y) / (3 * App.xMultiplier),
                   board_60r =  (Math.Sqrt(3) * x - 3 * y) / (3 * App.xMultiplier);

            double NegMod1(double a) => (a % 1 + 1) % 1;

            double _60lMod1 = NegMod1(board_60l),
                   _60rMod1 = NegMod1(board_60r);

            TriangleLocation n = _60rMod1 <= (1.0 / 2)
                ? _60lMod1 <= (1.0 / 3) ? TriangleLocation.Bottom :
                    _60lMod1 <= (2.0 / 3) ? TriangleLocation.BottomLeft :
                                                 TriangleLocation.TopLeft
                : _60lMod1 <= (1.0 / 3) ? TriangleLocation.BottomRight :
                    _60lMod1 <= (2.0 / 3) ? TriangleLocation.TopRight :
                                                 TriangleLocation.Top;            
            return ((int)Math.Round(board_60l), (int)Math.Round(board_60r), n);
        }

        public override int NumberOfAdjacentCells((int c0, int c1, TriangleLocation n) coords, Action<(int c0, int c1, TriangleLocation n)> emptyAdjAction = null)
        {
            (int _60l, int _60r, TriangleLocation n) = coords;
            int adjacentCells = 0;
            
            for (TriangleLocation loc = 0; loc < TriangleLocation.Count; loc++)
            {
                if (loc == n)
                    continue;
                var adjacencyRule = App.adjacencyRules[(int)loc];
                if (Squares.ContainsAlive((_60l, _60r, loc)))
                    adjacentCells += (int)adjacencyRule;
            }

            // Check triangles from adjacent hexagons for adjacency

            // If left-up, get right-up, right-down and down from left-up,
            //             get right-up and up from left-down,
            //             get left-down and down from up

            // If up, get left-down, down and right-down from up,
            //        get right-up and right-down from left-up
            //        get left-up and left-down from right-up

            // If right-up, get left-up, left-down and down from right-up,
            //              get left-up and up from right-down,
            //              get right-down and down from up

            // If left-down, get right-up, right-down and up from left-down,
            //               get right-down and down from left-up,
            //               get left-up and up from down

            // If down, get left-up, up and right-up from down,
            //          get right-down and right-up from left-down
            //          get left-down and left-up from right-down

            // If right-down, get left-up, left-down and up from right-down,
            //                get left-down and down from right-up,
            //                get right-up and up from down

            int x_ =
                n == TriangleLocation.TopLeft || n == TriangleLocation.BottomLeft ? -1 :
                n == TriangleLocation.TopRight || n == TriangleLocation.BottomRight ? 1 :
                0,
                y_ =
                n == TriangleLocation.TopLeft || n == TriangleLocation.TopRight || n == TriangleLocation.Top ? -1 : 1;

            (int x, int y) GetHexagonLocPos(int invertX, bool invertY)
                 => (x: invertX == -1 ? 0 : invertX == 1 ? -x_ : x_, y: invertY ? -y_ : y_);
            TriangleLocation GetHexagonLoc(int x, int y) =>
                y == 0 ? throw new InvalidOperationException("y cannot be 0") :
                    x == 0 ? y == -1 ? TriangleLocation.Bottom : TriangleLocation.Top :
                    x == -1 ? y == -1 ? TriangleLocation.TopLeft : TriangleLocation.BottomLeft :
                    x == 1 ? y == -1 ? TriangleLocation.TopRight : TriangleLocation.BottomRight :
                    throw new InvalidOperationException("x must be -1, 0 or 1");
            (int _60l, int _60r) GetFinalHexagonLocPos(int invertX, bool invertY)
            {
                (int x, int y) = GetHexagonLocPos(invertX, invertY);
                return (_60l: _60l + x, _60r: _60r + y);
            }
            (int _60l, int _60r, TriangleLocation n) CreatePos((int, int) pos, TriangleLocation N) => (pos.Item1, pos.Item2, N);
            void AddSquare(int invertX1, bool invertY1, int invertX2, bool invertY2, int x1Override = 0, int x2Override = 0)
            {
                (int _60l_, int _60r_) = GetFinalHexagonLocPos(invertX1, invertY1);
                if (x1Override != 0)
                    _60l_ = x1Override;
                (int x, int y) pos2 = GetHexagonLocPos(invertX2, invertY2);
                if (x2Override != 0)
                    pos2.x = x2Override;
                TriangleLocation n_ = GetHexagonLoc(pos2.x, pos2.y);
                var coords_ = CreatePos((_60l_, _60r_), n_);

                if (Squares.TryGetValue(coords_, out SquareType squareInfo))
                {
                    if (squareInfo.IsAlive())
                        adjacentCells += 1;
                }
                else
                    emptyAdjAction?.Invoke(coords_);
            }

            switch (n)
            {
                case TriangleLocation.TopLeft:
                case TriangleLocation.TopRight:
                case TriangleLocation.BottomLeft:
                case TriangleLocation.BottomRight:
                    // If invertY is -1, then the y coordinate is removed.
                    // If invertY is 0, then the y coordinate is not inverted.
                    // If invertY is 1, then the y coordinate is inverted.
                    // If invertX is 0, then the x coordinate is not inverted.
                    // If invertX is 1, then the x coordinate is inverted.
                    AddSquare(1, true, 0, false);
                    AddSquare(1, false, 0, false);
                    AddSquare(-1, true, 0, false);
                    AddSquare(1, false, 0, true);
                    AddSquare(-1, false, 0, true);
                    AddSquare(0, true, -1, false);
                    AddSquare(-1, true, -1, false);
                    break;
                case TriangleLocation.Top:
                case TriangleLocation.Bottom:
                    AddSquare(0, true, 0, false, 1);
                    AddSquare(0, true, 0, false);
                    AddSquare(0, true, 0, false, -1);
                    AddSquare(0, false, 0, false, 1, -1);
                    AddSquare(0, true, 0, false, 1, -1);
                    AddSquare(0, false, 0, false, -1, 1);
                    AddSquare(0, true, 0, false, -1, 1);
                    break;
                default:
                    throw new InvalidOperationException("n must be 0, 1, 2, 3, 4 or 5");
            }

            return adjacentCells > App.maxAdjacentCells ? App.maxAdjacentCells : adjacentCells;
        }
    }
}
