using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Common.Data;
using ThinkInBio.Cully;

namespace ThinkInBio.Cully.DAL
{
    public interface ITaskDelayDao : IDao<TaskDelay>
    {

        IList<TaskDelay> GetList(int? startYear, int? startMonth, int? startDay,
            int? endYear, int? endMonth, int? endDay,
            TaskDelayScope? scope,
            long activityId, string staff);

    }
}
