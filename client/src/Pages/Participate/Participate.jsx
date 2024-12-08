import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

// Components
import RevealTicketOnAnimation from "../../Components/RevealTicketOnAnimation";

// Store
import useStore from "../../Store/useStore";

// Icons
import { Plus, Minus, Euro, Loader } from "lucide-react";

const Participate = () => {
  const { contestId } = useParams();
  const { user, isAuthenticated, getContest, participateContest, checkAuth } =
    useStore();

  const [contest, setContest] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(null);
  const [newTickets, setNewTickets] = useState([]);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

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
      setTotalAmount(quantity * contest?.entryFee);
    }
  }, [quantity, contest]);

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

  const handlePayment = async () => {
    if (!isAuthenticated) {
      return toast.error(
        "Please Sign Up first in order to Participate in a Contest"
      );
    }

    setIsPurchasing(true);
    try {
      const res = await participateContest(totalAmount, contestId);

      toast.success(res.message);

      setNewTickets(res.data);
      setOpenPopUp(true);

      if (!user?.participatedContest.includes(contestId)) {
        await checkAuth();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPurchasing(false);
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
        <main className="mt-menuHeight px-paddingX flex flex-col justify-center items-center gap-y-2 pb-8">
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

          {/* Currency Display */}
          <div className="w-full mt-4">
            <div className="w-full flex flex-row justify-between items-center gap-x-2">
              <p className="w-1/2 text-2xl font-medium bg-secondaryDim rounded-sm flex justify-center items-center py-1">
                100
              </p>

              <p className="w-1/2 text-2xl font-medium bg-secondaryDim rounded-sm flex justify-center items-center py-1">
                <Euro />
                <span>{totalAmount}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={!quantity || quantity <= 0 || isPurchasing}
            className="w-full h-10 text-white text-2xl font-medium bg-accent rounded-md disabled:bg-gray-500 disabled:text-primary py-1 mt-4 flex justify-center items-center"
          >
            {isPurchasing ? (
              <Loader className="text-secondary animate-spin" />
            ) : (
              <p>Purchase</p>
            )}
          </button>
        </main>
      )}
    </>
  );
};

export default Participate;
