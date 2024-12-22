import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import useUserStore, {
  useDeleteUser,
  useUpdateUser,
  useUser,
} from "@/store/zustand/users";
import { userType } from "@/utils/types/user";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

// export const UserDetails2 = () => {
//   // Hooks
//   const { setBreadcrumbs } = useBreadcrumb();
//   const { pageno, id: userID } = useParams();
//   const user = userID
//     ? useSelector((state: RootState) => selectUserById(state, userID))
//     : null;
//
//   useEffect(() => {
//     setBreadcrumbs([
//       { to: `/panel/users/${pageno}`, label: "Users" },
//       { label: "Details" },
//     ]);
//   }, []);
//
//   if (!user) {
//     return <div>User not found</div>;
//   }
//   return (
//     <Card className="p-4">
//       <h2 className="flex items-center gap-2">
//         <UserRound size={20} />
//         {user.firstName} {user.lastName}
//       </h2>
//       <p className="flex items-center gap-2">
//         <Mail size={18} /> {user.email || "N/A"}
//       </p>
//       <p className="flex items-center gap-2">
//         <AtSign size={18} /> {user.username}
//       </p>
//       <p className="flex items-center gap-2">
//         <PhoneCall size={18} /> {user.phone || "N/A"}
//       </p>
//       <p className="flex items-center gap-2">
//         <Pyramid size={18} /> {user.roles.join(", ")}
//       </p>
//       <p className="flex items-center gap-2">
//         <Pyramid size={18} /> {user.dob?.toString() || "N/A"}
//         {`Type of Date: ${typeof user.dob}`}
//       </p>
//     </Card>
//   );
// };

export function UserDetails() {
  const { selectedUserId } = useUserStore();
  const { id } = useParams();
  const userId = selectedUserId || id;
  const { setBreadcrumbs } = useBreadcrumb();
  const { data: user, isLoading, error } = useUser(userId!);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  useEffect(() => {
    setBreadcrumbs([
      { to: `/panel/users/`, label: "Users" },
      { label: "Details" },
    ]);
  }, []);

  if (!userId) return <div>User selected not found</div>;

  const handleUpdate = async (updates: Partial<userType>) => {
    await updateUser.mutate({ userId: userId, updates });
  };

  const handleDelete = async () => {
    await deleteUser.mutate(userId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("Error:", error?.response?.data.error);
  if (error) return <div>Error: {error?.message}</div>;
  return (
    <div>
      User
      <h2>{user?.username}</h2>
      <button onClick={() => handleDelete()}>Delete User</button>
    </div>
  );
}
