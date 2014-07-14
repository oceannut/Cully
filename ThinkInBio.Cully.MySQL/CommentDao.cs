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

    public class CommentDao : GenericDao<Comment>, ICommentDao
    {

        private string dataSource;

        public CommentDao(string dataSource)
        {
            if (string.IsNullOrWhiteSpace(dataSource))
            {
                throw new ArgumentNullException();
            }
            this.dataSource = dataSource;
        }

        public override bool Save(Comment entity)
        {
            return DbTemplate.Save(dataSource,
                 (command) =>
                 {
                     command.CommandText = @"insert into cyComment (id,target,targetId,content,creator,creation,modification) 
                                                values (NULL,@target,@targetId,@content,@creator,@creation,@modification)";
                     command.Parameters.Add(DbFactory.CreateParameter("target", entity.Target));
                     command.Parameters.Add(DbFactory.CreateParameter("targetId", entity.TargetId));
                     command.Parameters.Add(DbFactory.CreateParameter("content", entity.Content));
                     command.Parameters.Add(DbFactory.CreateParameter("creator", entity.Creator));
                     command.Parameters.Add(DbFactory.CreateParameter("creation", entity.Creation));
                     command.Parameters.Add(DbFactory.CreateParameter("modification", entity.Modification));
                 },
                 (id) =>
                 {
                     entity.Id = id;
                 });
        }

        public override bool Update(Comment entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"update cyComment 
                                                set content=@content,modification=@modification
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("content", entity.Content));
                    command.Parameters.Add(DbFactory.CreateParameter("modification", entity.Modification));
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public override bool Delete(Comment entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"delete from cyComment 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public override Comment Get(object id)
        {
            return DbTemplate.Get<Comment>(dataSource,
                (command) =>
                {
                    command.CommandText = @"select id,target,targetId,content,creator,creation,modification from cyComment 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", id));
                },
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        public IList<Comment> GetList(CommentTarget target, long targetId)
        {
            if (targetId == 0)
            {
                throw new ArgumentNullException();
            }
            return DbTemplate.GetList<Comment>(dataSource,
                (command) =>
                {
                    command.CommandText = @"select id,target,targetId,content,creator,creation,modification from cyComment 
                                                where target=@target and targetId=@targetId";
                    command.Parameters.Add(DbFactory.CreateParameter("target", target));
                    command.Parameters.Add(DbFactory.CreateParameter("targetId", targetId));
                },
                (reader) =>
                {
                    return Populate(reader);
                });
        }

        private Comment Populate(IDataReader reader)
        {
            Comment comment = new Comment();
            comment.Id = reader.GetInt64(0);
            comment.Target = (CommentTarget)reader.GetInt16(1);
            comment.TargetId = reader.GetInt64(2);
            comment.Content = reader.GetString(3);
            comment.Creator = reader.GetString(4);
            comment.Creation = reader.GetDateTime(5);
            comment.Modification = reader.GetDateTime(6);

            return comment;
        }

    }
}
