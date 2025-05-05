import { useEffect } from "react";

const AuthHandler = ({ skill, getTokens, onAuthSuccess }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleLogin = (id, isTeam) => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      skill.oauth.clientId
    )}&redirect_uri=${encodeURIComponent(
      skill.oauth.redirectUri
    )}&response_type=code&access_type=offline&prompt=consent&include_granted_scopes=false&scope=${encodeURIComponent(
      skill.oauth.scope
    )}`;

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;
    const popup = window.open(
      authUrl,
      "google_oauth_popup",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const handleMessage = async (event) => {
      if (event.origin !== window.origin) return;

      const { code } = event.data || {};
      if (code) {
        try {
          await getTokens(code, skill, id, isTeam);

          if (onAuthSuccess) {
            onAuthSuccess();
          }
        } catch (error) {
          console.error("Error during token exchange:", error);
        } finally {
          window.removeEventListener("message", handleMessage);
          popup.close();
        }
      }
    };

    window.addEventListener("message", handleMessage);
  };

  return { handleLogin };
};

export default AuthHandler;
