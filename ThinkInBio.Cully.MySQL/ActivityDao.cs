﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Common.Data;
using ThinkInBio.Cully;
using ThinkInBio.Cully.DAL;

namespace ThinkInBio.Cully.MySQL
{
    public class ActivityDao : GenericDao<Activity>, IActivityDao
    {

        public override bool Save(Activity entity)
        {
            return base.Save(entity);
        }

    }
}