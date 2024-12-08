import { useState } from "react";
import { toast } from "react-hot-toast";

// Store
import useStore from "../../Store/useStore";

// Image
import avatar from "../../assets/Images/avatar.png";

// Icons
import { Camera } from "lucide-react";

// Components
import Input from "../../Components/Input";

// Utils
import { formatDateWithMonth } from "../../Utils/dateManager";

const Profile = () => {
  const { user, updateProfile } = useStore();

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const uploadProfile = async (profile) => {
    setIsUpdatingProfile(true);

    try {
      const res = await updateProfile(profile);

      toast.success(res.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result;
      setSelectedProfile(base64Image);

      uploadProfile(base64Image);
    };
  };

  return (
    <>
      <section className="mt-menuHeight px-paddingX flex flex-col items-center gap-4 py-4">
        <h2 className="text-secondary text-center text-xl font-medium">
          Profile Information
        </h2>

        {/* Profile Image */}
        <div className="relative">
          <img
            src={selectedProfile || user?.profileUrl || avatar}
            alt={`${user?.name || "avatar"}`}
            className={`size-32 object-cover rounded-full border-4 border-secondaryDim ${
              isUpdatingProfile && "animate-pulse pointer-events-none"
            }`}
          />
          <label
            htmlFor="profile-upload"
            className="absolute bottom-0 right-0 bg-secondary hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
          >
            <Camera className="w-5 h-5" />

            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={(e) => handleProfileUpload(e)}
              disabled={isUpdatingProfile}
              className="hidden"
            />
          </label>
        </div>

        <p className="text-secondaryDim text-sm">
          {isUpdatingProfile
            ? "Uploading..."
            : "Click the camera icon to update your profile"}
        </p>

        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-8 mt-5">
          <Input value={user?.name} readOnly className="" />
          <Input value={user?.phoneNumber} readOnly className="" />
          <Input value={user?.email} readOnly className="" />
          <Input value={`Coins: ${user?.coins}`} readOnly className="" />
          <Input
            value={`Member Since: ${formatDateWithMonth(user?.createdAt)}`}
            readOnly
            className="col-span-2 text-center"
          />
        </div>
      </section>
    </>
  );
};

export default Profile;
