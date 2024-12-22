// export const Dashboard = () => {
//   return <div>Dashboard</div>;
// };
import { Loader } from "@/components/custom ui/loader";
import useUserStore from "@/store/zustand/users";
import {
  useUsers,
  useUpdateUser,
  useDeleteUser,
  useUser,
} from "@/store/zustand/users";
import { userType } from "@/utils/types/user";
import { Disc3, LoaderCircle, Shell } from "lucide-react";

export function Dashboard2() {
  const { data, isLoading, error } = useUsers();
  const users = data?.users;
  console.log(data);
  const { setSelectedUserId, selectedUserId } = useUserStore();
  const { data: selectedUser, isLoading: isUserLoading } = useUser(
    selectedUserId!,
  );
  console.log(selectedUserId);

  if (isLoading)
    return (
      <div>
        <LoaderCircle size={96} className="animate-spin" />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Loader />
      {data?.totalPages}
      {users?.map((user: userType) => (
        <div key={user._id} onClick={() => setSelectedUserId(user._id)}>
          {user.firstName + " " + user.lastName}
          <br />
          {"Email:" + user.email}
        </div>
      ))}
      {isUserLoading ? (
        <div>
          <LoaderCircle size={96} className="animate-spin" />
        </div>
      ) : (
        <h2>{selectedUser?.username}</h2>
      )}
    </div>
  );
}

function UserDetails() {
  const { selectedUserId } = useUserStore();
  const { data: user, isLoading } = useUser(selectedUserId!);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  if (!selectedUserId) return null;
  if (isLoading) return <div>Loading...</div>;

  const handleUpdate = async (updates: Partial<userType>) => {
    await updateUser.mutate({ userId: selectedUserId, updates });
  };

  const handleDelete = async () => {
    await deleteUser.mutate(selectedUserId);
  };

  return (
    <div>
      <h2>{user?.username}</h2>
      {/* Your update/delete UI here */}
    </div>
  );
}

export function Dashboard() {
  const { currentPage, itemsPerPage, selectedRole, setCurrentPage } =
    useUserStore();

  const { data, isLoading, error } = useUsers({
    page: currentPage,
    limit: itemsPerPage,
    role: selectedRole || undefined,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div>
      {/* User list rendering */}
      <div>
        {data?.users.map((user) => <div key={user._id}>{user.username}</div>)}
      </div>

      {/* Pagination controls */}
      <div>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {data?.totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === data?.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
