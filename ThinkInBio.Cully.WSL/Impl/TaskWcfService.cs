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
            throw new NotImplementedException();
        }

    }
}
