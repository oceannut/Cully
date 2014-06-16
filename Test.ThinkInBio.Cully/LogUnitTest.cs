using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using ThinkInBio.Cully;

namespace Test.ThinkInBio.Cully
{
    /// <summary>
    /// Summary description for UnitTest1
    /// </summary>
    [TestClass]
    public class LogUnitTest
    {
        public LogUnitTest()
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
        // Use TestInitialize to run code before running each test 
        // [TestInitialize()]
        // public void MyTestInitialize() { }
        //
        // Use TestCleanup to run code after each test has run
        // [TestCleanup()]
        // public void MyTestCleanup() { }
        //
        #endregion

        [TestMethod]
        public void TestMethod1()
        {
            //string[] tagArray = string.Empty.Split(',');
            //IEnumerable<string> col = tagArray.Concat(new string[] { "测试" });
            //Assert.AreEqual(2, col.Count());
            //Console.WriteLine("=====0=====");
            //Console.WriteLine(col.ElementAt(0));
            //Console.WriteLine(col.ElementAt(1));
            //Console.WriteLine("=====1=====");
            //Console.WriteLine(string.Join(",", col));

            Log log = new Log();
            log.AddTag("测试");
            Assert.IsNotNull(log.Tags);
            Console.WriteLine("=====2=====");
            Console.WriteLine(log.Tags);
            log.AddTag("测试2");
            Assert.AreEqual("测试,测试2", log.Tags);
            Console.WriteLine(log.Tags);
            log.AddTag("测试");
            Assert.AreEqual("测试,测试2", log.Tags);
            Console.WriteLine(log.Tags);

            Log log2 = new Log();
            log2.AddTag(new string[] { "测试" });
            Assert.IsNotNull(log2.Tags);
            Console.WriteLine(log2.Tags);
            log2.AddTag(new string[] { "测试2", "测试3" });
            Assert.AreEqual("测试,测试2,测试3", log2.Tags);
            log2.AddTag(new string[] { "测试4", "测试5", "", "测试4", });
            Assert.AreEqual("测试,测试2,测试3,测试4,测试5", log2.Tags);
            Console.WriteLine(log2.Tags);

            Console.WriteLine("-------");
        }
    }
}
