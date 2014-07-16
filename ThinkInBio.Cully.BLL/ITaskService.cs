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

        void UpdateTask(Activity activity, Task task);

        void UpdateTask(Task task, Comment comment, ICollection<BizNotification> notificationList);

        Task GetTask(long id);

        IList<Task> GetTaskList(long activityId);

    }

}
