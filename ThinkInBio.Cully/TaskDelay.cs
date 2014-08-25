using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 任务延误的情况，统计任务已逾期或按时完成，数据来源包括：
    /// （1）未完成的任务；
    /// （2）最新已完成的，截止上轮统计目前尚未统计的任务。
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
        /// 创建时间。
        /// </summary>
        public DateTime Creation { get; set; }

    }

}
