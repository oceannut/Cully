﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.CommonApp;

namespace ThinkInBio.Cully
{

    #region enums

    /// <summary>
    /// 日历类型。
    /// </summary>
    public enum CalendarType
    {
        /// <summary>
        /// 日程。
        /// </summary>
        Calendar = 0,
        /// <summary>
        /// 闹钟。
        /// </summary>
        Clock = 1
    }

    /// <summary>
    /// 事情等级。
    /// </summary>
    public enum AffairLevel
    {
        /// <summary>
        /// 未定义。
        /// </summary>
        None = 0,
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
    /// 事情重复的周期。
    /// </summary>
    public enum AffairRepeat
    {
        /// <summary>
        /// 只进行一次且不重复。
        /// </summary>
        None = 0,
        /// <summary>
        /// 每天重复。
        /// </summary>
        Day = 1,
        /// <summary>
        /// 每周重复。
        /// </summary>
        Week = 2,
        /// <summary>
        /// 每月重复。
        /// </summary>
        Month = 3,
        /// <summary>
        /// 周一至周五重复。
        /// </summary>
        Monday2Friday = 5,
        /// <summary>
        /// 周一重复。
        /// </summary>
        Monday = 11,
        /// <summary>
        /// 周二重复。
        /// </summary>
        Tuesday = 12,
        /// <summary>
        /// 周三重复。
        /// </summary>
        Wednesday = 13,
        /// <summary>
        /// 周四重复。
        /// </summary>
        Thursday = 14,
        /// <summary>
        /// 周五重复。
        /// </summary>
        Friday = 15,
        /// <summary>
        /// 周六重复。
        /// </summary>
        Saturday = 16,
        /// <summary>
        /// 周日重复。
        /// </summary>
        Sunday = 10
    }

    #endregion

    /// <summary>
    /// 日历。
    /// </summary>
    public class Calendar
    {

        #region events

        /// <summary>
        /// 编号变化引发的事件。
        /// </summary>
        internal event Action<long> IdChanged;

        #endregion

        #region properties

        private long id;
        /// <summary>
        /// 编号。
        /// </summary>
        public long Id
        {
            get { return id; }
            set
            {
                if (id != value)
                {
                    id = value;
                    if (IdChanged != null)
                    {
                        IdChanged(id);
                    }
                }
            }
        }

        /// <summary>
        /// 日历类型。
        /// </summary>
        public CalendarType Type { get; set; }

        /// <summary>
        /// 项目编号。
        /// </summary>
        public long ProjectId { get; set; }

        /// <summary>
        /// 内容。
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 起始日期。
        /// </summary>
        public DateTime? Appointed { get; set; }

        /// <summary>
        /// 结束日期。
        /// </summary>
        public DateTime? EndAppointed { get; set; }

        /// <summary>
        /// 事情等级。
        /// </summary>
        public AffairLevel Level { get; set; }

        /// <summary>
        /// 事情重复周期。
        /// </summary>
        public AffairRepeat Repeat { get; set; }

        /// <summary>
        /// 提醒时间。
        /// </summary>
        public DateTime? Caution { get; set; }

        /// <summary>
        /// 是否提醒。
        /// </summary>
        public bool IsCaution { get; set; }

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

        #region methods

        public IList<CalendarCaution> Save(ICollection<string> participants,
            Action<Calendar, ICollection<CalendarCaution>, ICollection<BizNotification>> action)
        {
            if (string.IsNullOrWhiteSpace(this.Content) ||
                string.IsNullOrWhiteSpace(this.Creator))
            {
                throw new InvalidOperationException();
            }
            if (this.IsCaution && !this.Caution.HasValue)
            {
                throw new InvalidOperationException("caution");
            }

            List<string> templist = new List<string>();
            if (participants != null && participants.Count > 0)
            {
                //过滤掉可能重复的参与人项。
                templist.AddRange(participants.Distinct<string>());
            }

            DateTime timeStamp = DateTime.Now;
            List<CalendarCaution> calendarCautionList = BuildCalendarCautions(timeStamp, templist);

            List<BizNotification> bizNotificationList = null;
            if (CalendarType.Calendar == this.Type)
            {
                bizNotificationList = new List<BizNotification>();
                foreach (string participant in templist)
                {
                    BizNotification notification = BuildBizNotifications(participant, "制定了日程", this.Id);
                    if (notification != null)
                    {
                        bizNotificationList.Add(notification);
                    }
                }
            }

            this.Creation = timeStamp;
            this.Modification = timeStamp;

            if (action != null)
            {
                action(this, calendarCautionList, bizNotificationList);
            }

            return calendarCautionList;
        }

        public void Update(Action<Calendar> action)
        {
            if (this.Id == 0 ||
                string.IsNullOrWhiteSpace(this.Content) ||
                string.IsNullOrWhiteSpace(this.Creator))
            {
                throw new InvalidOperationException();
            }
            if (this.IsCaution && !this.Caution.HasValue)
            {
                throw new InvalidOperationException("caution");
            }

            DateTime timeStamp = DateTime.Now;
            this.Modification = timeStamp;

            if (action != null)
            {
                action(this);
            }
        }

