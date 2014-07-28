using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.CommonApp;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 工作记录。
    /// </summary>
    public class Log : ICommentable
    {

        #region properties

        /// <summary>
        /// 编号。
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        /// 标题。
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// 内容。
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 分类。
        /// </summary>
        public string Category { get; set; }

        /// <summary>
        /// 起始时间。
        /// </summary>
        public DateTime StartTime { get; set; }

        /// <summary>
        /// 截止时间。
        /// </summary>
        public DateTime? EndTime { get; set; }

        /// <summary>
        /// 标签。
        /// </summary>
        public string Tags { get; set; }

        /// <summary>
        /// 评论次数。
        /// </summary>
        public int CommentCount { get; set; }

        /// <summary>
        /// 附件。
        /// </summary>
        public IList<string> Attachments { get; set; }

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
            get { return CommentTarget.Log; }
        }

        #endregion

        #region constructors

        /// <summary>
        /// 
        /// </summary>
        public Log()
        {
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="timeStamp"></param>
        /// <param name="content"></param>
        /// <param name="user"></param>
        public Log(DateTime timeStamp, string content, string user)
        {
            this.StartTime = timeStamp;
            this.Content = content;
            this.Creator = user;
        }

        #endregion

        #region methods

        /// <summary>
        /// 
        /// </summary>
        /// <param name="action"></param>
        public void Save(Action<Log> action)
        {
            JustTimeSpan();
            DateTime now = DateTime.Now;
            this.Creation = now;
            this.Modification = now;
            if (action != null)
            {
                action(this);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="action"></param>
        public void Update(Action<Log> action)
        {
            JustTimeSpan();
            DateTime now = DateTime.Now;
            this.Modification = now;
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
            Action<Log, Comment, ICollection<BizNotification>> action)
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
            Action<Log, Comment, ICollection<BizNotification>> action)
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="tag"></param>
        public void AddTag(string tag)
        {
            if (string.IsNullOrWhiteSpace(tag))
            {
                throw new ArgumentNullException();
            }

            if (this.Tags == null)
            {
                this.Tags = string.Empty;
            }
            if (this.Tags == string.Empty)
            {
                this.Tags = tag;
            }
            else
            {
                string[] tagArray = this.Tags.Split(',');
                if (!tagArray.Contains(tag))
                {
                    this.Tags = string.Join(",", tagArray.Concat(new string[] { tag }));
                }
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="tags"></param>
        public void AddTag(ICollection<string> tags)
        {
            if (tags == null)
            {
                throw new ArgumentNullException();
            }

            var tagList = tags.Distinct();
            if (tagList.Count() > 0)
            {
                if (this.Tags == null)
                {
                    this.Tags = string.Empty;
                }
                if (this.Tags == string.Empty)
                {
                    List<string> col = new List<string>();
                    foreach (string tag in tagList)
                    {
                        if (!string.IsNullOrWhiteSpace(tag))
                        {
                            col.Add(tag);
                        }
                    }
                    this.Tags = string.Join(",", col);
                }
                else
                {
                    string[] tagArray = this.Tags.Split(',');
                    List<string> col = new List<string>();
                    foreach (string tag in tagList)
                    {
                        if (!string.IsNullOrWhiteSpace(tag) && !tagArray.Contains(tag))
                        {
                            col.Add(tag);
                        }
                    }
                    this.Tags = string.Join(",", tagArray.Concat(col));
                }
            }
        }

        private void JustTimeSpan()
        {
            if (this.StartTime != DateTime.MinValue
                && this.EndTime.HasValue
                && this.StartTime >= this.EndTime.Value)
            {
                throw new InvalidOperationException();
            }
        }

        #endregion

    }
}
