"use client";
import Pagination from "@/components/extends/Pagination/Pagination";
import { useTaskFilter } from "@/contexts/FilterTaskContext";
import FilterTask from "@/components/Filter/filterTask";
import TaskToolbar from "@/sections/tasks/TaskToolbar";
import TaskItem from "@/sections/tasks/TaskItem";
import { handleError, runService } from "@/utils/service_utils";
import {
  deleteTask,
  getTasks,
  getTaskTotalCount,
  TaskModel,
  updateTask,
  UpdateTaskModel,
} from "@/services/taskService";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CreateTask from "@/sections/tasks/CreateTask";
import { toast } from "react-toastify";
import TaskOverview from "@/sections/tasks/TaskOverview";
import { getLeadById, LeadModel } from "@/services/leadService";
import { TASK_STATE } from "@/types/enums";

export default function Tasks() {
  const [create, setCreate] = useState(false);
  const [overview, setOverview] = useState(false);
  const [focus, setFocus] = useState<TaskModel>();
  const [lead, setLead] = useState<LeadModel>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { taskFilterConfig } = useTaskFilter();
  const [tasks, setTasks] = useState<TaskModel[]>([]);
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
    const offset = pageSize * (currentPage - 1);
    const limit = pageSize;
    runService(
      {
        offset: offset,
        limit: limit,
        fromUser: taskFilterConfig.fromUser,
        priority: taskFilterConfig.priority,
        search: taskFilterConfig.search,
        state: taskFilterConfig.state,
        params,
      },
      getTasks,
      (data) => {
        console.log("tasks: ", data);
        setTasks(data);
      },
      (status, error) => {
        handleError(status, error);
        console.log(status, error);
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
        console.log(data);
        toast.success("Successfully updated");
      },
      (statusCode, error) => {
        handleError(statusCode, error);
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
        lead={lead}
        handleClose={() => setOverview(false)}
      />
      <div className="card p-4 pt-7 flex-1 flex flex-col gap-2 overflow-auto shadow-lg min-w-[420px]">
        <div className="overflow-auto">
          <TaskToolbar handleCreate={handleCreate} />
        </div>

        {/* Table */}
        <div className="flex flex-1 flex-col w-full align-middle overflow-auto">
          <div className="h-full border rounded-md overflow-auto">
            {tasks.length > 0 ? (
              tasks.map((task: TaskModel) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  handleEdit={() => handleEdit(task)}
                  handleDelete={() => handleDelete(task.id)}
                  handleOverview={() => handleOverview(task)}
                  handleUpdate={(id, type: TASK_STATE) =>
                    handleUpdateTask(id, {
                      status: type,
                    })
                  }
                />
              ))
            ) : (
              <div className="h-full flex flex-1 justify-center items-center">
                <p>No tasks</p>
              </div>
            )}
          </div>
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
