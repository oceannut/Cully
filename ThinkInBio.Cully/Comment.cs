using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.CommonApp;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 评论目标。
    /// </summary>
    public enum CommentTarget
    {
        /// <summary>
        /// 工作记录。
        /// </summary>
        Log,
        /// <summary>
        /// 任务。
        /// </summary>
        Task
    }

    /// <summary>
    /// 评论。
    /// </summary>
    public class Comment
    {

        #region properties

        /// <summary>
        /// 编号。
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// 评论目标。
        /// </summary>
        public CommentTarget Target { get; set; }

        /// <summary>
        /// 目标编号。
        /// </summary>
        public long TargetId { get; set; }

        /// <summary>
        /// 内容。
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 创建人。
        /// </summary>
        public string Creator { get; set; }

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
        /// 构建一个评论。
        /// </summary>
        public Comment() { }

        /// <summary>
        /// 构建一个评论。
        /// </summary>
        /// <param name="content">评论内容。</param>
        /// <param name="creator">创建人。</param>
        public Comment(string content, string creator)
        {
            if (string.IsNullOrWhiteSpace(content)
                && string.IsNullOrWhiteSpace(creator))
            {
                throw new ArgumentNullException();
            }
            this.Content = content;
            this.Creator = creator;
        }

        #endregion

        public ICollection<BizNotification> Save(ICommentable commentable, 
            ICollection<string> observers, 
            DateTime timeStamp, 
            Action<Comment, ICollection<BizNotification>> action)
        {
            if (commentable == null || timeStamp == DateTime.MinValue)
            {
                throw new ArgumentException();
            }
            if (string.IsNullOrWhiteSpace(this.Content)
                || string.IsNullOrWhiteSpace(this.Creator)
                || this.TargetId == 0)
            {
                throw new InvalidOperationException();
            }
            this.Target = commentable.Target;
            this.TargetId = commentable.TargetId;
            this.Creation = timeStamp;
            this.Modification = timeStamp;

            List<BizNotification> notificationList = new List<BizNotification>();
            if (observers != null && observers.Count > 0)
            {  
                foreach (string observer in observers)
                {
                    if (observer != this.Creator)
                    {
                        //只有发送人和接收人不是同一人，才创建通知。
                        BizNotification notification = new BizNotification(this.Creator, observer);
                        notification.Content = this.Content;
                        notification.Resource = commentable.Target.ToString();
                        notification.ResourceId = commentable.TargetId.ToString();
                        notification.Creation = timeStamp;
                        notificationList.Add(notification);
                    }
                }
            }

            if (action != null)
            {
                action(this, notificationList);
            }

            return notificationList;
        }

        public void Update(Action<Comment> action)
        {
            if (this.Id == 0)
            {
                throw new InvalidOperationException();
            }

            DateTime now = DateTime.Now;
            this.Modification = now;
            if (action != null)
            {
                action(this);
            }
        }

    }

}
