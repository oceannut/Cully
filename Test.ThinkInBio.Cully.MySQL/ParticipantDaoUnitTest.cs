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
    public class ParticipantDaoUnitTest
    {

        private ProjectDao projectDao;
        private ParticipantDao participantDao;

        [TestInitialize()]
        public void MyTestInitialize()
        {
            projectDao = new ProjectDao(Configs.DataSource);
            participantDao = new ParticipantDao(Configs.DataSource);
        }

        [TestMethod]
        public void TestMethod1()
        {
            Project project = new Project();
            project.Name = "项目名称";
            project.Description = "项目描述";
            project.Creator = "me";
            project.Save(new string[] { "you" }, 
                (e1, e2) =>
                {
                    projectDao.Save(e1);
                    participantDao.Save(e2);
                });
            Assert.IsTrue(project.Id > 0);

            IList<Participant> participants = participantDao.GetList(project.Id);
            if (participants != null)
            {
                Assert.IsTrue(participants.Count == 1);
                foreach (Participant item in participants)
                {
                    participantDao.Delete(item);
                }
            }
            projectDao.Delete(project);
        }

        [TestMethod]
        public void TestMethod2()
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

            Participant participant = new Participant(project);
            participant.Staff = "him";
            participant.Save((e) =>
            {
                participantDao.Save(e);
            });
            Assert.IsTrue(participant.Id > 0);

            Participant participant2 = new Participant(project);
            participant2.Staff = "you";
            participant2.Save((e) =>
            {
                participantDao.Save(e);
            });
            Assert.IsTrue(participant2.Id > 0);

            IList<Participant> list = participantDao.GetList(project.Id);
            Assert.AreEqual(2, list.Count);
            foreach (Participant entity in list)
            {
                Console.WriteLine(entity.Staff);
            }

            participantDao.Delete(participant);
            participantDao.Delete(participant2);
            projectDao.Delete(project);
        }

        [TestMethod]
        public void TestMethod3()
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

            Participant participant = new Participant(project);
            participant.Staff = "him";
            participant.Save(null);
            Assert.IsTrue(participant.Id == 0);

            Participant participant2 = new Participant(project);
            participant2.Staff = "you";
            participant2.Save(null);
            Assert.IsTrue(participant2.Id == 0);

            IList<Participant> list = new List<Participant>();
            list.Add(participant);
            list.Add(participant2);
            participantDao.Save(list);
            Assert.IsTrue(participant.Id == 0);
            Assert.IsTrue(participant2.Id == 0);

            list = participantDao.GetList(project.Id);
            Assert.AreEqual(2, list.Count);
            foreach (Participant entity in list)
            {
                Assert.IsTrue(entity.Id > 0);
                Console.WriteLine(entity.Staff);
            }

            foreach (Participant item in list)
            {
                participantDao.Delete(item);
            }
            projectDao.Delete(project);
        }

    }
}
