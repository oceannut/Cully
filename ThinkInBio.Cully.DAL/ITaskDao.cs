﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Common.Data;
using ThinkInBio.Cully;

namespace ThinkInBio.Cully.DAL
{

    public interface ITaskDao : IDao<Task>
    {

        bool Update4CommentCount(long id, int count);

        IList<Task> GetList(DateTime? startTime, DateTime? endTime, 
            long activityId, string staff,
            bool? isUnderway, bool? isCompleted,
            bool asc,
            int startRowIndex, int maxRowsCount);

    }

}
