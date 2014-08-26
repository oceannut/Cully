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

    public class TaskReportDao : GenericDao<TaskReport>, ITaskReportDao
    {

        private string dataSource;

        public TaskReportDao(string dataSource)
        {
            if (string.IsNullOrWhiteSpace(dataSource))
            {
                throw new ArgumentNullException();
            }
            this.dataSource = dataSource;
        }

        public override bool Save(TaskReport entity)
        {
            return DbTemplate.Save(dataSource,
                (command) =>
                {
                    command.CommandText = @"insert into cyTaskReport (id,activityId,staff,count,year,month,day) 
                                                values (NULL,@activityId,@staff,@count,@year,@month,@day)";
                    command.Parameters.Add(DbFactory.CreateParameter("activityId", entity.ActivityId));
                    command.Parameters.Add(DbFactory.CreateParameter("staff", entity.Staff));
                    command.Parameters.Add(DbFactory.CreateParameter("count", entity.Count));
                    command.Parameters.Add(DbFactory.CreateParameter("year", entity.Year));
                    command.Parameters.Add(DbFactory.CreateParameter("month", entity.Month));
                    command.Parameters.Add(DbFactory.CreateParameter("day", entity.Day));
                },
                (id) =>
                {
                    entity.Id = id;
                });
        }

        public override bool Delete(TaskReport entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"delete from cyTaskReport 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

    }

}
