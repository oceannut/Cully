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
                    command.CommandText = @"insert into cyTaskDelay (id,activityId,staff,total,delay,appointedDay,creation) 
                                                values (NULL,@activityId,@staff,@total,@delay,@appointedDay,@creation)";
                    command.Parameters.Add(DbFactory.CreateParameter("activityId", entity.ActivityId));
                    command.Parameters.Add(DbFactory.CreateParameter("staff", entity.Staff));
                    command.Parameters.Add(DbFactory.CreateParameter("total", entity.Total));
                    command.Parameters.Add(DbFactory.CreateParameter("delay", entity.Delay));
                    command.Parameters.Add(DbFactory.CreateParameter("appointedDay", entity.AppointedDay));
                    command.Parameters.Add(DbFactory.CreateParameter("creation", entity.Creation));
                },
                (id) =>
                {
                    entity.Id = id;
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
