using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{
    public class TaskDelayBuilder
    {

        private Dictionary<long, Dictionary<string, TaskDelay>> undoneDelayMap = new Dictionary<long, Dictionary<string, TaskDelay>>();
        private Dictionary<long, Dictionary<string, TaskDelay>> doneDelayMap = new Dictionary<long, Dictionary<string, TaskDelay>>();

        public IEnumerable<TaskDelay> UndoneDelays
        {
            get
            {
                List<TaskDelay> list = new List<TaskDelay>();
                foreach (var map in undoneDelayMap.Values)
                {
                    foreach (TaskDelay item in map.Values)
                    {
                        list.Add(item);
                    }
                }
                return list;
            }
        }

        public IEnumerable<TaskDelay> DoneDelays
        {
            get
            {
                List<TaskDelay> list = new List<TaskDelay>();
                foreach (var map in doneDelayMap.Values)
                {
                    foreach (TaskDelay item in map.Values)
                    {
                        list.Add(item);
                    }
                }
                return list;
            }
        }

        public TaskDelay GetTaskDelay(bool done, long activityId, string staff)
        {
            if (activityId == 0 || string.IsNullOrWhiteSpace(staff))
            {
                throw new ArgumentException();
            }
            Dictionary<string, TaskDelay> map;
            if (done)
            {
                doneDelayMap.TryGetValue(activityId, out map);
            }
            else
            {
                undoneDelayMap.TryGetValue(activityId, out map);
            }
            TaskDelay taskDelay = null;
            if (map != null)
            {
                map.TryGetValue(staff, out taskDelay);
            }
            return taskDelay;
        }

        public void Build(DateTime timeStamp, Task task)
        {
            if (task != null)
            {
                if (task.IsCompleted)
                {
                    Done(timeStamp, task);
                }
                else
                {
                    Undone(timeStamp, task);
                }
            }
        }

        public void Build(DateTime timeStamp, ICollection<Task> tasks)
        {
            if (tasks != null)
            {
                foreach (Task task in tasks)
                {
                    Build(timeStamp, task);
                }
            }
        }

        public void Clear()
        {
            foreach (var map in undoneDelayMap)
            {
                map.Value.Clear();
            }
            undoneDelayMap.Clear();
            foreach (var map in doneDelayMap)
            {
                map.Value.Clear();
            }
            doneDelayMap.Clear();
        }

        private void Undone(DateTime timeStamp, Task task)
        {
            TaskDelay taskDelay;
            Dictionary<string, TaskDelay> map;
            undoneDelayMap.TryGetValue(task.ActivityId, out map);
            if (map == null)
            {
                map = new Dictionary<string, TaskDelay>();
                undoneDelayMap.Add(task.ActivityId, map);
                taskDelay = new TaskDelay();
                taskDelay.Scope = TaskDelayScope.Undone;
                map.Add(task.Staff, taskDelay);
            }
            else
            {
                map.TryGetValue(task.Staff, out taskDelay);
                if (taskDelay == null)
                {
                    taskDelay = new TaskDelay();
                    taskDelay.Scope = TaskDelayScope.Undone;
                    map.Add(task.Staff, taskDelay);
                }
            }
            if (task.AppointedDay.HasValue)
            {
                if (timeStamp.CompareTo(task.AppointedDay.Value) >= 0)
                {
                    taskDelay.Delay++;
                }
            }
            else
            {
                taskDelay.Untimed++;
            }
            taskDelay.Total++;
        }

        private void Done(DateTime timeStamp, Task task)
        {
            TaskDelay taskDelay;
            Dictionary<string, TaskDelay> map;
            doneDelayMap.TryGetValue(task.ActivityId, out map);
            if (map == null)
            {
                map = new Dictionary<string, TaskDelay>();
                doneDelayMap.Add(task.ActivityId, map);
                taskDelay = new TaskDelay();
                taskDelay.Scope = TaskDelayScope.Undone;
                map.Add(task.Staff, taskDelay);
            }
            else
            {
                map.TryGetValue(task.Staff, out taskDelay);
                if (taskDelay == null)
                {
                    taskDelay = new TaskDelay();
                    taskDelay.Scope = TaskDelayScope.Undone;
                    map.Add(task.Staff, taskDelay);
                }
            }
            if (task.AppointedDay.HasValue)
            {
                if (task.Completion.Value.CompareTo(task.AppointedDay.Value) >= 0)
                {
                    taskDelay.Delay++;
                }
            }
            else
            {
                taskDelay.Untimed++;
            }
            taskDelay.Total++;
        }

    }
}
