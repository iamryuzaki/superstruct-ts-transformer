export declare type Uuid = string & {
    readonly __brand: unique symbol;
};
export declare const isUuid: (value: unknown) => value is Uuid;
export declare const obj: Uuid;
//# sourceMappingURL=debug-source.d.ts.map