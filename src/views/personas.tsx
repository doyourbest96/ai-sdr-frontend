// views/Personas.tsx
"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  EllipsisHorizontalCircleIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

import Pagination from "@/components/extends/Pagination/Pagination";
import ManagePersona from "@/sections/persona/manage-persona";
import { defaultPersonas } from "@/data/persona.data";

export const PersonasTable = ({ data }: { data: any }) => {
  return (
    <table className="w-full divide-y divide-gray-300 text-nowrap">
      <thead className="bg-white sticky top-0 z-10">
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
          >
            Personal Name
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Job Titles
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Industry & Keywords
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Created Date
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Location
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Employees
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Lead Count
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Edit
          </th>
        </tr>
      </thead>
      <tbody className="bg-white overflow-auto">
        {data?.map((item: any, id: any) => (
          <tr
            key={id}
            className="even:bg-blue-50 hover:bg-gray-300"
            // onClick={() => }
          >
            <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
              {item.name}
            </td>
            <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
              {item.jobTitle}
            </td>
            <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
              {item.keywords}
            </td>
            <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
              {item.createdDate}
            </td>
            <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
              {item.location}
            </td>
            <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
              {item.industrySize}
            </td>
            <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
              {item.leadCount}
            </td>
            <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
              <Popover>
                <PopoverButton className="block text-sm/6 font-semibold text-gray-900 focus:outline-none">
                  <EllipsisHorizontalCircleIcon className="w-5 h-5" />
                </PopoverButton>
                <PopoverPanel
                  transition
                  anchor="left"
                  className="divide-x rounded-xl bg-white text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:translate-x-2 translate-y-1/2 data-[closed]:opacity-0 shadow-md text-gray-900"
                >
                  <div className="p-3">
                    <ManagePersona type="edit" persona={item}>
                      <div className="rounded-md p-1 px-2 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                        <span className="hover:underline">Manage</span>
                      </div>
                    </ManagePersona>

                    <div className="rounded-md p-1 px-2 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100">
                      Delete
                    </div>
                  </div>
                </PopoverPanel>
              </Popover>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Personas = () => {
  return (
    <div className="card p-4 flex flex-col flex-1 overflow-auto">
      <div className="py-2 flex justify-between items-center">
        <form action="#" method="GET" className="relative hidden md:flex ">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
          />
          <input
            id="search-field"
            name="search"
            type="search"
            placeholder="Search..."
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
          />
        </form>
        <div className="flex flex-4 gap-4">
          <div className="btn-secondary">
            <EllipsisVerticalIcon className="w-4 h-4" />
            <span className="text-sm">Bulk Action</span>
          </div>
          <ManagePersona type="create" persona={null}>
            <div className="btn-primary">
              <PlusCircleIcon className="w-4 h-4 stroke-white" />
              <span className="text-sm text-white">Create Persona</span>
            </div>
          </ManagePersona>
        </div>
      </div>
      {/* Table */}
      <div className="flex flex-1 overflow-auto">
        <PersonasTable data={defaultPersonas} />
      </div>
      {/* Pagination */}
      <div className="flex justify-end px-16">
        <Pagination
          className="pagination-bar"
          export
          totalCount={defaultPersonas.length}
          pageSize={10}
          onPageChange={(pageSize: number, currentPage: number) =>
            console.log(pageSize, currentPage)
          }
        />
      </div>
    </div>
  );
};

export default Personas;
