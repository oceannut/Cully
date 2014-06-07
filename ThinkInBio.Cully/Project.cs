using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 项目。
    /// </summary>
    public class Project
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
        /// 名称。
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 描述。
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// 是否是单一活动的项目。
        /// </summary>
        public bool IsSolo { get; set; }

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

        #region methods

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public Activity CreateActivity()
        {
            if (this.Id == 0)
            {
                throw new InvalidOperationException();
            }
            Activity activity = new Activity(this);
            return activity;
        }

        /// <summary>
        /// 保存项目。
        /// </summary>
        /// <param name="action">保存操作定义。</param>
        public void Save(Action<Project, ICollection<Participant>> action)
        {
            Save(null, action);
        }

        /// <summary>
        /// 保存项目。
        /// </summary>
        /// <param name="participants">参与人。</param>
        /// <param name="action">保存操作定义。</param>
        /// <returns>返回保存完毕的参与人信息。</returns>
        public IList<Participant> Save(ICollection<string> participants, 
            Action<Project, ICollection<Participant>> action)
        {
            if (!IsRequireFieldSatisfied())
            {
                throw new InvalidOperationException();
            }

            List<string> templist = new List<string>();
            if (participants != null && participants.Count > 0)
            {
                //过滤掉可能重复的参与人项。
                templist.AddRange(participants.Distinct<string>());
            }
            if (!templist.Contains(this.Creator))
            {
                //项目的创建人缺省即为项目的参与人。
                templist.Add(this.Creator);
            }

            DateTime timeStamp = DateTime.Now;
            List<Participant> participantList = new List<Participant>();
            foreach (string item in templist)
            {
                Participant participant = new Participant(this);
                participant.Staff = item;
                participant.Creation = timeStamp;
                participantList.Add(participant);
            }

            this.Creation = timeStamp;
            this.Modification = timeStamp;

            if (action != null)
            {
                action(this, participantList);
            }

            return participantList;
        }

        /// <summary>
        /// 更新项目。
        /// </summary>
        /// <param name="action">更新操作定义。</param>
        public void Update(Action<Project> action)
        {
            if (this.Id == 0)
            {
                throw new InvalidOperationException();
            }
            if (!IsRequireFieldSatisfied())
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

        public override bool Equals(object obj)
        {
            if (obj == null)
            {
                return false;
            }
            Project target = obj as Project;
            if (target == null)
            {
                return false;
            }
            if (ReferenceEquals(this, target))
            {
                return true;
            }
            if (Id == 0 || target.Id == 0)
            {
                throw new InvalidOperationException();
            }
            return this.Id.Equals(target.Id);
        }

        public override int GetHashCode()
        {
            if (Id == 0)
            {
                return 0;
            }
            return Id.GetHashCode();
        }

        private bool IsRequireFieldSatisfied()
        {
            return !string.IsNullOrWhiteSpace(this.Name) 
                && !string.IsNullOrWhiteSpace(this.Creator);
        }

        #endregion

    }

}
