using System.Collections.Generic;

namespace CustomizableGameofLife
{
    public static class NotableObjectsList
    {

        public static readonly List<(HashSet<(int x, int y)> objectDetails, string description, string rules)> NotableObjects =
            new List<(HashSet<(int x, int y)> objectDetails, string description, string rules)>
            {
                (new HashSet<(int x, int y)>
                {
                    (0, 0),
                    (1, 0),
                    (1, 1),
                    (0, 2),
                    (2, 2)
                }, "Two Generation Ninety Degree Rotator", "001010--- / 000101---"),
                (new HashSet<(int x, int y)>
                {
                    (0, 0),
                    (1, 0),
                    (1, 1),
                    (0, 1),
                    (0, 2)
                }, "One Generation Ninety Degree Rotator", "001010--- / 000101---"),
                (new HashSet<(int x, int y)>
{
    (0, 1),
    (1, 0),
    (0, 0),
    (2, 0),
    (2, 1)
}, "Two Direction Grower", "000100000 / 111111111")
            };
    }
}