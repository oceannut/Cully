﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Cully;
using ThinkInBio.Cully.DAL;

namespace ThinkInBio.Cully.BLL.Impl
{

    public class ProjectService : IProjectService
    {

        internal IProjectDao ProjectDao { get; set; }
        internal IActivityDao ActivityDao { get; set; }
        internal IParticipantDao ParticipantDao { get; set; }

        public void SaveProject(Project project,
            ICollection<Participant> participants)
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

        public void SaveActivity(Activity activity)
        {
            if (activity == null)
            {
                throw new ArgumentNullException();
            }
            ActivityDao.Save(activity);
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

        public IList<Participant> GetParticipantList(long projectId)
        {
            if (projectId == 0)
            {
                throw new ArgumentException();
            }

            return ParticipantDao.GetList(projectId);
        }

    }

}
