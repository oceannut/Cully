using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.ServiceModel.Web;

using ThinkInBio.Common.Exceptions;
using ThinkInBio.Common.ExceptionHandling;
using ThinkInBio.Cully;
using ThinkInBio.Cully.BLL;

namespace ThinkInBio.Cully.WSL.Impl
{
    public class TaskWcfService : ITaskWcfService
    {

        internal ITaskService TaskService { get; set; }
        internal IProjectService ProjectService { get; set; }
        internal ICommentService CommentService { get; set; }
        internal IExceptionHandler ExceptionHandler { get; set; }

        public Task SaveTask(string activityId, string user, string content, string staff, string appointedDay)
        {
            long activityIdLong = 0;
            try
            {
                activityIdLong = Convert.ToInt64(activityId);
            }
            catch
            {
                throw new WebFaultException<string>("activityId", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new WebFaultException<string>("content", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(staff))
            {
                throw new WebFaultException<string>("staff", HttpStatusCode.BadRequest);
            }

            try
            {
                Task task = new Task(activityIdLong);
                task.Content = content;
                DateTime? d = string.IsNullOrWhiteSpace(appointedDay) ? new DateTime?() : Convert.ToDateTime(appointedDay);
                task.Save(user, staff, d,
                    (e) =>
                    {
                        return ProjectService.GetActivity(e);
                    },
                    (e1, e2, e3) =>
                    {
                        TaskService.SaveTask(e1, e2, e3);
                    });

                return task;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Task UpdateTask(string id, string user, string content, string staff, string appointedDay)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(staff))
            {
                throw new WebFaultException<string>("staff", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new WebFaultException<string>("content", HttpStatusCode.BadRequest);
            }
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(id);
            }
            catch
            {
                throw new WebFaultException<string>("id", HttpStatusCode.BadRequest);
            }

            try
            {
                Task task = TaskService.GetTask(idLong);
                if (task == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                task.Content = content;
                DateTime? d = string.IsNullOrWhiteSpace(appointedDay) ? new DateTime?() : Convert.ToDateTime(appointedDay);
                task.Appoint(user, staff, d,
                    (e1, e2, e3) =>
                    {
                        TaskService.UpdateTask(e1, e2, e3);
                    });
                return task;
            }
            catch (WebFaultException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Task UpdateTask4IsUnderway(string id, string isUnderway)
        {
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(id);
            }
            catch
            {
                throw new WebFaultException<string>("id", HttpStatusCode.BadRequest);
            }
            bool isUnderwayBool = false;
            try
            {
                isUnderwayBool = Convert.ToBoolean(isUnderway);
            }
            catch
            {
                throw new WebFaultException<string>("isUnderway", HttpStatusCode.BadRequest);
            }

            try
            {
                Task task = TaskService.GetTask(idLong);
                if (task == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                if (isUnderwayBool)
                {
                    task.Activate((e) =>
                    {
                        TaskService.UpdateTask(e);
                    });
                }
                else
                {
                    task.Inactivate((e) =>
                    {
                        TaskService.UpdateTask(e);
                    });
                }
                return task;
            }
            catch (WebFaultException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Task UpdateTask4IsCompleted(string id, string isCompleted)
        {
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(id);
            }
            catch
            {
                throw new WebFaultException<string>("id", HttpStatusCode.BadRequest);
            }
            bool isCompletedBool = false;
            try
            {
                isCompletedBool = Convert.ToBoolean(isCompleted);
            }
            catch
            {
                throw new WebFaultException<string>("isCompleted", HttpStatusCode.BadRequest);
            }

            try
            {
                Task task = TaskService.GetTask(idLong);
                if (task == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                Activity activity = ProjectService.GetActivity(task.ActivityId);
                IList<Task> taskList = TaskService.GetTaskList(task.ActivityId);
                if (isCompletedBool)
                {
                    task.Complete(activity, taskList,
                        (e1, e2) =>
                        {
                            TaskService.UpdateTask(e1, e2);
                        });
                }
                else
                {
                    task.Resume(activity,
                        (e1, e2) =>
                        {
                            TaskService.UpdateTask(e1, e2);
                        });
                }
                return task;
            }
            catch (WebFaultException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public void DeleteTask(string id)
        {
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(id);
            }
            catch
            {
                throw new WebFaultException<string>("id", HttpStatusCode.BadRequest);
            }

            try
            {
                Task task = TaskService.GetTask(idLong);
                if (task == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                Activity activity = ProjectService.GetActivity(task.ActivityId);
                IList<Task> taskList = TaskService.GetTaskList(task.ActivityId);
                task.Delete(activity, taskList,
                    (e1, e2, e3) =>
                    {
                        TaskService.DeleteTask(e1, e2, e3);
                    });
            }
            catch (WebFaultException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Task GetTask(string id)
        {
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(id);
            }
            catch
            {
                throw new WebFaultException<string>("id", HttpStatusCode.BadRequest);
            }

            try
            {
                return TaskService.GetTask(idLong);
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Task[] GetTaskList(string activityId)
        {
            long activityIdLong = 0;
            try
            {
                activityIdLong = Convert.ToInt64(activityId);
            }
            catch
            {
                throw new WebFaultException<string>("activityId", HttpStatusCode.BadRequest);
            }

            try
            {
                IList<Task> list = TaskService.GetTaskList(activityIdLong);
                if (list != null)
                {
                    return list.ToArray();
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Comment SaveComment(string id, string user, string content, string[] observers)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new WebFaultException<string>("content", HttpStatusCode.BadRequest);
            }
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(id);
            }
            catch
            {
                throw new WebFaultException<string>("id", HttpStatusCode.BadRequest);
            }

            try
            {
                Task task = TaskService.GetTask(idLong);
                if (task == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                return task.AddRemark(observers, user, content,
                    (e1, e2, e3) =>
                    {
                        TaskService.SaveComment(e1, e2, e3);
                    });
            }
            catch (WebFaultException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public void DeleteComment(string id, string commentId, string[] observers)
        {
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(id);
            }
            catch
            {
                throw new WebFaultException<string>("id", HttpStatusCode.BadRequest);
            }
            long commentIdLong = 0;
            try
            {
                commentIdLong = Convert.ToInt64(commentId);
            }
            catch
            {
                throw new WebFaultException<string>("commentId", HttpStatusCode.BadRequest);
            }

            try
            {
                Task task = TaskService.GetTask(idLong);
                if (task == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                Comment comment = CommentService.GetComment(commentIdLong);
                if (comment == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                task.RemoveRemark(observers, comment,
                    (e1, e2, e3) =>
                    {
                        TaskService.DeleteComment(e1, e2, e3);
                    });
            }
            catch (WebFaultException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public TaskDelay[] GetTaskDelayList(string date, string activityId, string includeDones)
        {
            DateTime d = DateTime.MinValue;
            if ("null" != date)
            {
                try
                {
                    d = DateTime.Parse(date);
                }
                catch
                {
                    throw new WebFaultException<string>("date", HttpStatusCode.BadRequest);
                }
            }
            long activityIdLong = 0;
            try
            {
                activityIdLong = Convert.ToInt64(activityId);
            }
            catch
            {
                throw new WebFaultException<string>("activityId", HttpStatusCode.BadRequest);
            }
            bool includeDonesBool = false;
            try
            {
                includeDonesBool = Convert.ToBoolean(includeDones);
            }
            catch
            {
                throw new WebFaultException<string>("includeDones", HttpStatusCode.BadRequest);
            }
            TaskDelayScope? scope = includeDonesBool ? new TaskDelayScope?() : TaskDelayScope.Undone;

            try
            {
                IList<TaskDelay> list = TaskService.GetTaskDelayList(d, scope, activityIdLong);
                if (list != null)
                {
                    return list.ToArray();
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

    }
}
