import http from "@canmingir/link/platform/http";

import {
  actionTypes as settingsActionTypes,
  initialState as settingsInitialState,
  settingsReducer,
} from "../context/settingsReducer";
import { useCallback, useReducer } from "react";

const useSettingsState = () => {
  const [settingsState, dispatch] = useReducer(
    settingsReducer,
    settingsInitialState
  );
  const fetchPermissionData = useCallback(async () => {
    const response = await http.get(`/api/userAcces/`);
    const permissions = response.data;

    dispatch({
      type: settingsActionTypes.FETCH_PERMISSION_DATA,
      payload: permissions,
    });
  }, []);

  const addPermission = useCallback(
    async (newUserId, teamId) => {
      const permission = { userId: newUserId, teamId: teamId };

      await http.post(`/api/userAcces`, permission);
      await fetchPermissionData();
    },
    [fetchPermissionData]
  );
  //update for new permission endpoints

  const removePermission = useCallback(
    async (permissionId) => {
      await http.delete(`/api/userAcces/${permissionId}`);
      await fetchPermissionData();
    },
    [fetchPermissionData]
  );

  return {
    settingsState,
    dispatch,
    addPermission,
    fetchPermissionData,
    removePermission,
  };
};

export default useSettingsState;
