export declare type Uuid = string & {
    readonly __brand: unique symbol;
};
export declare const isUuid: (value: unknown) => value is Uuid;
//# sourceMappingURL=debug-source2.d.ts.map