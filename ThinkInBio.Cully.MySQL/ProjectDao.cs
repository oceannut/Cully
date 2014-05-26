using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;

using ThinkInBio.Common.Data;
using ThinkInBio.Cully;
using ThinkInBio.Cully.DAL;
using ThinkInBio.MySQL;

namespace ThinkInBio.Cully.MySQL
{

    public class ProjectDao : GenericDao<Project>, IProjectDao
    {

        private string dataSource;

        public ProjectDao(string dataSource)
        {
            if (string.IsNullOrWhiteSpace(dataSource))
            {
                throw new ArgumentNullException();
            }
            this.dataSource = dataSource;
        }

        public override bool Save(Project entity)
        {
            return DbTemplate.Save(dataSource,
                (command) =>
                {
                    command.CommandText = @"insert into cyProject (id,name,description,creator,creation,modification) 
                                                values (NULL,@name,@description,@creator,@creation,@modification)";
                    command.Parameters.Add(DbFactory.CreateParameter("name", entity.Name));
                    command.Parameters.Add(DbFactory.CreateParameter("description", entity.Description));
                    command.Parameters.Add(DbFactory.CreateParameter("creator", entity.Creator));
                    command.Parameters.Add(DbFactory.CreateParameter("creation", entity.Creation));
                    command.Parameters.Add(DbFactory.CreateParameter("modification", entity.Modification));
                },
                (id) =>
                {
                    entity.Id = id;
                });
        }

        public override bool Update(Project entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"update cyProject 
                                                set name=@name,description=@description,modification=@modification 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("name", entity.Name));
                    command.Parameters.Add(DbFactory.CreateParameter("description", entity.Description));
                    command.Parameters.Add(DbFactory.CreateParameter("modification", entity.Modification));
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public override bool Delete(Project entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"delete from cyProject 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public override Project Get(object id)
        {
            return DbTemplate.Get<Project>(dataSource,
                (command) =>
                {
                    command.CommandText = @"select id,name,description,creator,creation,modification from cyProject 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                },
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        public int GetCount(string creator, DateTime startTime, DateTime endTime)
        {
            List<KeyValuePair<string, object>> parameters = new List<KeyValuePair<string, object>>();
            return DbTemplate.GetCount(dataSource,
                (command) =>
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("select count(t.id) from cyProject t ");
                    BuildSql(sql, parameters, creator, startTime, endTime);
                    command.CommandText = sql.ToString();
                },
                parameters);
        }

        public IList<Project> GetList(string creator, DateTime startTime, DateTime endTime, int startRowIndex, int maxRowsCount)
        {
            List<KeyValuePair<string, object>> parameters = new List<KeyValuePair<string, object>>();
            return DbTemplate.GetList<Project>(dataSource,
                (command) =>
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("select t.id,t.name,t.description,t.creator,t.creation,t.modification from cyProject t ");
                    BuildSql(sql, parameters, creator, startTime, endTime);
                    sql.Append(" order by t.modification desc ");
                    if (maxRowsCount < int.MaxValue)
                    {
                        sql.Append(" limit ").Append(startRowIndex).Append(",").Append(startRowIndex + maxRowsCount);
                    }
                    command.CommandText = sql.ToString();
                },
                parameters,
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        public int GetCountByParticipant(string participant, DateTime startTime, DateTime endTime)
        {
            List<KeyValuePair<string, object>> parameters = new List<KeyValuePair<string, object>>();
            return DbTemplate.GetCount(dataSource,
                (command) =>
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("select count(t.id) from cyProject t ");
                    if (!string.IsNullOrWhiteSpace(participant))
                    {
                        sql.Append(" inner join cyParticipant p ");
                    }
                    BuildSqlByParticipant(sql, parameters, participant, startTime, endTime);
                    Console.WriteLine(sql.ToString());
                    command.CommandText = sql.ToString();
                },
                parameters);
        }

        public IList<Project> GetListByParticipant(string participant, DateTime startTime, DateTime endTime, int startRowIndex, int maxRowsCount)
        {
            List<KeyValuePair<string, object>> parameters = new List<KeyValuePair<string, object>>();
            return DbTemplate.GetList<Project>(dataSource,
                (command) =>
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("select t.id,t.name,t.description,t.creator,t.creation,t.modification from cyProject t ");
                    if (!string.IsNullOrWhiteSpace(participant))
                    {
                        sql.Append(" inner join cyParticipant p ");
                    }
                    BuildSqlByParticipant(sql, parameters, participant, startTime, endTime);
                    if (!string.IsNullOrWhiteSpace(participant))
                    {
                        sql.Append(" order by p.creation desc ");
                    }
                    else
                    {
                        sql.Append(" order by t.modification desc ");
                    }
                    if (maxRowsCount < int.MaxValue)
                    {
                        sql.Append(" limit ").Append(startRowIndex).Append(",").Append(startRowIndex + maxRowsCount);
                    }
                    command.CommandText = sql.ToString();
                },
                parameters,
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        private void BuildSql(StringBuilder sql, List<KeyValuePair<string, object>> parameters, 
            string creator, DateTime startTime, DateTime endTime)
        {
            if (startTime != DateTime.MinValue && endTime != DateTime.MinValue && endTime > startTime)
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" t.modification between @startTime and @endTime ");
                parameters.Add(new KeyValuePair<string, object>("startTime", startTime));
                parameters.Add(new KeyValuePair<string, object>("endTime", endTime));
            }
            if (!string.IsNullOrWhiteSpace(creator))
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" t.creator=@creator ");
                parameters.Add(new KeyValuePair<string, object>("creator", creator));
            }
        }

        private void BuildSqlByParticipant(StringBuilder sql, List<KeyValuePair<string, object>> parameters,
            string participant, DateTime startTime, DateTime endTime)
        {
            if (!string.IsNullOrWhiteSpace(participant))
            {
                sql.Append(" on t.id=p.projectId ");
                if (startTime != DateTime.MinValue && endTime != DateTime.MinValue && endTime > startTime)
                {
                    sql.Append(" and p.creation between @startTime and @endTime ");
                    parameters.Add(new KeyValuePair<string, object>("startTime", startTime));
                    parameters.Add(new KeyValuePair<string, object>("endTime", endTime));
                }
                sql.Append(" and p.staff=@participant ");
                parameters.Add(new KeyValuePair<string, object>("participant", participant));
            }
            else
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" t.modification between @startTime and @endTime ");
                parameters.Add(new KeyValuePair<string, object>("startTime", startTime));
                parameters.Add(new KeyValuePair<string, object>("endTime", endTime));
            }
        }

        private Project Populate(IDataReader reader)
        {
            Project entity = new Project();
            entity.Id = reader.GetInt64(0);
            entity.Name = reader.GetString(1);
            entity.Description = reader.IsDBNull(2) ? null : reader.GetString(2);
            entity.Creator = reader.GetString(3);
            entity.Creation = reader.IsDBNull(4) ? default(DateTime) : reader.GetDateTime(4);
            entity.Modification = reader.IsDBNull(5) ? default(DateTime) : reader.GetDateTime(5);

            return entity;
        }

    }

}
