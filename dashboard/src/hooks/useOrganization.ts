import http from "../http";
import useApi from "./useApi";
import { useEvent } from "@nucleoidai/react-event";

function useOrganization() {
  const { createOperation } = useApi();
  const [teamSelected] = useEvent("TEAM_SELECTED", null);

  const getOrganizations = (fetchState = []) => {
    const {
      data: organizations,
      loading,
      error,
      fetch,
    } = createOperation(() => http.get("/organizations"), fetchState);

    return {
      organizations,
      loading,
      error,
      fetch,
    };
  };

  const getOrganizationById = (id, fetchState = []) => {
    const {
      data: organization,
      loading,
      error,
      fetch,
    } = createOperation(
      () => http.get(`/organizations/${id}`),
      [id, ...fetchState]
    );

    return {
      organization,
      loading,
      error,
      fetch,
    };
  };

  const getOrganizationByTeam = (fetchState = []) => {
    const {
      data: organization,
      loading,
      error,
      fetch,
    } = createOperation(() => {
      if (!teamSelected?.organizationId) return Promise.resolve({ data: null });
      return http.get(`/organizations/${teamSelected.organizationId}`);
    }, [teamSelected?.organizationId, ...fetchState]);

    return {
      organization,
      loading,
      error,
      fetch,
    };
  };

  const createOrganization = () => {
    const {
      data: createdOrganization,
      loading,
      error,
      fetch,
    } = createOperation((organizationData) =>
      http.post("/organizations", organizationData)
    );

    return {
      createdOrganization,
      loading,
      error,
      create: (data) => fetch(data),
    };
  };

  const updateOrganization = () => {
    const {
      data: updatedOrganization,
      loading,
      error,
      fetch,
    } = createOperation((id, data) => http.put(`/organizations/${id}`, data));

    return {
      updatedOrganization,
      loading,
      error,
      update: (id, data) => fetch(id, data),
    };
  };

  const deleteOrganization = () => {
    const {
      data: deleteResponse,
      loading,
      error,
      fetch,
    } = createOperation((id) => http.delete(`/organizations/${id}`));

    return {
      deleteResponse,
      loading,
      error,
      remove: (id) => fetch(id),
    };
  };

  return {
    getOrganizations,
    getOrganizationById,
    getOrganizationByTeam,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  };
}

export { useOrganization };
