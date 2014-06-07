using System;
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

        public IList<Project> GetTopProjectList(string user, int maxRowsCount)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException();
            }
            return ProjectDao.GetListByParticipant(user, null, null, false, false, 0, maxRowsCount);
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

        public IList<Activity> GetActivityList(string user, int startRowIndex, int maxRowsCount)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException();
            }
            return ActivityDao.GetListByParticipant(user, null, null, false, startRowIndex, maxRowsCount);
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
