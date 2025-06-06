import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/Dropdown";
// import useLogin from "@/hooks/useLogin";
import type { CreateRoomRequest } from "@/models/common/Room";
import update from "immutability-helper";
import type React from "react";
import { type FormEvent, useState, useEffect } from "react";
import { useRoomSocketStore } from "@/stores/common/RoomSocketStore";
import { useRoomInfoStore } from "@/stores/common/RoomInfoState";
import { useNavigate } from "react-router-dom";
import { useSessionToken } from "@/stores/common/SessionStore";

const CreateRoomPage: React.FC = () => {
	const [form, setForm] = useState<CreateRoomRequest>({
		roomName: "",
		maxPlayers: 3,
		turnTimeLimit: 15,
	});
	// const { register } = useLogin();
	const { connect } = useRoomSocketStore();
	const navigate = useNavigate();
	const token = useSessionToken();

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		// register(form);
	};

	useEffect(() => {
		if (!token) {
			alert("로그인이 필요합니다.");
			return;
		}
		connect(token);
	}, []);

	const handleCreateRoom = ( capacity: number, turnTime: number ) => {
		const roomSocket = useRoomSocketStore.getState().socket;

		if (roomSocket) {
			console.log("createRoom 진입");
			console.log(token);
			roomSocket.createRoom({ capacity, turnTime });

			roomSocket.onCreateRoom((payload) => {
				useRoomInfoStore.getState().setRoom(payload);
				navigate("/waiting");
			});
		}
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
				<Button variant={"sabotuer"} className="w-fit h-fit" type="submit" onClick={() => handleCreateRoom(form.maxPlayers, form.turnTimeLimit)}>
					Create
				</Button>
			</form>
		</div>
	);
};

export default CreateRoomPage;
