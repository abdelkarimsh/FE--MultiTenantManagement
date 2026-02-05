import React from 'react';
import { Form, Input, Button, message, Switch, Typography } from 'antd';
import { UserOutlined, LockOutlined, RocketOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import type { LoginRequest } from '../../types/auth';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form] = Form.useForm();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_messageApi, contextHolder] = message.useMessage();

    const mutation = useMutation({
        mutationFn: (data: LoginRequest) => authApi.login(data),
        onSuccess: (data) => {
            message.success('Login successful!');
            login(data);

           const role = data.userRole || "";
           if (role === 'SystemAdmin') {
                navigate('/sa/tenants');
            } else if (role === 'TenantAdmin') {
                navigate('/admin/dashboard');
            } else if (role === 'User') {
                navigate('/store/products');
            } else {
                navigate('/store/products');
            }
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Login failed.');
        },
    });

    const onFinish = (values: LoginRequest) => {
        mutation.mutate(values);
    };

    return (
        <>
            {contextHolder}

            {/* Full-screen background wrapper */}
            <div
                className="
        min-h-screen
        w-full
        flex
        items-center
        justify-center
        px-4
        bg-[url('/images/galaxy-bg.png')]
        bg-cover
        bg-center
      "
            >
                {/* Main Card Container */}
                <div className="
        bg-white
        rounded-3xl
        shadow-2xl
        overflow-hidden
        flex
        flex-col
        md:flex-row
        min-h-[500px]
        relative
        w-full
        max-w-[900px]
      ">
                    {/* Left Side: Form */}
                    <div className="w-full md:w-[60%] p-10 md:p-12 z-20 bg-white relative">
                        <div className="mb-10">
                            <Title
                                level={2}
                                style={{
                                    color: '#00d2d3',
                                    marginBottom: '8px',
                                    fontWeight: 700,
                                }}
                            >
                                Welcome to <br /> MultiTenant Page
                            </Title>
                        </div>

                        <Form
                            form={form}
                            name="galaxy_login"
                            onFinish={onFinish}
                            layout="vertical"
                            size="large"
                            className="galaxy-input"
                        >
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Please input your email!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined style={{ color: '#00d2d3' }} />}
                                    placeholder="Email"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined style={{ color: '#00d2d3' }} />}
                                    placeholder="Password"
                                />
                            </Form.Item>

                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        size="small"
                                        style={{ backgroundColor: '#00d2d3' }}
                                        defaultChecked
                                    />
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Remember me
                                    </Text>
                                </div>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-gray-600"
                                    style={{ fontSize: 12 }}
                                >
                                    Forgot your password?
                                </a>
                            </div>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    className="galaxy-btn"
                                    loading={mutation.isPending}
                                >
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>

                    {/* Right Side: Blue Background with content */}
                    <div className="
          hidden
          md:flex
          md:w-[40%]
          bg-gradient-to-b
          from-[#0B468C]
          to-[#001529]
          items-end
          justify-center
          pb-12
          relative
          overflow-hidden
        ">
                        {/* UFO / Rocket Icon */}
                        <div className="absolute top-10 right-10 animate-bounce duration-[3000ms]">
                            <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 shadow-[0_0_30px_rgba(0,210,211,0.6)]">
                                <RocketOutlined
                                    style={{ fontSize: 40, color: '#fff' }}
                                    rotate={45}
                                />
                            </div>
                        </div>

                        <div className="text-center z-10">
                            <Title
                                level={3}
                                style={{
                                    color: 'white',
                                    fontWeight: 800,
                                    letterSpacing: '2px',
                                }}
                            >
                                YOUR <br /> LOGO
                            </Title>
                        </div>
                    </div>

                    {/* The Wave Separator */}
                    <div
                        className="
            absolute
            top-0
            bottom-0
            left-[60%]
            w-[150px]
            pointer-events-none
            hidden
            md:block
          "
                    >
                        <svg
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            className="h-full w-full"
                            style={{ transform: 'scaleX(1.5)' }}
                        >
                            <path
                                d="M0 0 L100 0 C 30 20, 30 80, 100 100 L0 100 Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </>
    );

};

export default LoginPage;
