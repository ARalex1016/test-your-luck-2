import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import useStore from "../Store/useStore";

// Components
import Header from "../Components/Header/Header";
import Loading from "../Components/Loading/Loading";

const RootLayout = () => {
  const { isLoading, isCheckingAuth } = useStore();

  return (
    <>
      <Header />

      {isLoading && <Loading />}

      {isCheckingAuth ? <Loading /> : <Outlet />}

      <Toaster />
    </>
  );
};

export default RootLayout;
