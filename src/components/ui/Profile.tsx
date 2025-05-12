import type React from "react";
import { useState, useEffect } from "react";

import member1 from "@/assets/profile/member1.png";
import member2 from "@/assets/profile/member2.png";
import member3 from "@/assets/profile/member3.png";
import member4 from "@/assets/profile/member4.png";
import member5 from "@/assets/profile/member5.png";
import member6 from "@/assets/profile/member6.png";
import member7 from "@/assets/profile/member7.png";

interface ProfileProps {
    nickname: string;
}

const Profile: React.FC<ProfileProps> = ({ nickname }) => {
    const imageUrls = [member1, member2, member3, member4, member5, member6, member7];
    const [randomImage] = useState<string>(() => {
        const index = Math.floor(Math.random() * imageUrls.length);
        return imageUrls[index];
    });

    return (
        <div
        className="relative w-[200px] h-[200px] bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${randomImage})` }}
        >
            <p className="absolute bottom-0 pl-[16px] pb-[13px] text-[21px]">{nickname}</p>
        </div>
    )
};

export default Profile;