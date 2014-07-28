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

        int GetCount(DateTime? startTime, DateTime? endTime, string creator, string category);

        IList<Log> GetList(DateTime? startTime, DateTime? endTime, string creator, string category,
            int startRowIndex, int maxRowsCount);

    }

}
