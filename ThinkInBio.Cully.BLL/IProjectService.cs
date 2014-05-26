using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Cully;

namespace ThinkInBio.Cully.BLL
{

    public interface IProjectService
    {

        void SaveProject(Project project,
            ICollection<Participant> participants);

    }

}
