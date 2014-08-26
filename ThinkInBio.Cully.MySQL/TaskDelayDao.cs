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

    }

}
