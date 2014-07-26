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
    public interface ILogWcfService
    {

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/log/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Log SaveLog(string user, string date, string title, string content, string category, string tag1, string tag2, string tag3);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/log/{id}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Log UpdateLog(string user, string id, string date, string title, string content, string category, string tag1, string tag2, string tag3);

        [OperationContract]
        [WebGet(UriTemplate = "/{user}/log/range/{start}/{count}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Log[] GetLogList4User(string user, string start, string count);

        [OperationContract(Name = "GetLogList4UserByDate")]
        [WebGet(UriTemplate = "/{user}/log/time/{date}/{span}/range/{start}/{count}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Log[] GetLogList4User(string user, string date, string span, string start, string count);

        [OperationContract]
        [WebGet(UriTemplate = "/log/range/{start}/{count}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Log[] GetLogList(string start, string count);

        [OperationContract(Name = "GetLogListByDate")]
        [WebGet(UriTemplate = "/log/time/{date}/{span}/range/{start}/{count}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Log[] GetLogList(string date, string span, string start, string count);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/log/{logId}/comment/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Comment SaveComment(string user, string logId, string content); 

    }
}
