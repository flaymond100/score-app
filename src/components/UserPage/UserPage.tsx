import React, { useContext, useEffect, useState } from 'react';
import { auth, db } from '../../firebase-config';
import { withRouter, Redirect } from 'react-router';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { Button, Col, Divider, Form, InputNumber, Modal, Result } from "antd";

const UserPage = ({history}:any) => {
    const [categories, setCategories] = useState<any>();
    const [isModalVisible, setIsModalVisible] = useState(false);
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
        const newData = {data: [{...values}], username: ''}
        newData.username = currentUser.email;

        setIsModalVisible(true);

        const usersRef = collection(db, currentUser.email);
        await addDoc(usersRef, newData)
        form.resetFields();
    };

    return (
        <div style={{textAlign:'center'}}>
            <Modal visible={isModalVisible} footer={[]}>
                <Result
                    status="success"
                    title="Оценка прошла успешно"
                    subTitle="Хотите оценить ещё одну модель?"
                    extra={[
                        <Button onClick={() => setIsModalVisible(false)} type="primary" key="console">
                            Оценить
                        </Button>,
                        <Button onClick={() => singOut()} key="signout">Выйти</Button>
                    ]}
                />
            </Modal>
            <h1>Страница оценки модели</h1>
            <Form
                name="basic"
                form={form}
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 24 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                className="ant-advanced-search-form"
                autoComplete="off"
            >
                <h2>Номер моделі</h2>
                <Form.Item
                    rules={[{ required: true, message: 'Пожалуйста, заполните поле' }]}
                    style={{textAlign: 'center'}} wrapperCol={{ offset: 0}}
                    name='model'
                >
                    <InputNumber size="large" min={1} max={100} />
                </Form.Item>
                <Divider>Оцінювання</Divider>
                {renderCategories(categories)}
                <Form.Item style={{textAlign: 'center'}} wrapperCol={{ offset: 0}}>
                    <Button size='large' type="primary" htmlType="submit">
                        Відправити
                    </Button>
                </Form.Item>
                <Button onClick={() => singOut()} key="signout">Выйти</Button>
            </Form>
        </div>
    )
}

export default withRouter(UserPage);
