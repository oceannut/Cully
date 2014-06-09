using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.CommonApp;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 任务。
    /// </summary>
    public class Task
    {

        #region events

        internal event Action<long> IdChanged;

        #endregion

        #region properties

        private long id;
        /// <summary>
        /// 编号。
        /// </summary>
        public long Id
        {
            get { return id; }
            set
            {
                if (id != value)
                {
                    id = value;
                    if (IdChanged != null)
                    {
                        IdChanged(id);
                    }
                }
            }
        }

        /// <summary>
        /// 内容。
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 活动编号。
        /// </summary>
        public long ActivityId { get; set; }

        /// <summary>
        /// 提示任务是否正在进行。
        /// </summary>
        public bool IsUnderway { get; internal set; }

        /// <summary>
        /// 提示任务是否已完成。
        /// </summary>
        public bool IsCompleted { get; internal set; }

        /// <summary>
        /// 指派的人员。
        /// </summary>
        public string Staff { get; set; }

        /// <summary>
        /// 约定任务完成的截止日期。
        /// </summary>
        public DateTime? AppointedDay { get; set; }

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
        /// 构建一个任务。
        /// </summary>
        public Task() { }

        /// <summary>
        /// 构建一个任务。
        /// </summary>
        /// <param name="activityId">活动编号。</param>
        public Task(long activityId)
        {
            if (activityId == 0)
            {
                throw new ArgumentException();
            }
            this.ActivityId = activityId;
        }

        /// <summary>
        /// 构建一个任务，一般用于从持久化数据源获取数据来创建任务。
        /// </summary>
        /// <param name="id"></param>
        /// <param name="content"></param>
        /// <param name="activityId"></param>
        /// <param name="isUnderway"></param>
        /// <param name="isCompleted"></param>
        /// <param name="staff"></param>
        /// <param name="appointedDay"></param>
        /// <param name="creation"></param>
        /// <param name="modification"></param>
        public Task(long id, string content, long activityId,
            bool isUnderway, bool isCompleted, string staff, 
            DateTime? appointedDay, DateTime creation, DateTime modification)
        {
            if (id == 0
                || string.IsNullOrWhiteSpace(content)
                || activityId == 0
                || string.IsNullOrWhiteSpace(staff)
                || creation == DateTime.MinValue
                || modification == DateTime.MinValue)
            {
                throw new ArgumentException();
            }

            this.Id = id;
            this.Content = content;
            this.ActivityId = activityId;
            this.IsUnderway = isUnderway;
            this.IsCompleted = isCompleted;
            this.Staff = staff;
            this.AppointedDay = appointedDay;
            this.Creation = creation;
            this.Modification = modification;
        }

        #endregion

        #region methods

        /// <summary>
        /// 保存任务。
        /// </summary>
        /// <param name="staff">指派的人员。</param>
        /// <param name="appointedDay">任务完成截止时间。</param>
        /// <param name="action">保存操作定义。</param>
        public void Save(string user,
            string staff,
            DateTime? appointedDay,
            Action<Task, BizNotification> action)
        {
            if (string.IsNullOrWhiteSpace(user)
                || string.IsNullOrWhiteSpace(staff))
            {
                throw new ArgumentNullException();
            }
            if (string.IsNullOrWhiteSpace(this.Content))
            {
                throw new InvalidOperationException("Content");
            }
            if (this.ActivityId == 0)
            {
                throw new InvalidOperationException("ActivityId");
            }
            this.IsUnderway = false;
            this.IsCompleted = false;
            this.Staff = staff;
            this.AppointedDay = appointedDay;
            DateTime timeStamp = DateTime.Now;
            this.Creation = timeStamp;
            this.Modification = timeStamp;

            BizNotification notification = BuildBizNotification(user, this.Staff);

            if (action != null)
            {
                action(this, notification);
            }
        }

        /// <summary>
        /// 重新指派任务。
        /// </summary>
        /// <param name="staff">指派的人员。</param>
        /// <param name="appointedDay">任务完成截止时间。</param>
        /// <param name="action">更新操作定义。</param>
        public void Appoint(string user,
            string staff, 
            DateTime? appointedDay,
            Action<Task, BizNotification> action)
        {
            if (string.IsNullOrWhiteSpace(user)
                || string.IsNullOrWhiteSpace(staff))
            {
                throw new ArgumentNullException();
            }
            if (this.Id == 0 || this.ActivityId == 0)
            {
                throw new InvalidOperationException();
            }
            this.Staff = staff;
            this.AppointedDay = appointedDay;
            DateTime timeStamp = DateTime.Now;
            this.Modification = timeStamp;

            BizNotification notification = BuildBizNotification(user, this.Staff);

            if (action != null)
            {
                action(this, notification);
            }
        }

        /// <summary>
        /// 启动任务。
        /// </summary>
        /// <param name="action">更新操作定义。</param>
        public void Activate(Action<Task> action)
        {
            if (this.Id == 0 || this.ActivityId == 0)
            {
                throw new InvalidOperationException();
            }
            if (this.IsCompleted)
            {
                throw new InvalidOperationException("IsCompleted");
            }
            this.IsUnderway = true;
            Update(action);
        }

        /// <summary>
        /// 暂停任务。
        /// </summary>
        /// <param name="action">更新操作定义。</param>
        public void Inactivate(Action<Task> action)
        {
            if (this.Id == 0 || this.ActivityId == 0)
            {
                throw new InvalidOperationException();
            }
            if (this.IsCompleted)
            {
                throw new InvalidOperationException("IsCompleted");
            }
            this.IsUnderway = false;
            Update(action);
        }

        /// <summary>
        /// 完成任务。
        /// </summary>
        /// <param name="activityFetch">获取活动的操作定义。</param>
        /// <param name="tasksFetch">获取指定活动的任务集合的操作定义。</param>
        /// <param name="action">更新操作定义。</param>
        public void Complete(Func<long, Activity> activityFetch,
            Func<long, ICollection<Task>> tasksFetch,
            Action<Activity, Task> action)
        {
            if (this.Id == 0 || this.ActivityId == 0)
            {
                throw new InvalidOperationException();
            }
            if (activityFetch == null || tasksFetch == null)
            {
                throw new ArgumentException();
            }
            Activity activity = activityFetch(this.ActivityId);
            ICollection<Task> tasks = tasksFetch(this.ActivityId);
            Complete(activity, tasks, action);
        }

        /// <summary>
        /// 完成任务。
        /// </summary>
        /// <param name="activity">所属的活动。</param>
        /// <param name="tasks">与本任务同属一个活动的任务集合。</param>
        /// <param name="action">更新操作定义。</param>
        public void Complete(Activity activity, 
            ICollection<Task> tasks, 
            Action<Activity, Task> action)
        {
            if (this.Id == 0 || this.ActivityId == 0)
            {
                throw new InvalidOperationException();
            }
            if (activity == null || this.ActivityId != activity.Id)
            {
                throw new ArgumentException("activity");
            }
            this.IsCompleted = true;
            if (this.IsUnderway)
            {
                this.IsUnderway = false;
            }
            Update(null);

            bool allOtherTaskCompleted = false;
            if (tasks != null && tasks.Count > 0)
            {
                allOtherTaskCompleted = tasks.All((e) =>
                {
                    if (this.ActivityId != e.ActivityId)
                    {
                        throw new ArgumentException("tasks");
                    }
                    if (e.Id != this.Id)
                    {
                        return e.IsCompleted;
                    }
                    else
                    {
                        return true;
                    }
                });
            }
            if (allOtherTaskCompleted)
            {
                activity.IsCompleted = allOtherTaskCompleted;
            }
            if (action != null)
            {
                action(activity, this);
            }
        }

        /// <summary>
        /// 恢复任务。
        /// </summary>
        /// <param name="activityFetch">获取活动的操作定义。</param>
        /// <param name="action">更新操作定义。</param>
        public void Resume(Func<long, Activity> activityFetch, 
            Action<Activity, Task> action)
        {
            if (this.Id == 0 || this.ActivityId == 0)
            {
                throw new InvalidOperationException();
            }
            if (activityFetch == null)
            {
                throw new ArgumentException();
            }
            Activity activity = activityFetch(this.ActivityId);
            Resume(activity, action);
        }

        /// <summary>
        /// 恢复任务。
        /// </summary>
        /// <param name="activity">所属的活动。</param>
        /// <param name="action">更新操作定义。</param>
        public void Resume(Activity activity, 
            Action<Activity, Task> action)
        {
            if (this.Id == 0 || this.ActivityId == 0)
            {
                throw new InvalidOperationException();
            }
            if (activity == null || this.ActivityId != activity.Id)
            {
                throw new ArgumentException("activity");
            }
            this.IsCompleted = false;
            if (this.IsUnderway)
            {
                this.IsUnderway = false;
            }
            Update(null);
            activity.IsCompleted = false;
            if (action != null)
            {
                action(activity, this);
            }
        }

        /// <summary>
        /// 更新任务。
        /// </summary>
        /// <param name="action">更新操作定义。</param>
        public void Update(Action<Task> action)
        {
            if (this.Id == 0 || this.ActivityId == 0)
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
        /// 删除任务。
        /// </summary>
        /// <param name="activityFetch">获取活动的操作定义。</param>
        /// <param name="tasksFetch">获取指定活动的任务集合的操作定义。</param>
        /// <param name="action">删除操作定义。</param>
        public void Delete(Func<long, Activity> activityFetch,
            Func<long, ICollection<Task>> tasksFetch,
            Action<Activity, Task> action)
        {
            if (this.Id == 0 || this.ActivityId == 0)
            {
                throw new InvalidOperationException();
            }
            if (activityFetch == null || tasksFetch == null)
            {
                throw new ArgumentException();
            }
            Activity activity = activityFetch(this.ActivityId);
            ICollection<Task> tasks = tasksFetch(this.ActivityId);
            Delete(activity, tasks, action);
        }

        /// <summary>
        /// 删除任务。
        /// </summary>
        /// <param name="activity">所属的活动。</param>
        /// <param name="tasks">与本任务同属一个活动的任务集合。</param>
        /// <param name="action">删除操作定义。</param>
        public void Delete(Activity activity,
            ICollection<Task> tasks,
            Action<Activity, Task> action)
        {
            if (this.Id == 0 || this.ActivityId == 0)
            {
                throw new InvalidOperationException();
            }
            if (activity == null || this.ActivityId != activity.Id)
            {
                throw new ArgumentException("activity");
            }

            bool allOtherTaskCompleted = false;
            if (tasks != null && tasks.Count > 0)
            {
                allOtherTaskCompleted = tasks.All((e) =>
                {
                    if (this.ActivityId != e.ActivityId)
                    {
                        throw new ArgumentException("tasks");
                    }
                    if (e.Id != this.Id)
                    {
                        return e.IsCompleted;
                    }
                    else
                    {
                        return true;
                    }
                });
            }
            if (allOtherTaskCompleted)
            {
                activity.IsCompleted = allOtherTaskCompleted;
            }
            if (action != null)
            {
                action(activity, this);
            }
        }

        private BizNotification BuildBizNotification(string sender, string receiver)
        {
            BizNotification notification = null;
            if (sender != receiver)
            {
                //只有发送人和接收人不是同一人，才创建通知。
                notification = new BizNotification(sender, receiver);
                notification.Resource = "task";
                this.IdChanged += (e) =>
                {
                    notification.ResourceId = e.ToString();
                };
                notification.Send(null);
            }
            return notification;
        }

        #endregion

    }

}
