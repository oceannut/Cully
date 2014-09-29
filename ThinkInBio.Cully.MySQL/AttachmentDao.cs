using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

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
                    command.CommandText = @"insert into cyAttachment (id,projectId,title,path,creation) 
                                                values (NULL,@projectId,@title,@path,@creation)";
                    command.Parameters.Add(DbFactory.CreateParameter("projectId", entity.ProjectId));
                    command.Parameters.Add(DbFactory.CreateParameter("title", entity.Title));
                    command.Parameters.Add(DbFactory.CreateParameter("path", entity.Path));
                    command.Parameters.Add(DbFactory.CreateParameter("creation", entity.Creation));
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

        public IList<Attachment> GetList(long projectId)
        {
            return DbTemplate.GetList<Attachment>(dataSource,
                (command) =>
                {
                    command.CommandText = @"select id,projectId,title,path,creation from cyAttachment
                                                where projectId=@projectId";
                    command.Parameters.Add(DbFactory.CreateParameter("projectId", projectId));
                },
                (reader) =>
                {
                    Attachment entity = new Attachment();
                    entity.Id = reader.GetInt64(0);
                    entity.ProjectId = reader.GetInt64(1);
                    entity.Title = reader.GetString(2);
                    entity.Path = reader.GetString(3);
                    entity.Creation = reader.GetDateTime(4);
                    return entity;
                });
        }

    }
}
