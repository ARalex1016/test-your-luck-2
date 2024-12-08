import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Store
import useStore from "../../Store/useStore";

// Components
import Input from "../../Components/Input";

// Icons
import { Loader } from "lucide-react";

const Signup = () => {
  const { signup, isLoading } = useStore();
  const navigate = useNavigate();

  const initialUser = {
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    invitedBy: localStorage.getItem("referralLink") || undefined,
  };

  const [userForm, setUserForm] = useState(initialUser);
  const [checkBoxStatus, setCheckBoxStatus] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUserForm((pre) => ({ ...pre, [name]: value }));
  };

  const formValidation = () => {
    if (!userForm.name) {
      setMessage("Please enter your name.");

      return false;
    }

    if (!userForm.phoneNumber) {
      setMessage("Please enter your Phone Number.");

      return false;
    }

    if (!userForm.email) {
      setMessage("Please enter your email.");

      return false;
    }

    if (!userForm.password) {
      setMessage("Please enter a Strong Password.");

      return false;
    }

    if (userForm.password.length < 8 || userForm.password.length > 20) {
      setMessage("Password must be min 8 and max 20 characters");

      return false;
    }

    if (!userForm.confirmPassword) {
      setMessage("Please enter Confirm Password.");

      return false;
    }

    if (userForm.password !== userForm.confirmPassword) {
      setMessage("Password doesn't match!");

      return false;
    }

    if (!checkBoxStatus) {
      setMessage("Please check on Terms and Conditions");

      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValidation()) {
      return;
    }

    try {
      // Server Response
      const res = await signup(userForm);

      toast.success(res.data.message);
      navigate("/dashboard");

      localStorage.removeItem("referralLink");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      <main
        className="px-paddingX mt-menuHeight flex flex-col justify-center items-center"
        style={{
          height: "calc(100svh - var(--menuHeight))",
        }}
      >
        {/* Label for Valid Information */}
        <motion.div
          variants={{
            initial: {
              top: 0,
              scale: 0,
              opacity: 0,
            },
            final: {
              top: "var(--menuHeight)",
              scale: 1,
              opacity: 1,
            },
          }}
          initial="initial"
          animate="final"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="w-screen bg-yellow-500 absolute z-10"
        >
          <p className="text-primary text-sm text-center">
            <b>Note:</b> Please give valid informaton
          </p>
          <p className="text-primary text-sm text-center">
            These information will help us to <b>Contact</b> you on your{" "}
            <b>Winnings</b>
          </p>
        </motion.div>

        {/* Container */}
        <div className="w-full bg-primaryLight rounded-2xl flex flex-col items-center py-3 gap-y-1">
          <h2 className="text-accent text-3xl font-bold text-center">
            Sign Up
          </h2>

          <p
            className={`w-full h-6 text-secondary text-center text-base bg-red-500 my-1 ${
              message ? "visible" : "invisible"
            }`}
          >
            {message}
          </p>

          <form onSubmit={handleSubmit} className="w-4/5 flex flex-col gap-y-4">
            <div className="w-full flex gap-x-2">
              <Input
                type="text"
                placeholder="Name"
                value={userForm.name}
                name="name"
                onChange={handleInputChange}
                className="w-[55%]"
              />

              <Input
                type="text"
                placeholder="InvitedBy"
                readonly={true}
                value={userForm.invitedBy}
                name="invitedBy"
                onChange={handleInputChange}
                className="w-[45%] notSelectable"
              />
            </div>

            <PhoneInput
              country={"us"}
              placeholder="Phoner Number"
              countryCodeEditable={false}
              value={userForm.phoneNumber}
              onChange={(value) =>
                setUserForm((pre) => ({ ...pre, phoneNumber: value }))
              }
              inputStyle={{
                width: "100%",
                height: "100%",
                backgroundColor: "hsl(0, 0%, 100%)",
                outline: "none",
                border: "none",
                color: "#666666",
                fontWeight: "500",
                fontSize: "14px",
                paddingBlock: "9px",
              }}
              containerStyle={{
                border: "none",
              }}
            />

            <Input
              type="email"
              placeholder="Email"
              value={userForm.email}
              name="email"
              onChange={handleInputChange}
            />

            <Input
              type="text"
              placeholder="Password"
              value={userForm.password}
              name="password"
              onChange={handleInputChange}
            />

            <Input
              type="text"
              placeholder="Confirm Password"
              value={userForm.confirmPassword}
              name="confirmPassword"
              onChange={handleInputChange}
            />

            <div className="flex justify-start items-center gap-x-1">
              <input
                type="checkbox"
                id="checkBox"
                checked={checkBoxStatus}
                onChange={() => setCheckBoxStatus((pre) => !pre)}
              />

              <label htmlFor="checkBox" className="text-secondary text-xs">
                Click here to accept{" "}
                <span className="text-blue-500 text-sm font-medium underline">
                  Terms and Conditions
                </span>
              </label>
            </div>

            <button className="w-full h-10 bg-accent rounded-md cursor-pointer flex justify-center items-center mt-4">
              {isLoading ? (
                <Loader color="white" className="animate-spin" />
              ) : (
                <p className="text-2xl text-secondary font-medium">Sign up</p>
              )}
            </button>
          </form>

          <p className="text-secondary text-sm">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-accent text-center text-lg font-bold"
            >
              Click here
            </span>
          </p>
        </div>
      </main>
    </>
  );
};

export default Signup;
