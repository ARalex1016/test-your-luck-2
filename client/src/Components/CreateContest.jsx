import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

// Components
import { Input2 } from "./Input";

// Icons
import { X } from "lucide-react";
import { Loader } from "lucide-react";

// Store
import useStore from "../Store/useStore";

const CreateContest = ({ isOpenWindow, closeWindow }) => {
  const { isLoading, createContest, getAllContest } = useStore();

  const initialContest = {
    title: "",
    imageUrl: "",
    entryFee: "",
    coinEntryFee: "",
    prize: "",
    startDate: "",
    endDate: "",
  };
  const [contest, setContest] = useState(initialContest);
  const [selectedImage, setSelectedImage] = useState(null);

  // Reset state when the modal opens
  useEffect(() => {
    if (!isOpenWindow) {
      setContest(initialContest);
      setSelectedImage(null);
    }
  }, [isOpenWindow]);

  const handleInputChange = (e) => {
    const { value, name } = e.target;

    setContest((pre) => ({ ...pre, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Only JPEG or PNG images are allowed!");
      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      setContest((pre) => ({ ...pre, imageUrl: base64Image }));
    };
  };

  const newContest = async () => {
    try {
      const res = await createContest(contest);

      toast.success(res.message);

      setContest(initialContest);
      setSelectedImage(null);

      await getAllContest();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!contest.imageUrl) {
      toast.error("Please select an Image first!");
      return;
    }

    newContest();
  };

  return (
    <>
      <AnimatePresence>
        {isOpenWindow && (
          <motion.div
            variants={{
              initial: {
                scale: 0,
                opacity: 0,
              },
              final: {
                scale: 1,
                opacity: 1,
              },
            }}
            initial="initial"
            animate="final"
            exit="initial"
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="h-fit bg-secondary rounded-md shadow-md shadow-secondaryDim px-4 pb-4 absolute z-30"
            style={{
              width: "calc(100vw - 2 * var(--paddingX))",
            }}
          >
            <div className="w-full flex justify-end pt-2 pr-2">
              <X onClick={closeWindow} className="text-red-600" />
            </div>

            <h2 className="text-xl text-blue font-medium text-center">
              New Contest
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-2 grid grid-cols-2 gap-x-2 gap-y-4"
            >
              {/* Image Upload */}
              <div
                className="col-span-2 w-full aspect-video rounded-md flex justify-center items-center py-4 bg-no-repeat bg-cover"
                style={{
                  backgroundColor: "hsl(0, 0%, 75%)",
                  backgroundImage: `url(${selectedImage})`,
                }}
              >
                <label
                  htmlFor="imageUpload"
                  className={`w-1/2 aspect-video text-black font-bold text-center border-2 border-dashed rounded-md flex items-center justify-center ${
                    selectedImage && "text-red-600 bg-gray opacity-70"
                  }`}
                >
                  Upload Image
                  <input
                    type="file"
                    name="imageUrl"
                    id="imageUpload"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <Input2
                name="title"
                value={contest.title}
                placeholder="Title"
                required={true}
                onChange={handleInputChange}
                className="col-span-2"
              />

              <Input2
                name="prize"
                value={contest.prize}
                placeholder="Prize"
                required={true}
                onChange={handleInputChange}
                className="col-span-2"
              />

              <div className="w-full flex border">
                <Input2
                  name="entryFee"
                  value={contest.entryFee}
                  type="number"
                  required={true}
                  placeholder="Entry Fee"
                  onChange={handleInputChange}
                  className=""
                />
                <input
                  type="text"
                  value={"€"}
                  readOnly
                  className="w-1/3 text-2xl font-bold text-center border-l outline-none notSelectable"
                />
              </div>

              <Input2
                type="number"
                name="coinEntryFee"
                value={contest.coinEntryFee}
                placeholder="Required Coins"
                required={true}
                onChange={handleInputChange}
                className=""
              />

              <Input2
                type="date"
                name="startDate"
                value={contest.startDate}
                required={true}
                onChange={handleInputChange}
                className=""
              />

              <Input2
                type="date"
                name="endDate"
                value={contest.endDate}
                required={true}
                onChange={handleInputChange}
                className=""
              />

              <button className="col-span-2 w-full h-10 text-secondary text-xl font-medium bg-blueTransparent rounded-md flex justify-center items-center mt-4">
                {isLoading ? (
                  <Loader color="white" className="animate-spin" />
                ) : (
                  <p>Submit</p>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateContest;
