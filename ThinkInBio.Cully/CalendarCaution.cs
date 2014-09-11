using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 日程提醒。
    /// </summary>
    public class CalendarCaution
    {

        /// <summary>
        /// 编号。
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// 日程表编号。
        /// </summary>
        public long CalendarId { get; set; }

        /// <summary>
        /// 要提醒的人。
        /// </summary>
        public string Staff { get; set; }

        /// <summary>
        /// 提醒备注。
        /// </summary>
        public string Memo { get; set; }

    }
}
