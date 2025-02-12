"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import TaskItem from "@/sections/tasks/TaskItem";
import CreateTask from "@/sections/tasks/CreateTask";
import TaskToolbar from "@/sections/tasks/TaskToolbar";
import FilterTask from "@/components/Filter/filterTask";
import TaskOverview from "@/sections/tasks/TaskOverview";
import Pagination from "@/components/extends/Pagination/Pagination";
import SortableHeader from "@/components/ui/SortableHeader";
import Loading from "@/components/Loading";

import {
  deleteTask,
  getTasks,
  getTaskTotalCount,
  TaskModel,
  updateTask,
  UpdateTaskModel,
} from "@/services/taskService";
import { handleError, runService } from "@/utils/service_utils";
import { getLeadById, LeadModel } from "@/services/leadService";
import { useTaskFilter } from "@/contexts/FilterTaskContext";
import { TASK_STATE } from "@/types/enums";

export default function Tasks() {
  const [create, setCreate] = useState(false);
  const [overview, setOverview] = useState(false);
  const [focus, setFocus] = useState<TaskModel>();
  const [lead, setLead] = useState<LeadModel>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { taskFilterConfig, setTaskFilterConfig } = useTaskFilter();
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [loading, setLoading] = useState(false);
  const currentParams = Object.fromEntries(useSearchParams());

  useEffect(() => {
    if (focus && focus.leadId !== "none")
      runService(
        { id: focus.leadId },
        getLeadById,
        (data) => {
          setLead(data);
        },
        (status, error) => {
          handleError(status, error);
          console.log(status, error);
        }
      );
    else setLead(undefined);
  }, [focus]);

  const fetchTasks = (params: { [key: string]: string }) => {
    setLoading(true);
    const offset = pageSize * (currentPage - 1);
    const limit = pageSize;
    runService(
      {
        offset: offset,
        limit: limit,
        fromUser: taskFilterConfig.fromUser,
        priority: taskFilterConfig.priority,
        fromDate: taskFilterConfig.fromDate?.toISOString().slice(0, -5),
        toDate: taskFilterConfig.toDate?.toISOString().slice(0, -5),
        orderBy: taskFilterConfig.orderBy,
        isAscending: taskFilterConfig.isAscending,
        search: taskFilterConfig.search,
        state: taskFilterConfig.state,
        params,
      },
      getTasks,
      (data) => {
        console.log("tasks: ", data);
        setTasks(data);
        setLoading(false);
      },
      (status, error) => {
        handleError(status, error);
        console.log(status, error);
        setLoading(false);
      }
    );
  };

  const fetchTaskTotalCount = (params: { [key: string]: string }) => {
    runService(
      {
        fromUser: taskFilterConfig.fromUser,
        priority: taskFilterConfig.priority,
        search: taskFilterConfig.search,
        state: taskFilterConfig.state,
        params,
      },
      getTaskTotalCount,
      (data) => {
        console.log("Task total", data);
        setTotalCount(data?.count ? data?.count : 0);
      },
      (status, error) => {
        handleError(status, error);
        console.log(status, error);
      }
    );
  };

  useEffect(() => {
    fetchTaskTotalCount(currentParams);
    fetchTasks(currentParams);
  }, []);

  useEffect(() => {
    fetchTaskTotalCount(currentParams);
    fetchTasks(currentParams);
  }, [taskFilterConfig, currentPage, pageSize]);

  const handleCreate = () => {
    setFocus(undefined);
    setCreate(true);
  };

  const handleEdit = (task: TaskModel) => {
    setFocus(task);
    setCreate(true);
  };

  const handleChangeSort = (label: string) => {
    if (taskFilterConfig.orderBy === label)
      setTaskFilterConfig((config) => {
        return {
          ...config,
          isAscending: !config.isAscending,
        };
      });
    else
      setTaskFilterConfig((config) => {
        return {
          ...config,
          orderBy: label,
          isAscending: true,
        };
      });
  };

  const handleDelete = (taskId: string) => {
    runService(
      taskId,
      deleteTask,
      (data) => {
        if (data.success === true) {
          toast.success("Task delteted successfully");
          fetchTaskTotalCount(currentParams);
          fetchTasks(currentParams);
        } else toast.error("Something went wrong");
      },
      (status, error) => {
        handleError(status, error);
        console.log(status, error);
      }
    );
  };

  const handleUpdateTask = (id: string, data: UpdateTaskModel) => {
    runService(
      { taskId: id, updateData: data },
      updateTask,
      (data) => {
        // console.log("Updated task", data);
        // setTasks(tasks.map((task) => (task.id === id ? data : task)));
        fetchTaskTotalCount(currentParams);
        fetchTasks(currentParams);
        toast.success("Successfully updated");
      },
      (statusCode, error) => {
        handleError(statusCode, error);
        toast.error("Something went wrong");
      }
    );
  };

  const handleOverview = (task: TaskModel) => {
    setFocus(task);
    setOverview(true);
  };

  return (
    <div className="relative flex gap-4 p-4 flex-1 bg-gray-100 rounded-lg overflow-hidden">
      {taskFilterConfig.isOpen && <FilterTask />}
      <CreateTask
        open={create}
        task={focus}
        handleSave={() => {}}
        handleClose={() => setCreate(false)}
      />
      <TaskOverview
        show={overview}
        task={focus}
        handleClose={() => setOverview(false)}
        lead={lead}
        handleUpdate={(id, type: string, value: TASK_STATE | string) =>
          handleUpdateTask(id, {
            [type]: value,
          })
        }
      />
      <div className="card p-4 pt-7 flex-1 flex flex-col gap-2 overflow-auto shadow-lg min-w-[420px]">
        <div className="overflow-auto">
          <TaskToolbar handleCreate={handleCreate} />
        </div>

        {/* Table */}
        <div className="flex flex-1 flex-col w-full align-middle border rounded-md overflow-auto">
          {loading ? (
            <Loading />
          ) : (
            <table className="flex-1 w-full">
              <thead className="sticky top-0 z-10 bg-gray-50 shadow-md">
                <tr>
                  <th></th>
                  <th>
                    <SortableHeader
                      label="type"
                      value="taskType"
                      orderBy={taskFilterConfig.orderBy}
                      isAscending={taskFilterConfig.isAscending}
                      handleChangeSort={handleChangeSort}
                    />
                  </th>
                  <th>
                    <SortableHeader
                      label="title"
                      value="title"
                      orderBy={taskFilterConfig.orderBy}
                      isAscending={taskFilterConfig.isAscending}
                      handleChangeSort={handleChangeSort}
                    />
                  </th>
                  <th>
                    <SortableHeader
                      label="associated at"
                      value="leadId"
                      orderBy={taskFilterConfig.orderBy}
                      isAscending={taskFilterConfig.isAscending}
                      handleChangeSort={handleChangeSort}
                    />
                  </th>
                  <th>
                    <SortableHeader
                      label="priority"
                      value="taskPriority"
                      orderBy={taskFilterConfig.orderBy}
                      isAscending={taskFilterConfig.isAscending}
                      handleChangeSort={handleChangeSort}
                    />
                  </th>
                  <th>
                    <SortableHeader
                      label="Due Date"
                      value="endDate"
                      orderBy={taskFilterConfig.orderBy}
                      isAscending={taskFilterConfig.isAscending}
                      handleChangeSort={handleChangeSort}
                    />
                  </th>
                  <th>
                    <SortableHeader
                      label="owner"
                      value="ownerId"
                      orderBy={taskFilterConfig.orderBy}
                      isAscending={taskFilterConfig.isAscending}
                      handleChangeSort={handleChangeSort}
                    />
                  </th>
                  <th className="py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task: TaskModel) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    handleEdit={() => handleEdit(task)}
                    handleDelete={() => handleDelete(task.id)}
                    handleOverview={() => handleOverview(task)}
                    handleUpdate={(
                      id: string,
                      type: string,
                      value: TASK_STATE | string
                    ) =>
                      handleUpdateTask(id, {
                        [type]: value,
                      })
                    }
                  />
                ))}
                <tr></tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-end">
          <Pagination
            className="pagination-bar"
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={(pageSize: number, currentPage: number) => {
              setPageSize(pageSize);
              setCurrentPage(currentPage);
            }}
          />
        </div>
      </div>
    </div>
  );
}
