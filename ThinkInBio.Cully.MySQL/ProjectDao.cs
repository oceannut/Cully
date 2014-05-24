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

    public class ProjectDao : GenericDao<Project>, IProjectDao
    {

        internal string DataSource { get; set; }

        public ProjectDao(string dataSource)
        {
            if (string.IsNullOrWhiteSpace(dataSource))
            {
                throw new ArgumentNullException();
            }
            this.DataSource = dataSource;
        }

        public override void Save(Project entity)
        {
//            using (IDbConnection connection = DbHelper.CreateConnection(DataSource))
//            {
//                connection.Open();
//                using (IDbCommand command = connection.CreateCommand())
//                {
//                    command.CommandText = @"insert into cyProject (id,name,description,creator,creation,modification) 
//                                                values (NULL,@name,@description,@creator,@creation,@modification)";
//                    command.Parameters.Add(DbHelper.CreateParameter("name", entity.Name));
//                    command.Parameters.Add(DbHelper.CreateParameter("description", entity.Description));
//                    command.Parameters.Add(DbHelper.CreateParameter("creator", entity.Creator));
//                    command.Parameters.Add(DbHelper.CreateParameter("creation", entity.Creation));
//                    command.Parameters.Add(DbHelper.CreateParameter("modification", entity.Modification));

//                    if (command.ExecuteNonQuery() == 1)
//                    {
//                        command.CommandText = "select LAST_INSERT_ID()";
//                        entity.Id = Convert.ToInt64(command.ExecuteScalar());
//                    }
//                }
//            }

            DbTemplate.Save(DataSource,
                (command) =>
                {
                    command.CommandText = @"insert into cyProject (id,name,description,creator,creation,modification) 
                                                values (NULL,@name,@description,@creator,@creation,@modification)";
                    command.Parameters.Add(DbFactory.CreateParameter("name", entity.Name));
                    command.Parameters.Add(DbFactory.CreateParameter("description", entity.Description));
                    command.Parameters.Add(DbFactory.CreateParameter("creator", entity.Creator));
                    command.Parameters.Add(DbFactory.CreateParameter("creation", entity.Creation));
                    command.Parameters.Add(DbFactory.CreateParameter("modification", entity.Modification));
                },
                (id) =>
                {
                    entity.Id = id;
                });
        }

        public override bool Update(Project entity)
        {
            int rowsAffected = 0;
            using (IDbConnection connection = DbHelper.CreateConnection(DataSource))
            {
                connection.Open();
                using (IDbCommand command = connection.CreateCommand())
                {
                    command.CommandText = @"update cyProject 
                                                set name=@name,description=@description,modification=@modification 
                                                where id=@id";
                    command.Parameters.Add(DbHelper.CreateParameter("name", entity.Name));
                    command.Parameters.Add(DbHelper.CreateParameter("description", entity.Description));
                    command.Parameters.Add(DbHelper.CreateParameter("modification", entity.Modification));
                    command.Parameters.Add(DbHelper.CreateParameter("id", entity.Id));
                    rowsAffected = command.ExecuteNonQuery();
                }
            }
            return rowsAffected > 0;
        }

        public override bool Delete(Project entity)
        {
            int rowsAffected = 0;
            using (IDbConnection connection = DbHelper.CreateConnection(DataSource))
            {
                connection.Open();
                using (IDbCommand command = connection.CreateCommand())
                {
                    command.CommandText = @"delete from cyProject 
                                                where id=@id";
                    command.Parameters.Add(DbHelper.CreateParameter("id", entity.Id));
                    rowsAffected = command.ExecuteNonQuery();
                }
            }
            return rowsAffected > 0;
        }

        public override Project Get(object id)
        {
            Project entity = null;
            using (IDbConnection connection = DbHelper.CreateConnection(DataSource))
            {
                connection.Open();
                using (IDbCommand command = connection.CreateCommand())
                {
                    command.CommandText = @"select id,name,description,creator,creation,modification from cyProject 
                                                where id=@id";
                    command.Parameters.Add(DbHelper.CreateParameter("id", id));
                    using (IDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            entity = Populate(reader);
                        }
                    }
                }
            }

            return entity;
        }

        public int GetCount(string creator, DateTime startTime, DateTime endTime)
        {
            int count = 0;
            using (IDbConnection connection = DbHelper.CreateConnection(DataSource))
            {
                connection.Open();
                using (IDbCommand command = connection.CreateCommand())
                {
                    StringBuilder sql = new StringBuilder();
                    sql.Append("select count(id) from cyProject ");
                    List<string> keys = new List<string>();
                    List<object> parameters = new List<object>();
                    if (!string.IsNullOrWhiteSpace(creator))
                    {
                        SQLHelper.AppendOp(sql, parameters);
                        sql.Append(" creator=@creator ");
                        keys.Add("creator");
                        parameters.Add(creator);
                    }
                    if (startTime != DateTime.MinValue && endTime != DateTime.MinValue && endTime > startTime)
                    {
                        SQLHelper.AppendOp(sql, parameters);
                        sql.Append(" modification between @startTime and @endTime ");
                        keys.Add("startTime");
                        keys.Add("endTime");
                        parameters.Add(startTime);
                        parameters.Add(endTime);
                    }
                    command.CommandText = sql.ToString();
                    for (int i = 0; i < keys.Count; i++)
                    {
                        command.Parameters.Add(DbHelper.CreateParameter(keys[i], parameters[i]));
                    }
                    count = Convert.ToInt32(command.ExecuteScalar());
                }
            }
            return count;
        }

        public IList<Project> GetList(string creator, DateTime startTime, DateTime endTime, int startRowIndex, int maxRowsCount)
        {
            throw new NotImplementedException();
        }

        private Project Populate(IDataReader reader)
        {
            Project entity = new Project();
            entity.Id = reader.GetInt64(0);
            entity.Name = reader.GetString(1);
            entity.Description = reader.IsDBNull(2) ? null : reader.GetString(2);
            entity.Creator = reader.GetString(3);
            entity.Creation = reader.IsDBNull(4) ? default(DateTime) : reader.GetDateTime(4);
            entity.Modification = reader.IsDBNull(5) ? default(DateTime) : reader.GetDateTime(5);

            return entity;
        }

    }

}
