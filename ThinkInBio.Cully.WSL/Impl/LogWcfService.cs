using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Cully;
using ThinkInBio.Cully.BLL;

namespace ThinkInBio.Cully.WSL.Impl
{

    public class LogWcfService : ILogWcfService
    {

        internal ILogService LogService { get; set; }

        public Log SaveLog(string user, string date, string content)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(content))
            {
                throw new ArgumentNullException();
            }
            DateTime d = DateTime.Parse(date);

            Log log = new Log(d);
            log.Content = content;
            log.Creator = user;
            log.Save((e) =>
            {
                LogService.SaveLog(e);
            });

            return log;
        }

        public Log[] GetLogList4User(string user, string start, string count)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            int startInt = Convert.ToInt32(start);
            int countInt = Convert.ToInt32(count);
            IList<Log> list = LogService.GetLogList(user, startInt, countInt);
            if (list != null)
            {
                return list.ToArray();
            }
            else
            {
                return null;
            }
        }

        public Log[] GetLogList4User(string user, string date, string span, string start, string count)
        {
            throw new NotImplementedException();
        }

        public Log[] GetLogList(string start, string count)
        {
            int startInt = Convert.ToInt32(start);
            int countInt = Convert.ToInt32(count);
            IList<Log> list = LogService.GetLogList(startInt, countInt);
            if (list != null)
            {
                return list.ToArray();
            }
            else
            {
                return null;
            }
        }

        public Log[] GetLogList(string date, string span, string start, string count)
        {
            throw new NotImplementedException();
        }

    }

}
