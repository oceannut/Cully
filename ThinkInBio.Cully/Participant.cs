using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 参与者。
    /// </summary>
    public class Participant : IDisposable
    {

        #region properties

        /// <summary>
        /// 编号。
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// 项目编号。
        /// </summary>
        public long ProjectId { get; set; }

        /// <summary>
        /// 成员。
        /// </summary>
        public string Staff { get; set; }

        /// <summary>
        /// 创建时间。
        /// </summary>
        public DateTime Creation { get; set; }

        #endregion

        #region constructors

        /// <summary>
        /// 
        /// </summary>
        public Participant() { }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="project"></param>
        public Participant(Project project)
        {
            if (project == null)
            {
                throw new ArgumentNullException();
            }
            if (project.Id > 0)
            {
                this.ProjectId = project.Id;
            }
            else
            {
                project.IdChanged += new Action<long>(ProjectIdChanged);
            }
        }

        #endregion

        /// <summary>
        /// 
        /// </summary>
        /// <param name="action"></param>
        public void Save(Action<Participant> action)
        {
            Save(DateTime.Now, action);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="timeStamp"></param>
        /// <param name="action"></param>
        public void Save(DateTime timeStamp, 
            Action<Participant> action)
        {
            this.Creation = timeStamp;
            if (action != null)
            {
                action(this);
            }
        }

        public void Dispose()
        {
            
        }

        private void ProjectIdChanged(long id)
        {
            this.ProjectId = id;
        }

    }
}
