using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Web;

using ThinkInBio.FileTransfer;
using ThinkInBio.Cully;

namespace ThinkInBio.Cully.WSL
{

    /// <summary>
    /// 定义了项目相关的服务接口。
    /// </summary>
    [ServiceContract]
    public interface IProjectWcfService
    {

        #region project

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/project/0/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Project SaveProject(string user, string name, string description, string[] participants, 
            string createSameNameActivity, string category);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/project/{projectId}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Project UpdateProject(string projectId, string name, string description);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            UriTemplate = "/project/{projectId}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        void DeleteProject(string projectId);

        [OperationContract]
        [WebGet(UriTemplate = "/project/{projectId}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Project GetProject(string projectId);

        [OperationContract]
        [WebGet(UriTemplate = "/project/{user}/top/isSoloInclude/{isSoloInclude}/{count}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Project[] GetTopProjectList(string user, string isSoloInclude, string count);

        [OperationContract]
        [WebGet(UriTemplate = "/project/{user}/isSoloInclude/{isSoloInclude}/time/{date}/{span}/range/{start}/{count}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Project[] GetProjectList(string user, string isSoloInclude, string date, string span, string start, string count);

        #endregion

        #region activity

        [OperationContract(Name = "SaveActivityDirectly")]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/activity/0/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Activity SaveActivity(string user, string category, string name, string description, string[] participants);

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/project/{projectId}/activity/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Activity SaveActivity(string projectId, string user, string category, string name, string description);

        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/activity/{activityId}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Activity UpdateActivity(string activityId, string category, string name, string description);

        [OperationContract]
        [WebGet(UriTemplate = "/activity/{activityId}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Activity GetActivity(string activityId);

        [OperationContract]
        [WebGet(UriTemplate = "/activity/{user}/range/{start}/{count}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Activity[] GetActivityList(string user, string start, string count);

        [OperationContract(Name = "GetActivityList2")]
        [WebGet(UriTemplate = "/activity/{user}/time/{date}/{span}/range/{start}/{count}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Activity[] GetActivityList(string user, string date, string span, string start, string count);

        [OperationContract(Name = "GetActivityList3")]
        [WebGet(UriTemplate = "/activity/{user}/category/{category}/time/{date}/{span}/range/{start}/{count}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Activity[] GetActivityList(string user, string category, string date, string span, string start, string count);

        [OperationContract(Name = "GetActivityListByProject")]
        [WebGet(UriTemplate = "/project/{projectId}/activity/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Activity[] GetActivityList(string projectId);

        #endregion

        #region participant

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/project/{projectId}/participant/{participant}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Participant SaveParticipant(string projectId, string participant);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/project/{projectId}/participant/{participant}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        void DeleteParticipant(string projectId, string participant);

        [OperationContract(Name = "GetParticipantListByProject")]
        [WebGet(UriTemplate = "/project/{projectId}/participant/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Participant[] GetParticipantList(string projectId);

        #endregion

        #region attachment

        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/project/{projectId}/attachment/0/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Attachment SaveAttachment(string projectId, string user, UploadFile uploadFile);

        [OperationContract]
        [WebInvoke(Method = "DELETE",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/project/{projectId}/attachment/{attachment}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        void DeleteAttachment(string projectId, string attachment);

        [OperationContract(Name = "GetAttachmentListByProject")]
        [WebGet(UriTemplate = "/project/{projectId}/attachment/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Attachment[] GetAttachmentList(string projectId);

        #endregion

    }

}
