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
    public class CautionCalendarWcfService : ICautionCalendarWcfService
    {

        internal ICalendarService CalendarService { get; set; }
        internal IExceptionHandler ExceptionHandler { get; set; }

        public Calendar[] GetCalendarList(string year, string month, string day, string user)
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
            int dayInt;
            try
            {
                dayInt = Convert.ToInt32(day);
            }
            catch
            {
                throw new WebFaultException<string>("day", HttpStatusCode.BadRequest);
            }
            if (dayInt < 1 || dayInt > DateTime.DaysInMonth(yearInt, monthInt))
            {
                throw new WebFaultException<string>("day", HttpStatusCode.RequestedRangeNotSatisfiable);
            }

            try
            {
                IList<Calendar> list = CalendarService.GetCalendarList4Caution(yearInt, monthInt, dayInt, user);
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
