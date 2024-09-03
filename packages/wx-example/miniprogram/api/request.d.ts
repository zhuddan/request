/**
 * @description 列表数据 ruoyi 返回的是 rows 和 total 如果是其他格式请自定义
 *              注意！ rows 已经 是个 T[] 类型！
 */
declare interface ResponseList<T> {
  total: number
  rows: T[]
}

/**
 * @description 数据类型 包含在 data 里面
 */
declare interface ResponseData<T> {
  data: T
}

/**
 * @description 基础分页参数 pageNum pageSize
 */
declare interface ListParamsBase {
  pageNum: number
  pageSize: number
  orderByColumn?: string
  isAsc?: string
}
/**
 * @description 基础分页参数查询
 */
declare type ListParamsWrapper<T extends object = object> = Partial<ListParamsBase & T>

declare type ListParams<T extends object = object> = ListParamsWrapper<T>
