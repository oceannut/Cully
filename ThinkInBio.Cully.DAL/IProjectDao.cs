using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Common.Data;
using ThinkInBio.Cully;

namespace ThinkInBio.Cully.DAL
{

    public interface IProjectDao : IDao<Project>
    {

        int GetCount(string creator,
            DateTime? startTime, DateTime? endTime);

        IList<Project> GetList(string creator,
            DateTime? startTime, DateTime? endTime, 
            int startRowIndex, int maxRowsCount);

        int GetCountByParticipant(string participant,
            DateTime? startTime, DateTime? endTime,
            bool? isSolo);

        IList<Project> GetListByParticipant(string participant,
            DateTime? startTime, DateTime? endTime, 
            bool? isSolo, bool asc, 
            int startRowIndex, int maxRowsCount);

    }

}
