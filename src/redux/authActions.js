import { loginSuccess, logout } from "./authSclice";

export const loadUser = () => async (dispatch) => {
	try {
		const res = await fetch("/api/me");

		if (!res.ok) {
			dispatch(logout());
			return;
		}

		const data = await res.json();

        console.log(data , " =====================================data")
		dispatch(
			loginSuccess({
				user: data.user,
				token: null,
			}),
		);
	} catch (error) {
		dispatch(logout());
	}
};
