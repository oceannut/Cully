using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 依据任务的创建时间的每日任务数统计。
    /// </summary>
    public class TaskReport
    {

        /// <summary>
        /// 编号。
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// 活动编号。
        /// </summary>
        public long ActivityId { get; set; }

        /// <summary>
        /// 指派的人员。
        /// </summary>
        public string Staff { get; set; }

        /// <summary>
        /// 任务个数。
        /// </summary>
        public int Count { get; set; }

        /// <summary>
        /// 年。
        /// </summary>
        public int Year { get; set; }

        /// <summary>
        /// 月。
        /// </summary>
        public int Month { get; set; }

        /// <summary>
        /// 日。
        /// </summary>
        public int Day { get; set; }

    }

}
