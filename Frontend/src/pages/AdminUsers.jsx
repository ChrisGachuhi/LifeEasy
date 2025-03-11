import { useState } from 'react'

export const AdminUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, username: 'JohnDoe', email: 'john@example.com', role: 'user' },
    {
      id: 2,
      username: 'JaneSmith',
      email: 'jane@example.com',
      role: 'seller',
    },
    {
      id: 3,
      username: 'AdminUser',
      email: 'admin@example.com',
      role: 'admin',
    },
  ])

  const updateRole = (id, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      )
    )
  }

  const deleteUser = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))
  }

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
              <tr key={user.id} className='shadow-md'>
                <td className='p-3'> {index + 1} </td>
                <td className='p-3'>{user.username}</td>
                <td className='p-3'>{user.email}</td>
                <td className='p-3'>
                  <select
                    onChange={(e) => updateRole(user.id, e.target.value)}
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
                      onClick={() => deleteUser(user.id)}>
                      Delete
                    </button>
                  )}
                </td>
                ß
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
