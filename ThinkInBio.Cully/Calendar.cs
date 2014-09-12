using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 事情等级。
    /// </summary>
    public enum AffairLevel
    {
        /// <summary>
        /// 普通。
        /// </summary>
        General = 1,
        /// <summary>
        /// 重要。
        /// </summary>
        Important = 2,
        /// <summary>
        /// 紧急。
        /// </summary>
        Urgency = 3
    }

    /// <summary>
    /// 日程表。
    /// </summary>
    public class Calendar
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
        /// 提醒内容。
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 事情等级。
        /// </summary>
        public AffairLevel Level { get; set; }

        /// <summary>
        /// 约定开始提醒的时间
        /// </summary>
        public DateTime Appointed { get; set; }

        /// <summary>
        /// 提醒间隔时间（秒数）。
        /// </summary>
        public int Interval { get; set; }

        /// <summary>
        /// 提醒重复次数。
        /// </summary>
        public int Repeat { get; set; }

        /// <summary>
        /// 提醒表达式。
        /// </summary>
        public string Expression { get; set; }

        /// <summary>
        /// 提示是否停止提醒。
        /// </summary>
        public bool IsStop { get; set; }

        /// <summary>
        /// 创建人。
        /// </summary>
        public string Creator { get; set; }

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
