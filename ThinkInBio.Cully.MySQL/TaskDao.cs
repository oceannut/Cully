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
