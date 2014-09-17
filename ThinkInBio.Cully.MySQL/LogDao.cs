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

    public class LogDao : GenericDao<Log>, ILogDao
    {

        private string dataSource;

        public LogDao(string dataSource)
        {
            if (string.IsNullOrWhiteSpace(dataSource))
            {
                throw new ArgumentNullException();
            }
            this.dataSource = dataSource;
        }

        public override bool Save(Log entity)
        {
            return DbTemplate.Save(dataSource,
                 (command) =>
                 {
                     command.CommandText = @"insert into cyLog (id,projectId,title,content,category,tags,creator,creation,modification) 
                                                values (NULL,@projectId,@title,@content,@category,@tags,@creator,@creation,@modification)";
                     command.Parameters.Add(DbFactory.CreateParameter("projectId", entity.ProjectId));
                     command.Parameters.Add(DbFactory.CreateParameter("title", entity.Title));
                     command.Parameters.Add(DbFactory.CreateParameter("content", entity.Content));
                     command.Parameters.Add(DbFactory.CreateParameter("category", entity.Category));
                     command.Parameters.Add(DbFactory.CreateParameter("tags", entity.Tags));
                     command.Parameters.Add(DbFactory.CreateParameter("creator", entity.Creator));
                     command.Parameters.Add(DbFactory.CreateParameter("creation", entity.Creation));
                     command.Parameters.Add(DbFactory.CreateParameter("modification", entity.Modification));
                 },
                 (id) =>
                 {
                     entity.Id = id;
                 });
        }

        public override bool Update(Log entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"update cyLog 
                                                set title=@title,content=@content,category=@category,tags=@tags 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("title", entity.Title));
                    command.Parameters.Add(DbFactory.CreateParameter("content", entity.Content));
                    command.Parameters.Add(DbFactory.CreateParameter("category", entity.Category));
                    command.Parameters.Add(DbFactory.CreateParameter("tags", entity.Tags));
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public bool Update4CommentCount(long id, int count)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"update cyLog 
                                                set commentCount=@commentCount 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("commentCount", count));
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                });
        }

        public override bool Delete(Log entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"delete from cyLog 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public override Log Get(object id)
        {
            return DbTemplate.Get<Log>(dataSource,
                (command) =>
                {
                    command.CommandText = @"select id,projectId,title,content,category,tags,commentCount,creator,creation,modification from cyLog 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                },
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        public int GetCount(DateTime? startTime, DateTime? endTime, string creator, string category, long? projectId)
        {
            List<KeyValuePair<string, object>> parameters = new List<KeyValuePair<string, object>>();
            return DbTemplate.GetCount(dataSource,
                (command) =>
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("select count(t.id) from cyLog t ");
                    BuildSql(sql, parameters, startTime, endTime, creator, category, projectId);
                    command.CommandText = sql.ToString();
                },
                parameters);
        }

        public IList<Log> GetList(DateTime? startTime, DateTime? endTime, string creator, string category, long? projectId, int startRowIndex, int maxRowsCount)
        {
            List<KeyValuePair<string, object>> parameters = new List<KeyValuePair<string, object>>();
            return DbTemplate.GetList<Log>(dataSource,
                (command) =>
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("select t.id,t.projectId,t.title,t.content,t.category,t.tags,t.commentCount,t.creator,t.creation,t.modification from cyLog t ");
                    BuildSql(sql, parameters, startTime, endTime, creator, category, projectId);
                    sql.Append(" order by t.modification desc ");
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
            DateTime? startTime, DateTime? endTime, string creator, string category, long? projectId)
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
            if (!string.IsNullOrWhiteSpace(creator))
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" t.creator=@creator ");
                parameters.Add(new KeyValuePair<string, object>("creator", creator));
            }
            if (!string.IsNullOrWhiteSpace(category))
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" t.category=@category ");
                parameters.Add(new KeyValuePair<string, object>("category", category));
            }
            if (projectId != null && projectId.HasValue && projectId.Value > 0)
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" t.projectId=@projectId ");
                parameters.Add(new KeyValuePair<string, object>("projectId", projectId.Value));
            }
        }

        private Log Populate(IDataReader reader)
        {
            Log log = new Log();
            log.Id = reader.GetInt64(0);
            log.ProjectId = reader.IsDBNull(1) ? 0 : reader.GetInt64(1);
            log.Title = reader.GetString(2);
            log.Content = reader.GetString(3);
            log.Category = reader.GetString(4);
            log.Tags = reader.IsDBNull(5) ? null : reader.GetString(5);
            log.CommentCount = reader.GetInt32(6);
            log.Creator = reader.GetString(7);
            log.Creation = reader.GetDateTime(8);
            log.Modification = reader.GetDateTime(9);

            return log;
        }

    }

}
