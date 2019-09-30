import React from "react";

const Input = ({ name, label, error, ...rest }) => {
	return (
		<div>
			<input {...rest} name={name} id={name} className="form-control" />
		</div>
	);
};

export default Input;
