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
    public class AttachmentDao : GenericDao<Attachment>, IAttachmentDao
    {

        private string dataSource;

        public AttachmentDao(string dataSource)
        {
            if (string.IsNullOrWhiteSpace(dataSource))
            {
                throw new ArgumentNullException();
            }
            this.dataSource = dataSource;
        }

        public override bool Save(Attachment entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException();
            }
            return DbTemplate.Save(dataSource,
                (command) =>
                {
                    command.CommandText = @"insert into cyAttachment (id,projectId,title,path,creator,creation,modification) 
                                                values (NULL,@projectId,@title,@path,@creator,@creation,@modification)";
                    command.Parameters.Add(DbFactory.CreateParameter("projectId", entity.ProjectId));
                    command.Parameters.Add(DbFactory.CreateParameter("title", entity.Title));
                    command.Parameters.Add(DbFactory.CreateParameter("path", entity.Path));
                    command.Parameters.Add(DbFactory.CreateParameter("creator", entity.Creator));
                    command.Parameters.Add(DbFactory.CreateParameter("creation", entity.Creation));
                    command.Parameters.Add(DbFactory.CreateParameter("modification", entity.Modification));
                },
                (id) =>
                {
                    entity.Id = id;
                });
        }

        public override bool Delete(Attachment entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"delete from cyAttachment 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public override Attachment Get(object id)
        {
            return DbTemplate.Get<Attachment>(dataSource,
                (command) =>
                {
                    command.CommandText = @"select id,projectId,title,path,commentCount,creator,creation,modification from cyAttachment 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                },
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        public bool Update4CommentCount(long id, int count)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"update cyAttachment 
                                                set commentCount=@commentCount 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("commentCount", count));
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                });
        }

        public IList<Attachment> GetList(long projectId)
        {
            return DbTemplate.GetList<Attachment>(dataSource,
                (command) =>
                {
                    command.CommandText = @"select id,projectId,title,path,commentCount,creator,creation,modification from cyAttachment
                                                where projectId=@projectId 
                                                order by modification desc";
                    command.Parameters.Add(DbFactory.CreateParameter("projectId", projectId));
                },
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        private Attachment Populate(IDataReader reader)
        {
            Attachment entity = new Attachment();
            entity.Id = reader.GetInt64(0);
            entity.ProjectId = reader.GetInt64(1);
            entity.Title = reader.GetString(2);
            entity.Path = reader.GetString(3);
            entity.CommentCount = reader.GetInt32(4);
            entity.Creator = reader.GetString(5);
            entity.Creation = reader.GetDateTime(6);
            entity.Modification = reader.GetDateTime(7);
            return entity;
        }

    }
}
