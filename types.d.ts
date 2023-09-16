export interface SideBarProps {
    authLevel: "admin" | "student" | "teacher";
}

export enum Types {
    text = "text",
    password = "password",
}

export interface InputProps {
    type: Types;
    placeholder?: string;
    value: string;
    isPassword: boolean;
    onChange: (value: string) => void;
}

export interface LessonButton {
    isDisabled: boolean;
  }