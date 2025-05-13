import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RegisterRequest } from "@/models/common/Login";
import { useSessionActions } from "@/stores/common/SessionStore";
import update from "immutability-helper";
import type React from "react";
import { type FormEvent, useState } from "react";

const RegisterPage: React.FC = () => {
	const [form, setForm] = useState<RegisterRequest>({
		id: "",
		password: "",
		username: "",
		email: "",
		phone: "",
	});
	const [checkPassword, setCheckPassword] =
		useState<RegisterRequest["password"]>("");
	const sessionActions = useSessionActions();

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		sessionActions.login(form);
	};

	return (
		<div className="flex flex-inline w-full h-full items-start">
			<form
				onSubmit={onSubmit}
				className="flex flex-col w-fit mt-[10%] ml-auto mr-[10%] space-y-5"
			>
				<div className="flex space-x-2">
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
					<Button variant={"saboteurCheck"} size={"fill"} type="button">
						확인
					</Button>
				</div>
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
				<Input
					variant="sabotuer"
					placeholder="비밀번호를 한번 더 입력해주세요."
					type="password"
					required
					value={checkPassword}
					onChange={(e) => setCheckPassword(e.target.value)}
				/>
				<Button variant={"sabotuer"} className="w-fit h-fit" type="submit">
					Join-Us
				</Button>
			</form>
		</div>
	);
};

export default RegisterPage;
