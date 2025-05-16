import CommunicationChannel from "../../components/CommunicationChannel/CommunicationChannel";
import useCommunication from "../../hooks/useCommunication";
import useResponsibility from "../../hooks/useResponsibility";

import React, { useEffect, useState } from "react";

const availableChannels = [
  {
    id: "whatsapp",
    label: "WhatsApp Business",
    icon: "logos:whatsapp",
    requiresInput: true,
    inputLabel: "Phone Number",
  },
  { id: "slack", label: "Slack", icon: "logos:slack" },
  { id: "email", label: "Email", icon: "mdi:email-outline" },
];

const Communication = () => {
  const { getResponsibility } = useResponsibility();
  const { responsibility: respList, loading, error } = getResponsibility();

  const { getCommunications, createCommunication, deleteCommunication } =
    useCommunication();
  const { communications } = getCommunications();

  const [channels, setChannels] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    if (communications && Array.isArray(communications)) {
      const channelMap = new Map();
      communications.forEach((comm) => {
        const typeLower = comm.channelType.toLowerCase();
        const code = comm.channelCode;
        const id = `${typeLower}-${code}`;
        if (!channelMap.has(id)) {
          const base = availableChannels.find((c) => c.id === typeLower);
          if (base) {
            channelMap.set(id, {
              type: typeLower,
              id,
              label:
                base.requiresInput && code
                  ? `${base.label} (${code})`
                  : base.label,
              icon: base.icon,
              code,
            });
          }
        }
      });
      setChannels(Array.from(channelMap.values()));
      setConnections(
        communications.map((comm) => ({
          left: `${comm.channelType.toLowerCase()}-${comm.channelCode}`,
          right: `resp-${comm.responsibilityId}`,
        }))
      );
    }
  }, [communications]);

  const handleAddChannel = (newChannel) => {
    setChannels((prev) => [...prev, newChannel]);
  };

  const handleDeleteChannel = async (channelId: string) => {
    const communicationToDelete = communications.find(
      (comm) =>
        `${comm.channelType.toLowerCase()}-${comm.channelCode}` === channelId
    );

    if (communicationToDelete) {
      await deleteCommunication(communicationToDelete.id);
      setChannels((prev) => prev.filter((c) => c.id !== channelId));
      setConnections((prev) => prev.filter((c) => c.left !== channelId));
    }
  };

  const handleConnect = async (
    channelId: string,
    responsibilityIds: string[]
  ) => {
    const channel = channels.find((c) => c.id === channelId);
    if (channel) {
      for (const rid of responsibilityIds) {
        await createCommunication({
          channelType: channel.type.toUpperCase(),
          channelCode: channel.code,
          responsibilityId: rid.replace(/^resp-/, ""),
        });
      }
    }
  };

  if (loading) {
    return <div>Loading responsibilities...</div>;
  }
  if (error) {
    return <div>Error loading responsibilities: {error}</div>;
  }

  const responsibilities =
    (respList || []).map((r) => ({
      id: `resp-${r.id}`,
      title: r.title,
    })) || [];

  return (
    <CommunicationChannel
      channels={channels}
      responsibilities={responsibilities}
      connections={connections}
      availableChannels={availableChannels}
      onAddChannel={handleAddChannel}
      onDeleteChannel={handleDeleteChannel}
      onConnect={handleConnect}
      colorMap={{
        whatsapp: "#25D366",
        slack: "#4A154B",
        email: "#1976d2",
      }}
    />
  );
};

export default Communication;
