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
    public class CalendarCautionDao : GenericDao<CalendarCaution>, ICalendarCautionDao
    {

        private string dataSource;

        public CalendarCautionDao(string dataSource)
        {
            if (string.IsNullOrWhiteSpace(dataSource))
            {
                throw new ArgumentNullException();
            }
            this.dataSource = dataSource;
        }

        public override bool Save(CalendarCaution entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException();
            }
            return DbTemplate.Save(dataSource,
                (command) =>
                {
                    command.CommandText = @"insert into cyCalendarCaution (id,calendarId,staff,creation) 
                                                values (NULL,@calendarId,@staff,@creation)";
                    command.Parameters.Add(DbFactory.CreateParameter("calendarId", entity.CalendarId));
                    command.Parameters.Add(DbFactory.CreateParameter("staff", entity.Staff));
                    command.Parameters.Add(DbFactory.CreateParameter("creation", entity.Creation));
                },
                (id) =>
                {
                    entity.Id = id;
                });
        }

        public override void Save(ICollection<CalendarCaution> col)
        {
            if (col == null || col.Count == 0)
            {
                throw new ArgumentNullException();
            }
            DbTemplate.Save(dataSource,
                (command) =>
                {
                    StringBuilder buffer = new StringBuilder();
                    buffer.Append("insert into cyCalendarCaution (id,calendarId,staff,creation) values ");
                    for (int i = 0; i < col.Count; i++)
                    {
                        CalendarCaution calendarCaution = col.ElementAt(i);
                        buffer.Append("(NULL,")
                            .Append("@calendarId").Append(i).Append(",")
                            .Append("@staff").Append(i).Append(",")
                            .Append("@creation").Append(i).Append("),");
                        command.Parameters.Add(DbFactory.CreateParameter(string.Format("calendarId{0}", i), calendarCaution.CalendarId));
                        command.Parameters.Add(DbFactory.CreateParameter(string.Format("staff{0}", i), calendarCaution.Staff));
                        command.Parameters.Add(DbFactory.CreateParameter(string.Format("creation{0}", i), calendarCaution.Creation));
                    }
                    buffer.Length = buffer.Length - 1;
                    command.CommandText = buffer.ToString();
                });
        }

        public override bool Delete(CalendarCaution entity)
        {
            return DbTemplate.UpdateOrDelete(dataSource,
                (command) =>
                {
                    command.CommandText = @"delete from cyCalendarCaution 
                                                where id=@id";
                    command.Parameters.Add(DbFactory.CreateParameter("id", entity.Id));
                });
        }

        public IList<CalendarCaution> GetList(long calendarId)
        {
            return DbTemplate.GetList<CalendarCaution>(dataSource,
                (command) =>
                {
                    command.CommandText = @"select id,calendarId,staff,creation from cyCalendarCaution 
                                                where calendarId=@calendarId";
                    command.Parameters.Add(DbFactory.CreateParameter("calendarId", calendarId));
                },
                (reader) =>
                {
                    CalendarCaution entity = new CalendarCaution();
                    entity.Id = reader.GetInt64(0);
                    entity.CalendarId = reader.GetInt64(1);
                    entity.Staff = reader.GetString(2);
                    entity.Creation = reader.GetDateTime(3);
                    return entity;
                });
        }

    }
}
