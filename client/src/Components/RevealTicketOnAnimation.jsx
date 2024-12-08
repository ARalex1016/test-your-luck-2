import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Icons
import { X } from "lucide-react";

const RevealTicketOnAnimation = ({ openPopUp, setOpenPopUp, newTickets }) => {
  const modalRef = useRef(null);

  // Close the modal if the click is outside the modal
  useEffect(() => {
    // Function to handle clicks outside of the modal
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpenPopUp(false); // Close the popup
      }
    };

    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenPopUp]);

  return (
    <>
      <AnimatePresence>
        {openPopUp && (
          <motion.div
            ref={modalRef}
            variants={{
              initial: {
                opacity: 0,
                transform: "translate(-50%, -50%) scale(0)",
              },
              final: {
                opacity: 1,
                transform: "translate(-50%, -50%) scale(1)",
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              },
            }}
            initial="initial"
            animate="final"
            exit="initial"
            transition={{
              duration: 0.4,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            className="w-4/5 bg-secondary border-none rounded-lg shadow-lg shadow-gray-500 absolute top-1/2 left-1/2 px-5 pt-6 pb-5"
          >
            <X
              onClick={() => setOpenPopUp(false)}
              className="text-red-500 absolute top-2 right-2"
            />

            <h2 className="text-blue text-3xl font-bold text-center mb-5">
              Congratulations!
            </h2>

            <h2 className="text-lg font-medium text-center mb-2">
              You got <b>{newTickets?.length}</b> new ticket(s)
            </h2>

            {/* Tickets */}
            <div className="w-full max-h-48 overflow-x-auto scrollbar-hidden flex flex-row flex-wrap justify-around items-center gap-x-1 gap-y-2">
              {newTickets?.map((ticket) => {
                return (
                  <div
                    key={ticket._id}
                    className="text-secondary text-lg font-medium bg-greenTransparent rounded shadow-sm shadow-greenTransparent px-2 py-1"
                  >
                    {ticket.ticketNo}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RevealTicketOnAnimation;
