using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Common.Data;
using ThinkInBio.Cully;

namespace ThinkInBio.Cully.DAL
{
    public interface IActivityDao : IDao<Activity>
    {

        //bool Update4IsCompleted(long id, bool isCompleted, DateTime timeStamp);

        //bool Update4ProjectId(long id, long projectId, DateTime timeStamp);

        IList<Activity> GetList(long projectId);

        bool IsAnyExisted(long projectId);

        int GetCountByParticipant(string participant, string category,
            DateTime? startTime, DateTime? endTime);

        IList<Activity> GetListByParticipant(string participant, string category,
            DateTime? startTime, DateTime? endTime, bool asc,
            int startRowIndex, int maxRowsCount);

    }
}
