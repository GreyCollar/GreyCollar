import AIMarketplaceButton from "./src/widgets/AIMarketplace/AIMarketplaceButton";
import OrganizationButton from "./src/widgets/OrganizationButton/index.ts";

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
          title: "Chat",
          icon: "ic:baseline-chat",
          path: "/chat",
        },
        {
          title: "Integrations",
          icon: "carbon:ibm-cloud-pak-integration",
          path: "/integrations",
        },
        {
          title: "Knowledge Base",
          icon: "carbon:ibm-watson-knowledge-studio",
          path: "/knowledge",
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
  actionButtons: [AIMarketplaceButton, OrganizationButton],
  fullScreenLayout: "left",
};

export default menuConfig;
