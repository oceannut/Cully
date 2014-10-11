using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.CommonApp;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 项目附件。
    /// </summary>
    public class Attachment : ICommentable
    {

        /// <summary>
        /// 编号。
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// 项目编号。
        /// </summary>
        public long ProjectId { get; set; }

        /// <summary>
        /// 显示文件名。
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// 文件路径。
        /// </summary>
        public string Path { get; set; }

        /// <summary>
        /// 评论次数。
        /// </summary>
        public int CommentCount { get; set; }

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

        public long TargetId
        {
            get { return this.Id; }
        }

        public CommentTarget Target
        {
            get { return CommentTarget.ProjectAttachment; }
        }

        public void Save(Action<Attachment> action)
        {
            Save(DateTime.Now, action);
        }

        public void Save(DateTime timeStamp,
            Action<Attachment> action)
        {
            if (this.ProjectId == 0 
                || string.IsNullOrWhiteSpace(this.Title)
                || string.IsNullOrWhiteSpace(this.Path))
            {
                throw new InvalidOperationException();
            }

            this.Creation = timeStamp;
            this.Modification = timeStamp;

            if (action != null)
            {
                action(this);
            }
        }

        /// <summary>
        /// 添加评论。
        /// </summary>
        /// <param name="user">评论人。</param>
        /// <param name="content">评论内容。</param>
        /// <param name="action">评论操作定义。</param>
        /// <returns>返回评论信息。</returns>
        public Comment AddRemark(string user, string content,
            Action<Attachment, Comment, ICollection<BizNotification>> action)
        {
            if (string.IsNullOrWhiteSpace(content)
                && string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException();
            }
            if (this.Id == 0)
            {
                throw new ArgumentNullException();
            }

            DateTime now = DateTime.Now;
            Comment comment = new Comment(content, user);
            ICollection<BizNotification> notificationList = comment.Save(this, new string[] { this.Creator }, now, null);

            this.CommentCount++;
            this.Modification = now;

            if (action != null)
            {
                action(this, comment, notificationList);
            }

            return comment;
        }

        /// <summary>
        /// 删除评论。
        /// </summary>
        /// <param name="comment">要删除的评论。</param>
        /// <param name="action">删除评论操作定义。</param>
        public void RemoveRemark(Comment comment,
            Action<Attachment, Comment, ICollection<BizNotification>> action)
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
            ICollection<BizNotification> notificationList = comment.Delete(new string[] { this.Creator }, now, null);

            this.CommentCount--;
            this.Modification = now;

            if (action != null)
            {
                action(this, comment, notificationList);
            }
        }

    }

}
