import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useLogin from "@/hooks/useLogin";
import type { LoginRequest } from "@/models/common/Login";
import update from "immutability-helper";
import type React from "react";
import { type FormEvent, useState } from "react";

const LoginPage: React.FC = () => {
	const [form, setForm] = useState<LoginRequest>({
		id: "",
		password: "",
	});

	const { login } = useLogin();

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		login(form);
	};

	return (
		<div className="flex flex-inline w-full h-full items-start">
			<form
				onSubmit={onSubmit}
				className="flex flex-col w-fit mt-[10%] ml-auto mr-[10%] space-y-5"
			>
				<Input
					variant="sabotuer"
					placeholder="아이디를 입력해주세요."
					type="text"
					required
					value={form.id}
					onChange={(e) =>
						setForm(update(form, { id: { $set: e.target.value } }))
					}
				/>
				<Input
					variant="sabotuer"
					placeholder="비밀번호를 입력해주세요."
					type="password"
					required
					value={form.password}
					onChange={(e) =>
						setForm(update(form, { password: { $set: e.target.value } }))
					}
				/>
				<Button variant={"sabotuer"} className="w-fit h-fit" type="submit">
					Sign-In
				</Button>
			</form>
		</div>
	);
};

export default LoginPage;
