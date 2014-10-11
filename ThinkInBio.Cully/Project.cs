using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.FileTransfer;
using ThinkInBio.CommonApp;

namespace ThinkInBio.Cully
{

    /// <summary>
    /// 项目，包括项目成员，由若干个活动组成。
    /// </summary>
    public class Project
    {

        #region events

        /// <summary>
        /// 编号变化引发的事件。
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

            DateTime timeStamp = DateTime.Now;
            List<Participant> participantList = BuildParticipants(timeStamp, participants);

            this.Creation = timeStamp;
            this.Modification = timeStamp;

            if (action != null)
            {
                action(this, participantList);
            }

            return participantList;
        }

        /// <summary>
        /// 保存项目。
        /// </summary>
        /// <param name="participants">参与人。</param>
        /// <param name="firstActivity">第一个缺省同名的活动。</param>
        /// <param name="action">保存操作定义。</param>
        /// <returns>返回保存完毕的参与人信息。</returns>
        public IList<Participant> Save(ICollection<string> participants, Activity firstActivity,
            Action<Project, ICollection<Participant>, Activity> action)
        {
            if (!IsRequireFieldSatisfied())
            {
                throw new InvalidOperationException();
            }

            DateTime timeStamp = DateTime.Now;
            List<Participant> participantList = BuildParticipants(timeStamp, participants);

            if (firstActivity != null)
            {
                this.IdChanged += (e) =>
                {
                    firstActivity.ProjectId = e;
                };
                firstActivity.Creation = timeStamp;
                firstActivity.Modification = timeStamp;
            }

            this.Creation = timeStamp;
            this.Modification = timeStamp;

            if (action != null)
            {
                action(this, participantList, firstActivity);
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

        /// <summary>
        /// 添加成员。
        /// </summary>
        /// <param name="participant">成员用户名。</param>
        /// <param name="participantFactory">获取本项目成员列表的操作定义。</param>
        /// <param name="action">添加成员操作定义。</param>
        /// <returns>返回项目添加的成员信息。</returns>
        public Participant AddParticipant(string participant,
            Func<long, IEnumerable<Participant>> participantFactory,
            Action<Participant> action)
        {
            if (this.Id == 0)
            {
                throw new InvalidOperationException();
            }
            if (!IsRequireFieldSatisfied())
            {
                throw new InvalidOperationException();
            }

            Participant p = null;
            IEnumerable<Participant> participants = participantFactory == null ? null : participantFactory(this.Id);
            if (participants == null || participants.Count() == 0
                || !participants.Any((e) =>
                    {
                        if (this.Id != e.ProjectId)
                        {
                            throw new InvalidOperationException();
                        }
                        return participant == e.Staff;
                    }))
            {
                p = new Participant(this);
                p.Staff = participant;
                p.Creation = DateTime.Now;
            }
            if (action != null)
            {
                action(p);
            }
            return p;
        }

        /// <summary>
        /// 删除成员。
        /// </summary>
        /// <param name="participant">成员用户名。</param>
        /// <param name="participantFactory">获取本项目成员列表的操作定义。</param>
        /// <param name="action">删除成员操作定义。</param>
        /// <returns>返回项目删除的成员信息。</returns>
        public Participant RemoveParticipant(string participant,
            Func<long, IEnumerable<Participant>> participantFactory,
            Action<Participant> action)
        {
            if (this.Id == 0)
            {
                throw new InvalidOperationException();
            }
            if (!IsRequireFieldSatisfied())
            {
                throw new InvalidOperationException();
            }

            Participant p = null;
            IEnumerable<Participant> participants = participantFactory == null ? null : participantFactory(this.Id);
            if (participants != null && participants.Count() > 0)
            {
                p = participants.SingleOrDefault((e) =>
                    {
                        if (this.Id != e.ProjectId)
                        {
                            throw new InvalidOperationException();
                        }
                        return participant == e.Staff;
                    });
            }
            if (p != null && action != null)
            {
                action(p);
            }
            return p;
        }

        public Attachment AddAttachment(string user, UploadFile uploadFile,
            Action<Attachment, FileTransferLog> action)
        {
            if (string.IsNullOrWhiteSpace(user)
                || uploadFile == null)
            {
                throw new ArgumentException();
            }
            if (this.Id == 0)
            {
                throw new InvalidOperationException();
            }

            FileTransferLog log = new FileTransferLog(user,
                            uploadFile.Name, uploadFile.Size, uploadFile.Path,
                            uploadFile.TimeStamp.HasValue ? uploadFile.TimeStamp.Value : DateTime.Now);
            log.Direction = FileTransferDirection.Upload;

            Attachment attachment = new Attachment();
            attachment.ProjectId = this.Id;
            attachment.Title = uploadFile.Name;
            attachment.Path = uploadFile.Path;
            attachment.Creator = user;
            attachment.Creation = uploadFile.TimeStamp.HasValue ? uploadFile.TimeStamp.Value : DateTime.Now;
            attachment.Modification = attachment.Creation;

            if (action != null)
            {
                action(attachment, log);
            }

            return attachment;
        }

        public void RemoveAttachment(Attachment attachment,
            Func<Attachment, FileTransferLog> logFactory,
            Action<Attachment, FileTransferLog> action)
        {
            if (attachment == null 
                || attachment.Id == 0 
                || string.IsNullOrWhiteSpace(attachment.Path))
            {
                throw new ArgumentException();
            }
            FileTransferLog log = logFactory == null ? null : logFactory(attachment);
            if (log != null)
            {
                log.DeleteFile(null);
            }
            if (action != null)
            {
                action(attachment, log);
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

        private List<Participant> BuildParticipants(DateTime timeStamp, ICollection<string> participants)
        {
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

            List<Participant> participantList = new List<Participant>();
            foreach (string item in templist)
            {
                Participant participant = new Participant(this);
                participant.Staff = item;
                participant.Creation = timeStamp;
                participantList.Add(participant);
            }

            return participantList;
        }

        #endregion

    }

}
