import React from 'react'

import { userlist } from '../../lib/useAdmin';

const Admin = async () => {
  const user = await userlist();
  console.log(user)

  console.log(user , " user List====================================================")

  return (
    <div>Admin page</div>
  )
}

export default Admin