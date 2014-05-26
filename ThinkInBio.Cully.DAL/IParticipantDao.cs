using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Common.Data;
using ThinkInBio.Cully;

namespace ThinkInBio.Cully.DAL
{
    public interface IParticipantDao : IDao<Participant>
    {

        IList<Participant> GetList(long projectId);

    }
}
