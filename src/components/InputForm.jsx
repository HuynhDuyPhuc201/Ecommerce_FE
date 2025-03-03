import React from 'react';
import { useFormContext } from 'react-hook-form';

const InputForm = ({ placeholder, name, type, error, required, ...props }) => {
    const { register } = useFormContext(); // Lấy errors từ form context
    return (
        <>
            <input
                {...register(name, { required: !required ? `Trường này là bắt buộc` : false })}
                placeholder={placeholder}
                type={type}
                style={{
                    border: 'none',
                    borderBottom: '1px solid #888',
                    borderRadius: '0px',
                    width: '100%',
                    padding: '10px',
                    outline: 'none',
                }}
                {...props}
            />
            {/* Hiển thị lỗi nếu có */}
            {error && <p style={{ color: 'red' }}>{error.message}</p>}
        </>
    );
};

export default InputForm;
