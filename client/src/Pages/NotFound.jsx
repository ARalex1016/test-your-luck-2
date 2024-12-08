import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="mt-menuHeight flex flex-col justify-center items-center">
        <p className="text-white text-2xl font-bold">No page found</p>
        <p className="text-white tetx-base font-normal">
          Click here to go to{" "}
          <span
            onClick={() => navigate("/")}
            className="text-lg font-bold text-green"
          >
            Home page
          </span>
        </p>
      </section>
    </>
  );
};

export default NotFound;
