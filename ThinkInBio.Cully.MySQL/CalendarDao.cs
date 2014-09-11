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
    public class CalendarDao : GenericDao<Calendar>, ICalendarDao
    {

        private string dataSource;

        public CalendarDao(string dataSource)
        {
            if (string.IsNullOrWhiteSpace(dataSource))
            {
                throw new ArgumentNullException();
            }
            this.dataSource = dataSource;
        }

        public override bool Save(Calendar entity)
        {
            return DbTemplate.Save(dataSource,
                 (command) =>
                 {
                     command.CommandText = @"insert into cyCalendar (id,content,appointed,_interval,_repeat,expression,creator,creation,modification) 
                                                values (NULL,@content,@appointed,@interval,@repeat,@expression,@creator,@creation,@modification)";
                     command.Parameters.Add(DbFactory.CreateParameter("content", entity.Content));
                     command.Parameters.Add(DbFactory.CreateParameter("appointed", entity.Appointed));
                     command.Parameters.Add(DbFactory.CreateParameter("interval", entity.Interval));
                     command.Parameters.Add(DbFactory.CreateParameter("repeat", entity.Repeat));
                     command.Parameters.Add(DbFactory.CreateParameter("expression", entity.Expression));
                     command.Parameters.Add(DbFactory.CreateParameter("creator", entity.Creator));
                     command.Parameters.Add(DbFactory.CreateParameter("creation", entity.Creation));
                     command.Parameters.Add(DbFactory.CreateParameter("modification", entity.Modification));
                 },
                 (id) =>
                 {
                     entity.Id = id;
                 });
        }

        public override bool Delete(Calendar entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"delete from cyCalendar 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

    }
}
