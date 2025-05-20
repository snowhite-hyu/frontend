import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useLogin from "@/hooks/useLogin";
import type { RegisterRequest } from "@/models/common/Login";
import update from "immutability-helper";
import type React from "react";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const RegisterPage: React.FC = () => {
	const [form, setForm] = useState<RegisterRequest>({
		email: "",
		password: "",
		username: "",
	});
	const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
	useEffect(() => {
		setIsEmailValid(false);
	}, [form.email]);

	const [checkPassword, setCheckPassword] =
		useState<RegisterRequest["password"]>("");
	const { register, checkEmail } = useLogin();

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();

		const passwordChecked = form.password === checkPassword;
		if (isEmailValid && passwordChecked) {
			register(form);
		} else {
			if (isEmailValid === false) {
				toast(`${form.email} - 이메일을 중복을 체크해주세요`);
			}
			if (passwordChecked === false) {
				toast("입력한 비밀번호와 똑같이 입력해주세요.");
			}
		}
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
						placeholder="이메일을 입력해주세요."
						type="email"
						required
						value={form.email}
						onChange={(e) =>
							setForm(update(form, { email: { $set: e.target.value } }))
						}
					/>
					<Button
						variant={"saboteurCheck"}
						size={"fill"}
						type="button"
						onClick={async () => {
							setIsEmailValid(await checkEmail({ email: form.email }));
						}}
					>
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
