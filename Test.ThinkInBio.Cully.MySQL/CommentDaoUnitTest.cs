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
    public class CommentDaoUnitTest
    {

        private CommentDao commentDao;

        [TestInitialize()]
        public void MyTestInitialize()
        {
            commentDao = new CommentDao(Configs.DataSource);
        }

        [TestMethod]
        public void TestMethod1()
        {
            Comment comment = new Comment();
            comment.Target = CommentTarget.Log;
            comment.TargetId = 1;
            comment.Content = "测试";
            comment.Creator = "me";
            comment.Creation = DateTime.Now;
            comment.Modification = DateTime.Now;
            commentDao.Save(comment);
            Assert.IsTrue(comment.Id > 0);

            commentDao.Delete(comment);
            comment = commentDao.Get(comment.Id);
            Assert.IsNull(comment);
        }

    }
}
