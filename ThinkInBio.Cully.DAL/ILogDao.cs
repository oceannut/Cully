using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Common.Data;
using ThinkInBio.Cully;

namespace ThinkInBio.Cully.DAL
{

    public interface ILogDao : IDao<Log>
    {

        bool Update4CommentCount(long id, int count);

        int GetCount(string user, DateTime? startTime, DateTime? endTime);

        IList<Log> GetList(string user, DateTime? startTime, DateTime? endTime,
            int startRowIndex, int maxRowsCount);

    }

}
