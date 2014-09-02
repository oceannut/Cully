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
    public class ActivityDaoUnitTest
    {

        private ProjectDao projectDao;
        private ActivityDao activityDao;

        [TestInitialize()]
        public void MyTestInitialize()
        {
            projectDao = new ProjectDao(Configs.DataSource);
            activityDao = new ActivityDao(Configs.DataSource);
        }

        [TestMethod]
        public void TestMethod1()
        {
            Project project = new Project();
            project.Name = "项目名称";
            project.Description = "项目描述";
            project.Creator = "me";
            project.Save((e1, e2) =>
            {
                projectDao.Save(e1);
            });
            Assert.IsTrue(project.Id > 0);

            Activity activity = new Activity();
            activity.Name = "活动名称";
            activity.Description = "活动描述";
            activity.ProjectId = project.Id;
            activity.Save(project,
                (e) =>
                {
                    return activityDao.IsAnyExisted(e);
                },
                (e1, e2, e3) =>
                {
                    activityDao.Save(e1);
                });
            Assert.IsTrue(activity.Id > 0);

            Activity activityGet = activityDao.Get(activity.Id);
            Assert.IsNotNull(activityGet);
            Assert.AreEqual(activityGet.Id, activity.Id);

            activityDao.Delete(activity);
            projectDao.Delete(project);
        }
    }
}
