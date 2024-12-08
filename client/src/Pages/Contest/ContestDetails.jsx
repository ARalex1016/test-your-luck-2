import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Icons
import { Equal } from "lucide-react";

// Store
import useStore from "../../Store/useStore";

// Components
import Timer from "../../Components/Timer";

// Utils
import { getPercentage } from "../../Utils/numberManager.js";
import { formatDate } from "../../Utils/dateManager.js";

const ContestDetails = () => {
  const navigate = useNavigate();
  const { contestId } = useParams();
  const { user, getContest } = useStore();

  const [contest, setContest] = useState(null);
  const [myTickets, setMyTickets] = useState([]);

  // Get Contest
  useEffect(() => {
    const fetchContest = async (contestId) => {
      try {
        const contest = await getContest(contestId);

        setContest(contest);
      } catch (error) {}
    };

    fetchContest(contestId);
  }, [contestId, getContest]);

  useEffect(() => {
    if (user && contest?.allTickets?.length > 0) {
      setMyTickets(
        contest?.allTickets?.filter((ticket) => ticket.userId === user._id)
      );
    }
  }, [contest, user]);

  const participated = useMemo(() => {
    return user?.participatedContest.includes(contest?._id) || false;
  }, [user, contest]);

  const currency = import.meta.env.VITE_SERVER_CURRENCY;
  const player = user?.role === "player";

  return (
    <>
      {contest && (
        <main className="mt-menuHeight px-paddingX flex flex-col justify-center items-center gap-y-3 pb-8">
          {/* Timer */}
          <div
            className={`w-screen px-2 z-10 flex flex-col justify-center items-center
          ${contest.status === "running" && "bg-greenTransparent"} ${
              contest.status === "upcoming" && "bg-blueTransparent"
            } ${contest.status === "finished" && "bg- px-6"}`}
          >
            {contest.status === "running" || contest.status === "upcoming" ? (
              <>
                <p
                  className={`text-secondary text-base font-bold ${
                    contest.status === "running" && "text-blue"
                  }`}
                >
                  {contest.status === "running" ? "Live Now" : "Starts In"}
                </p>
                <Timer
                  endDate={contest.endDate}
                  className={`text-4xl ${
                    contest.status === "running" && "text-blue"
                  }`}
                />
              </>
            ) : (
              <p className="text-secondary text-lg font-bold">
                {contest.status.toUpperCase()}
              </p>
            )}
          </div>

          {/* Image */}
          <img
            src={contest.imageUrl}
            alt={`${contest.title}-Image`}
            className="w-full aspect-video object-cover text-primary bg-secondaryDim rounded-md"
          />

          {/* Title */}
          <h2 className="w-full text-greenTransparent text-xl text-center font-bold">
            {contest.title}
          </h2>

          {/* Prize */}
          <p className="text-secondaryDim text-lg text-center">
            Win Brand New{" "}
            <span className="text-greenTransparent font-bold">
              {contest.prize}
            </span>
          </p>

          {/* Entry Fee */}
          <p className="text-white text-2xl font-medium">
            {participated ? "Ticket Rate" : "Entry Fee"} :{" "}
            <span className="text-yellow-400 text-3xl font-bold">
              {currency}
              {contest.entryFee}
            </span>
          </p>

          {/* Buton to Participate */}
          {player && contest.status === "running" && (
            <button
              onClick={() => navigate(`/contest/${contestId}/participate`)}
              className="w-2/3 text-2xl text-white font-bold bg-accent rounded-md py-1"
            >
              {participated ? "Buy More Tickets" : "Participate"}
            </button>
          )}

          <p className="text-secondaryDim">OR</p>

          {/* Ticket Price in Coins Display */}
          <div className="w-2/3 flex flex-row justify-around">
            <p className="w-2/5 text-base text-center bg-secondaryDim rounded-sm">
              <b>1</b> Ticket
            </p>
            <Equal className="text-secondaryDim" />
            <p className="w-2/5 text-base text-center bg-secondaryDim rounded-sm">
              <b>{contest?.coinEntryFee}</b> Coin(s)
            </p>
          </div>

          {/* Button to Exchange Coins */}
          {player && participated && contest.status === "running" ? (
            <button
              onClick={() => navigate(`/contest/${contestId}/exchange-coin`)}
              className="w-1/2 text-xl text-primary font-medium bg-yellow-300 rounded-md py-1"
            >
              Exchange Coins
            </button>
          ) : (
            <p className="text-secondaryDim text-center text-xs">
              <b>Note: </b> You Need to <b>Participate First</b> to be able
              Exchange your Coins
            </p>
          )}

          {/* Date Details */}
          {contest.status !== "finished" && (
            <div className="w-full text-secondary border border-dashed border-white rounded-md flex flex-row flex-wrap justify-around gap-x-4 px-2 py-1 mt-4">
              <div className="mobilesm:text-xs mobile:text-base">
                Starts on:{" "}
                <span className="mobilesm:text-sm mobile:text-lg font-bold">
                  {formatDate(contest.startDate)}
                </span>
              </div>

              <div className="mobilesm:text-xs mobile:text-base">
                Ends on:{" "}
                <span className="mobilesm:text-sm mobile:text-lg font-bold">
                  {formatDate(contest.endDate)}
                </span>
              </div>
            </div>
          )}

          {/* Ticket Dashboard */}
          <div
            className="w-full rounded-lg flex flex-col px-1 pt-4 pb-8 gap-y-4"
            style={{
              boxShadow: "inset -2px -2px 6px hsl(0, 0%, 100%, .9)",
            }}
          >
            {/* Title */}
            <h2
              className="text-secondaryDim text-2xl font-bold text-center col-span-2"
              style={{
                textShadow: "0px 0px 10px hsl(0, 0%, 100%, .7)",
              }}
            >
              Tickets Dashboard
            </h2>

            {/* Tickets Count */}
            <div className="flex flex-row justify-around gap-x-2">
              {/* Your Ticket Count */}
              {user && (
                <p className="text-white text-sm text-center px-2">
                  Your Tickects :{" "}
                  <span
                    className="text-green text-xl text-left font-bold inline-block"
                    style={{
                      width: "3ch",
                    }}
                  >
                    {participated ? `${myTickets.length}` : "0"}
                  </span>
                </p>
              )}

              {/* Total Ticket Sold Count */}
              <p className="text-white text-sm text-center px-2">
                Tickets Sold :{" "}
                <span
                  className="text-green text-xl text-left font-bold inline-block"
                  style={{
                    width: "4ch",
                  }}
                >
                  {contest.allTickets.length}
                </span>
              </p>
            </div>

            {/* Winning Chance */}
            {user && (
              <p className="text-white text-center col-span-2">
                Your Winning Chance:{" "}
                <span
                  className="text-xl font-bold"
                  style={{
                    textShadow: "0px 0px 10px hsl(0, 0%, 100%, .9)",
                  }}
                >
                  {`${getPercentage(
                    myTickets.length,
                    contest.allTickets.length
                  )}%`}
                </span>
              </p>
            )}

            {/* Your Tickets */}
            {user && participated ? (
              <div className="w-full col-span-2">
                <p className="text-yellow-300 text-lg font-medium text-center">
                  Your Tickets
                </p>

                <div className="w-full col-span-2 flex flex-row flex-wrap justify-center px-2 gap-4 mt-2">
                  {myTickets.map((ticket) => {
                    return (
                      <div
                        key={ticket._id}
                        className="text-secondary text-base font-medium bg-greenTransparent rounded shadow-sm shadow-greenTransparent px-2 py-1"
                      >
                        {ticket.ticketNo}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-white text-sm text-center">
                <b>Participate</b> to Get the Tickets and{" "}
                <b>Boost Your Chance to Win</b>
              </p>
            )}

            {/* Horixontal Line */}
            {user && participated && <hr className="col-span-2" />}

            {/* All tickets */}
            {contest.allTickets.length > 0 && (
              <div className="w-full col-span-2">
                <p className="text-yellow-300 text-lg font-medium text-center">
                  All Tickets
                </p>

                <div className="w-full col-span-2 flex flex-row flex-wrap justify-center gap-x-1 gap-y-2 px-2 mt-2">
                  {contest.allTickets?.map((ticket) => {
                    return (
                      <div
                        key={ticket._id}
                        className={`text-red-500 text-xs font-medium bg-secondaryDim rounded shadow-sm shadow-secondaryDim p-1  ${
                          participated &&
                          ticket.userId === user._id &&
                          " shadow-greenTransparent"
                        }`}
                        style={{
                          backgroundColor:
                            participated &&
                            ticket.userId === user._id &&
                            "hsl(105, 100%, 52%, .8)",
                          color:
                            participated &&
                            ticket.userId === user._id &&
                            "hsl(0, 0%, 100%)",
                        }}
                      >
                        {ticket.ticketNo}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Note for not logged users */}
          {!user && (
            <p className="text-white text-center">
              <span className="font-semibold">Note:</span> Sign up to see more
              details of the Contest
            </p>
          )}
        </main>
      )}
    </>
  );
};

export default ContestDetails;
