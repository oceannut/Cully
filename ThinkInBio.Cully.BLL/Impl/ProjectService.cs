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

    }

}
