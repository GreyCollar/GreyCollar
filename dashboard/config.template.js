/* eslint-disable no-unused-vars */
const templateConfig = {
  theme: {
    variants: () => ({
      MuiCard: {
        variants: [
          {
            props: { variant: "profile-card" },
            style: {
              mb: 3,
              height: 290,
            },
          },
        ],
      },
    }),
    mode: "dark",
    colorPresets: "cyan",
  },
  login: {
    variant: "modern",
    image:
      "https://cdn.nucleoid.com/media/3b7f96ee-c245-4c93-97b8-d5503340f262.png",
    icon: "https://cdn.nucleoid.com/greycollar/media/icon.png",
    largeIcon: "https://cdn.nucleoid.com/greycollar/media/icon.png",
  },
};

export default templateConfig;
