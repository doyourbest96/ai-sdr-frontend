"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";

import { wsService } from "@/services/websocketService";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertModel,
  bulkUpdateAlerts,
  deleteAlert,
  getAlerts,
  getAlertTotalCount,
  updateAlert,
  UpdateAlertModel,
} from "@/services/alertService";
import { handleError, runService } from "@/utils/service_utils";

interface AlertContextType {
  loading: boolean;
  alerts: AlertModel[] | [];
  unreadAlerts: AlertModel[] | [];
  alertTotalCount: number;
  isFilterOpen: boolean;
  alertFilterConfig: AlertFilterType;
  setAlerts: (alerts: AlertModel[]) => void;
  setIsFilterOpen: (open: boolean) => void;
  setAlertFilterConfig: (config: AlertFilterType) => void;
  handleBulkUpdate: (isRead: boolean) => void;
  handleDelete: (id: string | undefined) => void;
  handleSelectAll: () => void;
  handleMarkAsRead: (id: string | undefined) => void;
  handleMarkAsUnread: (id: string | undefined) => void;
  handleToggleSelect: (id: string) => void;
  getSelectedCount: () => number;
  isSemiSelected: boolean;
}

export interface AlertFilterType {
  offset: number;
  limit: number;
  isRead: boolean;
  type: string;
  orderBy: string;
  isAscending: boolean | undefined;
  search: string;
}

interface MessageType {
  type: string;
  data: any;
}

