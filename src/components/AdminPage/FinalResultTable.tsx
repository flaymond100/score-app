import React, { useEffect, useState } from 'react';
import { Table } from "antd";

const FinalResultTable = ({data}:any) => {

    const [numberOfModels, setNumberOfModels] = useState<number>(0);
    const [result, setResult] = useState<any>();
    let results:any = [];

    useEffect(() => {
        data?.map((e:any) => {
            if (e.data[0].model > numberOfModels) setNumberOfModels(e.data[0].model);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data])

    const countResults = () => {
        for (let i = 0; numberOfModels > i; i++){
            results.push({result : 0, model : i+1, key: i+1});
        }

        if (numberOfModels >= results.length) {
            data.map((e: any) => {
                return results.map((model: any, index: number)=> {
                    return index + 1 === e.data[0].model ? results[index].result += +e.data[0].totalScore || '' : null
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
            title: 'Бал',
            dataIndex: 'result',
            key: 'result',
            sorter: (a:any, b:any) => a.result - b.result
        },
    ];

    return (
        <>
            <h2>Фiнальнi результати</h2>
            <Table style={{width: '30%', marginBottom:'30px'}} dataSource={result && result} columns={columns} />
            <button style={{marginBottom:'40px'}} onClick={countResults}>Count results</button>
        </>
    )

}

export default FinalResultTable;