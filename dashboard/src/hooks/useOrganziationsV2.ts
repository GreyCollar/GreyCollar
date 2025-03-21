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

type DependencyArray = unknown[];

function useOrganizations() {
  const { CreateOperation } = useApi();

  const [organizationCreated] = useEvent("ORGANIZATION_CREATED", null);

  const getOrganizations = (fetchState: DependencyArray = []) => {
    const eventDependencies = [organizationCreated];

    const { data, loading, error, fetch } = CreateOperation(
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

    const { data, loading, error, fetch } = CreateOperation(
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

  const createOrganization = () => {
    type CreateResponse = {
      success: boolean;
      message?: string;
      id?: string;
      data?: Organization;
    };

    const {
      data: createResponse,
      loading,
      error,
      fetch,
    } = CreateOperation((organization: OrganizationInput) =>
      http.post("/organizations", {
        name: organization.name,
        description: organization.description,
      })
    );

    const create = async (
      organization: OrganizationInput
    ): Promise<CreateResponse | null> => {
      if (!organization) {
        console.error("Cannot create organization: Missing organization input");
        return null;
      }

      const result = await fetch(organization);

      if (result && result.data) {
        publish("ORGANIZATION_CREATED", { organization: result.data });
      }

      return result;
    };

    return {
      createResponse,
      loading,
      error,
      create,
    };
  };

  const updateOrganization = () => {
    type UpdateResponse = {
      success: boolean;
      message?: string;
      data?: Organization;
    };

    const {
      data: updateResponse,
      loading,
      error,
      fetch,
    } = CreateOperation((organization: Organization) =>
      http.put(`/organizations/${organization.id}`, {
        name: organization.name,
        description: organization.description,
      })
    );

    const update = async (
      organization: Organization
    ): Promise<UpdateResponse | null> => {
      if (!organization || !organization.id) {
        console.error("Cannot update organization: Missing ID");
        return null;
      }

      const result = await fetch(organization);

      if (result) {
        publish("ORGANIZATION_UPDATED", { organizationId: organization.id });
      }

      return result;
    };

    return {
      updateResponse,
      loading,
      error,
      update,
    };
  };

  return {
    getOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization,
  };
}

export default useOrganizations;
