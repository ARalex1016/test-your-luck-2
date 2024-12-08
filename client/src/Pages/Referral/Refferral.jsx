import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Store
import useStore from "../../Store/useStore";

// Utils
import { formatDate } from "../../Utils/dateManager";

// Icons
import { FaCheckCircle } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";

const Refferral = () => {
  const { user, isAuthenticated, getReferrals } = useStore();
  const navigate = useNavigate();

  const [referrals, setReferrals] = useState([]);
  const [referralUrl, setReferralUrl] = useState(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const res = await getReferrals();

        setReferrals(res);
      } catch (error) {}
    };

    if (isAuthenticated) {
      fetchReferrals();
    }
  }, [getReferrals]);

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

  return (
    <>
      <main className="w-full mt-menuHeight px-paddingX flex flex-col gap-y-6 justify-center items-center">
        {/* Title */}
        <h2 className="text-yellow-400 text-2xl font-medium text-center">
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

        {/* Referral Table */}
        {isAuthenticated ? (
          <div className="w-full">
            <h2 className="text-yellow-400 text-left text-2xl font-medium">
              All Your Referrals
            </h2>

            <table className="w-full text-white bg-gray rounded-md">
              <thead className="text-accent text-base border-b-2">
                <tr className="h-8">
                  <th className="w-1/12">S.N</th>
                  <th className="w-4/12">Referrals</th>
                  <th className="w-4/12 text-sm break-words">
                    Date Of Registration
                  </th>
                  <th className="w-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {referrals && referrals.length > 0 ? (
                  referrals?.map((referral, index) => {
                    return (
                      <tr key={index} className="h-7 text-sm">
                        <td className="text-center">{index + 1}</td>

                        <td className="text-center">{referral.email}</td>

                        <td className="text-center">
                          {formatDate(referral.createdAt)}
                        </td>

                        <td className="text-center relative group">
                          {referral.firstPaid ? (
                            <div>
                              <FaCheckCircle className="text-green text-lg m-auto" />
                              <span className="absolute hidden z-20 group-hover:block bg-primary text-green text-xs rounded shadow-sm shadow-secondaryDim px-2 py-1">
                                This referral has made their first payment.
                              </span>
                            </div>
                          ) : (
                            <div>
                              <MdAccessTimeFilled className="text-red-500 text-lg m-auto" />
                              <span className="absolute hidden z-20 group-hover:block bg-primary text-red-500 text-xs rounded shadow-sm shadow-secondaryDim px-2 py-1">
                                This referral has not paid yet.
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="h-7 text-secondaryDim text-center"
                    >
                      You don't have any Referrals yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-red-500 font-medium text-center text-lg">
            <b onClick={() => navigate("/signup")} className="underline">
              Register
            </b>{" "}
            and Share Link to get Referral Bonus
          </p>
        )}
      </main>
    </>
  );
};

export default Refferral;
