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
        /// 创建时间。
        /// </summary>
        public DateTime Creation { get; set; }

        public CalendarCaution() { }

        public CalendarCaution(Calendar calendar)
        {
            if (calendar == null)
            {
                throw new ArgumentNullException();
            }
            if (calendar.Id > 0)
            {
                this.CalendarId = calendar.Id;
            }
            else
            {
                calendar.IdChanged += new Action<long>(CalendarIdChanged);
            }
        }

        public void Save(Action<CalendarCaution> action)
        {
            Save(DateTime.Now, action);
        }

        public void Save(DateTime timeStamp,
            Action<CalendarCaution> action)
        {
            if (this.CalendarId == 0 || string.IsNullOrWhiteSpace(this.Staff))
            {
                throw new InvalidOperationException();
            }

            this.Creation = timeStamp;

            if (action != null)
            {
                action(this);
            }
        }

        private void CalendarIdChanged(long id)
        {
            this.CalendarId = id;
        }

    }
}
