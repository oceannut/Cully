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
    public class ActivityDao : GenericDao<Activity>, IActivityDao
    {

        private string dataSource;

        public ActivityDao(string dataSource)
        {
            if (string.IsNullOrWhiteSpace(dataSource))
            {
                throw new ArgumentNullException();
            }
            this.dataSource = dataSource;
        }

        public override bool Save(Activity entity)
        {
            return DbTemplate.Save(dataSource,
                (command) =>
                {
                    command.CommandText = @"insert into cyActivity (id,name,description,projectId,isCompleted,creation,modification) 
                                                values (NULL,@name,@description,@projectId,@isCompleted,@creation,@modification)";
                    command.Parameters.Add(DbFactory.CreateParameter("name", entity.Name));
                    command.Parameters.Add(DbFactory.CreateParameter("description", entity.Description));
                    command.Parameters.Add(DbFactory.CreateParameter("projectId", entity.ProjectId));
                    command.Parameters.Add(DbFactory.CreateParameter("isCompleted", entity.IsCompleted));
                    command.Parameters.Add(DbFactory.CreateParameter("creation", entity.Creation));
                    command.Parameters.Add(DbFactory.CreateParameter("modification", entity.Modification));
                },
                (id) =>
                {
                    entity.Id = id;
                });
        }

        public override bool Update(Activity entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"update cyActivity 
                                                set name=@name,description=@description,modification=@modification
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("name", entity.Name));
                    command.Parameters.Add(DbFactory.CreateParameter("description", entity.Description));
                    command.Parameters.Add(DbFactory.CreateParameter("modification", entity.Modification));
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public override bool Delete(Activity entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"delete from cyActivity 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public override Activity Get(object id)
        {
            return DbTemplate.Get<Activity>(dataSource,
                (command) =>
                {
                    command.CommandText = @"select id,name,description,projectId,isCompleted,creation,modification from cyActivity 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                },
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        public bool Update4IsCompleted(long id, bool isCompleted)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"update cyActivity 
                                                set isCompleted=@isCompleted
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("isCompleted", isCompleted));
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                });
        }

        public bool Update4ProjectId(long id, long projectId)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"update cyActivity 
                                                set projectId=@projectId
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("projectId", projectId));
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                });
        }

        public IList<Activity> GetActivityList(long projectId)
        {
            return DbTemplate.GetList<Activity>(dataSource,
                (command) =>
                {
                    command.CommandText = @"select id,name,description,projectId,isCompleted,creation,modification from cyActivity
                                                where projectId=@projectId";
                    command.Parameters.Add(DbFactory.CreateParameter("projectId", projectId));
                },
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        private Activity Populate(IDataReader reader)
        {
            Activity entity = new Activity();
            entity.Id = reader.GetInt64(0);
            entity.Name = reader.GetString(1);
            entity.Description = reader.IsDBNull(2) ? null : reader.GetString(2);
            entity.ProjectId = reader.GetInt64(3);
            entity.IsCompleted = reader.GetBoolean(4);
            entity.Creation = reader.IsDBNull(5) ? default(DateTime) : reader.GetDateTime(5);
            entity.Modification = reader.IsDBNull(6) ? default(DateTime) : reader.GetDateTime(6);

            return entity;
        }




    }
}
