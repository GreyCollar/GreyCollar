import TeamChartButton from "./src/widgets/TeamChartButton/index.ts";

const menuConfig = {
  topMenu: [],
  sideMenu: [
    {
      subheader: "Dashboard",
      items: [
        {
          title: "Dashboard",
          icon: "ic:outline-dashboard",
          path: "/",
        },
        {
          title: "Colleagues",
          icon: "solar:chart-line-duotone",
          path: "/colleagues",
        },
        {
          title: "Team Chat",
          icon: "ic:baseline-chat",
          path: "/chat",
        },
        {
          title: "Knowledge Base",
          icon: "carbon:ibm-watson-knowledge-studio",
          path: "/knowledge",
        },
        {
          title: "Integrations",
          icon: "carbon:ibm-cloud-pak-integration",
          path: "/integrations",
        },
        {
          title: "Documentation",
          icon: "oui:documentation",
          path: "https://greycollar.ai/docs",
          external: true,
        },
      ],
    },
  ],
  options: [
    {
      label: "Home",
      linkTo: "/",
    },
    {
      label: "Profile",
      linkTo: "/",
    },
    {
      label: "Settings",
      linkTo: "/",
    },
  ],
  actionButtons: [TeamChartButton],
  fullScreenLayout: "left",
};

export default menuConfig;
