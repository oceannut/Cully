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

    }

}
