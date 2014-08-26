using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    public static class Delegates
    {

        public static Func<DateTime, DateTime, IList<Task>> UndoneTasksAccessor { get; set; }

        public static Func<DateTime, DateTime, IList<Task>> DoneTasksAccessor { get; set; }

        public static Action<IEnumerable<TaskDelay>> TaskDelaySaveAction { get; set; }

    }

}
