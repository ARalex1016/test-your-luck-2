import { useNavigate } from "react-router-dom";

// Components
import Banner from "../../Components/Banner/Banner";
import ParticipatedContest from "../../Components/ParticipatedContest/ParticipatedContest";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <main className="px-paddingX pb-10 mt-menuHeight">
        <Banner />

        {/* Navigate to Contest */}
        <section className="mt-4">
          <p className="text-secondaryDim text-lg font-normal text-center">
            <span
              onClick={() => navigate("/contest")}
              className="text-green underline font-bold"
            >
              Click here
            </span>{" "}
            to see all <b>Contest</b>
          </p>
        </section>

        <ParticipatedContest />
      </main>
    </>
  );
};

export default Dashboard;