export const AlertContext = createContext<AlertContextType | undefined>(
  undefined
);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<AlertModel[]>([]);
  const [unreadAlerts, setUnreadAlerts] = useState<AlertModel[]>([]);
  const [alertTotalCount, setAlertTotalCount] = useState(0);
  const [isSemiSelected, setIsSemiSelected] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [alertFilterConfig, setAlertFilterConfig] = useState<AlertFilterType>({
    offset: 0,
    limit: 10,
    isRead: false,
    type: "",
    orderBy: "",
    isAscending: false,
    search: "",
  });

  const { isAuthenticated, token } = useAuth();

  const fetchAlerts = () => {
    setLoading(true);
    runService(
      alertFilterConfig,
      getAlerts,
      (data) => {
        console.log("alerts: ", data);
        setAlerts(data);
        setLoading(false);
      },
      (status, error) => {
        handleError(status, error);
        setLoading(false);
      }
    );
  };

  const fecthUnreadAlerts = () => {
    setLoading(true);
    runService(
      { offset: 0, limit: 100, isRead: false },
      getAlerts,
      (data) => {
        setUnreadAlerts(data);
        setLoading(false);
      },
      (status, error) => {
        handleError(status, error);
        setLoading(false);
      }
    );
  };

  const fetchTotalCount = () => {
    runService(
      undefined,
      getAlertTotalCount,
      (data) => {
        setAlertTotalCount(data.count);
      },
      (status, error) => {
        handleError(status, error);
      }
    );
  };

  const handleBulkUpdate = async (isRead: boolean) => {
    const selectedAlerts = alerts.filter(
      (alert) => alert.isSelected && alert.isRead !== isRead
    );
    const updateData = {
      alerts: selectedAlerts.map((alert) => alert.id),
      isRead: isRead,
    };

    if (selectedAlerts.length === 0) {
      alert("No alerts selected for bulk update!");
      return;
    }

    setLoading(true);
    runService(
      updateData,
      bulkUpdateAlerts,
      (data) => {
        if (data.success) {
          setAlerts((prevAlerts) =>
            prevAlerts.map((alert) =>
              selectedAlerts.find((a) => a.id === alert.id)
                ? { ...alert, isRead: isRead, isSelected: false }
                : alert
            )
          );
          toast.success("Alerts updated successfully!");
        }
      },
      (status, error) => {
        handleError(status, error);
        setLoading(false);
      }
    );
    setLoading(false);
  };

  const handleDeleteAlert = (alertId: string) => {
    runService(
      alertId,
      deleteAlert,
      () => {
        if (wsService.getStatus() === "disconnected") {
          setAlerts(alerts?.filter((alert) => alert.id !== alertId));
        }
      },
      (status, error) => {
        handleError(status, error);
      }
    );
  };

  const handleUpdateAlert = (alertId: string, updateData: UpdateAlertModel) => {
    runService(
      { alertId, updateData },
      updateAlert,
      (data) => {
        if (data) {
          setAlerts(
            alerts.map((alert) =>
              alert.id === alertId
                ? { ...alert, isRead: updateData.isRead }
                : alert
            )
          );
        }
      },
      (status, error) => {
        handleError(status, error);
      }
    );
  };

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    fetchAlerts();
    fecthUnreadAlerts();
    fetchTotalCount();
    wsService.connect(token);

    const createHandler = (message: MessageType) => {
      setAlerts((alerts) => [message.data, ...(alerts || [])]);
    };

    const updateHandler = (message: MessageType) => {
      setAlerts((alerts) =>
        alerts?.map((alert) =>
          alert.id === message.data.id ? message.data : alert
        )
      );
    };

    const deleteHandler = (message: MessageType) => {
      setAlerts((alerts) =>
        alerts?.filter((alert) => alert.id !== message.data.id)
      );
    };

    wsService.subscribe("CREATE_ALERT", createHandler);
    wsService.subscribe("UPDATE_ALERT", updateHandler);
    wsService.subscribe("DELETE_ALERT", deleteHandler);

    return () => {
      wsService.unsubscribe("CREATE_ALERT", createHandler);
      wsService.unsubscribe("UPDATE_ALERT", updateHandler);
      wsService.unsubscribe("DELETE_ALERT", deleteHandler);
    };
  }, [isAuthenticated, token, alertFilterConfig]);

  const handleSelectAll = useCallback(() => {
    setAlerts((prevAlerts) => {
      const allSelected = prevAlerts.every((alert) => alert.isSelected);
      return prevAlerts.map((alert) => ({
        ...alert,
        isSelected: !allSelected,
      }));
    });
  }, []);

  const handleMarkAsRead = useCallback(
    (id: string | undefined) => {
      if (id) {
        handleUpdateAlert(id, { isRead: true });
      } else
        alerts.map((alert) => {
          if (alert.isSelected) handleUpdateAlert(alert.id, { isRead: true });
        });
    },
    [alerts]
  );

  const handleMarkAsUnread = useCallback(
    (id: string | undefined) => {
      if (id) {
        handleUpdateAlert(id, { isRead: false });
      } else
        alerts.map((alert) => {
          if (alert.isSelected) handleUpdateAlert(alert.id, { isRead: false });
        });
    },
    [alerts]
  );

  const handleDelete = useCallback((id: string | undefined) => {
    if (id) handleDeleteAlert(id);
    else
      alerts.map((alert) => {
        if (alert.isSelected) handleDeleteAlert(alert.id);
      });
  }, []);

  const handleToggleSelect = useCallback((id: string) => {
    setAlerts((prevAlerts) => {
      const newAlerts = prevAlerts.map((alert) =>
        alert.id === id ? { ...alert, isSelected: !alert.isSelected } : alert
      );
      return newAlerts;
    });
  }, []);

  const getSelectedCount = useCallback(() => {
    return alerts.filter((alert) => alert.isSelected).length;
  }, [alerts]);

  useEffect(() => {
    const allSelected = alerts.every((alert) => alert.isSelected);
    const someSelected = alerts.some((alert) => alert.isSelected);
    setIsSemiSelected(!allSelected && someSelected);
  }, [alerts]);

  return (
    <AlertContext.Provider
      value={{
        loading,
        alerts,
        unreadAlerts,
        alertTotalCount,
        isFilterOpen,
        alertFilterConfig,
        setAlerts,
        setIsFilterOpen,
        setAlertFilterConfig,
        handleBulkUpdate,
        handleDelete,
        handleSelectAll,
        handleMarkAsRead,
        handleMarkAsUnread,
        handleToggleSelect,
        getSelectedCount,
        isSemiSelected,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within a AlertContextProvider");
  }
  return context;
};
