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
    public interface ITeamWcfService
    {

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/project/{name}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Project SaveProject(string name, string description);

        [OperationContract]
        [WebGet(UriTemplate = "/activity/user/{user}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Activity[] GetActivityList(string user);

    }

}
