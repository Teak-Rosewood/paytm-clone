import React, { FC } from "react";

interface InputBoxProps {
    title: String;
    placeholder: string;
    onChange: () => void;
}

const InputBox: FC<InputBoxProps> = ({ title, placeholder, onChange }) => {
    return (
        <>
            <div className="text-sm font-medium text-left py-2">{title}</div>
            <input onChange={onChange} placeholder={placeholder} className="w-full px-2 py-1 border rounded border-slate-200" />
            <div> Testing</div>
        </>
    );
};

export default InputBox;
