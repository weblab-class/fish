import { types } from "@typegoose/typegoose";

export type ModelWithQueryHelpers<
  T extends types.AnyParamConstructor<any>,
  U = types.BeAnObject,
> = types.ReturnModelType<T, U>;
