import React, {useEffect, useState} from 'react';

const FinalResultTable = ({data}:any) => {

    const [numberOfModels, setNumberOfModels] = useState<number>(0);
    //const [results, setResults] = useState<any>();

    let results:any = [];


    useEffect(() => {
        data?.map((e:any) => {
            if (e.data[0].model > numberOfModels) setNumberOfModels(e.data[0].model);
        })
    },[data])


    const countResults = () => {
        for (let i = 0; numberOfModels > i; i++){
            results.push({result : 0});
        }

        if (numberOfModels >= results.length) {
            data.map((e: any) => {
                results.map((model: any, index: number)=> {
                    if (index + 1 === e.data[0].model) {
                        results[index].result += +e.data[0].totalScore
                    }
                })
            })
            console.log(results)
        }



    }


    return (
        <>
            <button onClick={countResults}>Count results</button>
        </>
    )

}

export default FinalResultTable;