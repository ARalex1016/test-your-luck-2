import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

// Store
import useStore from "../../Store/useStore";

// Icons
import { Plus, Minus, Equal, Loader } from "lucide-react";

// Components
import RevealTicketOnAnimation from "../../Components/RevealTicketOnAnimation";

const ExchangeCoin = () => {
  const { contestId } = useParams();
  const { user, isAuthenticated, getContest, exchangeCoin, checkAuth } =
    useStore();

  const [contest, setContest] = useState(null);
  const [requiredCoins, setRequiredCoins] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [canExchange, setCanExchange] = useState(false);
  const [newTickets, setNewTickets] = useState([]);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [isExchanging, setIsExchanging] = useState(false);

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
    if (contest) {
      setRequiredCoins(quantity * contest?.coinEntryFee);
    }
  }, [quantity, contest]);

  useEffect(() => {
    if (user) {
      if (quantity === 0) {
        setCanExchange(false);
      } else {
        if (requiredCoins > user?.coins) {
          setCanExchange(false);
        }
        if (requiredCoins <= user?.coins) {
          setCanExchange(true);
        }
      }
    }
  }, [requiredCoins, user]);

  const handleInputChnage = (e) => {
    const value = Number(e.target.value);

    setQuantity(value);
  };

  const handlePlus = () => {
    setQuantity((pre) => {
      if (pre >= 100) return pre;
      return pre + 1;
    });
  };

  const handleMinus = () => {
    setQuantity((pre) => {
      if (pre <= 1) return pre;
      return pre - 1;
    });
  };

  const handleExchange = async () => {
    if (!isAuthenticated) {
      return toast.error(
        "Please Sign Up first in order to Participate in a Contest"
      );
    }
    setIsExchanging(true);
    try {
      const res = await exchangeCoin(requiredCoins, contestId);

      toast.success(res.message);

      setNewTickets(res.data);
      setOpenPopUp(true);

      // Update Coins on Client
      user.coins -= requiredCoins;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsExchanging(false);
    }
  };

  return (
    <>
      <RevealTicketOnAnimation
        openPopUp={openPopUp}
        setOpenPopUp={setOpenPopUp}
        newTickets={newTickets}
      />

      {contest && (
        <main className="mt-menuHeight px-paddingX flex flex-col justify-center items-center gap-y-3 pb-8">
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

          {/* Ticket Price Display */}
          <div className="w-full flex flex-row justify-around mb-4">
            <p className="w-2/5 text-lg text-center bg-secondaryDim rounded-sm">
              <b>1</b> Ticket
            </p>
            <Equal className="text-secondaryDim" />
            <p className="w-2/5 text-lg text-center bg-secondaryDim rounded-sm">
              <b>{contest?.coinEntryFee}</b> Coin(s)
            </p>
          </div>

          {/* Message */}
          <p
            className={`w-full text-xs text-center  ${
              canExchange
                ? "text-secondaryDim bg-greenTransparent"
                : "text-secondaryDim bg-red-600"
            }`}
          >
            {!quantity
              ? "Invalid Quantity!"
              : canExchange
              ? `You can Exchange ${requiredCoins} coin(s) to buy ${quantity} ticket(s)`
              : "You don't have enough Coins!"}
          </p>

          {/* Your Coins */}
          {user && (
            <p className="text-yellow-200 font-medium">
              Your Total Coins:{" "}
              <span className="text-yellow-400 text-xl text-left font-bold inline-block">
                {user.coins}
              </span>
            </p>
          )}

          {/* Required Coins */}
          {user && (
            <p className="text-yellow-200 font-medium">
              Required Coins:{" "}
              <span className="text-yellow-400 text-xl text-left font-bold inline-block">
                {requiredCoins}
              </span>
            </p>
          )}

          {/* Quantity Display and Action */}
          <div className="w-full flex flex-col justify-center items-center gap-y-2">
            <h2 className="text-greenTransparent text-2xl font-medium">
              Quantity
            </h2>

            <div className="flex flex-row justify-center items-center gap-x-6">
              <Minus
                onClick={handleMinus}
                className="w-10 h-8 text-red-500 bg-secondaryDim rounded-sm"
              />

              <input
                type="number"
                value={quantity}
                min="1"
                max="100"
                onChange={(e) => handleInputChnage(e)}
                className="text-primary text-2xl font-medium text-center bg-secondaryDim aspect-video outline-accent border-none rounded-sm"
                style={{
                  width: "6ch",
                  appearance: "textfield",
                }}
              />

              <Plus
                onClick={handlePlus}
                className="w-10 h-8 text-green bg-secondaryDim rounded-sm"
              />
            </div>
          </div>

          <button
            disabled={!canExchange || isExchanging}
            onClick={handleExchange}
            className="w-full h-10 text-blue text-2xl font-medium bg-yellow-400 rounded-md py-1 mt-2 disabled:bg-gray-500 disabled:text-primary flex justify-center items-center"
          >
            {isExchanging ? (
              <Loader className="animate-spin text-secondary" />
            ) : (
              <p>Exchange</p>
            )}
          </button>
        </main>
      )}
    </>
  );
};

export default ExchangeCoin;
