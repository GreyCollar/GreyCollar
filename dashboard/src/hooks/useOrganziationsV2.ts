import http from "../http";
import useApi from "./useApiV2";

import { publish, useEvent } from "@nucleoidai/react-event";

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

type DependencyArray = object[];

function useOrganizations() {
  const { Api } = useApi();

  const [organizationCreated] = useEvent("ORGANIZATION_CREATED", null);

  const getOrganizations = (fetchState: DependencyArray = []) => {
    const eventDependencies = [organizationCreated];

    const { data, loading, error, fetch } = Api(
      () => http.get("/organizations"),
      [...eventDependencies, ...fetchState]
    );

    if (data) {
      publish("ORGANIZATIONS_LOADED", { organizations: data });
    }

    return {
      organizations: data,
      loading,
      error,
      fetch,
    };
  };

  const getOrganizationById = (
    id: string,
    fetchState: DependencyArray = []
  ) => {
    const eventDependencies = [organizationCreated];

    const { data, loading, error, fetch } = Api(
      () => (id ? http.get(`/organizations/${id}`) : null),
      [id, ...eventDependencies, ...fetchState]
    );

    if (data) {
      publish("ORGANIZATION_LOADED", { data });
    }

    return {
      organization: data,
      loading,
      error,
      fetch,
    };
  };

  const createOrganization = async (organization: OrganizationInput) => {
    if (!organization) {
      console.error("Cannot create organization: Missing organization input");
      return null;
    }

    const response = await http.post("/organizations", {
      name: organization.name,
      description: organization.description,
    });

    if (response && response.data) {
      publish("ORGANIZATION_CREATED", { organization: response.data });
    }

    return response.data;
  };

  const updateOrganization = async (organization: Organization) => {
    if (!organization || !organization.id) {
      console.error("Cannot update organization: Missing ID");
      return null;
    }

    const response = await http.put(`/organizations/${organization.id}`, {
      name: organization.name,
      description: organization.description,
    });

    if (response && response.data) {
      publish("ORGANIZATION_UPDATED", { organizationId: organization.id });
    }

    return response.data;
  };

  return {
    getOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization,
  };
}

export default useOrganizations;
