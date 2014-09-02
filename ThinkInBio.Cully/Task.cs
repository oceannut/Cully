using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.CommonApp;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 任务，包括任务的指派人员、截止时间等定义。
    /// </summary>
    public class Task : ICommentable
    {

        #region events

        /// <summary>
        /// 编号变化引起的事件。
        /// </summary>
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
        public bool IsUnderway { get; set; }

        /// <summary>
        /// 提示任务是否已完成。
        /// </summary>
        public bool IsCompleted { get; set; }

        /// <summary>
        /// 指派的人员。
        /// </summary>
        public string Staff { get; set; }

        /// <summary>
        /// 约定任务完成的截止日期。
        /// </summary>
        public DateTime? AppointedDay { get; set; }

        /// <summary>
        /// 任务实际完成时间。
        /// </summary>
        public DateTime? Completion { get; set; }

        /// <summary>
        /// 评论次数。
        /// </summary>
        public int CommentCount { get; set; }

        /// <summary>
        /// 创建时间。
        /// </summary>
        public DateTime Creation { get; set; }

        /// <summary>
        /// 修改时间。
        /// </summary>
        public DateTime Modification { get; set; }

        /// <summary>
        /// 评论任务标识。
        /// </summary>
        public long TargetId
        {
            get { return this.Id; }
        }

        /// <summary>
        /// 评论任务。
        /// </summary>
        public CommentTarget Target
        {
            get { return CommentTarget.Task; }
        }

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
            DateTime? appointedDay, DateTime? completion, int commentCount,
            DateTime creation, DateTime modification)
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
            this.Completion = completion;
            this.CommentCount = commentCount;
            this.Creation = creation;
            this.Modification = modification;
        }

        #endregion

        #region methods

        /// <summary>
        /// 保存并指派任务。
        /// </summary>
        /// <param name="user">创建人。</param>
        /// <param name="staff">指派的人员。</param>
        /// <param name="appointedDay">任务完成期限。</param>
        /// <param name="activityFetch">获取活动的操作定义。</param>
        /// <param name="action">保存操作定义。</param>
        public void Save(string user,
            string staff,
            DateTime? appointedDay,
            Func<long, Activity> activityFetch,
            Action<Task, Activity, BizNotification> action)
        {
            if (string.IsNullOrWhiteSpace(user)
                || string.IsNullOrWhiteSpace(staff)
                || activityFetch == null)
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

            DateTime timeStamp = DateTime.Now;

            bool needUpdateActivity = false;
            Activity activity = activityFetch(this.ActivityId);
            if (activity.IsCompleted)
            {
                activity.IsCompleted = false;
                activity.Update(timeStamp, null);
                needUpdateActivity = true;
            }

            this.Staff = staff;
            this.AppointedDay = appointedDay;
            this.IsUnderway = false;
            this.IsCompleted = false;
            this.Creation = timeStamp;
            this.Modification = timeStamp;

            BizNotification notification = BuildBizNotification(user, this.Staff, "添加了任务", this.Id);

            if (action != null)
            {
                if (needUpdateActivity)
                {
                    action(this, activity, notification);
                }
                else
                {
                    action(this, null, notification);
                }
            }
        }

        /// <summary>
        /// 指派任务。
        /// </summary>
        /// <param name="user">创建人。</param>
        /// <param name="staff">指派的人员。</param>
        /// <param name="appointedDay">任务完成期限。</param>
        /// <param name="action">更新操作定义。</param>
        public void Appoint(string user,
            string staff,
            DateTime? appointedDay,
            Action<Task, BizNotification, BizNotification> action)
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
            BizNotification notification1 = null, notification2 = null;
            if (staff != this.Staff)
            {
                notification1 = BuildBizNotification(user, this.Staff, "取消了任务", this.Id);
                notification2 = BuildBizNotification(user, staff, "添加了任务", this.Id);
                this.Staff = staff;
            }
            else if(appointedDay != this.AppointedDay)
            {
                notification1 = BuildBizNotification(user, this.Staff, "更新了任务的完成期限", this.Id);
                this.AppointedDay = appointedDay;
            }
            
            DateTime timeStamp = DateTime.Now;
            this.Modification = timeStamp;

            if (action != null)
            {
                action(this, notification1, notification2);
            }
        }

        /// <summary>
        /// 启动执行任务。
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
        /// 暂停执行任务。
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
            Action<Task, Activity> action)
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
            Action<Task, Activity> action)
        {
            if (this.Id == 0 || this.ActivityId == 0)
            {
                throw new InvalidOperationException();
            }
            if (activity == null || this.ActivityId != activity.Id)
            {
                throw new ArgumentException("activity");
            }
            DateTime timeStamp = DateTime.Now;
            this.IsCompleted = true;
            this.Completion = timeStamp;
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
                activity.Update(timeStamp, null);
            }
            if (action != null)
            {
                if (allOtherTaskCompleted)
                {
                    action(this, activity);
                }
                else
                {
                    action(this, null);
                }
            }
        }

        /// <summary>
        /// 恢复任务。
        /// </summary>
        /// <param name="activityFetch">获取活动的操作定义。</param>
        /// <param name="action">更新操作定义。</param>
        public void Resume(Func<long, Activity> activityFetch,
            Action<Task, Activity> action)
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
            Action<Task, Activity> action)
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
            this.Completion = null;
            if (this.IsUnderway)
            {
                this.IsUnderway = false;
            }
            Update(null);
            bool updateActivity = false;
            if (activity.IsCompleted)
            {
                activity.IsCompleted = false;
                activity.Update(DateTime.Now, null);
                updateActivity = true;
            }
            if (action != null)
            {
                if (updateActivity)
                {
                    action(this, activity);
                }
                else
                {
                    action(this, null);
                }
            }
        }

        /// <summary>
        /// 更新任务。
        /// </summary>
        /// <param name="action">更新操作定义。</param>
        public void Update(Action<Task> action)
        {
            Update(DateTime.Now, action);
        }

        /// <summary>
        /// 更新任务。
        /// </summary>
        /// <param name="timeStamp">时间戳。</param>
        /// <param name="action">更新操作定义。</param>
        public void Update(DateTime timeStamp, Action<Task> action)
        {
            if (this.Id == 0 || this.ActivityId == 0)
            {
                throw new InvalidOperationException();
            }
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
            Action<Task, Activity, BizNotification> action)
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
            Action<Task, Activity, BizNotification> action)
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
            bool needUpdateActivity = false;
            if (allOtherTaskCompleted && !activity.IsCompleted)
            {
                activity.IsCompleted = allOtherTaskCompleted;
                activity.Update(DateTime.Now, null);
                needUpdateActivity = true;
            }

            BizNotification notification = BuildBizNotification(activity.Creator, this.Staff, "删除了任务", 0);

            if (action != null)
            {
                if (needUpdateActivity)
                {
                    action(this, activity, notification);
                }
                else
                {
                    action(this, null, notification);
                }
            }
        }

        /// <summary>
        /// 添加评论。
        /// </summary>
        /// <param name="observers">要通知的人员集合。</param>
        /// <param name="user">评论人。</param>
        /// <param name="content">评论内容。</param>
        /// <param name="action">添加评论操作定义。</param>
        /// <returns>返回评论信息。</returns>
        public Comment AddRemark(ICollection<string> observers,
            string user, string content,
            Action<Task, Comment, ICollection<BizNotification>> action)
        {
            if (string.IsNullOrWhiteSpace(content)
                && string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException();
            }
            if (this.Id == 0)
            {
                throw new InvalidOperationException();
            }

            DateTime timeStamp = DateTime.Now;
            Comment comment = new Comment(content, user);
            ICollection<BizNotification> notificationList = comment.Save(this, observers, timeStamp, null);

            this.CommentCount++;
            this.Update(null);

            if (action != null)
            {
                action(this, comment, notificationList);
            }

            return comment;
        }

        /// <summary>
        /// 删除评论。
        /// </summary>
        /// <param name="observers">要通知的人员集合。</param>
        /// <param name="comment">要删除的评论。</param>
        /// <param name="action">删除评论操作定义。</param>
        public void RemoveRemark(ICollection<string> observers,
            Comment comment,
            Action<Task, Comment, ICollection<BizNotification>> action)
        {
            if (comment == null)
            {
                throw new ArgumentNullException();
            }
            if (this.Id == 0)
            {
                throw new InvalidOperationException();
            }

            DateTime now = DateTime.Now;
            ICollection<BizNotification> notificationList = comment.Delete(observers, now, null);

            this.CommentCount--;
            this.Update(null);

            if (action != null)
            {
                action(this, comment, notificationList);
            }
        }

        private BizNotification BuildBizNotification(string sender, string receiver, string contentPrefix, long id)
        {
            BizNotification notification = null;
            if (sender != receiver)
            {
                //只有发送人和接收人不是同一人，才创建通知。
                notification = new BizNotification(sender, receiver);
                notification.Content = string.Format("[{0}]: {1}", contentPrefix,
                            this.Content.Length <= 120 ? this.Content : string.Format("{0}...", this.Content.Substring(0, 120)));
                notification.Resource = "task";
                if (this.Id == 0)
                {
                    this.IdChanged += (e) =>
                    {
                        notification.ResourceId = e.ToString();
                    };
                }
                else
                {
                    notification.ResourceId = id.ToString();
                }
                notification.Send(null);
            }
            return notification;
        }

        #endregion

    }

}
