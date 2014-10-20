using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Common.Data;
using ThinkInBio.Cully;

namespace ThinkInBio.Cully.DAL
{
    public interface ICalendarDao : IDao<Calendar>
    {

        IList<Calendar> GetList(string participant, long? projectId, CalendarType? type, bool? isCaution,
            DateTime? startTime, DateTime? endTime, bool asc,
            int startRowIndex, int maxRowsCount);

    }
}
