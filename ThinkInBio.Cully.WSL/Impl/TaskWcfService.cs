﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Common.Exceptions;
using ThinkInBio.Cully;
using ThinkInBio.Cully.BLL;

namespace ThinkInBio.Cully.WSL.Impl
{
    public class TaskWcfService : ITaskWcfService
    {

        internal ITaskService TaskService { get; set; }
        internal IProjectService ProjectService { get; set; }
        internal ICommentService CommentService { get; set; }

        public Task SaveTask(string user, string activityId, string content, string staff, string appointedDay)
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

        public Task UpdateTask(string user, string id, string content, string staff, string appointedDay)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(id)
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

        public Task UpdateTask4IsUnderway(string user, string id, string isUnderway)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(id))
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

        public Task UpdateTask4IsCompleted(string user, string id, string isCompleted)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(id))
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
                        TaskService.UpdateTask(e2, e1);
                    });
            }
            else
            {
                task.Resume(activity,
                    (e1, e2) =>
                    {
                        TaskService.UpdateTask(e2, e1);
                    });
            }

            return task;
        }

        public void DeleteTask(string user, string id)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException();
            }

            Task task = TaskService.GetTask(Convert.ToInt64(id));
            Activity activity = ProjectService.GetActivity(task.ActivityId);
            IList<Task> taskList = TaskService.GetTaskList(task.ActivityId);
            task.Delete(activity, taskList,
                (e1, e2, e3) =>
                {
                    TaskService.DeleteTask(e1, e2, e3);
                });
        }

        public Task GetTask(string user, string id)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            return TaskService.GetTask(Convert.ToInt64(id));
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

        public Comment SaveComment(string user, string id, string content, string[] observers)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(id) || string.IsNullOrWhiteSpace(content))
            {
                throw new ArgumentNullException();
            }

            Task task = TaskService.GetTask(Convert.ToInt64(id));
            if (task == null)
            {
                throw new ObjectNotFoundException(id);
            }
            return task.AddRemark(observers, user, content,
                (e1, e2, e3) =>
                {
                    TaskService.SaveComment(e1, e2, e3);
                });
        }

        public void DeleteComment(string user, string id, string commentId, string[] observers)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(id) || string.IsNullOrWhiteSpace(commentId))
            {
                throw new ArgumentNullException();
            }
            Task task = TaskService.GetTask(Convert.ToInt64(id));
            if (task == null)
            {
                throw new ObjectNotFoundException(id);
            }
            Comment comment = CommentService.GetComment(Convert.ToInt64(commentId));
            if (comment == null)
            {
                throw new ObjectNotFoundException(id);
            }
            task.RemoveRemark(observers, comment,
                (e1, e2, e3) =>
                {
                    TaskService.DeleteComment(e1, e2, e3);
                });
        }

    }
}
