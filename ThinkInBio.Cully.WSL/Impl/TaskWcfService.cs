using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Cully;
using ThinkInBio.Cully.BLL;

namespace ThinkInBio.Cully.WSL.Impl
{
    public class TaskWcfService : ITaskWcfService
    {

        internal ITaskService TaskService { get; set; }

        public Task SaveTask(string user, string activityId, string staff, string content, string appointedDay)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(activityId)
                || string.IsNullOrWhiteSpace(staff)
                || string.IsNullOrWhiteSpace(content))
            {
                throw new ArgumentNullException();
            }

            Task task = new Task(Convert.ToInt64(activityId));
            task.Content = content;
            DateTime? d = string.IsNullOrWhiteSpace(appointedDay) ? new DateTime?() : Convert.ToDateTime(appointedDay);
            task.Save(user, staff, d,
                (e1, e2) =>
                {
                    TaskService.SaveTask(e1, e2);
                });

            return task;
        }

        public Task[] GetTaskList(string user, string activityId)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(activityId))
            {
                throw new ArgumentNullException();
            }
            IList<Task> list = TaskService.GetTaskList(Convert.ToInt64(activityId));
            if (list != null)
            {
                return list.ToArray();
            }
            else
            {
                return null;
            }
        }

    }
}
