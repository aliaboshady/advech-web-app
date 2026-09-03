import { FormikProps } from "formik";
import TextInput, { TextInputProps } from "../Inputs/TextInput";

type Props = Omit<
	TextInputProps,
	"name" | "value" | "setValue" | "onChange" | "onBlur" | "onFocus" | "error"
> & { formik: FormikProps<any>; name: string };
const FormikTextInput = ({ formik, name, ...props }: Props) => {
	return (
		<TextInput
			{...props}
			name={name}
			value={formik.values[name]}
			onBlur={formik.handleBlur}
			onChange={formik.handleChange}
			error={
				formik.touched[name] && formik.errors[name]
					? (formik.errors[name] as string)
					: ""
			}
		/>
	);
};
export default FormikTextInput;
