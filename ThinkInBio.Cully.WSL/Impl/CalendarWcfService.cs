using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.ServiceModel.Web;

using ThinkInBio.Common.Exceptions;
using ThinkInBio.Common.ExceptionHandling;
using ThinkInBio.Cully;
using ThinkInBio.Cully.BLL;

namespace ThinkInBio.Cully.WSL.Impl
{
    public class CalendarWcfService : ICalendarWcfService
    {

        internal ICalendarService CalendarService { get; set; }
        internal IExceptionHandler ExceptionHandler { get; set; }

        public Calendar SaveCalendar(string user, string projectId, string appointed, string endAppointed, string content,
            string level, string repeat, string caution, string isCaution, string[] participants)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            long projectIdLong;
            try
            {
                projectIdLong = Convert.ToInt64(projectId);
            }
            catch
            {
                throw new WebFaultException<string>("projectId", HttpStatusCode.BadRequest);
            }
            DateTime appointedDate;
            try
            {
                appointedDate = Convert.ToDateTime(appointed);
            }
            catch
            {
                throw new WebFaultException<string>("appointed", HttpStatusCode.BadRequest);
            }
            DateTime endAppointedDate;
            try
            {
                endAppointedDate = Convert.ToDateTime(endAppointed);
            }
            catch
            {
                throw new WebFaultException<string>("endAppointed", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new WebFaultException<string>("content", HttpStatusCode.BadRequest);
            }
            AffairLevel affairLevel = AffairLevel.General;
            if (!string.IsNullOrWhiteSpace(level))
            {
                try
                {
                    affairLevel = (AffairLevel)Convert.ToInt32(level);
                }
                catch
                {
                    throw new WebFaultException<string>("level", HttpStatusCode.BadRequest);
                }
            }
            AffairRepeat affairRepeat = AffairRepeat.None;
            if (!string.IsNullOrWhiteSpace(repeat))
            {
                try
                {
                    affairRepeat = (AffairRepeat)Convert.ToInt32(repeat);
                }
                catch
                {
                    throw new WebFaultException<string>("repeat", HttpStatusCode.BadRequest);
                }
            }
            DateTime? cautionTime = null;
            if (!string.IsNullOrWhiteSpace(caution))
            {
                try
                {
                    cautionTime = Convert.ToDateTime(caution);
                }
                catch
                {
                    throw new WebFaultException<string>("caution", HttpStatusCode.BadRequest);
                }
            }
            bool isCautionBool = false;
            if (!string.IsNullOrWhiteSpace(isCaution))
            {
                try
                {
                    isCautionBool = Convert.ToBoolean(isCaution);
                }
                catch
                {
                    throw new WebFaultException<string>("isCaution", HttpStatusCode.BadRequest);
                }
            }

            try
            {
                Calendar calendar = new Calendar();
                calendar.Type = CalendarType.Calendar;
                calendar.ProjectId = projectIdLong;
                calendar.Appointed = appointedDate;
                calendar.EndAppointed = endAppointedDate.AddDays(1).AddSeconds(-1);
                calendar.Content = content;
                calendar.Level = affairLevel;
                calendar.Repeat = affairRepeat;
                calendar.Caution = cautionTime;
                calendar.IsCaution = isCautionBool;
                calendar.Creator = user;

                calendar.Save(participants,
                    (e1, e2, e3) =>
                    {
                        CalendarService.SaveCalendar(e1, e2, e3);
                    });

                return calendar;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Calendar SaveClock(string user, string content, string repeat, string caution, string[] participants)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new WebFaultException<string>("content", HttpStatusCode.BadRequest);
            }
            AffairRepeat affairRepeat = AffairRepeat.None;
            if (!string.IsNullOrWhiteSpace(repeat))
            {
                try
                {
                    affairRepeat = (AffairRepeat)Convert.ToInt32(repeat);
                }
                catch
                {
                    throw new WebFaultException<string>("repeat", HttpStatusCode.BadRequest);
                }
            }
            DateTime? cautionTime = null;
            if (!string.IsNullOrWhiteSpace(caution))
            {
                try
                {
                    cautionTime = Convert.ToDateTime(caution);
                }
                catch
                {
                    throw new WebFaultException<string>("caution", HttpStatusCode.BadRequest);
                }
            }

            try
            {
                DateTime now = DateTime.Now;
                Calendar calendar = new Calendar();
                calendar.Type = CalendarType.Clock;
                calendar.Appointed = now.Date;
                calendar.EndAppointed = now.Date.AddYears(1).AddDays(1).AddSeconds(-1);
                calendar.Content = content;
                calendar.Repeat = affairRepeat;
                calendar.Caution = cautionTime;
                calendar.Creator = user;
                calendar.IsCaution = true;

                calendar.Save(participants,
                    (e1, e2, e3) =>
                    {
                        CalendarService.SaveCalendar(e1, e2, e3);
                    });

                return calendar;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Calendar UpdateCalendar(string user, string id, string appointed, string content,
            string level, string repeat, string caution, string isCaution)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            long idLong;
            try
            {
                idLong = Convert.ToInt64(id);
            }
            catch
            {
                throw new WebFaultException<string>("id", HttpStatusCode.BadRequest);
            }
            DateTime appointedDate;
            try
            {
                appointedDate = Convert.ToDateTime(appointed);
            }
            catch
            {
                throw new WebFaultException<string>("appointed", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new WebFaultException<string>("content", HttpStatusCode.BadRequest);
            }
            AffairLevel affairLevel = AffairLevel.General;
            if (!string.IsNullOrWhiteSpace(level))
            {
                try
                {
                    affairLevel = (AffairLevel)Convert.ToInt32(level);
                }
                catch
                {
                    throw new WebFaultException<string>("level", HttpStatusCode.BadRequest);
                }
            }
            AffairRepeat affairRepeat = AffairRepeat.None;
            if (!string.IsNullOrWhiteSpace(repeat))
            {
                try
                {
                    affairRepeat = (AffairRepeat)Convert.ToInt32(repeat);
                }
                catch
                {
                    throw new WebFaultException<string>("repeat", HttpStatusCode.BadRequest);
                }
            }
            DateTime? cautionTime = null;
            if (!string.IsNullOrWhiteSpace(caution))
            {
                try
                {
                    cautionTime = Convert.ToDateTime(caution);
                }
                catch
                {
                    throw new WebFaultException<string>("caution", HttpStatusCode.BadRequest);
                }
            }
            bool isCautionBool = false;
            if (!string.IsNullOrWhiteSpace(isCaution))
            {
                try
                {
                    isCautionBool = Convert.ToBoolean(isCaution);
                }
                catch
                {
                    throw new WebFaultException<string>("isCaution", HttpStatusCode.BadRequest);
                }
            }

            try
            {
                Calendar calendar = CalendarService.GetCalendar(idLong);
                if (calendar == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                if (user != calendar.Creator)
                {
                    throw new WebFaultException(HttpStatusCode.Forbidden);
                }
                calendar.Appointed = appointedDate;
                calendar.Content = content;
                calendar.Level = affairLevel;
                calendar.Repeat = affairRepeat;
                calendar.Caution = cautionTime;
                calendar.IsCaution = isCautionBool;

                calendar.Update((e) =>
                {
                    CalendarService.UpdateCalendar(e);
                });

                return calendar;
            }
            catch (WebFaultException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public void DeleteCalendar(string user, string id)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            long idLong;
            try
            {
                idLong = Convert.ToInt64(id);
            }
            catch
            {
                throw new WebFaultException<string>("id", HttpStatusCode.BadRequest);
            }

            try
            {
                Calendar calendar = CalendarService.GetCalendar(idLong);
                if (calendar == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                if (user != calendar.Creator)
                {
                    throw new WebFaultException(HttpStatusCode.Forbidden);
                }
                calendar.Delete(
                    (e) =>
                    {
                        return CalendarService.GetCalendarCautionList(e);
                    },
                    (e1, e2, e3) =>
                    {
                        CalendarService.DeleteCalendar(e1, e2, e3);
                    });
            }
            catch (WebFaultException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Calendar GetCalendar(string user, string id)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            long idLong;
            try
            {
                idLong = Convert.ToInt64(id);
            }
            catch
            {
                throw new WebFaultException<string>("id", HttpStatusCode.BadRequest);
            }

            try
            {
                return CalendarService.GetCalendar(idLong);
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Calendar[] GetCalendarList(string user, string year, string month, string type, string projectId)
        {
            int yearInt;
            try
            {
                yearInt = Convert.ToInt32(year);
            }
            catch
            {
                throw new WebFaultException<string>("year", HttpStatusCode.BadRequest);
            }
            if (yearInt < 1970)
            {
                throw new WebFaultException<string>("year", HttpStatusCode.RequestedRangeNotSatisfiable);
            }
            int monthInt;
            try
            {
                monthInt = Convert.ToInt32(month);
            }
            catch
            {
                throw new WebFaultException<string>("month", HttpStatusCode.BadRequest);
            }
            if (monthInt < 1 || monthInt > 12)
            {
                throw new WebFaultException<string>("month", HttpStatusCode.RequestedRangeNotSatisfiable);
            }
            CalendarType? typeEnum = null;
            if (!string.IsNullOrWhiteSpace(type) && "null" != type)
            {
                try
                {
                    typeEnum = (CalendarType)Convert.ToInt32(type);
                }
                catch
                {
                    throw new WebFaultException<string>("type", HttpStatusCode.BadRequest);
                }
            }
            long projectIdLong = 0;
            try
            {
                projectIdLong = Convert.ToInt64(projectId);
            }
            catch
            {
                throw new WebFaultException<string>("projectId", HttpStatusCode.BadRequest);
            }
            try
            {
                IList<Calendar> list = CalendarService.GetCalendarList(yearInt, monthInt, typeEnum, projectIdLong, user);
                if (list != null)
                {
                    return list.ToArray();
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Calendar[] GetCalendarList(string year, string month, string type, string projectId)
        {
            return GetCalendarList(null, year, month, type, projectId);
        }

        public CalendarCaution SaveCalendarCaution(string user, string calendarId, string participant)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            long calendarIdLong;
            try
            {
                calendarIdLong = Convert.ToInt64(calendarId);
            }
            catch
            {
                throw new WebFaultException<string>("calendarId", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(participant))
            {
                throw new WebFaultException<string>("participant", HttpStatusCode.BadRequest);
            }
            try
            {
                Calendar calendar = CalendarService.GetCalendar(calendarIdLong);
                if (calendar == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                if (user != calendar.Creator)
                {
                    throw new WebFaultException(HttpStatusCode.Forbidden);
                }
                return calendar.AddParticipant(participant,
                    (e) =>
                    {
                        return CalendarService.GetCalendarCautionList(e);
                    },
                    (e1, e2) =>
                    {
                        CalendarService.SaveCalendarCaution(e1, e2);
                    });
            }
            catch (WebFaultException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public void DeleteCalendarCaution(string user, string calendarId, string participant)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            long calendarIdLong;
            try
            {
                calendarIdLong = Convert.ToInt64(calendarId);
            }
            catch
            {
                throw new WebFaultException<string>("calendarId", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(participant))
            {
                throw new WebFaultException<string>("participant", HttpStatusCode.BadRequest);
            }
            try
            {
                Calendar calendar = CalendarService.GetCalendar(calendarIdLong);
                if (calendar == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                if (user != calendar.Creator)
                {
                    throw new WebFaultException(HttpStatusCode.Forbidden);
                }
                calendar.RemoveParticipant(participant,
                    (e) =>
                    {
                        return CalendarService.GetCalendarCautionList(e);
                    },
                    (e1, e2) =>
                    {
                        CalendarService.DeleteCalendarCaution(e1, e2);
                    });
            }
            catch (WebFaultException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public CalendarCaution[] GetCalendarCautionList(string user, string id)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            long idLong;
            try
            {
                idLong = Convert.ToInt64(id);
            }
            catch
            {
                throw new WebFaultException<string>("id", HttpStatusCode.BadRequest);
            }

            try
            {
                IList<CalendarCaution> list = CalendarService.GetCalendarCautionList(idLong);
                if (list != null)
                {
                    return list.ToArray();
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }


    }
}
