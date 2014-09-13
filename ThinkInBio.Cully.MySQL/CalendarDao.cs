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
    public class CalendarDao : GenericDao<Calendar>, ICalendarDao
    {

        private string dataSource;

        public CalendarDao(string dataSource)
        {
            if (string.IsNullOrWhiteSpace(dataSource))
            {
                throw new ArgumentNullException();
            }
            this.dataSource = dataSource;
        }

        public override bool Save(Calendar entity)
        {
            return DbTemplate.Save(dataSource,
                 (command) =>
                 {
                     command.CommandText = @"insert into cyCalendar (id,projectId,content,appointed,level,_repeat,caution,creator,creation,modification) 
                                                values (NULL,@projectId,@content,@appointed,@level,@repeat,@caution,@creator,@creation,@modification)";
                     command.Parameters.Add(DbFactory.CreateParameter("projectId", entity.ProjectId));
                     command.Parameters.Add(DbFactory.CreateParameter("content", entity.Content));
                     command.Parameters.Add(DbFactory.CreateParameter("appointed", entity.Appointed));
                     command.Parameters.Add(DbFactory.CreateParameter("level", entity.Level));
                     command.Parameters.Add(DbFactory.CreateParameter("repeat", entity.Repeat));
                     command.Parameters.Add(DbFactory.CreateParameter("caution", entity.Caution));
                     command.Parameters.Add(DbFactory.CreateParameter("creator", entity.Creator));
                     command.Parameters.Add(DbFactory.CreateParameter("creation", entity.Creation));
                     command.Parameters.Add(DbFactory.CreateParameter("modification", entity.Modification));
                 },
                 (id) =>
                 {
                     entity.Id = id;
                 });
        }

        public override bool Update(Calendar entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"update cyCalendar 
                                                set content=@content,appointed=@appointed,level=@level,_repeat=@repeat,
                                                caution=@caution,modification=@modification
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("content", entity.Content));
                    command.Parameters.Add(DbFactory.CreateParameter("appointed", entity.Appointed));
                    command.Parameters.Add(DbFactory.CreateParameter("level", entity.Level));
                    command.Parameters.Add(DbFactory.CreateParameter("repeat", entity.Repeat));
                    command.Parameters.Add(DbFactory.CreateParameter("caution", entity.Caution));
                    command.Parameters.Add(DbFactory.CreateParameter("modification", entity.Modification));
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public override bool Delete(Calendar entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"delete from cyCalendar 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public override Calendar Get(object id)
        {
            return DbTemplate.Get<Calendar>(dataSource,
                (command) =>
                {
                    command.CommandText = @"select id,projectId,content,appointed,level,_repeat,caution,creator,creation,modification from cyCalendar 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                },
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        public IList<Calendar> GetList(string participant, long projectId, DateTime startTime, DateTime endTime, bool asc, int startRowIndex, int maxRowsCount)
        {
            List<KeyValuePair<string, object>> parameters = new List<KeyValuePair<string, object>>();
            return DbTemplate.GetList<Calendar>(dataSource,
                (command) =>
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("select t.id,t.projectId,t.content,t.appointed,t.level,t._repeat,t.caution,t.creator,t.creation,t.modification from cyCalendar t ");
                    if (!string.IsNullOrWhiteSpace(participant))
                    {
                        sql.Append(" inner join cyCalendarCaution p on t.id=p.calendarId ");
                    }
                    BuildSql(sql, parameters, participant, projectId, startTime, endTime);
                    sql.Append(" order by t.appointed ");
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
            string participant, long projectId, DateTime startTime, DateTime endTime)
        {
            if (startTime != DateTime.MinValue
                    && endTime != DateTime.MinValue
                    && endTime > startTime)
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" t.appointed between @startTime and @endTime ");
                parameters.Add(new KeyValuePair<string, object>("startTime", startTime));
                parameters.Add(new KeyValuePair<string, object>("endTime", endTime));
            }
            if (!string.IsNullOrWhiteSpace(participant))
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" p.staff=@participant ");
                parameters.Add(new KeyValuePair<string, object>("participant", participant));
            }
            if (projectId > 0)
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" t.projectId=@projectId ");
                parameters.Add(new KeyValuePair<string, object>("projectId", projectId));
            }
        }

        private Calendar Populate(IDataReader reader)
        {
            Calendar entity = new Calendar();
            entity.Id = reader.GetInt64(0);
            entity.ProjectId = reader.IsDBNull(1) ? 0 : reader.GetInt64(1);
            entity.Content = reader.GetString(2);
            entity.Appointed = reader.GetDateTime(3);
            entity.Level = (AffairLevel)reader.GetInt32(4);
            entity.Repeat = (AffairRepeat)reader.GetInt32(5);
            entity.Caution = reader.IsDBNull(6) ? new DateTime?() : reader.GetDateTime(6);
            entity.Creator = reader.GetString(7);
            entity.Creation = reader.GetDateTime(8);
            entity.Modification = reader.GetDateTime(9);

            return entity;
        }

    }
}
