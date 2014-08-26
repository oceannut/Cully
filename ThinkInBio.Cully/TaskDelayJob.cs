using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Scheduling;

namespace ThinkInBio.Cully
{

    public class TaskDelayJob : GenericJob
    {

        internal int UndoneTasksDaySpan { get; set; }
        internal int DoneTasksDaySpan { get; set; }

        protected override void Execute()
        {
            TaskDelayBuilder builder = new TaskDelayBuilder();
            DateTime now = DateTime.Now;
            DateTime endTime = now.Date;
            IList<Task> undoneTasks = (Delegates.UndoneTasksAccessor == null) ? null 
                : Delegates.UndoneTasksAccessor(endTime.AddDays(-UndoneTasksDaySpan), endTime);
            if (undoneTasks != null)
            {
                builder.Build(now, undoneTasks);
                IEnumerable<TaskDelay> undones = builder.UndoneDelays;
                if (Delegates.TaskDelaySaveAction != null)
                {
                    Delegates.TaskDelaySaveAction(undones);
                }
            }
            IList<Task> doneTasks = (Delegates.DoneTasksAccessor == null) ? null
                : Delegates.DoneTasksAccessor(endTime.AddDays(-DoneTasksDaySpan), endTime);
            if (doneTasks != null)
            {
                builder.Build(now, doneTasks);
                IEnumerable<TaskDelay> dones = builder.DoneDelays;
                if (Delegates.TaskDelaySaveAction != null)
                {
                    Delegates.TaskDelaySaveAction(dones);
                }
            }
        }
    }

}
