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
    public class TaskDelayDaoUnitTest
    {

        private TaskDelayDao taskDelayDao;

        [TestInitialize()]
        public void MyTestInitialize()
        {
            taskDelayDao = new TaskDelayDao(Configs.DataSource);
        }

        [TestMethod]
        public void TestMethod1()
        {
            TaskDelay taskDelay = new TaskDelay();
            taskDelay.Scope = TaskDelayScope.Undone;
            taskDelay.ActivityId = 1;
            taskDelay.Staff = "zsp";
            taskDelay.Total = 3;
            taskDelay.Delay = 1;
            taskDelay.Untimed = 1;
            taskDelay.Year = 2014;
            taskDelay.Month = 8;
            taskDelay.Day = 26;
            taskDelayDao.Save(taskDelay);
            Assert.IsTrue(taskDelay.Id > 0);

            taskDelayDao.Delete(taskDelay);
        }

    }
}
