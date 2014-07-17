using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Web;

using ThinkInBio.Cully;

namespace ThinkInBio.Cully.WSL
{

    /// <summary>
    /// 定义了项目相关的服务接口。
    /// </summary>
    [ServiceContract]
    public interface IProjectWcfService
    {

        /// <summary>
        /// 保存项目。
        /// </summary>
        /// <param name="user">创建人，一般要求为登录验证通过的用户。</param>
        /// <param name="name">项目名称。</param>
        /// <param name="description">项目描述。</param>
        /// <param name="participants">参与人集合。</param>
        /// <returns>返回创建完成的项目信息。</returns>
        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/project/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Project SaveProject(string user, string name, string description, string[] participants);

        /// <summary>
        /// 获取项目。
        /// </summary>
        /// <param name="user">项目参与人，一般要求为登录验证通过的用户。</param>
        /// <param name="projectId">项目编号。</param>
        /// <returns>返回项目。 </returns>
        [OperationContract]
        [WebGet(UriTemplate = "/{user}/project/{projectId}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Project GetProject(string user, string projectId);

        /// <summary>
        /// 获取项目集合，返回与指定参与人相关的项目集合，包括其创建的项目和其被邀请参加的项目。
        /// </summary>
        /// <param name="user">项目参与人，一般要求为登录验证通过的用户。</param>
        /// <returns>返回项目集合。</returns>
        [OperationContract]
        [WebGet(UriTemplate = "/{user}/project/top/{count}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Project[] GetTopProjectList(string user, string count);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="category"></param>
        /// <param name="name"></param>
        /// <param name="description"></param>
        /// <param name="participants"></param>
        /// <returns></returns>
        [OperationContract(Name = "SaveActivityDirectly")]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/project/0/activity/0/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Activity SaveActivity(string user, string category, string name, string description, string[] participants);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="projectId"></param>
        /// <param name="category"></param>
        /// <param name="name"></param>
        /// <param name="description"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/project/{projectId}/activity/0/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Activity SaveActivity(string user, string projectId, string category, string name, string description);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="activityId"></param>
        /// <returns></returns>
        [OperationContract]
        [WebGet(UriTemplate = "/{user}/project/0/activity/{activityId}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Activity GetActivity(string user, string activityId);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="start"></param>
        /// <param name="count"></param>
        /// <returns></returns>
        [OperationContract]
        [WebGet(UriTemplate = "/{user}/project/0/activity/range/{start}/{count}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Activity[] GetActivityList(string user, string start, string count);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="date"></param>
        /// <param name="span"></param>
        /// <param name="start"></param>
        /// <param name="count"></param>
        /// <returns></returns>
        [OperationContract(Name = "GetActivityList2")]
        [WebGet(UriTemplate = "/{user}/project/0/activity/time/{date}/{span}/range/{start}/{count}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Activity[] GetActivityList(string user, string date, string span, string start, string count);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="category"></param>
        /// <param name="date"></param>
        /// <param name="span"></param>
        /// <param name="start"></param>
        /// <param name="count"></param>
        /// <returns></returns>
        [OperationContract(Name = "GetActivityList3")]
        [WebGet(UriTemplate = "/{user}/project/0/activity/category/{category}/time/{date}/{span}/range/{start}/{count}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Activity[] GetActivityList(string user, string category, string date, string span, string start, string count);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="projectId"></param>
        /// <returns></returns>
        [OperationContract(Name = "GetActivityListByProject")]
        [WebGet(UriTemplate = "/{user}/project/{projectId}/activity/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Activity[] GetActivityList(string user, string projectId);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="projectId"></param>
        /// <returns></returns>
        [OperationContract(Name = "GetParticipantListByProject")]
        [WebGet(UriTemplate = "/{user}/project/{projectId}/participant/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Participant[] GetParticipantList(string user, string projectId);

    }

}
