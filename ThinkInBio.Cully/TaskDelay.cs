using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 延误统计的数据范围定义。
    /// </summary>
    public enum TaskDelayScope
    {
        /// <summary>
        /// 未完成的。
        /// </summary>
        Undone = 0,
        /// <summary>
        /// 完成的。
        /// </summary>
        Done = 1
    }

    /// <summary>
    /// 每日任务延误数统计，包括2种情况：
    /// （1）统计那些未完成且已逾期的任务；
    /// （2）依据完成时间统计那些当日完成但逾期的任务。
    /// </summary>
    public class TaskDelay
    {

        /// <summary>
        /// 编号。
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// 数据范围。
        /// </summary>
        public TaskDelayScope Scope { get; set; }

        /// <summary>
        /// 活动编号。
        /// </summary>
        public long ActivityId { get; set; }

        /// <summary>
        /// 指派的人员。
        /// </summary>
        public string Staff { get; set; }

        /// <summary>
        /// 任务的总个数。
        /// </summary>
        public int Total { get; set; }

        /// <summary>
        /// 已延误的任务个数。
        /// </summary>
        public int Delay { get; set; }

        /// <summary>
        /// 不限期的任务个数。
        /// </summary>
        public int Untimed { get; set; }

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
