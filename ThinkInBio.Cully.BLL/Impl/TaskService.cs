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

    }

}
