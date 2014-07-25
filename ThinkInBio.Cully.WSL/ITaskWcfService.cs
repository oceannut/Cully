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
    public interface ITaskWcfService
    {

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/task/{activityId}/0/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Task SaveTask(string user, string activityId, string content, string staff, string appointedDay);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/task/0/{id}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Task UpdateTask(string user, string id, string content, string staff, string appointedDay);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/task/0/{id}/isUnderway/{isUnderway}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Task UpdateTask4IsUnderway(string user, string id, string isUnderway);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/task/0/{id}/isCompleted/{isCompleted}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Task UpdateTask4IsCompleted(string user, string id, string isCompleted);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            UriTemplate = "/{user}/task/0/{id}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        void DeleteTask(string user, string id);

        [OperationContract]
        [WebGet(UriTemplate = "/{user}/task/0/{id}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Task GetTask(string user, string id);

        [OperationContract]
        [WebGet(UriTemplate = "/{user}/task/{activityId}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Task[] GetTaskList(string user, string activityId);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/task/0/{id}/comment/0/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Comment SaveComment(string user, string id, string content, string[] observers);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/task/0/{id}/comment/{commentId}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        void DeleteComment(string user, string id, string commentId, string[] observers);

    }

}
