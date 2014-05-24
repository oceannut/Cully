using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ThinkInBio.Cully.WSL.Impl
{

    public class TeamWcfService : ITeamWcfService
    {

        public Project SaveProject(string name, string description, string[] staffs)
        {
            throw new NotImplementedException();
        }

        public Activity SaveActivity(string name, string description, string projectId, string[] staffs)
        {
            throw new NotImplementedException();
        }

        public Activity[] GetActivityList(string user, string offset, string len)
        {
            throw new NotImplementedException();
        }

    }

}
