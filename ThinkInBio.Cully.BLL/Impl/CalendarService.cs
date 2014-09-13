﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.CommonApp;
using ThinkInBio.CommonApp.BLL;
using ThinkInBio.Cully;
using ThinkInBio.Cully.DAL;

namespace ThinkInBio.Cully.BLL.Impl
{
    public class CalendarService : ICalendarService
    {

        internal ICalendarDao CalendarDao { get; set; }
        internal ICalendarCautionDao CalendarCautionDao { get; set; }
        internal IBizNotificationService BizNotificationService { get; set; }

        public void SaveCalendar(Calendar calendar,
            ICollection<CalendarCaution> calendarCautions, 
            ICollection<BizNotification> notifications)
        {
            if (calendar == null)
            {
                throw new ArgumentNullException();
            }
            CalendarDao.Save(calendar);
            if (calendarCautions != null && calendarCautions.Count > 0)
            {
                CalendarCautionDao.Save(calendarCautions);
            }
            if (notifications != null && notifications.Count > 0)
            {
                BizNotificationService.SaveNotification(notifications);
            }
        }

        public void UpdateCalendar(Calendar calendar)
        {
            if (calendar == null)
            {
                throw new ArgumentNullException();
            }
            CalendarDao.Update(calendar);
        }

        public void DeleteCalendar(Calendar calendar,
            ICollection<CalendarCaution> calendarCautions,
            ICollection<BizNotification> notifications)
        {
            if (calendar == null)
            {
                throw new ArgumentNullException();
            }
            CalendarDao.Delete(calendar);
            if (calendarCautions != null && calendarCautions.Count > 0)
            {
                foreach (CalendarCaution item in calendarCautions)
                {
                    CalendarCautionDao.Delete(item);
                }
            }
            if (notifications != null && notifications.Count > 0)
            {
                BizNotificationService.SaveNotification(notifications);
            }
        }

        public Calendar GetCalendar(long id)
        {
            if (id < 1)
            {
                throw new ArgumentException();
            }
            return CalendarDao.Get(id);
        }

        public IList<Calendar> GetCalendarList(int year, int month)
        {
            return GetCalendarList(year, month, 0, null);
        }

        public IList<Calendar> GetCalendarList(int year, int month, string participant)
        {
            return GetCalendarList(year, month, 0, participant);
        }

        public IList<Calendar> GetCalendarList(int year, int month, long projectId)
        {
            return GetCalendarList(year, month, projectId, null);
        }

        public IList<Calendar> GetCalendarList(int year, int month, long projectId, string participant)
        {
            if (year < 1970)
            {
                throw new ArgumentOutOfRangeException();
            }
            if (month < 1 || month > 12)
            {
                throw new ArgumentOutOfRangeException();
            }
            DateTime startTime = new DateTime(year, month, 1);
            DateTime endTime = startTime.AddMonths(1);
            return CalendarDao.GetList(participant, projectId, startTime, endTime, false, 0, int.MaxValue);
        }

        public void SaveCalendarCaution(CalendarCaution calendarCaution, BizNotification notification)
        {
            if (calendarCaution == null)
            {
                throw new ArgumentNullException();
            }
            CalendarCautionDao.Save(calendarCaution);
            if (notification != null)
            {
                BizNotificationService.SaveNotification(notification);
            }
        }

        public void DeleteCalendarCaution(CalendarCaution calendarCaution, BizNotification notification)
        {
            if (calendarCaution == null)
            {
                throw new ArgumentNullException();
            }
            CalendarCautionDao.Delete(calendarCaution);
            if (notification != null)
            {
                BizNotificationService.SaveNotification(notification);
            }
        }

        public IList<CalendarCaution> GetCalendarCautionList(long calendarId)
        {
            if (calendarId < 1)
            {
                throw new ArgumentException();
            }
            return CalendarCautionDao.GetList(calendarId);
        }

    }
}