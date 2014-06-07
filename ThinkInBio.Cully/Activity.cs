using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 活动。
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
        public long ProjectId { get; set; }

        /// <summary>
        /// 提示活动是否已完成。
        /// </summary>
        public bool IsCompleted { get; set; }

        /// <summary>
        /// 创建时间。
        /// </summary>
        public DateTime Creation { get; set; }

        /// <summary>
        /// 修改时间。
        /// </summary>
        public DateTime Modification { get; set; }

        #endregion

        #region constructors

        /// <summary>
        /// 构建一个活动。
        /// </summary>
        public Activity() { }

        /// <summary>
        /// 构建一个活动。
        /// </summary>
        /// <param name="project">项目。</param>
        public Activity(Project project)
        {
            if (project == null)
            {
                throw new ArgumentNullException();
            }
            if (project.Id > 0)
            {
                this.ProjectId = project.Id;
            }
            else
            {
                project.IdChanged += new Action<long>(ProjectIdChanged);
            }
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
            Update(action);
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
            Update(action);
        }

        /// <summary>
        /// 保存活动。
        /// </summary>
        /// <param name="action">保存操作定义。</param>
        public void Save(Action<Activity> action)
        {
            if (this.ProjectId == 0)
            {
                throw new InvalidOperationException();
            }

            DateTime timeStamp = DateTime.Now;
            _Save(timeStamp);

            if (action != null)
            {
                action(this);
            }
        }

        /// <summary>
        /// 保存活动，用于直接创建活动，同时创建缺省的项目。
        /// </summary>
        /// <param name="participants">项目的参与人。</param>
        /// <param name="action">保存操作定义。</param>
        public void Save(string user,
            ICollection<string> participants, 
            Action<Activity, Project, ICollection<Participant>> action)
        {
            DateTime timeStamp = DateTime.Now;
            _Save(timeStamp);

            Project project = new Project();
            project.IdChanged += new Action<long>(ProjectIdChanged);
            project.Name = this.Name;
            project.Description = this.Description;
            project.IsSolo = true;
            project.Creator = user;
            IList<Participant> participantList = project.Save(participants, null);

            if (action != null)
            {
                action(this, project, participantList);
            }
        }

        /// <summary>
        /// 更新活动。
        /// </summary>
        /// <param name="action">更新操作定义。</param>
        public void Update(Action<Activity> action)
        {
            if (this.Id == 0)
            {
                throw new InvalidOperationException();
            }
            DateTime timeStamp = DateTime.Now;
            this.Modification = timeStamp;
            if (action != null)
            {
                action(this);
            }
        }

        /// <summary>
        /// 删除活动。
        /// </summary>
        /// <param name="tasksFetch">获取指定活动的任务集合的操作定义。</param>
        /// <param name="action">删除操作定义。</param>
        public void Delete(Func<long, ICollection<Task>> tasksFetch,
            Action<Activity, ICollection<Task>> action)
        {
            if (this.Id == 0)
            {
                throw new InvalidOperationException();
            }
            if (tasksFetch == null)
            {
                throw new ArgumentException();
            }
            ICollection<Task> tasks = tasksFetch(this.Id);
            Delete(tasks, action);
        }

        /// <summary>
        /// 删除活动。
        /// </summary>
        /// <param name="tasks">本活动的任务集合。</param>
        /// <param name="action">删除操作定义。</param>
        public void Delete(ICollection<Task> tasks,
            Action<Activity, ICollection<Task>> action)
        {
            if (this.Id == 0)
            {
                throw new InvalidOperationException();
            }
            if (tasks == null)
            {
                throw new ArgumentException();
            }
            foreach (Task task in tasks)
            {
                if (this.Id != task.ActivityId)
                {
                    throw new InvalidOperationException("tasks");
                }
            }
            if (action != null)
            {
                action(this, tasks);
            }
        }

        private void _Save(DateTime timeStamp)
        {
            this.Creation = timeStamp;
            this.Modification = timeStamp;
        }

        private void ProjectIdChanged(long id)
        {
            this.ProjectId = id;
        }

        #endregion

    }
}
