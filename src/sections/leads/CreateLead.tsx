import { CreateModelProps } from "@/types";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React, { Fragment, useState } from "react";

export default function CreateLead({
  open,
  handleSave,
  handleClose,
}: CreateModelProps) {
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative" onClose={handleClose}>
          <div className="fixed inset-0 bg-black/65 z-40" />
          <div className="fixed inset-0 py-10 overflow-y-auto z-40">
            <div className="flex min-h-full items-center justify-center text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="max-w-2xl w-full flex flex-col transform overflow-hidden rounded-md bg-white text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="px-6 py-3 text-lg font-semibold leading-6 bg-white text-gray-900"
                  >
                    Create New Lead
                  </DialogTitle>

                  <div className="px-6 py-3 flex flex-col gap-2 text-sm bg-gray-50">
                    <div className="flex gap-4">
                      <div className="w-full flex flex-col">
                        <label htmlFor="firstName">First Name</label>
                        <input
                          id="firstName"
                          type="text"
                          className="input-primary"
                        />
                      </div>
                      <div className="w-full flex flex-col">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                          id="lastName"
                          type="text"
                          className="input-primary"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        className="input-primary"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="jobTitle">Job Title</label>
                      <input
                        id="jobTitle"
                        type="text"
                        className="input-primary"
                      />
                    </div>

                    <div className="flex gap-4">
                      <div className="w-full flex flex-col">
                        <label htmlFor="account">Account</label>
                        <input
                          id="account"
                          type="text"
                          className="input-primary"
                        />
                      </div>
                      <div className="w-full flex flex-col">
                        <label htmlFor="companyName">Company Name</label>
                        <input
                          id="companyName"
                          type="text"
                          className="input-primary"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="contactStage">Contact Stage</label>
                      <input
                        id="contactStage"
                        type="text"
                        className="input-primary"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-4">
                      <button
                        className="px-2 py-1 rounded-md text-white bg-blue-600 hover:bg-blue-500"
                        onClick={handleSave}
                      >
                        Save Contact
                      </button>
                      <button
                        className="px-2 py-1 rounded-md bg-gray-300 hover:bg-gray-200"
                        onClick={handleClose}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}