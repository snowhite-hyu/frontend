import AuthCard from "@/components/ui/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LoginRequest } from "@/models/common/Login";
import { useSessionActions } from "@/stores/common/SessionStore";
import update from "immutability-helper";
import type React from "react";
import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
	const [form, setForm] = useState<LoginRequest>({
		id: "",
		password: "",
	});
	const sessionActions = useSessionActions();

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		sessionActions.login(form);
	};

	return <div className="flex justify-end items-start w-full h-full">
		<AuthCard title="Login">
			<form onSubmit={onSubmit} className="space-y-4">
				<Input
					placeholder="ID"
					type="text"
					required
					value={form.id}
					onChange={(e) =>
						setForm(update(form, { id: { $set: e.target.value } }))
					}
				/>
				<Input
					placeholder="Password"
					type="password"
					required
					value={form.password}
					onChange={(e) =>
						setForm(update(form, { password: { $set: e.target.value } }))
					}
				/>
				<Button className="w-full" type="submit">
					Login
				</Button>
			</form>
			<div className="text-center text-sm mt-4">
				Don&apos;t have an account?{" "}
				<Link to="/register" className="text-blue-600 underline">
					Register
				</Link>
			</div>
		</AuthCard>
	</div>;
};

export default LoginPage;
