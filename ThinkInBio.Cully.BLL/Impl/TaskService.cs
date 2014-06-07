using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Cully;
using ThinkInBio.Cully.DAL;

namespace ThinkInBio.Cully.BLL.Impl
{

    public class TaskService : ITaskService
    {

        internal ITaskDao TaskDao { get; set; }

        public void SaveTask(Task task)
        {
            if (task == null)
            {
                throw new ArgumentNullException();
            }

            TaskDao.Save(task);
        }

    }

}
