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

        public Calendar SaveCalendar(string user, string projectId, string appointed, string content,
            string level, string repeat, string caution, string[] participants)
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

            try
            {
                Calendar calendar = new Calendar();
                calendar.ProjectId = projectIdLong;
                calendar.Appointed = appointedDate;
                calendar.Content = content;
                calendar.Level = affairLevel;
                calendar.Repeat = affairRepeat;
                calendar.Caution = cautionTime;
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

        public Calendar UpdateCalendar(string user, string id, string appointed, string content,
            string level, string repeat, string caution)
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

            try
            {
                Calendar calendar = CalendarService.GetCalendar(idLong);
                if (calendar == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                calendar.Appointed = appointedDate;
                calendar.Content = content;
                calendar.Level = affairLevel;
                calendar.Repeat = affairRepeat;
                calendar.Caution = cautionTime;

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

        public Calendar[] GetCalendarList(string year, string month)
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
            try
            {
                IList<Calendar> list = CalendarService.GetCalendarList(yearInt, monthInt);
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
