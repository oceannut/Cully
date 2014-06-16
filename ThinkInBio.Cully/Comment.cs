using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 评论目标。
    /// </summary>
    public enum CommentTarget
    {
        Log
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
        /// 
        /// </summary>
        public Comment() { }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="content"></param>
        /// <param name="creator"></param>
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
