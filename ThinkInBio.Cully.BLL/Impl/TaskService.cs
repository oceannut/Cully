using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.CommonApp;
using ThinkInBio.CommonApp.BLL;
using ThinkInBio.Cully;
using ThinkInBio.Cully.DAL;

namespace ThinkInBio.Cully.BLL.Impl
{

    public class TaskService : ITaskService
    {

        internal ITaskDao TaskDao { get; set; }
        internal IBizNotificationService BizNotificationService { get; set; }
        internal IActivityDao ActivityDao { get; set; }
        internal ICommentDao CommentDao { get; set; }

        public void SaveTask(Task task, BizNotification notification)
        {
            if (task == null)
            {
                throw new ArgumentNullException();
            }

            TaskDao.Save(task);
            if (notification != null)
            {
                BizNotificationService.SaveNotification(notification);
            }
        }

        public void UpdateTask(Task task)
        {
            if (task == null)
            {
                throw new ArgumentNullException();
            }

            TaskDao.Update(task);
        }

        public void UpdateTask(Task task, BizNotification notification)
        {
            if (task == null)
            {
                throw new ArgumentNullException();
            }

            TaskDao.Update(task);
            if (notification != null)
            {
                BizNotificationService.SaveNotification(notification);
            }
        }

        public void UpdateTask(Task task, Activity activity)
        {
            if (task == null)
            {
                throw new ArgumentNullException();
            }

            TaskDao.Update(task);
            if (activity != null)
            {
                ActivityDao.Update(activity);
            }
        }

        public void DeleteTask(Task task, Activity activity, BizNotification notification)
        {
            if (task == null)
            {
                throw new ArgumentNullException();
            }

            IList<Comment> commentList = CommentDao.GetList(CommentTarget.Task, task.Id);
            if (commentList != null && commentList.Count > 0)
            {
                foreach (Comment comment in commentList)
                {
                    CommentDao.Delete(comment);
                }
            }
            TaskDao.Delete(task);
            if (activity != null)
            {
                ActivityDao.Update(activity);
            }
            if (notification != null)
            {
                BizNotificationService.SaveNotification(notification);
            }
        }

        public Task GetTask(long id)
        {
            if (id == 0)
            {
                throw new ArgumentException();
            }

            return TaskDao.Get(id);
        }

        public IList<Task> GetTaskList(long activityId)
        {
            if (activityId == 0)
            {
                throw new ArgumentException();
            }

            return TaskDao.GetTaskList(null, null, activityId, null, false, 0, int.MaxValue);
        }

        public void SaveComment(Task task, Comment comment, ICollection<BizNotification> notificationList)
        {
            if (task == null || comment == null)
            {
                throw new ArgumentNullException();
            }

            TaskDao.Update4CommentCount(task.Id, task.CommentCount);
            CommentDao.Save(comment);
            if (notificationList != null && notificationList.Count > 0)
            {
                BizNotificationService.SaveNotification(notificationList);
            }
        }

        public void DeleteComment(Task task, Comment comment, ICollection<BizNotification> notificationList)
        {
            if (task == null || comment == null)
            {
                throw new ArgumentNullException();
            }

            TaskDao.Update4CommentCount(task.Id, task.CommentCount);
            CommentDao.Delete(comment);
            if (notificationList != null && notificationList.Count > 0)
            {
                BizNotificationService.SaveNotification(notificationList);
            }
        }

    }

}
