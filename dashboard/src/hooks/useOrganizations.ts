import http from "../http";
import { publish } from "@nucleoidai/react-event";
import useSWR from "swr";

export type Organization = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type OrganizationInput = {
  name: string;
  description?: string;
};

const fetcher = async (url: string) => {
  const response = await http.get(url);
  return response;
};

function useOrganizations() {
  const getOrganizations = () => {
    const {
      data,
      error,
      isLoading,
      mutate: refetch,
    } = useSWR("/organizations", fetcher, {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 0,
    });

    if (data?.data) {
      publish("ORGANIZATIONS_LOADED", { organizations: data.data });
    }

    return {
      organizations: data?.data,
      loading: isLoading,
      error,
      fetch: refetch,
    };
  };

  const getOrganizationById = (id: string) => {
    const shouldFetch = !!id;

    const {
      data,
      error,
      isLoading,
      mutate: refetch,
    } = useSWR(shouldFetch ? `/organizations/${id}` : null, fetcher);

    return {
      organization: data?.data,
      loading: isLoading,
      error,
      fetch: refetch,
    };
  };

  const createOrganization = () => {
    type CreateResponse = {
      success: boolean;
      message?: string;
      id?: string;
      data?: Organization;
    };

    const create = async (
      organization: OrganizationInput
    ): Promise<CreateResponse | null> => {
      if (!organization) {
        console.error("Cannot create organization: Missing organization input");
        return null;
      }

      try {
        const response = await http.post("/organizations", {
          name: organization.name,
          description: organization.description,
        });

        console.log("createResponse", response);

        if (response && response.data) {
          publish("ORGANIZATION_CREATED", { organization: response.data });
        }

        return response;
      } catch (error) {
        console.error("Error creating organization:", error);
        return null;
      }
    };

    return {
      create,
    };
  };

  return {
    getOrganizations,
    getOrganizationById,
    createOrganization,
  };
}

export default useOrganizations;
