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
    /// 定义了任务相关的服务接口。
    /// </summary>
    [ServiceContract]
    public interface ITaskWcfService
    {

        /// <summary>
        /// 保存任务。
        /// </summary>
        /// <param name="user">创建人。</param>
        /// <param name="activityId">关联的活动标识。</param>
        /// <param name="content">任务内容。</param>
        /// <param name="staff">任务的执行人员。</param>
        /// <param name="appointedDay">限期。</param>
        /// <returns>返回任务。</returns>
        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/task/{activityId}/0/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Task SaveTask(string user, string activityId, string content, string staff, string appointedDay);

        /// <summary>
        /// 更新任务。
        /// </summary>
        /// <param name="user">创建人。</param>
        /// <param name="id">任务标识。</param>
        /// <param name="content">任务内容。</param>
        /// <param name="staff">任务的执行人员。</param>
        /// <param name="appointedDay">限期。</param>
        /// <returns>返回任务。</returns>
        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/task/0/{id}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Task UpdateTask(string user, string id, string content, string staff, string appointedDay);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="id"></param>
        /// <param name="isUnderway"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/task/0/{id}/isUnderway/{isUnderway}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Task UpdateTask4IsUnderway(string user, string id, string isUnderway);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="id"></param>
        /// <param name="isCompleted"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "PUT",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/task/0/{id}/isCompleted/{isCompleted}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Task UpdateTask4IsCompleted(string user, string id, string isCompleted);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="id"></param>
        [OperationContract]
        [WebInvoke(Method = "DELETE",
            UriTemplate = "/{user}/task/0/{id}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        void DeleteTask(string user, string id);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [OperationContract]
        [WebGet(UriTemplate = "/{user}/task/0/{id}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Task GetTask(string user, string id);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="activityId"></param>
        /// <returns></returns>
        [OperationContract]
        [WebGet(UriTemplate = "/{user}/task/{activityId}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Task[] GetTaskList(string user, string activityId);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="id"></param>
        /// <param name="content"></param>
        /// <param name="observers"></param>
        /// <returns></returns>
        [OperationContract]
        [WebInvoke(Method = "POST",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/task/0/{id}/comment/0/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Comment SaveComment(string user, string id, string content, string[] observers);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="id"></param>
        /// <param name="commentId"></param>
        /// <param name="observers"></param>
        [OperationContract]
        [WebInvoke(Method = "DELETE",
            BodyStyle = WebMessageBodyStyle.WrappedRequest,
            UriTemplate = "/{user}/task/0/{id}/comment/{commentId}/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        void DeleteComment(string user, string id, string commentId, string[] observers);

    }

}
