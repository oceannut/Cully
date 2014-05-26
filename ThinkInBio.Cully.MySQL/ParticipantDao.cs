using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Common.Data;
using ThinkInBio.Cully;
using ThinkInBio.Cully.DAL;
using ThinkInBio.MySQL;

namespace ThinkInBio.Cully.MySQL
{
    public class ParticipantDao : GenericDao<Participant>, IParticipantDao
    {

        private string dataSource;

        public ParticipantDao(string dataSource)
        {
            if (string.IsNullOrWhiteSpace(dataSource))
            {
                throw new ArgumentNullException();
            }
            this.dataSource = dataSource;
        }

        public override bool Save(Participant entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException();
            }
            return DbTemplate.Save(dataSource,
                (command) =>
                {
                    command.CommandText = @"insert into cyParticipant (id,projectId,staff,creation) 
                                                values (NULL,@projectId,@staff,@creation)";
                    command.Parameters.Add(DbFactory.CreateParameter("projectId", entity.ProjectId));
                    command.Parameters.Add(DbFactory.CreateParameter("staff", entity.Staff));
                    command.Parameters.Add(DbFactory.CreateParameter("creation", entity.Creation));
                },
                (id) =>
                {
                    entity.Id = id;
                });
        }

        public override void Save(ICollection<Participant> col)
        {
            if (col == null || col.Count == 0)
            {
                throw new ArgumentNullException();
            }
            DbTemplate.Save(dataSource,
                (command) =>
                {
                    StringBuilder buffer = new StringBuilder();
                    buffer.Append("insert into cyParticipant (id,projectId,staff,creation) values ");
                    for (int i = 0; i < col.Count; i++)
                    {
                        Participant participant = col.ElementAt(i);
                        buffer.Append("(NULL,")
                            .Append("@projectId").Append(i).Append(",")
                            .Append("@staff").Append(i).Append(",")
                            .Append("@creation").Append(i).Append("),");
                        command.Parameters.Add(DbFactory.CreateParameter(string.Format("projectId{0}", i), participant.ProjectId));
                        command.Parameters.Add(DbFactory.CreateParameter(string.Format("staff{0}", i), participant.Staff));
                        command.Parameters.Add(DbFactory.CreateParameter(string.Format("creation{0}", i), participant.Creation));
                    }
                    buffer.Length = buffer.Length - 1;
                    command.CommandText = buffer.ToString();
                });
        }

        public override bool Delete(Participant entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"delete from cyParticipant 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public IList<Participant> GetList(long projectId)
        {
            return DbTemplate.GetList<Participant>(dataSource,
                (command) =>
                {
                    command.CommandText = @"select t.id,t.projectId,t.staff,t.creation from cyParticipant t 
                                                where t.projectId=@projectId";
                    command.Parameters.Add(DbFactory.CreateParameter("projectId", projectId));
                },
                (reader) =>
                {
                    Participant entity = new Participant();
                    entity.Id = reader.GetInt64(0);
                    entity.ProjectId = reader.GetInt64(1);
                    entity.Staff = reader.GetString(2);
                    entity.Creation = reader.GetDateTime(3);
                    return entity;
                });
        }

    }
}
