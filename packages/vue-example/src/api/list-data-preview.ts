import { request } from '@/utils/request/index'
/**
 * 获取代码生成列表
 */
export function listGen(params?: ListParams<Api.GenModel>) {
  return request.get<ResponseList<Api.GenModel>>(
    {
      url: '/prod-api/tool/gen/list',
      params,
    },
  )
}

/**
 * 代码生成详情
 */
export function getGen(id: number) {
  return request.get<ResponseData<Api.GenModel>>(
    {
      url: `/prod-api/tool/gen/preview/${id}`,
    },
  )
}
