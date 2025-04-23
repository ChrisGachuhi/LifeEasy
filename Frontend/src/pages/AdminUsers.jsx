import {
  useDeleteUserMutation,
  useFetchUsersQuery,
  useUpdateUserRoleMutation,
} from '../redux/userApi'

export const AdminUsers = () => {
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchUsersQuery()

  const [updateUserRole] = useUpdateUserRoleMutation()
  const [deleteUser] = useDeleteUserMutation()

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateUserRole({ userId, role: newRole }).unwrap()
      refetch()
    } catch (err) {
      console.error('Failed to update user role:', err.message)
      alert('Failed to update user role')
    }
  }

  const handleDeleteUser = async (userId) => {
    const confirm = window.confirm('Are you sure you want to delete this user?')
    if (!confirm) return

    try {
      await deleteUser(userId).unwrap()
      refetch()
    } catch (err) {
      console.error('Failed to delete user:', err.message)
      alert('Failed to delete user')
    }
  }

  if (isLoading) return <p>Loading Users...</p>
  if (isError) return <p>Error fetching users: {error?.data?.message}</p>

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Manage Users</h1>

      {/* List users */}

      {users.length === 0 ? (
        <p className='text-gray-600 text-center'>No users yet</p>
      ) : (
        <table className='bg-white w-full border border-collapse border-gray-300 rounded-lg'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border- p-3 text-left'>No.</th>
              <th className='border- p-3 text-left'>Username</th>
              <th className='border- p-3 text-left'>Email</th>
              <th className='border- p-3 text-left'>Role</th>
              <th className='border- p-3 text-left'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className='shadow-md'>
                <td className='p-3'> {index + 1} </td>
                <td className='p-3'>{user.username}</td>
                <td className='p-3'>{user.email}</td>
                <td className='p-3'>
                  <select
                    onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                    value={user.role}
                    className='border p-2 rounded'>
                    <option value='user'>User</option>
                    <option value='seller'>Seller</option>
                    <option value='admin'>Admin</option>
                  </select>
                </td>
                <td className='p-3'>
                  {user.role !== 'admin' && (
                    <button
                      className='bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600'
                      onClick={() => handleDeleteUser(user._id)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
