import { JSX } from "react";
import { LoginTemplateProps } from "./types";
import { BackgroundBox } from "./styles";

export default function LoginTemplate({ children }: LoginTemplateProps): JSX.Element {
    return (
        <BackgroundBox>
            <img src="/images/logo.png" alt="Logo Reserve Beach" title="Logo Reserve Beach" />
            {children}
        </BackgroundBox>
    );
};