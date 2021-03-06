﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.CommonApp;
using ThinkInBio.CommonApp.BLL;
using ThinkInBio.Cully;
using ThinkInBio.Cully.DAL;

namespace ThinkInBio.Cully.BLL.Impl
{

    public class ProjectService : IProjectService
    {

        internal IProjectDao ProjectDao { get; set; }
        internal IActivityDao ActivityDao { get; set; }
        internal IParticipantDao ParticipantDao { get; set; }
        internal IAttachmentDao AttachmentDao { get; set; }
        internal IFileTransferLogService FileTransferLogService { get; set; }
        internal ICommentDao CommentDao { get; set; }
        internal IBizNotificationService BizNotificationService { get; set; }

        public void SaveProject(Project project,
            ICollection<Participant> participants)
        {
            SaveProject(project, participants, null);
        }

        public void SaveProject(Project project,
            ICollection<Participant> participants,
            Activity firstActivity)
        {
            if (project == null)
            {
                throw new ArgumentNullException();
            }

            ProjectDao.Save(project);
            if (participants != null && participants.Count > 0)
            {
                ParticipantDao.Save(participants);
            }
            if (firstActivity != null)
            {
                ActivityDao.Save(firstActivity);
            }
        }

        public void UpdateProject(Project project)
        {
            if (project == null)
            {
                throw new ArgumentNullException();
            }

            ProjectDao.Update(project);
        }

        public Project GetProject(long projectId)
        {
            if (projectId == 0)
            {
                throw new ArgumentException();
            }

            return ProjectDao.Get(projectId);
        }

        public IList<Project> GetTopProjectList(string user, bool? isSolo, int maxRowsCount)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException();
            }
            DateTime endTime = DateTime.Now;
            DateTime startTime = endTime.AddDays(-30);
            return ProjectDao.GetListByParticipant(user, startTime, endTime, isSolo, false, 0, maxRowsCount);
        }

        public IList<Project> GetProjectList(string user,
            DateTime? startTime, DateTime? endTime,
            bool? isSolo,
            int startRowIndex, int maxRowsCount)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException();
            }
            return ProjectDao.GetListByParticipant(user, startTime, endTime, isSolo, false, 0, maxRowsCount);
        }

        public void SaveActivity(Activity activity,
            Project project,
            bool needUpdate)
        {
            if (activity == null)
            {
                throw new ArgumentNullException();
            }
            ActivityDao.Save(activity);
            if (needUpdate)
            {
                UpdateProject(project);
            }
        }

        public void SaveActivity(Activity activity, 
            Project project, 
            ICollection<Participant> participants)
        {
            if (activity == null)
            {
                throw new ArgumentNullException();
            }

            SaveProject(project, participants);
            ActivityDao.Save(activity);
        }

        public void UpdateActivity(Activity activity)
        {
            if (activity == null)
            {
                throw new ArgumentNullException();
            }
            ActivityDao.Update(activity);
        }

        public Activity GetActivity(long activityId)
        {
            if (activityId == 0)
            {
                throw new ArgumentException();
            }

            return ActivityDao.Get(activityId);
        }

        public IList<Activity> GetActivityList(string user, int startRowIndex, int maxRowsCount)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException();
            }
            return ActivityDao.GetListByParticipant(user, null, null, null, false, startRowIndex, maxRowsCount);
        }

        public IList<Activity> GetActivityList(string user, DateTime? startTime, DateTime? endTime, int startRowIndex, int maxRowsCount)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            if (startTime > endTime)
            {
                throw new ArgumentException("startTime or endTime");
            }
            return ActivityDao.GetListByParticipant(user, null, startTime, endTime, false, startRowIndex, maxRowsCount);
        }

        public IList<Activity> GetActivityList(string user, DateTime? startTime, DateTime? endTime, string category, int startRowIndex, int maxRowsCount)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            if (startTime > endTime)
            {
                throw new ArgumentException("startTime or endTime");
            }
            return ActivityDao.GetListByParticipant(user, category, startTime, endTime, false, startRowIndex, maxRowsCount);
        }

        public IList<Activity> GetActivityList(long projectId)
        {
            if (projectId == 0)
            {
                throw new ArgumentNullException();
            }

            return ActivityDao.GetList(projectId);
        }

        public bool IsAnyActivityExisted(long projectId)
        {
            if (projectId == 0)
            {
                throw new ArgumentNullException();
            }

            return ActivityDao.IsAnyExisted(projectId);
        }

        public void SaveParticipant(Participant participant)
        {
            if (participant == null)
            {
                throw new ArgumentNullException();
            }
            ParticipantDao.Save(participant);
        }

        public void DeleteParticipant(Participant participant)
        {
            if (participant == null)
            {
                throw new ArgumentNullException();
            }
            ParticipantDao.Delete(participant);
        }

        public IList<Participant> GetParticipantList(long projectId)
        {
            if (projectId == 0)
            {
                throw new ArgumentException();
            }

            return ParticipantDao.GetList(projectId);
        }

        public void SaveAttachment(Attachment attachment, FileTransferLog log)
        {
            if (attachment == null)
            {
                throw new ArgumentNullException();
            }
            AttachmentDao.Save(attachment);
            if (log != null)
            {
                FileTransferLogService.SaveFileTransferLog(log);
            }
        }

        public void DeleteAttachment(Attachment attachment, FileTransferLog log)
        {
            if (attachment == null)
            {
                throw new ArgumentNullException();
            }
            AttachmentDao.Delete(attachment);
            if (log != null)
            {
                FileTransferLogService.UpdateFileTransferLog4DeleteFile(log);
            }
        }

        public Attachment GetAttachment(long attachmentId)
        {
            if (attachmentId == 0)
            {
                throw new ArgumentNullException();
            }
            return AttachmentDao.Get(attachmentId);
        }

        public IList<Attachment> GetAttachmentList(long projectId)
        {
            if (projectId == 0)
            {
                throw new ArgumentException();
            }

            return AttachmentDao.GetList(projectId);
        }

        public void SaveAttachmentComment(Attachment attachment, Comment comment, ICollection<BizNotification> notificationList)
        {
            if (attachment == null || comment == null)
            {
                throw new ArgumentNullException();
            }

            AttachmentDao.Update4CommentCount(attachment.Id, attachment.CommentCount);
            CommentDao.Save(comment);
            if (notificationList != null && notificationList.Count > 0)
            {
                BizNotificationService.SaveNotification(notificationList);
            }
        }

        public void DeleteAttachmentComment(Attachment attachment, Comment comment, ICollection<BizNotification> notificationList)
        {
            if (attachment == null || comment == null)
            {
                throw new ArgumentNullException();
            }

            AttachmentDao.Update4CommentCount(attachment.Id, attachment.CommentCount);
            CommentDao.Delete(comment);
            if (notificationList != null && notificationList.Count > 0)
            {
                BizNotificationService.SaveNotification(notificationList);
            }
        }

    }

}
