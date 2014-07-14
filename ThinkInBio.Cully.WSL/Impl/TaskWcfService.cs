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
        internal IProjectService ProjectService { get; set; }

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

        public Task UpdateTask(string user, string activityId, string id, string staff, string content, string appointedDay)
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

            Task task = TaskService.GetTask(Convert.ToInt64(id));
            task.Content = content;
            DateTime? d = string.IsNullOrWhiteSpace(appointedDay) ? new DateTime?() : Convert.ToDateTime(appointedDay);
            task.Appoint(user, staff, d,
                (e1, e2) =>
                {
                    TaskService.UpdateTask(e1, e2);
                });

            return task;
        }

        public Task UpdateTask4IsUnderway(string user, string activityId, string id, string isUnderway)
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

            Task task = TaskService.GetTask(Convert.ToInt64(id));
            bool isUnderwayBool = Convert.ToBoolean(isUnderway);
            if (isUnderwayBool)
            {
                task.Activate((e) =>
                {
                    TaskService.UpdateTask(e);
                });
            }
            else
            {
                task.Inactivate((e) =>
                {
                    TaskService.UpdateTask(e);
                });
            }

            return task;
        }

        public Task UpdateTask4IsCompleted(string user, string activityId, string id, string isCompleted)
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

            Task task = TaskService.GetTask(Convert.ToInt64(id));
            Activity activity = ProjectService.GetActivity(task.ActivityId);
            IList<Task> taskList = TaskService.GetTaskList(task.ActivityId);
            bool isCompletedBool = Convert.ToBoolean(isCompleted);
            if (isCompletedBool)
            {
                task.Complete(activity, taskList, 
                    (e1, e2) =>
                    {
                        TaskService.UpdateTask(e1, e2);
                    });
            }
            else
            {
                task.Resume(activity,
                    (e1, e2) =>
                    {
                        TaskService.UpdateTask(e1, e2);
                    });
            }

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
