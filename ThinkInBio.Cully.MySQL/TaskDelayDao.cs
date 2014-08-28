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

    public class TaskDelayDao : GenericDao<TaskDelay>, ITaskDelayDao
    {

        private string dataSource;

        public TaskDelayDao(string dataSource)
        {
            if (string.IsNullOrWhiteSpace(dataSource))
            {
                throw new ArgumentNullException();
            }
            this.dataSource = dataSource;
        }

        public override bool Save(TaskDelay entity)
        {
            return DbTemplate.Save(dataSource,
                (command) =>
                {
                    command.CommandText = @"insert into cyTaskDelay (id,scope,activityId,staff,total,delay,untimed,year,month,day) 
                                                values (NULL,@scope,@activityId,@staff,@total,@delay,@untimed,@year,@month,@day)";
                    command.Parameters.Add(DbFactory.CreateParameter("scope", entity.Scope));
                    command.Parameters.Add(DbFactory.CreateParameter("activityId", entity.ActivityId));
                    command.Parameters.Add(DbFactory.CreateParameter("staff", entity.Staff));
                    command.Parameters.Add(DbFactory.CreateParameter("total", entity.Total));
                    command.Parameters.Add(DbFactory.CreateParameter("delay", entity.Delay));
                    command.Parameters.Add(DbFactory.CreateParameter("untimed", entity.Untimed));
                    command.Parameters.Add(DbFactory.CreateParameter("year", entity.Year));
                    command.Parameters.Add(DbFactory.CreateParameter("month", entity.Month));
                    command.Parameters.Add(DbFactory.CreateParameter("day", entity.Day));
                },
                (id) =>
                {
                    entity.Id = id;
                });
        }

        public override void Save(ICollection<TaskDelay> col)
        {
            if (col == null || col.Count == 0)
            {
                throw new ArgumentNullException();
            }
            DbTemplate.Save(dataSource,
                (command) =>
                {
                    StringBuilder buffer = new StringBuilder();
                    buffer.Append("insert into cyTaskDelay (id,scope,activityId,staff,total,delay,untimed,year,month,day) values ");
                    for (int i = 0; i < col.Count; i++)
                    {
                        TaskDelay taskDelay = col.ElementAt(i);
                        buffer.Append("(NULL,")
                            .Append("@scope").Append(i).Append(",")
                            .Append("@activityId").Append(i).Append(",")
                            .Append("@staff").Append(i).Append(",")
                            .Append("@total").Append(i).Append(",")
                            .Append("@delay").Append(i).Append(",")
                            .Append("@untimed").Append(i).Append(",")
                            .Append("@year").Append(i).Append(",")
                            .Append("@month").Append(i).Append(",")
                            .Append("@day").Append(i).Append("),");
                        command.Parameters.Add(DbFactory.CreateParameter(string.Format("scope{0}", i), taskDelay.Scope));
                        command.Parameters.Add(DbFactory.CreateParameter(string.Format("activityId{0}", i), taskDelay.ActivityId));
                        command.Parameters.Add(DbFactory.CreateParameter(string.Format("staff{0}", i), taskDelay.Staff));
                        command.Parameters.Add(DbFactory.CreateParameter(string.Format("total{0}", i), taskDelay.Total));
                        command.Parameters.Add(DbFactory.CreateParameter(string.Format("delay{0}", i), taskDelay.Delay));
                        command.Parameters.Add(DbFactory.CreateParameter(string.Format("untimed{0}", i), taskDelay.Untimed));
                        command.Parameters.Add(DbFactory.CreateParameter(string.Format("year{0}", i), taskDelay.Year));
                        command.Parameters.Add(DbFactory.CreateParameter(string.Format("month{0}", i), taskDelay.Month));
                        command.Parameters.Add(DbFactory.CreateParameter(string.Format("day{0}", i), taskDelay.Day));
                    }
                    buffer.Length = buffer.Length - 1;
                    command.CommandText = buffer.ToString();
                });
        }

        public override bool Delete(TaskDelay entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"delete from cyTaskDelay 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public IList<TaskDelay> GetList(int? startYear, int? startMonth, int? startDay, 
            int? endYear, int? endMonth, int? endDay, 
            TaskDelayScope? scope, long activityId, string staff)
        {
            List<KeyValuePair<string, object>> parameters = new List<KeyValuePair<string, object>>();
            return DbTemplate.GetList<TaskDelay>(dataSource,
                (command) =>
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("select id,scope,activityId,staff,total,delay,untimed,year,month,day from cyTaskDelay ");
                    if (startYear.HasValue && endYear.HasValue)
                    {
                        SQLHelper.AppendOp(sql, parameters);
                        sql.Append(" year between @year1 and @year2 ");
                        parameters.Add(new KeyValuePair<string, object>("year1", startYear.Value));
                        parameters.Add(new KeyValuePair<string, object>("year2", endYear.Value));
                        if (startMonth.HasValue && endMonth.HasValue)
                        {
                            SQLHelper.AppendOp(sql, parameters);
                            sql.Append(" month between @month1 and @month2 ");
                            parameters.Add(new KeyValuePair<string, object>("month1", startMonth.Value));
                            parameters.Add(new KeyValuePair<string, object>("month2", endMonth.Value));
                            if (startDay.HasValue && endDay.HasValue)
                            {
                                SQLHelper.AppendOp(sql, parameters);
                                sql.Append(" day between @day1 and @day2 ");
                                parameters.Add(new KeyValuePair<string, object>("day1", startDay.Value));
                                parameters.Add(new KeyValuePair<string, object>("day2", endDay.Value));
                            }
                        }
                    }
                    if (scope.HasValue)
                    {
                        SQLHelper.AppendOp(sql, parameters);
                        sql.Append(" scope=@scope ");
                        parameters.Add(new KeyValuePair<string, object>("scope", (int)scope.Value));
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
                    
                    command.CommandText = sql.ToString();
                },
                parameters,
                (reader) =>
                {
                    TaskDelay entity = new TaskDelay();
                    entity.Id = reader.GetInt64(0);
                    entity.Scope = (TaskDelayScope)reader.GetInt32(1);
                    entity.ActivityId = reader.GetInt64(2);
                    entity.Staff = reader.GetString(3);
                    entity.Total = reader.GetInt32(4);
                    entity.Delay = reader.GetInt32(5);
                    entity.Untimed = reader.GetInt32(6);
                    entity.Year = reader.GetInt32(7);
                    entity.Month = reader.GetInt32(8);
                    entity.Day = reader.GetInt32(9);

                    return entity;
                });
        }

    }

}
