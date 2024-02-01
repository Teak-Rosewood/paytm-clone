import React, { FC } from "react";

const Heading: FC<{ label: String }> = ({ label }) => {
    return <div className="font-bold text-4xl pt-6">{label}</div>;
};

export default Heading;
