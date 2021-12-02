import {Form, Input, Button} from "antd";
import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { app } from "../firebase-config";

const Home = ({ history }: any) => {
    const { currentUser, currentRole } = useContext(AuthContext);

    const handleLogin = useCallback(
        async values => {
            try {
                await app
                    .auth()
                    .signInWithEmailAndPassword(values.email, values.password);

                history.push('/')
            } catch (error) {
                alert(error);
            }
        },
        [history]
    );

    if (currentUser) {
        if (currentRole == 'admin') {
            return <Redirect to={"/adminPage"} />;
        } else {
            return <Redirect to={"/userPage"} />;
        }
    }

    return (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <h1>Авторизація</h1>
            <br/>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{width: '80%'}}
                initialValues={{ remember: true }}
                onFinish={handleLogin}
                autoComplete="off"
            >
                <Form.Item
                    label="Введіть email"
                    name="email"
                    rules={[{ required: true, message: 'Будь ласка, введіть Ваш email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[{ required: true, message: 'Будь ласка, введіть Ваш пароль!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default withRouter(Home);
