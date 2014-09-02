using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 可被评论的定义。
    /// </summary>
    public interface ICommentable
    {

        /// <summary>
        /// 评论项目标识。
        /// </summary>
        long TargetId { get; }

        /// <summary>
        /// 评论对象。
        /// </summary>
        CommentTarget Target { get; }

    }

}
