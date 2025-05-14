import { JSX } from "react";
import { LoginCardProps } from "./types";
import { FormLoginCard } from "./styles";

export default function LoginCard({ children, ...props }: LoginCardProps): JSX.Element {
  return <FormLoginCard {...props}>{children}</FormLoginCard>;
};