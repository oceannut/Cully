using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;

using MySql.Data.MySqlClient;

namespace ThinkInBio.Cully.MySQL
{

    internal static class DbHelper
    {

        public static IDbConnection CreateConnection(string dataSource)
        {
            return new MySqlConnection(dataSource);
        }

        public static IDbDataParameter CreateParameter<T>(string name, T value)
        {
            return new MySqlParameter(name, value);
        }

    }

}
