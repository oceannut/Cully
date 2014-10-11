using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.ServiceModel.Web;

using ThinkInBio.FileTransfer;
using ThinkInBio.Common.Exceptions;
using ThinkInBio.Common.ExceptionHandling;
using ThinkInBio.CommonApp.BLL;
using ThinkInBio.Cully;
using ThinkInBio.Cully.BLL;

namespace ThinkInBio.Cully.WSL.Impl
{

    public class ProjectWcfService : IProjectWcfService
    {

        internal IProjectService ProjectService { get; set; }
        internal IFileTransferLogService FileTransferLogService { get; set; }
        internal ICommentService CommentService { get; set; }
        internal IExceptionHandler ExceptionHandler { get; set; }

        #region project

        public Project SaveProject(string user, string name, string description, string[] participants,
            string createSameNameActivity, string category)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new WebFaultException<string>("name", HttpStatusCode.BadRequest);
            }
            if (!string.IsNullOrWhiteSpace(description) && description.Length > 255)
            {
                throw new WebFaultException<string>("The length of description should be less than 255.", HttpStatusCode.BadRequest);
            }
            bool createSameNameActivityBool = false;
            try
            {
                createSameNameActivityBool = Convert.ToBoolean(createSameNameActivity);
            }
            catch
            {
                throw new WebFaultException<string>("createSameNameActivity", HttpStatusCode.BadRequest);
            }

