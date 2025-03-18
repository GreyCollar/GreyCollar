import http from "../http";
import { publish } from "@nucleoidai/react-event";
import useSWR from "swr";

export type Colleague = {
  id: string;
  name: string;
  avatar: string;
  character: string;
  role: string;
  teamId: string;
  AIEngine: string;
  title?: string;
  projectId?: string;
};

const fetcher = async (url: string) => {
  const response = await http.get(url);
  return response;
};

function useColleague() {
  const getColleagues = () => {
    const {
      data,
      isLoading: loading,
      error,
      isValidating,
      mutate: refetch,
    } = useSWR(`/colleagues`, fetcher, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 0,
    });

    return {
      colleagues: data?.data,
      loading,
      error,
      fetch: refetch,
    };
  };

  const getColleague = (colleagueId: string) => {
    const {
      data,
      isLoading: loading,
      error,
      isValidating,
      mutate: refetch,
    } = useSWR(colleagueId ? `/colleagues/${colleagueId}` : null, fetcher, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 0,
    });

    return {
      colleague: data?.data,
      loading,
      error,
      fetch: refetch,
    };
  };

  const updateColleague = () => {
    type UpdateResponse = {
      success: boolean;
      message?: string;
      data?: Colleague;
    };

    const update = async (
      colleague: Colleague
    ): Promise<UpdateResponse | null> => {
      if (!colleague || !colleague.id) {
        console.error("Cannot update colleague: Missing ID");
        return null;
      }

      try {
        const result = await http.put(`/colleagues/${colleague.id}`, {
          title: colleague.title,
          name: colleague.name,
          avatar: colleague.avatar,
          character: colleague.character,
          role: colleague.role,
          projectId: colleague.projectId,
          teamId: colleague.teamId,
        });

        if (result) {
          publish("COLLEAGUE_UPDATED", { colleagueId: colleague.id });
        }
      } catch (error) {
        console.error("Error updating colleague:", error);
        return {
          success: false,
          message: error.message || "Failed to update colleague",
        };
      }
    };

    return {
      update,
      loading: false,
      error: null,
      updateResponse: null,
    };
  };

  return {
    getColleagues,
    getColleague,
    updateColleague,
  };
}

export default useColleague;
