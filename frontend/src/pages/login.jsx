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
			<div className="login-container">
				<div className="login-card">
					<h1 className="login-title">Otel</h1>
					<h2 className="login-subtitle">Giriş Yap</h2>
					<form onSubmit={handleSubmit} className="login-form">
						<div className="form-group">
							<label htmlFor="email" className="form-label">Email</label>
							<input
								id="email"
								type="email"
								className="form-input"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="email@example.com"
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="password" className="form-label">Şifre</label>
							<input
								id="password"
								type="password"
								className="form-input"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Şifrenizi girin"
								required
							/>
						</div>
						<button type="submit" className="login-button" disabled={loading}>
							{loading ? "Giriş yapılıyor..." : "Giriş Yap"}
						</button>
						{error && <div className="error-message">{error}</div>}
					</form>
				</div>
			</div>
		</div>
	);
}