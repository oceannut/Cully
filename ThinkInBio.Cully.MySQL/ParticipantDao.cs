using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Common.Data;
using ThinkInBio.Cully;
using ThinkInBio.Cully.DAL;

namespace ThinkInBio.Cully.MySQL
{
    public class ParticipantDao : GenericDao<Participant>, IParticipantDao
    {

        public override void Save(Participant entity)
        {
            base.Save(entity);
        }

    }
}
