using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.ServiceModel.Web;

using ThinkInBio.Cully;

namespace ThinkInBio.Cully.WSL
{

    [ServiceContract]
    public interface ICautionCalendarWcfService
    {

        [OperationContract]
        [WebGet(UriTemplate = "/calendar/{year}/{month}/{day}/{user}/caution/",
            RequestFormat = WebMessageFormat.Json,
            ResponseFormat = WebMessageFormat.Json)]
        Calendar[] GetCalendarList(string year, string month, string day, string user);

    }
}
