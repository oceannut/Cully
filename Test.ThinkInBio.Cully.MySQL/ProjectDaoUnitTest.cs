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
            project.Save((e) =>
            {
                projectDao.Save(e);
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
    }
}
