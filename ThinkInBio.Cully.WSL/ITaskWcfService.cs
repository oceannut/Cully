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
            UriTemplate = "/{user}/task/{activityId}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Task SaveTask(string user, string activityId, string staff, string content, string appointedDay);

        [OperationContract]
        [WebGet(UriTemplate = "/{user}/task/{activityId}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Task[] GetTaskList(string user, string activityId);

    }

}
