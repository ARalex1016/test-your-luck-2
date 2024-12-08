// Store
import useStore from "../Store/useStore";

const Coins = () => {
  const { user } = useStore();

  return (
    <>
      {user && user.role === "player" && (
        <p className="text-xl font-medium text-yellow-400 transition-all duration-300">
          Coins: <span className="font-extrabold">{user?.coins}</span>
        </p>
      )}
    </>
  );
};

export default Coins;
