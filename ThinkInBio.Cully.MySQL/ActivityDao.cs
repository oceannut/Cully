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
    public class ActivityDao : GenericDao<Activity>, IActivityDao
    {

        private string dataSource;

        public ActivityDao(string dataSource)
        {
            if (string.IsNullOrWhiteSpace(dataSource))
            {
                throw new ArgumentNullException();
            }
            this.dataSource = dataSource;
        }

        public override bool Save(Activity entity)
        {
            return DbTemplate.Save(dataSource,
                (command) =>
                {
                    command.CommandText = @"insert into cyActivity (id,category,name,description,projectId,isCompleted,creation,modification) 
                                                values (NULL,@category,@name,@description,@projectId,@isCompleted,@creation,@modification)";
                    command.Parameters.Add(DbFactory.CreateParameter("category", entity.Category));
                    command.Parameters.Add(DbFactory.CreateParameter("name", entity.Name));
                    command.Parameters.Add(DbFactory.CreateParameter("description", entity.Description));
                    command.Parameters.Add(DbFactory.CreateParameter("projectId", entity.ProjectId));
                    command.Parameters.Add(DbFactory.CreateParameter("isCompleted", entity.IsCompleted));
                    command.Parameters.Add(DbFactory.CreateParameter("creation", entity.Creation));
                    command.Parameters.Add(DbFactory.CreateParameter("modification", entity.Modification));
                },
                (id) =>
                {
                    entity.Id = id;
                });
        }

        public override bool Update(Activity entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"update cyActivity 
                                                set category=@category,name=@name,description=@description,modification=@modification
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("category", entity.Category));
                    command.Parameters.Add(DbFactory.CreateParameter("name", entity.Name));
                    command.Parameters.Add(DbFactory.CreateParameter("description", entity.Description));
                    command.Parameters.Add(DbFactory.CreateParameter("modification", entity.Modification));
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public override bool Delete(Activity entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"delete from cyActivity 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public override Activity Get(object id)
        {
            return DbTemplate.Get<Activity>(dataSource,
                (command) =>
                {
                    command.CommandText = @"select id,category,name,description,projectId,isCompleted,creation,modification from cyActivity 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                },
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        public bool Update4IsCompleted(long id, bool isCompleted)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"update cyActivity 
                                                set isCompleted=@isCompleted
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("isCompleted", isCompleted));
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                });
        }

        public bool Update4ProjectId(long id, long projectId)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"update cyActivity 
                                                set projectId=@projectId
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("projectId", projectId));
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                });
        }

        public IList<Activity> GetList(long projectId)
        {
            return DbTemplate.GetList<Activity>(dataSource,
                (command) =>
                {
                    command.CommandText = @"select id,category,name,description,projectId,isCompleted,creation,modification from cyActivity
                                                where projectId=@projectId 
                                                order by modification desc";
                    command.Parameters.Add(DbFactory.CreateParameter("projectId", projectId));
                },
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        public int GetCountByParticipant(string participant, DateTime? startTime, DateTime? endTime)
        {
            List<KeyValuePair<string, object>> parameters = new List<KeyValuePair<string, object>>();
            return DbTemplate.GetCount(dataSource,
                (command) =>
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("select count(t.id) from cyActivity t ");
                    if (!string.IsNullOrWhiteSpace(participant))
                    {
                        sql.Append(" inner join cyProject p on t.projectId=p.id inner join cyParticipant pa on pa.projectId=p.id ");
                    }
                    BuildSqlByParticipant(sql, parameters, participant, startTime, endTime);
                    Console.WriteLine(sql.ToString());
                    command.CommandText = sql.ToString();
                },
                parameters);
        }

        public IList<Activity> GetListByParticipant(string participant, DateTime? startTime, DateTime? endTime, 
            bool asc, int startRowIndex, int maxRowsCount)
        {
            List<KeyValuePair<string, object>> parameters = new List<KeyValuePair<string, object>>();
            return DbTemplate.GetList<Activity>(dataSource,
                (command) =>
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("select t.id,t.category,t.name,t.description,t.projectId,t.isCompleted,t.creation,t.modification from cyActivity t ");
                    if (!string.IsNullOrWhiteSpace(participant))
                    {
                        sql.Append(" inner join cyProject p on t.projectId=p.id inner join cyParticipant pa on pa.projectId=p.id ");
                    }
                    BuildSqlByParticipant(sql, parameters, participant, startTime, endTime);
                    sql.Append(" order by t.modification ");
                    if (!asc)
                    {
                        sql.Append(" desc ");
                    }
                    if (maxRowsCount < int.MaxValue)
                    {
                        sql.Append(" limit ").Append(startRowIndex).Append(",").Append(maxRowsCount);
                    }
                    command.CommandText = sql.ToString();
                },
                parameters,
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        private void BuildSqlByParticipant(StringBuilder sql, List<KeyValuePair<string, object>> parameters,
            string participant, DateTime? startTime, DateTime? endTime)
        {
            if (startTime.HasValue && startTime.Value != DateTime.MinValue
                    && endTime.HasValue && endTime.Value != DateTime.MinValue
                    && endTime.Value > startTime.Value)
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" t.modification between @startTime and @endTime ");
                parameters.Add(new KeyValuePair<string, object>("startTime", startTime.Value));
                parameters.Add(new KeyValuePair<string, object>("endTime", endTime.Value));
            }
            if (!string.IsNullOrWhiteSpace(participant))
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" pa.staff=@participant ");
                parameters.Add(new KeyValuePair<string, object>("participant", participant));
            }
        }

        private Activity Populate(IDataReader reader)
        {
            Activity entity = new Activity();
            entity.Id = reader.GetInt64(0);
            entity.Category = reader.GetString(1);
            entity.Name = reader.GetString(2);
            entity.Description = reader.IsDBNull(3) ? null : reader.GetString(3);
            entity.ProjectId = reader.GetInt64(4);
            entity.IsCompleted = reader.GetBoolean(5);
            entity.Creation = reader.IsDBNull(6) ? default(DateTime) : reader.GetDateTime(6);
            entity.Modification = reader.IsDBNull(7) ? default(DateTime) : reader.GetDateTime(7);

            return entity;
        }

    }
}
