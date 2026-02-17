export async function login(email, password) {
	const res = await fetch("http://localhost:4000/auth/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({ message: res.statusText }));
		throw new Error(err.message || "Giriş başarısız");
	}

	const data = await res.json();
	if (data.token) {
		localStorage.setItem("token", data.token);
	}
	return data;
}

export function logout() {
	localStorage.removeItem("token");
}

export function getToken() {
	return localStorage.getItem("token");
}