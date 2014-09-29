using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Web;

using ThinkInBio.Cully;

namespace ThinkInBio.Cully.WSL
{

    [ServiceContract]
    public interface ICalendarWcfService
    {

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/calendar/0/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar SaveCalendar(string user, string projectId, string appointed, string endAppointed, string content, 
            string level, string repeat, string caution, string isCaution, string[] participants);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/clock/0/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar SaveClock(string user, string content, string repeat, string caution, string[] participants);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/calendar/{id}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar UpdateCalendar(string id, string appointed, string endAppointed, string content,
            string level, string repeat, string caution, string isCaution);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/calendar/{id}/caution/{isCaution}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar UpdateCalendar4ToggleCaution(string id, string isCaution);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/clock/{id}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar UpdateClock(string id, string content, string repeat, string caution, string isCaution);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/calendar/{id}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        void DeleteCalendar(string id);

        [OperationContract]
        [WebGet(UriTemplate = "/calendar/{id}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar GetCalendar(string id);

        [OperationContract(Name = "GetCalendarList4User")]
        [WebGet(UriTemplate = "/calendar/{year}/{month}/{type}/{user}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar[] GetCalendarList(string year, string month, string type, string user);

        [OperationContract]
        [WebGet(UriTemplate = "/calendar/{year}/{month}/{type}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar[] GetCalendarList(string year, string month, string type);

        [OperationContract]
        [WebGet(UriTemplate = "/project/{projectId}/calendar/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar[] GetCalendarList4Project(string projectId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/calendar/{calendarId}/caution/{participant}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        CalendarCaution SaveCalendarCaution(string calendarId, string participant);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/calendar/{calendarId}/caution/{participant}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        void DeleteCalendarCaution(string calendarId, string participant);

        [OperationContract]
        [WebGet(UriTemplate = "/calendar/{calendarId}/caution/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        CalendarCaution[] GetCalendarCautionList(string calendarId);

    }
}
