"use server";
import { hasuraFetch } from "./hasura";
import { prisma } from "./prisma";

// Return Interns
export const userlist = async (id) => {

	// const user = await prisma.user.findMany({
	// 	where: {
	// 		role: "Intern",
	// 	},
	// 	orderBy: {
	// 		createdAt: "desc",
	// 	},
	// 	select: {
	// 		id: true,
	// 		name: true,
	// 		email: true,
	// 		password: false,
	// 		role: true,
	// 		createdAt: true,
	// 	},
	// });

	// return user;

	const query = `
  query ($id: String!) {
    user(
      where: { id: { _neq: $id } }
      order_by: { createdAt: desc }
    ) {
      id
      name
      email
      role
      createdAt
      Department {
        name
      }
    }
  }
`;

  const variables = {
		id: id ? `%${id}%` : "%",
	};

	const data = await hasuraFetch(query, variables);
	// console.log("GraphQL response:", data.user);
	return data.user;
};

// Not Admin and who is Not Head Of Dept
export const getUser = async () => {
	// const user = await prisma.user.findMany({
	// 	where: {
	// 		role: {
	// 			not:"Admin"
	// 		},
	// 		isHead:false
	// 	},
	// 	orderBy: {
	// 		createdAt: "desc",
	// 	},
	// 	select: {
	// 		id: true,
	// 		name: true,
	// 		email: true,
	// 		password: false,
	// 		role: true,
	// 		createdAt: true,
	// 	},
	// });

	const query = `query GetUser {
		user(where: {isHead: {_eq: false}, role: {_nilike: "Admin"}}) {
		  college
		  departmentId
		  email
		  gender
		  id
		  name
		  password
		  role
		  createdAt
		  emailVerified
		  isHead
		}
	  }`;

	const user = await hasuraFetch(query);
	return user.user;
};

export const getSingleUser = async (InternId) => {
	const user = await prisma.user.findUnique({
		where: {
			id: InternId,
		},
		select: {
			id: true,
			name: true,
			email: true,
			password: false,
			role: true,
			createdAt: true,
			college:true,
			department:{
				select:{
					name:true
				}
			},
		},
	});
	return user;
};

// Get Departments with members
export const Department = async () => {
	// const department = await prisma.department.findMany({
	// 	include: {
	// 		head: true,
	// 		members: true,
	// 	},
	// });
	const query = `query GetDepartment {
		Department {
		  headId
		  id
		  name
		  createdAt
		  user {
			name
			role
			id
			gender
			email
			departmentId
			college
			createdAt
		  }
		}
	  }`;
	  const department = await hasuraFetch(query);
	return department.Department;
};

export const selectDepartment = async ()=>{
	const department = await prisma.department.findMany({
		select:{
			name:true,
			id:true
		}
	})

	return department;
}

export const ListOfHead = async () =>{
	const head = await prisma.user.findMany({
		where:{
			isHead : true
		},select:{
			headOf:{
				select:{
					head:true,
					name:true
				}
			}
		}
	})

	return head;
}
