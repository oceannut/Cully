using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using ThinkInBio.Common.Exceptions;
using ThinkInBio.Cully;
using ThinkInBio.Cully.BLL;

namespace ThinkInBio.Cully.WSL.Impl
{

    public class ProjectWcfService : IProjectWcfService
    {

        internal IProjectService ProjectService { get; set; }

        public Project SaveProject(string user, string name, string description, string[] participants)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentNullException("name");
            }
            if (!string.IsNullOrWhiteSpace(description) && description.Length > 120)
            {
                throw new ArgumentOutOfRangeException("description", description.Length, "");
            }
            Project project = new Project();
            project.Name = name;
            project.Description = description;
            project.Creator = user;
            project.Save(participants,
                (e1, e2) =>
                {
                    ProjectService.SaveProject(e1, e2);
                });

            return project;
        }

        public Project GetProject(string user, string projectId)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            Project project = ProjectService.GetProject(Convert.ToInt64(projectId));
            return project;
        }

        public Project[] GetTopProjectList(string user, string isSoloInclude, string count)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            bool isSoloIncludeBool= Convert.ToBoolean(isSoloInclude);
            bool? isSolo = isSoloIncludeBool ? null : new bool?(false);
            int countInt = Convert.ToInt32(count);
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

        public Project[] GetProjectList(string user, string isSoloInclude, string date, string span, string start, string count)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            DateTime? startTime = null;
            DateTime? endTime = null;
            if ("null" != date && "null" != span)
            {
                DateTime d = DateTime.Parse(date);
                int spanInt = Convert.ToInt32(span);
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
            bool isSoloIncludeBool = Convert.ToBoolean(isSoloInclude);
            bool? isSolo = isSoloIncludeBool ? null : new bool?(false);
            int startInt = Convert.ToInt32(start);
            int countInt = Convert.ToInt32(count);
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

        public Activity SaveActivity(string user, string category, string name, string description, string[] participants)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(category))
            {
                throw new ArgumentNullException("category");
            }
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentNullException("name");
            }
            if (!string.IsNullOrWhiteSpace(description) && description.Length > 120)
            {
                throw new ArgumentOutOfRangeException("description", description.Length, "");
            }
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

        public Activity SaveActivity(string user, string projectId, string category, string name, string description)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            long projectIdLong = Convert.ToInt64(projectId);
            if (string.IsNullOrWhiteSpace(category))
            {
                throw new ArgumentNullException("category");
            }
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentNullException("name");
            }
            if (!string.IsNullOrWhiteSpace(description) && description.Length > 120)
            {
                throw new ArgumentOutOfRangeException("description", description.Length, "");
            }
            Activity activity = new Activity();
            activity.Category = category;
            activity.Name = name;
            activity.Description = description;
            activity.ProjectId = projectIdLong;
            activity.Creator = user;
            activity.Save((e) =>
            {
                ProjectService.SaveActivity(e);
            });

            return activity;
        }

        public Activity GetActivity(string user, string activityId)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            long activityIdLong = Convert.ToInt64(activityId);
            return ProjectService.GetActivity(activityIdLong);
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
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */
            if ("null" == category)
            {
                category = null;
            }
            DateTime? startTime = null;
            DateTime? endTime = null;
            if ("null" != date && "null" != span)
            {
                DateTime d = DateTime.Parse(date);
                int spanInt = Convert.ToInt32(span);
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
            int startInt = Convert.ToInt32(start);
            int countInt = Convert.ToInt32(count);
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

        public Activity[] GetActivityList(string user, string projectId)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            long projectIdLong = Convert.ToInt64(projectId);
            IList<Activity> list = ProjectService.GetActivityList(projectIdLong);
            if (list != null)
            {
                return list.ToArray();
            }
            else
            {
                return null;
            }
        }

        public Participant SaveParticipant(string user, string projectId, string participant)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(participant))
            {
                throw new ArgumentNullException();
            }
            Project project = ProjectService.GetProject(Convert.ToInt64(projectId));
            if (project == null)
            {
                throw new ObjectNotFoundException(projectId);
            }
            return project.AddParticipant(participant, null, (e) =>
            {
                ProjectService.SaveParticipant(e);
            });
        }

        public void DeleteParticipant(string user, string projectId, string participant)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            if (string.IsNullOrWhiteSpace(participant))
            {
                throw new ArgumentNullException();
            }
            long projectIdLong = Convert.ToInt64(projectId);
            Project project = ProjectService.GetProject(projectIdLong);
            if (project == null)
            {
                throw new ObjectNotFoundException(projectId);
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

        public Participant[] GetParticipantList(string user, string projectId)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            long projectIdLong = Convert.ToInt64(projectId);
            IList<Participant> list = ProjectService.GetParticipantList(projectIdLong);
            if (list != null)
            {
                return list.ToArray();
            }
            else
            {
                return null;
            }
        }

    }

}
