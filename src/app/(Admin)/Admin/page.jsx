import React from 'react'
import { getAuthUser } from '../../lib/useAuth'
import { userlist } from '../../lib/useAdmin';

const Admin = async () => {
  const user = await userlist();
  const loginuser = await getAuthUser();
  console.log(user , " user List====================================================")
  console.log(user , " user List====================================================")
  return (
    <div>Admin page</div>
  )
}

export default Admin