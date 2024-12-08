const ContainerContestCard = ({ className, children }) => {
  return (
    <>
      <div
        className={`w-full flex flex-row flex-wrap justify-around gap-x-5 gap-y-5 ${className}`}
      >
        {children}
      </div>
    </>
  );
};

export default ContainerContestCard;
