export const parseZodErrors = (state: any) => {
    const errObj = state.error.format();
    return Object.keys(errObj).reduce(
        (acc, key) => {
            acc[key] = errObj[key]._errors?.join(', ');
            return acc;
        },
        {} as { [k: string]: string },
    );
};
