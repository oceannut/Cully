using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using ThinkInBio.Cully;

namespace Test.ThinkInBio.Cully
{
    [TestClass]
    public class TaskDelayBuilderUnitTest
    {
        [TestMethod]
        public void TestMethod1()
        {
            TaskDelayBuilder builder = new TaskDelayBuilder();

            DateTime now = DateTime.Now;
            DateTime timeStamp = new DateTime(now.Year, now.Month, now.Day);

            //task 1
            Task task = new Task(1);
            task.Staff = "Tom";
            task.Creation = now;
            task.Modification = now;

            builder.Build(timeStamp, task);
            IEnumerable<TaskDelay> undones = builder.UndoneDelays;
            IEnumerable<TaskDelay> dones = builder.DoneDelays;
            Assert.AreEqual(1, undones.Count());
            TaskDelay undoneTaskDelay = undones.ElementAt(0);
            Assert.AreEqual(1, undoneTaskDelay.Untimed);
            Assert.AreEqual(1, undoneTaskDelay.Total);
            Assert.AreEqual(0, dones.Count());

            //task 2
            task = new Task(1);
            task.Staff = "Tom";
            task.AppointedDay = timeStamp;
            task.Creation = now;
            task.Modification = now;

            builder.Build(timeStamp, task);
            undones = builder.UndoneDelays;
            dones = builder.DoneDelays;
            Assert.AreEqual(1, undones.Count());
            undoneTaskDelay = undones.ElementAt(0);
            Assert.AreEqual(1, undoneTaskDelay.Delay);
            Assert.AreEqual(1, undoneTaskDelay.Untimed);
            Assert.AreEqual(2, undoneTaskDelay.Total);

            //task 3
            task = new Task(1);
            task.Staff = "Tom";
            task.AppointedDay = timeStamp.AddDays(1);
            task.Creation = now;
            task.Modification = now;

            builder.Build(timeStamp, task);
            undones = builder.UndoneDelays;
            dones = builder.DoneDelays;
            Assert.AreEqual(1, undones.Count());
            undoneTaskDelay = undones.ElementAt(0);
            Assert.AreEqual(1, undoneTaskDelay.Delay);
            Assert.AreEqual(1, undoneTaskDelay.Untimed);
            Assert.AreEqual(3, undoneTaskDelay.Total);

            //task 4
            task = new Task(1);
            task.Staff = "Jerry";
            task.AppointedDay = timeStamp.AddDays(2);
            task.Creation = now;
            task.Modification = now;

            builder.Build(timeStamp, task);
            undones = builder.UndoneDelays;
            dones = builder.DoneDelays;
            Assert.AreEqual(2, undones.Count());
            undoneTaskDelay = builder.GetTaskDelay(false, 1, "Tom");
            Assert.AreEqual(1, undoneTaskDelay.Delay);
            Assert.AreEqual(1, undoneTaskDelay.Untimed);
            Assert.AreEqual(3, undoneTaskDelay.Total);
            undoneTaskDelay = builder.GetTaskDelay(false, 1, "Jerry");
            Assert.AreEqual(0, undoneTaskDelay.Delay);
            Assert.AreEqual(0, undoneTaskDelay.Untimed);
            Assert.AreEqual(1, undoneTaskDelay.Total);

            //task 5
            task = new Task(2);
            task.Staff = "Tom";
            task.AppointedDay = timeStamp.AddDays(-1);
            task.Creation = now;
            task.Modification = now;

            builder.Build(timeStamp, task);
            undones = builder.UndoneDelays;
            dones = builder.DoneDelays;
            Assert.AreEqual(3, undones.Count());
            undoneTaskDelay = builder.GetTaskDelay(false, 1, "Tom");
            Assert.AreEqual(1, undoneTaskDelay.Delay);
            Assert.AreEqual(1, undoneTaskDelay.Untimed);
            Assert.AreEqual(3, undoneTaskDelay.Total);
            undoneTaskDelay = builder.GetTaskDelay(false, 1, "Jerry");
            Assert.AreEqual(0, undoneTaskDelay.Delay);
            Assert.AreEqual(0, undoneTaskDelay.Untimed);
            Assert.AreEqual(1, undoneTaskDelay.Total);
            undoneTaskDelay = builder.GetTaskDelay(false, 2, "Tom");
            Assert.AreEqual(1, undoneTaskDelay.Delay);
            Assert.AreEqual(0, undoneTaskDelay.Untimed);
            Assert.AreEqual(1, undoneTaskDelay.Total);

            //task 6
            task = new Task(1);
            task.Staff = "Tom";
            task.AppointedDay = timeStamp;
            task.IsCompleted = true;
            task.Completion = now;
            task.Creation = now;
            task.Modification = now;

            builder.Build(timeStamp, task);
            dones = builder.DoneDelays;
            Assert.AreEqual(1, dones.Count());
            TaskDelay doneTaskDelay = builder.GetTaskDelay(true, 1, "Tom");
            Assert.AreEqual(1, doneTaskDelay.Delay);
            Assert.AreEqual(0, doneTaskDelay.Untimed);
            Assert.AreEqual(1, doneTaskDelay.Total);

            //task 7
            task = new Task(1);
            task.Staff = "Tom";
            task.AppointedDay = timeStamp.AddDays(1);
            task.IsCompleted = true;
            task.Completion = now;
            task.Creation = now;
            task.Modification = now;

            builder.Build(timeStamp, task);
            dones = builder.DoneDelays;
            Assert.AreEqual(1, dones.Count());
            doneTaskDelay = builder.GetTaskDelay(true, 1, "Tom");
            Assert.AreEqual(1, doneTaskDelay.Delay);
            Assert.AreEqual(0, doneTaskDelay.Untimed);
            Assert.AreEqual(2, doneTaskDelay.Total);

            //task 8
            task = new Task(1);
            task.Staff = "Tom";
            task.IsCompleted = true;
            task.Completion = now;
            task.Creation = now;
            task.Modification = now;

            builder.Build(timeStamp, task);
            dones = builder.DoneDelays;
            Assert.AreEqual(1, dones.Count());
            doneTaskDelay = builder.GetTaskDelay(true, 1, "Tom");
            Assert.AreEqual(1, doneTaskDelay.Delay);
            Assert.AreEqual(1, doneTaskDelay.Untimed);
            Assert.AreEqual(3, doneTaskDelay.Total);
            
        }
    }
}
