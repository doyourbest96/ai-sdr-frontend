import { LeadModelWithCompanyModel } from "@/services/leadService";
import { classNames } from "@/utils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import LeadView from "@/sections/leads/LeadView";
import { TaskModel } from "@/services/taskService";
import TaskView from "./TaskView";

const TaskOverview = ({
  show,
  task,
  lead,
  handleClose,
}: {
  show: boolean;
  task?: TaskModel;
  lead?: LeadModelWithCompanyModel;
  handleClose: () => void;
}) => {
  return (
    <>
      <div
        className={classNames(
          "absolute top-0 bottom-0 z-20 max-w-6xl flex flex-1 flex-col border-l bg-white overflow-scroll transition-all duration-500",
          show ? "right-0" : "-right-full"
        )}
      >
        <div className="px-5 py-2 flex items-center gap-2">
          <div
            className="p-1 flex justify-center items-center rounded-md hover:bg-gray-200"
            onClick={handleClose}
          >
            <XMarkIcon className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-1 flex-row gap-2">
          <TaskView task={task} />
          {lead && <LeadView lead={lead} />}
        </div>
      </div>
    </>
  );
};

export default TaskOverview;
