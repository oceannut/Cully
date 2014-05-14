using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 活动，即可以包含在项目里，也可以单独创建活动。
    /// </summary>
    public class Activity
    {

        #region properties

        /// <summary>
        /// 编号。
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// 名称。
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 描述。
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// 项目编号。
        /// </summary>
        public long ProjectId { get; internal set; }

        /// <summary>
        /// 提示活动是否已完成。
        /// </summary>
        public bool IsCompleted { get; internal set; }

        /// <summary>
        /// 创建时间。
        /// </summary>
        public DateTime Creation { get; internal set; }

        /// <summary>
        /// 修改时间。
        /// </summary>
        public DateTime Modification { get; internal set; }

        #endregion

        #region constructors

        /// <summary>
        /// 构建一个活动。
        /// </summary>
        public Activity() { }

        /// <summary>
        /// 构建一个活动。
        /// </summary>
        /// <param name="projectId">项目编号。</param>
        internal Activity(long projectId)
        {
            if (projectId == 0)
            {
                throw new ArgumentException();
            }
            this.ProjectId = projectId;
        }

        #endregion

        #region methods

        /// <summary>
        /// 创建一个任务。
        /// </summary>
        /// <returns>返回任务。</returns>
        public Task CreateTask()
        {
            if (this.Id == 0)
            {
                throw new InvalidOperationException();
            }
            Task task = new Task(this.Id);
            return task;
        }

        /// <summary>
        /// 把活动移入指定的项目中。
        /// </summary>
        /// <param name="project">项目。</param>
        /// <param name="action">活动更新操作定义。</param>
        public void ImmigrateToProject(Project project, 
            Action<Activity> action)
        {
            if (project == null || project.Id == 0)
            {
                throw new ArgumentException();
            }
            this.ProjectId = project.Id;
            if (action != null)
            {
                action(this);
            }
        }

        /// <summary>
        /// 把活动移出项目。
        /// </summary>
        /// <param name="action">活动更新操作定义。</param>
        public void EmigrateFromProject(Action<Activity> action)
        {
            if (this.ProjectId == 0)
            {
                throw new InvalidOperationException();
            }
            this.ProjectId = 0;
            if (action != null)
            {
                action(this);
            }
        }

        #endregion

    }
}
