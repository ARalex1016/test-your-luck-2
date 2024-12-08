import { useState } from "react";
import { Link } from "react-router-dom";

// Store
import useStore from "../../Store/useStore";

// Components
import ContainerContestCard from "../../Components/ContainerContestCard";
import ContestCard from "../../Components/ContestCard/ContestCard";
import CreateContest from "../../Components/CreateContest";

const Contest = () => {
  const { user, contest, isAuthenticated } = useStore();

  const [isOpenWindow, setIsOpenWindow] = useState(false);

  const closeWindow = () => {
    setIsOpenWindow(false);
  };

  const runningContests = contest?.filter((c) => c.status === "running") || [];

  const upcomingContests =
    contest?.filter((c) => c.status === "upcoming") || [];

  const finishedContests =
    contest?.filter((c) => c.status === "finished") || [];

  return (
    <>
      <main className="w-full mt-menuHeight px-paddingX pb-10 overflow-y-auto">
        {/* CreateContest Component */}
        <CreateContest isOpenWindow={isOpenWindow} closeWindow={closeWindow} />

        {/* Button Create Contest => Admin */}
        {isAuthenticated && user && user.role === "admin" && (
          <div className="w-full flex justify-end">
            <button
              onClick={() => setIsOpenWindow(true)}
              className="text-secondary font-medium bg-blue px-3 py-2 rounded-md shadow-md shadow-blueTransparent"
            >
              Create New Contest
            </button>
          </div>
        )}

        {/* Running Contest */}
        <h2 className="text-xl text-white font-bold mb-4">Running Contest</h2>

        <ContainerContestCard>
          {runningContests.length > 0 ? (
            runningContests.map((contest) => {
              return (
                <Link to={contest._id} key={contest._id}>
                  <ContestCard contest={contest} />
                </Link>
              );
            })
          ) : (
            <p className="text-red-500 text-lg font-semibold">
              There are no running contests right now.
            </p>
          )}
        </ContainerContestCard>

        <br />
        <hr />

        {/* Upcoming Contest */}
        <h2 className="text-xl text-white font-bold mt-6 mb-4">
          Upcoming Contest
        </h2>

        <ContainerContestCard>
          {upcomingContests.length > 0 ? (
            upcomingContests.map((contest) => {
              return (
                <Link to={contest._id} key={contest._id}>
                  <ContestCard contest={contest} />
                </Link>
              );
            })
          ) : (
            <p className="text-red-500 text-lg font-semibold">
              There are no Upcoming Contests right now.
            </p>
          )}
        </ContainerContestCard>

        <br />
        <hr />

        {/* Finished Contest */}
        <h2 className="text-xl text-white font-bold mt-6 mb-4">
          Finished Contest
        </h2>

        <ContainerContestCard>
          {finishedContests.length > 0 ? (
            finishedContests.map((contest) => {
              return (
                <Link
                  to={contest.winningTicket ? "#" : `/contest/${contest._id}`}
                  key={contest._id}
                >
                  <ContestCard contest={contest} />
                </Link>
              );
            })
          ) : (
            <p className="text-red-500 text-lg font-semibold">
              There are no Finished Contests right now.
            </p>
          )}
        </ContainerContestCard>
      </main>
    </>
  );
};

export default Contest;
