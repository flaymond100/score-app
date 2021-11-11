import React from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";

const Table = () => {
    const methods = useForm();
    const { register, handleSubmit } = methods;
    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit((data) => console.log(data))}>
                <label>Имя Судьи</label>
                <input {...register("judgeName", { required: true })} />
                <label>Номер модели</label>
                <input {...register("modelName", { required: true })} />
                {/*<Controller*/}
                {/*    name="number"*/}
                {/*    render={({ field }) => (*/}
                {/*        <input*/}
                {/*            type="number"*/}
                {/*            {...field}*/}
                {/*            onChange={(e) => {*/}
                {/*                field.onChange(parseInt(e.target.value, 10));*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    )}*/}
                {/*/>*/}
                <input type="submit" />
            </form>
        </FormProvider>
    );
}

export default Table;