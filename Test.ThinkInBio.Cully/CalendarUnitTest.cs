using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Web.Script.Serialization;

namespace Test.ThinkInBio.Cully
{
    [TestClass]
    public class CalendarUnitTest
    {
        [TestMethod]
        public void TestMethod1()
        {

            DateTime now = DateTime.Now;
            Console.WriteLine(now);
            Console.WriteLine(now.Ticks);
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            Console.WriteLine(serializer.Serialize(now));
            Console.WriteLine("+++++++++++++++++++++++++++++++");
        }
    }
}
