using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Cully;

namespace ThinkInBio.Cully.BLL
{

    public interface ITeamService
    {

        void SaveProject(Activity activity,
            Project project,
            ICollection<Participant> participants);

        void SaveActivity(Activity activity, 
            Project project, 
            ICollection<Participant> participants);

    }

}
