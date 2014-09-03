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
    public class TaskDaoUnitTest
    {

        private ProjectDao projectDao;
        private ActivityDao activityDao;
        private TaskDao taskDao;

        [TestInitialize()]
        public void MyTestInitialize()
        {
            projectDao = new ProjectDao(Configs.DataSource);
            activityDao = new ActivityDao(Configs.DataSource);
            taskDao = new TaskDao(Configs.DataSource);
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

            Task task = new Task(activity.Id);
            task.Content = "干活去";
            DateTime? d = DateTime.Now;
            task.Save("me", "you", d, null, (e1, e2, e3) =>
            {
                taskDao.Save(e1);
            });
            Assert.IsTrue(task.Id > 0);
            Assert.IsFalse(task.IsUnderway);
            Assert.IsFalse(task.IsCompleted);

            taskDao.Delete(task);
            activityDao.Delete(activity);
            projectDao.Delete(project);
        }

    }
}
