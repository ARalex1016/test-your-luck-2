import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

// Store
import useStore from "../../Store/useStore";

// Components
import ContainerContestCard from "../../Components/ContainerContestCard";
import ContestCard from "../../Components/ContestCard/ContestCard";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, contest, isAuthenticated } = useStore();

  const [referralUrl, setReferralUrl] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referral = params.get("referral");

    if (referral) {
      localStorage.setItem("referralLink", referral);
    }
  }, [location]);

  useEffect(() => {
    const rootUrl = `${window.location.protocol}//${window.location.host}`;

    const userId = `${isAuthenticated ? "?referral=" + user._id : ""}`;

    setReferralUrl(`${rootUrl}/${userId}`);
  }, [isAuthenticated]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);

      toast.success("Link Copied Successfully!");
    } catch (error) {}
  };

  const runningContests = contest?.filter((c) => c.status === "running") || [];

  const upcomingContests =
    contest?.filter((c) => c.status === "upcoming") || [];

  return (
    <>
      <section className="mt-menuHeight px-paddingX py-2">
        {/* Register Button */}
        {!isAuthenticated && (
          <button
            onClick={() => navigate("/signup")}
            className={
              "font-bold text-secondary text-center bg-red-600 rounded-md transition-all duration-300 px-2 py-1 mb-2"
            }
          >
            Register
          </button>
        )}

        {/* Navigate to Contest */}
        <p className="text-secondaryDim text-lg font-normal text-center">
          <span
            onClick={() => navigate("/contest")}
            className="text-green underline font-bold"
          >
            Click here
          </span>{" "}
          to see all <b>Contest</b>
        </p>

        <br />
        <hr />

        {/* Running Contest */}
        <h2 className="text-secondary text-xl font-medium text-center">
          Live Contests
        </h2>

        <ContainerContestCard>
          {runningContests.length > 0 ? (
            runningContests.map((contest) => {
              return (
                <Link to={`/contest/${contest._id}`} key={contest._id}>
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
                <Link to={`/contest/${contest._id}`} key={contest._id}>
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

        {/* Referral Title */}
        <h2 className="text-yellow-400 text-2xl font-medium text-center mt-4 mb-2">
          Referral
        </h2>

        {/* Referral Link */}
        <section className="w-full flex flex-col justify-center gap-y-4">
          <div className="w-full bg-white rounded-t-lg overflow-hidden">
            <input
              type="text"
              value={referralUrl}
              readOnly
              onCopy={(e) => e.preventDefault()}
              className="w-full text-base font-medium text-center rounded px-4 py-2 outline-none notSelectable"
            />
            <button
              onClick={handleCopy}
              className="w-full text-secondaryDim text-lg font-medium text-center bg-blueTransparent border-2 border-transparent active:border-secondary active:scale-x-[.99]"
            >
              Click here to Copy
            </button>
          </div>

          {/* Referral Rules */}
          <div>
            <p className="text-yellow-400 text-left text-xl font-medium">
              Referral Bonus / Share & Earn
            </p>

            <ul className="text-white text-sm">
              <li className="before:content-['⭐'] before:mr-2">
                <b>Copy & Share the Link </b>to your friends
              </li>
              <li className="before:content-['⭐'] before:mr-2">
                You'll get <b>20 coins</b> for each Friends that <b>Register</b>{" "}
                and <b>Participate</b> in any 1 Contest (atleast)
              </li>
              <li className="before:content-['⭐'] before:mr-2">
                You can <b>Exchange</b> the coins to buy <b>Tickets</b> of any
                Ongoing Contests (that you have participated)
              </li>
            </ul>
          </div>
        </section>

        {/* Navigate to Referral */}
        {isAuthenticated && (
          <p className="text-secondaryDim text-lg font-normal text-center m-2">
            <span
              onClick={() => navigate("/referral")}
              className="text-green underline font-bold"
            >
              Click here
            </span>{" "}
            to see all <b>Your Referrals</b>
          </p>
        )}
      </section>
    </>
  );
};

export default Home;
