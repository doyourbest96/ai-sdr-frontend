import { api } from "@/utils/api";
import {
  ApiSuccessResponse,
  CadenceStatistics,
  CountModel,
  FetchProps,
} from "@/types";
import { SHARE_TYPE } from "@/types/enums";
import { UserModel } from "./userService";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  isSelected?: boolean;
}

interface FetchCompaniesProps extends FetchProps {
  isActive?: boolean;
  starred?: boolean;
  ownedBy?: Option | Option[] | null;
  campaignId?: string;
  orderBy?: string;
  isAscending?: boolean;
  search?: string;
}

export interface CadenceModel extends BaseCadenceModel {
  id: string;
}

export interface BaseCadenceModel {
  name: string;

  activeCount?: number;
  pausedCount?: number;
  notSentCount?: number;
  bouncedCount?: number;
  finishedCount?: number;

  scheduledCount?: number;
  deliveredCount?: number;
  openedCount?: number;
  clickedCount?: number;
  replyCount?: number;
  interestedCount?: number;
  optOutCount?: number;

  star?: boolean;
  isActive?: boolean;
  stepsCount?: number;
  shareType?: SHARE_TYPE;
  ownerId: string;

  clonedFromId?: string;
}

export interface UpdateCadenceModel {
  name?: string;

  activeCount?: number;
  pausedCount?: number;
  notSentCount?: number;
  bouncedCount?: number;
  finishedCount?: number;

  scheduledCount?: number;
  deliveredCount?: number;
  openedCount?: number;
  clickedCount?: number;
  replyCount?: number;
  interestedCount?: number;
  optOutCount?: number;

  star?: boolean;
  isActive?: boolean;
  stepsCount?: number;
  shareType?: SHARE_TYPE;
  ownerId?: string;

  clonedFromId?: string;
}

export interface FetchCadenceModel extends CadenceModel, ExtraCadenceModel {}

interface ExtraCadenceModel {
  owner?: UserModel;
  statistics?: CadenceStatistics;
}

export interface ApiCadencesResponse {
  data: FetchCadenceModel[];
}

interface ApiCadenceResponse {
  data: FetchCadenceModel;
}

export interface ApiCountResponse {
  data: CountModel;
}

export const getCadenceById = async (
  id: string
): Promise<ApiCadenceResponse> => {
  const url = `/api/cadences/${id}`;
  const response = await api.get(url);
  // console.log("----------------->", response);
  return response;
};

export const getCadences = async (
  data: FetchCompaniesProps = { offset: 0, limit: 100 }
): Promise<ApiCadenceResponse> => {
  let url = `/api/cadences?offset=${data.offset}&limit=${data.limit}`;
  if (data.isActive) {
    url += "&isActive=true";
  }
  if (data.starred) {
    url += "&starred=true";
  }
  let userIds: string[] = [];
  if (Array.isArray(data.ownedBy)) {
    userIds = data.ownedBy.map((option) => option.value);
  } else if (data.ownedBy) {
    userIds = [data.ownedBy.value];
  } else {
    userIds = [];
  }
  for (const userId of userIds) {
    url += `&userIds=${userId}`;
  }
  if (data.orderBy) {
    url += `&orderBy=${data.orderBy}`;
  }
  if (data.isAscending !== undefined) {
    url += `&isAscending=${data.isAscending}`;
  }
  console.log("here", data.campaignId);
  if (data.campaignId) {
    url += `&campaignId=${data.campaignId}`;
  }
  if (data.search) {
    url += `&search=${data.search}`;
  }
  console.log(url, " url ");
  const response = await api.get(url);
  console.log(response, url);
  return {
    data: response.data?.map((item: any) => ({
      id: item?.id,
      name: item?.name,
      activeCount: item?.activeCount,
      pausedCount: item?.pausedCount,
      notSentCount: item?.notSentCount,
      bouncedCount: item?.bouncedCount,
      finishedCount: item?.finishedCount,
      scheduledCount: item?.scheduledCount,
      deliveredCount: item?.deliveredCount,
      replyCount: item?.replyCount,
      interestedCount: item?.interestedCount,
      optOutCount: item?.optOutCount,
      star: item?.star,
      isActive: item?.isActive,
      stepsCount: item?.stepsCount,
      shareType: item?.shareType,
      ownerId: item?.ownerId,
      clonedFromId: item?.clonedFromId,
      statistics: {
        active: item?.statistics?.active,
        paused: item?.statistics?.paused,
        bounced: item?.statistics?.bounced,
        finished: item?.statistics?.finished,
        removed: item?.statistics?.removed,
      },
      owner: {
        id: item?.owner?.id,
        firstName: item?.owner?.firstName,
        lastName: item?.owner?.lastName,
        email: item?.owner?.email,
      },
    })),
  };
};

export const getCadencesTotalCount = async (): Promise<ApiCountResponse> => {
  const response = await api.get("api/cadences/total-count");
  return {
    data: {
      count: response.data?.count,
    },
  };
};

export const addCadence = async (cadence: BaseCadenceModel) => {
  const response = await api.post("api/cadences", cadence);

  if (response.status !== 200) {
    throw new Error("Failed to create cadence");
  }

  return {
    data: {
      id: response.data?.id,
    },
  };
};

export const updateCadence = async ({
  cadenceId,
  updatedCadence,
}: {
  cadenceId: string;
  updatedCadence: BaseCadenceModel;
}): Promise<ApiCadenceResponse> => {
  const url = `api/cadences/${cadenceId}`;
  const response = await api.put(url, updatedCadence);

  return {
    data: {
      id: response.data?.id,
      name: response.data?.name,
      activeCount: response.data?.activeCount,
      pausedCount: response.data?.pausedCount,
      notSentCount: response.data?.notSentCount,
      bouncedCount: response.data?.bouncedCount,
      finishedCount: response.data?.finishedCount,
      scheduledCount: response.data?.scheduledCount,
      deliveredCount: response.data?.deliveredCount,
      replyCount: response.data?.replyCount,
      interestedCount: response.data?.interestedCount,
      optOutCount: response.data?.optOutCount,
      star: response.data?.star,
      isActive: response.data?.isActive,
      stepsCount: response.data?.stepsCount,
      shareType: response.data?.shareType,
      ownerId: response.data?.ownerId,
      clonedFromId: response.data?.clonedFromId,
      owner: {
        id: response.data?.owner?.id,
        firstName: response.data?.owner?.firstName,
        lastName: response.data?.owner?.lastName,
        email: response.data?.owner?.email,
      },
    },
  };
};

export const deleteCadence = async ({
  cadenceId,
}: {
  cadenceId: string;
}): Promise<ApiSuccessResponse> => {
  const url = `api/cadences/${cadenceId}`;
  const response = await api.delete(url);

  return response;
};
