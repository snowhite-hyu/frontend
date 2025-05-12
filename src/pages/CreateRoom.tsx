import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
                <div className="flex justify-between items-center">
                    <div className="text-3xl font-semibold text-white">인원 선택</div>
					<select 
                        className="bg-white text-black rounded-lg h-12 min-w-[111px] text-center text-2xl"
                        value={form.maxPlayers}
                        onChange={(e) =>
                            setForm(update(form, { maxPlayers: { $set: Number(e.target.value) } }))
                        }
                        required
                    >
						{[3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
					</select>
				</div>
                <div className="flex justify-between items-center">
                    <div className="text-3xl font-semibold text-white">턴 시간 제한</div>
					<select 
                        className="bg-white text-black rounded-lg h-12 min-w-[147px] text-center text-2xl"
                        value={form.turnTimeLimit}
                        onChange={(e) =>
                            setForm(update(form, { turnTimeLimit: { $set: Number(e.target.value) } }))
                        }
                        required
                    >
						{[15, 30, 45, 60].map((value) => (
                            <option key={value} value={value}>
                                {value}초
                            </option>
                        ))}
					</select>
				</div>
				<Button variant={"sabotuer"} className="w-fit h-fit" type="submit">
					Create
				</Button>
			</form>
		</div>
	);
};

export default CreateRoomPage;
