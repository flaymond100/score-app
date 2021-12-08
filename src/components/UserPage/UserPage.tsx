import React, { useContext, useEffect, useState } from 'react';
import { auth, db } from '../../firebase-config';
import { withRouter, Redirect } from 'react-router';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { Button, Col, Divider, Form, InputNumber, Modal, Result } from "antd";
import uniqid from 'uniqid';

const UserPage = ({history}:any) => {
    const [categories, setCategories] = useState<any>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const {currentUser} = useContext(AuthContext);
    const [form] = Form.useForm();
    const keyId = uniqid();

    useEffect(() => {
        let isMounted = false;
        const getCategories = async () => {
            const data = await getDocs(collection(db, 'assign_list'));
            if(!isMounted) setCategories(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        };

        getCategories();

        return () => {
            isMounted = true
            };
    }, []);

    const renderCategories = (categories: any) => {
        if(categories) {
            let arr = []
            for (let key in categories[0]) {
                if(key !== 'id') arr.push(
                    <Col span={24} style={{textAlign: 'center'}}  key={key}>
                        <Form.Item name={key} rules={[{ required: true, message: 'Будь ласка, запвоніть поле'}, () => ({
                            validator(_, value) {
                                if (!value) {
                                    return Promise.reject();
                                }
                                if (isNaN(value)) {
                                    return Promise.reject("Введіть корректну оцінку");
                                }
                                if (value <= 0) {
                                    return Promise.reject("Мінімальний бал 1");
                                }
                                if (value > 100) {
                                    return Promise.reject("Максимальний бал 100");
                                }
                                return Promise.resolve();
                            },})]}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                {categories[0][key]}
                                <InputNumber />
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

    const onFinish = async (values: any) => {
        let sum = 0;
        values.totalScore = 0;

        for (let key in values) {
            if (key !== 'model') sum += +values[key];
        }
        values.totalScore = sum;

        const newData = {data: [{...values, key: keyId }], username: ''}
        newData.username = currentUser.email;
        setIsModalVisible(true);

        const usersRef = collection(db, currentUser.email);
        await addDoc(usersRef, newData)
        form.resetFields();
    };

    const username = currentUser.email.split("@")[0];

    return (
        <div style={{textAlign:'center'}}>
            <Modal visible={isModalVisible} footer={[]}>
                <Result
                    status="success"
                    title="Оцiнка пройшла успiшно"
                    subTitle="Оцiнити ще одну модель?"
                    extra={[
                        <Button onClick={() => setIsModalVisible(false)} type="primary" key="console">
                            Оцiнити
                        </Button>,
                        <Button onClick={() => singOut()} key="signout">Вийти</Button>
                    ]}
                />
            </Modal>
            <h1>Оцiнювання моделi</h1>
            <h2 style={{color: 'crimson'}}>Суддя: <strong>{username}</strong></h2>
            <Form
                name="basic"
                form={form}
                labelCol={{span: 12}}
                wrapperCol={{span: 24}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                className="ant-advanced-search-form"
                autoComplete="off"
            >
                <div style={{textAlign: 'center', margin:'40px 0'}}>
                    <h2>Номер моделі</h2>
                    <Form.Item
                        rules={[{required: true, message: 'Будь ласка, заповнiть поле'}]}
                        style={{textAlign: 'center'}} wrapperCol={{ offset: 0 }}
                        name='model'
                    >
                        <InputNumber size="large" min={1} max={100} />
                    </Form.Item>
                </div>

                <Divider>Оцінювання</Divider>
                {renderCategories(categories)}
                <Form.Item style={{textAlign: 'center', margin: '40px 0'}} wrapperCol={{offset: 0}}>
                    <Button size='large' type="primary" htmlType="submit">
                        Відправити
                    </Button>
                </Form.Item>
                <div style={{paddingBottom: '40px'}} >
                    <Button onClick={() => singOut()} key="signout">Вийти</Button>
                </div>

            </Form>
        </div>
    )
}

export default withRouter(UserPage);
