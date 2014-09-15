using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.CommonApp;
using ThinkInBio.Cully;

namespace ThinkInBio.Cully.BLL
{

    public interface ICalendarService
    {

        void SaveCalendar(Calendar calendar,
            ICollection<CalendarCaution> calendarCautions,
            ICollection<BizNotification> notifications);

        void UpdateCalendar(Calendar calendar);

        void DeleteCalendar(Calendar calendar,
            ICollection<CalendarCaution> calendarCautions,
            ICollection<BizNotification> notifications);

        Calendar GetCalendar(long id);

        IList<Calendar> GetCalendarList(int year, int month, CalendarType? type);

        IList<Calendar> GetCalendarList(int year, int month, CalendarType? type, string participant);

        IList<Calendar> GetCalendarList(int year, int month, CalendarType? type, long? projectId);

        IList<Calendar> GetCalendarList(int year, int month, CalendarType? type, long? projectId, string participant);

        void SaveCalendarCaution(CalendarCaution calendarCaution, 
            BizNotification notification);

        void DeleteCalendarCaution(CalendarCaution calendarCaution, 
            BizNotification notification);

        IList<CalendarCaution> GetCalendarCautionList(long calendarId);

    }

}