            try
            {
                Project project = new Project();
                project.Name = name;
                project.Description = description;
                project.Creator = user;
                if (createSameNameActivityBool)
                {
                    Activity activity = new Activity();
                    activity.Category = category;
                    activity.Name = name;
                    activity.Description = description;
                    activity.Creator = user;
                    project.Save(participants, activity,
                        (e1, e2, e3) =>
                        {
                            ProjectService.SaveProject(e1, e2, e3);
                        });
                }
                else
                {
                    project.Save(participants,
                        (e1, e2) =>
                        {
                            ProjectService.SaveProject(e1, e2);
                        });
                }

                return project;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Project UpdateProject(string projectId, string name, string description)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new WebFaultException<string>("name", HttpStatusCode.BadRequest);
            }
            if (!string.IsNullOrWhiteSpace(description) && description.Length > 255)
            {
                throw new WebFaultException<string>("The length of description should be less than 255.", HttpStatusCode.BadRequest);
            }
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(projectId);
            }
            catch
            {
                throw new WebFaultException<string>("projectId", HttpStatusCode.BadRequest);
            }

            try
            {
                Project project = ProjectService.GetProject(idLong);
                if (project == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                project.Name = name;
                project.Description = description;
                project.Update((e) =>
                {
                    ProjectService.UpdateProject(e);
                });
                return project;
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

        public void DeleteProject(string projectId)
        {
            throw new NotImplementedException();
        }

        public Project GetProject(string projectId)
        {
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(projectId);
            }
            catch
            {
                throw new WebFaultException<string>("projectId", HttpStatusCode.BadRequest);
            }

            try
            {
                return ProjectService.GetProject(idLong);
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Project[] GetTopProjectList(string user, string isSoloInclude, string count)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            bool isSoloIncludeBool = false;
            try
            {
                isSoloIncludeBool = Convert.ToBoolean(isSoloInclude);
            }
            catch
            {
                throw new WebFaultException<string>("isSoloInclude", HttpStatusCode.BadRequest);
            }
            bool? isSolo = isSoloIncludeBool ? null : new bool?(false);
            int countInt = 0;
            try
            {
                countInt = Convert.ToInt32(count);
            }
            catch
            {
                throw new WebFaultException<string>("count", HttpStatusCode.BadRequest);
            }

            try
            {
                IList<Project> list = ProjectService.GetTopProjectList(user, isSolo, countInt);
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

        public Project[] GetProjectList(string user, string isSoloInclude, string date, string span, string start, string count)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }

            bool isSoloIncludeBool = false;
            try
            {
                isSoloIncludeBool = Convert.ToBoolean(isSoloInclude);
            }
            catch
            {
                throw new WebFaultException<string>("isSoloInclude", HttpStatusCode.BadRequest);
            }
            bool? isSolo = isSoloIncludeBool ? null : new bool?(false);

            DateTime d = DateTime.MinValue;
            int spanInt = 0;
            if ("null" != date && "null" != span)
            {
                try
                {
                    d = DateTime.Parse(date);
                }
                catch
                {
                    throw new WebFaultException<string>("date", HttpStatusCode.BadRequest);
                }
                try
                {
                    spanInt = Convert.ToInt32(span);
                }
                catch
                {
                    throw new WebFaultException<string>("span", HttpStatusCode.BadRequest);
                }
            }

            int startInt = 0;
            try
            {
                startInt = Convert.ToInt32(start);
            }
            catch
            {
                throw new WebFaultException<string>("start", HttpStatusCode.BadRequest);
            }
            int countInt = 0;
            try
            {
                countInt = Convert.ToInt32(count);
            }
            catch
            {
                throw new WebFaultException<string>("count", HttpStatusCode.BadRequest);
            }

            DateTime? startTime = null;
            DateTime? endTime = null;
            if ("null" != date && "null" != span)
            {
                if (spanInt < 0)
                {
                    startTime = d.AddDays(spanInt + 1);
                    endTime = new DateTime(d.Year, d.Month, d.Day, 23, 59, 59);
                }
                else
                {
                    startTime = new DateTime(d.Year, d.Month, d.Day);
                    endTime = d.AddDays(spanInt).AddSeconds(-1);
                }
            }
            try
            {
                IList<Project> list = ProjectService.GetProjectList(user, startTime, endTime, isSolo, startInt, countInt);
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

        #endregion

        #region activity

        public Activity SaveActivity(string user, string category, string name, string description, string[] participants)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(category))
            {
                throw new WebFaultException<string>("category", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new WebFaultException<string>("name", HttpStatusCode.BadRequest);
            }
            if (!string.IsNullOrWhiteSpace(description) && description.Length > 120)
            {
                throw new WebFaultException<string>("The length of description should be less than 120.", HttpStatusCode.BadRequest);
            }

            try
            {
                Activity activity = new Activity();
                activity.Category = category;
                activity.Name = name;
                activity.Description = description;
                activity.Creator = user;
                activity.Save(user, participants, (e1, e2, e3) =>
                {
                    ProjectService.SaveActivity(e1, e2, e3);
                });
                return activity;
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Activity SaveActivity(string projectId, string user, string category, string name, string description)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(projectId);
            }
            catch
            {
                throw new WebFaultException<string>("projectId", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(category))
            {
                throw new WebFaultException<string>("category", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new WebFaultException<string>("name", HttpStatusCode.BadRequest);
            }
            if (!string.IsNullOrWhiteSpace(description) && description.Length > 120)
            {
                throw new WebFaultException<string>("The length of description should be less than 120.", HttpStatusCode.BadRequest);
            }

            try
            {
                Project project = ProjectService.GetProject(idLong);
                if (project == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                Activity activity = new Activity();
                activity.Category = category;
                activity.Name = name;
                activity.Description = description;
                activity.Creator = user;
                activity.Save(project,
                    (e) =>
                    {
                        return ProjectService.IsAnyActivityExisted(e);
                    },
                    (e1, e2, e3) =>
                    {
                        ProjectService.SaveActivity(e1, e2, e3);
                    });
                return activity;
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

        public Activity UpdateActivity(string activityId, string category, string name, string description)
        {
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(activityId);
            }
            catch
            {
                throw new WebFaultException<string>("activityId", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(category))
            {
                throw new WebFaultException<string>("category", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new WebFaultException<string>("name", HttpStatusCode.BadRequest);
            }
            if (!string.IsNullOrWhiteSpace(description) && description.Length > 120)
            {
                throw new WebFaultException<string>("The length of description should be less than 120.", HttpStatusCode.BadRequest);
            }

            try
            {
                Activity activity = ProjectService.GetActivity(idLong);
                if (activity == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                activity.Category = category;
                activity.Name = name;
                activity.Description = description;
                ProjectService.UpdateActivity(activity);
                return activity;
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

        public Activity GetActivity(string activityId)
        {
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(activityId);
            }
            catch
            {
                throw new WebFaultException<string>("activityId", HttpStatusCode.BadRequest);
            }

            try
            {
                return ProjectService.GetActivity(idLong);
            }
            catch (Exception ex)
            {
                ExceptionHandler.HandleException(ex);
                throw new WebFaultException(HttpStatusCode.InternalServerError);
            }
        }

        public Activity[] GetActivityList(string user, string start, string count)
        {
            throw new NotImplementedException();
        }

        public Activity[] GetActivityList(string user, string date, string span, string start, string count)
        {
            throw new NotImplementedException();
        }

        public Activity[] GetActivityList(string user, string category, string date, string span, string start, string count)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(category))
            {
                throw new WebFaultException<string>("category", HttpStatusCode.BadRequest);
            }
            if ("null" == category)
            {
                category = null;
            }

            DateTime d = DateTime.MinValue;
            int spanInt = 0;
            if ("null" != date && "null" != span)
            {
                try
                {
                    d = DateTime.Parse(date);
                }
                catch
                {
                    throw new WebFaultException<string>("date", HttpStatusCode.BadRequest);
                }
                try
                {
                    spanInt = Convert.ToInt32(span);
                }
                catch
                {
                    throw new WebFaultException<string>("span", HttpStatusCode.BadRequest);
                }
            }

            int startInt = 0;
            try
            {
                startInt = Convert.ToInt32(start);
            }
            catch
            {
                throw new WebFaultException<string>("start", HttpStatusCode.BadRequest);
            }
            int countInt = 0;
            try
            {
                countInt = Convert.ToInt32(count);
            }
            catch
            {
                throw new WebFaultException<string>("count", HttpStatusCode.BadRequest);
            }

            DateTime? startTime = null;
            DateTime? endTime = null;
            if ("null" != date && "null" != span)
            {
                if (spanInt < 0)
                {
                    startTime = d.AddDays(spanInt + 1);
                    endTime = new DateTime(d.Year, d.Month, d.Day, 23, 59, 59);
                }
                else
                {
                    startTime = new DateTime(d.Year, d.Month, d.Day);
                    endTime = d.AddDays(spanInt).AddSeconds(-1);
                }
            }

            try
            {
                IList<Activity> list = ProjectService.GetActivityList(user, startTime, endTime, category, startInt, countInt);
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

        public Activity[] GetActivityList(string projectId)
        {
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(projectId);
            }
            catch
            {
                throw new WebFaultException<string>("projectId", HttpStatusCode.BadRequest);
            }

            try
            {
                IList<Activity> list = ProjectService.GetActivityList(idLong);
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

        #endregion

        #region participant

        public Participant SaveParticipant(string projectId, string participant)
        {
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(projectId);
            }
            catch
            {
                throw new WebFaultException<string>("projectId", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(participant))
            {
                throw new WebFaultException<string>("participant", HttpStatusCode.BadRequest);
            }

            try
            {
                Project project = ProjectService.GetProject(idLong);
                if (project == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                return project.AddParticipant(participant, null, (e) =>
                {
                    ProjectService.SaveParticipant(e);
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

        public void DeleteParticipant(string projectId, string participant)
        {
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(projectId);
            }
            catch
            {
                throw new WebFaultException<string>("projectId", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(participant))
            {
                throw new WebFaultException<string>("participant", HttpStatusCode.BadRequest);
            }

            try
            {
                Project project = ProjectService.GetProject(idLong);
                if (project == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                project.RemoveParticipant(participant,
                    (e) =>
                    {
                        return ProjectService.GetParticipantList(e);
                    },
                    (e) =>
                    {
                        ProjectService.DeleteParticipant(e);
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

        public Participant[] GetParticipantList(string projectId)
        {
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(projectId);
            }
            catch
            {
                throw new WebFaultException<string>("projectId", HttpStatusCode.BadRequest);
            }

            try
            {
                IList<Participant> list = ProjectService.GetParticipantList(idLong);
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

        #endregion

        #region attachment

        public Attachment SaveAttachment(string projectId, string user, UploadFile uploadFile)
        {
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(projectId);
            }
            catch
            {
                throw new WebFaultException<string>("projectId", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            if (uploadFile == null)
            {
                throw new WebFaultException<string>("uploadFile", HttpStatusCode.BadRequest);
            }

            try
            {
                Project project = ProjectService.GetProject(idLong);
                if (project == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                return project.AddAttachment(user, uploadFile,
                    (e1, e2) =>
                    {
                        ProjectService.SaveAttachment(e1, e2);
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

        public void DeleteAttachment(string projectId, string attachmentId)
        {
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(projectId);
            }
            catch
            {
                throw new WebFaultException<string>("projectId", HttpStatusCode.BadRequest);
            }
            long attachmentIdLong = 0;
            try
            {
                attachmentIdLong = Convert.ToInt64(attachmentId);
            }
            catch
            {
                throw new WebFaultException<string>("attachmentId", HttpStatusCode.BadRequest);
            }

            try
            {
                Project project = ProjectService.GetProject(idLong);
                if (project == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                Attachment attachment = ProjectService.GetAttachment(attachmentIdLong);
                if (attachment == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                project.RemoveAttachment(attachment,
                    (e) =>
                    {
                        return FileTransferLogService.GetFileTransferLog(attachment.Path);
                    },
                    (e1, e2) =>
                    {
                        ProjectService.DeleteAttachment(e1, e2);
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

        public Attachment[] GetAttachmentList(string projectId)
        {
            long idLong = 0;
            try
            {
                idLong = Convert.ToInt64(projectId);
            }
            catch
            {
                throw new WebFaultException<string>("projectId", HttpStatusCode.BadRequest);
            }
            try
            {
                IList<Attachment> list = ProjectService.GetAttachmentList(idLong);
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

        public Comment SaveAttachmentComment(string attachmentId, string user, string content)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new WebFaultException<string>("user", HttpStatusCode.BadRequest);
            }
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new WebFaultException<string>("content", HttpStatusCode.BadRequest);
            }
            long attachmentIdLong = 0;
            try
            {
                attachmentIdLong = Convert.ToInt64(attachmentId);
            }
            catch
            {
                throw new WebFaultException<string>("attachmentId", HttpStatusCode.BadRequest);
            }

            try
            {
                Attachment attachment = ProjectService.GetAttachment(attachmentIdLong);
                if (attachment == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                return attachment.AddRemark(user, content,
                    (e1, e2, e3) =>
                    {
                        ProjectService.SaveAttachmentComment(e1, e2, e3);
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

        public void DeleteAttachmentComment(string attachmentId, string commentId)
        {
            long attachmentIdLong = 0;
            try
            {
                attachmentIdLong = Convert.ToInt64(attachmentId);
            }
            catch
            {
                throw new WebFaultException<string>("attachmentId", HttpStatusCode.BadRequest);
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
                Attachment attachment = ProjectService.GetAttachment(attachmentIdLong);
                if (attachment == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                Comment comment = CommentService.GetComment(commentIdLong);
                if (comment == null)
                {
                    throw new WebFaultException(HttpStatusCode.NotFound);
                }
                attachment.RemoveRemark(comment,
                    (e1, e2, e3) =>
                    {
                        ProjectService.DeleteAttachmentComment(e1, e2, e3);
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

        #endregion

    }

}
