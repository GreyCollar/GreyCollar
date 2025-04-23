export const getProviderLogo = (provider: string): string => {
  const providerLogos: Record<string, string> = {
    SLACK: "logos:slack",
    DISCORD: "logos:discord",
    JIRA: "logos:jira",
    GITHUB: "logos:github",
    NOTION: "logos:notion",
    "GOOGLE DRIVE": "logos:google-drive",
    TRELLO: "logos:trello",
    HUBSPOT: "logos:hubspot",
  };

  return providerLogos[provider] || "logos:default";
};
