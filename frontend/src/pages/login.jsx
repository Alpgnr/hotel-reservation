import { useState } from "react";
import { login as apiLogin } from "../api/auth";

export default function Login({ onLogin }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await apiLogin(email, password);
			onLogin();
		} catch (err) {
			setError(err.message || "Giriş başarısız");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="login-page">
			<h2>Giriş Yap</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Şifre</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div>
					<button type="submit" disabled={loading}>
						{loading ? "Giriş..." : "Giriş"}
					</button>
				</div>
				{error && <p className="error">{error}</p>}
			</form>
		</div>
	);
}