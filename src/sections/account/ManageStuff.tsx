import { useState, useEffect } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

import InviteUser from "./InviteUser";
import DeleteUser from "./DeleteUser";
import ToggleButton from "@/components/extends/Button/ToggleButton";
import Loading from "@/components/Loading";

import {
  getUsers,
  updateOther,
  deleteUser,
  sendInviteLink,
  UserModel,
  getMe,
  UpdateUserModel,
} from "@/services/userService";
import { handleError, runService } from "@/utils/service_utils";
import { Mail, MailIcon, PhoneIcon, User2 } from "lucide-react";

const ManageStuff = () => {
  const [me, setMe] = useState<UserModel>();
  const [users, setUsers] = useState<UserModel[]>();
  const [invite, setInvite] = useState(false);
  const [curUser, setCurUser] = useState<UserModel | undefined>(undefined);
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    runService(
      undefined,
      getUsers,
      (data) => {
        console.log("users: ", data);
        setUsers(data);
        setLoading(false);
      },
      (status, error) => {
        handleError(status, error);
        setLoading(false);
      }
    );

    runService(
      undefined,
      getMe,
      (data) => {
        console.log("me: ", data);
        setMe(data);
      },
      (status, error) => {
        handleError(status, error);
      }
    );
  };

  const handleUpdate = (userData: UpdateUserModel) => {
    runService(
      userData,
      updateOther,
      (data) => {
        setUsers(
          users?.map((user) =>
            user.id !== data.id ? user : { ...user, enabled: data.enabled }
          )
        );
        toast.success("User updated successfully!");
      },
      (status, error) => {
        handleError(status, error);
      }
    );
  };

  const handleConfirmDelete = (user: UserModel) => {
    setCurUser(user);
    setDeleteUserModal(true);
  };

  const handleDelete = (userId: string) => {
    setDeleteUserModal(false);
    runService(
      userId,
      deleteUser,
      (data) => {
        if (data.success) {
          setUsers(users?.filter((user: UserModel) => user.id !== userId));
          toast.success("Successfully deleted.");
        } else {
          toast.error("Failed to delete.");
        }
      },
      (status, error) => {
        handleError(status, error);
      }
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <>
      <InviteUser
        open={invite}
        handleInvite={(email: string) => {
          runService(
            { email },
            sendInviteLink,
            (data) => {
              if (data.success === true) {
                toast.success("Successfully sent invite.");
              } else toast.error("Something goes wrong.");
            },
            (status, error) => {
              handleError(status, error);
            }
          );
          setInvite(false);
        }}
        handleClose={() => setInvite(false)}
      />
      <DeleteUser
        open={deleteUserModal}
        user={curUser}
        handleDelete={(userId) => handleDelete(userId)}
        handleClose={() => setDeleteUserModal(false)}
      />
      <div className="card flex flex-1 flex-col gap-2 bg-white overflow-auto">
        <div className="flex justify-between items-center">
          <div />
          <div className="flex gap-4">
            <button className="btn-primary" onClick={() => setInvite(true)}>
              <div className="flex gap-2 items-center">
                <PlusCircleIcon className="w-4 h-4 stroke-white" />
                <span className="text-sm text-white">Invite User</span>
              </div>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex flex-1 flex-col w-full align-middle border rounded-md overflow-auto">
          {loading ? (
            <Loading />
          ) : (
            <table className="flex-1 w-full">
              <thead className="sticky top-0 z-10 bg-gray-50 shadow-md">
                <tr className="text-nowrap">
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                  >
                    <span className="flex items-center gap-2">
                      <User2 className="w-4 h-4" />
                      User Name
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <span className="flex items-center gap-2">
                      <MailIcon className="w-4 h-4" />
                      Email
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <span className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4" />
                      AIVIO Phone
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 text-center text-sm font-semibold text-gray-900"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white overflow-auto">
                {users &&
                  users.map((user, index) => (
                    <tr
                      key={index}
                      className="h-16 even:bg-blue-50 hover:bg-gray-300"
                    >
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        <span className="flex items-center gap-2">
                          <User2 className="w-4 h-4" />
                          {user.firstName} {user.lastName}
                        </span>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        <div className="flex items-center gap-2">
                          <MailIcon className="w-4 h-4 " />
                          {user.email}
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        {user.title}
                      </td>
                      <td className="whitespace-nowraptext-sm text-gray-500">
                        {user.phone && (
                          <span className="flex items-center gap-2">
                            <PhoneIcon className="w-4 h-4" />
                            {user.phone}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="py-2 flex flex-1 justify-center items-center gap-4">
                          {me && user.id !== me.id ? (
                            <>
                              <ToggleButton
                                checked={user.enabled ? user.enabled : false}
                                handleChange={() => {
                                  handleUpdate({
                                    id: user.id,
                                    enabled: !user.enabled,
                                  });
                                }}
                              />
                              <div
                                className="p-1 rounded-md cursor-pointer hover:bg-gray-100"
                                onClick={() => handleConfirmDelete(user)}
                              >
                                <TrashIcon className="w-5 h-5 stroke-blue-900" />
                              </div>
                            </>
                          ) : (
                            <div className="p-1 rounded-md cursor-pointer flex items-center gap-2">
                              <User2 className="w-5 h-5 stroke-blue-900" />
                              Current User
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                <tr></tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageStuff;
