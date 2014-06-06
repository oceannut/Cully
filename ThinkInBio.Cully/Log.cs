using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{
    public class Log
    {

        #region properties

        /// <summary>
        /// 编号。
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// 内容。
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 附件。
        /// </summary>
        public IList<string> Attachments { get; set; }

        /// <summary>
        /// 起始时间。
        /// </summary>
        public DateTime StartTime { get; set; }

        /// <summary>
        /// 截止时间。
        /// </summary>
        public DateTime? EndTime { get; set; }

        /// <summary>
        /// 创建人。
        /// </summary>
        public string Creator { get; set; }

        /// <summary>
        /// 创建时间。
        /// </summary>
        public DateTime Creation { get; internal set; }

        /// <summary>
        /// 修改时间。
        /// </summary>
        public DateTime Modification { get; internal set; }

        #endregion

    }
}
