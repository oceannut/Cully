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
            taskDelay.ActivityId = 1;
            taskDelay.Staff = "zsp";
            taskDelay.Total = 1;
            taskDelay.Delay = 1;
            taskDelay.AppointedDay = DateTime.Now;
            taskDelay.Creation = DateTime.Now;
            taskDelayDao.Save(taskDelay);
            Assert.IsTrue(taskDelay.Id > 0);

            taskDelayDao.Delete(taskDelay);
        }

    }
}
