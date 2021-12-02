import React, { useContext, useEffect, useState } from 'react';
import { auth, db } from '../../firebase-config';
import { withRouter, Redirect } from 'react-router';
import { useForm } from 'react-hook-form';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { Button, Col, Divider, Form, InputNumber, Row } from "antd";

const UserPage = ({history}:any) => {
    const { control } = useForm();
    const {register, handleSubmit} = useForm<any>();
    const [categories, setCategories] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const {currentUser} = useContext(AuthContext);
    const [form] = Form.useForm();

    useEffect(() => {
        const getCategories = async () => {
            const data = await getDocs(collection(db, 'assign_list'));
            setCategories(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        }
        getCategories()
    }, []);


    const renderCategories = (categories: any) => {
        if(categories) {
            let arr = []
            for (let key in categories[0]) {
                if(key !== 'id') arr.push(
                    <Col span={24} style={{textAlign: 'center'}}  key={key}>
                        <Form.Item name={key} rules={[{ required: true, message: 'Пожалуйста, заполните поле' }]}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                {categories[0][key]}
                                <InputNumber size="large" min={0} max={100} />
                            </div>
                        </Form.Item>
                    </Col>
                )
            }
            return arr.map((select) => {
                return select
            })
        }
    }


    const singOut = () => {
        auth.signOut()
            .then(() => <Redirect to={"/"} />
            )
        history.push('/')
        return <Redirect to={"/"} />
    }

    const onSubmit = async (data:any) => {
        console.log(data)
        const usersRef = collection(db, currentUser.email);
        await addDoc(usersRef, data)
    };

    const onFinish = async (values: any) => {
        console.log(values);
        const usersRef = collection(db, currentUser.email);
        await addDoc(usersRef, values)
        form.resetFields();
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{textAlign:'center'}}>
            <h1>Страница оценки модели</h1>
            <Form
                name="basic"
                form={form}
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 24 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                className="ant-advanced-search-form"
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <h3>Номер модели</h3>
                <Form.Item
                    style={{textAlign: 'center'}} wrapperCol={{ offset: 0}}
                    name='model'
                >

                    <InputNumber size="large" min={1} max={100} />
                </Form.Item>
                <Divider>Оценки</Divider>
                {renderCategories(categories)}
                <Form.Item style={{textAlign: 'center'}} wrapperCol={{ offset: 0}}>
                    <Button size='large' type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
                <Button size='large' type="primary" danger onClick={() => singOut()}>Выйти из профиля</Button>
            </Form>
        </div>
    )
}

export default withRouter(UserPage);
