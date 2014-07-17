﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

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

        public Project[] GetTopProjectList(string user, string count)
        {
            if (string.IsNullOrWhiteSpace(user))
            {
                throw new ArgumentNullException("user");
            }
            /*
             * 验证用户的合法性逻辑暂省略。
             * */

            int countInt = Convert.ToInt32(count);
            IList<Project> list = ProjectService.GetTopProjectList(user, countInt);
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

            int startInt = Convert.ToInt32(start);
            int countInt = Convert.ToInt32(count);
            IList<Activity> list = ProjectService.GetActivityList(user, startInt, countInt);
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
