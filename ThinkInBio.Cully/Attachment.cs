using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 项目附件。
    /// </summary>
    public class Attachment
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
        /// 创建时间。
        /// </summary>
        public DateTime Creation { get; set; }

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

            if (action != null)
            {
                action(this);
            }
        }

    }

}
