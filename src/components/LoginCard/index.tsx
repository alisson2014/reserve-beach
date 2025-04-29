import { JSX } from "react";
import { BoxLoginCard } from "./styles";
import { LoginCardProps } from "./types";

export default function LoginCard({ children }: LoginCardProps): JSX.Element {
  return <BoxLoginCard>{children}</BoxLoginCard>;
};