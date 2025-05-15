import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/Dropdown";
// import useLogin from "@/hooks/useLogin";
import type { CreateRoomRequest } from "@/models/common/Room";
import update from "immutability-helper";
import type React from "react";
import { type FormEvent, useState } from "react";

const CreateRoomPage: React.FC = () => {
	const [form, setForm] = useState<CreateRoomRequest>({
		roomName: "",
		maxPlayers: 3,
		turnTimeLimit: 15,
	});
	// const { register } = useLogin();

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		// register(form);
	};

	return (
		<div className="flex flex-inline w-full h-full items-start">
			<form
				onSubmit={onSubmit}
				className="flex flex-col w-fit mt-[10%] ml-auto mr-[10%] space-y-5"
			>
				<div className="text-4xl font-semibold text-white">방 생성하기</div>
				<Input
					variant="sabotuer"
					placeholder="방 제목을 입력해주세요."
					type="text"
					required
					value={form.roomName}
					onChange={(e) =>
						setForm(update(form, { roomName: { $set: e.target.value } }))
					}
				/>
				<Dropdown
					label="인원 선택"
					value={form.maxPlayers}
					options={[3, 4, 5, 6, 7, 8, 9, 10]}
					onChange={(value) =>
						setForm(update(form, { maxPlayers: { $set: value } }))
					}
					className="min-w-[111px]"
				/>
				<Dropdown
					label="턴 시간 제한"
					value={form.turnTimeLimit}
					options={[15, 30, 45, 60]}
					onChange={(value) =>
						setForm(update(form, { turnTimeLimit: { $set: value } }))
					}
					className="min-w-[147px]"
					optionSuffix="초"
				/>
				<Button variant={"sabotuer"} className="w-fit h-fit" type="submit">
					Create
				</Button>
			</form>
		</div>
	);
};

export default CreateRoomPage;
