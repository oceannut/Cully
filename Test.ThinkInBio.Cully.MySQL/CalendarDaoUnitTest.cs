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
    public class CalendarDaoUnitTest
    {

        private CalendarDao calendarDao;

        [TestInitialize()]
        public void MyTestInitialize()
        {
            calendarDao = new CalendarDao(Configs.DataSource);
        }

        [TestMethod]
        public void TestMethod1()
        {
            Calendar calendar = new Calendar();
            calendar.Content = "测试";
            calendar.Appointed = DateTime.Now;
            calendar.Level = AffairLevel.General;
            calendar.Repeat = AffairRepeat.None;
            calendar.Creator = "me";
            calendar.Creation = DateTime.Now;
            calendar.Modification = DateTime.Now;
            calendarDao.Save(calendar);
            Assert.IsTrue(calendar.Id > 0);

            calendarDao.Delete(calendar);
        }
    }
}
