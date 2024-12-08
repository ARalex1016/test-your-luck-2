import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Store
import useStore from "../../Store/useStore";

// Components
import ContestCard from "../ContestCard/ContestCard";

const ParticipatedContest = () => {
  const { user, contest } = useStore();

  const participatedContest = contest?.filter((contest) =>
    user?.participatedContest.includes(contest._id)
  );

  return (
    <>
      <div className="mt-4">
        <h2 className="text-xl text-white font-bold pb-4">
          Participated Contest
        </h2>

        <section className="flex flex-col gap-y-10">
          {user.participatedContest.length > 0 ? (
            participatedContest.map((contest) => {
              return (
                <Link key={contest._id} to={`/contest/${contest._id}`}>
                  <ContestCard contest={contest} />
                </Link>
              );
            })
          ) : (
            <div>
              <p className="text-primary font-semibold text-center bg-yellow-500">
                You didn't participated in any contest yet
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default ParticipatedContest;
