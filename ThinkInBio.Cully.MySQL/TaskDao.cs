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

    public class TaskDao : GenericDao<Task>, ITaskDao
    {

        private string dataSource;

        public TaskDao(string dataSource)
        {
            if (string.IsNullOrWhiteSpace(dataSource))
            {
                throw new ArgumentNullException();
            }
            this.dataSource = dataSource;
        }

        public override bool Save(Task entity)
        {
            return DbTemplate.Save(dataSource,
                (command) =>
                {
                    command.CommandText = @"insert into cyTask (id,content,activityId,isUnderway,isCompleted,staff,appointedDay,creation,modification) 
                                                values (NULL,@content,@activityId,@isUnderway,@isCompleted,@staff,@appointedDay,@creation,@modification)";
                    command.Parameters.Add(DbFactory.CreateParameter("content", entity.Content));
                    command.Parameters.Add(DbFactory.CreateParameter("activityId", entity.ActivityId));
                    command.Parameters.Add(DbFactory.CreateParameter("isUnderway", entity.IsUnderway));
                    command.Parameters.Add(DbFactory.CreateParameter("isCompleted", entity.IsCompleted));
                    command.Parameters.Add(DbFactory.CreateParameter("staff", entity.Staff));
                    command.Parameters.Add(DbFactory.CreateParameter("appointedDay", entity.AppointedDay));
                    command.Parameters.Add(DbFactory.CreateParameter("creation", entity.Creation));
                    command.Parameters.Add(DbFactory.CreateParameter("modification", entity.Modification));
                },
                (id) =>
                {
                    entity.Id = id;
                });
        }

        public override bool Update(Task entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"update cyTask 
                                                set content=@content,staff=@staff,appointedDay=appointedDay,modification=@modification,
                                                    isUnderway=@isUnderway,isCompleted=@isCompleted
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("content", entity.Content));
                    command.Parameters.Add(DbFactory.CreateParameter("staff", entity.Staff));
                    command.Parameters.Add(DbFactory.CreateParameter("appointedDay", entity.AppointedDay));
                    command.Parameters.Add(DbFactory.CreateParameter("modification", entity.Modification));
                    command.Parameters.Add(DbFactory.CreateParameter("isUnderway", entity.IsUnderway));
                    command.Parameters.Add(DbFactory.CreateParameter("isCompleted", entity.IsCompleted));
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public bool Update4CommentCount(long id, int count)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"update cyTask 
                                                set commentCount=@commentCount 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("commentCount", count));
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                });
        }

        public override bool Delete(Task entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"delete from cyTask 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public override Task Get(object id)
        {
            return DbTemplate.Get<Task>(dataSource,
                (command) =>
                {
                    command.CommandText = @"select id,content,activityId,isUnderway,isCompleted,staff,appointedDay,creation,modification from cyTask 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                },
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        public IList<Task> GetTaskList(DateTime? startTime, DateTime? endTime, 
            long activityId, string staff, 
            bool asc, 
            int startRowIndex, int maxRowsCount)
        {
            List<KeyValuePair<string, object>> parameters = new List<KeyValuePair<string, object>>();
            return DbTemplate.GetList<Task>(dataSource,
                (command) =>
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("select id,content,activityId,isUnderway,isCompleted,staff,appointedDay,creation,modification from cyTask ");
                    BuildSql(sql, parameters, startTime, endTime, activityId, staff);
                    sql.Append(" order by modification ");
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

        private void BuildSql(StringBuilder sql, List<KeyValuePair<string, object>> parameters,
            DateTime? startTime, DateTime? endTime, 
            long activityId, string staff)
        {
            if (startTime.HasValue && startTime.Value != DateTime.MinValue
                    && endTime.HasValue && endTime.Value != DateTime.MinValue
                    && endTime.Value > startTime.Value)
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" modification between @startTime and @endTime ");
                parameters.Add(new KeyValuePair<string, object>("startTime", startTime.Value));
                parameters.Add(new KeyValuePair<string, object>("endTime", endTime.Value));
            }
            if (activityId > 0)
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" activityId=@activityId ");
                parameters.Add(new KeyValuePair<string, object>("activityId", activityId));
            }
            if (!string.IsNullOrWhiteSpace(staff))
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" staff=@staff ");
                parameters.Add(new KeyValuePair<string, object>("staff", staff));
            }
        }

        private Task Populate(IDataReader reader)
        {
            Task entity = new Task(reader.GetInt64(0),
                reader.GetString(1),
                reader.GetInt64(2),
                reader.GetBoolean(3),
                reader.GetBoolean(4),
                reader.GetString(5),
                reader.IsDBNull(6) ? null : new DateTime?(reader.GetDateTime(6)),
                reader.GetDateTime(7),
                reader.GetDateTime(8));

            return entity;
        }

    }

}
