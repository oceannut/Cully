using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    public enum TargetType
    {
        Project,
        Activity
    }

    /// <summary>
    /// 参与者。
    /// </summary>
    public class Participant
    {

        #region properties

        /// <summary>
        /// 编号。
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public long Target { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public TargetType Type { get; set; }

        /// <summary>
        /// 成员。
        /// </summary>
        public string Staff { get; set; }

        /// <summary>
        /// 创建时间。
        /// </summary>
        public DateTime Creation { get; set; }

        /// <summary>
        /// 修改时间。
        /// </summary>
        public DateTime Modification { get; set; }

        #endregion

    }
}
