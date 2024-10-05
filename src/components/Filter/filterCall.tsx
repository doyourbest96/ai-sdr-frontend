import {
  ListBulletIcon,
  MagnifyingGlassIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import FilterItem from "./filter-item";
import { useCallFilter } from "@/contexts/FilterCallContext";
import Select from "react-tailwindcss-select";
import { fromUserOptions, priorityOptions } from "@/data/filter.data";
import { runService } from "@/utils/service_utils";
import { getUsers, UserModel } from "@/services/userService";
import { useEffect, useState } from "react";

export default function FilterCall() {
  const { callFilterConfig, setCallFilterConfig } = useCallFilter();
  const [fromUserOption, setFromUserOption] = useState(fromUserOptions);
  const [priorityOption, setPriorityOption] = useState(priorityOptions);

  const fetchUsers = () => {
    runService(
      undefined,
      getUsers,
      (users) => {
        const usersOption = users.map((user: UserModel) => ({
          value: user.id,
          label: user.firstName + " " + user.lastName,
        }));
        setFromUserOption(usersOption);
      },
      (status, error) => {
        console.error(error);
      }
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="card px-2 w-64 h-full flex flex-col rounded-xl bg-white">
      <h3 className="p-2 border-b border-gray-100">Filters</h3>
      <div className="flex-1 flex flex-col gap-2 p-2 overflow-auto">
        <form action="#" method="GET" className="flex px-3 pt-2 items-center">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none h-5 w-5 text-gray-400"
          />
          <input
            id="search-field"
            name="search"
            type="search"
            placeholder="Search Calls..."
            value={callFilterConfig.search}
            onChange={(e) => {
              setCallFilterConfig((prev) => ({
                ...prev,
                search: e.target.value,
              }));
            }}
            className="flex w-full border-0 pl-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
          />
        </form>
        <div>
          <FilterItem
            icon={<ListBulletIcon className="w-4 h-4" />}
            title="From User"
          >
            <Select
              value={callFilterConfig.fromUser}
              onChange={(value) =>
                setCallFilterConfig({
                  ...callFilterConfig,
                  fromUser: value,
                })
              }
              options={fromUserOption}
              isMultiple={true}
              isSearchable={true}
              primaryColor={"indigo"}
              classNames={{
                menuButton: (value) => {
                  const isDisabled = value?.isDisabled;
                  return `flex text-xs text-gray-500 border border-gray-300 rounded shadow-sm transition-all duration-300 focus:outline-none ${
                    isDisabled
                      ? "bg-gray-200"
                      : "bg-white hover:border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                  }`;
                },
                menu: "absolute z-10 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-xs text-gray-700",
                listItem: (value) => {
                  const isSelected = value?.isSelected;
                  return `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                    isSelected
                      ? `text-white bg-blue-500`
                      : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                  }`;
                },

                searchBox:
                  "text-xs w-full py-2 pl-8 text-sm text-gray-500 bg-gray-100 border border-gray-200 rounded focus:border-gray-200 focus:ring-0 focus:outline-none",
                searchIcon:
                  "absolute w-4 h-4 mt-2.5 pb-0.5 ml-1.5 text-gray-500",
              }}
            ></Select>
          </FilterItem>
          <FilterItem
            icon={<ListBulletIcon className="w-4 h-4" />}
            title="Priority"
          >
            <Select
              value={callFilterConfig.priority}
              onChange={(value) =>
                setCallFilterConfig({
                  ...callFilterConfig,
                  priority: value,
                })
              }
              options={priorityOption}
              isMultiple={true}
              isSearchable={true}
              primaryColor={"indigo"}
              classNames={{
                menuButton: (value) => {
                  const isDisabled = value?.isDisabled;
                  return `flex text-xs text-gray-500 border border-gray-300 rounded shadow-sm transition-all duration-300 focus:outline-none ${
                    isDisabled
                      ? "bg-gray-200"
                      : "bg-white hover:border-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                  }`;
                },
                menu: "absolute z-10 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-xs text-gray-700",
                listItem: (value) => {
                  const isSelected = value?.isSelected;
                  return `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                    isSelected
                      ? `text-white bg-blue-500`
                      : `text-gray-500 hover:bg-blue-100 hover:text-blue-500`
                  }`;
                },

                searchBox:
                  "text-xs w-full py-2 pl-8 text-sm text-gray-500 bg-gray-100 border border-gray-200 rounded focus:border-gray-200 focus:ring-0 focus:outline-none",
                searchIcon:
                  "absolute w-4 h-4 mt-2.5 pb-0.5 ml-1.5 text-gray-500",
              }}
            ></Select>
          </FilterItem>
        </div>
      </div>
    </div>
  );
}