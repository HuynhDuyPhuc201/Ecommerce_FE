import { Modal, Row, Col, Typography, Image, message, Spin } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined, LeftOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import InputForm from '~/components/InputForm';
import Button from '~/components/Button';
import { setToken, setUser } from '~/core/token';
import { useAppStore } from '~/store/useAppStore';
import { useMutationHook } from '~/hooks/useMutation';
import { useMutation } from '@tanstack/react-query';
import { userService } from '~/services/user.service';

const AuthModal = () => {
    const { Title } = Typography;
    const { openModal, toggleModal } = useAppStore();

    const [showPass, setShowPass] = useState(false);
    const [showPassConFirm, setShowPassConFirm] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [loading, setLoading] = useState(false);

    // tạo useForm sử dụng cho nhiều component
    const loginForm = useForm({ mode: 'onChange' });
    const regitserForm = useForm({ mode: 'onChange' });

    const handleLogin = async (form) => {
        try {
            const data = await userService.login(form);
            toggleModal();
            setUser(data);
            setToken(data.access_token);
            message.success(data.message);
            setLoading(true);
        } catch (error) {
            setLoading(false);
            message.error(error.response.data?.message);
        }
    };

    const handleRegister = async (form) => {
        try {
            const result = await userService.register(form);
            console.log('result', result);
            if (result.success) {
                setShowSignUp(false);
                message.success(result.message);
                regitserForm.reset({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });
                setLoading(true);
            }
        } catch (error) {
            setLoading(false);
            message.error(error.response.data?.message);
        }
    };

    return (
        <>
            <Modal open={openModal} onCancel={toggleModal} footer={null} width={800}>
                <Row gutter={[12, 12]} justify="center" align="middle">
                    {!showSignUp && (
                        <Col md={14}>
                            <FormProvider {...loginForm}>
                                <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                                    <Title style={{ fontSize: '16px', marginBottom: '30px', textAlign: 'center' }}>
                                        Đăng nhập bằng Email
                                    </Title>
                                    <InputForm
                                        error={loginForm.formState.errors.email}
                                        placeholder="admin@gmail.com"
                                        name="email"
                                        type="text"
                                    />
                                    <div className="relative ">
                                        <InputForm
                                            error={loginForm.formState.errors.password}
                                            placeholder="123456789"
                                            name="password"
                                            type={showPass ? 'text' : 'password'}
                                        />
                                        <div
                                            className="absolute top-[50%] right-2 transform -translate-y-1/2 cursor-pointer w-[20px] h-[20px]"
                                            onClick={() => setShowPass(!showPass)}
                                        >
                                            {showPass ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                        </div>
                                    </div>

                                    <Button className="w-full mt-[30px]" disabled={loading}>
                                        {loading && <Spin />}Đăng nhập
                                    </Button>
                                    <Title style={{ fontSize: '12px', paddingTop: '20px' }}>
                                        Chưa tạo tài khoản?
                                        <button onClick={() => setShowSignUp(true)} className="text-[#2640d4]">
                                            Tạo tài khoản
                                        </button>
                                    </Title>
                                </form>
                            </FormProvider>
                        </Col>
                    )}
                    {showSignUp && (
                        <Col md={14}>
                            <FormProvider {...regitserForm}>
                                <form onSubmit={regitserForm.handleSubmit(handleRegister)}>
                                    <Title
                                        style={{
                                            fontSize: '16px',
                                            marginBottom: '30px',
                                            textAlign: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        <LeftOutlined
                                            onClick={() => setShowSignUp(false)}
                                            style={{ position: 'absolute', left: 0 }}
                                        />
                                        Đăng ký
                                    </Title>
                                    <Row gutter={[12, 12]}>
                                        <Col span={12}>
                                            <InputForm
                                                error={regitserForm.formState.errors.name}
                                                placeholder="Name..."
                                                name="name"
                                                type="text"
                                            />
                                            <div className="relative">
                                                <InputForm
                                                    error={regitserForm.formState.errors.password}
                                                    placeholder="Password..."
                                                    name="password"
                                                    type={showPass ? 'text' : 'password'}
                                                />

                                                <div
                                                    className="absolute top-[50%] right-2 transform -translate-y-1/2 cursor-pointer w-[20px] h-[20px]"
                                                    onClick={() => setShowPass(!showPass)}
                                                >
                                                    {showPass ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <InputForm
                                                error={regitserForm.formState.errors.email}
                                                placeholder="Email..."
                                                name="email"
                                                type="text"
                                            />
                                            <div className="relative">
                                                <InputForm
                                                    error={regitserForm.formState.errors.confirmPassword}
                                                    placeholder="confirmPassword..."
                                                    name="confirmPassword"
                                                    type={showPassConFirm ? 'text' : 'password'}
                                                />
                                                <div
                                                    className="absolute top-[50%] right-2 transform -translate-y-1/2 cursor-pointer w-[20px] h-[20px]"
                                                    onClick={() => setShowPassConFirm(!showPassConFirm)}
                                                >
                                                    {showPassConFirm ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Button className="w-full mt-[30px]" type="submit">
                                        Đăng ký
                                    </Button>
                                    <Title style={{ fontSize: '12px', paddingTop: '20px' }}>
                                        Đã có tài khoản?{' '}
                                        <button onClick={() => setShowSignUp(false)} className="text-[#2640d4]">
                                            Đăng nhập
                                        </button>
                                    </Title>
                                </form>
                            </FormProvider>
                        </Col>
                    )}

                    <Col md={10}>
                        <Image src="https://salt.tikicdn.com/ts/upload/df/48/21/b4d225f471fe06887284e1341751b36e.png" />
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default AuthModal;
