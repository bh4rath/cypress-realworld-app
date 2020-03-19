import React from "react";
import { useMachine } from "@xstate/react";
import { Interpreter } from "xstate";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import Copyright from "../components/Copyright";
import NavBar from "./NavBar";
import NavDrawer from "./NavDrawer";
import { DataContext, DataEvents } from "../machines/dataMachine";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { drawerMachine } from "../machines/drawerMachine";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: theme.spacing(8),
    [theme.breakpoints.down("sm")]: {
      paddingTop: theme.spacing(2)
    },
    paddingBottom: theme.spacing(4)
  }
}));

interface Props {
  children: React.ReactNode;
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
  notificationsService: Interpreter<DataContext, any, DataEvents, any>;
}

const MainLayout: React.FC<Props> = ({
  children,
  notificationsService,
  authService
}) => {
  const classes = useStyles();
  const [drawerState, sendDrawer] = useMachine(drawerMachine);

  const drawerOpen = drawerState.matches("open");
  const toggleDrawer = () => {
    sendDrawer("TOGGLE");
  };

  return (
    <>
      <NavBar
        handleDrawerOpen={toggleDrawer}
        drawerOpen={drawerOpen}
        notificationsService={notificationsService}
      />
      <NavDrawer
        handleDrawerClose={toggleDrawer}
        drawerOpen={drawerOpen}
        authService={authService}
      />
      <main className={classes.content} data-test="main">
        <div className={classes.appBarSpacer} />
        <Container maxWidth="md" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {children}
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </>
  );
};

export default MainLayout;
