using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Cully;
using ThinkInBio.Cully.DAL;

namespace ThinkInBio.Cully.BLL.Impl
{

    public class TeamService : ITeamService
    {

        internal IProjectDao ProjectDao { get; set; }
        internal IActivityDao ActivityDao { get; set; }
        internal IParticipantDao ParticipantDao { get; set; }

        public void SaveProject(Activity activity, Project project, ICollection<Participant> participants)
        {
            throw new NotImplementedException();
        }

        public void SaveActivity(Activity activity, Project project, ICollection<Participant> participants)
        {
            throw new NotImplementedException();
        }

    }

}
