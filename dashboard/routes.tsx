import AddTeam from "./src/pages/addTeam";
import Callback from "./src/pages/callback";
import Chat from "./src/pages/chat";
import Colleague from "./src/pages/colleague";
import Colleagues from "./src/pages/colleagues";
import Container from "./src/Container";
import Dashboard from "./src/pages/dashboard";
import Integrations from "./src/pages/integrations";
import KnowledgeBase from "./src/pages/knowledgeBase";
import Settings from "./src/pages/settings";

import {
  DashboardLayout,
  FullScreenLayout,
} from "@nucleoidai/platform/layouts";

const routes = [
  {
    container: <Container />,
    childs: [
      {
        layout: <DashboardLayout />,
        pages: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: `/colleagues`,
            element: <Colleagues />,
          },
          {
            path: `/integrations`,
            element: <Integrations />,
          },
          {
            path: `/knowledge`,
            element: <KnowledgeBase />,
          },
          { path: "/colleagues/:colleagueId", element: <Colleague /> },
          { path: "/settings", element: <Settings /> },
          { path: "/teams/add", element: <AddTeam /> },
          { path: "/integrations/callback", element: <Callback /> },
        ],
      },
      {
        layout: <FullScreenLayout />,
        pages: [{ path: "/chat", element: <Chat /> }],
      },
    ],
  },
];

export default routes;
