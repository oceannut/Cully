using System;
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

        public Project SaveProject(string name, string description, string[] staffs)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentNullException();
            }
            if (!string.IsNullOrWhiteSpace(description) && description.Length > 120)
            {
                throw new ArgumentOutOfRangeException();
            }
            Project project = new Project();
            project.Name = name;
            project.Description = description;
            project.Save(staffs,
                (e1, e2) =>
                {
                    ProjectService.SaveProject(e1, e2);
                });

            return project;
        }

    }

}
