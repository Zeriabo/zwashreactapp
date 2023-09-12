import React from "react";
import { Container, Typography, AppBar, Toolbar } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Service Provider Management</Typography>
        </Toolbar>
      </AppBar>
      <Container>{children}</Container>
    </div>
  );
};

export default Layout;
