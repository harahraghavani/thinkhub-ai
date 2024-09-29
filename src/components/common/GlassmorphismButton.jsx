import { Button } from "@mui/material";

const GlassmorphismButton = ({ children }) => {
  return (
    <Button
      sx={{
        backgroundColor: "rgba(0,0 ,0, 0.1)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {children}
    </Button>
  );
};

export default GlassmorphismButton;
