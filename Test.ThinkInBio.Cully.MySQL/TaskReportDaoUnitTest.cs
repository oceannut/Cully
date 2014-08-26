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
    public class TaskReportDaoUnitTest
    {

        private TaskReportDao taskReportDao;

        [TestInitialize()]
        public void MyTestInitialize()
        {
            taskReportDao = new TaskReportDao(Configs.DataSource);
        }

        [TestMethod]
        public void TestMethod1()
        {
            TaskReport taskReport = new TaskReport();
            taskReport.ActivityId = 1;
            taskReport.Staff = "zsp";
            taskReport.Count = 1;
            taskReport.Year = 2014;
            taskReport.Month = 8;
            taskReport.Day = 26;
            taskReportDao.Save(taskReport);
            Assert.IsTrue(taskReport.Id > 0);

            taskReportDao.Delete(taskReport);
        }

    }
}
