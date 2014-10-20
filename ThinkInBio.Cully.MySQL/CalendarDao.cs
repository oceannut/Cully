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
                     command.CommandText = @"insert into cyCalendar (id,type,projectId,content,appointed,endAppointed,level,_repeat,caution,isCaution,creator,creation,modification) 
                                                values (NULL,@type,@projectId,@content,@appointed,@endAppointed,@level,@repeat,@caution,@isCaution,@creator,@creation,@modification)";
                     command.Parameters.Add(DbFactory.CreateParameter("type", entity.Type));
                     command.Parameters.Add(DbFactory.CreateParameter("projectId", entity.ProjectId));
                     command.Parameters.Add(DbFactory.CreateParameter("content", entity.Content));
                     command.Parameters.Add(DbFactory.CreateParameter("appointed", entity.Appointed));
                     command.Parameters.Add(DbFactory.CreateParameter("endAppointed", entity.EndAppointed));
                     command.Parameters.Add(DbFactory.CreateParameter("level", entity.Level));
                     command.Parameters.Add(DbFactory.CreateParameter("repeat", entity.Repeat));
                     command.Parameters.Add(DbFactory.CreateParameter("caution", entity.Caution));
                     command.Parameters.Add(DbFactory.CreateParameter("isCaution", entity.IsCaution));
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
                                                set content=@content,appointed=@appointed,endAppointed=@endAppointed,level=@level,_repeat=@repeat,
                                                caution=@caution,isCaution=@isCaution,modification=@modification
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("content", entity.Content));
                    command.Parameters.Add(DbFactory.CreateParameter("appointed", entity.Appointed));
                    command.Parameters.Add(DbFactory.CreateParameter("endAppointed", entity.EndAppointed));
                    command.Parameters.Add(DbFactory.CreateParameter("level", entity.Level));
                    command.Parameters.Add(DbFactory.CreateParameter("repeat", entity.Repeat));
                    command.Parameters.Add(DbFactory.CreateParameter("caution", entity.Caution));
                    command.Parameters.Add(DbFactory.CreateParameter("isCaution", entity.IsCaution));
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
                    command.CommandText = @"select id,type,projectId,content,appointed,endAppointed,level,_repeat,caution,isCaution,creator,creation,modification from cyCalendar 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                },
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        public IList<Calendar> GetList(string participant, long? projectId, CalendarType? type, bool? isCaution, 
            DateTime? startTime, DateTime? endTime, bool asc, 
            int startRowIndex, int maxRowsCount)
        {
            List<KeyValuePair<string, object>> parameters = new List<KeyValuePair<string, object>>();
            return DbTemplate.GetList<Calendar>(dataSource,
                (command) =>
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("select t.id,t.type,t.projectId,t.content,t.appointed,t.endAppointed,t.level,t._repeat,t.caution,t.isCaution,t.creator,t.creation,t.modification from cyCalendar t ");
                    if (!string.IsNullOrWhiteSpace(participant))
                    {
                        sql.Append(" inner join cyCalendarCaution p on t.id=p.calendarId ");
                    }
                    BuildSql(sql, parameters, participant, projectId, type, isCaution, startTime, endTime);
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
            string participant, long? projectId, CalendarType? type, bool? isCaution, 
            DateTime? startTime, DateTime? endTime)
        {
            if (startTime.HasValue && startTime.Value != DateTime.MinValue
                    && endTime.HasValue && endTime.Value != DateTime.MinValue
                    && endTime.Value > startTime.Value)
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" ((t.appointed <= @startTime and t.endAppointed > @startTime) or (t.appointed > @startTime and t.appointed < @endTime)) ");
                parameters.Add(new KeyValuePair<string, object>("startTime", startTime.Value));
                parameters.Add(new KeyValuePair<string, object>("endTime", endTime.Value));
            }
            if (!string.IsNullOrWhiteSpace(participant))
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" p.staff=@participant ");
                parameters.Add(new KeyValuePair<string, object>("participant", participant));
            }
            if (projectId != null && projectId.HasValue && projectId.Value > 0)
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" t.projectId=@projectId ");
                parameters.Add(new KeyValuePair<string, object>("projectId", projectId.Value));
            }
            if (type != null && type.HasValue)
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" t.type=@type ");
                parameters.Add(new KeyValuePair<string, object>("type", (int)type.Value));
            }
            if (isCaution != null && isCaution.HasValue)
            {
                SQLHelper.AppendOp(sql, parameters);
                sql.Append(" t.isCaution=@isCaution ");
                parameters.Add(new KeyValuePair<string, object>("isCaution", isCaution.Value));
            }
        }

        private Calendar Populate(IDataReader reader)
        {
            Calendar entity = new Calendar();
            entity.Id = reader.GetInt64(0);
            entity.Type = (CalendarType)reader.GetInt32(1);
            entity.ProjectId = reader.IsDBNull(2) ? 0 : reader.GetInt64(2);
            entity.Content = reader.GetString(3);
            entity.Appointed = reader.IsDBNull(4) ? new DateTime?() : reader.GetDateTime(4);
            entity.EndAppointed = reader.IsDBNull(5) ? new DateTime?() : reader.GetDateTime(5);
            entity.Level = (AffairLevel)reader.GetInt32(6); ;
            entity.Repeat = (AffairRepeat)reader.GetInt32(7);
            entity.Caution = reader.IsDBNull(8) ? new DateTime?() : reader.GetDateTime(8);
            entity.IsCaution = reader.GetBoolean(9);
            entity.Creator = reader.GetString(10);
            entity.Creation = reader.GetDateTime(11);
            entity.Modification = reader.GetDateTime(12);

            return entity;
        }

    }
}
