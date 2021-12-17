import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase-config';
import { Redirect, withRouter } from 'react-router-dom';
import FinalResultTable from './FinalResultTable'
import {Button, Spin, Table } from "antd";

const AdminPage = ({history}:any) => {
    const [users, setUsers] = useState<any>();
    const [loading, setLoading] = useState<boolean>();
    const [usersEmail, setUsersEmail] = useState<any>([]);

    useEffect(() => {
        setLoading(true);

        const fetchUsers = async () => {
            const arr:any = [];
            const data = await getDocs(collection(db, 'usersCollection'));
            let singleData = (data.docs.map((doc) => ({...doc.data()})));
            singleData.map((e: any) => {
                return arr.push(e.email);
            })
            setUsersEmail(arr);
            return arr;
        }

        fetchUsers()
            .then(async (usersFetchedEmails) => {
                const arr:any = [];
                await (usersFetchedEmails.map(async(email:any) => {
                    const data = await getDocs(collection(db, email));
                    let singleData = (data.docs.map((doc) => ({...doc.data(), key: doc.id})));
                    singleData.map((e: any) => {
                        return arr.push(e);
                    })
                    setUsers(arr);
                }));
                setLoading(false);
            })

    }, []);

    const expandedRowRender = (parentTable:any) => {
        const data: any = [];

        users.map((user:any) => {
            if (parentTable.judge === user.username && parentTable.nomination === user.data[0].nomination) {
                data.push(user.data[0])
            }
        });

        const columns = [
            {
                title: 'Модель',
                dataIndex: 'model',
                key: 'model',
                sorter: (a:any, b:any) => a.model - b.model
            },
            {
                title: 'Чистота робочого місця',
                dataIndex: 'clearness',
                key: 'clearness',
            },
            {
                title: 'Колiр',
                dataIndex: 'color',
                key: 'color',
            },
            {
                title: 'Форма',
                dataIndex: 'forms',
                key: 'forms',
            },
            {
                title: 'Техніка',
                key: 'technique',
                dataIndex: 'technique'

            },
            {
                title: 'Технічність виконання продцедури',
                key: 'technique_procedure',
                dataIndex: 'technique_procedure'
            },
            {
                title: 'Бал',
                key: 'totalScore',
                dataIndex: 'totalScore',
                sorter: (a:any, b:any) => a.totalScore - b.totalScore
            },
        ];
        return <Table columns={columns} dataSource={data} pagination={false} />;
    };

    const columns = [
        {
            title: 'Суддя',
            dataIndex: 'judge',
            key: 'judge',
        }
    ];

    const dataEyebron = [];
    const dataLips = [];
    const dataYoungEyebron = [];
    const dataYoungLips = [];

    for (let i = 0; usersEmail.length > i; i++) {
        dataEyebron.push({
            key: usersEmail[i]+i,
            judge: usersEmail[i],
            nomination: 'eyebrow',
        });

        dataLips.push({
            key: usersEmail[i]+i,
            judge: usersEmail[i],
            nomination: 'lips',
        });

        dataYoungEyebron.push({
            key: usersEmail[i]+i,
            judge: usersEmail[i],
            nomination: 'young_eyebrow',
        });

        dataYoungLips.push({
            key: usersEmail[i]+i,
            judge: usersEmail[i],
            nomination: 'young_lips',
        });

    }


    const singOut = () => {
        auth.signOut()
            .then(() => <Redirect to={"/"} />)
        history.push('/');
        return <Redirect to={"/"} />
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom:'100px'}}>
            <h1>Admin page</h1>
            {loading ? <Spin/> :
                <>
                    <h1>Губи</h1>
                    <Table
                        className="components-table-demo-nested"
                        style={{width: '80%'}}
                        columns={columns}
                        expandable={{expandedRowRender}}
                        dataSource={dataLips}/>
                    <h1>Брови</h1>
                    <Table
                        className="components-table-demo-nested"
                        style={{width: '80%'}}
                        columns={columns}
                        expandable={{expandedRowRender}}
                        dataSource={dataEyebron}/>
                    <h1>Губи(майстер до 2-х рокiв)</h1>
                    <Table
                        className="components-table-demo-nested"
                        style={{width: '80%'}}
                        columns={columns}
                        expandable={{expandedRowRender}}
                        dataSource={dataYoungLips}/>
                    <h1>Брови(майстер до 2-х рокiв)</h1>
                    <Table
                        className="components-table-demo-nested"
                        style={{width: '80%'}}
                        columns={columns}
                        expandable={{expandedRowRender}}
                        dataSource={dataYoungEyebron}/>

                </>

            }
                <FinalResultTable data={users}/>
            <Button onClick={singOut}>Sign out</Button>
        </div>
    );
}

export default withRouter(AdminPage);