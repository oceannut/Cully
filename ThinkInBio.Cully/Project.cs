using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 项目。
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

        /// <summary>
        /// 保存项目。
        /// </summary>
        /// <param name="action">保存操作定义。</param>
        public void Save(Action<Project> action)
        {
            DateTime timeStamp = DateTime.Now;
            this.Creation = timeStamp;
            this.Modification = timeStamp;
            if (action != null)
            {
                action(this);
            }
        }

        /// <summary>
        /// 更新项目。
        /// </summary>
        /// <param name="action">更新操作定义。</param>
        public void Update(Action<Project> action)
        {
            if (this.Id == 0)
            {
                throw new InvalidOperationException();
            }
            DateTime timeStamp = DateTime.Now;
            this.Modification = timeStamp;
            if (action != null)
            {
                action(this);
            }
        }

        #endregion

    }

}
