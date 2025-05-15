type _UndefinedToNull<T> = T extends undefined ? null : T;
type UndefinedToNull<T> = T extends object
	? { [K in keyof T]-?: UndefinedToNull<T[K]> }
	: _UndefinedToNull<T>;
type UndefiendToDefiend<T extends object> = {
	[K in keyof T]-?: Exclude<T[K], undefined>;
};
type UndefiendToDefiendE<T extends object, E extends keyof T> = {
	[K in Exclude<keyof T, E>]-?: Exclude<T[K], undefined>;
} & {
	[K in E]: T[K];
};
