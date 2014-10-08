using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using ThinkInBio.Cully;
using ThinkInBio.Cully.DAL;
using ThinkInBio.Cully.MySQL;

namespace Test.ThinkInBio.Cully.MySQL
{
    [TestClass]
    public class LogDaoUnitTest
    {

        private LogDao logDao;

        [TestInitialize()]
        public void MyTestInitialize()
        {
            logDao = new LogDao(Configs.DataSource);
        }

        [TestMethod]
        public void TestMethod1()
        {
            Log log = new Log();
            log.Content = "测试";
            //log.StartTime = DateTime.Now;
            log.Creator = "me";
            log.Creation = DateTime.Now;
            log.Modification = DateTime.Now;
            logDao.Save(log);
            Assert.IsTrue(log.Id > 0);

            logDao.Delete(log);
            log = logDao.Get(log.Id);
            Assert.IsNull(log);
        }

    }
}
