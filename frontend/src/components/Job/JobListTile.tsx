import { useEffect, useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useApplicationStore } from "../../store/ApplicationStore";
import { useUserStore } from "../../store/UserStore";
import { Button } from "@mui/material";

const JobListTile = (props: any) => {
  const navigate = useNavigate();

  const { data, onJobClicked }: { data: Job; onJobClicked: Function } = props;
  let action = "view-more";

  const getMatchStatus = (job: Job) => {
    let matchStatus = {
      text: "Low Match",
      style: { backgroundColor: "#FF5757", color: "white" },
    };

    const skills = useUserStore((state) => state.skills);
    if (skills && job.requiredSkills) {
      const applicantSkillsArray = skills.map((skill) =>
        skill.trim().toLowerCase()
      );
      const requiredSkillsArray = job.requiredSkills
        .map((skill) => skill.trim().toLowerCase());
      const isMatch = requiredSkillsArray.some((skill) =>
        applicantSkillsArray.includes(skill)
      );

      if (isMatch) {
        matchStatus = {
          text: "Match",
          style: { backgroundColor: "#00E000", color: "white" },
        };
      }
    }

    return matchStatus;
  };

  const [active, setActive] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = useUserStore((state) => state.id);

  const userRole = useUserStore((state) => state.role);

  const applicationList: Application[] = useApplicationStore(
    (state) => state.applicationList
  );

  const [application, setApplication] = useState<Application | null>(null);

  useEffect(() => {
    const temp: Application | undefined = applicationList.find(
      (item: Application) =>
        item.jobid === data._id && item.applicantid === userId
    );
    setApplication(temp || null);
  }, [data, applicationList, userId]);

  const affilation = data.managerAffilication;
  const role = data.name;
  const jobType = data?.type?.split("-")?.join(" ");
  const pay = data.pay || "0";

  useEffect(() => {
    const id = searchParams.get("jobId");
    setActive(data._id === id);
  }, [searchParams]);

  const handleClick = (e: any) => {
    e.preventDefault();
    onJobClicked(data._id);
    setSearchParams({ jobId: data._id });
  };

  const getAffiliationTag = (tag: string) => {
    return tag.split("-").join(" ");
  };

  const getAffiliationColour = (tag: string) => {
    if (tag === "nc-state-dining") {
      return "bg-[#FF2A2A]/10";
    } else if (tag === "campus-enterprises") {
      return "bg-[#91B0FF]/10";
    } else if (tag === "wolfpack-outfitters") {
      return "bg-[#FBD71E]/10";
    }
    return "bg-[#FF2A2A]/10";
  };

  // const isClosed = data.status !== "0";

  const handleApplicationChats = (e: any) => {
    e.stopPropagation();
    try {
      const params = new URLSearchParams();
      params.append("jobId", data._id);

      navigate({
        pathname: `/chat`,
        search: params.toString(),
      });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };
  const handleKnowMore = (e: any) => {
    e.stopPropagation();
  };
  const handleFillQuestionnaire = (e: any) => {
    e.stopPropagation();
  };
  const handleViewApplication = (e: any) => {
    e.stopPropagation();
  };
  return (
    <div className="my-3" onClick={handleClick}>
      <div
        className={`p-3 bg-white rounded-xl shadow-sm ${
          active ? "border-black" : "border-white"
        } border`}
      >
        <div className="flex flex-row">
          <div className="w-4/6">
            <div className="flex items-center space-x-2">
              <div
                className={`w-fit ${getAffiliationColour(
                  affilation
                )} rounded-2xl px-3 py-0`}
              >
                <p className="inline text-xs" style={{ width: "fit-content" }}>
                  {getAffiliationTag(affilation).toUpperCase()}
                </p>
              </div>
              {userRole === "Applicant" && (
                <div
                  className={`ml-2 rounded-full px-3 py-0`}
                  style={getMatchStatus(data).style}
                >
                  <p className="inline text-xs">{getMatchStatus(data).text}</p>
                </div>
              )}
            </div>
            <div className="h-1"></div>

            <div className="pl-2">
              <p className="text-base">
                <b>Role:</b> {role}
              </p>
              <p className="text-base">
                <b>Job Status:</b>
                <span
                  className={`${
                    data.status === "closed" ? "text-[#FF5353]" : ""
                  }`}
                >
                  &nbsp;<span className="capitalize">{data.status}</span>
                </span>
              </p>

              <p className="text-base">
                <b>Type:</b> <span className="capitalize"> {jobType} </span>
              </p>
              <p className="text-base">
                {userRole === "Applicant" &&
                  ((application !== null &&
                    application?.status === "accepted") ||
                  application?.status === "rejected" ? (
                    <span className="capitalize">
                      <b>Application Status:</b>&nbsp;{application?.status}
                    </span>
                  ) : (
                    <>
                      <b>Application Status:</b>&nbsp;"In Review"
                    </>
                  ))}
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse w-2/6 text-right">
            {userRole === "Manager" && (
              <Button
                className="inline-flex items-center flex-row-reverse text-xs text-[#656565]"
                onClick={handleApplicationChats}
              >
                Applicant Chats&nbsp;
              </Button>
            )}
            {action === "view-more" || !action ? (
              <p
                className="inline-flex items-center flex-row-reverse text-xs text-[#656565]"
                onClick={handleKnowMore}
              >
                <HiOutlineArrowRight />
                Know more&nbsp;
              </p>
            ) : (
              <></>
            )}
            {action === "view-questionnaire" ? (
              <p
                className="inline-flex items-center flex-row-reverse text-xs text-[#00B633]"
                onClick={handleFillQuestionnaire}
              >
                <HiOutlineArrowRight />
                Fill Questionnaire&nbsp;
              </p>
            ) : (
              <></>
            )}
            {action === "view-application" ? (
              <p
                className="inline-flex items-center flex-row-reverse text-xs text-[#656565]"
                onClick={handleViewApplication}
              >
                <HiOutlineArrowRight />
                View Application&nbsp;
              </p>
            ) : (
              <></>
            )}
            <p className="text-3xl">{pay}$/hr</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListTile;
