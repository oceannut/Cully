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

        Task GetTask(long id);

        IList<Task> GetTaskList(long activityId);

    }

}
