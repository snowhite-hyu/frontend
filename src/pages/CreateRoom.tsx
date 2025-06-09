import { Dropdown } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateRoomRequest } from "@/models/common/Room";
import { useRoomInfoStore } from "@/stores/common/RoomInfoState";
import { useRoomSocketStore } from "@/stores/common/RoomSocketStore";
import { useSessionToken } from "@/stores/common/SessionStore";
import update from "immutability-helper";
import type React from "react";
import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateRoomPage: React.FC = () => {
	const [form, setForm] = useState<CreateRoomRequest>({
		roomName: "",
		maxPlayers: 3,
		turnTimeLimit: 15,
	});
	const { connect } = useRoomSocketStore();
	const setIsMaster = useRoomInfoStore((state) => state.setIsMaster);
	const navigate = useNavigate();
	const token = useSessionToken();

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
	};

	useEffect(() => {
		if (!token) {
			alert("로그인이 필요합니다.");
			return;
		}
		connect(token);
	}, []);

	const handleCreateRoom = (
		roomName: string,
		capacity: number,
		turnTime: number,
	) => {
		const isNameValid = roomName.trim() !== "";
		if (!isNameValid) {
			toast("방 제목을 입력해주세요.");
			return;
		}

		const roomSocket = useRoomSocketStore.getState().socket;

		if (roomSocket) {
			console.log("createRoom 진입");
			console.log(token);
			roomSocket.createRoom({ roomName, capacity, turnTime });

			roomSocket.onCreateRoom((payload) => {
				useRoomInfoStore.getState().setRoom(payload);
				navigate("/waiting");
				setIsMaster(true);
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
				<Button
					variant={"sabotuer"}
					className="w-fit h-fit"
					type="submit"
					onClick={() =>
						handleCreateRoom(form.roomName, form.maxPlayers, form.turnTimeLimit)
					}
				>
					Create
				</Button>
			</form>
		</div>
	);
};

export default CreateRoomPage;
