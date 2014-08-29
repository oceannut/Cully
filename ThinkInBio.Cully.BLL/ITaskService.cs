using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.CommonApp;

namespace ThinkInBio.Cully.BLL
{

    public interface ITaskService
    {

        void SaveTask(Task task, BizNotification notification);

        void UpdateTask(Task task);

        void UpdateTask(Task task, BizNotification notification);

        void UpdateTask(Task task, Activity activity);

        void DeleteTask(Task task, Activity activity, BizNotification notification);

        Task GetTask(long id);

        IList<Task> GetTaskList(long activityId);

        void SaveComment(Task task, Comment comment, ICollection<BizNotification> notificationList);

        void DeleteComment(Task task, Comment comment, ICollection<BizNotification> notificationList);

        void SaveTaskDelay(ICollection<TaskDelay> taskDelayList, JobLog log);

        IList<TaskDelay> GetTaskDelayList(DateTime timeStamp, TaskDelayScope? scope, long activityId);

    }

}