        public void Delete(Func<long, IEnumerable<CalendarCaution>> participantFactory,
             Action<Calendar, ICollection<CalendarCaution>, ICollection<BizNotification>> action)
        {
            if (this.Id == 0
                || string.IsNullOrWhiteSpace(this.Creator))
            {
                throw new InvalidOperationException();
            }
            List<CalendarCaution> calendarCautionList = new List<CalendarCaution>();
            List<BizNotification> bizNotificationList = null;
            IEnumerable<CalendarCaution> participants = participantFactory == null ? null : participantFactory(this.Id);
            if (participants != null && participants.Count() > 0)
            {
                calendarCautionList.AddRange(participants);
                if (CalendarType.Calendar == this.Type)
                {
                    bizNotificationList = new List<BizNotification>();
                    foreach (CalendarCaution participant in participants)
                    {
                        if (this.Creator == participant.Staff)
                        {
                            continue;
                        }
                        BizNotification notification = BuildBizNotifications(participant.Staff, "删除了日程", 0);
                        if (notification != null)
                        {
                            bizNotificationList.Add(notification);
                        }
                    }
                }
            }

            if (action != null)
            {
                action(this, calendarCautionList, bizNotificationList);
            }
        }

        public CalendarCaution AddParticipant(string participant,
            Func<long, IEnumerable<CalendarCaution>> participantFactory,
            Action<CalendarCaution, BizNotification> action)
        {
            if (string.IsNullOrWhiteSpace(participant))
            {
                throw new ArgumentNullException();
            }
            if (this.Id == 0 ||
                string.IsNullOrWhiteSpace(this.Content) ||
                this.Appointed == DateTime.MinValue ||
                string.IsNullOrWhiteSpace(this.Creator))
            {
                throw new InvalidOperationException();
            }

            CalendarCaution p = null;
            IEnumerable<CalendarCaution> participants = participantFactory == null ? null : participantFactory(this.Id);
            if (participants == null || participants.Count() == 0
                || !participants.Any((e) =>
                {
                    if (this.Id != e.CalendarId)
                    {
                        throw new InvalidOperationException();
                    }
                    return participant == e.Staff;
                }))
            {
                p = new CalendarCaution(this);
                p.Staff = participant;
                p.Creation = DateTime.Now;
            }
            BizNotification notification = null;
            if (CalendarType.Calendar == this.Type)
            {
                notification = BuildBizNotifications(participant, "邀请您参加日程", this.Id);
            }
            if (action != null)
            {
                action(p, notification);
            }
            return p;
        }

        public CalendarCaution RemoveParticipant(string participant,
            Func<long, IEnumerable<CalendarCaution>> participantFactory,
            Action<CalendarCaution, BizNotification> action)
        {
            if (string.IsNullOrWhiteSpace(participant))
            {
                throw new ArgumentNullException();
            }
            if (this.Id == 0 ||
                string.IsNullOrWhiteSpace(this.Content) ||
                this.Appointed == DateTime.MinValue ||
                string.IsNullOrWhiteSpace(this.Creator))
            {
                throw new InvalidOperationException();
            }

            CalendarCaution p = null;
            IEnumerable<CalendarCaution> participants = participantFactory == null ? null : participantFactory(this.Id);
            if (participants != null && participants.Count() > 0)
            {
                p = participants.SingleOrDefault((e) =>
                {
                    if (this.Id != e.CalendarId)
                    {
                        throw new InvalidOperationException();
                    }
                    return participant == e.Staff;
                });
            }
            if (p != null && action != null)
            {
                BizNotification notification = null;
                if (CalendarType.Calendar == this.Type)
                {
                    notification = BuildBizNotifications(participant, "从日程安排中移除了您", this.Id);
                }
                action(p, notification);
            }
            return p;
        }

        private List<CalendarCaution> BuildCalendarCautions(DateTime timeStamp, ICollection<string> participants)
        {
            if (!participants.Contains(this.Creator))
            {
                //项目的创建人缺省即为日程的参与人。
                participants.Add(this.Creator);
            }

            List<CalendarCaution> calendarCautionList = new List<CalendarCaution>();
            foreach (string item in participants)
            {
                CalendarCaution participant = new CalendarCaution(this);
                participant.Staff = item;
                participant.Creation = timeStamp;
                calendarCautionList.Add(participant);
            }

            return calendarCautionList;
        }

        private BizNotification BuildBizNotifications(string participant, string contentPrefix, long id)
        {
            BizNotification notification = null;
            if (this.Creator != participant)
            {
                //只有发送人和接收人不是同一人，才创建通知。
                notification = new BizNotification(this.Creator, participant);
                notification.Content = string.Format("[{0}]: {1}", contentPrefix,
                            this.Content.Length <= 120 ? this.Content : string.Format("{0}...", this.Content.Substring(0, 120)));
                notification.Resource = "calendar";
                if (this.Id == 0)
                {
                    this.IdChanged += (e) =>
                    {
                        notification.ResourceId = e.ToString();
                    };
                }
                else
                {
                    notification.ResourceId = id.ToString();
                }
                notification.Send(null);

            }
            return notification;
        }

        #endregion

    }
}
