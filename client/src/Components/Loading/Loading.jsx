import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

const Loading = () => {
  return (
    <>
      <Stack
        sx={{ width: "100%", color: "grey.500" }}
        spacing={2}
        className="absolute top-menuHeight z-40"
      >
        <LinearProgress color="secondary" />
      </Stack>
    </>
  );
};

export default Loading;
