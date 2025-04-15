import type React from "react";
import type { ReactNode } from "react";

interface LoginPageProps {
	children: ReactNode;
}

const LoginPage: React.FC<LoginPageProps> = ({ children }) => {
	return <div>{children}</div>;
};

export default LoginPage;
