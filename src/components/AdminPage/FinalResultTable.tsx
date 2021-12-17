import React, { useEffect, useState } from 'react';
import {Button, Table} from "antd";

const FinalResultTable = ({data}:any) => {

    const [numberOfModels, setNumberOfModels] = useState<number>(0);
    const [result, setResult] = useState<any>();
    let results:any = [];

    useEffect(() => {
        let models = 0;
        data?.map((e:any) => {
            if (e.data[0].model > models) models = e.data[0].model
        })

        setNumberOfModels(models);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data])

    const countResults = () => {
        for (let i = 0; numberOfModels > i; i++){
            results.push({result : 0, model : i+1, key: i+1,});
        }

        if (numberOfModels >= results.length) {
            data.map((e: any) => {
                const currentNomination = e.nominations;
                    return results.map((model: any, index: number)=> {
                        if (index + 1 === e.data[0].model) {
                            results[index].result += +e.data[0].totalScore || ''
                            results[index].nomination = currentNomination
                        }
                    })
            })
            setResult(results!);
        }
    }

    const columns = [
        {
            title: 'Moдель',
            dataIndex: 'model',
            key: 'model',
        },
        {
            title: 'Номiнацiя',
            dataIndex: 'nomination',
            key: 'nomination',
            filters: [
                {
                    text: 'Губи',
                    value: 'lips',
                },
                {
                    text: 'Брови',
                    value: 'eyebrow',
                },
                {
                    text: 'Губи(майстер до 2-х рокiв)',
                    value: 'young_lips',
                },
                {
                    text: 'Брови(майстер до 2-х рокiв)',
                    value: 'young_eyebrow',
                }],
            onFilter: (value:any, record:any) => record.nomination && record.nomination.indexOf(value) === 0,
        },
        {
            title: 'Бал',
            dataIndex: 'result',
            key: 'result',
            sorter: (a:any, b:any) => a.result - b.result
        },
    ];

    return (
        <>
            <h2>Фiнальнi результати</h2>
            <Table style={{width: '30%', marginBottom:'30px'}} dataSource={result && result!} columns={columns} />
            <Button type="primary" shape="round" size={'large'} style={{marginBottom:'40px'}} onClick={countResults}>Count results</Button>
        </>
    )
}

export default FinalResultTable;