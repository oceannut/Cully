using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 任务延误
    /// </summary>
    public class TaskDelay
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
        /// 总个数。
        /// </summary>
        public int Total { get; set; }

        /// <summary>
        /// 延误个数。
        /// </summary>
        public int Delay { get; set; }

        /// <summary>
        /// 期限日期。
        /// </summary>
        public DateTime AppointedDay { get; set; }

        /// <summary>
        /// 创建时间。
        /// </summary>
        public DateTime Creation { get; set; }

    }

}
