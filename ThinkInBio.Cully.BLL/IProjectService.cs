using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Cully;

namespace ThinkInBio.Cully.BLL
{

    /// <summary>
    /// 定义了与项目相关的系统逻辑。
    /// </summary>
    public interface IProjectService
    {

        /// <summary>
        /// 保存项目。
        /// </summary>
        /// <param name="project">项目。</param>
        /// <param name="participants">参与人。</param>
        void SaveProject(Project project,
            ICollection<Participant> participants);

        /// <summary>
        /// 获取项目。
        /// </summary>
        /// <param name="projectId">项目编号。</param>
        /// <returns>返回项目。</returns>
        Project GetProject(long projectId);

        /// <summary>
        /// 获取与指定参与人相关的最新的项目。
        /// </summary>
        /// <param name="user">参与人。</param>
        /// <param name="maxRowsCount">返回项目的最大个数。</param>
        /// <returns>返回项目集合。</returns>
        IList<Project> GetTopProjectList(string user, int maxRowsCount);

        /// <summary>
        /// 保存活动。
        /// </summary>
        /// <param name="activity">活动。</param>
        void SaveActivity(Activity activity);

        /// <summary>
        /// 保存活动。
        /// </summary>
        /// <param name="activity">活动。</param>
        /// <param name="project">项目。</param>
        /// <param name="participants">参与人。</param>
        void SaveActivity(Activity activity, 
            Project project,
            ICollection<Participant> participants);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="activityId"></param>
        /// <returns></returns>
        Activity GetActivity(long activityId);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="startRowIndex"></param>
        /// <param name="maxRowsCount"></param>
        /// <returns></returns>
        IList<Activity> GetActivityList(string user, int startRowIndex, int maxRowsCount);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        IList<Activity> GetActivityList(long projectId);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        IList<Participant> GetParticipantList(long projectId);

    }

}
