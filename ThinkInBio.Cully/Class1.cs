using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{
    class Class1
    {


        void AA(DateTime start, DateTime end, Func<DateTime, DateTime, IEnumerable<Task>> taskFactory)
        {
            Dictionary<long, Dictionary<string, TaskDelay>> delayMap = new Dictionary<long, Dictionary<string, TaskDelay>>();
            IEnumerable<Task> tasks = taskFactory == null ? null : taskFactory(start, end);
            if (tasks != null)
            {
                foreach (Task task in tasks)
                {
                    if (!task.AppointedDay.HasValue)
                    {
                        continue;
                    }
                    TaskDelay taskDelay;
                    Dictionary<string, TaskDelay> map;
                    delayMap.TryGetValue(task.ActivityId, out map);
                    if (map == null)
                    {
                        map = new Dictionary<string, TaskDelay>();
                        delayMap.Add(task.ActivityId, map);
                        taskDelay = new TaskDelay();
                        map.Add(task.Staff, taskDelay);
                    }
                    else
                    {
                        map.TryGetValue(task.Staff, out taskDelay);
                        if (taskDelay == null)
                        {
                            taskDelay = new TaskDelay();
                            map.Add(task.Staff, taskDelay);
                        }
                    }
                    BB(task, taskDelay);
                }
            }
        }

        void BB(Task task, TaskDelay taskDelay)
        {
            DateTime timeStamp = DateTime.Now;
            if ((!task.IsCompleted && timeStamp.CompareTo(task.AppointedDay) < 0)
                ||(task.IsCompleted && task.Completion.Value.CompareTo(task.AppointedDay) > 0))
            {
                taskDelay.Delay++;
            }
            taskDelay.Total++;
        }

    }
}
