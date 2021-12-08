import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase-config';
import { Redirect, withRouter } from 'react-router-dom';
import FinalResultTable from './FinalResultTable'
import { Spin, Table } from "antd";

const AdminPage = ({history}:any) => {
    const [users, setUsers] = useState<any>();
    const [loading, setLoading] = useState<boolean>();

    const usersEmail = [
        'user@gmail.com',
        'user1@gmail.com'
    ];

    useEffect(() => {
        setLoading(true);

        const getUsers = async () => {
            const arr:any = [];
            await (usersEmail.map(async(email:any) => {
                const data = await getDocs(collection(db, email));
                let singleData = (data.docs.map((doc) => ({...doc.data(), key: doc.id})));
                singleData.map((e: any) => {
                    return arr.push(e);
                })
                setUsers(arr);
            }));
            setLoading(false);
        };

        getUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const expandedRowRender = (parentTable:any) => {
        const data: any = [];

        users.map((user:any) => {
            return parentTable.judge === user.username ? data.push(user.data[0]) : null
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

    const data = [];
    for (let i = 0; usersEmail.length > i; i++) {
        data.push({
            key: usersEmail[i]+i,
            judge: usersEmail[i],
        });
    }

    const singOut = () => {
        auth.signOut()
            .then(() => <Redirect to={"/"} />
            )
        history.push('/');
        return <Redirect to={"/"} />
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h1>Admin page</h1>
            {loading ? <Spin/> :
                <Table
                    className="components-table-demo-nested"
                    style={{width: '80%'}}
                    columns={columns}
                    expandable={{expandedRowRender}}
                    dataSource={data}/>
            }
                <FinalResultTable data={users}/>
            <button onClick={singOut}>Sign out</button>
        </div>
    );
}

export default withRouter(AdminPage);