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
                     command.CommandText = @"insert into cyLog (id,content,startTime,endTime,creator,creation,modification) 
                                                values (NULL,@content,@startTime,@endTime,@creator,@creation,@modification)";
                     command.Parameters.Add(DbFactory.CreateParameter("content", entity.Content));
                     command.Parameters.Add(DbFactory.CreateParameter("startTime", entity.StartTime));
                     command.Parameters.Add(DbFactory.CreateParameter("endTime", entity.EndTime));
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
            return base.Update(entity);
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
                    command.CommandText = @"select id,content,startTime,endTime,creator,creation,modification from cyLog 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                },
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        public int GetCount(string user, DateTime? startTime, DateTime? endTime)
        {
            List<KeyValuePair<string, object>> parameters = new List<KeyValuePair<string, object>>();
            return DbTemplate.GetCount(dataSource,
                (command) =>
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("select count(t.id) from cyLog t ");
                    BuildSql(sql, parameters, user, startTime, endTime);
                    command.CommandText = sql.ToString();
                },
                parameters);
        }

        public IList<Log> GetList(string user, DateTime? startTime, DateTime? endTime, int startRowIndex, int maxRowsCount)
        {
            List<KeyValuePair<string, object>> parameters = new List<KeyValuePair<string, object>>();
            return DbTemplate.GetList<Log>(dataSource,
                (command) =>
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("select t.id,t.content,t.startTime,t.endTime,t.creator,t.creation,t.modification from cyLog t ");
                    BuildSql(sql, parameters, user, startTime, endTime);
                    sql.Append(" order by t.startTime desc ");
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
            string user, DateTime? startTime, DateTime? endTime)
        {
            if (startTime.HasValue && startTime.Value != DateTime.MinValue
                    && endTime.HasValue && endTime.Value != DateTime.MinValue
                    && endTime.Value > startTime.Value)
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" t.startTime between @startTime and @endTime ");
                parameters.Add(new KeyValuePair<string, object>("startTime", startTime.Value));
                parameters.Add(new KeyValuePair<string, object>("endTime", endTime.Value));
            }
            if (!string.IsNullOrWhiteSpace(user))
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" t.creator=@creator ");
                parameters.Add(new KeyValuePair<string, object>("creator", user));
            }
        }

        private Log Populate(IDataReader reader)
        {
            Log log = new Log();
            log.Id = reader.GetInt64(0);
            log.Content = reader.GetString(1);
            log.StartTime = reader.GetDateTime(2);
            log.EndTime = reader.IsDBNull(3) ? new DateTime?() : reader.GetDateTime(3);
            log.Creator = reader.GetString(4);
            log.Creation = reader.GetDateTime(5);
            log.Modification = reader.GetDateTime(6);

            return log;
        }

    }

}
