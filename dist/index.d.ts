declare function timecalc(timezone: any, expression: any): {
    error: null;
    results: string;
} | {
    error: any;
    results: null;
};

export { timecalc as default, timecalc };
