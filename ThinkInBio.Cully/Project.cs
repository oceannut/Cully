using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 
    /// </summary>
    public class Project
    {

        #region properties

        public long Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime Creation { get; set; }

        public DateTime Modification { get; set; }

        #endregion

        #region methods

        public Activity CreateActivity()
        {
            if (this.Id == 0)
            {
                throw new InvalidOperationException();
            }
            Activity activity = new Activity(this.Id);
            return activity;
        }

        #endregion

    }

}
