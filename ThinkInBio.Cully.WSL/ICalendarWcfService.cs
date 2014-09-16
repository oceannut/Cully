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
            UriTemplate = "/{user}/calendar/0/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar SaveCalendar(string user, string projectId, string appointed, string endAppointed, string content, 
            string level, string repeat, string caution, string isCaution, string[] participants);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/clock/0/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar SaveClock(string user, string content, string repeat, string caution, string[] participants);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/calendar/{id}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar UpdateCalendar(string user, string id, string appointed, string endAppointed, string content,
            string level, string repeat, string caution, string isCaution);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/calendar/{id}/caution/{isCaution}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar UpdateCalendar4ToggleCaution(string user, string id, string isCaution);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/clock/{id}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar UpdateClock(string user, string id, string content, string repeat, string caution, string isCaution);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/calendar/{id}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        void DeleteCalendar(string user, string id);

        [OperationContract]
        [WebGet(UriTemplate = "/{user}/calendar/{id}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar GetCalendar(string user, string id);

        [OperationContract(Name = "GetCalendarList4User")]
        [WebGet(UriTemplate = "/{user}/calendar/{year}/{month}/{type}/{projectId}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar[] GetCalendarList(string user, string year, string month, string type, string projectId);

        [OperationContract]
        [WebGet(UriTemplate = "/calendar/{year}/{month}/{type}/{projectId}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar[] GetCalendarList(string year, string month, string type, string projectId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/calendar/{calendarId}/caution/{participant}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        CalendarCaution SaveCalendarCaution(string user, string calendarId, string participant);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/calendar/{calendarId}/caution/{participant}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        void DeleteCalendarCaution(string user, string calendarId, string participant);

        [OperationContract]
        [WebGet(UriTemplate = "/{user}/calendar/{id}/caution/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        CalendarCaution[] GetCalendarCautionList(string user, string id);

    }
}
