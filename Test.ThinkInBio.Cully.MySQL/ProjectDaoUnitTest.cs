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
    /// <summary>
    /// Summary description for UnitTest1
    /// </summary>
    [TestClass]
    public class ProjectDaoUnitTest
    {
        public ProjectDaoUnitTest()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        private TestContext testContextInstance;

        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        private ProjectDao projectDao;
        private ParticipantDao participantDao;

        #region Additional test attributes
        //
        // You can use the following additional attributes as you write your tests:
        //
        // Use ClassInitialize to run code before running the first test in the class
        // [ClassInitialize()]
        // public static void MyClassInitialize(TestContext testContext) { }
        //
        // Use ClassCleanup to run code after all tests in a class have run
        // [ClassCleanup()]
        // public static void MyClassCleanup() { }
        //
         //Use TestInitialize to run code before running each test 
         [TestInitialize()]
         public void MyTestInitialize() 
         {
             projectDao = new ProjectDao(Configs.DataSource);
             participantDao = new ParticipantDao(Configs.DataSource);
         }
        
         //Use TestCleanup to run code after each test has run
         [TestCleanup()]
         public void MyTestCleanup() { }
        
        #endregion

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
                //participantDao.Save(e2);
            });
            Assert.IsTrue(project.Id > 0);

            Project projectGet = projectDao.Get(project.Id);
            Assert.AreEqual(project, projectGet);

            projectGet.Name = "项目名称1";
            projectGet.Description = "项目描述1";
            project.Creator = "me1";
            projectGet.Update((e) =>
            {
                projectDao.Update(e);
            });
            projectGet = projectDao.Get(projectGet.Id);
            Assert.AreEqual("项目名称1", projectGet.Name);
            Assert.AreEqual("项目描述1", projectGet.Description);
            Assert.AreEqual("me", projectGet.Creator);

            projectDao.Delete(projectGet);
            projectGet = projectDao.Get(projectGet.Id);
            Assert.IsNull(projectGet);
        }

        [TestMethod]
        public void TestMethod2()
        {

            Project project1 = new Project();
            project1.Name = "项目名称1";
            project1.Creator = "me";
            project1.Save((e1, e2) =>
            {
                projectDao.Save(e1);
            });

            Project project2 = new Project();
            project2.Name = "项目名称2";
            project2.Creator = "me";
            project2.Save((e1, e2) =>
            {
                projectDao.Save(e1);
            });

            Project project3 = new Project();
            project3.Name = "项目名称3";
            project3.Creator = "me";
            project3.Save((e1, e2) =>
            {
                projectDao.Save(e1);
            });

            Project project4 = new Project();
            project4.Name = "项目名称4";
            project4.Creator = "me";
            project4.Save((e1, e2) =>
            {
                projectDao.Save(e1);
            });

            Project project5 = new Project();
            project5.Name = "项目名称5";
            project5.Creator = "me";
            project5.Save((e1, e2) =>
            {
                projectDao.Save(e1);
            });

            DateTime endTime= DateTime.Now;
            DateTime startTime= endTime.AddSeconds(-5);
            int count = projectDao.GetCount(null, startTime, endTime);
            Assert.AreEqual(5, count);
            count = projectDao.GetCount("me", startTime, endTime);
            Assert.AreEqual(5, count);
            IList<Project> list = projectDao.GetList("me", startTime, endTime, 0, 3);
            Assert.AreEqual(3, list.Count);
            Console.WriteLine("================list==============");
            foreach (Project item in list)
            {
                Console.WriteLine(item.Name);
            }
            list = projectDao.GetList("me", startTime, endTime, 3, 3);
            Assert.AreEqual(2, list.Count);
            Console.WriteLine("================list==============");
            foreach (Project item in list)
            {
                Console.WriteLine(item.Name);
            }

            projectDao.Delete(project1);
            projectDao.Delete(project2);
            projectDao.Delete(project3);
            projectDao.Delete(project4);
            projectDao.Delete(project5);
        }

        [TestMethod]
        public void TestMethod3()
        {

            Project project1 = new Project();
            project1.Name = "项目名称1";
            project1.Creator = "me";
            project1.Save((e1, e2) =>
            {
                projectDao.Save(e1);
            });

            Project project2 = new Project();
            project2.Name = "项目名称2";
            project2.Creator = "me";
            project2.Save((e1, e2) =>
            {
                projectDao.Save(e1);
            });

            Project project3 = new Project();
            project3.Name = "项目名称3";
            project3.Creator = "you";
            project3.Save((e1, e2) =>
            {
                projectDao.Save(e1);
            });

            Project project4 = new Project();
            project4.Name = "项目名称4";
            project4.Creator = "you";
            project4.Save((e1, e2) =>
            {
                projectDao.Save(e1);
            });

            Project project5 = new Project();
            project5.Name = "项目名称5";
            project5.Creator = "me";
            project5.Save((e1, e2) =>
            {
                projectDao.Save(e1);
            });

            Project project6 = new Project();
            project6.Name = "项目名称6";
            project6.Creator = "me";
            project6.Save((e1, e2) =>
            {
                projectDao.Save(e1);
            });

            Participant participantA = new Participant();
            participantA.ProjectId = project1.Id;
            participantA.Staff = "you";
            participantA.Save((e) =>
            {
                participantDao.Save(e);
            });

            Participant participantB = new Participant();
            participantB.ProjectId = project6.Id;
            participantB.Staff = "you";
            participantB.Save((e) =>
            {
                participantDao.Save(e);
            });

            DateTime endTime = DateTime.Now;
            DateTime startTime = endTime.AddSeconds(-10);
            int count = projectDao.GetCountByParticipant(null, startTime, endTime);
            Assert.AreEqual(6, count);
            count = projectDao.GetCountByParticipant("me", startTime, endTime);
            Assert.AreEqual(0, count);
            count = projectDao.GetCountByParticipant("you", startTime, endTime);
            Assert.AreEqual(2, count);
            IList<Project> list = projectDao.GetListByParticipant("me", startTime, endTime, false, 0, 3);
            Assert.AreEqual(0, list.Count);
            list = projectDao.GetListByParticipant("you", startTime, endTime, false, 0, 3);
            Assert.AreEqual(2, list.Count);
            Console.WriteLine("================you list==============");
            foreach (Project item in list)
            {
                Console.WriteLine(item.Name);
            }

            participantDao.Delete(participantA);
            participantDao.Delete(participantB);
            projectDao.Delete(project1);
            projectDao.Delete(project2);
            projectDao.Delete(project3);
            projectDao.Delete(project4);
            projectDao.Delete(project5);
            projectDao.Delete(project6);
        }

    }
}
